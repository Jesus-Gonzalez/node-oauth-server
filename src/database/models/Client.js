const Sequelize = require('sequelize')
const sequelize = require('../init')

const Client = sequelize.define('client', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  clientId: {
    type: Sequelize.STRING
  },
  clientSecret: {
    type: Sequelize.STRING
  },
  isTrusted: {
    type: Sequelize.BOOLEAN
  }
})

Client.sync({ force: true })
  .then(() => {
    Client.create({
      name: 'default',
      clientId: 'chat-app.default',
      clientSecret: 'chat-app-default',
      isTrusted: true
    })

    Client.create({
      name: 'default',
      clientId: 'chat-app.front.vue',
      clientSecret: 'chat-app-front',
      isTrusted: true
    })
  })

module.exports = Client
