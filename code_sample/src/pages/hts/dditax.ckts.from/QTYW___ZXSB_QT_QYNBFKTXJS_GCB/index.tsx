/**
 * title: 内部风险控制体系建设情况报告
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './auto_config';
import Func from './f'
import { cloneDeep } from 'lodash';
const index: React.FC<unknown> = () => {

  const myConfig = cloneDeep(config);
  // myConfig.form_items.map((item: any) => {
  //   if (
  //     item.label === '制度建设情况' || 
  //     item.label === '风险系统情况' ||
  //     item.label === '风评标准及方法' ||
  //     item.label === '机构及人员情况' ||
  //     item.label === '附送材料清单' ||
  //     item.label === '备注'
  //   ) {
  //     item.rules.push({ type: 'base_type_ESC' });
  //   }
  // })
  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;