<template>
  <div>
    <div class="right-bg-retract">
      <div :class="showRightPanel ? 'right-retract' : 'left-retract'" @click="handelRightPanel"></div>
    </div>
    <div class="right-bg" v-show="showRightPanel">
      <div class="right-top-box">
        <div class="search-box" style="margin: 34px 0 35px 19px" @click="onShowSearch">
          <img style="width: 27px; height: 27px; margin-right: 9px" src="../../assets/images/panel/icon-search.png"
            alt="" />
          <span class="text">搜索</span>
        </div>
        <div class="search-box" style="margin: 26px 0 43px 51px" @click="toSystem">
          <img style="width: 27px; height: 27px; margin-right: 9px" src="../../assets/images/panel/icon-glpt.png"
            alt="" />
          <span class="text">管理平台</span>
        </div>
        <div class="search-box" style="margin: 15px 0 51px 40px" @click="onShowLogout">
          <img style="width: 30px; height: 30px; margin-right: 9px" src="../../assets/images/panel/icon-admin.png"
            alt="" />
          <span class="text" style="font-size: 16px; line-height: 16px; margin-top: 10px">admin</span>
        </div>
      </div>
      <!-- 感知融合 -->
      <div class="gzrh flex-end" v-if="currentIndex === 1">
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
              }" style="width: 47px; margin-left: 15px">{{ index + 1 < 10 ? "0" + (index + 1) : index + 1 }}</span>
                  <span :style="{
                    color: index === 0 ? '#FFC5C5' : 'rgba(212, 226, 255, 1)',
                  }" style="width: 97px">{{ item.deviceTypeName }}</span>
                  <span :style="{
                    color: index === 0 ? '#FFC5C5' : 'rgba(212, 226, 255, 1)',
                  }" style="width: 165px">{{ item.alertTime }}</span>
                  <div class="row-center" style="width: 30px; height: 32px; margin-right: 20px"
                    @click="onShowAlert(item)">
                    <img style="width: 12px; height: 16px" :src="index === 0
                        ? require('../../assets/images/panel/alert-location.png')
                        : require('../../assets/images/panel/table-item-location.png')
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
              }" style="width: 47px; margin-left: 15px">{{ index + 1 < 10 ? "0" + (index + 1) : index + 1 }}</span>
                  <span :style="{
                    color: index === 0 ? '#FFE4B2' : 'rgba(212, 226, 255, 1)',
                  }" style="width: 97px">{{ item.deviceTypeName }}</span>
                  <span class="max-w" :style="{
                    color: index === 0 ? '#FFE4B2' : 'rgba(212, 226, 255, 1)',
                  }" style="width: 165px" :title="item.content">{{ item.content }}</span>
                  <div class="row-center" style="width: 30px; height: 32px; margin-right: 20px"
                    @click="onShowFault(item)">
                    <img style="width: 12px; height: 16px" :src="index === 0
                        ? require('../../assets/images/panel/warning-location.png')
                        : require('../../assets/images/panel/table-item-location.png')
                      " alt="" />
                  </div>
            </div>
          </div>
        </div>
        <!-- 设备故障概览 -->
        <div class="sbgz-head">
          <div class="flex-row cp" @click="onShowCharts">
            <img style="width: 18px; height: 11px" :src="showCharts
                ? require('../../assets/images/gzrh/right-arrow.png')
                : require('../../assets/images/gzrh/left-arrow.png')
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
      <!-- 日常防控 -->
      <div class="rcfk flex-end" v-if="currentIndex === 4 && !isAddYA">
        <div class="yaxx-head"></div>
        <div class="yaxx-box flex-column">
          <div class="top-box"></div>
          <div class="mid-box">
            <div class="left-box flex-end">
              <div class="flex-row">
                <div class="text-box max-w">
                  预案地址：{{ currentYAInfo.address }}
                </div>
                <img class="yaxx-tip" src="../../assets/images/panel/yaxx-tip.png" alt="" />
              </div>
              <div class="flex-row">
                <div class="text-box max-w" style="width: 240px">
                  预案名称：{{ currentYAInfo.name }}
                </div>
                <img class="yaxx-tip" src="../../assets/images/panel/yaxx-tip.png" alt="" />
              </div>
              <div class="flex-row">
                <div class="text-box max-w" style="width: 230px">
                  预案类型：{{ currentYAInfo.typeName }}
                </div>
                <img class="yaxx-tip" src="../../assets/images/panel/yaxx-tip.png" alt="" />
              </div>
              <div class="flex-row">
                <div class="text-box max-w" style="width: 210px">
                  预案负责人：{{ currentYAInfo.directorName }}
                </div>
                <img class="yaxx-tip" src="../../assets/images/panel/yaxx-tip.png" alt="" />
              </div>
              <div class="flex-row">
                <div class="text-box max-w" style="width: 190px">
                  联系电话：{{ currentYAInfo.phone }}
                </div>
                <img class="yaxx-tip" src="../../assets/images/panel/yaxx-tip.png" alt="" />
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
          <img style="width: 118px; height: 165px" src="../../assets/images/panel/icon-empty.png" alt="" />
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
          <img style="width: 118px; height: 165px" src="../../assets/images/panel/icon-empty.png" alt="" />
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
      <div class="rcfk flex-end" v-if="currentIndex === 4 && isAddYA">
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
          <img style="width: 118px; height: 165px" src="../../assets/images/panel/icon-empty.png" alt="" />
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
          <img style="width: 118px; height: 165px" src="../../assets/images/panel/icon-empty.png" alt="" />
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
    <div v-show="showRightPanel">
      <div class="right-out"></div>
      <div class="logout-box" v-if="showLogout">
        <div class="flex-row logout-item cp" @click="onLogout">
          <img style="width: 8px; height: 8px; margin-right: 8px" src="../../assets/images/panel/logout-tip.png" alt="" />
          <span class="logout-text">退出登录</span>
        </div>
      </div>
      <div :class="[poiHover ? 'poi-btn-s' : 'poi-btn-c']">
        <img class="icon-poi" src="../../assets/images/panel/icon-poi.png" alt="" @mouseenter="onMouseEnter(0)"
          @mouseleave="onMouseLeave(0)" @click="showDialog(0)" />
      </div>
      <div :class="[spjkHover ? 'spjk-btn-s' : 'spjk-btn-c']">
        <img class="icon-spjk" src="../../assets/images/panel/icon-spdw.png" alt="" @mouseenter="onMouseEnter(1)"
          @mouseleave="onMouseLeave(1)" @click="showDialog(1)" />
      </div>
      <div :class="[wlsbHover ? 'wlsb-btn-s' : 'wlsb-btn-c']">
        <img class="icon-wlsb" src="../../assets/images/panel/icon-wlsb.png" alt="" @mouseenter="onMouseEnter(2)"
          @mouseleave="onMouseLeave(2)" @click="showDialog(2)" />
      </div>
      <img class="clear-img" src="../../assets/images/panel/icon-clear.png" alt="" @click="onClearAll" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import bus from "@/utils/bus";
