const passport = require('passport')
const { BasicStrategy } = require('passport-http')
const { Strategy: BearerStrategy } = require('passport-http-bearer')
const { models: { AccessToken, Client } } = require('database')

passport.use(new BasicStrategy(
  async (username, password, done) => {
    const client = await Client
      .findOne({ clientId: username, clientSecret: password })
      .catch(err => done(err))

    if (!client) return done('client')

    return done(null, client)
  }))

passport.use(new BearerStrategy(
  async (accessToken, done) => {
    const token = await AccessToken
      .findOne({ where: { accessToken } })
      .catch(err => done(err))

    if (!token) {
      return done(null, false)
    }

    return done(null, token)
  }))
