/**
 * title: 出口货物转内销证明
 * author: wx
 */
import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
import FpscMx from '@/pages/hts/commonModule/fpscmx/fpscmx';
import { history } from 'umi';

const index: React.FC<unknown> = () => {

  const fpScmxRef: any = useRef(); // 发票生成明细

  const myConfig = { ...config };
  myConfig.api_form_delete = `/saas/qttms/zmsb/deleteCkznxMx`;
  myConfig.api_form_edit=`/saas/qttms/zmsb/saveCkznxMx`;
  myConfig.form_api_save_upload = `/saas/qttms/zmsb/saveCkznxMx`;

  myConfig.form_items.push({ label: '操作类型', name: 'czlx', type: 'Hidden', readOnly: true});
  myConfig.form_items.push({ label: '行号', name: 'hh', type: 'Hidden', readOnly: true});

  // 配置项：自定义工具栏
  myConfig.customer_toolbar = [
    { name: '发票生成明细', key: 'fpscmx', func: 'fpscmx' },
  ];

  const dataIndexellipsis = ['yghpzh'];
  const dataIndexWidth = ['nxkprq', 'nxsl'];  // 增加宽度
  myConfig.grid_columns.forEach((item: any) => {
    if (dataIndexellipsis.length > 0 && dataIndexellipsis.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
    if (dataIndexWidth.length > 0 && dataIndexWidth.indexOf(item.dataIndex) > -1) {
      item.width = 170;
    }
  })
  myConfig.grid_columns_tj.forEach((item: any) => {
    if (dataIndexellipsis.length > 0 && dataIndexellipsis.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
    if (dataIndexWidth.length > 0 && dataIndexWidth.indexOf(item.dataIndex) > -1) {
      item.width = 170;
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

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(fpScmxRef);  // 发票生成明细
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <FpscMx onRef={fpScmxRef} />
  </>
};
export default index;