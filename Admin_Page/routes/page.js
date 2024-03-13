const express = require('express');
// const connection = require('../db');


const routes = express();

routes.get('/', (req, res) => {
    res.render('login');
});
routes.get('/dashboard',(req,res)=>{
    if( req.session.admin){
    res.render('admin/dashboard');
    }else{
        res.redirect('/');
    }
})

module.exports = routes;