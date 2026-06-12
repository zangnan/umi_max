import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { getCmCode, queryCjCsh, queryCjGlh, queryFpWzxx, queryMdtCkxxByGlh, queryMdtGlhBySsq } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import {message} from 'antd';
import dayjs from 'dayjs';
import {history} from 'umi';

const Func: any = {
  refUnit: React.createRef(),
};

Func.initAddForm = (param: any) => {
  param.doSuccess = (res: any) => {
    queryMdtGlhBySsqFunc(param, res?.body, 'add');
  };
  param.form.setFieldsValue({sz: 'V'});
  param.form.setFieldsValue({cktmspzlxDm: '02'});
  DditCktsFormCommonFunc.initAddForm(param);
};

export default Func;
