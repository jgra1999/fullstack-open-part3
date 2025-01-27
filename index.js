const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('data', (req, res) => JSON.stringify(req.body))

app.use(express.json())
app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :data')
)
app.use(cors())
app.use(express.static('dist'))

let phonebook = [
	{
		id: 1,
		name: 'Artos Hellas',
		number: '040-123456'
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523'
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345'
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122'
	}
]

app.get('/api/persons', (req, res) => {
	res.json(phonebook)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)

	const person = phonebook.find((person) => person.id === id)

	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.get('/info', (req, res) => {
	const personsAmount = phonebook.length

	const requestDate = new Date()

	const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
	const hourOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' }

	const formattedDate = requestDate.toLocaleDateString('en-US', dateOptions)
	const formattedHour = requestDate.toLocaleDateString('en-US', hourOptions)

	res.send(
		`<p>Phonebook has info for ${personsAmount} persons</p> <p><strong>Date:</strong> ${formattedDate} <strong>Time:</strong> ${formattedHour} </p>`
	)
})

app.post('/api/persons', (req, res) => {
	const { name, number } = req.body

	const id = Math.floor(Math.random() * 100)

	if (!name | !number) {
		return res.status(400).json({
			error: 'content missing'
		})
	}

	const newPerson = {
		id,
		name,
		number
	}

	const nameValidator = phonebook.find((person) => person.name === name)

	if (nameValidator) {
		return res.status(400).json({
			error: 'name must be unique'
		})
	}

	phonebook.push(newPerson)

	res.json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)

	phonebook = phonebook.filter((person) => person.id !== id)

	res.status(204).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT} - http://localhost:${PORT}`)
})
