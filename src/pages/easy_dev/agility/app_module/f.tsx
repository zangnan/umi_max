import React from 'react';
import { retrieveModulePager } from '@/services/hts/api';
import { cloneDeep } from 'lodash';
import { message } from 'antd';
import { retrieveTablePager, retrieveDictPager, queryList } from '@/services/hts/api';
import { getMenuByRole, baseEdit, automaticPageDef } from '@/services/hts/api';
import myUtil from '@/components/DDAssist/util';
import { groupBy } from 'lodash';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import excelUtil from '@/components/DDAssist/util/excelUtil';
import CONSTANTS from '@/components/DDAssist/constants';
import DDBunit2ADBUtil from '@/components/DDBunit/DDBunit2ADBUtil';

const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;
const toCamel = myUtil.text.underscoreToCamel;

const Func: any = {
  refUnit: React.createRef(),
};

// 配置项：自定义操作列 - 预览
Func.preview = (param: any) => {
  const { record } = param;
  let moduleKey = record?.moduleKey|| 'test001';
  window.open(`${APP_BASE ? '#/' : ''}${APP_BASE}/easy_dev/agility/cfgp?key=${moduleKey}`);
}

// 导出 数据字典-字典导入模板 sheet3.模块
const getSheetModule = (rows: any, sheetName: any) => {
  const newRows: any = cloneDeep(rows);
  newRows.forEach((item: any) => {
    let configData: any = item || {};
    // 模块
    item[CKEY.MODULE_KEY] = configData[toCamel(CKEY.MODULE_KEY)] || '';
    item[CKEY.MODULE_NAME] = configData[toCamel(CKEY.MODULE_NAME)] || '';
    item[CKEY.DICT_NAME] = configData[toCamel(CKEY.DICT_NAME)] || '';
    // grid
    item[CKEY.GRID_SHOW_SERIAL_NUMBER] = configData[toCamel(CKEY.GRID_SHOW_SERIAL_NUMBER)] || '';
    item[CKEY.GRID_BORDER] = configData[toCamel(CKEY.GRID_BORDER)] || '';
    item[CKEY.GRID_SELECTION_TYPE] = configData[toCamel(CKEY.GRID_SELECTION_TYPE)] || 'checkbox';
    item[CKEY.GRID_EXT] = configData[toCamel(CKEY.GRID_EXT)] || '';
    // form
    item[CKEY.FORM_LAYOUT_TYPE] = configData[toCamel(CKEY.FORM_LAYOUT_TYPE)] || 'horizontal';
    item[CKEY.FORM_WIDTH] = configData[toCamel(CKEY.FORM_WIDTH)] || 960;
    item[CKEY.FORM_SUBMIT_TYPE] = configData[toCamel(CKEY.FORM_SUBMIT_TYPE)] || '';
    // customer btn
    item[CKEY.CUSTOMER_BTN_TOOLBAR] = configData[toCamel(CKEY.CUSTOMER_BTN_TOOLBAR)] || '';
    item[CKEY.CUSTOMER_BTN_GRID_COL] = configData[toCamel(CKEY.CUSTOMER_BTN_GRID_COL)] || '';
    // grid col btn
    item[CKEY.GRID_COL_EDIT] = configData[toCamel(CKEY.GRID_COL_EDIT)] || '';
    item[CKEY.GRID_COL_DEL] = configData[toCamel(CKEY.GRID_COL_DEL)] || '';
    item[CKEY.GRID_COL_DETAIL] = configData[toCamel(CKEY.GRID_COL_DETAIL)] || '';
    // toolbar btn
    let toolbar_default_download = configData[toCamel(CKEY.TOOLBAR_DEFAULT_DOWNLOAD)] || '';
    item[CKEY.TOOLBAR_DEFAULT_ADD] = configData[toCamel(CKEY.TOOLBAR_DEFAULT_ADD)] || '';
    item[CKEY.TOOLBAR_DEFAULT_DELETE] = configData[toCamel(CKEY.TOOLBAR_DEFAULT_DELETE)] || '';
    item[CKEY.TOOLBAR_DEFAULT_EDIT] = configData[toCamel(CKEY.TOOLBAR_DEFAULT_EDIT)] || '';
    item[CKEY.TOOLBAR_DEFAULT_UPLOAD] = configData[toCamel(CKEY.TOOLBAR_DEFAULT_UPLOAD)] || '';
    item[CKEY.TOOLBAR_DEFAULT_DOWNLOAD] = toolbar_default_download;
    item[CKEY.TOOLBAR_DEFAULT_SETTING] = configData[toCamel(CKEY.TOOLBAR_DEFAULT_SETTING)] || '';
    item[CKEY.TOOLBAR_DEFAULT_FULL] = configData[toCamel(CKEY.TOOLBAR_DEFAULT_FULL)] || '';
    item[CKEY.TOOLBAR_DEFAULT_RELOAD] = configData[toCamel(CKEY.TOOLBAR_DEFAULT_RELOAD)] || '';
    item[CKEY.TOOLBAR_DEFAULT_ADVANCED_FILTER] = configData[toCamel(CKEY.TOOLBAR_DEFAULT_ADVANCED_FILTER)] || '';
    // api
    let api_form_edit = configData[toCamel(CKEY.API_FORM_EDIT)] || '';
    api_form_edit = api_form_edit?.indexOf('/dict/automatic/saveOrUpdate/') > -1 ? '' : api_form_edit;
    let api_form_query = configData[toCamel(CKEY.API_FORM_QUERY)] || '';
    api_form_query = configData.api_form_query?.indexOf('/dict/automatic/queryForm/') > -1 ? '/' : api_form_query;
    let api_form_delete = configData[toCamel(CKEY.API_FORM_DELETE)] || '';
    api_form_delete = configData.api_form_delete?.indexOf('/dict/automatic/delete/') > -1 ? '/' : api_form_delete;
    let api_grid_query = configData[toCamel(CKEY.API_GRID_QUERY)] || '';
    api_grid_query = configData.api_grid_query?.indexOf('/dict/automatic/queryPager/') > -1 ? '/' : api_grid_query;
    let api_excel_export = configData[toCamel(CKEY.API_EXCEL_EXPORT)] || '';
    api_excel_export = configData.api_excel_export?.indexOf('/dict/automatic/export/') > -1 ? '/' : api_excel_export;
    let api_excel_import = configData[toCamel(CKEY.API_EXCEL_IMPORT)] || '';
    api_excel_import = configData.api_excel_import?.indexOf('/dict/automatic/import/') > -1 ? '/' : api_excel_import;
    let api_excel_template = configData[toCamel(CKEY.API_EXCEL_TEMPLATE)] || '';
    api_excel_template = configData.api_excel_template?.indexOf('/dict/automatic/template/') > -1 ? '/' : api_excel_template;
    item[CKEY.API_FORM_EDIT] = api_form_edit;
    item[CKEY.API_FORM_QUERY] = api_form_query;
    item[CKEY.API_FORM_DELETE] = api_form_delete;
    item[CKEY.API_GRID_QUERY] = api_grid_query;
    item[CKEY.API_EXCEL_EXPORT] = api_excel_export;
    item[CKEY.API_EXCEL_IMPORT] = api_excel_import;
    item[CKEY.API_EXCEL_TEMPLATE] = api_excel_template;
  });
  return { gridData: newRows, sheetName, cols: DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE }
}

