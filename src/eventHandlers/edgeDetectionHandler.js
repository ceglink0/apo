const path = require('path');
const { EDGE_DETECTION_KERNEL, EDGE_DETECTION_CANNY } = require("../events");
const { getActiveImageWindow } = require("../state");
const { createResizableWindow } = require("../factory/browserWindowFactory");

const edgeDetectionWindowPath = path.join(__dirname, '..', 'components', 'edgeDetectionWindow', 'edgeDetectionWindow.html');

const openEdgeDetectionWindow = () => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) {
        const edgeDetectionWindow = createResizableWindow(500, 1050);
        edgeDetectionWindow.loadFile(edgeDetectionWindowPath);
    }
}

const handleKernelBasedEdgeDetection = (kernel) => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) activeImageWindow.webContents.send(EDGE_DETECTION_KERNEL, kernel);
}

const handleCannyEdgeDetection = (boundaries) => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) activeImageWindow.webContents.send(EDGE_DETECTION_CANNY, boundaries);
}

module.exports = {
    openEdgeDetectionWindow,
    handleKernelBasedEdgeDetection,
    handleCannyEdgeDetection
}