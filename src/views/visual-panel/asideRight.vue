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
          <div class="logout-box" v-if="showLogout">
            <div class="flex-row logout-item cp" @click="onLogout">
              <img style="width: 8px; height: 8px; margin-right: 8px" src="../../assets/images/panel/logout-tip.png"
                alt="" />
              <span class="logout-text">退出登录</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 感知融合 -->
      <gzrh-right v-if="currentIndex === 1"></gzrh-right>
      <!-- 日常防控 -->
      <rcfk-right v-if="currentIndex === 4"></rcfk-right>
    </div>
    <tool-right v-show="showRightPanel"></tool-right>
  </div>
</template>

<script>
import GzrhRight from "./right/gzrhRight.vue";
import RcfkRight from "./right/rcfkRight.vue";
import ToolRight from "./right/toolRight.vue";

export default {
  components: {
    GzrhRight,
    RcfkRight,
    ToolRight,
  },
  props: {
    currentIndex: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      showRightPanel: true,
      showLogout: false,
      poiHover: false,
      spjkHover: false,
      wlsbHover: false,
    };
  },
  methods: {
    handelRightPanel() {
      this.showRightPanel = !this.showRightPanel;
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
  },
};
</script>

<style lang="scss" scoped>
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