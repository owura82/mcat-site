const express = require('express');
const path = require('path');
require('./db');
const mongoose = require('mongoose');
const sanitize =  require('mongo-sanitize');
const session = require('express-session');

//const Char = mongoose.model("Character");


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

//functions for sorting 

function mergeSort (arr) {
    if (arr.length === 1) {
      // return once we hit an array with a single item
      return arr
    }
  
    const middle = Math.floor(arr.length / 2) // get the middle item of the array rounded down
    const left = arr.slice(0, middle) // items on the left side
    const right = arr.slice(middle) // items on the right side
  
    return merge(
      mergeSort(left),
      mergeSort(right)
    )
  }
  
  // compare the arrays item by item and return the concatenated result
  function merge (left, right) {
    let result = [];
    let indexLeft = 0;
    let indexRight = 0;
  
    while (indexLeft < left.length && indexRight < right.length) {
      if (left[indexLeft].score < right[indexRight].score) {
        result.push(left[indexLeft]);
        indexLeft++;
      } else {
        result.push(right[indexRight]);
        indexRight++;
      }
    }
  
    return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight));
  }


function insertionSort(arr){
    for (let i = 0; i < arr.length; i++) {
        let value = arr[i];
        // store the current item value so it can be placed right
        let j;
        for (j = (i - 1); j > -1 && arr[j].score > value.score; j--) {
          // loop through the items in the sorted array (the items from the current to the beginning)
          // copy each item to the next one
          arr[j + 1] = arr[j];
        }
        // the last item we've reached should now hold the value of the currently sorted item
        arr[j + 1] = value;
      }
    
      return arr;

}


//class that contains functions to manipulate data 
class Manipulate{
    
       sortFacts(arr, sorter){
        //sort facts accoridng to amount of votes
        //use the pased in sorting function to sort facts (HOF)
        const sorted = sorter(arr);
        return sorted;

    }

    filterFacts(arr, limit){
    //filter facts based on some threshold 
    //use map.filter
    const filtered = arr.filter((ele) =>{
        if(ele.score>=limit){
            return ele;
        }
    });

    return filtered;
    }

}

const manipulator = new Manipulate();


app.get('/subjects', function(eq, res){

    Subject.find(function(err, found){
        if(err){
            console.log("Could not find subjects");
            return;
        }

        res.render('subjects', {subjects:found});
    });

});
/*
app.get('/facts', function(req, res){
 
    Fact.find(function(err, found){
        if(err){
            console.log("Could not find subjects");
            return;
        }

        let sorter;
        (found.length >10) ? sorter = mergeSort : sorter = insertionSort;

        const sorted = manipulator.sortFacts(found, sorter);

        res.render('facts', {facts:sorted});
    });

});

app.post('/facts', function(req, res){
    //url posted to when user makes request to filter facts
    Subject.find({name:req.body.subject}, function(err, found){
        if(err){
            console.log("Could not find subjects");
            return;
        }

        if(found.length === 0){
        console.log('could not find subject in order to filter facts.')
        return;
        }
        
        const lim = sanitize(req.body.number);
        const filtered = manipulator.filterFacts(found[0].facts, lim);
        console.log('unfiltered array is \n', found[0].facts, "\n and filtered array is \n", filtered);

        res.render('facts', {facts:filtered, subject:found[0].slug, subjectname:found[0].name});
    });

});
*/

app.post('/addfact',function(req, res){
    //add a new fact
    const fact = sanitize(req.body.fact);
    if(fact===''){
        res.json({error:"Fact cannot be empty"})
        return;
    }

    Fact.find({info:fact}, function(err, found){
        if(found.length !== 0){
            res.json({error:"Fact already exists"})
        return;
        }

    });

    const newFact = new Fact({
        info: fact,
        score:0
    });

    //need to add the new fact to its associated subject
    Subject.findOneAndUpdate({slug:req.body.subject}, {$push: {facts: newFact}}, function(err, doc, resp){

        if(err){console.log("Could not add fact to subject")}

        else{
            res.json(newFact);
        }

    });

}); 

app.post('/addsubject', function(req, res){
    //process request to add new subject 
    
    const sub = sanitize(req.body.subject);
    if(sub===''){
        res.json({error:"Subject cannot be empty"})
        return;
    }

    Subject.find({name:sub}, function(err, found){
        if(found.length !== 0){
            res.json({error:"Subject already exists"})
        return;
        }

    });

    const newSub = new Subject({
        name: sub, 
        facts:[],
        site: false,
        user: true
    })

    newSub.save(function(err){

        if(err){
            console.log('unable to save subejct');
            return;
        }
        res.json(newSub);
    
    });
    

});

app.get('/:subj', function(req, res){
    //display facts for subjects
    const cleanSlug = sanitize(req.params.subj);
    Subject.find({slug: cleanSlug}, function(err, found){
        if(err || found.length===0){
            console.log('could not find subject using slug ');
            return;
        }

        let sorter;
        (found[0].facts.length >10) ? sorter = mergeSort : sorter = insertionSort;

        let sorted = manipulator.sortFacts(found[0].facts, sorter);
        sorted = sorted.reverse();
        const barsObject = {
            facts: sorted,
            subject: cleanSlug,
            subjectname: found[0].name
        }

        res.render('facts', barsObject);
    });


});


app.post('/updatescore', function(req, res){
    //sanitize input 
    const score = JSON.parse(sanitize(req.body.score));
    
    Subject.findOne({name:req.body.subject}, function(err, subject) {
        if(err){
            console.log('could not find subject to update fact score');
            return;
        }

        let toreturn;
        for (let i = 0; i < subject.facts.length; i++) {
            
            if(subject.facts[i].info === req.body.fact){

                subject.facts[i].score += score;
                toreturn = subject.facts[i];
                break;
            }
        }

        subject.markModified('facts');
        subject.save(function(err, subject) {
            if(err){
                console.log('could not save updated fact', err);
                return;
            }

            res.send({update: toreturn})
        });
    });

});





/*
app.post('/new-account', function(req, res){
    //process user request to create a new account 
    //if anything is invalid, redisplay the create account form with error message 
    //else redirect to the sign up page where the user can use new credentials to log in 
    console.log(req.session.id);

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
*/



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