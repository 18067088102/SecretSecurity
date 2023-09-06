<template>
    <div class="gzrh">
        <div class="sbgl-head"></div>
        <div class="sbgl-box flex-row">
            <div class="column-center" style="margin-left: 40px">
                <span class="top-text">设备数量</span>
                <div class="sbsl-bg column-center">
                    <span class="count-text bg1">{{ totalCount }}</span>
                </div>
            </div>
            <div class="column-center" style="margin-left: 40px">
                <span class="top-text">设备异常</span>
                <div class="sbyc-bg column-center">
                    <span class="count-text bg2">{{ faultCount }}</span>
                </div>
            </div>
            <div class="column-center" style="margin-left: 40px">
                <span class="top-text">设备预警</span>
                <div class="sbyj-bg column-center">
                    <span class="count-text bg3">{{ alertCount }}</span>
                </div>
            </div>
        </div>
        <div class="yj-box flex-column">
            <div class="yj-bg">
                <span class="head-text">物联传感预警</span>
            </div>
            <div class="flex-sb" style="width: 364px; margin: 15px 0 10px">
                <div class="flex-row">
                    <div class="point-box" style="margin-right: 8px"></div>
                    <span class="title-text">已处理：<span style="color: #22baf6">{{
                        wlcgDealtCount
                    }}</span></span>
                </div>
                <div class="flex-row">
                    <span class="title-text">未处理：<span style="color: #edac53">{{
                        wlcgUntreatedCount
                    }}</span></span>
                    <div class="point-box" style="background: #edac53; margin-left: 8px"></div>
                </div>
            </div>
            <div class="all-progress flex-row">
                <div class="ycl-progress" :style="{
                            width:
                                (wlcgDealtCount / (wlcgDealtCount + wlcgUntreatedCount)) *
                                364 +
                                'px',
                        }"></div>
                <div class="wcl-progress" :style="{
                    width:
                        (wlcgUntreatedCount / (wlcgDealtCount + wlcgUntreatedCount)) *
                        364 +
                        'px',
                }"></div>
            </div>
        </div>
        <div class="yj-box flex-column">
            <div class="yj-bg">
                <span class="head-text">特勤特种预警</span>
            </div>
            <div class="flex-sb" style="width: 364px; margin: 15px 0 10px">
                <div class="flex-row">
                    <div class="point-box" style="margin-right: 8px"></div>
                    <span class="title-text">已处理：<span style="color: #22baf6">{{
                        tqtzDealtCount
                    }}</span></span>
                </div>
                <div class="flex-row">
                    <span class="title-text">未处理：<span style="color: #edac53">{{
                        tqtzUntreatedCount
                    }}</span></span>
                    <div class="point-box" style="background: #edac53; margin-left: 8px"></div>
                </div>
            </div>
            <div class="all-progress flex-row">
                <div class="ycl-progress" :style="{
                            width:
                                (tqtzDealtCount / (tqtzDealtCount + tqtzUntreatedCount)) *
                                364 +
                                'px',
                        }"></div>
                <div class="wcl-progress" :style="{
                    width:
                        (tqtzUntreatedCount / (tqtzDealtCount + tqtzUntreatedCount)) *
                        364 +
                        'px',
                }"></div>
            </div>
        </div>
        <div class="gzsb-head"></div>
        <div class="gzsb-box1">
            <div class="gzsb-item" v-for="(item, index) in gzsbs" :key="index">
                <img style="width: 76px; height: 76px; margin-right: 5px" :src="item.img" alt="" />
                <div class="flex-column">
                    <div class="gzsb-bg">
                        <span class="name-text">{{ item.name }}</span>
                    </div>
                    <span class="count-text">{{ item.count }}</span>
                </div>
            </div>
        </div>
        <div class="flex-sb" style="padding: 0 114px 0 29px; margin-top: 15px">
            <span class="sbgjtj-text">设备告警统计</span>
            <div class="flex-row cp" @click="onShowCharts">
                <span class="detail-text">{{ showCharts ? "收起" : "展开" }}</span>
                <img style="
                width: 18px;
                height: 11px;
                margin-left: 4px;
                margin-right: -10px;
              " :src="showCharts
                  ? require('../../../assets/images/gzrh/left-arrow.png')
                  : require('../../../assets/images/gzrh/right-arrow.png')
                  " alt="" />
            </div>
        </div>
        <div class="warning-count" :style="{
            width: showCharts
                ? (showChartsData.length * 400) / 6 + 'px'
                : '400px',
        }">
            <bar-chart v-if="showChartsData.length !== 0" :dataList="showChartsData" />
        </div>
    </div>
