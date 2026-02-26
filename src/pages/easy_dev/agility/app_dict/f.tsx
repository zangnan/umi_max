import React from 'react';
import { message } from 'antd';
import excelUtil from '@/components/DDAssist/util/excelUtil';
import { retrieveDictPager } from '@/services/hts/api';
import myUtil from '@/components/DDAssist/util';
import { cloneDeep } from 'lodash';
import { itemType } from '@/components/DDForm/data.d';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import DDBunit2ADBUtil from '@/components/DDBunit/DDBunit2ADBUtil';

const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;
const toCamel = myUtil.text.underscoreToCamel;

const Func: any = {
  refUnit: React.createRef(),
};

// 列表自定义渲染
Func.columnsRender = {
  // 主表字段
  renderDictField1: (param: any) => {
    const dictFieldFlag = param?.record.dictFieldFlag;
    if (dictFieldFlag === 'O') {
      return param?.record.dictFieldName;
    }
    return '';
  },
  // 关联表字段
  renderDictField2: (param: any) => {
    const dictFieldFlag = param?.record.dictFieldFlag;
    if (dictFieldFlag === 'R')  {
      return `${param?.record.dictFieldRelTable}.${param?.record.dictFieldName}`;
    }
    return '';
  },
}

// 导出数据视图 sheet 3.字段
const getSheet2Data = (appDictRows: any, sheetName: any) => {
  let excelRows: any = [];
  appDictRows.forEach((item: any, index: any) => {
    let dictRow: any = {};
    // 主表字段	关联表字段	字段中文名	数据类型	键	默认值	非空	关联字段表达式	字段过滤器
    // let dictFieldNameMain = item[toCamel(CKEY.DICT_FIELD_FLAG)] === 'O' ? `${item[toCamel(CKEY.DICT_FIELD_REL_TABLE)]}.${item[toCamel(CKEY.DICT_FIELD_NAME)]}` : '';
    let dictFieldNameMain = item[toCamel(CKEY.DICT_FIELD_FLAG)] === 'O' ? `${item[toCamel(CKEY.DICT_FIELD_NAME)]}` : '';
    let dictFieldNameRel = '';
    if (item[toCamel(CKEY.DICT_FIELD_FLAG)] !== 'O' && item[toCamel(CKEY.DICT_FIELD_REL_TABLE)] && item[toCamel(CKEY.DICT_FIELD_NAME)]) {
      dictFieldNameRel = `${item[toCamel(CKEY.DICT_FIELD_REL_TABLE)]}.${item[toCamel(CKEY.DICT_FIELD_NAME)]}`;
    }
    dictRow[CKEY.DICT_FIELD_NAME_MAIN] = dictFieldNameMain; // 主表字段
    dictRow[CKEY.DICT_FIELD_NAME_REL] = dictFieldNameRel; // 关联表字段
    dictRow[CKEY.DICT_FIELD_DESC] = item[toCamel(CKEY.DICT_FIELD_DESC)] || ''; // 字段含义
    dictRow[CKEY.DICT_FIELD_NAME] = item[toCamel(CKEY.DICT_FIELD_NAME)] || ''; // 字段名称
    dictRow[CKEY.DICT_FIELD_TYPE] = item[toCamel(CKEY.DICT_FIELD_TYPE)] || '';
    dictRow[CKEY.DICT_FIELD_KEY] = item[toCamel(CKEY.DICT_FIELD_KEY)] || '';
    dictRow[CKEY.DICT_FIELD_DEFAULT_VALUE] = item[toCamel(CKEY.DICT_FIELD_DEFAULT_VALUE)] || '';
    dictRow[CKEY.DICT_FIELD_NOT_NULL] = item[toCamel(CKEY.DICT_FIELD_NOT_NULL)] || '';
    dictRow[CKEY.DICT_FIELD_EXPR] = item[toCamel(CKEY.DICT_FIELD_EXPR)] || '';
    dictRow[CKEY.DICT_FIELD_FILTER] = item[toCamel(CKEY.DICT_FIELD_FILTER)] || '';
    // 列表项
    dictRow[CKEY.GRID_USED] = item[toCamel(CKEY.GRID_USED)] || '';
    dictRow[CKEY.GRID_KEY] = item[toCamel(CKEY.GRID_KEY)] || '';
    dictRow[CKEY.GRID_ALIGN] = item[toCamel(CKEY.GRID_ALIGN)] || '';
    dictRow[CKEY.GRID_WIDTH] = item[toCamel(CKEY.GRID_WIDTH)] || '';
    dictRow[CKEY.GRID_FIXED] = item[toCamel(CKEY.GRID_FIXED)] || '';
    dictRow[CKEY.GRID_HIDDEN] = item[toCamel(CKEY.GRID_HIDDEN)] || '';
    dictRow[CKEY.GRID_ELLIPSIS] = item[CKEY.GRID_ELLIPSIS] || '';
    dictRow[CKEY.GRID_RENDER] = item[toCamel(CKEY.GRID_RENDER)] || '';
    dictRow[CKEY.GRID_SORT] = item[toCamel(CKEY.GRID_SORT)] || '';
    dictRow[CKEY.GRID_INDEX] = item[toCamel(CKEY.GRID_INDEX)] || '';
    dictRow[CKEY.GRID_STATISTICS] = item[toCamel(CKEY.GRID_STATISTICS)] || '';
    dictRow[CKEY.GRID_CHILDREN] = item[toCamel(CKEY.GRID_CHILDREN)] || '';
    // 筛选项
    dictRow[CKEY.FILTER_ITEM_TYPE] = item[toCamel(CKEY.FILTER_ITEM_TYPE)] || '';
    dictRow[CKEY.FILTER_ITEM_EXTEND] = item[toCamel(CKEY.FILTER_ITEM_EXTEND)] || '';
    dictRow[CKEY.FILTER_ITEM_INDEX] = item[toCamel(CKEY.FILTER_ITEM_INDEX)] || '';
    dictRow[CKEY.FILTER_ITEM_LABEL] = item[toCamel(CKEY.FILTER_ITEM_LABEL)] || '';
    dictRow[CKEY.FILTER_ITEM_POSITION] = item[toCamel(CKEY.FILTER_ITEM_POSITION)] || '';
    dictRow[CKEY.FILTER_ITEM_PLACEHOLDER] = item[toCamel(CKEY.FILTER_ITEM_PLACEHOLDER)] || '';
    dictRow[CKEY.FILTER_ITEM_LAYOUT] = item[toCamel(CKEY.FILTER_ITEM_LAYOUT)] || '';
    // 表单项
    dictRow[CKEY.FORM_ITEM_USED] = item[toCamel(CKEY.FORM_ITEM_USED)] || '';
    dictRow[CKEY.FORM_ITEM_TYPE] = item[toCamel(CKEY.FORM_ITEM_TYPE)] || '';
    dictRow[CKEY.FORM_ITEM_FORMAT] = item[toCamel(CKEY.FORM_ITEM_FORMAT)] || '';
    dictRow[CKEY.FORM_ITEM_READONLY] = item[toCamel(CKEY.FORM_ITEM_READONLY)] || '';
    dictRow[CKEY.FORM_ITEM_EXTEND] = item[toCamel(CKEY.FORM_ITEM_EXTEND)] || '';
    dictRow[CKEY.FORM_ITEM_LAYOUT] = item[toCamel(CKEY.FORM_ITEM_LAYOUT)] || '';
    dictRow[CKEY.FORM_ITEM_EVENT_ONBLUR] = item[toCamel(CKEY.FORM_ITEM_EVENT_ONBLUR)] || '';
    dictRow[CKEY.FORM_ITEM_EVENT_ONFOCUS] = item[toCamel(CKEY.FORM_ITEM_EVENT_ONFOCUS)] || '';
    dictRow[CKEY.FORM_ITEM_EVENT_ONCHANGE] = item[toCamel(CKEY.FORM_ITEM_EVENT_ONCHANGE)] || '';
    dictRow[CKEY.FORM_ITEM_EVENT_ONSEARCH] = item[toCamel(CKEY.FORM_ITEM_EVENT_ONSEARCH)] || '';
    dictRow[CKEY.FORM_ITEM_RULE] = item[toCamel(CKEY.FORM_ITEM_RULE)] || '';
    dictRow[CKEY.FORM_ITEM_INDEX] = item[toCamel(CKEY.FORM_ITEM_INDEX)] || '';
    excelRows.push(dictRow);
  });
  return { gridData: excelRows, sheetName, cols: DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD }
}

