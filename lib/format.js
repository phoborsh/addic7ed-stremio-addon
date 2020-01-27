const { searchShow, searchMovie } = require('./search'),
	needle = require('needle'),
	config = require('../config');

async function GetShowInfos(itemType, itemImdbId){
	var ShowId = itemImdbId.split(':')[0]
	var SeasonId = itemImdbId.split(':')[1]
	var EpisodeId = itemImdbId.split(':')[2]
	
	var url = config.cinemeta_url + itemType + '/' + ShowId + '.json'
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
	var url = config.cinemeta_url + itemType + '/' + itemImdbId + '.json'
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
	return subtitlesList
}

module.exports = 
{ 
	GetShowInfos,
	GetMovieInfos,
	GetShowSubsList,
	GetMovieSubsList
}