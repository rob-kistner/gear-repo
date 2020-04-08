/* -----------------------------------------
  helpers
------------------------------------------*/
module.exports = {
  ensureAuthenticated : function(req, res, next) {
    // isAuthenticated is a passport function
    if (req.isAuthenticated()) {
      return next()
    }
    // error out as not authorized if
    // not logged in
    req.flash('error_msg', 'Not authorized')
    res.redirect('/users/login')
  }
}
