import React from 'react';
import myUtil from '@/components/DDAssist/util';

const failFunc: any = {
  refUnit: React.createRef(),
};
failFunc.columnsRender= {
  renderZnpdSdFd: (param: any) => {
    const record = param?.record;
    if (String(record?.fdQnt)?.trim() && record?.fdUnit?.trim()) {
      return myUtil.grid.formatNum(record.fdQnt, '0,0.00000') + '/' + record.fdUnit;
    } else {
      return '';
    }
  },
  renderZnpdSdCj: (param: any) => {
    const record = param?.record;
    if (String(record?.cjQnt).trim() && record?.cjUnit?.trim()) {
      return myUtil.grid.formatNum(record.cjQnt, '0,0.00000') + '/' + record.cjUnit;
    } else {
      return '';
    }
  },
  renderZnpdSdDe: (param: any) => {
    const record = param?.record;
    if (String(record?.fd2Qnt).trim() && record?.fd2Unit?.trim()) {
      return myUtil.grid.formatNum(record.fd2Qnt, '0,0.00000') + '/' + record.fd2Unit;
    } else {
      return '';
    }
  },
};
export default failFunc;