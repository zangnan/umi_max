export default [
  {
    name: '开发示例', path: '/example', routes: [
      {
        name: '数据封装页面', path: '/example/data_page', key: 'example_data_page', routes: [
          { name: '列表', path: '/example/data_page/list', key: 'example_data_page_list_01', component: './example/data_page/list', },
          { name: '列表2', path: '/example/data_page/list2', key: 'example_data_page_list_02', component: './example/data_page/list', },
          { name: '列表3', path: '/example/data_page/list3', key: 'example_data_page_list_03', component: './example/data_page/list3', },
          { name: '台账', path: '/example/data_page/tz', key: 'example_data_page_tz', component: './example/data_page/tz', },
        ]
      },
      {
        name: '其他', path: '/example/other', routes: [
          { name: '弹窗', path: '/example/other/alert', key: 'example_other_alert', component: './example/other/alert', },
        ]
      },
    ]
  },
];
