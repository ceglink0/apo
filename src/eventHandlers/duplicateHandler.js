const path = require('path');
const { getActiveImageWindow, setActiveImageWindow } = require("../state");
const { createResizableWindow } = require("../factory/browserWindowFactory");
const {
    WINDOW_CLOSED,
    WINDOW_FOCUSED,
    DUPLICATE_REQ,
    OPEN_IMAGE_SOURCE_DATA_URL
} = require("../events");

const imageWindowPath = path.join(__dirname, '..', 'components', 'imageWindow', 'imageWindow.html');

const handleDuplicateClick = () => {
    const activeImageWindow = getActiveImageWindow();
    if (activeImageWindow) {
        activeImageWindow.webContents.send(DUPLICATE_REQ);
    }
}

const handleImageDuplication = (imageUrl) => {
    const image = createResizableWindow(600, 600);
        image.on(WINDOW_FOCUSED, () => setActiveImageWindow(image));
        image.on(WINDOW_CLOSED, () => setActiveImageWindow(null));
        image.loadFile(imageWindowPath)
            .then(() => image.webContents.send(OPEN_IMAGE_SOURCE_DATA_URL, imageUrl))
            .catch(err => console.error(err));
}

module.exports = {
    handleDuplicateClick,
    handleImageDuplication
}