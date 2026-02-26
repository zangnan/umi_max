import React from 'react';
import { message } from 'antd';
import { queryListNs } from '@/services/hts/apiNs'
import myUtil from '@/components/DDAssist/util';
import { groupBy } from 'lodash';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import excelUtil from '@/components/DDAssist/util/excelUtil';
import DDBunit2ADBUtil from '@/components/DDBunit/DDBunit2ADBUtil';

const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

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
      item.dict_field_key = item.dict_field_key || '';
      item.dict_field_default_value = item?.dict_field_default_value || '';
      item.dict_field_not_null = item?.dict_field_not_null || '';
    })
    otherRef[0].current?.showModal({
      gridData: gridData,
      sheetName: '物理表',
      excelName,
      param,
    });
  };
  // 行内导出
  if (record) {
    exportColumnsWithFields.push({
      excelRowType: 'title',
      title: `${record?.dict_desc} ${record?.dict_name}` || '',
    });
    queryListNs({page: 1, pageSize: 999999, searchModel: gridParams?.searchModel || []}, 'dict_field').then((response2: any) => {
      let gridData: any = [];
      if (response2?.code === '200' && response2?.body?.rowCount > 0) {
        gridData = response2.body.rows || [];
        const groupedFieldsByDict: any = groupBy(gridData, 'dict_name') || [];
        let targetFields = groupedFieldsByDict[record.dict_name];
        targetFields.forEach((item2: any) => {
          if (item2.dict_field_name) {
            exportColumnsWithFields.push({
              ...record,
              ...item2,
            });
          }
        })
        templateExport(exportColumnsWithFields, `${record?.dict_desc} ${record?.dict_name}`);
      }
    })
    return;
  }
  // 勾选导出
  if (selectionRows?.length > 0) {
    queryListNs({page: 1, pageSize: 999999, searchModel: gridParams?.searchModel || []}, 'dict_field').then((response2: any) => {
      let gridData: any = [];
      if (response2?.code === '200' && response2?.body?.rowCount > 0) {
        gridData = response2.body.rows || [];
        const groupedFieldsByDict: any = groupBy(gridData, 'dict_name') || [];
        selectionRows.forEach((item: any) => {
          let targetFields = groupedFieldsByDict[item.dict_name];
          exportColumnsWithFields.push({
            excelRowType: 'title',
            title: `${item?.dict_desc} ${item?.dict_name}` || '',
          });
          targetFields.forEach((item2: any) => {
            if (item2.dict_field_name) {
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
  let param1 = {page: 1, pageSize: 999999, searchModel: gridParams?.searchModel || []};
  queryListNs(param1, 'dict').then((response: any) => {
    refUnit.current?.setMasker(false);
    if (response?.code === '200' && response?.body?.rowCount > 0) {
      exportTable = response.body.rows;
    }
    return queryListNs(param1, 'dict_field')
  }).then((response2: any) => {
    let gridData: any = [];
    if (response2?.code === '200' && response2?.body?.rowCount > 0) {
      gridData = response2.body.rows || [];
      const groupedFieldsByDict: any = groupBy(gridData, 'dict_name') || [];
      exportTable.forEach((item: any) => { // 遍历所有表
        exportColumnsWithFields.push({
          excelRowType: 'title',
          title: `${item?.dict_desc} ${item?.dict_name}` || '',
        });
        let targetFields = groupedFieldsByDict[item.dict_name];
        targetFields.forEach((item2: any) => {
          if (item2.dict_field_name) {
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
  let tplTableName = `${tableName || ''}`; // 物理表名称
  let tplTableDesc = `${tableDesc || ''}`; // 物理表名称
  let tplModuleKey = `m_tpl_${tableName}` || ''; // 模块key
  let tplModuleName = `模板_${tableDesc}` || ''; // 模块名
  let tplRowTitle = `${tplModuleName} ${tplModuleKey}` || '';
  let excelName = `数据视图模板_${tableDesc ? tableDesc + '_' : ''}${myUtil.date.formatDate(new Date(), 'YYYYMMDD.hhmmss')}.xlsx`;
  return {
    tplRowTitle,
    tplTableName,
    tplTableDesc,
    tplModuleKey,
    tplModuleName,
    excelName,
  }
}

// sheet 模板数据 模块
const getSheetDataModule = (rows: any) => {
  let newRows: any = [];
  let defaultValueSheetDataMoudle: any = {};
  DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE_NODE.forEach((row: any) => {
    defaultValueSheetDataMoudle[row.dataIndex] = row.defaultValue;
  });
  rows.forEach((item: any) => {
    let newRowItem = { ... defaultValueSheetDataMoudle };
    newRowItem[CKEY.MODULE_KEY] = getTemplateName({tableDesc: item.dict_desc, tableName: item.dict_name}).tplModuleKey;
    newRowItem[CKEY.MODULE_NAME] = getTemplateName({tableDesc: item.dict_desc, tableName: item.dict_name}).tplModuleName;
    newRows.push({
      ...newRowItem,
    });
  })
  return newRows;
}

// sheet 模板数据 字典构建
const getSheetDataField = (rows: any) => {
  let newRows: any = [];
  let defaultValueSheetDataField: any = {};
  DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD_NODE.forEach((row: any) => {
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
      if (DDBunit2ADBUtil.isNumberType({ dictFieldType: item?.dict_field_type})) {
        grid_align = 'R';
        grid_width = 140;
        form_item_type = 'InputNumber';
        form_item_format = '0,0';
        let cc = DDBunit2ADBUtil.getNumberFormat({ dictFieldType: item?.dict_field_type}) || '0,0';
        grid_render = cc;
        form_item_format = cc;
      } else if (DDBunit2ADBUtil.isDateType({ dictFieldType: item?.dict_field_type})) {
        grid_render = 'YYYY-MM-DD';
        grid_width = 150;
        form_item_type = 'DatePicker';
        form_item_format = 'YYYY-MM-DD';
      } else {
        if (DDBunit2ADBUtil.isFieldValLenUnknown({ dictFieldDesc: item?.dict_field_desc})) {
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
      form_item_rule = DDBunit2ADBUtil.getFieldDefaultRules({ fieldObj: {
        dictFieldNotNull: item.dict_field_not_null,
        dictFieldName: item.dict_field_name,
        dictFieldType: item.dict_field_type,
      } }).excelStr;
      itemNew[CKEY.DICT_NAME] = item.dict_name;
      itemNew[CKEY.DICT_FIELD_NAME] = item.dict_field_name;
      itemNew[CKEY.DICT_FIELD_DESC] = item.dict_field_desc;
      itemNew[CKEY.DICT_FIELD_EXPR] = item.dictFieldExpr || '';
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
  DDIT_TOOL_CONSTANTS.SHEET_MENU_NODE.forEach((row: any) => {
    defaultValueSheetDataDictTable[row.dataIndex] = row.defaultValue;
  });
  rows.forEach((item: any, index: any) => {
    let tplModuleKey = getTemplateName({tableDesc: item.dict_desc, tableName: item.dict_name}).tplModuleKey;
    let tplModuleName = getTemplateName({tableDesc: item.dict_desc, tableName: item.dict_name}).tplModuleName;
    let newRowItem = {
      ... defaultValueSheetDataDictTable,
      menu_id: index + 1,
      menu_name: tplModuleName,
      menu_path: `/tpl/cfgp/${tplModuleKey}`,
    };
    newRows.push({
      ...newRowItem,
    });
  })
  return newRows;
}

// 导出数据视图模板
Func.viewTemplateExportModal = async (param: any) => {
  let { refUnit, selectionRows, record, refGrid } = param;
  const gridParams = refUnit.current?.getGridParams();
  const searchModel = gridParams?.searchModel || [];
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
    let param1 = {page: 1, pageSize: 999999, searchModel: gridParams?.searchModel};
    const aaa: any = await queryListNs(param1, 'dict');
    refUnit.current?.setMasker(false);
    if (aaa?.code === '200' && aaa?.body?.rowCount > 0) {
      selectionRows = aaa?.body?.rows;
    }
  }
  if (selectionRows?.length > 0) {
    let sheetDataModule = getSheetDataModule(selectionRows);
    let sheetDataMenu = getSheetDataMenu(selectionRows);
    queryListNs({page: 1, pageSize: 999999, searchModel: gridParams?.searchModel || []}, 'dict_field').then((response2: any) => {
      let gridData: any = [];
      if (response2?.code === '200' && response2?.body?.rowCount > 0) {
        gridData = response2.body.rows || [];
        const groupedFieldsByDict: any = groupBy(gridData, 'dict_name') || [];
        let exportColumnsWithFields: any = [];
        selectionRows.forEach((item: any) => {
          let targetFields = groupedFieldsByDict[item.dict_name];
          exportColumnsWithFields.push({
            excelRowType: 'title',
            title: getTemplateName({tableDesc: item?.dict_desc, tableName: item?.dict_name}).tplRowTitle,
          });
          targetFields.forEach((item2: any) => {
            exportColumnsWithFields.push({
              ...item,
              ...item2,
            });
          })
        })
        let sheetDataField = getSheetDataField(exportColumnsWithFields);
        excelUtil.export({
          excelName: getTemplateName({tableDesc: '', tableName: ''}).excelName,
          sheetData: [
            { gridData: sheetDataMenu, sheetName: '菜单', cols: DDIT_TOOL_CONSTANTS.SHEET_MENU_NODE },
            { gridData: sheetDataModule, sheetName: '模块', cols: DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE_NODE },
            { gridData: sheetDataField, sheetName: '字段', cols: DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD_NODE },
          ]
        });
      }
    })
  }
}

export default Func;

