const localStrategy = require('passport-local').Strategy

const passport = require('passport')
const bcrypt = require('bcrypt')
function initialize(passport, getUSerByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUSerByEmail(email)
    if (user == null) {
      return done(null, false, { message: "no user with that email" })
    }

    try {

      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: " Wrong Password" })
      }
    }
    catch (e) {
      return done(e)
    }
  }

  passport.use(new localStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}



module.exports = initialize