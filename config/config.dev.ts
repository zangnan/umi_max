import { defineConfig } from '@umijs/max';

export default defineConfig({
  define: {
    // API_URL_EXAMPLE: '', // 示例mock数据
    // API_URL_BASE: '', // mock数据
    // LOCAL_MENU: true, // 是否采用本地菜单

    // 正式库 联调环境  v0.2
    // API_URL_BASE: 'http://192.168.0.193:18088',  // 正式库 联调环境  v0.2
    // LOCAL_MENU: false, // 是否采用本地菜单
    // ACCESS_CLIENT_ID: 'access_test', // 是否采用本地菜单
    // EXAMPLE_MENU_SHOW: true, // 是否显示示例菜单 后端菜单下生效

    // 内部管理系统 测试库 v0.2
    // API_URL_BASE: 'http://192.168.0.195:18099',  // 正式库 联调环境  v0.2
    // LOCAL_MENU: false, // 是否采用本地菜单
    // ACCESS_CLIENT_ID: 'access_test', // 是否采用本地菜单
    // EXAMPLE_MENU_SHOW: true, // 是否显示示例菜单 后端菜单下生效
    // SYS_TITLE: '内部管理系统T',

    // 内部管理系统 正式库 v0.2
    // API_URL_BASE: 'http://192.168.0.193:18066',  // 正式库 联调环境  v0.2
    // LOCAL_MENU: false, // 是否采用本地菜单
    // ACCESS_CLIENT_ID: 'dditSaas', // 是否采用本地菜单
    // EXAMPLE_MENU_SHOW: true, // 是否显示示例菜单 后端菜单下生效

    // jww
    // API_URL_BASE: 'http://192.168.21.3:18088',  // 测试库 jww 联调环境
    // LOCAL_MENU: false, // 是否采用本地菜单
    // ACCESS_CLIENT_ID: 'dditSaas', // 是否采用本地菜单
    // EXAMPLE_MENU_SHOW: true, // 是否显示示例菜单 后端菜单下生效

    // jww nbglxt
    // API_URL_BASE: 'http://192.168.21.3:18099',  // 测试库 jww 联调环境
    // LOCAL_MENU: false, // 是否采用本地菜单
    // ACCESS_CLIENT_ID: 'dditSaas', // 是否采用本地菜单
    // EXAMPLE_MENU_SHOW: true, // 是否显示示例菜单 后端菜单下生效

    // node env local
    // API_URL_BASE_NODE: 'http://127.0.0.1:7001', // node env
    // API_URL_BASE: 'http://127.0.0.1:7001', // node env
    // LOCAL_MENU: false, // 是否采用本地菜单
    // ENV_TYPE: 'node', // 后端环境类型
    // EXAMPLE_MENU_SHOW: true, // 是否显示示例菜单 后端菜单下生效

    // node env 21.5
    API_URL_BASE_NODE: 'http://192.168.21.5:7001', // node env
    API_URL_BASE: 'http://192.168.21.5:7001', // node env
    LOCAL_MENU: false, // 是否采用本地菜单
    ENV_TYPE: 'node', // 后端环境类型
    EXAMPLE_MENU_SHOW: true, // 是否显示示例菜单 后端菜单下生效

    // 正式库 联调环境  v0.1
    // API_URL_BASE: 'http://192.168.0.194:18088',  // 正式库 联调环境  v0.1
  },
  // plugins: [
  //   // https://github.com/zthxxx/react-dev-inspector
  //   'react-dev-inspector/plugins/umi/react-inspector',
  // ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  // inspectorConfig: {
  //   exclude: [],
  //   babelPlugins: [],
  //   babelOptions: {},
  // },
});
