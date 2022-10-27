import { createHistogramDto } from "../utils/factory/histogramDtoFactory.js";

let mat;
let format;

window.eventBus.receive(window.events.SAVE_IMAGE_REQ, () => sendImageDataAsEvent(window.events.SAVE_IMAGE_RESP));
window.eventBus.receive(window.events.DUPLICATE_REQ, () => sendImageDataAsEvent(window.events.DUPLICATE_RESP));

window.eventBus.receive(
    window.events.OPEN_IMAGE_SOURCE_DATA_URL,
    (imageData) => loadImage(imageData.url, imageData.format)
);
window.eventBus.receive(window.events.HISTOGRAM_DATA_REQ, () => {
    const histogramData = createHistogramDto(mat);
    if (histogramData) window.eventBus.send(window.events.HISTOGRAM_DATA_RESP, histogramData);
});


const loadImage = (imageSource, imageFormat) => {
    format = imageFormat;
    const img = new Image();
    img.src = imageSource;
    img.onload = () => {
        const outputCanvas = getOutputCanvas();
        mat = cv.imread(img);
        const grayScale = isGrayScale(mat);
        console.log(grayScale);
        if (grayScale) {
            cv.cvtColor(mat, mat, cv.COLOR_RGB2GRAY, 0);
        }
        cv.imshow(outputCanvas, mat);
        window.eventBus.send(window.events.OPEN_IMAGE_RESP, {
            url: outputCanvas.toDataURL('image/png', 1),
            rows: mat.rows,
            cols: mat.cols
        });
    };
}

const sendImageDataAsEvent = (eventName) => {
    const imageDataUrl = getOutputCanvas().toDataURL(`image/png`, 1);
    const imageData = {
        format: format,
        url: imageDataUrl
    };
    window.eventBus.send(eventName, imageData);
}

const getOutputCanvas = () => document.getElementById("output");

const isGrayScale = () => {
    for (let i = 0; i < mat.data.length; i += 4) {
        const redValue = mat.data[i];
        const greenValue = mat.data[i + 1];
        const blueValue = mat.data[i + 2];
        if (!(redValue === greenValue && greenValue === blueValue)) {
            return false;
        }
    }
    return true;
}
