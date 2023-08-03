import http from 'http'
import path from 'path'
import fs from 'fs'
import qs from 'qs'
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
            
            for (let { urlPath, method, handler} of this.ROUTES) {
                // Getting the request URL path
                const reqUrlPath = req.url.split('?')[0]

                // Call handler() and exit the for loop
                // if URL and method is among ROUTES
                if (urlPath === reqUrlPath && method === req.method) {
                    handler(req, res)
                    wasFound = true
                    break
                }
            }

            // Produce error
            // if URL and methos is NOT among ROUTES
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
     * @param {string} urlPath - The route URL path
     * @param {function} handler - The route handler function
     */
    getReq(urlPath, handler) {
        this.ROUTES.push({
            urlPath,
            method: 'GET',
            handler
        })
    }

    /**
     * Add a POST route handler. 
     * 
     * @param {string} urlPath - The route URL path
     * @param {function} handler - The route handler function
     */
    postReq(urlPath, handler) {
        this.ROUTES.push({
            urlPath,
            method: 'POST',
            handler
        })
    }

    /**
     * Add a PUT route handler. 
     * 
     * @param {string} urlPath - The route URL path
     * @param {function} handler - The route handler function
     */
    putReq(urlPath, handler) {
        this.ROUTES.push({
            urlPath,
            method: 'PUT',
            handler
        })
    }

    /**
     * Add a DELETE route handler. 
     * 
     * @param {string} urlPath - The route URL path
     * @param {function} handler - The route handler function
     */
    deleteReq(urlPath, handler) {
        this.ROUTES.push({
            urlPath,
            method: 'DELETE',
            handler
        })
    }

    /**
     * Parses the query string from the request URL into an object.
     * 
     * @param {http.IncomingMessage} req - The request object
     * @returns {Object} The parsed query params or undefined
     */
    getQueryParams(req) {
        // Getting the query parameters
        const query = qs.parse(req.url.split('?')[1])

        if (query) {
            return query
        } else {
            logger.warning('Parsing gave no parameters.')
        }
    }

    /**
     * Parses the request body data.
     * 
     * @param {http.IncomingMessage} req - The request object
     * @param {function} callback - The callback to invoke 
     * @param {Object|undefined} callback.parsedBody - The parsed request body object
     */
    getBodyData(req, callback) {
        let body = ''

        req.on('data', (chunk) => {
            body += chunk
        })

        req.on('end', () => {
            const parsed = qs.parse(body)

            if (parsed) {
                callback(parsed)
            } else {
                logger.warning(`Parsing gave no body data. ${err}`)
            }
        })
    }

    // ====================================
    // Response Methods
    // ====================================

    /**
     * Sends a response with the provided content.
     * 
     * @param {http.ServerResponse} res - The response object
     * @param {Object} options - Options object
     * @param {string} options.contentType - The content type header value 
     * @param {string} [options.content] - The content to send
     */
    send(res, options) {
        const contentType = options ? options.contentType : 'text'
        const content = options ? options.content : undefined

        if (content) {
            res.writeHead(200, { 'Content-Type': contentType })
            res.write(content)
        }

        res.end()
    }

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
                        res.end()
                        return
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