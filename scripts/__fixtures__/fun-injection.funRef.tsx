import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { querySjByHth, queryHlxx } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import moment from 'moment';
import DDAlert from '@/components/DDAlert';
import importStyle from './importStyle.less';
import tableStyle from './style.less';
import { intl as intl2 } from '@/pages/common/myUtil';
import getStaticTableCode from '@/pages/common/staticTableCode';
import baseValidator from '@/pages/common/field/baseValidator';
import { history, useRouteMatch } from 'umi';
import cjpzUtil from '@/pages/common/cjpzUtil';

const Func: any = {};

Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
};

export default Func;
