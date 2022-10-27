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
window.eventBus.receive(window.events.LINEAR_STRETCH_REQ, (stretchReq) => linearStretchImage(stretchReq));
window.eventBus.receive(window.events.GAMMA_STRETCH_REQ, (stretchReq) => gammaStretchImage(stretchReq));
window.eventBus.receive(window.events.EQUALIZE_REQ, (equalizeReq) => equalizeImage(equalizeReq));


const loadImage = (imageSource, imageFormat) => {
    format = imageFormat;
    const img = new Image();
    img.src = imageSource;
    img.onload = () => {
        const outputCanvas = getOutputCanvas();
        mat = cv.imread(img);
        const grayScale = isGrayScale(mat);
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

const linearStretchImage = (stretchReq) => {
    const { min, max } = stretchReq;
    mat.data.forEach((value, index) => {
        let newValue;
        if (value > min && value < max) {
            newValue = Math.round(
                (value - min) * 255
                / (max - min)
            );
        } else if (value <= min) {
            newValue = 0;
        } else {
            newValue = 255;
        }
        mat.data[index] = newValue;
    });
    cv.imshow(getOutputCanvas(), mat);
}
const gammaStretchImage = (stretchReq) => {
    const { factor } = stretchReq;
    mat.data.forEach((value, index) => {
        let newValue = Math.round(value ** (1.0 / factor));
        if (newValue > 255) {
            newValue = 255;
        } else if (newValue < 0) {
            newValue = 0;
        }
        mat.data[index] = newValue;
    });
    cv.imshow(getOutputCanvas(), mat);
}

const equalizeImage = (equalizeReq) => {
    const { lut } = equalizeReq;
    mat.data.forEach((value, index) => {
        if (typeof lut[value] === "number") {
            mat.data[index] = lut[value];
        }
    });
    cv.imshow(getOutputCanvas(), mat);
}
