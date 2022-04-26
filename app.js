const config = require("./utils/config")
const express = require("express")
const app = express()
const cors = require("cors")
const personsRouter = require("./controllers/persons")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")
const mongoose = require("mongoose")
const morgan = require("morgan")

logger.info("Connecting to: ", config.MONGO_URI)

mongoose.connect(config.MONGO_URI)
  .then(() =>
  {
    logger.info("Connected to MongoDB")
  })
  .catch((error) =>
  {
    logger.error("Error connecting to MongoDB: ", error.message)
  })

morgan.token("post", (req) =>
{
  if (req.method === "POST")
    return JSON.stringify(req.body)
  else
    return ""
})

morgan.format("postFormat", ":method :url :status :res[content-length] - :response-time ms :post")

app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(middleware.requestLogger)

app.use("/api/persons", personsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
app.use(morgan("postFormat"))

module.exports = app