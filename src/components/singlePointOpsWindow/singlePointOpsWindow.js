document.addEventListener("DOMContentLoaded", () => {
    const loadImageButton = document.getElementById("load-img-btn");
    const fileInput = document.getElementById("file-input");
    const selectedFilePathSpan = document.getElementById("selected-file-path");

    let filePath;

    loadImageButton.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (event) => {
        const selectedPath = event.target.files[0].path;
        if (typeof selectedPath === "string" && hasValidExtension(selectedPath)) {
            filePath = selectedPath;
            selectedFilePathSpan.innerHTML = filePath;
        }
    });

    const hasValidExtension = (path) => {
        return path.endsWith('png')
            || path.endsWith('jpg')
            || path.endsWith('jpeg')
            || path.endsWith('tiff')
            || path.endsWith('bmp');
    }

    const logicalAndBtn = document.getElementById("logical-and");
    const logicalOrBtn = document.getElementById("logical-or");
    const logicalXorBtn = document.getElementById("logical-xor");

    logicalAndBtn.addEventListener("click", () => {
        if (filePath) {
            window.eventBus.send(window.events.APPLY_LOGICAL_OPERATION, {
                filePath,
                operationType: 'AND'
            });
        }
    });

    logicalOrBtn.addEventListener("click", () => {
        if (filePath) {
            window.eventBus.send(window.events.APPLY_LOGICAL_OPERATION, {
                filePath,
                operationType: 'OR'
            });
        }
    });

    logicalXorBtn.addEventListener("click", () => {
        if (filePath) {
            window.eventBus.send(window.events.APPLY_LOGICAL_OPERATION, {
                filePath,
                operationType: 'XOR'
            });
        }
    });

    const imagePlusBtn = document.getElementById("image-plus");
    const imageMinusBtn = document.getElementById("image-minus");
    const imageMultiplyBtn = document.getElementById("image-multiply");

    imagePlusBtn.addEventListener("click", () => {
        if (filePath) {
            window.eventBus.send(window.events.APPLY_IMAGE_MATH_OPERATION, {
                filePath,
                operationType: 'PLUS'
            });
        }
    });

    imageMinusBtn.addEventListener("click", () => {
        if (filePath) {
            window.eventBus.send(window.events.APPLY_IMAGE_MATH_OPERATION, {
                filePath,
                operationType: 'MINUS'
            });
        }
    });

    imageMultiplyBtn.addEventListener("click", () => {
        if (filePath) {
            window.eventBus.send(window.events.APPLY_IMAGE_MATH_OPERATION, {
                filePath,
                operationType: 'MULTIPLY'
            });
        }
    });

    const numberPlusBtn = document.getElementById("number-plus");
    const numberMinusBtn = document.getElementById("number-minus");
    const numberMultiplyBtn = document.getElementById("number-multiply");
    
    let numberValue;
    const numberInput = document.querySelector(".number");
    numberInput.addEventListener("input", (event) => {
        numberValue = event.target.value;
    });

    numberPlusBtn.addEventListener("click", () => {
        if (numberValue) {
            window.eventBus.send(window.events.APPLY_NUMBER_MATH_OPERATION, {
                numberValue: Number(numberValue),
                operationType: 'PLUS'
            });
        }
    });

    numberMinusBtn.addEventListener("click", () => {
        if (numberValue) {
            window.eventBus.send(window.events.APPLY_NUMBER_MATH_OPERATION, {
                numberValue: Number(numberValue),
                operationType: 'MINUS'
            });
        }
    });

    numberMultiplyBtn.addEventListener("click", () => {
        if (numberValue) {
            window.eventBus.send(window.events.APPLY_NUMBER_MATH_OPERATION, {
                numberValue: Number(numberValue),
                operationType: 'MULTIPLY'
            });
        }
    });
});