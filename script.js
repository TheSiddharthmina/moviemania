'use strict';

const navOpenBtn = document.querySelector("[data-menu-open-btn]");
const navCloseBtn = document.querySelector("[data-menu-close-btn]");
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");

const navElemArr = [navOpenBtn, navCloseBtn, overlay];

for (let i = 0; i < navElemArr.length; i++) {

  navElemArr[i].addEventListener("click", function () {

    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("active");

  });

}

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {

  window.scrollY >= 10 ? header.classList.add("active") : header.classList.remove("active");

});


const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {

  window.scrollY >= 500 ? goTopBtn.classList.add("active") : goTopBtn.classList.remove("active");

});
function search() {
    var input = document.getElementById('searchInput').value;
    // You can perform any search logic here, such as fetching data from a server
    // For demonstration purposes, let's just display the search query
    document.getElementById('searchResults').innerHTML = "You searched for: " + input;
}


document.addEventListener("click", function(event) {
  if (!searchBar.contains(event.target) && !searchBtn.contains(event.target)) {
      searchBar.classList.remove("active");
  }
});
// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

// Create Express app
const app = express();

// Set up middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });

// Define User schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Routes

// Sign-up page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Sign-up POST handler
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.redirect('/signin');
    } catch (error) {
        res.status(500).send('An error occurred. Please try again later.');
    }
});

// Sign-in page
app.get('/signin', (req, res) => {
    res.render('signin');
});

// Sign-in POST handler
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id;
            res.redirect('/dashboard');
        } else {
            res.render('signin', { error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).send('An error occurred. Please try again later.');
    }
});

// Dashboard page
app.get('/dashboard', (req, res) => {
    if (req.session.userId) {
        res.render('dashboard');
    } else {
        res.redirect('/signin');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.status(500).send('An error occurred. Please try again later.');
        } else {
            res.redirect('/signin');
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

