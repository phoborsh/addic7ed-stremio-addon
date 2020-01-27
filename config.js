var env = process.argv[2] || 'heroku';
var config = {};
	
config.port = process.env.PORT
switch (env) {
    case 'heroku':
        config.local = "http://addic7ed-stremio-addon.herokuapp.com"
        break;
    case 'local':
        config.local = "http://127.0.0.1:" + config.port;
        break;
}
config.addic7ed_url = "https://www.addic7ed.com";
config.cinemeta_url = "https://v3-cinemeta.strem.io/meta/";

module.exports = config;
