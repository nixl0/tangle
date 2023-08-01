import devLogger from './devLogger'

let logger = null

if (process.env.NODE_ENV === 'development') {
    logger = devLogger()
}

// TODO production logger

export default logger