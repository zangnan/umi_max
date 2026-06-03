/**
 * title: 跨境应税行为免退税申报明细
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './auto_config';
import Func from './f';
import { history } from 'umi';

const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  // 表单项-备注-添加最大输入长度200
  myConfig.form_items[33] = { label: '备注', name: 'bz', type: 'TextArea', maxlength: 200, autoSize: { minRows: 2, maxRows: 2 }, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } } };

  // 补充悬浮
  const dataIndex = ['hth', 'cktszmbh', 'cktmsywlxmcjh'];
  myConfig.grid_columns.forEach((item: any) => {
    if (dataIndex.length > 0 && dataIndex.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
  })
  myConfig.grid_columns_tj.forEach((item: any) => {
    if (dataIndex.length > 0 && dataIndex.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
  })
  // 筛选项
  myConfig.filter_items = [
    { name: 'hth', label: '合同号', type: 'Input' },
    { name: 'ysfwDm', label: '跨境销售服务及无形资产代码', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['url_ckts_ysfwdm',  '01'] },
    { name: 'sbpc', label: '申报批次', type: 'Input' },
    { name: 'ssq', label: '申报年月', type: 'Input' },
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

  myConfig.toolbar_default.tssb_download = true;
  myConfig.toolbar_default.ckts_download = false;

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;