const express = require('express');
const expressHbs = require("express-handlebars");
const connection = require('./db');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');


const port = 3000;
const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'viveksharma',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

app.use("/static", express.static(__dirname + "/public"));

app.use('/',require('./routes/page'));
app.use('/path',require('./routes/path'));



const hbs = expressHbs.create({
    extname: ".hbs",
    defaultLayout: "main.hbs",
    layoutsDir: "views/layouts/",
  });

  
  app.engine("hbs", hbs.engine);
  app.set("view engine", "hbs");
  

  app.post('/submit',(req,res,next)=>{
    const { patient_name, phone_number, username, password, confirmpassword} = req.body;
  });

    app.listen(port, () => {
        console.log(`http://localhost:${port}`);
      });