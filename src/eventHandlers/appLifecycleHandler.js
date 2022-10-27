const { app } = require('electron');
const path = require('path');

const { setMainWindow } = require("../state");
const { createFixedWindow } = require("../factory/browserWindowFactory");
const { WINDOW_CLOSED } = require("../events");
const menuBarPath = path.join(__dirname, '..', 'components', 'menuBar', 'menuBar.html');

const handleAppReady = () => {
    const mainWindow = createFixedWindow(900, 120);
    mainWindow.on(WINDOW_CLOSED, () => app.quit());
    mainWindow.loadFile(menuBarPath)
        .then(() => setMainWindow(mainWindow))
        .catch((err) => console.error(err));
}

module.exports = { handleAppReady }