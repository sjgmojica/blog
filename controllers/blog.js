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
            res.send("There was a problem adding new blog to database :: " + err);
        } else {
            req.session.message = 'Successfully added blog';
            res.redirect('/blog');
        }
    });
}

// Fetch all the blog data from blogs collections
var blogList = function(req, res, cbblog) {
    mongoose.model('Blog').find({}, function(err, blog) {
        if (err) {
            res.send("There was a problem retrieving blog id :: " + err);
        } else {
            cbblog(blog);
        }
    });
}

// Fetch all the blog data by userID from blogs collections
var blogListById = function(req, res, cbblog) {
    mongoose.model('Blog').find({userId: req.session.user._id}, function(err, blog) {
        if (err) {
            res.send("There was a problem retrieving blog id :: " + err);
        } else {
            cbblog(blog);
        }
    });
}

// Find blog by id from blogs collections.If exists, the fetch data will display to edit page
var getBlogById = function(req, res, cbblogOne) {
    mongoose.model('Blog').findById(req.param('blog_id'), function(err, blog) {
        if (err) {
            res.send("Get blog by id ::" + err);
        } else {
            res.render('blog/edit', { blog: blog });
        }
    });
}

// Find blog by id from blogs collections.After updating the data it will redirect to /blog or view home page
var updateBlog = function(req, res) {
    mongoose.model('Blog').findById(req.param('blog_id'), function(err, blog) {
        if (err) {
            res.send("PUT blog by id. error on find by id :: " + err);
        } else {
            blog.update({
            title : req.body.blogTitle,
            body : req.body.blogBody,
            date : req.body.date,
            author : req.body.author,
            userId : req.session.user._id    
            }, function(err, blogId) {
                if (err) {
                    res.send("PUT blog by id :: " + err);
                } else {
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
            res.send("DELETE blog by id. error on find by id :: " + err);
        } else {
            blog.remove(function(err, blogId) {
                if (err) {
                    res.sender("DELETE blog by id ::" + err);
                } else {
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
exports.blogListById = blogListById;