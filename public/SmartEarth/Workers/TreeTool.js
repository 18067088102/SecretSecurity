
/**
 * @alias TreeTool
 * @constructor
 * 
 * @param {SGWorld} sgworld sgworl对象
 */
function TreeTool(sgworld) {
    this.sgworld = sgworld
    this.treeData = new Map()
    this.colorTool = sgworld.Core.gradientColor();
    this.sgwfs = new window.SmartEarth.WFSTool(sgworld._Viewer);
    this.cacheModelFlatten = new Map();
}

/**
 * 勾选节点
 * 
 * @param {Object} treeNode 树节点
 * @param {Boolean} checked 是否勾选
 */
TreeTool.prototype.checkNode = function (treeNode, checked) {
    if (checked !== undefined) {
        treeNode.checked = checked;
    } else {
        treeNode.checked = !treeNode.checked;
    }

    if (treeNode.children) {
        treeNode.children.forEach((item) => {
            this.checkNode(item, treeNode.checked);
        });
    } else if (treeNode._children) {
        treeNode._children.forEach(item => {
            this.checkNode(item, treeNode.checked);
        });
    } else {
        if (this.treeData.has(treeNode.id)) {
            this.show(treeNode.id, checked)
        } else {
            this.addData(treeNode)
        }
    }
}

/**
 * 添加数据
 * 
 * @param {Object} nodeData 树节点
 * @requires {Object}
 */
