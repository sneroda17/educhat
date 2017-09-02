const fs = require('fs');
const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
const https = require('https');
const privateKey = fs.readFileSync('ssl/www.edu.chat.key', 'utf8');
const certificate = fs.readFileSync('ssl/edu.chat_combined.crt', 'utf8');
const http = require('http');

const sslOptions = {
  key: privateKey,
  cert: certificate
};

const httpsPort = 7001;


app.get('/', function(request, response) {
  response.sendFile(path.resolve('privacypolicy.htm'));
});


https.createServer(sslOptions, app).listen(httpsPort, function() {
  console.log("server started on port " + httpsPort);
});