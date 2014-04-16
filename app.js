// mongo config
if (process.env.VCAP_SERVICES){ // appfog
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongo = env['mongodb-1.8'][0]['credentials'];
    GLOBAL.mongo_host = mongo.hostname;
    GLOBAL.mongo_port = mongo.port;
} else { // local
    GLOBAL.mongo_host = "localhost"
    GLOBAL.mongo_port = "27017";
}


var express = require('express')
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
app.get('/setup/reset', setup.resetDB);

app.post('/users', user.register);
//app.get('/suggest/:uid', user.getSuggestions);
//app.post('/matches/:uid', match.setMatch);
//app.get('/matches/:uid', match.getMatches);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
