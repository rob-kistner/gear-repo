const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

// get the ensureAuthenticated helper
const { ensureAuthenticated } = require('../helpers/auth')

// load idea model
require('../models/Idea')
const Idea = mongoose.model('ideas')

// get Ideas
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({
    user : req.user.id
  })
    .sort({ title: 'asc' })
    .then((ideas) => {
      res.render('ideas/index', {
        ideas : ideas
      })
    })
})

// Add New Idea
// ensureAuthenticated is the handlebars helper
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add')
})

// Edit Idea
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id : req.params.id
  }).then((idea) => {
    // test for correct user,
    // back to index if it's not
    if (idea.user != req.user.id) {
      req.flash('error_msg', 'Not authorized for that video')
      res.redirect('/ideas')
    } else {
      res.render('ideas/edit', { idea: idea })
    }
  })
})

// Post Idea
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = []
  if (!req.body.title) {
    errors.push({
      text : 'Please add a title'
    })
  }
  if (!req.body.details) {
    errors.push({
      text : 'Please add some details for this video'
    })
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors  : errors,
      title   : req.body.title,
      details : req.body.details
    })
  } else {
    const newVid = {
      title   : req.body.title,
      details : req.body.details,
      user    : req.user.id
    }
    new Idea(newVid).save().then((idea) => {
      req.flash('success_msg', 'Video idea has been added.')
      res.redirect('/ideas')
    })
  }
})

// edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({ _id: req.params.id }).then((idea) => {
    // new values
    idea.title = req.body.title
    idea.details = req.body.details
    idea.save().then((idea) => {
      req.flash('success_msg', 'Video idea has been updated.')
      res.redirect('/ideas')
    })
  })
})

// delete idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'Video idea has been removed.')
    res.redirect('/ideas')
  })
})

module.exports = router
