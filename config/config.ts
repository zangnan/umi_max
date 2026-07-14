import { defineConfig } from '@umijs/max';
import routes from './routes';
import dayjs from "dayjs";

let proBase = process.env.NODE_ENV === 'production' ? 'ddittoolV0.2' : '';
const { build_env } = process.env;
// let accessClientId = 'access_test';
let accessClientId = 'dditSaas';
let sysTitle = '应用开发工具';
let envType = '';
let versionDate = dayjs(new Date()).format('YYMMDD.hhmm');
// let apiUrlBase = 'http://192.168.0.194:18088';  // 正式库 联调环境  v0.1
let apiUrlBase = 'http://192.168.0.193:18088';  // 正式库 联调环境  v0.2
let apiUrlBaseNode = 'http://jfzxnpm.ddit.com.cn:7001/api/v0.1';
if (build_env === 'nbglxt') { // 内部管理系统
  apiUrlBase = 'http://192.168.0.195:18099';
  proBase = 'ddittoolV0.2_nbglxt';
  accessClientId = 'dditSaas';
  sysTitle = '内部管理系统T';
} else if (build_env === 'nbglxt_pro') { // 内部管理系统 正式环境
  // apiUrlBase = 'http://192.168.70.21:18099';
  apiUrlBase = 'http://192.168.0.193:18066';
  proBase = 'ddittoolV0.2_nbglxt_pro';
  accessClientId = 'dditSaas';
  sysTitle = '内部管理系统';
} else if (build_env === 'jww') { // jww 联调环境
  apiUrlBase = 'http://localhost:18088';
  // apiUrlBase = 'http://192.168.21.3:18088';
  proBase = 'ddittool';
  accessClientId = 'dditSaas';
  sysTitle = '应用开发工具T';
} else if (build_env === 'eggjs') {
  apiUrlBase = 'http://192.168.21.5:7001';
  proBase = 'ddittoolV0.2_eggjs';
  accessClientId = 'dditSaas';
  sysTitle = '应用开发工具DC';
  envType = 'node'; // 后端环境类型
  apiUrlBaseNode = 'http://192.168.21.5:7001'; // node env
}

export default defineConfig({
  esbuildMinifyIIFE: true, // 修复 esbuild 压缩器自动引入的全局变量导致的命名冲突问题。
  qiankun: {
    slave: {},
  },
  // qiankun: {
  //   master: {
  //     apps: [
  //       {
  //         name: 'app1',
  //         entry: '//localhost:3005',
  //       },
  //       {
  //         name: 'app2',
  //         entry: '//localhost:3006',
  //       },
  //     ],
  //   }
  // },
  exportStatic: {},
  base: process.env.NODE_ENV === 'production' ? `/${proBase}/` : '/',
  publicPath: process.env.NODE_ENV === 'production' ? `/${proBase}/` : '/',
  antd: {
    configProvider: {
      componentSize: 'middle',
      space: {
        size: 'small'
      },
      // message: { // 无效
      //   maxCount: 1,
      //   style: 'color: red;'
      // },
      // config: {
      //   message: {
      //     maxCount: 1,
      //     style: 'color: red;'
      //   }
      // }
    },
    appConfig: {
      message: {
        // 配置 message 最大显示数，超过限制时，最早的消息会被自动关闭
        maxCount: 1,
      }
    }
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {},
  favicons: [process.env.NODE_ENV === 'production' ? `/${proBase}/icons/favicon.png` : '/icons/favicon.png'],
  history: { type: process.env.NODE_ENV === 'production' ? 'hash': 'browser' },
  // favicons: ['/icons/favicon.png'],
  define: {
    APP_BASE: `${proBase}`,
    API_URL_BASE: apiUrlBase,
    API_URL_BASE_NODE: apiUrlBaseNode, // 'http://jfzxnpm.ddit.com.cn:7001/api/v0.1',
    LOCAL_MENU: false, // 是否采用本地菜单
    EXAMPLE_MENU_SHOW: false, // 是否显示示例菜单 后端菜单下生效
    ACCESS_CLIENT_ID: accessClientId, // 是否采用本地菜单
    API_URL_EXAMPLE: '', // 示例mock数据
    API_URL_HTS: '', // 慧退税
    ENV_TYPE: envType, // 后端环境类型
    SYS_TITLE: sysTitle,
    VERSION_DATE: versionDate,
    PRO_BASE: process.env.NODE_ENV === 'production' ? 'saas' : '', // 项目根环境
  },
  routes,
  npmClient: 'yarn',
  hash: true,
  externals: { './cptable': 'var cptable' },
  // clickToComponent: {}, // 开启后，可通过Alt + 鼠标右键Click 点击组件跳转至编辑器源码位置
  styles: [
    // process.env.NODE_ENV === 'production' ? `/${proBase}/jsondiffpatch/html.css` : `/jsondiffpatch/html.css`,
    // process.env.NODE_ENV === 'production' ? `/${proBase}/jsondiffpatch/annotated.css` : `/jsondiffpatch/annotated.css`,
  ],
  scripts: [
    // process.env.NODE_ENV === 'production' ? `/${proBase}/jsondiffpatch/jsondiffpatch.umd.min.js` : `/jsondiffpatch/jsondiffpatch.umd.min.js`,
    process.env.NODE_ENV === 'production' ? `/${proBase}/sheetjs/xlsx.core.min.js` : `/sheetjs/xlsx.core.min.js`,
  ],
  // http://localhost:3001/umi/plugin/openapi
  // http://localhost:7001/swagger-ui.html
  plugins: ['@umijs/max-plugin-openapi'],
  // openAPI: {
  //   requestLibPath: "import { request } from 'umi'",
  //   // 或者使用在线的版本
  //   // schemaPath: "http://localhost:7001/swagger-doc",
  //   schemaPath: "http://192.168.21.5:7001/swagger-doc",
  //   // namespace: 'API',
  //   // hook?: {
  //   // customFunctionName?: (() => any)
  //   // customClassName?: (() => any)
  //   mock: false,
  //   projectName: 'egg_ervices',
  //   apiPrefix: 'API_URL_BASE',
  // },
  // mfsu: false
});
