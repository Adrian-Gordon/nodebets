'use strict'

const nconf = require('./config/conf.js').nconf
const database = require('./db/database.js')
const getRepository = require('./repository/repository.js').getRepository
const server = require('./server/server.js')

const logger = require('./logger/log.js').logger

logger.info('Starting')

database.getConnection()
.then((dbconnection) => {
  return getRepository(dbconnection)
})
.then((repository) => {
  let port = nconf.get('server').port
  logger.info('port: ' + port)
  return server.startServer(port, repository)
})
.then((server) => {
	logger.info('server running')
})
.catch((error) => {
  logger.error(JSON.stringify(error))
})
