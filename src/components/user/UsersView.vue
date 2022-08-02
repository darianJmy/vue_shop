<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索和添加用户区域 -->
      <el-row :gutter="20">
        <!-- 搜索区域 -->
        <el-col :span="6">
          <el-input
            placeholder="Please input"
            v-model="queryInfo.query"
            v-on:keyup.enter="getUserList"
            clearable
            @clear="getUserList"
          >
            <template #append>
              <el-button icon="el-icon-usercenter" @click="getUserList" />
            </template>
          </el-input>
        </el-col>
        <!-- 添加用户区域 -->
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border style="width: 100%">
        <el-table-column type="index" width="50" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="电话" />
        <el-table-column prop="role_name" label="角色" />
        <el-table-column label="状态" width="180">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            />
          </template>
        </el-table-column>
        <!-- 用户操作区域 -->
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            />
            <el-tooltip content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页操作区域 -->
      <el-pagination
        :currentPage="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[5, 9, 13, 15]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 添加用户弹窗区域 -->
    <el-dialog
      title="添加用户"
      width="50%"
      v-model="dialogVisible"
      @close="addDislogClosed"
    >
      <!-- 添加用户表单区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" />
        </el-form-item>
        <el-form-item label="手机" prop="moblie">
          <el-input v-model="addForm.moblie" />
        </el-form-item>
      </el-form>
      <!-- 添加用户按钮区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button @click="addUser" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改用户弹窗区域 -->
    <el-dialog
      title="修改用户"
      width="50%"
      v-model="editDialogVisible"
      @close="editDislogClosed"
    >
      <!-- 修改用户表单区域 -->
      <el-form :model="editForm" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="editForm.mobile" />
        </el-form-item>
      </el-form>
      <!-- 修改用户按钮区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button @click="editUserInfo" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="永久删除改用户" width="50%" @close="deleteDislogClosed">
      <!-- 修改用户表单区域 -->
      <el-form :model="editForm" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="editForm.mobile" />
        </el-form-item>
      </el-form>
      <!-- 修改用户按钮区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button @click="editUserInfo" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 分页查询用户列表的 Body
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 用户列表
      userlist: [],
      total: 0,
      // 是否关闭弹窗
      dialogVisible: false,
      // 添加用户的 Body
      addForm: {
        username: '',
        password: '',
        email: '',
        moblie: ''
      },
      editForm: {},
      // 判断表单是否符合
      addFormRules: {
        username: [
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: 'Length should be 3 to 10',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: 'Length should be 3 to 10',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: 'Length should be 3 to 10',
            trigger: 'blur'
          }
        ],
        moblie: [
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: 'Length should be 3 to 10',
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false
    }
  },
  // 进入页面首个执行的函数
  created () {
    this.getUserList()
  },
  // 函数
  methods: {
    // 获取用户列表
    async getUserList () {
      const { data: res } = await require('axios').get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) { return this.$message.error('获取用户列表失败') }
      console.log(res)
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 通过分页获取用户列表
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    // 通过分页获取用户列表
    handleCurrentChange (newCurrent) {
      this.queryInfo.pagenum = newCurrent
      this.getUserList()
    },
    // 改变用户状态
    async userStateChanged (newRow) {
      const { data: res } = await require('axios').put(
        `users/${newRow.id}/state/${newRow.mg_state}`
      )
      if (res.meta.status !== 200) {
        newRow.mg_state = !newRow.mg_state
        return this.$message.error('用户更新状态失败')
      }
    },
    // 创建用户
    addUser () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await require('axios').post(
            'users',
            this.addForm
          )
          if (res.meta.status !== 201) { return this.$message.error('添加用户失败') }
          this.dialogVisible = false
          this.getUserList()
          return this.$message.success('添加用户成功')
        }
      })
    },
    addDislogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    async showEditDialog (id) {
      const { data: res } = await require('axios').get('users' + '/' + id)
      if (res.meta.status !== 200) { return this.$message.error('查询用户信息失败') }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    async editUserInfo () {
      const { data: res } = await require('axios').put(
        'users' + '/' + this.editForm.id,
        this.editForm
      )
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('修改用户失败')
      this.$message.success('修改用户信息成功')
      this.editDialogVisible = false
      this.getUserList()
    },
    editDislogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    async removeUserById (id) {
      const confirmRusult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '永久删除该用户',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmRusult !== 'confirm') return this.$message.info('删除已取消')
      const { data: res } = await require('axios').delete('users' + '/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  .el-table {
    margin-top: 15px;
    font-size: 10px;
  }
  .el-pagination {
    margin-top: 15px;
    font-size: 10px;
  }
}
.el-dialog {
  .dialog-footer {
    margin-right: 10px;
  }
}
</style>
