const dzglConfig: any = {};

// 配置项
dzglConfig.unit_key = 'CX_BADZ_ZXSB_BADZ_DZXX';
dzglConfig.page_id = 'CX_BADZ_ZXSB_BADZ_DZXX';
dzglConfig.grid_show_serial_number = false;
dzglConfig.form_save_check = false;
dzglConfig.click_checked = '1';
dzglConfig.grid_selection_type = "checkbox";                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
dzglConfig.grid_show_data_num = false;                              // 工具栏左侧是否显示数据条数及选中数，默认true显示
dzglConfig.layout_type = 'default';                                  // 页面类型，默认default 可选 default modal tabs tz台账
dzglConfig.grid_row_key = 'badzuuid';
dzglConfig.grid_scroll_x = '900px';                             // 默认700px

// 配置项：列表列
dzglConfig.grid_columns = [
  { title: '单证名称', dataIndex: 'badzlxmc', width: 180, fixed: 'left', ellipsis: true },
  { title: '单证编号', dataIndex: 'badzbh', width: 160, ellipsis: true },
  { title: '业务编号', dataIndex: 'ywbh', width: 160, ellipsis: true },
  { title: '单证说明', dataIndex: 'badzsm', ellipsis: true },
  { title: '上传时间', dataIndex: 'lrrq', width: 130, render: { type: 'date', format: 'yyyy-MM-DD HH:mm' } },
  { title: '代理出口货物证明标志', dataIndex: 'dlckhwzmbz', hidden: true },
];

// 配置项：列表筛选项
dzglConfig.filter_items = [
  //{ name: 'badzlxDm', label: '单证名称', type: 'TreeSelect', isSelectLeaf: true, showSearch: true, labelInValue: false, treeTable: ['TREE_BADZ_CS_ZXSB_BADZLX_ALL', ''] },
  { name: 'badzlxDm', label: '单证名称', type: 'TreeSelect', isSelectLeaf: true, showSearch: true, labelInValue: false,  },

  { name: 'badzbh', label: '单证编号', type: 'Input' },
  { name: 'ywbh', label: '业务编号', type: 'Input' },
];

// 配置项：工具栏
dzglConfig.toolbar_default = {
  setting: true,
  full: true,
  reload: true
};

// 配置项：自定义工具栏
dzglConfig.costomer_toobar = [
  {
    name: '上传单证',
    type: 'dropdown',
    list: [
      { name: '上传导入', func: 'dzglImport' },
      { name: '高拍仪', func: 'dzglSm' },
    ],
  },
  { name: '删除', func: 'dzglDelete' },
];

// 配置项：自定义操作列
dzglConfig.handle_columns = [
  { name: '下载', func: 'dzglDownload', },
];

export default dzglConfig;
