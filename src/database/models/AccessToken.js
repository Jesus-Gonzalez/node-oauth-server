const Sequelize = require('sequelize')
const sequelize = require('../init')

const AccessToken = sequelize.define('accessToken', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  accessToken: {
    type: Sequelize.STRING
  },
  refreshToken: {
    type: Sequelize.STRING
  },
  clientId: {
    type: Sequelize.STRING
  },
  userId: {
    type: Sequelize.STRING
  },
  expirationTimestamp: {
    type: Sequelize.DATE
  },
  expiresIn: {
    type: Sequelize.BIGINT
  }
})

AccessToken.sync({ force: true })

AccessToken.addHook('beforeCreate',
  entity => {
    entity.expiresIn = 1 * 60 * 60 * 1000
    entity.expirationTimestamp = Date.UTC() + entity.expiresIn
  })

module.exports = AccessToken
