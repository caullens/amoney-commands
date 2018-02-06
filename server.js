"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple nightbot script.
 */

var http = require('http');
var url = require('url');
var fs = require('fs');
var request = require('request');
var fs = require('fs')
var port = 3000;
let allQuotes = []

var mod;
var bots = ['nightbot', 'moobot'];
fs.readFile('quotes.txt', (err, data) => {
  let file = data.toString()
  allQuotes = file.split('\n')
  let idx = allQuotes.indexOf('')
  if(idx > -1) allQuotes.splice(idx, 1)
})

function getRandMod(req, res) {
  request({
    uri: "http://tmi.twitch.tv/group/user/amoney_tv/chatters"
  }, function(err, res, body) {
    var obj = JSON.parse(body);
    var mods = obj.chatters.moderators;
    var tm;
    while(true) {
      tm = mods[Math.floor(Math.random()*mods.length)];
      if(bots.indexOf(tm) < 0) break;
    }
    mod = tm;
  });
  res.end(mod);
}

function quote(req, res, callback) {
let response = ''
  let params = decodeURI(req.url).split('?')[1]
  let quote = params.split('&')[0].split('=')[1]
  quote = sanitize(quote)
  let user = params.split('&')[1].split('=')[1]
  request({
    uri: "http://tmi.twitch.tv/group/user/amoney_tv/chatters"
  }, (err, re, body) => {
    let obj = JSON.parse(body);
    let mods = obj.chatters.moderators;
    if(mods.indexOf(user) > -1) {
      if(quote) response = postQuote(quote)
      else response = getQuote()
    }
    else {
      response = getQuote()
    }
    res.end(response)
  })
}

function sanitize(quote) {
  quote = quote.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
  quote = quote.replace(/\s{2,}/g," ")
  return quote
}

function getQuote() {
  if(allQuotes.length === 0) return 'It seems to be empty here... maybe some quotes should be added ;)'
  let rand = Math.floor(Math.random() * allQuotes.length)
  return allQuotes[rand]
}

function postQuote(quote) {
  fs.appendFileSync('quotes.txt', quote + '\n')
  return 'Quote added'
}

function hype(req, res) {
  let params = decodeURI(req.url).split('?')[1]
  let numHypes = parseInt(params.split('=')[1].toString())
  let response = ''
  if(numHypes) {
    if(numHypes > 50 || numHypes < 1) numHypes = 3
    for(let i = 0; i < numHypes; i++) {
      response += 'amoneyH '
    }
  } else {
    response += 'amoneyH amoneyH amoneyH'
  }
  res.end(response)
}

var server = http.createServer(function(req, res) {
	var urlParts = url.parse(req.url);

	switch(urlParts.pathname) {
		case "/random-mod":
			getRandMod(req, res);
			break;
    case "/quote":
      quote(req, res);
      break;
    case "/hype":
      hype(req, res);
      break;
		default:
      res.statusCode = 404;
      res.statusMessage = "Not found";
      res.end();
	}
});

server.listen(port, function() {
	console.log("Listening on port " + port);
});
