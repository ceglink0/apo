document.addEventListener("DOMContentLoaded", () => {
    const singleSliderValueElement = document.getElementById("slider--single__value");
    const singleSlider = document.querySelector(".slider--single");
    let singleSliderValue = 128;
    
    singleSlider.addEventListener("input", (event) => {
        singleSliderValue = event.target.value;
        singleSliderValueElement.innerHTML = singleSliderValue;
    });
    
    const minSliderValueElement = document.getElementById("slider--double-min__value");
    const maxSliderValueElement = document.getElementById("slider--double-max__value");
    const minSlider = document.querySelector(".slider--double-min");
    const maxSlider = document.querySelector(".slider--double-max");
    let minSliderVal = 128;
    let maxSliderVal = 128;

    
    const greySliderValueElement = document.getElementById("slider--slider-grey-levels__value");
    const greySlider = document.querySelector(".slider-grey-levels");
    let greySliderValue = 128;
    
    singleSlider.addEventListener("input", (event) => {
        singleSliderValue = event.target.value;
        singleSliderValueElement.innerHTML = singleSliderValue;
    });

    minSlider.addEventListener("input", (event) => {
        minSliderVal = event.target.value;
        minSliderValueElement.innerHTML = minSliderVal;
    });

    maxSlider.addEventListener("input", (event) => {
        maxSliderVal = event.target.value;
        maxSliderValueElement.innerHTML = maxSliderVal;
    });
    
    greySlider.addEventListener("input", (event) => {
        greySliderValue = event.target.value;
        greySliderValueElement.innerHTML = greySliderValue;
    });

    const applyBinaryThresholdBtn = document.getElementById("binary-threshold");
    applyBinaryThresholdBtn.addEventListener("click", () => {
        window.eventBus.send(window.events.APPLY_BIN_THRESHOLD, singleSliderValue);
    });

    const applyMinimumThresholdBtn = document.getElementById("bin2-threshold");
    applyMinimumThresholdBtn.addEventListener("click", () => {
        window.eventBus.send(window.events.APPLY_BIN2_THRESHOLD, {
            p1: Number(minSliderVal),
            p2: Number(maxSliderVal)
        });
    });

    const applyThresholdRetainingGreyLevelsBtn = document.getElementById("grey-levels-threshold");
    applyThresholdRetainingGreyLevelsBtn.addEventListener("click", () => {
        window.eventBus.send(window.events.APPLY_THRESHOLD_RETAINING_GREY_LEVELS, greySliderValue);
    });

    const applyOtsuThresholdBtn = document.getElementById("otsu-threshold");
    applyOtsuThresholdBtn.addEventListener("click", () => {
        window.eventBus.send(window.events.APPLY_OTSU_THRESHOLD);
    });

    const applyMeanAdaptiveThresholdBtn = document.getElementById("mean-adaptive-threshold");
    applyMeanAdaptiveThresholdBtn.addEventListener("click", () => {
        window.eventBus.send(window.events.APPLY_ADAPTIVE_THRESHOLD, "MEAN");
    });

    const applyGaussianAdaptiveThresholdBtn = document.getElementById("gaussian-adaptive-threshold");
    applyGaussianAdaptiveThresholdBtn.addEventListener("click", () => {
        window.eventBus.send(window.events.APPLY_ADAPTIVE_THRESHOLD, "GAUSSIAN");
    });
});