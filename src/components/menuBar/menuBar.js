const sendEvent = (eventName) => window.eventBus.send(eventName);

document.getElementById("open-image-button")
    .addEventListener("click", () => sendEvent(window.events.OPEN_IMAGE_CLICK));
document.getElementById("save-image-button")
    .addEventListener("click", () => sendEvent(window.events.SAVE_IMAGE_CLICK));
document.getElementById("duplicate-button")
    .addEventListener("click", () => sendEvent(window.events.DUPLICATE_CLICK));
document.getElementById("histogram-button")
    .addEventListener("click", () => sendEvent(window.events.HISTOGRAM_CLICK));
    