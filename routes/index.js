const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');


//Welcome page
router.get('/', (req, res) => res.render('welcome'));
//Dashboard page
router.get('/dashboard',
  ensureAuthenticated,
  (req, res) => {
    console.log(req.user);
    res.render('dashboard', {
      name: req.user.name
    })
  });

router.get('/simbologia', (req, res) => {
  res.render('simbologia');
});



module.exports = router;