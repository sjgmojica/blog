var express  = require('express');
var router   = express.Router();
var bodyParser = require('body-Parser');
var methodOverride = require('method-override');
var session  = require('express-session');
var expressValidator = require('express-validator');
var user = require('../controllers/user');
var blog = require('../controllers/blog');

router.use(session({
    secret : '12345678QWERTY',
}));

// Parsing the HTTP method for PUT and DELETE  
router.use(bodyParser.urlencoded({ extended: true }));
router.use(expressValidator()); 
router.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
    }

}));

function checkSession(req, res, target) {
    if (!req.session.user) {
        res.redirect(target);
    }
}
router.get('/', function(req, res) {
    checkSession(req, res, '/login');
    res.redirect('/blog');
});

// GET login
router.get('/login', function(req, res) {
    if (req.session.user) {
        res.redirect('/blog');
    }
    res.render('login', {});
});

// POST login
router.post('/login', function(req, res) {
    user.login(req, res);
});

// GET /blog. Landing page after login, post, edit and delete.
// If users have blog data to the blogs DB. the blogList function will just display blog data to users home page.
// If users have no blog data to the blogs DB, the blogList function will nothing to display.
router.get('/blog', function(req, res) {
    var message = req.session.message;
    if (req.session.message)
        req.session.message = null;

    blog.blogList(req, res, function (bloglist) {
        res.render('blog/home', { user: req.session.user, message: message, blogs: bloglist});
    });
});

// GET register.Render the registration form
router.get('/register', function(req, res) {
    if (req.session.user) {
        res.redirect('/blog');
    }
    res.render('register', {});
});

// POST register. Save new user 
router.post('/register', function(req, res) {
    req.checkBody("email", "Enter a valid email address").isEmail();
    req.checkBody("password", "Password required 8 characters").isLength(8);
    var errors = req.validationErrors();
    if (errors) {
        res.render('register', { errors: errors });
    } else {
        console.log("registration with checking of valid email and password");
        user.register(req, res);
    }
});

// GET profile. It will call the function getProfile to get the data of users
router.get('/user/:id', function(req, res){
    user.getProfile(req, res);
});

// PUT update profile. It will call the function updateProfile to update data of users
router.put('/user/:id', function(req, res) {
    console.log("PUT METHOD TO UPDATE");
    user.updateProfile(req, res)
});

// GET logout. It will redirect to /login page
router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/login');
});


// GET new blog. render the new blog page
router.get('/user/:id/blog', function(req, res) {
    blog.blogListById(req, res, function (bloglist) {
        res.render('blog/blog', { user: req.session.user, blogs: bloglist});
    });
}); 

router.get('/user/:id/blog/add', function(req, res) {
    res.render('blog/new', { title: 'Add New Blog'});
});

// POST blog. It will call the function addBlog and save the new blog post
router.post('/user/:id/blog/add', function(req, res) {
    blog.addBlog(req, res);
});

// GET blog. It will call the function getBlogById to fetch specific blog data for updates
router.get('/user/:id/blog/:blog_id', function(req, res) {
    blog.getBlogById(req, res);
});

//PUT blog. It will call the function updatedBlog to update the blog data
router.put('/blog/:blog_id', function(req, res) {
    blog.updateBlog(req, res);
});

//DELETE blog. It will call the function deleteBlog for deleting specific blog.
router.delete('/user/:id/blog/:blog_id', function(req, res) {
    blog.deleteBlog(req, res);
});


module.exports = router;
