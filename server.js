const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user/routes');
const cartRoutes = require('./routes/carts/cart');
require('dotenv').config()
const app = express();

app.use(cors());
app.use(express.json());
const port = process.env.PORT
mongoose.connect(process.env.MONGO_DB).then((err)=>{
  console.log('mongoose connected...');
  app.listen(port, () => {
    console.log('Running on port 3030');
  });
}).catch((err)=>{
  console.log('Error====>',err)
})

app.get('/',(req,res)=>{
  res.send('Server Running...')
})

//middlewares apis
app.use('/user',userRoutes);
app.use('/cart',cartRoutes);
