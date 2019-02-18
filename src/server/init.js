const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({ name: 'node-oauth-server', secret: 'hola-mundo' }))
app.use(passport.initialize())
app.use(passport.session())

require('./routes/index')(app)

const hostname = '127.0.0.1'
const port = '20202'
app.listen(port, hostname, () => {
  console.log(`Running: http://${hostname}:${port}`)
})
