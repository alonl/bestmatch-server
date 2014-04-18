
MatchProvider = require('../matchprovider').MatchProvider;
var matchProvider= new MatchProvider(GLOBAL.mongo_host, GLOBAL.mongo_port);


exports.setMatch = function(req, res){
    matchProvider.updateMatch(req.params.uid, req.query.matchID, parseInt(req.query.matchScore), function(error, result) {
        if (error) {
            console.log(error);
            res.statusCode = 400;
            res.send(error.toString());
        } else {
            res.statusCode = 200;
            console.log("OK");
            res.send("OK");
        }
    });
};

exports.reset = function(req, res) {
    matchProvider.reset(function(error, result) {
        if (error) {
            console.log(error);
            res.statusCode = 400;
            res.send(error.toString());
        } else {
            res.statusCode = 200;
            console.log(JSON.stringify(result));
            res.send(result.toString());
        }
    });
};

exports.getMatches = function(req, res) {
    matchProvider.findMatches(req.params.uid, function(error, result) {
        if (error) {
            console.log(error);
            res.statusCode = 400;
            res.send(error.toString());
        } else {
            res.statusCode = 200;
            console.log(JSON.stringify(result));
            res.send(result);
        }
    });
};