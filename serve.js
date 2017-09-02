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

const httpsPort = 6001;

// serve static assets normally
app.use('/', express.static('build'));
// app.use('/', express.static('landing-page/app'));


app.use(function(req,resp,next){
  if (req.headers['x-forwarded-proto'] === 'http') {
    return resp.redirect(port, 'https://' + req.headers.host + '/');
  } else {
    return next();
  }
});

app.get('/privacy', function(request, response) {
  response.sendFile(path.resolve('privacypolicy.htm'));
});


// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function(request, response) {
  response.sendFile(path.resolve('build', 'index.html'));
});

https.createServer(sslOptions, app).listen(httpsPort, function() {
  console.log("server started on port " + httpsPort);
});

// Redirect from http port 80 to https
http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(8000);
