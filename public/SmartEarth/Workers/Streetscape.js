class Streetscape {
    constructor(sgworld, option = {}) {
        this.sgworld = sgworld
        this.streetscape_alpha = option.alpha || 1;

        ///街景坐标系定义
        proj4.defs('EPSG:4528-40M', "+title=CGCS2000_40 +proj=tmerc +lat_0=0 +lon_0=120 +ellps=GRS80 +units=m +x_0=500000 +y_0=0 +k=1.0");
        proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");

        /**
         *
         *  街景服务参数
         *
         */
        this.streetSphere_data = {
            StreetUrl: option.StreetUrl,
            getImageRootUrl: option.StreetUrl + "/GetPanoTile?TileID=",
            getFirstImageDir: "-1-0-0-0",
            getSecondImageDir: "-1-3-",
            getThreeImageDir: "-1-4-",
            lon: option.lon,
            lat: option.lat
        }
        this.setStreetScapeUrl()
        this.init()
    }

    //设置街景接口响应回调
    setStreetViewData(StreetViewData, datas) {
        StreetViewData.getImageTileID = datas.GetPanoInfoResult.ImageInfo.ImageID;
        StreetViewData.lon = datas.GetPanoInfoResult.ImageInfo.L;
        StreetViewData.lat = datas.GetPanoInfoResult.ImageInfo.B;
        StreetViewData.height = datas.GetPanoInfoResult.ImageInfo.Z;
        StreetViewData.HeadingPitchRoll = {
            heading: datas.GetPanoInfoResult.ImageInfo.Yaw,
            pitch: datas.GetPanoInfoResult.ImageInfo.Pitch,
            roll: datas.GetPanoInfoResult.ImageInfo.Roll,
        };
        //链接图片的ImageID
        let links = datas.GetPanoInfoResult.Links;
        links.forEach(function (data) {
            var linkPosition = [];
            linkPosition = proj4('EPSG:4528-40M', 'EPSG:4490', [data.X, data.Y]);
            linkPosition.push(data.Z);
            StreetViewData.linkImagesData.push({
                ImageID: data.ImageID,
                NavigationAngle: data.Angle * 180 / Math.PI,
                Position: linkPosition
            });
        });
    }

    //设置街景接口
    setStreetScapeUrl() {
        this.StreetScapeOption = {
            getInitImageByPosition: '/GetPanoInfo?MethodType=2&ToleratePano=0&L=' + '{lon}' + '&f=json&ViewType=1&Type=0&B=' + '{lat}' + '&PanoID=-1&TolerateBL=0.002&TolerateFacade=200',
            getInitImageInfoById: '/GetPanoInfo?Type=0&TolerateFacade=200&ToleratePano=0&ViewType=1&MethodType=0&f=json&PanoID=' + '{id}',
            getInitImageById: '',
            getSecondImageById: '',
            getThirdImageById: '',
            getInitImageByPositionCallBack: this.setStreetViewData,
            getImageInfoByIdCallBack: this.setStreetViewData
        }
        this.StreetScapeOption.getInitImageByPosition = this.streetSphere_data.StreetUrl + this.StreetScapeOption.getInitImageByPosition;
        this.StreetScapeOption.getInitImageInfoById = this.streetSphere_data.StreetUrl + this.StreetScapeOption.getInitImageInfoById;
        this.StreetScapeOption.getInitImageById = this.streetSphere_data.getImageRootUrl + '{id}' + this.streetSphere_data.getFirstImageDir;
        this.StreetScapeOption.getSecondImageById = this.streetSphere_data.getImageRootUrl + '{id}' + this.streetSphere_data.getSecondImageDir;
        this.StreetScapeOption.getThirdImageById = this.streetSphere_data.getImageRootUrl + '{id}' + this.streetSphere_data.getThreeImageDir;
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