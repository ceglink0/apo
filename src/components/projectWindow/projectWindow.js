function removeKeyStartsWith(obj, letter) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop) && prop[0] == letter) {
            delete obj[prop];
        }
    }
}

function hasValidExtension(path) {
    return path.endsWith('png')
        || path.endsWith('jpg')
        || path.endsWith('jpeg')
        || path.endsWith('tiff')
        || path.endsWith('bmp');
}

document.addEventListener("DOMContentLoaded", () => {
    const SELECTED_FILE_PATH_SPAN_PREFIX = "selected-file-path-span-";
    const LOAD_IMAGE_BUTTON_PREFIX = "load-img-btn-";
    const REMOVE_IMAGE_BUTTON_PREFIX = "remove-img-btn-";
    const FILE_INPUT_PREFIX = "file-input-";
    const PERCENTAGE_INPUT_PREFIX = "percentage-input-";
    const BR1_PREFIX = "br1-";
    const BR2_PREFIX = "br2-";
    const BR3_PREFIX = "br3-";
    const BR4_PREFIX = "br4-";

    const addImageButton = document.getElementById("add-image-btn");
    let sequence = 1;
    let filesMap = {};
    let imagesCount = 0;
    let xImageSize;
    let yImageSize;
    let imageAddedFirstTime = true;

    
    
    const hadValidSize = async (imagePath) => {
        let img;
        const imageLoadPromise = new Promise(resolve => {
            img = new Image();
            img.onload = resolve;
            img.src = imagePath;
        });
        await imageLoadPromise;
        if (!xImageSize || !yImageSize) {
            xImageSize = img.width;
            yImageSize = img.height;
        }
        
        return xImageSize == img.width && img.height == yImageSize;

    }

    const addImage = () => {
        const index = sequence++;

        const selectedFilePathSpan = document.createElement("span");
        selectedFilePathSpan.setAttribute("id", SELECTED_FILE_PATH_SPAN_PREFIX + index);

        const fileInput = document.createElement("input");
        fileInput.setAttribute("id", FILE_INPUT_PREFIX + index);
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("name", "name-" + index);
        fileInput.setAttribute("style", "display: none;");
        fileInput.addEventListener("change", async (event) => {
            const selectedPath = event.target.files[0].path;
            if (!hasValidExtension(selectedPath)) {
                selectedFilePathSpan.innerHTML = "Selected image is ignored as it has invalid extension.";
            }
            else if (!(await hadValidSize(selectedPath))) {
                selectedFilePathSpan.innerHTML = "Selected image is ignored as it has different size than already selected images.";
            }
            else if (typeof selectedPath === "string" && hasValidExtension(selectedPath)) {
                filesMap[index].filePath = selectedPath;
                selectedFilePathSpan.innerHTML = "Selected file path: " + selectedPath;
                if (imageAddedFirstTime) {
                    window.eventBus.send(window.events.PROJECT_CREATE_IMAGE_WINDOW, selectedPath);
                    imageAddedFirstTime = false;
                }
            }
        });

        const loadImageButton = document.createElement("button");
        loadImageButton.setAttribute("id", LOAD_IMAGE_BUTTON_PREFIX + index);
        loadImageButton.textContent = "Choose image nr " + index;
        loadImageButton.addEventListener("click", () => {
            fileInput.click();
        })

        const percentageInput = document.createElement("input");
        percentageInput.setAttribute("id", PERCENTAGE_INPUT_PREFIX + index);
        percentageInput.setAttribute("placeholder", "Percentage");
        percentageInput.setAttribute("type", "number");
        percentageInput.setAttribute("min", "0");
        percentageInput.setAttribute("max", "100");
        percentageInput.setAttribute("style", "width: 180px;");
        let percentage = 0;
        if (imagesCount == 0) {
            percentage = 100;
        }
        percentageInput.value = percentage;
        percentageInput.addEventListener("change", (event) => {
            let sum = 0;
            for (var i in filesMap) {
                if (filesMap.hasOwnProperty(i) && i != index) {
                    sum += filesMap[i].percentage ? parseFloat(filesMap[i].percentage) : 0;
                }
            }
            const maxValue = Math.max(100 - sum, 0);
            if (!percentageInput.value || percentageInput.value > maxValue || percentageInput.value < 0) {
                percentageInput.value = maxValue;
            }
            percentageInput.value = parseFloat((parseFloat(percentageInput.value)).toFixed(2))
            filesMap[index].percentage = percentageInput.value;
            window.eventBus.send(window.events.PROJECT_COMBINE_IMAGES, filesMap);
        });

        const br1 = document.createElement("br");
        br1.setAttribute("id", BR1_PREFIX + index);

        const br2 = document.createElement("br");
        br2.setAttribute("id", BR2_PREFIX + index);

        const br3 = document.createElement("br");
        br3.setAttribute("id", BR3_PREFIX + index);

        const br4 = document.createElement("br");
        br4.setAttribute("id", BR4_PREFIX + index);

        const removeImageButton = document.createElement("button");
        removeImageButton.setAttribute("id", REMOVE_IMAGE_BUTTON_PREFIX + index);
        removeImageButton.setAttribute("style", "margin-bottom: 40px;");
        removeImageButton.textContent = "Remove image nr " + index;
        removeImageButton.addEventListener("click", () => {
            document.body.removeChild(loadImageButton);
            document.body.removeChild(selectedFilePathSpan);
            document.body.removeChild(fileInput);
            document.body.removeChild(percentageInput);
            document.body.removeChild(removeImageButton);
            document.body.removeChild(br1);
            document.body.removeChild(br2);
            document.body.removeChild(br3);
            document.body.removeChild(br4);
            removeKeyStartsWith(filesMap, index);
            imagesCount--;
            if (imagesCount == 0) {
                xImageSize = null;
                yImageSize = null;
            }
            window.eventBus.send(window.events.PROJECT_COMBINE_IMAGES, filesMap);
        })

        document.body.appendChild(loadImageButton);
        document.body.appendChild(br1);
        document.body.appendChild(selectedFilePathSpan);
        document.body.appendChild(fileInput);
        document.body.appendChild(br2);
        document.body.appendChild(percentageInput);
        document.body.appendChild(br3);
        document.body.appendChild(removeImageButton);
        document.body.appendChild(br4);

        filesMap[index] = { filePath: null, percentage: percentage };
        imagesCount++;
    }

    addImageButton.addEventListener("click", () => {
        addImage();
    });
});