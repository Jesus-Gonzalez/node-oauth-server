const passport = require('passport')
const routes = require('./lib')

module.exports = app => {
  app.get('/oauth/check_token',
    passport.authenticate('bearer', { session: false }),
    (req, res) => {
      res.json(req.user)
    })
  app.post('/oauth/token', routes.token)
}
