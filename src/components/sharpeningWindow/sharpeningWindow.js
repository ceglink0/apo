document.getElementById("sharpening-button").addEventListener("click", () => {
    const checkedInput = document.querySelector("input[type=radio]:checked");
    if (checkedInput) window.eventBus.send(
        window.events.LAPLACIAN_SHARPENING,
        extractKernelFromTable(checkedInput.previousElementSibling)
    );
});

const extractKernelFromTable = (table) => Array.from(table.rows)
    .flatMap(row => Array.from(row.cells))
    .map(cell => Number(cell.innerHTML));