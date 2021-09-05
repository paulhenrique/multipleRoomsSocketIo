const Message = require("../models/Message");

const getMessages = async function (key, content) {
  return Message.findAll({
    where: {
      [key]: content
    }
  });
}


const createMessage = async function (newMessage) {
  return Message.create(newMessage);
}

module.exports = {
  createMessage,
  getMessages
}