
window.sgworldWFS = function () {
    function _(sgworld) {
        this.sgworld = sgworld
        this.colorTool = sgworld.Core.gradientColor()
    }

    _.prototype.CreateWfs = function (type, option) {
        let de = {};
        let color, outlineColor;
        if (type === "point") {
            if (!option.sgStyleJSON) {
                color = this.colorTool.colorRgb(
                    defaultValue(option.color, "#ffffff")
                );
                var bgColor = this.colorTool.colorRgb(
                    defaultValue(option.bgColor, "#010101")
                );
                de = {
                    label: {
                        text: {
                            defaultValue: defaultValue(option.text, "标签"),
                        },
                        scaleMPP: {
                            defaultValue: "15000",
                        },
                        fillColor: {
                            defaultValue: {
                                red: color[0] / 255,
                                green: color[1] / 255,
                                blue: color[2] / 255,
                                alpha: 1,
                            },
                        },
                        scaleByDistance: {
                            near: 150,
                            nearValue: 1,
                            far: 800000,
                            farValue: 0.5,
                        },
                        minViewingHeight: {
                            defaultValue: "0",
                        },
                        font: {
                            defaultValue: "12",
                        },
                        family: {
                            defaultValue: defaultValue(option.font, "Arial"),
                        },
                        backgroundColor: {
                            defaultValue: {
                                red: bgColor[0] / 255,
                                green: bgColor[1] / 255,
                                blue: bgColor[2] / 255,
                                alpha: 1,
                            },
                        },
                        scale: defaultValue(option.scale, 2),
                        backgroundOpacity: {
                            defaultValue: option.bgColor ? "0.5" : "0",
                        },
                        italic: {
                            defaultValue: option.italic ? "1" : "0",
                        },
                        bold: {
                            defaultValue: option.bold ? "1" : "0",
                        },
                        limitGrowth: {
                            defaultValue: "1",
                        },
                        textRelativeToImage: {
                            defaultValue: "0",
                        },
                        showText: {
                            defaultValue: "0",
                        },
                        textAlignment: {
                            defaultValue: "17",
                        },
                        pixelOffset: new Cesium.Cartesian2(
                            defaultValue(option.offsetX, 0),
                            defaultValue(option.offsetY, option.image ? -10 : 0)
                        ),
                        outlineColor: Cesium.Color.fromCssColorString(
                            defaultValue(option.outlineColor, "#ffffff")
                        ),
                        outlineWidth: defaultValue(option.outlineWidth, 2),
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        disableDepthTestDistance: option.disableDepthTestDistance
                    },
                    lineToGround: {
                        defaultValue: "0",
                    },
                    lineToGroundLength: {
                        defaultValue: "0",
                    },
                    lineToGroundColor: {
                        defaultValue: {
                            red: 1,
                            green: 1,
                            blue: 1,
                            alpha: 1,
                        },
                    },
                    altitudeMethod: 0,
                    altitudeOffset: {
                        defaultValue: "0",
                    },
                    clampToGround: defaultValue(option.clampToGround, false),
                    //"pointHeight": 100
                };
                if (option.outlineColor) {
                    de.label &&
                        (de.label.style = Cesium.LabelStyle.FILL_AND_OUTLINE);
                }
                if (option.image) {
                    de.billboard = {
                        image: option.image,
                        scale: defaultValue(option.imageScale, 1),
                        disableDepthTestDistance: option.disableDepthTestDistance,
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        link: option.link,
                    };
                }
            } else {
                de = getSGStyle(
                    "point",
                    option.sgStyleJSON,
                    option.name
                );
            }
        } else if (type === "polyline") {
            if (!option.sgStyleJSON) {
                color = this.colorTool.colorRgb(
                    defaultValue(option.color, "#ffff00")
                );
                de = {
                    polyline: {
                        material: {
                            red: color[0] / 255,
                            green: color[1] / 255,
                            blue: color[2] / 255,
                            alpha: 1,
                        },
                        lineOpacity: defaultValue(option.alpha, 1),
                        width: defaultValue(option.width, 4),
                        clampToGround: defaultValue(option.clampToGround, true),
                    },
                };
            } else {
                de = getSGStyle(
                    "polyline",
                    option.sgStyleJSON,
                    option.name
                );
            }
        } else if (type === "polygon") {
            if (!option.sgStyleJSON) {
                color = this.colorTool.colorRgb(
                    defaultValue(option.color, "#6bbeef")
                );
                outlineColor = this.colorTool.colorRgb(
                    defaultValue(option.outlineColor, "#ffffff")
                );
                de = {
                    polygon: {
                        outlineColor: {
                            defaultValue: {
                                red: outlineColor[0] / 255,
                                green: outlineColor[1] / 255,
                                blue: outlineColor[2] / 255,
                                alpha: 1,
                            },
                        },
                        outlineWidth: 1,
                        fill: {
                            defaultValue: defaultValue(option.alpha, 1),
                        },
                        extrudedHeight: option.extrudedHeight,
                        clampToGround: option.clampToGround,
                        water: option.water,
                        outline: defaultValue(option.outline, true),
                        material: {
                            defaultValue: {
                                red: color[0] / 255,
                                green: color[1] / 255,
                                blue: color[2] / 255,
                                alpha: defaultValue(option.alpha, 1),
                            },
                        },
                        fromKml: true,
                    },
                    altitudeMethod: 2,
                    altitudeOffset: {
                        defaultValue: "0",
                    },
                };
            } else {
                de = getSGStyle(
                    "polygon",
                    option.sgStyleJSON,
                    option.name
                );
            }
        }
        if (!de && option.sgStyleJSON) {
            console.log(option.name + "获取样式失败！");
            return;
        }
        if (de.position_x) {
            option.lon = de.position_x;
            option.lat = de.position_y;
            option.height = de.position_z;
        }
        return sgworld.CreateWfs(
            Viewer,
            defaultValue(option.urls, de.urls),
            defaultValue(option.layer, de.layer),
            {
                min: defaultValue(option.minimumLevel, de.minimumLevel || 0),
                max: defaultValue(option.maximumLevel, de.maximumLevel || 22),
            },
            de,
            defaultValue(option.layer, de.layer),
            option.pID || '0',
            option.checked,
            undefined
        );
    }

    //获取sg样式配置
    _.prototype.getSGStyle = function (type, json, name) {
        let de;

        //获取数据
        $.ajax({
            url: json,
            async: false,
            contentType: 'application/json',
            success: _data => {
                if (_data && typeof _data === "string") {
                    _data = JSON.parse(_data);
                }
                let style = _data.filter((item) => {
                    return item.LayerName === name;
                });
                if (type === "point") {
                    let data = style[0];
                    style = data.Point;
                    style.Line_Color = getSGColor(style.Line_Color);
                    style.Image_Color = getSGColor(style.Image_Color);
                    style.Text_Color = getSGColor(style.Text_Color);
                    style.Background_Color = getSGColor(style.Background_Color);

                    let color = this.colorTool.colorRgb(
                        defaultValue(style.Text_Color, "#ffffff")
                    );
                    let bgColor = this.colorTool.colorRgb(
                        defaultValue(style.Background_Color, "#010101")
                    );
                    de = {
                        label: {
                            text: {
                                defaultValue: defaultValue(
                                    style.Text.match(/<Value>(\S*)<\/Value>/)[1],
                                    style.Text.match(/<DefaultValue>(\S*)<\/DefaultValue>/)[1]
                                ),
                            },
                            scaleMPP: { defaultValue: style.Scale },
                            fillColor: {
                                defaultValue: {
                                    red: color[0] / 255,
                                    green: color[1] / 255,
                                    blue: color[2] / 255,
                                    alpha: 1,
                                },
                            },
                            scaleByDistance: {
                                near: 0,
                                nearValue: 1,
                                far: 800000000,
                                farValue: 1,
                            },
                            minViewingHeight: { defaultValue: "0" },
                            font: { defaultValue: style.Text_Size },
                            family: { defaultValue: defaultValue(style.Font, "Arial") },
                            backgroundColor: {
                                defaultValue: {
                                    red: bgColor[0] / 255,
                                    green: bgColor[1] / 255,
                                    blue: bgColor[2] / 255,
                                    alpha: 1,
                                },
                            },
                            scale: defaultValue(style.TextScale, 1.5),
                            backgroundOpacity: { defaultValue: style.Background_Opacity },
                            italic: { defaultValue: style.Italic },
                            bold: { defaultValue: style.Bold },
                            limitGrowth: { defaultValue: "1" },
                            textRelativeToImage: { defaultValue: "0" },
                            showText: { defaultValue: "0" },
                            textAlignment: { defaultValue: "17" },
                            pixelOffset: new Cesium.Cartesian2(
                                defaultValue(style.offsetX, 0),
                                defaultValue(style.offsetY, style.Image_file ? -10 : 0)
                            ),
                            outlineColor: Cesium.Color.fromCssColorString(
                                defaultValue(style.Line_Color, "#ffffff")
                            ),
                            outlineWidth: defaultValue(style.outlineWidth, 2),
                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        },
                        lineToGround: { defaultValue: style.Line_to_Ground },
                        lineToGroundLength: { defaultValue: style.Line_Length },
                        lineToGroundColor: {
                            defaultValue: { red: 1, green: 1, blue: 1, alpha: 1 },
                        },
                        altitudeMethod: 0,
                        altitudeOffset: { defaultValue: "0" },
                        clampToGround: defaultValue(style.clampToGround, true),
                        pointHeight: defaultValue(style.pointHeight, undefined),
                        minimumLevel: defaultValue(style.level_min, 0),
                        maximumLevel: defaultValue(style.level_max, 22),
                        position_x: data.position_x,
                        position_y: data.position_y,
                        position_z: data.position_z == 0 ? 10000 : data.position_z,
                        urls: data.Server,
                        layer: data.ServerName,
                    };
                    if (style.Line_Color) {
                        de.label && (de.label.style = Cesium.LabelStyle.FILL_AND_OUTLINE);
                    }
                    if (style.Image_file) {
                        de.billboard = {
                            image: style.Image_file,
                            scale: defaultValue(style.ImageScale, 1),
                            scaleMPP: { defaultValue: style.Scale },
                            scaleByDistance: {
                                near: 0,
                                nearValue: 1,
                                far: 800000000,
                                farValue: 1,
                            },
                            minViewingHeight: { defaultValue: "0" },
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        };
                    }
                } else if (type === "polyline") {
                    let data = style[0];
                    style = data.Line;
                    style.Line_Color = getSGColor(style.Line_Color);
                    if (style.Line_Width) {
                        if (style.Line_Width.length === 2) {
                            style.Line_Width /= 10;
                        } else if (style.Line_Width.length === 3) {
                            style.Line_Width /= 100;
                        }
                    }
                    let color = this.colorTool.colorRgb(
                        defaultValue(style.Line_Color, "#ff0000")
                    );
                    de = {
                        polyline: {
                            material: {
                                red: color[0] / 255,
                                green: color[1] / 255,
                                blue: color[2] / 255,
                                alpha: 1,
                            },
                            lineOpacity: parseInt(defaultValue(style.Line_Opacity, 1)),
                            width: parseInt(defaultValue(style.Line_Width, 4)),
                            near: style.Near,
                            far: style.Far,
                            clampToGround: defaultValue(style.clampToGround, true),
                        },
                        minimumLevel: defaultValue(style.level_min, 0),
                        maximumLevel: defaultValue(style.level_max, 22),
                        position_x: data.position_x,
                        position_y: data.position_y,
                        position_z: data.position_z == 0 ? 10000 : data.position_z,
                        urls: data.Server,
                        layer: data.ServerName,
                    };
                } else if (type === "polygon") {
                    let data = style[0];
                    style = data.data;

                    style.fill = Cesium.Color.fromCssColorString(style.fill);
                    style.outlineColor = Cesium.Color.fromCssColorString(
                        style.outlineColor
                    );
                    de = {
                        polygon: {
                            outlineColor: {
                                defaultValue: style.outlineColor,
                            },
                            outlineWidth: style.outlineWidth,
                            fill: { defaultValue: style.fill.alpha },
                            extrudedHeight: style.extrudedHeight || 0,
                            height: style.height,
                            outline: style.outline,
                            material: {
                                defaultValue: style.fill,
                            },
                            clampToGround: !style.extrudedHeight ? true : false,
                            fromKml: true,
                        },
                        altitudeMethod: 2,
                        altitudeOffset: { defaultValue: "0" },
                        minimumLevel: defaultValue(style.level_min, 0),
                        maximumLevel: defaultValue(style.level_max, 22),
                        position_x: data.position_x,
                        position_y: data.position_y,
                        position_z: data.position_z == 0 ? 10000 : data.position_z,
                        urls: data.Server,
                        layer: data.ServerName,
                    };
                }
            },
            error: () => {
                console.log("获取样式配置失败！");
            }
        })
        return de;
    }

    function defaultValue(a, b) {
        return a !== undefined ? a : b;
    }

    return _;
}()