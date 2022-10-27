const { app, ipcMain } = require('electron');
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
