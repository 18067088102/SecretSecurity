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
      <div class="gzrh" v-if="currentIndex === 1">
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
              <span class="title-text"
                >已处理：<span style="color: #22baf6">{{
                  wlcgDealtCount
                }}</span></span
              >
            </div>
            <div class="flex-row">
              <span class="title-text"
                >未处理：<span style="color: #edac53">{{
                  wlcgUntreatedCount
                }}</span></span
              >
              <div
                class="point-box"
                style="background: #edac53; margin-left: 8px"
              ></div>
            </div>
          </div>
          <div class="all-progress flex-row">
            <div
              class="ycl-progress"
              :style="{
                width:
                  (wlcgDealtCount / (wlcgDealtCount + wlcgUntreatedCount)) *
                    364 +
                  'px',
              }"
            ></div>
            <div
              class="wcl-progress"
              :style="{
                width:
                  (wlcgUntreatedCount / (wlcgDealtCount + wlcgUntreatedCount)) *
                    364 +
                  'px',
              }"
            ></div>
          </div>
        </div>
        <div class="yj-box flex-column">
          <div class="yj-bg">
            <span class="head-text">特勤特种预警</span>
          </div>
          <div class="flex-sb" style="width: 364px; margin: 15px 0 10px">
            <div class="flex-row">
              <div class="point-box" style="margin-right: 8px"></div>
              <span class="title-text"
                >已处理：<span style="color: #22baf6">{{
                  tqtzDealtCount
                }}</span></span
              >
            </div>
            <div class="flex-row">
              <span class="title-text"
                >未处理：<span style="color: #edac53">{{
                  tqtzUntreatedCount
                }}</span></span
              >
              <div
                class="point-box"
                style="background: #edac53; margin-left: 8px"
              ></div>
            </div>
          </div>
          <div class="all-progress flex-row">
            <div
              class="ycl-progress"
              :style="{
                width:
                  (tqtzDealtCount / (tqtzDealtCount + tqtzUntreatedCount)) *
                    364 +
                  'px',
              }"
            ></div>
            <div
              class="wcl-progress"
              :style="{
                width:
                  (tqtzUntreatedCount / (tqtzDealtCount + tqtzUntreatedCount)) *
                    364 +
                  'px',
              }"
            ></div>
          </div>
        </div>
        <div class="gzsb-head"></div>
        <div class="gzsb-box1">
          <div class="gzsb-item" v-for="(item, index) in gzsbs" :key="index">
            <img
              style="width: 76px; height: 76px; margin-right: 5px"
              :src="item.img"
              alt=""
            />
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
            <img
              style="
                width: 18px;
                height: 11px;
                margin-left: 4px;
                margin-right: -10px;
              "
              :src="
                showCharts
                  ? require('../../assets/images/gzrh/left-arrow.png')
                  : require('../../assets/images/gzrh/right-arrow.png')
              "
              alt=""
            />
          </div>
        </div>
        <div
          class="warning-count"
          :style="{
            width: showCharts
              ? (showChartsData.length * 400) / 6 + 'px'
              : '400px',
          }"
        >
          <bar-chart :dataList="showChartsData" />
        </div>
      </div>
      <!-- 日常防控 -->
      <div class="rcfk" v-if="currentIndex === 4">
        <!-- 预案总览 -->
        <div v-if="yalxSelectIndex === 1 && !isAddYA">
          <div class="yazl-head"></div>
          <div class="yazl-box">
            <div
              class="yazl-item flex-row"
              v-for="(item, index) in yazlLists"
              :key="index"
            >
              <img class="yazl-img" :src="item.image" alt="" />
              <div class="flex-column">
                <span class="name-text">{{ item.name }}</span>
                <span class="count-text">{{ item.count }}</span>
              </div>
            </div>
          </div>
          <div class="yagl-head"></div>
          <div class="yagl-search flex-column">
            <div class="flex-row">
              <div class="search-box flex-row">
                <el-input
                  style="width: calc(100% - 41px)"
                  v-model="queryForm.name"
                  clearable
                  placeholder="请输入关键字"
                  @change="getYAList"
                ></el-input>
                <div class="search-btn cp" @click="getYAList"></div>
              </div>
              <div class="add-box row-center">
                <img
                  class="add-img"
                  src="../../assets/images/panel/yagl-add.png"
                  alt=""
                />
                <span class="add-text cp" @click="onAddYA">新增预案</span>
              </div>
            </div>
            <div class="select-box">
              <el-select
                style="width: calc(100% - 50px)"
                v-model="queryForm.type"
                clearable
                placeholder="请选择"
                :popper-append-to-body="false"
                @change="getYAList"
              >
                <el-option
                  v-for="dict in dict.type.police_forces_plan_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </div>
          </div>
          <div class="table-box">
            <div class="table-head flex-row">
              <span style="width: 80px">预案名称</span>
              <span style="width: 80px">预案类型</span>
              <span style="width: 150px">创建时间</span>
              <span style="width: 70px">操作</span>
            </div>
            <div
              class="row-center"
              style="width: 371px; height: 219px"
              v-if="yaglList.length === 0"
            >
              <img
                style="width: 118px; height: 165px"
                src="../../assets/images/panel/icon-empty.png"
                alt=""
              />
            </div>
            <div v-else>
              <div
                class="table-item flex-row"
                v-for="(item, index) in yaglList"
                :key="index"
                @click="onDetailYA(item, index)"
              >
                <span
                  class="max-w"
                  style="width: 75px; margin-right: 5px"
                  :title="item.name"
                  >{{ item.name }}</span
                >
                <span class="max-w" style="width: 75px; margin-right: 5px">{{
                  item.typeName
                }}</span>
                <span class="max-w" style="width: 145px; margin-right: 5px">{{
                  item.createTime
                }}</span>
                <div class="flex-row" style="width: 70px">
                  <img
                    class="cp"
                    style="width: 16px; height: 17px; margin-right: 8px"
                    src="../../assets/images/panel/icon-chakan.png"
                    alt=""
                    @click.stop="onDetailYA(item, index)"
                  />
                  <img
                    class="cp"
                    style="width: 16px; height: 16px; margin-right: 8px"
                    src="../../assets/images/panel/icon-bianji.png"
                    alt=""
                    @click.stop="onEditYA(item)"
                  />
                  <img
                    class="cp"
                    style="width: 16px; height: 18px"
                    src="../../assets/images/panel/icon-shanchu.png"
                    alt=""
                    @click.stop="onDeleteYA(item)"
                  />
                </div>
              </div>
              <div style="margin-top: 10px; margin-left: 50px">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="queryForm.pageNum"
                  :page-size="queryForm.pageSize"
                  background
                  layout="total, prev, next, jumper"
                  :total="total"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
        <!-- 新增预案 -->
        <div v-if="yalxSelectIndex === 1 && isAddYA">
          <div class="xjya-head cp" @click="onBack"></div>
          <div class="flex-row" style="margin-left: 30px; margin-top: 28px">
            <span class="input-title">* 预案类型：</span>
            <div class="input-bg">
              <el-select
                style="width: 100%"
                v-model="submitForm.type"
                clearable
                placeholder="请选择"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="dict in dict.type.police_forces_plan_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </div>
          </div>
          <div class="flex-row" style="margin-left: 30px; margin-top: 20px">
            <span class="input-title">* 预案名称：</span>
            <div class="input-bg">
              <el-input
                v-model="submitForm.name"
                clearable
                placeholder="请输入预案名称"
              ></el-input>
            </div>
          </div>
          <div class="flex-row" style="margin-left: 30px; margin-top: 20px">
            <span class="input-title">* 预案负责人：</span>
            <div class="input-bg">
              <el-input
                v-model="submitForm.directorName"
                clearable
                placeholder="请输入预案负责人"
              ></el-input>
            </div>
          </div>
          <div class="flex-row" style="margin-left: 30px; margin-top: 20px">
            <span class="input-title">* 联系电话：</span>
            <div class="input-bg">
              <el-input
                v-model="submitForm.phone"
                clearable
                placeholder="请输入联系电话"
              ></el-input>
            </div>
          </div>
          <div class="flex-row" style="margin-left: 30px; margin-top: 20px">
            <span class="input-title">* 预案地址：</span>
            <div class="input-bg">
              <el-input
                v-model="submitForm.address"
                clearable
                placeholder="请输入预案地址"
              ></el-input>
            </div>
          </div>
          <div class="dashed-line"></div>
          <span class="yabh-title" v-if="submitForm.type === '3'"
            >线路规划</span
          >
          <div
            v-if="submitForm.type === '3'"
            class="flex-row"
            style="margin-left: 30px; margin-top: 20px"
          >
            <span class="input-title" style="width: 80px">* 起点：</span>
            <div class="input-bg flex-row" style="width: 290px">
              <el-input
                disabled
                style="width: 250px; margin-right: 7px"
                v-model="startLonLat"
                clearable
                placeholder="请在地图上选取起点"
              ></el-input>
              <div class="start-point cp" @click="selectPoint(0)"></div>
            </div>
          </div>
          <div
            v-if="submitForm.type === '3'"
            class="flex-row"
            style="margin-left: 30px; margin-top: 20px"
          >
            <span class="input-title" style="width: 80px">* 终点：</span>
            <div class="input-bg flex-row" style="width: 290px">
              <el-input
                disabled
                style="width: 250px; margin-right: 7px"
                v-model="endLonLat"
                clearable
                placeholder="请在地图上选取终点"
              ></el-input>
              <div class="end-point cp" @click="selectPoint(1)"></div>
            </div>
          </div>
          <span class="yabh-title">预案标绘</span>
          <div
            class="yabh-bg flex-column"
            v-if="submitForm.type !== '3' && !isMBH && !isJYBH"
          >
            <div class="tbh-item flex-column cp" @click="onYABHClick(4)">
              <div class="tbh-img"></div>
              <span style="margin-top: 1px; margin-left: 6px">体标绘</span>
            </div>
            <div class="jybh-item flex-column cp" @click="onYABHClick(5)">
              <div class="jybh-img"></div>
              <span style="margin-top: 1px; margin-left: 8px">警用标绘</span>
            </div>
            <div class="xbh-item flex-column cp" @click="onYABHClick(2)">
              <div class="xbh-img"></div>
              <span style="margin-top: -4px; margin-left: 9px">线标绘</span>
            </div>
            <div class="mbh-item flex-column cp" @click="onYABHClick(3)">
              <div class="mbh-img"></div>
              <span style="margin-top: -4px; margin-left: 28px">面标绘</span>
            </div>
            <div class="dbh-item flex-column cp" @click="onYABHClick(1)">
              <div class="dbh-img"></div>
              <span style="margin-top: -5px; margin-left: 15px">点标绘</span>
            </div>
          </div>
          <div class="yabh-bg1 flex-column" v-if="submitForm.type === '3'">
            <div class="xbh-item flex-column cp" @click="onYABHClick(2)">
              <div class="xbh-img"></div>
              <span style="margin-top: -4px; margin-left: 9px">路线标绘</span>
            </div>
          </div>
          <div class="mbh-box" v-if="isMBH">
            <div class="mbh-head flex-row cp" @click="onYABHBack(1)">
              面标绘
            </div>
            <div class="mbh-content">
              <!-- <div class="jx-item flex-row cp" @click="onMBHClick(1)">矩形</div> -->
              <div class="yx-item flex-row cp" @click="onMBHClick(2)">圆形</div>
              <div class="dbx-item flex-row cp" @click="onMBHClick(3)">
                多边形
              </div>
            </div>
          </div>
          <div class="mbh-box" v-if="isJYBH">
            <div class="mbh-head flex-row cp" @click="onYABHBack(2)">
              警用标绘
            </div>
            <div class="mbh-content">
              <div class="kkxj-item flex-row cp" @click="onJYBHClick(1)">
                卡口相机
              </div>
              <div class="gdxj-item flex-row cp" @click="onJYBHClick(2)">
                高点相机
              </div>
              <div class="jjbn-item flex-row cp" @click="onJYBHClick(3)">
                紧急避难
              </div>
              <div class="jqr-item flex-row cp" @click="onJYBHClick(4)">
                机器人
              </div>
              <div class="mj-item flex-row cp" @click="onJYBHClick(5)">
                民警
              </div>
              <div class="fj-item flex-row cp" @click="onJYBHClick(6)">
                辅警
              </div>
              <div class="jc-item flex-row cp" @click="onJYBHClick(7)">
                警车
              </div>
              <div class="ptu-item flex-row cp" @click="onJYBHClick(8)">
                PTU
              </div>
              <div class="wrj-item flex-row cp" @click="onJYBHClick(9)">
                无人机
              </div>
            </div>
          </div>
          <span class="yabh-title">场景漫游</span>
          <div class="cjmy-bg flex-row">
            <div class="xlmy-item column-center cp" @click="onCJXXClick(1)">
              <span>线路漫游</span>
            </div>
            <div
              class="ddrf-item column-center cp"
              style="margin: 0 40px"
              @click="onCJXXClick(2)"
            >
              <span>定点绕飞</span>
            </div>
            <div class="sjsd-item column-center cp" @click="onCJXXClick(3)">
              <span>视角锁定</span>
            </div>
          </div>
          <div class="bcya-btn row-center cp" @click="saveYA">保存预案</div>
        </div>
        <!-- 活动安保 -->
        <div
          v-if="
            yalxSelectIndex === 2 ||
            yalxSelectIndex === 3 ||
            yalxSelectIndex === 4
          "
        >
          <div class="hdab-head"></div>
          <div class="hdab-box">
            <div class="hdab-item flex-row">
              <img
                class="hdab-tip"
                src="../../assets/images/panel/hdab-tip.png"
                alt=""
              />
              <span>日常活动安保防控(一)</span>
            </div>
            <div class="hdab-item flex-row" style="margin-top: 3px">
              <img
                class="hdab-tip"
                src="../../assets/images/panel/hdab-tip.png"
                alt=""
              />
              <span>日常活动安保防控(二)</span>
            </div>
            <div class="hdab-item flex-row" style="margin-top: 3px">
              <img
                class="hdab-tip"
                src="../../assets/images/panel/hdab-tip.png"
                alt=""
              />
              <span>日常活动安保防控(三)</span>
            </div>
          </div>
          <div class="zbjl-head"></div>
          <div class="zbjl-box flex-row">
            <div class="pie-charts">
              <pie-chart-1 />
            </div>
            <div class="flex-column">
              <div
                class="zbjl-item flex-row"
                v-for="(item, index) in zbjlList"
                :key="index"
              >
                <el-checkbox
                  v-model="item.checked"
                  style="margin-right: 9px"
                  @change="changeZBJL(item)"
                ></el-checkbox>
                <span class="max-w" style="width: 60px; margin-right: 7px">{{
                  item.name
                }}</span>
                <span>{{ item.count }}</span>
              </div>
            </div>
          </div>
          <div class="zdjlys-text">重点警力要素</div>
          <div class="zdjlys-box">
            <div
              class="zdjlys-item flex-row"
              v-for="(item, index) in zdjlysList"
              :key="index"
            >
              <el-checkbox
                v-model="item.checked"
                style="margin: 0 15px 0 20px"
                @change="changeZDJLYS(item)"
              ></el-checkbox>
              <span class="max-w" style="width: 100px; margin-right: 7px">{{
                item.name
              }}</span>
              <span>{{ item.count }}</span>
            </div>
          </div>
          <div class="zdjlys-text">视频监控</div>
          <div class="zdjlys-box">
            <div
              class="zdjlys-item flex-row"
              v-for="(item, index) in spjkList"
              :key="index"
            >
              <el-checkbox
                v-model="item.checked"
                style="margin: 0 15px 0 20px"
                @change="changeSPJK(item)"
              ></el-checkbox>
              <span class="max-w" style="width: 100px; margin-right: 7px">{{
                item.name
              }}</span>
              <span>{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="left-out" v-show="showLeftPanel"></div>
    <div class="tool-box flex-row" v-show="showLeftPanel">
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
import BarChart from "./components/BarChart.vue";
import PieChart from "./components/PieChart.vue";
import PieChart1 from "./components/PieChart1.vue";
import { getCurrentDate } from "@/utils/index";
import vueSeamlessScroll from "vue-seamless-scroll";
// 感知融合
import { getDeviceStatistics } from "@/api/panel";
// 日常防控
import {
  getYAStatistics,
  getYAList,
  getSingleYAInfo,
  deleteSingleYAInfo,
  addYAInfo,
} from "@/api/panel";

export default {
  dicts: ["point_type", "police_forces_plan_type"],
  components: {
    BarChart,
    PieChart,
    PieChart1,
    vueSeamlessScroll,
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
  watch: {
    currentIndex(val) {
      this.getPageRequest(val);
    },
  },
  data() {
    return {
      showLeftPanel: true,
      showTool: false,
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
      currentDate: "",
      tableData: [],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 15,
      },
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
          img: require("../../assets/images/gzrh/mckb.png"),
          name: "门窗开闭",
          count: 0,
        },
        {
          img: require("../../assets/images/gzrh/rtrq.png"),
          name: "人体入侵",
          count: 0,
        },
        {
          img: require("../../assets/images/gzrh/jg.png"),
          name: "井盖",
          count: 0,
        },
        {
          img: require("../../assets/images/gzrh/qtjc.png"),
          name: "气体检测",
          count: 0,
        },
        {
          img: require("../../assets/images/gzrh/hzyg.png"),
          name: "火灾烟感",
          count: 0,
        },
        {
          img: require("../../assets/images/gzrh/spjk.png"),
          name: "视频监控",
          count: 0,
        },
        {
          img: require("../../assets/images/gzrh/sjbj.png"),
          name: "水浸报警",
          count: 0,
        },
        {
          img: require("../../assets/images/gzrh/sos.png"),
          name: "SOS报警",
          count: 0,
        },
      ],
      showCharts: false,
      chartData: [],
      showChartsData: [],

      // 日常防控
      yazlLists: [
        {
          name: "活动安保",
          count: 0,
          image: require("../../assets/images/panel/icon-hdab.png"),
        },
        {
          name: "线路安保",
          count: 0,
          image: require("../../assets/images/panel/icon-xlab.png"),
        },
        {
          name: "重点区域",
          count: 0,
          image: require("../../assets/images/panel/icon-zdqy.png"),
        },
        {
          name: "防护圈管理",
          count: 0,
          image: require("../../assets/images/panel/icon-fhqgl.png"),
        },
      ],
      yaglList: [],
      zbjlList: [
        {
          checked: false,
          name: "民警",
          count: 2,
          type: 1,
          positions: [
            {
              lon: 117.45185171401579,
              lat: 31.873972670719144,
            },
            {
              lon: 117.45015493162616,
              lat: 31.874024134876297,
            },
          ],
        },
        {
          checked: false,
          name: "辅警",
          count: 1,
          type: 2,
          positions: [
            {
              lon: 117.44644233886261,
              lat: 31.873768526628094,
            },
          ],
        },
        {
          checked: false,
          name: "警车",
          count: 1,
          type: 3,
          positions: [
            {
              lon: 117.4482205168896,
              lat: 31.873672222616786,
            },
          ],
        },
        {
          checked: false,
          name: "PTU",
          count: 1,
          type: 4,
          positions: [
            {
              lon: 117.44840921681349,
              lat: 31.87000861666366,
            },
          ],
        },
        {
          checked: false,
          name: "无人机",
          count: 1,
          type: 5,
          positions: [
            {
              lon: 117.45341061085924,
              lat: 31.87241965720725,
            },
          ],
        },
        {
          checked: false,
          name: "机器人",
          count: 1,
          type: 6,
          positions: [
            {
              lon: 117.44585389518002,
              lat: 31.869552951899482,
            },
          ],
        },
      ],
      zdjlysList: [
        {
          checked: false,
          name: "卡口相机",
          count: 2,
          type: 1,
          positions: [
            {
              lon: 117.45003070579997,
              lat: 31.873611342725727,
            },
            {
              lon: 117.44500899380988,
              lat: 31.8729489306571,
            },
          ],
        },
        {
          checked: false,
          name: "高点相机",
          count: 3,
          type: 2,
          positions: [
            {
              lon: 117.45109430349913,
              lat: 31.873290288848903,
            },
            {
              lon: 117.4510853191374,
              lat: 31.87253863852136,
            },
            {
              lon: 117.45128583017122,
              lat: 31.871590543448203,
            },
          ],
        },
        {
          checked: false,
          name: "紧急避难",
          count: 3,
          type: 3,
          positions: [
            {
              lon: 117.44585389518002,
              lat: 31.869552951899482,
            },
          ],
        },
      ],
      spjkList: [
        {
          checked: false,
          name: "人脸卡口",
          count: 3,
          type: 1,
          positions: [
            {
              lon: 117.4493173111573,
              lat: 31.870600525565386,
            },
            {
              lon: 117.44955513122446,
              lat: 31.870953134435155,
            },
            {
              lon: 117.44896330116887,
              lat: 31.87100176002326,
            },
          ],
        },
        {
          checked: false,
          name: "车辆卡口",
          count: 3,
          type: 2,
          positions: [
            {
              lon: 117.44615480210135,
              lat: 31.869749794795332,
            },
            {
              lon: 117.44720082112126,
              lat: 31.870378400965055,
            },
            {
              lon: 117.4470581413858,
              lat: 31.870932644985498,
            },
          ],
        },
        {
          checked: false,
          name: "全景监控",
          count: 2,
          type: 3,
          positions: [
            {
              lon: 117.44832809950347,
              lat: 31.87306587380741,
            },
            {
              lon: 117.45082019052406,
              lat: 31.871491156171487,
            },
          ],
        },
        {
          checked: false,
          name: "高空瞭望",
          count: 2,
          type: 4,
          positions: [
            {
              lon: 117.44849384182116,
              lat: 31.871863869373886,
            },
            {
              lon: 117.45067591511605,
              lat: 31.870722992822625,
            },
          ],
        },
        {
          checked: false,
          name: "社会资源",
          count: 3,
          type: 5,
          positions: [
            {
              lon: 117.44585389518002,
              lat: 31.869552951899482,
            },
          ],
        },
      ],
      isAddYA: false,
      submitForm: {},
      isMBH: false,
      isJYBH: false,

      startLonLat: "",
      endLonLat: "",
    };
  },
  mounted() {
    setInterval(() => {
      this.currentDate = this.getCurrentDate();
    }, 1000);
    this.getPageRequest(this.currentIndex);
  },
  methods: {
    handelLeftPanel() {
      this.showLeftPanel = !this.showLeftPanel;
    },
    getCurrentDate,
    getPageRequest(currentIndex) {
      if (currentIndex === 1) {
        this.getDeviceStatistics();
      } else if (currentIndex === 4) {
        this.getYAStatistics();
        this.getYAList();
      }
    },
    // 分页
    handleSizeChange(limit) {
      this.queryForm.pageNum = 1;
      this.queryForm.pageSize = limit;
      if (this.currentIndex === 4) {
        this.getYAList();
      }
    },
    handleCurrentChange(page) {
      this.queryForm.pageNum = page;
      if (this.currentIndex === 4) {
        this.getYAList();
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

    //左侧绘制工具
    onShowTool() {
      this.showTool = !this.showTool;
    },
    createPoint() {
      this.showTool = false;
      this.$emit("createPoint");
    },
    createLine() {
      this.showTool = false;
      this.$emit("createLine");
    },
    createCircle() {
      this.showTool = false;
      this.$emit("createCircle");
    },
    createPolygon() {
      this.showTool = false;
      this.$emit("createPolygon");
    },

    /**
     * 感知融合模块
     */
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

    /**
     * 日常防控模块
     */
    getYAStatistics() {
      getYAStatistics().then((response) => {
        if (response.data !== 0) {
          response.data.forEach((item, index) => {
            this.$set(this.yazlLists[index], "count", item.count);
          });
        }
      });
    },
    getYAList() {
      this.queryForm.pageSize = 8;
      getYAList(this.queryForm).then((response) => {
        this.yaglList = response.rows;
        this.total = response.total;
        if (this.yaglList.length !== 0) {
          this.onDetailYA(this.yaglList[0], 0);
        }
      });
    },
    onDetailYA(item) {
      getSingleYAInfo(item.id).then((response) => {
        let currentYAInfo = response.data;
        let obj = {
          currentYAInfo,
        };
        bus.$emit("updateCurrentYAInfo", obj);
      });
    },
    onEditYA(item) {
      // this.isAddYA = true;
      // bus.$emit("isAddYA", this.isAddYA);
      // getSingleYAInfo(item.id).then((response) => {
      //   this.submitForm = response.data;
      //   bus.$emit("updateCurrentYAInfo", this.submitForm);
      // });
    },
    onDeleteYA(item) {
      this.$confirm("确定要删除此预案吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteSingleYAInfo(item.id).then((response) => {
            this.$message.success("预案删除成功");
            this.getYAList();
          });
        })
        .catch(() => {});
    },
    saveYA() {
      if (!this.submitForm.type) {
        return this.$message.error("请选择预案类型");
      }
      if (!this.submitForm.name) {
        return this.$message.error("请输入预案名称");
      }
      if (!this.submitForm.directorName) {
        return this.$message.error("请输入预案负责人");
      }
      if (!this.submitForm.phone) {
        return this.$message.error("请输入联系电话");
      }
      if (!this.submitForm.address) {
        return this.$message.error("请输入预案地址");
      }
      let addArr = [];
      let obj1 = {
        type: "1",
        list: JSON.parse(localStorage.getItem("dbhList")),
      };
      addArr.push(obj1);
      let obj2 = {
        type: "2",
        list: JSON.parse(localStorage.getItem("xbhList")),
      };
      addArr.push(obj2);
      let obj3 = {
        type: "3",
        list: JSON.parse(localStorage.getItem("mbhList")),
      };
      addArr.push(obj3);
      let obj4 = {
        type: "4",
        list: JSON.parse(localStorage.getItem("tbhList")),
      };
      addArr.push(obj4);
      let obj5 = {
        type: "5",
        list: JSON.parse(localStorage.getItem("jybhList")),
      };
      addArr.push(obj5);
      let obj10 = {
        type: "10",
        list: JSON.parse(localStorage.getItem("xlmyList")),
      };
      addArr.push(obj10);
      let obj11 = {
        type: "11",
        list: JSON.parse(localStorage.getItem("ddrfList")),
      };
      addArr.push(obj11);
      let obj12 = {
        type: "12",
        list: JSON.parse(localStorage.getItem("sjsdList")),
      };
      addArr.push(obj12);
      this.submitForm.plotInfo = JSON.stringify(addArr);
      addYAInfo(this.submitForm).then((response) => {
        if (response.code === 200) {
          this.$message.success("预案新增成功");
          this.isAddYA = false;
          this.submitForm = {};
          bus.$emit("isAddYA", this.isAddYA);
          this.queryForm.pageNum = 1;
          this.getYAList();
        }
      });
    },
    changeZBJL(item) {
      this.$emit("checkZBJLType", item);
    },
    changeZDJLYS(item) {
      this.$emit("checkZDJLYSType", item);
    },
    changeSPJK(item) {
      this.$emit("checkSPJKType", item);
    },
    onAddYA() {
      this.isAddYA = true;
      bus.$emit("isAddYA", this.isAddYA);
    },
    onBack() {
      this.isAddYA = false;
      this.submitForm = {};
      bus.$emit("isAddYA", this.isAddYA);
      this.getYAList();
    },
    selectPoint(idx) {
      this.$emit("selectPoint", idx);
    },
    onYABHClick(idx) {
      switch (idx) {
        case 1:
          this.$emit("addDBH");
          break;
        case 2:
          if (!this.startLonLat || !this.endLonLat) {
            this.$message.error("请先选择起点和终点");
            break;
          }
          this.$emit("addXBH");
          break;
        case 3:
          this.isMBH = true;
          break;
        case 4:
          this.$emit("addTBH");
          break;
        case 5:
          this.isJYBH = true;
          break;

        default:
          break;
      }
    },
    onYABHBack(idx) {
      switch (idx) {
        case 1:
          this.isMBH = false;
          break;
        case 2:
          this.isJYBH = false;
          break;

        default:
          break;
      }
    },
    onMBHClick(idx) {
      this.$emit("addMBH", idx);
    },
    onJYBHClick(idx) {
      this.$emit("addJYBH", idx);
    },
    onCJXXClick(idx) {
      switch (idx) {
        case 1:
          this.$emit("addXLMY");
          break;
        case 2:
          this.$emit("addDDRF");
          break;
        case 3:
          this.$emit("addSJSD");
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
}
.column-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.flex-sb {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
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
  // 感知融合
  .gzrh {
    .sbgl-head {
      width: 405px;
      height: 37px;
      background: url("../../assets/images/gzrh/sbgl-head.png");
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
        background: url("../../assets/images/gzrh/sbsl-bg.png");
        background-size: 100% 100%;
      }
      .sbyc-bg {
        width: 94px;
        height: 107px;
        background: url("../../assets/images/gzrh/sbyc-bg.png");
        background-size: 100% 100%;
      }
      .sbyj-bg {
        width: 94px;
        height: 107px;
        background: url("../../assets/images/gzrh/sbyj-bg.png");
        background-size: 100% 100%;
      }
    }
    .yj-box {
      margin-top: 20px;
      margin-left: 30px;
      .yj-bg {
        width: 180px;
        height: 16px;
        background: url("../../assets/images/gzrh/yj-bg.png");
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
      background: url("../../assets/images/gzrh/gzsb-head.png");
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
          background: url("../../assets/images/gzrh/gzsb-bg.png");
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
  // 日常防控
  .rcfk {
    // 预案总览
    .yazl-head {
      width: 406px;
      height: 34px;
      background: url("../../assets/images/panel/yazl-head.png");
      background-size: 100% 100%;
      margin-left: 30px;
    }
    .yazl-box {
      display: flex;
      flex-wrap: wrap;
      width: 400px;
      margin-left: 30px;
      padding: 3px 5px;
      .yazl-item {
        width: 195px;
        margin-top: 25px;
        .yazl-img {
          width: 76px;
          height: 73px;
          margin-right: 16px;
        }
        .name-text {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #d4e2ff;
          line-height: 14px;
        }
        .count-text {
          font-size: 22px;
          line-height: 22px;
          font-family: YouSheBiaoTiHei;
          font-weight: 400;
          color: #bed3ff;
          margin-top: 14px;
          background: linear-gradient(to bottom, #fff 40%, #1189fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
    .yagl-head {
      width: 406px;
      height: 34px;
      background: url("../../assets/images/panel/yagl-head.png");
      background-size: 100% 100%;
      margin-top: 20px;
      margin-left: 30px;
    }
    .yagl-search {
      margin-top: 17px;
      margin-left: 30px;
      .search-box {
        width: 226px;
        height: 39px;
        background: url("../../assets/images/panel/yagl-search-bg.png");
        background-size: 100% 100%;
        margin-right: 21px;
        .search-btn {
          width: 15px;
          height: 15px;
          background: url("../../assets/images/panel/yagl-search.png");
          background-size: 100% 100%;
          margin-left: 13px;
          margin-right: 13px;
        }
      }
      .add-box {
        width: 116px;
        height: 38px;
        background: url("../../assets/images/panel/yagl-add-bg.png");
        background-size: 100% 100%;
        .add-img {
          width: 16px;
          height: 16px;
          margin-right: 11px;
        }
        .add-text {
          font-size: 14px;
          line-height: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #2899fd;
          background: linear-gradient(to bottom, #fff 55%, #1495f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      .select-box {
        width: 363px;
        height: 39px;
        padding-top: 2px;
        background: url("../../assets/images/panel/yagl-select-bg.png");
        background-size: 100% 100%;
        margin-top: 13px;
      }
    }
    .table-box {
      margin-top: 6px;
      margin-left: 30px;
      .table-head {
        width: 394px;
        height: 49px;
        padding: 0 7px;
        border-bottom: 2px dashed rgba(114, 173, 255, 0.2);
        font-size: 14px;
        line-height: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(212, 226, 255, 0.6);
      }
      .table-item {
        width: 394px;
        height: 49px;
        background: url("../../assets/images/panel/yagl-item-bg.png");
        background-size: 100% 100%;
        padding: 0 7px;
        margin-top: 3px;
        font-size: 14px;
        line-height: 15px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #9dbbea;
      }
    }

    // 新建预案
    .xjya-head {
      width: 406px;
      height: 34px;
      background: url("../../assets/images/panel/xjya-head.png");
      background-size: 100% 100%;
      margin-left: 30px;
    }
    .input-title {
      width: 110px;
      font-size: 16px;
      line-height: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #d4e2ff;
      text-align: right;
    }
    .input-bg {
      width: 280px;
      height: 35px;
      background: url("../../assets/images/panel/xjya-input-bg.png");
      background-size: 100% 100%;
      .start-point,
      .end-point {
        width: 18px;
        height: 18px;
        background: url("../../assets/images/panel/icon-sel-point.png");
        background-size: 100% 100%;
      }
    }
    .dashed-line {
      width: 368px;
      height: 2px;
      border: 2px dashed rgba(31, 110, 255, 0.3);
      margin-left: 30px;
      margin-top: 23px;
    }
    .yabh-title {
      display: inline-block;
      font-size: 16px;
      line-height: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #fff;
      margin-left: 30px;
      margin-top: 20px;
    }
    .yabh-bg {
      width: 440px;
      height: 310px;
      background: url("../../assets/images/panel/yabh-bg.png");
      background-size: 100% 100%;
      padding-top: 117px;
      font-size: 14px;
      line-height: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #d4e2ff;
      position: relative;
      .tbh-item {
        position: absolute;
        top: 117px;
        left: 26px;
        .tbh-img {
          width: 65px;
          height: 70px;
          background: url("../../assets/images/panel/tbh-item.png");
          background-size: 100% 100%;
          &:hover {
            background: url("../../assets/images/panel/tbh-item-hover.png");
          }
        }
      }
      .jybh-item {
        position: absolute;
        top: 117px;
        right: 22px;
        .jybh-img {
          width: 66px;
          height: 71px;
          background: url("../../assets/images/panel/jybh-item.png");
          background-size: 100% 100%;
          &:hover {
            background: url("../../assets/images/panel/jybh-item-hover.png");
          }
        }
      }
      .xbh-item {
        position: absolute;
        left: 74px;
        bottom: 41px;
        .xbh-img {
          width: 80px;
          height: 82px;
          background: url("../../assets/images/panel/xbh-item.png");
          background-size: 100% 100%;
          &:hover {
            background: url("../../assets/images/panel/xbh-item-hover.png");
          }
        }
      }
      .mbh-item {
        position: absolute;
        right: 82px;
        bottom: 41px;
        .mbh-img {
          width: 80px;
          height: 82px;
          background: url("../../assets/images/panel/mbh-item.png");
          background-size: 100% 100%;
          &:hover {
            background: url("../../assets/images/panel/mbh-item-hover.png");
          }
        }
      }
      .dbh-item {
        position: absolute;
        left: 175px;
        bottom: 17px;
        .dbh-img {
          width: 84px;
          height: 90px;
          background: url("../../assets/images/panel/dbh-item.png");
          background-size: 100% 100%;
          &:hover {
            background: url("../../assets/images/panel/dbh-item-hover.png");
          }
        }
      }
    }
    .yabh-bg1 {
      padding-top: 117px;
      font-size: 14px;
      line-height: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #d4e2ff;
      position: relative;
      .xbh-item {
        position: absolute;
        left: 45px;
        bottom: 0;
        .xbh-img {
          width: 80px;
          height: 82px;
          background: url("../../assets/images/panel/xbh-item.png");
          background-size: 100% 100%;
          &:hover {
            background: url("../../assets/images/panel/xbh-item-hover.png");
          }
        }
      }
    }
    .mbh-box {
      margin-top: 16px;
      margin-left: 30px;
      height: 310px;
      font-size: 16px;
      line-height: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #a0d8ff;
      .mbh-head {
        width: 362px;
        height: 32px;
        background: url("../../assets/images/panel/mbh-head.png");
        background-size: 100% 100%;
        padding-left: 31px;
      }
      .mbh-content {
        display: flex;
        flex-wrap: wrap;
        height: 280px;
        overflow: hidden;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        .jx-item {
          width: 171px;
          height: 53px;
          background: url("../../assets/images/panel/jx-item.png");
          background-size: 100% 100%;
          margin-top: 22px;
          margin-right: 22px;
          padding-left: 76px;
          &:hover {
            background: url("../../assets/images/panel/jx-item-hover.png");
          }
        }
        .yx-item {
          width: 171px;
          height: 53px;
          background: url("../../assets/images/panel/yx-item.png");
          background-size: 100% 100%;
          margin-top: 22px;
          margin-right: 22px;
          padding-left: 76px;
          &:hover {
            background: url("../../assets/images/panel/yx-item-hover.png");
          }
        }
        .dbx-item {
          width: 171px;
          height: 53px;
          background: url("../../assets/images/panel/dbx-item.png");
          background-size: 100% 100%;
          margin-top: 22px;
          padding-left: 76px;
          &:hover {
            background: url("../../assets/images/panel/dbx-item-hover.png");
          }
        }
        .kkxj-item {
          width: 171px;
          height: 53px;
          background: url("../../assets/images/panel/kkxj-item.png");
          background-size: 100% 100%;
          margin-top: 22px;
          margin-right: 22px;
          padding-left: 76px;
          &:hover {
            background: url("../../assets/images/panel/kkxj-item-hover.png");
          }
        }
        .gdxj-item {
          width: 171px;
          height: 53px;
          background: url("../../assets/images/panel/gdxj-item.png");
          background-size: 100% 100%;
          margin-top: 22px;
          padding-left: 76px;
          &:hover {
            background: url("../../assets/images/panel/gdxj-item-hover.png");
          }
        }
        .jjbn-item {
          width: 171px;
          height: 53px;
          background: url("../../assets/images/panel/jjbn-item.png");
          background-size: 100% 100%;
          margin-top: 22px;
          margin-right: 22px;
          padding-left: 76px;
          &:hover {
            background: url("../../assets/images/panel/jjbn-item-hover.png");
          }
        }
        .jqr-item {
          width: 171px;
          height: 53px;
          background: url("../../assets/images/panel/jqr-item.png");
          background-size: 100% 100%;
          margin-top: 22px;
          padding-left: 76px;
          &:hover {
            background: url("../../assets/images/panel/jqr-item-hover.png");
          }
        }
        .mj-item {
          width: 171px;
          height: 53px;
          background: url("../../assets/images/panel/mj-item.png");
          background-size: 100% 100%;
          margin-top: 22px;
          margin-right: 22px;
          padding-left: 76px;
          &:hover {
            background: url("../../assets/images/panel/mj-item-hover.png");
          }
        }
        .fj-item {
          width: 171px;
          height: 53px;
          background: url("../../assets/images/panel/fj-item.png");
          background-size: 100% 100%;
          margin-top: 22px;
          padding-left: 76px;
          &:hover {
            background: url("../../assets/images/panel/fj-item-hover.png");
          }
        }
        .jc-item {
          width: 171px;
          height: 53px;
          background: url("../../assets/images/panel/jc-item.png");
          background-size: 100% 100%;
          margin-top: 22px;
          margin-right: 22px;
          padding-left: 76px;
          &:hover {
            background: url("../../assets/images/panel/jc-item-hover.png");
          }
        }
        .ptu-item {
          width: 171px;
          height: 53px;
          background: url("../../assets/images/panel/ptu-item.png");
          background-size: 100% 100%;
          margin-top: 22px;
          padding-left: 76px;
          &:hover {
            background: url("../../assets/images/panel/ptu-item-hover.png");
          }
        }
        .wrj-item {
          width: 171px;
          height: 53px;
          background: url("../../assets/images/panel/wrj-item.png");
          background-size: 100% 100%;
          margin-top: 22px;
          margin-right: 22px;
          padding-left: 76px;
          &:hover {
            background: url("../../assets/images/panel/wrj-item-hover.png");
          }
        }
      }
    }
    .cjmy-bg {
      margin-top: 25px;
      margin-left: 58px;
      font-size: 14px;
      line-height: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #b4daff;
      .xlmy-item {
        width: 90px;
        height: 100px;
        background: url("../../assets/images/panel/xlmy-item.png");
        background-size: 100% 100%;
        padding-top: 65px;
        &:hover {
          color: #fff;
          background: url("../../assets/images/panel/xlmy-item-hover.png");
        }
      }
      .ddrf-item {
        width: 90px;
        height: 100px;
        background: url("../../assets/images/panel/ddrf-item.png");
        background-size: 100% 100%;
        padding-top: 65px;
        &:hover {
          color: #fff;
          background: url("../../assets/images/panel/ddrf-item-hover.png");
        }
      }
      .sjsd-item {
        width: 90px;
        height: 100px;
        background: url("../../assets/images/panel/sjsd-item.png");
        background-size: 100% 100%;
        padding-top: 65px;
        &:hover {
          color: #fff;
          background: url("../../assets/images/panel/sjsd-item-hover.png");
        }
      }
    }
    .bcya-btn {
      width: 116px;
      height: 38px;
      background: url("../../assets/images/panel/bcya-btn.png");
      background-size: 100% 100%;
      margin-left: 30px;
      margin-top: 30px;
      font-size: 16px;
      line-height: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #fff;
    }

    // 活动安保
    .hdab-head {
      width: 406px;
      height: 34px;
      background: url("../../assets/images/panel/hdab-head.png");
      background-size: 100% 100%;
      margin-left: 30px;
    }
    .hdab-box {
      margin-left: 30px;
      .hdab-item {
        width: 393px;
        height: 62px;
        background: url("../../assets/images/panel/hdab-item.png");
        background-size: 100% 100%;
        font-size: 16px;
        line-height: 16px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #b0caff;
        cursor: pointer;
        &:hover {
          color: #fff;
          background: url("../../assets/images/panel/hdab-item-hover.png");
        }
        .hdab-tip {
          width: 26px;
          height: 26px;
          margin-left: 27px;
          margin-right: 7px;
        }
      }
    }
    .zbjl-head {
      width: 406px;
      height: 34px;
      background: url("../../assets/images/panel/zbjl-head.png");
      background-size: 100% 100%;
      margin-top: 20px;
      margin-left: 30px;
    }
    .zbjl-box {
      margin-left: 30px;
      width: 374px;
      height: 233px;
      .pie-charts {
        width: 246px;
        height: 226px;
        margin-top: 20px;
      }
      .zbjl-item {
        font-size: 14px;
        line-height: 16px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #9dbbea;
        margin-bottom: 10px;
      }
    }
    .zdjlys-text {
      font-size: 16px;
      line-height: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #fff;
      margin-top: 13px;
      margin-left: 30px;
    }
    .zdjlys-box {
      display: flex;
      flex-wrap: wrap;
      margin-top: 13px;
      margin-left: 30px;
      .zdjlys-item {
        width: 189px;
        height: 57px;
        background: url("../../assets/images/panel/zdjlys-item-bg.png");
        background-size: 100% 100%;
        margin-right: 13px;
        margin-bottom: 7px;
        font-size: 14px;
        line-height: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #bdd7ff;
        cursor: pointer;
        &:hover {
          background: url("../../assets/images/panel/zdjlys-item-hover-bg.png");
        }
        &:nth-child(2n) {
          margin-right: 0;
        }
      }
    }
  }
}
.max-w {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  cursor: pointer;
}
.left-out {
  position: absolute;
  top: 161px;
  left: 409px;
  width: 174px;
  height: calc(100% - 316px);
  background: url("../../assets/images/panel/left-out.png");
  background-size: 100% 100%;
}
.tool-box {
  position: absolute;
  top: 175px;
  left: 498px;
  .tool-btn {
    width: 50px;
    height: 36px;
    background: url("../../assets/images/panel/tool-btn-c.png");
    background-size: 100% 100%;
    &:hover {
      background: url("../../assets/images/panel/tool-btn-s.png");
      background-size: 100% 100%;
    }
  }
  .tool-select {
    width: 204px;
    height: 36px;
    background: url("../../assets/images/panel/tool-select-bg.png");
    background-size: 100% 100%;
    padding: 0 25px 0 18px;
    .point-btn {
      width: 20px;
      height: 20px;
      background: url("../../assets/images/panel/point-sel-c.png");
      background-size: 100% 100%;
      margin-right: 27px;
      &:hover {
        background: url("../../assets/images/panel/point-sel-s.png");
        background-size: 100% 100%;
      }
    }
    .line-btn {
      width: 20px;
      height: 20px;
      background: url("../../assets/images/panel/line-sel-c.png");
      background-size: 100% 100%;
      margin-right: 27px;
      &:hover {
        background: url("../../assets/images/panel/line-sel-s.png");
        background-size: 100% 100%;
      }
    }
    .circle-btn {
      width: 20px;
      height: 20px;
      background: url("../../assets/images/panel/circle-sel-c.png");
      background-size: 100% 100%;
      margin-right: 27px;
      &:hover {
        background: url("../../assets/images/panel/circle-sel-s.png");
        background-size: 100% 100%;
      }
    }
    .polygon-btn {
      width: 20px;
      height: 20px;
      background: url("../../assets/images/panel/polygon-sel-c.png");
      background-size: 100% 100%;
      &:hover {
        background: url("../../assets/images/panel/polygon-sel-s.png");
        background-size: 100% 100%;
      }
    }
  }
}

// 修改elementui样式
::v-deep .el-input__inner {
  background-color: transparent !important;
  border-color: transparent !important;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #aed8ee;
  line-height: 14px;
}
::v-deep .el-select {
  position: relative;
  .el-input {
    input {
      border-color: transparent;
      color: #d4e2ff;
    }
  }
}
::v-deep .el-select-dropdown {
  background: #0d2031;
  border-color: #2d85b4;
}
::v-deep .el-select .el-input.is-focus .el-input__inner {
  border-color: transparent;
}
::v-deep .el-popper[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: #0d2031;
}
::v-deep .el-select-dropdown__item {
  color: #fff;
}
::v-deep .el-select-dropdown__item.selected {
  color: #fff;
}
::v-deep .el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #18344e;
}
::v-deep .el-input__suffix {
  .el-input__suffix-inner {
    .el-icon-arrow-up:before {
      color: #d4deeb;
    }
  }
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