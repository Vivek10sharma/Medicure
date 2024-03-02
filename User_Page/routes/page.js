const express = require('express');
const connection = require('../db');


const routes = express();

routes.get('/',(req,res)=>{
    res.render('home');
  });
  routes.get('/login',(req,res)=>{
    res.render('users/login');
  });
  routes.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('login');
  });
  routes.get('/signup',(req,res)=>{
    res.render('users/signup');
  });
  routes.get('/dashboard',(req,res)=>{
    if (req.session.user) {
      res.render('users/dashboard', { user: req.session.user });
  } else {
      res.redirect('/login');
  }
  });
  routes.get('/about',(req,res)=>{
    if (req.session.user) {
      res.render('users/about', { user: req.session.user });
  } else {
      res.redirect('/login');
  }
  });
  routes.get('/Booking',(req,res)=>{
    if (req.session.user) {
      res.render('users/Booking', { user: req.session.user });
  } else {
      res.redirect('/login');
  }
  });
  routes.get('/viewdoctor',(req,res)=>{
    if (req.session.user) {
      res.render('users/viewdoctor', { user: req.session.user });
  } else {
      res.redirect('/login');
  }
  });
routes.get('/doctordetail/:doctor_id', (req, res) => {
  if (req.session.user) {
      const doctor_id = parseInt(req.params.doctor_id);
      connection.query('SELECT * FROM doctor WHERE doctor_id = ?', [doctor_id], (error, result) => {
          if (error) {
              console.log(error);
              return res.status(500).send('Internal Server Error');
          }
          const doctor = result[0];
          res.render('users/doctordetail', { doctor: doctor, user: req.session.user }); 
      });

  } else {
      res.redirect('/login');
  }
});

  routes.get('/contact',(req,res)=>{
    if (req.session.user) {
      res.render('users/contact', { user: req.session.user });
  } else {
      res.redirect('/login');
  }
  });

  routes.get('/viewbooking/:doctor_id/:date/:time/:appointment_id', (req, res) => {
    if (req.session.user) { 
        const date = req.params.date;
        const time = req.params.time;
        const doctor_id = parseInt(req.params.doctor_id);
        const appointment_id = parseInt(req.params.appointment_id);
        connection.query('SELECT doctor_name FROM `doctor` WHERE doctor_id = ?', [doctor_id], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send("Internal Server Error");
            }
            const doctor_name = result[0].doctor_name;
            connection.query('SELECT * FROM `appointment` WHERE appointment_id  = ?', [appointment_id], (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send("Internal Server Error");
                }
                const appointments = result.map(appointment => {
                  const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                  return {
                      doctorName: doctor_name,
                      Date: formattedDate,
                      Time: appointment.time,
                  };
              });
            
              res.redirect('/viewbooking?message='+ encodeURIComponent('Appointment Booked Successfully'));

            });
        });
    } else {
        res.redirect('/login');
    }
});

routes.get('/viewbooking', (req, res) => {
  if (req.session.user) {
      const username = req.session.user.username;
      connection.query('SELECT patient_id FROM `patient` WHERE username = ?', [username], (error, result) => {
          if (error) {
              console.log(error);
              return res.status(500).send("Internal Server Error");
          }
          const patient_id = result[0].patient_id;
          let numOfBookings = 0;
          if (req.session.numOfBookings) {
              numOfBookings = req.session.numOfBookings;
          }
          connection.query('SELECT COUNT(*) AS total FROM `appointment` WHERE patient_id = ?', [patient_id], (error, resultCount) => {
              if (error) {
                  console.log(error);
                  return res.status(500).send("Internal Server Error");
              }
              numOfBookings = resultCount[0].total;
              req.session.numOfBookings = numOfBookings;
              connection.query('SELECT * FROM `appointment` WHERE patient_id = ?', [patient_id], (error, result) => {
                  if (error) {
                      console.log(error);
                      return res.status(500).send("Internal Server Error");
                  }
                  const doctor_ids = result.map(a => a.doctor_id);
                  connection.query('SELECT doctor_name, doctor_id FROM `doctor` WHERE doctor_id IN (?)', [doctor_ids], (error, doctorResult) => {
                      if (error) {
                         res.render('users/viewbooking');
                      }
                      const appointments = result.map(appointment => {
                        const doctorData = doctorResult.find(d => d.doctor_id === appointment.doctor_id);
                        const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                        return {
                            appointmentId: appointment.appointment_id,
                            doctorName: doctorData && doctorData.doctor_name,
                            Date: formattedDate,
                            Time: appointment.time
                        };
                      });
                      res.render('users/viewbooking', {
                          user: req.session.user,
                          numOfBookings,
                          appointments
                      });
                  });
              });
          });
      });
  } else {
      res.redirect('/login');
  }
});
routes.get('/viewbooking', (req, res) => {
  if (req.session.user) {
      const username = req.session.user.username;
      connection.query('SELECT patient_id FROM `patient` WHERE username = ?', [username], (error, result) => {
          if (error) {
              console.log(error);
              return res.status(500).send("Internal Server Error");
          }
          const patient_id = result[0].patient_id;
          let numOfBookings = 0;
          if (req.session.numOfBookings) {
              numOfBookings = req.session.numOfBookings;
          }
          connection.query('SELECT COUNT(*) AS total FROM `appointment` WHERE patient_id = ?', [patient_id], (error, resultCount) => {
              if (error) {
                  console.log(error);
                  return res.status(500).send("Internal Server Error");
              }
              numOfBookings = resultCount[0].total;
              req.session.numOfBookings = numOfBookings;
              connection.query('SELECT * FROM `appointment` WHERE patient_id = ?', [patient_id], (error, result) => {
                  if (error) {
                      console.log(error);
                      return res.status(500).send("Internal Server Error");
                  }
                  const doctor_ids = result.map(a => a.doctor_id);
                  connection.query('SELECT doctor_name, doctor_id FROM `doctor` WHERE doctor_id IN (?)', [doctor_ids], (error, doctorResult) => {
                      if (error) {
                         res.render('users/viewbooking');
                      }
                      const appointments = result.map(appointment => {
                        const doctorData = doctorResult.find(d => d.doctor_id === appointment.doctor_id);
                        const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                        return {
                            appointmentId: appointment.appointment_id,
                            doctorName: doctorData && doctorData.doctor_name,
                            Date: formattedDate,
                            Time: appointment.time
                        };
                      });
                      res.render('users/viewbooking', {
                          user: req.session.user,
                          numOfBookings,
                          appointments
                      });
                  });
              });
          });
      });
  } else {
      res.redirect('/login');
  }
});


routes.get('/deleteAppointment/:appointmentId',(req,res)=>{
    const appointment_id = req.params.appointmentId;

    connection.query('DELETE FROM `appointment` WHERE appointment_id = ?',[appointment_id],(error)=>{
        if(error){
            console.log(error);
        }
        res.redirect('/viewbooking?message='+ encodeURIComponent('Appointment Delected Successfully'));

    });
});

  module.exports = routes;