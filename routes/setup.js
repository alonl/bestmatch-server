
SetupProvider = require('../setupprovider').SetupProvider;
var setupProvider= new SetupProvider(GLOBAL.mongo_host, GLOBAL.mongo_port);


exports.resetDB = function(req, res){
    setupProvider.reset(function(error, users_counter, global_counter) {
        if(error) {
            console.log(error.toString());
            res.statusCode = 400;
            res.send(error.toString());
        } else {
            console.log("DBs were reset successfully! " + users_counter + " users songs and " + global_counter + " global songs were loaded successfully!");
            res.statusCode = 200;
            res.send("DBs were reset successfully! " + users_counter + " users songs and " + global_counter + " global songs were loaded successfully!");
        }
    });
};

