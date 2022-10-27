const { contextBridge, ipcRenderer } = require("electron");
const events = require("../events");

contextBridge.exposeInMainWorld(
    "eventBus", {
        send: (channel, data) => ipcRenderer.send(channel, data),
        receive: (channel, func) => {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
);
contextBridge.exposeInMainWorld("events", events);