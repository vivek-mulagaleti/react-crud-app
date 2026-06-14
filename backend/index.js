const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const protect = require('./middleware/auth.middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration
app.use(cors({
  origin: 'http://localhost:5173', // Vite Frontend URL
  credentials: true                // Crucial requirement for cookie exchange pipelines
}));
app.use(express.json());
app.use(cookieParser());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => console.error('MongoDB initialization failure:', err));

// Updated Schema with a User Reference relationship mapping
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

// AUTHENTICATION INTERFACES (API)

// SIGNUP ENDPOINT
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All registration parameters are required.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'An account with this email already exists.' });

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: 'User registration completed successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN ENDPOINT
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password inputs are required.' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid authentication credentials.' });
    }

    // Generate signed JWT token containing user ID reference
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Inject token to client side using an HTTP-Only secure cookie profile
    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      maxAge: 3600000 // 1 hour lifetime validation window
    });

    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGOUT ENDPOINT
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Session dropped. Logged out safely.' });
});

// VALIDATE AUTH SESSION STATUS
app.get('/api/auth/me', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ isAuthenticated: false });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.json({ isAuthenticated: false });
    res.json({ isAuthenticated: true, user });
  } catch {
    res.json({ isAuthenticated: false });
  }
});

// PROTECTED CRUD ENDPOINTS (USER-ISOLATED)


// READ ALL RECORDS SPECIFIC TO LOGGED-IN USER
app.get('/api/posts', protect, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(posts.map(p => ({ id: p._id, title: p.title, body: p.body })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// READ SINGULAR TARGETED RECORD (WITH OWNERSHIP CHECK)
app.get('/api/posts/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Record reference not found' });
    
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Unauthorized data view.' });
    }

    res.json({ id: post._id, title: post.title, body: post.body });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// CREATE NEW ENTRY RECORD TIED TO USER ID
app.post('/api/posts', protect, async (req, res) => {
  try {
    const post = new Post({ 
      title: req.body.title, 
      body: req.body.body,
      user: req.user.id 
    });
    const newPost = await post.save();
    res.status(201).json({ id: newPost._id, title: newPost.title, body: newPost.body });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// UPDATE MUTATION ROUTE (WITH OWNERSHIP CHECK)
app.put('/api/posts/:id', protect, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Record reference not found' });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized modification attempt denied.' });
    }

    post.title = req.body.title;
    post.body = req.body.body;
    const updatedPost = await post.save();

    res.json({ id: updatedPost._id, title: updatedPost.title, body: updatedPost.body });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/posts/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Record reference not found' });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized deletion attempt denied.' });
    }

    await post.deleteOne();
    res.json({ message: 'Document entry dropped successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.listen(PORT, () => console.log(`Secure Server processing active on port ${PORT}`));