</template>

<script>
import BarChart from "../components/BarChart.vue";
import { getDeviceStatistics } from "@/api/panel";
export default {
    components: {
        BarChart,
    },
    data() {
        return {
            totalCount: 0, //设备数量
            faultCount: 0, //设备异常
            alertCount: 0, //设备预警
            wlcgDealtCount: 0,
            wlcgUntreatedCount: 0,
            tqtzDealtCount: 0,
            tqtzUntreatedCount: 0,
            // 感知融合
            gzsbs: [
                {
                    img: require("../../../assets/images/gzrh/mckb.png"),
                    name: "门窗开闭",
                    count: 0,
                },
                {
                    img: require("../../../assets/images/gzrh/rtrq.png"),
                    name: "人体入侵",
                    count: 0,
                },
                {
                    img: require("../../../assets/images/gzrh/jg.png"),
                    name: "井盖",
                    count: 0,
                },
                {
                    img: require("../../../assets/images/gzrh/qtjc.png"),
                    name: "气体检测",
                    count: 0,
                },
                {
                    img: require("../../../assets/images/gzrh/hzyg.png"),
                    name: "火灾烟感",
                    count: 0,
                },
                {
                    img: require("../../../assets/images/gzrh/spjk.png"),
                    name: "视频监控",
                    count: 0,
                },
                {
                    img: require("../../../assets/images/gzrh/sjbj.png"),
                    name: "水浸报警",
                    count: 0,
                },
                {
                    img: require("../../../assets/images/gzrh/sos.png"),
                    name: "SOS报警",
                    count: 0,
                },
            ],
            showCharts: false,
            chartData: [],
            showChartsData: [],
        }
    },
    mounted() {
        this.getDeviceStatistics();
    },
    methods: {
        onShowCharts() {
            this.showCharts = !this.showCharts;
            if (!this.showCharts) {
                this.showChartsData = this.chartData.slice(0, 6);
            } else {
                this.showChartsData = this.chartData;
            }
        },
        // 查询设备统计
        getDeviceStatistics() {
            getDeviceStatistics({
                beginTime: "2023-05-29",
                endTime: "2023-06-29",
            }).then((response) => {
                this.totalCount = response.data.totalCount;
                this.faultCount = response.data.faultCount;
                this.alertCount = response.data.alertCount;
                response.data.categoryList.forEach((item, index) => {
                    if (index === 0) {
                        this.wlcgDealtCount = item.dealtCount;
                        this.wlcgUntreatedCount = item.untreatedCount;
                    } else {
                        this.tqtzDealtCount = item.dealtCount;
                        this.tqtzUntreatedCount = item.untreatedCount;
                    }
                });
                this.gzsbs.forEach((item, index) => {
                    this.$set(item, "name", response.data.typeList[index].name);
                    this.$set(item, "count", response.data.typeList[index].count);
                });
                this.chartData = response.data.typeList;
                this.showChartsData = this.chartData.slice(0, 6);
            });
        },
    },
}
</script>

