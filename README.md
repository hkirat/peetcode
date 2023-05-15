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

## Tech stack used

- RabbitMQ
- NodeJS
- Docker

## Installation

- To run the program, it is expected that RabbitMQ is set up and running on port `5672`.
- Docker must be installed and running on the system
- Build the image by running `cd server && docker build . -t <IMAGENAME>`. Make sure you update the image name in the constants file
- Install the dependencies using `npm install`
- Run `npm run dev`, which starts up the client, the server and the RabbitMQ receiver.

## Architecture of the backend
![architecture](https://github.com/Adithya2907/peetcode-poller/assets/56926966/2745e437-b8e0-4e77-bf6f-be621b507840)


## Demo
https://github.com/Adithya2907/peetcode/assets/56926966/155b18a4-d272-4ea1-b77f-f55ae4222b7d



