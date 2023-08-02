import { createLogger, format, transports } from 'winston'
const { combine, timestamp, printf } = format

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`
})

const defaultParameters = {
    level: 'info',
    format: combine(
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
 * Creates production environment logger
 * 
 * @param {boolean?} outputToFiles Enable output to console AND to files
 * @returns logger
 */
const prodLogger = (outputToFiles = false) => {
    if (outputToFiles) {
        return createLogger(outputToFilesParameters)
    }

    return createLogger(defaultParameters)
}

export default prodLogger