import React from 'react';
import { retrieveModulePager } from '@/services/hts/api';
import { cloneDeep } from 'lodash';
import { message } from 'antd';
import { retrieveTablePager, retrieveDictPager, queryList } from '@/services/hts/api';
import { queryListNs } from '@/services/hts/apiNs'
import { automaticPageDef, baseEdit } from '@/services/hts/api';
import { getMenuByRole } from '@/services/hts/api';
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
  let moduleKey = record?.module_key;
  if (moduleKey) {
    window.open(`${APP_BASE ? '#/' : ''}${APP_BASE}/easy_dev/agility/cfgp?key=${moduleKey}`);
  }
}




// sheet 模板数据 模块
const getSheetDataModule = (rows: any) => {
  let newRows: any = [];
  rows.forEach((item: any) => {
    let newRowItem: any = {};
    DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE.forEach((fieldObj: any) => {
      newRowItem[fieldObj.dataIndex] = item[fieldObj.dataIndex] || '';
    });
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
      DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD_NODE.forEach((fieldObj: any) => {
        newRowItem[fieldObj.dataIndex] = item[fieldObj.dataIndex] || '';
      });
      newRows.push({
        ...newRowItem,
      });
    }
  });
  return newRows;
};

// sheet 模板数据 菜单构建
const getSheetDataMenu = (rows: any, dataMenuRole: any, dataListRole: any) => {
  let newRows: any = [];
  if (dataMenuRole?.code === '200' && dataMenuRole?.body?.rows?.length > 0
    && dataListRole?.code === '200' && dataListRole?.body?.rows?.length > 0) {
    let tmpaaa: any = [];
    // 以菜单id分组划分角色
    const dataRoleMenuGroup: any = groupBy(dataMenuRole?.body.rows, 'menu_id') || [];
    // 遍历每组菜单下角色，绑定角色名称
    Object.keys(dataRoleMenuGroup).forEach((menuIdTmp: any) => {
      let tmpRoleObjArr: any = dataRoleMenuGroup[menuIdTmp] || [];
      let roleNameArr: any = [];
      tmpRoleObjArr.forEach((roleObjItem: any) => {
        let tmpRoleObj = dataListRole?.body?.rows.find((item: any) => { return roleObjItem.role_id === item.role_id });
        roleNameArr.push(tmpRoleObj.role_name);
      });
      let roleNameStr = roleNameArr.join(',') || '';
      tmpaaa.push({
        menu_id: menuIdTmp,
        roleNameStr: roleNameStr,
      });
    });
    rows.forEach((menuItem: any) => {
      let newRowItem: any = {};
        DDIT_TOOL_CONSTANTS.SHEET_MENU_NODE.forEach((fieldObj: any) => {
          newRowItem[fieldObj.dataIndex] = menuItem[fieldObj.dataIndex] !== null ? menuItem[fieldObj.dataIndex] : '';
        });
      let tmpObj2 = tmpaaa.find((item: any) => { return menuItem.menu_id === item.menu_id });
      newRowItem.menu_role = tmpObj2.roleNameStr;
      newRows.push({
        ...newRowItem,
      });
    });
  }
  return newRows;
}

