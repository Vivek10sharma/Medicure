const express = require('express');
const authController = require('../controllers/auth')

const routes = express();
routes.post('/login',authController.login);


  module.exports = routes;
  