//jshint esversion:6

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();

const encrypt = require('mongoose-encryption');

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true} );

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});



userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

encryptedFields: ['age']

const User = new mongoose.model('User', userSchema);




app.get("/", (req,res) => {
  res.render("home");
});

app.get("/login", (req,res) => {
  res.render("login");
});

app.get("/register", (req,res) => {
  res.render("register");
});


app.post("/register", (req,res) => {
  const email = req.body.username;
  const password = req.body.password;

  const newUser = new User({
    email: email,
    password: password
  });

  if(email.length != 0 && password.length != 0){
    newUser.save((err) => {
      if(err){
        console.log(err);
      } else{
        res.render("secrets");
      }
    });
  }
  else{
    res.send("All fields are required");
  }
});

app.post("/login", (req,res) => {
  const email = req.body.username;
  const password = req.body.password;
  User.findOne({email: email}, (err, user) => {
    if(err){
      console.log(err);
    } else{
      if(user){
        if(user.password === password){
          res.render("secrets");
        }
      } else{
        res.redirect("/");
      }
    }
  }
    );


});





















app.listen(3000,() => {
  console.log("Server is running at port 3000");
})
