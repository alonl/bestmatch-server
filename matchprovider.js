
var mongodb = require('mongodb');
var Db = mongodb.Db;
var Connection = mongodb.Connection;
var Server = mongodb.Server;
var BSON = mongodb.BSONPure;
var ObjectID = mongodb.ObjectID;
var assert = require('assert');

//UserProvider = require('./userprovider').UserProvider;
//var userProvider = new UserProvider(GLOBAL.mongo_host, GLOBAL.mongo_port);

var errorHandler = function(error, message, callback) {
    if (error) {
        console.log(message);
        console.log(error);
        callback(message);
        return true
    } else {
        return false;
    }
}

MatchProvider = function (host, port) {
    var provider = this;
    var connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI || "mongodb://127.0.0.1:27017";
    Db.connect(connectionString, function(err, db1) {
        if (err) {
            console.log(err);
        } else {
            provider.db = db1;
        }
    });
};

MatchProvider.prototype.getMatchesCollection = function (callback) {
    console.log("getting matches collection");
    if(!this.db.serverConfig.isConnected()) {
        callback("Db is not connected!");
        return;
    }
    this.db.collection('matches', function (error, matches_collection) {
        if (error) {
            callback(error);
        }
        else {
            matches_collection.ensureIndex( { uidM: 1, uidF: 1 }, { unique: true }, function(error, result){
                if (errorHandler(error, "Error creating index", callback)) {
                    return;
                }
                console.log("ensured index ok");
                console.log(result);
                callback(null, matches_collection);
            });
        }
    });
};


MatchProvider.prototype.updateMatch = function (uid, matchID, matchScore, callback) {
    console.log("update match: params:");
    console.log("uid: " + uid + "   matchID: " + matchID + "   matchScore: " + matchScore);
    var provider = this;
    provider.getMatchesCollection(function(error, matches_collection) {
        if (errorHandler(error, "DB Error 003", callback)) return;
        var uidArr = matchScore == 1 ? [uid] : [];
        matches_collection.update(
            { _id: new BSON.ObjectID(matchID) },
            {
                $inc: {matchRating: matchScore},
                $addToSet: {votedYes: { $each: uidArr }}
            },
            { multi: false, w: 0}
        );
        callback(null, "OK");
    });
};

MatchProvider.prototype.findMatches = function (uid, callback) {
    console.log("find matches: params:");
    console.log("uid: " + uid);
    var provider = this;
    provider.getMatchesCollection(function(error, matches_collection) {
        if (errorHandler(error, "DB Error 004", callback)) return;
        matches_collection.find({$and: [{matchRating: {$gte: 1}}, {$or: [{uidF: uid}, {uidM: uid}]}]}).toArray(function(error, result) {
            if (errorHandler(error, "DB Error 005", callback)) return;
            callback(null, result);
        });
    });
};



MatchProvider.prototype.reset = function(callback) {
    var provider = this;
    provider.getMatchesCollection((function(error, matches_collection) {
        if (errorHandler(error, "DB Error 006", callback)) return;

        provider.db.collection('users', function(err, collection) {
            collection.remove({}, {w: 0});
        });
        provider.db.collection('matches', function(err, collection) {
            collection.remove({}, {w: 0}, function() {

                matches_collection.insert(
                    [
                        {
                            "uidM" : "626628036",
                            "male" : {
                                "uid" : "626628036",
                                "name" : "Ido Orlov",
                                "sex" : "male",
                                "birthday" : "02/17/1986",
                                "age" : 28,
                                "location" : "Herzliya, Israel",
                                "relationship_status" : "Single",
                                "age" : 28,
                                "_id" : "53504d67bcc60b181c0021e7"
                            },
                            "uidF" : "602789669",
                            "female" : {
                                "uid" : "602789669",
                                "name" : "Dana Bookstein",
                                "sex" : "female",
                                "relationship_status" : "Single",
                                "age" : 26,
                                "location" : "Herzliya, Israel"
                            },
                            "matchRating" : 3,
                            "votedYes" : ["564350957", "1127758094", "581384374"],
                            "mutualFriends" : ["564350957", "1195614300", "1140158144", "1127758094", "1501802451", "840485432", "581384374"]
                        },
                        {
                            "uidM" : "626628036",
                            "male" : {
                                "uid" : "626628036",
                                "name" : "Ido Orlov",
                                "sex" : "male",
                                "birthday" : "02/17/1986",
                                "age" : 28,
                                "location" : "Herzliya, Israel",
                                "relationship_status" : "Single",
                                "age" : 28
                            },
                            "uidF" : "1378982912",
                            "female" : {
                                "uid" : "1378982912",
                                "name" : "Stav Moskovich",
                                "sex" : "female",
                                "relationship_status" : "Single",
                                "age" : 25,
                                "location" : "Omez, Hamerkaz, Israel"
                            },
                            "matchRating" : 2,
                            "votedYes" : ["100000173886116", "100001772443975"],
                            "mutualFriends" : ["564350957", "100001772443975", "1140158144", "100000173886116", "688082903"]
                        },
                        {
                            "uidM" : "626628036",
                            "male" : {
                                "uid" : "626628036",
                                "name" : "Ido Orlov",
                                "sex" : "male",
                                "birthday" : "02/17/1986",
                                "age" : 28,
                                "location" : "Herzliya, Israel",
                                "relationship_status" : "Single",
                                "age" : 28
                            },
                            "uidF" : "1003059672",
                            "female" : {
                                "uid" : "1003059672",
                                "name" : "Roni Laufer",
                                "sex" : "female",
                                "relationship_status" : "Single",
                                "age" : 26,
                                "location" : "Herzliya, Israel"
                            },
                            "matchRating" : 1,
                            "votedYes" : ["1127758094"],
                            "mutualFriends" : ["1501802451", "840485432", "581384374", "1127758094"]
                        }
                    ],
                    {w: 0, continueOnError: true},
                    function(error, result) {
                        if (errorHandler(error, "DB Error 009", callback)) return;
                        callback(null, "OK");
                    }
                );

            });
        });
    }));
};



exports.MatchProvider = MatchProvider;