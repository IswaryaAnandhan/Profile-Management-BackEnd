// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

var secretKey = process.env.Key

const db= require('./database.js');
// Models
const User = require('./models/User');
const Profile = require('./models/Profile');

// Routes
app.post('/api/auth/signup', async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if the email is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const user = new User({ name, email, password: hashedPassword });
  
      // Save the user to the database
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  


  // Login a user
app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id },secretKey, { expiresIn: '1h' });
      res.status(200).json({ message: "Success",token, userId: user._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
// Modify your /profile route in auth.js
app.get('/profile', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Include the username in the response
      res.status(200).json({
        user
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  app.put('/api/auth/profile', verifyToken, async (req, res) => {
    try {
      const { age, gender, dob, mobile } = req.body;
      const updatedUserData = {
        age,
        gender,
        dob,
        mobile,
      };
  
      // Update the user's profile data
      await Profile.findOneAndUpdate({ user: req.userId }, updatedUserData);
  
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/api/auth/profile', verifyToken, async (req, res) => {
    try {
      // Fetch user's profile data
      const profile = await Profile.findOne({ user: req.userId });
  
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      res.status(200).json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Verify Token Middleware
  function verifyToken(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.userId = decoded.userId;
      next();
    });
  }
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });