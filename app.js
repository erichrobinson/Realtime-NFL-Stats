Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

var mongoose = require('mongoose')
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
// var findOrCreate = require('mongoose-findorcreate')
var db = mongoose.connection;
// var Promise = require('bluebird')
// var async = require('async')

db.on('error', console.error);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile('/html/index.html', {root : './public'})
});


var gameCodes = []

var firstGame = new Date(2015, 8, 10)
// console.log(firstGame)
// firstGame = firstGame.addDays(30)

for(var x = 0; x <= 17; x++){
	console.log(firstGame.getMonth())
	var month = ''
	var day = ''
	if(firstGame.getMonth() < 9){
		month = "0"+(firstGame.getMonth()+1).toString()
	} else {
		month = (firstGame.getMonth()+1).toString()
	}
	if(firstGame.getDate() < 10){
		day = "0" + firstGame.getDate().toString()
	}else{
		day = firstGame.getDate().toString()
	}
	gameCodes.push(firstGame.getFullYear().toString() + month + day + "00")
	firstGame = firstGame.addDays(3)
	var month = ''
	var day = ''
	if(firstGame.getMonth() < 9){
		month = "0"+(firstGame.getMonth()+1).toString()
	} else {
		month = (firstGame.getMonth()+1).toString()
	}
	if(firstGame.getDate() < 10){
		day = "0" + firstGame.getDate().toString()
	}else{
		day = firstGame.getDate().toString()
	}
	gameCodes.push(firstGame.getFullYear().toString() + month + day + "00")
	firstGame = firstGame.addDays(1)
	var month = ''
	var day = ''
	if(firstGame.getMonth() < 9){
		month = "0"+(firstGame.getMonth()+1).toString()
	} else {
		month = (firstGame.getMonth()+1).toString()
	}
	if(firstGame.getDate() < 10){
		day = "0" + firstGame.getDate().toString()
	}else{
		day = firstGame.getDate().toString()
	}
	gameCodes.push(firstGame.getFullYear().toString() + month + day + "00")
	firstGame = firstGame.addDays(3)
}

console.log(gameCodes)



// var gameday = (firstGame.getFullYear().toString() + "0" + (firstGame.getMonth()+1).toString() + firstGame.getDate().toString() + "00")
// gameday = +gameday

// for(var i = 0; i <= 9; i++){
// 	gameCodes.push(gameday)

// }

