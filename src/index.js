import pg from 'pg'
import Server from './server'
import logger from './logger'

const PORT = process.env.PORT
const TEMPLATES_DIR = './src/templates/'

const server = new Server()

server.getReq('/', (req, res) => {
    server.sendFile(res, TEMPLATES_DIR + 'index.html')
})

server.getReq('/about', (req, res) => {
    server.sendFile(res, TEMPLATES_DIR + 'about.html')
})

server.getReq('/person/add', (req, res) => {
    server.sendFile(res, TEMPLATES_DIR + 'person/add.html')
})

server.postReq('/person/add', (req, res) => {
    server.getBodyData(req, ({ fields, files }) => {
        // TODO make a render method

        let profilePicHTML = ''

        if (files.photo) {
            const base64 = files.photo.data.toString('base64')
            profilePicHTML = `<img src="data:image/*;base64,${base64}" />`
        }

        const content = `
            <h3>name:</h3><span>${fields.name}</span><br>
            <h3>surname:</h3><span>${fields.surname}</span><br>
            <h3>age:</h3><span>${fields.age}</span><br>
            <h3>photo:</h3>${profilePicHTML}`
        server.send(res, {
            contentType: 'text/html',
            content
        })
    })
})

server.getReq('/person', (req, res) => {
    const params = server.getQueryParams(req)
    const content = `<h3>name:</h3><span>${params.name}</span><br><h3>surname:</h3><span>${params.surname}</span><br><h3>age:</h3><span>${params.age}</span><br>`
    server.send(res, {
        contentType: 'text/html',
        content
    })
})

server.create(PORT)