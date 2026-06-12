import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { querySjByHth, queryHlxx } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import dayjs from 'dayjs';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import { intl as intl2 } from '@/components/DDAssist/util';
import getStaticTableCode from '@/components/DDAssist/staticTableCode';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import { history, useRouteData } from 'umi';
import cktsUtil from '@/pages/hts/cktsUtil';

const Func: any = {
  refUnit: React.createRef(),
};

Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
};

export default Func;
