/**
 * title: 企业撤回退（免）税申报申请表
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  myConfig.form_items[11].eventOnBlur = 'sbxh'; // ysbxh原申报序号自动补零


  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;