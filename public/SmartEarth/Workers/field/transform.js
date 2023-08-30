/**
 *
 *  脱离Cesium球体进行各种坐标转换
 *
 *     有个人理解修改，注释说明个人理解
 *
 *             金磊
 *
 */

/**
 *  myScene格式及赋值
 *   myScene = {
 *          width:scene.canvas.clientWidth,
 *          height:scene.canvas.clientHeight,
 *          viewMatrix:scene.camera.viewMatrix,//([16])
 *          projectionMatrix:scene.camera.frustum.projectionMatrix,//([16])
 *          frustum:{
 *                   fovy:viewer.scene.camera.frustum.fovy,
 *                   aspectRatio:viewer.scene.camera.frustum.aspectRatio,
 *                   near:viewer.scene.camera.frustum.near,
 *                  },
 *          positionWC:viewer.scene.camera.positionWC,
 *          directionWC:viewer.scene.camera.directionWC,
 *          rightWC:viewer.scene.camera.rightWC,
 *          upWC:viewer.scene.camera.upWC
 *         }
 */

//球体参数(4490坐标系)

var Ellipsoid = {
    radii: {
        //椭球体半径
        x: 6378137.0,
        y: 6378137.0,
        z: 6356752.31414035585,
    },
    radiiSquared: {
        //椭球体半径平方
        x: 40680631590769.0,
        y: 40680631590769.0,
        z: 40408299983328.77,
    },
    oneOverRadii: {
        x: 1.0 / 6378137.0,
        y: 1.0 / 6378137.0,
        z: 1.0 / 6356752.31414035585,
    },
    oneOverRadiiSquared: {
        x: 1.0 / 40680631590769.0,
        y: 1.0 / 40680631590769.0,
        z: 1.0 / 40408299983328.77,
    },
    centerToleranceSquared: 0.1,
};
var EPSILON12 = 0.000000000001;
//屏幕坐标转经纬度
function rayEllipsoid(ray) {
    var inverseRadii = Ellipsoid.oneOverRadii;
    var q = multiplyComponents(inverseRadii, ray.origin);
    var w = multiplyComponents(inverseRadii, ray.direction);

    var q2 = q.x * q.x + q.y * q.y + q.z * q.z;
    var qw = cartesianDot(q, w);

    var difference, w2, product, discriminant, temp;

    if (q2 > 1.0) {
        // Outside ellipsoid.
        if (qw >= 0.0) {
            // Looking outward or tangent (0 intersections).
            return undefined;
        }

        // qw < 0.0.
        var qw2 = qw * qw;
        difference = q2 - 1.0; // Positively valued.
        w2 = w.x * w.x + w.y * w.y + w.z * w.z;
        product = w2 * difference;

        if (qw2 < product) {
            // Imaginary roots (0 intersections).
            return undefined;
        } else if (qw2 > product) {
            // Distinct roots (2 intersections).
            discriminant = qw * qw - product;
            temp = -qw + Math.sqrt(discriminant); // Avoid cancellation.
            var root0 = temp / w2;
            var root1 = difference / temp;
            if (root0 < root1) {
                return { start: root0, stop: root1 };
            }

            return {
                start: root1,
                stop: root0,
            };
        }
        // qw2 == product.  Repeated roots (2 intersections).
        var root = Math.sqrt(difference / w2);
        return { start: root, stop: root };
    } else if (q2 < 1.0) {
        // Inside ellipsoid (2 intersections).
        difference = q2 - 1.0; // Negatively valued.
        w2 = w.x * w.x + w.y * w.y + w.z * w.z;
        product = w2 * difference; // Negatively valued.

        discriminant = qw * qw - product;
        temp = -qw + Math.sqrt(discriminant); // Positively valued.
        return { start: 0.0, stop: temp / w2 };
    }
    // q2 == 1.0. On ellipsoid.
    if (qw < 0.0) {
        // Looking inward.
        w2 = w.x * w.x + w.y * w.y + w.z * w.z;
        return { start: 0.0, stop: -qw / w2 };
    }

    // qw >= 0.0.  Looking outward or tangent.
    return undefined;
}
//笛卡尔坐标相加
function cartesianAdd(left, right) {
    var result = { x: 0.0, y: 0.0, z: 0.0 };
    result.x = left.x + right.x;
    result.y = left.y + right.y;
    result.z = left.z + right.z;
    return result;
}
//笛卡尔坐标相减
function subtract(left, right) {
    var result = { x: 0.0, y: 0.0, z: 0.0 };
    result.x = left.x - right.x;
    result.y = left.y - right.y;
    result.z = left.z - right.z;
    return result;
}
function magnitude(cartesian) {
    return Math.sqrt(
        cartesian.x * cartesian.x +
            cartesian.y * cartesian.y +
            cartesian.z * cartesian.z
    );
}
//获得webgl透视图
function getPickRayPerspective(scene, windowPosition) {
    var result = {
        origin: { x: 0.0, y: 0.0, z: 0.0 },
        direction: { x: 0.0, y: 0.0, z: 0.0 },
    };

    var width = scene.width;
    var height = scene.height;

    var tanPhi = Math.tan(scene.frustum.fovy * 0.5);

    var tanTheta = scene.frustum.aspectRatio * tanPhi;
    var near = scene.frustum.near;

    //将坐标缩放到-1~1内
    var x = (2.0 / width) * windowPosition.x - 1.0;
    var y = (2.0 / height) * (height - windowPosition.y) - 1.0;
    
    var position = scene.positionWC;
    result.origin.x = position.x;
    result.origin.y = position.y;
    result.origin.z = position.z;
    //获取near中心点相对相机的位置
    var nearCenter = multiplyByScalar(scene.directionWC, near);
    //获取near中心点在webgl场景绝对位置
    nearCenter = cartesianAdd(position, nearCenter);
    
    var xDir = multiplyByScalar(scene.rightWC, x * near * tanTheta);
    var yDir = multiplyByScalar(scene.upWC, y * near * tanPhi);
    //计算传入射线与near平面交点在webgl场景内的绝对位置
    result.direction = cartesianAdd(nearCenter, xDir);
    result.direction = cartesianAdd(result.direction, yDir);
    //计算传入射线与near平面交点与相机的相对位置
    result.direction = subtract(result.direction, position);
    //除以与相机连线长度,计算出三个角度的tan值
    result.direction = normalize(result.direction);

    return result;
}
function getPoint(ray, t) {
    var result = { x: 0.0, y: 0.0, z: 0.0 };
    result = multiplyByScalar(ray.direction, t);
    result = cartesianAdd(ray.origin, result);
    return result;
}
/**
 *
 *  scene = {
 *          width:scene.canvas.clientWidth,
 *          height:scene.canvas.clientHeight,
 *          frustum:{
 *                   fovy:viewer.scene.camera.frustum.fovy,
 *                   aspectRatio:viewer.scene.camera.frustum.aspectRatio,
 *                   near:viewer.scene.camera.frustum.near,
 *                  },
 *          positionWC:viewer.scene.camera.positionWC,
 *          directionWC:viewer.scene.camera.directionWC,
 *          rightWC:viewer.scene.camera.rightWC,
 *          upWC:viewer.scene.camera.upWC
 *          }
 *
 *
 */
