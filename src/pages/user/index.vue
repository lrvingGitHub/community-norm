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
    <!-- 表格 -->
    <a-table :data-source="userList" :pagination="pagination" row-key="id" @change="handleTableChange">
      <a-table-column key="index" title="序号" data-index="index" align="center">
        <template #default="defauslt">
          <span> {{ defauslt.index + 1 }} </span>
        </template>
      </a-table-column>
      <a-table-column key="name" title="角色" data-index="name" align="center" />
      <a-table-column key="account" title="账号" data-index="account" align="center" />
      <a-table-column key="operation" title="操作" data-index="index" align="center" width="350px">
        <template #default="{ record }">
          <div class="operationLine">
            <a-tooltip title="该按钮用于编辑本条数据" color="#1677ff">
              <a-button type="text" class="edit" @click="openModal(record)"><EditOutlined /></a-button>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-tooltip title="该按钮用于重置密码" color="#eebe77">
              <a-button type="text" style="color: #eebe77" danger @click="resetPassword(record)">
                <RedoOutlined />
              </a-button>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-tooltip title="该按钮用于删除本条数据" color="#ef4343">
              <a-button type="text" style="color: #ef4343" @click="delUserl(record)"> <DeleteOutlined /></a-button>
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
  const data = [
    {
      pointName: '金牛花园一期',
      reseau: '网格A1',
      reseauUser: '张伟',
      address: '成都市金牛区金泉街道金牛花园路18号',
      state: '正常',
    },
    {
      pointName: '鑫福家苑',
      reseau: '网格B2',
      reseauUser: '李娜',
      address: '成都市金牛区抚琴街道福运路55号',
      state: '正常',
    },
    {
      pointName: '绿地世纪城',
      reseau: '网格C3',
      reseauUser: '王强',
      address: '成都市金牛区茶店子街道世纪大道99号',
      state: '正常',
    },
    {
      pointName: '北城家园',
      reseau: '网格A2',
      reseauUser: '赵敏',
      address: '成都市金牛区营门口街道北城一路100号',
      state: '维修中',
    },
    {
      pointName: '嘉祥锦城',
      reseau: '网格B1',
      reseauUser: '陈静',
      address: '成都市金牛区西安路68号',
      state: '正常',
    },
    {
      pointName: '金牛万达广场',
      reseau: '网格C1',
      reseauUser: '刘洋',
      address: '成都市金牛区一环路北三段1号',
      state: '正常',
    },
    {
      pointName: '汇融名城',
      reseau: '网格A3',
      reseauUser: '孙涛',
      address: '成都市金牛区沙湾路199号',
      state: '正常',
    },
    {
      pointName: '天府尚居',
      reseau: '网格B3',
      reseauUser: '郑媛',
      address: '成都市金牛区天回镇街道兴盛路10号',
      state: '异常',
    },
    {
      pointName: '金泉新苑',
      reseau: '网格C2',
      reseauUser: '黄磊',
      address: '成都市金牛区金泉街道金泉西路88号',
      state: '正常',
    },
    {
      pointName: '荣光小区',
      reseau: '网格A4',
      reseauUser: '蒋丽',
      address: '成都市金牛区营门口街道荣光巷12号',
      state: '正常',
    },
  ];
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
    modalData.value.open = true;
    modalData.value.formData = {};

    if (record?.id) {
      modalData.value.openType = 'edit';
      modalData.value.title = '编辑用户';
      modalData.value.formData = record;
    } else {
      modalData.value.openType = 'add';
      modalData.value.title = '新增用户';
    }
  };
  let userList = ref([]);
  const getList = () => {
    proxy.$api
      .listUser({
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
  let powerList = ref([]);
  const listpower = () => {
    proxy.$api.listpower({}).then((res: any) => {
      if (res.code === 200) {
        powerList.value = res.data.data.records;
        console.log('powerList', powerList.value);
      } else {
      }
    });
  };
  const search = () => {
    pagination.value.current = 1; // 重置当前页码为1
    getList(); //重新获取列表数据
  };
  const resetPassword = (row) => {
    Modal.confirm({
      title: '提示',
      icon: createVNode(ExclamationCircleOutlined),
      content: '你确定要重置该用户的密码？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        proxy.$api.resetPassword({ id: row.id }).then((res: any) => {
          if (res.data?.code === 0) {
            message.success('重置成功');
            getList(); //重新获取列表数据
          } else {
            message.success('重置失败');
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const delUserl = (row) => {
    Modal.confirm({
      title: '提示',
      icon: createVNode(ExclamationCircleOutlined),
      content: '你确定要删除该用户？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        proxy.$api.delUser({ id: row.id }).then((res: any) => {
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

  let roleList = ref([]); //角色列表
  // 获取角色列表
  const getRoleList = () => {
    // 调用 API 获取角色列表
    proxy.$api.listrole().then((res: any) => {
      // 判断响应码是否为200
      if (res.code === 200) {
        // 更新用户列表数据
        roleList.value = res.data.data;
      } else {
        // 响应码不为200时的处理
      }
    });
  };
  getRoleList();
  listpower();
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
</style>
