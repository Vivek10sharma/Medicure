const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const validator = require('validator');
 const connection = require('../db');

// for sign up
exports.signup = async (req, res) => {
    const { full_name, phone_number, username, password, confirmpassword } = req.body;

    if (!validator.matches(full_name, /^([A-Za-z]{1,20})\s+([A-Za-z]{1,20})(\s+[A-Za-z]{1,20})?$/)) {
        return res.redirect('/signup?message1='+ encodeURIComponent('Please provide a valid Full name'));
    }    
    else if (!validator.matches(phone_number, /^(97|98)\d{8}$/)) {
        return res.redirect('/signup?message1=' + encodeURIComponent('Phone number must contain 10 digits & start with 97 or 98'));
    } else if (password !== confirmpassword) {
        return res.redirect('/signup?message1=' + encodeURIComponent('Passwords do not match. Please try again'));
    } else {
        const hashpassword = await bcrypt.hash(password, 10);

        connection.query('SELECT * FROM `patient` WHERE username = ? OR phone_number = ?', [username, phone_number], async (error, result) => {
            if (error) { 
                console.log(error);
                return res.status(500).send("Internal server error");
            }

            if (result.length > 0) {
                if (result[0].username === username) {
                    return res.redirect('/signup?message1=' + encodeURIComponent('The username is already taken. Please choose another.'));
                }
                if (result[0].phone_number === phone_number) {
                    return res.redirect('/signup?message1='+ encodeURIComponent('The phone number is already taken. Please choose another.'));
                }
            } else {
                connection.query('INSERT INTO `patient`(full_name, phone_number, username, password) VALUES(?, ?, ?, ?)', [full_name, phone_number, username, hashpassword], (error) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).send("Internal server error");
                    }
                    req.session.user = {
                        username: username,
                        password:password
                    };

                    res.cookie('loggedIn', true, { maxAge: 3600000, httpOnly: true });

                    return res.redirect('/dashboard');
                });
            }
        });
    }
};


//for login
exports.login = (req,res) =>{
    const { username,password  } = req.body;
    connection.query('SELECT * FROM `patient` WHERE username = ?',[username],async(error,result)=>{
        if(error){
             console.log(error);
           return res.status(500).send("Internal server error");

        }
        if(result.length == 0){
          return res.redirect('/login?message='+ encodeURIComponent('Username does not exist.'));

        }
        const isMatch = await bcrypt.compareSync(password,result[0].password);
        if(isMatch){
            req.session.user = {
                username: username,
                password:password
            };
            
            res.cookie('loggedIn', true, { maxAge: 3600000, httpOnly: true });

            return res.redirect('/dashboard');
        }
        else{
           return res.redirect('/login?message='+ encodeURIComponent('Password does not match.'));

        }
    });
}


// logic for get doctor from specilization

exports.getDoctorsBySpecialization = (req,res) =>{
    const { specialization } = req.body;
    connection.query('SELECT * FROM doctor WHERE specialization = ?', [specialization], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).send('Internal Server Error');
        }
        res.render('users/viewdoctor', { doctor: results, specialization });
      });

}


// for viewdoctor
exports.viewbook = (req, res) => {
    const { date, time } = req.body;
    const doctor_id = parseInt(req.params.doctor_id);
    const username = req.session.user.username; 

    connection.query('SELECT patient_id FROM `patient` WHERE username = ?',[username],(error,result)=>{
        if(error){
            console.log(error);
        }
       const patient_id = result[0].patient_id;
       connection.query('INSERT INTO `appointment` (patient_id, doctor_id, date, time) VALUES(?,?,?,?)',[patient_id,doctor_id,date,time],(error,result)=>{
        if(error){
            console.log(error);
        }
            const appointment_id = result.insertId;
        res.redirect(`/viewbooking/${doctor_id}/${date}/${time}/${appointment_id}`);
    });

       });
  
}


exports.updatebook = (req, res) => {
    const appointment_id = req.params.appointmentId;
    const {updateDate,updateTime} = req.body; 

    const updateQuery = `UPDATE appointment SET date = ?, time = ? WHERE appointment_id = ?`;
    connection.query(updateQuery, [updateDate, updateTime, appointment_id], (error, results) => {
        if (error) {
          console.error('Error updating appointment:', error);
          return;
        }
        res.redirect('/viewbooking?message='+ encodeURIComponent('Appointment Update Successfully'));
      });
}

