var awsIot = require('aws-iot-device-sdk');
var express = require('express');
var request = require('request');

var app = express();
var http = require('http').createServer(app);
var device = awsIot.device({
    clientId: 'contiki-cooja',
    host: '<...>.amazonaws.com',
    port: 8883,
    keyPath: './certs/private.pem.key',
    certPath: './certs/cooja2-certificate.pem.crt',
    caPath: './certs/AmazonRootCA1.pem',
});


app.get('/', function(req, res){
 res.send('WebSense AWS Cloud');
});
http.listen(3000, function(){
 console.log('listening on *:3000');
 console.log('websense aws Cloud was started');
});

var isSubscribe = true;
device.on('connect', function() {
 console.log('connected to AWS IoT.'); 
 console.log('getting value from sensor with IP addr: ',process.argv[2]);
 mydeviceId = process.argv[2];
 // optional to subscribe
 if(isSubscribe)
 device.subscribe('contiki-ng-sensor');
 setInterval(function(){
 request.get('http://['+mydeviceId+']/',function
(err,res,body){
 if(err){
 //console.log(err);
 return;
 }
 var obj = JSON.parse(body);
 console.log(obj);
 //var temperature = obj.temp;
 //var light = obj.light;
 var data = JSON.stringify({date: new Date(), deviceId: mydeviceId, data:obj });
 device.publish('contiki-ng-sensor', data);
 console.log('sent: ', JSON.stringify(data));
 });
 }, 3000);
});


device
 .on('message', function(topic, payload) {
 console.log('recv: ', topic, payload.toString());
});
console.log('Contiki-NG AWS Middleware started.');

