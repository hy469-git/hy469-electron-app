
const config = require("../config.json");
const port = new URL(config.socket_url).port;
const io = require("socket.io")(port);

let sockets = {};

io.on("connection", socket => {
    console.log("Connected")

    let socketID;
    //Save socket on socketID event
    socket.on("socketID", msg => {
        console.log("connected socket: ", msg)
        socketID = msg;
        sockets[socketID] = socket;
    })

    // Generic message handler example
    socket.on("message", (data) => {
        console.log("Received message:", data);
        // Broadcast to all other sockets or specific ones
        // For example, send to frontend if it exists
        if (sockets["frontend"]) {
            sockets["frontend"].emit("message", data);
        }
    });

    socket.on("disconnect", () => {
        if (socketID) {
            console.log(`Socket ${socketID} disconnected`);
            delete sockets[socketID];
            socketID = undefined;
        }
    })

});

