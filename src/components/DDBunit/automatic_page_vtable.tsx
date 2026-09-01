import React, { useEffect, useState } from 'react';
import DDVTable from '../DDBaseGridVtable';
import { DDVTableProps } from '../DDBaseGridVtable/types';
import { automaticPageDef } from '@/services/hts/api';
import assembleConfigUtil from './assemble_config_util';
// import CONSTANTS from '../DDAssist/constants';
import { FloatButton, message } from 'antd';
import { CodeOutlined } from '@ant-design/icons';
import myUtil from '../DDAssist/util';
import { cloneDeep } from 'lodash';

/**
 * 将 assemble_config_util 装配后的 DDBunit2 格式配置
 * 转换为 DDVTableConfig 格式，供 DDBaseGridVtable 使用
 *
 * 输入（assembleAll 输出）：
 *   - grid_columns: { dataIndex, sorter, sum2/min2/max2/avg2, codeTable, render, ... }
 *   - api_grid_query / api_form_query / api_form_edit / api_form_delete
 *   - grid_row_key / grid_selection_type / grid_show_serial_number
 *   - form_title / form_width / form_layout_type
 *   - toolbar_default / grid_handle_columns_default
 *   - filter_items / form_items / module_key
 *
 * 输出（DDVTableConfig 形态）：
 *   - grid_columns: { field, sort, sum/min/max/avg, filter, render, ... }
 *   - api_config: { api_grid_query, api_form_query, api_form_edit, api_form_delete }
 *   - grid_config: { grid_row_key, grid_selection_type, grid_row_series_number, grid_title, ... }
 *   - form_config: { form_title, form_width, form_layout_type }
 *   - toolbar_default / grid_handle_columns_default（透传）
 *   - filter_items / form_items / module_key（透传）
 */
export const transformConfig = (config: any): any => {
  if (!config) return config;

  // 提取 filter_items 中的 name 字段集合，用于自动配置列的 filter
  const filterFieldSet = new Set((config.filter_items || []).map((item: any) => item.name));

  // 1. 转换 grid_columns：dataIndex -> field, sorter -> sort, sum2->sum 等
  const grid_columns = (config.grid_columns || []).map((col: any) => {
    // 转换统计字段：sum2->sum, min2->min, max2->max, avg2->avg
    const sum = !!col.sum2 || !!col.sum;
    const min = !!col.min2 || !!col.min;
    const max = !!col.max2 || !!col.max;
    const avg = !!col.avg2 || !!col.avg;

    // 转换 codeTable 为 render 格式
    const render = col.codeTable
      ? { type: 'code_table', key: col.codeTable }
      : col.render;

    // 获取列字段名，用于匹配 filter_items
    const field = col.dataIndex || col.field;
    // 判断该列是否在 filter_items 中存在相同名称的字段
    const isInFilterItems = filterFieldSet.has(field);
    // 如果在 filter_items 中存在且未显式配置 filter，则自动添加 filter: true
    const autoFilter = isInFilterItems && col.filter === undefined ? true : col.filter;

    return {
      title: col.title,
      field,
      width: col.width,
      sort: !!col.sorter,
      hidden: col.hidden,
      ellipsis: col.ellipsis,
      align: col.align,
      sum,
      min,
      max,
      avg,
      render,
      filter: autoFilter,
      // 其他字段透传
      ...col,
    };
  });

  let newConfig = {
    ...config,
    grid_columns,
    // 2. 转换 api_config
    api_config: {
      api_grid_query: config.api_grid_query,
      api_form_query: config.api_form_query,
      api_form_edit: config.api_form_edit,
      api_form_delete: config.api_form_delete,
    },
    // 3. 转换 grid_config
    grid_config: {
      grid_row_key: config.grid_row_key,
      grid_selection_type: config.grid_selection_type,
      grid_row_series_number: config.grid_show_serial_number,
      grid_title: config.grid_title || config.module_name,
    },
    // 4. 转换 form_config
    form_config: {
      form_title: config.form_title || config.module_name,
      form_width: config.form_width,
      form_layout_type: config.form_layout_type,
    },
    // 删除旧字段，避免冗余
    api_grid_query: undefined,
    api_form_query: undefined,
    api_form_edit: undefined,
    api_form_delete: undefined,
    grid_row_key: undefined,
    grid_selection_type: undefined,
    grid_show_serial_number: undefined,
  };

  // 删除不需要的配置节点（注意：该操作会修改入参，因 assembleAll 每次返回新对象，这里安全）
  delete config.form_title;
  delete config.form_layout_type;
  delete config.form_width;
  delete config.form_submit_type;
  delete config.api_excel_export;
  delete config.api_excel_import;
  delete config.api_excel_template;
  delete config.grid_title;
  delete config.grid_filter_quick;
  delete config.grid_list_card_field;
  delete config.gridParams;
  delete config.grid_ext;

  return newConfig;
};

