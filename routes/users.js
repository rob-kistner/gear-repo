const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router()

// load User model
require('../models/User')
const User = mongoose.model('users')

// user login route
router.get('/login', (req, res) => {
  res.render('users/login')
})

// user registration route
router.get('/register', (req, res) => {
  res.render('users/register')
})

// login form POST, uses Passport
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect : '/ideas',
    failureRedirect : '/users/login',
    failureFlash    : true
  })(req, res, next)
})

// register form POST
router.post('/register', (req, res) => {
  let errors = []
  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' })
  }
  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' })
  }
  if (errors.length > 0) {
    res.render('users/register', {
      errors    : errors,
      name      : req.body.name,
      email     : req.body.email,
      password  : req.body.password,
      password2 : req.body.password2
    })
  } else {
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        req.flash('error_msg', 'Email already registered')
        res.redirect('/users/register')
      } else {
        const newUser = new User({
          name     : req.body.name,
          email    : req.body.email,
          password : req.body.password
        })
        // encrypt password using bcrypt
        // 10 characters in length
        bcrypt.genSalt(10, (err, salt) => {
          // hash in the callback function is the
          // actual hashed password
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            // replace plain text password with
            // encrypted hash version
            newUser.password = hash
            // save user
            newUser
              .save()
              .then((user) => {
                req.flash('success_msg', 'You are now registered, try logging in now')
                res.redirect('/users/login')
              })
              .catch((err) => {
                console.log(err)
                return
              })
          })
        })
      }
    })
  }
})

// logout user
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are logged out')
  res.redirect('/users/login')
})

module.exports = router
