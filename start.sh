#!/bin/bash

cd infra
kubectl apply -f client/
kubectl apply -f rabbitmq/
kubectl apply -f sandbox/
kubectl apply -f server/
