var mongoose = require('mongoose');
var blogSchema = new mongoose.Schema({
	title  : String,
	body   : String,
	date   : {type: Date, default: Date.now},
	author : String,
	userId : String
});

mongoose.model('Blog', blogSchema);