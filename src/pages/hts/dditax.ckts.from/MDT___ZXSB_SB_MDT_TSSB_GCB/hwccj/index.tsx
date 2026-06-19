import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from './f'
import {cloneDeep} from 'lodash';


export type HwcjProps = {
  closeHwccj: any;
  getKey: any
}

const index: React.FC<HwcjProps> = ({
                                      closeHwccj,
                                    }) => {
  const myConfig = cloneDeep(config);
  const handleClick = () => closeHwccj();  // ✅ 直接调用
  Func.handleClick = handleClick;

  return <>
    <DDBunit2 config={myConfig} func={Func}/>
  </>
};
export default index;
