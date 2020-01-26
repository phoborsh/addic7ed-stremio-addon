#!/usr/bin/env node

const { serveHTTP, publishToCentral } = require("stremio-addon-sdk")
const addonInterface = require("../index")

serveHTTP(addonInterface, { port: process.env.PORT || 3025, static: '/' })
// publishToCentral("https://your-url.ext/mainfest.json")	