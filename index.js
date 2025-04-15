require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('data', (req, res) => JSON.stringify(req.body))

app.use(express.json())
app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :data')
)
app.use(cors())
app.use(express.static('dist'))

app.get('/api/phonebook', (req, res) => {
	Person.find({}).then((person) => {
		res.json(person)
	})
})

app.get('/api/phonebook/:id', (req, res) => {
	const id = req.params.id

	Person.findById(id)
		.then((person) => {
			if (person) {
				res.json(person)
			} else {
				res.status(404).end()
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(400).send({ error: 'malformatted id' })
		})
})

app.get('/info', (req, res) => {
	let phonebook = []

	Person.find({}).then((person) => {
		phonebook = person

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
})

app.post('/api/phonebook', (req, res, next) => {
	const { name, number } = req.body

	// const id = Math.floor(Math.random() * 100)

	if (!name | !number) {
		return res.status(400).json({
			error: 'content missing'
		})
	}

	const newPerson = new Person({
		name,
		number
	})

	newPerson
		.save()
		.then((savedPerson) => {
			res.json(savedPerson)
		})
		.catch((error) => next(error))

	// const nameValidator = phonebook.find((person) => person.name === name)

	// if (nameValidator) {
	// 	return res.status(400).json({
	// 		error: 'name must be unique'
	// 	})
	// }

	// phonebook.push(newPerson)
})

app.put('/api/phonebook/:id', (req, res, next) => {
	const options = { new: true, runValidators: true, context: 'query' }

	Person.findByIdAndUpdate(req.params.id, req.body, options)
		.then((updatedNumber) => {
			res.json(updatedNumber)
		})
		.catch((error) => next(error))
})

app.delete('/api/phonebook/:id', (req, res) => {
	Person.findByIdAndDelete(req.params.id)
		.then(() => {
			res.status(204).end()
		})
		.catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT} - http://localhost:${PORT}`)
})
