const path = require('path');
const { HISTOGRAM_DATA_REQ } = require("../events");
const { getActiveImageWindow } = require("../state");
const { createResizableWindow } = require("../factory/browserWindowFactory");

const histogramWindowPath = path.join(__dirname, '..', 'components', 'histogramWindow', 'histogramWindow.html');

const handleHistogramClick = () => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) {
        activeImageWindow.webContents.send(HISTOGRAM_DATA_REQ);
    }
}

const handleHistogramWindowCreation = (e, histogramData) => {
    const histogramWindow = createResizableWindow(600, 350);
    const dataPayload = {
        ...histogramData,
        senderWindowId: e.sender.id
    };
    histogramWindow.loadFile(histogramWindowPath)
        .then(() => histogramWindow.webContents.send("histogram-data", dataPayload));
}

module.exports = {
    handleHistogramClick,
    handleHistogramWindowCreation
}