// 配置项：自定义工具栏 - 导出模块
Func.exportModule = (param: any) => {
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
        getSheetModule(selectionRows || [], '模块'),
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
  retrieveModulePager({page: 1, pageSize: 999999, searchModel: gridParams?.searchModel || []}).then((response: any) => {
    // debugger
    refUnit.current?.setMasker(false);
    if (response?.code === '200' && response?.body?.rowCount > 0) {
      excelUtil.export({
        excelName: `数据字典-字典导入模板_${myUtil.date.formatDate(new Date(), 'YYYYMMDD.hhmmss')}.xlsx`,
        sheetData: [
          getSheetModule(response.body.rows || [], '模块'),
        ]
      });
    }
  });
}

// sheet 模板数据 模块
const getSheetDataModule = (rows: any) => {
  let newRows: any = [];
  rows.forEach((item: any) => {
    let newRowItem: any = {};
    DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE.forEach((fieldObj: any) => {
      newRowItem[fieldObj.dataIndex] = item[toCamel(fieldObj.dataIndex)] || '';
    });
    newRows.push({
      ...newRowItem,
    });
  })
  return newRows;
}

// sheet 模板数据 表管理
const getSheetDataDictTable = (rows: any) => {
  let newRows: any = [];
  rows.forEach((item: any) => {
    if (item) {
      let newRowItem: any = {};
      DDIT_TOOL_CONSTANTS.SHEET_CONFIG_DICT_TABLE.forEach((fieldObj: any) => {
        newRowItem[fieldObj?.dataIndex] = item[toCamel(fieldObj?.dataIndex)] || '';
      });
      newRows.push({
        ...newRowItem,
      });
    }
  })
  return newRows;
}

