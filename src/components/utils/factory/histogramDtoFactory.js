const HISTOGRAM_TYPE_GRAY = "GRAY";
const HISTOGRAM_TYPE_RGB = "RGB";

export const createHistogramDto = (mat) => {
    switch(mat.channels()) {
        case 1:
            return buildGreyHistogramDto(mat);
        case 4:
            return buildRgbHistogramDto(mat);
    };
}

const buildGreyHistogramDto = (mat) => {
    const histogramDto = createBaseGreyHistogramDto();
    mat.data.forEach((grayLightValue) => histogramDto.gray[grayLightValue]++);
    return histogramDto;
}

const createBaseGreyHistogramDto = () => {
    return {
        type: HISTOGRAM_TYPE_GRAY,
        gray: getBlankLightValueArray(),
    };
}

const buildRgbHistogramDto = (mat) => {
    const histogramDto = createBaseRgbHistogramDto();
    for (let i = 0; i < mat.data.length; i += 4) {
        const redValue = mat.data[i];
        const greenValue = mat.data[i + 1];
        const blueValue = mat.data[i + 2];

        histogramDto.red[redValue]++;
        histogramDto.green[greenValue]++;
        histogramDto.blue[blueValue]++;
    }
    return histogramDto;
}

const createBaseRgbHistogramDto = () => {
    return {
        type: HISTOGRAM_TYPE_RGB,
        red: getBlankLightValueArray(),
        green: getBlankLightValueArray(),
        blue: getBlankLightValueArray()
    };
}

const getBlankLightValueArray = () => new Array(256).fill(0);