function pickEllipsoid(scene, windowPosition) {
    var result = {
        x: 0.0,
        y: 0.0,
        z: 0.0,
    };
    //获得获取屏幕像素在webgl内射线的透视图。
    var ray = getPickRayPerspective(scene, windowPosition);
    //计算射线与球的交点
    var intersection = rayEllipsoid(ray);
    if (!intersection) {
        return undefined;
    }
    var t = intersection.start > 0.0 ? intersection.start : intersection.stop;
    result = getPoint(ray, t);
    return result;
}
function scaleToGeodeticSurface(cartesian) {
    var result = { x: 0.0, y: 0.0, z: 0.0 };

    var oneOverRadii = Ellipsoid.oneOverRadii;
    var oneOverRadiiSquared = Ellipsoid.oneOverRadiiSquared;
    var centerToleranceSquared = Ellipsoid._centerToleranceSquared;

    var positionX = cartesian.x;
    var positionY = cartesian.y;
    var positionZ = cartesian.z;

    var oneOverRadiiX = oneOverRadii.x;
    var oneOverRadiiY = oneOverRadii.y;
    var oneOverRadiiZ = oneOverRadii.z;

    var x2 = positionX * positionX * oneOverRadiiX * oneOverRadiiX;
    var y2 = positionY * positionY * oneOverRadiiY * oneOverRadiiY;
    var z2 = positionZ * positionZ * oneOverRadiiZ * oneOverRadiiZ;

    // Compute the squared ellipsoid norm.
    var squaredNorm = x2 + y2 + z2;
    var ratio = Math.sqrt(1.0 / squaredNorm);

    // As an initial approximation, assume that the radial intersection is the projection point.
    var intersection = multiplyByScalar(cartesian, ratio);

    // If the position is near the center, the iteration will not converge.
    if (squaredNorm < centerToleranceSquared) {
        if (!isFinite(ratio)) {
            return undefined;
        } else {
            result.x = intersection.x;
            result.y = intersection.y;
            result.z = intersection.z;
            return result;
        }
    }

    var oneOverRadiiSquaredX = oneOverRadiiSquared.x;
    var oneOverRadiiSquaredY = oneOverRadiiSquared.y;
    var oneOverRadiiSquaredZ = oneOverRadiiSquared.z;

    // Use the gradient at the intersection point in place of the true unit normal.
    // The difference in magnitude will be absorbed in the multiplier.
    var gradient = { x: 0.0, y: 0.0, z: 0.0 };
    gradient.x = intersection.x * oneOverRadiiSquaredX * 2.0;
    gradient.y = intersection.y * oneOverRadiiSquaredY * 2.0;
    gradient.z = intersection.z * oneOverRadiiSquaredZ * 2.0;

    // Compute the initial guess at the normal vector multiplier, lambda.
    var lambda =
        ((1.0 - ratio) * magnitude(cartesian)) / (0.5 * magnitude(gradient));
    var correction = 0.0;

    var func;
    var denominator;
    var xMultiplier;
    var yMultiplier;
    var zMultiplier;
    var xMultiplier2;
    var yMultiplier2;
    var zMultiplier2;
    var xMultiplier3;
    var yMultiplier3;
    var zMultiplier3;

    do {
        lambda -= correction;

        xMultiplier = 1.0 / (1.0 + lambda * oneOverRadiiSquaredX);
        yMultiplier = 1.0 / (1.0 + lambda * oneOverRadiiSquaredY);
        zMultiplier = 1.0 / (1.0 + lambda * oneOverRadiiSquaredZ);

        xMultiplier2 = xMultiplier * xMultiplier;
        yMultiplier2 = yMultiplier * yMultiplier;
        zMultiplier2 = zMultiplier * zMultiplier;

        xMultiplier3 = xMultiplier2 * xMultiplier;
        yMultiplier3 = yMultiplier2 * yMultiplier;
        zMultiplier3 = zMultiplier2 * zMultiplier;

        func = x2 * xMultiplier2 + y2 * yMultiplier2 + z2 * zMultiplier2 - 1.0;

        // "denominator" here refers to the use of this expression in the velocity and acceleration
        // computations in the sections to follow.
        denominator =
            x2 * xMultiplier3 * oneOverRadiiSquaredX +
            y2 * yMultiplier3 * oneOverRadiiSquaredY +
            z2 * zMultiplier3 * oneOverRadiiSquaredZ;

        var derivative = -2.0 * denominator;

        correction = func / derivative;
    } while (Math.abs(func) > EPSILON12);

    result.x = positionX * xMultiplier;
    result.y = positionY * yMultiplier;
    result.z = positionZ * zMultiplier;
    return result;
}
function cartesianToDegrees(cartesian) {
    var result = { x: 0.0, y: 0.0, z: 0.0 };
    var oneOverRadiiSquared = Ellipsoid.oneOverRadiiSquared;
    var p = scaleToGeodeticSurface(cartesian);

    if (p == undefined) {
        return undefined;
    }

    var n = multiplyComponents(p,oneOverRadiiSquared);
    n = normalize(n);

    var longitude = Math.atan2(n.y, n.x);
    var latitude = Math.asin(n.z);

    result.x = longitude;
    result.y = latitude;
    return result;
}
/**
 * 根据屏幕像素取经纬度
 * @param {*} x
 * @param {*} y
 */
