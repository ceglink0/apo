const { BrowserWindow } = require('electron');
const path = require('path');

const createFixedWindow = (width, height) => {
    return createBaseWindow(width, height, false);
}

const createResizableWindow = (width, height) => {
    return createBaseWindow(width, height, true);
}

const createBaseWindow = (width, height, isResizable) => {
    const window = new BrowserWindow({
        width: width,
        height: height,
        resizable: isResizable,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, '..', 'preloadScripts', 'rendererPreload.js')
        }
    });
    window.setMenuBarVisibility(false);
    window.once('ready-to-show', () => window.show());
    return window;
};

module.exports = {
    createResizableWindow,
    createFixedWindow
};