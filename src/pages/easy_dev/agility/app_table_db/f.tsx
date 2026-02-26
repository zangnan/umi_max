import React from 'react';
import { message } from 'antd';
import { retrieveTablePager, retrieveDictPager } from '@/services/hts/api';
import myUtil from '@/components/DDAssist/util';
import CONSTANTS from '@/components/DDAssist/constants';
import { cloneDeep } from 'lodash';
import { groupBy } from 'lodash';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import excelUtil from '@/components/DDAssist/util/excelUtil';
import DDBunit2ADBUtil from '@/components/DDBunit/DDBunit2ADBUtil';

const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;
const toCamel = myUtil.text.underscoreToCamel;

const Func: any = {
  refUnit: React.createRef(),
};

// 导出物理表
Func.objectExport = (param: any) => {
  const { refUnit, refGrid, selectionRows, record } = param;
  let exportTable: any = [];
  let exportColumnsWithFields: any = [];
  const gridParams = refUnit.current?.getGridParams();
  const gridPagination = refGrid.current?.getPagination();
  const otherRef = refUnit.current?.getOtherRefs();
  const templateExport = (gridData: any, dictObjectDesc?: any) => {
    let excelName = `物理表_${dictObjectDesc ? dictObjectDesc + '_' : ''}${myUtil.date.formatDate(new Date(), 'YYYYMMDD.hhmmss')}.xlsx`;
    // 格式化数据
    gridData.forEach((item: any) => {
      item.dictFieldKey = item.dictFieldKey || '';
      item.dictFieldDefaultValue = item?.dictFieldDefaultValue || '';
      item.dictFieldNotNull = item?.dictFieldNotNull || '';
    })
    otherRef[0].current?.showModal({
      gridData: gridData,
      sheetName: '物理表',
      excelName,
      param,
    });
  };


  let aaa = Func.initSearchModal || [];
  let bbb = [ ...aaa, ...(gridParams?.searchModel || [])];

  // 行内导出
  if (record) {
    // debugger
    exportColumnsWithFields.push({
      excelRowType: 'title',
      title: `${record?.tableDesc} ${record?.tableName}` || '',
    });

    // let aaa = Func.initSearchModal || [];
    // let aaa = [
    //   // { property: 'tableManagered', value: "2", op: CONSTANTS.FILTER_CONDITION.equal.condetionCode, type: "1" }
    //   // { type: 4, property: 'tableManagered', value: '2', op: CONSTANTS.FILTER_CONDITION.equal.condetionCode}
    //   // {type: 1, property: "dictName", value: "aaaa", op: "eq"},
    //   {type: 4, property: "tableManagered", value: "2", op: "eq"},
    // ];
    // let bbb = [ ...aaa, ...(gridParams?.searchModel || [])];
    // let bbb = aaa;

    // retrieveDictPager({page: 1, pageSize: 999999, searchModel: gridParams?.searchModel || []}).then((response2: any) => {
    retrieveDictPager({page: 1, pageSize: 999999, searchModel: bbb}).then((response2: any) => {
      let gridData: any = [];
      if (response2?.code === '200' && response2?.body?.rowCount > 0) {
        gridData = response2.body.rows || [];
        const groupedFieldsByDict: any = groupBy(gridData, 'dictName') || [];
        let targetFields = groupedFieldsByDict[record.dictName];
        targetFields.forEach((item2: any) => {
          if (item2.dictFieldName) {
            exportColumnsWithFields.push({
              ...record,
              ...item2,
            });
          }
        })
        templateExport(exportColumnsWithFields);
      }
    })
    return;
  }
  // 勾选导出
  if (selectionRows?.length > 0) {
    // retrieveDictPager({page: 1, pageSize: 999999, searchModel: gridParams?.searchModel || []}).then((response2: any) => {
    retrieveDictPager({page: 1, pageSize: 999999, searchModel: bbb }).then((response2: any) => {
      let gridData: any = [];
      if (response2?.code === '200' && response2?.body?.rowCount > 0) {
        gridData = response2.body.rows || [];
        const groupedFieldsByDict: any = groupBy(gridData, 'dictName') || [];
        selectionRows.forEach((item: any) => {
          let targetFields = groupedFieldsByDict[item.dictName];
          exportColumnsWithFields.push({
            excelRowType: 'title',
            title: `${item?.tableDesc} ${item?.tableName}` || '',
          });
          targetFields.forEach((item2: any) => {
            if (item2.dictFieldName) {
              exportColumnsWithFields.push({
                ...item,
                ...item2,
              });
            }
          })
        })
        templateExport(exportColumnsWithFields);
      }
    })
    return;
  }
  // 筛选条件导出
  let numImport = 5000;
  if (gridPagination?.total > numImport) {
    message.info(`仅支持导出${numImport}条数据，请完成数据筛选后进行导出。`);
    return;
  }
  refUnit.current?.setMasker(true);
  exportTable = [];
  exportColumnsWithFields = [];
  // let param1 = {page: 1, pageSize: 999999, searchModel: gridParams?.searchModel || []};
  let param1 = {page: 1, pageSize: 999999, searchModel: bbb };
  retrieveTablePager(param1).then((response: any) => {
    refUnit.current?.setMasker(false);
    if (response?.code === '200' && response?.body?.rowCount > 0) {
      exportTable = response.body.rows;
    }
    return retrieveDictPager(param1);
  }).then((response2: any) => {
    let gridData: any = [];
    if (response2?.code === '200' && response2?.body?.rowCount > 0) {
      gridData = response2.body.rows || [];
      const groupedFieldsByDict: any = groupBy(gridData, 'dictName') || [];
      exportTable.forEach((item: any) => { // 遍历所有表
        exportColumnsWithFields.push({
          excelRowType: 'title',
          title: `${item?.tableDesc} ${item?.tableName}` || '',
        });
        let targetFields = groupedFieldsByDict[item.dictName];
        targetFields.forEach((item2: any) => {
          if (item2.dictFieldName) {
            exportColumnsWithFields.push({
              ...item,
              ...item2,
            });
          }
        })
      })
      templateExport(exportColumnsWithFields);
    }
  })
}

