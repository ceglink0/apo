const path = require('path');
const { APPLY_LOGICAL_OPERATION, APPLY_IMAGE_MATH_OPERATION, APPLY_NUMBER_MATH_OPERATION } = require("../events");
const { getActiveImageWindow } = require("../state");
const { createResizableWindow } = require("../factory/browserWindowFactory");

const singlePointOpsWindowPath = path.join(__dirname, '..', 'components', 'singlePointOpsWindow', 'singlePointOpsWindow.html');

const openSinglePointOpsWindow = () => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) {
        const logicalOpsWindow = createResizableWindow(500, 500);
        logicalOpsWindow.loadFile(singlePointOpsWindowPath);
    }
}

const applyLogicalOperation = (operationData) => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) {
        activeImageWindow.webContents.send(APPLY_LOGICAL_OPERATION, operationData);
    }
}

const applyImageMathOperation = (operationData) => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) {
        activeImageWindow.webContents.send(APPLY_IMAGE_MATH_OPERATION, operationData);
    }
}

const applyNumberMathOperation = (operationData) => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) {
        activeImageWindow.webContents.send(APPLY_NUMBER_MATH_OPERATION, operationData);
    }
}

module.exports = {
    openSinglePointOpsWindow,
    applyLogicalOperation,
    applyImageMathOperation,
    applyNumberMathOperation
}