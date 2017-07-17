var http = require('http');
//var serviceBase = 'ec2-34-211-205-116.us-west-2.compute.amazonaws.com';
var serviceBase = 'localhost';
//var servicePort = 8080;
var servicePort = 6302;

exports.authenticate = function(req, res, callback) {
    var options = {
        host: serviceBase,
        path: '/authenticate',
        port: servicePort,
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    };
    
    var request = http.request(options, function(response) {
        var dataString = '';
        response.on('data', function(chunk) {
            dataString += chunk;
        });
        response.on('end', function() {
           var data = JSON.parse(dataString);
           callback(req, res, data);
        });
    });
    
    var requestBody = {
        username: req.body.username,
        password: req.body.password
    };
    
    request.write(JSON.stringify(requestBody));
    request.end();
};

exports.getUserById = function(req, res, userId, callback) {
    var options = {
        host: serviceBase,
        path: '/users/' + userId,
        port: servicePort,
        headers: {'Content-Type': 'application/json'}
    };
    
    http.get(options, function(response) {
        var dataString = '';
        response.on('data', function(chunk) {
            dataString += chunk;
        });
        response.on('end', function() {
           var data = JSON.parse(dataString);
           callback(req, res, data);
        });
    });
};