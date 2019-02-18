const Sequelize = require('sequelize')
const sequelize = require('../init')

const User = sequelize.define('user', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
})

User.sync({ force: true })
  .then(() =>
    User.create({
      id: 'c899ba99-484f-4ce1-ab20-272bd45bc2c7',
      name: 'Jesús',
      email: 'jgonzalez.jaen@atsistemas.com',
      password: '93fa3e4624676f2e9aa143911118b4547087e9b6e0b6076f2e1027d7a2da2b0a'
    }))

module.exports = User
