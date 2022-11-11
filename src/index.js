const { app, ipcMain, webContents } = require('electron');
const events = require("./events");
const { getActiveImageWindow } = require("./state");
const { handleAppReady } = require("./eventHandlers/appLifecycleHandler");
const { handleOpenImageClick, handleImageOpened } = require("./eventHandlers/openImageHandler");
const { handleSaveImageClick, handleSaveImageResponse } = require("./eventHandlers/saveImageHandler");
const { handleDuplicateClick, handleImageDuplication } = require("./eventHandlers/duplicateHandler");
const { handleHistogramClick, handleHistogramWindowCreation } = require("./eventHandlers/histogramHandler");
const { openLogicalOpsWindow, applyLogicalOperation } = require("./eventHandlers/logicalOpsHandler");
const {
    openThresholdWindow,
    applyBinaryThreshold,
    applyBinary2Threshold,
    applyThresholdRetainingGreyLevels
} = require("./eventHandlers/thresholdHandler");

app.on(events.APP_READY, () => handleAppReady());

ipcMain.on(events.OPEN_IMAGE_CLICK, () => handleOpenImageClick());
ipcMain.on(events.OPEN_IMAGE_RESP, (e, imageUrl) => handleImageOpened(imageUrl));

ipcMain.on(events.SAVE_IMAGE_CLICK, () => handleSaveImageClick());
ipcMain.on(events.SAVE_IMAGE_RESP, (e, imageUrl) => handleSaveImageResponse(imageUrl));
``
ipcMain.on(events.DUPLICATE_CLICK, () => handleDuplicateClick());
ipcMain.on(events.DUPLICATE_RESP, (e, imageUrl) => handleImageDuplication(imageUrl));

ipcMain.on(events.HISTOGRAM_CLICK, () => handleHistogramClick());
ipcMain.on(events.HISTOGRAM_DATA_RESP, (e, histogramData) => handleHistogramWindowCreation(e, histogramData));

ipcMain.on(events.LINEAR_STRETCH_REQ, (e, stretchReq) => {
    const targetWindowContents = webContents.fromId(stretchReq.targetWindowId);
    if (targetWindowContents) targetWindowContents.send(events.LINEAR_STRETCH_REQ, stretchReq);
});

ipcMain.on(events.GAMMA_STRETCH_REQ, (e, stretchReq) => {
    const targetWindowContents = webContents.fromId(stretchReq.targetWindowId);
    if (targetWindowContents) targetWindowContents.send(events.GAMMA_STRETCH_REQ, stretchReq);
});

ipcMain.on(events.EQUALIZE_REQ, (e, equalizeReq) => {
    const targetWindowContents = webContents.fromId(equalizeReq.targetWindowId);
    if (targetWindowContents) targetWindowContents.send(events.EQUALIZE_REQ, equalizeReq);
});

ipcMain.on(events.MAKE_NEGATIVE, () => {
    const activeWindow = getActiveImageWindow();
    if (activeWindow) activeWindow.webContents.send(events.MAKE_NEGATIVE);
});

ipcMain.on(events.THRESHOLD_CLICK, () => openThresholdWindow());
ipcMain.on(events.APPLY_BIN_THRESHOLD, (e, threshold) => applyBinaryThreshold(threshold));
ipcMain.on(events.APPLY_BIN2_THRESHOLD, (e, threshold) => applyBinary2Threshold(threshold));
ipcMain.on(events.APPLY_THRESHOLD_RETAINING_GREY_LEVELS, (e, threshold) => applyThresholdRetainingGreyLevels(threshold));

ipcMain.on(events.LOGICAL_OPS_CLICK, () => openLogicalOpsWindow());
ipcMain.on(events.APPLY_LOGICAL_OPERATION, (e, payload) => applyLogicalOperation(payload));
