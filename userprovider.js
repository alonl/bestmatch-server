var mongodb = require('mongodb');
var Db = mongodb.Db;
var Connection = mongodb.Connection;
var Server = mongodb.Server;
var BSON = mongodb.BSONPure;
var ObjectID = mongodb.ObjectID;
var assert = require('assert');
var Step = require('step');
var FB = require('fb');
var config = require('./config');

MatchProvider = require('./matchProvider').MatchProvider;
var matchProvider = new MatchProvider(GLOBAL.mongo_host, GLOBAL.mongo_port);

FB.options({
    appId:          config.facebook.appId,
    appSecret:      config.facebook.appSecret,
    redirectUri:    config.facebook.redirectUri
});

var errorHandler = function(error, message, callback) {
    if (error) {
        console.log(message);
        console.log(error);
        callback(message);
        return true
    } else {
        return false;
    }
};

var getAgeFromDate = function(dateString) {
    var yearRegexp = /.*(\d{4}).*/g;
    var match = yearRegexp.exec(dateString);
    return match ? 2014 - match[1] : match;
};

var intersect = function(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        if (b.indexOf(e) !== -1) return true;
    });
};

UserProvider = function (host, port) {
    var provider = this;
    var connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI || "mongodb://127.0.0.1:27017";
    Db.connect(connectionString, function(err, db1) {
        if (err) {
            console.log(err);
        } else {
            provider.db = db1;

            db1.collection('users', function (error, users_collection) {
                if (error) {
                    callback(error);
                } else {
                    users_collection.ensureIndex( { uid: 1 }, { unique: true }, function(error, result){
                        if (errorHandler(error, "Error creating index")) {
                            return;
                        }
                        console.log("ensured users uid index ok");
                        console.log(result);
                    });
                }
            });
        }
    });
};


UserProvider.prototype.fbLogin = function(token, callback) {
    console.log("setting access token");
    FB.setAccessToken(token);
    console.log("calling 'me'");
    FB.api('me', function(res) {
        console.log("called 'me'");
        if(!res || res.error) {
            var error = !res ? 'error occurred' : res.error;
            console.log(error);
            callback(error);
            return;
        }
        console.log("logged in ok");
        callback(null, res);
        return;
    });
};


UserProvider.prototype.getUsersCollection = function(callback) {
    if (!this.db.serverConfig.isConnected()) {
        callback("Db is not connected!");
        return;
    }

    this.db.collection('users', function (error, users_collection) {
        if (error) {
            callback(error);
        } else {
            callback(null, users_collection);
        }
    });
};

