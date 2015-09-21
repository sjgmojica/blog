var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstname: String,
	lastname : String,
	email    : {type: String, unique: true},
	password : String
});
mongoose.model('User', userSchema);