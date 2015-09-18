var mongoose = require('mongoose');
var blogSchema = new mongoose.Schema({
	title  : String,
	body   : String,
	date   : String,
	author : String,
	userId : String
});

mongoose.model('Blog', blogSchema);