import LineChart from "./components/LineChart.vue";
// 感知融合
import {
  getAlertList,
  getFaultDeviceList,
  getFaultStatistics,
} from "@/api/panel";

export default {
  components: {
    LineChart,
  },
  props: {
    currentIndex: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    ...mapGetters(["socketMsg"]),
  },
  watch: {
    currentIndex(val) {
      this.getPageRequest(val);
    },
    socketMsg: {
      handler() {
        this.getPageRequest(1);
      },
    },
  },
  data() {
    return {
      showRightPanel: true,
      showLogout: false,
      poiHover: false,
      spjkHover: false,
      wlsbHover: false,

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
    };
  },
  mounted() {
    this.getPageRequest(this.currentIndex);
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
      this.currentYAInfo = info.currentYAInfo;
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
    handelRightPanel() {
      this.showRightPanel = !this.showRightPanel;
    },
    getPageRequest(currentIndex) {
      if (currentIndex === 1) {
        this.getAlertList();
        this.getFaultDeviceList();
        this.getFaultStatistics();
      }
    },
    onShowCharts() {
      this.showCharts = !this.showCharts;
      if (!this.showCharts) {
        this.showChartsData = this.chartData.slice(0, 6);
      } else {
        this.showChartsData = this.chartData;
      }
    },

    /**
     * 公共模块
     */
    onClearAll() {
      this.$emit("clearAll");
    },
    onShowSearch() {
      this.$emit("showSearchBox");
    },
    toSystem() {
      this.$router.push({ path: "/control/point" }).catch(() => { });
    },
    onShowLogout() {
      this.showLogout = !this.showLogout;
    },
    async onLogout() {
      this.showLogout = false;
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            this.$store.dispatch("tagsView/delAllViews");
            this.$router.push("/login");
          });
        })
        .catch(() => { });
    },
    //三个按钮点击事件
    showDialog(idx) {
      switch (idx) {
        case 0:
          //图层面板
          this.$emit("showPOI");
          break;
        case 1:
          //视频监控
          this.$emit("showSPJK");
          break;
        case 2:
          //物联设备
          this.$emit("showWLSB");
          break;

        default:
          break;
      }
    },
    onMouseEnter(idx) {
      switch (idx) {
        case 0:
          this.poiHover = true;
          break;
        case 1:
          this.spjkHover = true;
          break;
        case 2:
          this.wlsbHover = true;
          break;

        default:
          break;
      }
    },
    onMouseLeave(idx) {
      switch (idx) {
        case 0:
          this.poiHover = false;
          break;
        case 1:
          this.spjkHover = false;
          break;
        case 2:
          this.wlsbHover = false;
          break;

        default:
          break;
      }
    },

    /**
     * 感知融合模块
     */
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
      this.$emit("showAlert", item);
    },
    onShowFault(item) {
      this.$emit("showFault", item);
    },

    /**
     * 日常防控模块
     */
    //展示/隐藏预案标绘
    onShowYABH(isBool, item) {
      this.$set(item, "idx", this.yabhTabIndex);
      this.$set(item, "bool", isBool);
      this.$emit("showYABH", item);
    },
    onViewAddYABH(item) {
      this.$emit("viewAddYABH", item);
    },
    onDelAddYABH(item, index) {
      this.$emit("delAddYABH", item);
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
    //展示场景信息
    onShowCJXX(item) {
      this.$set(item, "idx", this.cjxxTabIndex);
      this.$emit("showCJXX", item);
    },
    onViewAddCJXX(item) {
      this.$emit("viewAddCJXX", item);
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
  },
};
</script>

