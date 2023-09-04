<template>
    <div>
        <div class="left-out"></div>
        <div class="tool-box flex-row">
            <div class="tool-btn cp" @click="onShowTool"></div>
            <div class="tool-select flex-row" v-if="showTool">
                <div class="point-btn cp" @click="createPoint"></div>
                <div class="line-btn cp" @click="createLine"></div>
                <div class="circle-btn cp" @click="createCircle"></div>
                <div class="polygon-btn cp" @click="createPolygon"></div>
            </div>
        </div>
    </div>
</template>

<script>
import bus from "@/utils/bus";
export default {
    data() {
        return {
            showTool: false,
        };
    },
    methods: {
        onShowTool() {
            this.showTool = !this.showTool;
        },
        searchBuilding(data) {
            bus.$emit("searchBuilding", data);
        },
        // 绘制工具
        createPoint() {
            this.showTool = false;
            sgworld.Creator.createSimpleGraphic("point", {}, (entity) => {
                let obj = sgworld.Creator.SimpleGraphic.getStyle(entity);
                let degrees = SmartEarth.Cartesian3_to_WGS84(obj.position);
                let coordinates = [];
                let dic = {
                    lng: degrees.lon,
                    lat: degrees.lat,
                };
                coordinates.push(dic);
                let data = {
                    id: obj.id,
                    type: 1,
                    coordinates,
                };
                this.searchBuilding(data);
            });
        },
        createLine() {
            this.showTool = false;
            sgworld.Creator.createSimpleGraphic("polyline", {}, (entity) => {
                let obj = sgworld.Creator.SimpleGraphic.getStyle(entity);
                let coordinates = [];
                obj.positions.forEach((item) => {
                    let degrees = SmartEarth.Cartesian3_to_WGS84(item);
                    let dic = {
                        lng: degrees.lon,
                        lat: degrees.lat,
                    };
                    coordinates.push(dic);
                });
                let data = {
                    id: obj.id,
                    type: 2,
                    coordinates,
                };
                this.searchBuilding(data);
            });
        },
        createCircle() {
            this.showTool = false;
            sgworld.Creator.createSimpleGraphic("circle", {}, (entity) => {
                let obj = sgworld.Creator.SimpleGraphic.getStyle(entity);
                let degrees = SmartEarth.Cartesian3_to_WGS84(obj.position);
                let coordinates = [];
                let dic = {
                    lng: degrees.lon,
                    lat: degrees.lat,
                };
                coordinates.push(dic);
                let data = {
                    id: obj.id,
                    type: 3,
                    coordinates,
                    radius: obj.radius,
                };
                this.searchBuilding(data);
            });
        },
        createPolygon() {
            this.showTool = false;
            sgworld.Creator.createSimpleGraphic("polygon", {}, (entity) => {
                let obj = sgworld.Creator.SimpleGraphic.getStyle(entity);
                let coordinates = [];
                obj.positions.forEach((item) => {
                    let degrees = SmartEarth.Cartesian3_to_WGS84(item);
                    let dic = {
                        lng: degrees.lon,
                        lat: degrees.lat,
                    };
                    coordinates.push(dic);
                });
                let data = {
                    id: obj.id,
                    type: 4,
                    coordinates,
                };
                this.searchBuilding(data);
            });
        },
    },
}
</script>

<style lang="scss" scoped>
.left-out {
    position: absolute;
    top: 161px;
    left: 409px;
    width: 174px;
    height: calc(100% - 316px);
    background: url("../../../assets/images/panel/left-out.png");
    background-size: 100% 100%;
}
.tool-box {
    position: absolute;
    top: 175px;
    left: 498px;
    .tool-btn {
        width: 50px;
        height: 36px;
        background: url("../../../assets/images/panel/tool-btn-c.png");
        background-size: 100% 100%;
        &:hover {
            background: url("../../../assets/images/panel/tool-btn-s.png");
            background-size: 100% 100%;
        }
    }
    .tool-select {
        width: 204px;
        height: 36px;
        background: url("../../../assets/images/panel/tool-select-bg.png");
        background-size: 100% 100%;
        padding: 0 25px 0 18px;
        .point-btn {
            width: 20px;
            height: 20px;
            background: url("../../../assets/images/panel/point-sel-c.png");
            background-size: 100% 100%;
            margin-right: 27px;
            &:hover {
                background: url("../../../assets/images/panel/point-sel-s.png");
                background-size: 100% 100%;
            }
        }
        .line-btn {
            width: 20px;
            height: 20px;
            background: url("../../../assets/images/panel/line-sel-c.png");
            background-size: 100% 100%;
            margin-right: 27px;
            &:hover {
                background: url("../../../assets/images/panel/line-sel-s.png");
                background-size: 100% 100%;
            }
        }
        .circle-btn {
            width: 20px;
            height: 20px;
            background: url("../../../assets/images/panel/circle-sel-c.png");
            background-size: 100% 100%;
            margin-right: 27px;
            &:hover {
                background: url("../../../assets/images/panel/circle-sel-s.png");
                background-size: 100% 100%;
            }
        }
        .polygon-btn {
            width: 20px;
            height: 20px;
            background: url("../../../assets/images/panel/polygon-sel-c.png");
            background-size: 100% 100%;
            &:hover {
                background: url("../../../assets/images/panel/polygon-sel-s.png");
                background-size: 100% 100%;
            }
        }
    }
}
</style>