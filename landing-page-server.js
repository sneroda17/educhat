const fs = require('fs');
const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
const https = require('https');
const privateKey = fs.readFileSync('ssl/www.edu.chat.key', 'utf8');
const certificate = fs.readFileSync('ssl/edu.chat_combined.crt', 'utf8');
// const http = require('http');


const sslOptions = {
  key: privateKey,
  cert: certificate
};

const httpsPort = 443;

// This middleware tells aws load balancer to redirect from http to https
app.use(function(req, res, next) {
    if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
        res.redirect('https://' + req.get('Host') + req.url);
    }
    else
        next();
});

// serve static assets 
app.use('/', express.static('landing-page/app'));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "landing-page/app/index.html"));
});

app.get("/careers", (req, res) => {
  res.sendFile(path.join(__dirname, "landing-page/app/careers.html"));
});

app.get("/press", (req, res) => {
  res.sendFile(path.join(__dirname, "landing-page/app/press.html"));
});


https.createServer(sslOptions, app).listen(httpsPort, function() {
  console.log("server started on port " + httpsPort);
});


// Redirect from http port 80 to https
const http = require('http');

http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);



