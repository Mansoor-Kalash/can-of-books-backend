"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const axios = require("axios");
const mongoose = require("mongoose");

const App = express();
App.use(cors());
App.use(express.json());
mongoose.connect(`${process.env.mongo_link}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Book = new mongoose.Schema({
  email: String,
  title: String,
  description: String,
  status: String,
});

const bookModel = mongoose.model("book", Book);
function seedDataCollection() {
  const JavaScript = new bookModel({
    email: "mansoor.jow@gmail.com",
    title: "Eloquent JavaScript",
    description:
      "Completely revised and updated, this best-selling introduction to programming in JavaScript focuses on writing real applications. JavaScript lies at the heart of almost every modern web application, from social apps like Twitter to browser-based game frameworks like Phaser and Babylon.",
    status: "good",
  });
  const Java = new bookModel({
    email: "mansoor.jow@gmail.com",
    title: "Head First Java",
    description:
      'Between Moores law and the notion of "Internet time," were constantly being bombarded with more and more information--most of it in the form of disorganized data.',
    status: "good",
  });
  const Practice = new bookModel({
    email: "mansoor.jow@gmail.com",
    title: "Java Concurrency in Practice",
    description:
      "I was fortunate indeed to have worked with a fantastic team on the design and implementation of the concurrency features added to the Java platform in Java 5.0 and Java 6. Now this same team provides the best explanation yet of these new features,",
    status: "good",
  });

  JavaScript.save();
  Java.save();
  Practice.save();
}
// seedDataCollection();

App.get("/book", getFavBook);
App.post("/addbook", newFavBook);
App.delete("/deletebook/:bookId", deleteBook);
App.put("/updatebook/:bookId", updateCatHandler);
App.get("/", homeHandler);
// App.get("*", notFoundHandler);

function homeHandler(req, res) {
  res.send("all good");
}
// function notFoundHandler(req, res) {
//   res.status(404).send({
//     error: "Unable to get the route",
//   });
// }

function getFavBook(req, res) {
  console.log("inside getCatsHandler func");
  let emailquery = req.query.email;
  bookModel.find({ email: emailquery }, function (err, userBook) {
    if (err) {
      console.log("error in getting the data");
    } else {
      console.log(userBook);
      res.send(userBook);
    }
  });
}
async function newFavBook(req, res) {
  console.log("hhhhhhhhhhhh", req.body);
  let { title, description, status, email } = req.body;
  const newBook = new bookModel({
    email: email,
    title: title,
    description: description,
    status: status,
  });

  await newBook.save();

  bookModel.find({ email: email }, function (err, userBook) {
    if (err) {
      console.log("error in getting the data");
    } else {
      console.log(userBook);
      res.send(userBook);
    }
  });
  // console.log("fffffffffffffffffffffffffffffffffff");
}

function deleteBook(req, res) {
  let getBookId = req.params.bookId;
  let userEmail = req.query.email;

  console.log("ffffffff", getBookId);
  bookModel.remove({ _id: getBookId }, function (err, userBook) {
    if (err) {
      console.log("error in getting the data", userBook);
    } else {
      console.log("delete", userBook);

      bookModel.find({ email: userEmail }, function (err, bookdata) {
        if (err) {
          console.log("error in getting the data");
        } else {
          console.log(bookdata);
          res.send(bookdata);
        }
      });
    }
  });
}

function updateCatHandler(req, res) {
  let { title, description, status,email } = req.body;
  let getBookId = req.params.bookId;


  bookModel.findOne({ _id: getBookId }, (error, userBook) => {
    userBook.email= email;
    userBook.title = title;
    userBook.description = description;
    userBook.status = status;

    userBook.save()
      .then(() => {
        bookModel.find({ email: userBook.email }, function (err, bookdata) {
          if (err) {
            console.log("error in getting the data");
          } else {
            console.log(bookdata);
            res.send(bookdata);
          }
        });
      })
      .catch((error) => {
        console.log("error in saving ");
      });
  });
}

const PORT = process.env.PORT;

// App.get('/book', (request, response) => {

//   // TODO:
//   // STEP 1: get the jwt from the headers
//   // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
//   // jsonwebtoken dock - https://www.npmjs.com/package/jsonwebtoken
//   // STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end

// })

// class book{
//   constructor(title,description,status,email){
// this.title=title;
// this.description=description;
// this.status=status;
// this.email=email;
//   }

// }

App.listen(PORT, () => console.log(`listening on ${PORT}`));
