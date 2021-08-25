'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const axios = require('axios');
const mongoose = require('mongoose');


const App = express();
App.use(cors());
mongoose.connect('mongodb://localhost:27017/Book', {useNewUrlParser: true, useUnifiedTopology: true});

const Book = new mongoose.Schema({
  img : String,
  title : String,
  description : String,
  status :String,
  email :String,
});

const bookModel = mongoose.model('book', Book);
function seedDataCollection() {
  const JavaScript = new bookModel({
    img : 'https://images-na.ssl-images-amazon.com/images/I/91asIC1fRwL.jpg',
    title:'Eloquent JavaScript',
    description:'Completely revised and updated, this best-selling introduction to programming in JavaScript focuses on writing real applications. JavaScript lies at the heart of almost every modern web application, from social apps like Twitter to browser-based game frameworks like Phaser and Babylon.',
    status:'good',
    email :'mansoor.jow@gmail.com',
  })
  const Java = new bookModel({
    img : 'https://images-na.ssl-images-amazon.com/images/I/51dBjBGQFXS._SX431_BO1,204,203,200_.jpg',
    title:'Head First Java',
    description:'Between Moores law and the notion of "Internet time," were constantly being bombarded with more and more information--most of it in the form of disorganized data.',
    status:'good',
    email :'mansoor.jow@gmail.com',
  })
  const Practice = new bookModel({
    img :'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQemEUo2qhqhZXvUe8IcVD1ZtQaJgLuTBQ4S4hQZ8kqzEI_ws-Q',
    title:'Java Concurrency in Practice',
    description:'I was fortunate indeed to have worked with a fantastic team on the design and implementation of the concurrency features added to the Java platform in Java 5.0 and Java 6. Now this same team provides the best explanation yet of these new features,',
    status:'good',
    email :'mansoor.jow@gmail.com',
  })



  JavaScript.save();
  Java.save();
  Practice.save();

 
}
// seedDataCollection();

App.get('/book', getFavBook);


function getFavBook(req,res) {
  console.log('inside getCatsHandler func')
  let emailquery = req.query.email;
  bookModel.find({email:emailquery},function(err,userBook){
      if(err) {
          console.log('error in getting the data')
      } else {
          console.log(userBook);
          res.send(userBook);
      }
  })
}

const PORT = process.env.PORT;

App.get('/book', (request, response) => {

  // TODO: 
  // STEP 1: get the jwt from the headers
  // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
  // jsonwebtoken dock - https://www.npmjs.com/package/jsonwebtoken
  // STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end

})

App.listen(PORT, () => console.log(`listening on ${PORT}`));
