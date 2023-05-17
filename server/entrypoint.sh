#!/bin/sh
set -e

docker run -d --rm --name my-rabbitmq-container -p 5672:5672 -p 15672:15672 rabbitmq:3.11-management
# Wait until the RabbitMQ container is up and running
until docker inspect --format='{{.State.Status}}' my-rabbitmq-container | grep -q 'running'; do
    echo "Waiting for rabbitMQ to start"
    sleep 1
done

echo "RabbitMQ up and running"
docker ps
npm start

wait