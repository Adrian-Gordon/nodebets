'use strict'

const nconf = require('nconf')
nconf.env().argv()

// if 'conf' environment variable or command line argument is provided, load
// the configuration JSON file provided as the value
let path = nconf.get('conf')
if (path) {
  // logger.info("use file: " + path);
  nconf.file({file: path})
}

nconf.defaults(
  {
    'logging': {
      'fileandline': true,
      'logger': {
        'console': {
          'level': 'info',
          'colorize': true,
          'label': 'nodebets',
          'timestamp': true
        }
      }

    },
    'server': {
      'port': 3000
    },
    'rprooturl': 'https://www.racingpost.com',
    'scrapedir': '/home/ubuntu/GP/data/scrape-develop/',
    'datadir': '/home/ubuntu/GP/data',
    'delay': 1

  })

module.exports = Object.assign({}, {nconf})