// 获取模板名称
const getTemplateName = ({tableDesc, tableName}: any) => {
  let tplDictDesc = `模板_${tableDesc || ''}`; // 数据字典含义
  let tplDictName = `s_tpl_${tableName || ''}`; // 数据字典
  let tplTableName = `${tableName || ''}`; // 物理表名称
  let tplTableDesc = `${tableDesc || ''}`; // 物理表名称
  let tplViewAlias = `a_tpl_${tableName || ''}`; // 逻辑名
  let tplRowTitle = `${tplDictDesc} ${tplDictName}` || '';
  let tplModuleKey = `m_tpl_${tableName}` || ''; // 模块key
  let tplModuleName = `模板_${tableDesc}` || ''; // 模块名
  let excelName = `数据视图模板_${tableDesc ? tableDesc + '_' : ''}${myUtil.date.formatDate(new Date(), 'YYYYMMDD.hhmmss')}.xlsx`;
  return {
    tplDictDesc,
    tplDictName,
    tplRowTitle,
    tplTableName,
    tplTableDesc,
    tplViewAlias,
    tplModuleKey,
    tplModuleName,
    excelName,
  }
}

// sheet 模板数据 模块
const getSheetDataModule = (rows: any) => {
  let newRows: any = [];
  let defaultValueSheetDataMoudle: any = {};
  DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE.forEach((row: any) => {
    defaultValueSheetDataMoudle[row.dataIndex] = row.defaultValue;
  });
  rows.forEach((item: any) => {
    let newRowItem = { ... defaultValueSheetDataMoudle };
    newRowItem[CKEY.MODULE_KEY] = getTemplateName({tableDesc: item.tableDesc, tableName: item.tableName}).tplModuleKey;
    newRowItem[CKEY.MODULE_NAME] = getTemplateName({tableDesc: item.tableDesc, tableName: item.tableName}).tplModuleName;
    newRowItem[CKEY.DICT_NAME] = getTemplateName({tableDesc: item.tableDesc, tableName: item.tableName}).tplDictName;
    newRows.push({
      ...newRowItem,
    });
  })
  return newRows;
}

