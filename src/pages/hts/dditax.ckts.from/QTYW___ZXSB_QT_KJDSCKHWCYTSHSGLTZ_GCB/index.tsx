/**
 * title: 跨境电商出口海外仓预退税核算管理台账
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
import { cloneDeep } from 'lodash';
const index: React.FC<unknown> = () => {

  const myConfig = cloneDeep(config);
   // 配置项：自定义工具栏
  myConfig.customer_toolbar = [
    {name: '转入确认表', key: 'zrqrb', func: 'zrqrb'},
  ];
  myConfig.toolbar_default.tssb_download = true;
  myConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
  myConfig.toolbar_default.ckts_download = false;

  const cs: any = {};
  for (let i = 0; i < myConfig.filter_items.length; i++) {
      if (myConfig.filter_items[i].name ==='ytshsjzr1') {
        myConfig.filter_items[i].defaultValue = cs[myConfig.filter_items[i].name];
      }
    }
  myConfig.gridParams = {
    initSearchModal : [
      { property: 'ckny', value: cs.ytshsjzr1, op: 'zdy' }
    ]
  };
  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;