<template>
    <div>
        <!-- 日常防控 -->
        <div class="rcfk flex-end" v-if="!isAddYA">
            <div class="yaxx-head"></div>
            <div class="yaxx-box flex-column">
                <div class="top-box"></div>
                <div class="mid-box">
                    <div class="left-box flex-end">
                        <div class="flex-row">
                            <div class="text-box max-w">
                                预案地址：{{ currentYAInfo.address }}
                            </div>
                            <img class="yaxx-tip" src="../../../assets/images/panel/yaxx-tip.png" alt="" />
                        </div>
                        <div class="flex-row">
                            <div class="text-box max-w" style="width: 240px">
                                预案名称：{{ currentYAInfo.name }}
                            </div>
                            <img class="yaxx-tip" src="../../../assets/images/panel/yaxx-tip.png" alt="" />
                        </div>
                        <div class="flex-row">
                            <div class="text-box max-w" style="width: 230px">
                                预案类型：{{ currentYAInfo.typeName }}
                            </div>
                            <img class="yaxx-tip" src="../../../assets/images/panel/yaxx-tip.png" alt="" />
                        </div>
                        <div class="flex-row">
                            <div class="text-box max-w" style="width: 210px">
                                预案负责人：{{ currentYAInfo.directorName }}
                            </div>
                            <img class="yaxx-tip" src="../../../assets/images/panel/yaxx-tip.png" alt="" />
                        </div>
                        <div class="flex-row">
                            <div class="text-box max-w" style="width: 190px">
                                联系电话：{{ currentYAInfo.phone }}
                            </div>
                            <img class="yaxx-tip" src="../../../assets/images/panel/yaxx-tip.png" alt="" />
                        </div>
                    </div>
                    <div class="right-box"></div>
                </div>
                <div class="bottom-box"></div>
            </div>
            <div class="yabh-head"></div>
            <div class="yabh-tab-box flex-row">
                <div :class="[yabhTabIndex === 1 ? 'select-item-bg' : '']" class="tab-item" @click="yabhTabClick(1)">
                    点标绘
                </div>
                <div :class="[yabhTabIndex === 2 ? 'select-item-bg' : '']" class="tab-item" @click="yabhTabClick(2)">
                    线标绘
                </div>
                <div :class="[yabhTabIndex === 3 ? 'select-item-bg' : '']" class="tab-item" @click="yabhTabClick(3)">
                    面标绘
                </div>
                <div :class="[yabhTabIndex === 4 ? 'select-item-bg' : '']" class="tab-item" @click="yabhTabClick(4)">
                    体标绘
                </div>
                <div :class="[yabhTabIndex === 5 ? 'select-item-bg' : '']" class="tab-item" @click="yabhTabClick(5)">
                    警用标绘
                </div>
            </div>
            <div class="yabh-box row-center" style="width: 371px; height: 219px" v-if="yabhList.length === 0">
                <img style="width: 118px; height: 165px" src="../../../assets/images/panel/icon-empty.png" alt="" />
            </div>
            <div class="yabh-box" style="height: 219px" v-else>
                <div class="yabh-item flex-row" v-for="(item, index) in yabhList" :key="index">
                    <span class="item-text max-w" style="width: 226px">活动安保{{
                        yabhTabIndex === 1
                        ? "点"
                        : yabhTabIndex === 2
                            ? "线"
                            : yabhTabIndex === 3
                                ? item.type === "rectangle"
                                    ? "矩形"
                                    : item.type === "circle"
                                        ? "圆形"
                                        : "多边形"
                                : yabhTabIndex === 4
                                    ? "体"
                                    : "警用"
                    }}标绘</span>
                    <div class="ck-btn row-center" style="margin-left: 6px" @click="onShowYABH(true, item)">
                        查看
                    </div>
                    <!-- <div class="yc-btn row-center" @click="onShowYABH(false, item)">
              隐藏
            </div> -->
                </div>
            </div>
            <div class="cjxx-head"></div>
            <div class="yabh-tab-box flex-row">
                <div :class="[cjxxTabIndex === 1 ? 'select-item-bg' : '']" class="tab-item" @click="cjxxTabClick(1)">
                    路径漫游
                </div>
                <div :class="[cjxxTabIndex === 2 ? 'select-item-bg' : '']" class="tab-item" @click="cjxxTabClick(2)">
                    定点绕飞
                </div>
                <div :class="[cjxxTabIndex === 3 ? 'select-item-bg' : '']" class="tab-item" @click="cjxxTabClick(3)">
                    视角锁定
                </div>
            </div>
            <div class="yabh-box row-center" style="width: 371px; height: 219px" v-if="cjxxList.length === 0">
                <img style="width: 118px; height: 165px" src="../../../assets/images/panel/icon-empty.png" alt="" />
            </div>
            <div class="yabh-box" style="height: 219px" v-else>
                <div class="cjxx-item flex-row" v-for="(item, index) in cjxxList" :key="index">
                    <span class="item-text max-w">活动安保{{
                        cjxxTabIndex === 1
                        ? "路径漫游"
                        : cjxxTabIndex === 2
                            ? "定点绕飞"
                            : "视角锁定"
                    }}</span>
                    <div class="ck-btn row-center" @click="onShowCJXX(item)">查看</div>
                </div>
            </div>
        </div>
        <!-- 新增预案 -->
        <div class="rcfk flex-end" v-if="isAddYA">
            <div class="yabh-head"></div>
            <div class="yabh-tab-box flex-row">
                <div :class="[yabhTabIndex === 1 ? 'select-item-bg' : '']" class="tab-item" @click="yabhTabClick(1)">
                    点标绘
                </div>
                <div :class="[yabhTabIndex === 2 ? 'select-item-bg' : '']" class="tab-item" @click="yabhTabClick(2)">
                    线标绘
                </div>
                <div :class="[yabhTabIndex === 3 ? 'select-item-bg' : '']" class="tab-item" @click="yabhTabClick(3)">
                    面标绘
                </div>
                <div :class="[yabhTabIndex === 4 ? 'select-item-bg' : '']" class="tab-item" @click="yabhTabClick(4)">
                    体标绘
                </div>
                <div :class="[yabhTabIndex === 5 ? 'select-item-bg' : '']" class="tab-item" @click="yabhTabClick(5)">
                    警用标绘
                </div>
            </div>
            <div class="yabh-box row-center" style="width: 371px; height: 390px" v-if="yabhList.length === 0">
                <img style="width: 118px; height: 165px" src="../../../assets/images/panel/icon-empty.png" alt="" />
            </div>
            <div class="yabh-box" style="height: 390px" v-else>
                <div class="yabh-item flex-row" v-for="(item, index) in yabhList" :key="index">
                    <span class="item-text max-w">活动安保{{
                        yabhTabIndex === 1
                        ? "点"
                        : yabhTabIndex === 2
                            ? "线"
                            : yabhTabIndex === 3
                                ? item.type === "rectangle"
                                    ? "矩形"
                                    : item.type === "circle"
                                        ? "圆形"
                                        : "多边形"
                                : yabhTabIndex === 4
                                    ? "体"
                                    : "警用"
                    }}标绘</span>
                    <div class="ck-btn row-center" style="margin-right: 6px" @click="onViewAddYABH(item)">
                        查看
                    </div>
                    <div class="yc-btn row-center" @click="onDelAddYABH(item, index)">
                        删除
                    </div>
                </div>
            </div>
            <div class="cjxx-head"></div>
            <div class="yabh-tab-box flex-row">
                <div :class="[cjxxTabIndex === 1 ? 'select-item-bg' : '']" class="tab-item" @click="cjxxTabClick(1)">
                    路径漫游
                </div>
                <div :class="[cjxxTabIndex === 2 ? 'select-item-bg' : '']" class="tab-item" @click="cjxxTabClick(2)">
                    定点绕飞
                </div>
                <div :class="[cjxxTabIndex === 3 ? 'select-item-bg' : '']" class="tab-item" @click="cjxxTabClick(3)">
                    视角锁定
                </div>
            </div>
            <div class="yabh-box row-center" style="width: 371px; height: 317px" v-if="cjxxList.length === 0">
                <img style="width: 118px; height: 165px" src="../../../assets/images/panel/icon-empty.png" alt="" />
            </div>
            <div class="yabh-box" style="height: 317px" v-else>
                <div class="cjxx-item flex-row" v-for="(item, index) in cjxxList" :key="index">
                    <span class="item-text max-w" style="width: 172px">活动安保{{
                        cjxxTabIndex === 1
                        ? "路径漫游"
                        : cjxxTabIndex === 2
                            ? "定点绕飞"
                            : "视角锁定"
                    }}</span>
                    <div class="ck-btn row-center" style="margin-right: 6px" @click="onShowCJXX(item)">
                        查看
                    </div>
                    <div class="yc-btn row-center" @click="onDelAddCJXX(item, index)">
                        删除
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import bus from "@/utils/bus";
export default {
    data() {
        return {
            yabhTabIndex: 1, //1：点标绘
            yabhList: [],
            cjxxTabIndex: 1, //1：路径漫游
            cjxxList: [],
            isAddYA: false,
            currentYAInfo: {},
            dbhList: [],
            xbhList: [],
            mbhList: [],
            tbhList: [],
            jybhList: [],
            xlmyList: [],
            ddrfList: [],
            sjsdList: [],
        }
    },
    mounted() {
        bus.$on("isAddYA", (isAddYA) => {
            this.isAddYA = isAddYA;
            localStorage.setItem("dbhList", JSON.stringify([]));
            localStorage.setItem("xbhList", JSON.stringify([]));
            localStorage.setItem("mbhList", JSON.stringify([]));
            localStorage.setItem("tbhList", JSON.stringify([]));
            localStorage.setItem("jybhList", JSON.stringify([]));
            localStorage.setItem("xlmyList", JSON.stringify([]));
            localStorage.setItem("ddrfList", JSON.stringify([]));
            localStorage.setItem("sjsdList", JSON.stringify([]));
            this.yabhList = [];
            this.cjxxList = [];
            this.yabhTabIndex = 1;
            this.cjxxTabIndex = 1;
        });
        bus.$on("yabhTabIndex", (idx) => {
            this.yabhTabIndex = idx;
            if (this.yabhTabIndex === 1) {
                this.yabhList = JSON.parse(localStorage.getItem("dbhList"));
            } else if (this.yabhTabIndex === 2) {
                this.yabhList = JSON.parse(localStorage.getItem("xbhList"));
            } else if (this.yabhTabIndex === 3) {
                this.yabhList = JSON.parse(localStorage.getItem("mbhList"));
            } else if (this.yabhTabIndex === 4) {
                this.yabhList = JSON.parse(localStorage.getItem("tbhList"));
            } else if (this.yabhTabIndex === 5) {
                this.yabhList = JSON.parse(localStorage.getItem("jybhList"));
            }
        });
        bus.$on("cjxxTabIndex", (idx) => {
            this.cjxxTabIndex = idx;
            if (this.cjxxTabIndex === 1) {
                this.cjxxList = JSON.parse(localStorage.getItem("xlmyList"));
            } else if (this.cjxxTabIndex === 2) {
                this.cjxxList = JSON.parse(localStorage.getItem("ddrfList"));
            }
        });
        bus.$on("updateCurrentYAInfo", (info) => {
            this.currentYAInfo = info;
            this.yabhTabIndex = 1;
            this.cjxxTabIndex = 1;
            if (this.currentYAInfo.plotInfo) {
                let arr = JSON.parse(this.currentYAInfo.plotInfo);
                arr.forEach((item) => {
                    if (item.type === "1") {
                        this.dbhList = item.list;
                        localStorage.setItem("dbhList", JSON.stringify(this.dbhList));
                        this.yabhList = this.dbhList;
                    }
                    if (item.type === "2") {
                        this.xbhList = item.list;
                        localStorage.setItem("xbhList", JSON.stringify(this.xbhList));
                    }
                    if (item.type === "3") {
                        this.mbhList = item.list;
                        localStorage.setItem("mbhList", JSON.stringify(this.mbhList));
                    }
                    if (item.type === "4") {
                        this.tbhList = item.list;
                        localStorage.setItem("tbhList", JSON.stringify(this.tbhList));
                    }
                    if (item.type === "5") {
                        this.jybhList = item.list;
                        localStorage.setItem("jybhList", JSON.stringify(this.jybhList));
                    }
                    if (item.type === "10") {
                        this.xlmyList = item.list;
                        localStorage.setItem("xlmyList", JSON.stringify(this.xlmyList));
                        this.cjxxList = this.xlmyList;
                    }
                    if (item.type === "11") {
                        this.ddrfList = item.list;
                        localStorage.setItem("ddrfList", JSON.stringify(this.ddrfList));
                    }
                    if (item.type === "12") {
                        this.sjsdList = item.list;
                        localStorage.setItem("sjsdList", JSON.stringify(this.sjsdList));
                    }
                });
            }
        });
    },
    methods: {
        onShowYABH(isBool, item) {
            this.$set(item, "idx", this.yabhTabIndex);
            this.$set(item, "bool", isBool);
            sgworld.Navigate.setPosition(
                item.coordinates[0].lon,
                item.coordinates[0].lat,
                8000
            );
        },
        onViewAddYABH(item) {
            sgworld.Navigate.setPosition(
                item.coordinates[0].lon,
                item.coordinates[0].lat,
                8000
            );
        },
        onDelAddYABH(item, index) {
            Viewer.entities.removeById(item.id);
            bus.$emit("clearLonLat", item);
            if (this.yabhTabIndex === 1) {
                let arr = JSON.parse(localStorage.getItem("dbhList"));
                arr.splice(index, 1);
                localStorage.setItem("dbhList", JSON.stringify(arr));
                this.yabhList = arr;
            } else if (this.yabhTabIndex === 2) {
                let arr = JSON.parse(localStorage.getItem("xbhList"));
                arr.splice(index, 1);
                localStorage.setItem("xbhList", JSON.stringify(arr));
                this.yabhList = arr;
            } else if (this.yabhTabIndex === 3) {
                let arr = JSON.parse(localStorage.getItem("mbhList"));
                arr.splice(index, 1);
                localStorage.setItem("mbhList", JSON.stringify(arr));
                this.yabhList = arr;
            } else if (this.yabhTabIndex === 4) {
                let arr = JSON.parse(localStorage.getItem("tbhList"));
                arr.splice(index, 1);
                localStorage.setItem("tbhList", JSON.stringify(arr));
                this.yabhList = arr;
            } else if (this.yabhTabIndex === 5) {
                let arr = JSON.parse(localStorage.getItem("jybhList"));
                arr.splice(index, 1);
                localStorage.setItem("jybhList", JSON.stringify(arr));
                this.yabhList = arr;
            }
        },
        onDelAddCJXX(item, index) {
            if (this.cjxxTabIndex === 1) {
                let arr = JSON.parse(localStorage.getItem("xlmyList"));
                arr.splice(index, 1);
                localStorage.setItem("xlmyList", JSON.stringify(arr));
                this.cjxxList = arr;
            } else if (this.cjxxTabIndex === 2) {
                let arr = JSON.parse(localStorage.getItem("ddrfList"));
                arr.splice(index, 1);
                localStorage.setItem("ddrfList", JSON.stringify(arr));
                this.cjxxList = arr;
            }
            // this.$emit("delAddCJXX", item);
        },
        yabhTabClick(idx) {
            this.yabhTabIndex = idx;
            switch (idx) {
                case 1:
                    this.yabhList = !this.isAddYA
                        ? this.dbhList
                        : JSON.parse(localStorage.getItem("dbhList"));
                    break;
                case 2:
                    this.yabhList = !this.isAddYA
                        ? this.xbhList
                        : JSON.parse(localStorage.getItem("xbhList"));
                    break;
                case 3:
                    this.yabhList = !this.isAddYA
                        ? this.mbhList
                        : JSON.parse(localStorage.getItem("mbhList"));
                    break;
                case 4:
                    this.yabhList = !this.isAddYA
                        ? this.tbhList
                        : JSON.parse(localStorage.getItem("tbhList"));
                    break;
                case 5:
                    this.yabhList = !this.isAddYA
                        ? this.jybhList
                        : JSON.parse(localStorage.getItem("jybhList"));
                    break;

                default:
                    break;
            }
        },
        cjxxTabClick(idx) {
            this.cjxxTabIndex = idx;
            switch (idx) {
                case 1:
                    this.cjxxList = !this.isAddYA
                        ? this.xlmyList
                        : JSON.parse(localStorage.getItem("xlmyList"));
                    break;
                case 2:
                    this.cjxxList = !this.isAddYA
                        ? this.ddrfList
                        : JSON.parse(localStorage.getItem("ddrfList"));
                    break;
                case 3:
                    this.cjxxList = !this.isAddYA
                        ? this.sjsdList
                        : JSON.parse(localStorage.getItem("sjsdList"));
                    break;

                default:
                    break;
            }
        },
        //展示场景信息
        onShowCJXX(item) {
            this.$set(item, "idx", this.cjxxTabIndex);
            sgworld.Navigate.setPosition(117.44917791230931, 31.87409363277426, 2000);
            switch (item.idx) {
                case 1:
                    let degreesArr = [];
                    item.geojson.geometry.coordinates.forEach((ele) => {
                        degreesArr.push(...ele);
                    });
                    // console.log(degreesArr);
                    sgworld.Creator.getFlyData(degreesArr, (data) => {
                        data.showPoint = false;
                        data.showLine = true;
                        data.speed = 5;
                        data.height = item.height;
                        data.mode = 1;
                        window.PathAnimationData = {
                            flyData: data,
                        };
                        window.PathAnimationData.winIndex = layer.open({
                            type: 2,
                            title: "路径动画",
                            shade: false,
                            area: ["352px", "690px"],
                            offset: "r",
                            skin: "other-class",
                            content: SmartEarthRootUrl + "Workers/path/Path.html",
                            success: (layero, index) => {
                                let iframeWin = window[layero.find('iframe')[0]['name']];
                                this.timer = setInterval(() => {
                                    let totalLenText = iframeWin.document.getElementById('totalLen').innerText;
                                    let traveledText = iframeWin.document.getElementById('distanceTraveled').innerText;
                                    let totalLen = totalLenText.indexOf('千米') !== -1 ? parseFloat(totalLenText.split('千米')[0]) * 1000 : parseFloat(totalLenText.split('米')[0]);
                                    let traveled = traveledText.indexOf('千米') !== -1 ? parseFloat(traveledText.split('千米')[0]) * 1000 : parseFloat(traveledText.split('米')[0]);
                                    // console.log("totalLen===" + totalLen, "traveled===" + traveled);
                                    if (traveled === totalLen) {
                                        //已漫游全程结束
                                        clearInterval(this.timer);
                                    }
                                    if (traveled !== this.distanceTraveled) {
                                        this.distanceTraveled = traveled;
                                        this.imLon = parseFloat(iframeWin.document.getElementById('jd').innerText.split('°')[0]).toFixed(7);
                                        this.imLat = parseFloat(iframeWin.document.getElementById('wd').innerText.split('°')[0]).toFixed(7);
                                        //拿到实时变化的经纬度去做操作 do something
                                        for (let i = 0; i < this.videoList.length; i++) {
                                            let item = this.videoList[i];
                                            let dis = this.getDistance(this.imLat, this.imLon, item.latitude, item.longitude);
                                            // console.log("dis---" + dis);
                                            if (dis <= 20) {
                                                //20米范围内点位视频
                                                this.getVideoDeviceInfo(item.id);
                                            }
                                        }
                                    }
                                    // console.log("imLon===" + this.imLon, "imLat===" + this.imLat);
                                }, 1000);
                            },
                            end: () => {
                                clearInterval(this.timer);
                                PathAnimationData.fly && PathAnimationData.fly.exit();
                            },
                        });
                    });
                    break;
                case 2:
                    sgworld.Analysis.setPointFly({
                        time: 8,
                        position: Cesium.Cartesian3.fromDegrees(
                            item.lon,
                            item.lat,
                            item.height
                        ),
                        limitTime: true,
                    });
                    break;

                default:
                    break;
            }
        },
        getDistance(lat1, lon1, lat2, lon2) {
            let radLat1 = (lat1 * Math.PI) / 180; //将角度换算为弧度
            let radLat2 = (lat2 * Math.PI) / 180; //将角度换算为弧度
            let a = radLat1 - radLat2;
            let b = (lon1 * Math.PI) / 180 - (lon2 * Math.PI) / 180;
            let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
            s = s * 6378137.0; // 取WGS84标准参考椭球中的地球长半径(单位:m)
            //s = Math.round(s * 10000) / 10000; //两点之间距离(保留四位)
            return Math.round(s); //(单位:m)
        },
    },
}
</script>

