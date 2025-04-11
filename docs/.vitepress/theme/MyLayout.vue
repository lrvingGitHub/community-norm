<script lang="ts" setup>
  import { onBeforeMount, watch } from 'vue';
  import { useThemeStore } from 'stepin/es/theme-provider';
  import Theme from 'vitepress/theme';
  import { useData } from 'vitepress';
  const { Layout } = Theme;

  const { isDark } = useData();

  const { setBgSeriesColors, setPrimaryColor, setFont } = useThemeStore();

  onBeforeMount(() => {
    setFont({ 'font-size': '30px' });

    setPrimaryColor({ DEFAULT: '#000000' });
    setTheme();
  });
  function setTheme() {
    // 判断是否为深色模式
    if (isDark.value) {
      // 如果是深色模式，设置背景颜色
      setBgSeriesColors({ 'bg-base': '#1e1e20', 'bg-side': '#161618' });
    } else {
      // 如果不是深色模式，设置背景颜色
      setBgSeriesColors({ 'bg-base': '#fff', 'bg-side': '#f6f6f7' });
    }
  }

  watch(isDark, () => {
    setTheme();
  });
</script>
<template>
  <Layout> </Layout>
</template>
