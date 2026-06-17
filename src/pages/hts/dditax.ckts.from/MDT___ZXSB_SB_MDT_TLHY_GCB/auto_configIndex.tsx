import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './auto_config';
import Func from './auto_configFun';

const Unit: React.FC<unknown> = () => {
  // 改变默认配置项
  const myConfig = { ...unitConfig };
  myConfig.form_items[14] =	{ label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }, rules: [{ type: 'base_string', range: [0, 200]}]};
  
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