// sheet 模板数据 表管理
const getSheetDataDictTable = (rows: any) => {
  let newRows: any = [];
  let defaultValueSheetDataDictTable: any = {};
  DDIT_TOOL_CONSTANTS.SHEET_CONFIG_DICT_TABLE.forEach((row: any) => {
    defaultValueSheetDataDictTable[row.dataIndex] = row.defaultValue;
  });
  rows.forEach((item: any) => {
    let tplDictDesc = getTemplateName({tableDesc: item[toCamel(CKEY.TABLE_DESC)], tableName: item[toCamel(CKEY.TABLE_NAME)]}).tplDictDesc;
    let tplDictName = getTemplateName({tableDesc: item[toCamel(CKEY.TABLE_DESC)], tableName: item[toCamel(CKEY.TABLE_NAME)]}).tplDictName;
    let tplTableName = getTemplateName({tableDesc: item[toCamel(CKEY.TABLE_DESC)], tableName: item[toCamel(CKEY.TABLE_NAME)]}).tplTableName;
    let tplTableDesc = getTemplateName({tableDesc: item[toCamel(CKEY.TABLE_DESC)], tableName: item[toCamel(CKEY.TABLE_NAME)]}).tplTableDesc;
    let tplViewAlias = getTemplateName({tableDesc: item[toCamel(CKEY.TABLE_DESC)], tableName: item[toCamel(CKEY.TABLE_NAME)]}).tplViewAlias;
    let newRowItem = { ... defaultValueSheetDataDictTable };
    newRowItem[CKEY.TABLE_NAME] = tplTableName;
    newRowItem[CKEY.TABLE_DESC] = tplTableDesc;
    newRowItem[CKEY.DICT_NAME] = tplDictName;
    newRowItem[CKEY.DICT_DESC] = tplDictDesc;
    newRowItem[CKEY.TABLE_ALIAS] = tplViewAlias;
    newRowItem[CKEY.TABLE_TYPE] = Func?.tabFlag === '2' ? '物理表_外部' : '虚拟表';
    newRowItem[CKEY.DB_SOURCE_ID] = item[toCamel(CKEY.DB_SOURCE_ID)] || '';
    newRowItem[CKEY.DB_ORDER] = item[toCamel(CKEY.DB_ORDER)] || '';
    newRowItem[CKEY.DB_BACK_NAME] = item[toCamel(CKEY.DB_BACK_NAME)] || '';
    newRowItem[CKEY.DB_BACK_GROUP] = item[toCamel(CKEY.DB_BACK_GROUP)] || '';
    newRowItem[CKEY.DB_CLEAN_FLAG] = '0';
    newRows.push({
      ...newRowItem,
    });
  })
  return newRows;
}

