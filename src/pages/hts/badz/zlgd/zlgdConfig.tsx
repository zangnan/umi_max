import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 备案单证 - 资料归档
 */
const zlgdConfig: any = {};

// 配置项
zlgdConfig.module_key = 'CX_BADZ_ZLGD_ZXSB_BADZ_BGD';                            // 业务单元key，对应后端接口
zlgdConfig.page_id = 'CX_BADZ_ZLGD_ZXSB_BADZ_BGD';                          // 页面id
zlgdConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
zlgdConfig.grid_selection_type = "checkbox";                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
zlgdConfig.toolbar_show_grid_checked_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
zlgdConfig.layout_type = 'default';                                  // 页面类型，默认default 可选 default modal tabs tz台账
// zlgdConfig.grid_scroll_x = '1300px';                             // 默认700px
zlgdConfig.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
zlgdConfig.grid_row_key = 'badzbgduuid';

// 配置项：列表列
zlgdConfig.grid_columns = [
  { title: '业务事项', dataIndex: 'lcswsxDm', width: 100, fixed: 'left', codeTable: 'CODE_WM_CS_ZXSB_LCSWSX:01',
    filter: {
      type: 'Radio',
      codeTable: 'CODE_WM_CS_ZXSB_LCSWSX:01',
    } 
  },
  { title: '所属期', dataIndex: 'ssq', width: 80, fixed: 'left', },
  { title: '批次', dataIndex: 'sbpc', width: 80, },
  { title: '出口报关单号/{br}代理出口证明号', dataIndex: 'bgdhgbh', ellipsis: true , width: 180, },
  { title: '单证份数', dataIndex: 'dzfs', width: 90, align: 'right', render: { type: 'number', format: '0,0' } },
  { title: '合同协议号', dataIndex: 'ckhth', width: 180, ellipsis: true },
  { title: '出口发票号', dataIndex: 'ckfphjh', width: 150, render: { func: 'renderBadzCkfph' }, ellipsis: true  },
  { title: '进货凭证号', dataIndex: 'jhpzhjh', width: 200, render: { func: 'renderBadzJhpzh' } , ellipsis: true },
  {
    title: '运输方式', dataIndex: 'ysfsDm', width: 120, codeTable: 'CODE_DM_CKTS_HGYSFS:01', ellipsis: true,
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_CKTS_HGYSFS:01',
    },
  },
  { title: '提运单号', dataIndex: 'tydh', width: 160, ellipsis: true },
]

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
zlgdConfig.filter_items = [
  { name: 'ssq', label: '所属期', type: 'Input' },
  { name: 'sbpc', label: '批次', type: 'Input' },
  { name: 'bgdhgbh', label: '出口报关单号/代理证明号', type: 'Input' },
];

// 配置项：工具栏
zlgdConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};
// 配置项：自定义工具栏
zlgdConfig.customer_toolbar = [
  { name: '资料归档', key: 'dataArchiving', func: 'dataArchiving' },
  { name: '撤销备案', key: 'cancellationOfFiling', func: 'cancellationOfFiling' },
];

// 配置项：自定义操作列
zlgdConfig.handle_columns = [
  { name: '预览', key: 'dzbaZlgdPreview', func: 'dzbaZlgdPreview' },
  { name: '下载', key: 'dzbaZlgdXz', func: 'dzbaZlgdXz' , disabled: 'dzbzZlcjXzDisable'},
];
export default zlgdConfig;