// sheet 模板数据 业务码表
const getsheetDataBusinessCodeTable = (rows: any) => {
  let newRows: any = [];
  rows.forEach((item: any, index: any) => {
    let newRowItem: any = {};
    DDIT_TOOL_CONSTANTS.SHEET_BUSINESS_CODE_TABLE.forEach((fieldObj: any) => {
      newRowItem[fieldObj.dataIndex] = item[toCamel(fieldObj.dataIndex)] || '';
    });
    newRowItem.code_id = index + 1;
    newRows.push({
      ...newRowItem,
    });
  })
  return newRows;
}

// sheet 模板数据 业务码表
const getsheetDataSql = (rows: any) => {
  let newRows: any = [];
  rows.forEach((item: any) => {
    let newRowItem: any = {};
    DDIT_TOOL_CONSTANTS.SHEET_CONFIG_SQL.forEach((fieldObj: any) => {
      newRowItem[fieldObj.dataIndex] = item[toCamel(fieldObj.dataIndex)] || '';
    });
    newRows.push({
      ...newRowItem,
    });
  })
  return newRows;
}

// sheet 模板数据 自定义码表
const getsheetDatCodeTableCus = (rows: any) => {
  let newRows: any = [];
  rows.forEach((item: any, index: any) => {
    let newRowItem: any = {};
    DDIT_TOOL_CONSTANTS.SHEET_BUSINESS_CODE_TABLE_CUSTOMER.forEach((fieldObj: any) => {
      newRowItem[fieldObj.dataIndex] = item[toCamel(fieldObj.dataIndex)] || '';
    });
    newRowItem.code_manager_id = index + 1;
    newRows.push({
      ...newRowItem,
    });
  })
  return newRows;
}

