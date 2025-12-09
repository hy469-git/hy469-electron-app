const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
    send: (channel, data) => {
        // whitelist channels
        let validChannels = ["mqtt-publish", "message"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = ["mqtt-message", "message"];
        try {
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        } catch (error) {
            console.log(error)
            console.log("error in preload receive")
        }
    }
}
);