// sheet 模板数据 表
const getSheetDataDictTable = (rows: any) => {
  let newRows: any = [];
  rows.forEach((item: any) => {
    if (item.excelRowType === 'title') {
      newRows.push({
        ...item,
      });
    } else {
      let newRowItem: any = {};
      DDIT_TOOL_CONSTANTS.SHEET_TABLE_FIELD.forEach((fieldObj: any) => {
        newRowItem[fieldObj?.dataIndex] = item[fieldObj?.dataIndex] || '';
      });
      newRows.push({
        ...newRowItem,
      });
    }
  })
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
    const aaa: any = await queryListNs(param1, 'app_module');
    refUnit.current?.setMasker(false);
    if (aaa?.code === '200' && aaa?.body?.rowCount > 0) {
      selectionRows = aaa?.body?.rows;
    }
  }
  if (selectionRows?.length > 0) {
    let sheetDataModule = getSheetDataModule(selectionRows);

    // sheet 字典构建 数据获取处理
    let sheetDataField: any;
    let dictArr: any = [];
    // const dataTmp2: any = await retrieveDictPager({page: 1, pageSize: 999999, searchModel: []})
    const dataTmp2: any = await queryListNs({page: 1, pageSize: 999999, searchModel: []}, 'app_module_field');
    if (dataTmp2?.code === '200' && dataTmp2?.body?.rowCount > 0) {
      let exportColumnsWithFields: any = [];
      let gridData: any = dataTmp2.body.rows || [];
      const groupedFieldsByDict: any = groupBy(gridData, 'module_key') || [];
      selectionRows.forEach((item: any) => {
        let targetFields = groupedFieldsByDict[item.module_key];
        exportColumnsWithFields.push({
          excelRowType: 'title',
          title: `${item?.module_name || ''} ${item?.module_key || ''}`,
        });
        targetFields?.forEach((item2: any) => {
          if (item2.dict_name) {
            dictArr.push(item2.dict_name);
          }
          exportColumnsWithFields.push({
            ...item,
            ...item2,
          });
        })
      })
      sheetDataField = getSheetDataField(exportColumnsWithFields);
    }

    // sheet 表
    let sheetDataDictTable: any;
    const dataTmp1: any = await queryListNs({page: 1, pageSize: 999999, searchModel: []}, 'dict_field');
    if (dataTmp1?.code === '200' && dataTmp1?.body?.rows?.length > 0) {
      let exportColumnsWithFields: any = [];
      let gridData: any = dataTmp1.body.rows || [];
      const dictArrNew = Array.from(new Set(dictArr));
      dictArrNew.forEach((item: any) => {
        exportColumnsWithFields.push({
          excelRowType: 'title',
          title: item,
        });
        let targetFields = gridData.filter((tmp: any) => { return tmp.dict_name === item });
        exportColumnsWithFields.push(...targetFields);
      })
      sheetDataDictTable = getSheetDataDictTable(exportColumnsWithFields);
    }

    // 获取菜单角色
    const dataMenuRole: any = await queryListNs({page: 1, pageSize: 999999, searchModel: []}, 'sys_menu_role_rel');
    // 获取角色 名称
    const dataListRole: any = await queryListNs({page: 1, pageSize: 999999, searchModel: []}, 'sys_role');

    // sheet 菜单构建 数据获取处理
    let sheetDataMenu: any;
    const dataTmp5: any = await queryListNs({page: 1, pageSize: 999999, searchModel: []}, 'sys_menu');
    if (dataTmp5?.code === '200' && dataTmp5?.body?.rowCount > 0) {
      let gridData: any = dataTmp5.body.rows || [];
      sheetDataMenu = getSheetDataMenu(gridData, dataMenuRole, dataListRole);
    }

    // Excel导出
    excelUtil.export({
      excelName: `数据视图_${myUtil.date.formatDate(new Date(), 'YYYYMMDD.hhmmss')}.xlsx`,
      sheetData: [
        { gridData: sheetDataDictTable, sheetName: '表', cols: DDIT_TOOL_CONSTANTS.SHEET_TABLE_FIELD },
        { gridData: sheetDataModule, sheetName: '模块', cols: DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE_NODE },
        { gridData: sheetDataField, sheetName: '字段', cols: DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD_NODE },
        { gridData: sheetDataMenu, sheetName: '菜单', cols: DDIT_TOOL_CONSTANTS.SHEET_MENU_NODE },
      ]
    });
  }
}

// 增加模拟数据
Func.addMockData = async (param: any) => {
  let { record } = param;
  let { module_key } = record;
  const apiFormEdit = `${myUtil.api.getApiRoot()}${CONSTANTS.DEFAULT_API.FORM_EDIT}/${module_key}`;
  let response1: any = await automaticPageDef(module_key);
  let { appTableDict } = response1.body;
  // 获取码表
  for (let i = 0; i < appTableDict.length; i++) {
    let formItemTypeTmp = appTableDict[i]?.form_item_type?.toLowerCase();
    // 含有码表字段
    if (formItemTypeTmp === 'select' || formItemTypeTmp === 'checkbox' || formItemTypeTmp === 'radio') {
      if (appTableDict[i]?.form_item_extend) {
        await myUtil.code.getCode(appTableDict[i]?.form_item_extend);
      }
    }
    // debugger
  }
  // 制造模拟数据
  let getMockData: any = () => {
    let mockData: any = {};
    appTableDict.forEach((fieldTmp: any) => {
      // if (fieldTmp.dictFieldFlag === 'O') {
      if (fieldTmp.dict_name && fieldTmp.dict_field_name && fieldTmp.form_item_used) {
        // debugger;
        let dictFieldType = fieldTmp.dict_field_type;
        let formItemTypeTmp = fieldTmp.form_item_type.toLowerCase();
        let dictFieldNameTmp;
        if (ENV_TYPE === 'node') {
          dictFieldNameTmp = fieldTmp.dict_field_name;
        } else {
          dictFieldNameTmp = myUtil.text.underscoreToCamel(fieldTmp.dictFieldName);
        }
        // 含有码表字段
        if (formItemTypeTmp === 'select' || formItemTypeTmp === 'checkbox' || formItemTypeTmp === 'radio') {
          if (fieldTmp?.form_item_extend) { // eg: code_dm_ckts_cktmspzlx
            let tmpCodeTable = myUtil.code.getCode(fieldTmp?.form_item_extend);
            if (tmpCodeTable?.length > 0) {
              let randomIndexTmp = Math.floor(Math.random()*tmpCodeTable?.length);
              let aa = tmpCodeTable[randomIndexTmp];
              mockData[dictFieldNameTmp] = aa?.code || '';
            }
          }
        // 主键
        // } else if (fieldTmp.dictFieldKey === '主键' && dictFieldType.indexOf('varchar') > -1) {
        } else if (fieldTmp.grid_key === '1' && dictFieldType.indexOf('varchar') > -1) {
          // debugger;
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
    // debugger
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
    // debugger
    let promise1: any = baseEdit({ data: getMockData(), url: apiFormEdit });
    // debugger
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

