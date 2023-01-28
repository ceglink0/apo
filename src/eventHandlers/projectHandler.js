const path = require('path');
const Jimp = require('jimp');
const { setActiveImageWindow, getActiveImageWindow } = require("../state");
const { createResizableWindow } = require("../factory/browserWindowFactory");
const {
    PROJECT_COMBINE_IMAGES, WINDOW_FOCUSED, WINDOW_CLOSED, OPEN_IMAGE_SOURCE_DATA_URL
} = require("../events");

const IMAGE_WINDOW_PATH = path.join(__dirname, '..', 'components', 'imageWindow', 'imageWindow.html');
const projectWindowPath = path.join(__dirname, '..', 'components', 'projectWindow', 'projectWindow.html');

const openProjectWindow = () => {
    const projectWindow = createResizableWindow(500, 550);
    projectWindow.loadFile(projectWindowPath);
}

const createImageWindow = (imagePath) => {
    const image = createResizableWindow(300, 0);
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

const createPngImageUrl = async (sourcePath) => {
    return Jimp.read(sourcePath)
        .then((image) => image.getBufferAsync(Jimp.MIME_PNG))
        .then((buffer) => buffer.toString('base64'))
        .catch((err) => console.error(err));
}

const getFormatFromPath = (imagePath) => {
    console.log(imagePath)
    const formatSeparatorIdx = imagePath.lastIndexOf(".");
    if (formatSeparatorIdx > -1) return imagePath.substring(formatSeparatorIdx + 1);
    throw("Path is not a file!");
}

const combineImages = (filesMap) => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) {
        activeImageWindow.webContents.send(PROJECT_COMBINE_IMAGES, filesMap);
    }
}

module.exports = {
    openProjectWindow,
    createImageWindow,
    combineImages
}