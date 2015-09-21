var mongoose = require('mongoose');

// Save new blog post to blogs collections
var addBlog = function(req, res) {
    mongoose.model('Blog').create({
        title : req.body.blogTitle,
        body : req.body.blogBody,
        date : req.body.date,
        author : req.session.user.firstname,
        userId : req.session.user._id
    }, function (err, user) {
        if (err) {
            console.log("There was a problem adding new blog to database :: " + err);
            res.send("There was a problem adding new blog to database :: " + err);
        } else {
            console.log("POST new users ::" + user);
            req.session.message = 'Successfully added blog';
            res.redirect('/blog');
        }
    });
}

// Fetch all the blog data from blogs collections
var blogList = function(req, res, cbblog) {
    mongoose.model('Blog').find({}, function(err, blog) {
        if (err) {
            console.log("GET error: problem on retirieving blog id :: " + err);
            res.send("There was a problem retrieving blog id :: " + err);
        } else {
            cbblog(blog);
        }
    });
}

// Find blog by id from blogs collections.If exists, the fetch data will display to edit page
var getBlogById = function(req, res, cbblogOne) {
    mongoose.model('Blog').findById(req.param('blog_id'), function(err, blog) {
        console.log("there")
        if (err) {
            console.log("Get blog by id :: " + err);
            res.send("Get blog by id ::" + err);
        } else {
            console.log(blog);
            res.render('blog/edit', { blog: blog });
        }
    });
}

// Find blog by id from blogs collections.After updating the data it will redirect to /blog or view home page
var updateBlog = function(req, res) {
    mongoose.model('Blog').findById(req.param('blog_id'), function(err, blog) {
        if (err) {
            console.log("PUT blog by id. error on find by id :: " + err);
            res.send("PUT blog by id. error on find by id :: " + err);
        } else {
            blog.update({
            title : req.body.blogBody,
            body : req.body.blogTitle,
            date : req.body.date,
            author : req.body.author,
            userId : req.session.user._id    
            }, function(err, blogId) {
                if (err) {
                    console.log("PUT blog by id ::" + err);
                    res.send("PUT blog by id :: " + err);
                } else {
                    console.log("Successfully updated blog by id then redirect to /blog");
                    res.redirect('/blog');
                }
            });
        } 
    });
}

// Find blog by id from blogs collections.After deleting the data it will redirect to /blog or view home page
var deleteBlog = function(req, res) {
    mongoose.model('Blog').findById(req.param('blog_id'), function(err, blog) {
        if (err) {
            console.log("DELETE blog by id. error on find by id :: " + err);
            res.send("DELETE blog by id. error on find by id :: " + err);
        } else {
            blog.remove(function(err, blogId) {
                if (err) {
                    console.log("DELETE blog by id ::" + err);
                    res.sender("DELETE blog by id ::" + err);
                } else {
                    console.log("Successfully deletes blog by id :: " + blog._id);
                    res.redirect('/blog');
                }
            });    
        }
    });
}

exports.addBlog = addBlog;
exports.blogList = blogList;
exports.getBlogById = getBlogById;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;