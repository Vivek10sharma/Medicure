const express = require('express');
const authController = require('../controllers/auth')

const routes = express();
routes.post('/signup', authController.signup);
routes.post('/login',authController.login);
routes.post('/viewdoctor', authController.getDoctorsBySpecialization);
routes.post('/viewbooking/:doctor_id', authController.viewbook);
routes.post('/updatebooking/:appointmentId', authController.updatebook);



  module.exports = routes;
  