<style lang="scss" scoped>
.cp {
  cursor: pointer;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.flex-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flex-start {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.flex-end {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.right-bg-retract {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  width: 29px;
  height: 610px;
  background: url("../../assets/images/panel/right-bg-retract.png");
  z-index: 999;

  .left-retract {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 8px;
    width: 10px;
    height: 23px;
    background: url("../../assets/images/panel/left-retract.png");
    cursor: pointer;
  }

  .right-retract {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 8px;
    width: 10px;
    height: 23px;
    background: url("../../assets/images/panel/right-retract.png");
    cursor: pointer;
  }
}

.right-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 513px;
  height: 100%;
  background: url("../../assets/images/panel/right-bg.png");
  background-size: 100% 100%;
  z-index: 99;

  .right-top-box {
    display: flex;
    flex-direction: row;
    width: 514px;
    height: 96px;

    .search-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;

      .text {
        font-size: 14px;
        line-height: 14px;
        font-family: YouSheBiaoTiHei;
        font-weight: 500;
        color: #eff9ff;
      }
    }
  }

  // 感知融合
  .gzrh {
    .sbssgj-head {
      width: 405px;
      height: 34px;
      background: url("../../assets/images/gzrh/sbssgj-head.png");
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
        background: url("../../assets/images/panel/jqlbpm-table-head.png");
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
            background: url("../../assets/images/panel/jqlbpm-item-hover.png");
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
        background: url("../../assets/images/panel/jqlbpm-item-bg1.png");
        background-size: 100% 100%;
      }

      .bg2 {
        background: url("../../assets/images/panel/jqlbpm-item-bg2.png");
        background-size: 100% 100%;
      }

      .alert-bg {
        background: url("../../assets/images/panel/alert-bg.png");
        background-size: 100% 100%;
      }

      .warning-bg {
        background: url("../../assets/images/panel/warning-bg.png");
        background-size: 100% 100%;
      }
    }

    .sblx-head {
      width: 405px;
      height: 34px;
      background: url("../../assets/images/gzrh/sblx-head.png");
      background-size: 100% 100%;
      margin-top: 15px;
      margin-right: 27px;
    }

    .sbgz-head {
      width: 405px;
      height: 34px;
      background: url("../../assets/images/gzrh/sbgz-head.png");
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
      background: url("../../assets/images/gzrh/sbgz-bg.png");
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

  // 日常防控
  .rcfk {
    .yaxx-head {
      width: 406px;
      height: 34px;
      background: url("../../assets/images/panel/yaxx-head.png");
      background-size: 100% 100%;
      margin-right: 25px;
    }

    .yaxx-box {
      .top-box {
        margin-top: 4px;
        margin-right: 169px;
        width: 323px;
        height: 13px;
        background: url("../../assets/images/panel/yaxx-top-bg.png");
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
          background: url("../../assets/images/panel/yaxx-left-bg.png");
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
          background: url("../../assets/images/panel/yaxx-right-bg.png");
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
        background: url("../../assets/images/panel/yaxx-bottom-bg.png");
        background-size: 100% 100%;
      }
    }

    .yabh-head {
      width: 406px;
      height: 34px;
      background: url("../../assets/images/panel/yabh-head.png");
      background-size: 100% 100%;
      margin-top: 11px;
      margin-right: 25px;
    }

    .yabh-tab-box {
      margin-top: 10px;
      margin-right: 25px;
      width: 383px;
      height: 34px;
      background: url("../../assets/images/panel/yabh-tab-bg.png");
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
        background: url("../../assets/images/panel/select-item-bg.png");
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
        background: url("../../assets/images/panel/yabh-item.png");
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
          background: url("../../assets/images/panel/yabh-item-hover.png");
        }

        .item-text {
          margin-left: 71px;
          width: 172px;
        }
      }

      .cjxx-item {
        width: 371px;
        height: 73px;
        background: url("../../assets/images/panel/cjxx-item.png");
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
          background: url("../../assets/images/panel/cjxx-item-hover.png");
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
        background: url("../../assets/images/panel/ck-btn-bg.png");
        background-size: 100% 100%;
        font-size: 14px;
        line-height: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #b2d0ff;
        cursor: pointer;

        &:hover {
          color: #d4e2ff;
          background: url("../../assets/images/panel/ck-btn-hover-bg.png");
        }
      }
    }

    .cjxx-head {
      width: 406px;
      height: 31px;
      background: url("../../assets/images/panel/cjxx-head.png");
      background-size: 100% 100%;
      margin-top: 16px;
      margin-right: 25px;
    }
  }
}

