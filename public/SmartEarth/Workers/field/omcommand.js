/**
 *   海洋环境可视化工具类代码
 *
 *          金磊
 */
importScripts("pako_inflate.min.js");

function request(options) {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", options.url, true);
    oReq.responseType = options.type;
    oReq.onload = function (result) {
        if (result) {
            var _data = null;
            if (oReq.responseType == "text" || oReq.responseType == "") {
                _data = result.target.responseText;
            } else {
                _data = result.target.response;
            }
            if (result.target.status == 200) {
                if (typeof options.success == "function")
                    options.success(_data);
            } else {
                if (typeof options.error == "function") options.error(_data);
            }
        }
    };
    oReq.send(null);
    oReq.onloadend = function () {
        oReq = null;
    };
}
function getCacheInfo(options, callback) {
    var id = options.id;
    var fullUrl = "";
    fullUrl =
        serviceUrl +
        "?ncpath=" +
        options.ncpath +
        "&type=" +
        options.variable +
        "&depth=" +
        options.depth;
    request({
        url: fullUrl,
        type: "text",
        success: function (data) {
            var json = JSON.parse(data);
            if (json.path) {
                var cachePath = cacheUrl + json.path;
                getData(
                    {
                        id: id,
                        url: cachePath,
                    },
                    callback
                );
            }
        },
        error: function () {},
    });
}
function getData(options, callback) {
    var id = options.id;
    request({
        url: options.url,
        type: "arraybuffer",
        success: function (arrayBuffer) {
            if (typeof callback == "function") {
                var binData = new Uint8Array(arrayBuffer);
                var data = pako.inflate(binData);
                var byteArray = new Float32Array(data.buffer);
                callback(id, byteArray);
            }
        },
        error: function () {},
    });
}
function colorInterpolator(start, end) {
    var r = start[0],
        g = start[1],
        b = start[2];
    var Δr = end[0] - r,
        Δg = end[1] - g,
        Δb = end[2] - b;
    return function (i, a) {
        return [
            Math.floor(r + i * Δr),
            Math.floor(g + i * Δg),
            Math.floor(b + i * Δb),
            a,
        ];
    };
}

/**
 * Creates a color scale composed of the specified segments. Segments is an array of two-element arrays of the
 * form [value, color], where value is the point along the scale and color is the [r, g, b] color at that point.
 * For example, the following creates a scale that smoothly transitions from red to green to blue along the
 * points 0.5, 1.0, and 3.5:
 *
 *     [ [ 0.5, [255, 0, 0] ],
 *       [ 1.0, [0, 255, 0] ],
 *       [ 3.5, [0, 0, 255] ] ]
 *
 * @param segments array of color segments
 * @returns {Function} a function(point, alpha) that returns the color [r, g, b, alpha] for the given point.
 */
function segmentedColorScale(segments) {
    var points = [],
        interpolators = [],
        ranges = [];
    for (var i = 0; i < segments.length - 1; i++) {
        points.push(segments[i + 1][0]);
        interpolators.push(
            colorInterpolator(segments[i][1], segments[i + 1][1])
        );
        ranges.push([segments[i][0], segments[i + 1][0]]);
    }

    return function (point, alpha) {
        var i;
        for (i = 0; i < points.length - 1; i++) {
            if (point <= points[i]) {
                break;
            }
        }
        var range = ranges[i];
        return interpolators[i](proportion(point, range[0], range[1]), alpha);
    };
}

/**
 * @returns {Number} the value x clamped to the range [low, high].
 */
function clamp(x, low, high) {
    return Math.max(low, Math.min(x, high));
}

/**
 * @returns {number} the fraction of the bounds [low, high] covered by the value x, after clamping x to the
 *          bounds. For example, given bounds=[10, 20], this method returns 1 for x>=20, 0.5 for x=15 and 0
 *          for x<=10.
 */
function proportion(x, low, high) {
    return (clamp(x, low, high) - low) / (high - low);
}
/**
 *
 *  双线性插值算法
 *
 */
function bilinearInterpolate(x, y, g00, g10, g01, g11) {
    var rx = 1 - x;
    var ry = 1 - y;
    var a = rx * ry,
        b = x * ry,
        c = rx * y,
        d = x * y;
    var u = g00 * a + g10 * b + g01 * c + g11 * d;
    return u;
}
function bilinearInterpolateVector(x, y, g00, g10, g01, g11) {
    var rx = 1 - x;
    var ry = 1 - y;
    var a = rx * ry,
        b = x * ry,
        c = rx * y,
        d = x * y;
    var u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
    var v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
    return [u, v, Math.sqrt(u * u + v * v)];
}
