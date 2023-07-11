// establish the HTTPs server

// IMPORT DEPS
const express = require('express');
const ss = require('screenshot-desktop');
//IMPORT KEYBOARD & MOUSE EMULATOR
const robot = require("robotjs");

// INIT EXPRESS WEBSITE
const app = express();




let screenSize = robot.getScreenSize();


//API PACKETS
let packets = {
    'accepted': {
        'type': 'acceptance',
    },
    'rejected': {
        'type': 'rejection',
    }
}


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

// ON /mouse.png GET REQUEST
app.get('/mouse', (req, res) => {
    res.sendFile(__dirname + '/public/mouse.png');
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

api.get("/emulateclick", async (req, res) => {
    console.log("click");
    //get query X,Y
    let x = req.query.x;
    let y = req.query.y;

    //move mouse to X,Y
    robot.moveMouse(x, y);
    robot.mouseClick();
    //send acceptance packet
    res.send(packets.accepted);


})

api.get("/movepos", async (req, res) => {
    
    let pack = {
        x: robot.getMousePos().x,
        y: robot.getMousePos().y,
    }

    res.send(pack);
})

api.get("/emulatemove", async (req, res) => {
    //get query X,Y
    let x = req.query.x;
    let y = req.query.y;

    //move mouse to X,Y
    robot.moveMouse(x, y);

    //send acceptance packet
    res.send(packets.accepted);
})


api.get("/emulatekeyboard", async (req, res) => {
    //get query X,Y
    let key = req.query.key;

    //convert character to keycode
    let keycode = robot.keycode(key);
    robot.keyTap(keycode);

    //send acceptance packet
    res.send(packets.accepted);
});

api.get("/screensize", async (req, res) => {
    let pack = {
        width: screenSize.width,
        height: screenSize.height,
        package: packets.accepted
    }

    res.send(pack);
})

