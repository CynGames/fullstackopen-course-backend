const personsRouter = require("express").Router()
const Person = require("../models/person")

personsRouter.get("/api/persons", async (req, res) =>
{
  await Person.find({}).then(person =>
  {
    res.json(person)
  })
})

personsRouter.get("/:id", async (req, res, next) =>
{
  await Person.findById(req.params.id)
    .then(person =>
    {
      if (person) res.json(person)
      else res.status(404).end()
    })
    .catch(err => next(err))
})

personsRouter.post("/", async (req, res, next) =>
{
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
  })

  await person.save()
    .then(result =>
    {
      console.log("Person saved successfully", result)
    })
    .catch(err => next(err))

  res.status(200).end()
})

personsRouter.delete("/:id", async (req, res, next) =>
{
  await Person.findByIdAndDelete(req.params.id)
    .then(result => res.status(204).end())
    .catch(err => next(err))
})

personsRouter.put("/:id", async (req, res, next) =>
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

personsRouter.get("/info", async (req, res) =>
{
  const date = new Date()
  const peopleAmount = await Person.countDocuments({}).exec()

  res.send(`Phonebook has info for ${peopleAmount} people <br><br> ${date}`)
})

module.exports = personsRouter