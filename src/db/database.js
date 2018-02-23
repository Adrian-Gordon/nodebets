'use strict'

const nconf = require('../config/conf.js').nconf
var logger = require('../logger/log.js').logger

const MongoClient = require('mongodb').MongoClient
const dburl = nconf.get('dburl')

const getConnection = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dburl, function (err, db) {
      logger.info('dburl: ' + dburl)
      logger.info('client: ' + db.constructor.name)
      let collection = db.db('rpdata')
      logger.info('collection: ' + collection)
      logger.info('error:' + JSON.stringify(err))
      if (err) {
        logger.info('go reject 1')
        reject(err)
      } else if (!db) {
        logger.info('go reject 2')
        reject(new Error('No Database Client'))
      } else {
        logger.info('go resolve ')
        resolve(db)
      }
    })
  })
}

module.exports = Object.assign({}, {getConnection})
