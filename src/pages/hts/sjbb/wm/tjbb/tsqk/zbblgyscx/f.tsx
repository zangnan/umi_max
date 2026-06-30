import React from 'react';
import myUtil from '@/components/DDAssist/util';
import Button from 'antd/es/button';

const Func: any = {
  unitRef: React.createRef(),
};

Func.openMxzs = (param: any, flag: any) => {
  const otherRef = param.unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param, flag);
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param, flag);
  }
};

Func.openWfkMxzs = (param: any, flag: any) => {
  const otherRef = param.unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal(param, flag);
  } else if (param.otherRef && param.otherRef[1]) {
    param.otherRef[1].current?.showModal(param, flag);
  }
}

// 列表自定义渲染
Func.columnsRender = {
  renderCkmxzs: (param: any) => {
    if (param.text) {
      return <Button type='link' onClick={() => Func.openMxzs(param, "CKMX")}>{myUtil.text.formatNum(param.text, '0,0')}</Button>
    } else {
      return < span > {myUtil.text.formatNum(param.text, '0,0')}</span >
    }
  },
  renderJhmxzs: (param: any) => {
    if (param.text) {
      return <Button type='link' onClick={() => Func.openMxzs(param, "JHMX")}>{myUtil.text.formatNum(param.text, '0,0')}</Button>
    } else {
      return < span > {myUtil.text.formatNum(param.text, '0,0')}</span >
    }
  },
  renderWfkCkmxzs: (param: any) => {
    if (param.text) {
      return <Button type='link' onClick={() => Func.openWfkMxzs(param, "CKMX")}>{myUtil.text.formatNum(param.text, '0,0')}</Button>
    } else {
      return < span > {myUtil.text.formatNum(param.text, '0,0')}</span >
    }
  },
  renderWfkJhmxzs: (param: any) => {
    if (param.text) {
      return <Button type='link' onClick={() => Func.openWfkMxzs(param, "JHMX")}>{myUtil.text.formatNum(param.text, '0,0')}</Button>
    } else {
      return < span > {myUtil.text.formatNum(param.text, '0,0')}</span >
    }
  },
}

export default Func;