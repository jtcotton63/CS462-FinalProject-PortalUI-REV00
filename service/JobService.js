var http = require('http');
var qs = require('querystring');
var serviceBase = 'ec2-52-36-117-25.us-west-2.compute.amazonaws.com';
var servicePort = 8080;

exports.getJobs = function(req, res, callback) {
    var path = '/jobs?' + qs.stringify(req.query);
    
    var options = {
        host: serviceBase,
        path: path,
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

exports.updateJob = function(req, res, jobId, callback) {
    var path = '/jobs/' + jobId;
    
    var options = {
        host: serviceBase,
        path: path,
        port: servicePort,
        method: 'PUT',
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
    
    var requestBody = req.body;
    
    request.write(JSON.stringify(requestBody));
    request.end();
};