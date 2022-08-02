<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="4">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border  stripe style="width: 100%">
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '','vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable>{{item1.authName}}</el-tag>
              </el-col>
              <!-- 渲染二级根三级权限 -->
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '' : 'bdtop','vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable>{{item2.authName}}</el-tag>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" closable @close="removeRightById(scope.row, item3.id)" v-for="(item3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleDesc" label="角色描述" />
        <el-table-column label="操作">
          <template v-slot="scope">
             <el-button size="mini" type="primary" prefix-icon="el-icon-password" @click="test(scope.row.id)">编辑</el-button>
              <el-button size="mini" type="danger" :icon="Delete">删除</el-button>
               <el-button size="mini" type="warning" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
    v-model="setRightDialogVisible"
    title="分配权限"
    width="50%"
    @close="setRightDialogClosed"
  >
    <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all="true"
    :default-checked-keys="defKeys"
    ref="treeRef"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="allotRights"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      // 控制分配权限对话框
      setRightDialogVisible: false,
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await require('axios').get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色失败')
      this.rolesList = res.data
      console.log(res)
    },
    async removeRightById (roles, rightId) {
      // 弹框提示用户是否要删除
      const confirmRusult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '永久删除该权限',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmRusult !== 'confirm') return this.$message.info('删除已取消')
      const { data: res } = await require('axios').delete(`roles/${roles.id}/rights/${rightId}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      // this.$message.success('删除权限成功')
      roles.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      const { data: res } = await require('axios').get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取用户权限失败')
      this.rightsList = res.data
      console.log(res.data)
      // 递归获取三级节点的 id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys (node, arr) {
      if (!node.children) {
        // 如果当前 node 节点不包含 children 属性则是三级节点
        return arr.push
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed () {
      this.defKeys = []
    },
    async allotRights () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await require('axios').post(`roles/${this.roleID}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return 
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px
}
.bdtop {
  border-top: 1px solid #eee;

}
.bdbottom {
  border-bottom: 1px solid #eee;

}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
