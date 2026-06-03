/**
 * title: 出口货物已补税/未退税证明
 * author: wx
 */
import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './auto_config';
import BgdscMx from '@/pages/hts/commonModule/bgdscmx/bgdscmx';
import Func from './f'
import {useRouteMatch} from "umi";
import {cloneDeep} from "lodash";

const index: React.FC<unknown> = () => {

  const BgdScxRef: any = useRef(); // 报关单生成明细

  const myConfig = cloneDeep(config);

  myConfig.form_api_delete = `${API_URL_BASE}/saas/qttms/zmsb/deleteYbsWtsMx`;
  myConfig.form_api_save=`${API_URL_BASE}/saas/qttms/zmsb/saveYbsWtsMx`;
  myConfig.form_api_save_upload = `${API_URL_BASE}/saas/qttms/zmsb/saveYbsWtsMx`;

  myConfig.form_items.push({ label: '操作类型', name: 'czlx', type: 'Hidden', readOnly: true});

  // 导入
  myConfig.import_key = 'SAAS_QTTMS_ZMSB_TYYBSWTS_DR';
  myConfig.toolbar_default.tssb_download = true;
  myConfig.toolbar_default.ckts_download = false;

  // 配置项：自定义工具栏
  myConfig.costomer_toobar = [
    { name: '报关单生成明细', key: 'bgdscmx', func: 'bgdscmx' },
  ];

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(BgdScxRef);  // 报关单生成明细
    return otherRef;
  };
  const routeMatch = useRouteMatch();
  if (routeMatch?.path.indexOf('/020709/CXTJ_02070910') < 0) {
    const filter_items = myConfig.filter_items.filter((file: any) => file?.name !== 'cktszmbh');
    myConfig.filter_items = filter_items;
  }
  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <BgdscMx onRef={BgdScxRef} />
  </>
};
export default index;
