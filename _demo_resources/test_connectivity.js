const mqtt = require('mqtt');
const io = require('socket.io-client');
const config = require('../config.json');

console.log("Starting Connectivity Test...");

// --- MQTT Test ---
if (config.enable_mqtt) {
    console.log(`Connecting to MQTT Broker: ${config.mqtt_broker}`);
    const client = mqtt.connect(config.mqtt_broker);
    const topicIn = `/systems/${config.mqtt_topic}/in`;
    const topicOut = `/systems/${config.mqtt_topic}/out`;

    client.on('connect', () => {
        console.log("MQTT Connected!");

        // Subscribe to 'out' (what Electron publishes)
        client.subscribe(topicOut, (err) => {
            if (!err) console.log(`Subscribed to ${topicOut}`);
        });

        // Publish to 'in' (what Electron listens to)
        setInterval(() => {
            const msg = `Test Message ${new Date().toLocaleTimeString()}`;
            console.log(`Sending MQTT to ${topicIn}: ${msg}`);
            client.publish(topicIn, msg);
        }, 5000);
    });

    client.on('message', (topic, message) => {
        console.log(`MQTT Received on ${topic}: ${message.toString()}`);
    });
} else {
    console.log("MQTT is disabled in config.");
}

// --- Socket Test ---
if (config.enable_socket) {
    console.log(`Connecting to Socket Server: ${config.socket_url}`);
    const socket = io(config.socket_url);

    socket.on('connect', () => {
        console.log("Socket Connected!");
        socket.emit("socketID", "tester");

        setInterval(() => {
            const msg = { text: `Socket Test ${new Date().toLocaleTimeString()}` };
            console.log("Sending Socket Message:", msg);
            socket.emit("message", msg);
        }, 5000);
    });

    socket.on('message', (data) => {
        console.log("Socket Received:", data);
    });
} else {
    console.log("Socket is disabled in config.");
}
