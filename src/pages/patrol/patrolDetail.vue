<template>
  <div>
    <div class="formBox">
      <div class="title">{{ pageTitle }}</div>
      <a-form
        :model="formState"
        ref="formRef"
        name="form"
        :label-col="labelCol"
        class="form"
        autocomplete="off"
        :layout="isAdd ? 'inline' : 'inline'"
      >
        <!-- <a-input v-if="isAdd" v-model:value="formState.pointName" placeholder="请输入点位名称" /> -->
        <a-form-item
          label="点位名称"
          name="pointId"
          :rules="[{ trigger: 'change', required: true, message: '请选择点位名称!' }]"
        >
          <a-select v-if="isAdd" ref="select" placeholder="请选择点位名称" v-model:value="formState.pointId">
            <a-select-option :value="item.uniqueId" v-for="item in pointList" :key="item.uniqueId">{{
              item.name
            }}</a-select-option>
          </a-select>
          <div class="formLine" v-else>{{ formState.pointName }}</div>
        </a-form-item>

        <a-form-item
          label="所属网格员"
          name="inspectorName"
          v-if="!isAdd"
          :rules="[{ required: true, message: '请输入所属网格员!' }]"
        >
          <!-- <a-input v-if="!isAdd" v-model:value="formState.inspectorName" placeholder="请输入所属网格员" /> -->
          <div class="formLine">{{ formState.inspectorName }}</div>
        </a-form-item>
        <a-form-item
          v-if="!isAdd"
          label="巡查时间"
          name="time"
          :rules="[{ required: true, message: '请输入巡查时间!' }]"
        >
          <!-- <a-input v-model:value="formState.time" placeholder="请输入巡查时间" /> -->
          <div class="formLine">{{ formState.time }}</div>
        </a-form-item>
        <a-form-item
          v-if="!isAdd"
          label="巡查分数"
          name="score"
          :rules="[{ required: true, message: '请输入巡查分数!' }]"
        >
          <!-- <a-input v-model:value="formState.score" placeholder="请输入巡查分数" /> -->
          <div class="formLine">
            {{ formState.score || '暂无分数' }}
            <div class="editIcon" @click="editScore"><EditOutlined /></div>
          </div>
        </a-form-item>
        <a-form-item label="点位标准图" name="reseauUser" v-if="!isAdd">
          <div style="width: 200px">
            <a-image :src="fileUrl + formState.standPath" v-if="formState.standPath" alt="" class="imageDetail" />
            <div v-else>暂无点位标准图</div>
          </div>
        </a-form-item>
        <a-form-item
          label="本次巡查现场图"
          name="image"
          :rules="[{ trigger: 'change', required: true, message: '请上传本次巡查现场图!' }]"
        >
          <div class="formLine" v-if="isAdd">
            <a-upload
              v-model:file-list="fileList"
              name="avatar"
              list-type="picture-card"
              :show-upload-list="false"
              :before-upload="beforeUpload"
            >
              <a-image
                v-if="formState.image"
                :src="fileUrl + formState.image"
                alt="avatar"
                class="imageDetail"
                style="margin-left: 0px"
              />

              <div v-else>
                <!-- <loading-outlined v-if="loading"></loading-outlined>
                <plus-outlined v-else></plus-outlined>
                <div class="ant-upload-text">上传图片</div> -->
                <a-button type="primary">上传图片</a-button>
              </div>
            </a-upload>
          </div>
          <div style="width: 200px" v-else>
            <a-image :src="fileUrl + formState.patrolPath" alt="" class="imageDetail" />
          </div>
        </a-form-item>
        <a-form-item label="评分参考图" name="reseauUser" v-if="!isAdd">
          <div style="width: 200px">
            <a-image
              :src="fileUrl + formState.annotatedImage"
              alt=""
              class="imageDetail"
              v-if="formState.annotatedImage"
            />
            <div v-else>暂无评分参考图</div>
          </div>
        </a-form-item>
        <a-form-item label="评分说明" name="reseauUser" v-if="!isAdd">
          <div style="width: 200px">
            {{ formState.comment || '暂无评分说明' }}
          </div>
        </a-form-item>
      </a-form>
      <div class="btnFooter">
        <a-button @click="router.go(-1)">返回</a-button>
        <a-button type="primary" @click="submit" v-if="isAdd">提交</a-button>
      </div>
    </div>
    <!-- 弹窗 -->
    <a-modal
      :visible="modalData.open"
      :title="modalData.title"
      @cancel="modalData.open = false"
      @ok="handleOk"
      :width="500"
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
        <a-form-item
          label="巡查分数"
          name="score"
          :rules="[{ required: true, message: '请输入巡查分数!' }]"
          style="width: 100%"
        >
          <a-input
            type="number"
            v-model:value="modalData.formData.score"
            placeholder="请输入巡查分数"
            style="width: 80%"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, h, onMounted, getCurrentInstance } from 'vue';
  import { SearchOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAccountStore } from '@/store';
  import { message, Modal } from 'ant-design-vue';
  const { getFileUrl } = useAccountStore();
  let fileUrl = getFileUrl();
  const router = useRouter();
  const route = useRoute();

  const { proxy } = getCurrentInstance() as any;
  const labelCol = { style: { width: '120px' } };
  const fileList = ref([]);
  const loading = ref<boolean>(false);
  const imageUrl = ref<string>('');
  let pageTitle = ref<string>('');
  const formState = ref<FormState>({
    lx: undefined,
    pointId: undefined,
  });
  let modalRef = ref();
  //弹窗相关
  let modalData = ref({
    open: false,
    openType: 'add',
    title: '修改分数',
    formData: {},
  });
  const beforeUpload = async (file: UploadProps['fileList'][number]) => {
    const formData = new FormData();
    formData.append('file', file); // "file" 是后端接收字段名
    let res = await proxy.$api.uploadPatrol(formData);
    formState.value.image = res.data?.data;
  };
  const getDetail = () => {
    proxy.$api
      .patroldetail({
        id: formState.value.id,
      })
      .then((res: any) => {
        if (res.code === 200) {
          formState.value = res.data.data;
          formState.value.time = formState.value.patrolTime
            ? `${formState.value.patrolTime[0]}-${formState.value.patrolTime[1]}-${formState.value.patrolTime[2]} ${formState.value.patrolTime[3]}:${formState.value.patrolTime[4]}:${formState.value.patrolTime[5]}`
            : '';
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
  let formRef = ref();
  const submit = async () => {
    formRef.value
      .validate()
      .then(async () => {
        let res = await proxy.$api.patroladd(formState.value);
        if (res.code === 200) {
          if (res.data.code === 0) {
            message.success('添加成功');
            router.go(-1); // 返回上一页
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
  const handleOk = () => {
    modalRef.value
      .validate()
      .then(() => {
        proxy.$api
          .patrolupdate({
            patrolId: formState.value.id,
            score: modalData.value.formData.score,
          })
          .then((res: any) => {
            if (res.code === 200) {
              if (res.data.code === 0) {
                message.success('修改成功');
                modalData.value.open = false;
                getDetail(); //重新获取列表数据
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
  const editScore = () => {
    modalData.value.open = true;
    modalData.value.formData.score = formState.value.score;
  };
  getpointList();
  let isAdd = ref();
  onMounted(() => {
    // 这里可以进行一些初始化操作，比如获取数据等
    isAdd.value = route.query.isAdd;
    if (!route.query.isAdd) {
      formState.value = JSON.parse(route.query.record);
      (formState.value.time = formState.patrolTime
        ? `${item.patrolTime[0]}-${item.patrolTime[1]}-${item.patrolTime[2]} ${item.patrolTime[3]}:${item.patrolTime[4]}:${item.patrolTime[5]}`
        : ''),
        console.log(878, formState.value);
      pageTitle.value = `编辑${formState.value.pointName}巡查数据`;
      getDetail();
    } else {
      pageTitle.value = `新增巡查数据`;
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
  ::v-deep(.ant-upload) {
    height: max-content;
    border: none;
    width: max-content;
  }
  .form {
    padding: 20px;
    .ant-form-item {
      margin-bottom: 30px;
    }
    ::v-deep(.ant-select),
    ::v-deep(.ant-input),
    .formLine {
      width: 200px;
      display: flex;
      align-items: center;
      .editIcon {
        font-size: 20px;
        margin-left: 10px;
        color: var(--ant-primary-color);
        cursor: pointer;
      }
    }
  }
  .btnFooter {
    padding: 20px;
    text-align: center;
    button {
      margin: 0 10px;
    }
  }
  img {
    width: 250px;
  }
  .imageDetail {
    width: 150px;
    height: 150px;
    object-fit: contain;
  }
</style>
