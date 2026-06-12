import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { message } from 'antd';
import cktsUtil from '@/pages/hts/cktsUtil';

const Func: any = {
  refUnit: React.createRef(),
};

Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
}

export default Func;
