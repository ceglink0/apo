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
window.eventBus.receive(window.events.MAKE_NEGATIVE, () => makeImageNegative());
window.eventBus.receive(window.events.APPLY_BIN_THRESHOLD, (threshold) => applyBinaryThreshold(threshold));
window.eventBus.receive(window.events.APPLY_BIN2_THRESHOLD, (threshold) => applyBinary2Threshold(threshold));
window.eventBus.receive(window.events.APPLY_THRESHOLD_RETAINING_GREY_LEVELS, (threshold) => applyThresholdRetainingGreyLevels(threshold));

window.eventBus.receive(window.events.APPLY_LOGICAL_OPERATION, (operationData) => applyLogicalOperation(operationData));
window.eventBus.receive(window.events.APPLY_IMAGE_MATH_OPERATION, (operationData) => applyImageMathOperation(operationData));
window.eventBus.receive(window.events.APPLY_NUMBER_MATH_OPERATION, (operationData) => applyNumberMathOperation(operationData));

window.eventBus.receive(window.events.EDGE_DETECTION_KERNEL, (kernel) => apply2dFilter(kernel));
window.eventBus.receive(window.events.EDGE_DETECTION_CANNY, (boundaries) => applyCannyEdgeDetection(boundaries));

window.eventBus.receive(window.events.APPLY_OTSU_THRESHOLD, () => applyOtsuThreshold());
window.eventBus.receive(window.events.APPLY_ADAPTIVE_THRESHOLD, () => applyAdaptiveThreshold());


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

const makeImageNegative = () => {
    if (mat.channels() !== 1) return;
    mat.data.forEach((value, index) => {
        mat.data[index] = 255 - value;
    });
    cv.imshow(getOutputCanvas(), mat);
}

const applyBinaryThreshold = (threshold) => {
    if (mat.channels() !== 1) return;
    mat.data.forEach((value, index) => {
        if (value <= threshold) {
            mat.data[index] = 0;
        } else {
            mat.data[index] = 255;
        }
    });
    cv.imshow(getOutputCanvas(), mat);
}

const applyBinary2Threshold = (threshold) => {
    const { p1, p2 } = threshold;
    if (mat.channels() !== 1) return;
    mat.data.forEach((value, index) => {
        if (p1 <= value && value <= p2) {
            mat.data[index] = 255;
        } else {
            mat.data[index] = 0;
        }
    });
    cv.imshow(getOutputCanvas(), mat);
}

const applyThresholdRetainingGreyLevels = (threshold) => {
    if (mat.channels() !== 1) return;
    mat.data.forEach((value, index) => {
        if (value < threshold) {
            mat.data[index] = 0;
        }
    });
    cv.imshow(getOutputCanvas(), mat);
}

const applyLogicalOperation = (operationData) => {
    const { filePath, operationType } = operationData;
    const img = new Image();
    img.src = filePath;
    img.onload = () => {
        const secondImageMat = cv.imread(img);
        cv.cvtColor(secondImageMat, secondImageMat, cv.COLOR_RGBA2GRAY);

        switch (operationType) {
            case "AND":
                mat.data.forEach((value, index) => {
                    mat.data[index] = value & secondImageMat.data[index]
                })
                break;
            case "OR":
                mat.data.forEach((value, index) => {
                    mat.data[index] = value | secondImageMat.data[index]
                })
                break;
            case "XOR":
                mat.data.forEach((value, index) => {
                    mat.data[index] = value ^ secondImageMat.data[index]
                })
                break;
        }
        cv.imshow(getOutputCanvas(), mat);
    }
}

