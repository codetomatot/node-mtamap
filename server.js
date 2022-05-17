const express = require("express");
const path = require('path');
const http = require('http');
const fs = require('fs');
const router = express.Router();
app = express();
const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

app.use(express.static(__dirname+"/main"));
console.log(__dirname);
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname+'/main/map.html'));
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname+'/main/abt.html'));
});
app.get('/indexx', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.js'));
});
app.get('/stopsdump', (req, res) => {
    res.sendFile(path.join(__dirname+'/stops.txt'));
});
app.get('/stopsmk', (req,res) => {
    res.sendFile(path.join(__dirname+'/rrdata.json'));
    res.se
});
app.post('/stopsmk', (req,res) => {
    res.sendStatus(200);
    let body = "";
    filePath = __dirname+"/rrdata.json";
    req.on('data', (data) => {
        body += data;
    });
    req.on('end', () => {
        fs.writeFile(filePath, body, () => {
            res.end();
        });
    });
});

http.get('http://localhost:8080/stopsmk', (res) => {
    console.log(res.statusCode);
    // console.log(process.env.MAPBOX);
})
// app.use('/', router);
app.listen(8080);
