<template>
  <div class="full-box">
    <div id="sdkContainer"></div>
    <div :style="{ zoom: zoomScale }">
      <div class="top-bg"></div>
      <div class="bottom-bg">
        <div :class="[currentIndex === 1 ? 'gzrh-btn-s' : 'gzrh-btn-c']" class="cp" @click="onSelectIndex(1)"></div>
        <div :class="[currentIndex === 2 ? 'tszl-btn-s' : 'tszl-btn-c']" class="cp" @click="onSelectIndex(2)"></div>
        <div :class="[currentIndex === 3 ? 'zhdd-btn-s' : 'zhdd-btn-c']" class="cp" @click="onSelectIndex(3)"></div>
        <div :class="[currentIndex === 4 ? 'rcfk-btn-s' : 'rcfk-btn-c']" class="cp" @click="onSelectIndex(4)"></div>
      </div>
      <aside-left ref="left" :currentIndex="currentIndex" @createPoint="createPoint" @createLine="createLine"
        @createCircle="createCircle" @createPolygon="createPolygon" :yalxSelectIndex="yalxSelectIndex"
        @checkZBJLType="onCheckZBJLType($event)" @checkZDJLYSType="onCheckZDJLYSType($event)"
        @checkSPJKType="onCheckSPJKType($event)" @selectPoint="selectPoint($event)" @addDBH="addDBH" @addXBH="addXBH"
        @addMBH="addMBH($event)" @addTBH="addTBH" @addJYBH="addJYBH($event)" @addXLMY="addXLMY" @addDDRF="addDDRF"
        @addSJSD="addSJSD"></aside-left>
      <aside-right ref="right" :currentIndex="currentIndex" :yalxSelectIndex="yalxSelectIndex" @showPOI="onShowPOI"
        @showSPJK="onShowSPJK" @showWLSB="onShowWLSB" @showSearchBox="onShowSearchBox" @showAlert="onShowAlert($event)"
        @showFault="onShowFault($event)" @showYABH="onShowYABH($event)" @viewAddYABH="onViewAddYABH($event)"
        @delAddYABH="onDelAddYABH($event)" @showCJXX="onShowCJXX($event)" @clearAll="onClearAll"></aside-right>

      <div class="search-box flex-row" v-if="showSearchBox">
        <el-input style="width: calc(100% - 50px)" v-model="keyword" clearable placeholder="请输入你想搜索的内容"></el-input>
        <div class="search-btn cp"></div>
      </div>
      <div class="yalx-box" v-if="showYALX">
        <div :class="[yalxSelectIndex === 1 ? 'yazl-btn-s' : 'yazl-btn', 'cp']" style="margin-right: 27px"
          @click="onYazlSelect(1)"></div>
        <div :class="[yalxSelectIndex === 2 ? 'hdab-btn-s' : 'hdab-btn', 'cp']" style="margin-right: 28px"
          @click="onYazlSelect(2)"></div>
        <div :class="[yalxSelectIndex === 3 ? 'zdqy-btn-s' : 'zdqy-btn', 'cp']" style="margin-right: 27px"
          @click="onYazlSelect(3)"></div>
        <div :class="[yalxSelectIndex === 4 ? 'fhqgl-btn-s' : 'fhqgl-btn', 'cp']" @click="onYazlSelect(4)"></div>
      </div>
    </div>
    <div :style="{ zoom: zoomScale }" class="poi-board" v-if="showPOI">
      <div class="poi-head flex-sb">
        <span class="head-text">POI信息</span>
        <img class="poi-close cp" src="../../assets/images/panel/tcmb-close.png" alt="" @click="showPOI = false" />
      </div>
      <div class="poi-content">
        <el-tree ref="poiTree" :data="poiTrees" show-checkbox node-key="id" :default-expand-all="true"
          :props="defaultProps" @check="handleNodeClickPoi">
        </el-tree>
      </div>
    </div>
    <div :style="{ zoom: zoomScale }" class="wlsb-board" v-if="showWLSB">
      <div class="wlsb-head flex-sb">
        <span class="head-text">物联设备</span>
        <img class="wlsb-close cp" src="../../assets/images/panel/tcmb-close.png" alt="" @click="showWLSB = false" />
      </div>
      <div class="wlsb-content">
        <el-tree ref="deviceTree" :data="deviceTrees" show-checkbox node-key="id" :default-expand-all="true"
          :props="defaultProps" @check="handleNodeClickDevice">
        </el-tree>
      </div>
    </div>
    <!-- 告警提示 -->
    <div :style="{ zoom: zoomScale }" class="gjts-box flex-column" v-if="showAlert">
      <div class="gjts-head">
        <div class="gjts-close" @click="showAlert = false"></div>
      </div>
      <div class="gjts-content flex-row">
        <div class="flex-column">
          <div class="zpt-box">
            <el-image style="width: 185px; height: 120px" :src="viewMiniOImage(gjtsObj.image)"
              :preview-src-list="[viewMiniOImage(gjtsObj.image)]"></el-image>
            <div class="tip-box row-center">告警图片</div>
          </div>
          <div class="zpt-box" style="margin-top: 10px">
            <el-image style="width: 185px; height: 120px" :src="viewMiniOImage(gjtsObj.installPic)"
              :preview-src-list="[viewMiniOImage(gjtsObj.installPic)]"></el-image>
            <div class="tip-box row-center">安装图片</div>
          </div>
        </div>
        <div class="flex-column">
          <div class="flex-row">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="gjts-text">点位名称：{{ gjtsObj.pointName }}</span>
          </div>
          <div class="flex-row" style="margin-top: 8px">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="gjts-text" :title="gjtsObj.installPosition">告警内容：{{ gjtsObj.content }}</span>
          </div>
          <div class="flex-row" style="margin-top: 8px">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="gjts-text">告警时间：{{ gjtsObj.alertTime }}</span>
          </div>
          <div class="flex-row" style="margin-top: 8px">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="gjts-text">设备类型：{{ gjtsObj.deviceTypeName }}</span>
          </div>
          <div class="flex-row" style="margin-top: 8px">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="gjts-text" :title="gjtsObj.installPosition">安装位置：{{ gjtsObj.installPosition }}</span>
          </div>
          <div class="flex-row" style="margin-top: 20px; margin-left: 35px">
            <el-radio-group v-model="radio">
              <el-radio :label="1">处理</el-radio>
              <el-radio :label="2">误报</el-radio>
            </el-radio-group>
          </div>
          <div class="flex-row" style="margin-top: 13px; margin-left: 20px">
            <div class="gjts-btn-bg row-center cp" @click="onSubmitDeal">
              提交
            </div>
            <div class="gjts-btn-bg row-center cp" @click="onShowVideo">
              视频监控
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 感知设备信息 -->
    <div :style="{ zoom: zoomScale }" class="gzsb-box flex-column" v-if="showDeviceInfo">
      <div class="gzsb-head">
        <div class="gzsb-close" @click="showDeviceInfo = false"></div>
      </div>
      <div class="gzsb-content flex-row" style="align-items: flex-start">
        <div class="zpt-box">
          <el-image style="width: 185px; height: 120px" :src="viewMiniOImage(gzsbObj.installPic)"
            :preview-src-list="[viewMiniOImage(gzsbObj.installPic)]"></el-image>
          <div class="tip-box row-center">安装位置</div>
        </div>
        <div class="flex-column">
          <div class="flex-row">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="gzsb-text">设备编码：{{ gzsbObj.devaddr }}</span>
          </div>
          <div class="flex-row" style="margin-top: 10px">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="gzsb-text">设备类型：{{ gzsbObj.deviceTypeName }}</span>
          </div>
          <div class="flex-row" style="margin-top: 10px" v-if="showContent">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="gzsb-text" :title="gzsbObj.installPosition">异常内容：{{ gzsbObj.content ? gzsbObj.content : "暂无"
            }}</span>
          </div>
          <div class="flex-row" style="margin-top: 10px">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="gzsb-text">经纬度：{{ gzsbObj.longitude.toFixed(6) }},{{
              gzsbObj.latitude.toFixed(6)
            }}</span>
          </div>
          <div class="flex-row" style="margin-top: 10px">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="gzsb-text" :title="gzsbObj.installPosition">安装位置：{{ gzsbObj.installPosition }}</span>
          </div>
          <div class="flex-row" style="margin-top: 10px">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="gzsb-text">当前状态：<span :style="{
              color: gzsbObj.online === 1 ? '#03FFFE' : '#FF4E4F',
            }">{{ gzsbObj.online === 1 ? "在线" : "离线" }}</span></span>
          </div>
          <div class="flex-row" style="margin-top: 10px">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="gzsb-text">告警规则：<span :style="{
              color: gzsbObj.openAlert === 1 ? '#03FFFE' : '#FF4E4F',
            }">{{ gzsbObj.openAlert === 1 ? "开启" : "关闭" }}</span></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 点位概况 -->
    <div :style="{ zoom: zoomScale }" class="dwgk-box flex-column" v-if="showPointInfo">
      <div class="dwgk-head">
        <div class="dwgk-close" @click="showPointInfo = false"></div>
      </div>
      <div class="dwgk-tab-box flex-row">
        <div :class="[dwgkTabIndex === 1 ? 'select-item-bg' : '']" class="tab-item" @click="dwgkTabClick(1)">
          属性信息
        </div>
        <div :class="[dwgkTabIndex === 2 ? 'select-item-bg' : '']" class="tab-item" @click="dwgkTabClick(2)">
          设备情况
        </div>
        <div :class="[dwgkTabIndex === 3 ? 'select-item-bg' : '']" class="tab-item" @click="dwgkTabClick(3)">
          设备运行情况
        </div>
      </div>
      <div v-if="dwgkTabIndex === 1">
        <div class="table-head table-text flex-row">
          <span style="margin-left: 28px; width: 122px">属性名称</span>
          <span style="margin-left: 28px; width: 375px">属性信息</span>
        </div>
        <div class="table-box">
          <div :class="[(index + 1) % 2 === 0 ? 'bg2' : 'bg1']" class="table-item table-text flex-row cp"
            v-for="(item, index) in pointBuilingList" :key="item.id">
            <span class="max-w" style="margin-left: 28px; width: 122px">{{
              item.propertyName
            }}</span>
            <span class="max-w" style="margin-left: 28px; width: 375px" :title="item.propertyContent">{{
              item.propertyContent ? item.propertyContent : "--" }}</span>
          </div>
        </div>
      </div>
      <div v-if="dwgkTabIndex === 2">
        <div class="table-head table-text flex-row">
          <span style="margin-left: 80px; width: 200px">设备类型</span>
          <span style="margin-left: 13px; width: 261px">数量</span>
        </div>
        <div class="table-box">
          <div :class="[(index + 1) % 2 === 0 ? 'bg2' : 'bg1']" class="table-item table-text flex-row cp"
            v-for="(item, index) in deviceLists" :key="index">
            <span class="max-w" style="margin-left: 80px; width: 200px" :title="item.name">{{ item.typeName }}</span>
            <span class="max-w" style="margin-left: 13px; width: 261px" :title="item.value">{{ item.deviceCount }}</span>
          </div>
        </div>
      </div>
      <div v-if="dwgkTabIndex === 3">
        <div class="flex-row" style="margin-left: 36px">
          <div class="sbyc-bg flex-row" style="margin-right: 64px">
            <span class="title-text" style="margin-right: 30px">设备异常</span>
            <span class="count-text">{{ wariningCount }}</span>
          </div>
          <div class="sbyj-bg flex-row">
            <span class="title-text" style="margin-right: 30px">设备预警</span>
            <span class="count-text" style="color: #ff4e4f">{{
              alertCount
            }}</span>
          </div>
        </div>
        <div class="table-head table-text flex-row" style="margin-top: 20px">
          <span style="margin-left: 12px; width: 135px">告警类型</span>
          <span style="width: 135px">告警内容</span>
          <span style="width: 200px">告警时间</span>
          <span style="width: 90px">操作</span>
        </div>
        <div class="table-box">
          <div :class="[(index + 1) % 2 === 0 ? 'bg2' : 'bg1']" class="table-item table-text flex-row cp"
            v-for="(item, index) in alertLists" :key="index">
            <span class="max-w" style="margin-left: 12px; width: 130px; margin-right: 5px">{{ item.deviceTypeName
            }}</span>
            <span class="max-w" style="width: 135px" :title="item.content">{{
              item.content
            }}</span>
            <span class="max-w" style="width: 200px">{{ item.alertTime }}</span>
            <span style="color: #b2d0ff; width: 90px" @click="onShowAlert(item)">详情</span>
          </div>
        </div>
        <div class="page-box" v-if="alertLists.length !== 0">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryForm.pageNum" :page-size="queryForm.pageSize" background
            layout="total, prev, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 建筑信息概况 -->
    <div :style="{ zoom: zoomScale }" class="dwgk-box flex-column" v-if="showBuildingInfo">
      <div class="dwgk-head">
        <div class="dwgk-close" @click="closeBuildingInfo"></div>
      </div>
      <div v-if="!showBuildingDetailInfo">
        <div class="dwgk-tab-box flex-row">
          <div :class="[jzgkTabIndex === 1 ? 'select-item-bg' : '']" class="tab-item" @click="jzgkTabClick(1)">
            点位统计
          </div>
          <div :class="[jzgkTabIndex === 2 ? 'select-item-bg' : '']" class="tab-item" @click="jzgkTabClick(2)">
            设备情况
          </div>
        </div>
        <div v-if="jzgkTabIndex === 1">
          <div class="table-head table-text flex-row">
            <span style="margin-left: 28px; width: 147px">建筑大类</span>
            <span style="margin-left: 28px; width: 147px">建筑子类</span>
            <span style="margin-left: 28px; width: 147px">建筑数量</span>
          </div>
          <div class="table-box">
            <div :class="[(index + 1) % 2 === 0 ? 'bg2' : 'bg1']" class="table-item table-text flex-row cp"
              v-for="(item, index) in buildingInfoList" :key="item.id">
              <span class="max-w" style="margin-left: 28px; width: 147px">{{
                item.parentName
              }}</span>
              <span class="max-w" style="margin-left: 28px; width: 147px">{{
                item.name ? item.name : "--"
              }}</span>
              <span class="max-w cp" style="margin-left: 28px; width: 147px; color: #1890ff"
                @click="onShowBuildingDetail(item)">{{ item.pointCount }}</span>
            </div>
          </div>
        </div>
        <div v-if="jzgkTabIndex === 2">
          <div class="table-head table-text flex-row">
            <span style="margin-left: 80px; width: 200px">设备类型</span>
            <span style="margin-left: 13px; width: 261px">数量</span>
          </div>
          <div class="table-box">
            <div :class="[(index + 1) % 2 === 0 ? 'bg2' : 'bg1']" class="table-item table-text flex-row cp"
              v-for="(item, index) in buildingDeviceInfoList" :key="index">
              <span class="max-w" style="margin-left: 80px; width: 200px">{{
                item.name
              }}</span>
              <span class="max-w cp" style="margin-left: 13px; width: 261px; color: #1890ff"
                @click="onShowBuildingDeviceDetail(item)">{{ item.deviceCount }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="back-icon cp" @click="showBuildingDetailInfo = false"></div>
        <div v-if="jzgkTabIndex === 1">
          <div class="table-head table-text flex-row">
            <span style="margin-left: 15px; width: 100px">建筑名称</span>
            <span style="margin-left: 15px; width: 160px">行政区域</span>
            <span style="margin-left: 15px; width: 175px">详细地址</span>
            <span style="margin-left: 15px; width: 30px">操作</span>
          </div>
          <div class="table-box">
            <div class="bg1 table-item table-text flex-row cp" v-for="item in pointList" :key="item.id">
              <span class="max-w" style="margin-left: 15px; width: 100px">{{
                item.name ? item.name : "--"
              }}</span>
              <span class="max-w" style="margin-left: 15px; width: 160px">{{
                item.areaName ? item.areaName : "--"
              }}</span>
              <span class="max-w" style="margin-left: 15px; width: 175px">{{
                item.detailAddress ? item.detailAddress : "--"
              }}</span>
              <div class="row-center cp" style="margin-left: 15px; width: 30px; height: 32px"
                @click="onShowBuildingLayer(item)">
                <img style="width: 12px; height: 16px" src="../../assets/images/panel/table-item-location.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="jzgkTabIndex === 2">
          <div class="table-head table-text flex-row" style="margin-top: 10px">
            <span style="margin-left: 15px; width: 80px">设备编码</span>
            <span style="margin-left: 15px; width: 60px">当前状态</span>
            <span style="margin-left: 15px; width: 60px">告警规则</span>
            <span style="margin-left: 15px; width: 215px">安装位置</span>
            <span style="margin-left: 15px; width: 30px">操作</span>
          </div>
          <div class="table-box">
            <div class="bg1 table-item table-text flex-row cp" v-for="item in buildingDeviceList" :key="item.id">
              <span class="max-w" style="margin-left: 15px; width: 80px">{{
                item.devaddr
              }}</span>
              <span class="max-w" :style="{
                    color: item.online === 1 ? '#03FFFE' : '#FF4E4F',
                  }" style="text-align: center; margin-left: 15px; width: 60px">{{ item.online === 1 ? "在线" : "离线"
    }}</span>
              <span class="max-w" :style="{
                  color: item.openAlert === 1 ? '#03FFFE' : '#FF4E4F',
                }" style="text-align: center; margin-left: 15px; width: 60px">{{ item.openAlert === 1 ? "开" : "关"
  }}</span>
              <span class="max-w" style="margin-left: 15px; width: 215px" :title="item.installPosition">{{
                item.installPosition }}</span>
              <div class="row-center cp" style="margin-left: 15px; width: 30px; height: 32px"
                @click="onShowDeviceLayer(item)">
                <img style="width: 12px; height: 16px" src="../../assets/images/panel/table-item-location.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- poi点位概况 -->
    <div :style="{ zoom: zoomScale }" class="poi-box flex-column" v-if="showPoiInfo">
      <div class="poi-head">
        <div class="poi-close" @click="showPoiInfo = false"></div>
      </div>
      <div class="poi-content flex-row" style="align-items: flex-start">
        <img v-if="photoList.length === 0" style="width: 142px; height: 181px; margin: 0 20px 0 10px"
          src="../../assets/images/panel/photo-empty.png" alt="" />
        <el-image v-else style="width: 142px; height: 181px; margin: 0 20px 0 10px" :src="photoList[0]"
          :preview-src-list="[...photoList]"></el-image>
        <div class="flex-column">
          <div class="flex-row">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="poi-text">名称：{{ poiObj.name }}</span>
          </div>
          <div class="flex-row" style="margin-top: 10px">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="poi-text">行业大类：{{ poiObj.firstCategoryName }}</span>
          </div>
          <div class="flex-row" style="margin-top: 10px">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="poi-text">行业子类：{{ poiObj.secondCategoryName }}</span>
          </div>
          <div class="flex-row" style="margin-top: 10px">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="poi-text">省市区：{{ poiObj.provinceName }}{{ poiObj.cityName
            }}{{ poiObj.adressName }}</span>
          </div>
          <div class="flex-row" style="margin-top: 10px">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="poi-text" :title="poiObj.address">详细地址：{{ poiObj.address }}</span>
          </div>
          <div class="flex-row" style="margin-top: 10px">
            <img style="width: 24px; height: 21px; margin-right: 11px" src="../../assets/images/panel/jyqk-tip.png"
              alt="" />
            <span class="poi-text">电话号码：{{ poiObj.tel ? poiObj.tel : "未知" }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 实时视频监控 -->
    <div :style="{ zoom: zoomScale }" class="video-box flex-column" v-if="openVideo">
      <div class="video-head">
        <div class="video-close" @click="onCloseVideo"></div>
      </div>
      <div class="video-content flex-row" style="align-items: flex-start">
        <div id="divPlugin" class="divPlugin" style="width: 960px; height: 540px"></div>
        <div class="flex-column" style="margin-left: 30px">
          <div class="ptz-box">
            <div class="mid-box cp" @click="mouseDownPTZControl(9)"></div>
            <div class="s-box cp" @mousedown="mouseDownPTZControl(1)" @mouseup="mouseUpPTZControl"></div>
            <div class="x-box cp" @mousedown="mouseDownPTZControl(2)" @mouseup="mouseUpPTZControl"></div>
            <div class="z-box cp" @mousedown="mouseDownPTZControl(3)" @mouseup="mouseUpPTZControl"></div>
            <div class="y-box cp" @mousedown="mouseDownPTZControl(4)" @mouseup="mouseUpPTZControl"></div>
            <div class="zs-box cp" @mousedown="mouseDownPTZControl(5)" @mouseup="mouseUpPTZControl"></div>
            <div class="ys-box cp" @mousedown="mouseDownPTZControl(7)" @mouseup="mouseUpPTZControl"></div>
            <div class="zx-box cp" @mousedown="mouseDownPTZControl(6)" @mouseup="mouseUpPTZControl"></div>
            <div class="yx-box cp" @mousedown="mouseDownPTZControl(8)" @mouseup="mouseUpPTZControl"></div>
          </div>
          <div class="flex-column">
            <div class="row-center" style="margin-top: 24px">
              <div class="jia-box cp" @mousedown="PTZZoomIn" @mouseup="PTZZoomStop"></div>
              <span class="video-text" style="margin: 0 16px">焦距</span>
              <div class="jian-box cp" @mousedown="PTZZoomout" @mouseup="PTZZoomStop"></div>
            </div>
            <div class="row-center" style="margin-top: 20px">
              <div class="jia-box cp" @mousedown="PTZFocusIn" @mouseup="PTZFoucusStop"></div>
              <span class="video-text" style="margin: 0 16px">焦点</span>
              <div class="jian-box cp" @mousedown="PTZFoucusOut" @mouseup="PTZFoucusStop"></div>
            </div>
            <div class="row-center" style="margin-top: 20px">
              <div class="jia-box cp" @mousedown="PTZIrisIn" @mouseup="PTZIrisStop"></div>
              <span class="video-text" style="margin: 0 16px">光圈</span>
              <div class="jian-box cp" @mousedown="PTZIrisOut" @mouseup="PTZIrisStop"></div>
            </div>
            <div class="row-center" style="margin-top: 100px">
              <div class="capture-box cp" @click="clickCapturePic"></div>
              <span class="video-text">抓图</span>
            </div>
            <div class="row-center" style="margin-top: 20px">
              <div class="fullscreen-box cp" @click="clickFullScreen"></div>
              <span class="video-text">全屏</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDevice,
  getAlert,
  deviceTree,
  listDevice,
  getDeviceInfo,
  getDeviceRunningInfo,
  editAlert,
} from "@/api/perception/device";
import {
  getBuildingPoint,
  poiTree,
  listPoi,
  getPoiDetail,
  getBuildingList,
  listBuilding,
} from "@/api/control/point";
import { getBuildingDeviceList } from "@/api/panel";

