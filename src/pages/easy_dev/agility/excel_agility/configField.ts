import myUtil from '@/components/DDAssist/util';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import CONSTANTS from '@/components/DDAssist/constants';

let columns: any;
let api_grid_query: any;
if (ENV_TYPE === 'node') {
  columns = DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD_NODE;
  api_grid_query = `${myUtil.api.getApiRoot()}/ns/base/list/app_module_field`;
  // columns = columns.filter((item: any) => item.field !== 'dictFieldType'
  //   && item.field !== 'dictFieldExpr'
  //   && item.field !== 'dictFieldDefaultValue'
  //   && item.field !== 'dictFieldKey'
  //   && item.field !== 'dictFieldFilter'
  //   && item.field !== 'dictFieldNameRel'
  //   && item.field !== 'dictFieldNotNull');
  // columns.unshift({ dataIndex: 'dictName', field: 'dictName', title: '数据字典名称', style: { bgColor: '#f1f1f1' }});
  // columns.unshift({ dataIndex: 'dictNameDesc', field: 'dictNameDesc', title: '数据字典说明', style: { bgColor: '#f1f1f1' }});
  columns.forEach((item: any) => {
    item.width = 'auto';
    item.sort  = true;
    // if (item.field === 'dictFieldNameMain') {
    //   item.field = 'dictFieldName';
    //   item.dataIndex = 'dictFieldName';
    //   item.title = '字段';
    // }
  });
} else {
  columns = myUtil.text.underscoreToCamelArrayValue(DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD, 'field');
  api_grid_query = `${myUtil.api.getApiRoot()}/dict/automatic/exp/retrieveDictPager`;
  // columns = columns.filter((item: any) => item.field !== 'dictFieldType'
  //   && item.field !== 'dictFieldExpr'
  //   && item.field !== 'dictFieldDefaultValue'
  //   && item.field !== 'dictFieldKey'
  //   && item.field !== 'dictFieldFilter'
  //   && item.field !== 'dictFieldNameRel'
  //   && item.field !== 'dictFieldNotNull');
  // columns.unshift({ dataIndex: 'dictName', field: 'dictName', title: '数据字典名称', style: { bgColor: '#f1f1f1' }});
  // columns.unshift({ dataIndex: 'dictNameDesc', field: 'dictNameDesc', title: '数据字典说明', style: { bgColor: '#f1f1f1' }});
  columns.unshift({ dataIndex: 'dictName', field: 'dictName', title: '数据字典名称', editor: 'input-editor', flag: 'field'  });
  columns.unshift({ dataIndex: 'dictNameDesc', field: 'dictNameDesc', title: '数据字典说明', editor: 'input-editor', flag: 'field'  });
  columns.forEach((item: any) => {
    item.width = 'auto';
    item.sort  = true;
    if (item.field === 'dictFieldNameMain') {
      item.field = 'dictFieldName';
      item.dataIndex = 'dictFieldName';
      item.title = '字段';
    }
  });
}

export default {
  grid_show_serial_number: true,
  api_grid_query: api_grid_query,
  // grid_row_key: 'dictFieldId',
  grid_row_key: ENV_TYPE === 'node' ? 'dict_field_id' : 'dictFieldId',
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
  allowFrozenColCount: ENV_TYPE === 'node' ? 4 : 8, // 可选做冻结的前几列 默认 0
  frozenColCount: ENV_TYPE === 'node' ? 4 : 7, // 初始冻结列数 默认 0
  rowSeriesNumber: { title: '序号', width: 'auto', headerStyle: { borderColor: '#7a7a7a', bgColor: '#f1f1f1' }, style: { borderColor: '#7a7a7a', bgColor: '#f1f1f1' } }, // DDListTableUtil.css.bodyStyle }
  // heightMode: 'autoHeight', //  standard 标准模式 默认 | adaptive 自适应容器高度模式 |  autoHeight 自动行高模式
  heightMode: 'standard', //  standard 标准模式 默认 | adaptive 自适应容器高度模式 |  autoHeight 自动行高模式
  menu:{ contextMenuItems:['向下插入数据', '向下插入空行', '删除该行'], },
  gridParams: ENV_TYPE === 'node' ? {} : {
    initSearchModal: [
      { property: 'tableType', value: "物理表", op: CONSTANTS.FILTER_CONDITION.include.condetionCode, type: "1" },
      { property: 'tableManagered', value: '3', op: CONSTANTS.FILTER_CONDITION.equal.condetionCode, type: "1" },
    ],
  },
};