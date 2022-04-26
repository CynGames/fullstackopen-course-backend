const mongoose = require("mongoose")

if (process.argv.length < 3)
{
  console.log("node mongo.js password")
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://cyngames:${password}@cluster0.yf5ty.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: Number
})

const Person = new mongoose.model("Person", personSchema)

if (process.argv.length === 3)
{
  Person.find({}).then(result =>
  {
    console.log("Phonebook entries: ")

    result.forEach(person =>
    {
      console.log(`${person.name} ${person.number}`)
    })

    mongoose.connection.close()
  })
} else
{
  const person = new Person({
    id: 10,
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result =>
  {
    console.log("Person saved successfully")
    mongoose.connection.close()
  })
}