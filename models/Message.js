
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.db'
});

const Message = sequelize.define('Message', {
  message: {
    type: DataTypes.STRING
  },
  author: {
    type: DataTypes.STRING
  },
  room: {
    type: DataTypes.STRING
  }
});

Message.sync();

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
testConnection();


module.exports = Message;