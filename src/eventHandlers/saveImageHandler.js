const { dialog } = require('electron');
const fs = require('fs');
const Jimp = require("jimp");

const { getActiveImageWindow, getMainWindow } = require("../state");
const { SAVE_IMAGE_REQ } = require("../events");

const mimeTypesByFileExtensions = new Map([
    ['png', Jimp.MIME_PNG],
    ['jpg', Jimp.MIME_JPEG],
    ['jpeg', Jimp.MIME_JPEG],
    ['bmp', Jimp.MIME_BMP],
    ['tiff', Jimp.MIME_TIFF]
]);

const handleSaveImageClick = () => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) {
        activeImageWindow.webContents.send(SAVE_IMAGE_REQ);
    }
};

const handleSaveImageResponse = async (imageData) => {
    const imageBuffer = await getBufferFromImageData(imageData);
    dialog.showSaveDialog(getMainWindow(), {
        defaultPath: `${require('os').homedir()}/Desktop/image.png`,
        filters: [{
            "name": "Images",
            "extensions": ["bmp", "tiff", "png", "jpg", "jpeg"]
        }]
    })
    .then((res) => {
        if (!res.canceled) fs.writeFile(res.filePath, imageBuffer, () => null) 
    })
    .catch((err) => console.error(err));
}

const getBufferFromImageData = async (imageData) => {
    const pngBase64Data = imageData.url.split(',')[1];
    const pngBuffer = Buffer.from(pngBase64Data, 'base64');
    const mimeType = mimeTypesByFileExtensions.get("png");
    return await Jimp.read(pngBuffer)
        .then((image) => image.getBufferAsync(mimeType))
        .catch((err) => console.error(err));
};

module.exports = {
    handleSaveImageClick,
    handleSaveImageResponse
}