<style lang="scss" scoped>
.gzrh {
    .sbgl-head {
        width: 405px;
        height: 37px;
        background: url("../../../assets/images/gzrh/sbgl-head.png");
        background-size: 100% 100%;
        margin-left: 30px;
    }

    .sbgl-box {
        margin-top: 20px;

        .top-text {
            font-size: 14px;
            line-height: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #e1e1e1;
            margin-bottom: 7px;
        }

        .count-text {
            margin-top: 4px;
            font-size: 22px;
            line-height: 22px;
            font-family: ZHCJJZT;
            font-weight: 800;
            color: #ffffff;
        }

        .bg1 {
            background: linear-gradient(180deg, #ffffff 40%, #14acf3 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .bg2 {
            background: linear-gradient(180deg, #ffffff 40%, #fd9929 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .bg3 {
            background: linear-gradient(180deg, #ffffff 40%, #ff4e4f 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .sbsl-bg {
            width: 94px;
            height: 107px;
            background: url("../../../assets/images/gzrh/sbsl-bg.png");
            background-size: 100% 100%;
        }

        .sbyc-bg {
            width: 94px;
            height: 107px;
            background: url("../../../assets/images/gzrh/sbyc-bg.png");
            background-size: 100% 100%;
        }

        .sbyj-bg {
            width: 94px;
            height: 107px;
            background: url("../../../assets/images/gzrh/sbyj-bg.png");
            background-size: 100% 100%;
        }
    }

    .yj-box {
        margin-top: 20px;
        margin-left: 30px;

        .yj-bg {
            width: 180px;
            height: 16px;
            background: url("../../../assets/images/gzrh/yj-bg.png");
            background-size: 100% 100%;
            padding-left: 12px;

            .head-text {
                font-size: 16px;
                line-height: 16px;
                font-family: PingFang SC;
                font-weight: 400;
                color: #ffffff;
                background: linear-gradient(to top, #fff 50%, #008aff 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        .point-box {
            width: 8px;
            height: 8px;
            background: #48ddfe;
            border-radius: 50%;
        }

        .title-text {
            line-height: 14px;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #ffffff;
        }

        .all-progress {
            width: 364px;
            height: 8px;
            background: rgba(8, 40, 74, 0.5);
            border-radius: 4px;

            .ycl-progress {
                width: 204px;
                height: 8px;
                background: linear-gradient(92deg, #48ddfe, #09a2f1);
                border-radius: 4px;
            }

            .wcl-progress {
                width: 160px;
                height: 8px;
                background: linear-gradient(92deg, #ead15b, #ee9c50);
                border-radius: 4px;
            }
        }
    }

    .gzsb-head {
        width: 405px;
        height: 37px;
        background: url("../../../assets/images/gzrh/gzsb-head.png");
        background-size: 100% 100%;
        margin-top: 20px;
        margin-left: 30px;
    }

    .gzsb-box1 {
        width: 100%;
        padding: 15px 117px 0 30px;
        display: flex;
        flex-wrap: wrap;
        height: 260px;
        overflow: hidden;
        overflow-y: auto;

        &::-webkit-scrollbar {
            display: none;
        }

        .gzsb-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 6px 0 10px 0;
            width: 153px;
            height: 63px;
            margin-bottom: 15px;

            &:nth-child(2n) {
                margin-left: 45px;
            }

            .gzsb-bg {
                width: 100px;
                height: 16px;
                background: url("../../../assets/images/gzrh/gzsb-bg.png");
                background-size: 100% 100%;
                padding-top: -8px;

                .name-text {
                    font-size: 14px;
                    line-height: 14px;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #fff;
                    background: linear-gradient(to top, #fff 50%, #008aff 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }

            .count-text {
                font-size: 18px;
                line-height: 18px;
                font-family: ZHCJJZT;
                font-weight: 800;
                color: #fff;
                margin-top: 20px;
            }
        }
    }

    .sbgjtj-text {
        font-size: 16px;
        line-height: 16px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #fff;
    }

    .detail-text {
        line-height: 14px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #a0d8ff;
    }

    .warning-count {
        margin-top: 10px;
        margin-left: 30px;
    }
}
</style>