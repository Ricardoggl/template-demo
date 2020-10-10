<template>
  <div class="app-container">
    <el-dialog
      :append-to-body="true"
      :title="title"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <el-form
        :rules="rules"
        :model="dataForm"
        ref="dataForm"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="dataForm.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="dataForm.realName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="密码" prop="password">
              <el-input v-model="dataForm.password" show-password></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="性别" prop="userSex">
          <el-radio-group v-model="dataForm.userSex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户状态" prop="userStatus">
          <el-radio-group v-model="dataForm.userStatus">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="身份证号" prop="userCard">
          <el-input v-model="dataForm.userCard"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="mobile">
              <el-input v-model="dataForm.mobile"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="userEmail">
              <el-input v-model="dataForm.userEmail"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="所属部门" prop="deptId">
          <!-- <el-tree
            :data="allDeptList"
            node-key="id"
            ref="depTree"
            :check-strictly="true"
            :default-checked-keys="dataForm.checkDeptId"
            :default-expanded-keys="dataForm.checkDeptId"
            :props="defaultProps"
            @check-change="getCheckedIds"
            @node-click="checkClick"
            show-checkbox
          ></el-tree> -->
          <!-- :default-expanded-keys="dataForm.checkDeptId"
            :default-checked-keys="dataForm.checkDeptId"-->
          <!-- @check-change="getCheckedIds" -->
          <!-- @node-click="checkClick" -->
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <!-- <el-checkbox-group v-model="dataForm.roleIds" @change="roleChange">
            <el-checkbox
              v-for="(item, index) in allRoleList"
              :label="item.roleId"
              :key="index"
              >{{ item.roleName }}</el-checkbox
            >
          </el-checkbox-group> -->
        </el-form-item>
        <el-form-item label="权限" prop="dataAuth">
          <!-- <el-radio-group v-model="dataForm.dataAuth">
            <el-radio
              v-for="(item, index) in dataAuthList"
              :label="item.code"
              :key="index"
              >{{ item.value }}</el-radio
            >
          </el-radio-group> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="formHandle()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
export default {
  data() {
    return {
      dialogVisible: false,
      title: "新增",
      eqptTypeList: [],
      customList: [],
      standFrom: {
        id: "",
        username: "", //用户名
        password: "", //密码
        realName: "", //真实姓名
        userCard: "", //身份证
        mobile: "", //手机
        deptId: "", //所属部门ID
        roleId: "", //角色ID
        userSex: 0, //性别
        userStatus: 0, //状态
        userEmail: "", //邮箱
        checkDeptId: [],
        roleIds: [], //角色
        dataAuth: [],
      },
      type: 0,
      title: "",
      dataForm: {},
      rules: {
        customId: [
          {
            required: true,
            message: "客户名称不能为空",
            trigger: "blur",
          },
        ],
        unitTypeId: [
          {
            required: true,
            message: "设备类型不能为空",
            trigger: "blur",
          },
        ],
        serialNumber: [
          { required: true, message: "序列号不能为空", trigger: "blur" },
        ],
        mac: [{ required: true, message: "mac地址不能为空", trigger: "blur" }],
      },
    };
  },
  props: {},
  created() {},
  methods: {
    init(id, type) {
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields();
      });
      this.type = type;
      console.log("init -> type", type);
      if (type == 0) {
        this.title = "新增";
        this.dataForm = Object.assign({}, this.standForm);
      } else {
        this.title = "修改";
        //根据id获取详情
        // this.getForm(id);
      }
      console.log(this.dataForm);
      this.dialogVisible = true;
    },

    //获取所有客户信息
    getCustom() {
      let params = {
        enterName: "",
      };
      getCustomSelectList(params).then((data) => {
        if (data.code === "0000") {
          this.customList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //关闭弹窗事件
    handleClose() {
      this.$refs.dataForm.resetFields();
      this.dialogVisible = false;
    },
    //表单提交
    formHandle() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$refs.dataForm.resetFields();
          this.dialogVisible = false;
        }
      });
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

