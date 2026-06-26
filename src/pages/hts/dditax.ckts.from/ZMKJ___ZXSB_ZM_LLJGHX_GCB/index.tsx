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
  // 表单项-加工企业统一社会信用代码/纳税人识别号-特殊业务（下拉和手动录入都可以）-将Select替换为AutoComplete控件，并把onChange替换为blur
  // myConfig.form_items[8] = { label: '加工企业统一社会信用代码/纳税人识别号', name: 'jgqynsrsbh', type: 'AutoComplete', showType: '2', codeTable: 'url_gy_qywtf:01', rules: [{ type: 'base_required' }, { type: 'base_type_number_english' }, { type: 'base_string', range: ['15', '20']}, { func: 'jgqynsrsbh01' }], eventOnBlur: 'jgqynsrsbh' };
  // const lljgmshxzmbh:any = myConfig.grid_columns_tj[21] || {};
  // lljgmshxzmbh.hidden = true;

  const dataIndexellipsis = ['jldwmc'];
  myConfig.grid_columns.forEach((item: any) => {
    if (dataIndexellipsis.length > 0 && dataIndexellipsis.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
  })
  myConfig.grid_columns_tj.forEach((item: any) => {
    if (dataIndexellipsis.length > 0 && dataIndexellipsis.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
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
