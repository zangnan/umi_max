import React from 'react';
import myUtil from '@/pages/common/myUtil';
import { history } from 'umi';

const Func: any = {
  unitRef: React.createRef(),
};

// 配置项：快捷筛选
Func.handleOnChangeBgd = (param: any) => {
  const { value } = param;
  // 设置按钮屏蔽
  if (value == '1') {
    history.push('/hts/sjbb/sc/tjbb/tsqk/zbblmxcx');
  }else  if (value == '2') {
    history.push('/hts/sjbb/sc/tjbb/tsqk/zbblmxcxsb');
  } else {
    history.push('/hts/sjbb/sc/tjbb/tsqk/zbblmxcxkj');
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
}




export default Func;