.right-out {
  position: absolute;
  top: 161px;
  right: 399px;
  width: 172px;
  height: calc(100% - 316px);
  background: url("../../assets/images/panel/right-out.png");
  background-size: 100% 100%;
}

.logout-box {
  position: absolute;
  top: 51px;
  right: 140px;
  width: 130px;
  height: 90px;
  background: url("../../assets/images/panel/logout-bg.png");
  background-size: 100% 100%;
  z-index: 999;
  padding-top: 20px;

  .logout-item {
    padding: 4px 11px;

    .logout-text {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #f3f8ff;
      line-height: 14px;
    }
  }
}

.poi-btn-c {
  position: absolute;
  top: 173px;
  right: 480px;
  width: 159px;
  height: 46px;
  background: transparent;
  z-index: 99;
}

.poi-btn-s {
  position: absolute;
  top: 173px;
  right: 480px;
  width: 159px;
  height: 46px;
  background: url("../../assets/images/panel/poi-btn.png");
  background-size: 100% 100%;
  z-index: 99;
}

.icon-poi {
  width: 50px;
  height: 33px;
  margin-top: 5px;
  margin-left: 108px;
  cursor: pointer;
}

.spjk-btn-c {
  position: absolute;
  top: 248px;
  right: 465px;
  width: 159px;
  height: 46px;
  background: transparent;
  z-index: 99;
}

.spjk-btn-s {
  position: absolute;
  top: 248px;
  right: 465px;
  width: 159px;
  height: 46px;
  background: url("../../assets/images/panel/spjk-btn.png");
  background-size: 100% 100%;
  z-index: 99;
}

.icon-spjk {
  width: 50px;
  height: 33px;
  margin-top: 5px;
  margin-left: 108px;
  cursor: pointer;
}

.wlsb-btn-c {
  position: absolute;
  top: 322px;
  right: 450px;
  width: 159px;
  height: 46px;
  background: transparent;
  z-index: 99;
}

.wlsb-btn-s {
  position: absolute;
  top: 322px;
  right: 450px;
  width: 159px;
  height: 46px;
  background: url("../../assets/images/panel/wlsb-btn.png");
  background-size: 100% 100%;
  z-index: 99;
}

.icon-wlsb {
  width: 50px;
  height: 33px;
  margin-top: 7px;
  margin-left: 108px;
  cursor: pointer;
}

.clear-img {
  width: 54px;
  height: 49px;
  position: absolute;
  right: 430px;
  bottom: 99px;
  z-index: 99;
  cursor: pointer;
}

.max-w {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  cursor: pointer;
}

::v-deep .el-input__inner {
  background-color: transparent !important;
  border-color: transparent;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #aed8ee;
  line-height: 14px;
}

::v-deep .el-pagination span:not([class*="suffix"]),
.el-pagination button {
  font-size: 14px;
}

::v-deep .el-pagination__total {
  font-size: 14px;
  color: #68daff;
}

::v-deep .el-pagination .btn-prev,
::v-deep .el-pagination .btn-next {
  color: #68daff;
}

::v-deep .el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background-color: rgba(107, 232, 250, 0.1);
  border: 1px solid #68daff;
}

::v-deep .el-pagination.is-background .btn-next,
.el-pagination.is-background .el-pager li {
  background-color: rgba(107, 232, 250, 0.1);
  border: 1px solid #68daff;
}

::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #68daff;
  color: #050a10;
  font-size: 14px;
}

::v-deep .el-pagination__jump {
  color: #68daff;
}
</style>