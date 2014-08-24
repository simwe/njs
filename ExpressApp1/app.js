
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();
var exphbs = require('express-handlebars');
var auth = require('./auth.js');


//server.listen(3000);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

//app.set('view engine', 'jade');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());


app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(auth.passport.initialize());
app.use(auth.passport.session());

app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res) {
    res.render('home', { user: req.user });
     
});

app.get('/auth/google',
    auth.passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/admin');
});

// GET /auth/google/return
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
app.get('/auth/google/return',
    auth.passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/admin');
    });

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/admin', ensureAuthenticated, function (req, res) {
    res.render('admin', { user: req.user });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/')
}


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var io = require('socket.io').listen(server);

io.on('connection', function(socket){
  console.log('socket io - connected');
    socket.emit('info', { msg: 'The world is round, there is no up or down.' });
});

