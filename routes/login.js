var express  = require('express'),
    router   = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-Parser'),
    methodOverride = require('method-override');

// Parsing the HTTP method for PUT and DELETE  
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
    }

}))
console.log("login to");
// GET login page
router.get('/login', function(req, res) {
	res.redirect('login');
    //res.send("login page to");
});


// POST login
router.post('/blogs', function(req, res) {
	// Find username and password on blogDB 
    console.log("check body :" + req.body.email + " "+ req.body.password);
    mongoose.model('User').findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            console.log("There was a problem retrieving email and password:: " + err);
            return handleError(err);
        } else {
            console.log("check db return :: "+ user);
            if (!user) {
                console.log('Invalid username or password');
                //req.flash("messages", { "error" : "Invalid username or password" });
                //res.locals.messages = req.flash();
                res.render('index');
            } else  {
                if (user.email === req.body.email && user.password === req.body.password) {
                    console.log('Valid username and password');
                    //req.flash("messages", { "success" : "Sign in Success" });
                    //res.locals.messages = req.flash();
                    res.render('blog/home', { user: user });
                }
            }
        }
    })
});

// Create an account
// GET signup
router.get('/signup', function(req, res) {
	res.render('register', { title: 'Registration'});
});

// POST signup
router.post('/users', function(req, res) {
    mongoose.model('User').create({
    	firstname : req.body.firstname,
    	lastname  : req.body.lastname,
    	email     : req.body.email,
    	password  : req.body.password
    }, function (err, user) {
    	if (err) {
    		console.log("There was a problem adding new users to database :: " + err);
    		res.send("There was a problem adding new users to database :: " + err);
    	} else {
    		console.log("POST new users ::" + user);
    		res.render('index', { message: 'Successfully added user'});
    	}
    })
});

// Update profile
// Middleware to get users id
router.param('id', function(req, res, next, id) {
    console.log("---- middleware --- " + id + " exist");
    mongoose.model('User').findById(id, function(err, user) {
        if (err) {
            console.log("middleware :: " + id + "was not found");
            res.status(404)
            var err = new Error('Not Found');
            next(err);
        } else {
            console.log("middleware ::" + id + "was found");
            req.id = id;
            next();
        }
    });
});

// GET update profile
router.get('/users/:id', function(req, res){
    console.log("EDIT id :: " + req.id);
    // Find user's id from blogDB to update the profile
    mongoose.model('User').findById(req.id, function(err, user) {
        if (err) {
            console.log("GET error: problem on retiriebing user's id :: " + err);
            res.send("There was a problem retrieving users id :: " + err);
        } else {
            console.log("GET id :: Update :: " + user._id);
            res.render('blog/edit', { user: user })
        }
    });
});

// PUT update profile
router.put('/users/:id', function(req, res) {
    console.log("PUT METHOD TO UPDATE");
    // Find users profile first, then update the data
    mongoose.model('User').findById(req.id, function(err, user) {
        // Update user's data
        user.update({
            firstname : req.body.firstname,
            lastname  : req.body.lastname,
            email     : req.body.email,
            password  : req.body.password
        }, function(err, userId){
            if (err) {
                console.log("PUT error :: Update :: " + err);
                rese.send("There was a problem updating the info to the blogDB :: " + err);
            } else {
                console.log("Successfully update profile");
                res.render('blog/home', { user: user });
            }
        })
    });

});

// GET logout
router.get('/logout', function(req, res) {
    console.log("LOGOUT");
    res.render('index', { message: 'Successfully logout'});
});

module.exports = router;
