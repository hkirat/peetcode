module.exports = class Consumer {
  constructor(channel, replyQueueName) {
    this.channel = channel;
    this.replyQueueName = replyQueueName;
  }

  async consumeMessages() {
    this.channel.consume(
      this.replyQueueName,
      (message) => {
        console.log("The response is: ", message);
      },
      {
        noAck: true,
      }
    );
  }
};