function tempgetCoord(x, y) {
    //像素位置转迪卡尔坐标
    var car3_lc = pickEllipsoid(myScene, { x: x, y: y });
    if (car3_lc) {
        //迪卡尔坐标转弧度
        var cartographicLC = cartesianToDegrees(car3_lc);
        //转经纬度
        var point = toDegrees([
            cartographicLC.x,
            cartographicLC.y,
        ]);
        return [point.x, point.y];
    } else {
        return null;
    }
}

//经纬度转屏幕坐标

//弧度/度
var RADIANS_PER_DEGREE = Math.PI / 180.0;
//度/弧度
var DEGREES_PER_RADIAN = 180.0 / Math.PI;
//弧度转笛卡尔坐标与半径的比例
/**
 *      先计算cos(lat),结果没意义为了化简
 *      P/R = cos(lat);
 *      cos(lat) * cos(lon) = P/R * x/P = x/R
 *      cos(lat) * sin(lon) = P/R * y/P = y/R
 *      sin(lat) = z/R
 */
function geodeticSurfaceNormalCartographic(cartographic) {
    var longitude = cartographic.x;
    var latitude = cartographic.y;

    var cosLatitude = Math.cos(latitude);
    var result = {
        x: 0.0,
        y: 0.0,
        z: 0.0,
    };
    result.x = cosLatitude * Math.cos(longitude);
    result.y = cosLatitude * Math.sin(longitude);
    result.z = Math.sin(latitude);
    return result;
}
//球体笛卡尔与坐标笛卡尔乘积
function multiplyComponents(left, right) {
    var result = {
        x: 0.0,
        y: 0.0,
        z: 0.0,
    };
    result.x = left.x * right.x;
    result.y = left.y * right.y;
    result.z = left.z * right.z;

    return result;
}
function toDegrees(point) {
    var result = {
        x: 0.0,
        y: 0.0,
        z: 0.0,
    };
    result.x = point[0] * DEGREES_PER_RADIAN;
    result.y = point[1] * DEGREES_PER_RADIAN;
    return result;
}
//经纬度转弧度
function toRadians(point) {
    var result = {
        x: 0.0,
        y: 0.0,
        z: 0.0,
    };
    result.x = point[0] * RADIANS_PER_DEGREE;
    result.y = point[1] * RADIANS_PER_DEGREE;
    return result;
}
//计算两个笛卡尔坐标的（标量）乘积
function cartesianDot(left, right) {
    return left.x * right.x + left.y * right.y + left.z * right.z;
}
function divideByScalar(cartesian, scalar) {
    var result = {
        x: 0.0,
        y: 0.0,
        z: 0.0,
    };
    result.x = cartesian.x / scalar;
    result.y = cartesian.y / scalar;
    result.z = cartesian.z / scalar;
    return result;
}
//矢量成标量
function multiplyByScalar(cartesian, scalar) {
    var result = {
        x: 0.0,
        y: 0.0,
        z: 0.0,
    };
    result.x = cartesian.x * scalar;
    result.y = cartesian.y * scalar;
    result.z = cartesian.z * scalar;
    return result;
}
//经纬度转笛卡尔坐标
/**
 *      有误差，和Cesium计算方法一致，误差都一样相对位置应该没什么问题
 *      先使用了“Haversine公式”方法，最大误差应该为0.4%，
 *      然后使用有误差的值，去纠正另一个有误差的值，感觉这个思路的逻辑不太好，但应该会缩小误差。
 * */
