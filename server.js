if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}
const methodOverride = require('method-override')
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require("express-session")
const intitializePassport = require('./passport-config')
const flash = require('express-flash')
intitializePassport(
  passport,
  email =>
    users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)


const users = []

app.set("view-engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false

}))
app.use(passport.initialize())
app.use(passport.session())
app.get('/', checkAutenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name })
})
app.use(methodOverride('_method'))

app.get('/login', chechNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})
// app.post('/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: 'login',
//   failureFlash: true
// })

app.post('/login', chechNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: 'login',
  failureFlash: true
}))

app.get('/register', chechNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', chechNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')

  }
  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
})
function checkAutenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')

}
function chechNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)