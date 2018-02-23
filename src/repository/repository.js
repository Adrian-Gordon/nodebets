'use strict'

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
