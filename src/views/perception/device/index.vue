<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="类名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入类名称"
          clearable
          style="width: 240px"
          @change="handleQuery"
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

    <el-row :gutter="20">
      <el-col
        :span="4"
        :xs="24"
        v-for="(item, index) in typeLists"
        :key="index"
      >
        <div class="item-box" @click="onItemClick(item)">
          <img
            v-if="index === 0"
            style="width: 76px; height: 82px"
            src="../../../assets/images/panel/icon-mc.png"
            alt=""
          />
          <img
            v-if="index === 1"
            style="width: 76px; height: 82px"
            src="../../../assets/images/panel/icon-rthw.png"
            alt=""
          />
          <img
            v-if="index === 2"
            style="width: 76px; height: 82px"
            src="../../../assets/images/panel/icon-jg.png"
            alt=""
          />
          <img
            v-if="index === 3"
            style="width: 76px; height: 82px"
            src="../../../assets/images/panel/icon-kqjc.png"
            alt=""
          />
          <img
            v-if="index === 4"
            style="width: 76px; height: 82px"
            src="../../../assets/images/panel/icon-hzyg.png"
            alt=""
          />
          <img
            v-if="index === 5"
            style="width: 76px; height: 82px"
            src="../../../assets/images/panel/icon-zgd.png"
            alt=""
          />
          <img
            v-if="index === 6"
            style="width: 76px; height: 82px"
            src="../../../assets/images/panel/icon-sjbj.png"
            alt=""
          />
          <img
            v-if="index === 7"
            style="width: 76px; height: 82px"
            src="../../../assets/images/panel/icon-sos.png"
            alt=""
          />
          <span class="name-text">{{ item.name }}</span>
          <span class="desc-text">{{
            item.description ? item.description : "暂无描述"
          }}</span>
          <span class="name-text" style="color: #979797;margin-top: 12px;"
            ><span class="count-text">{{ item.deviceCount }}</span
            >个设备</span
          >
        </div>
        <!-- <div v-else class="add-box" @click="onAddClick">
          <i class="el-icon-plus" style="font-size: 30px"></i>
          <span style="margin-top: 10px">新增类</span>
        </div> -->
      </el-col>
    </el-row>

    <!-- 添加或修改类型配置对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-col>
          <el-form-item label="类型名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入类型名称" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="类型描述">
            <el-input
              v-model="form.description"
              type="textarea"
              placeholder="请输入类型描述内容"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { listDeviceType } from "@/api/perception/device";
export default {
  name: "Device",
  data() {
    return {
      typeLists: [],
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: null,
      // 弹出层标题
      title: "",
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
          { required: true, message: "类型名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listDeviceType(this.queryParams).then((response) => {
        this.typeLists = response.data;
        // this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        name: undefined,
        description: undefined,
      };
      this.resetForm("form");
    },
    submitForm() {},
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
    onItemClick(item) {
      let path = "";
      switch (item.type) {
        case 1:
          path = "mc";
          break;
        case 2:
          path = "rthw";
          break;
        case 3:
          path = "jg";
          break;
        case 4:
          path = "kqjc";
          break;
        case 5:
          path = "hzyg";
          break;
        case 6:
          path = "spjk";
          break;
        case 7:
          path = "sjbj";
          break;
        case 8:
          path = "sos";
          break;

        default:
          break;
      }
      this.$router.push("/perception/" + path);
    },
    onAddClick() {
      this.reset();
      this.open = true;
      this.title = "新建类型";
    },
  },
};
</script>

<style lang="scss" scoped>
.item-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  margin-bottom: 20px;
  border: 1px solid rgba(246, 246, 246, 1);
  cursor: pointer;
}
.add-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  height: 255px;
  margin-bottom: 20px;
  background: rgba(249, 249, 249, 1);
  border: 1px solid rgba(246, 246, 246, 1);
  cursor: pointer;
}
.name-text {
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #303030;
  line-height: 14px;
  margin-top: 16px;
}
.desc-text {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6d6d6d;
  line-height: 12px;
  margin-top: 8px;
}
.count-text {
  font-family: DIN-Bold, DIN;
  font-weight: bold;
  color: #409efd;
  margin-right: 4px;
}
</style>
