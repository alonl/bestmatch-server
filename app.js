
var express = require('express')
    , FB = require('fb')
    , config = require('./config')
    , routes = require('./routes')
    , match = require('./routes/match')
    , user = require('./routes/user')
    , setup = require('./routes/setup')
    , http = require('http')
    , path = require('path')
    , cookieSessions = require('./cookie-sessions')
    , expressMiddlewares = require('./express-middlewares');


var app = express();

app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('HackIDCMatch'));
app.use(cookieSessions('sessionData'));
app.use(expressMiddlewares.allowCrossDomain); // CORS
//app.use(expressMiddlewares.isUserLoggedIn); // check that user is loggedIn
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/setup/reset', match.reset);

app.post('/users', user.register);
app.get('/suggest/:uid', user.getSuggestions);
app.post('/matches/:uid', match.setMatch);
app.get('/matches/:uid', match.getMatches);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
