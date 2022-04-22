const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

console.log("Connecting to", url);

mongoose.connect(url)
  .then(result =>
  {
    console.log("Connected to MongoDB");
  })
  .catch((err) =>
  {
    console.log("Error connecting to MongoDB: ", err.message)
  })

const personSchema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: Number,
    minlength: 8,
    validate: {
      validator: () => {
        return /\d{3}-\d{3}-\d{4}/
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, "User phone number required"]
  }
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) =>
  {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Person", personSchema)