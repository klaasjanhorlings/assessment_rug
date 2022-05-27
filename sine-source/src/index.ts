import express from "express";
import * as fs from "fs/promises";

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
    return result / total;
};

app.get("/", (request, response) => {    
    response.send("Metrics are available on /metrics");
});

app.get("/metrics", (request, response) => {
    const now = new Date;
    const seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const days = seconds / 3600 / 24;
    
    response.send("rug_random " + days.toString());
});

app.listen(port, () => {
    console.log("listening on port ", port);
});

