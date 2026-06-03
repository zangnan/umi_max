// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';

import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV, build_env, JC_TYPE, THEME_TYPE,DZSWJ_ADDRESS } = process.env;

// build:dev  build_env=dev     // 后端开发自测环境
// build:test build_env=test    // 测试环境
// build:dem  build_env=dem     // 演示环境
// build:pro  build_env=pro     // 生产环境
// build:sztest build_env=sztest    // 深圳集成测试环境
// build:szdem  build_env=szdem     // 深圳集成现场测试环境
// build:szpro  build_env=szpro     // 深圳集成生产环境
// build:ls  build_env=ls     // 临时 
let apiUrlBase = '';
let outputPath = '/dist';
let webbasePath = JC_TYPE ? `/${JC_TYPE}/` : '/saas/'
let rootNode = JC_TYPE ? JC_TYPE : 'saas'
// 默认走测试环境

let dzswjUrl = 'https://tsysb.tax360.com.cn/yrpa';
if (build_env === 'relpath' || build_env === 'relpathTheme04' || build_env === 'jcRelpath' || build_env === 'jcrelpathTheme04') {
  rootNode = 'cktsgl/';
}
if (build_env === 'dev') {
  apiUrlBase = 'http://localhost:6066/dditSaas/v1';
  outputPath = 'distCompress';
} else if (build_env === 'test') {
  apiUrlBase = 'http://192.168.0.35:8002/dditSaas/v1';
  outputPath = 'distCompress';
} else if (build_env === 'dem') {
  apiUrlBase = 'https://pre.ddit.online:10007/dditSaas/v1';
  webbasePath = 'https://pre.ddit.online:10007/saas/';
  outputPath = 'distCompress';
} else if (build_env === 'pro') {
  apiUrlBase = 'https://hts.ddit.online/dditSaas/v1'; // 后续需要调整
  webbasePath = 'https://hts.ddit.online/saas/';
  outputPath = 'distCompress';
} else if (build_env === 'sztest') { // 深圳集成测试环境
  apiUrlBase = 'https://gps.ddit.online:10007/cktsgl/v1';
  webbasePath = 'https://gps.ddit.online:10007/ckts/';
  outputPath = 'distCompress';
} else if (build_env === 'szdem') { // 深圳集成现场测试环境
  apiUrlBase = 'https://app.szdyck.cn/cktsgl/v1';
  webbasePath = 'https://app.szdyck.cn/ckts/';
  outputPath = 'distCompress';
} else if (build_env === 'szpro') { // 深圳集成生产环境
  apiUrlBase = 'https://app.szdyck.cn/cktsgl/v1';
  webbasePath = 'https://app.szdyck.cn/ckts/';
  outputPath = 'distCompress';
} else if (build_env === 'ls') {
  apiUrlBase = 'https://pre.ddit.online:10007/dditSaas/v1'; // 后续需要调整
  outputPath = 'distCompress';
  // webbasePath = 'http://waf.tax360.com.cn:19099/saas/';
} else if (build_env === 'relpath' || build_env === 'relpathTheme04') { // 相对路径
  apiUrlBase = '/cktsgl/v1';
  webbasePath = '/cktsgl/';
  outputPath = 'distCompress';
} else if (build_env === 'jcRelpath' || build_env === 'jcrelpathTheme04') { // 相对路径
  apiUrlBase = '/cktsgl/v1';
  webbasePath = '/cktsgl/';
  outputPath = 'distCompress';
}
else if (build_env === 'relpath' || build_env === 'relpathTheme04') { // 相对路径
  apiUrlBase = '/cktsgl/v1';
  webbasePath = '/cktsgl/';
  outputPath = 'distCompress';
} 
if(DZSWJ_ADDRESS === 'pro' ){
  dzswjUrl = 'https://tsysb.tax360.com.cn/yrpa';
}

export default defineConfig({
  // base: '/',
  // 自定义 start
  // h5
  base: process.env.NODE_ENV === 'production' ? rootNode : '/',
  publicPath: process.env.NODE_ENV === 'production' ? webbasePath : '/',
  // base: base,
  // publicPath: publicPath,
  // outputPath: '/dist',
  outputPath: outputPath,
  // desktop
  // base: '/',
  // publicPath: process.env.APP_TYPE == 'desktop' ? './' : '/',
  // history: { type: process.env.NODE_ENV === 'production' ? 'hash' : 'browser' },
  // history: { type: 'browser' },
  history: { type: build_env === 'relpath' || build_env === 'jcRelpath' ? 'hash': 'browser' },
  define: {
    // API_URL_BASE: process.env.NODE_ENV === 'production' ? 'http://192.168.0.34:8002/dditsaashonor/v1' : '',
    API_URL_BASE: apiUrlBase,
    // API_URL_DZSWJ: 'http://192.168.0.122:18088/yrpa',
    API_URL_DZSWJ: dzswjUrl,
    PRO_TYPE: process.env.PRO_TYPE ? process.env.PRO_TYPE : '',
    moduel: process.env.moduel ? process.env.moduel : '',
    layoutScrollType: process.env.layoutScrollType ? process.env.layoutScrollType : '',
    LOCAL_MENU: false, // 是否采用本地菜单
    PRO_BASE: process.env.NODE_ENV === 'production' ? rootNode : '', // 项目根环境
    JC_TYPE,
    THEME_TYPE
  },
  // 自定义 end
  hash: true,
  antd: {
    config: {
      componentSize: 'middle',
      space: {
        size: 10
      },
    }
  },

  access: {},
  // access: {
  //   strictMode: true,
  // },
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: false,
    siderWidth: 200,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: { type: 'none' },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
