/**
 * title: 跨境应税行为免退税申报明细
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f';
import { history } from 'umi';

const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  // 所属期改为申报年月
  myConfig.grid_columns[0].title = "申报年月"
  myConfig.filter_items[1].label = "申报年月"
   
  myConfig.grid_columns_tj[9].hidden = true; // bug: 18950 审核意见字段隐藏
  myConfig.grid_columns_tj[7].width = 200; // bug: 18950 审核意见字段隐藏

  myConfig.grid_columns_tj[5].dataIndex = 'gfnsrsbh';
  myConfig.grid_columns_tj[6].dataIndex = 'xfnsrsbh';
  myConfig.grid_columns_tj[7].dataIndex = 'zyjkshm';

  // myConfig.form_items[8].eventOnChange = 'zyjkshm';
  myConfig.form_items[10].rules = [
    { type: 'base_type_number_english' },
    { func: 'validatorJljgszch'},
    // { type: 'base_string', range: ['15', '20']}
  ];

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