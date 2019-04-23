var mysql = require('mysql')
var con = mysql.createConnection({
  host: '',
  user: '',
  password: ''
})
con.connect(function (err) {
  if (err) throw err
  console.log('Connected!')
  con.query('CREATE DATABASE <DB name>', function (err, result) {
    if (err) throw err
    console.log('Database created')
  })
})
