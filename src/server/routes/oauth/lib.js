const oauth2orize = require('oauth2orize')
const passport = require('passport')
const uuid = require('uuid/v4')
const {
  models: {
    AccessToken,
    Client,
    User
  }
} = require('database')

const createAccessToken = async (userId, clientId, done) => {
  const [accessToken, refreshToken] = [0, 0].map(() => uuid())
  await AccessToken.create({
    accessToken,
    refreshToken,
    userId,
    clientId
  }).catch(err => done(err))

  return done(null, accessToken, refreshToken, { expires: 3600 })
}

const server = oauth2orize.createServer()

server.serializeClient(
  (client, done) => {
    done(null, client.id)
  })

server.deserializeClient(async (id, done) => {
  const client = await Client.findById(id)
    .catch(err => done(err))

  return done(null, client)
})

server.grant(oauth2orize.grant.token(
  async (client, user, ares, done) => {
    const token = uuid()
    await AccessToken.create({
      token,
      userId: user.id,
      clientId: client.clientId
    }).catch(error => done(error))

    return done(null, token)
  }))

server.exchange(oauth2orize.exchange.password(
  async ({ clientId, clientSecret }, username, password, scope, done) => {
    const client = await Client.findOne({ where: { clientId } })
      .catch(err => done(err))

    if (!client) return done(null, false)
    if (client.clientSecret !== clientSecret) return done(null, false)

    const user = await User
      .findOne({ where: { email: username } })
      .catch(err => done(err))

    if (!user) return done(null, false)
    if (password !== user.password) return done(null, false)

    return Promise.all([
      createAccessToken(user.id, client.id, done)
    ])
  })
)

server.exchange(oauth2orize.exchange.refreshToken(
  async ({ clientId, clientSecret }, refreshToken, scope, done) => {
    const client = await Client.findOne({ where: { clientId } })
      .catch(err => done(err))

    if (!client) return done(null, false)
    if (client.clientSecret !== clientSecret) return done(null, false)

    const token = await AccessToken
      .findOne({ where: { refreshToken } })
      .catch(err => done(err))

    if (!token) return done(null, false)

    await token.destroy({ force: true })

    return Promise.all([
      createAccessToken(token.userId, client.id, done)
    ])
  })
)

const authorization = [
  server.authorization(
    async (clientId, redirectUri, done) => {
      const client = await Client.find({ where: { clientId } }).catch(err => done(err))
      return done(null, client, redirectUri)
    }
  ),
  async (client, user, done) => {
    if (client.isTrusted) return done(null, true)
    const token = await AccessToken.findOne({ where: { userId: user.id, clientId: client.clientId } })
      .catch(err => done(err))

    if (token) return done(null, true)

    return done(null, false)
  }
]

const token = [
  passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
  server.token(),
  server.errorHandler()
]

module.exports = {
  authorization,
  token
}
