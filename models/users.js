var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
	name : {type : String},
	team : {type : Array}
})

var User = mongoose.model('user', userSchema)

module.exports = User