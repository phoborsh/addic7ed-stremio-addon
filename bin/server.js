#!/usr/bin/env node

console.log("[Server] Booting up ...")

const { serveHTTP, publishToCentral, getRouter} = require("stremio-addon-sdk"),
	{ addonInterface, route2referer } = require('../index.js'),
	landingTemplate = require('../lib/landingTemplate'),
	httpProxy = require('http-proxy'),
	express = require('express'),
	config = require('../config');
	
const app = express()
var proxyServer = httpProxy.createProxyServer()
const router = getRouter(addonInterface) // add your addonInterface

var ProxyOptions = {
			secure: false, 
			changeOrigin: true,
			followRedirects: true,

			target: config.addic7ed_url,
			headers:{
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
				'Referer': 'http://www.addic7ed.com/show/1'
			}
		}

const landingHTML = landingTemplate(addonInterface.manifest)
router.get('/', function(req, res, next) {
	res.setHeader('content-type', 'text/html')
	res.end(landingHTML)
})

router.get('/updated/*', function(req, res, next) {
	const opts = JSON.parse(JSON.stringify(ProxyOptions))
	if (route2referer()[req.url])
		opts.headers['Referer'] = route2referer()[req.url]
	proxyServer.web(req, res, opts); // add your target
})

router.get('/original/*', function(req, res, next) {
	const opts = JSON.parse(JSON.stringify(ProxyOptions))
	if (route2referer()[req.url])
		opts.headers['Referer'] = route2referer()[req.url]
	proxyServer.web(req, res, opts);
})



app.use(router)
app.listen(config.port)

console.log("[Server] Started addon at: " + config.local)
console.log("[Server] Install addon from: " + config.local + "/manifest.json")
console.log("[Server] Internal proxy port: " + config.port)
//publishToCentral("https://addic7ed-stremio-addon.herokuapp.com/mainfest.json")	