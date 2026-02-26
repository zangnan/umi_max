import routesEasyDev from './routes/routes.easyDev';
import routesEasyDevDc from './routes/routes.easyDevDc';
import routesExample from './routes/routes.example';

let routes: any = [
  { path: '/user', layout: false, routes: [
    { name: 'login', path: '/user/login', component: './User/Login' },
    { name: 'transition', path: '/user/transition', component: './Transition' }
  ]},
  { path: '/ai', layout: false, routes: [
    { name: 'xcn', path: '/ai/x-cn', component: './example/ai/deepseek01' },
    { name: 'x', path: '/ai/x', component: './example/ai/deepseek01' },
    { name: 'temp', path: '/ai/temp', component: './example/ai/aitheme' },
  ]},
  // { path: '/', redirect: '/easy_dev/agility/app_build' },
  // { path: '/', redirect: '/sys/user_setting' },
  { path: '/home', component: './Home' },
  { path: '/', redirect: '/Home' },
  { path: '/UtilDoc', layout: false, component: './UtilDoc' },
  { path: '/splc/cfgp/nbgl_process_def/flow_edit', component: './common/flow_edit' },
  { path: '/system/splc/cfgp/nbgl_process_def/flow_edit', redirect: '/splc/cfgp/nbgl_process_def/flow_edit' },
  { path: '/*', component: '@/pages/404' },
  { name: '媒体播放', layout: false, path: '/player', component: './example/media/player01' },
  { name: '主题自定义', path: '/skin_setting_customer', component: './easy_dev/sys/sys_theme/skin_setting_customer' },
  // { name: '接口页面tsjh_tssb', path: '/cfgp/test_app_mts_tsjh_tssb', component: './common/automatic_page', icon: 'ProfileOutlined'},
  // { name: '接口页面tssb', path: '/cfgp/test_app_mts_tssb', component: './common/automatic_page', icon: 'ProfileOutlined'},
  // { name: '接口页面tsjh', path: '/cfgp/test_app_mts_tsjh', component: './common/automatic_page', icon: 'ProfileOutlined'},
  // {
  //   path: '/app1',
  //   component: '@/layouts/app-layout.tsx',
  //   routes: [
  //     // 配置微应用 app1 关联的路由
  //     {
  //       // 带上 * 通配符意味着将 /app1/project 下所有子路由都关联给微应用 app1
  //       path: '/project/*',
  //       microApp: 'app1',
  //     },
  //   ],
  // },
  // 配置 app2 关联的路由
  // {
  //   path: '/app2/*',
  //   microApp: 'app2',
  // },
];

// routes = process.env.NODE_ENV !== 'production' ? routesExample.concat(routes) : [].concat(routes);
routes = routesExample.concat(routes);
routes = routesEasyDev.concat(routes);
routes = routesEasyDevDc.concat(routes);

export default routes;
