const { RABBIT_MQ_PORT, submissionDir } = require("./constants");
const amqp = require("amqplib/callback_api");
const Docker = require("dockerode");
const fs = require("fs");
const { SUBMISSION, QUESTIONS } = require("../database/data");
const path = require('path');

const docker = new Docker();

const sendMessageToQueue = (queue, message) => {
  amqp.connect(RABBIT_MQ_PORT, function (error0, connection) {
    if (error0) {
      throw error0;
    }

    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      channel.assertQueue(queue, {
        durable: false,
      });
      channel.sendToQueue(queue, Buffer.from(message));
      console.log("📥 Sent %s", message);
    });

    setTimeout(function () {
      connection.close();
    }, 500);
  });
};

const receiveMessageFromQueue = (queue, callback) => {
  amqp.connect(RABBIT_MQ_PORT, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      channel.assertQueue(queue, {
        durable: false,
      });
      console.log("⌛️ Waiting for messages in %s.", queue);

      channel.consume(queue, callback, {
        noAck: true,
      });
    });
  });
};

const handleSubmissionFromQueue = async (msg) => {
  console.log("📩 Received %s", msg.content.toString());
  const submission = JSON.parse(msg.content.toString());
  const timeout = 10000;

  await executeCode(submission);
};

const executeCode = async (submission) => {
  fs.mkdirSync(submissionDir, { recursive: true });
  const filePath = path.join(submissionDir, `code-${submission.id}.cpp`);
  const outputFile = path.join(submissionDir, `output-${submission.id}.txt`);
  fs.createWriteStream(outputFile).end();
  const writeStream = fs.createWriteStream(filePath);

  writeStream.write(submission.code);
  writeStream.end();

  writeStream.on("finish", () => {
    console.log("File created and content added successfully!");
  });

  writeStream.on("error", (err) => {
    console.error(err);
  });

  const containerConfig = {
    image: "my-app:v1.0",
    HostConfig: {
      Binds: [`${filePath}:/app/code.cpp`, `${outputFile}:/app/output.txt`],
      AutoRemove: true,
    },
  };

  const container = await docker.createContainer(containerConfig);
  console.log("🐳 Container created successfully!");

  await container.start();
  console.log("🐳 Container started successfully!");

  const executionTimeout = 2000;

  const waitPromise = container.wait();
  let timeoutId;
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      console.log(`🕑 Execution timed out for container ${container.id} `);
      reject("Execution timed out");
    }, executionTimeout);
  });

  await Promise.race([waitPromise, timeoutPromise])
    .then(() => {
      console.log("🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳");
      clearTimeout(timeoutId);

      const jsonString = fs.readFileSync(outputFile, "utf8");
      console.log("📤 Output file read successfully!");

      const result = JSON.parse(jsonString);
      checkCodeResult(result, submission);
    })
    .catch((err) => {
      console.log("Time Limit Exceeded", err);

      container.stop((err, data) => console.log("🐳 Container stopped!"));

      checkCodeResult(
        { success: false, errorType: "Time Limit Exceeded", output: "TLE" },
        submission
      );
    });

  fileCleanup(filePath);
  fileCleanup(outputFile);
};

const checkCodeResult = (result, submission) => {
  if (result.success) {
    if (checkResult(result.output, submission.problemId)) {
      SUBMISSION[submission.id].status = "Accepted";
    } else {
      SUBMISSION[submission.id].status = "Wrong Answer";
    }
  } else {
    SUBMISSION[submission.id].status = result.errorType;
  }
  SUBMISSION[submission.id].output = result.output;
};

const checkResult = (output, problemId) => {
  const expectedOutput = QUESTIONS[problemId - 1].testCases[0].output.trim();
  console.log(output.trim(), expectedOutput.trim());
  return expectedOutput === output.trim();
};

const fileCleanup = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("File deleted successfully!");
  });
};
module.exports = {
  sendMessageToQueue,
  receiveMessageFromQueue,
  handleSubmissionFromQueue,
};
