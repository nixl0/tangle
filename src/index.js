import express from 'express'
import pg from 'pg'
import 'dotenv/config'

import logger from './logger'


const app = express()


const PORT = process.env.PORT || 3000


const client = new pg.Client({
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.POSTGRES_HOST,
	port: process.env.POSTGRES_PORT,
	database: process.env.POSTGRES_DB
})


async function startApp() {

	// Connect to database
	try {
		await client.connect()
	} catch (err) {
		throw err
		return res.json({ message: err })
	}

	// Activate server
	app.listen(PORT, () => {
		logger.info('App listening on port 3000')
	})

	handleShutdown()
}


// Call for the 'startApp' function
startApp()


app.get('/', async (req, res) => {
	// res.json({ message: 'pg connection SUCCESS' })

	logger.debug('accessed /')

	const result = await client.query('SELECT $1::text as message', ['Hello world!'])
	res.json({ message: result.rows[0].message })
})


function handleShutdown() {
	process.on('SIGINT', async () => {
		await client.end()
		logger.info('client disconnected')
		process.exit(0)
	})

	process.on('SIGTERM', async () => {
		await client.end()
		logger.info('client disconnected')
		process.exit(0)
	})
}