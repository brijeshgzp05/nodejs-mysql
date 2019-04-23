const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mysql = require('mysql')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

// passport config
require('./config/passport')(passport)

// Db connection
const con = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: ''
})
con.connect(function (err) {
  if (err) throw err
  console.log('Database connected!')
})
module.exports = con

// static
app.use(express.static('public'))

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Body parser
app.use(express.urlencoded({ encoded: false }))

// express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// flash connection
app.use(flash())

// global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 32

app.listen(PORT, console.log(`Server started on port ${PORT}`))
