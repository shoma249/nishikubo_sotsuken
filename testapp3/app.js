var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');

//ユーザ情報
const User1 = {
  username: "user1",
  password: "123"
};

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlendcoded({ extended: true}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

passport.use(new LocalStrategy(
  {
    //フィールド名が、username, password以外の場合.
    usernameField: 'login-id',
    passwordField: 'password',
    session: false,
  },
  (username, password, done) => {
    //検証用コールバック.
    if(username !== User1.username){
      return done(null, false);
    }
    if(password !== User1.password){
      return done(null, false);
    }
    return done(null, username);
  }
));

app.use(passport.initialize());

app.post('/login', passport.authenticate('local', {
  successRedirect: 'ok.pug',
  failureRedirect: 'login.pug'
}))

module.exports = app;
