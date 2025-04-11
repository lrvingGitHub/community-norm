<template>
  <div>
    <login-box class="shadow-lg" @success="onLoginSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { getCurrentInstance } from 'vue';
  import LoginBox from './LoginBox.vue';
  import { useRouter } from 'vue-router';
  const { proxy } = getCurrentInstance() as any;

  const router = useRouter();
  function onLoginSuccess(e) {
    // proxy.$api.getCode({}).then((res: any) => {
    //   if (res.code === 200) {
    //     localStorage.setItem('token', res.data.token);
    console.log(87545, e);

    router.push('/');
    //   } else {
    //     proxy.$message.error(res.msg);
    //   }
    // });
  }
</script>
<style scoped lang="less">
  .login {
    min-height: max(100vh, 720px);
    margin-top: -78px;
  }
</style>
