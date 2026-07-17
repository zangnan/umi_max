/**
 * title: 开票状态跟踪-蓝字发票
 */
import CONSTANTS from '@/components/DDAssist/constants';
import { Button, } from 'antd';

const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'CX_CKFPKJ_FPGL_ZXKP';
unitConfig.page_id = 'CX_CKFPKJ_FPGL_ZXKP';
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.form_save_check = false;
unitConfig.grid_row_key = 'fpsqduuid';
unitConfig.grid_handle_width = 120;
unitConfig.module_type = 'QZ_type';
unitConfig.export_key = 'CX_CKFPKJ_FPGL_ZXKP_FPZTGZ_LP_EXCEL';
unitConfig.gridParams = {
  initSearchModal: [
    { property: 'cxlx', value: "5", op: 'zdy' },
  ],
}

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '报关单号', dataIndex: 'bgdhgbhjh', width: 180, fixed: 'left', ellipsis: { showTitle: false }, render: { func: 'renderFpkjglBgdh' } },
  { title: '单据号', dataIndex: 'djbh', width: 180, fixed: 'left', sorter: true },
  {
    title: '发票状态', dataIndex: 'fpkjztDm', width: 120, codeTable: 'CODE_DM_ZXSB_FPKJZT:03', ellipsis: true, 
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_ZXSB_FPKJZT:03',
    },
  },
  { title: '失败原因', dataIndex: 'sbyy1', width: 180,ellipsis: true },
  { title: '提交开票时间', dataIndex: 'sqfpkjsj', width: 140, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD HH:mm' }, },
  { title: '批次号', dataIndex: 'pch', width: 180, sorter: true },
  { title: '开票金额', dataIndex: 'je', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '税额', dataIndex: 'se', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '备注', dataIndex: 'bz', width: 180, ellipsis: true },
  {
    title: '发票种类', dataIndex: 'fpzlDm1', width: 150, render: { func: 'renderFpkjglFplx' }, filter: {
      type: 'Select',
      list: [
        { text: '增值税电子普通发票', value: '4' },
        { text: '增值税普通发票', value: '3' },
        { text: '数电票（普通发票）', value: '5' },
      ],
    }
  },
  {
    title: '开具方式', dataIndex: 'fpkjfsDm', width: 110, codeTable: 'CODE_DM_ZXSB_FPKJSJLY:01',
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_ZXSB_FPKJSJLY:01',
    },
  },
  { title: '修改标志', dataIndex: 'xgbz', width: 120, codeTable: 'CODE_STATIC_XGBZ_SFBZ:01', hidden: false, filter: { type: 'Select', codeTable: 'CODE_STATIC_XGBZ_SFBZ:01' } },

];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'bgdhgbhjh', label: '18位或后4位报关单号/统一编号', type: 'Input' },
  { name: 'pch', label: '批次号', type: 'Input'},
  { name: 'sqfpkjsj', label: '提交开票时间', type: 'DatePicker', range: true },
  { name: 'sbyy1', label: '失败原因', type: 'Input'},

];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  reload: true,
  full: true,
  download: true,
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '更新状态', func: 'handleUpdateLzLp' }, // 完成
  { name: '重新开票', func: 'handleCxkpLz' }, // 没写
  { name: '发票撤回', func: 'handleFpchLz' }, // 完成
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
unitConfig.grid_filter_quick = [
  {
    name: 'fplx',
    type: 'Select',
    defaultValue: '1',
    eventOnChange: 'handleOnChangeFplx',
    op: 'zdy',
    searchFlag: false,
    searchModelBz: false,
    list: [
      { name: '蓝字发票', value: '1', },
      { name: '红字发票', value: '2' },
      // { name: '作废发票', value: '3' },
    ],
  },
];

unitConfig.handle_columns = [];
export default unitConfig;