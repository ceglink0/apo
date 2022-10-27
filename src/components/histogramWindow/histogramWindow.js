const RED_COLOR = "rgb(231, 76, 60)";
const GREEN_COLOR = "rgb(46, 204, 113)";
const BLUE_COLOR = "rgb(52, 152, 219)";
const GRAY_COLOR = "rgb(149, 165, 166)";

let histogram;
let chart;

window.eventBus.receive("histogram-data", (histogramData) => {
    histogram = histogramData;
    if (histogramData.type === "RGB") {
        buildRedHistogram(histogramData.red);
        buildGreenHistogram(histogramData.green);
        buildBlueHistogram(histogramData.blue);
    }
    else if (histogramData.type === "GRAY") {
        buildGrayHistogram(histogramData.gray);
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

const buildGrayHistogram = (dataArray) => {
    buildHistogram(dataArray, "Gray", GRAY_COLOR);
}

const buildHistogram = (dataArray, colorName, barColor) => {
    let canvas = document.querySelector("canvas");
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
