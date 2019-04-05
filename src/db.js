// db.js
const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

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


// "register" it so that mongoose knows about it
mongoose.model('Fact', Fact);

mongoose.model('Subject', Subject);

mongoose.connect('mongodb://localhost/mcatsite');
