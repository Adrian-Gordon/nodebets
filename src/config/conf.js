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
     "goingMappings":{"Firm":-3,"Good To Firm":-2,"Standard":-1,"Good":-1,"Good To Soft":0,"Good To Yielding":-1,"Standard To Slow":0,"Yielding":1,"Yielding To Soft":1,"Soft":1,"Soft To Heavy":2,"Heavy":3,"Very Soft":3},
    "gpnodepath":"/home/adrian/Development/Node/GPNode",
     "variables":['speed1','distance1','distance2','distancediff','weight1','weight2','weightdiff','going1','going2','goingdiff'],
     "functionSet":['+','-','*','/','^','if<='],
      "rule":["+","*","-","*","if<=","speed1","if<=","weight1",6.5858,"^",-6.4670,"/","*",-7.2541,-3.6690,"if<=","weight2",0.2758,"-","-",6.5858,"weight2","/","*","*","-",-4.1061,"weight2","distancediff","+",5.2645,5.8362,"if<=","speed1",0.2758,"weight1","weight1","weight1","+",5.2645,5.8362,"*","*",5.2645,"if<=","*","weight1","*",6.6996,"distancediff","if<=","/","*","*","*","*","-","-",-6.4670,"if<=","*","goingdiff",0.6722,"goingdiff","speed1",6.6996,"weight2","distancediff","+",5.2645,5.8362,"distancediff","+",5.2645,5.8362,"if<=","speed1",0.2758,"weight1","weight1","if<=","weight1",6.5858,"^",5.2645,"+","weight2","distancediff",6.6996,"*","*",5.2645,"if<=","*",0.6722,"goingdiff",0.2758,-3.6690,"weight1",0.6722,"weight1","weight2","weight1",0.6722,"weight1","-",-6.4670,"if<=","*","goingdiff","speed1",0.6722,"speed1","speed1","distance1","goingdiff","/","*","*","-","-",-6.4670,"*",-7.2541,-3.6690,"weight2","distancediff","+",5.2645,5.2645,"if<=","speed1",0.2758,"weight1","if<=","speed1","goingdiff",-3.6690,"weight1"],
     "observationStats": {"maxSpeedDif":{"speed1":17.003836077844312,"speed2":11.993165933212529,"dif":0.2946788078697486},"minSpeedDif":{"speed1":11.579529042386186,"speed2":16.42143350046741,"dif":-0.41814347028775656},"maxGoingIncrease":6,"maxGoingDecrease":-6,"maxDistanceIncrease":2548.4327999999996,"maxDistanceDecrease":-1655.9784,"mindistance":1005.84,"maxdistance":5632.704,"maxWeightIncrease":79,"maxWeightDecrease":-78,"maxweight":188,"minweight":105},
       "minfofx": -123249.31077344337,
      "maxfofx": 85296.35009281096,
    'delay': 1,
     "maxdistdiff":100000000000000000,
     "maxperfage":120,
     "minwinspeedpercent":0.97,
     "maxspeeds":[18.8,18.8,18.1,18.0,18.0,17.8,17.7,17.5,17.4,17.1,17.1,16.9,16.9,16.9,16.9,16.8,16.6,16.4,16.3,16.3,16.0,16.0,16.0],
     "minspeedfactor":0.80


  })

module.exports = Object.assign({}, {nconf})
