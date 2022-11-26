const path = require('path');
const { APPLY_BIN_THRESHOLD, APPLY_BIN2_THRESHOLD, APPLY_THRESHOLD_RETAINING_GREY_LEVELS, APPLY_OTSU_THRESHOLD, APPLY_ADAPTIVE_THRESHOLD } = require("../events");
const { getActiveImageWindow } = require("../state");
const { createResizableWindow } = require("../factory/browserWindowFactory");

const thresholdWindowPath = path.join(__dirname, '..', 'components', 'thresholdWindow', 'thresholdWindow.html');

const openThresholdWindow = () => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) {
        const thresholdWindow = createResizableWindow(500, 550);
        thresholdWindow.loadFile(thresholdWindowPath);
    }
}

const applyBinaryThreshold = (threshold) => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) activeImageWindow.webContents.send(APPLY_BIN_THRESHOLD, threshold);
}

const applyBinary2Threshold = (threshold) => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) activeImageWindow.webContents.send(APPLY_BIN2_THRESHOLD, threshold);
}

const applyThresholdRetainingGreyLevels = (threshold) => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) activeImageWindow.webContents.send(APPLY_THRESHOLD_RETAINING_GREY_LEVELS, threshold);
}

const applyOtsuThreshold = () => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) activeImageWindow.webContents.send(APPLY_OTSU_THRESHOLD);
}

const applyAdaptiveThreshold = () => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) activeImageWindow.webContents.send(APPLY_ADAPTIVE_THRESHOLD);
}

module.exports = {
    openThresholdWindow,
    applyBinaryThreshold,
    applyBinary2Threshold,
    applyThresholdRetainingGreyLevels,
    applyOtsuThreshold,
    applyAdaptiveThreshold
}