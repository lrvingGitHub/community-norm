<template>
  <div class="point">
    <!-- 搜索 -->
    <a-form :model="formState" name="search" class="search" autocomplete="off" layout="inline">
      <a-form-item label="点位名称" name="pointId">
        <a-select ref="select" placeholder="请选择点位名称" allowClear v-model:value="formState.pointId">
          <a-select-option :value="item.uniqueId" v-for="item in pointList" :key="item.uniqueId">{{
            item.name
          }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="所属网格员" name="inspectorId">
        <a-select ref="select" placeholder="请选择网格员类型" allowClear v-model:value="formState.inspectorId">
          <a-select-option :value="item.id" v-for="item in inspectorList" :key="item.id">{{
            item.name
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="所属关键字" name="keywords">
        <a-input v-model:value="formState.keywords" placeholder="请输入所属关键字" />
      </a-form-item>
      <a-form-item label="查询时间段" name="keywords">
        <a-range-picker :placeholder="['开始时间', '结束时间']" :format="dateFormat" v-model:value="currentTime" />
      </a-form-item>
      <a-form-item label="" name="keywords">
        <div>
          <a-button type="primary" :icon="h(SearchOutlined)" @click="search()">搜索</a-button>
          <!-- 新增 -->
          <a-button type="primary" :icon="h(PlusOutlined)" class="addBtn" @click="openModal()">新增</a-button>
        </div>
      </a-form-item>
    </a-form>

    <!-- 表格 -->
    <a-table :data-source="userList" :pagination="pagination" row-key="id" @change="handleTableChange">
      <a-table-column key="index" title="序号" data-index="index" align="center">
        <template #default="defauslt">
          <span> {{ defauslt.index + 1 }} </span>
        </template>
      </a-table-column>
      <a-table-column key="pointName" title="点位名称" data-index="pointName" align="center" />
      <a-table-column key="inspectorName" title="网格员" data-index="inspectorName" align="center" />

      <a-table-column key="time" title="巡查时间" data-index="time" align="center" />
      <a-table-column key="score" title="得分" data-index="score" align="center">
        <template #default="{ record }">
          <div :class="record.score >= 70 ? 'qualified' : 'noQualified'" class="score">{{ record.score }}</div>
        </template>
      </a-table-column>
      <a-table-column key="operation" title="操作" data-index="index" align="center" width="350px">
        <template #default="{ record }">
          <div class="operationLine">
            <a-tooltip title="该按钮用于查看本条数据" color="#1677ff">
              <a-button type="text" class="edit" @click="openModal(record)"><EyeOutlined /></a-button>
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
    EyeOutlined,
    ExclamationCircleOutlined,
  } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  import { message, Modal } from 'ant-design-vue';
  import dayjs, { Dayjs } from 'dayjs';

  const { proxy } = getCurrentInstance() as any;

  const router = useRouter();
  const formState = reactive<FormState>({
    keywords: '',
    inspectorId: undefined,
    pointId: undefined,
  });
  let currentTime = ref('');
  const dateFormat = 'YYYY-MM-DD';
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
      path: '/patrolDetail',
      query: {
        record: JSON.stringify(record),
        isAdd: record ? undefined : true,
      },
    });
  };
  let userList = ref([]);
  let inspectorList = ref([]);
  const getinspectorList = () => {
    proxy.$api.inspectorList({}).then((res: any) => {
      if (res.data?.data) {
        inspectorList.value = res.data?.data;
      } else {
        inspectorList.value = [];
      }
    });
  };
  getinspectorList();

  const getList = () => {
    proxy.$api
      .patrolselect({
        startTime: currentTime?.value ? dayjs(currentTime.value[0]).format(dateFormat) : undefined,
        endTime: currentTime?.value ? dayjs(currentTime.value[1]).format(dateFormat) : undefined,
        keywords: formState.keywords,
        pointId: formState.pointId,
        inspectorId: formState.inspectorId,
        pageIndex: pagination.value.current,
        pageSize: pagination.value.pageSize,
      })
      .then((res: any) => {
        if (res.code === 200) {
          userList.value = res.data.data.records.map((item) => {
            return {
              ...item,
              time: item.patrolTime
                ? `${item.patrolTime[0]}-${item.patrolTime[1]}-${item.patrolTime[2]} ${item.patrolTime[3]}:${item.patrolTime[4]}:${item.patrolTime[5]}`
                : '',
            };
          });
          pagination.value.total = res.data.data.total; // 更新总条数
        } else {
          userList.value = [];
        }
      });
  };
  let pointList = ref([]);
  const getpointList = () => {
    proxy.$api.pointList({}).then((res: any) => {
      if (res.data?.data) {
        pointList.value = res.data.data;
      } else {
        pointList.value = [];
      }
    });
  };
  getpointList();
  const pointdel = (row) => {
    Modal.confirm({
      title: '提示',
      icon: createVNode(ExclamationCircleOutlined),
      content: '你确定要删除该数据吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        proxy.$api.patroldel({ id: row.id }).then((res: any) => {
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
    margin-left: 15px;
  }
  .operationLine {
    .edit {
      color: #1677ff;
    }
  }
  .ant-form-item {
    margin-bottom: 20px;
  }
  .modalForm {
  }
  .score {
    font-size: 20px;
    font-weight: bold;
    font-family: fantasy;
    font-style: italic;
  }
  .qualified {
    color: #28a745;
  }
  .noQualified {
    color: #e74c3c;
  }
</style>
