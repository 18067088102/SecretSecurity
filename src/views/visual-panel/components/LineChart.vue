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
      default: "250px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Array,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData(v) {
      if (v) {
        this.$nextTick(() => {
          this.initChart();
          this.chart.resize();
        });
      }
    },
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
      let yArr1 = [];
      let yArr2 = [];
      if (this.chartData && this.chartData.length !== 0) {
        this.chartData.forEach((item) => {
          xArr.push(item.name);
          yArr1.push(item.lastMonthFaultCount);
          yArr2.push(item.thisMonthFaultCount);
        });
      }

      this.chart.setOption({
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          textStyle: {
            // 文字提示样式
            color: "#fff",
          },
          axisPointer: {
            lineStyle: {
              color: "#fff",
            },
          },
        },
        grid: {
          top: "8%",
          left: "13%",
          right: "8%",
          bottom: "15%",
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
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
              color: "#aad8ff",
              interval: 0,
              rotate: 20,
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            data: xArr,
          },
        ],
        yAxis: [
          {
            name: "",
            nameTextStyle: {
              color: "#fff",
              fontSize: 12,
              padding: [0, 60, 0, 0],
            },
            // minInterval: 1,
            type: "value",
            splitLine: {
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
              color: "#aad8ff",
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "上月故障",
            type: "line",
            symbol: "circle",
            smooth: true,
            lineStyle: {
              width: 1,
              color: "#00ffa2", // 线条颜色
            },
            showSymbol: false,
            itemStyle: {
              color: "#00f0ff", //拐点颜色
              label: {
                show: true, //开启显示
                color: "#fff",
                position: "top", //在上方显示
                formatter: function (res) {
                  if (res.value) {
                    return res.value;
                  } else {
                    return 0;
                  }
                },
              },
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  // 渐变颜色
                  {
                    offset: 0,
                    color: "rgba(36, 214, 214, 0.6)",
                  },
                  {
                    offset: 1,
                    color: "rgba(36, 214, 214, 0)",
                  },
                ],
                global: false,
              },
            },
            data: yArr1,
          },
          {
            name: "本月故障",
            type: "line",
            showSymbol: false,
            symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
            smooth: true,
            lineStyle: {
              width: 1,
              color: "#3D84F7", // 线条颜色
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  // 渐变颜色
                  {
                    offset: 0,
                    color: "rgba(61, 132, 247, 0.6)",
                  },
                  {
                    offset: 1,
                    color: "rgba(61, 132, 247, 0)",
                  },
                ],
                global: false,
              },
            },
            data: yArr2,
          },
        ],
      });
    },
  },
};
</script>
  