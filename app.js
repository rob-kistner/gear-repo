/* -----------------------------------------
  REQUIREs
------------------------------------------*/
const express = require('express')
const path = require('path')
// handlebars templating
const exphbs = require('express-handlebars')
// allows for use of request methods like
// PUT and DELETE
const methodOverride = require('method-override')
// connect-flash for flash messaging when
// something happens to a video idea
const flash = require('connect-flash')

const session = require('express-session')

// parses form data
const bodyParser = require('body-parser')

// passport
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
const ideas = require('./routes/ideas')
const users = require('./routes/users')

// passport config
require('./config/passport')(passport)

// globals
const port = process.env.PORT || 5000
// const mongoUrl = 'mongodb://localhost/vidjot-dev'
// const mongoUrlMlab = 'mongodb://vidjot-admin:Passw0rd!@ds151943.mlab.com:51943/vidjot-prod'

// Map global promise - get rid of mongoose warning
// This is NOT required for mongoose v5+
mongoose.Promise = global.Promise

/* -----------------------------------------
  MongoDB
------------------------------------------*/

// Connect using Mongoose
// reference config/database.js for
// database location
mongoose
  .connect(db.mongoURI, {
    useMongoClient : true
  })
  .then(() => console.log(`MongoDB connected at ${db.mongoURI}`))
  .catch((err) => console.log(err))

/* -----------------------------------------
  MIDDLEWARE
------------------------------------------*/

// Handlebars template engine
// will use 'views/layouts/main.handlebars' as default layout
app.engine(
  'handlebars',
  exphbs({
    defaultLayout : 'main'
  })
)
app.set('view engine', 'handlebars')

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
app.use(passport.initialize())
app.use(passport.session())

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
  res.locals.user = req.user || null
  next()
})

/* -----------------------------------------
  ROUTES
------------------------------------------*/

// Home
app.get('/', (req, res) => {
  const title = 'Welcome'
  res.render('index', { title: title })
})

// About
app.get('/about', (req, res) => {
  res.render('about')
})

// use routes for any route starting
// with /ideas
app.use('/ideas', ideas)
app.use('/users', users)

/* -----------------------------------------
  MAIN
------------------------------------------*/
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
