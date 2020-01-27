var { searchShow, searchMovie } = require('./lib/search');
var needle = require('needle');
var http = require('http');
var httpProxy = require('http-proxy');
const { addonBuilder, serveHTTP, getRouter }  = require('stremio-addon-sdk');


const addon = new addonBuilder({
	id: 'org.addic7edaddon',
	name: 'Stremio Addic7ed Addon',
	version: '0.1.2',
	description: 'Online stremio Add-on for addic7ed subtitles',
	resources: [ 'subtitles' ],
	types: [ 'series' , 'movie'],
	catalogs: [],
	idPrefixes: ["tt"],
	logo: 'https://raw.githubusercontent.com/phoborsh/addic7ed-stremio-addon/master/logo.png',
	background: 'https://raw.githubusercontent.com/phoborsh/addic7ed-stremio-addon/master/background.png',
	contactEmail: 'phoeniiiixj@gmail.com'
})

var addic7edURL = "www.addic7ed.com"
var local = "http://addic7ed-stremio-addon.herokuapp.com"
const route2referer = {}

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

async function GetMovieInfos(itemType, itemImdbId){
	var url = 'https://v3-cinemeta.strem.io/meta/' + itemType + '/' + itemImdbId + '.json'
	let data = await needle("get", url)
	let ShowName = await data.body.meta.name
	
	let Infos = {
		Id: itemImdbId,
		Season: 0,
		Episode: 0,
		Name: ShowName
	}
	return Infos
}

async function GetShowSubsList(Name,SeasonId,EpisodeId){
	let subtitlesList = await searchShow(Name, SeasonId, EpisodeId)
	return subtitlesList
}

async function GetMovieSubsList(Name){
	let subtitlesList = await searchMovie(Name)
	console.log(subtitlesList)
	console.log("FOUND SUBS!!!!	")
	return subtitlesList
}

async function GetSubsArray(itemType, itemImdbId){
	if(itemType == "series"){
		var Infos = await GetShowInfos(itemType, itemImdbId);
		console.log("Show name: " + Infos.Name);
		
		var subtitlesList = await GetShowSubsList(Infos.Name,Infos.Season,Infos.Episode)
	}
	if(itemType == "movie"){
		var Infos = await GetMovieInfos(itemType, itemImdbId);
		console.log("Movie name: " + Infos.Name);
		
		var subtitlesList = await GetMovieSubsList(Infos.Name)
	}

	for (i=0, len = subtitlesList.length, SubArray = []; i < len; i++){
		const subtitle = {
			id: i,
			url: local + subtitlesList[i].link,
			lang: subtitlesList[i].lang
		}
		route2referer[subtitlesList[i].link] = "http://" + addic7edURL + (subtitlesList[i].referer || '/show/1')
		SubArray.push(subtitle)	
	}
	
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
			console.log(subs)
			return Promise.resolve({ subtitles: subs })
		} else {
			console.log('Subtitle not found.')
			return Promise.resolve({ subtitles: [] })
		}
	})
})

module.exports = { addonInterface: addon.getInterface(), route2referer: () => { return route2referer } }



