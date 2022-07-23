const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

const sess = {
  secret: 'secretsecretsecret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
  sess.cookie.secure = true
}

app.use(session(sess))

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
  res
    .type('text/html')
    .send(
      `<form method="POST" action="/login">
         <div>username<input type="text" name="username"></div>
         <div>password<input type="password" name="password"></div>
         <div><input type="submit" name="login"></div>
       </form>`
    )
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === 'admin' && password === 'password') {
    req.session.regenerate((err) => {
      req.session.username = 'admin';
      res.redirect('/');
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

app.use((req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.redirect('/login');
  }
});

app.get('/', (req, res) => {
  res.send('Hello ' + req.session.username);
});

app.listen('3000', () => {
  console.log('Application started');
});