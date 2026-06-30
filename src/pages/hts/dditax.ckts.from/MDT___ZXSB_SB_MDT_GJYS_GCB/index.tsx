/**
 * title: 跨境应税行为免退税申报明细
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f';
import { history } from 'umi';

const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  // 转换Input为InputNumber
  myConfig.form_items[9] = { label: '本次运输次数', name: 'bcyscs', type: 'InputNumber', rules: [{ type: 'base_number', length: 10, decimal: 0}]};
  myConfig.form_items[10] = { label: '自运舱单份数', name: 'zycdfs', type: 'InputNumber', rules: [{ type: 'base_number', length: 10, decimal: 0}]};
  myConfig.form_items[11] = { label: '自运提单（运单）份数或载客人数', name: 'zytdydfshzkrs', type: 'InputNumber', rules: [{ type: 'base_number', length: 10, decimal: 0}]};
  myConfig.form_items[27] =	{ label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 }}, rules: [{ type: 'base_string', range: [0, 200]}]};

  // 变千分位0,0
  const dataIndexRenderNum = ['bcyscs', 'zycdfs', 'zytdydfshzkrs'];
  myConfig.grid_columns.forEach((item: any) => {
    if (dataIndexRenderNum.length > 0 && dataIndexRenderNum.indexOf(item.dataIndex) > -1) {
      item.render = { type: 'number', format: '0,0' };
    }
  })
  myConfig.grid_columns_tj.forEach((item: any) => {
    if (dataIndexRenderNum.length > 0 && dataIndexRenderNum.indexOf(item.dataIndex) > -1) {
      item.render = { type: 'number', format: '0,0' };
    }
  }) 
  myConfig.form_items.forEach((item: any) => {
    if(item.name === 'cjhbzmDm') {
      item.eventOnChange = "hbhlDm";
    }
  })

  // 如果为数据管理查询页面CXTJ_
  if(history?.location?.pathname.indexOf('CXTJ_')>-1){
    myConfig.toolbar_default = {
      add: false, // 是否显示增加按钮，默认关闭
      edit: false, // 是否显示修改按钮，默认关闭
      delete: false, // 是否显示删除按钮，默认关闭
      setting: true, // 是否显示设置按钮，默认关闭
      reload: true, // 是否显示刷新按钮，默认关闭
      full: true, // 是否显示全屏按钮，默认关闭
      ckts_download: true, // 是否显示导出按钮，默认关闭
      upload: false,  // 是否显示导入按钮，默认关闭
      ckts_sum: false, // 是否显示小计按钮，默认关闭
      ckts_order: false, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
    };
  }


  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;