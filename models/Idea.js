const mongoose = require('mongoose')

// using schema engine in mongoose
const Schema = mongoose.Schema

// IdeaSchema schema
const IdeaSchema = new Schema({
  title   : {
    type     : String,
    required : true
  },
  details : {
    type     : String,
    required : true
  },
  user    : {
    type     : String,
    required : true
  },
  date    : {
    type    : Date,
    default : Date.now
  }
})

mongoose.model('ideas', IdeaSchema)
