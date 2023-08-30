importScripts("config.js");
importScripts("omcommand.js");

var colorInfo = null;
var colorEqually = true;
/**
 * 海洋大面图线程
 *  金磊
 * @param {any} start
 * @param {any} end
 */
self.addEventListener("message", function (e) {
    colorInfo = e.data.color || colorTable;
    if (e.data.colorEqually != undefined) {
        colorEqually = e.data.colorEqually;
    }

    getCacheInfo(e.data, getImageData);
});
function getImageData(id, byteArray) {
    var offset = 0;
    var direction = byteArray[offset];
    offset += 1;
    var width = byteArray[offset];
    offset += 1;
    var minx = 999;
    var maxx = -999;
    for (var i = 0; i < width; i++) {
        if (minx > byteArray[offset + i]) {
            minx = byteArray[offset + i];
        }
        if (maxx < byteArray[offset + i]) {
            maxx = byteArray[offset + i];
        }
    }
    offset += width;
    var height = byteArray[offset];
    offset += 1;
    var miny = 999;
    var maxy = -999;
    for (var i = 0; i < height; i++) {
        if (miny > byteArray[offset + i]) {
            miny = byteArray[offset + i];
        }
        if (maxy < byteArray[offset + i]) {
            maxy = byteArray[offset + i];
        }
    }
    offset += height;
    var dataCount = byteArray[offset];
    offset += 1;

    var colorBar = colorInfo;
    var valMax = byteArray[byteArray.length - 1];
    var valMin = byteArray[byteArray.length - 2];
    debugger
    if (colorEqually) {
        var delta = valMax - valMin;
        delta = delta / (colorBar.length - 1);
        for (var i = 0; i < colorBar.length; i++) {
            colorBar[i][0] = valMin + i * delta;
        }
    }

    var colorgradient = segmentedColorScale(colorBar);

    var data = new Uint8Array(height * width * 4);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var m = (i * width + j) * 4;
            var value = byteArray[(height - i - 1) * width + j + offset];
            if (value == -9999) {
                data[m] = 0;
                data[m + 1] = 0;
                data[m + 2] = 0;
                data[m + 3] = 0;
            } else {
                //value = Math.sqrt(Math.sqrt(value * value) * 1000);
                var rgba = colorgradient(value, RD_OVERLAY_ALPHA);
                data[m] = rgba[0];
                data[m + 1] = rgba[1];
                data[m + 2] = rgba[2];
                data[m + 3] = rgba[3];
            }
        }
    }

    self.postMessage({
        id: id,
        width: width,
        height: height,
        minx: minx,
        maxx: maxx,
        miny: miny,
        maxy: maxy,
        offset: offset,
        data: byteArray,
        arrayBufferView: data,
    });
}
