import React from 'react';
import { message } from 'antd';
import excelUtil from '@/components/DDAssist/util/excelUtil';
import { retrieveTablePager } from '@/services/hts/api';
import myUtil from '@/components/DDAssist/util';
import { cloneDeep } from 'lodash';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';

const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;
const toCamel = myUtil.text.underscoreToCamel;

const Func: any = {
  refUnit: React.createRef(),
};

// 导出 数据字典-字典导入模板 sheet3.模块
const getSheetModule = (rows: any, sheetName: any) => {
  const newRows: any = cloneDeep(rows);
  newRows.forEach((item: any) => {
    let configData: any = item || {};
    item[CKEY.TABLE_NAME] = configData[toCamel(CKEY.TABLE_NAME)] || '';
    item[CKEY.TABLE_DESC] = configData[toCamel(CKEY.TABLE_DESC)] || '';
    item[CKEY.DICT_NAME] = configData[toCamel(CKEY.DICT_NAME)] || '';
    item[CKEY.DICT_DESC] = configData[toCamel(CKEY.DICT_DESC)] || '';
    item[CKEY.TABLE_ALIAS] = configData[toCamel(CKEY.TABLE_ALIAS)] || '';
    item[CKEY.TABLE_TYPE] = configData[toCamel(CKEY.TABLE_TYPE)] || '';
    item[CKEY.DB_SOURCE_ID] = configData[toCamel(CKEY.DB_SOURCE_ID)] || '';
    item[CKEY.DB_ORDER] = configData[toCamel(CKEY.DB_ORDER)] || '';
    item[CKEY.DB_BACK_NAME] = configData[toCamel(CKEY.DB_BACK_NAME)] || ''
    item[CKEY.DB_BACK_GROUP] = configData[toCamel(CKEY.DB_BACK_GROUP)] || ''
    item[CKEY.DB_CLEAN_FLAG] = configData[toCamel(CKEY.DB_CLEAN_FLAG)] || '';
  });
  return { gridData: newRows, sheetName, cols: DDIT_TOOL_CONSTANTS.SHEET_CONFIG_DICT_TABLE }
}

// 配置项：自定义工具栏 - 导出数据字典表
Func.exportDictTable = (param: any) => {
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
        getSheetModule([record], '模块'),
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
        getSheetModule(selectionRows || [], '表管理'),
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
  retrieveTablePager({page: 1, pageSize: 999999, searchModel: gridParams?.searchModel || []}).then((response: any) => {
    // debugger
    refUnit.current?.setMasker(false);
    if (response?.code === '200' && response?.body?.rowCount > 0) {
      excelUtil.export({
        excelName: `数据字典-字典导入模板_${myUtil.date.formatDate(new Date(), 'YYYYMMDD.hhmmss')}.xlsx`,
        sheetData: [
          getSheetModule(response.body.rows || [], '表管理'),
        ]
      });
    }
  });
}

export default Func;

