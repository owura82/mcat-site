// db.js
const mongoose = require('mongoose');

// define the data in our collection
const Fact = new mongoose.Schema({
    info: String,
    creator: String, 
    level: Number
});


const Subject = new mongoose.Schema({
    name: String,
    facts: [Fact]
});

const character = new mongoose.Schema({
    name: String, 
    state: String
});

// "register" it so that mongoose knows about it
mongoose.model('Fact', Fact);

mongoose.model('Subject', Subject);

mongoose.model('Character', character);


// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/mcat';
}

mongoose.connect(dbconf);