import { mapGetters } from "vuex";
import bus from "@/utils/bus";
import interact from "interactjs";
import { viewMiniOImage } from "@/api/oss";
import fullScreen from "@/mixins/fullScreen";
import AsideLeft from "@/views/visual-panel/asideLeft";
import AsideRight from "@/views/visual-panel/asideRight";
import vueSeamlessScroll from "vue-seamless-scroll";
import { WebVideo } from "@/utils/webVideoCtrl.js";
const baseURL = require("../../../src/config.js").map_base_url;

export default {
  mixins: [fullScreen],
  components: {
    AsideLeft,
    AsideRight,
    vueSeamlessScroll,
  },
  computed: {
    ...mapGetters(["socketMsg"]),
  },
  watch: {
    //监听websocket消息
    socketMsg: {
      handler(val) {
        // 需要进行的操作
        // console.log("1111----" + val);
        // 去除高亮
        this.pickFeature &&
          (this.pickFeature.color = Cesium.Color.YELLOW.withAlpha(0.75));
        // 建筑体高亮反向标红
        let cartesian3 = Cesium.Cartesian3.fromDegrees(
          val.longitude,
          val.latitude,
          val.height
        );
        let cartesian2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          Viewer.scene,
          cartesian3
        );
        this.pickFeature = Viewer.scene.pick(cartesian2);
        if (this.pickFeature && this.pickFeature.getProperty) {
          // 红色高亮
          this.pickFeature.color = Cesium.Color.RED;
        }
        this.selectedBuildingIds.unshift(val.buildingId);
        this.$set(val, "sType", "2");
        this.gjtsObj = val;
        // 处理告警设备集合
        this.dealDevicesArray(this.alertDevices, val);
        this.flyToPosition(val.longitude, val.latitude);
        // 绘制告警设备图层时，若物联设备和poi图层存在则隐藏
        if (this.deviceLayer) {
          this.deviceLayer.clear();
        }
        if (this.faultDeviceLayer) {
          this.faultDeviceLayer.clear();
        }
        if (this.poiLayer) {
          this.poiLayer.clear();
        }
        this.createAlertDeviceLayer();
        this.showAlert = true;
        this.showDeviceInfo = false;
        this.showPointInfo = false;
        this.showBuildingInfo = false;
        this.showBuildingDetailInfo = false;
        this.jzgkTabIndex = 1;
        this.showPoiInfo = false;
        this.showPOI = false;
        this.showSPJK = false;
        this.showWLSB = false;
      },
    },
  },
  data() {
    return {
      radio: 1, //告警提示弹框中的radio
      dwgkTabIndex: 1, //点位概况弹框中的tabIndex
      jzgkTabIndex: 1, //建筑信息概况弹框中的tabIndex
      deviceLists: [], //点位概况弹框中设备统计信息
      alertCount: 0, //点位概况弹框中设备预警数
      wariningCount: 0, //点位概况弹框中设备异常数
      alertLists: [], //点位概况弹框中设备运行情况信息
      //点位概况弹框中分页配置
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 5,
      },

      photoList: [], //poi图片集合
      buildingInfoList: [], //建筑信息集合
      pointList: [], //建筑详情信息集合
      buildingDeviceInfoList: [], //建筑中设备信息集合
      buildingDeviceList: [], //建筑中设备详情信息集合
      markedBuildings: [], //已绑定信息的建筑
      selectedBuildingIds: [], //被选中的建筑id集合

      alertDevices: [], //告警设备集合
      faultDevices: [], //告警设备集合
      gjtsObj: {}, //告警提示弹框信息
      gzsbObj: {}, //感知设备弹框信息
      pointBuilingList: {}, //点位概况弹框信息
      buildingModelId: undefined, //建筑模型id
      poiObj: {}, //poi点位概况弹框信息
      alertDeviceLayer: null, //告警设备图标图层
      faultDeviceLayer: null, //异常警告设备图标图层
      poiLayer: null, //poi图标图层
      deviceLayer: null, //物联设备图标图层
      pickFeature: null, //告警时标红的建筑
      pickFeature1: null, //绘制的线

      keyword: "",
      currentIndex: 1, //1:感知融合
      showSearchBox: false, //搜索框
      showPOI: false, //图层面板
      showSPJK: false, //视频监控
      showWLSB: false, //物联设备
      showAlert: false, //设备告警弹框
      showDeviceInfo: false, //感知设备信息
      showContent: false, //是否展示故障内容
      showPointInfo: false, //建筑点位概况
      showBuildingInfo: false, //建筑点位概况
      showBuildingDetailInfo: false, //建筑点位概况
      showPoiInfo: false, //poi点位概况
      openVideo: false, //实时视频弹框
      showYALX: false, //顶部预案类型四个按钮
      yalxSelectIndex: 1, //预案总览
      currentYAType: "", //当前预案类型

      //poi信息面板
      poiTrees: [],
      poiNodeIds: [],
      poiDatas: [],
      //视频监控集合
      videoList: [],
      //物联设备面板
      deviceTrees: [],
      deviceNodeIds: [],
      deviceDatas: [],
      //面板中树结构
      defaultProps: {
        children: "children",
        label: "label",
      },

      webVideo: "",
      previewInfo: {
        ip: "",
        port: "",
        username: "",
        password: "",
      },

      clusterLayer: null,
      point: null,
      line: null,
      polygon: null,
      box: null,
      billboard: null,

      plotAsset: [],

      coordinates1: [
        { lon: 120.2021027552695, lat: 30.247919370059755 },
        { lon: 120.19995224827936, lat: 30.244784752988025 },
        { lon: 120.19706835536492, lat: 30.241775426324022 },
        { lon: 120.204963791547, lat: 30.236242789434506 },
        { lon: 120.21040695895488, lat: 30.24247195681375 },
      ],
      coordinates2: [
        { lon: 120.20493247663715, lat: 30.25214222269855 },
        { lon: 120.21340943746657, lat: 30.24656946170875 },
        { lon: 120.22146449707287, lat: 30.257784460174957 },
        { lon: 120.2216836460176, lat: 30.259464774873415 },
        { lon: 120.2168718644731, lat: 30.263512665809213 },
        { lon: 120.211043831805, lat: 30.25928355816936 },
      ],
      coordinates3: [
        { lon: 120.21454965215096, lat: 30.26543856191859 },
        { lon: 120.21163343829328, lat: 30.26341689939309 },
        { lon: 120.21034392943709, lat: 30.262982195620438 },
        { lon: 120.207002663523, lat: 30.262896201429058 },
        { lon: 120.20377545519823, lat: 30.26068264217355 },
        { lon: 120.20378392263416, lat: 30.260274303411993 },
        { lon: 120.20991531130369, lat: 30.258692785766538 },
        { lon: 120.21182165697849, lat: 30.260676005790227 },
        { lon: 120.21537037887094, lat: 30.26275346172926 },
        { lon: 120.21648230794358, lat: 30.26373171470535 },
      ],
      coordinates4: [
        { lon: 120.22037938255164, lat: 30.27202549129166 },
        { lon: 120.22581458699186, lat: 30.27587046115781 },
        { lon: 120.22808123287125, lat: 30.274309504330617 },
        { lon: 120.22286746563273, lat: 30.269661638884152 },
      ],
      coordinates5: [
        { lon: 120.20167742356301, lat: 30.27292825680493 },
        { lon: 120.20452249989559, lat: 30.27285872327226 },
        { lon: 120.20471304202503, lat: 30.266373239379476 },
        { lon: 120.20186907852414, lat: 30.26630498496059 },
      ],
      coordinates6: [{ lon: 120.21340462298647, lat: 30.222887553871374 }],
      radius: 303.35226561129497,
      polygon1: null,
      polygon2: null,
      polygon3: null,
      polygon4: null,
      polygon5: null,
      circle1: null,

      timer: "",
      distanceTraveled: -1,
      imLon: "",
      imLat: "",
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init3DMap();
      this.initDragEvent(".poi-board");
      this.initDragEvent(".wlsb-board");
      this.initDragEvent(".gjts-box");
      this.initDragEvent(".gzsb-box");
      this.initDragEvent(".dwgk-box");
      this.initDragEvent(".poi-box");
      this.initDragEvent(".video-box");
    });
    bus.$on("isAddYA", (isAddYA) => {
      this.showYALX = isAddYA ? false : true;
      this.onClearAll();
    });
    bus.$on("updateCurrentYAInfo", (info) => {
      Viewer.entities.removeAll();
      if (info.currentYAInfo.plotInfo) {
        let arr = JSON.parse(info.currentYAInfo.plotInfo);
        arr.forEach((item) => {
          // console.log(item);
          if (item.type === "1") {
            item.list.forEach((ele) => {
              let billboard = sgworld.Creator.createBillboard({
                lon: ele.coordinates[0].lon,
                lat: ele.coordinates[0].lat,
                image: ele.image,
                scale: 0.85,
              });
              sgworld.Navigate.flyToObj(billboard);
            });
          }
          if (item.type === "2") {
            item.list.forEach((i) => {
              var geometry = [];
              i.coordinates.forEach((ele) => {
                let obj = {
                  x: ele.lon,
                  y: ele.lat,
                  z: 0,
                };
                geometry.push(obj);
              });
              let line = sgworld.Creator.createPolyline(
                geometry,
                "#ffff00",
                1,
                0,
                "线"
              );
              sgworld.Navigate.flyToObj(line);
            });
          }
          if (item.type === "3") {
            item.list.forEach((i) => {
              if (i.type === "circle") {
                let position = sgworld.Creator.CreatePosition(
                  i.coordinates[0].lon,
                  i.coordinates[0].lat,
                  10,
                  1,
                  0,
                  0,
                  0,
                  300
                );
                let circle = sgworld.Creator.CreateCircle(
                  position,
                  i.radius,
                  "#00ff0050",
                  "#ffff00",
                  "",
                  "圆"
                );
                sgworld.Navigate.flyToObj(circle);
              } else if (i.type === "polygon") {
                let coordinates = [];
                i.coordinates.forEach((ele) => {
                  let obj = {
                    x: ele.lon,
                    y: ele.lat,
                  };
                  coordinates.push(obj);
                });
                let polygon = sgworld.Creator.createPolygon(
                  coordinates,
                  {
                    fillColor: "#00ff0050",
                    outlineColor: "#ff0000",
                    outlineWidth: 2,
                  },
                  1,
                  0,
                  "面"
                );
                sgworld.Navigate.flyToObj(polygon);
              }
            });
          }
          if (item.type === "4") {
            item.list.forEach((i) => {
              var position = sgworld.Creator.CreatePosition(
                i.coordinates[0].lon,
                i.coordinates[0].lat,
                100,
                1,
                0,
                0,
                0,
                300
              );
              let box = sgworld.Creator.CreateBox(
                position,
                i.dimensions.y,
                i.dimensions.z,
                i.dimensions.x,
                "#ff0000",
                "#ffff00",
                0,
                "长方体"
              );
            });
          }
          if (item.type === "5") {
            item.list.forEach((i) => {
              let imageName = this.getJYBHIcon(i.typeIndex);
              let billboard = sgworld.Creator.createBillboard({
                lon: i.coordinates[0].lon,
                lat: i.coordinates[0].lat,
                image: SmartEarthRootUrl + `Workers/image/${imageName}.png`,
                scale: 0.7,
              });
            });
          }
        });
      }
    });
  },
  methods: {
    viewMiniOImage,
    onSelectIndex(idx) {
      if (idx === 2 || idx === 3) {
        return;
      }
      this.currentIndex = idx;
      this.onClearAll();
      if (this.currentIndex === 4) {
        this.showYALX = true;
        listDevice({
          type: 6,
        }).then((response) => {
          this.videoList = response.data;
        });
      } else {
        this.showYALX = false;
      }
    },
    init3DMap() {
      //初始化地图
      window.sgworld = new SmartEarth.SGWorld("sdkContainer", {
        // url: SmartEarthRootUrl + "Workers/image/earth.jpg",
        licenseServer: "http://183.162.245.49:18080",
      });
      window.Viewer = sgworld._Viewer;
      sgworld.Navigate.Stop();

      // sgworld._Viewer.scene.debugShowFramesPerSecond = true;
      // sgworld.Creator.SimpleGraphic.edit(true, { editProp: true });

      sgworld.Navigate.jumpTo({
        destination: new Cesium.Cartesian3.fromDegrees(
          120.22909969986871,
          30.229914670211436,
          2000
        ),
      });

      //加载影像图瓦片
      // this.loadYXMap();

      //加载3d白膜模型
      this.load3dJZBM();

      setTimeout(() => {
        this.getMarkedBuildingList();
      }, 3000);

      //拾取地图经纬度坐标，点击获取模型属性
      this.getPickFeature();
    },
    //加载影像图瓦片
    loadYXMap() {
      var urls = `${baseURL}/gismap`;
      var layer = sgworld.Creator.createUrlTemplateImageryProvider(
        "",
        {
          url: Cesium.buildModuleUrl(urls + "/{z}/{x}/{y}.png"),
        },
        "0",
        undefined,
        true,
        ""
      );
    },
    //加载3d白膜模型
    load3dJZBM() {
      var url1 = `${baseURL}/small-lotus-3dtiles/tileset.json`;
      var tiltModel1 = sgworld.Creator.create3DTilesets(
        "",
        url1,
        {},
        {},
        "0",
        true,
        (data) => { }
      );
      var url2 = `${baseURL}/north-3dtiles/tileset.json`;
      var tiltModel2 = sgworld.Creator.create3DTilesets(
        "",
        url2,
        {},
        {},
        "0",
        true,
        (data) => { }
      );
      var url3 = `${baseURL}/south-3dtiles/tileset.json`;
      var tiltModel3 = sgworld.Creator.create3DTilesets(
        "",
        url3,
        {},
        {},
        "0",
        true,
        (data) => {
          this.modelData = data;
          sgworld.Navigate.flyToObj(data);
        }
      );
    },
    //拾取地图经纬度坐标，点击获取模型属性
    getPickFeature() {
      let handler = new Cesium.ScreenSpaceEventHandler(Viewer.scene.canvas);
      let time;
      handler.setInputAction((event) => {
        clearTimeout(time);
        // 鼠标悬停
        time = setTimeout(() => {
          // console.log(this.pickFeature);
          // 去除高亮
          this.pickFeature && (this.pickFeature.color = Cesium.Color.WHITE);
          this.pickFeature1 &&
            (this.pickFeature1.id._polyline.material.color =
              new Cesium.Color.fromCssColorString("#ffff00"));
          this.clearCustomPolygon();

          // 拾取对象
          this.pickFeature = Viewer.scene.pick(event.position);
          console.log(this.pickFeature);
          if (this.pickFeature && this.pickFeature.getProperty) {
            console.log("点击了白膜建筑物");
            // 红色高亮
            this.pickFeature.color = Cesium.Color.RED;
            let names = this.pickFeature.getPropertyNames();
            // console.log("arrays=====" + names);
            names.forEach((name) => {
              if (name === "SYH") {
                this.buildingModelId = this.pickFeature.getProperty(name);
                // console.log("555---" + this.buildingModelId);
                this.selectedBuildingIds.unshift(this.buildingModelId);
                this.markedBuildings.forEach((item) => {
                  console.log(
                    "666---",
                    item.buildingId,
                    this.selectedBuildingIds[1]
                  );
                  if (Number(item.buildingId) === this.selectedBuildingIds[1]) {
                    console.log("777---");
                    let cartesian3 = Cesium.Cartesian3.fromDegrees(
                      item.longitude,
                      item.latitude,
                      0
                    );
                    let cartesian2 =
                      Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                        Viewer.scene,
                        cartesian3
                      );
                    let pickFeature = Viewer.scene.pick(cartesian2);
                    if (pickFeature && pickFeature.getProperty) {
                      // 高亮
                      pickFeature.color = Cesium.Color.YELLOW.withAlpha(0.75);
                    }
                  }
                });
                this.getBuildingPointInfo();
              }
            });
          } else if (
            this.pickFeature &&
            this.pickFeature.id._name === "layer"
          ) {
            console.log("点击了设备图标");
            // console.log(this.pickFeature.id._id);
            let id = this.pickFeature.id._id.split("-")[0];
            let sType = this.pickFeature.id._id.split("-")[1];
            // sType: 0:物联设备点，1：异常警告点，2：告警点，3：poi点, 4:视频监控点
            if (sType === "0") {
              this.showContent = false;
              this.getDeviceInfo(id);
            } else if (sType === "1") {
              this.showContent = true;
              this.getFaultInfo(id);
            } else if (sType === "2") {
              this.getAlertInfo(id);
            } else if (sType === "3") {
              this.getPoiDetail(id);
            } else if (sType === "4") {
              this.getVideoDeviceInfo(id);
            }
          } else if (this.pickFeature && this.pickFeature.id.GeoType) {
            console.log("点击了已绘制的点线面等标绘");
            this.getMarkedBuildingList();
            let data = {
              id: this.pickFeature.id._id,
            };
            this.getBuildingList(data);
            this.getBuildingDeviceList(data);
          } else if (
            this.pickFeature &&
            this.pickFeature.id._polyline &&
            this.pickFeature.id._polyline._positions._value.length !== 0
          ) {
            console.log("点击了已绘制的路线---", this.pickFeature.id._id);
            this.pickFeature1 = Viewer.scene.pick(event.position);
            this.pickFeature.id._polyline.material.color =
              new Cesium.Color.fromCssColorString("#00ff00");
            this.getMarkedBuildingList();
            let arr = this.pickFeature.id._polyline._positions._value;
            let coordinates = [];
            arr.forEach((item) => {
              let degrees = SmartEarth.Cartesian3_to_WGS84(item);
              let dic = {
                lng: degrees.lon,
                lat: degrees.lat,
              };
              coordinates.push(dic);
            });
            let data = {
              id: this.pickFeature.id._id,
              type: 2,
              coordinates,
            };
            this.getBuildingList(data);
            this.getBuildingDeviceList(data);

            if (arr.length === 30) {
              this.createCustomPolygon1();
            } else if (arr.length === 28) {
              this.createCustomPolygon2();
            } else if (arr.length === 36) {
              this.createCustomPolygon3();
            }
          } else {
            console.log("点击了地图空白区域-----");
            this.getMarkedBuildingList();
          }
        }, 50);
        let p = sgworld.Navigate.getMouseDegrees(event);
        console.log(p);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    createCustomPolygon1() {
      let coordinates = [];
      this.coordinates1.forEach((ele) => {
        let obj = {
          x: ele.lon,
          y: ele.lat,
        };
        coordinates.push(obj);
      });
      this.polygon1 = sgworld.Creator.createPolygon(
        coordinates,
        {
          fillColor: "#00ff0050",
          outlineColor: "#ff0000",
          outlineWidth: 2,
        },
        1,
        0,
        "面"
      );

      let position = sgworld.Creator.CreatePosition(
        this.coordinates6[0].lon,
        this.coordinates6[0].lat,
        10,
        1,
        0,
        0,
        0,
        300
      );
      this.circle1 = sgworld.Creator.CreateCircle(
        position,
        this.radius,
        "#ffff00",
        "#00ff0050",
        "",
        "圆"
      );
    },
    createCustomPolygon2() {
      let coordinates = [];
      this.coordinates2.forEach((ele) => {
        let obj = {
          x: ele.lon,
          y: ele.lat,
        };
        coordinates.push(obj);
      });
      this.polygon2 = sgworld.Creator.createPolygon(
        coordinates,
        {
          fillColor: "#00ff0050",
          outlineColor: "#ff0000",
          outlineWidth: 2,
        },
        1,
        0,
        "面"
      );

      let coordinates3 = [];
      this.coordinates3.forEach((ele) => {
        let obj = {
          x: ele.lon,
          y: ele.lat,
        };
        coordinates3.push(obj);
      });
      this.polygon3 = sgworld.Creator.createPolygon(
        coordinates3,
        {
          fillColor: "#00ff0050",
          outlineColor: "#ff0000",
          outlineWidth: 2,
        },
        1,
        0,
        "面"
      );

      let coordinates5 = [];
      this.coordinates5.forEach((ele) => {
        let obj = {
          x: ele.lon,
          y: ele.lat,
        };
        coordinates5.push(obj);
      });
      this.polygon5 = sgworld.Creator.createPolygon(
        coordinates5,
        {
          fillColor: "#00ff0050",
          outlineColor: "#ff0000",
          outlineWidth: 2,
        },
        1,
        0,
        "面"
      );
    },
    createCustomPolygon3() {
      let coordinates2 = [];
      this.coordinates2.forEach((ele) => {
        let obj = {
          x: ele.lon,
          y: ele.lat,
        };
        coordinates2.push(obj);
      });
      this.polygon2 = sgworld.Creator.createPolygon(
        coordinates2,
        {
          fillColor: "#00ff0050",
          outlineColor: "#ff0000",
          outlineWidth: 2,
        },
        1,
        0,
        "面"
      );

      let coordinates3 = [];
      this.coordinates3.forEach((ele) => {
        let obj = {
          x: ele.lon,
          y: ele.lat,
        };
        coordinates3.push(obj);
      });
      this.polygon3 = sgworld.Creator.createPolygon(
        coordinates3,
        {
          fillColor: "#00ff0050",
          outlineColor: "#ff0000",
          outlineWidth: 2,
        },
        1,
        0,
        "面"
      );

      let coordinates4 = [];
      this.coordinates4.forEach((ele) => {
        let obj = {
          x: ele.lon,
          y: ele.lat,
        };
        coordinates4.push(obj);
      });
      this.polygon4 = sgworld.Creator.createPolygon(
        coordinates4,
        {
          fillColor: "#00ff0050",
          outlineColor: "#ff0000",
          outlineWidth: 2,
        },
        1,
        0,
        "面"
      );
    },
    clearCustomPolygon() {
      if (this.polygon1) {
        sgworld.Creator.DeleteObject(this.polygon1);
      }
      if (this.polygon2) {
        sgworld.Creator.DeleteObject(this.polygon2);
      }
      if (this.polygon3) {
        sgworld.Creator.DeleteObject(this.polygon3);
      }
      if (this.polygon4) {
        sgworld.Creator.DeleteObject(this.polygon4);
      }
      if (this.polygon5) {
        sgworld.Creator.DeleteObject(this.polygon5);
      }
      if (this.circle1) {
        sgworld.Creator.DeleteObject(this.circle1);
      }
    },
    // 获取已绑定信息的建筑
    getMarkedBuildingList() {
      listBuilding().then((response) => {
        this.markedBuildings = response.data;
        if (this.markedBuildings.length !== 0) {
          this.markedBuildings.forEach((item) => {
            let cartesian3 = Cesium.Cartesian3.fromDegrees(
              item.longitude,
              item.latitude,
              0
            );
            // console.log('cartesian3+++', cartesian3);
            if (!cartesian3) {
              return;
            }
            let cartesian2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              Viewer.scene,
              cartesian3
            );
            // console.log('cartesian2+++', cartesian2);
            if (!cartesian2) {
              return;
            }
            let pickFeature = Viewer.scene.pick(cartesian2);
            // console.log("pickFeature+++", pickFeature);
            if (pickFeature && pickFeature.getProperty) {
              // 红色高亮
              pickFeature.color = Cesium.Color.YELLOW.withAlpha(0.75);
            }
          });
        }
      });
    },
    // 获取设备信息
    getDeviceInfo(id) {
      getDevice(id).then((response) => {
        this.gzsbObj = response.data;
        this.flyToPosition(this.gzsbObj.longitude, this.gzsbObj.latitude);
        this.showDeviceInfo = true;
        this.showAlert = false;
        this.showPointInfo = false;
        this.showBuildingInfo = false;
        this.showBuildingDetailInfo = false;
        this.jzgkTabIndex = 1;
        this.showPoiInfo = false;
        this.showPOI = false;
        this.showSPJK = false;
        this.showWLSB = false;
      });
    },
    // 获取告警信息
    getAlertInfo(id) {
      getAlert(id).then((response) => {
        this.gjtsObj = response.data;
        this.flyToPosition(this.gjtsObj.longitude, this.gjtsObj.latitude);
        this.showAlert = true;
        this.showDeviceInfo = false;
        this.showPointInfo = false;
        this.showBuildingInfo = false;
        this.showBuildingDetailInfo = false;
        this.jzgkTabIndex = 1;
        this.showPoiInfo = false;
        this.showPOI = false;
        this.showSPJK = false;
        this.showWLSB = false;
      });
    },
    // 获取异常警告信息
    getFaultInfo(id) {
      getAlert(id).then((response) => {
        this.gzsbObj = response.data;
        this.flyToPosition(this.gzsbObj.longitude, this.gzsbObj.latitude);
        this.showDeviceInfo = true;
        this.showAlert = false;
        this.showPointInfo = false;
        this.showBuildingInfo = false;
        this.showBuildingDetailInfo = false;
        this.jzgkTabIndex = 1;
        this.showPoiInfo = false;
        this.showPOI = false;
        this.showSPJK = false;
        this.showWLSB = false;
      });
    },
    // 获取建筑信息
    getBuildingPointInfo() {
      getBuildingPoint({
        buildingId: this.buildingModelId,
      }).then((response) => {
        this.dwgkTabIndex = 1;
        if (response.data) {
          this.pointBuilingList = response.data.list;
          this.flyToPosition(response.data.longitude, response.data.latitude);
          this.showPointInfo = true;
          this.showAlert = false;
          this.showDeviceInfo = false;
          this.showPoiInfo = false;
        } else {
          this.$modal.msgError("暂无该建筑数据");
        }
      });
    },
    // 点位概况tab切换事件
    dwgkTabClick(idx) {
      this.dwgkTabIndex = idx;
      if (idx === 2) {
        this.getDeviceStatisticsInfo();
      } else if (idx === 3) {
        this.getDeviceRunningInfo();
      }
    },
    // 建筑信息概况tab切换事件
    jzgkTabClick(idx) {
      this.jzgkTabIndex = idx;
    },
    // 获取点位中设备统计信息
    getDeviceStatisticsInfo() {
      getDeviceInfo(this.buildingModelId).then((response) => {
        this.deviceLists = response.data;
      });
    },
    // 获取点位中设备运行情况信息
    getDeviceRunningInfo() {
      getDeviceRunningInfo(this.buildingModelId, this.queryForm).then(
        (response) => {
          this.alertCount = response.data.alertCount;
          this.wariningCount = response.data.wariningCount;
          this.alertLists = response.data.page.rows;
          this.total = response.data.page.total;
        }
      );
    },
    // 分页
    handleSizeChange(limit) {
      this.queryForm.pageNum = 1;
      this.queryForm.pageSize = limit;
      this.getDeviceRunningInfo();
    },
    handleCurrentChange(page) {
      this.queryForm.pageNum = page;
      this.getDeviceRunningInfo();
    },
    //飞到点位
    flyToPosition(lon, lat) {
      sgworld.Navigate.flyToPosition(lon, lat - 0.005, 700, {
        heading: 0,
        pitch: -45,
        roll: 0,
      });
    },
    //创建告警设备图层
    createAlertDeviceLayer() {
      if (this.alertDeviceLayer) {
        this.alertDeviceLayer.clear();
      }
      this.alertDeviceLayer = new SmartEarth.ClusterLayer(Viewer, {
        style: "clustering",
      });
      this.alertDeviceLayer.enableCluster = false;
      if (this.alertDevices.length > 30) {
        this.alertDevices = this.alertDevices.slice(0, 30);
      }
      this.alertDevices.forEach((item) => {
        let image = this.getDeviceIcon(item);
        this.alertDeviceLayer.add(
          {
            lon: item.longitude,
            lat: item.latitude,
            height: item.height,
          },
          {
            id: item.id + "-" + item.sType,
            name: "layer",
            image: SmartEarthRootUrl + `Workers/image/mapIcon/${image}.png`,
            scale: 0.8,
          }
        );
      });
    },
    //创建异常警告设备图层
    createFaultDeviceLayer() {
      if (this.faultDeviceLayer) {
        this.faultDeviceLayer.clear();
      }
      this.faultDeviceLayer = new SmartEarth.ClusterLayer(Viewer, {
        style: "clustering",
      });
      this.faultDeviceLayer.enableCluster = false;
      if (this.faultDevices.length > 30) {
        this.faultDevices = this.faultDevices.slice(0, 30);
      }
      this.faultDevices.forEach((item) => {
        let image = this.getDeviceIcon(item);
        this.faultDeviceLayer.add(
          {
            lon: item.longitude,
            lat: item.latitude,
            height: item.height,
          },
          {
            id: item.id + "-" + item.sType,
            name: "layer",
            image: SmartEarthRootUrl + `Workers/image/mapIcon/${image}.png`,
            scale: 0.8,
          }
        );
      });
    },
    //判断物联设备图标
    getDeviceIcon(item) {
      if (item.deviceType === 1) {
        if (item.sType === "0") {
          return "icon-mc-common";
        } else if (item.sType === "1") {
          return "icon-mc-warn";
        } else {
          return "icon-mc-alert";
        }
      } else if (item.deviceType === 2) {
        if (item.sType === "0") {
          return "icon-rthw-common";
        } else if (item.sType === "1") {
          return "icon-rthw-warn";
        } else {
          return "icon-rthw-alert";
        }
      } else if (item.deviceType === 3) {
        if (item.sType === "0") {
          return "icon-jg-common";
        } else if (item.sType === "1") {
          return "icon-jg-warn";
        } else {
          return "icon-jg-alert";
        }
      } else if (item.deviceType === 4) {
        if (item.sType === "0") {
          return "icon-kqjc-common";
        } else if (item.sType === "1") {
          return "icon-kqjc-warn";
        } else {
          return "icon-kqjc-alert";
        }
      } else if (item.deviceType === 5) {
        if (item.sType === "0") {
          return "icon-hzyg-common";
        } else if (item.sType === "1") {
          return "icon-hzyg-warn";
        } else {
          return "icon-hzyg-alert";
        }
      } else if (item.deviceType === 7) {
        if (item.sType === "0") {
          return "icon-sjbj-common";
        } else if (item.sType === "1") {
          return "icon-sjbj-warn";
        } else {
          return "icon-sjbj-alert";
        }
      } else if (item.deviceType === 8) {
        if (item.sType === "0") {
          return "icon-sos-common";
        } else if (item.sType === "1") {
          return "icon-sos-warn";
        } else {
          return "icon-sos-alert";
        }
      }
    },
    onShowSearchBox() {
      if (this.currentIndex !== 4) {
        this.onClearAll();
        this.showSearchBox = !this.showSearchBox;
      }
    },
    //请求poi树结构
    onShowPOI() {
      this.showPOI = true;
      poiTree().then((response) => {
        this.poiTrees = response.data;
      });
    },
    //poi信息树节点勾选事件
    handleNodeClickPoi() {
      if (this.poiLayer) {
        this.poiLayer.clear();
      }
      this.poiNodeIds = this.$refs.poiTree.getCheckedKeys();
      if (this.poiNodeIds.length !== 0) {
        listPoi({
          category: this.poiNodeIds.join(","),
        }).then((response) => {
          this.poiDatas = response.data;
          //绘制poi信息图层时，若告警设备图层存在则隐藏
          if (this.poiDatas.length !== 0) {
            sgworld.Navigate.flyToObj(this.modelData);
            if (this.alertDeviceLayer) {
              this.alertDeviceLayer.clear();
            }
            if (this.faultDeviceLayer) {
              this.faultDeviceLayer.clear();
            }
            this.showAlert = false;
            this.showDeviceInfo = false;
            this.showPointInfo = false;
            this.showBuildingInfo = false;
            this.showBuildingDetailInfo = false;
            this.jzgkTabIndex = 1;
            this.showPoiInfo = false;
          }
          this.poiLayer = new SmartEarth.ClusterLayer(Viewer, {
            style: "clustering",
          });
          this.poiLayer.enableCluster = false;
          this.poiDatas.forEach((item) => {
            this.$set(item, "sType", "3");
            let obj = {
              lon: item.wgs84Lng,
              lat: item.wgs84Lat,
            };
            this.poiLayer.add(obj, {
              id: item.id + "-" + item.sType,
              name: "layer",
              image:
                SmartEarthRootUrl +
                `Workers/image/mapIcon/icon-poi-${item.firstCategory}.png`,
              scale: 0.8,
            });
          });
        });
      }
    },
    //获取poi详情
    getPoiDetail(id) {
      getPoiDetail(id).then((response) => {
        this.showPoiInfo = true;
        this.showAlert = false;
        this.showDeviceInfo = false;
        this.showPointInfo = false;
        this.showBuildingInfo = false;
        this.showBuildingDetailInfo = false;
        this.jzgkTabIndex = 1;
        this.poiObj = response.data;
        this.flyToPosition(this.poiObj.wgs84Lng, this.poiObj.wgs84Lat);
        this.photoList = [];
        if (this.poiObj.photosUrl) {
          this.photoList = this.poiObj.photosUrl.split(",");
        }
      });
    },
    //请求物联设备树结构
    onShowWLSB() {
      this.showWLSB = true;
      deviceTree().then((response) => {
        this.deviceTrees = response.data;
      });
    },
    //物联设备树节点勾选事件
    handleNodeClickDevice() {
      if (this.deviceLayer) {
        this.deviceLayer.clear();
      }
      this.deviceNodeIds = this.$refs.deviceTree.getCheckedKeys();
      if (this.deviceNodeIds.length !== 0) {
        listDevice({
          types: this.deviceNodeIds.join(","),
        }).then((response) => {
          this.deviceDatas = response.data;
          this.createDeviceLayer(); //创建物联设备图层
        });
      }
    },
    //创建物联设备图层
    createDeviceLayer() {
      //绘制物联设备图层时，若告警设备图层存在则隐藏
      if (this.deviceDatas.length !== 0) {
        sgworld.Navigate.flyToObj(this.modelData);
        if (this.alertDeviceLayer) {
          this.alertDeviceLayer.clear();
        }
        if (this.faultDeviceLayer) {
          this.faultDeviceLayer.clear();
        }
        this.showAlert = false;
        this.showDeviceInfo = false;
        this.showPointInfo = false;
        this.showBuildingInfo = false;
        this.showBuildingDetailInfo = false;
        this.jzgkTabIndex = 1;
        this.showPoiInfo = false;
      }
      this.deviceLayer = new SmartEarth.ClusterLayer(Viewer, {
        style: "clustering",
      });
      this.deviceLayer.enableCluster = false;
      this.deviceDatas.forEach((item) => {
        this.$set(item, "sType", "0");
        let image = this.getDeviceIcon(item);
        this.deviceLayer.add(
          {
            lon: item.longitude,
            lat: item.latitude,
            height: item.height,
          },
          {
            id: item.id + "-" + item.sType,
            name: "layer",
            image: SmartEarthRootUrl + `Workers/image/mapIcon/${image}.png`,
            scale: 0.8,
          }
        );
      });
    },
    //视频监控
    onShowSPJK() {
      this.showSPJK = !this.showSPJK;
      this.showDeviceInfo = false;
      this.showAlert = false;
      this.showPointInfo = false;
      this.showBuildingInfo = false;
      this.showBuildingDetailInfo = false;
      this.jzgkTabIndex = 1;
      this.showPoiInfo = false;
      this.showPOI = false;
      this.showWLSB = false;
      if (this.alertDeviceLayer) {
        this.alertDeviceLayer.clear();
      }
      if (this.faultDeviceLayer) {
        this.faultDeviceLayer.clear();
      }
      if (this.poiLayer) {
        this.poiLayer.clear();
      }
      if (this.deviceLayer) {
        this.deviceLayer.clear();
      }
      if (this.showSPJK) {
        listDevice({
          type: 6,
        }).then((response) => {
          this.videoList = response.data;
          if (this.videoList.length !== 0) {
            sgworld.Navigate.flyToObj(this.modelData);
            this.clusterLayer = new SmartEarth.ClusterLayer(Viewer, {
              style: "clustering",
            });
            this.clusterLayer.enableCluster = false;
            this.videoList.forEach((item) => {
              this.$set(item, "sType", "4");
              this.clusterLayer.add(
                {
                  lon: item.longitude,
                  lat: item.latitude,
                  height: item.height,
                },
                {
                  id: item.id + "-" + item.sType,
                  name: "layer",
                  image:
                    SmartEarthRootUrl +
                    "Workers/image/mapIcon/icon-sp-point.png",
                  scale: 0.6,
                }
              );
            });
          } else {
            return this.$modal.msgError("暂无视频监控");
          }
        });
      } else {
        this.videoList = [];
        this.clusterLayer.clear();
      }
    },
    //获取视频监控详情
    getVideoDeviceInfo(cameraId) {
      getDevice(cameraId).then((response) => {
        this.previewInfo = {
          ip: response.data.ip,
          port: response.data.port,
          username: response.data.accessName,
          password: response.data.accessSecret,
        };
        this.flyToPosition(response.data.longitude, response.data.latitude);
        this.openVideo = true;
        this.initVideoPlay();
      });
    },
    onCloseVideo() {
      this.openVideo = false;
      this.stopVideoPlay();
    },
    //右侧面板点击单个设备告警,点位概况中告警详情
    onShowAlert(item) {
      console.log(item);
      this.$set(item, "sType", "2");
      this.gjtsObj = item;
      //处理告警设备集合
      this.dealDevicesArray(this.alertDevices, item);
      this.flyToPosition(item.longitude, item.latitude);
      //绘制告警设备图层时，若物联设备和poi图层存在则隐藏
      if (this.deviceLayer) {
        this.deviceLayer.clear();
      }
      if (this.faultDeviceLayer) {
        this.faultDeviceLayer.clear();
      }
      if (this.poiLayer) {
        this.poiLayer.clear();
      }
      this.createAlertDeviceLayer();
      this.showAlert = true;
      this.showDeviceInfo = false;
      this.showPointInfo = false;
      this.showBuildingInfo = false;
      this.showBuildingDetailInfo = false;
      this.jzgkTabIndex = 1;
      this.showPoiInfo = false;
      this.showPOI = false;
      this.showSPJK = false;
      this.showWLSB = false;
    },
    //右侧面板点击单个异常警告
    onShowFault(item) {
      console.log(item);
      this.$set(item, "sType", "1");
      this.gzsbObj = item;
      //处理异常警告设备集合
      this.dealDevicesArray(this.faultDevices, item);
      this.flyToPosition(item.longitude, item.latitude);
      //绘制告警设备图层时，若物联设备和poi图层存在则隐藏
      if (this.deviceLayer) {
        this.deviceLayer.clear();
      }
      if (this.alertDeviceLayer) {
        this.alertDeviceLayer.clear();
      }
      if (this.poiLayer) {
        this.poiLayer.clear();
      }
      this.createFaultDeviceLayer();
      this.showDeviceInfo = true;
      this.showContent = true;
      this.showAlert = false;
      this.showPointInfo = false;
      this.showBuildingInfo = false;
      this.showBuildingDetailInfo = false;
      this.jzgkTabIndex = 1;
      this.showPoiInfo = false;
      this.showPOI = false;
      this.showSPJK = false;
      this.showWLSB = false;
    },
    //处理设备集合
    dealDevicesArray(arr, item) {
      let flag = false;
      let idx = 0;
      arr.forEach((ele, index) => {
        if (ele.deviceId === item.deviceId) {
          flag = true;
          idx = index;
        }
      });
      if (flag) {
        // 有相同设备，替换最新数据
        arr.splice(idx, 1, item);
      } else {
        // 无相同设备，直接添加
        arr.unshift(item);
      }
    },
    //提交事件
    onSubmitDeal() {
      editAlert({
        id: this.gjtsObj.id,
        dealResult: this.radio,
      }).then((response) => {
        this.showAlert = false;
        if (this.showPointInfo) {
          this.getDeviceRunningInfo();
        }
        this.$modal.msgSuccess("提交成功");
        //刷新右上告警列表
        this.$refs.right.getAlertList();
        //处理完删除该点位
        this.alertDevices.forEach((ele, index) => {
          if (ele.deviceId === this.gjtsObj.deviceId) {
            this.alertDevices.splice(index, 1);
          }
        });
        this.createAlertDeviceLayer();
      });
    },
    //告警提示中的视频监控
    onShowVideo() {
      if (!this.gjtsObj.cameraId) {
        return this.$modal.msgError("暂无视频");
      }
      getDevice(this.gjtsObj.cameraId).then((response) => {
        this.previewInfo = {
          ip: response.data.ip,
          port: response.data.port,
          username: response.data.accessName,
          password: response.data.accessSecret,
        };
        this.openVideo = true;
        this.initVideoPlay();
      });
    },
    // 清除所有
    onClearAll() {
      this.getMarkedBuildingList();
      Viewer.entities.removeAll();
      // console.log(Viewer.entities);
      this.showSearchBox = false;
      this.showPOI = false;
      this.showSPJK = false;
      this.showWLSB = false;
      this.showAlert = false;
      this.showDeviceInfo = false;
      this.showPointInfo = false;
      this.showBuildingInfo = false;
      this.showBuildingDetailInfo = false;
      this.jzgkTabIndex = 1;
      this.showPoiInfo = false;

      if (this.alertDeviceLayer) {
        this.alertDeviceLayer.clear();
      }
      if (this.faultDeviceLayer) {
        this.faultDeviceLayer.clear();
      }
      if (this.poiLayer) {
        this.poiLayer.clear();
      }
      if (this.deviceLayer) {
        this.deviceLayer.clear();
      }

      if (this.clusterLayer) {
        this.clusterLayer.clear();
      }
      if (this.point) {
        sgworld.Creator.DeleteObject(this.point);
      }
      if (this.line) {
        sgworld.Creator.DeleteObject(this.line);
      }
      if (this.polygon) {
        sgworld.Creator.DeleteObject(this.polygon);
      }
      if (this.box) {
        sgworld.Creator.DeleteObject(this.box);
      }
      if (this.billboard) {
        sgworld.Creator.DeleteObject(this.billboard);
      }
      sgworld.Creator.SimpleGraphic.clear();
      if (this.mjLayer) {
        this.mjLayer.clear();
      }
      if (this.fjLayer) {
        this.fjLayer.clear();
      }
      if (this.jcLayer) {
        this.jcLayer.clear();
      }
      if (this.ptuLayer) {
        this.ptuLayer.clear();
      }
      if (this.wrjLayer) {
        this.wrjLayer.clear();
      }
      if (this.jqrLayer) {
        this.jqrLayer.clear();
      }
      if (this.kkxjLayer) {
        this.kkxjLayer.clear();
      }
      if (this.gdxjLayer) {
        this.gdxjLayer.clear();
      }
      if (this.rlkkLayer) {
        this.rlkkLayer.clear();
      }
      if (this.clkkLayer) {
        this.clkkLayer.clear();
      }
      if (this.qjjkLayer) {
        this.qjjkLayer.clear();
      }
      if (this.gklwLayer) {
        this.gklwLayer.clear();
      }
    },
    /** 拖拽事件开始 */
    initDragEvent(classId) {
      interact(classId).draggable({
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: "parent",
            endOnly: true,
          }),
        ],
        autoScroll: true,
        listeners: {
          move: this.dragMoveListener,
          // eslint-disable-next-line  no-unused-vars
          end(event) { },
        },
      });
      window.dragMoveListener = this.dragMoveListener;
    },
    dragMoveListener(event) {
      var target = event.target;
      var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
      var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
      target.style.transform = "translate(" + x + "px, " + y + "px)";
      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    },
    /** 拖拽事件结束 */

    // 视频播放
    initVideoPlay() {
      this.webVideo = new WebVideo();
      this.$nextTick(() => {
        this.webVideo.init(
          this.previewInfo.ip,
          this.previewInfo.port,
          this.previewInfo.username,
          this.previewInfo.password
        );
        this.webVideo.clickLogin();
      });
    },
    stopVideoPlay() {
      this.webVideo.clickStopRealPlay();
      this.webVideo.clickLogout();
    },
    mouseDownPTZControl(idx) {
      this.webVideo.mouseDownPTZControl(idx);
    },
    mouseUpPTZControl() {
      this.webVideo.mouseUpPTZControl();
    },
    PTZZoomIn() {
      this.webVideo.PTZZoomIn();
    },
    PTZZoomout() {
      this.webVideo.PTZZoomout();
    },
    PTZZoomStop() {
      this.webVideo.PTZZoomStop();
    },
    PTZFocusIn() {
      this.webVideo.PTZFocusIn();
    },
    PTZFoucusOut() {
      this.webVideo.PTZFoucusOut();
    },
    PTZFoucusStop() {
      this.webVideo.PTZZoomIn();
    },
    PTZIrisIn() {
      this.webVideo.PTZIrisIn();
    },
    PTZIrisOut() {
      this.webVideo.PTZIrisOut();
    },
    PTZIrisStop() {
      this.webVideo.PTZIrisStop();
    },
    clickCapturePic() {
      this.webVideo.clickCapturePic();
    },
    clickFullScreen() {
      this.webVideo.clickFullScreen();
    },

    // 绘制工具
    createPoint() {
      sgworld.Creator.createSimpleGraphic("point", {}, (entity) => {
        let obj = sgworld.Creator.SimpleGraphic.getStyle(entity);
        let degrees = SmartEarth.Cartesian3_to_WGS84(obj.position);
        let coordinates = [];
        let dic = {
          lng: degrees.lon,
          lat: degrees.lat,
        };
        coordinates.push(dic);
        let data = {
          id: obj.id,
          type: 1,
          coordinates,
        };
        this.getBuildingList(data);
        this.getBuildingDeviceList(data);
      });
    },
    createLine() {
      sgworld.Creator.createSimpleGraphic("polyline", {}, (entity) => {
        let obj = sgworld.Creator.SimpleGraphic.getStyle(entity);
        let coordinates = [];
        obj.positions.forEach((item) => {
          let degrees = SmartEarth.Cartesian3_to_WGS84(item);
          let dic = {
            lng: degrees.lon,
            lat: degrees.lat,
          };
          coordinates.push(dic);
        });
        let data = {
          id: obj.id,
          type: 2,
          coordinates,
        };
        this.getBuildingList(data);
        this.getBuildingDeviceList(data);
      });
    },
    createCircle() {
      sgworld.Creator.createSimpleGraphic("circle", {}, (entity) => {
        let obj = sgworld.Creator.SimpleGraphic.getStyle(entity);
        let degrees = SmartEarth.Cartesian3_to_WGS84(obj.position);
        let coordinates = [];
        let dic = {
          lng: degrees.lon,
          lat: degrees.lat,
        };
        coordinates.push(dic);
        let data = {
          id: obj.id,
          type: 3,
          coordinates,
          radius: obj.radius,
        };
        this.getBuildingList(data);
        this.getBuildingDeviceList(data);
      });
    },
    createPolygon() {
      sgworld.Creator.createSimpleGraphic("polygon", {}, (entity) => {
        let obj = sgworld.Creator.SimpleGraphic.getStyle(entity);
        let coordinates = [];
        obj.positions.forEach((item) => {
          let degrees = SmartEarth.Cartesian3_to_WGS84(item);
          let dic = {
            lng: degrees.lon,
            lat: degrees.lat,
          };
          coordinates.push(dic);
        });
        let data = {
          id: obj.id,
          type: 4,
          coordinates,
        };
        this.getBuildingList(data);
        this.getBuildingDeviceList(data);
      });
    },
    // 获取建筑统计信息
    getBuildingList(data) {
      getBuildingList(data).then((response) => {
        this.showBuildingDetailInfo = false;
        this.jzgkTabIndex = 1;
        this.showBuildingInfo = true;
        this.buildingInfoList = response.data;
      });
    },
    // 获取建筑中设备统计信息
    getBuildingDeviceList(data) {
      getBuildingDeviceList(data).then((response) => {
        this.buildingDeviceInfoList = response.data;
      });
    },
    closeBuildingInfo() {
      this.showBuildingInfo = false;
      this.pickFeature.color = Cesium.Color.YELLOW.withAlpha(0.75);
    },
    onShowBuildingDetail(item) {
      this.showBuildingDetailInfo = true;
      this.pointList = item.pointList;
    },
    onShowBuildingDeviceDetail(item) {
      this.showBuildingDetailInfo = true;
      this.buildingDeviceList = item.deviceList;
    },
    onShowBuildingLayer(item) {
      this.clearCustomPolygon();
      // 返回到之前的颜色
      this.selectedBuildingIds.unshift(item.buildingId);
      let flag = false;
      this.markedBuildings.forEach((i) => {
        // console.log(i.buildingId, "---", this.selectedBuildingIds[1]);
        if (i.buildingId === this.selectedBuildingIds[1]) {
          flag = true;
        }
      });
      if (flag) {
        this.pickFeature.color = Cesium.Color.YELLOW.withAlpha(0.75);
      } else {
        this.pickFeature && (this.pickFeature.color = Cesium.Color.WHITE);
      }
      // 建筑体高亮反向标红
      let cartesian3 = Cesium.Cartesian3.fromDegrees(
        item.longitude,
        item.latitude,
        item.height
      );
      let cartesian2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        Viewer.scene,
        cartesian3
      );
      this.pickFeature = Viewer.scene.pick(cartesian2);
      if (this.pickFeature && this.pickFeature.getProperty) {
        // 红色高亮
        this.pickFeature.color = Cesium.Color.RED;
      }
    },
    onShowDeviceLayer(item) {
      // console.log(this.deviceDatas.length);
      if (this.deviceLayer) {
        this.deviceLayer.clear();
      }
      //处理设备集合
      this.deviceDatas = [];
      this.dealDevicesArray(this.deviceDatas, item);
      this.createDeviceLayer(); //创建物联设备图层
    },

    onYazlSelect(idx) {
      this.yalxSelectIndex = idx;
    },
    onShowYABH(item) {
      // console.log(item);
      sgworld.Navigate.setPosition(
        item.coordinates[0].lon,
        item.coordinates[0].lat,
        8000
      );
    },
    onViewAddYABH(item) {
      // console.log(item);
      sgworld.Navigate.setPosition(
        item.coordinates[0].lon,
        item.coordinates[0].lat,
        8000
      );
    },
    onDelAddYABH(item) {
      // console.log(item, Viewer.entities);
      Viewer.entities.removeById(item.id);
      if (item.idx === 0) {
        this.$refs.left.startLonLat = "";
      } else if (item.idx === 1) {
        this.$refs.left.endLonLat = "";
      }
    },
    onShowCJXX(item) {
      // console.log(item);
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

    // onCheckZBJLType(item) {
    //   sgworld.Navigate.setPosition(117.44917791230931, 31.87409363277426, 2000);
    //   switch (item.type) {
    //     case 1:
    //       if (item.checked) {
    //         this.mjLayer = this.createLayer(item, "icon-mj");
    //       } else {
    //         this.mjLayer.clear();
    //       }
    //       break;
    //     case 2:
    //       if (item.checked) {
    //         this.fjLayer = this.createLayer(item, "icon-fj");
    //       } else {
    //         this.fjLayer.clear();
    //       }
    //       break;
    //     case 3:
    //       if (item.checked) {
    //         this.jcLayer = this.createLayer(item, "icon-jc");
    //       } else {
    //         this.jcLayer.clear();
    //       }
    //       break;
    //     case 4:
    //       if (item.checked) {
    //         this.ptuLayer = this.createLayer(item, "icon-ptu");
    //       } else {
    //         this.ptuLayer.clear();
    //       }
    //       break;
    //     case 5:
    //       if (item.checked) {
    //         this.wrjLayer = this.createLayer(item, "icon-wrj");
    //       } else {
    //         this.wrjLayer.clear();
    //       }
    //       break;
    //     case 6:
    //       if (item.checked) {
    //         this.jqrLayer = this.createLayer(item, "icon-jqr");
    //       } else {
    //         this.jqrLayer.clear();
    //       }
    //       break;

    //     default:
    //       break;
    //   }
    // },
    // onCheckZDJLYSType(item) {
    //   sgworld.Navigate.setPosition(117.44917791230931, 31.87409363277426, 2000);
    //   switch (item.type) {
    //     case 1:
    //       if (item.checked) {
    //         this.kkxjLayer = this.createLayer(item, "icon-sp-point");
    //       } else {
    //         this.kkxjLayer.clear();
    //       }
    //       break;
    //     case 2:
    //       if (item.checked) {
    //         this.gdxjLayer = this.createLayer(item, "icon-gklw");
    //       } else {
    //         this.gdxjLayer.clear();
    //       }
    //       break;

    //     default:
    //       break;
    //   }
    // },
    // onCheckSPJKType(item) {
    //   sgworld.Navigate.setPosition(117.44917791230931, 31.87409363277426, 2000);
    //   switch (item.type) {
    //     case 1:
    //       if (item.checked) {
    //         this.rlkkLayer = this.createLayer(item, "icon-rlxj");
    //       } else {
    //         this.rlkkLayer.clear();
    //       }
    //       break;
    //     case 2:
    //       if (item.checked) {
    //         this.clkkLayer = this.createLayer(item, "icon-clkk");
    //       } else {
    //         this.clkkLayer.clear();
    //       }
    //       break;
    //     case 3:
    //       if (item.checked) {
    //         this.qjjkLayer = this.createLayer(item, "icon-qjjk");
    //       } else {
    //         this.qjjkLayer.clear();
    //       }
    //       break;
    //     case 4:
    //       if (item.checked) {
    //         this.gklwLayer = this.createLayer(item, "icon-gklw");
    //       } else {
    //         this.gklwLayer.clear();
    //       }
    //       break;

    //     default:
    //       break;
    //   }
    // },
    // createLayer(item, image) {
    //   let layer = new SmartEarth.ClusterLayer(Viewer, {
    //     style: "clustering",
    //   });
    //   layer.enableCluster = false;
    //   item.positions.forEach((ele) => {
    //     layer.add(ele, {
    //       image: SmartEarthRootUrl + `Workers/image/${image}.png`,
    //       scale: 0.6,
    //     });
    //   });
    //   return layer;
    // },

    //新增点标绘
    addDBH() {
      let dbhList = JSON.parse(localStorage.getItem("dbhList"));
      sgworld.Creator.createSimpleGraphic("billboard", {}, (entity) => {
        console.log(sgworld.Creator.SimpleGraphic.getStyle(entity));
        let obj = sgworld.Creator.SimpleGraphic.getStyle(entity);
        let degrees = SmartEarth.Cartesian3_to_WGS84(obj.position);
        let coordinates = [];
        let dic = {
          lon: degrees.lon,
          lat: degrees.lat,
        };
        coordinates.push(dic);
        this.$set(obj, "idx", -1);
        this.$set(obj, "coordinates", coordinates);
        dbhList.push(obj);
        localStorage.setItem("dbhList", JSON.stringify(dbhList));
        bus.$emit("yabhTabIndex", 1);
      });
    },
    selectPoint(idx) {
      let dbhList = JSON.parse(localStorage.getItem("dbhList"));
      sgworld.Creator.createSimpleGraphic(
        "billboard",
        {
          image:
            SmartEarthRootUrl +
            `Workers/image/${idx === 0 ? "icon-start" : "icon-end"}.png`,
          scale: 0.85,
        },
        (entity) => {
          console.log(sgworld.Creator.SimpleGraphic.getStyle(entity));
          let obj = sgworld.Creator.SimpleGraphic.getStyle(entity);
          let degrees = SmartEarth.Cartesian3_to_WGS84(obj.position);
          if (idx === 0) {
            this.$refs.left.startLonLat = degrees.lon + "," + degrees.lat;
          } else {
            this.$refs.left.endLonLat = degrees.lon + "," + degrees.lat;
          }
          let coordinates = [];
          let dic = {
            lon: degrees.lon,
            lat: degrees.lat,
          };
          coordinates.push(dic);
          this.$set(obj, "idx", idx);
          this.$set(obj, "coordinates", coordinates);
          let index = dbhList.findIndex((item) => item.idx === obj.idx);
          // 如果有就替换，没有就添加
          if (index !== -1) {
            let item = dbhList[index];
            Viewer.entities.removeById(item.id);
            dbhList.splice(index, 1, obj);
          } else {
            dbhList.push(obj);
          }
          localStorage.setItem("dbhList", JSON.stringify(dbhList));
          bus.$emit("yabhTabIndex", 1);
        }
      );
    },
    //新增线标绘
    addXBH() {
      let xbhList = JSON.parse(localStorage.getItem("xbhList"));
      sgworld.Creator.createSimpleGraphic("polyline", {}, (entity) => {
        console.log(sgworld.Creator.SimpleGraphic.getStyle(entity));
        let obj = sgworld.Creator.SimpleGraphic.getStyle(entity);
        let coordinates = [];
        obj.positions.forEach((item) => {
          let degrees = SmartEarth.Cartesian3_to_WGS84(item);
          let dic = {
            lon: degrees.lon,
            lat: degrees.lat,
          };
          coordinates.push(dic);
        });
        this.$set(obj, "coordinates", coordinates);
        xbhList.push(obj);
        localStorage.setItem("xbhList", JSON.stringify(xbhList));
        bus.$emit("yabhTabIndex", 2);
      });
    },
    //新增面标绘
    addMBH(idx) {
      let mbhList = JSON.parse(localStorage.getItem("mbhList"));
      switch (idx) {
        case 1:
          // sgworld.Creator.createSimpleGraphic("rectangle", {}, (entity) => {
          //   console.log(sgworld.Creator.SimpleGraphic.getStyle(entity));
          //   let obj = sgworld.Creator.SimpleGraphic.getStyle(entity);
          //   let coordinates = this.eswn_to_wgs84(obj.coordinates);
          //   this.$set(obj, "coordinates", coordinates);
          //   mbhList.push(obj);
          //   localStorage.setItem("mbhList", JSON.stringify(mbhList));
          //   bus.$emit("yabhTabIndex", 3);
          // });
          break;
        case 2:
          sgworld.Creator.createSimpleGraphic("circle", {}, (entity) => {
            console.log(sgworld.Creator.SimpleGraphic.getStyle(entity));
            let obj = sgworld.Creator.SimpleGraphic.getStyle(entity);
            let degrees = SmartEarth.Cartesian3_to_WGS84(obj.position);
            let coordinates = [];
            let dic = {
              lon: degrees.lon,
              lat: degrees.lat,
            };
            coordinates.push(dic);
            this.$set(obj, "coordinates", coordinates);
            mbhList.push(obj);
            localStorage.setItem("mbhList", JSON.stringify(mbhList));
            bus.$emit("yabhTabIndex", 3);
          });
          break;
        case 3:
          sgworld.Creator.createSimpleGraphic("polygon", {}, (entity) => {
            console.log(sgworld.Creator.SimpleGraphic.getStyle(entity));
            let obj = sgworld.Creator.SimpleGraphic.getStyle(entity);
            let coordinates = [];
            obj.positions.forEach((item) => {
              let degrees = SmartEarth.Cartesian3_to_WGS84(item);
              let dic = {
                lon: degrees.lon,
                lat: degrees.lat,
              };
              coordinates.push(dic);
            });
            this.$set(obj, "coordinates", coordinates);
            mbhList.push(obj);
            localStorage.setItem("mbhList", JSON.stringify(mbhList));
            bus.$emit("yabhTabIndex", 3);
          });
          break;

        default:
          break;
      }
    },
    //新增体标绘
    addTBH() {
      let tbhList = JSON.parse(localStorage.getItem("tbhList"));
      sgworld.Creator.createSimpleGraphic("box", {}, (entity) => {
        console.log(sgworld.Creator.SimpleGraphic.getStyle(entity));
        let obj = sgworld.Creator.SimpleGraphic.getStyle(entity);
        let degrees = SmartEarth.Cartesian3_to_WGS84(obj.position);
        let coordinates = [];
        let dic = {
          lon: degrees.lon,
          lat: degrees.lat,
        };
        coordinates.push(dic);
        this.$set(obj, "coordinates", coordinates);
        tbhList.push(obj);
        localStorage.setItem("tbhList", JSON.stringify(tbhList));
        bus.$emit("yabhTabIndex", 4);
      });
    },
    //新增警用标绘
    addJYBH(idx) {
      let jybhList = JSON.parse(localStorage.getItem("jybhList"));
      let imageName = this.getJYBHIcon(idx);
      sgworld.Creator.createSimpleGraphic(
        "billboard",
        {
          image: SmartEarthRootUrl + `Workers/image/${imageName}.png`,
          scale: 0.7,
        },
        (entity) => {
          console.log(sgworld.Creator.SimpleGraphic.getStyle(entity));
          let obj = sgworld.Creator.SimpleGraphic.getStyle(entity);
          let degrees = SmartEarth.Cartesian3_to_WGS84(obj.position);
          let coordinates = [];
          let dic = {
            lon: degrees.lon,
            lat: degrees.lat,
          };
          coordinates.push(dic);
          this.$set(obj, "typeIndex", idx);
          this.$set(obj, "coordinates", coordinates);
          jybhList.push(obj);
          localStorage.setItem("jybhList", JSON.stringify(jybhList));
          bus.$emit("yabhTabIndex", 5);
        }
      );
    },
    getJYBHIcon(idx) {
      switch (idx) {
        case 1:
          return "icon-sp-point";
          break;
        case 2:
          return "icon-gklw";
          break;
        case 3:
          return "icon-jjbn";
          break;
        case 4:
          return "icon-jqr";
          break;
        case 5:
          return "icon-mj";
          break;
        case 6:
          return "icon-fj";
          break;
        case 7:
          return "icon-jc";
          break;
        case 8:
          return "icon-ptu";
          break;
        case 9:
          return "icon-wrj";
          break;

        default:
          break;
      }
    },
    //新增线路漫游
    addXLMY() {
      let xlmyList = JSON.parse(localStorage.getItem("xlmyList"));
      sgworld.Command.execute(2, 3, "", (data) => {
        // console.log(data);
        xlmyList.push(data);
        localStorage.setItem("xlmyList", JSON.stringify(xlmyList));
        bus.$emit("cjxxTabIndex", 1);

        data.showPoint = false;
        data.showLine = true;
        data.height = 60;
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
          end: function () {
            PathAnimationData.fly && PathAnimationData.fly.exit();
          },
        });
      });
    },
    //新增定点绕飞
    addDDRF() {
      let allowClick = true;
      sgworld.Analysis.setPointFly();
      let ddrfList = JSON.parse(localStorage.getItem("ddrfList"));
      let handler = new Cesium.ScreenSpaceEventHandler(Viewer.scene.canvas);
      handler.setInputAction((event) => {
        if (allowClick) {
          allowClick = false;
          let p = sgworld.Navigate.getMouseDegrees(event);
          ddrfList.push(p);
          localStorage.setItem("ddrfList", JSON.stringify(ddrfList));
          bus.$emit("cjxxTabIndex", 2);
          console.log(p);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    //新增视角锁定
    addSJSD() { },
    //四至坐标转化成经纬度
    eswn_to_wgs84(coor) {
      const northwest = Cesium.Rectangle.northwest(coor);
      const southwest = Cesium.Rectangle.southwest(coor);
      const northeast = Cesium.Rectangle.northeast(coor);
      const southeast = Cesium.Rectangle.southeast(coor);
      const leftTop = {
        lon: Cesium.Math.toDegrees(northwest.longitude),
        lat: Cesium.Math.toDegrees(northwest.latitude),
      };
      const leftBottom = {
        lon: Cesium.Math.toDegrees(southwest.longitude),
        lat: Cesium.Math.toDegrees(southwest.latitude),
      };
      const rightTop = {
        lon: Cesium.Math.toDegrees(northeast.longitude),
        lat: Cesium.Math.toDegrees(northeast.latitude),
      };
      const rightBottom = {
        lon: Cesium.Math.toDegrees(southeast.longitude),
        lat: Cesium.Math.toDegrees(southeast.latitude),
      };
      return [leftTop, leftBottom, rightTop, rightBottom];
    },
  },
};
</script>
    
<style lang="scss" scoped>
.cp {
  cursor: pointer;
}

.full-box {
  width: 100%;
  height: 100%;
  position: relative;
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

.flex-sb {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.cp {
  cursor: pointer;
}

.top-bg {
  position: absolute;
  top: 0;
  width: 100%;
  height: 97px;
  background: url("../../assets/images/panel/top-bg.png");
  background-size: 100% 100%;
}

.bottom-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 171px;
  background: url("../../assets/images/panel/bottom-bg.png");
  background-size: 100% 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;

  .gzrh-btn-c {
    width: 158px;
    height: 54px;
    background: url("../../assets/images/panel/gzrh-btn-c.png");
    background-size: 100% 100%;
    margin-top: 90px;
    margin-right: 86px;
  }

  .gzrh-btn-s {
    width: 158px;
    height: 54px;
    background: url("../../assets/images/panel/gzrh-btn-s.png");
    background-size: 100% 100%;
    margin-top: 90px;
    margin-right: 86px;
  }

  .tszl-btn-c {
    width: 158px;
    height: 54px;
    background: url("../../assets/images/panel/tszl-btn-c.png");
    background-size: 100% 100%;
    margin-top: 90px;
    margin-right: 185px;
  }

  .tszl-btn-s {
    width: 158px;
    height: 54px;
    background: url("../../assets/images/panel/tszl-btn-s.png");
    background-size: 100% 100%;
    margin-top: 90px;
    margin-right: 185px;
  }

  .zhdd-btn-c {
    width: 158px;
    height: 54px;
    background: url("../../assets/images/panel/zhdd-btn-c.png");
    background-size: 100% 100%;
    margin-top: 90px;
    margin-right: 86px;
  }

  .zhdd-btn-s {
    width: 158px;
    height: 54px;
    background: url("../../assets/images/panel/zhdd-btn-s.png");
    background-size: 100% 100%;
    margin-top: 90px;
    margin-right: 86px;
  }

  .rcfk-btn-c {
    width: 158px;
    height: 54px;
    background: url("../../assets/images/panel/rcfk-btn-c.png");
    background-size: 100% 100%;
    margin-top: 90px;
  }

  .rcfk-btn-s {
    width: 158px;
    height: 54px;
    background: url("../../assets/images/panel/rcfk-btn-s.png");
    background-size: 100% 100%;
    margin-top: 90px;
  }
}

.search-box {
  width: 400px;
  height: 57px;
  background: url("../../assets/images/panel/search-bg.png");
  background-size: 100% 100%;
  position: absolute;
  top: 74px;
  left: calc(50% - 200px);
  padding: 10px;

  .search-btn {
    width: 50px;
    height: 40px;
    background: transparent;
  }
}

.yalx-box {
  display: flex;
  flex-direction: row;
  width: 786px;
  height: 72px;
  position: absolute;
  top: 79px;
  left: calc(50% - 393px);

  .yazl-btn {
    width: 170px;
    height: 72px;
    background: url("../../assets/images/panel/yazl-btn.png");
    background-size: 100% 100%;

    &:hover {
      height: 73px;
      background: url("../../assets/images/panel/yazl-btn-hover.png");
    }
  }

  .yazl-btn-s {
    width: 170px;
    height: 73px;
    background: url("../../assets/images/panel/yazl-btn-hover.png");
    background-size: 100% 100%;
  }

  .hdab-btn {
    width: 170px;
    height: 70px;
    background: url("../../assets/images/panel/hdab-btn.png");
    background-size: 100% 100%;

    &:hover {
      height: 72px;
      background: url("../../assets/images/panel/hdab-btn-hover.png");
    }
  }

  .hdab-btn-s {
    width: 170px;
    height: 72px;
    background: url("../../assets/images/panel/hdab-btn-hover.png");
    background-size: 100% 100%;
  }

  .zdqy-btn {
    width: 170px;
    height: 70px;
    background: url("../../assets/images/panel/zdqy-btn.png");
    background-size: 100% 100%;

    &:hover {
      height: 72px;
      background: url("../../assets/images/panel/zdqy-btn-hover.png");
    }
  }

  .zdqy-btn-s {
    width: 170px;
    height: 72px;
    background: url("../../assets/images/panel/zdqy-btn-hover.png");
    background-size: 100% 100%;
  }

  .fhqgl-btn {
    width: 194px;
    height: 70px;
    background: url("../../assets/images/panel/fhqgl-btn.png");
    background-size: 100% 100%;

    &:hover {
      height: 72px;
      background: url("../../assets/images/panel/fhqgl-btn-hover.png");
    }
  }

  .fhqgl-btn-s {
    width: 194px;
    height: 72px;
    background: url("../../assets/images/panel/fhqgl-btn-hover.png");
    background-size: 100% 100%;
  }
}

.gzsb-box {
  width: 593px;
  height: 352px;
  background: url("../../assets/images/panel/gzsb-bg.png");
  background-size: 100% 100%;
  position: absolute;
  top: 150px;
  left: calc(50% - 297px);
  z-index: 99;

  .gzsb-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    width: 570px;
    height: 40px;
    background: url("../../assets/images/panel/gzsb-head.png");
    background-size: 100% 100%;
    margin: 10px 19px 10px 10px;

    .gzsb-close {
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
  }

  .gzsb-content {
    .zpt-box {
      width: 193px;
      height: 130px;
      border: 1px solid #4d77ff;
      border-radius: 4px;
      margin-left: 27px;
      margin-right: 27px;
      padding: 4px 3px;
      position: relative;

      .tip-box {
        position: absolute;
        left: 3px;
        bottom: 4px;
        width: 185px;
        height: 24px;
        background: rgba(6, 24, 53, 0.5);
        font-size: 14px;
        line-height: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #c2d9ff;
      }
    }

    .gzsb-text {
      width: 290px;
      font-size: 14px;
      line-height: 15px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #bed2f2;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      cursor: pointer;
    }
  }
}

.gjts-box {
  width: 632px;
  height: 378px;
  background: url("../../assets/images/panel/rlyj-bg.png");
  background-size: 100% 100%;
  position: absolute;
  top: 150px;
  left: calc(50% - 316px);
  z-index: 99;

  .gjts-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    width: 603px;
    height: 40px;
    background: url("../../assets/images/panel/gjts-head.png");
    background-size: 100% 100%;
    margin: 10px 19px 10px 10px;

    .gjts-close {
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
  }

  .gjts-content {
    .zpt-box {
      width: 193px;
      height: 130px;
      border: 1px solid #4d77ff;
      border-radius: 4px;
      margin-left: 27px;
      margin-right: 27px;
      padding: 4px 3px;
      position: relative;

      .tip-box {
        position: absolute;
        left: 3px;
        bottom: 4px;
        width: 185px;
        height: 24px;
        background: rgba(6, 24, 53, 0.5);
        font-size: 14px;
        line-height: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #c2d9ff;
      }
    }

    .gjts-text {
      width: 330px;
      font-size: 14px;
      line-height: 15px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #bed2f2;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      cursor: pointer;
    }

    .gjts-btn-bg {
      width: 127px;
      height: 51px;
      background: url("../../assets/images/panel/rlyj-btn-bg.png");
      background-size: 100% 100%;
      font-size: 16px;
      line-height: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #bed2f2;

      &:hover {
        background: url("../../assets/images/panel/rlyj-btn-hover-bg.png");
      }
    }
  }
}

.dwgk-box {
  width: 632px;
  height: 528px;
  background: url("../../assets/images/panel/dwgk-bg.png");
  background-size: 100% 100%;
  position: absolute;
  top: 150px;
  left: calc(50% - 316px);
  z-index: 99;

  .dwgk-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    width: 603px;
    height: 40px;
    background: url("../../assets/images/panel/dwgk-head.png");
    background-size: 100% 100%;
    margin: 10px 19px 16px 10px;

    .dwgk-close {
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
  }

  .dwgk-tab-box {
    margin-left: 36px;
    margin-bottom: 16px;
    width: 554px;
    height: 34px;
    background: url("../../assets/images/panel/dwgk-tab-bg.png");
    background-size: 100% 100%;

    .tab-item {
      padding: 8px 13px;
      font-size: 14px;
      line-height: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #b2d0ff;
      cursor: pointer;
      margin-right: 30px;
    }

    .select-item-bg {
      padding: 14px 20px;
      background: url("../../assets/images/panel/select-item-bg.png");
      background-size: 100% 100%;
      color: #fff;
    }
  }

  .sbyc-bg {
    width: 240px;
    height: 68px;
    background: url("../../assets/images/panel/sbyc-bg.png");
    background-size: 100% 100%;
    padding-left: 66px;
  }

  .sbyj-bg {
    width: 240px;
    height: 68px;
    background: url("../../assets/images/panel/sbyj-bg.png");
    background-size: 100% 100%;
    padding-left: 66px;
  }

  .title-text {
    line-height: 14px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #adddff;
  }

  .count-text {
    line-height: 22px;
    font-size: 22px;
    font-family: ZHCJJZT;
    font-weight: 800;
    color: #ffe069;
  }
}

.poi-box {
  width: 594px;
  height: 362px;
  background: url("../../assets/images/panel/poi-bg.png");
  background-size: 100% 100%;
  position: absolute;
  top: 150px;
  left: calc(50% - 297px);
  z-index: 99;

  .poi-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    width: 570px;
    height: 40px;
    background: url("../../assets/images/panel/poi-head.png");
    background-size: 100% 100%;
    margin: 10px 19px 16px 10px;

    .poi-close {
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
  }

  .poi-content {
    padding: 30px;

    .poi-text {
      width: 330px;
      font-size: 15px;
      line-height: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #bed2f2;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      cursor: pointer;
    }
  }
}

.video-box {
  width: 1200px;
  height: 680px;
  background: url("../../assets/images/panel/video-bg.png");
  background-size: 100% 100%;
  position: absolute;
  top: 150px;
  left: calc(50% - 600px);
  z-index: 999;

  .video-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    width: 1160px;
    height: 40px;
    background: url("../../assets/images/panel/sssp-head.png");
    background-size: 100% 100%;
    margin: 9px 22px 16px 18px;

    .video-close {
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
  }

  .video-content {
    padding: 10px 20px 25px;

    .ptz-box {
      width: 144px;
      height: 144px;
      background: url("../../assets/images/video/bg.png");
      background-size: 100% 100%;
      position: relative;

      .mid-box {
        position: absolute;
        top: 44px;
        left: 44px;
        width: 56px;
        height: 56px;
        background: url("../../assets/images/video/mid-bg.png");
        background-size: 100% 100%;
      }

      .s-box {
        position: absolute;
        top: 15px;
        left: 66px;
        width: 12px;
        height: 8px;
        background: url("../../assets/images/video/s.png");
        background-size: 100% 100%;
      }

      .x-box {
        position: absolute;
        bottom: 13px;
        left: 66px;
        width: 12px;
        height: 8px;
        background: url("../../assets/images/video/x.png");
        background-size: 100% 100%;
      }

      .z-box {
        position: absolute;
        top: 66px;
        left: 14px;
        width: 9px;
        height: 13px;
        background: url("../../assets/images/video/z.png");
        background-size: 100% 100%;
      }

      .y-box {
        position: absolute;
        top: 66px;
        right: 14px;
        width: 9px;
        height: 13px;
        background: url("../../assets/images/video/y.png");
        background-size: 100% 100%;
      }

      .zs-box {
        position: absolute;
        top: 34px;
        left: 33px;
        width: 6px;
        height: 6px;
        background: url("../../assets/images/video/zs.png");
        background-size: 100% 100%;
      }

      .ys-box {
        position: absolute;
        top: 34px;
        right: 28px;
        width: 6px;
        height: 6px;
        background: url("../../assets/images/video/ys.png");
        background-size: 100% 100%;
      }

      .zx-box {
        position: absolute;
        bottom: 31px;
        left: 33px;
        width: 6px;
        height: 6px;
        background: url("../../assets/images/video/zx.png");
        background-size: 100% 100%;
      }

      .yx-box {
        position: absolute;
        bottom: 31px;
        right: 28px;
        width: 6px;
        height: 6px;
        background: url("../../assets/images/video/yx.png");
        background-size: 100% 100%;
      }
    }

    .jia-box {
      width: 40px;
      height: 32px;
      background: url("../../assets/images/video/jia.png");
      background-size: 100% 100%;
    }

    .jian-box {
      width: 40px;
      height: 32px;
      background: url("../../assets/images/video/jian.png");
      background-size: 100% 100%;
    }

    .capture-box {
      width: 28px;
      height: 28px;
      background: url("../../assets/images/video/capture.png");
      background-size: 100% 100%;
      margin-right: 10px;
    }

    .fullscreen-box {
      width: 28px;
      height: 28px;
      background: url("../../assets/images/video/fullscreen.png");
      background-size: 100% 100%;
      margin-right: 10px;
    }

    .video-text {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #ffffff;
      line-height: 16px;
    }
  }
}

.back-icon {
  width: 66px;
  height: 24px;
  background: url("../../assets/images/panel/icon-back.png");
  background-size: 100% 100%;
  margin-left: 36px;
  margin-bottom: 16px;
}

.table-head {
  margin-left: 36px;
  width: 554px;
  height: 32px;
  background: url("../../assets/images/panel/zdjq-table-head.png");
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
  margin-left: 36px;
  max-height: 324px;
  overflow: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  .table-item {
    width: 554px;
    height: 32px;
    margin-top: 4px;

    &:hover {
      background: url("../../assets/images/panel/zdjq-item-hover.png");
      background-size: 100% 100%;
      color: rgba(212, 226, 255, 1);
    }

    .rank-box {
      width: 41px;
      height: 15px;
      margin: 0 20px 0 11px;
      font-size: 16px;
      line-height: 16px;
      font-family: YouSheBiaoTiHei;
      font-weight: 400;
      color: #dbe6fe;
    }
  }

  .bg1 {
    background: url("../../assets/images/panel/zdjq-item-bg1.png");
    background-size: 100% 100%;
  }

  .bg2 {
    background: url("../../assets/images/panel/zdjq-item-bg2.png");
    background-size: 100% 100%;
  }
}

.page-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.poi-board {
  width: 229px;
  height: 250px;
  position: absolute;
  top: 214px;
  left: 525px;
  z-index: 99;

  .poi-head {
    width: 229px;
    height: 30px;
    background: url("../../assets/images/panel/board-head.png");
    background-size: 100% 100%;
    padding: 0 10px;

    .head-text {
      font-size: 16px;
      line-height: 16px;
      font-family: YouSheBiaoTiHei;
      font-weight: 400;
      color: #e9f1ff;
      margin-top: 4px;
    }

    .poi-close {
      width: 13px;
      height: 13px;
      margin-top: 5px;
    }
  }

  .poi-content {
    width: 229px;
    height: 220px;
    background: url("../../assets/images/panel/board-content.png");
    background-size: 100% 100%;
    padding: 0px 10px;
    max-height: 198px;
    overflow: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.wlsb-board {
  width: 229px;
  height: 250px;
  position: absolute;
  top: 496px;
  left: 486px;
  z-index: 99;

  .wlsb-head {
    width: 229px;
    height: 30px;
    background: url("../../assets/images/panel/board-head.png");
    background-size: 100% 100%;
    padding: 0 10px;

    .head-text {
      font-size: 16px;
      line-height: 16px;
      font-family: YouSheBiaoTiHei;
      font-weight: 400;
      color: #e9f1ff;
      margin-top: 4px;
    }

    .wlsb-close {
      width: 13px;
      height: 13px;
      margin-top: 5px;
    }
  }

  .wlsb-content {
    width: 229px;
    height: 220px;
    background: url("../../assets/images/panel/board-content.png");
    background-size: 100% 100%;
    padding: 0px 10px;
    max-height: 198px;
    overflow: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }
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

::v-deep .el-tree {
  background: transparent;
  color: #b0ceff;
}

::v-deep .el-tree-node__label {
  font-size: 14px;
}

::v-deep .el-tree-node__content {
  height: 30px;

  &:hover {
    background: transparent;
  }
}

::v-deep .el-tree-node.is-current>.el-tree-node__content {
  background: transparent;
}

::v-deep .el-tree-node.is-focusable>.el-tree-node__content {
  background: transparent;
}

::v-deep .el-checkbox__inner {
  border: 1px solid #6bbeff;
  width: 13px;
  height: 13px;
  background-color: transparent;
  margin-top: 4px;
}

::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #a2dbff;
  border-color: transparent;
}

::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #a2dbff;
  border-color: transparent;
}

::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
  background-color: #000000;
}

::v-deep .el-checkbox__inner::after {
  box-sizing: content-box;
  content: "";
  border: 1px solid #000000;
  border-left: 0;
  border-top: 0;
  height: 7px;
  left: 4px;
  position: absolute;
  top: 1px;
  width: 3px;
  transition: transform 0.15s ease-in 0.05s,
    -webkit-transform 0.15s ease-in 0.05s;
  transform-origin: center;
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

::v-deep .el-radio {
  color: #d8e7ff;
}

::v-deep .el-radio__input.is-checked+.el-radio__label {
  color: #d8e7ff;
}

::v-deep .el-radio__input.is-checked .el-radio__inner {
  border-color: #68daff;
  background: #68daff;
}

::v-deep .el-radio__inner {
  border: 1px solid #6bbeff;
  background-color: #173e70;
}

::v-deep .el-radio__inner::after {
  width: 6px;
  height: 6px;
  border-radius: 100%;
  background-color: #173e70;
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
  color: #68daff;
}

::v-deep .el-pagination.is-background .btn-next,
.el-pagination.is-background .el-pager li {
  background-color: rgba(107, 232, 250, 0.1);
  border: 1px solid #68daff;
  color: #68daff;
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