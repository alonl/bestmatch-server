
MatchProvider = require('../matchprovider').MatchProvider;
var matchProvider= new MatchProvider(GLOBAL.mongo_host, GLOBAL.mongo_port);


exports.setMatch = function(req, res){
    matchProvider.updateMatch(req.params.uid, req.query.matchID, parseInt(req.query.matchScore), function(error, result) { // TODO: params?
        if (error) {
            console.log(error);
            res.statusCode = 400;
            res.send(error.toString());
        } else {
            res.statusCode = 200;
            res.send("OK");
        }
    });
};

exports.getMatches = function(req, res) {
    res.statusCode = 200;
    res.send(
        [
            {
                matchID: "1111222233334444",
                uid1: "55556666",
                uid2: "77778888",
                matchRating: 22,
                votedYes: [
                    "00001111", "11112222", "33334444"
                ]
            },
            {
                matchID: "9999000011112222",
                uid1: "55556666",
                uid2: "77778888",
                matchRating: 30,
                votedYes: [
                    "00001111", "11112222", "33334444"
                ]
            }
        ]
    );
}