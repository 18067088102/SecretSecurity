importScripts("config.js");
importScripts("transform.js");
importScripts("omcommand.js");

var uvInfo = {
  rCount: 0,
  uData: null,
  vData: null,
  oData: null,
  offset: 0,
  minx: 0.0,
  miny: 0.0,
  dx: 0.0,
  dy: 0.0,
  width: 0.0,
  height: 0.0,
  uMax: 0.0,
  uMin: 0.0,
  vMax: 0.0,
  vMin: 0.0,
  valMax: 0.0,
  valMin: 0.0,
  drawData: [],
};

var myScene = null;
var columns = []; //数据存储数组。每次刷新更新这个数组

var τ = 2 * Math.PI; //他不是一个π。。是两个。。
var VSCALE = 0.00036666666666666667; //速度

var H = 0.000036; // 0.0000360°φ ~= 4m 随便给的值，为了平面数据到球面产生的偏移计算

var HOLE_VECTOR = [NaN, NaN, null]; // 向量不存在时存储的值
var velocityScale = 0;
var oceanCancel = false; //是否取消加载

/**
 * 海洋流场图线程
 *  金磊
 * @param {any} start
 * @param {any} end
 */
self.addEventListener("message", function (e) {
  var option = e.data;

  if (e.data.colorEqually != undefined) {
    colorEqually = e.data.colorEqually;
  }
  myScene = option.scene;
  if (myScene && myScene.height) {
    velocityScale = myScene.height * VSCALE;
  }
  clear();
  switch (option.type) {
    case "init":
      initData(option);
      break;
    case "update":
      if (uvInfo.uData != null && uvInfo.vData != null) {
        dataProcess();
      }
      break;
    case "stop":
      break;
    default:
      break;
  }
});
function clear() {
  oceanCancel = true;
}
function initData(option) {
  uvInfo.uData = null;
  uvInfo.vData = null;
  getData(
    {
      id: "u",
      url: option.upath,
    },
    function (id, byteArray) {
      uvInfo.uData = byteArray;
      if (uvInfo.vData != null) {
        oceanLineCalc();
      }
    }
  );
  getData(
    {
      id: "v",
      url: option.vpath,
    },
    function (id, byteArray) {
      uvInfo.vData = byteArray;
      if (uvInfo.uData != null) {
        oceanLineCalc();
      }
    }
  );
//   getCacheInfo(
//     {
//       id: "u",
//       ncpath: option.uncpath,
//       variable: option.uvariable,
//       depth: option.depth,
//     },
//     function (id, byteArray) {
//       uvInfo.uData = byteArray;
//       if (uvInfo.vData != null) {
//         oceanLineCalc();
//       }
//     }
//   );
//   getCacheInfo(
//     {
//       id: "v",
//       ncpath: option.vncpath,
//       variable: option.vvariable,
//       depth: option.depth,
//     },
//     function (id, byteArray) {
//       uvInfo.vData = byteArray;
//       if (uvInfo.uData != null) {
//         oceanLineCalc();
//       }
//     }
//   );
}
function distort(λ, φ, x, y, wind) {
  var u = wind[0] * velocityScale;
  var v = wind[1] * velocityScale;

  var hλ = λ < 0 ? H : -H;
  var hφ = φ < 0 ? H : -H;
  var pλ = projection([λ + hλ, φ]);
  var pφ = projection([λ, φ + hφ]);
  var k = Math.cos((φ / 360) * τ);

  var d = [
    (pλ.x - x) / hλ / k,
    (pλ.y - y) / hλ / k,
    (pφ.x - x) / hφ,
    (pφ.y - y) / hφ,
  ];

  // Scale distortion vectors by u and v, then add.
  wind[0] = d[0] * u + d[2] * v;
  wind[1] = d[1] * u + d[3] * v;
  return wind;
}
function getDataByIndex(i, j) {
  var index = i * uvInfo.width + j + uvInfo.offset;
  if (index > uvInfo.uData.length) return [undefined, undefined];
  return [uvInfo.uData[index], uvInfo.vData[index]];
}
function floorMod(a, n) {
  var f = a - n * Math.floor(a / n);
  return f === n ? 0 : f;
}
function isValue(x) {
  if (
    x[0] != undefined &&
    x[1] != undefined &&
    x[0] != -9999 &&
    x[1] != -9999
  ) {
    return true;
  }
  return false;
}
function getDegreesData(x, y) {
  var i = floorMod(x - uvInfo.minx, 360) / uvInfo.dx;
  var j = (y - uvInfo.miny) / uvInfo.dy;

  //         1      2
  //        fi  i   ci
  //         | =1.4 |
  //      ---G--|---G--- fj 8
  //    j ___|_ .   |
  //  =8.3   |      |
  //      ---G------G--- cj 9
  //         |      |
  if (i > uvInfo.width || j > uvInfo.height || j < 0 || i < 0) return null;
  var fi = Math.floor(i),
    ci = fi + 1;
  var fj = Math.floor(j),
    cj = fj + 1;
  var g00 = getDataByIndex(cj, fi);
  var g10 = getDataByIndex(cj, ci);
  var g01 = getDataByIndex(fj, fi);
  var g11 = getDataByIndex(fj, ci);
  if (isValue(g00) && isValue(g10) && isValue(g01) && isValue(g11)) {
    return bilinearInterpolateVector(i - fi, cj - j, g00, g10, g01, g11);
  }
  return null;
}

