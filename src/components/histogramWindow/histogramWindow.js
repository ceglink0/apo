const RED_COLOR = "rgb(231, 76, 60)";
const GREEN_COLOR = "rgb(46, 204, 113)";
const BLUE_COLOR = "rgb(52, 152, 219)";
const GRAY_COLOR = "rgb(149, 165, 166)";

let histogram;
let chart;

window.eventBus.receive("histogram-data", (histogramData) => {
    histogram = histogramData;
    if (histogramData.type === "RGB") {
        buildRedHistogram(histogramData.red, true);
        buildGreenHistogram(histogramData.green, false);
        buildBlueHistogram(histogramData.blue, false);
    }
    else if (histogramData.type === "GRAY") {
        buildGrayHistogram(histogramData.gray, true);
        insertLinearStretchButton();
        insertGammaStretchButton();
        insertEqualizeButton();
    }
});

const buildRedHistogram = (dataArray) => {
    buildHistogram(dataArray, "Red", RED_COLOR);
}

const buildGreenHistogram = (dataArray) => {
    buildHistogram(dataArray, "Green", GREEN_COLOR);
}

const buildBlueHistogram = (dataArray) => {
    buildHistogram(dataArray, "Blue", BLUE_COLOR);
}

const buildGrayHistogram = (dataArray, remove=false) => {
    buildHistogram(dataArray, "Gray", GRAY_COLOR, remove);
}

const buildHistogram = (dataArray, colorName, barColor, remove=false) => {
    let canvas = document.querySelector("canvas");
    if (remove && canvas) canvas.remove();

    const canvasWrapper = document.querySelector(".canvas-wrapper");
    canvas = document.createElement("canvas");
    canvasWrapper.appendChild(canvas);

    
    new Chart(canvas.getContext("2d"), {
        type: 'bar',
        data: {
            labels: Object.keys(dataArray),
            datasets: [{
                label: `Light Value (${colorName})`,
                data: dataArray,
                backgroundColor: [barColor],
                borderColor: [barColor],
                borderWidth: 1,
                barPercentage: 1
            }]
        }
    });
}

const insertLinearStretchButton = () => {
    const minInput = document.createElement("input");
    minInput.setAttribute("placeholder", "Min");
    minInput.setAttribute("type", "number");
    minInput.setAttribute("min", "0");
    minInput.setAttribute("max", "255");
    minInput.classList.add("min-input");
    document.body.appendChild(minInput);

    const maxInput = document.createElement("input");
    maxInput.setAttribute("placeholder", "Max");
    maxInput.setAttribute("type", "number");
    maxInput.setAttribute("min", "0");
    maxInput.setAttribute("max", "255");
    maxInput.classList.add("max-input");
    document.body.appendChild(maxInput);

    const button = document.createElement("button");
    button.appendChild(document.createTextNode("Linear Stretch"));
    button.classList.add("linear-stretch-btn");
    button.addEventListener("click", handleLinearStretchClick);
    document.body.appendChild(button);
    
    document.body.appendChild(document.createElement("br"));
}

const insertGammaStretchButton = () => {
    const maxInput = document.createElement("input");
    maxInput.setAttribute("placeholder", "Gamma Factor");
    maxInput.setAttribute("type", "number");
    maxInput.classList.add("gamma-factor-input");
    document.body.appendChild(maxInput);

    const button = document.createElement("button");
    button.appendChild(document.createTextNode("Gamma Stretch"));
    button.classList.add("gamma-stretch-btn");
    button.addEventListener("click", handleGammaStretchClick);
    document.body.appendChild(button);
    
    document.body.appendChild(document.createElement("br"));
}

const insertEqualizeButton = () => {
    const button = document.createElement("button");
    button.appendChild(document.createTextNode("Equalize"));
    button.classList.add("equalize-btn");
    button.addEventListener("click", handleEqualizeClick);
    document.body.appendChild(button);
}

const handleLinearStretchClick = () => {
    const lut = histogram.gray;
    const minIndex = getMinLutIndex(lut);
    const maxIndex = getMaxLutIndex(lut);

    const newLut = new Array(256).fill(0);
    lut.forEach((value, index) => {
        let newIndex;
        if (index > minIndex && index < maxIndex) {
            newIndex = Math.round(
                (index - minIndex) * 255
                / (maxIndex - minIndex)
            );
        } else if (index <= minIndex) {
            newIndex = 0;
        } else {
            newIndex = 255;
        }
        newLut[newIndex] = newLut[newIndex] + value;
    });
    
    buildGrayHistogram(newLut, true);
    window.eventBus.send(window.events.LINEAR_STRETCH_REQ, {
        targetWindowId: histogram.senderWindowId,
        min: minIndex,
        max: maxIndex
    });
}

const handleGammaStretchClick = () => {
    const lut = histogram.gray;
    const factor = getGammaFactor();
    const newLut = new Array(256).fill(0);
    lut.forEach((value, index) => {
        let newIndex = Math.round(index ** (1.0 / factor));
        if (newIndex > 255) {
            newIndex = 255;
        } else if (newIndex < 0) {
            newIndex = 0;
        }
        newLut[newIndex] = newLut[newIndex] + value;
    });
    
    buildGrayHistogram(newLut, true);
    window.eventBus.send(window.events.GAMMA_STRETCH_REQ, {
        targetWindowId: histogram.senderWindowId,
        factor: factor
    });
}

const getMinLutIndex = (lut) => {
    let value = document.getElementsByClassName("min-input")[0].value;
    if (value && value >= 0 && value <= 255) {
        return value;
    }
    return lut.findIndex((value) => value > 0);
}

const getMaxLutIndex = (lut) => {
    let value = document.getElementsByClassName("max-input")[0].value;
    if (value && value >= 0 && value <= 255) {
        return value;
    }
    for (let i = lut.length - 1; i >= 0; i--) {
        if (lut[i] > 0) return i;
    }
    return null;
}

const getGammaFactor = () => {
    let value = document.getElementsByClassName("gamma-factor-input")[0].value;
    if (value) {
        return value;
    }
    return 1;
}

const handleEqualizeClick = () => {
    const cumulativeLut = histogram.gray.map(cumulativeSum);
    const minIndex = cumulativeLut[getMinLutIndex(cumulativeLut)];
    const maxIndex = cumulativeLut[getMaxLutIndex(cumulativeLut)];
    const pixelCount = maxIndex;
    
    const equalizedLut = cumulativeLut.map((value) => {
        if (value >= minIndex && value <= maxIndex) {
            return Math.round(
                255 * (value - minIndex)
                / (pixelCount - minIndex)
            );
        }
    });
    const updatedHistogramData = new Array(256).fill(0);
    histogram.gray.forEach((value, index) => {
        const newIndex = equalizedLut[index];
        if (newIndex) {
            updatedHistogramData[newIndex] = value;
        }
    });
    buildGrayHistogram(updatedHistogramData, true);
    window.eventBus.send(window.events.EQUALIZE_REQ, {
        targetWindowId: histogram.senderWindowId,
        lut: equalizedLut
    });
}

const cumulativeSum = (sum => value => sum += value)(0);
