const Sequelize = require('sequelize')
const sequelize = require('../init')

const AuthorizationCode = sequelize.define('authorizationCode', {
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

AuthorizationCode.sync({ force: true })
  .then(() => {
    AuthorizationCode.create({
      clientId: 'chat-app.default',
      userId: 'c899ba99-484f-4ce1-ab20-272bd45bc2c7',
      isTrusted: true
    })
  })

module.exports = AuthorizationCode
