const { app, ipcMain, webContents } = require('electron');
const events = require("./events");
const { getActiveImageWindow } = require("./state");
const { handleAppReady } = require("./eventHandlers/appLifecycleHandler");
const { handleOpenImageClick, handleImageOpened } = require("./eventHandlers/openImageHandler");
const { handleSaveImageClick, handleSaveImageResponse } = require("./eventHandlers/saveImageHandler");
const { handleDuplicateClick, handleImageDuplication } = require("./eventHandlers/duplicateHandler");
const { handleHistogramClick, handleHistogramWindowCreation } = require("./eventHandlers/histogramHandler");
const { openSinglePointOpsWindow, applyLogicalOperation, applyImageMathOperation, applyNumberMathOperation } = require("./eventHandlers/singlePointOpsHandler");
const {
    openThresholdWindow,
    applyBinaryThreshold,
    applyBinary2Threshold,
    applyThresholdRetainingGreyLevels,
    applyOtsuThreshold,
    applyAdaptiveThreshold
} = require("./eventHandlers/thresholdHandler");
const { openEdgeDetectionWindow, handleKernelBasedEdgeDetection, handleCannyEdgeDetection } = require("./eventHandlers/edgeDetectionHandler");
const { openSharpeningWindow, handleLaplacianSharpening } = require("./eventHandlers/sharpeningHandler");
const { openSmoothingWindow, applyMedianBlur } = require("./eventHandlers/smoothingHandler");

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

ipcMain.on(events.SINGLE_POINT_OPS_CLICK, () => openSinglePointOpsWindow());
ipcMain.on(events.APPLY_LOGICAL_OPERATION, (e, payload) => applyLogicalOperation(payload));
ipcMain.on(events.APPLY_IMAGE_MATH_OPERATION, (e, payload) => applyImageMathOperation(payload));
ipcMain.on(events.APPLY_NUMBER_MATH_OPERATION, (e, payload) => applyNumberMathOperation(payload));

ipcMain.on(events.EDGE_DETECTION_CLICK, () => openEdgeDetectionWindow());
ipcMain.on(events.EDGE_DETECTION_KERNEL, (e, kernel) => handleKernelBasedEdgeDetection(kernel));
ipcMain.on(events.EDGE_DETECTION_CANNY, (e, boundaries) => handleCannyEdgeDetection(boundaries));

ipcMain.on(events.APPLY_OTSU_THRESHOLD, () => applyOtsuThreshold());
ipcMain.on(events.APPLY_ADAPTIVE_THRESHOLD, (e, type) => applyAdaptiveThreshold(type));

ipcMain.on(events.SHARPENING_CLICK, () => openSharpeningWindow());
ipcMain.on(events.LAPLACIAN_SHARPENING, (e, kernel) => handleLaplacianSharpening(kernel));

ipcMain.on(events.SMOOTHING_CLICK, () => openSmoothingWindow());
ipcMain.on(events.MEDIAN_BLUR, (e, settings) => applyMedianBlur(settings));