<template>
  <div class="top-nav">
    <div class="log">system管理系统</div>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img src="../../assets/img/user.png" class="user-avatar" /> -->
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>Home</el-dropdown-item>
          </router-link>
          <!-- <a href="https://github.com/PanJiaChen/vue-admin-template/" target="_blank">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a href="https://panjiachen.github.io/vue-element-admin-site/#/" target="_blank">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AppLink from "./Sidebar/Link";
import { constantRoutes } from "@/router";
import variables from "@/styles/variables.scss";
import { isExternal } from "@/utils/validate";

export default {
  name: "Topbar",
  components: {
    AppLink,
  },
  data() {
    return {};
  },
  computed: {
    variables() {
      return variables;
    },
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    ...mapGetters(["avatar"]),
  },
  mounted() {},
  methods: {
    // 设置侧边栏的显示和隐藏
    setSidebarHide(route) {
      if (!route.children || route.children.length === 1) {
        this.$store.dispatch("app/toggleSideBarHide", true);
      } else {
        this.$store.dispatch("app/toggleSideBarHide", false);
      }
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>