<style lang="scss" scoped>
.flex-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.max-w {
  width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  cursor: pointer;
}
.rcfk {
    .yaxx-head {
        width: 406px;
        height: 34px;
        background: url("../../../assets/images/panel/yaxx-head.png");
        background-size: 100% 100%;
        margin-right: 25px;
    }

    .yaxx-box {
        .top-box {
            margin-top: 4px;
            margin-right: 169px;
            width: 323px;
            height: 13px;
            background: url("../../../assets/images/panel/yaxx-top-bg.png");
            background-size: 100% 100%;
        }

        .mid-box {
            display: flex;
            flex-direction: row;

            .left-box {
                margin-top: 3px;
                margin-right: 1px;
                width: 296px;
                height: 168px;
                background: url("../../../assets/images/panel/yaxx-left-bg.png");
                background-size: 100% 100%;

                .text-box {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-end;
                    width: 264px;
                    height: 33px;
                    border-bottom: 1px dashed rgba(0, 149, 254, 0.4);
                    font-size: 14px;
                    line-height: 14px;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #b2d0ff;
                }
            }

            .right-box {
                margin-right: 21px;
                width: 155px;
                height: 182px;
                background: url("../../../assets/images/panel/yaxx-right-bg.png");
                background-size: 100% 100%;
            }

            .yaxx-tip {
                width: 8px;
                height: 8px;
                margin-left: 10px;
                margin-right: 6px;
            }
        }

        .bottom-box {
            margin-top: -7px;
            margin-right: 155px;
            width: 253px;
            height: 13px;
            background: url("../../../assets/images/panel/yaxx-bottom-bg.png");
            background-size: 100% 100%;
        }
    }

    .yabh-head {
        width: 406px;
        height: 34px;
        background: url("../../../assets/images/panel/yabh-head.png");
        background-size: 100% 100%;
        margin-top: 11px;
        margin-right: 25px;
    }

    .yabh-tab-box {
        margin-top: 10px;
        margin-right: 25px;
        width: 383px;
        height: 34px;
        background: url("../../../assets/images/panel/yabh-tab-bg.png");
        background-size: 100% 100%;

        .tab-item {
            padding: 8px 13px;
            font-size: 14px;
            line-height: 15px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #b2d0ff;
            cursor: pointer;
        }

        .select-item-bg {
            padding: 14px 20px;
            background: url("../../../assets/images/panel/select-item-bg.png");
            background-size: 100% 100%;
        }
    }

    .yabh-box {
        margin-top: 10px;
        margin-right: 27px;
        overflow: hidden;
        overflow-y: auto;

        &::-webkit-scrollbar {
            display: none;
        }

        .yabh-item {
            width: 371px;
            height: 73px;
            background: url("../../../assets/images/panel/yabh-item.png");
            background-size: 100% 100%;
            font-size: 16px;
            line-height: 16px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #b2d0ff;

            &:hover {
                color: #fff;
                width: 370px;
                height: 72px;
                background: url("../../../assets/images/panel/yabh-item-hover.png");
            }

            .item-text {
                margin-left: 71px;
                width: 172px;
            }
        }

        .cjxx-item {
            width: 371px;
            height: 73px;
            background: url("../../../assets/images/panel/cjxx-item.png");
            background-size: 100% 100%;
            font-size: 16px;
            line-height: 16px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #b2d0ff;

            &:hover {
                color: #fff;
                width: 370px;
                height: 72px;
                background: url("../../../assets/images/panel/cjxx-item-hover.png");
            }

            .item-text {
                margin-left: 72px;
                width: 208px;
            }
        }

        .ck-btn,
        .yc-btn {
            width: 54px;
            height: 30px;
            background: url("../../../assets/images/panel/ck-btn-bg.png");
            background-size: 100% 100%;
            font-size: 14px;
            line-height: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #b2d0ff;
            cursor: pointer;

            &:hover {
                color: #d4e2ff;
                background: url("../../../assets/images/panel/ck-btn-hover-bg.png");
            }
        }
    }

    .cjxx-head {
        width: 406px;
        height: 31px;
        background: url("../../../assets/images/panel/cjxx-head.png");
        background-size: 100% 100%;
        margin-top: 16px;
        margin-right: 25px;
    }
}
</style>