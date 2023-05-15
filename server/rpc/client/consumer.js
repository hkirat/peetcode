const EventEmitter = require("events");

module.exports = class Consumer {
  constructor(channel, replyQueueName, eventEmitter) {
    this.channel = channel;
    this.replyQueueName = replyQueueName;
    this.eventEmitter = eventEmitter;
  }

  async consumeMessages() {
    this.channel.consume(
      this.replyQueueName,
      (message) => {
        console.log("The response is: ", message.content.toString());
        this.eventEmitter.emit(message.properties.correlationId.toString(), message);
      },
      {
        noAck: true,
      }
    );
  }
};
