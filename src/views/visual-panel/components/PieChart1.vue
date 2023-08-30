<template>
  <div :class="className" :style="{ height: height, width: width }" />
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
      default: "226px",
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
      this.chart = echarts.init(this.$el, "macarons");

      const chartData = [
        {
          value: 2,
          name: "民警",
        },
        {
          value: 1,
          name: "辅警",
        },
        {
          value: 1,
          name: "警车",
        },
        {
          value: 1,
          name: "PTU",
        },
        {
          value: 1,
          name: "无人机",
        },
        {
          value: 1,
          name: "机器人",
        },
      ];
      const colorList = [
        "#0061ff",
        "#0d9bff",
        "#74e6ff",
        "#1ebbbd",
        "#e7c72f",
        "#e3a91c",
      ];
      const sum = chartData.reduce((per, cur) => per + cur.value, 0);
      const gap = (1 * sum) / 100;
      const pieData1 = [];
      const pieData2 = [];
      const gapData = {
        name: "",
        value: gap,
        itemStyle: {
          color: "transparent",
        },
      };

      //图标位置显示
      let lefts = ["4%", "4%", "4%", "80%", "80%", "80%"];
      let tops = ["24%", "37%", "55%", "24%", "37%", "55%"];
      let legendData = [];
      let total = 0;
      chartData.forEach((item) => {
        total += item.value;
      });

      for (let i = 0; i < chartData.length; i++) {
        // 第一圈数据
        pieData1.push({
          ...chartData[i],
          itemStyle: {
            borderRadius: 20,
          },
        });
        pieData1.push(gapData);

        // 第二圈数据
        pieData2.push({
          ...chartData[i],
          itemStyle: {
            color: colorList[i],
            opacity: 0.21,
          },
        });
        pieData2.push(gapData);

        //  分散图例
        let bfb = parseInt((chartData[i].value / total) * 100) + "%";
        legendData.push({
          show: true,
          icon: "circle", //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
          left: lefts[i],
          top: tops[i],
          // itemWidth: '10px',
          // itemHeight:'10px',
          itemStyle: {
            color: colorList[i],
          },
          formatter:
            `{aa| ` + chartData[i].name + ` }` + `\n\n` + `{bb| ` + bfb + `}`, // 也可以是个函数return
          x: "left",
          textStyle: {
            // color: "#BAFF7F",
            rich: {
              aa: {
                color: "#ffffff",
              },
              bb: {
                color: colorList[i],
              },
            },
          },
          data: [chartData[i].name],
        });
      }

      this.chart.setOption({
        backgroundColor: "transparent",
        title: {
          text: "46",
          subtext: "警力数量",
          x: "48%",
          y: "34%",
          itemGap: 6,
          textStyle: {
            color: "#f5fbff",
            fontSize: 20,
            fontWeight: "bold",
          },
          subtextStyle: {
            color: "#f5fbff",
            fontSize: 13,
          },
          textAlign: "center",
        },
        tooltip: {
          show: true,
          backgroundColor: "rgba(0, 0, 0,.8)",
          textStyle: {
            color: "#fff",
          },
        },
        // grid: {
        //   top: 50,
        //   right: 20,
        //   bottom: 0,
        //   left: 0,
        // },
        color: colorList,
        series: [
          {
            name: "",
            type: "pie",
            roundCap: true,
            radius: ["64%", "72%"],
            center: ["50%", "45%"],
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: pieData1,
          },
          {
            type: "pie",
            radius: ["64%", "56%"],
            center: ["50%", "45%"],
            gap: 1.71,
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            silent: true,
            data: pieData2,
          },
          {
            type: "gauge",
            zlevel: 2,
            splitNumber: 90,
            radius: "55%",
            center: ["50%", "45%"],
            startAngle: 90,
            endAngle: -269.9999,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: true,
              length: 7,
              lineStyle: {
                width: 4,
                color: "rgb(33,85,130)",
              },
            },
            pointer: {
              show: 0,
            },
            detail: {
              show: 0,
            },
          },
          {
            type: "pie",
            center: ["50%", "45%"],
            radius: [0, "45.6%"],
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            itemStyle: {
              color: "rgba(75, 126, 203,.1)",
            },
            silent: true,
            data: [
              {
                value: 100,
                name: "",
              },
            ],
          },
        ],
      });
    },
  },
};
</script>
  