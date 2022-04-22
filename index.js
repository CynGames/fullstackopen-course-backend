require("dotenv").config()

const express = require("express")
const app = express()

const Person = require("./models/person")

const cors = require("cors")
const morgan = require("morgan")

app.use(express.static("build"))
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

app.get("/api/persons", async (req, res) =>
{
  await Person.find({}).then(person =>
  {
    res.json(person)
  })
})

app.get("/api/persons/:id", async (req, res, next) =>
{
  const id = req.params.id

  await Person.findById(id)
    .then(person =>
    {
      if (person) res.json(person)
      else res.status(404).end()
    })
    .catch(err => next(err))
})

app.delete("/api/persons/:id", async (req, res) =>
{
  const id = req.params.id

  await Person.findByIdAndDelete(id)
    .then(result => res.status(204).end())
    .catch(err => next(err))

})

app.put("/api/persons/:id", async (req, res) =>
{
  const { id, name, number } = req.body
  const person = { id, name, number }

  await Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: "query" })
    .then(updatedPerson =>
    {
      res.json(updatedPerson)
    })
    .catch(err => next(err))
})


app.get("/info", async (req, res) =>
{
  const date = new Date();
  const peopleAmount = await Person.countDocuments({}).exec();

  res.send(`Phonebook has info for ${peopleAmount} people <br><br> ${date}`)
})

app.post("/api/persons", async (req, res) =>
{
  const sID = await Person.countDocuments({}).exec();
  const id = Number(sID) + 1;

  const body = req.body

  if (!body.name || !body.number)
  {
    return res.status(400).json({
      error: "Name or Number is missing"
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: id
  })

  await person.save()
    .then(result =>
    {
      console.log("Person saved successfully", result);
    })
    .catch(err => next(err))

  res.status(200).end()
})


const unknownEndpoint = (req, res) =>
{
  res.status(404).send({ error: 'Unknown Endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) =>
{
  console.log(err.message);

  if (err.name === "CastError")
  {
    return res.status(400).send({ error: "Malformatted ID" })
  } else if (err.name === "ValidationError")
  {
    return res.status(400).json({ error: err.message })
  }

  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server Running on PORT: ${PORT}`))