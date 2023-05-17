# PeetCode Evaluator

This is a simple backend project which evaluates PeetCode submissions

### Disclaimer

- This is a very simple and crude implementation
- Compiles and rules only C++ programs for now
- Assumes that the solutions are simple integers
- Right now the problem numbers and their corresponding solutions are hardcoded

## Features

A simple backend system which gets new submissions, pushes it to a RabbitMQ queue.
A receiver reads it off the queue, starts (or creates) a container, and executes the code inside the sandbox environment.
The result of the evaluation is the passed back to the caller, which updates the frontend.

The whole backend has been containerised for better scaling, and uses K8s to manage the deployments. A docker in docker (DinD) is used, so that the code can be evaluated on a safe and secure container, which is deleted after usage.

## DevOps part
- Created a Dockerfile for the server which installs all the necessary components, and volumes as well for Docker in Docker to work
- Created a Dockerfile for the sandbox environment
- Created a Kubernetes file for the server, sandbox and RabbitMQ (which is used by the server)
- Created ClusterIPs for all the above three, so that the server can access those as and when required
- The architecture is scalable, since any number of problems can be solved, as the deployments will increases, and also beecause the sandbox containers are lightweight, and are created on demand.

## Tech stack used

- RabbitMQ
- NodeJS
- Docker
- Kubernetes
- Docker in Docker (DinD)

## Installation

- To run the program, it is expected that RabbitMQ is set up and running on port `5672`.
- Docker must be installed and running on the system
- A Kubernetes cluster must also be running on your machine (Minikube or Docker Desktop's Kubernetes)
- We can just use the startup script `startup.sh` provided to bring up all the necessary components
- Ensure that the file is executable, and execute it by running `./startup.sh`
- Since we are using NodePorts, we can access the client and the server from our local machine
- Visit `localhost:30002` or `<minikube-ip>:30002` depending on how you are running your Kubernetes cluster.

## Explanation
- All the required services (the backend server, RabbitMQ, and the Sandbox environments) are present as deployments, and have ClusterIP services to access them within cluster
- The client service has a pod and a NodePort to access it from the outside
- The service service too has a NodePort so that client can send requests to it from outside the cluster (eg. the browser)
- The sandbox environment and RabbitMQ pods are inaccessible from the outside
- The client (`localhost:30002`) sends requests to the server throught the NodePort on `localhost:30001`.

## Architecture of the backend
![archi](https://github.com/Adithya2907/peetcode/assets/56926966/0d875d15-2788-403a-9c29-246d2d31aade)


## Demo
https://github.com/Adithya2907/peetcode/assets/56926966/155b18a4-d272-4ea1-b77f-f55ae4222b7d



