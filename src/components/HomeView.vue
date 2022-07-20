<template>
    <div>
    这个是home目录
        <el-row @click="loginout" class="mb-4">
            <el-button type="info">退出</el-button>
        </el-row>
    </div>
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

</style>
