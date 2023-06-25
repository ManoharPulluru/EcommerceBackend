const express = require('express');
const app = express();
const schema = require('../../model/user/user');
const cartSchema = require('../../model/cart/cart');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.post('/addtocart', async (req, res) => {
  try {
    const authToken = req.headers.token;
    if (!authToken) {
      return res.status(400).send({ message: 'Unauthorized user', statusCode: 400 });
    }

    const { email } = jwt.verify(authToken, process.env.SECRET_KEY);
    const user = await schema.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: 'Unauthorized user', statusCode: 400 });
    }

    const { productId } = req.body;
    const productResponse = await axios.get('https://fakestoreapi.com/products/');
    const products = productResponse.data;

    const selectedProduct = products.find(product => product.id === productId);

    if (selectedProduct) {
      const userCart = await cartSchema.findOne({ email });

      if (userCart) {
        userCart.cart.push(selectedProduct);
        await userCart.save();
      } else {
        await cartSchema.create({
          email,
          cart: [selectedProduct],
        });
      }

      return res.status(200).send({ message: 'Product added to cart', statusCode: 200 });
    } else {
      return res.status(400).send({ message: 'Product not found', statusCode: 400 });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Error adding product to cart', statusCode: 500 });
  }
});

app.get('/cartlist', async (req, res) => {
  try {
    const authToken = req.headers.token;
    const { email } = jwt.verify(authToken, process.env.SECRET_KEY);
    const user = await schema.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: 'Unauthorized user', statusCode: 400 });
    }

    const userCart = await cartSchema.findOne({ email });

    if (userCart) {
      return res.status(200).send({ message: 'User cart list fetched', data: userCart.cart, statusCode: 200 });
    } else {
      return res.status(400).send({ message: 'No cart found', statusCode: 400 });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal server error', statusCode: 500 });
  }
});

module.exports = app;
