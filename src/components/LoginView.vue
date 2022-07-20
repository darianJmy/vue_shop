<template>
    <!-- 登录页面 -->
    <div class="login_container">
        <!-- 登录盒子 -->
        <div class="login_box">
            <!-- 登录图片 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单-->
            <el-form class="login_form" label-width="0px" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-usercenter"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-password" type="password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-row class="login_btns">
                    <!-- 登录按钮 -->
                    <el-button type="primary" round @click="login">登录</el-button>
                    <!-- 重置按钮 -->
                    <el-button round @click="resetLoginForm">重置</el-button>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 用户名密码
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 用户名密码规则
      loginFormRules: {
        username: [
          { required: true, message: 'Please input Activity name', trigger: 'blur' },
          { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please input Activity name', trigger: 'blur' },
          { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
        ]
      }
    }
  },
  // 方法
  methods: {
    // 重置按钮的重置函数
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录按钮的记录token登录跳转函数
    login () {
      // 通过 axios 发送 post 请求
      this.$refs.loginFormRef.validate(async valid => {
        // 登录按钮预验证
        if (valid) {
          const { data: res } = await require('axios').post('/login', this.loginForm)
          // 判断 post 请求返回值
          if (res.meta.status !== 200) {
            this.$message.error('登录失败')
          } else {
            this.$message.success('登录成功')
            window.sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    // 定位
    position: absolute;
    left: 50%;
    top: 50%;
    // 内移
    transform: translate(-50%, -50%);

    .avatar_box {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        position: absolute;
        left: 50%;
        box-shadow: 0 0 10px #ddd;
        transform: translate(-50%, -50%);
        background: #ffff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #eee;
        }
    }
    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 10px;
        left: 50%;
        top: 55%;
        transform: translate(-50%, -50%);
        box-sizing: border-box;
        .login_btns {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
