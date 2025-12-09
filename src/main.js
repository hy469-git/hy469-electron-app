const { app, BrowserWindow, ipcMain } = require('electron');
// const fetch = require('electron-fetch').default
const path = require('path');
const { fork } = require('child_process');
const io = require("socket.io-client");
const mqtt = require("mqtt");
const config = require(path.join(__dirname, "../config.json"));

var win;

// Initialize Intermediate Process (Socket Server) if enabled
if (config.enable_socket) {
    let intermediate = fork(path.join(__dirname, "./intermediate.js"));
    intermediate.on("close", (code) => {
        console.log(`Intermediate closed with code: ${code}`);
    });
}

// Socket listeners
let socket;
if (config.enable_socket) {
    socket = io(config.socket_url);

    //Connect to intermediate as frontend so that we can receive messages
    socket.on("connect", () => {
        console.log("Connected to intermediate");
        socket.emit("socketID", "frontend");
    });

    //Example of receiving data from intermediate and sending it to renderer
    socket.on("message", (data) => {
        if (win) {
            win.webContents.send("message", data);
        }
    });
}

async function createWindow() {
    win = new BrowserWindow({
        width: 1920,
        height: 1080,
        fullscreen: false,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, "preload.js")
        }
    });

    console.log(`Loading URL: ${config.frontend_ip}`);
    let frontend_ip = config.frontend_ip;

    win.loadURL(frontend_ip)

    win.on('closed', () => {
        win = null;
    })

    win.once('ready-to-show', () => {
        win.show()
    })
    win.setMenuBarVisibility(false);

}


//Launch

//MQTT client
let client;
if (config.enable_mqtt) {
    const broker = config.mqtt_broker;
    console.log(`Connecting to MQTT broker: ${broker}`);
    client = mqtt.connect(broker);
    const topic = `/systems/${config.mqtt_topic}/in`;

    client.on("connect", () => {
        console.log("Connected to MQTT broker")
        client.subscribe(topic, (err) => {
            console.log(`Subscribed to ${topic}`);
            if (err) {
                console.error(err);
                client.end();
            }
        });
    });

    client.on("message", (topic, message) => {
        const msg = message.toString();
        console.log(`Received message on topic ${topic}: ${msg}`);

        if (win) {
            console.log(`Sending ${msg} to renderer`);
            // Forwarding the message to the renderer
            win.webContents.send("mqtt-message", msg);
        }
    });

    client.on("error", (error) => {
        console.error("MQTT Error:", error);
        client.end();
    });
}

ipcMain.on("mqtt-publish", (event, arg) => {
    if (client && config.enable_mqtt) {
        const pubTopic = `/systems/${config.mqtt_topic}/out`;
        console.log(`Publishing to ${pubTopic}: ${arg}`);
        client.publish(pubTopic, arg);
    } else {
        console.log("MQTT is disabled or not connected, cannot publish.");
    }
})

ipcMain.on("message", (event, arg) => {
    if (socket && config.enable_socket) {
        console.log(`Sending socket message: ${JSON.stringify(arg)}`);
        socket.emit("message", arg);
    } else {
        console.log("Socket is disabled or not connected, cannot send.");
    }
})

app.on('ready', createWindow)

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        if (client) client.end();
        app.quit();
    }
});

app.on("activate", function () {
    if (win === null) createWindow();
});
