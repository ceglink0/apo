let mainWindow;
let activeImageWindow;

const setMainWindow = (window) => mainWindow = window;
const getMainWindow = () => mainWindow;

const setActiveImageWindow = (window) => activeImageWindow = window;
const getActiveImageWindow = () => activeImageWindow;

module.exports = {
    setMainWindow,
    getMainWindow,
    setActiveImageWindow,
    getActiveImageWindow
}