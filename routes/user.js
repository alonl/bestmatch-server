
UserProvider = require('../userprovider').UserProvider;
var userProvider= new UserProvider(GLOBAL.mongo_host, GLOBAL.mongo_port);


exports.register = function(req, res){
    userProvider.register(req.params.token, function(error, userObject) {
        if(error) {
            console.log(error.toString());
            res.statusCode = 400;
            res.send(error.toString());
        } else {
            res.statusCode = 200;
            res.send(userObject);
        }
    });
};

