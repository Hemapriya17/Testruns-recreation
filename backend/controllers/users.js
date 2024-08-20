const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user and send email with credentials
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    
    // Generate a random password if needed, or use req.body.password
    const password = user.password || Math.random().toString(36).slice(-8);
    user.password = password;

    await user.save();

    // Set up nodemailer transport with Outlook
    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: 'hema.learny@gmail.com', // Your Outlook email address
        pass: 'Hemapriya5', // Your email password
      },
    });

    // Set up email data, using firstName from the user object
    const mailOptions = {
      from: 'hema.learny@gmail.com', // Sender address
      to: user.email, // List of receivers
      subject: 'Welcome to Our Application', // Subject line
      text: `Hello ${user.firstName},\n\nYour account has been created successfully.\n\nYour credentials are:\nEmail: ${user.email}\nPassword: ${password}\n\nPlease log in and change your password immediately.\n\nBest regards,\nHema PriyaDharshini`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get the current user (dummy example, adjust as needed)
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null; // Adjust based on your authentication method

    if (!userId) {
      return res.status(400).json({ message: 'User ID is not provided' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
