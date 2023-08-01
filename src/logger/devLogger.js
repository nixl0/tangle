const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf, colorize } = format

const pathToLogDir = './src/logger'

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`
})

const devLogger = () => {
    return createLogger({
        level: 'debug',
        format: combine(
            colorize(),
            label({ label: '😵‍💫' }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            myFormat
        ),
        transports: [
            new transports.Console(),
            // new transports.File({ filename: `${pathToLogDir}/error.log`, level: 'error' }),
            // new transports.File({ filename: `${pathToLogDir}/combined.log` })
        ]
    })
}

module.exports = devLogger