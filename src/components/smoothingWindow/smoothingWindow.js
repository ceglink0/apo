document.getElementById("median-blur-apply-btn").addEventListener("click", () => {
    const kernelSize = Number(document.getElementById("median-blur-kernel-size-select").value);
    const borderSetting = document.getElementById("median-blur-border-setting-select").value;
    if (kernelSize > 0 && borderSetting !== "") {
        window.eventBus.send(window.events.MEDIAN_BLUR, { kernelSize, borderSetting });
    }
});