const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// 2. Define the Post Schema and Model
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

// 3. REST API Routes

// READ (Get all posts)
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    // MongoDB uses '_id' instead of 'id'. We map it for React convenience.
    const formattedPosts = posts.map(post => ({ id: post._id, title: post.title, body: post.body }));
    res.json(formattedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ (Get single post)
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ id: post._id, title: post.title, body: post.body });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE (Add a post)
app.post('/posts', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    body: req.body.body
  });
  try {
    const newPost = await post.save();
    res.status(201).json({ id: newPost._id, title: newPost.title, body: newPost.body });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE (Edit a post)
app.put('/posts/:id', async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, body: req.body.body },
      { new: true }
    );
    res.json({ id: updatedPost._id, title: updatedPost.title, body: updatedPost.body });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE (Remove a post)
app.delete('/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});