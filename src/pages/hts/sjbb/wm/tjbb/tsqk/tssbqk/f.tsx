import React from 'react';
import {Badge, Button} from 'antd';
import myUtil from '@/components/DDAssist/util';
import moment from 'moment';

const Func: any = {
  refUnit: React.createRef(),
};

// 开启自定义Drawer
Func.renderSbbqd = (param: any) => {
  const otherRef = param.refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param);
  }
};


// 列表自定义渲染
Func.columnsRender = {
  // 数据报表-退税状态
  renderSjbbTsqk: (param: any) => {
    let col: any = <></>;
     if (param.text === '2') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="error" />待申报
        </span>
      );
    } else if (param.text === '3') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="default" />已申报
        </span>
      );
    } else if (param.text === '4') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" />已退税
        </span>
      );
    }
    return col;
  },
  // 数据报表 退税情况 打开申报表清单 外贸
  renderSjbbTsqkSbqdWm: (param: any) => {
    if (param.text) {
      return (
        <Button type="link" onClick={() => { Func.renderSbbqd(param) }}>
          {myUtil.text.formatNum(param.text, '0,0')}
        </Button>
      );
    } else {
      return (
        <span> {myUtil.text.formatNum(param.text, '0,0')} </span>
      );
    }
  },
  renderSjbbZzrq: (param: any) => {
    if(param.text == '-2209017600000' || !param.text){
      return <span></span>;
    } else {
      return <span>{moment(new Date(Number(param.text))).format('yyyy-MM-DD')}</span>;
    }
  },
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