const express = require('express')
const { Client } = require('pg')
require('dotenv').config()

const app = express()

const client = new Client({
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.POSTGRES_HOST,
	port: process.env.POSTGRES_PORT,
	database: process.env.POSTGRES_DB
})

app.get('/', async (req, res) => {

	try {
		await client.connect()
	}
	catch (err) {
		throw err
		return res.json({ message: err })
	}

	await client.end()
	
	res.json({ message: 'pg connection SUCCEX' })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log('App listening on port 3000')
})
