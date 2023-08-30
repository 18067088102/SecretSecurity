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
          label-width="68px"
        >
          <el-form-item label="监控名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入监控名称"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="设备IP" prop="ip">
            <el-input
              v-model="queryParams.ip"
              placeholder="请输入设备IP"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="设备品牌" prop="brand">
            <el-input
              v-model="queryParams.brand"
              placeholder="请输入设备品牌"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="online">
            <el-select
              v-model="queryParams.online"
              placeholder="请选择"
              clearable
              style="width: 240px"
            >
              <el-option label="在线" value="1" />
              <el-option label="离线" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
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
          <el-table-column label="监控名称" align="center" prop="name" />
          <el-table-column label="相机类型" align="center" prop="cameraType">
            <template slot-scope="scope">
              <span>{{ scope.row.cameraType === 1 ? "枪机" : "球机" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="设备品牌" align="center" prop="brand" />
          <el-table-column label="设备IP" align="center" prop="ip" />
          <el-table-column label="端口号" align="center" prop="port" />
          <el-table-column label="通道号" align="center" prop="channel" />
          <el-table-column
            label="安装位置"
            align="center"
            prop="installPosition"
          />
          <el-table-column label="当前状态" align="center">
            <template slot-scope="scope">
              <span
                :style="{
                  color: scope.row.online === 1 ? '#67C23A' : '#F56C6C',
                }"
                >{{ scope.row.online === 1 ? "在线" : "离线" }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="关联预置位" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="onPresetPage(scope.row)">{{
                scope.row.presetCount ? scope.row.presetCount : 0
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime">
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
                icon="el-icon-document"
                @click="onOpenVideo(scope.row)"
                >视频预览</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                >编辑</el-button
              >
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
        :title="title"
        :visible.sync="open"
        width="50%"
        append-to-body
        :before-close="cancel"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-col>
            <el-form-item label="设备名称：" prop="name">
              <el-input v-model="form.name" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="设备类型：" prop="cameraType">
              <el-select
                v-model="form.cameraType"
                placeholder="请选择"
                clearable
              >
                <el-option label="枪机" :value="1" />
                <el-option label="球机" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="设备IP：" prop="ip">
              <el-input v-model="form.ip" placeholder="请输入设备IP" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="端口号：" prop="port">
              <el-input v-model="form.port" placeholder="请输入端口号" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="通道号：" prop="channel">
              <el-input v-model="form.channel" placeholder="请输入通道号" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="服务端口：" prop="servicePort">
              <el-input
                v-model="form.servicePort"
                placeholder="服务端口默认为8000"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="用户名：" prop="accessName">
              <el-input v-model="form.accessName" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="密码：" prop="accessSecret">
              <el-input v-model="form.accessSecret" placeholder="请输入密码" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="设备品牌：" prop="brand">
              <el-input v-model="form.brand" placeholder="请输入设备品牌" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="安装点位：" prop="height">
              <drawer-map
                :datas="form"
                @lngLat="lngLat($event)"
                @semId="semId($event)"
              ></drawer-map>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="安装位置：" prop="installPosition">
              <el-input
                v-model="form.installPosition"
                placeholder="请输入安装位置"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="位置图片：" prop="installPic">
              <div class="flex">
                <div class="show-img">
                  <div class="flex-center">
                    <div
                      class="avatar-uploader"
                      style="margin-right: 8px"
                      v-for="(item, index) in fileListArr"
                      :key="index"
                    >
                      <el-image
                        :src="viewFileNoAuth(item.path)"
                        class="avatar"
                      />
                      <span
                        class="el-upload-list__item-actions"
                        @click="deleteImg(item, index)"
                        style="
                          position: absolute;
                          top: 0;
                          right: 0;
                          cursor: pointer;
                          z-index: 3;
                        "
                      >
                        <i class="el-icon-delete" style="margin-top: 25px"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <el-upload
                  :class="{ hide: hideUpload }"
                  name="file"
                  :show-file-list="false"
                  auto-upload
                  multiple
                  :action="action"
                  list-type="picture-card"
                  :limit="limitCountImg"
                  :file-list="fileList"
                  :on-remove="onRemove"
                  :on-success="onSuccess"
                  :on-change="imgChage"
                >
                  <i class="el-icon-plus" style="margin-top: 22px"></i>
                </el-upload>
              </div>
            </el-form-item>
          </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>

    <div v-if="openVideo">
      <el-dialog
        title="视频预览"
        :visible.sync="openVideo"
        width="1000px"
        append-to-body
        :before-close="closeVideo"
      >
        <video-preview
          ref="preview6"
          :previewInfo="previewInfo"
        ></video-preview>
      </el-dialog>
    </div>
  </div>
</template>
    
<script>
import {
  pageDevice,
  getDevice,
  delDevice,
  addDevice,
  updateDevice,
} from "@/api/perception/device";
import { uploadFile, viewFileNoAuth } from "@/api/oss";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  // name: "Spjk",
  components: {
    Treeselect,
    DrawerMap: () => import("@/views/visual-panel/components/drawerMap"),
    VideoPreview: () => import("@/views/perception/components/preview"),
  },
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
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openVideo: false,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        ip: undefined,
        brand: undefined,
        online: undefined,
        type: 6,
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
        ],
        cameraType: [
          { required: true, message: "设备类型不能为空", trigger: "change" },
        ],
        ip: [{ required: true, message: "设备IP不能为空", trigger: "blur" }],
        port: [{ required: true, message: "端口号不能为空", trigger: "blur" }],
        channel: [
          { required: true, message: "通道号不能为空", trigger: "blur" },
        ],
        servicePort: [
          { required: true, message: "服务端口不能为空", trigger: "blur" },
        ],
        accessName: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        accessSecret: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
        height: [
          { required: true, message: "安装点位不能为空", trigger: "blur" },
        ],
        installPosition: [
          { required: true, message: "安装位置不能为空", trigger: "blur" },
        ],
        installPic: [
          { required: true, message: "位置图片不能为空", trigger: "change" },
        ],
      },

      limitCountImg: 1,
      hideUpload: false,
      fileList: [],
      fileListArr: [],

      previewInfo: {
        ip: "",
        port: "",
        username: "",
        password: "",
      },
    };
  },
  computed: {
    action() {
      return uploadFile();
    },
  },
  created() {
    this.getList();
  },
  methods: {
    uploadFile,
    viewFileNoAuth,
    /** 查询列表 */
    getList() {
      this.loading = true;
      pageDevice(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.deviceList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.fileListArr = [];
      this.hideUpload = this.fileListArr.length >= this.limitCountImg;
      this.form = {
        type: 6,
        buildingId: undefined,
        longitude: undefined,
        latitude: undefined,
        height: undefined,
        name: undefined,
        ip: undefined,
        port: undefined,
        channel: undefined,
        servicePort: 8000,
        accessName: undefined,
        accessSecret: undefined,
        brand: undefined,
        installPosition: undefined,
        installPic: undefined,
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新建设备";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getDevice(row.id).then((response) => {
        this.form = response.data;
        let obj = {
          path: this.form.installPic,
        };
        this.fileListArr.push(obj);
        this.hideUpload = this.fileListArr.length >= this.limitCountImg;
        this.open = true;
        this.title = "编辑设备";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.installPic = this.form.installPic[0].path;
          if (this.form.id != undefined) {
            updateDevice(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDevice(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm("是否确认删除此数据项？")
        .then(function () {
          return delDevice(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    onSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.fileList = fileList;
        let obj = {
          path: file.response.data,
        };
        this.fileListArr.push(obj);
        this.form.installPic = this.fileListArr;
        this.hideUpload = this.fileList.length >= this.limitCountImg;
      } else {
        this.fileList.pop();
        this.$message.warning(`上传失败`);
      }
    },
    async onRemove(file, fileList) {
      this.fileList = fileList;
      let obj = {
        path: file.response.data,
      };
      this.fileListArr.push(obj);
      this.form.installPic = this.fileListArr;
      this.hideUpload = this.fileList.length >= this.limitCountImg;
    },
    imgChage(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCountImg;
    },
    //删除图片
    async deleteImg(item, index) {
      this.fileList.splice(index, 1);
      this.fileListArr.splice(index, 1);
      this.hideUpload = this.fileList.length >= this.limitCountImg;
      this.form.installPic = this.fileListArr;
    },
    lngLat(p) {
      this.form.longitude = p.lon;
      this.form.latitude = p.lat;
      this.form.height = p.height;
    },
    semId(semId) {
      this.form.buildingId = semId;
    },

    onPresetPage(row) {
      if (!row.cameraId) {
        return this.$modal.msgError("请绑定监控设备");
      }
      this.$router
        .push({ path: "/perception/preset", query: { cameraId: row.id } })
        .catch(() => {});
    },

    /** 视频预览按钮操作 */
    onOpenVideo(row) {
      this.previewInfo = {
        ip: row.ip,
        port: row.port,
        username: row.accessName,
        password: row.accessSecret,
      };
      this.openVideo = true;
      // this.$refs.preview6.initVideoPlay();
    },
    closeVideo() {
      this.openVideo = false;
      this.$refs.preview6.stopVideoPlay();
    },
  },
};
</script>

<style lang="scss" scoped>
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