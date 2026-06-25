const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// In-memory fallback if MongoDB connection fails
let localUsers = [];

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists in DB
    let userExists = false;
    try {
      const dbUser = await User.findOne({ email });
      if (dbUser) userExists = true;
    } catch (dbErr) {
      userExists = localUsers.some(u => u.email === email);
    }

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Try saving to DB
    let user;
    try {
      user = await User.create({
        name,
        email,
        password, // Pre-save hook hashes this
      });
    } catch (dbErr) {
      // Fallback to in-memory registration
      console.warn("Saving to DB failed, registering user in local array fallback:", dbErr.message);
      const mockId = 'mock_user_' + Date.now();
      user = {
        _id: mockId,
        name,
        email,
        targetRole: "MERN Developer",
        comparePassword: async (pwd) => pwd === password, // Simple plain text check for fallback
      };
      localUsers.push({ ...user, password });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user;
    let isMatch = false;

    try {
      user = await User.findOne({ email });
      if (user) {
        isMatch = await user.comparePassword(password);
      }
    } catch (dbErr) {
      console.warn("DB findOne failed, falling back to local array:", dbErr.message);
      const localUser = localUsers.find(u => u.email === email);
      if (localUser) {
        user = localUser;
        isMatch = localUser.password === password;
      }
    }

    // Default Guest bypass if no user registered and they try logging in with dummy details
    if (!user && email === "guest@devlens.ai") {
      user = {
        _id: "guest_id_12345",
        name: "Developer Guest",
        email: "guest@devlens.ai",
        targetRole: "MERN Developer"
      };
      isMatch = true;
    }

    if (user && isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
