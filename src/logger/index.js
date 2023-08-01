const devLogger = require('./devLogger')

let logger = null

if (process.env.NODE_ENV === 'development') {
    logger = devLogger()
}

// TODO production logger

module.exports = logger