TreeTool.prototype.addData = async function (nodeData) {
    let layer
    let de = {};
    let { ...treeNode } = nodeData


    switch (treeNode.sourceType) {
        case 'local-map':
            // 添加本地地图
            if (treeNode.tms) {
                layer = this.sgworld.Creator.createImageryProvider(treeNode.name, "tms", {
                    id: treeNode.id,
                    url: treeNode.urls,
                    fileExtension: treeNode.img || 'png',
                    enablePickFeatures: false,
                    level: treeNode.Level,
                    minimumLevel: treeNode.minimumLevel,
                    maximumLevel: treeNode.maximumLevel,
                    tilingScheme: treeNode.tileType === 'Geo' ? new Cesium.GeographicTilingScheme() : new Cesium.WebMercatorTilingScheme(),
                    alpha: treeNode.alpha
                }, "0", treeNode.zIndex, true, "");
            } else {
                layer = this.sgworld.Creator.createUrlTemplateImageryProvider(treeNode.name, {
                    id: treeNode.id,
                    url: `${treeNode.urls}/${treeNode.tile || '{z}/{x}/{y}'}.${treeNode.img || 'png'}`,
                    enablePickFeatures: false,
                    level: treeNode.Level,
                    minimumLevel: treeNode.minimumLevel,
                    maximumLevel: treeNode.maximumLevel,
                    tilingScheme: treeNode.tileType === 'Geo' ? new Cesium.GeographicTilingScheme() : new Cesium.WebMercatorTilingScheme(),
                    alpha: treeNode.alpha
                }, "0", treeNode.zIndex, true, "");
            }
            break;
        case 'kml':
            // 添加kml数据
            layer = this.sgworld.Creator.addKmlLayer(treeNode.name, {
                id: treeNode.id,
                url: treeNode.urls,
            }, true);
            break;
        case 'google':
            // 添加谷歌地图
            layer = this.sgworld.Creator.createUrlTemplateImageryProvider(treeNode.name, {
                id: treeNode.id,
                url: treeNode.urls,
                enablePickFeatures: false,
                level: treeNode.Level,
                minimumLevel: treeNode.minimumLevel,
                maximumLevel: treeNode.maximumLevel,
                alpha: treeNode.alpha
            }, "0", treeNode.zIndex, true, "");
            break;
        case 'arcgis':
            // arcgis地图
            layer = this.sgworld.Creator.createArcGisImageryLayer(treeNode.name, {
                id: treeNode.id,
                url: treeNode.urls,
                enablePickFeatures: false,
                level: treeNode.Level,
                usePreCachedTilesIfAvailable: treeNode.GCJ02 ? false : true, // 是否使用服务的内置的切片方案，偏移纠正需要使用如下自定义的方案
                tilingScheme: treeNode.GCJ02
                    ? this.sgworld.Core.getOffsetTilingScheme()
                    : undefined, // 偏移纠正
                minimumLevel: treeNode.minimumLevel,
                maximumLevel: treeNode.maximumLevel,
                alpha: treeNode.alpha
            }, "0", treeNode.zIndex, true, "");
            break;
        case 'mapbox':
            // mapbox地图
            layer = this.sgworld.Creator.createImageryProvider(treeNode.name, 'MapBox', {
                id: treeNode.id,
                name: treeNode.name,
                level: treeNode.Level,
                enablePickFeatures: false,
                mapId: treeNode.mapId,
                minimumLevel: treeNode.minimumLevel,
                maximumLevel: treeNode.maximumLevel,
                alpha: treeNode.alpha,
                accessToken: treeNode.token || 'pk.eyJ1IjoibWFyc2dpcyIsImEiOiJja2Fod2xlanIwNjJzMnhvMXBkMnNqcjVpIn0.WnxikCaN2KV_zn9tLZO77A'
            }, "0", treeNode.zIndex, true, "");
            break;
        case 'tdmap':
            // 天地图
            layer = this.sgworld.Creator.createWebMapTileServerImageLayer(treeNode.name, {
                id: treeNode.id,
                url: treeNode.urls,
                level: treeNode.Level,
                minimumLevel: treeNode.minimumLevel,
                maximumLevel: treeNode.maximumLevel || 18,
                style: treeNode.style,
                layer: treeNode.layer,
                format: treeNode.format,
                enablePickFeatures: false,
                tileMatrixSetID: "tiff",
                show: true,
                subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
                alpha: treeNode.alpha
            }, "0", treeNode.zIndex, true, "");
            break;
        case "tdt_label":
            // 天地图三维注记
            layer = this.sgworld.Creator.GeoWTFS({
                token: treeNode.token || "c53eb074c3fcba5ac86103d4d711bbe8",
                url: treeNode.urls,
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
            });
            break;
        case 'txmap':
            // 腾讯地图
            layer = this.sgworld.Creator.createUrlTemplateImageryProvider(treeNode.name, {
                id: treeNode.id,
                url: treeNode.urls,
                level: treeNode.Level,
                enablePickFeatures: false,
                minimumLevel: treeNode.minimumLevel,
                maximumLevel: treeNode.maximumLevel || 18,
                alpha: treeNode.alpha,
                tilingScheme: sgworld.Core.getOffsetTilingScheme(), // 偏移纠正
                customTags: {
                    sx: (_imageryProvider, x) => {
                        return x >> 4;
                    },
                    sy: (_imageryProvider, _x, y, level) => {
                        return ((1 << level) - y) >> 4;
                    }
                }
            }, "0", treeNode.zIndex, true, "");
            break;
        case 'gdmap':
            // 高德地图
            layer = this.sgworld.Creator.createUrlTemplateImageryProvider(treeNode.name, {
                id: treeNode.id,
                url: treeNode.urls,
                enablePickFeatures: false,
                level: treeNode.Level,
                minimumLevel: treeNode.minimumLevel,
                maximumLevel: treeNode.maximumLevel || 18,
                tilingScheme: sgworld.Core.getOffsetTilingScheme(), // 偏移纠正
                alpha: treeNode.alpha
            }, "0", treeNode.zIndex, true, "");
            break;
        case 'bdmap':
            // 百度地图
            layer = this.sgworld.Creator.createImageryProvider(treeNode.name, "BaiduMap", {
                id: treeNode.id,
                level: treeNode.Level,
                enablePickFeatures: false,
                style: treeNode.style,
                minimumLevel: treeNode.minimumLevel,
                maximumLevel: treeNode.maximumLevel,
                alpha: treeNode.alpha
            }, "0", treeNode.zIndex, true, "");
            break;
        case 'cesiumblack':
            // cesiumIon黑夜地图
            layer = this.sgworld.Creator.createImageryProvider(treeNode.name, "cesiumBlack", {
                id: treeNode.id,
                url: treeNode.urls,
                flipXY: true,
                enablePickFeatures: false,
                level: treeNode.Level,
                minimumLevel: treeNode.minimumLevel,
                maximumLevel: treeNode.maximumLevel,
                alpha: treeNode.alpha
            }, "0", treeNode.zIndex, true, "");
            break;
        case 'osm':
            // osm地图
            layer = this.sgworld.Creator.createImageryProvider(treeNode.name, "OpenStreetMap", {
                id: treeNode.id,
                url: treeNode.urls,
                enablePickFeatures: false,
                level: treeNode.Level,
                minimumLevel: treeNode.minimumLevel,
                maximumLevel: treeNode.maximumLevel,
                alpha: treeNode.alpha
            }, "0", treeNode.zIndex, true, "");
            break;
        case 'wmts':
            // wmts影像
            layer = this.sgworld.Creator.createWebMapTileServerImageLayer(treeNode.name, {
                id: treeNode.id,
                url: treeNode.urls,
                level: treeNode.Level,
                style: treeNode.style,
                layer: treeNode.layer,
                enablePickFeatures: false,
                format: treeNode.format,
                tileMatrixSetID: treeNode.srs,
                tilingScheme: treeNode.tileType === 'Geo' ? new Cesium.GeographicTilingScheme() : new Cesium.WebMercatorTilingScheme(),
                show: true,
                minimumLevel: treeNode.minimumLevel,
                maximumLevel: treeNode.maximumLevel,
                alpha: treeNode.alpha
            }, "0", treeNode.zIndex, true, "");
            break;
        case 'gis_wmts':
            // gisserver wmst影像
            layer = this.sgworld.Creator.createUrlTemplateImageryProvider(treeNode.name, {
                id: treeNode.id,
                url: Cesium.buildModuleUrl(
                    treeNode.urls + "/{z}/{x}/{reverseY}.png"
                ),
                enablePickFeatures: false,
                level: treeNode.Level,
                minimumLevel: treeNode.minimumLevel,
                maximumLevel: treeNode.maximumLevel,
                alpha: treeNode.alpha
            }, "0", treeNode.zIndex, true, '');
            break;
        case 'wmts_zj':
            // 行列号差两倍的wmts
            var geotil = new Cesium.GeographicTilingScheme({
                rectangle: Cesium.Rectangle.MAX_VALUE,
            });
            if (treeNode.addLevel && treeNode.addLevel === 2) {
                geotil.positionToTileXY = function (position, level, result) {
                    level > 0 && level++;
                    var rectangle = this._rectangle;
                    if (!Cesium.Rectangle.contains(rectangle, position)) {
                        // outside the bounds of the tiling scheme
                        return undefined;
                    }

                    var xTiles = this.getNumberOfXTilesAtLevel(level);
                    var yTiles = this.getNumberOfYTilesAtLevel(level);

                    var xTileWidth = rectangle.width / xTiles;
                    var yTileHeight = rectangle.height / yTiles;

                    var longitude = position.longitude;
                    if (rectangle.east < rectangle.west) {
                        longitude += Cesium.Math.TWO_PI;
                    }

                    var xTileCoordinate =
                        ((longitude - rectangle.west) / xTileWidth) | 0;
                    if (xTileCoordinate >= xTiles) {
                        xTileCoordinate = xTiles - 1;
                    }

                    var yTileCoordinate =
                        ((rectangle.north - position.latitude) / yTileHeight) | 0;
                    if (yTileCoordinate >= yTiles) {
                        yTileCoordinate = yTiles - 1;
                    }

                    if (!Cesium.defined(result)) {
                        return new Cesium.Cartesian2(xTileCoordinate, yTileCoordinate);
                    }

                    result.x = xTileCoordinate;
                    result.y = yTileCoordinate;
                    return result;
                };
                geotil.tileXYToRectangle = function (x, y, level, result) {
                    level > 0 && level++;
                    var rectangle = this._rectangle;

                    var xTiles = this.getNumberOfXTilesAtLevel(level);
                    var yTiles = this.getNumberOfYTilesAtLevel(level);

                    var xTileWidth = rectangle.width / xTiles;
                    var west = x * xTileWidth + rectangle.west;
                    var east = (x + 1) * xTileWidth + rectangle.west;

                    var yTileHeight = rectangle.height / yTiles;
                    var north = rectangle.north - y * yTileHeight;
                    var south = rectangle.north - (y + 1) * yTileHeight;

                    if (!Cesium.defined(result)) {
                        result = new Cesium.Rectangle(west, south, east, north);
                    }

                    result.west = west;
                    result.south = south;
                    result.east = east;
                    result.north = north;
                    return result;
                };
            }
            layer = this.sgworld.Creator.createWebMapTileServerImageLayer(
                treeNode.name,
                {
                    id: treeNode.id,
                    url: treeNode.urls,
                    layer: treeNode.layer,
                    level: treeNode.Level,
                    minimumLevel: treeNode.minimumLevel,
                    maximumLevel: treeNode.maximumLevel,
                    style: "default",
                    tileMatrixSetID: "esritilematirx",
                    format: "image/png",
                    tilingScheme: geotil,
                    addLevel: treeNode.addLevel || 1, //层级加一
                    enablePickFeatures: false,
                    show: true,
                    alpha: treeNode.alpha
                }, "0", treeNode.zIndex, true, "");
            break;
        case 'wms':
        case 'wmsc':
            // wms数据
            var parameters = {
                service: "WMS",
                format: "image/png",
                transparent: true,
            };
            if (treeNode.removeNullValue) {
                if (treeNode.nullvalue) {
                    treeNode.nullvalue = treeNode.nullvalue.replace("rgb(", "");
                    treeNode.nullvalue = treeNode.nullvalue.replace(")", "");
                }
                parameters.nullvalue = this.sgworld.Core.defaultValue(treeNode.nullvalue, "0,0,0");
                parameters.nulltolerance = this.sgworld.Core.defaultValue(treeNode.nulltolerance, 0);
            }
            treeNode.token && (treeNode.urls += "?token=" + treeNode.token);
            if (treeNode.sourceType === 'wmsc') {
                layer = this.sgworld.Creator.createCacheImageryProvider(treeNode.name,
                    {
                        id: treeNode.id,
                        url: treeNode.urls || '',
                        layers: treeNode.layer || '',
                        level: treeNode.Level,
                        enablePickFeatures: false,
                        cacheUrl: treeNode.cacheUrl || treeNode.urls,
                        fileExtension: treeNode.fileExtension,
                        cacheMaxLevel: treeNode.cacheMaxLevel || 16,
                        alpha: treeNode.alpha
                    }, "0", treeNode.zIndex, treeNode.checked, "");
            } else {
                layer = this.sgworld.Creator.createImageryProvider(treeNode.name, "wms", {
                    id: treeNode.id,
                    url: treeNode.urls,
                    layers: treeNode.layer || '',
                    level: treeNode.Level,
                    minimumLevel: treeNode.minimumLevel,
                    maximumLevel: treeNode.maximumLevel,
                    enablePickFeatures: false,
                    parameters: parameters,
                    alpha: treeNode.alpha
                }, "0", treeNode.zIndex, true, "");
            }
            break;
        case "wfs":
            // wfs数据
            layer = this.sgwfs.CreateWfs(treeNode.class, treeNode)
            break;
        case 'geojson':
            if (treeNode.class === 'point') {
                treeNode.disableDepthTestDistance === "Infinity" &&
                    (treeNode.disableDepthTestDistance = Number.POSITIVE_INFINITY);

                de = {
                    id: treeNode.id,
                    fillColor: this.sgworld.Core.defaultValue(treeNode.color, "#ffffff"),
                    color: this.sgworld.Core.defaultValue(treeNode.imageColor, undefined),
                    outlineColor: this.sgworld.Core.defaultValue(treeNode.outlineColor, "#ffffff"),
                    backgroundColor: this.sgworld.Core.defaultValue(
                        treeNode.backgroundColor,
                        "#ffffff"
                    ),
                    heightReference: this.sgworld.Core.defaultValue(treeNode.heightReference, 0),
                    pointHeight: this.sgworld.Core.defaultValue(treeNode.pointHeight, undefined),
                    near: this.sgworld.Core.defaultValue(treeNode.near, 0),
                    far: this.sgworld.Core.defaultValue(treeNode.far, 99999999999),
                    bold: treeNode.bold,
                    italic: treeNode.italic,
                    showBackground: treeNode.showBackground,
                    outlineWidth: this.sgworld.Core.defaultValue(treeNode.outlineWidth, 1),
                    text: treeNode.text,
                    image: treeNode.image,
                    font_size: treeNode.size,
                    font_family: this.sgworld.Core.defaultValue(treeNode.font_family, "微软雅黑"),
                    disableDepthTestDistance: this.sgworld.Core.defaultValue(
                        treeNode.disableDepthTestDistance,
                        undefined
                    ),
                    labelData: treeNode.labelData,
                    imageData: treeNode.imageData,
                };

                if (
                    treeNode.text &&
                    treeNode.image &&
                    !treeNode.labelData &&
                    !treeNode.imageData
                ) {
                    de.labelData = {
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        pixelOffset: new Cesium.Cartesian2(20, 0),
                    };
                    de.imageData = {
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        pixelOffset: new Cesium.Cartesian2(0, 0),
                    };
                }
                layer = sgworld.Creator.createLabelPointGeoJsonFeatureLayer(treeNode.name, treeNode.urls, de, "0", treeNode.checked);
            } else if (treeNode.class === 'polyline') {
                if (treeNode.effect) {
                    layer = this.sgworld.Creator.createPathLayer({
                        id: treeNode.id,
                        url: treeNode.urls,
                        color: treeNode.color || "#0033FF", //线的颜色
                        width: treeNode.width || 4.0, //线的宽度
                        pointColor: treeNode.pointColor || "#FFFFFF", //移动点的颜色
                        speed: treeNode.speed,
                        near: treeNode.near,
                        far: treeNode.far
                    });
                } else if (treeNode.effectWall) {
                    layer = this.sgworld.Creator.createTrailWallLayer({
                        id: treeNode.id,
                        url: treeNode.urls,
                        color: treeNode.color || "#0033FF", //线的颜色
                        height: treeNode.height || 100, // 顶部高度
                        minHeight: treeNode.minHeight || 0, //底部高度
                        speed: treeNode.speed,
                        near: treeNode.near,
                        far: treeNode.far
                    });
                } else {
                    de = {
                        id: treeNode.id,
                        layertype: "polylinelayer",
                        material: this.sgworld.Core.defaultValue(treeNode.color, "#ffffff"),
                        outlineColor: this.sgworld.Core.defaultValue(treeNode.outlineColor, "#ffffff"),
                        outlineWidth: this.sgworld.Core.defaultValue(treeNode.outlineWidth, 0),
                        height: this.sgworld.Core.defaultValue(treeNode.height, undefined),
                        width: this.sgworld.Core.defaultValue(treeNode.width, 2),
                        clampToGround: this.sgworld.Core.defaultValue(treeNode.clampToGround, true),
                        classificationType: treeNode.classificationType,
                        dash: this.sgworld.Core.defaultValue(treeNode.dash, false),
                        dashLength: this.sgworld.Core.defaultValue(treeNode.dashLength, 20),
                        gapColor: this.sgworld.Core.defaultValue(treeNode.gapColor, "rgba(0,0,0,0)"),
                        near: this.sgworld.Core.defaultValue(treeNode.near, 0),
                        far: this.sgworld.Core.defaultValue(treeNode.far, Infinity),
                    };

                    layer = this.sgworld.Creator.createPolylineGeoJsonFeatureLayer(
                        treeNode.name,
                        treeNode.urls,
                        de,
                        "0",
                        treeNode.checked
                    );
                }
            } else if (treeNode.class === 'polylineVolume') {
                de = {
                    id: treeNode.id,
                    material: this.sgworld.Core.defaultValue(treeNode.color, '#ff0000'),
                    slttype: "0",
                    number: "4",
                    exradius: "1",
                    inradius: "1",
                    orth_width: "2",
                    orth_height: "2",
                    radius: this.sgworld.Core.defaultValue(treeNode.radius, 5),
                    cornerType: "0",
                    heightReference: "0",
                    height: this.sgworld.Core.defaultValue(treeNode.lineHeight || treeNode.height, 0),
                    near: this.sgworld.Core.defaultValue(treeNode.near, 0),
                    far: this.sgworld.Core.defaultValue(treeNode.far, Infinity),
                    radiusScale: treeNode.radiusScale || 1,
                    connect: treeNode.connect,
                }
                de.radiusScale /= 2;
                layer = this.sgworld.Creator.createpolylineVolumeGeojsonPrimitiveLayer(treeNode.name, treeNode.urls, de, "0", true, function (data) {
                    if (treeNode.flow) {
                        let lines = data.entities.values;
                        lines.forEach(line => {
                            line.polylineVolume.material = this.sgworld.Core.getTrailLinkMaterial(this.sgworld.Core.defaultValue(treeNode.color, '#ff0000'), '../static/images/smoke.png', 9000);
                        })
                    }
                });
            } else if (treeNode.class === 'model') {
                de = {
                    id: treeNode.id,
                    url: this.sgworld.Core.defaultValue(treeNode.url, ''),
                    color: this.sgworld.Core.defaultValue(treeNode.color, '#ffffff'),
                    scale: this.sgworld.Core.defaultValue(treeNode.scale, 1),
                    height: this.sgworld.Core.defaultValue(treeNode.pointHeight || treeNode.height, 0),
                    heading: treeNode.heading,
                    pitch: treeNode.pitch,
                    roll: treeNode.roll,
                }
                layer = this.sgworld.Creator.createModelGeojsonFeatureLayer(treeNode.name, treeNode.urls, de, "0", true);
            } else if (treeNode.class === "polygon") {
                treeNode.disableDepthTestDistance === "Infinity" &&
                    (treeNode.disableDepthTestDistance = Number.POSITIVE_INFINITY);

                de = {
                    id: treeNode.id,
                    material: this.sgworld.Core.defaultValue(treeNode.color, "#ff0000"),
                    height: this.sgworld.Core.defaultValue(treeNode.height, 0),
                    outlineColor: this.sgworld.Core.defaultValue(treeNode.outlineColor, "#ff0000"),
                    extrudedHeight: this.sgworld.Core.defaultValue(treeNode.extrudedHeight, 0),
                    outlineWidth: this.sgworld.Core.defaultValue(treeNode.outlineWidth, 0),
                    outline: this.sgworld.Core.defaultValue(treeNode.outline, true),
                    clampToGround: this.sgworld.Core.defaultValue(treeNode.clampToGround, treeNode.extrudedHeight === undefined && treeNode.height === undefined),
                    classificationType: treeNode.classificationType,
                    near: this.sgworld.Core.defaultValue(treeNode.near, 0),
                    far: this.sgworld.Core.defaultValue(treeNode.far, Infinity),

                    text: treeNode.text,
                    fillColor: treeNode.labelColor || treeNode.color,
                    labelOutlineColor: treeNode.labelOutlineColor || treeNode.outlineColor || "#ff0000",
                    font: this.sgworld.Core.defaultValue(treeNode.font, '微软雅黑'),
                    labelNear: treeNode.labelNear,
                    labelFar: treeNode.labelFar,
                    font_size: this.sgworld.Core.defaultValue(treeNode.size, '18px'),
                    italic: treeNode.italic,
                    bold: treeNode.bold,
                    pixelOffset: new Cesium.Cartesian2(
                        this.sgworld.Core.defaultValue(treeNode.offsetX, 0),
                        this.sgworld.Core.defaultValue(treeNode.offsetY, 0)
                    ),
                    labelOutlineWidth: 2,
                    disableDepthTestDistance: treeNode.disableDepthTestDistance,

                    water: treeNode.water,
                    mask: treeNode.mask,
                    bulidingWall: treeNode.bulidingWall,
                    bulidingWallWidth: treeNode.bulidingWallWidth,
                };
                layer = this.sgworld.Creator.createPolygonGeoJsonFeatureLayer(
                    treeNode.name,
                    treeNode.urls,
                    de,
                    "0",
                    treeNode.checked,
                );
            }
            break;
        case 'pathLayer':
            layer = this.sgworld.Creator.createPathLayer({
                id: treeNode.id,
                url: treeNode.url,
                color: treeNode.color || "#0033FF", //线的颜色
                width: treeNode.width || 4.0, //线的宽度
                pointColor: treeNode.pointColor || "#FFFFFF", //移动点的颜色
                speed: treeNode.speed || 5,
                far: treeNode.far || 5000
            });
            break;
        case 'vector': {
            let urls = {
                url: treeNode.urls,
                layer: treeNode.layer,
                srs: treeNode.srs,
            };
            if (treeNode.class === "point" || treeNode.class === "label" || treeNode.class === "image") {
                treeNode.disableDepthTestDistance === "Infinity" &&
                    (treeNode.disableDepthTestDistance = Number.POSITIVE_INFINITY);
                if (treeNode.style) {
                    // de = getVectorStyleFromSG(treeNode, treeNode.style);
                } else {
                    de = {
                        id: treeNode.id,
                        level_min: this.sgworld.Core.defaultValue(treeNode.minimumLevel, 10),
                        level_max: this.sgworld.Core.defaultValue(treeNode.maximumLevel, 22),
                        fillColor: this.sgworld.Core.defaultValue(treeNode.color, "#ffffff"),
                        color: this.sgworld.Core.defaultValue(treeNode.imageColor, undefined),
                        outlineColor: this.sgworld.Core.defaultValue(treeNode.outlineColor, "#ffffff"),
                        backgroundColor: this.sgworld.Core.defaultValue(
                            treeNode.backgroundColor,
                            "#ffffff"
                        ),
                        heightReference: this.sgworld.Core.defaultValue(treeNode.heightReference, 0),
                        pointHeight: this.sgworld.Core.defaultValue(treeNode.pointHeight, undefined),
                        near: this.sgworld.Core.defaultValue(treeNode.near, 0),
                        far: this.sgworld.Core.defaultValue(treeNode.far, 99999999999),
                        bold: treeNode.bold,
                        italic: treeNode.italic,
                        showBackground: treeNode.showBackground,
                        outlineWidth: this.sgworld.Core.defaultValue(treeNode.outlineWidth, 1),
                        text: treeNode.text,
                        image: treeNode.image,
                        font_size: treeNode.size,
                        font_family: this.sgworld.Core.defaultValue(treeNode.font_family, "微软雅黑"),
                        disableDepthTestDistance: this.sgworld.Core.defaultValue(
                            treeNode.disableDepthTestDistance,
                            undefined
                        ),
                        labelData: treeNode.labelData,
                        imageData: treeNode.imageData,
                    };
                }

                if (
                    treeNode.text &&
                    treeNode.image &&
                    !treeNode.labelData &&
                    !treeNode.imageData
                ) {
                    de.labelData = {
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        pixelOffset: new Cesium.Cartesian2(20, 0),
                    };
                    de.imageData = {
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        pixelOffset: new Cesium.Cartesian2(0, 0),
                    };
                }
                urls.upperLevelLimit = de.level_max;
                urls.lowerLevelLimit = de.level_min;
                layer = this.sgworld.Creator.createLabelImageGeoJsonFeatureLayerProvider(
                    treeNode.name,
                    urls,
                    de,
                    "0",
                    treeNode.checked,
                    function () { }
                );
            } else if (treeNode.class === "polylineVolume") {
                de = {
                    id: treeNode.id,
                    level_min: this.sgworld.Core.defaultValue(treeNode.minimumLevel, 10),
                    level_max: this.sgworld.Core.defaultValue(treeNode.maximumLevel, 22),
                    material: this.sgworld.Core.defaultValue(treeNode.color, "#ff0000"),
                    slttype: "0",
                    number: "4",
                    exradius: "1",
                    inradius: "1",
                    orth_width: "2",
                    orth_height: "2",
                    radius: this.sgworld.Core.defaultValue(treeNode.radius, 0.5),
                    cornerType: "0",
                    heightReference: "0",
                    height: this.sgworld.Core.defaultValue(treeNode.height, 0),
                    near: this.sgworld.Core.defaultValue(treeNode.near, 0),
                    far: this.sgworld.Core.defaultValue(treeNode.far, 99999999999),
                    radiusScale: treeNode.radiusScale,
                };
                urls.upperLevelLimit = de.level_max;
                urls.lowerLevelLimit = de.level_min;
                layer = this.sgworld.Creator.createVolumeGeoJsonFeatureLayerProvider(
                    treeNode.name,
                    urls,
                    de,
                    "0",
                    treeNode.checked,
                    function () { }
                );
            } else if (treeNode.class === "polyline") {
                de = {
                    id: treeNode.id,
                    layertype: "polylinelayer",
                    level_min: this.sgworld.Core.defaultValue(treeNode.minimumLevel, 10),
                    level_max: this.sgworld.Core.defaultValue(treeNode.maximumLevel, 22),
                    material: this.sgworld.Core.defaultValue(treeNode.color, "#ffffff"),
                    outlineColor: this.sgworld.Core.defaultValue(treeNode.outlineColor, "#ffffff"),
                    outlineWidth: this.sgworld.Core.defaultValue(treeNode.outlineWidth, 0),
                    height: this.sgworld.Core.defaultValue(treeNode.height, undefined),
                    width: this.sgworld.Core.defaultValue(treeNode.width, 2),
                    clampToGround: this.sgworld.Core.defaultValue(treeNode.clampToGround, true),
                    classificationType: treeNode.classificationType,
                    dash: this.sgworld.Core.defaultValue(treeNode.dash, false),
                    dashLength: this.sgworld.Core.defaultValue(treeNode.dashLength, 20),
                    gapColor: this.sgworld.Core.defaultValue(treeNode.gapColor, "rgba(0,0,0,0)"),
                    near: this.sgworld.Core.defaultValue(treeNode.near, 0),
                    far: this.sgworld.Core.defaultValue(treeNode.far, Infinity),
                };
                urls.upperLevelLimit = de.level_max;
                urls.lowerLevelLimit = de.level_min;

                layer = this.sgworld.Creator.createPrimitivePolylineVectorGeoJsonFeatureLayerProvider(
                    treeNode.name,
                    urls,
                    de,
                    "0",
                    treeNode.checked,
                    function () { }
                );
            } else if (treeNode.class === "polygon") {
                de = {
                    id: treeNode.id,
                    layertype: "polygonlayer",
                    level_min: this.sgworld.Core.defaultValue(treeNode.minimumLevel, 10),
                    level_max: this.sgworld.Core.defaultValue(treeNode.maximumLevel, 22),
                    material: this.sgworld.Core.defaultValue(treeNode.color, "#ff0000"),
                    heightReference: "1",
                    height: this.sgworld.Core.defaultValue(treeNode.height, 0),
                    extrudedHeight: this.sgworld.Core.defaultValue(treeNode.extrudedHeight, 0),
                    extrudedHeightReference: "1",
                    clampToGround: this.sgworld.Core.defaultValue(treeNode.clampToGround, false),
                    classificationType: treeNode.classificationType,
                    near: this.sgworld.Core.defaultValue(treeNode.near, 0),
                    far: this.sgworld.Core.defaultValue(treeNode.far, Infinity),

                };
                urls.upperLevelLimit = de.level_max;
                urls.lowerLevelLimit = de.level_min;
                layer = this.sgworld.Creator.createGeoJsonFeatureLayerProviderOptimization(
                    treeNode.name,
                    urls,
                    de,
                    "0",
                    treeNode.checked,
                    function () {

                    }
                );
            } else if (treeNode.class === "model") {
                de = {
                    id: treeNode.id,
                    level_min: this.sgworld.Core.defaultValue(treeNode.minimumLevel, 10),
                    level_max: this.sgworld.Core.defaultValue(treeNode.maximumLevel, 22),
                    uri: this.sgworld.Core.defaultValue(treeNode.model || treeNode.uri, ""),
                    file: "",
                    color: this.sgworld.Core.defaultValue(treeNode.color, "#ffffff"),
                    scale: this.sgworld.Core.defaultValue(treeNode.scale, 1),
                    heightReference: 0,
                    height: this.sgworld.Core.defaultValue(treeNode.height, 0),
                    heading: treeNode.heading,
                    pitch: treeNode.pitch,
                    roll: treeNode.roll,
                };
                //模型点
                urls.upperLevelLimit = de.level_max;
                urls.lowerLevelLimit = de.level_min;
                layer = this.sgworld.Creator.createModelGeoJsonFeatureLayerProvider(
                    treeNode.name,
                    urls,
                    de,
                    "0",
                    treeNode.checked,
                    function () { }
                );
            }
            layer && (treeNode.id = layer.treeobj.id);
            break;
        }
        case 'terrain':
            layer = this.sgworld.Creator.createTerrain(treeNode.name, {
                id: treeNode.id,
                requestVertexNormals: true,
                url: treeNode.urls
            }, "0", true, "");
            break;
        case "sgsterrain":
            layer = this.sgworld.Creator.sfsterrainprovider(
                treeNode.name,
                {
                    id: treeNode.id,
                    layerName: treeNode.layer,
                    requestVertexNormals: true,
                    url: treeNode.urls || '',
                    token: treeNode.token,
                    cacheUrl: treeNode.cacheUrl,
                    cacheLevel: treeNode.cacheLevel,
                },
                "0",
                true,
                ""
            );
            break;
        case "sgsterrain7.1":
            layer = this.sgworld.Creator.sfsterrainprovider71(
                treeNode.name,
                {
                    id: treeNode.id,
                    layerName: treeNode.layer,
                    requestVertexNormals: true,
                    url: treeNode.urls,
                    token: treeNode.token,
                    cacheUrl: treeNode.cacheUrl,
                    cacheLevel: treeNode.cacheLevel,
                },
                "0",
                true,
                ""
            );
            break;
        case 'arcgisterrain':
            layer = this.sgworld.Creator.createArcGISTerrain(treeNode.name, {
                id: treeNode.id,
                requestVertexNormals: true,
                url: treeNode.urls
            }, "0", true, "");
            break;
        case 'CesiumGlobeTerrain':
            layer = this.sgworld.Creator.createCesiumTerrain(treeNode.name, {
                id: treeNode.id,
                requestVertexNormals: true,
            }, "0", true, "");
            break;
        case "modelFlatten":
            let model = this.getData(treeNode.modelId);
            if (model) {
                layer = model.setFlatten(true, {
                    fid: treeNode.id,
                    show: treeNode.checked,
                    name: treeNode.name,
                    positions: treeNode.positions,
                });
                model.flattenHeight = treeNode.height || 0;
            } else {
                let cacheData = this.cacheModelFlatten.get(treeNode.modelId)
                if (!cacheData) {
                    this.cacheModelFlatten.set(treeNode.modelId, []);
                    cacheData = this.cacheModelFlatten.get(treeNode.modelId)
                };
                cacheData.push(treeNode);
            }
            break;
        case 'b3dm':
            layer = this.sgworld.Creator.create3DTilesets(treeNode.name, treeNode.urls,
                {
                    id: treeNode.id,
                    Level: treeNode.Level,
                    maximumScreenSpaceError: treeNode.maximumScreenSpaceError && parseInt(treeNode.maximumScreenSpaceError),
                    maximumMemoryUsage: treeNode.maximumMemoryUsage && parseInt(treeNode.maximumMemoryUsage),
                    geometricError: treeNode.geometricError && parseInt(treeNode.geometricError),
                    backFaceCulling: treeNode.backFaceCulling
                },
                {
                    groundCenter: treeNode.Center,
                    groundheight: treeNode.modelHeight,
                    heading: treeNode.heading,
                    pitch: treeNode.pitch,
                    roll: treeNode.roll,
                    effects: treeNode.effects || false,
                    effectsMaxHeight: treeNode.effectsMaxHeight || 150,
                    colors: treeNode.alpha
                        ? "rgba(255,255,255," + treeNode.alpha + ")"
                        : treeNode.color || undefined,
                }, "0", true);
            if (this.cacheModelFlatten.get(treeNode.id)) {
                let cacheData = this.cacheModelFlatten.get(treeNode.id);
                cacheData.forEach(item => {
                    let data = layer.setFlatten(true, {
                        fid: item.id,
                        show: item.checked,
                        name: item.name,
                        positions: item.positions,
                    });
                    layer.flattenHeight = item.height || 0;
                    this.setData(item.id, data);
                })
            }
            break;
        case 's3m':
            layer = this.sgworld.Creator.createS3MLayer(treeNode.urls, {
                scene: this.sgworld._Viewer.scene,
                near: treeNode.near,
                far: treeNode.far,
                lodRangeScale: treeNode.lodRangeScale,
            }, function () {

            })
            break;
        case 'gltf':
            var position = [treeNode.lon, treeNode.lat, treeNode.height];
            layer = this.sgworld.Creator.createModel(position, treeNode.urls, {
                id: treeNode.id,
                scale: treeNode.scale || 1,
                heading: treeNode.heading,
                pitch: treeNode.pitch,
                roll: treeNode.roll,
            }, '0', treeNode.name, '');
            break;
        case "SimpleGraphic":
            treeNode.type = treeNode.class;
            layer = this.sgworld.Creator.SimpleGraphic.addFeature(treeNode);
            break;
        case "videoPolygon":
            layer = this.sgworld.Creator.addVideoPolygon(treeNode.positions, {
                url: treeNode.url,
                angle: treeNode.angle,
            });
            break;
        case "videoBox":
            layer = this.sgworld.Creator.addVideoBox(treeNode.position, treeNode);
            break;
        case "video3D":
            layer = sgworld.Creator.Video3D(treeNode);
            break;
        case "MilitaryPlotting":
            if (!treeNode.feature.id) {
                treeNode.feature.id = treeNode.id
            }
            if (!treeNode.feature.name) {
                treeNode.feature.name = treeNode.name
            }
            layer = this.sgworld.Creator.MilitaryPlotting.addFeature(treeNode.feature);
            break;
        case "ParticleEffect":
            layer = sgworld.Analysis.createParticleEffect(
                treeNode.name,
                treeNode.position,
                {
                    translation: Cesium.Cartesian3.fromElements(0, 0, 0), //平移
                },
            );
            layer.name = treeNode.name;
            break;
        case "FlowField":
            layer = sgworld.Creator.createTrailLine(treeNode.positions, treeNode.style);
            layer.boundingSphere = Cesium.BoundingSphere.fromPoints(treeNode.positions);

            break;
        case "MobileWall":
            layer = sgworld.Creator.createTrailLineWall(treeNode.LineInterpolation.positions, treeNode.style);
            layer.boundingSphere = Cesium.BoundingSphere.fromPoints(treeNode.LineInterpolation.positions);
            break;
        case "link":
            layer = this.sgworld.Creator.createLinkPro(
                sgworld.Core.toDegrees(treeNode.positions[0]),
                sgworld.Core.toDegrees(treeNode.positions[1]),
                {
                    clampToGround: true
                }
            );
            break;
        case "effectCone":
            let scale = treeNode.radius / 50;
            // 特效圆-动态辐射波
            let circle = sgworld.Creator.addDRWEffectCircle({
                position: treeNode.position,
                radius: treeNode.radius,
                color: treeNode.color,
            });

            // 特效圆锥
            let cone = sgworld.Creator.addEffectCone({
                position: treeNode.position,
                color: treeNode.color,
                radius: 3 * scale,
                length: treeNode.length,
            });
            layer = [cone, circle];
            break;
        case 'effectCylinder':
            layer = sgworld.Creator.addEffectCylinder({
                position: treeNode.position,
                color: treeNode.color,
                radius: treeNode.radius,
                length: treeNode.length,
                multiple: treeNode.multiple,
                number: treeNode.number,
            });
            break;
        case 'rotateEffectCircle':
            layer = sgworld.Creator.addRotateEffectCircle({
                position: treeNode.position,
                radius: treeNode.radius,
            });
            break;
        case 'tetrahedrod':
            layer = sgworld.Creator.addTetrahedron({
                position: treeNode.position,
                multiple: treeNode.multiple,
                scale: new Cesium.Cartesian3(
                    treeNode.scale,
                    treeNode.scale,
                    treeNode.scale
                ),
            });
            break;
        case 'flyingLine':
            layer = sgworld.Creator.createFlyingLine(treeNode.positions, {
                time: treeNode.time,
                color: treeNode.color,
            });
            break;
        case "DiffusionSource":
            layer = sgworld.Analysis.createMultiCircleScan(
                treeNode.position,
                treeNode.maxRadius,
                treeNode.maxRadius.color,
                3000,
                true
            );
            break;
        case "RiskDiffusion":
        case "CircularDiffusion":
            layer = sgworld.Analysis.createCircleScan(
                treeNode.position,
                treeNode.maxRadius,
                treeNode.color,
                3000,
                true
            );
            break;
        case "FanDiffusion":
            layer = sgworld.Analysis.createSectorScan(
                treeNode.position,
                treeNode.distance,
                "#ff0000",
                60,
                treeNode.angle,
                true,
                4000,
                true
            );
            break;
        case "RadarMask":
            layer = sgworld.Creator.createRectangularSensor(
                treeNode.position,
                treeNode.cylinder
            );
            break;
        case "DynamicSatellite":
            let dtwxzsData = sgworld.Creator.createConeRadar(treeNode.position, {
                color: "#7b9ef7",
                radius: 200000,
            });
            let weixin = sgworld.Creator.createModel(
                treeNode.position,
                window.SmartEarthRootUrl + "Workers/Model/weixin.gltf",
                { scale: 15 },
                "0",
                "卫星"
            );
            layer = { dtwxzsData, weixin };
            layer.sourceType = "DynamicSatellite";
            break;
        case "excavate":
            layer = sgworld.Analysis.TerrainExcavation(
                treeNode.depth,
                { positions: treeNode.positions, showWall: treeNode.showWall }
            );
            break;
    }
    if (treeNode.sourceType !== "gltf" && (treeNode.lon || treeNode.lat)) {
        treeNode.flyTo = [
            treeNode.lon,
            treeNode.lat,
            this.sgworld.Core.defaultValue(treeNode.height, 1000),
        ];
    }
    if (treeNode.minx && treeNode.miny && treeNode.maxx && treeNode.maxy) {
        treeNode.flyTo = [
            treeNode.minx,
            treeNode.miny,
            treeNode.maxx,
            treeNode.maxy,
        ];
    }
    if (treeNode.sourceType === "ParticleEffect" && treeNode.location) {
        treeNode.flyTo = [
            treeNode.location.x,
            treeNode.location.y,
            this.sgworld.Core.defaultValue(treeNode.location.z, 200),
        ]
    }
    this.setData(treeNode.id, layer)
    return layer
}

