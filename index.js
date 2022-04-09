const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const app = express()
app.use(express.json())
app.use(cors())

morgan.token("post", (req) =>
{
  if (req.method === "POST")
    return JSON.stringify(req.body)
  else
    return ""
})

morgan.format("postFormat", ":method :url :status :res[content-length] - :response-time ms :post")

app.use(morgan("postFormat"))

let data =
  [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
  ]

app.get("/api/persons", (req, res) => res.json(data))
app.get("/api/persons/:id", (req, res) =>
{
  const id = Number(req.params.id)
  const person = data.find(person => person.id === id)

  if (!person) res.status(404).end()

  res.json(person)
})

app.delete("/api/persons/:id", (req, res) =>
{
  const id = Number(req.params.id)
  data = data.filter(person => person.id !== id)

  res.status(204).end()
})

app.get("/info", (req, res) =>
{
  const date = new Date();
  const peopleAmount = data.length

  res.send(`Phonebook has info for ${peopleAmount} people <br><br> ${date}`)
})

app.post("/api/persons", (req, res) =>
{
  const id = Math.floor(Math.random() * 1000);
  const body = req.body

  if (!body.name || !body.number)
  {
    return res.status(400).json({
      error: "Name or Number is missing"
    })
  }

  if (data.find(person => person.name === body.name))
  {
    return res.status(400).json({
      error: "Name must be unique"
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: id
  }

  data = data.concat(person)
  res.json(person)
})

const unknownEndpoint = (req, res) =>
{
  res.status(404).send({ error: 'Unknown Endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server Running on PORT: ${PORT}`))