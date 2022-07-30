var express = require('express');
var router = express.Router();

var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
});

router.get('/login', function(req, res){
  res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: 'login',
  sessin: true
}));

router.get('/logout', function(req, res){
  req.session.passport.user = undefined;
  res.redirect('/');
});

module.exports = router;
