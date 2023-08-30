<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="85px"
        >
          <el-form-item label="预置位名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入预置位名称"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:add']"
              >新增</el-button
            >
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="deviceList" max-height="650">
          <el-table-column label="预置位序号" align="center" prop="presetIndex" />
          <el-table-column label="预置位名称" align="center" prop="name" />
          <el-table-column label="预置位图片" align="center">
            <template slot-scope="scope">
              <el-image
                style="width: 80px; height: 45px"
                :src="viewFileNoAuth(scope.row.image)"
                :preview-src-list="[viewFileNoAuth(scope.row.image)]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改点位配置对话框 -->
    <div v-if="open">
      <el-dialog
        title="新建预置位"
        :visible.sync="open"
        width="1000px"
        append-to-body
        :before-close="cancel"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-col>
            <el-form-item label="预置位名称：" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入预置位名称"
                style="width: 240px"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="预置位序号：" prop="presetIndex">
              <el-select
                v-model="form.presetIndex"
                placeholder="请选择"
                clearable
                style="width: 240px"
              >
                <el-option
                  :label="item"
                  :value="index + 1"
                  v-for="(item, index) in 10"
                  :key="index"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <div
              id="divPlugin"
              class="divPlugin"
              style="width: 960px; height: 540px"
            ></div>
          </el-col>
          <el-col>
            <div class="video-play" style="margin-top: 20px;">
              <div class="column-center" style="margin-right: 100px;">
                <div class="row-center">
                  <div
                    style="margin-right: 10px"
                    class="ptz-button row-center"
                    @mousedown="mouseDownPTZControl(5)"
                    @mouseup="mouseUpPTZControl"
                  >
                    左上
                  </div>
                  <div
                    style="margin-right: 10px"
                    class="ptz-button row-center"
                    @mousedown="mouseDownPTZControl(1)"
                    @mouseup="mouseUpPTZControl"
                  >
                    向上
                  </div>
                  <div
                    class="ptz-button row-center"
                    @mousedown="mouseDownPTZControl(7)"
                    @mouseup="mouseUpPTZControl"
                  >
                    右上
                  </div>
                </div>
                <div class="row-center" style="margin-top: 10px">
                  <div
                    style="margin-right: 10px"
                    class="ptz-button row-center"
                    @mousedown="mouseDownPTZControl(3)"
                    @mouseup="mouseUpPTZControl"
                  >
                    向左
                  </div>
                  <div
                    style="margin-right: 10px"
                    class="ptz-button row-center"
                    @click="mouseDownPTZControl(9)"
                  >
                    自动
                  </div>
                  <div
                    class="ptz-button row-center"
                    @mousedown="mouseDownPTZControl(4)"
                    @mouseup="mouseUpPTZControl"
                  >
                    向右
                  </div>
                </div>
                <div class="row-center" style="margin-top: 10px">
                  <div
                    style="margin-right: 10px"
                    class="ptz-button row-center"
                    @mousedown="mouseDownPTZControl(6)"
                    @mouseup="mouseUpPTZControl"
                  >
                    左下
                  </div>
                  <div
                    style="margin-right: 10px"
                    class="ptz-button row-center"
                    @mousedown="mouseDownPTZControl(2)"
                    @mouseup="mouseUpPTZControl"
                  >
                    向下
                  </div>
                  <div
                    class="ptz-button row-center"
                    @mousedown="mouseDownPTZControl(8)"
                    @mouseup="mouseUpPTZControl"
                  >
                    右下
                  </div>
                </div>
              </div>
              <div class="column-center">
                <div class="row-center">
                  <div
                    class="size-button row-center"
                    @mousedown="PTZZoomIn"
                    @mouseup="PTZZoomStop"
                  >
                    +
                  </div>
                  <span style="margin: 0 20px">焦距</span>
                  <div
                    class="size-button row-center"
                    @mousedown="PTZZoomout"
                    @mouseup="PTZZoomStop"
                  >
                    -
                  </div>
                </div>
                <div class="row-center" style="margin-top: 10px">
                  <div
                    class="size-button row-center"
                    @mousedown="PTZFocusIn"
                    @mouseup="PTZFoucusStop"
                  >
                    +
                  </div>
                  <span style="margin: 0 20px">焦点</span>
                  <div
                    class="size-button row-center"
                    @mousedown="PTZFoucusOut"
                    @mouseup="PTZFoucusStop"
                  >
                    -
                  </div>
                </div>
                <div class="row-center" style="margin-top: 10px">
                  <div
                    class="size-button row-center"
                    @mousedown="PTZIrisIn"
                    @mouseup="PTZIrisStop"
                  >
                    +
                  </div>
                  <span style="margin: 0 20px">光圈</span>
                  <div
                    class="size-button row-center"
                    @mousedown="PTZIrisOut"
                    @mouseup="PTZIrisStop"
                  >
                    -
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  pagePreset,
  delPreset,
  addPreset,
  getDevice,
} from "@/api/perception/device";
import { viewFileNoAuth } from "@/api/oss";
import { WebVideo } from "@/utils/webVideoCtrl.js";

