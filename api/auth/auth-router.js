const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('./auth-model'); 
const SECRET = process.env.SECRET || 'shh';

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json("username and password required");
  }
  try {
    const existingUser = await Users.findByUsername(username);
    if (existingUser) {
      return res.status(409).json("username taken");
    }
    const rounds = 8; 
    const hash = bcrypt.hashSync(password, rounds);
    const newUser = await Users.add({ username, password: hash });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "error registering user" });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json("username and password required");
  }
  try {
    const user = await Users.findByUsername(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = buildToken(user);
      res.json({ message: `welcome, ${user.username}`, token });
    } else {
      res.status(401).json("invalid credentials");
    }
   } catch (err) {
    console.log('REGISTER ERROR:', err); 
    res.status(500).json({ message: "error registering user" });
  }
});

function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '1d',
  };
  return jwt.sign(payload, SECRET, options);
}

module.exports = router;
