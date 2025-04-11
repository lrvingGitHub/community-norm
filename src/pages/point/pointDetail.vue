<template>
  <div>
    <div class="formBox">
      <div class="title">{{ pageTitle }}</div>
      <a-form
        ref="formRef"
        :model="formState"
        name="form"
        :label-col="labelCol"
        class="form"
        autocomplete="off"
        layout="inline"
      >
        <a-form-item label="点位名称" name="name" :rules="[{ required: true, message: '请输入点位名称!' }]">
          <a-input v-model:value="formState.name" placeholder="请输入点位名称" />
        </a-form-item>

        <!-- <a-form-item label="网格员类型" name="reseau" :rules="[{ required: true, message: '请选择网格员类型!' }]">
          <a-select ref="select" placeholder="请选择网格员类型" v-model:value="formState.reseau">
            <a-select-option :value="item.id" v-for="item in inspectorList" :key="item.id">{{
              item.name
            }}</a-select-option>
          </a-select>
        </a-form-item> -->
        <a-form-item
          label="所属网格员"
          name="gridInspectorId"
          :rules="[{ trigger: 'change', required: true, message: '请选择所属网格员!' }]"
        >
          <a-select ref="select" placeholder="请选择网格员类型" v-model:value="formState.gridInspectorId">
            <a-select-option :value="item.id" v-for="item in inspectorList" :key="item.id">{{
              item.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <!-- <a-form-item label="电话号码" name="phone" :rules="[{ required: true, message: '请输入电话号码!' }]">
          <a-input v-model:value="formState.phone" placeholder="请输入电话号码" />
        </a-form-item> -->
        <a-form-item label="点位状态" name="status" :rules="[{ required: true, message: '请选择点位状态!' }]">
          <a-radio-group v-model:value="formState.status">
            <a-radio :value="1">正常</a-radio>
            <a-radio :value="2">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="点位地址" name="address" :rules="[{ required: true, message: '请选择点位状态!' }]">
          <a-textarea :rows="4" v-model:value="formState.address" style="width: 515px" placeholder="请输入点位地址" />
        </a-form-item>
        <a-form-item label="点位标准图" name="reseauUser">
          <a-upload
            v-model:file-list="fileList"
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
          >
            <img v-if="formState.standImage" :src="fileUrl + formState.standImage" alt="avatar" style="width: 100%" />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
      <div class="btnFooter">
        <a-button @click="router.go(-1)">返回</a-button>
        <a-button type="primary" @click="submit">提交</a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, h, onMounted, getCurrentInstance } from 'vue';
  import { SearchOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { useRouter, useRoute } from 'vue-router';
  import { message, Modal } from 'ant-design-vue';
  import { useAccountStore } from '@/store';
  const { getFileUrl } = useAccountStore();
  console.log(5, getFileUrl());
  let fileUrl = getFileUrl();
  const { proxy } = getCurrentInstance() as any;
  const router = useRouter();
  const route = useRoute();

  const labelCol = { style: { width: '100px' } };
  const fileList = ref([]);
  const loading = ref<boolean>(false);
  const imageUrl = ref<string>('');
  let pageTitle = ref<string>('');
  let isAdd = ref('');
  const formState = ref<FormState>({
    name: '',
    address: '',
    gridInspectorId: '',
    standImage: '',
    status: 1,
  });
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
  let formRef = ref();
  /**
   * 提交表单函数
   *
   * 调用该函数时，将执行以下步骤：
   * 1. 验证表单的有效性。
   * 2. 如果表单有效，则调用代理对象的 pointadd 方法，将表单数据作为参数传递。
   * 3. 根据返回结果执行相应的操作：
   *   - 如果返回状态码为 200 且数据状态码为 0，则显示成功消息，并重置表单字段。
   *   - 如果返回状态码不为 200，则显示错误信息。
   * 4. 捕获并处理任何错误。
   */
  const submit = async () => {
    formRef.value
      .validate()
      .then(async () => {
        let res = isAdd.value
          ? await proxy.$api.pointadd(formState.value)
          : await proxy.$api.pointupdate(formState.value);
        console.log(5, res);

        if (res.code === 200) {
          if (res.data.code === 0) {
            message.success(isAdd.value ? '添加成功' : '编辑成功');
            router.go(-1); // 返回上一页
            // modalData.value.open = false;
            // getList(); //重新获取列表数据
          }
        } else {
          message.error('操作失败');
        }
        formRef.value.resetFields();
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  const beforeUpload = async (file: UploadProps['fileList'][number]) => {
    const formData = new FormData();
    formData.append('file', file); // "file" 是后端接收字段名
    let res = await proxy.$api.uploadStand(formData);
    formState.value.standImage = res.data?.data;
  };
  onMounted(() => {
    isAdd.value = route.query.isAdd;
    if (!route.query.isAdd) {
      formState.value = JSON.parse(route.query.record);
      console.log(878, formState.value);
      pageTitle.value = `编辑${formState.value.name}点位数据`;
    } else {
      pageTitle.value = `新增点位数据`;
    }
  });
</script>
<style scoped lang="less">
  .formBox {
    width: 800px;
    border-radius: 20px;
    margin: auto;
    margin-top: 50px;
    box-shadow: 0px 0px 10px #0ea5e91a;
    .title {
      width: max-content;
      padding: 5px 15px;
      border-radius: 20px 0;
      background: #ccc;
      font-size: 14px;
      color: #ffffff;
      background: var(--ant-primary-color);
    }
  }
  .form {
    padding: 20px;
    .ant-form-item {
      margin-bottom: 30px;
    }
    ::v-deep(.ant-select),
    ::v-deep(.ant-input) {
      width: 200px;
    }
  }
  .btnFooter {
    padding: 20px;
    text-align: center;
    button {
      margin: 0 10px;
    }
  }
</style>
