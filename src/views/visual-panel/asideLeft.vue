<template>
  <div>
    <div class="left-bg-retract">
      <div
        :class="showLeftPanel ? 'left-retract' : 'right-retract'"
        @click="handelLeftPanel"
      ></div>
    </div>
    <div class="left-bg" v-show="showLeftPanel">
      <div class="left-top-box">
        <div class="date-box">
          <span class="time-text">{{ currentDate.split(" ")[2] }}</span>
          <span class="line-text">/</span>
          <div class="flex-column">
            <span class="heiti-text">{{ currentDate.split(" ")[1] }}</span>
            <span class="heiti-text" style="margin-top: 6px">{{
              currentDate.split(" ")[0]
            }}</span>
          </div>
        </div>
        <img
          class="weather-img"
          src="../../assets/images/panel/icon-weather.png"
          alt=""
        />
      </div>
      <!-- 感知融合 -->
      <gzrh-left v-if="currentIndex === 1"></gzrh-left>
      <!-- 日常防控 -->
      <rcfk-left :yalxSelectIndex="yalxSelectIndex" v-if="currentIndex === 4"></rcfk-left>
    </div>
    <tool-left :yalxSelectIndex="yalxSelectIndex" v-show="showLeftPanel"></tool-left>
  </div>
</template>

<script>
import GzrhLeft from "./left/gzrhLeft.vue";
import RcfkLeft from "./left/rcfkLeft.vue";
import ToolLeft from "./left/toolLeft.vue";
import { getCurrentDate } from "@/utils/index";

export default {
  components: {
    GzrhLeft,
    RcfkLeft,
    ToolLeft,
  },
  props: {
    currentIndex: {
      type: Number,
      default: 1,
    },
    yalxSelectIndex: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      showLeftPanel: true,
      currentDate: "",
    };
  },
  mounted() {
    setInterval(() => {
      this.currentDate = this.getCurrentDate();
    }, 1000);
  },
  methods: {
    handelLeftPanel() {
      this.showLeftPanel = !this.showLeftPanel;
    },
    getCurrentDate,
  },
};
</script>

<style lang="scss" scoped>
.left-bg-retract {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  width: 29px;
  height: 610px;
  background: url("../../assets/images/panel/left-bg-retract.png");
  z-index: 999;
  .right-retract {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 8px;
    width: 10px;
    height: 23px;
    background: url("../../assets/images/panel/right-retract.png");
    cursor: pointer;
  }
  .left-retract {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 8px;
    width: 10px;
    height: 23px;
    background: url("../../assets/images/panel/left-retract.png");
    cursor: pointer;
  }
}
.left-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 514px;
  height: 100%;
  background: url("../../assets/images/panel/left-bg.png");
  background-size: 100% 100%;
  z-index: 99;
  .left-top-box {
    display: flex;
    flex-direction: row;
    width: 514px;
    height: 96px;
    .weather-img {
      width: 134px;
      height: 24px;
      position: absolute;
      top: 33px;
      left: 386px;
    }
    .date-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      position: absolute;
      top: 24px;
      left: 157px;
      .time-text {
        font-size: 22px;
        line-height: 22px;
        font-family: ZHCJJZT;
        font-weight: 800;
        color: #eff9ff;
      }
      .line-text {
        width: 1px;
        height: 20px;
        font-size: 22px;
        line-height: 22px;
        color: #53d5fd;
        margin: 0 15px 0 10px;
      }
      .heiti-text {
        font-size: 10px;
        line-height: 10px;
        font-family: Adobe Heiti Std;
        font-weight: normal;
        color: #eff9ff;
        font-style: oblique;
      }
    }
  }
}
</style>