const applyImageMathOperation = (operationData) => {
    const { filePath, operationType } = operationData;
    const img = new Image();
    img.src = filePath;
    img.onload = () => {
        const secondImageMat = cv.imread(img);
        cv.cvtColor(secondImageMat, secondImageMat, cv.COLOR_RGBA2GRAY);

        switch (operationType) {
            case "PLUS-SATURATION":
                mat.data.forEach((value, index) => {
                    mat.data[index] = Math.max(Math.min(value + secondImageMat.data[index], 255), 0);
                })
                break;
            case "PLUS-NO-SATURATION":
                let firstMin = 0;
                let firstMax = 255;
                mat.data.forEach((value, index) => {
                    if (firstMin > value) {
                        firstMin = value;
                    }
                    if (firstMax < value) {
                        firstMax = value;
                    }
                })

                let secondMin = 0;
                let secondMax = 255;
                secondImageMat.data.forEach((value, index) => {
                    if (secondMin > value) {
                        secondMin = value;
                    }
                    if (secondMax < value) {
                        secondMax = value;
                    }
                })

                mat.data.forEach((value, index) => {
                    let firstImageValuePart = 127 * (value - firstMin) / (firstMax - firstMin);
                    let secondImageValuePart = 127 * (secondImageMat.data[index] - secondMin) / (secondMax - secondMin);
                    mat.data[index] = firstImageValuePart + secondImageValuePart;
                })
                break;
            case "MINUS":
                mat.data.forEach((value, index) => {
                    mat.data[index] = Math.max(Math.min(Math.abs(value - secondImageMat.data[index]), 255), 0);
                })
                break;
            case "MULTIPLY":
                let max = 1.0;
                mat.data.forEach((value, index) => {
                    let newValue = (value * secondImageMat.data[index]);
                    if (max < newValue) {
                        max = newValue;
                    }
                })
                mat.data.forEach((value, index) => {
                    mat.data[index] = Math.max(Math.min((value * secondImageMat.data[index])/(max / 255), 255), 0);
                })
                break;
        }
        cv.imshow(getOutputCanvas(), mat);
    }
}

const applyNumberMathOperation = (operationData) => {
    const { numberValue, operationType } = operationData;

    switch (operationType) {
        case "PLUS":
            mat.data.forEach((value, index) => {
                mat.data[index] = Math.max(Math.min(numberValue + value, 255), 0);
            })
            break;
        case "MINUS":
            mat.data.forEach((value, index) => {
                mat.data[index] = Math.max(Math.min(Math.abs(numberValue - value), 255), 0);
            })
            break;
        case "MULTIPLY":
            mat.data.forEach((value, index) => {
                mat.data[index] = Math.max(Math.min(numberValue * value, 255), 0);
            })
            break;
    }
    cv.imshow(getOutputCanvas(), mat);
}

const apply2dFilter = (kernelArray) => {
    if (mat.channels() !== 1) return;
    let kernel = cv.matFromArray(3, 3, cv.CV_32F, kernelArray);
    let anchor = new cv.Point(-1, -1);
    cv.filter2D(mat, mat, -1, kernel, anchor, 0, cv.BORDER_DEFAULT);
    cv.imshow(getOutputCanvas(), mat);
}

const applyCannyEdgeDetection = (boundaries) => {
    if (mat.channels() !== 1 || !boundaries) return;
    const { bottomBoundary, topBoundary } = boundaries;
    cv.Canny(mat, mat, bottomBoundary, topBoundary, 3, false);
    cv.imshow(getOutputCanvas(), mat);
}

const applyOtsuThreshold = () => {
    if (mat.channels() !== 1) return;
    cv.threshold(mat, mat, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
    cv.imshow(getOutputCanvas(), mat);
}

const applyAdaptiveThreshold = (adaptiveThresholdType) => {
    if (mat.channels() !== 1) return;
    let type; 
    if (adaptiveThresholdType === 'MEAN') {
        type = cv.ADAPTIVE_THRESH_MEAN_C;
    } else if (adaptiveThresholdType === 'GAUSSIAN') {
        type = cv.ADAPTIVE_THRESH_GAUSSIAN_C;
    }
    cv.adaptiveThreshold(mat, 255, type, cv.THRESH_BINARY, 199, 5);
    cv.imshow(getOutputCanvas(), mat);
}
