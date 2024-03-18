const connection = require('../db');

exports.login = (req,res) =>{
    const { email,password  } = req.body;
    connection.query('SELECT * FROM `admin` WHERE email = ?',[email],async(error,result)=>{
        if(error){
             console.log(error);
           return res.status(500).send("Internal server error");

        }
        if(result.length == 0){
          return res.redirect('/?message='+ encodeURIComponent('Email does not exist.'));

        }
        const isMatch = (password === result[0].password);
        if(isMatch){
            req.session.admin = {
                email: email
            };
            
            res.cookie('loggedIn', true, { maxAge: 14400000, httpOnly: true });

            return res.redirect('/dashboard');
        }
        else{
           return res.redirect('/?message='+ encodeURIComponent('Password does not match.'));

        }
    });
}
exports.updateAppointment = (req,res) =>{
    const {appointmentId,updateDate,updateTime} = req.body;
    // console.log(appointmentId,updateDate , updateTime);
    const updateQuery = `UPDATE appointment SET date = ?, time = ? WHERE appointment_id = ?`;
    connection.query(updateQuery, [updateDate, updateTime, appointmentId], (error, results) => {
        if (error) {
          console.error('Error updating appointment:', error);
          return;
        }
        res.redirect('/appointment?message='+ encodeURIComponent('Appointment Update Successfully'));
      });
}

exports.addDoctor = (req,res) =>{
    const {DoctorName,contact,address,specialization,med_lis} = req.body;
    // console.log(DoctorName,contact,address,specialization,med_lis);
    connection.query('INSERT INTO doctor(doctor_name,contact,address,specialization,medical_license) VALUES(?,?,?,?,?)',[DoctorName,contact,address,specialization,med_lis],(error)=>{
        if(error){
            console.log(error);
        }
        res.redirect('/doctor?message='+ encodeURIComponent('Doctor Added Successfully'))
    });
}

exports.editDoctor = (req, res) => {
    const { doctorId, DoctorName, contact, address, specialization, med_lis } = req.body;
    const updateDoctor = 'UPDATE doctor SET doctor_name = ?, contact = ?, address = ?, specialization = ?, medical_license = ? WHERE doctor_id = ?';
    connection.query(updateDoctor, [DoctorName, contact, address, specialization, med_lis, doctorId], (error) => {
        if (error) {
            console.log(error);
        }
        res.redirect('/doctor?message=' + encodeURIComponent('Doctor Updated Successfully'));
    });
};

exports.editPatient = (req,res) =>{
    const { patientId, patientName, contact, username } = req.body;
    const updatePatient = 'UPDATE patient SET full_name = ?, phone_number = ?, username = ? WHERE patient_id = ?';
    connection.query(updatePatient, [patientName, contact, username, patientId], (error) => {
        if (error) {
            console.log(error);
        }
        res.redirect('/patient?message=' + encodeURIComponent('Patient Updated Successfully'));
    });
}