import { createLogger, format, transports } from 'winston'
const { combine, timestamp, label, printf, colorize } = format

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`
})

const defaultParameters = {
    level: 'debug',
    format: combine(
        colorize(),
        label({ label: '😼 mewo' }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        myFormat
    ),
    transports: [
        new transports.Console()
    ]
}

const pathToLogDir = './logs'

const outputToFilesParameters = defaultParameters
outputToFilesParameters.transports = [
    new transports.Console(),
    new transports.File({ filename: `${pathToLogDir}/error.log`, level: 'error' }),
    new transports.File({ filename: `${pathToLogDir}/combined.log` })
]

/**
 * Creates development environment logger
 * 
 * @param {boolean?} outputToFiles Enable output to console AND to files
 * @returns logger
 */
const devLogger = (outputToFiles = false) => {
    if (outputToFiles) {
        return createLogger(outputToFilesParameters)
    }

    return createLogger(defaultParameters)
}

export default devLogger