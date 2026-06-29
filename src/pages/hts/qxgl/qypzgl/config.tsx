import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 角色管理
 * author: wx
 */
const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'CX_SAAS_QXGL_QYPZGL';
unitConfig.grid_show_serial_number = false; // 是否显示序号，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_row_key = 'sbqyuuidDqlb'; // 列表主键，默认uuid
unitConfig.form_save_check = false; // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '400px';
unitConfig.module_type = 'sjbb';


// 配置项：列表列
unitConfig.grid_columns = [
  { title: '企业名称', dataIndex: 'nsrmcDqlb', width: 160, ellipsis: true },
  { title: '海关企业代码', dataIndex: 'hgqyDmDqlb', width: 120 },
  { title: '纳税人识别号', dataIndex: 'nsrsbhDqlb', width: 180, ellipsis: true  },
  { title: '社会信用代码', dataIndex: 'shxydmDqlb', width: 180, ellipsis: true  },
  { title: '企业类型', dataIndex: 'cktsqylxDmDqlb', width: 140, codeTable: 'code_dm_rd_cktsqylx:01' , filter: {
    type: 'Select',
    codeTable: 'code_dm_rd_cktsqylx:01',
  } },
  { title: '所属地区', dataIndex: 'swname', width: 120, ellipsis: true  },
  { title: '企业来源', dataIndex: 'qdDm', width: 140, codeTable: 'CODE_QX_QD:01'},
  { title: '录入人', dataIndex: 'xm', width: 120, ellipsis: true  },
];


// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'nsrmcDqlb', label: '企业名称', type: 'Input' },
  { name: 'hgqyDmDqlb', label: '海关企业代码', type: 'Input' },
  { name: 'nsrsbhDqlb', label: '纳税人识别号', type: 'Input' },
  { name: 'shxydmDqlb', label: '社会信用代码', type: 'Input' },
  { label: '企业来源', name: 'qdDm',  type: 'Select', codeTable: 'CODE_QX_QD:03' },
];


// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  full: true,
  reload: true,
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  // { name: '导出字典', key: 'addqxz42', func: 'exportZd'},
  { name: '配置', key: 'pz', func: 'pz'},
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  // { name: '详细', func: 'editBd', disabled: 'xiangxixinx'},
  { name: '详细', func: 'ckxx'},
];


export default unitConfig;
