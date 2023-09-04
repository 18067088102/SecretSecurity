<template>
    <div class="gzrh flex-end">
        <!-- 设备实时告警 -->
        <div class="sbssgj-head"></div>
        <div class="sbssgj-table flex-column">
            <div class="table-head table-text flex-row">
                <span style="margin-left: 62px; width: 97px">设备类型</span>
                <span style="width: 165px">告警时间</span>
                <span style="width: 50px">操作</span>
            </div>
            <div class="table-box">
                <div :class="[
                    index === 0
                        ? 'alert-bg'
                        : (index + 1) % 2 === 0
                            ? 'bg2'
                            : 'bg1',
                ]" class="table-item table-text flex-row cp" v-for="(item, index) in ssgjs" :key="index">
                    <span :style="{
                        color: index === 0 ? '#FFC5C5' : 'rgba(212, 226, 255, 1)',
                    }" style="width: 47px; margin-left: 15px">{{ index + 1 < 10 ? "0" + (index + 1) : index + 1
}}</span>
                            <span :style="{
                                    color: index === 0 ? '#FFC5C5' : 'rgba(212, 226, 255, 1)',
                                }" style="width: 97px">{{ item.deviceTypeName }}</span>
                            <span :style="{
                                color: index === 0 ? '#FFC5C5' : 'rgba(212, 226, 255, 1)',
                            }" style="width: 165px">{{ item.alertTime }}</span>
                            <div class="row-center" style="width: 30px; height: 32px; margin-right: 20px"
                                @click="onShowAlert(item)">
                                <img style="width: 12px; height: 16px" :src="index === 0
                                    ? require('../../../assets/images/panel/alert-location.png')
                                    : require('../../../assets/images/panel/table-item-location.png')
                                    " alt="" />
                            </div>
                </div>
            </div>
        </div>
        <!-- 设备异常状态监测 -->
        <div class="sblx-head"></div>
        <div class="sblx-table flex-column">
            <div class="table-head table-text flex-row">
                <span style="margin-left: 62px; width: 97px">设备类型</span>
                <span style="width: 165px">异常内容</span>
                <span style="width: 50px">操作</span>
            </div>
            <div class="table-box">
                <div :class="[
                    index === 0
                        ? 'warning-bg'
                        : (index + 1) % 2 === 0
                            ? 'bg2'
                            : 'bg1',
                ]" class="table-item table-text flex-row cp" v-for="(item, index) in sbycs" :key="index">
                    <span :style="{
                        color: index === 0 ? '#FFE4B2' : 'rgba(212, 226, 255, 1)',
                    }" style="width: 47px; margin-left: 15px">{{ index + 1 < 10 ? "0" + (index + 1) : index + 1
}}</span>
                            <span :style="{
                                    color: index === 0 ? '#FFE4B2' : 'rgba(212, 226, 255, 1)',
                                }" style="width: 97px">{{ item.deviceTypeName }}</span>
                            <span class="max-w" :style="{
                                color: index === 0 ? '#FFE4B2' : 'rgba(212, 226, 255, 1)',
                            }" style="width: 165px" :title="item.content">{{ item.content }}</span>
                            <div class="row-center" style="width: 30px; height: 32px; margin-right: 20px"
                                @click="onShowFault(item)">
                                <img style="width: 12px; height: 16px" :src="index === 0
                                    ? require('../../../assets/images/panel/warning-location.png')
                                    : require('../../../assets/images/panel/table-item-location.png')
                                    " alt="" />
                            </div>
                </div>
            </div>
        </div>
        <!-- 设备故障概览 -->
        <div class="sbgz-head">
            <div class="flex-row cp" @click="onShowCharts">
                <img style="width: 18px; height: 11px" :src="showCharts
                    ? require('../../../assets/images/gzrh/right-arrow.png')
                    : require('../../../assets/images/gzrh/left-arrow.png')
                    " alt="" />
                <span class="detail-text" style="margin-left: 4px">{{
                    showCharts ? "收起" : "展开"
                }}</span>
            </div>
        </div>
        <div class="flex-row" style="margin-top: 12px">
            <div class="sbgz-bg flex-column">
                <span class="count-text">{{ totalFaultCount }}</span>
                <span class="title-text">故障总数</span>
            </div>
            <div class="sbgz-bg flex-column">
                <span class="count-text" style="color: #ff4e4f">{{
                    monthFaultCount
                }}</span>
                <span class="title-text">本月故障</span>
            </div>
            <div class="sbgz-bg flex-column">
                <span class="count-text" style="color: #03fffe">{{ growth }}</span>
                <span class="title-text">较上月</span>
            </div>
        </div>
        <div class="chart-box" :style="{
            width: showCharts ? (showChartsData.length * 425) / 6 + 'px' : '425px',
        }">
            <line-chart :chartData="showChartsData" />
        </div>
    </div>
</template>

