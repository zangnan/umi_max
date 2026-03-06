import React, { useEffect, useState } from 'react';
import DDVTable from '../DDBaseGridVtable';
import { automaticPageDef } from '@/services/hts/api';
import assembleConfigUtil from './assemble_config_util';
import CONSTANTS from '../DDAssist/constants';
import { FloatButton } from 'antd';
import { CodeOutlined } from '@ant-design/icons';
import myUtil from '../DDAssist/util';
import { cloneDeep } from 'lodash';

const AutomaticPageVTable: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  // 配置转换函数：将 DDBunit2 格式转换为 DDVTable 格式
  const transformConfig = (config: any): any => {
    if (!config) return config;

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

      return {
        title: col.title,
        field: col.dataIndex || col.field,
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
        // 其他字段透传
        ...col,
      };
    });

    // 2. 转换 api_config
    const api_config = {
      api_grid_query: config.api_grid_query,
      api_form_query: config.api_form_query,
      api_form_edit: config.api_form_edit,
      api_form_delete: config.api_form_delete,
    };

    // 3. 转换 grid_config
    const grid_config = {
      grid_row_key: config.grid_row_key,
      grid_selection_type: config.grid_selection_type,
      grid_row_series_number: config.grid_show_serial_number,
    };

    // 4. 转换 form_config
    const form_config = {
      form_title: config.form_title,
      form_width: config.form_width,
      form_layout_type: config.form_layout_type,
    };

    // 删除不需要的配置节点
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

    return {
      ...config,
      grid_columns,
      api_config,
      grid_config,
      form_config,
      // 删除旧字段，避免冗余
      api_grid_query: undefined,
      api_form_query: undefined,
      api_form_edit: undefined,
      api_form_delete: undefined,
      grid_row_key: undefined,
      grid_selection_type: undefined,
      grid_show_serial_number: undefined,
    };
  };

  // setContent
  const setContent = (param: any) => {
    let { text, json } = param;
    if (text || json) {
      let tmpJsonObj = json || JSON.parse(text);
      setMyConfig(cloneDeep(tmpJsonObj));
    }
  }

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
    let response1: any = await automaticPageDef(module_key);
    if (response1.code === '200') {
      let leafArr: any = await myUtil.module.getLeafConfig(response1.body.appTableDict || [], 'leaf:');
      let relArr: any = await myUtil.module.getLeafConfig(response1.body.appTableDict || [], 'rel:');
      let relArr2: any = await myUtil.module.getLeafConfig(response1.body.appTableDict || [], 'rel2:');
      let tmpConfig = assembleConfigUtil.module.assembleAll({
        moduleInfo: response1.body.moduleInfo,
        appTableDict: response1.body.appTableDict,
        leaf: leafArr,
        rel: relArr,
        rel2: relArr2,
      });
      tmpConfig.gridParams = {
        pagination: {
          ...CONSTANTS.GRID_PAGINATION,
          pageSize: myUtil.theme.getThemeItem('gridPaginationPagesize'),
        }
      };
      // console.log("🚀 ~ init ~ tmpConfig:")
      // console.log(JSON.stringify(tmpConfig))
      setMyConfig(transformConfig(tmpConfig));
    }
  }

  useEffect(() => {
    init();
  }, [window.location.href]);

  return <>
    <DDVTable config={myConfig} />
    <FloatButton.Group style={{ right: 24 }} >
      <FloatButton tooltip='查看配置文件' onClick={(showModal)} icon={<CodeOutlined />}/>
    </FloatButton.Group>
  </>;
};

export default AutomaticPageVTable;
