const router = require("express").Router()
const { Promise } = require("mongoose")
const Post = require("../models/Post")
const User = require("../models/User")

//Create
router.post("/", async (req, res) => {
  const newPost = new Post(req.body)
  try {
    const savedPost = await newPost.save()
    res.status(200).json(savedPost)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Update
router.put("/:id",async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id)
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body })
      res.status(200).json("The post has been updated")
    } else {
      res.status(403).json("You can only update your own posts")
    }
    } catch (err) {
      return res.status(500).json(err)
    }
})

//Delete
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId === req.body.userId) {
      await post.deleteOne()
      res.status(200).json("Your post has been deleted")
    } else {
      res.status(403).json("You can only delete your own posts")
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

//Like and dislike
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } })
      res.status(200).json("You liked this post")
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } })
      res.status(200).json("You disliked this post")
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

//Get
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    res.status(200).json(post)
  } catch (err) {
    res.status(500).json(err)
  }
})
//Get all for timeline
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId)
    const userPosts = await Post.find({ userId: currentUser._id })
    const friendsPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId })
      })
    )
    res.json(userPosts.concat(...friendsPosts))
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router