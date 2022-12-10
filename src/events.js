const APP_READY = "ready";
const WINDOW_FOCUSED = "focus";
const WINDOW_CLOSED = "closed";
const OPEN_IMAGE_CLICK = "open-image-click";
const OPEN_IMAGE_SOURCE_DATA_URL = "open-image-source-data-url";
const OPEN_IMAGE_RESP = "open-image-resp";
const SAVE_IMAGE_CLICK = "save-image-click";
const SAVE_IMAGE_REQ = "save-image-req";
const SAVE_IMAGE_RESP = "save-image-resp";
const DUPLICATE_CLICK = "duplicate-click";
const DUPLICATE_REQ = "duplicate-req";
const DUPLICATE_RESP = "duplicate-resp";
const HISTOGRAM_CLICK = "histogram-click";
const HISTOGRAM_DATA_REQ = "histogram-data-req";
const HISTOGRAM_DATA_RESP = "histogram-data-resp";
const LINEAR_STRETCH_REQ = "linear-stretch-histogram-req";
const GAMMA_STRETCH_REQ = "gamma-stretch-histogram-req"
const EQUALIZE_REQ = "equalize-histogram-req";
const MAKE_NEGATIVE = "make-negative-req";
const SINGLE_POINT_OPS_CLICK = "logical-ops-clicked";
const THRESHOLD_CLICK = "threshold-click";
const APPLY_BIN_THRESHOLD = "apply-bin-threshold";
const APPLY_BIN2_THRESHOLD = "apply-bin2-threshold";
const APPLY_THRESHOLD_RETAINING_GREY_LEVELS = "apply-threshold-retaining-grey-levels";
const APPLY_LOGICAL_OPERATION = "apply-logical-op";
const APPLY_IMAGE_MATH_OPERATION = "apply-image-math-op";
const APPLY_NUMBER_MATH_OPERATION = "apply-number-math-op";
const EDGE_DETECTION_CLICK = "edge-detection-click";
const EDGE_DETECTION_KERNEL = "edge-detection-kernel";
const EDGE_DETECTION_CANNY = "edge-detection-canny";
const APPLY_OTSU_THRESHOLD = "apply-otsu-threshold";
const APPLY_ADAPTIVE_THRESHOLD = "apply-adaptive-threshold";
const SHARPENING_CLICK = "sharpening-click";
const LAPLACIAN_SHARPENING = "laplacian-sharpening";
const SMOOTHING_CLICK = "smoothing-click";
const MEDIAN_BLUR = "median-blur-request";

module.exports = {
    APP_READY,
    WINDOW_FOCUSED,
    WINDOW_CLOSED,
    OPEN_IMAGE_CLICK,
    OPEN_IMAGE_SOURCE_DATA_URL,
    OPEN_IMAGE_RESP,
    SAVE_IMAGE_CLICK,
    SAVE_IMAGE_REQ,
    SAVE_IMAGE_RESP,
    DUPLICATE_CLICK,
    DUPLICATE_REQ,
    DUPLICATE_RESP,
    HISTOGRAM_CLICK,
    HISTOGRAM_DATA_REQ,
    HISTOGRAM_DATA_RESP,
    LINEAR_STRETCH_REQ,
    GAMMA_STRETCH_REQ,
    EQUALIZE_REQ,
    MAKE_NEGATIVE,
    THRESHOLD_CLICK,
    APPLY_BIN_THRESHOLD, 
    APPLY_BIN2_THRESHOLD,
    APPLY_THRESHOLD_RETAINING_GREY_LEVELS,
    SINGLE_POINT_OPS_CLICK,
    APPLY_LOGICAL_OPERATION,
    APPLY_IMAGE_MATH_OPERATION,
    APPLY_NUMBER_MATH_OPERATION,
    EDGE_DETECTION_CLICK,
    EDGE_DETECTION_KERNEL,
    EDGE_DETECTION_CANNY,
    APPLY_OTSU_THRESHOLD,
    APPLY_ADAPTIVE_THRESHOLD,
    SHARPENING_CLICK,
    LAPLACIAN_SHARPENING,
    SMOOTHING_CLICK,
    MEDIAN_BLUR
};