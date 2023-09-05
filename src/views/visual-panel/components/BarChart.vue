<template>
  <div ref="chart" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "220px",
    },
    dataList: {
      type: Array,
    },
  },
  watch: {
    dataList(v) {
      if (v) {
        this.$nextTick(() => {
          this.initChart();
          this.chart.resize();
        });
      }
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.getInstanceByDom(this.$refs.chart);
      //如果为空 则正常进行渲染 反之 不再进行初始化 
      if (this.chart == null) {
        this.chart = echarts.init(this.$el, "macarons");
      }

      let xArr = [];
      let yArr = [];
      if (this.dataList && this.dataList.length !== 0) {
        this.dataList.forEach((item) => {
          xArr.push(item.name);
          yArr.push(item.alertCount);
        });
      }

      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          textStyle: {
            // 文字提示样式
            color: "#fff",
          },
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params) => {
            const item = params[1];
            return item.name + "：" + item.value;
          },
        },
        grid: {
          top: "20px",
          left: "0",
          right: "20px",
          bottom: "0",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: xArr,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              symbol: ["none", "triangle"],
              symbolOffset: 8,
              symbolSize: [10, 15],
              lineStyle: {
                color: "#0d90ff",
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#aad8ff",
              },
              interval: 0,
              rotate: 15,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              symbol: ["none", "triangle"],
              symbolOffset: 8,
              symbolSize: [10, 15],
              lineStyle: {
                color: "#0d90ff",
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#aad8ff",
              },
            },
          },
        ],
        series: [
          {
            name: "leftA",
            type: "bar",
            barWidth: yArr.length < 6 ? "10%" : "20%",
            data: yArr,
            animationDuration: 2600,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "#29CEFF" },
                  { offset: 1, color: "#25D2F1" },
                ],
              },
            },
          },
          {
            name: "rightA",
            type: "bar",
            barWidth: yArr.length < 6 ? "10%" : "20%",
            data: yArr,
            animationDuration: 2600,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "#54b9ff" },
                  { offset: 1, color: "#0663e9" },
                ],
              },
            },
            barGap: 0,
          },
          {
            name: "topA",
            type: "pictorialBar",
            // barWidth: yArr.length < 6 ? "10%" : "20%",
            data: yArr,
            animationDuration: 2600,
            itemStyle: {
              normal: {
                color: "#00a8ff",
              },
            },
            symbol: "diamond",
            symbolRotate: 0,
            symbolSize: ["25", "4"],
            symbolOffset: ["0", "-2"],
            symbolPosition: "end",
            data: yArr,
            z: 3,
          },
        ],
      });
    },
  },
};
</script>