<script>
import bus from "@/utils/bus";
import { mapGetters } from "vuex";
import LineChart from "../components/LineChart.vue";
import {
    getAlertList,
    getFaultDeviceList,
    getFaultStatistics,
} from "@/api/panel";
export default {
    components: {
        LineChart,
    },
    computed: {
        ...mapGetters(["socketMsg"]),
    },
    watch: {
        socketMsg: {
            handler() {
                this.getPageRequest();
            },
        },
    },
    data() {
        return {
            ssgjs: [],
            sbycs: [],
            classOption: {
                step: 0.4, // 数值越大速度滚动越快
                limitMoveNum: 6, // 开始无缝滚动的数据量 this.dataList.length
                hoverStop: true, // 是否开启鼠标悬停stop
                direction: 1, // 0向下 1向上 2向左 3向右
                openWatch: true, // 开启数据实时监控刷新dom
                singleHeight: 36, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
                singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
                waitTime: 1000,
            },
            growth: "0",
            monthFaultCount: 0,
            totalFaultCount: 0,
            chartData: [],
            showChartsData: [],
            showCharts: false,
        };
    },
    mounted() {
        this.getPageRequest();
    },
    methods: {
        getPageRequest() {
            this.getAlertList();
            this.getFaultDeviceList();
            this.getFaultStatistics();
        },
        getAlertList() {
            getAlertList({
                pageNum: 1,
                pageSize: 30,
            }).then((response) => {
                this.ssgjs = response.rows;
            });
        },
        getFaultDeviceList() {
            getFaultDeviceList({
                pageNum: 1,
                pageSize: 30,
            }).then((response) => {
                this.sbycs = response.rows;
            });
        },
        getFaultStatistics() {
            getFaultStatistics().then((response) => {
                this.growth = response.data.growth;
                this.monthFaultCount = response.data.monthFaultCount;
                this.totalFaultCount = response.data.totalFaultCount;
                this.chartData = response.data.typeList;
                this.showChartsData = this.chartData.slice(0, 6);
            });
        },
        onShowAlert(item) {
            bus.$emit("showAlert", item);
        },
        onShowFault(item) {
            bus.$emit("showFault", item);
        },
        onShowCharts() {
            this.showCharts = !this.showCharts;
            if (!this.showCharts) {
                this.showChartsData = this.chartData.slice(0, 6);
            } else {
                this.showChartsData = this.chartData;
            }
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
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  cursor: pointer;
}

.gzrh {
    .sbssgj-head {
        width: 405px;
        height: 34px;
        background: url("../../../assets/images/gzrh/sbssgj-head.png");
        background-size: 100% 100%;
        margin-right: 27px;
    }

    .sbssgj-table,
    .sblx-table {
        margin-top: 10px;
        margin-right: 27px;

        .table-head {
            width: 374px;
            height: 32px;
            background: url("../../../assets/images/panel/jqlbpm-table-head.png");
            background-size: 100% 100%;
        }

        .table-text {
            font-size: 14px;
            line-height: 15px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(212, 226, 255, 0.6);
        }

        .table-box {
            height: 180px;
            overflow: hidden;
            overflow-y: auto;

            &::-webkit-scrollbar {
                display: none;
            }

            .table-item {
                width: 374px;
                height: 32px;
                margin-top: 4px;

                &:hover {
                    background: url("../../../assets/images/panel/jqlbpm-item-hover.png");
                    background-size: 100% 100%;
                    color: rgba(212, 226, 255, 1);
                }

                .rank-box {
                    width: 41px;
                    height: 15px;
                    margin: 0 30px 0 11px;
                    font-size: 16px;
                    line-height: 16px;
                    font-family: YouSheBiaoTiHei;
                    font-weight: 400;
                    color: #dbe6fe;
                }
            }
        }

        .bg1 {
            background: url("../../../assets/images/panel/jqlbpm-item-bg1.png");
            background-size: 100% 100%;
        }

        .bg2 {
            background: url("../../../assets/images/panel/jqlbpm-item-bg2.png");
            background-size: 100% 100%;
        }

        .alert-bg {
            background: url("../../../assets/images/panel/alert-bg.png");
            background-size: 100% 100%;
        }

        .warning-bg {
            background: url("../../../assets/images/panel/warning-bg.png");
            background-size: 100% 100%;
        }
    }

    .sblx-head {
        width: 405px;
        height: 34px;
        background: url("../../../assets/images/gzrh/sblx-head.png");
        background-size: 100% 100%;
        margin-top: 15px;
        margin-right: 27px;
    }

    .sbgz-head {
        width: 405px;
        height: 34px;
        background: url("../../../assets/images/gzrh/sbgz-head.png");
        background-size: 100% 100%;
        margin-top: 15px;
        margin-right: 27px;
        padding-left: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        .detail-text {
            line-height: 14px;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #a0d8ff;
        }
    }

    .sbgz-bg {
        width: 99px;
        height: 64px;
        background: url("../../../assets/images/gzrh/sbgz-bg.png");
        background-size: 100% 100%;
        margin-right: 32px;

        .count-text {
            font-size: 18px;
            line-height: 18px;
            font-family: ZHCJJZT;
            font-weight: 800;
            color: #ffffff;
            margin: 8px 0 10px;
        }

        .title-text {
            line-height: 14px;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #adddff;
        }
    }

    .chart-box {
        // width: 425px;
        margin-top: 10px;
    }
}
</style>