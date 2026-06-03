/**
 * title: 备案单证 - 单证备案 - 资料采集
 */
const zlcjConfig: any = {};

// 配置项
zlcjConfig.unit_key = 'CX_BADZ_ZXSB_BADZ_BGD';                            // 业务单元key，对应后端接口
zlcjConfig.page_id = 'CX_BADZ_ZXSB_BADZ_BGD';                          // 页面id
zlcjConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
zlcjConfig.grid_selection_type = "checkbox";                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
zlcjConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
zlcjConfig.layout_type = 'default';                                  // 页面类型，默认default 可选 default modal tabs tz台账
zlcjConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
zlcjConfig.grid_scroll_x = '1250px';
zlcjConfig.grid_row_key = 'badzbgduuid';


// 配置项：列表列
zlcjConfig.grid_columns = [
  {
    title: '备案状态', dataIndex: 'dzbaztDm', width: 110, fixed: 'left', render: { func: 'renderBadzBaztZlcj' }, filter: {
      type: 'Radio',
      codeTable: ['CODE_DM_BADZ_BAZT', '01'],
    }
  },
  { title: '业务事项', dataIndex: 'lcswsxDm', width: 100, fixed: 'left', codeTable: ['CODE_WM_CS_ZXSB_LCSWSX', '01'],
    filter: {
      type: 'Radio',
      codeTable: ['CODE_WM_CS_ZXSB_LCSWSX', '01'],
    } 
  },
  // { title: 'badzbgduuid', dataIndex: 'badzbgduuid', width: 150, fixed: 'left', },
  { title: '所属期', dataIndex: 'ssq', width: 80, fixed: 'left', },
  { title: '批次', dataIndex: 'sbpc', width: 80, },
  { title: '出口报关单号/{br}代理出口证明号', dataIndex: 'bgdhgbh', ellipsis: true, width: 180, },
  { title: '合同协议号', dataIndex: 'ckhth', width: 180, ellipsis: true },
  { title: '出口发票号', dataIndex: 'ckfphjh', width: 140, render: { func: 'renderCkfphJhpzh' } , ellipsis: true},
  { title: '进货凭证号', dataIndex: 'jhpzhjh', width: 200, render: { func: 'renderCkfphJhpzh' }, ellipsis: true }, {
    title: '运输方式', dataIndex: 'ysfsDm', width: 120, codeTable: ['CODE_DM_CKTS_HGYSFS', '01'], ellipsis: true,
    filter: {
      type: 'Select',
      codeTable: ['CODE_DM_CKTS_HGYSFS', '01'],
    },
  },
  { title: '提运单号', dataIndex: 'tydh', ellipsis: true, width: 120 },

];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
zlcjConfig.filter_items = [
  { name: 'ssq', label: '所属期', type: 'Input' },
  { name: 'sbpc', label: '批次', type: 'Input' },
  { name: 'bgdhgbh', label: '出口报关单号/代理出口证明号', type: 'Input' },
  { name: 'ckhth', label: '合同协议号', type: 'Input' },
];

// 配置项：工具栏
zlcjConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};
// 配置项：自定义工具栏
zlcjConfig.costomer_toobar = [
  { name: '关联单证', key: 'relatedDocuments', func: 'relatedDocuments' },
  { name: '解除关联', key: 'disassociate', func: 'disassociate' },
  {
    name: '上传单证',
    type: 'dropdown',
    list: [
      { name: '上传导入', func: 'dzbaZlcjImport' },
      { name: '高拍仪', func: 'dzbaZlcjSm' },
      // { name: '二维码', func: 'btnSetHl' },
    ],
  },
  { name: '完成备案', key: 'completeFiling', func: 'completeFiling' },
];

// 配置项：自定义操作列
zlcjConfig.handle_columns = [
  // { name: '编辑', key: 'bianji', },
  { name: '下载', key: 'dzbaZlcjXz', func: 'dzbaZlcjXz', disabled: 'dzbzZlcjXzDisable' },
];
export default zlcjConfig;