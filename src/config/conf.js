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
    'delay': 1,
     "maxdistdiff":100000000000000000,
     "maxperfage":120,
     "minwinspeedpercent":0.97,
     "maxspeeds":[18.8,18.8,18.1,18.0,18.0,17.8,17.7,17.5,17.4,17.1,17.1,16.9,16.9,16.9,16.9,16.8,16.6,16.4,16.3,16.3,16.0,16.0,16.0],
     "minspeedfactor":0.80


  })

module.exports = Object.assign({}, {nconf})
