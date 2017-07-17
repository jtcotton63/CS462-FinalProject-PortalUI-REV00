var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var fs = require('fs');



// 
var app = express();
var jobService = require('./service/JobService');
var userService = require('./service/UserService');



// Config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());



// Configure router
var router = express.Router();

// Standard routes

router.get('/', function(req, res) {
    // Determine if they have a cookie
    var userIdCookie = req.cookies.userId;
    if(userIdCookie === undefined) {
        res.redirect('/login');
    }
    
    else {
        res.sendFile(__dirname + '/views/index.html');
    }
});

router.post('/authenticate', function(req, res) {
    userService.authenticate(req, res, function(req, res, data) {
        if(data.authenticated === true) {
            var id = data.userId;
            res.cookie("userId", id);
            res.redirect('/');
        }
        
        else {
            res.status(401);
            res.send({error: "Invalid username and/or password"});
        }
    });
});

router.get('/login', function(req, res) {
    res.sendFile(__dirname + '/views/login.html');
});

router.get('/logout', function(req, res) {
    // Remove the cookie 
    res.clearCookie('id');
    res.redirect('/login');
});

router.get('/users', function(req, res) {
    // Determine if they have a cookie
    var userIdCookie = req.cookies.userId;
    if(userIdCookie === undefined) {
        res.redirect('/login');
    }
    
    else {
        
        // Make sure they have admin priviledges
        userService.getUserById(req, res, userIdCookie, function(req, res, user) {
            userService.isAdmin(user, function(result) {
                console.log(result);
                if(result === true)
                    res.sendFile(__dirname + '/views/users.html');
                else
                    res.redirect('/');
            });
         });
    }
});



// Job service calls

router.get('/services/job/jobs', function(req, res) {
    jobService.getJobs(req, res, function(req, res, data) {
       res.json(data);
    });
});

router.post('/services/job/jobs', function(req, res) {
    jobService.createJob(req, res, function(req, res, data) {
       res.json(data);
    });
});

router.delete('/services/job/jobs/:jobId', function(req, res) {
    var jobId = req.params.jobId;
    jobService.deleteJob(req, res, jobId, function(req, res) {
       res.status(204).send();
    });
});

router.put('/services/job/jobs/:jobId', function(req, res) {
    var jobId = req.params.jobId;
    jobService.updateJob(req, res, jobId, function(req, res, data) {
       res.json(data);
    });
});



// User service calls

router.get('/services/user/users/:userId', function(req, res) {
    var userId = req.params.userId;
    userService.getUserById(req, res, userId, function(req, res, data) {
       res.json(data);
    });
});

app.use('/', router);



// Start the app
var port = 8080;
app.listen(port, function () {
    console.log('Server started on port ' + port);
});
