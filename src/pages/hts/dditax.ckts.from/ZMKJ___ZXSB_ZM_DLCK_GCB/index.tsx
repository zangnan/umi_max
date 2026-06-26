/**
 * title: 代理出口货物证明申请表
 * author: wx
 */
import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import sjglConfig from './sjglConfig';
import Func from './f'
import BgdscMx from '@/pages/hts/commonModule/scmx/scmx';
import { history,useAccess } from 'umi';

const index: React.FC<unknown> = () => {
  Func.access = useAccess(); // 权限

  const bgdScmxRef: any = useRef(); // 报关单生成明细
  // 单一窗口切换查询列
  let myConfig = { ...config };
  // if(history?.location?.pathname.indexOf('CXTJ_02070907') > -1) {
  //   myConfig = sjglConfig;
  // } else {
    myConfig.api_form_edit = `/yw/bszx/zmkj/dlck/updateDlck`; // api 表单更新
    myConfig.form_api_save_upload= `/yw/bszx/zmkj/dlck/updateDlck`; // api 表单更新
    myConfig.api_form_delete = `/yw/bszx/zmkj/dlck/deleteDlck`; // api 表单删除
    // 配置项：自定义工具栏
    myConfig.customer_toolbar = [
      { name: '报关单生成明细', key: 'bgdscmx', func: 'bgdscmx' },
    ];
    // 表单项-委托方纳税人识别号（统一社会信用代码）-特殊业务（下拉和手动录入都可以）-将Select替换为AutoComplete控件，并把onChange替换为blur
    myConfig.form_items[7] = { label: '委托方纳税人识别号（统一社会信用代码）', name: 'wtfnsrsbh', type: 'AutoComplete', showType: '2', codeTable: 'url_gy_qywtf:01', rules: [{ type: 'base_required' }, { type: 'base_type_number_english' }, { type: 'base_string', range: ['15', '20']}, { func: 'wtfnsrsbh01' }], eventOnBlur: 'wtfnsrsbh' };
    // 表单项-出口商品代码添加blur事件
    myConfig.form_items[17] = 	{ label: '出口商品代码', name: 'ckspDm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'dlckCksp' }, { type: 'base_string', range: [0, 10]}]},
    // 成交币制添加onchange事件
    myConfig.form_items[21] = { label: '成交币制', name: 'hbzmDm', type: 'AutoComplete', showType: '3', 'allowClear': true, codeTable: 'url_gy_hbhl:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 3]}], eventOnBlur: 'hbhlDm', eventOnFocus: 'hbhlDm', eventOnChange: 'hbhlDm' },

    // 导入
    myConfig.import_key = 'SAAS_QTTMS_ZMSB_DLCK_DR';
    myConfig.toolbar_default.tssb_download = true;
    myConfig.toolbar_default.ckts_download = false;
  // }

  // 列表宽度修正
  const dataIndexwidth = ['wtdlckhth'];
  myConfig.grid_columns.forEach((item: any) => {
    if (dataIndexwidth.length > 0 && dataIndexwidth.indexOf(item.dataIndex) > -1) {
      item.width = 180;
    }
  })
  myConfig.grid_columns_tj.forEach((item: any) => {
    if (dataIndexwidth.length > 0 && dataIndexwidth.indexOf(item.dataIndex) > -1) {
      item.width = 180;
    }
  })

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(bgdScmxRef);  // 报关单生成明细
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <BgdscMx onRef={bgdScmxRef} />
  </>
};
export default index;