//获取数据信息，这里以u数据为准。正常数据u、v数据信息应该是相同的。
function getDataInfo() {
  var offset = 0;
  var direction = uvInfo.uData[offset];
  offset += 1;
  var width = uvInfo.uData[offset];
  offset += 1;
  var minx = 999;
  var maxx = -999;
  for (var i = 0; i < width; i++) {
    if (minx > uvInfo.uData[offset + i]) {
      minx = uvInfo.uData[offset + i];
    }
    if (maxx < uvInfo.uData[offset + i]) {
      maxx = uvInfo.uData[offset + i];
    }
  }
  offset += width;
  uvInfo.dx = (maxx - minx) / (width - 1);
  uvInfo.minx = minx;
  uvInfo.width = width;

  var height = uvInfo.uData[offset];
  offset += 1;
  var miny = 999;
  var maxy = -999;
  for (var i = 0; i < height; i++) {
    if (miny > uvInfo.uData[offset + i]) {
      miny = uvInfo.uData[offset + i];
    }
    if (maxy < uvInfo.uData[offset + i]) {
      maxy = uvInfo.uData[offset + i];
    }
  }
  offset += height;

  uvInfo.dy = (maxy - miny) / (height - 1);
  uvInfo.miny = miny;
  uvInfo.height = height;

  var dataCount = uvInfo.uData[offset];
  offset += 1;
  uvInfo.offset = offset;

  var uMax = uvInfo.uData[uvInfo.uData.length - 1];
  var uMin = uvInfo.uData[uvInfo.uData.length - 2];
  var vMax = uvInfo.vData[uvInfo.vData.length - 1];
  var vMin = uvInfo.vData[uvInfo.vData.length - 2];

  uvInfo.uMax = Math.max(Math.abs(uMax), Math.abs(uMin));
  uvInfo.uMin = 0;
  uvInfo.vMax = Math.max(Math.abs(vMax), Math.abs(vMin));
  uvInfo.vMin = 0;
  //console.time("111");
  var valMax = -999;
  var valMin = 999;
  for (var i = offset; i < uvInfo.uData.length - 3; i++) {
    var uVal = uvInfo.uData[i];
    var vVal = uvInfo.vData[i];
    if (uVal != -9999 && vVal != -9999) {
      var val = Math.sqrt(uVal * uVal + vVal * vVal);
      if (valMax < val) valMax = val;
      if (valMin > val) valMin = val;
    }
  }
  uvInfo.valMax = valMax;
  uvInfo.valMin = valMin;
  //console.timeEnd("111");
}
function dataProcess() {
  if (myScene) {
    for (var i = 0; i < myScene.width; i += 2) {
      var column = [];
      for (var j = 0; j < myScene.height; j += 2) {
        var coord = tempgetCoord(i, j);
        if (coord != null) {
          var wind = null;
          if (coord) {
            var λ = coord[0],
              φ = coord[1];
            if (isFinite(λ)) {
              wind = getDegreesData(λ, φ);
              if (wind) {
                wind = distort(λ, φ, i, j, wind);
              }
            }
          }
          column[j + 1] = column[j] = wind || HOLE_VECTOR;
        }
      }
      columns[i + 1] = columns[i] = column;
    }
    //animate();
    uvInfo.drawData = columns;
    self.postMessage({
      type: "draw",
      data: uvInfo,
    });
  }
}
function colorStyles(val) {
  var i;
  for (i = 0; i < colorInfo.length; i++) {
    if (Math.abs(val) <= colorInfo[i][0]) {
      break;
    }
  }
  var color = colorInfo[i][1];
  return (
    "rgba(" +
    color[0] +
    ", " +
    color[1] +
    ", " +
    color[2] +
    ", " +
    RD_OVERLAY_ALPHA +
    ")"
  );
}

function oceanLineCalc() {
  if (uvInfo.uData == null || uvInfo.vData == null) {
    return;
  }
  getDataInfo();
  dataProcess();
}
