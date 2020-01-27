const { GetShowInfos, GetMovieInfos, GetShowSubsList, GetMovieSubsList } = require('./lib/format'),
	http = require('http'),
	httpProxy = require('http-proxy'),
	{ addonBuilder, serveHTTP, getRouter }  = require('stremio-addon-sdk'),
	config = require('./config');

const addon = new addonBuilder({
	id: 'org.addic7edaddon',
	name: 'Stremio Addic7ed Addon',
	version: '0.1.4',
	description: 'Online stremio Add-on for addic7ed subtitles',
	resources: [ 'subtitles' ],
	types: [ 'series' , 'movie'],
	catalogs: [],
	idPrefixes: ["tt"],
	logo: 'https://raw.githubusercontent.com/phoborsh/addic7ed-stremio-addon/master/logo.png',
	background: 'https://raw.githubusercontent.com/phoborsh/addic7ed-stremio-addon/master/background.png',
	contactEmail: 'phoeniiiixj@gmail.com'
})


const route2referer = {}

async function GetSubsArray(itemType, itemImdbId){
	if(itemType == "series"){
		var Infos = await GetShowInfos(itemType, itemImdbId);
		console.log("[Index] Show name: " + Infos.Name);
		
		var subtitlesList = await GetShowSubsList(Infos.Name,Infos.Season,Infos.Episode)
	}
	if(itemType == "movie"){
		var Infos = await GetMovieInfos(itemType, itemImdbId);
		console.log("[Index] Movie name: " + Infos.Name);
		
		var subtitlesList = await GetMovieSubsList(Infos.Name)
	}

	for (i=0, len = subtitlesList.length, SubArray = []; i < len; i++){
		const subtitle = {
			id: i,
			url: config.local + subtitlesList[i].link,
			lang: subtitlesList[i].lang
		}
		route2referer[subtitlesList[i].link] = config.addic7ed_url + (subtitlesList[i].referer || '/show/1')
		SubArray.push(subtitle)	
	}
	return SubArray
}

addon.defineSubtitlesHandler(args => {
	var itemType = args.type
	var itemImdbId = args.id
	console.log("[Index] Request for subtitles: " + itemType + " " + itemImdbId);
 
	return GetSubsArray(itemType, itemImdbId).then(subs => {
		if (subs.length > 0) {
			console.log("[Index] Subtitle loaded.")
			console.log(subs)
			return Promise.resolve({ subtitles: subs })
		} else {
			console.log("[Index] Subtitle not found.")
			return Promise.resolve({ subtitles: [] })
		}
	})
})

module.exports = { addonInterface: addon.getInterface(), route2referer: () => { return route2referer } }



