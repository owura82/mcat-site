const express = require('express');
const path = require('path');
require('./db');
const mongoose = require('mongoose');
const sanitize =  require('mongo-sanitize');

const Char = mongoose.model("Character");


const app = express();

//for handlebars
app.set('view engine', 'hbs');

//for being able to access the body and query strings of requests
app.use(express.urlencoded({ extended: false }));


app.get('/', function(req, res){
    //display a form 
    Char.find(function(err, found){

        const barsObject = {
            people: found
        };

        res.render('myform', barsObject);
    });
    
});



app.post('/', function(req, res){
    // use form informtaion to update databse and  show it on the page
    const newchar = new Char({
        name: req.body.character,
        state: req.body.dead
    });

    //insert into database
    newchar.save(function(err, saved){
        if(err){
            console.log("could not save");
        }
    });

    res.redirect('/');


});


app.listen(process.env.PORT || 3000);