
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
//    this.db = new Db('node_mongo_Brainify', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
//    this.db.open(function () {
//    });
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

exports.MatchProvider = MatchProvider;