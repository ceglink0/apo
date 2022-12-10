const path = require('path');
const { MEDIAN_BLUR } = require("../events");
const { getActiveImageWindow } = require("../state");
const { createResizableWindow } = require("../factory/browserWindowFactory");

const smoothingWindowPath = path.join(__dirname, '..', 'components', 'smoothingWindow', 'smoothingWindow.html');

const openSmoothingWindow = () => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) {
        const smoothingWindow = createResizableWindow(500, 700);
        smoothingWindow.loadFile(smoothingWindowPath);
    }
}

const applyMedianBlur = (settings) => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) activeImageWindow.webContents.send(MEDIAN_BLUR, settings);
}

module.exports = {
    openSmoothingWindow,
    applyMedianBlur
}