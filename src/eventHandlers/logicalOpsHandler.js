const path = require('path');
const { APPLY_LOGICAL_OPERATION } = require("../events");
const { getActiveImageWindow } = require("../state");
const { createResizableWindow } = require("../factory/browserWindowFactory");

const logicalOpsWindowPath = path.join(__dirname, '..', 'components', 'logicalOpsWindow', 'logicalOpsWindow.html');

const openLogicalOpsWindow = () => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) {
        const logicalOpsWindow = createResizableWindow(500, 500);
        logicalOpsWindow.loadFile(logicalOpsWindowPath);
    }
}

const applyLogicalOperation = (operationData) => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) {
        activeImageWindow.webContents.send(APPLY_LOGICAL_OPERATION, operationData);
    }
}

module.exports = {
    openLogicalOpsWindow,
    applyLogicalOperation
}