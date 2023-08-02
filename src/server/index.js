import http from 'http'
import path from 'path'
import fs from 'fs'
import 'dotenv/config'
import logger from '../logger'

export default class Server {
    constructor() {
        this.ROUTES = []
    }

    /**
     * Creates and starts the server
     * 
     * @param {number} port Server port
     */
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

    // ====================================
    // Request Methods
    // ====================================

    /**
     * Add a GET route handler. 
     * 
     * @param {string} url - The route URL path
     * @param {function} handler - The route handler function
     */
    get(url, handler) {
        this.ROUTES.push({
            url: url,
            method: 'GET',
            handler: handler
        })
    }

    /**
     * Add a POST route handler. 
     * 
     * @param {string} url - The route URL path
     * @param {function} handler - The route handler function
     */
    post(url, handler) {
        this.ROUTES.push({
            url: url,
            method: 'POST',
            handler: handler
        })
    }

    /**
     * Add a PUT route handler. 
     * 
     * @param {string} url - The route URL path
     * @param {function} handler - The route handler function
     */
    put(url, handler) {
        this.ROUTES.push({
            url: url,
            method: 'PUT',
            handler: handler
        })
    }

    /**
     * Add a DELETE route handler. 
     * 
     * @param {string} url - The route URL path
     * @param {function} handler - The route handler function
     */
    delete(url, handler) {
        this.ROUTES.push({
            url: url,
            method: 'DELETE',
            handler: handler
        })
    }

    // ====================================
    // Response Methods
    // ====================================

    /**
     * Sends a file to the response.
     * 
     * @param {http.ServerResponse} res - The response object 
     * @param {string} filePath - Path to the file 
     * @param {Object} [options] - Optional settings
     * @param {string} [options.contentType] - Content type override
     */
    sendFile(res, filePath, options) {
        const ext = path.extname(filePath)

        let contentType = options ? options.contentType : undefined

        if (!contentType) {
            if (ext === '.html') {
                contentType = 'text/html'
            } else if (ext === '.js') {
                contentType = 'text/javascript'
            } else if (ext === '.css') {
                contentType = 'text/css'
            } else {
                logger.error(`Couldn't find template. ${err}`)
                this.sendError(res, { statusCode: 404, message: '404 File not found.' })
            }
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                logger.error(`Couldn't find template. ${err}`)
                this.sendError(res, { statusCode: 500, message: '500 Error loading page.' })
            } else {
                logger.info('Served template.')
                res.writeHead(200, { 'Content-Type': contentType })
                res.write(data)
            }

            res.end()
        })
    }

    /**
     * Sends an error response.
     *
     * @param {http.ServerResponse} res - The response object
     * @param {Object} options - Error options 
     * @param {number} options.statusCode - HTTP status code
     * @param {string} options.message - Error message
     * @param {string} options.filePath - Path to error page file
     */
    sendError(res, options) {
        if (options) {
            if (options.statusCode) res.writeHead(options.statusCode)
            if (options.message) res.write(options.message)
            if (options.filePath) {
                fs.readFile(options.filePath, (err, data) => {
                    if (err) {
                        logger.error(`Error loading error. ${err}`)
                    } else {
                        res.writeHead(statusCode, { 'Content-Type': 'text/html' })
                        res.write(data)
                    }
                })
            }

            res.end()
        }
    }

}