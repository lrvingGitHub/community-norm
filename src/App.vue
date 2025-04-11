<template>
  <a-config-provider :getPopupContainer="getPopupContainer">
    <ThemeProvider is-root v-bind="themeConfig" :apply-style="false" :color="{ primary: { DEFAULT: '#3B82F6' } }">
      <!-- logo-src="@/assets/vite.svg" -->
      <!-- :menuList="basicmenuList" -->

      <stepin-view
        system-name="社区规范系统"
        logo-src="@/assets/sysLogo.png"
        :class="`${contentClass}`"
        :user="user"
        :menuList="basicmenuList"
        :navMode="navigation"
        :useTabs="useTabs"
        :themeList="themeList"
        v-model:show-setting="showSetting"
        v-model:theme="theme"
        @themeSelect="configTheme"
      >
        <template #headerActions>
          <HeaderActions @showSetting="showSetting = true" />
        </template>
        <template #pageFooter>
          <PageFooter />
        </template>
        <template #themeEditorTab>
          <a-tab-pane tab="其它" key="other">
            <Setting />
          </a-tab-pane>
        </template>
      </stepin-view>
    </ThemeProvider>
  </a-config-provider>
  <login-modal :unless="['/login']" />
  <!-- 修改密码 -->
  <a-modal
    :visible="editPwd.open"
    title="修改密码"
    @cancel="editPwd.open = false"
    @ok="handleOk"
    :width="500"
    class="modalForm"
    cancelText="取消"
    okText="确定"
  >
    <a-form
      :model="editPwd.formData"
      ref="editPwdRef"
      name="search"
      :label-col="labelCol"
      class="search"
      autocomplete="off"
    >
      <a-form-item label="旧密码" name="oldPassword" :rules="[{ required: true, message: '请输入旧密码!' }]">
        <a-input v-model:value="editPwd.formData.oldPassword" placeholder="请输入旧密码" />
      </a-form-item>
      <a-form-item label="新密码" name="newPassword" :rules="[{ required: true, message: '请输入新密码!' }]">
        <a-input v-model:value="editPwd.formData.newPassword" placeholder="请输入新密码" />
      </a-form-item>
      <a-form-item
        label="确认新密码"
        name="againNewPassword"
        :rules="[{ required: true, message: '请输入确认新密码!' }]"
      >
        <a-input v-model:value="editPwd.formData.againNewPassword" placeholder="请确认新密码" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue';
  import { useRouter } from 'vue-router';
  import { notification } from 'ant-design-vue';
  import { useAccountStore, useMenuStore, useSettingStore, storeToRefs } from '@/store';
  import avatar from '@/assets/avatar.png';
  import { PageFooter, HeaderActions } from '@/components/layout';
  import Setting from './components/setting';
  import { LoginModal } from '@/pages/login';
  import { configTheme, themeList } from '@/theme';
  import { ThemeProvider } from 'stepin';
  import { computed } from 'vue';

  const { proxy } = getCurrentInstance() as any;
  const { logout, profile } = useAccountStore();

  // 获取个人信息
  // profile().then((response) => {
  //   const { account } = response;
  //   user.name = account.username;
  //   // user.avatar = account.avatar;
  // });
  const showSetting = ref(false);
  const router = useRouter();

  useMenuStore().getMenuList();

  const { navigation, useTabs, theme, contentClass } = storeToRefs(useSettingStore());
  const themeConfig = computed(() => themeList.find((item) => item.key === theme.value)?.config ?? {});

  const user = reactive({
    name: 'admin',
    avatar: avatar,
    menuList: [
      // { title: '个人中心', key: 'personal', icon: 'UserOutlined', onClick: () => router.push('/profile') },
      { title: '修改密码', key: 'setting', icon: 'EditOutlined', onClick: () => openEditPwd() },
      { type: 'divider' },
      {
        title: '退出登录',
        key: 'logout',
        icon: 'LogoutOutlined',
        onClick: () => logout().then(() => router.push('/login')),
      },
    ],
  });
  let basicmenuList = ref([
    { title: '工作台', path: '/', meta: { icon: 'DashboardOutlined' } },
    {
      path: '/point',
      name: 'point',
      title: '点位管理',
      meta: {
        icon: 'EnvironmentOutlined',
        renderMenu: true,
        cacheable: false,
      },
    },
    {
      path: '/patrol',
      name: 'patrol',
      title: '巡查管理',
      meta: {
        icon: 'AlertOutlined',
        renderMenu: true,
        cacheable: false,
      },
      component: () => import('@/pages/patrol/index.vue'),
    },
    {
      path: '/patrolDetail',
      name: 'patrolDetail',
      meta: {
        title: '巡查详情',
        icon: 'UserOutlined',
        visible: false,
        cacheable: false,
        renderMenu: false,
      },
      component: () => import('@/pages/patrol/patrolDetail.vue'),
    },
    {
      path: '/pointDetail',
      name: 'pointDetail',
      title: '点位详情',
      meta: {
        visible: false,
        cacheable: false,
        renderMenu: false,
        icon: 'EnvironmentOutlined',
      },
      component: () => import('@/pages/point/pointDetail.vue'),
    },
    {
      title: '系统配置',
      path: '/system',
      meta: { icon: 'FormOutlined' },
      children: [
        {
          path: '/user',
          name: 'user',
          title: '用户管理',
          meta: {
            icon: 'UserOutlined',
            renderMenu: true,
            cacheable: false,
          },
          component: () => import('@/pages/user/index.vue'),
        },
        {
          path: '/role',
          name: 'role',
          title: '角色管理',
          meta: {
            icon: 'BugOutlined',
            renderMenu: true,
            cacheable: false,
          },
          component: () => import('@/pages/role/index.vue'),
        },
      ],
    },
  ]);

  const getUser = () => {
    let userDetail = JSON.parse(localStorage.getItem('userInfo') || '{}');
    user.name = userDetail.name;
    user.avatar = 'https://img1.baidu.com/it/u=1090403966,2803330688&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=520';
    console.log('666', user);
  };
  getUser();
  // 修改密码相关

  let editPwd = ref({
    open: false,
    title: '修改密码',
    icon: 'EditOutlined',
    formData: {},
  });
  let editPwdRef = ref();
  const labelCol = { style: { width: '100px' } };
  const openEditPwd = () => {
    editPwd.value.open = true;
    setTimeout(() => {
      editPwdRef.value.resetFields();
    }, 0);
    // editPwd.value.formData = {
    //   oldPassword: undefined,
    //   newPassword: undefined,
    //   againNewPassword: undefined,
    // };
  };

  // 提交修改密码
  const handleOk = () => {
    editPwdRef.value
      .validate()
      .then(() => {
        if (editPwd.value.formData.newPassword !== editPwd.value.formData.againNewPassword) {
          notification.error({
            message: `提示`,
            description: '两次输入的密码不一致，请重新输入！',
            placement: 'topRight',
          });
          return;
        }
        if (editPwd.value.formData.newPassword.length < 6) {
          notification.error({
            message: `提示`,
            description: '新密码长度不能小于6位，请重新输入！',
            placement: 'topRight',
          });
          return;
        }
        if (editPwd.value.formData.oldPassword === editPwd.value.formData.newPassword) {
          notification.error({
            message: `提示`,
            description: '新密码不能与旧密码相同，请重新输入！',
            placement: 'topRight',
          });
          return;
        }
        const params = {
          id: JSON.parse(localStorage.getItem('userInfo') || '{}').id,
          oldPassword: editPwd.value.formData.oldPassword,
          newPassword: editPwd.value.formData.newPassword,
        };
        proxy.$api.updatePassword(params).then((res) => {
          notification.success({
            message: `提示`,
            description: '修改密码成功！',
            placement: 'topRight',
          });
          editPwdRef.value.resetFields();
          editPwd.value.open = false;
          logout().then(() => router.push('/login'));
        });
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  function getPopupContainer() {
    return document.querySelector('.stepin-layout');
  }
</script>

<style lang="less">
  .stepin-view {
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      border-radius: 4px;
      background-color: theme('colors.primary.500');
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: theme('colors.primary.400');

      &:hover {
        background-color: theme('colors.primary.500');
      }
    }

    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
      border-radius: 4px;
      background: theme('backgroundColor.layout');
    }
  }

  html {
    height: 100vh;
    overflow-y: hidden;
  }

  body {
    margin: 0;
    height: 100vh;
    overflow-y: hidden;
  }
  .stepin-img-checkbox {
    @apply transition-transform;
    &:hover {
      @apply scale-105 ~"-translate-y-[2px]";
    }
    img {
      @apply shadow-low rounded-md transition-transform;
    }
  }
  .stepin-logo {
    justify-content: center;
  }
  .system-name {
    font-size: 14px !important;
    font-weight: bold !important;
    color: #333 !important;
    margin-left: 8px !important;
  }
  .logo-img {
    width: 20px;
    height: max-content !important;
  }
  .stepin-logo.collapsed .system-name {
    display: none;
  }
  .ant-table-cell {
    padding-top: 12px !important;
    padding-bottom: 12px !important;
  }
</style>
