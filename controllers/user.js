var mongoose = require('mongoose');

// Find username and password from users collections. If valid redirect to /blog or view home page
var login = function(req, res) {
	mongoose.model('User').findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            console.log("There was a problem retrieving email and password:: " + err);
            return handleError(err);
        } else {
            console.log("check db return :: "+ user);
            if (!user) {
                console.log('Invalid username or password');
                res.render('login', { message: 'Invalid username or password' });
            } else  {
                if (user.email === req.body.email && user.password === req.body.password) {
                    req.session.user = user;
                    console.log(req.session);
                    console.log('Valid username and password');
                    res.redirect('/blog');
                }
            }
        }
    });
}

// Add new users. Upon successful registation it will redirect to /login or login page
var register = function(req, res) {
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
            res.redirect('/login');
        }
    });
}

// Find users data by id from users collections then render the edit view page 
var getProfile = function(req, res) {
    mongoose.model('User').findById(req.param('id'), function(err, user) {
        if (err) {
            console.log("GET error: problem on retirieving users id heheheh:: " + err);
            res.send("There was a problem retrieving users id heheheheh:: " + err);
        } else {
            console.log("GET id :: Update :: " + user._id);
            res.render('edit', { user: user })
        }
    });
}

// Find users profile from users collections and update the data then redirect to /blog page
var updateProfile = function(req, res) {
    mongoose.model('User').findById(req.param('id'), function(err, user) {
        user.update({
            firstname : req.body.firstname,
            lastname  : req.body.lastname,
            email     : req.body.email,
            password  : req.body.password
        }, function(err, userId){
            if (err) {
                console.log("PUT error :: Update :: " + err);
                res.send("There was a problem updating the info to the blogDB :: " + err);
            } else {
                console.log("Successfully update profile");
                console.log(req.body.firstname);
                req.session.user.firstname = req.body.firstname;
                req.session.message = 'Successfully updated profile';
                res.redirect('/blog');
            }
        })
    });
}

exports.login = login;
exports.register = register;
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;