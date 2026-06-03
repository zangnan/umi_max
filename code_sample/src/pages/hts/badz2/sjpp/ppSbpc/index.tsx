/**
 * title: 备案单证目录
 */
import React from 'react';
import '../../style.less';

import Htcx from '../../common/htcx';


export type BadzylModal = {
  mainParams?: any;
}

const BadzylModal: React.FC<BadzylModal> = ({
  mainParams
}) => {
  return (
    <>
      <Htcx mainParams={mainParams} type={'matching'} />
    </>
  )
};

export default BadzylModal;