// sheet 模板数据 字典构建
const getSheetDataField = (rows: any) => {
  // let dictAppCodeConfig = myUtil.code.getCode('dict_code_config') || [];
  let newRows: any = [];
  let defaultValueSheetDataField: any = {};
  DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD.forEach((row: any) => {
    defaultValueSheetDataField[row.dataIndex] = row.defaultValue;
  });
  rows.forEach((item: any) => {
    let itemNew: any = { ...defaultValueSheetDataField };
    if (item.excelRowType === 'title') {
      newRows.push({
        ...item,
      });
    } else {
      let grid_align = '';
      let grid_render = '';
      let grid_width = 100;
      let grid_ellipsis: any = '';
      let grid_hidden: any = '';
      let grid_key = '';
      let form_item_type = 'Input';
      let form_item_format = '';
      let form_item_rule = '';
      // 需要根据类别处理的字段
      if (DDBunit2ADBUtil.isNumberType({ dictFieldType: item?.dictFieldType})) {
        grid_align = 'R';
        grid_width = 140;
        form_item_type = 'InputNumber';
        form_item_format = '0,0';
        let cc = DDBunit2ADBUtil.getNumberFormat({ dictFieldType: item?.dictFieldType}) || '0,0';
        grid_render = cc;
        form_item_format = cc;
      } else if (DDBunit2ADBUtil.isDateType({ dictFieldType: item?.dictFieldType})) {
        grid_render = 'YYYY-MM-DD';
        grid_width = 150;
        form_item_type = 'DatePicker';
        form_item_format = 'YYYY-MM-DD';
      } else {
        if (DDBunit2ADBUtil.isFieldValLenUnknown({ dictFieldDesc: item?.dictFieldDesc})) {
          grid_width = 180;
          grid_ellipsis = '1';
        }
      }
      // 需要根据主键处理的字段
      if (DDBunit2ADBUtil.isDictKey2({ fieldObj: item })) {
        grid_hidden = '1';
        form_item_type = 'Hidden';
        grid_key = '1';
      }
      // 表单校验规则
      form_item_rule = DDBunit2ADBUtil.getFieldDefaultRules({ fieldObj: item }).excelStr;
      itemNew[CKEY.DICT_FIELD_NAME_MAIN] = item.dictFieldName;
      itemNew[CKEY.DICT_FIELD_DESC] = item.dictFieldDesc;
      itemNew[CKEY.DICT_FIELD_TYPE] = item.dictFieldType;
      itemNew[CKEY.DICT_FIELD_KEY] = item.dictFieldKey || '';
      itemNew[CKEY.DICT_FIELD_DEFAULT_VALUE] = item.dictFieldDefaultValue || '';
      itemNew[CKEY.DICT_FIELD_NOT_NULL] = item.dictFieldNotNull || '';
      itemNew[CKEY.DICT_FIELD_EXPR] = item.dictFieldExpr || '';
      itemNew[CKEY.DICT_FIELD_FILTER] = item.dictFieldFilter || '';
      itemNew[CKEY.GRID_HIDDEN] = grid_hidden;
      itemNew[CKEY.GRID_KEY] = grid_key;
      itemNew[CKEY.GRID_ALIGN] = grid_align;
      itemNew[CKEY.GRID_RENDER] = grid_render;
      itemNew[CKEY.GRID_WIDTH] = grid_width;
      itemNew[CKEY.GRID_ELLIPSIS] = grid_ellipsis;
      itemNew[CKEY.FORM_ITEM_TYPE] = form_item_type;
      itemNew[CKEY.FORM_ITEM_FORMAT] = form_item_format;
      itemNew[CKEY.FORM_ITEM_RULE] = form_item_rule;
      // 增加码表配置行，表单，筛选
      // 列表通过增加额外一行展示
      // for (let i=0; i<dictAppCodeConfig.length; i++) {
      //   if (dictAppCodeConfig[i]?.dictFieldNameForId?.toLowerCase() === item?.dictFieldName?.toLowerCase()) {
      //     grid_render = dictAppCodeConfig[i]?.code;
      //     item.formItemParam = grid_render;
      //     item.filterExtend = grid_render;
      //     item.formItemType = 'select';
      //     item.filter = 'select';
      //     break;
      //   }
      // }
      newRows.push(itemNew);
      // 增加码表配置行，列表
      // for (let i=0; i<dictAppCodeConfig.length; i++) {
      //   if (dictAppCodeConfig[i]?.dictFieldNameForId?.toLowerCase() === item?.dictFieldName?.toLowerCase()) {
      //     grid_render = dictAppCodeConfig[i]?.code;
      //     item.format = grid_render;
      //     item.title = item.title + '名称';
      //     item.dataIndex = item.dataIndex + 'DESC';
      //     newRows.push({
      //       ...cloneDeep(item),
      //     });
      //     break;
      //   }
      // }
    }
  });
  // 绑定第一个表单录入项作为筛选项，作为默认筛选
  for (let i = 0; i < newRows.length; i++) {
    if (newRows[i].excelRowType === 'title') {
      for (let m = i + 1; m < newRows.length; m++) {
        if (newRows[m].excelRowType === 'title') {
          break;
        }
        if (newRows[m].form_item_type && newRows[m].form_item_type !== 'Hidden') {
          newRows[m][CKEY.FILTER_ITEM_TYPE] = newRows[m].form_item_type;
          break;
        }
      }
    }
  }
  return newRows;
};

