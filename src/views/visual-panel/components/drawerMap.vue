<template>
  <div id="sdkContainer"></div>
</template>

<script>
const baseURL = require("../../../../src/config.js").map_base_url;
export default {
  props: {
    //数据源
    datas: {
      type: Object,
    },
    //是否可编辑地图点位
    isEdit: {
      type: Boolean,
      default: true,
    },
    //建筑or设备
    isBuilding: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      billboard: null,
      pickFeature: null, //标红的建筑
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init3DMap();
    });
  },
  methods: {
    init3DMap() {
      //初始化地图
      window.sgworld = new SmartEarth.SGWorld("sdkContainer", {
        // url: SmartEarthRootUrl + "Workers/image/earth.jpg",
        licenseServer: "http://183.162.245.49:18080",
      });
      window.Viewer = sgworld._Viewer;
      sgworld.Navigate.Stop();
      sgworld.Navigate.jumpTo({
        destination: new Cesium.Cartesian3.fromDegrees(
          this.datas.longitude ? this.datas.longitude : 120.22909969986871,
          this.datas.latitude ? this.datas.latitude : 30.229914670211436,
          2000
        ),
      });

      //加载3d白膜模型
      this.load3dJZBM();

      //在地图中回显已存在的点位
      if (this.datas.longitude && this.datas.latitude) {
        if (this.isBuilding) {
          setTimeout(() => {
            let cartesian3 = Cesium.Cartesian3.fromDegrees(
              this.datas.longitude,
              this.datas.latitude,
              this.datas.height
            );
            let cartesian2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              Viewer.scene,
              cartesian3
            );
            this.pickFeature = Viewer.scene.pick(cartesian2);
            if (this.pickFeature && this.pickFeature.getProperty) {
              // 红色高亮
              this.pickFeature.color = Cesium.Color.RED;
            }
          }, 500);
        } else {
          this.createPoint(
            this.datas.longitude,
            this.datas.latitude,
            this.datas.height ? this.datas.height : 0
          );
        }
      }

      //编辑状态下鼠标选点
      if (this.isEdit) {
        let handler = new Cesium.ScreenSpaceEventHandler(Viewer.scene.canvas);
        handler.setInputAction((event) => {
          let p = sgworld.Navigate.getMouseDegrees(event);
          if (!this.isBuilding) {
            this.createPoint(p.lon, p.lat, p.height);
          }
          this.$emit("lngLat", p);

          if (this.isBuilding) {
            // 去除高亮
            this.pickFeature && (this.pickFeature.color = Cesium.Color.WHITE);
          }
          // 拾取对象
          this.pickFeature = Viewer.scene.pick(event.position);
          if (this.pickFeature && this.pickFeature.getProperty) {
            if (this.isBuilding) {
              // 红色高亮
              this.pickFeature.color = Cesium.Color.RED;
            }

            let names = this.pickFeature.getPropertyNames();
            names.forEach((name) => {
              if (name === "SYH") {
                let modelId = this.pickFeature.getProperty(name);
                console.log(modelId);
                this.getSemIdByModelId(modelId);
              }
            });
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
    },
    //加载3d白膜模型
    load3dJZBM() {
      var url1 = `${baseURL}/small-lotus-3dtiles/tileset.json`;
      var tiltModel1 = sgworld.Creator.create3DTilesets(
        "",
        url1,
        {},
        {},
        "0",
        true,
        (data) => {}
      );
      var url2 = `${baseURL}/north-3dtiles/tileset.json`;
      var tiltModel2 = sgworld.Creator.create3DTilesets(
        "",
        url2,
        {},
        {},
        "0",
        true,
        (data) => {}
      );
      var url3 = `${baseURL}/south-3dtiles/tileset.json`;
      var tiltModel3 = sgworld.Creator.create3DTilesets(
        "",
        url3,
        {},
        {},
        "0",
        true,
        (data) => {
          sgworld.Navigate.flyToObj(data);
        }
      );
    },
    //创建点位
    createPoint(lon, lat, height = 0) {
      if (this.billboard) {
        sgworld.Creator.DeleteObject(this.billboard);
      }
      this.billboard = sgworld.Creator.createBillboard({
        lon,
        lat,
        height,
        image: SmartEarthRootUrl + `Workers/image/mark.png`,
        scale: 0.7,
      });
    },
    getSemIdByModelId(modelId) {
      this.$emit("semId", modelId);
    },
  },
};
</script>