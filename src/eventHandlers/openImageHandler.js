const { dialog } = require('electron');
const path = require('path');
const Jimp = require('jimp');

const { getMainWindow, setActiveImageWindow, getActiveImageWindow } = require("../state");
const { createResizableWindow } = require('../factory/browserWindowFactory');
const { WINDOW_FOCUSED, WINDOW_CLOSED } = require("../events");
const { OPEN_IMAGE_SOURCE_DATA_URL } = require("../events");

const ACCEPTED_FORMATS = ["jpg", "jpeg", "tiff", "bmp", "png"];

const IMAGE_WINDOW_PATH = path.join(__dirname, '..', 'components', 'imageWindow', 'imageWindow.html');

const handleOpenImageClick = async () => {
    dialog.showOpenDialog(getMainWindow(), { properties: ['openFile'] })
    .then(selectionResult => {
        if (wasValidFileSelected(selectionResult)) {
            const image = createResizableWindow(300, 0);
            const imagePath = selectionResult.filePaths[0];
            image.on(WINDOW_FOCUSED, () => setActiveImageWindow(image));
            image.on(WINDOW_CLOSED, () => setActiveImageWindow(null));
            image.loadFile(IMAGE_WINDOW_PATH)
                .then(() => createPngImageUrl(imagePath))
                .then((base64PngData) => `data:${Jimp.MIME_PNG};base64,${base64PngData}`)
                .then((imageUrl) => {
                    image.webContents.send(OPEN_IMAGE_SOURCE_DATA_URL, {
                        url: imageUrl,
                        format: getFormatFromPath(imagePath)
                    });
                })
                .catch((err) => console.error(err));
        }
    });
}

const wasValidFileSelected = (selectionResult) => {
    return !selectionResult.canceled
        && selectionResult.filePaths.length === 1
        && ACCEPTED_FORMATS.includes(getFormatFromPath(selectionResult.filePaths[0]));
}

const createPngImageUrl = async (sourcePath) => {
    return Jimp.read(sourcePath)
        .then((image) => image.getBufferAsync(Jimp.MIME_PNG))
        .then((buffer) => buffer.toString('base64'))
        .catch((err) => console.error(err));
}

const handleImageOpened = (imageData) => {
    const activeImageWindow = getActiveImageWindow();
    activeImageWindow.setSize(imageData.cols + 35, imageData.rows + 60);
}

const getFormatFromPath = (path) => {
    const formatSeparatorIdx = path.lastIndexOf(".");
    if (formatSeparatorIdx > -1) return path.substring(formatSeparatorIdx + 1);
    throw("Path is not a file!");
}

module.exports = {
    handleOpenImageClick,
    handleImageOpened
}