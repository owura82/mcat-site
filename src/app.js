const express = require('express');
const path = require('path');
require('./db');
const mongoose = require('mongoose');
const sanitize =  require('mongo-sanitize');
const session = require('express-session');

const Char = mongoose.model("Character");

const User = mongoose.model("User");
const Subject = mongoose.model("Subject");
const Fact = mongoose.model("Fact");



const app = express();

//for handlebars
app.set('view engine', 'hbs');

//for being able to access the body and query strings of requests
app.use(express.urlencoded({ extended: false }));


//session management - this allows access to req.session
const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false 
};

app.use(session(sessionOptions));

const publicPath = path.resolve(__dirname, "public");

//static file miiddleware
app.use(express.static(publicPath));



app.get('/', function (req, res){
    //homepage
    //tells the user about the site 
    //link to page that allows them to create an account 
    //link to page that allows them to see some site generated subjects and associated facts 
    
});


app.post('/sign-in', function(req, res){
    //forms that handles a user signinn into their account


});


app.get('/sign-in', function(req, res){
    res.render('sign-in');
});


app.post('/new-account', function(req, res){
    //process user request to create a new account 
    //if anything is invalid, redisplay the create account form with error message 
    //else redirect to the sign up page where the user can use new credentials to log in 
    console.log(req.sessionID);

    //sanitize request
    const name = sanitize(req.body.name);
    const user = sanitize(req.body.username);
    const password = sanitize(req.body.password);
    if(name==='' || user==='' || (password==='' || password.length<5)){
        res.render('create-acc', {error: "Cannot leave any fields blank and password must be at least 5 characters long"});
            return; 
    }

    //first check if there is a user with the username in the database
    User.find({username:user}, function(err, found){
        if(err){
            console.log("error in searching for username")
        }

        else if(found.length !== 0){
            //render the page below if there is an error 
            res.render('create-acc', {error: "username already exists"});
            return; 
        }
    });

    //insert username into database 
    const newUser = new User({
        Name: name, 
        username: user,
        password: password,
        subjects: []
    });

    newUser.save(function(err, saved){
        if(err){
            console.log("could not save new user");
            return;
        }
        res.render('sign-in');

    });



});


app.get('/addsubject',function(req, res){
    //display the form that allows the user to add a new subject they are interested in 

}); 

app.post('/addsubject', function(req, res){
    //process request to add new subject 
    //redirect back to user home page with a list of subjects 

});


app.get('/home', function(req, res){
    //the home page that user with accounts can see
    //shows the list of subjects that are links to the subjects' facts

});


app.get('/home/:subject', function(req, res){
    //list the subjects facts 
    //add link to go back to subject list 

});




/*

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

*/
app.listen(process.env.PORT || 3000);