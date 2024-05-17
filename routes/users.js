const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


//User model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => res.render('login'));
router.get('/calculator', (req, res) => res.render('calculator'));
//Register Page
router.get('/register', (req, res) => res.render('register'));


//When we submit registration form
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;

    //Validation
    let errors = [];

    //Check required fileds
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Por favor rellena todos los campos' });
    }

    //Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Las contraseñas no coinciden' });
    }

    //Check lenght of pass
    if (password.length < 6) {
        errors.push({ msg: 'Las contraseñas deben tener al menos 6 caracteres.' });
    }

    //
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //Validation passed
        User.findOne({ email: email })//return promise
            .then(user => {
                if (user) {
                    //user exist
                    errors.push({ msg: 'El correo electrónico ya está registrado.' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    console.log(newUser);

                    //Hash Password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //Set passwrod Hashed
                            newUser.password = hash;
                            //Save User
                            newUser
                                .save()//return promise
                                .then(user => {
                                    req.flash(
                                        'success_msg',
                                        'Ya estás registrado, ya puedes iniciar sesión'
                                    );
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        })
                    });
                }
            });
    }

});

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Estás desconectado');
    res.redirect('/users/login');
});


module.exports = router;