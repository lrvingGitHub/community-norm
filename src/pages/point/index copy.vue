<template>
  <div class="point">
    <!-- 搜索 -->
    <a-form :model="formState" name="search" class="search" autocomplete="off" layout="inline">
      <a-form-item label="所属关键字" name="username">
        <a-input v-model:value="formState.username" placeholder="请输入所属关键字" />
      </a-form-item>
      <a-form-item label="网格员类型" name="username">
        <a-select ref="select" placeholder="请选择网格员类型" v-model:value="formState.lx">
          <a-select-option value="jack">Jack</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
          <a-select-option value="disabled" disabled>Disabled</a-select-option>
          <a-select-option value="Yiminghe">yiminghe</a-select-option>
        </a-select>
      </a-form-item>
      <a-button type="primary" :icon="h(SearchOutlined)">搜索</a-button>
    </a-form>
    <!-- 新增 -->
    <a-button type="primary" :icon="h(PlusOutlined)" class="addBtn" @click="openModal()">新增</a-button>
    <!-- 表格 -->
    <a-table :data-source="data">
      <a-table-column key="index" title="序号" data-index="index" align="center">
        <template #default="defauslt">
          <span> {{ defauslt.index + 1 }} </span>
        </template>
      </a-table-column>
      <a-table-column key="pointName" title="点位名称" data-index="pointName" align="center" />
      <a-table-column key="reseau" title="所属网格" data-index="reseau" align="center" />
      <a-table-column key="reseauUser" title="网格员" data-index="reseauUser" align="center" />
      <a-table-column key="address" title="具体地址" data-index="address" align="center" />
      <a-table-column key="state" title="状态" data-index="state" align="center">
        <template #default="{ record }">
          <a-tag color="#55acee">
            {{ record.state }}
          </a-tag>
        </template>
      </a-table-column>

      <a-table-column key="operation" title="操作" data-index="index" align="center" width="350px">
        <template #default="{ record }">
          <div class="operationLine">
            <a-tooltip title="该按钮用于编辑本条数据" color="#1677ff">
              <a-button type="text" class="edit" @click="openModal(record)"><EditOutlined /></a-button>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-tooltip title="该按钮用于删除本条数据" color="#ef4343">
              <a-button type="text" class="delete" danger> <DeleteOutlined /></a-button>
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
      <a-form :model="formState" name="search" :label-col="labelCol" class="search" autocomplete="off" layout="inline">
        <a-form-item label="点位名称" name="pointName" :rules="[{ required: true, message: '请输入点位名称!' }]">
          <a-input v-model:value="modalData.formData.pointName" placeholder="请输入点位名称" />
        </a-form-item>
        <a-form-item label="网格员类型" name="reseau" :rules="[{ required: true, message: '请选择网格员类型!' }]">
          <a-select ref="select" placeholder="请选择网格员类型" v-model:value="modalData.formData.reseau">
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="disabled" disabled>Disabled</a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="所属网格员" name="reseauUser" :rules="[{ required: true, message: '请输入所属网格员!' }]">
          <a-input v-model:value="modalData.formData.reseauUser" placeholder="请输入所属网格员" />
        </a-form-item>
        <a-form-item label="点位状态" name="state" :rules="[{ required: true, message: '请选择点位状态!' }]">
          <a-radio-group v-model:value="modalData.formData.state">
            <a-radio :value="1">正常</a-radio>
            <a-radio :value="2">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="点位地址" name="address" :rules="[{ required: true, message: '请选择点位状态!' }]">
          <a-textarea :rows="4" v-model:value="modalData.formData.address" style="width: 515px" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, h } from 'vue';
  import { SearchOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const formState = reactive<FormState>({
    lx: undefined,
    username: '',
  });
  const labelCol = { style: { width: '100px' } };
  const wrapperCol = { span: 14 };
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
    open: true,
    title: '新增点位',
    formData: {},
  });
  const handleOk = () => {
    modalData.value.open = false;
  };
  //  打开弹窗
  const openModal = (record) => {
    console.log(878, record);

    if (record.pointName) {
      modalData.value.title = '编辑点位';
      modalData.value.formData = record;
    } else {
      modalData.value.title = '新增点位';
    }
    modalData.value.open = true;
  };
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
