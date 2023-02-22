const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");

// DESC     register a user
// METHOD   POST /api/v1/user/register
// ACCESS   public
const registerUser = async (req, res) => {
  const { name, email, profile, password } = req.body;

  //   console.log(name, email, profile, password);

  if (!name || !email || !profile || !password) {
    res.status(400).send("A value is missing");
    return;
  }

  // check if user exists already
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).send("User already exists");
    return;
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({
    name,
    email,
    profile,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

// DESC     login a user
// METHOD   POST /api/v1/user/login
// ACCESS   public
const loginUser = async (req, res) => {
  const { name, password } = req.body;

  // console.log(email, password);

  if (!name || !password) {
    res.status(400).send("A value is missing");
    return;
  }

  // Check for user email
  const user = await User.findOne({ name });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send("Invalid credentials");
  }
};

// DESC     get my data
// METHOD   GET /api/v1/user/me
// ACCESS   public
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "4d",
  });
};

module.exports = { registerUser, loginUser, getMe };
