var serviceUrl = "http://localhost:64488/NcService.asmx/CacheNcData";
var cacheUrl = "http://localhost:64488/";
var RD_OVERLAY_ALPHA = Math.floor(0.8 * 255); // 默认覆盖透明度 ([0, 255])
var colorTable = [
    [30, [10, 25, 68]],
    [33, [10, 25, 250]],
    [33.5, [24, 255, 93]],
    [34, [255, 233, 102]],
    [34.5, [255, 233, 15]],
    [35, [255, 15, 15]],
];
var colorOcean = [
    [30, [10, 25, 68]],
    [33, [10, 25, 250]],
    [33.5, [24, 255, 255]],
    [34, [105, 233, 252]],

    [34.5, [255, 233, 65]],
    [34.5, [255, 233, 15]],
    [34.5, [255, 233, 15]],
    [34.5, [255, 233, 15]],
    [34.5, [255, 233, 15]],
    [35, [255, 225, 15]],
    [35, [255, 225, 15]],
    [35, [255, 225, 15]],
    [35, [255, 225, 15]],
 

    [35, [255, 255, 15]],

    [35, [255, 235, 15]],
    [35, [255, 215, 15]],
    [35, [255, 195, 15]],
    [35, [255, 175, 15]],
    [35, [255, 155, 15]],
    [35, [255, 135, 15]],
    [35, [255, 115, 15]],
    [35, [255, 95, 15]],
    [35, [255, 75, 15]],
    [35, [255, 55, 15]],
    [35, [255, 35, 15]],
    [35, [255, 15, 15]],
];