const AutomaticPageVTable: React.FC<{ onCustomBtn?: DDVTableProps['onCustomBtn'] }> = ({ onCustomBtn }) => {
  const [myConfig, setMyConfig] = useState<any>({});

  // setContent
  const setContent = (param: any) => {
    let { text, json } = param;
    if (text || json) {
      let tmpJsonObj = json || JSON.parse(text);
      setMyConfig(cloneDeep(tmpJsonObj));
    }
  };

  // json编辑
  const showModal = () => {
    myUtil.modal.viewJson({
      data: { ...myConfig },
      onChange: setContent,
    });
  };

  const init = async () => {
    // 1、匹配url， 用于直接配置到routes  格式: /cfgp/test_app_mts_tsjh_tssb
    // 2、匹配url， 用于匹配模块预览      格式: /easy_dev/agility/cfgp?key=${appModulePath}
    const tmpUrl = window.location.href;
    let module_key = '';
    if (tmpUrl.indexOf('?') > -1) {
      const tmp = tmpUrl.split('?key=');
      module_key = tmp.length > 1 ? tmp[1] : '';
    } else {
      const tmp = tmpUrl.split('cfgp/');
      module_key = tmp.length > 1 ? tmp[1] : '';
    }
    try {
      const response1: any = await automaticPageDef(module_key);
      if (response1?.code !== '200') {
        message.error(`配置加载失败：${response1?.msg || '未知错误'}`);
        return;
      }
      const [leafArr, relArr, relArr2] = await Promise.all([
        myUtil.module.getLeafConfig(response1.body.appTableDict || [], 'leaf:'),
        myUtil.module.getLeafConfig(response1.body.appTableDict || [], 'rel:'),
        myUtil.module.getLeafConfig(response1.body.appTableDict || [], 'rel2:'),
      ]);
      const tmpConfig = assembleConfigUtil.module.assembleAll({
        moduleInfo: response1.body.moduleInfo,
        appTableDict: response1.body.appTableDict,
        leaf: leafArr,
        rel: relArr,
        rel2: relArr2,
      });
      // tmpConfig.gridParams = {
      //   pagination: {
      //     ...CONSTANTS.GRID_PAGINATION,
      //     pageSize: myUtil.theme.getThemeItem('gridPaginationPagesize'),
      //   },
      // };
      setMyConfig(transformConfig(tmpConfig));
    } catch (err: any) {
      message.error(`配置请求异常：${err?.message || err}`);
    }
  };

  useEffect(() => {
    init();
  }, [window.location.href]);

  return (
    <>
      <DDVTable key={myConfig?.module_key} config={myConfig} onCustomBtn={onCustomBtn} />
      <FloatButton.Group style={{ right: 24 }}>
        <FloatButton tooltip="查看配置文件" onClick={showModal} icon={<CodeOutlined />} />
      </FloatButton.Group>
    </>
  );
};

export default AutomaticPageVTable;
