import devLogger from './devLogger'
import prodLogger from './prodLogger'

let logger = null

if (process.env.NODE_ENV === 'development') {
    logger = devLogger()
}

if (process.env.NODE_ENV === 'production') {
    logger = prodLogger(true)
}

export default logger