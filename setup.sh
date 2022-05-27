# build image and import it using a local tarball
docker build ./sine-source -t rug_node:local
docker save rug_node:local > rug_node.tar
microk8s ctr image import rug_node.tar

# configure k8s pod with our application and related servicemonitor
microk8s kubectl apply -f application.yaml 
microk8s kubectl apply -f service.yaml 
microk8s kubectl apply -f serviceMonitor.yaml 


#microk8s ctr images rm docker.io/library/rug_node:local