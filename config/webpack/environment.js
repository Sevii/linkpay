const { environment } = require('@rails/webpacker')

environment.config.externals = {
  web3: 'Web3'
}

module.exports = environment