// sheet 模板数据 菜单构建
const getSheetDataMenu = (rows: any) => {
  let newRows: any = [];
  let defaultValueSheetDataDictTable: any = {};
  DDIT_TOOL_CONSTANTS.SHEET_MENU.forEach((row: any) => {
    defaultValueSheetDataDictTable[row.dataIndex] = row.defaultValue;
  });
  rows.forEach((item: any, index: any) => {
    let tplModuleKey = getTemplateName({tableDesc: item.tableDesc, tableName: item.tableName}).tplModuleKey;
    let tplModuleName = getTemplateName({tableDesc: item.tableDesc, tableName: item.tableName}).tplModuleName;
    let newRowItem = {
      ... defaultValueSheetDataDictTable,
      menu_id: index + 1,
      menu_name: tplModuleName,
      menu_path: `/tpl/cfgp/${tplModuleKey}`,
      colSpan: [1, 5],
    };
    newRows.push({
      ...newRowItem,
    });
  })
  // debugger;
  return newRows;
}

// 导出数据视图模板
Func.viewTemplateExportModal = async (param: any) => {
  let { refUnit, selectionRows, record, refGrid } = param;
  const gridParams = refUnit.current?.getGridParams();
  const searchModel = gridParams?.searchModel || [];

  let aaa: any = Func.initSearchModal || [];
  let bbb = [ ...aaa, ...(gridParams?.searchModel || [])];

  if (record) { // 行内点击导出
    selectionRows = [record];
  } else if (selectionRows.length > 0) {

  } else if (searchModel.length >= 0) { // 筛选条件导出
    let numImport = 5000;
    const gridPagination = refGrid.current?.getPagination();
    if (gridPagination?.total > numImport) {
      message.info(`仅支持导出${numImport}条数据，请完成数据筛选后进行导出。`);
      return;
    }
    refUnit.current?.setMasker(true);
    // let searchModalTmp = [{ property: 'tableType', value: "物理表", op: CONSTANTS.FILTER_CONDITION.include.condetionCode, type: '1' }];
    let searchModalTmp: any = Func.initSearchModal || [];
    if (gridParams?.searchModel) {
      searchModalTmp = [...searchModalTmp, ...gridParams?.searchModel]
    }
    let param1 = {page: 1, pageSize: 999999, searchModel: searchModalTmp};
    const aaa: any = await retrieveTablePager(param1);
    refUnit.current?.setMasker(false);
    if (aaa?.code === '200' && aaa?.body?.rowCount > 0) {
      selectionRows = aaa?.body?.rows;
    }
  }
  if (selectionRows?.length > 0) {
    let sheetDataModule = getSheetDataModule(selectionRows);
    let sheetDataMenu = getSheetDataMenu(selectionRows);
    let sheetDataDictTable = getSheetDataDictTable(selectionRows);
    // retrieveDictPager({page: 1, pageSize: 999999, searchModel: gridParams?.searchModel || []}).then((response2: any) => {
    retrieveDictPager({page: 1, pageSize: 999999, searchModel: bbb }).then((response2: any) => {
      let gridData: any = [];
      if (response2?.code === '200' && response2?.body?.rowCount > 0) {
        gridData = response2.body.rows || [];
        debugger
        const groupedFieldsByDict: any = groupBy(gridData, 'dictName') || [];
        let exportColumnsWithFields: any = [];
        selectionRows.forEach((item: any) => {
          debugger
          let targetFields = groupedFieldsByDict[item.dictName];
          exportColumnsWithFields.push({
            excelRowType: 'title',
            title: getTemplateName({tableDesc: item?.tableDesc, tableName: item?.tableName}).tplRowTitle,
          });
          targetFields.forEach((item2: any) => {
            if (Func.tabFlag === '1') { // 已纳入管理
              if (item2.dictFieldRelTable) {
                exportColumnsWithFields.push({
                  ...item,
                  ...item2,
                });
              }
            } else { // 未纳入管理
              exportColumnsWithFields.push({
                ...item,
                ...item2,
              });
            }
          })
        })
        let sheetDataField = getSheetDataField(exportColumnsWithFields);
        excelUtil.export({
          excelName: getTemplateName({tableDesc: '', tableName: ''}).excelName,
          sheetData: [
            { gridData: sheetDataMenu, sheetName: '菜单构建', cols: DDIT_TOOL_CONSTANTS.SHEET_MENU },
            { gridData: sheetDataModule, sheetName: '模块', cols: DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE },
            { gridData: sheetDataDictTable, sheetName: '表管理', cols: DDIT_TOOL_CONSTANTS.SHEET_CONFIG_DICT_TABLE },
            { gridData: sheetDataField, sheetName: '字典构建', cols: DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD },
            { gridData: [], sheetName: '业务码表', cols: DDIT_TOOL_CONSTANTS.SHEET_BUSINESS_CODE_TABLE },
            { gridData: [], sheetName: '业务表共通字段', cols: DDIT_TOOL_CONSTANTS.SHEET_COMMON_FIELD },
            { gridData: [], sheetName: '自定义SQL', cols: DDIT_TOOL_CONSTANTS.SHEET_CONFIG_SQL },
            { gridData: [], sheetName: '自定义码表', cols: DDIT_TOOL_CONSTANTS.SHEET_BUSINESS_CODE_TABLE_CUSTOMER },
          ]
        });
      }
    })
  }
}

