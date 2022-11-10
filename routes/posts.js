const router = require("express").Router()

router.get("/", (req, res) => {
  res.send("Hello posts")
})

module.exports = router