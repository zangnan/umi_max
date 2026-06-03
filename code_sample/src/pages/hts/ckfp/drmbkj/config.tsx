const drmbkjConfig: any = {};

// 配置项
drmbkjConfig.unit_key = 'FPZS_DRMBKP_PAGER';
drmbkjConfig.page_id = 'ckfp_drmbkj';
drmbkjConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
drmbkjConfig.grid_row_key = 'zbuuid';                                                     // 列表主键，默认uuid
drmbkjConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
drmbkjConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选

// 配置项：列表列
drmbkjConfig.grid_columns = [
  { title: 'zbuuid', dataIndex: 'zbuuid', hidden: true },
  { title: '单据号', dataIndex: 'djbh', width: 200, fixed: 'left', sorter: true, render: { func: 'renderDjh' } },
  { title: '自编号', dataIndex: 'qynbbh', width: 180, fixed: 'left', sorter: true, ellipsis: true },
  { title: '购买方名称', dataIndex: 'ghfnsrmc', width: 200, fixed: 'left', ellipsis: true },
  { title: '社会信用代码', dataIndex: 'ghfnsrsbh', width: 150, ellipsis: true },
  { title: '开户银行', dataIndex: 'ghfkhyxmc', width: 150, ellipsis: true },
  { title: '银行账号', dataIndex: 'ghfyhzh', width: 130, ellipsis: true },
  { title: '购买方地址', dataIndex: 'ghfdz', width: 150, ellipsis: true },
  { title: '购买方电话', dataIndex: 'ghflxdh', width: 120, ellipsis: true },
  { title: '备注', dataIndex: 'bz', width: 200, ellipsis: true },
  { title: '复核人', dataIndex: 'fhrxm', width: 120, ellipsis: true },
  { title: '收款人', dataIndex: 'skr', width: 120, ellipsis: true },
  { title: '录入时间', dataIndex: 'lrsj', width: 150, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD HH:mm' } },
  {
    title: '数据类型', dataIndex: 'pzsjlyDm', width: 100, render: { func: 'renderSjlx' }, filter: {
      type: 'Select',
      list: [
        { text: '人工采集', value: '1' },
        { text: '外部导入', value: '2' },
      ],
    }
  },
];

// 配置项：列表筛选项
drmbkjConfig.grid_filter_quick = [
  { name: 'drsj', label: '导入时间', type: 'DatePicker', range: true },
  { name: 'ghfnsrmc', label: '购买方名称', type: 'Input', searchButton: true },
];

// 配置项：工具栏
drmbkjConfig.toolbar_default = {
  setting: true,
  full: true,
  reload: true
};

// 配置项：自定义工具栏
drmbkjConfig.costomer_toobar = [
  { name: '导入', func: 'excelImport' },
  { name: '确认开票', func: 'qrdrsj' },
  { name: '录入', func: 'sdcjkj' },
  { name: '删除', func: 'deleteFpsqd' },
];

export default drmbkjConfig;