export default {
  // name: "Preset",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      deviceList: null,
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
        ],
        presetIndex: [
          { required: true, message: "设备类型不能为空", trigger: "change" },
        ],
      },

      cameraId: undefined,
      webVideo: "",
      hkvInfo: {
        ip: "",
        port: "",
        username: "",
        password: "",
      },
    };
  },
  created() {
    this.cameraId = this.$route.query.cameraId;
    this.getList();
  },
  methods: {
    viewFileNoAuth,
    /** 查询列表 */
    getList() {
      this.loading = true;
      pagePreset(this.queryParams).then((response) => {
        this.deviceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.stopVideoPlay();
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        cameraId: undefined,
        name: undefined,
        presetIndex: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      getDevice(this.cameraId).then((response) => {
        this.hkvInfo = {
          ip: response.data.ip,
          port: response.data.port,
          username: response.data.accessName,
          password: response.data.accessSecret,
        };
        this.open = true;
        this.initVideoPlay();
      });
    },
    initVideoPlay() {
      this.webVideo = new WebVideo();
      this.$nextTick(() => {
        this.webVideo.init(
          this.hkvInfo.ip,
          this.hkvInfo.port,
          this.hkvInfo.username,
          this.hkvInfo.password
        );
        this.webVideo.clickLogin();
      });
    },
    stopVideoPlay() {
      this.webVideo.clickStopRealPlay();
      this.webVideo.clickLogout();
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.webVideo.clickSetPreset(this.form.presetIndex);
          this.form.cameraId = this.cameraId;
          addPreset(this.form).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm("是否确认删除此数据项？")
        .then(function () {
          return delPreset(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
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
  },
};
</script>

<style lang="scss" scoped>
.row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.column-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.video-play {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.ptz-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #1890ff;
  color: #1890ff;
}
.size-button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #1890ff;
  color: #1890ff;
  font-size: 18px;
}
.flex {
  display: flex;

  &.vertical-center {
    align-items: center;
  }
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-uploader {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 75px;
  margin-right: 12px;
  border-radius: 4px;
  text-align: center;
}
.avatar {
  width: 73px;
  height: 73px;
  border-radius: 4px;
}
.avatar-uploader:hover .el-upload-list__item-actions {
  display: block;
}
.el-upload-list__item-actions {
  display: none;
  width: 100%;
  height: 100%;
  cursor: default;
  text-align: center;
  color: #fff;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
}
::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 75px;
  height: 75px;
}
::v-deep .el-upload--picture-card {
  width: 75px;
  height: 75px;
  line-height: 1;
}
::v-deep .hide .el-upload--picture-card {
  display: none;
}
</style>                                                                                                                                          