import React from 'react';
import { Badge, Button } from 'antd';
import myUtil from '@/components/DDAssist/util';

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
  // 数据报表 退税情况 打开申报表清单 生产
  renderSjbbTsqkSbqd: (param: any) => {
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

}

export default Func;