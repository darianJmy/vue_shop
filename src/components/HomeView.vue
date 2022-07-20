<template>
    <el-container>
        <el-header>
            <div>
                <img src="../assets/logo.png" str="">
                <span>电商后台管理系统</span>
            </div>
            <el-button @click="loginout" type="info">退出</el-button>
        </el-header>
        <el-container>
            <el-aside width="200px">
                Aside
                <el-menu>
                <el-sub-menu index="1">
                    <el-icon><location /></el-icon>
                    <span>Navigator One</span>
                    <el-menu-item index="1-1">item one</el-menu-item>
                </el-sub-menu>
            </el-menu>
            </el-aside>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  methods: {
    // 重置按钮的重置函数
    loginout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
    top: 100%;
    height: 100%;
}
.el-header {
    background-color: #373d41;
    img {
        height: 60px;
    }
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
}
.el-aside {
    background-color: #333744;
}
.el-main {
    background-color: #eaedf1;
}
</style>