// sheet 业务表共通字段 业务码表
const getsheetDataCommonData = (rows: any) => {
  let newRows: any = [];
  rows.forEach((item: any, index: any) => {
    let newRowItem: any = {};
    DDIT_TOOL_CONSTANTS.SHEET_COMMON_FIELD.forEach((fieldObj: any) => {
      newRowItem[fieldObj.dataIndex] = item[toCamel(fieldObj.dataIndex)] || '';
    });
    newRowItem.uuid = index + 1;
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
  DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD.forEach((row: any) => {
    defaultValueSheetDataField[row.dataIndex] = row.defaultValue;
  });
  rows.forEach((item: any) => {
    if (item.excelRowType === 'title') {
      newRows.push({
        ...item,
      });
    } else {
      let newRowItem: any = {};
      DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD.forEach((fieldObj: any) => {
        newRowItem[fieldObj.dataIndex] = item[toCamel(fieldObj.dataIndex)] || '';
      });
      if (item.dictFieldFlag === 'O') {
        newRowItem[CKEY.DICT_FIELD_NAME_MAIN] = item.dictFieldName;
        newRowItem[CKEY.DICT_FIELD_NAME_REL] = '';
      } else if (item.dictFieldFlag === 'R') {
        newRowItem[CKEY.DICT_FIELD_NAME_MAIN] = '';
        newRowItem[CKEY.DICT_FIELD_NAME_REL] = `${item.dictFieldRelTable}.${item.dictFieldName}`;
      } else if (item.dictFieldFlag === 'S') {
        newRowItem[CKEY.DICT_FIELD_NAME_MAIN] = '';
        newRowItem[CKEY.DICT_FIELD_NAME_REL] = `${item.dictFieldName}`;
      }
      newRows.push({
        ...newRowItem,
      });
    }
  });
  return newRows;
};

// sheet 模板数据 菜单构建
const getSheetDataMenu = (rows: any, dataMenuRole: any, dataListRole: any) => {
  if (dataMenuRole?.code === '200' && dataMenuRole?.body.length > 0
    && dataListRole?.code === '200' && dataListRole?.body.rowCount > 0) {
    let tmpaaa: any = [];
    // 以菜单id分组划分角色
    const dataRoleMenuGroup: any = groupBy(dataMenuRole?.body, 'menuId') || [];
    // 遍历每组菜单下角色，绑定角色名称
    Object.keys(dataRoleMenuGroup).forEach((menuIdTmp: any) => {
      let tmpRoleObjArr: any = dataRoleMenuGroup[menuIdTmp] || [];
      let roleNameArr: any = [];
      tmpRoleObjArr.forEach((roleObjItem: any) => {
        let tmpRoleObj = dataListRole?.body?.rows.find((item: any) => { return roleObjItem.roleId === item.roleId });
        roleNameArr.push(tmpRoleObj.roleName);
      });
      let roleNameStr = roleNameArr.join(',') || '';
      tmpaaa.push({
        menuId: menuIdTmp,
        roleNameStr: roleNameStr,
      });
    });
    rows.forEach((menuItem: any) => {
      let tmpObj2 = tmpaaa.find((item: any) => { return menuItem.menuId === item.menuId });
      if (tmpObj2) {
        menuItem.menuRole = tmpObj2.roleNameStr;
      }
    });
  }

  let newRows: any = [];
  // 数组转树形结构
  let treeDateTmp = myUtil.tree.transformArrToTree(rows, '', {
    idName: 'menuId',
    parentIdName: 'menuParentId',
    childrenName: 'children'
  });
  // 设置树形结构数据层级属性
  myUtil.tree.setTreeLevels(treeDateTmp);
  let aaa: any = [];
  let fntest = (treedata: any) => {
    treedata.forEach((item: any) => {
      aaa.push(item);
      if (item?.children?.length > 0) {
        fntest(item?.children);
      }
    })
  }
  fntest(treeDateTmp);
  aaa.forEach((item: any, index: any) => {
    let newRowItem: any = {};
    DDIT_TOOL_CONSTANTS.SHEET_MENU.forEach((fieldObj: any) => {
      newRowItem[fieldObj.dataIndex] = item[toCamel(fieldObj.dataIndex)] || '';
    });
    newRowItem.menu_name = item.level === 0 ? item.menuName: '';
    newRowItem.menu_name1 = item.level === 1 ? item.menuName: '';
    newRowItem.menu_name2 = item.level === 2 ? item.menuName: '';
    newRowItem.menu_name3 = item.level === 3 ? item.menuName: '';
    newRowItem.menu_name4 = item.level === 4 ? item.menuName: '';
    if (item.menuType === '9') {
      newRowItem.web_id = item.menuId || '';
    }
    if (item.level === 0) {
      newRowItem.colSpan = [1, 5];
    } else if (item.level === 1) {
      newRowItem.colSpan = [2, 5];
    } else if (item.level === 2) {
      newRowItem.colSpan = [3, 5];
    } else if (item.level === 3) {
      newRowItem.colSpan = [4, 5];
    }
    newRowItem.menu_id = index + 1;
    newRows.push({
      ...newRowItem,
    });
  })
  // debugger;
  return newRows;
}

// 导出数据视图模板
Func.importModuleDict = async (param: any) => {
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
    let searchModalTmp: any;
    if (gridParams?.searchModel) {
      searchModalTmp = gridParams?.searchModel || [];
    }
    let param1 = {page: 1, pageSize: 999999, searchModel: searchModalTmp};
    const aaa: any = await retrieveModulePager(param1);
    refUnit.current?.setMasker(false);
    if (aaa?.code === '200' && aaa?.body?.rowCount > 0) {
      selectionRows = aaa?.body?.rows;
    }
  }
  if (selectionRows?.length > 0) {
    let sheetDataModule = getSheetDataModule(selectionRows);

    // sheet 表管理 数据获取处理
    let sheetDataDictTable: any;
    const dataTmp1: any = await retrieveTablePager({page: 1, pageSize: 999999, searchModel: []})
    if (dataTmp1?.code === '200' && dataTmp1?.body?.rowCount > 0) {
      let exportColumnsWithFields: any = [];
      let gridData: any = dataTmp1.body.rows || [];
      selectionRows.forEach((item: any) => {
        let targetFields = gridData.find((tmp: any) => { return tmp.dictName === item.dictName });
        exportColumnsWithFields.push(targetFields);
      })
      // 去重 表维度
      exportColumnsWithFields = myUtil.array.dedupeByProperty(exportColumnsWithFields, 'tableAlias');// tableName tableAlias
      sheetDataDictTable = getSheetDataDictTable(exportColumnsWithFields);
    }

    // sheet 字典构建 数据获取处理
    let sheetDataField: any;
    const dataTmp2: any = await retrieveDictPager({page: 1, pageSize: 999999, searchModel: []})
    if (dataTmp2?.code === '200' && dataTmp2?.body?.rowCount > 0) {
      let exportColumnsWithFields: any = [];
      let gridData: any = dataTmp2.body.rows || [];
      const groupedFieldsByDict: any = groupBy(gridData, 'dictName') || [];
      // 去重 数据字典维度
      let selectionDictRows: any = myUtil.array.dedupeByProperty(selectionRows, 'dictName') || [];
      selectionDictRows.forEach((item: any) => {
        let targetFields = groupedFieldsByDict[item.dictName];
        let tmpDictTableObj = sheetDataDictTable.find((item2: any) => { return item2.dict_name === item?.dictName });
        exportColumnsWithFields.push({
          excelRowType: 'title',
          title: `${tmpDictTableObj?.dictDesc || ''} ${tmpDictTableObj?.dict_name || ''}`,
        });
        targetFields?.forEach((item2: any) => {
          exportColumnsWithFields.push({
            ...item,
            ...item2,
          });
        })
      })
      sheetDataField = getSheetDataField(exportColumnsWithFields);
    }

    // sheet 业务码表 数据获取处理
    let sheetDataBusinessCodeTable: any;
    const dataTmp3: any = await queryList({page: 1, pageSize: 999999, searchModel: []}, 'm_sys_code');
    if (dataTmp3?.code === '200' && dataTmp3?.body?.rowCount > 0) {
      let gridData: any = dataTmp3.body.rows || [];
      sheetDataBusinessCodeTable = getsheetDataBusinessCodeTable(gridData);
    }

    // sheet 自定义SQL 数据获取处理
    let sheetDataSql: any;
    const dataTmp4: any = await queryList({page: 1, pageSize: 999999, searchModel: []}, 'm_sys_sql');
    if (dataTmp4?.code === '200' && dataTmp4?.body?.rowCount > 0) {
      let gridData: any = dataTmp4.body.rows || [];
      sheetDataSql = getsheetDataSql(gridData);
    }

    // sheet 自定义码表 数据获取处理
    let sheetDataCodeTableCus: any;
    const dataTmp6: any = await queryList({page: 1, pageSize: 999999, searchModel: []}, 'm_sys_code_manage');
    if (dataTmp6?.code === '200' && dataTmp6?.body?.rowCount > 0) {
      let gridData: any = dataTmp6.body.rows || [];
      sheetDataCodeTableCus = getsheetDatCodeTableCus(gridData);
    }

    // 获取菜单角色
    const dataMenuRole: any = await getMenuByRole({page: 1, pageSize: 999999, searchModel: []});
    // 获取角色 名称
    const dataListRole: any = await queryList({page: 1, pageSize: 999999, searchModel: []}, 'm_sys_role');

    // sheet 菜单构建 数据获取处理
    let sheetDataMenu: any;
    const dataTmp5: any = await queryList({page: 1, pageSize: 999999, searchModel: []}, 'm_sys_menu');
    if (dataTmp5?.code === '200' && dataTmp5?.body?.rowCount > 0) {
      let gridData: any = dataTmp5.body.rows || [];
      sheetDataMenu = getSheetDataMenu(gridData, dataMenuRole, dataListRole);
    }

    // sheet 菜单构建 业务表共通字段
    let sheetDataCommonData: any;
    const commonData = (dataTmp2?.body?.rows || []).filter((item: any) => item.dictName === 'common');
    if (commonData.length > 0) {
      sheetDataCommonData = getsheetDataCommonData(commonData);
    }

    // Excel导出
    excelUtil.export({
      excelName: `数据视图_${myUtil.date.formatDate(new Date(), 'YYYYMMDD.hhmmss')}.xlsx`,
      sheetData: [
        { gridData: sheetDataMenu, sheetName: '菜单构建', cols: DDIT_TOOL_CONSTANTS.SHEET_MENU },
        { gridData: sheetDataModule, sheetName: '模块', cols: DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE },
        { gridData: sheetDataDictTable, sheetName: '表管理', cols: DDIT_TOOL_CONSTANTS.SHEET_CONFIG_DICT_TABLE },
        { gridData: sheetDataField, sheetName: '字典构建', cols: DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD },
        { gridData: sheetDataBusinessCodeTable, sheetName: '业务码表', cols: DDIT_TOOL_CONSTANTS.SHEET_BUSINESS_CODE_TABLE },
        { gridData: sheetDataCommonData, sheetName: '业务表共通字段', cols: DDIT_TOOL_CONSTANTS.SHEET_COMMON_FIELD },
        { gridData: sheetDataSql, sheetName: '自定义SQL', cols: DDIT_TOOL_CONSTANTS.SHEET_CONFIG_SQL },
        { gridData: sheetDataCodeTableCus, sheetName: '自定义码表', cols: DDIT_TOOL_CONSTANTS.SHEET_BUSINESS_CODE_TABLE_CUSTOMER },
      ]
    });
  }
}

// 增加模拟数据
Func.addMockData = async (param: any) => {
  let { record } = param;
  let {moduleKey} = record;
  const apiFormEdit = `${myUtil.api.getApiRoot()}${CONSTANTS.DEFAULT_API.FORM_EDIT}/${moduleKey}`;
  let response1: any = await automaticPageDef(moduleKey);
  let { appTableDict } = response1.body;

  // 获取码表
  for (let i = 0; i < appTableDict.length; i++) {
    let formItemTypeTmp = appTableDict[i]?.formItemType?.toLowerCase();
    // 含有码表字段
    if (formItemTypeTmp === 'select' || formItemTypeTmp === 'checkbox' || formItemTypeTmp === 'radio') {
      if (appTableDict[i]?.formItemExtend) {
        await myUtil.code.getCode(appTableDict[i]?.formItemExtend);
      }
    }
  }
  // 制造模拟数据
  let getMockData: any = () => {
    let mockData: any = {};
    appTableDict.forEach((fieldTmp: any) => {
      if (fieldTmp.dictFieldFlag === 'O') {
        // debugger;
        let dictFieldType = fieldTmp.dictFieldType;
        let formItemTypeTmp = fieldTmp.formItemType.toLowerCase();
        let dictFieldNameTmp;
        if (ENV_TYPE === 'node') {
          dictFieldNameTmp = fieldTmp.dictFieldName;
        } else {
          dictFieldNameTmp = myUtil.text.underscoreToCamel(fieldTmp.dictFieldName);
        }
        // 含有码表字段
        if (formItemTypeTmp === 'select' || formItemTypeTmp === 'checkbox' || formItemTypeTmp === 'radio') {
          if (fieldTmp?.formItemExtend) { // eg: code_dm_ckts_cktmspzlx
            let tmpCodeTable = myUtil.code.getCode(fieldTmp?.formItemExtend);
            if (tmpCodeTable?.length > 0) {
              let randomIndexTmp = Math.floor(Math.random()*tmpCodeTable?.length);
              let aa = tmpCodeTable[randomIndexTmp];
              mockData[dictFieldNameTmp] = aa?.code || '';
            }
          }
        // 主键
        } else if (fieldTmp.dictFieldKey === '主键' && dictFieldType.indexOf('varchar') > -1) {
          let tmpRule = DDBunit2ADBUtil.getStringRuleLength({ dictFieldType: dictFieldType?.toLowerCase() });
          mockData[dictFieldNameTmp] = myUtil.text.uuid(myUtil.text.getNumVal(tmpRule));
        // 字符 eg: varchar(60) longtext char(5)
        } else if (dictFieldType.indexOf('varchar') > -1
            || dictFieldType.indexOf('longtext') > -1
            || dictFieldType.indexOf('char') > -1) {
          let tmpRule = DDBunit2ADBUtil.getStringRuleLength({ dictFieldType: dictFieldType?.toLowerCase() });
          tmpRule = myUtil.text.getNumVal(tmpRule) > 6 ? 6 : myUtil.text.getNumVal(tmpRule);
          mockData[dictFieldNameTmp] =  myUtil.text.uuid(tmpRule);
        // 日期 eg: datetime
        } else if (dictFieldType.indexOf('datetime') > -1) {
          mockData[dictFieldNameTmp] = myUtil.date.getRandomTimestamp(); // 1744934400000; myUtil.date.getRandomTimestamp();
        // 数值 eg: decimal(18,2)
        } else if (dictFieldType.indexOf('decimal') > -1
            || dictFieldType.indexOf('int') > -1) {
          let tmpRule2 = DDBunit2ADBUtil.getNumberRuleLength({ dictFieldType: dictFieldType?.toLowerCase() });
          let tmpNumberRule: any = tmpRule2.split(',') || [];
          let tmpNumberLength = tmpNumberRule.length > 0 ? tmpNumberRule[0] : 0;
          tmpNumberLength = myUtil.text.getNumVal(tmpNumberLength) > 6 ? 6 : myUtil.text.getNumVal(tmpNumberLength);
          mockData[dictFieldNameTmp] = myUtil.text.generateRandomNumber(myUtil.text.getNumVal(tmpNumberLength));
        }
      }
    });
    return mockData;
  }

  // console.info('增加模拟数据 appTableDict = ', appTableDict);
  // console.info('增加模拟数据 mockData = ', getMockData());

  // debugger;
  // baseEdit({ data: getMockData(), url: apiFormEdit }).then((response) => {
  //   console.info('增加模拟数据response', response);
  // })

  let promiseArr: any = [];
  let mockDataNum = CONSTANTS.MOCK_DATA_NUM;
  for (let i = 0; i < mockDataNum; i++) {
    let promise1: any = baseEdit({ data: getMockData(), url: apiFormEdit });
    promiseArr.push(promise1);
  }
  // debugger;
  Promise.all(promiseArr)
    .then(() => {})
    .catch(() => { message.error('获取码表失败'); })
    .finally(() => {
      message.info('模拟数据已添加');
    });
}

export default Func;

