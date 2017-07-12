var http = require('http');
var qs = require('querystring');
var serviceBase = 'ec2-52-36-117-25.us-west-2.compute.amazonaws.com';
var servicePort = 8080;

exports.getJobs = function(req, res, callback) {
    console.log('In getJobs query params');
    
    var path = '/jobs?' + qs.stringify(req.query);
    console.log('THIS IS THE JOBS REQUEST PATH');
    console.log(path);
    
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
           console.log('On data end: ' + dataString);
           callback(req, res, data);
        });
    });
};