// getExportColumns
Func.getExportColumns = (myConfig: any) => {
  const fieldColumns = [
    { title: '物理表字段英文名', dataIndex: toCamel(CKEY.DICT_FIELD_NAME), width: 180 },
    { title: '物理表字段中文名', dataIndex: toCamel(CKEY.DICT_FIELD_DESC), width: 180 },
    { title: '数据元类型', dataIndex: toCamel(CKEY.DICT_FIELD_TYPE), width: 180 },
    { title: '键', dataIndex: toCamel(CKEY.DICT_FIELD_KEY), width: 80 },
    { title: '默认值', dataIndex: toCamel(CKEY.DICT_FIELD_DEFAULT_VALUE), width: 80 },
    { title: '非空', dataIndex: toCamel(CKEY.DICT_FIELD_NOT_NULL), width: 80 },
  ];
  let exportColumns: any = [...myConfig.grid_columns, ...fieldColumns];
  exportColumns = exportColumns.filter((item: any) => item.dataIndex !== 'hasDictKeys' && item.dataIndex !== 'dictDomainId');
  exportColumns.forEach((item: any) => {// 组装成通用格式的数据
    item.dict_field_name = item.dataIndex;
  });
  return exportColumns;
};

// expandedRowRendercolumns
Func.expandedRowRendercolumns = [
  { title: '字段名称', dataIndex: toCamel(CKEY.DICT_FIELD_NAME), width: 120, fixed: 'left', ellipsis: true },
  { title: '字段含义', dataIndex: toCamel(CKEY.DICT_FIELD_DESC), width: 140, ellipsis: true },
  { title: '数据类型', dataIndex: toCamel(CKEY.DICT_FIELD_TYPE), width: 140, ellipsis: true },
  { title: '键', dataIndex: toCamel(CKEY.DICT_FIELD_KEY), width: 100 },
  { title: '默认值', dataIndex: toCamel(CKEY.DICT_FIELD_DEFAULT_VALUE), width: 140, ellipsis: true },
  { title: '非空', dataIndex: toCamel(CKEY.DICT_FIELD_NOT_NULL), width: 100 },
];

Func.getgridParams = (initSearchModal: any, expandedRowRender: any, tableNameLabel: any, tableManagered: any, childTable: any, setChildTable: any) => {
  return {
		initSearchModal,
		expandable: {
			columnWidth: 35,
			size: 'small',
			expandedRowRender,
		},
    onExpand: (expanded: any, record: any) => {
			let dictName = record[tableNameLabel];
      let searchModel = [
        { type: 1, property: toCamel(CKEY.DICT_NAME), value: dictName, op: CONSTANTS.FILTER_CONDITION.equal.condetionCode},
				{ type: 4, property: 'tableManagered', value: tableManagered, op: CONSTANTS.FILTER_CONDITION.equal.condetionCode}
      ];
      if (expanded && !childTable[dictName]) {
        retrieveDictPager({page: 1, pageSize: 999999, searchModel: searchModel}).then((response: any) => {
          if (response?.code === '200' && response?.body?.rowCount > 0) {
            let childTableRows = response.body.rows || [];
						childTableRows = childTableRows.filter((item: any) => item.dictFieldName);
            let childTableTmp: any = cloneDeep(childTable);
            childTableTmp[dictName] = childTableRows;
            setChildTable(childTableTmp);
          }
        });
      }
    }
	}
}


export default Func;

