import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './auto_config';
import Func from './auto_configFun';

const Unit: React.FC<unknown> = () => {
  // 改变默认配置项
  const myConfig = { ...unitConfig };
  myConfig.form_items[17].rules = [{ type: 'base_string', range: [0, 200]}];
  const dataIndexellipsis = ['hjbh'];
  myConfig.grid_columns.forEach((item: any) => {
    if (dataIndexellipsis.length > 0 && dataIndexellipsis.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
    if(item.dataIndex === 'kjrq') {
      item.width = 140;
    }
  })
  myConfig.grid_columns_tj.forEach((item: any) => {
    if (dataIndexellipsis.length > 0 && dataIndexellipsis.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
    if(item.dataIndex === 'kjrq') {
      item.width = 140;
    }
    if(item.dataIndex === 'cjzj') {
      item.align = 'right';
    }
  })
  myConfig.form_items.forEach((item: any) => {
    if(item.name === 'cjhbzmDm') {
      item.eventOnChange = 'hbhlDm';
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
  </>;
};
export default Unit;
