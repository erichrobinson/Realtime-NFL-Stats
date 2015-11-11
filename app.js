var mongoose = require('mongoose');
var request = require('request')
var findOrCreate = require('mongoose-findorcreate')
var db = mongoose.connection;
// var Promise = require('bluebird')
var async = require('async')

db.on('error', console.error);

var date = new Date()

var gameCode = 2015110100

var gamesArray = []

for(var i = 0; i <= 11; i++){
	gameCode += 1
	var urlBase = "http://www.nfl.com/liveupdate/game-center/" + gameCode +"/" + gameCode + "_gtd.json"
	gamesArray.push(urlBase)
}

var playerSchema = new mongoose.Schema({
  	id : {type : String},
  	name : {type: String},
  	passingY : {type : Number},
  	passingTD : {type : Number},
  	passingINT : {type : Number},
  	rushingY : {type : Number},
  	rushingTD : {type : Number},
  	receivingY : {type : Number},
  	receivingTD : {type : Number}
})

playerSchema.plugin(findOrCreate)

var Player = mongoose.model('Player', playerSchema);

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

	    					console.log("PLAYER", body[each].home.stats.passing[player])

	    					Player.findOneAndUpdate({id : player}, 
	    							{	id: player, 
	    								name: body[each].home.stats.passing[player].name, 
	    								passingY : body[each].home.stats.passing[player].yds, 
	    								passingTD : body[each].home.stats.passing[player].tds, 
	    								passingINT : body[each].home.stats.passing[player].ints 
	    						}
	    						, {upsert : true}, function(err, doc){
	    						if(err){
	    							console.log(err)
	    						}
	    						else{
	    							console.log("created or updated")
	    						}
	    					})

	    					// Player.update({id : player}, 
	    					// 	{	id: player, 
	    					// 		name: body[each].home.stats.passing[player].name, 
	    					// 		passingY : body[each].home.stats.passing[player].yds, 
	    					// 		passingTD : body[each].home.stats.passing[player].tds, 
	    					// 		passingINT : body[each].home.stats.passing[player].ints 
	    					// 	},
	    					// 	{upsert : true}
	    					// 	// function(err, found, created){
	    					// 	// if(err){
	    					// 	// 	console.log(err)
	    					// 	// }
	    					// )
	    				}
   				
	    				for(player in body[each].away.stats.passing){
	    					
	    					Player.update({id : player}, 
	    						{	id: player, 
	    							name: body[each].away.stats.passing[player].name, 
	    							passingY : body[each].away.stats.passing[player].yds, 
	    							passingTD : body[each].away.stats.passing[player].tds, 
	    							passingINT : body[each].away.stats.passing[player].ints 
	    						},
	    						{upsert : true}
	    						// function(err, found, created){
	    						// if(err){
	    						// 	console.log(err)
	    						// }
	    					)
	    					// Player.findOrCreate({id: player}, 
	    					// 	({	id: player, name: body[each].away.stats.passing[player].name, 
	    					// 		passingY : body[each].away.stats.passing[player].yds, 
	    					// 		passingTD : body[each].away.stats.passing[player].tds, 
	    					// 		passingINT : body[each].away.stats.passing[player].ints }),
	    					// 	function(err, found, created){
	    					// 	if(err){
	    					// 		console.log(err)
	    					// 	}
	    					// })
	    				}

	    			}
	    		}		   
	    }
	})
}

// setTimeout(function(){
// 	for(var i = 0; i < gamesArray.length; i++){

// 	var gameUrl = gamesArray[i]
// 		request({
// 		    url: gameUrl,
// 		    json: true
		
// 		}, function (error, response, body) {

// 			if(error){
// 				console.log("error")
// 			}

// 		    if (!error && response.statusCode === 200) {
// 		    		for(each in body){

// 		    			if(typeof body[each] === 'object'){
		    				
// 		    				for(player in body[each].home.stats.rushing){

// 		    					Player.findOrCreate({id: player}, ({id: player, name: body[each].home.stats.rushing[player].name}), function(err, newPlayer, created){
// 		    						if(err){
// 		    							console.log(err)
// 		    						}
// 		    					})
// 		    				}
// 		    				for(player in body[each].away.stats.rushing){
		    					
// 		    					Player.findOrCreate({id: player}, ({id: player, name: body[each].away.stats.rushing[player].name}),function(err, newPlayer, created){
// 		    						if(err){
// 		    							console.log(err)
// 		    						}		    				
// 		    					})
// 		    				}
// 		    			}
// 		    		}
// 		    }
// 		})
// 	}
// }, 2500)

// setTimeout(function(){
// 	for(var i = 0; i < gamesArray.length; i++){

// 	var gameUrl = gamesArray[i]
// 		request({
// 		    url: gameUrl,
// 		    json: true
		
// 		}, function (error, response, body) {

// 			if(error){
// 				console.log("error")
// 			}


// 		    if (!error && response.statusCode === 200) {
// 		    		for(each in body){

// 		    			if(typeof body[each] === 'object'){

// 		    				for(player in body[each].home.stats.receiving){

// 		    					Player.findOrCreate({id: player}, ({id: player, name: body[each].home.stats.receiving[player].name}), function(err, newPlayer, created){
// 		    						if(err){
// 		    							console.log(err)
// 		    						}
// 		    					})
// 		    				}
// 		    				for(player in body[each].away.stats.receiving){
		    					
// 		    					Player.findOrCreate({id: player}, ({id: player, name: body[each].away.stats.receiving[player].name}),function(err, newPlayer, created){
// 		    						if(err){
// 		    							console.log(err)
// 		    						}		    				
// 		    					})
// 		    				}
// 		    			}
// 		    		}
// 		    }
// 		})
// 	}
// }, 4000)




mongoose.connect('mongodb://localhost/testNFL');