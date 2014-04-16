
MatchProvider = require('../matchprovider').MatchProvider;
var matchProvider= new MatchProvider(GLOBAL.mongo_host, GLOBAL.mongo_port);


exports.test = function(req, res){
    matchProvider.test("nothing", function(error, result) {
        if(error) {
            console.log(error.toString());
            res.statusCode = 400;
            res.send(error.toString());
        } else {
            res.statusCode = 200;
            res.send(result);
        }
    });
};

