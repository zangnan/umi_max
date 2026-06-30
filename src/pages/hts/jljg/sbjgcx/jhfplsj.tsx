/**
 * title: 申报结果查询的计划分配率数据
 * creator: zxy
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import jhfplsjConfig from './jhfplsjconfig';
import Func from './f';
import { useIntl } from 'umi';
const Mdthx: React.FC<unknown> = () => {
  Func.init = useIntl();
  return <DDBunit2 config={jhfplsjConfig} func={Func} />;
};

export default Mdthx;