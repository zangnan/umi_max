import CONSTANTS from '@/components/DDAssist/constants';

/**
 * title: 付汇人管理
 */
const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'PZGL_WSGL_WSFHPZGL_FHRCX';
unitConfig.api_form_delete = `/yw/pzgl/wsgl/wsfhgxgl/wsfhgxFhrsc`;
unitConfig.grid_show_serial_number = false; // 是否显示序号，可选
unitConfig.grid_row_key = 'fhruuid'; // 列表主键，默认uuid
unitConfig.form_save_check = false; // 表单编辑是否执行后端校验
unitConfig.grid_click_checked = '1';
unitConfig.batch_delete_key = 'fhruuid';
unitConfig.grid_scroll_x = '900px';   // 默认700px
unitConfig.export_key1='PZGL_WSGL_WSFHPZGL_FHRCX_EXCEL';
unitConfig.import_download_template = true; // 导入的模板下载 调用downloadTemplate
unitConfig.import_key = 'SAAS_PZGL_WSGL_WSFHPZGL_FHRCX_DR';
unitConfig.import_style = '2';


const fxTitleTooltip = '作为收汇水单与报关单匹配的关键逻辑：{br}'+
'1. 合同收汇：根据报关单合同号与收汇水单关联的业务号进行匹配；{br}'+
'2. 关单收汇：根据报关单号与收汇水单关联的业务号进行匹配；{br}'+
'3. 滚动收汇：根据相同境外收货人的报关单按出口日期顺序滚动匹配。';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: 'fhruuid', dataIndex: 'fhruuid', hidden: true },
  { title: '付汇人', dataIndex: 'fhr', width: 140, ellipsis: true , fixed: 'left'},
  { title: '付汇人别名', dataIndex: 'fhrbm', width: 140, ellipsis: true , fixed: 'left'},
  { title: '付汇方式', dataIndex: 'shgzDm', width: 140, ellipsis: true , fixed: 'left',titleTooltip:fxTitleTooltip,codeTable: 'CODE_DM_ZXSB_SHGZ:01', },
  { title: '匹配币制', dataIndex: 'ppbzDm', width: 140, ellipsis: true , fixed: 'left',codeTable: 'CODE_DM_ZXSB_PPBZ:01', },
  { title: '关联境外收货人数', dataIndex: 'gljwshrs', width: 140, ellipsis: true,render:{func: 'renderGljwshrs'} },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'fhr', label: '付汇人', type: 'Input' },
  { name: 'fhrbm', label: '付汇人别名', type: 'Input' },
  { name: 'shgzDm', label: '付汇方式', type: 'Select', codeTable: 'CODE_DM_ZXSB_SHGZ:01' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  full: true,
  reload: false,
  delete: false,
  upload:true,
  showType: true,
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  // { name: '绑定角色', func: 'bdjs' },
  { name: '新建', func: 'addFhr' },
  { name: '关联境外收货人', func: 'gljwshr' },
  { name: '修改', func: 'editFhr' },
  { name: '删除', func: 'del' },
];

unitConfig.handle_columns = [];
export default unitConfig;
