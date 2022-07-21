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
      <el-row :gutter="20">
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
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
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
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" size="mini" />
          <el-button type="danger" icon="el-icon-delete" size="mini" />
          <el-tooltip content="分配角色" placement="top">
            <el-button type="warning" icon="el-icon-setting" size="mini" />
          </el-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination
        :model:currentPage="queryInfo.pagenum"
        :model:page-size="queryInfo.pagesize"
        :page-sizes="[1, 2, 5, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <el-dialog title="添加用户" width="50%" v-model="dialogVisible">
    <el-form
    :model="addForm"
    :rules="addFormRules"
    ref="addFormRef"
    label-width="80px">
    <el-form-item label="姓">
      <el-input v-model="addForm.name" />
    </el-form-item>
    <el-form-item label="名" prop="username">
      <el-input v-model="addForm.name" />
    </el-form-item>
    <el-form-item label="用户名" prop="username">
      <el-input v-model="addForm.name" />
    </el-form-item>
    <el-form-item label="密码" prop="username">
      <el-input v-model="addForm.name" />
    </el-form-item>
    <el-form-item label="邮箱" prop="username">
      <el-input v-model="addForm.name" />
    </el-form-item>
    <el-form-item label="手机" prop="username">
      <el-input v-model="addForm.name" />
    </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
      <el-button @click="dialogVisible = false" >取消</el-button>
      <el-button @click="dialogVisible = false" type="primary">确定</el-button>
      </span>
    </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      dialogVisible: false,
      addForm: [],
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
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await require('axios').get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) { return this.$message.error('获取用户列表失败') }
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    handleCurrentChange (newCurrent) {
      this.queryInfo.pagenum = newCurrent
      this.getUserList()
    },
    async userStateChanged (newRow) {
      const { data: res } = await require('axios').put(
        `users/${newRow.id}/state/${newRow.mg_state}`
      )
      if (res.meta.status !== 200) {
        newRow.mg_state = !newRow.mg_state
        return this.$message.error('用户更新状态失败')
      }
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
