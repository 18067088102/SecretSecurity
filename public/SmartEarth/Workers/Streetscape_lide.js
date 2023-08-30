class Streetscape {
    constructor(sgworld, option = {}) {
        this.sgworld = sgworld
        this.streetscape_alpha = option.alpha || 1;

        /**
         *
         *  街景服务参数
         *
         */
        this.streetSphere_data = {
            StreetUrl: option.StreetUrl,
            getImageRootUrl: option.StreetUrl + "/Image3DResourceService/GetImageTile/?ImageID=",
            getImageInfo: option.StreetUrl + '/Image3DResourceService/GetImageInfo/?ImageID=',
            getFirstImageDir: "&zoom=0",
            getSecondImageDir: "&zoom=4",
            lon: option.lon,
            lat: option.lat
        }
        this.setStreetScapeUrl()
        this.init()

    }

    //设置街景接口响应回调
    setStreetViewData(StreetViewData, datas) {
        StreetViewData.getImageTileID = datas.Station.StationID;
        StreetViewData.lon = datas.Station.X;
        StreetViewData.lat = datas.Station.Y;
        StreetViewData.height = datas.Station.H;
        StreetViewData.HeadingPitchRoll = {
            heading: datas.Station.Yaw,
            pitch: datas.Station.Pitch,
            roll: datas.Station.Roll,
        };
        this.getLinksData(StreetViewData)
    }

    // 立德街景前后数据
    getLinksData(StreetViewData) {
        this.sgworld.Core.xhr({
            url: this.StreetScapeOption.getInitImageSequenceById.replace('{id}', StreetViewData.getImageTileID) + '&Step=1',
            type: 'get',
            dataType: 'json',
            success: data => {
                this.setLinksData(0, data, StreetViewData, () => {
                    this.StreetView.createNavigation()
                })
            }
        })
        this.sgworld.Core.xhr({
            url: this.StreetScapeOption.getInitImageSequenceById.replace('{id}', StreetViewData.getImageTileID) + '&Step=-1',
            type: 'get',
            dataType: 'json',
            success: data => {
                this.setLinksData(-1, data, StreetViewData, () => {
                    this.StreetView.createNavigation()
                })
            }
        })
    }

    setLinksData(step, data, StreetViewData, callback) {
        let angle = StreetViewData.HeadingPitchRoll.heading + step * 180
        let links = []
        if (data.StationItems) {
            links = data.StationItems.filter(item => {
                return item.Station.StationID !== StreetViewData.getImageTileID
            })
        }
        let type = step === -1 ? 'prev' : 'next'
        if (links.length) {
            let link = links[0].Station
            StreetViewData.linkImagesData.push({
                type: type,
                name: link.Address,
                ImageID: link.StationID,
                NavigationAngle: angle,
                Position: [link.X, link.Y, link.H]
            });
            // callback && callback()
        } else {
            StreetViewData.linkImagesData.push({
                type: type,
                name: data.StationItems[0].Station.Address,
                NavigationAngle: angle
            });
        }
        callback && callback()
    }

    // 立德街景交叉口数据
    getJoinsData(StreetViewData, callback) {
        this.sgworld.Core.xhr({
            url: this.StreetScapeOption.getInitImageJointsById.replace('{id}', StreetViewData.getImageTileID),
            type: 'get',
            dataType: 'json',
            success: data => {
                if (data.Junction) {
                    this.pervJoinsID = StreetViewData.getImageTileID
                    callback && callback(data.Junction || [])
                } else {
                    this.sgworld.Core.xhr({
                        url: this.StreetScapeOption.getInitImageJointsById.replace('{id}', this.pervJoinsID),
                        type: 'get',
                        dataType: 'json',
                        success: data => {
                            if (data.Junction) {
                                callback && callback(data.Junction || [])
                            } else {
                                layer.msg(data.Message);
                            }
                        }
                    })
                }
            }
        })
    }

    selectJoinsCallBack() {
        this.getJoinsData(this.StreetView.StreetViewData, join => {
            let btn = []
            let linkImagesData = []
            let btnFun = {}
            join.forEach((item, index) => {
                btn.push(item.RoadName)
                let data = {
                    ImageID: item.StationID,
                    NavigationAngle: item.Angle - 180,
                    Position: [item.X, item.Y, item.H]
                }
                let btnFunEvent = (layerindex) => {
                    layer.close(layerindex);
                    this.getImageInfo(data.ImageID, () => {
                        this.StreetView.MoveToLinkImage(data)
                    })
                }

                if (!index) {
                    btnFun['yes'] = btnFunEvent
                } else {
                    btnFun['btn' + (index + 1)] = btnFunEvent
                }
                linkImagesData.push(data);
            })

            layer.msg('请选择道路', {
                time: 10000,
                btn: btn,
                ...btnFun
            });
        })
    }

    setImageDataCallback(StreetViewData, data) {
        if (data && data.Sizes) {
            let size = data.Sizes[0]
            let width = size.Width
            let height = size.Height
            StreetViewData.row = Math.ceil(height / 512)
            StreetViewData.col = Math.ceil(width / 512)
            StreetViewData.maxWidth = width
            StreetViewData.maxHeight = height
        }
    }

    getImageInfo(id, callback) {
        this.sgworld.Core.xhr({
            url: this.streetSphere_data.getImageInfo + id,
            type: 'get',
            dataType: 'json',
            success: data => {
                this.setImageDataCallback(this.StreetView.StreetViewData, data)
                callback && callback()
            }
        })
    }

    getImageDataByPosition(position, callback) {
        let url = this.StreetView.getInitImageByPositionURL(position)
        this.sgworld.Core.xhr({
            url: url,
            type: 'get',
            dataType: 'json',
            success: data => {
                callback && callback(data)
            }
        })
    }



    //设置街景接口
    setStreetScapeUrl() {
        this.StreetScapeOption = {
            type: 'lide',
            getInitImageByPosition: '/Image3DIndexService/GetStationByCoord/?x={lon}&tolerance=0%2E0005&type=4&y={lat}',
            getInitImageJointsById: '/Image3DIndexService/GetStationJoints/?direction=1&StationID={id}',
            getInitImageSequenceById: '/Image3DIndexService/GetStationSequence/?StationID={id}',
            getInitImageById: '',
            getSecondImageById: '',
            getInitImageByPositionCallBack: this.setStreetViewData.bind(this),
            getImageInfoByIdCallBack: this.setStreetViewData.bind(this),
            selectJoinsCallBack: this.selectJoinsCallBack.bind(this),
            setImageDataCallback: this.setImageDataCallback.bind(this)
        }
        this.StreetScapeOption.getInitImageByPosition = this.streetSphere_data.StreetUrl + this.StreetScapeOption.getInitImageByPosition;
        this.StreetScapeOption.getInitImageJointsById = this.streetSphere_data.StreetUrl + this.StreetScapeOption.getInitImageJointsById;
        this.StreetScapeOption.getInitImageSequenceById = this.streetSphere_data.StreetUrl + this.StreetScapeOption.getInitImageSequenceById;
        this.StreetScapeOption.getInitImageById = this.streetSphere_data.getImageRootUrl + '{id}' + this.streetSphere_data.getFirstImageDir;
        this.StreetScapeOption.getSecondImageById = this.streetSphere_data.getImageRootUrl + '{id}' + this.streetSphere_data.getSecondImageDir;
        this.StreetScapeOption.getImageInfo = this.streetSphere_data.getImageInfo;
    }

    init() {
        this.exit()
        this.StreetView = this.sgworld.Analysis.StreetViewOpen({
            lon: this.streetSphere_data.lon,
            lat: this.streetSphere_data.lat
        }, this.StreetScapeOption, () => {
            //创建滑动按钮
            this.createSlider();
            ///创建退出按钮
            this.createExitButton();
        });
        this.setOpacity(this.streetscape_alpha);
    }

    exit() {
        if (this.StreetView) {
            this.StreetView.exit();
            this.StreetView = null;
            this.sliderContainer && this.sliderContainer.remove();
            //移除退出按钮
            this.exitContainer && this.exitContainer.remove();
            this.sliderContainer = this.exitContainer = undefined
        }
    }

    //设置街景球透明度
    setOpacity(alpha) {
        this.streetscape_alpha = alpha
        if (this.StreetView) {
            this.StreetView.setOpacity(alpha);
        }
    }

    //创建透明度滑动条
    createSlider() {
        var div = '<div id="streetScapeSlider" style="position: absolute;top: 0;left: 0;z-index: 99;width:218px;margin: 45px 100px 10px;"><div id="opacity-streetScape"></div></div>';
        $(document.body).append(div);
        this.sliderContainer = $('#streetScapeSlider');
        layui.use('slider', () => {
            var slider = layui.slider;
            slider.render({
                elem: '#opacity-streetScape',
                theme: '#1E9FFF',
                min: 0 //最小值
                ,
                max: 100 //最大值
                ,
                value: this.streetscape_alpha * 100,
                change: (value) => {
                    this.setOpacity(value / 100);
                }
            });
        });
    }

    //创建退出按钮
    createExitButton() {
        let div = '<div id="streetScapeExitButton" style="position: absolute;top: 0;left: 0;z-index: 99;margin:20px;"><button type="button" class="layui-btn layui-btn-normal">退出</button></div>';
        $(document.body).append(div);
        this.exitContainer = $('#streetScapeExitButton');
        this.exitContainer.click(() => {
            this.exit()
        })
    }
}