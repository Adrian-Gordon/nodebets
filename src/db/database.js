'use strict'

const nconf = require('../config/conf.js').nconf
var logger = require('../logger/log.js').logger

const MongoClient = require('mongodb').MongoClient
const dburl = nconf.get('dburl')

const getConnection = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dburl, function (err, db) {
      if (err) {
        reject(err)
      } else if (!db) {
        reject(new Error('No Database Client'))
      } else {
        resolve(db)
      }
    })
  })
}

module.exports = Object.assign({}, {getConnection})
