'use strict'
var execSync=require('child_process').execSync

var logger = require('../logger/log.js').logger

const repository = (dbConnection) => {
  logger.info('repository ' + dbConnection)

  const getRace = (raceid) => {
    logger.info('In getRace ' + raceid + ' connection: ' + dbConnection.constructor.name)
    const collection = dbConnection.db('rpdata').collection('races')
    return new Promise((resolve, reject) => {
      collection.findOne({_id: raceid}, (err, race) => {
        if (err) {
          reject(new Error('An error occured fetching a race with id:' + raceid + ' err: ' + err))
        }
        resolve(race)
      })
    })
  }

  const getBetaTestBet = (raceid) => {
    //logger.info('In getRace ' + raceid + ' connection: ' + dbConnection.constructor.name)
    const collection = dbConnection.db('rpdata').collection('betatestbets')
    return new Promise((resolve, reject) => {
      collection.findOne({rpraceid: raceid}, (err, bet) => {
        if (err) {
          reject(new Error('An error occured fetching a betatestbet with id:' + raceid + ' err: ' + err))
        }
        let hIndex = 0
        for(let horse in bet.horses){
          let h = bet.horses[horse]
          if((h.status == "LOSER")||(h.status == "WINNER")){
            h.imageIndex = hIndex++
            //generate the horse images
            const cmd = "/Users/adriangordon/Development/GP/data/newmongo/plothorse.sh /Users/adriangordon/Development/GP/data/newmongo/" + raceid + " " + h.imageIndex
            console.log(cmd)
            const rval = execSync(cmd);
          }

        }
         //generate the race image
        const cmd = "/Users/adriangordon/Development/GP/data/newmongo/plotrace.sh /Users/adriangordon/Development/GP/data/newmongo/" + raceid
        const rval = execSync(cmd);
        logger.info("execSync returns: " + rval)
        resolve(bet)
      })
    })
  }

  return Object.create({
    getRace,
    getBetaTestBet
  })
}

const getRepository = (connection) => {
  logger.info('In getRepository, connection is: ' + connection)
  return new Promise((resolve, reject) => {
    logger.info('in getRepository promise, connection is: ' + connection)
    if (!connection) {
      logger.info('go reject')
      reject(new Error('No Database Connection provided'))
    } else {
      logger.info('go resolve')
      resolve(repository(connection))
    }
  })
}

// logger.info("getRepository: " + getRepository);

module.exports = Object.assign({}, {getRepository})
// module.exports = {getRepository};