/**
 * 获取加载的数据
 * 
 * @param {String} id 数据id
 * @requires {Object}
 */
TreeTool.prototype.getData = function (id) {
    return this.treeData.get(id)
}

/**
 * 添加的数据
 * 
 * @param {String} id 数据id
 * @requires {Object}
 */
TreeTool.prototype.setData = function (id, data) {
    this.treeData.set(id, data);
}

/**
 * 移除加载的数据
 * 
 * @param {String} id 数据id
 */
TreeTool.prototype.deleteData = function (id) {
    let layer;
    if (layer = window.Viewer.entities.getById(id)) {
        window.Viewer.entities.remove(layer);
    } else {
        layer = this.getData(id);
    }
    if (layer) {
        layer.deleteObject && layer.deleteObject();
        layer.destroy && layer.destroy();
        layer.item && layer.item.deleteObject && layer.item.deleteObject();
        layer.item && layer.item.destroy && layer.item.destroy();
        if (layer.sourceType === "DynamicSatellite") {
            let obj = layer.item || layer;
            obj.dtwxzsData.deleteObject();
            obj.weixin.deleteObject();
        }
        if (Array.isArray(layer)) {
            layer.forEach(item => {
                item.deleteObject && item.deleteObject();
            })
        }
    }
    this.treeData.delete(id)
}