UserProvider.prototype.register = function(token, callback) {
    console.log("log1");
    var provider = this;

    var cartesianProduct = function(males, females) {
        console.log("log2");
        var output = [];
        for (var m = 0; m < males.length; m++) {
            for (var f = 0; f < females.length; f++) {
                output.push({uidM: males[m].uid, male: males[m], uidF: females[f].uid, female: females[f]});
            }
        }
        return output;
    };

    var generateSharedInterestsAndFriends = function(results, match_collection) {
        console.log("generating mutual friends...");
        results.forEach(function(match) {
            FB.api(match.uidM + '/mutualfriends/' + match.uidF, function(res) {
                match_collection.update(
                    { _id: match._id },
                    { $addToSet: {mutualFriends: { $each: res.data }}},
                    { multi: false, w: 0}
                );
            })
        });

        console.log("generating shared interests");
        results.forEach(function(match) {
            FB.api(match.uidM + '/likes', function(resM) {
                FB.api(match.uidF + '/likes', function(resF) {
                    var interestsM = resM.data.map(function(r){return r.id});
                    var interestsF = resF.data.map(function(r){return r.id});
                    var intersection = intersect(interestsM, interestsF);
                    match_collection.update(
                        { _id: match._id },
                        { $addToSet: {sharedInterests: {$each: intersection}}},
                        { multi: false, w: 0}
                    )
                });
            });
        });
    };

    var insertNewUsers = function(males, females, callback) {
        provider.getUsersCollection(function(error, users_collection) {
            if (errorHandler(error, "Error 002", callback)) {
                return;
            }
            console.log("bulk inserting new users");
            users_collection.insert(males.concat(females), {w: 0, continueOnError: true}, function(error, result) {
                if (errorHandler(error, "Error inserting users", callback)) {
                    return;
                }
                console.log("inserted ok: " + result.length);

                console.log("getting matches collection...");
                matchProvider.getMatchesCollection(function(error, match_collection) {
                    if (errorHandler(error, "Error: Error getting match collection", callback)) {
                        return;
                    }
                    console.log("generating matches...");
                    var matches = cartesianProduct(males, females);
                    for (var i = 0; i < matches.length; i++) {
                        matches[i].matchRating = 0;
                        matches[i].votedYes = [];
                        matches[i].mutualFriends = [];
                        matches[i].sharedInterests = [];
                    }
                    console.log("bulk inserting...");
                    match_collection.insert(matches, {w: 0}, function(error, result){
                        if (errorHandler(error, "Error inserting match", callback)) {
                            return;
                        }
                        console.log("inserted ok: " + result.length);
                        callback(null, result);

                        generateSharedInterestsAndFriends(result, match_collection);
                    });

                });
            });
        });

    };

    var generateNewUserFriends = function(newUser, callback) {
//        FB.setAccessToken(newUser.fbToken);
        FB.api('fql', {q: 'SELECT uid, name, sex, birthday, relationship_status, current_location FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1=me()) AND (relationship_status = "Single") AND sex = "male"'}, function(males) {
            FB.api('fql', {q: 'SELECT uid, name, sex, birthday, relationship_status, current_location FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1=me()) AND (relationship_status = "Single") AND sex = "female"'}, function(females) {
                males = males.data.map(function(male) {male.age = getAgeFromDate(male.birthday); male.location = male.current_location ? male.current_location.name : ""; return male;});
                females = females.data.map(function(female) {female.age = getAgeFromDate(female.birthday); female.location = female.current_location ? female.current_location.name : ""; return female;});
                if (newUser.uid != "626628036") {males.push({uid: "626628036", age: 28, location: 'Herzliya, Israel', name: "Ido Orlov", sex: "male"});};
                insertNewUsers(males, females, function(error, matches) {
                    console.log("got matches");
                    if (errorHandler(error, "error inserting users", callback)) {
                        return;
                    }
                    console.log("updating new user");
                    var output = JSON.parse(JSON.stringify(newUser));
                    var shuffle = function(o){ //v1.0
                        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                        return o;
                    };
                    output.leftToMatch = shuffle(matches);
                    callback(output);
                });
            });
        });
    };

    console.log("getting users collection");
    provider.getUsersCollection(function (error, users_collection) {
        console.log("got users collection?");
        if (errorHandler(error, "Error: Error getting users collection!", callback)) {
            return;
        }
        console.log("logging with facebook...");
        provider.fbLogin(token, function(error, fbUser) {
            if (errorHandler(error, "Error: Error login to facebook!", callback)) {
                return;
            }
            console.log("searching if user exists...");
            console.log("uid: " + fbUser.id);
            users_collection.find({uid: fbUser.id}, {uid: 1, fbToken: 1, name: 1, age: 1, location: 1, leftToMatch: 1}).toArray(function(error, user_res) {
                if (errorHandler(error, "Error: Error finding user id!", callback)) {
                    return;
                }
                console.log("user_res.length=" + user_res.length);
                if (user_res.length > 0 && user_res[0].fbToken != null && user_res[0].leftToMatch.length > 0) {
                    user_res[0].leftToMatch = []; // not necessarry now
                    console.log("user exists, just updating token.");
                    // just update token
                    users_collection.update(
                        { uid: fbUser.id },
                        { $set: { fbToken: token }},
                        { multi: false, w: 0 },
                        function(error, result) {
                            if (errorHandler(error, "Error updating user", callback)) {
                                return;
                            }
                            console.log("token updated");
                            callback(null, user_res[0]);
                        }
                    );

                } else { // new user
                    console.log("new user detected");
                    var newUser = {
                        uid: fbUser.id,
                        fbToken: token,
                        name: fbUser.name,
                        sex: fbUser.gender,
                        birthday: fbUser.birthday,
                        age: getAgeFromDate(fbUser.birthday),
                        location: fbUser.location ? fbUser.location.name : ""
                    };
                    generateNewUserFriends(newUser, function(finalizedUser) {
                        console.log("updating new user in db:");
                        console.log(newUser);
                        users_collection.remove({uid: finalizedUser.uid}, function() {
                            console.log("new user removed. now inserting");
                            users_collection.insert(finalizedUser, {w: 0}, function() {
                                if (errorHandler(error, "error inserting new user", callback)) {
                                    return;
                                }
                                console.log("new user inserted ok:");
                                console.log(newUser);
                                callback(null, newUser);
                                return;
                            });
                        });
                    });
                }
            });
        });
    });
};


UserProvider.prototype.getNextLeftToMatch = function (uid, numOfSuggest, callback) {
    var provider = this;

    // take next leftToMatch of the user
    this.getUsersCollection(function(error, users_collection) {
        if (errorHandler(error, "Error getting users collection", callback)) {
            return;
        }
        console.log("finding uid: " + uid);
        users_collection.find({uid: uid}).toArray(function(error, user_res) {
            if (error || user_res.length == 0) {
                console.log("User not found or error.");
                callback("User not found or error.");
                return;
            }
            var user = user_res[0];
            var suggest = user.leftToMatch.slice(0, numOfSuggest);

            callback(null, suggest);

            users_collection.update(
                { uid: uid },
                { $set: { leftToMatch: user.leftToMatch.slice(numOfSuggest + 1)} }, // TODO: out of bounds?
                { multi: false, w: 0 },
                function(error, result) {
                    errorHandler(error, "Error updating user");
                }
            );

        });

    });
};

exports.UserProvider = UserProvider;