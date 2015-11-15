var mongoose = require('mongoose')

var playerSchema = new mongoose.Schema({
  	id : {type : String},
    position : {type : String},
  	name : {type: String},
  	passingY : {type : Number},
  	passingTD : {type : Number},
  	passingINT : {type : Number},
  	rushingY : {type : Number},
  	rushingTD : {type : Number},
  	receivingY : {type : Number},
  	receivingTD : {type : Number},
  	fumbles : {type : Number},
    stats : {type : Array},
    team : {type : String}
})

var Player = mongoose.model('player', playerSchema)

module.exports = Player