function degreesToCartesian(point) {
    //转换坐标为弧度坐标
    var cartographic = toRadians(point);
    //弧度坐标转换为笛卡尔坐标(0~1)
    var posCartesian = geodeticSurfaceNormalCartographic(cartographic);
    /**
     *  我的理解2000坐标系是椭球，实际是有误差，最大误差为0.4%，不知道是不是理解错误
     *  实际意义不大，为了后面化简
     *  xR = (x / R) * R * R
     *  yR = (y / R) * R * R
     *  zR = (z / R) * R * R
     *  有误差，实际值  rr < R < r
     *  xR ~= (x / R) * r * r = x*r*r/R
     *  yR ~= (y / R) * r * r = y*r*r/R
     *  zR ~= (z / R) * rr * rr = z*rr*rr/R
     */
    var eldCartesian = multiplyComponents(Ellipsoid.radiiSquared, posCartesian);
    /**
     *      计算点距离球心距离，依然是上面误差的问题
     *       _______________________________
     *  d = √ xR * x/R + yR * y/R + zR * z/R
     *       _________________
     *    = √ x*x + y*y + z*z
     *
     *      实际计算公式  rr < R < r
     *       ________________________________________________
     *  d = √ x*r*r/R * x/R + y*r*r/R * y/R + z*rr*rr/R * z/R
     *       ________________________________________________
     *    = √ x*x * r*r/R*R + y*y * r*r/R*R + z*z * rr*rr/R*R
     *       ____________________________________
     *      √ x*x * r*r + y*y * r*r + z*z * rr*rr
     *    = -------------------------------------
     *                     R
     *
     */
    var gamma = Math.sqrt(cartesianDot(posCartesian, eldCartesian));
    /**
     *  猜测值,算是缩小误差  rr < R < r
     *  R ~= d
     *  xR / d = x
     *  yR / d = y
     *  zR / d = z
     *
     *
     *  实际值
     *                      ____________________________________
     *  x = (x*r*r/R) * (R/√ x*x * r*r + y*y * r*r + z*z * rr*rr)
     *             ____________________________________
     *    = x*r*r/√ x*x * r*r + y*y * r*r + z*z * rr*rr
     *                      ____________________________________
     *  y = (y*r*r/R) * (R/√ x*x * r*r + y*y * r*r + z*z * rr*rr)
     *             ____________________________________
     *    = y*r*r/√ x*x * r*r + y*y * r*r + z*z * rr*rr
     *                        ____________________________________
     *  z = (z*rr*rr/R) * (R/√ x*x * r*r + y*y * r*r + z*z * rr*rr)
     *               ____________________________________
     *    = z*rr*rr/√ x*x * r*r + y*y * r*r + z*z * rr*rr
     *
     */
    var divide = divideByScalar(eldCartesian, gamma);
    /**
     *  x/R * h
     *  y/R * h
     *  z/R * h
     */
    var multiply = multiplyByScalar(posCartesian, 0);

    var result = {
        x: 0.0,
        y: 0.0,
        z: 0.0,
    };
    //Cartesian3.add(divide, multiply, result);因为高度是0，所以可以不加
    return divide;
}
function multiplyByVector(matrix, cartesian) {
    var result = { x: 0.0, y: 0.0, z: 0.0, w: 0.0 };
    var vX = cartesian.x;
    var vY = cartesian.y;
    var vZ = cartesian.z;
    var vW = cartesian.w;

    var x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ + matrix[12] * vW;
    var y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ + matrix[13] * vW;
    var z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ + matrix[14] * vW;
    var w = matrix[3] * vX + matrix[7] * vY + matrix[11] * vZ + matrix[15] * vW;

    result.x = x;
    result.y = y;
    result.z = z;
    result.w = w;
    return result;
}
function fromElements(x, y, z, w) {
    var result = { x: 0.0, y: 0.0, z: 0.0, w: 0.0 };
    result.x = x;
    result.y = y;
    result.z = z;
    result.w = w;
    return result;
}
function normalize(cartesian) {
    var result = {
        x: 0.0,
        y: 0.0,
        z: 0.0,
    };
    var magnitude = Math.sqrt(
        cartesian.x * cartesian.x +
            cartesian.y * cartesian.y +
            cartesian.z * cartesian.z
    );

    result.x = cartesian.x / magnitude;
    result.y = cartesian.y / magnitude;
    result.z = cartesian.z / magnitude;

    return result;
}
function worldToClip(position, viewMatrix, projectionMatrix) {
    var position4 = fromElements(position.x, position.y, position.z, 1);
    var positionEC = multiplyByVector(viewMatrix, position4);
    return multiplyByVector(projectionMatrix, positionEC);
}
function computeViewportTransformation(
    viewport,
    nearDepthRange,
    farDepthRange
) {
    var result = [];
    var x = viewport.x;
    var y = viewport.y;
    var width = viewport.width;
    var height = viewport.height;

    var halfWidth = width * 0.5;
    var halfHeight = height * 0.5;
    var halfDepth = (farDepthRange - nearDepthRange) * 0.5;

    var column0Row0 = halfWidth;
    var column1Row1 = halfHeight;
    var column2Row2 = halfDepth;
    var column3Row0 = x + halfWidth;
    var column3Row1 = y + halfHeight;
    var column3Row2 = nearDepthRange + halfDepth;
    var column3Row3 = 1.0;

    result[0] = column0Row0;
    result[1] = 0.0;
    result[2] = 0.0;
    result[3] = 0.0;
    result[4] = 0.0;
    result[5] = column1Row1;
    result[6] = 0.0;
    result[7] = 0.0;
    result[8] = 0.0;
    result[9] = 0.0;
    result[10] = column2Row2;
    result[11] = 0.0;
    result[12] = column3Row0;
    result[13] = column3Row1;
    result[14] = column3Row2;
    result[15] = column3Row3;
    return result;
}
function multiplyByPoint(matrix, cartesian) {
    var result = { x: 0.0, y: 0.0, z: 0.0 };
    var vX = cartesian.x;
    var vY = cartesian.y;
    var vZ = cartesian.z;

    var x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ + matrix[12];
    var y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ + matrix[13];
    var z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ + matrix[14];

    result.x = x;
    result.y = y;
    result.z = z;
    return result;
}
function clipToGLWindowCoordinates(viewport, position) {
    var positionNDC = divideByScalar(position, position.w);

    // Viewport transform to transform from clip coordinates to window coordinates
    var viewportTransform = computeViewportTransformation(viewport, 0.0, 1.0);
    var positionWC = multiplyByPoint(viewportTransform, positionNDC);

    return { x: positionWC.x, y: positionWC.y };
}
var positionCC = { x: 0.0, y: 0.0, z: 0.0, w: 0.0 };
//笛卡尔坐标转屏幕像素
/**
 * scene = {
 *          width:scene.canvas.clientWidth,
 *          height:scene.canvas.clientHeight,
 *          viewMatrix:scene.camera.viewMatrix,([16])
 *          projectionMatrix:scene.camera.frustum.projectionMatrix([16])
 *         }
 *
 *
 * position = {
 *              x:0.0,
 *              y:0.0,
 *              z:0.0
 *             }
 *
 *
 */
function cartesianToWindow(scene, position) {
    var actualPosition = position;
    //获取画布信息
    var viewport = { x: 0.0, y: 0.0, width: 0.0, height: 0.0 };
    viewport.x = 0;
    viewport.y = 0;
    viewport.width = scene.width;
    viewport.height = scene.height;

    var cameraCentered = true;
    var result = { x: 0.0, y: 0.0 };
    //暂时只考虑三维
    if (cameraCentered) {
        // 从世界坐标转换到裁切坐标的投影矩阵
        positionCC = worldToClip(
            actualPosition,
            scene.viewMatrix,
            scene.projectionMatrix
        );
        if (positionCC.z < 0) {
            return undefined;
        }

        result = clipToGLWindowCoordinates(viewport, positionCC);
    }

    result.y = scene.height - result.y;
    return result;
}
function projection(point) {
    //经纬度转笛卡尔坐标
    var cartesian = degreesToCartesian(point);
    //迪卡尔转像素
    var pixel = cartesianToWindow(myScene, cartesian);
    return pixel;
}
