const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const con = require('../app')
const router = express.Router();

// Login router
router.get('/login', (req, res) => res.render('login'))

// Register router
router.get('/register', (req, res) => res.render('register'))

// Register handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    if(!name || !email || !password || !password2){
        errors.push({msg:'Please fill in all the fields'});
    }
    if(password !== password2){
        errors.push({msg:'Passwords do not match'});
    }
    if(password.length < 6){
        errors.push({msg:'Passwords must be at least 6 characters long'});
    }
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        const myquery = "SELECT * FROM user WHERE email = " + "'"+email+"'"
        con.query(myquery, (err, user) => {  
            if (err) throw err;  
            if(user.length > 0){
                errors.push({msg:'Email already registered'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            }
            else{
                // Hash password
                bcrypt.genSalt(10, (err, salt) => 
                   bcrypt.hash(password, salt, (err,hash) => {
                       if(err) throw err;
                       encryptedpassword = hash;
                       const myquery = "INSERT INTO user (name, email, password) VALUES ('"+name+"', '"+email+"', '"+hash+"')";
                        con.query(myquery, function (err, result) {  
                            if (err) throw err; 
                            req.flash('success_msg', 'You are registered.') 
                            res.redirect('/users/login')
                        });
                   }) 
                )
                
                

            }  
        });
    }

})

// Login handle
router.post('/login', (req, res, next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true 
    })(req, res, next)
})

// Logout handle
router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login')
})
module.exports = router