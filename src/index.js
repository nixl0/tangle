import http from 'http'
import pg from 'pg'
import fs from 'fs'
import Server from './server'
import logger from './logger'

const PORT = process.env.PORT

const server = new Server()

server.get('/', (req, res) => {
    const path = './src/templates/index.html'

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
})

server.get('/about', (req, res) => {
    const path = './src/templates/about.html'

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
})

server.create(PORT)