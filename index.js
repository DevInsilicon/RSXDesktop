// establish the HTTPs server

// IMPORT DEPS
const express = require('express');
const ss = require('screenshot-desktop');

// INIT EXPRESS WEBSITE
const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// ON / GET REQUEST
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.listen(80, () => {
    console.log("Server started on port 80")
})

// INIT EXPRESS API
const api = express();

api.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// ON / GET REQUEST
api.get('/', (req, res) => {
    res.send("Pong!")
})

api.listen(3000, () => {
    console.log("API started on port 3000")
})

// FUNCTION CONVERT IMG TO BASE64
async function imgToBase64() {
    // use screenshot-desktop don't write to file
    let ss_data = await ss();

    // convert to base64
    let base64 = ss_data.toString('base64');

    return base64;
}

//API HANDLER

api.get("/screenshot", async (req, res) => {
    let base64 = await imgToBase64();
    res.send(base64);
});