document.getElementById("sobel-apply-button").addEventListener("click", () => {
    const checkedInput = document.querySelector("input[type=radio]:checked");
    if (checkedInput) window.eventBus.send(
        window.events.EDGE_DETECTION_KERNEL,
        extractKernelFromTable(checkedInput.previousElementSibling)
    );
});

// document.getElementById("canny-apply-button").addEventListener("click", () => {
//     const bottomBoundary = Number(document.getElementById("bottom-boundary-input").value);
//     const topBoundary = Number(document.getElementById("top-boundary-input").value);
//     if (areCannyBoundariesValid(bottomBoundary, topBoundary)) {
//         window.eventBus.send(window.events.EDGE_DETECTION_CANNY, {
//             bottomBoundary,
//             topBoundary
//         });
//     }
// });

const areCannyBoundariesValid = (bottomBoundary, topBoundary) => {
    return bottomBoundary > 0 && bottomBoundary <= 255
        && topBoundary > 0 && topBoundary <= 255
        && bottomBoundary < topBoundary;
}

const extractKernelFromTable = (table) => Array.from(table.rows)
    .flatMap(row => Array.from(row.cells))
    .map(cell => Number(cell.innerHTML));