/**
 * 控制数据的显示
 * 
 * @param {String} id 数据id
 * @param {Boolean} isShow 是否显示
 */
TreeTool.prototype.show = function (id, isShow) {
    let layer;
    if (layer = window.Viewer.entities.getById(id)) {
        layer.show = isShow;
        return;
    } else {
        layer = this.getData(id);
    }
    if (!layer) return;
    if (layer && layer.sourceType === "DynamicSatellite") {
        let obj = (layer.item || layer)
        obj.dtwxzsData.setVisibility(isShow);
        obj.weixin.setVisibility(isShow);
        return;
    }
    if (layer.item || layer) {
        let obj = (layer.item || layer)
        if (layer.name === "smog") {
            obj.Smog[0].show = isShow;
        } else if (layer.name === "flame") {
            obj.Flame[0].show = isShow;
        } else if (layer.name === "fountain") {
            obj.Fountain[0].show = isShow;
        } else if (layer.name === "fireworks") {
            obj.Fireworks.forEach(item => {
                item.show = isShow;
            });
        }
        obj.show !== undefined && (obj.show = isShow);
        obj.setVisibility && obj.setVisibility(isShow);
        layer.setVisibility && layer.setVisibility(isShow);
    }
    if (Array.isArray(layer)) {
        layer.forEach(item => {
            item.setVisibility && item.setVisibility(isShow);
        })
    }
    // layer && layer.setVisibility && layer.setVisibility(isShow)
}

