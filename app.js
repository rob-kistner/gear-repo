/* -----------------------------------------
  REQUIREs
------------------------------------------*/
const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')

// mLab or local deployment database
const db = require('./config/database')

// mongoDB for javascript
const mongoose = require('mongoose')

// get the ensureAuthenticated helper
// const { ensureAuthenticated } = require('./helpers/auth')

// ----------------------------------------
// ----------------------------------------

const app = express()

// load routes
const gear = require('./routes/gear')
const users = require('./routes/users')

// passport config
require('./config/passport')(passport)

// globals
const port = process.env.PORT || 5000

/* -----------------------------------------
  MongoDB
------------------------------------------*/

// Connect to mongodb
mongoose
  .connect(db.mongoURI, { useNewUrlParser: true })
  .then(() => console.log(`MongoDB connected at ${db.mongoURI}`))
  .catch((err) => console.log(err))

/* -----------------------------------------
  MIDDLEWARE
------------------------------------------*/

// Handlebars template engine
// app.engine(
//   'handlebars',
//   exphbs({
//     defaultLayout : 'main'
//   })
// )
// app.set('view engine', 'handlebars')
app.set('view engine', 'pug')

// BodyParser for POST requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// static folder middleware
app.use(express.static(path.join(__dirname, 'public')))

// Method Override middleware for PUT requests
app.use(methodOverride('_method'))

// express-session middleware
app.use(
  session({
    secret            : 'secret',
    resave            : true,
    saveUninitialized : true
  })
)

// passport session middleware
// Note: MUST APPEAR AFTER THE EXPRESS SESSION!
// app.use(passport.initialize())
// app.use(passport.session())

// connect-flash
app.use(flash())

// globals
// expose these in the template for flash messages
//
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  // if logged in...
  // res.locals.user = req.user || null
  next()
})

/* -----------------------------------------
  ROUTES
------------------------------------------*/

// Home
app.get('/', (req, res) => {
  res.render('index')
})

// About
app.get('/about', (req, res) => {
  res.render('about')
})

// init routes
app.use('/gear', gear)
// app.use('/users', users)

/* -----------------------------------------
  MAIN
------------------------------------------*/
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
