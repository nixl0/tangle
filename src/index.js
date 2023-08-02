import pg from 'pg'
import Server from './server'
import logger from './logger'

const PORT = process.env.PORT
const TEMPLATES_DIR = './src/templates/'

const server = new Server()

server.get('/', (req, res) => {
    server.sendFile(res, TEMPLATES_DIR + 'index.html')
})

server.get('/about', (req, res) => {
    server.sendFile(res, TEMPLATES_DIR + 'about.html')
})

server.create(PORT)