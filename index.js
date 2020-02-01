const { GetShowInfos, GetMovieInfos, GetShowSubsList, GetMovieSubsList } = require('./lib/format'),
	http = require('http'),
	httpProxy = require('http-proxy'),
	{ addonBuilder, serveHTTP, getRouter }  = require('stremio-addon-sdk'),
	config = require('./config');

const route2referer = {}
const addon = new addonBuilder({
	id: 'org.addic7edaddon',
	name: 'Stremio Addic7ed Addon',
	version: '0.1.4',
	description: 'Online stremio Add-on for addic7ed subtitles',
	resources: [ 'subtitles' ],
	types: [ 'series' , 'movie'],
	catalogs: [],
	idPrefixes: ["tt"],
	logo: 'https://raw.githubusercontent.com/phoborsh/addic7ed-stremio-addon/master/screenshots/logo.png',
	background: 'https://raw.githubusercontent.com/phoborsh/addic7ed-stremio-addon/master/screenshots/background.png',
	contactEmail: 'phoeniiiixj@gmail.com'
})

async function GetSubsArray(itemType, itemImdbId){
	if(itemType == "series"){
		var Infos = await GetShowInfos(itemType, itemImdbId);
		console.log("[Index] Show name: " + Infos.Name);
		
		var subtitlesRaw = await GetShowSubsList(Infos.Name,Infos.Season,Infos.Episode)
	}
	if(itemType == "movie"){
		var Infos = await GetMovieInfos(itemType, itemImdbId);
		console.log("[Index] Movie name: " + Infos.Name);
		
		var subtitlesRaw = await GetMovieSubsList(Infos.Name)
	}

	for (i=0, len = subtitlesRaw.length, subtitles = []; i < len; i++){
		const subtitle = {
			id: i,
			url: config.local + subtitlesRaw[i].link,
			lang: subtitlesRaw[i].lang
		}
		route2referer[subtitlesRaw[i].link] = config.addic7ed_url + (subtitlesRaw[i].referer || '/show/1')
		subtitles.push(subtitle)	
	}
	return subtitles
}

addon.defineSubtitlesHandler(args => {
	var itemType = args.type
	var itemImdbId = args.id
	console.log("[Index] Request for subtitles: " + itemType + " " + itemImdbId);
 
	return GetSubsArray(itemType, itemImdbId).then(subtitles => {
		if (subtitles.length > 0) {
			console.log("[Index] " + subtitles.length + " subtitles loaded.")
			console.log()
			return Promise.resolve({ subtitles: subtitles })
		} else {
			console.log("[Index] Subtitle not found.")
			return Promise.resolve({ subtitles: [] })
		}
	})
})

module.exports = { addonInterface: addon.getInterface(), route2referer: () => { return route2referer } }



