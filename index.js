const addic7edApi = require('addic7ed-api');
var needle = require('needle');
var http = require('http');
<<<<<<< HEAD
var httpProxy = require('http-proxy');
const { addonBuilder, serveHTTP, getRouter }  = require('stremio-addon-sdk');
=======
var portfinder = require('portfinder');
var pmsProxy = require('./lib/proxy')
var httpProxy = require('http-proxy')

const { addonBuilder, serveHTTP }  = require('stremio-addon-sdk');
>>>>>>> 2000d6e8815abffa0095b1c2b35dc016d3662227


const addon = new addonBuilder({
	id: 'org.addic7edaddon',
<<<<<<< HEAD
	name: 'Addic7ed Addon Heroku',
	version: '0.1.1',
	description: 'Online stremio Add-on for addic7ed subtitles',
	resources: [ 'subtitles' ],
	types: [ 'series' , 'movies'],
	catalogs: [],
	idPrefixes: ["tt"],
	logo: 'https://i.imgur.com/rpJeIz7.png',
	background: 'https://i.imgur.com/qGFoCnz.png',
	contactEmail: 'phoeniiiixj@gmail.com'
})

var addic7edURL = "www.addic7ed.com"
var local = "http://addic7ed-stremio-addon-heroku.herokuapp.com"
// var local = "http://localhost"
var Languages = ["eng","fre","esp","ita","swe","srp","slv","slk","ron","por","nor","mol","lit","lim","nld","lav","heb","fin","gre","ger","deu","cze","ara"]
const route2referer = {}
=======
	name: 'Addic7ed Addon',
	version: '0.0.1',
	description: 'Add-on for addic7ed subtitles',
	resources: [ 'subtitles' ],
	types: [ 'series' ],
	catalogs: [],
	idPrefixes: ["tt"],
	logo: 'https://i.imgur.com/rpJeIz7.png'
})

var port = 8095
portfinder.getPort(function (err, freeport) {
	port = freeport
});
  
var addic7edURL = "www.addic7ed.com"
var headers = {};
var Languages = ["eng","fre","esp","ita","swe","srp","slv","slk","ron","por","nor","mol","lit","lim","nld","lav","heb","fin","gre","ger","deu","cze","ara"]

function onRequest(client_req, client_res) {
	var options = {
		hostname: addic7edURL,
		port: 80,
		path: client_req.url,
		method: client_req.method,
		headers: headers
	};
	console.log(headers)
	console.log('proxy thru: ' + options.hostname + client_req.url);


	var proxy = http.request(options, function (res) {
		client_res.writeHead(res.statusCode, res.headers)
		res.pipe(client_res, {
			end: true
		});
	});

	client_req.pipe(proxy, {
		end: true
	});
}
>>>>>>> 2000d6e8815abffa0095b1c2b35dc016d3662227

async function GetShowInfos(itemType, itemImdbId){
	var ShowId = itemImdbId.split(':')[0]
	var SeasonId = itemImdbId.split(':')[1]
	var EpisodeId = itemImdbId.split(':')[2]
	
	var url = 'https://v3-cinemeta.strem.io/meta/' + itemType + '/' + ShowId + '.json'
	let data = await needle("get", url)
	let ShowName = await data.body.meta.name
	
	let Infos = {
		Id: ShowId,
		Season: SeasonId,
		Episode: EpisodeId,
		Name: ShowName
	}
	return Infos
}

async function GetSubsList(Name,SeasonId,EpisodeId,Langs){
	let subtitlesList = await addic7edApi.search(Name, SeasonId, EpisodeId, Langs)
	return subtitlesList
}

async function GetSubsArray(itemType, itemImdbId){
	var Infos = await GetShowInfos(itemType, itemImdbId);
	console.log("Show name: " + Infos.Name);
	
	var subtitlesList = await GetSubsList(Infos.Name,Infos.Season,Infos.Episode,Languages)
<<<<<<< HEAD

	for (i=0, len = subtitlesList.length, SubArray = []; i < len; i++){
		const subtitle = {
			id: i,
			url: local + subtitlesList[i].link,
			lang: subtitlesList[i].lang
		}
		route2referer[subtitlesList[i].link] = "http://" + addic7edURL + (subtitlesList[i].referer || '/show/1')
		SubArray.push(subtitle)	
	}
	
=======
	
	const promise1 = new Promise(function(resolve, reject) {
	  setTimeout(function() {
		resolve('foo');
	  }, 300);
	});
	
	for (i=0, len = subtitlesList.length, SubArray = []; i < len; i++){
		const subtitle = {
			url: 'http://127.0.0.1:' + port + subtitlesList[i].link,
			lang: subtitlesList[i].lang
		}
		console.log(subtitle)
		SubArray.push(subtitle)	
	}
	
	var Referer = "http://" + addic7edURL + (subtitlesList[0].referer || '/show/1')
	var proxyServer = httpProxy.createProxyServer({
			secure: false, 
			changeOrigin: true,
			followRedirects: true,

			target: 'https://www.addic7ed.com',
			headers:{
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
				'Referer': Referer
			}
		}) 
	proxyServer.listen(port);
	console.log("Starting local proxy on port: " + port + "with referer: " + Referer)
	
>>>>>>> 2000d6e8815abffa0095b1c2b35dc016d3662227
	console.log("Subs ready")
	return SubArray
}

addon.defineSubtitlesHandler(args => {
	var itemType = args.type
	var itemImdbId = args.id
	console.log("Request for subtitles: " + itemType + " " + itemImdbId);
 
	return GetSubsArray(itemType, itemImdbId).then(subs => {
		if (subs.length > 0) {
			console.log('Subtitle loaded.')
<<<<<<< HEAD
			console.log(subs)
=======
>>>>>>> 2000d6e8815abffa0095b1c2b35dc016d3662227
			return Promise.resolve({ subtitles: subs })
		} else {
			console.log('Subtitle not found.')
			return Promise.resolve({ subtitles: [] })
		}
	})
})

<<<<<<< HEAD
module.exports = { addonInterface: addon.getInterface(), route2referer: () => { return route2referer } }



=======
module.exports = addon.getInterface()
>>>>>>> 2000d6e8815abffa0095b1c2b35dc016d3662227
