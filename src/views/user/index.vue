<template>
  <div class="app-container">
    <el-card shadow="never">
      <div>
        <el-form :inline="true" :model="dataForm" class="demo-form-inline">
          <el-form-item label="用户名称">
            <el-input
              @keydown.enter.native="search()"
              v-model="dataForm.realName"
              placeholder="请输入搜索内容"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="用户账号">
            <el-input
              @keydown.enter.native="search()"
              v-model="dataForm.userName"
              placeholder="请输入搜索内容"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="所属机构">
            <el-select
              @change="search()"
              v-model="dataForm.organization"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in organizationList"
                :key="item.id"
                :label="item.value"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="search()"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-plus"
              type="success"
              @click="handleClick('', 0)"
              >新增</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-refresh" type="warning" @click="onSubmit"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="序号" width="55">
            <template slot-scope="scope">
              {{ scope.$index }}
            </template>
          </el-table-column>
          <el-table-column label="用户姓名" show-overflow-tooltip="">
            <template slot-scope="scope">
              {{ scope.row.title }}
            </template>
          </el-table-column>
          <el-table-column label="用户账号" width="110" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.author }}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系方式" width="110" align="center">
            <template slot-scope="scope">
              {{ scope.row.pageviews }}
            </template>
          </el-table-column>
          <el-table-column label="邮箱" width="110" align="center">
            <template slot-scope="scope">
              {{ scope.row.pageviews }}
            </template>
          </el-table-column>
          <el-table-column label="身份证号" width="110" align="center">
            <template slot-scope="scope">
              {{ scope.row.pageviews }}
            </template>
          </el-table-column>
          <el-table-column label="所属角色" width="110" align="center">
            <template slot-scope="scope">
              {{ scope.row.pageviews }}
            </template>
          </el-table-column>
          <el-table-column label="所属机构" width="110" align="center">
            <template slot-scope="scope">
              {{ scope.row.pageviews }}
            </template>
          </el-table-column>
          <el-table-column
            class-name="status-col"
            label="状态"
            width="110"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusFilter">{{
                scope.row.status
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="created_at"
            label="时间"
            width="200"
          >
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span>{{ scope.row.display_time }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                @click="handleClick(scope.row.id, 1)"
                type="text"
                size="small"
                >修改</el-button
              >
              <el-button
                @click="handleDelete(scope.row.unitId)"
                type="text"
                style="color: red"
                icon="el-icon-delete"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="page-style">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[15, 30, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
    <!-- 新增编辑组件 -->
    <add-or-update
      @reFresh="reFresh()"
      :show.sync="isAsShow"
      ref="addOrUpdateItem"
    ></add-or-update>
  </div>
</template>

<script>
import { getList } from "@/api/table";
import until from "@/utils/util";
import AddOrUpdate from "./components/addOrUpdateItem";
export default {
  components: {
    AddOrUpdate,
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: null,
      dataForm: {
        realName: "", //.姓名
        userName: "", //账号
        phone: "", //联系方式
        organization: "", //所属机构
      },
      page: 1,
      pageSize: 15,
      total: 0,
      isAsShow: false,
      organizationList: [], //所属机构数组
      listLoading: true,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //格式化时间
    formatTime(time) {
      if (time != null && time != undefined && time != "") {
        //ie浏览器 时间显示NAN问题
        // let times = time.replace(/-/g, "/");
        return until.formatDate.format(new Date(time).getTime(), "yyyy-MM-dd");
      } else {
        return "";
      }
    },
    //页面查询
    search() {
      this.page = 1;
      this.getData();
    },
    //页面重置
    onSubmit() {
      this.page = 1;
      this.getData();
    },
    //获取列表数据
    getData() {
      this.listLoading = true;
      getList().then((response) => {
        this.list = response.data.items;
        this.listLoading = false;
      });
    },
    //新增编辑组件显示
    handleClick(id, type) {
      this.isAsShow = true;
      this.$refs.addOrUpdateItem.init(id, type);
    },
    //根据id删除列表数据
    handleDelete(id) {
      this.$confirm(`确定是否删除数据？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        distinguishCancelAndClose: true,
      })
        .then(() => {
          // 接口
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    //子组件传父组件
    reFresh() {
      this.page = 1;
      this.getData();
    },
  },
};
</script>
