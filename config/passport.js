const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const mysql = require('mysql')

const con = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: ''
})
con.connect(function (err) {
  if (err) throw err
})

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      const myquery = 'SELECT * FROM user WHERE email = ' + "'" + email + "'"
      con.query(myquery, (err, myuser) => {
        if (err) throw err
        if (myuser.length == 0) {
          return done(null, false, { message: 'That email is not registered' })
        }
        // Match password
        const user1 = myuser[0]
        const user = {
          name: "'" + user1.name + "'",
          email: "'" + user1.email + "'",
          password: "'" + user1.password + "'"
        }

        bcrypt.compare(password, user1.password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Incorrect password' })
          }
        })
      })
    })
  )
  passport.serializeUser((user, done) => {
    done(null, user.email)
  })

  passport.deserializeUser((email, done) => {
    const myquery = `SELECT * FROM user WHERE email = ${email}`
    console.log(myquery)
    con.query(myquery, function (err, result) {
      if (err) throw err
      done(err, result[0])
    })
  })
}
