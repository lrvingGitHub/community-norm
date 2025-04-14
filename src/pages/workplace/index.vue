<template>
  <div>
    <!-- 搜索 -->
    <a-form :model="formState" name="search" class="search" autocomplete="off" layout="inline">
      <a-form-item label="查询时间段" name="keywords">
        <a-range-picker :placeholder="['开始时间', '结束时间']" :format="dateFormat" v-model:value="currentTime" />
      </a-form-item>
      <a-button type="primary" :icon="h(SearchOutlined)" @click="search()">搜索</a-button>
    </a-form>

    <div style="height: 500px" ref="container" class="bar-chart"></div>
    <!-- 弹窗 -->
    <a-modal
      :visible="modalData.open"
      :title="modalData.title"
      @cancel="modalData.open = false"
      @ok="handleOk"
      :width="1000"
      class="modalForm"
      cancelText="取消"
      okText="确定"
    >
      <div style="height: 500px" ref="containererjire" class="containererjire-chart"></div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import { onBeforeUnmount, onMounted, reactive, PropType, h, ref, getCurrentInstance } from 'vue';
  import { EChartsType, Color } from 'echarts';
  const { proxy } = getCurrentInstance() as any;
  import dayjs, { Dayjs } from 'dayjs';
  import {
    SearchOutlined,
    DownOutlined,
    PlusOutlined,
    RedoOutlined,
    ExclamationCircleOutlined,
  } from '@ant-design/icons-vue';
  import * as echarts from 'echarts';
  let currentTime = ref('');
  const container = ref<HTMLElement>();

  let chart: EChartsType | null = null;

  const props = defineProps({
    color: Array as PropType<Color[]>,
    list: Array,
  });
  const formState = reactive<FormState>({
    keywords: '',
    startTime: '',
    endTime: '',
  });
  function resize() {
    chart?.resize();
  }
  let firstFloorList = ref([]);
  /**
   * 获取巡逻详情的函数
   */
  const dateFormat = 'YYYY-MM-DD';
  let dataList = ref([]);
  const search = () => {
    if (currentTime.value) {
      formState.startTime = dayjs(currentTime.value[0]).format(dateFormat);
      formState.endTime = dayjs(currentTime.value[1]).format(dateFormat);
    } else {
      formState.startTime = '';
      formState.endTime = '';
    }

    getDetail();
  };
  const getDetail = () => {
    return new Promise((resolve) => {
      proxy.$api
        .patrolcount({
          startTime: formState.startTime,
          endTime: formState.endTime,
        })
        .then((res: any) => {
          if (res.code === 200) {
            if (res.data.code === 0) {
              let data = res.data.data;
              dataList.value = data;
              let firstFloor = res.data.data.map((item: any) => {
                let averageScore = item.points.reduce((total: any, currentValue: any) => total + currentValue.score, 0);
                return {
                  average: (averageScore / item.points.length).toFixed(2),
                  ...item,
                };
              });
              firstFloorList.value = firstFloor;
            }
          } else {
            message.error(res.msg);
          }
          getYIJI();
          resolve(true);
        });
    });
  };
  onMounted(async () => {
    console.log(222, 'ddd');

    await getDetail();
  });
  const getYIJI = () => {
    chart = echarts.init(container.value!);
    var data = firstFloorList.value;
    data?.sort((a, b) => b.average - a.average);
    chart.setOption({
      backgroundColor: '#fff',
      tooltip: {
        show: true,
        trigger: 'item',
        backgroundColor: 'rgba(22, 119, 255,0.3)',
        axisPointer: {
          lineStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#FFD56E',
                },
                {
                  offset: 0.5,
                  color: '#fff',
                },
                {
                  offset: 1,
                  color: '#FFD56E',
                },
              ],
              global: false,
            },
          },
        },
      },
      legend: {
        right: 20,
        top: 0,
        itemGap: 10, // 各个item之间的间隔，单位px，默认为10，
        itemWidth: 30, // 图例图形宽度
        itemHeight: 10, // 图例图形高度
        textStyle: {
          color: 'red',
          fontWeight: 'normal',
          fontSize: 14,
        },
      },
      dataZoom: [
        {
          type: 'inside',
          width: '100%',
          height: '10',
          right: '0%',
          left: '0%',
          bottom: '0px',
          backgroundColor: '#ddd', //滚到颜色
          handeSize: 0, //手柄
          realtime: true, //实时更新
          filterMode: 'filter',
          startValue: 0, //从0个柱子开始，也就是最起始的地方
          endValue: 5, //到第6个柱子结束
          show: true,
        },
      ],
      grid: {
        top: '5%',
        left: '3%',
        right: '1%',
        bottom: '8%',
      },
      xAxis: [
        {
          type: 'category',
          data: data.map((item) => item.name),
          axisTick: {
            show: false, // 是否显示坐标轴轴线
          },
          axisLabel: {
            color: '#282828',
          },
          splitLine: {
            show: false,
          },
          boundaryGap: true,
          axisLine: {
            //坐标轴轴线相关设置。
            show: true,
            inside: false,
            lineStyle: {
              color: '#000',
            },
          },
        },
      ],

      yAxis: [
        {
          type: 'value', // 数值轴
          nameLocation: 'middle', // 名称位置
          nameGap: 30, // 名称与轴线距离
          name: '平均分',
          type: 'value',
          min: 0,
          max: 100,
          splitNumber: 5,
          splitLine: { show: true },
          axisLabel: {
            //坐标轴刻度标签的相关设置。
            show: true,
            textStyle: {
              color: '#737373',
            },
          },
          axisLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(131,101,101,0.2)',
              type: 'dashed',
            },
          },
          show: true,
        },
      ],
      series: [
        {
          type: 'bar',
          barMaxWidth: 20,
          zlevel: 10,
          // barGap: '100%',
          data: data.map((item) => item.average),
          label: {
            show: true,
            position: 'top',
            formatter: '{c} 分', // 显示数据值加单位
            color: 'rgba(22, 119, 255)', // 文字颜色
            fontSize: 12, // 文字大小
            fontWeight: 'bold', // 文字粗细
          },
          itemStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(22, 119, 255,1)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(22, 119, 255,0.3)',
                  },
                ],
              },
              barBorderRadius: [30, 30, 0, 0],
            },
          },
        },
        {
          type: 'bar',
          itemStyle: {
            normal: {
              color: 'rgba(22, 119, 255,0.3)',
            },
          },
          silent: true,
          barWidth: 50,
          barGap: '-170%',
          data: firstFloorList.value.map((item) => 100),
        },
      ],
    });
    window.addEventListener('resize', resize);
    // ⭐ 添加点击事件监听
    chart.on('click', (params) => {
      getcontainererji(params.name);
      console.log('点击了柱子：', params);
    });
  };
  let containererjire = ref();
  let charterji = ref();
  //弹窗相关
  let modalData = ref({
    open: false,
    title: '',
    formData: {},
  });
  const getcontainererji = (name) => {
    let data = dataList.value.find((item: any) => item.name === name);
    data.points?.sort((a, b) => b.score - a.score);
    let x = data.points.map((item: any) => item.pointName);
    let y = data.points.map((item: any) => item.score || 0);
    modalData.value.title = name + '的数据详情';
    console.log('e', x, y);

    modalData.value.open = true;
    setTimeout(() => {
      charterji = echarts.init(containererjire.value!);
      charterji.setOption({
        backgroundColor: '#fff',
        tooltip: {
          show: true,
          trigger: 'item',
          backgroundColor: 'rgba(22, 119, 255,0.3)',
          axisPointer: {
            lineStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#FFD56E',
                  },
                  {
                    offset: 0.5,
                    color: '#fff',
                  },
                  {
                    offset: 1,
                    color: '#FFD56E',
                  },
                ],
                global: false,
              },
            },
          },
        },
        legend: {
          right: 20,
          top: 0,
          itemGap: 10, // 各个item之间的间隔，单位px，默认为10，
          itemWidth: 30, // 图例图形宽度
          itemHeight: 10, // 图例图形高度
          textStyle: {
            color: 'red',
            fontWeight: 'normal',
            fontSize: 14,
          },
        },

        dataZoom: [
          {
            type: 'inside',
            width: '100%',
            height: '10',
            right: '0%',
            left: '0%',
            bottom: '0px',
            backgroundColor: '#ddd', //滚到颜色
            handeSize: 0, //手柄
            realtime: true, //实时更新
            filterMode: 'filter',
            startValue: 0, //从0个柱子开始，也就是最起始的地方
            endValue: 5, //到第6个柱子结束
            show: true,
          },
        ],
        grid: {
          top: '5%',
          left: '3%',
          right: '1%',
          bottom: '8%',
        },
        xAxis: [
          {
            name: '分',
            type: 'category',
            data: x,
            axisTick: {
              show: false, // 是否显示坐标轴轴线
            },
            axisLabel: {
              color: '#282828',
            },
            splitLine: {
              show: false,
            },
            boundaryGap: true,
            axisLine: {
              //坐标轴轴线相关设置。
              show: true,
              inside: false,
              lineStyle: {
                color: '#000',
              },
            },
          },
        ],

        yAxis: [
          {
            type: 'value', // 数值轴
            nameLocation: 'middle', // 名称位置
            nameGap: 30, // 名称与轴线距离
            name: '平均分',
            type: 'value',
            min: 0,
            max: 100,
            splitNumber: 5,
            splitLine: { show: true },
            axisLabel: {
              //坐标轴刻度标签的相关设置。
              show: true,
              textStyle: {
                color: '#737373',
              },
            },
            axisLine: {
              show: true,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(131,101,101,0.2)',
                type: 'dashed',
              },
            },
            show: true,
          },
        ],
        series: [
          {
            type: 'bar',
            barMaxWidth: 20,
            zlevel: 10,
            // barGap: '100%',
            data: y,
            barWidth: 30,
            label: {
              show: true,
              position: 'top',
              formatter: '{c} 分', // 显示数据值加单位
              color: 'rgba(22, 119, 255)', // 文字颜色
              fontSize: 12, // 文字大小
              fontWeight: 'bold', // 文字粗细
            },
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(22, 119, 255,1)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(22, 119, 255,0.3)',
                    },
                  ],
                },
                barBorderRadius: [30, 30, 0, 0],
              },
            },
          },
          {
            type: 'bar',
            itemStyle: {
              normal: {
                color: 'rgba(22, 119, 255,0.3)',
              },
            },
            silent: true,
            barWidth: 30,
            barGap: '-125%',
            data: y.map((item) => 100),
          },
        ],
      });
    }, 0);
  };
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize);
  });
</script>
<style scoped lang="less">
  .bar-chart {
    padding: 100px;
    :deep(canvas) {
      @apply rounded-lg;
    }
  }
  .containererjire-chart {
    padding: 30px;
  }
</style>
