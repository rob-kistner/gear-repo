// login into respective database for
// deployment on mLab/Heroku or local
if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI : 'mongodb://vidjot-admin:Passw0rd!@ds151943.mlab.com:51943/vidjot-prod'
  }
} else {
  module.exports = {
    mongoURI : 'mongodb://localhost/vidjot-dev'
  }
}
