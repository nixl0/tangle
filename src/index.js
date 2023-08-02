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

server.get('/person', (req, res) => {
    const params = server.queryParams(req)
    const content = `<h3>name:</h3><span>${params.name}</span><br><h3>surname:</h3><span>${params.surname}</span><br><h3>age:</h3><span>${params.age}</span><br>`
    server.send(res, {
        contentType: 'text/html',
        content
    })
})

server.create(PORT)