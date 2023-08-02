import http from 'http'
import 'dotenv/config'
import logger from '../logger'

export default class Server {
    constructor() {
        this.ROUTES = []
    }

    create(port) {
        const server = http.createServer((req, res) => {
            let wasFound = false
            
            for (let { url, method, handler} of this.ROUTES) {
                if (url === req.url && method === req.method) {
                    handler(req, res)
                    wasFound = true
                    break
                }
            }

            if (!wasFound) {
                logger.error(`Couldn't find template.`)
                res.writeHead(404)
                res.write('Route not defined.')
            }
        })

        server.listen(port, (err) => {
            if (err) {
                logger.fatal(`Server error. ${err}`)
            } else {
                logger.info(`Server listening on port ${port}`)
            }
        })
    }

    get(url, handler) {
        this.ROUTES.push({
            url: url,
            method: 'GET',
            handler: handler
        })
    }

    post(url, handler) {
        this.ROUTES.push({
            url: url,
            method: 'POST',
            handler: handler
        })
    }
}