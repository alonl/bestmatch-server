
UserProvider = require('../userprovider').UserProvider;
var userProvider= new UserProvider(GLOBAL.mongo_host, GLOBAL.mongo_port);


exports.register = function(req, res) {
    userProvider.register(req.query.token, function(error, userObject) {
        if(error) {
            console.log(error.toString());
            res.statusCode = 400;
            res.send(error.toString());
        } else {
            res.statusCode = 200;
            res.send(userObject);
        }
    });
//    res.statusCode = 200;
//    res.send(
//        {
//            uid: "00001111",
//            name: "Momo Cohen",
//            age: 25,
//            location: "Tel Aviv - Jaffa"
//        }
//    );
};

exports.getSuggestions = function(req, res) {
    res.statusCode = 200;
    res.send(
        [
            {
                matchID: "1111222233334444",
                male: {
                    uid: "55556666",
                    name: "Alon Lavi",
                    sex: "male",
                    age: "25",
                    location: "Giv'atayim"
                },
                female: {
                    uid: "77778888",
                    name: "Claudia Schiffer",
                    sex: "female",
                    location: "Tel Aviv"
                },
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
                matchRating: -10,
                votedYes: [
                    "00001111", "11112222", "33334444"
                ]
            }
        ]
    );
};

