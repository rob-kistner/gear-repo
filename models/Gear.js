const mongoose = require('mongoose')

// using schema engine in mongoose
const Schema = mongoose.Schema

// schema definition
const GearSchema = new Schema({
  category       : {
    type     : String,
    required : true
  },
  manufacturer   : {
    type     : String,
    required : true
  },
  description    : {
    type     : String,
    required : true
  },
  purchase_price : {
    type     : Number,
    required : false
  },
  sell_price     : {
    type     : Number,
    required : false
  },
  date_added     : {
    type    : Date,
    default : Date.now
  },
  date_updated   : {
    type    : Date,
    default : Date.now
  }
})

mongoose.model('gear', GearSchema)
