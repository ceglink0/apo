const sendEvent = (eventName) => window.eventBus.send(eventName);

document.getElementById("open-image-button")
    .addEventListener("click", () => sendEvent(window.events.OPEN_IMAGE_CLICK));
document.getElementById("save-image-button")
    .addEventListener("click", () => sendEvent(window.events.SAVE_IMAGE_CLICK));
document.getElementById("duplicate-button")
    .addEventListener("click", () => sendEvent(window.events.DUPLICATE_CLICK));
document.getElementById("histogram-button")
    .addEventListener("click", () => sendEvent(window.events.HISTOGRAM_CLICK));
document.getElementById("make-negative")
    .addEventListener("click", () => sendEvent(window.events.MAKE_NEGATIVE));
document.getElementById("threshold")
    .addEventListener("click", () => sendEvent(window.events.THRESHOLD_CLICK));
document.getElementById("logical-ops")
    .addEventListener("click", () => sendEvent(window.events.SINGLE_POINT_OPS_CLICK));
document.getElementById("edge-detection")
    .addEventListener("click", () => sendEvent(window.events.EDGE_DETECTION_CLICK));
document.getElementById("smoothing")
    .addEventListener("click", () => sendEvent(window.events.SMOOTHING_CLICK));
document.getElementById("sharpening")
    .addEventListener("click", () => sendEvent(window.events.SHARPENING_CLICK));
