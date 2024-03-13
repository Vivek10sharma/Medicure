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