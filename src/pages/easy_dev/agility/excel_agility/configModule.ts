import myUtil from '@/components/DDAssist/util';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';

let columns: any;
let api_grid_query: any;
if (ENV_TYPE === 'node') {
  columns = DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE_NODE;
  api_grid_query = `${myUtil.api.getApiRoot()}/ns/base/list/app_module`;
} else {
  columns = myUtil.text.underscoreToCamelArrayValue(DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE, 'field');
  api_grid_query = `${myUtil.api.getApiRoot()}/dict/automatic/exp/retrieveModulePager`;
}

columns.forEach((item: any) => {
  item.width = 'auto';
  item.sort  = true;
});

export default {
  grid_show_serial_number: true,
  api_grid_query: api_grid_query,
  // grid_row_key: 'moduleKey',
  grid_row_key: ENV_TYPE === 'node' ? 'module_key' : 'moduleKey',
  height: 'calc(100vh - 200px)',
  columns: columns,
  editCellTrigger: "click",
  keyboardOptions: {
    copySelected: true,
    pasteValueToCell: true,
    selectAllOnCtrlA: true
  },
  enableLineBreak: true,
  autoWrapText: true,
  dragHeaderMode: 'column', // 可选配置项：'all' | 'none' | 'header' | 'body'，默认为none
  allowFrozenColCount: 3, // 可选做冻结的前几列 默认 0
  frozenColCount: 2, // 初始冻结列数 默认 0
  // rowSeriesNumber: { title: '序号', width: 'auto', headerStyle: {}, style: { bgColor: '#f1f1f1' } }, // 优先级高
  rowSeriesNumber: { title: '序号', width: 'auto', headerStyle: { borderColor: '#7a7a7a', bgColor: '#f1f1f1' }, style: { borderColor: '#7a7a7a', bgColor: '#f1f1f1' } }, // DDListTableUtil.css.bodyStyle }
  heightMode: 'autoHeight', //  standard 标准模式 默认 | adaptive 自适应容器高度模式 |  autoHeight 自动行高模式
  // customCellStyle: [
  //   { id: 'custom-1', style: { bgColor: 'red' } },
  //   { id: 'custom-2', style: { color: 'green' } }
  // ],
  menu:{ contextMenuItems:['向下插入数据', '向下插入空行', '删除该行'], },
};