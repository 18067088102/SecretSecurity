<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>
  
  <script>
import * as echarts from "echarts";
import "echarts-gl";
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
      default: "374px",
    },
    height: {
      type: String,
      default: "160px",
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
      // 传入数据生成 option
      const optionsData = [
        {
          name: "重大警情",
          value: 100,
          itemStyle: {
            color: "rgba(49,127,255,0.6)",
          },
        },
        {
          name: "有效警情",
          value: 50,
          itemStyle: {
            color: "rgba(0,186,255,0.6)",
          },
        },
      ];
      const series = this.getPie3D(optionsData, 0.8, 240, 28, 26, 0.5);
      series.push({
        name: "pie2d",
        type: "pie",
        label: {
          opacity: 1,
          fontSize: 13,
          lineHeight: 20,
          textStyle: {
            color: '#fff',
            fontSize: 15,
          },
        },
        labelLine: {
          length: 30,
          length2: 30,
        },
        startAngle: -90, //起始角度，支持范围[0, 360]。
        clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
        radius: ["20%", "50%"],

        center: ["50%", "50%"],
        data: optionsData,
        itemStyle: {
          opacity: 0,
        },
      });
      // 准备待返回的配置项，把准备好的 legendData、series 传入。
      this.chart.setOption({
        // legend: {
        //   tooltip: {
        //     show: true,
        //   },
        //   data: ["重大警情", "有效警情"],
        //   bottom: "5%",
        //   textStyle: {
        //     color: "#fff",
        //     fontSize: 14,
        //   },
        // },
        animation: true,
        // tooltip: {
        //   formatter: (params) => {
        //     if (
        //       params.seriesName !== "mouseoutSeries" &&
        //       params.seriesName !== "pie2d"
        //     ) {
        //       return `${
        //         params.seriesName
        //       }<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
        //         params.color
        //       };"></span>${
        //         option.series[params.seriesIndex].pieData.value + "起"
        //       }`;
        //     }
        //   },
        //   textStyle: {
        //     fontSize: 20,
        //   },
        // },
        // title: {
        //   x: "center",
        //   top: "20",
        //   textStyle: {
        //     color: "#fff",
        //     fontSize: 22,
        //   },
        // },
        backgroundColor: "#333",
        labelLine: {
          show: true,
          lineStyle: {
            color: "#7BC0CB",
          },
        },
        label: {
          show: true,
          position: "outside",
          formatter: "{c}起 \n {b}",
        },
        xAxis3D: {
          min: -1,
          max: 1,
        },
        yAxis3D: {
          min: -1,
          max: 1,
        },
        zAxis3D: {
          min: -1,
          max: 1,
        },
        grid3D: {
          show: false,
          boxHeight: 0.5,
          //top: '30%',
          //bottom: "50%",
          environment: "#202740",
          viewControl: {
            distance: 150,
            alpha: 25,
            beta: 90,
            autoRotate: false, // 自动旋转
          },
        },
        series: series,
      });
    },
    // 生成模拟 3D 饼图的配置项
    getPie3D(pieData, internalDiameterRatio) {
      let series = [];
      let sumValue = 0;
      let startValue = 0;
      let endValue = 0;
      let legendData = [];
      let k =
        typeof internalDiameterRatio !== "undefined"
          ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
          : 1 / 3;

      // 为每一个饼图数据，生成一个 series-surface 配置
      for (let i = 0; i < pieData.length; i++) {
        sumValue += pieData[i].value;

        let seriesItem = {
          name:
            typeof pieData[i].name === "undefined"
              ? `series${i}`
              : pieData[i].name,
          type: "surface",
          parametric: true,
          wireframe: {
            show: false,
          },
          pieData: pieData[i],
          pieStatus: {
            selected: false,
            hovered: false,
            k: k,
          },
        };

        if (typeof pieData[i].itemStyle != "undefined") {
          let itemStyle = {};

          typeof pieData[i].itemStyle.color != "undefined"
            ? (itemStyle.color = pieData[i].itemStyle.color)
            : null;
          typeof pieData[i].itemStyle.opacity != "undefined"
            ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
            : null;

          seriesItem.itemStyle = itemStyle;
        }
        series.push(seriesItem);
      }

      // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
      // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
      for (let i = 0; i < series.length; i++) {
        endValue = startValue + series[i].pieData.value;
        // console.log(series[i]);
        series[i].pieData.startRatio = startValue / sumValue;
        series[i].pieData.endRatio = endValue / sumValue;
        series[i].parametricEquation = this.getParametricEquation(
          series[i].pieData.startRatio,
          series[i].pieData.endRatio,
          false,
          false,
          k,
          series[i].pieData.value
        );

        startValue = endValue;

        legendData.push(series[i].name);
      }

      // // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
      series.push({
        name: "mouseoutSeries",
        type: "surface",
        parametric: true,
        wireframe: {
          show: false,
        },
        itemStyle: {
          opacity: 0.1,
          color: "#E1E8EC",
        },
        parametricEquation: {
          u: {
            min: 0,
            max: Math.PI * 2,
            step: Math.PI / 20,
          },
          v: {
            min: 0,
            max: Math.PI,
            step: Math.PI / 20,
          },
          x: function (u, v) {
            return ((Math.sin(v) * Math.sin(u) + Math.sin(u)) / Math.PI) * 2;
          },
          y: function (u, v) {
            return ((Math.sin(v) * Math.cos(u) + Math.cos(u)) / Math.PI) * 2;
          },
          z: function (u, v) {
            return Math.cos(v) > 0 ? -0.5 : -5;
          },
        },
      });

      // // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
      series.push({
        name: "mouseoutSeries",
        type: "surface",
        parametric: true,
        wireframe: {
          show: false,
        },
        itemStyle: {
          opacity: 0.1,
          color: "#E1E8EC",
        },
        parametricEquation: {
          u: {
            min: 0,
            max: Math.PI * 2,
            step: Math.PI / 20,
          },
          v: {
            min: 0,
            max: Math.PI,
            step: Math.PI / 20,
          },
          x: function (u, v) {
            return ((Math.sin(v) * Math.sin(u) + Math.sin(u)) / Math.PI) * 2;
          },
          y: function (u, v) {
            return ((Math.sin(v) * Math.cos(u) + Math.cos(u)) / Math.PI) * 2;
          },
          z: function (u, v) {
            return Math.cos(v) > 0 ? -5 : -7;
          },
        },
      });
      series.push({
        name: "mouseoutSeries",
        type: "surface",
        parametric: true,
        wireframe: {
          show: false,
        },
        itemStyle: {
          opacity: 0.1,
          color: "#E1E8EC",
        },

        parametricEquation: {
          u: {
            min: 0,
            max: Math.PI * 2,
            step: Math.PI / 20,
          },
          v: {
            min: 0,
            max: Math.PI,
            step: Math.PI / 20,
          },
          x: function (u, v) {
            return ((Math.sin(v) * Math.sin(u) + Math.sin(u)) / Math.PI) * 2.2;
          },
          y: function (u, v) {
            return ((Math.sin(v) * Math.cos(u) + Math.cos(u)) / Math.PI) * 2.2;
          },
          z: function (u, v) {
            return Math.cos(v) > 0 ? -7 : -7;
          },
        },
      });
      return series;
    },
    // 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
    getParametricEquation(
      startRatio,
      endRatio,
      isSelected,
      isHovered,
      k,
      height
    ) {
      // 计算
      let midRatio = (startRatio + endRatio) / 2;

      let startRadian = startRatio * Math.PI * 2;
      let endRadian = endRatio * Math.PI * 2;
      let midRadian = midRatio * Math.PI * 2;

      // 如果只有一个扇形，则不实现选中效果。
      if (startRatio === 0 && endRatio === 1) {
        isSelected = false;
      }

      // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
      k = typeof k !== "undefined" ? k : 1 / 3;

      // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
      let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
      let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;

      // 计算高亮效果的放大比例（未高亮，则比例为 1）
      let hoverRate = isHovered ? 1.05 : 1;

      // 返回曲面参数方程
      return {
        u: {
          min: -Math.PI,
          max: Math.PI * 3,
          step: Math.PI / 32,
        },

        v: {
          min: 0,
          max: Math.PI * 2,
          step: Math.PI / 20,
        },

        x: function (u, v) {
          if (u < startRadian) {
            return (
              offsetX +
              Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
            );
          }
          if (u > endRadian) {
            return (
              offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
            );
          }
          return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
        },

        y: function (u, v) {
          if (u < startRadian) {
            return (
              offsetY +
              Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
            );
          }
          if (u > endRadian) {
            return (
              offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
            );
          }
          return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
        },

        z: function (u, v) {
          if (u < -Math.PI * 0.5) {
            return Math.sin(u);
          }
          if (u > Math.PI * 2.5) {
            return Math.sin(u);
          }
          return Math.sin(v) > 0 ? 1 * height : -1;
        },
      };
    },
  },
};
</script>
  