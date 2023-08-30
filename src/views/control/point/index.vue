<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--建筑分类数据-->
      <el-col :span="3" :xs="24">
        <div class="head-container">
          <el-tree
            :data="options"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--建筑点位数据-->
      <el-col :span="21" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="点位名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入点位名称"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="更新时间">
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

        <el-table v-loading="loading" :data="pointList" max-height="650">
          <el-table-column
            label="点位名称"
            align="center"
            key="name"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="建筑分类"
            align="center"
            key="typeName"
            prop="typeName"
          />
          <el-table-column
            label="高度(米)"
            align="center"
            key="height"
            prop="height"
          />
          <el-table-column
            label="楼层数"
            align="center"
            key="floorNumber"
            prop="floorNumber"
          />
          <el-table-column
            label="详细地址"
            align="center"
            key="detailAddress"
            prop="detailAddress"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="更新时间" align="center" prop="updateTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.updateTime) }}</span>
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
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document"
                @click="handleDetail(scope.row)"
                >详情</el-button
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
        top="5vh"
        append-to-body
        :before-close="cancel"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <div class="flex-row">
            <el-col>
              <el-form-item label="建筑分类" prop="typeId">
                <treeselect
                  :disabled="isDetail"
                  v-model="form.typeId"
                  :options="options"
                  :show-count="false"
                  placeholder="请选择建筑分类"
                  @select="handleSelect"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="建筑名称" prop="name">
                <el-input
                  :disabled="isDetail"
                  v-model="form.name"
                  placeholder="请输入建筑名称"
                />
              </el-form-item>
            </el-col>
          </div>
          <div class="flex-row">
            <el-col>
              <el-form-item label="高度" prop="height">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.height"
                  placeholder="请输入高度"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="楼层数" prop="floorNumber">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.floorNumber"
                  placeholder="请输入楼层数"
                />
              </el-form-item>
            </el-col>
          </div>
          <div class="flex-row">
            <el-col>
              <el-form-item label="经度" prop="longitude">
                <el-input
                  disabled
                  v-model="form.longitude"
                  placeholder="请输入经度"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="纬度" prop="latitude">
                <el-input
                  disabled
                  v-model="form.latitude"
                  placeholder="请输入纬度"
                />
              </el-form-item>
            </el-col>
          </div>
          <div class="flex-row" style="margin-bottom: 20px">
            <drawer-map
              :datas="form"
              :isEdit="!isDetail"
              :isBuilding="true"
              @lngLat="lngLat($event)"
              @semId="semId($event)"
            ></drawer-map>
          </div>
          <div class="flex-row">
            <el-col>
              <el-form-item label="行政区域" prop="areaCode">
                <treeselect
                  :disabled="isDetail"
                  v-model="form.areaCode"
                  :options="areaOptions"
                  :show-count="false"
                  placeholder="请选择行政区域"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="详细地址" prop="detailAddress">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.detailAddress"
                  placeholder="请输入详细地址"
                />
              </el-form-item>
            </el-col>
          </div>
          <div class="flex-row">
            <el-col>
              <el-form-item label="供电设施">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.powerSupplyNumber"
                  placeholder="请输入数量"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="电梯数">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.liftNumber"
                  placeholder="请输入数量"
                />
              </el-form-item>
            </el-col>
          </div>
          <div class="flex-row">
            <el-col>
              <el-form-item label="安全通道">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.safePassageNumber"
                  placeholder="请输入数量"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="供水设施">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.waterSupplyNumber"
                  placeholder="请输入数量"
                />
              </el-form-item>
            </el-col>
          </div>
          <div class="flex-row">
            <el-col>
              <el-form-item label="消防设施">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.fireFacilitiesNumber"
                  placeholder="请输入数量"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="地下通道">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.undergroundPassageNumber"
                  placeholder="请输入数量"
                />
              </el-form-item>
            </el-col>
          </div>
          <div class="flex-row">
            <el-col>
              <el-form-item label="通风口">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.ventNumber"
                  placeholder="请输入数量"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="每层房屋数">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.houseNumber"
                  placeholder="请输入数量"
                />
              </el-form-item>
            </el-col>
          </div>
          <div class="flex-row">
            <el-col>
              <el-form-item label="外门窗数">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.doorWindowsNumber"
                  placeholder="请输入数量"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="pointType === 1">
              <el-form-item label="单元数">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.unitNumber"
                  placeholder="请输入数量"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="pointType !== 1">
              <el-form-item label="监控室">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.monitoringRoomNumber"
                  placeholder="请输入数量"
                />
              </el-form-item>
            </el-col>
          </div>
          <div class="flex-row">
            <el-col v-if="pointType !== 1">
              <el-form-item label="动力机房">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.powerRoomNumber"
                  placeholder="请输入数量"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="pointType === 2">
              <el-form-item label="关键楼层单位">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.importantCompanyNumber"
                  placeholder="请输入数量"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="pointType === 3 || pointType === 4">
              <el-form-item label="工业生产项目">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.productionProject"
                  placeholder="请输入数量"
                />
              </el-form-item>
            </el-col>
          </div>
          <div class="flex-row">
            <el-col v-if="pointType !== 1">
              <el-form-item label="出入口">
                <el-input
                  :disabled="isDetail"
                  v-model.number="form.doorwayNumber"
                  placeholder="请输入数量"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="pointType === 3 || pointType === 4">
              <el-form-item label="占地面积">
                <el-input
                style="width: 95%;margin-right: 1%;"
                  :disabled="isDetail"
                  v-model.number="form.square"
                  placeholder="请输入占地面积"
                />m²
              </el-form-item>
            </el-col>
          </div>
          <el-col>
            <el-form-item label="描述">
              <el-input
                :disabled="isDetail"
                v-model="form.description"
                type="textarea"
                placeholder="请输入描述内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="!isDetail" type="primary" @click="submitForm"
            >确 定</el-button
          >
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  listPoint,
  getPoint,
  delPoint,
  addPoint,
  updatePoint,
  pointTypeTree,
  areaTree,
  getTreeParentId,
} from "@/api/control/point";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Point",
  components: {
    Treeselect,
    DrawerMap: () => import("@/views/visual-panel/components/drawerMap"),
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      pointList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否为详情弹出层
      isDetail: false,
      // 日期范围
      dateRange: [],
      // 建筑分类树
      options: [],
      // 行政区域树
      areaOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
      },
      // 表单校验
      rules: {
        typeId: [
          { required: true, message: "建筑分类不能为空", trigger: "change" },
        ],
        name: [
          { required: true, message: "建筑名称不能为空", trigger: "blur" },
        ],
        height: [{ required: true, message: "高度不能为空", trigger: "blur" }],
        floorNumber: [
          { required: true, message: "楼层数不能为空", trigger: "blur" },
        ],
        longitude: [
          { required: true, message: "经度不能为空", trigger: "blur" },
        ],
        latitude: [
          { required: true, message: "纬度不能为空", trigger: "blur" },
        ],
        areaCode: [
          { required: true, message: "行政区域不能为空", trigger: "blur" },
        ],
        detailAddress: [
          { required: true, message: "详细地址不能为空", trigger: "blur" },
        ],
      },

      pointType: 1,
    };
  },
  created() {
    this.getList();
    this.getPointTypeTree();
    this.getAreaTree();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listPoint(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.pointList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询点位类型下拉树结构 */
    getPointTypeTree() {
      pointTypeTree().then((response) => {
        this.options = response.data;
      });
    },
    /** 查询行政区域下拉树结构 */
    getAreaTree() {
      areaTree({ areaCode: "330100" }).then((response) => {
        this.areaOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.typeId = data.id;
      this.handleQuery();
    },
    handleSelect(node) {
      console.log(node);
      if (node.children) {
        this.pointType = Number(node.id);
        this.form.typeId = node.id;
      } else {
        getTreeParentId(node.id).then((response) => {
          this.pointType = response.data.parentId;
        });
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.isDetail = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        buildingId: undefined,
        typeId: undefined,
        name: undefined,
        height: undefined,
        floorNumber: undefined,
        longitude: undefined,
        latitude: undefined,
        areaCode: undefined,
        detailAddress: undefined,
        importantCompanyNumber: undefined,
        liftNumber: undefined,
        safePassageNumber: undefined,
        monitoringRoomNumber: undefined,
        fireFacilitiesNumber: undefined,
        undergroundPassageNumber: undefined,
        powerRoomNumber: undefined,
        description: undefined,
        powerSupplyNumber: undefined,
        waterSupplyNumber: undefined,
        ventNumber: undefined,
        houseNumber: undefined,
        unitNumber: undefined,
        doorWindowsNumber: undefined,
        productionProject: undefined,
        doorwayNumber: undefined,
        square: undefined,
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
      this.queryParams.typeId = undefined;
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新建建筑点位";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getPoint({
        id: row.id,
      }).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "编辑建筑点位";
        getTreeParentId(this.form.typeId).then((response) => {
          if (response.data.parentId === 0) {
            this.pointType = this.form.typeId;
          } else {
            this.pointType = response.data.parentId;
          }
        });
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // if (Array.isArray(this.form.areaCode)) {
          //   this.form.areaCode = this.form.areaCode[2];
          // }
          if (this.form.id != undefined) {
            updatePoint(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPoint(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.reset();
      getPoint({
        id: row.id,
      }).then((response) => {
        this.form = response.data;
        this.isDetail = true;
        this.open = true;
        this.title = "建筑点位详情";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm("是否确认删除此数据项？")
        .then(function () {
          return delPoint(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    lngLat(p) {
      this.form.longitude = p.lon;
      this.form.latitude = p.lat;
    },
    semId(semId) {
      this.form.buildingId = semId;
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.flex-start {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
::v-deep .el-dialog:not(.is-fullscreen) {
  margin-top: 10px !important;
}
</style>