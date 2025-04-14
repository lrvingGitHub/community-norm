<template>
  <div class="point">
    <!-- 搜索 -->
    <a-form :model="formState" name="search" class="search" autocomplete="off" layout="inline">
      <a-form-item label="所属关键字" name="keywords">
        <a-input v-model:value="formState.keywords" placeholder="请输入所属关键字" />
      </a-form-item>
      <a-button type="primary" :icon="h(SearchOutlined)" @click="search()">搜索</a-button>
    </a-form>
    <!-- 新增 -->
    <a-button type="primary" :icon="h(PlusOutlined)" class="addBtn" @click="openModal()">新增</a-button>
    <a-button :icon="h(PlusOutlined)" class="exportBtn" @click="exportPoint()">导出</a-button>

    <!-- 表格 -->
    <a-table :data-source="userList" :pagination="pagination" row-key="id" @change="handleTableChange">
      <a-table-column key="index" title="序号" data-index="index" align="center">
        <template #default="defauslt">
          <span> {{ defauslt.index + 1 }} </span>
        </template>
      </a-table-column>
      <a-table-column key="name" title="点位名称" data-index="name" align="center" />
      <a-table-column key="address" title="点位地址" data-index="address" align="center" />
      <a-table-column key="operation" title="操作" data-index="index" align="center" width="350px">
        <template #default="{ record }">
          <div class="operationLine">
            <a-tooltip title="该按钮用于编辑本条数据" color="#1677ff">
              <a-button type="text" class="edit" @click="openModal(record)"><EditOutlined /></a-button>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-tooltip title="该按钮用于删除本条数据" color="#ef4343">
              <a-button type="text" style="color: #ef4343" @click="pointdel(record)"> <DeleteOutlined /></a-button>
            </a-tooltip>
          </div>
        </template>
      </a-table-column>
    </a-table>
    <!-- 弹窗 -->
    <a-modal
      :visible="modalData.open"
      :title="modalData.title"
      @cancel="modalData.open = false"
      @ok="handleOk"
      :width="700"
      class="modalForm"
      cancelText="取消"
      okText="确定"
    >
      <a-form
        ref="modalRef"
        :model="modalData.formData"
        name="search"
        :label-col="labelCol"
        class="search"
        autocomplete="off"
        layout="inline"
      >
        <a-form-item label="用户名称" name="name" :rules="[{ required: true, message: '请输入用户名称!' }]">
          <a-input v-model:value="modalData.formData.name" placeholder="请输入用户名称" />
        </a-form-item>
        <a-form-item label="登录账号" name="account" :rules="[{ required: true, message: '请输入登录账号!' }]">
          <a-input v-model:value="modalData.formData.account" placeholder="请输入登录账号" />
        </a-form-item>
        <a-form-item
          label="登录密码"
          v-if="modalData.openType == 'add'"
          name="password"
          :rules="[{ required: true, message: '请输入登录密码!' }]"
        >
          <a-input v-model:value="modalData.formData.password" placeholder="请输入登录密码" />
        </a-form-item>
        <a-form-item
          label="用户角色"
          name="roleId"
          v-if="modalData.openType == 'add'"
          :rules="[{ trigger: 'change', required: true, message: '请选择用户角色!' }]"
        >
          <a-select ref="select" placeholder="请选择用户角色" v-model:value="modalData.formData.roleId">
            <a-select-option :value="item.id" v-for="item in roleList" :key="item.id">
              {{ item.roleName }}</a-select-option
            >
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, h, getCurrentInstance, createVNode } from 'vue';
  import {
    SearchOutlined,
    DownOutlined,
    PlusOutlined,
    RedoOutlined,
    ExclamationCircleOutlined,
  } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  import { message, Modal } from 'ant-design-vue';
  // exportHeader: 'http://192.168.120.214:4610/file'
  import { useAccountStore } from '@/store';
  const { getexportHeader } = useAccountStore();
  let exportHeader = getexportHeader();
  const { proxy } = getCurrentInstance() as any;

  const router = useRouter();
  const formState = reactive<FormState>({
    keywords: '',
  });
  let modalRef = ref();
  const labelCol = { style: { width: '100px' } };
  let pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => `共 ${total} 条`,
    showQuickJumper: false,
    showSizeChanger: false,
    pageSizeOptions: ['10', '20', '50', '100'],
  });
  const wrapperCol = { span: 14 };
  // 表格分页/排序/筛选等变化处理
  const handleTableChange = (row) => {
    console.log(878, row);

    pagination.value.current = row.current;
    pagination.value.pageSize = row.pageSize;
    getList(); // 重新获取数据
  };
  const data = [];
  //弹窗相关
  let modalData = ref({
    open: false,
    openType: 'add',
    title: '新增点位',
    formData: {},
  });
  const handleOk = () => {
    modalRef.value
      .validate()
      .then(() => {
        proxy.$api.createUser(modalData.value.formData).then((res: any) => {
          if (res.code === 200) {
            if (res.data.code === 0) {
              message.success('添加成功');
              modalData.value.open = false;
              getList(); //重新获取列表数据
            }
          } else {
            message.error(res.msg);
          }
        });
        modalRef.value.resetFields();
      })
      .catch((error) => {
        console.log('error', error);
      });
    // modalData.value.open = false;
  };
  //  打开弹窗
  const openModal = (record) => {
    router.push({
      path: '/pointDetail',
      query: {
        record: JSON.stringify(record),
        isAdd: record ? undefined : true,
      },
    });
  };
  let userList = ref([]);
  const getList = () => {
    proxy.$api
      .pointselect({
        keywords: formState.keywords,
        pageIndex: pagination.value.current,
        pageSize: pagination.value.pageSize,
      })
      .then((res: any) => {
        if (res.code === 200) {
          userList.value = res.data.data.records;
          pagination.value.total = res.data.data.total; // 更新总条数
        } else {
          userList.value = [];
        }
      });
  };
  // 导出
  const exportPoint = () => {
    window.open(`${exportHeader}/file/exportPoint`);
  };
  const pointdel = (row) => {
    Modal.confirm({
      title: '提示',
      icon: createVNode(ExclamationCircleOutlined),
      content: '你确定要删除该数据吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        proxy.$api.pointdel({ uniqueId: row.uniqueId }).then((res: any) => {
          if (res.code === 200) {
            message.success('删除成功');
            getList(); //重新获取列表数据
          } else {
            message.success('删除失败');
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const getFile = () => {
    proxy.$api.getFile({ path: '/stand/12312312/jpg' }).then((res: any) => {
      // if (res.code === 200) {
      //   userList.value = res.data.data.records;
      //   pagination.value.total = res.data.data.total; // 更新总条数
      // } else {
      //   userList.value = [];
      // }
    });
  };
  getFile();
  const search = () => {
    pagination.value.current = 1; // 重置当前页码为1
    getList(); //重新获取列表数据
  };

  getList();
</script>
<style scoped lang="less">
  .search {
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
  .exportBtn {
    background: #67c23a;
    color: #fff;
    margin-left: 10px;
    border-color: #67c23a;
  }
</style>
