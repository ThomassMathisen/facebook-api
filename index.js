const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const morgan = require("morgan")
const helmet = require("helmet")
const userRouter = require("./routes/users")
const authRouter = require("./routes/auth")
const postRouter = require("./routes/posts")

dotenv.config()

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

app.get("/", (req, res) => {
  res.send("Welcome")
})

app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)

app.listen(8800, () => {
  console.log("Backend is running")
})