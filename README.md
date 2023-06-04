# Peetcode

This monorepo contains both the client and server components of the Code Runner project. The client folder uses Vite React.js for the frontend, while the server folder uses Node.js for the backend. This project allows you to run C++ code in a containerized manner.

## Demo


https://github.com/jassi-singh/peetcode/assets/54185836/9fd4ea9d-5426-4ca9-b2cc-ab6f34a7760d



## Prerequisites

Before running this project, please ensure that you have the following dependencies installed:

- Node.js (v14 or higher)
- Docker
- RabbitMQ server

## Getting Started

Follow the steps below to start the project locally:

1. Pull the `jassi16/code-runner` image from Docker Hub:
- 
  ```
  docker pull jassi16/code-runner
  ```


2. Start the RabbitMQ server. Make sure it is running and accessible.

3. Start the server:
- Navigate to the `server` directory:
  ```
  cd server
  ```
- Install the server dependencies:
  ```
  npm install
  ```
- Start the server:
  ```
  npm start
  ```
  or
  ```
  nodemon start
  ```

4. Run the client:
- Navigate to the `client` directory:
  ```
  cd client
  ```
- Install the client dependencies:
  ```
  npm install
  ```
- Start the client:
  ```
  npm run dev
  ```

The client will be accessible at `http://localhost:3000`.

## Usage

Once the project is up and running, you can use the Code Runner to execute C++ code in a containerized environment. Follow the instructions provided by the client to submit and execute your C++ code.

## Contributing

Contributions to this project are welcome. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Submit a pull request describing your changes.

Please ensure that your code follows the project's coding conventions and includes appropriate tests.
