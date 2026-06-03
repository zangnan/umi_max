import React, { useRef } from 'react';
import myUtil from '@/pages/common/myUtil';
import moment from 'moment';

const Func: any = {
  unitRef: React.createRef(),
};

// 开启自定义Drawer
Func.renderSbbqd = (param: any) => {
  const otherRef = param.unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param);
  }
};

// 列表自定义渲染
Func.columnsRender = {
  renderTzBz: (param: any) => {
    if (param.text == 'Y') {
      return (
        <span>{'是'}</span>
      );
    } else {
      return (
        <span>{'否'}</span>
      );
    }
  },
  renderTzSbbz: (param: any) => {
    let reVal = '';
    if (param.text === 'Y') {
      reVal = '已申报'
    } else {
      reVal = '未申报';
    }
    return reVal;
  },
  renderTzShbz: (param: any) => {
    let reVal = '';
    if (param.text == 'Y') {
      reVal = '已审核'
    } else {
      reVal = '未审核';
    }
    return reVal;
  },
  // 税率两位
  renderTslIsNumber2: (param: any) => {
    let reVal = '';
    var re = /^[0-9]+.?[0-9]*$/;
    if (re.test(param.text)) {
      reVal = myUtil.grid.formatNum(param.text, '0,0.00');
    } else {
      reVal = param.text;
    }
    return reVal;
  },
  renderSjbbZzrq: (param: any) => {
    if(param.text == '-2209017600000' || !param.text){
      return <span></span>;
    } else {
      return <span>{moment(new Date(Number(param.text))).format('yyyy-MM-DD')}</span>;
    }
  },
}

export default Func;