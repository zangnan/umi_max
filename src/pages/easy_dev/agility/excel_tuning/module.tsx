import Spreadsheet from 'react-spreadsheet';
import { useState, useEffect, useImperativeHandle } from 'react';

import myUtil from '@/components/DDAssist/util';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import { retrieveModulePager } from '@/services/hts/api';

const toCamel = myUtil.text.underscoreToCamel;
const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

export interface Props {
  onRef?: any;
}

const Index: React.FC<Props> = ({
  onRef
}) => {
  const [dataItem, setDataItem] = useState([]);

  useEffect(() => {
    let searchModel = [
      { type: 1, property: toCamel(CKEY.DICT_NAME), value: 's_tsjh', op: 'alike'}
    ];
    // retrieveModulePager({page: 1, pageSize: 999999, searchModel: searchModel}).then((response) => {
    retrieveModulePager({page: 1, pageSize: 999999, searchModel: []}).then((response) => {
      if (response?.code === '200' && response?.body?.rowCount > 0) {
        const tmpData: any = [];
        const childTableRows = response.body.rows || [];
        childTableRows.forEach((item: any) => {
          tmpData.push(
            [
              { value: item[toCamel(CKEY.MODULE_KEY)], name: toCamel(CKEY.MODULE_KEY) },
              { value: item[toCamel(CKEY.MODULE_NAME)], name: toCamel(CKEY.MODULE_NAME) },
              { value: item[toCamel(CKEY.DICT_NAME)], name: toCamel(CKEY.DICT_NAME) },
              // 列表
              { value: item[toCamel(CKEY.GRID_SHOW_SERIAL_NUMBER)], name: toCamel(CKEY.GRID_SHOW_SERIAL_NUMBER) },
              { value: item[toCamel(CKEY.GRID_BORDER)], name: toCamel(CKEY.GRID_BORDER) },
              { value: item[toCamel(CKEY.GRID_SELECTION_TYPE)], name: toCamel(CKEY.GRID_SELECTION_TYPE) },
              { value: item[toCamel(CKEY.GRID_EXT)], name: toCamel(CKEY.GRID_EXT) },
              // 列表列按钮
              { value: item[toCamel(CKEY.GRID_COL_EDIT)], name: toCamel(CKEY.GRID_COL_EDIT) },
              { value: item[toCamel(CKEY.GRID_COL_DEL)], name: toCamel(CKEY.GRID_COL_DEL) },
              { value: item[toCamel(CKEY.GRID_COL_DETAIL)], name: toCamel(CKEY.GRID_COL_DETAIL) },
              // 工具栏按钮
              { value: item[toCamel(CKEY.TOOLBAR_DEFAULT_ADD)], name: toCamel(CKEY.TOOLBAR_DEFAULT_ADD) },
              { value: item[toCamel(CKEY.TOOLBAR_DEFAULT_DELETE)], name: toCamel(CKEY.TOOLBAR_DEFAULT_DELETE) },
              { value: item[toCamel(CKEY.TOOLBAR_DEFAULT_EDIT)], name: toCamel(CKEY.TOOLBAR_DEFAULT_EDIT) },
              { value: item[toCamel(CKEY.TOOLBAR_DEFAULT_UPLOAD)], name: toCamel(CKEY.TOOLBAR_DEFAULT_UPLOAD) },
              { value: item[toCamel(CKEY.TOOLBAR_DEFAULT_DOWNLOAD)], name: toCamel(CKEY.TOOLBAR_DEFAULT_DOWNLOAD) },
              { value: item[toCamel(CKEY.TOOLBAR_DEFAULT_SETTING)], name: toCamel(CKEY.TOOLBAR_DEFAULT_SETTING) },
              { value: item[toCamel(CKEY.TOOLBAR_DEFAULT_FULL)], name: toCamel(CKEY.TOOLBAR_DEFAULT_FULL) },
              { value: item[toCamel(CKEY.TOOLBAR_DEFAULT_RELOAD)], name: toCamel(CKEY.TOOLBAR_DEFAULT_RELOAD) },
              { value: item[toCamel(CKEY.TOOLBAR_DEFAULT_ADVANCED_FILTER)], name: toCamel(CKEY.TOOLBAR_DEFAULT_ADVANCED_FILTER) },
              // 表单
              { value: item[toCamel(CKEY.FORM_LAYOUT_TYPE)], name: toCamel(CKEY.FORM_LAYOUT_TYPE) },
              { value: item[toCamel(CKEY.FORM_WIDTH)], name: toCamel(CKEY.FORM_WIDTH) },
              // 自定义按钮
              { value: item[toCamel(CKEY.CUSTOMER_BTN_TOOLBAR)], name: toCamel(CKEY.CUSTOMER_BTN_TOOLBAR) },
              { value: item[toCamel(CKEY.CUSTOMER_BTN_GRID_COL)], name: toCamel(CKEY.CUSTOMER_BTN_GRID_COL) },
              // Api
              { value: item[toCamel(CKEY.API_FORM_EDIT)], name: toCamel(CKEY.API_FORM_EDIT) },
              { value: item[toCamel(CKEY.API_FORM_QUERY)], name: toCamel(CKEY.API_FORM_QUERY) },
              { value: item[toCamel(CKEY.API_FORM_DELETE)], name: toCamel(CKEY.API_FORM_DELETE) },
              { value: item[toCamel(CKEY.API_GRID_QUERY)], name: toCamel(CKEY.API_GRID_QUERY) },
              { value: item[toCamel(CKEY.API_EXCEL_EXPORT)], name: toCamel(CKEY.API_EXCEL_EXPORT) },
              { value: item[toCamel(CKEY.API_EXCEL_IMPORT)], name: toCamel(CKEY.API_EXCEL_IMPORT) },
              { value: item[toCamel(CKEY.API_EXCEL_TEMPLATE)], name: toCamel(CKEY.API_EXCEL_TEMPLATE) },
            ]
          );
        });
        setDataItem(tmpData);
      }
    });
  }, []);
  const columnLabels = [
    '模块key',
    '模块名称',
    '数据字典',
    // 列表
    '列表序号',
    '列表边框',
    '列表首选项',
    // 列表列按钮
    '列表列编辑',
    '列表列删除',
    '列表列详情',
    // 工具栏按钮
    '增加',
    '删除',
    '编辑',
    '导入',
    '导出',
    '设置',
    '全屏',
    '刷新',
    '筛选',
    // 表单
    '布局',
    '宽度',
    // 自定义按钮
    '工具栏',
    '列表列',
    // api
    '保存',
    '查询表单',
    '删除',
    '查询列表',
    '导出',
    '导入',
    '模板下载',
  ];

  const onChange = (data: any) => {
    setDataItem(data);
  }

  const getData = () => {
    const arr: any = []
    dataItem.forEach((item: any) => {
      let obj: any = {}
      item.forEach((itemValue: any) => {
        obj = { ...obj, [itemValue.name]: itemValue.value }
      })
      arr.push(obj);
    });
    return arr;
  }

  useImperativeHandle(onRef, () => {
    return {
      getData,
    };
  });

  return (
    <>
      <div style={{overflowX: 'auto', overflowY: 'auto', height: '500px'}}>
        <Spreadsheet
          data={dataItem}
          columnLabels={columnLabels}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default Index;