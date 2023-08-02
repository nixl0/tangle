import http from 'http'
import 'dotenv/config'
import logger from '../logger'
import { router, serveTemplate } from './router'

const PORT = process.env.PORT

const routes = {
    '/': homeHandler,
    '/about': aboutHandler
}

function homeHandler(req, res) {
    serveTemplate(req, res, './src/templates/index.html')
}

function aboutHandler(req, res) {
    serveTemplate(req, res, './src/templates/about.html')
}

const server = http.createServer( (req, res) => {
    router(req, res, routes)
})

server.listen(PORT, (err) => {
    if (err) {
        logger.fatal(`Server error. ${err}`)
    } else {
        logger.info(`Server listening on port ${PORT}`)
    }
})

export default server