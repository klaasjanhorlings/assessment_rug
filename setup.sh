docker build . -t rug_node:local
docker save rug_node:local > rug_node.tar

microk8s ctr image import rug_node.tar
microk8s kubectl apply -f deployment.yaml 
microk8s kubectl apply -f service.yaml 
microk8s kubectl apply -f serviceMonitor.yaml 
microk8s kubectl apply -f createCustomResource.yaml 
microk8s kubectl apply -f customResource.yaml 



#microk8s ctr images rm docker.io/library/rug_node:local