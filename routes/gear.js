const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

// get the ensureAuthenticated helper
const { ensureAuthenticated } = require('../helpers/auth')

// load gear model
require('../models/Gear')
const Gear = mongoose.model('gear')

// get gear
router.get('/', (req, res) => {
  Gear.find({})
    .sort({
      category     : 'asc',
      manufacturer : 'asc',
      description  : 'asc'
    })
    .then((gearItems) => {
      res.render('gear/index', {
        gearItems : gearItems
      })
    })
})

// Add new gear item
router.get('/add', (req, res) => {
  res.render('gear/add')
})

// Edit gear item
router.get('/edit/:id', (req, res) => {
  Gear.findOne({
    _id : req.params.id
  }).then((gearItem) => {
    res.render('gear/edit', { gearItem: gearItem })
  })
})

// Post gear item
router.post('/', (req, res) => {
  let errors = []
  if (!req.body.category) errors.push({ text: 'Please add a category' })
  if (!req.body.description) errors.push({ text: 'Please add a description' })
  if (!req.body.manufacturer) errors.push({ text: 'Please add a manufacturer' })

  if (errors.length > 0) {
    res.render('gear/add', {
      errors         : errors,
      category       : req.body.category,
      manufacturer   : req.body.manufacturer,
      description    : req.body.description,
      purchase_price : req.body.purchasePrice,
      sell_price     : req.body.sellPrice,
      date_updated   : Date.now()
    })
  } else {
    const newGearItem = {
      category       : req.body.category,
      manufacturer   : req.body.manufacturer,
      description    : req.body.description,
      purchase_price : req.body.purchasePrice,
      sell_price     : req.body.sellPrice
    }
    new Gear(newGearItem).save().then((gearItem) => {
      req.flash('success_msg', 'Gear item has been added.')
      res.redirect('/gear')
    })
  }
})

// edit form process
router.put('/:id', (req, res) => {
  Gear.findOne({ _id: req.params.id }).then((gearItem) => {
    // new values
    gearItem.category = req.body.category
    gearItem.manufacturer = req.body.manufacturer
    gearItem.description = req.body.description
    gearItem.purchase_price = req.body.purchasePrice
    gearItem.sell_price = req.body.sellPrice
    gearItem.date_updated = req.body.dateUpdated
    gearItem.save().then((gearItem) => {
      req.flash('success_msg', 'The gear item has been updated.')
      res.redirect('/gear')
    })
  })
})

// delete idea
router.delete('/:id', (req, res) => {
  Gear.deleteOne({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'The gear item has been removed.')
    res.redirect('/gear')
  })
})

module.exports = router
