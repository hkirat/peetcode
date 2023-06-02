const { RABBIT_MQ_PORT } = require("./constants");
const amqp = require("amqplib/callback_api");
const Docker = require("dockerode");
const fs = require("fs");
const tar = require("tar-stream");

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

const handleSubmissionFromQueue = (msg) => {
  console.log("📩 Received %s", msg.content.toString());
  const submission = JSON.parse(msg.content.toString());
  const timeout = 10000;

  executeCode(submission)
};

const executeCode = async (submission) => {
  const file = fs.createWriteStream(`./submissions/${submission.id}.cpp`);
};

module.exports = {
  sendMessageToQueue,
  receiveMessageFromQueue,
  handleSubmissionFromQueue,
};
