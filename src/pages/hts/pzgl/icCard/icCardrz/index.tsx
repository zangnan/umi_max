// 海关IC卡操作日志
import React, {useRef} from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from './f'
import { history } from 'umi';

const index: React.FC<unknown> = () => {
  let myconfig  = {...config}; 

  const sh = history.location.search;
  if (sh && sh.indexOf("kakbm") > -1) {
    const search = history.location.search.replace('?', '').replace('kakbm=', '');
    myconfig.grid_filter_quick[0].defaultValue = decodeURI(search);  // 解码赋值
  } else {
    myconfig.grid_filter_quick[0].defaultValue = '';  // 解码赋值
  }

  return <>
    <DDBunit2 config={myconfig} func={Func} />
  </>
};
export default index;