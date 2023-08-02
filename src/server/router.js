import url from 'url'
import fs from 'fs'
import logger from '../logger'

const router = (req, res, routes) => {
    const parsedUrl = url.parse(req.url)
    const path = parsedUrl.pathname
    const routeHandler = routes[path]

    if (routeHandler) {
        routeHandler(req, res)
    } else {
        logger.error(`Couldn't find file. ${err}`)
        res.writeHead(404)
        res.write('Route not defined.')
    }
}

function serveTemplate(req, res, path) {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.readFile(path, (err, data) => {
        if (err) {
            logger.error(`Couldn't find template. ${err}`)
            res.writeHead(404)
            res.write('404 Template not found.')
        } else {
            logger.info('Served template.')
            res.write(data)
        }
        res.end()
    })
}

export { router, serveTemplate }