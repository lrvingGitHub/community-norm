<template>
  <div class="point">
    <!-- 搜索 -->
    <a-form :model="searchState" name="search" class="search" autocomplete="off" layout="inline">
      <a-form-item label="角色名称" name="roleName">
        <a-input v-model:value="searchState.roleName" placeholder="请输入角色名称" />
      </a-form-item>
      <a-button type="primary" :icon="h(SearchOutlined)" @click="search()">搜索</a-button>
    </a-form>
    <!-- 表格 -->
    <a-table :data-source="userList">
      <a-table-column key="index" title="序号" data-index="index" align="center">
        <template #default="defauslt">
          <span> {{ defauslt.index + 1 }} </span>
        </template>
      </a-table-column>
      <a-table-column key="roleName" title="角色名称" data-index="roleName" align="center" />
      <a-table-column key="operation" title="操作" data-index="index" align="center" width="350px">
        <template #default="{ record }">
          <div class="operationLine">
            <a-tooltip title="该按钮用于查看该角色的权限" color="#1677ff">
              <a-button type="text" class="edit" @click="openModal(record)"><ControlOutlined /></a-button>
            </a-tooltip>
          </div>
        </template>
      </a-table-column>
    </a-table>
    <!-- 抽屉查看权限 -->
    <a-drawer
      :visible="drawerBox.open"
      class="custom-class"
      root-class-name="root-class-name"
      :root-style="{ color: 'blue' }"
      style="color: red"
      title="查看权限"
      placement="right"
      @after-open-change="afterOpenChange"
    >
      <a-checkbox-group v-model:value="drawerBox.selectGroup" style="width: 100%">
        <div class="checkLine" v-for="item in powerList" :key="item">
          <a-checkbox :value="item.id">{{ item.powerNote }}</a-checkbox>
        </div>
      </a-checkbox-group>
      <template #footer>
        <div style="text-align: center">
          <a-button type="primary" @click="drawerBox.open = false">收起</a-button>
        </div>
      </template>
    </a-drawer>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, h, getCurrentInstance } from 'vue';
  import { SearchOutlined, DownOutlined, PlusOutlined, ControlOutlined } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  const { proxy } = getCurrentInstance() as any;

  const router = useRouter();
  const searchState = reactive<searchState>({
    lx: undefined,
    username: '',
  });
  let drawerBox = ref({
    open: false,
    selectGroup: [],
  });

  let dictionariesData = ref([]); //字典数据
  //弹窗相关
  let modalData = ref({
    open: false,
    title: '新增点位',
    formData: {},
  });
  //  打开弹窗
  const openModal = (record) => {
    let pw = record.powers.map((item) => item.id);
    drawerBox.value.selectGroup = pw;
    drawerBox.value.open = true;
  };
  let userList = ref([]);
  const getList = () => {
    // 调用 API 获取角色列表
    proxy.$api.listrole().then((res: any) => {
      // 判断响应码是否为200
      if (res.code === 200) {
        // 更新用户列表数据
        userList.value = res.data.data;
        dictionariesData.value = res.data.data;
      } else {
        // 响应码不为200时的处理
      }
    });
  };
  // 模糊搜索
  const searchRolesByName = (roles, keyword) => {
    return roles.filter((role) => role.roleName.includes(keyword));
  };
  // 搜索函数
  const search = () => {
    let list = searchRolesByName(dictionariesData.value, searchState.roleName);
    console.log('e', list);
    userList.value = list;

    // searchState.roleName;
  };
  let powerList = ref([]); //权限列表
  // 获取权限列表
  const getlistpower = () => {
    proxy.$api.listpower({}).then((res: any) => {
      if (res.code === 200) {
        powerList.value = res.data.data;
        console.log('powerList', powerList.value);
      } else {
      }
    });
  };

  getlistpower();
  getList();
</script>
<style scoped lang="less">
  .search {
    margin-bottom: 20px;
    ::v-deep(.ant-select),
    ::v-deep(.ant-input) {
      width: 200px;
    }
  }
  .addBtn {
    margin: 15px 0;
  }
  .operationLine {
    .edit {
      color: #1677ff;
    }
  }
  .modalForm {
    .ant-form-item {
      margin-bottom: 20px;
    }
  }
  ::v-deep(.ant-checkbox-group) {
    display: flex;
    flex-direction: column;
  }

  .checkLine {
    margin-bottom: 10px;
    ::v-deep(.ant-checkbox + span) {
      width: max-content;
    }
  }
</style>
