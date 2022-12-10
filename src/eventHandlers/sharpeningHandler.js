const path = require('path');
const { LAPLACIAN_SHARPENING } = require("../events");
const { getActiveImageWindow } = require("../state");
const { createResizableWindow } = require("../factory/browserWindowFactory");

const sharpeningWindowPath = path.join(__dirname, '..', 'components', 'sharpeningWindow', 'sharpeningWindow.html');

const openSharpeningWindow = () => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) {
        const sharpeningWindow = createResizableWindow(500, 500);
        sharpeningWindow.loadFile(sharpeningWindowPath);
    }
}

const handleLaplacianSharpening = (kernel) => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) activeImageWindow.webContents.send(LAPLACIAN_SHARPENING, kernel);
}

module.exports = {
    openSharpeningWindow,
    handleLaplacianSharpening
}