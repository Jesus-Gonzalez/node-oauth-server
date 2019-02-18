const index = [
  'User',
  'Client',
  'AuthorizationCode',
  'AccessToken'
].reduce((acc, name) =>
  Object.assign(acc, { [name]: require(`./${name}`) }), {})

module.exports = index
