import express from "express";
import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const stats = {
    added: 0,
    modified: 0,
    deleted: 0
};

const active = {} as { [key: string]: { address: string, houseNumber: string, squareMeters: number }};

const watch = new k8s.Watch(kc);
watch.watch(
    "/apis/rug.nl/v1/houses/",
    { },
    (action, obj) => {
        console.log("action: ", action);
        switch(action) {
            case "ADDED":
                stats.added++;
                active[obj.metadata.name] = obj.spec;
                console.log("obj added", obj.metadata.name, obj.spec);
            break;

            case "MODIFIED":
                stats.modified++;
                active[obj.metadata.name] = obj.spec;
                console.log("obj modified", obj.metadata.name, obj.spec);
            break;

            case "DELETED":
                stats.deleted;
                delete active[obj.metadata.name];
                console.log("obj deleted", obj.metadata.name, obj.spec);
            break;
        }
    },
    (err) => {
        console.log("error!", err);
    }
);



const app = express();
const port = 3000;

// Generate some interesting data by summing multiple sinewaves of different frequencies and amplitudes
const persistence = 0.8;
const periods = [ 1, 3, 7, 11, 23 ];
const amplitudes = periods.map((_, i) => persistence ** i);
const total = amplitudes.reduce((acc, value) => acc += value, 0);

const getValue = (n: number) => {
    let result = 0;
    for(let i = 0; i < periods.length; i++) {
        result += Math.sin(n * periods[i]) * amplitudes[i];
    }

    // Normalize result to [0..1]
    return (result / total) / 2 + 0.5;
};

app.get("/", (request, response) => {    
    response.send("Metrics are available on /metrics");
});

app.get("/metrics", (request, response) => {
    const now = new Date;
    const seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const days = seconds / 3600 / 24;

    const metrics = [
        "rug_random " + getValue(days),
        "rug_houses_added_count " + stats.added,
        "rug_houses_modified_count " + stats.modified,
        "rug_houses_deleted_count " + stats.deleted,
    ]
    
    response.send(metrics.join("\n"));
});

app.get("/houses", (request, response) => {
    const houses = Object.keys(active);
    
    response.send(houses.join("\n"));
});

app.listen(port, () => {
    console.log("listening on port ", port);
});