TreeTool.prototype.flyTo = function (treeNode) {
    if (treeNode.children) return;

    if (treeNode._children && treeNode._children[0]) {
        this.flyTo(treeNode._children[0]);
    } else if (treeNode && treeNode.flyTo) {
        if (treeNode && (treeNode.flyTo.length === 3 || treeNode.flyTo.length === 2)) {
            this.sgworld.Navigate.flyToPosition(
                treeNode.flyTo[0],
                treeNode.flyTo[1],
                treeNode.flyTo[2] || 0
            );
        } else if (treeNode && treeNode.flyTo.length === 4) {
            this.sgworld.Navigate.flyToPointsInterest({
                destination: Cesium.Rectangle.fromDegrees(
                    treeNode.flyTo[0],
                    treeNode.flyTo[1],
                    treeNode.flyTo[2],
                    treeNode.flyTo[3]
                ),
            });
        } else {
            this.sgworld.Navigate.flyToPointsInterest({
                destination: Cesium.Cartesian3.fromDegrees(
                    treeNode.flyTo[0],
                    treeNode.flyTo[1],
                    treeNode.flyTo[2] || 0
                ),
                orientation: {
                    heading: Cesium.Math.toRadians(treeNode.flyTo[3] || 0),
                    pitch: Cesium.Math.toRadians(treeNode.flyTo[4] || -90),
                    roll: Cesium.Math.toRadians(treeNode.flyTo[5] || 0),
                },
            });
        }
        return;
    }

    let data = this.getData(treeNode.id);
    data && data.item
        ? this.sgworld.Navigate.flyToObj(data.item)
        : this.sgworld.Navigate.flyToObj(data);
}