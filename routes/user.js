const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken'); // Create this middleware
const User = require('../models/User'); // Import your User model

// authentication middleware 
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId); // Fetch user data from the database using req.userId
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Respond with the user's profile data
    res.status(200).json({
      name: user.name,
      age: user.age,
      gender: user.gender,
      dob: user.dob,
      mobile: user.mobile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { age, gender, dob, mobile } = req.body;
    const updatedUserData = {
      age,
      gender,
      dob,
      mobile,
    };

    await User.findByIdAndUpdate(req.userId, updatedUserData);
    
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
