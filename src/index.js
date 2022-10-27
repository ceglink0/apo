const { app, ipcMain, webContents } = require('electron');
const events = require("./events");
const { handleAppReady } = require("./eventHandlers/appLifecycleHandler");
const { handleOpenImageClick, handleImageOpened } = require("./eventHandlers/openImageHandler");
const { handleSaveImageClick, handleSaveImageResponse } = require("./eventHandlers/saveImageHandler");
const { handleDuplicateClick, handleImageDuplication } = require("./eventHandlers/duplicateHandler");
const { handleHistogramClick, handleHistogramWindowCreation } = require("./eventHandlers/histogramHandler");

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
