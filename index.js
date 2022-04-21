require("dotenv").config()

const express = require("express")
const app = express()

const mongoose = require("mongoose")
const Person = require("./models/person")

const cors = require("cors")
const morgan = require("morgan")

app.use(express.json())
app.use(express.static("build"))
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

app.get("/api/persons/:id", async (req, res) =>
{
  const id = Number(req.params.id)

  await Person.find({ id: id }).then(person =>
  {
    res.json(person)
  })
})

app.delete("/api/persons/:id", async (req, res) =>
{
  const id = Number(req.params.id)

  await Person.deleteOne({ id: id })

  res.status(204).end()
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

  await person.save().then(result =>
  {
    console.log("Person saved successfully", result);
  })

  res.status(200).end()
})

const unknownEndpoint = (req, res) =>
{
  res.status(404).send({ error: 'Unknown Endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server Running on PORT: ${PORT}`))