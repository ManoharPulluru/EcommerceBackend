const schema = require('../../model/user/user');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

app.post('/signup', async (req, res) => {
  const { username, password, email , mobile } = req.body;
  const user = await schema.findOne({ email });
  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await schema.create({ username, password: hashedPassword,email,mobile });
    res.send({message:'New user has created',statuscode:200});
  } else {
    res.send({message:'User already exists',statuscode:400});
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await schema.findOne({ email });
  if (!user) {
    res.send({message:'User not found',statuscode:400});
  } else {
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (passwordMatched) {
      const token = jwt.sign({ email }, process.env.SECRET_KEY);
      res.status(200).send({ token, message:'Success', statuscode:200 });
    } else {
      res.send({message:'Invalid Password',statuscode:400});
    }
  }
});
module.exports = app;