var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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

module.exports = app;

// 既に色々入っているので、そこへ追加
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

// signinページの追加
var signinRouter = require('.routes/signin');
app.use('/signin');

// session, passport.initialize, passport.sessionは以下の順番で追加
app.use(session({
  secret: "testing",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// authentication
passport.serializeUser(function(username, done) {
  console.log('serializeUser');
  done(null, username);
});

passport.deserializeUser(function(username, done) {
  console.log('deserializeUser');
  done(null, {name:username});
});

passport.use(new LocalStrategy(
  {
    // signinのformで定義したnameの要素をセット
    usernameField: "username",
    passwordField: "password"
  },
  function(username, password, done){
    // ここでは、データベースを使わずに、仮にusernameとpasswordを固定で入れています。
    if(username == "test" && password == 123456789){
      return done(null, username);
    }
    return done(null, false, {message: "invalid"});
  }
));

app.post('/signin',
  passport.authenticate('local',
    {
      failureRedirect: "/signin"
    }
  ),
  function(req, res, next){
    // res.redirect("/")でreq.userが渡せなかったので、ここでfetchを使っています。
    // https://github.com/jaredhanson/passport/issues/244
    // fetchは以下のようにインストール
    // npm install --save isomorphic-fetch
    // var fetch = require('isomorphic-fetch');
    fetch("http://localhost:3000/signin",
      {
        credentials: "include"
      }
    ).then(function(){
      res.redirect("/");
    }).catch(function(e){
      console.log(e);
    });
  }
);