
var config = { };

// should end in /
//config.rootUrl  = process.env.ROOT_URL                  || 'http://localhost:3001/';

config.facebook = {
    appId:          process.env.FACEBOOK_APPID          || '733262476704001',
    appSecret:      process.env.FACEBOOK_APPSECRET      || '2ce862e3d492226ce2ccb80b05650e14',
    appNamespace:   process.env.FACEBOOK_APPNAMESPACE   || 'hackidc',
    redirectUri:    process.env.FACEBOOK_REDIRECTURI    ||  config.rootUrl + 'login/callback'
};

module.exports = config;