for(var y = 0; y < gameCodes.length; i++){

	var gamesArray = []

	gameCode = gameCodes[i]

	for(var i = 0; i <= 14; i++){
		var urlBase = "http://www.nfl.com/liveupdate/game-center/" + gameCode +"/" + gameCode + "_gtd.json"
		gamesArray.push(urlBase)
		gameCode += 1
	}

	var Player = require('./models/players')

	for(var i = 0; i < gamesArray.length; i++){

		var gameUrl = gamesArray[i]

		request({
		    url: gameUrl,
		    json: true
		}, function (error, response, body) {

			

			if(error){
				console.log("error")
			}

		    if (!error && response.statusCode === 200) {
		    		for(each in body){


		    			if(typeof body[each] === 'object'){

		    				for(player in body[each].home.stats.passing){	  					

		    					Player.findOneAndUpdate({id : player}, 
		    							{	id: player,
		    								name: body[each].home.stats.passing[player].name,
		    								$push: { 'stats' : {
		    									week : gameCode,
		    									passingY : body[each].home.stats.passing[player].yds, 
			    								passingTD : body[each].home.stats.passing[player].tds, 
			    								passingINT : body[each].home.stats.passing[player].ints
			    							}},
		    								}
		    								// gameCode : {
			    							// 	passingY : body[each].home.stats.passing[player].yds, 
			    							// 	passingTD : body[each].home.stats.passing[player].tds, 
			    							// 	passingINT : body[each].home.stats.passing[player].ints 	    									
		    								// } 
		    							
		    						, {upsert : true, safe: true}, function(err, doc){
		    						if(err){
		    							console.log(err)
		    						}
		    					})

		    					// Player.findOneAndUpdate({id : player},
		    					// 			{$push: { 'stats' : {
		    					// 				week : gameCode,
		    					// 				passingY : body[each].home.stats.passing[player].yds, 
			    				// 				passingTD : body[each].home.stats.passing[player].tds, 
			    				// 				passingINT : body[each].home.stats.passing[player].ints
			    				// 			}}},
			    				// 			{safe : true},
			    				// 			function(err, model){
			    				// 				if(err){
			    				// 					console.log(err)
			    				// 				}
			    				// 			}
		    					// 	)
		    				}
		    				
	   				
		    				for(player in body[each].home.stats.rushing){
		    					
		    					Player.findOneAndUpdate({id : player}, 
		    							{	id: player, 
		    								name: body[each].home.stats.rushing[player].name, 
		    								rushingY : body[each].home.stats.rushing[player].yds, 
		    								rushingTD : body[each].home.stats.rushing[player].tds, 
		    						}
		    						,{upsert : true}, function(err, doc){
		    							if (err) {
		    								console.log(err)
		    							}
		    						})
		    				}

		    				for(player in body[each].home.stats.receiving){
		    					
		    					Player.findOneAndUpdate({id : player}, 
		    							{	id: player, 
		    								name: body[each].home.stats.receiving[player].name, 
		    								receivingY : body[each].home.stats.receiving[player].yds, 
		    								receivingTD : body[each].home.stats.receiving[player].tds, 
		    						}
		    						,{upsert : true}, function(err, doc){
		    							if (err) {
		    								console.log(err)
		    							}
		    						})
		    				}

		    				for(player in body[each].home.stats.fumbles){

		    					if(body[each].home.stats.fumbles[player].lost > 0){

			    					Player.findOneAndUpdate({id : player}, 
			    							{	id: player, 
			    								name: body[each].home.stats.fumbles[player].name, 
			    								fumbles : body[each].home.stats.fumbles[player].lost
			    						}
			    						, {upsert : true}, function(err, doc){
			    						if(err){
			    							console.log(err)
			    						}
			    					})
		    						
		    					}

		    				}

		    				for(player in body[each].away.stats.passing){

		    					Player.findOneAndUpdate({id : player}, 
		    							{	id: player,
		    								name: body[each].away.stats.passing[player].name,
		    								$push: { 'stats' : {
		    									week : gameCode,
		    									passingY : body[each].away.stats.passing[player].yds, 
			    								passingTD : body[each].away.stats.passing[player].tds, 
			    								passingINT : body[each].away.stats.passing[player].ints
			    							}},
		    							}
		    						, {upsert : true}, function(err, doc){
		    						if(err){
		    							console.log(err)
		    						}
		    					})

		    					// Player.findOneAndUpdate({id : player},
		    					// 			{$push: { 'stats' : {
		    					// 				week : gameCode,
		    					// 				passingY : body[each].away.stats.passing[player].yds, 
			    				// 				passingTD : body[each].away.stats.passing[player].tds, 
			    				// 				passingINT : body[each].away.stats.passing[player].ints
			    				// 			}}},
			    				// 			{safe : true},
			    				// 			function(err, model){
			    				// 				if(err){
			    				// 					console.log(err)
			    				// 				}
			    				// 			}
		    					// 	)
		    				}
	   				
		    				for(player in body[each].away.stats.rushing){
		    					
		    					Player.findOneAndUpdate({id : player}, 
		    							{	id: player, 
		    								name: body[each].away.stats.rushing[player].name, 
		    								rushingY : body[each].away.stats.rushing[player].yds, 
		    								rushingTD : body[each].away.stats.rushing[player].tds, 
		    						}
		    						,{upsert : true}, function(err, doc){
		    							if (err) {
		    								console.log(err)
		    							}
		    						})
		    				}

		    				for(player in body[each].away.stats.receiving){
		    					
		    					Player.findOneAndUpdate({id : player}, 
		    							{	id: player, 
		    								name: body[each].away.stats.receiving[player].name, 
		    								receivingY : body[each].away.stats.receiving[player].yds, 
		    								receivingTD : body[each].away.stats.receiving[player].tds, 
		    						}
		    						,{upsert : true}, function(err, doc){
		    							if (err) {
		    								console.log(err)
		    							}
		    						})
		    				}

		    				for(player in body[each].away.stats.fumbles){

		    					if(body[each].away.stats.fumbles[player].lost > 0){

			    					Player.findOneAndUpdate({id : player}, 
			    							{	id: player, 
			    								name: body[each].away.stats.fumbles[player].name, 
			    								fumbles : body[each].away.stats.fumbles[player].lost
			    						}
			    						, {upsert : true}, function(err, doc){
			    						if(err){
			    							console.log(err)
			    						}
			    					})
		    						
		    					}

		    				}

		    			}
		    		}		   
		    }
		})
	}
}

app.get('/getPlayers', function(req, res){
	Player.find( {passingY : {$gt : 100}}, function(err, doc){
		if(err){console.log(err)}
		else{
			res.send(doc)
		}
	})
})

mongoose.connect('mongodb://localhost/testNFL');

var port = 3000
app.listen(port, function(){
  console.log('Server running on port ' + port);

});