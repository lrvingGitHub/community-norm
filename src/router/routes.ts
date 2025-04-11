import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'workplace',
    component: () => import('@/pages/workplace/index.vue'),
    meta: {
      title: '首页',
      renderMenu: false,
      icon: 'CreditCardOutlined',
    }
  },
  {
    path: '/login',
    name: '登录',
    meta: {
      icon: 'LoginOutlined',
      view: 'blank',
      target: '_blank',
      cacheable: false,
      renderMenu: false,
    },
    component: () => import('@/pages/login'),
  },
  {
    path: '/point',
    name: 'point',
    meta: {
      title: '点位管理',
      icon: 'EnvironmentOutlined',
      renderMenu: true,
      cacheable: false,
    },
    component: () => import('@/pages/point/index.vue'),
  },
  {
    path: '/pointDetail',
    name: 'pointDetail',
    meta: {
      title: '点位详情',
      icon: 'UserOutlined',
      renderMenu: false,
      cacheable: false,
    },
    component: () => import('@/pages/point/pointDetail.vue'),
  },
  {
    path: '/patrol',
    name: 'patrol',
    meta: {
      title: '巡查管理',
      icon: 'UserOutlined',
      renderMenu: true,
      cacheable: false,
    },
    component: () => import('@/pages/patrol/index.vue'),
  },
  // {
  //   path: '/user',
  //   name: 'user',
  //   meta: {
  //     title: '用户管理',
  //     icon: 'UserOutlined',
  //     renderMenu: true,
  //     cacheable: false,
  //   },
  //   component: () => import('@/pages/user/index.vue'),
  // },
  {
    path: '/patrolDetail',
    name: 'patrolDetail',
    meta: {
      title: '巡查详情',
      icon: 'UserOutlined',
      renderMenu: false,
      cacheable: false,
    },
    component: () => import('@/pages/patrol/patrolDetail.vue'),
  },
  // {
  //   path: '/user',
  //   name: 'user',
  //   meta: {
  //     title: '用户管理',
  //     icon: 'UserOutlined',
  //     renderMenu: true,
  //     cacheable: false,
  //   },
  //   component: () => import('@/pages/user/index.vue'),
  // },
  // {
  //   path: '/role',
  //   name: 'role',
  //   meta: {
  //     title: '角色管理',
  //     icon: 'UserOutlined',
  //     renderMenu: true,
  //     cacheable: false,
  //   },
  //   component: () => import('@/pages/role/index.vue'),
  // },
  {
    path: '/system',
    name: 'system',
    meta: {
      title: '系统管理',
      icon: 'UserOutlined',
      renderMenu: true,
    },
    children: [
      // {
      //   path: '/user',
      //   name: 'user',
      //   meta: {
      //     title: '用户管理',
      //     icon: 'UserOutlined',
      //     renderMenu: true,
      //     cacheable: false,
      //   },
      //   component: () => import('@/pages/user/index.vue'),
      // }
      {
        path: '/user',
        name: 'user',
        meta: {
          title: '用户管理',

          icon: 'UserOutlined',
          renderMenu: true,
          cacheable: false,
        },
        component: () => import('@/pages/user/index.vue'),
      },
      {
        path: '/role',
        name: 'role',
        meta: {
          title: '角色管理',

          icon: 'UserOutlined',
          renderMenu: true,
          cacheable: false,
        },
        component: () => import('@/pages/role/index.vue'),
      },
    ],
  },
  {
    path: '/403',
    name: '403',
    props: true,
    meta: {
      renderMenu: false,
    },
    component: () => import('@/pages/Exp403.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    props: true,
    meta: {
      icon: 'CreditCardOutlined',
      renderMenu: false,
      cacheable: false,
      _is404Page: true,
    },
    component: () => import('@/pages/Exp404.vue'),
  },
];

export default routes;
