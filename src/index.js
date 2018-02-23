'use strict'

const nconf = require('./config/conf.js').nconf
const database = require('./db/database.js')
const getRepository = require('./repository/repository.js').getRepository
const server = require('./server/server.js')

const logger = require('./logger/log.js').logger

logger.info('get repository: ' + getRepository)
logger.info('Starting')

database.getConnection()
.then((dbconnection) => {
  logger.info('dbconnection is now: ' + dbconnection)
  return getRepository(dbconnection)
})
.then((repository) => {
  logger.info('connection via repository ')
  let port = nconf.get('server').port
  logger.info('server: ' + port)
  return server.startServer(port, repository)
})
.then((server) => {
  logger.info('server ' + server)
})
.catch((error) => {
  logger.error(JSON.stringify(error))
})
