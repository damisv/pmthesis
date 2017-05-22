var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var appRoutes = require('../routes/app');


//var db = mongoose.connection;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// The following are for separate servers
/*
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});
*/

var authRoutes = require('../routes/auth');
var profileRoutes = require('../routes/profile');
var projectRoutes = require('../routes/project');
var inviteRoutes = require('../routes/invite');
var taskRoutes = require('../routes/task');
app.use('/project',projectRoutes);
app.use('/profile',profileRoutes);
app.use('/auth',authRoutes);
app.use('/invite',inviteRoutes);
app.use('/task',taskRoutes);
app.use('/', appRoutes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('index');
});


module.exports = app;