// 配置项：自定义工具栏 - 导出数据字典
Func.exportDict = (param: any) => {
  const { refUnit, refGrid, selectionRows, record } = param;
  const gridParams = refUnit.current?.getGridParams();
  const searchModel = gridParams?.searchModel || [];
  const gridPagination = refGrid.current?.getPagination();
  // const gridData = refUnit.current?.getGridData();
  // 导出方式：行内导出 ——————————————————————————————————————————————————————————————
  if (record) {
    excelUtil.export({
      excelName: `数据视图_${record.appModuleName}_${myUtil.date.formatDate(new Date(), 'YYYYMMDD.hhmmss')}.xlsx`,
      sheetData: [
        // getSheet0Data([record], '1.基础信息'),
        // getSheetModule([record], '3.模块'),
        getSheet2Data([record], '字典构建'),
        // getSheet3Data([record], '4.自定义SQL'),
      ]
    });
    return;
  }
  // 导出方式：勾选导出 ——————————————————————————————————————————————————————————————
  if (selectionRows?.length > 0) {
    let appId = selectionRows[0].appId;
    for (let i = 1; i < selectionRows?.length; i++) {
      if (selectionRows[i].appId !== appId) {
        message.info('只能导出相同应用下数据视图。');
        return;
      }
    }
    excelUtil.export({
      excelName: `数据视图_${myUtil.date.formatDate(new Date(), 'YYYYMMDD.hhmmss')}.xlsx`,
      sheetData: [
        // getSheet0Data(selectionRows || [], '1.基础信息'),
        // getSheetModule(selectionRows || [], '3.模块'),
        getSheet2Data(selectionRows || [], '字典构建'),
        // getSheet3Data(selectionRows || [], '4.自定义SQL'),
      ]
    });
    return;
  }
  // 导出方式：筛选条件导出 ——————————————————————————————————————————————————————————
  // let tmpApp = searchModel.find((tmp: any) => { return tmp.property === 'appId' });
  // if (!tmpApp?.value) {
  //   message.info('请选择应用并查询后完成导出。');
  //   return;
  // }
  let numImport = 5000;
  if (gridPagination?.total > numImport) {
    message.info(`仅支持导出${numImport}条数据，请完成数据筛选后进行导出。`);
    return;
  }
  refUnit.current?.setMasker(true);
  retrieveDictPager({page: 1, pageSize: 999999, searchModel: gridParams?.searchModel || []}).then((response: any) => {
    refUnit.current?.setMasker(false);
    if (response?.code === '200' && response?.body?.rowCount > 0) {
      excelUtil.export({
        excelName: `数据字典-字典导入模板_${myUtil.date.formatDate(new Date(), 'YYYYMMDD.hhmmss')}.xlsx`,
        sheetData: [
          // getSheet0Data(response.body.rows || [], '1.基础信息'),
          // getSheetModule(response.body.rows || [], '3.模块'),
          getSheet2Data(response.body.rows || [], '字典构建'),
          // getSheet3Data(response.body.rows || [], '4.自定义SQL'),
        ]
      });
    }
  });
}

export default Func;

