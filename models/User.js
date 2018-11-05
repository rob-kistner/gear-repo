const mongoose = require('mongoose')

// using schema engine in mongoose
const Schema = mongoose.Schema

// UserSchema schema
const UserSchema = new Schema({
  name     : {
    type     : String,
    required : true
  },
  email    : {
    type     : String,
    required : true
  },
  password : {
    type     : String,
    required : true
  },
  date     : {
    type    : Date,
    default : Date.now
  }
})

// export as users object
mongoose.model('users', UserSchema)
