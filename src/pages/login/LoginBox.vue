<template>
  <div>
    <div class="loginBox">
      <div class="loginForm">
        <div class="loginTitle">九里堤社区规范系统</div>
        <div class="loginLittleTitle">欢迎登录九里堤社区规范系统</div>
        <div class="loginLine">
          <img :src="loginForm3" alt="" />
          <input type="text" placeholder="请输入您的用户名" v-model="form.username" />
        </div>
        <div class="loginLine">
          <img :src="loginForm1" alt="" />
          <input type="text" placeholder="请输入您的密码" v-model="form.password" />
        </div>
        <div class="loginLine">
          <img :src="loginForm2" alt="" />
          <input type="text" placeholder="请输入验证码" v-model="form.code" @keydown.enter="login" />
          <img :src="code" alt="" class="code" @click="getCode" />
        </div>
        <button class="login" @click="login">登录</button>
      </div>
    </div>
  </div>
  <!-- <ThemeProvider :color="{ middle: { 'bg-base': '#fff' }, primary: { DEFAULT: '#1896ff' } }">
    <div class="login-box rounded-sm">
      <a-form
        :model="form"
        :wrapperCol="{ span: 24 }"
        @finish="login"
        class="login-form w-[400px] p-lg xl:w-[440px] xl:p-xl h-fit text-text"
      >
        <div class="third-platform">
          <div class="third-title mb-md text-lg">第三方登录：</div>
          <div class="third-list flex text-[28px]">
            <WechatOutlined class="icon wechat flex-1 cursor-pointer text-gray-400 hover:text-green-600" />
            <TwitterOutlined class="icon twitter flex-1 cursor-pointer text-gray-400 hover:text-blue-400" />
            <QqOutlined class="icon qq flex-1 cursor-pointer text-gray-400 hover:text-red-600" />
          </div>
        </div>
        <a-divider>Or</a-divider>
        <a-form-item :required="true" name="username">
          <a-input
            v-model:value="form.username"
            autocomplete="new-username"
            placeholder="请输入用户名或邮箱: admin"
            class="login-input h-[40px]"
          />
        </a-form-item>
        <a-form-item :required="true" name="password">
          <a-input
            v-model:value="form.password"
            autocomplete="new-password"
            placeholder="请输入登录密码: 888888"
            class="login-input h-[40px]"
            type="password"
          />
        </a-form-item>
        <a-button htmlType="submit" class="h-[40px] w-full" type="primary" :loading="loading"> 登录 </a-button>
        <a-divider></a-divider>
        <div class="terms">
          登录即代表您同意我们的
          <span class="font-bold">用户条款 </span>、<span class="font-bold"> 数据使用协议 </span>、以及
          <span class="font-bold">Cookie使用协议</span>。
        </div>
      </a-form>
    </div>
  </ThemeProvider> -->
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useAccountStore } from '@/store';
  import { ThemeProvider } from 'stepin';
  import loginForm1 from '@/assets/矢量智能对象(1).png';
  import loginForm2 from '@/assets/矢量智能对象(2).png';
  import loginForm3 from '@/assets/矢量智能对象.png';
  import loginLeft from '@/assets/loginLeft.png';
  import { message, Modal } from 'ant-design-vue';
  // import code from '@/assets/1744078176861.jpg';
  import { getCurrentInstance } from 'vue';
  const { proxy } = getCurrentInstance() as any;

  export interface LoginFormProps {
    username: string;
    password: string;
  }
  const loading = ref(false);
  let code = ref('');
  let uuidstr = ref('');
  let form = reactive({
    username: 'admin',
    password: 'Jksj@2025',
  });
  const emit = defineEmits<{
    (e: 'success', fields: LoginFormProps): void;
    (e: 'failure', reason: string, fields: LoginFormProps): void;
  }>();

  const accountStore = useAccountStore();
  function login() {
    loading.value = true;
    let params = {
      username: form.username,
      password: form.password,
      code: form.code,
      uuidstr: uuidstr.value,
    };
    accountStore
      .login(form.username, form.password, form.code, uuidstr.value)
      .then((res) => {
        console.log(6665, res);
        if (res.code === 0) {
          localStorage.setItem('userInfo', JSON.stringify(res.data));
          emit('success', params);
        } else {
          message.error(res.msg);
        }
      })
      .catch((e) => {
        // emit('failure', e.message, params);
      })
      .finally(() => (loading.value = false));
  }
  const getCode = () => {
    proxy.$api.getCode({}).then((res: any) => {
      if (res.code === 200) {
        console.log(87812, res.data);

        code.value = 'data:image/png;base64,' + res.data.img;
        uuidstr.value = res.data.uuidstr;
      } else {
        proxy.$message.error(res.msg);
      }
    });
  };
  getCode();
</script>
<style scoped lang="less">
  .loginBox {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: url('@/assets/loginLeft.png');
    background-size: 100% 100%;
    position: relative;
  }
  .loginForm {
    position: absolute;
    right: 11%;
    background: #fff;
    border-radius: 10px;
    .loginTitle {
      font-size: 40px;
      font-family: Alibaba PuHuiTi;
      font-weight: bold;
      color: #3b82f6;
      line-height: 40px;
    }
    .loginLittleTitle {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 20px;
      color: #3b82f6;
      line-height: 44px;
      text-align: center;
      margin: 30px 0;
    }
    .loginLine {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      border-bottom: 1px solid #d5d5d5;
      img {
        object-fit: contain;
        margin-right: 10px;
        flex: none;
        width: 20px;
        height: 20px;
        // border-right: 1px solid #68a950;
        // padding-right: 10px;
      }
      input {
        width: 100%;
        height: 40px;
        border-radius: 0;
        border: none;
        padding-left: 10px;

        &:focus {
          outline: none;
          border-color: #d5d5d5;
        }
      }
      .code {
        height: max-content;
        width: 100px;
        border: none;
      }
    }
  }
  .login {
    background: #3b82f6;
    color: #fff;
    border: none;
    width: 100%;
    border-radius: 50px;
    height: 50px;
    margin-top: 20px;
  }
</style>
