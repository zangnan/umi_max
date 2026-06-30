import React from 'react';
import { Button } from 'antd';
import myUtil from '@/components/DDAssist/util';

const Func: any = {
  unitRef: React.createRef(),
};

// 下钻
Func.openDrawer = (param: any, unitKey: any,flag:any) => {
  const searchModel = myUtil.localStore.getItem(unitKey) || [];
  let initSearchModal: any = [];
  initSearchModal = [
    searchModel[0],
    searchModel[1],
    { property: 'ckhth', value: param.record.ckhth, op: 'zdy' },
    { property: "xzbz", value: flag, op: "zdy"}
  ];
  const otherRef = param.unitRef.current?.getOtherRefs();
  let tstj = '';
  if(flag === '3') {
    // 未开具出口发票
    tstj = 'wkjckfp'
  }
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param, initSearchModal,searchModel, tstj);
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param, initSearchModal,searchModel, tstj);
  }
}

Func.afterReload = (param: any) => {
  const searchModel = param.unitRef?.current?.getGridParams().searchModel;
  const key = param?.unitRef?.current?.getGridParams()?.key;
  if(!key){
    return;
  }
  if (searchModel?.length > 0) {
    myUtil.localStore.setItem(key, searchModel);
  }
};

// 列表自定义渲染
Func.columnsRender = {
    //未申报
  renderFzxmBywsb: (param: any) => {
    if(param.text == 0 || param.text == '0'){
      return param.text;
    }
    if (param.text) {
      const key = param.unitRef?.current?.getGridParams().key;
      return (
        <Button type="link" onClick={() => { Func.openDrawer(param, key, '2')  }}>
          {myUtil.text.formatNum(param.text, '0,0')}
        </Button>
      );
    } else {
      return (
        <span> {myUtil.text.formatNum(param.text, '0,0')} </span>
      );
    }
  },
 //信息不齐
 renderFzxmXxbq: (param: any) => {
  if(param.text == 0 || param.text == '0'){
    return param.text;
  }
  if (param.text) {
    const key = param.unitRef?.current?.getGridParams().key;
    return (
      <Button type="link" onClick={() => { Func.openDrawer(param, key, '1')  }}>
        {myUtil.text.formatNum(param.text, '0,0')}
      </Button>
    );
  } else {
    return (
      <span> {myUtil.text.formatNum(param.text, '0,0')} </span>
    );
  }
},
 //未开具出口发票（条）
 renderFzxmWkj: (param: any) => {
  if(param.text == 0 || param.text == '0'){
    return param.text;
  }
  if (param.text) {
    const key = param.unitRef?.current?.getGridParams().key;
    return (
      <Button type="link" onClick={() => { Func.openDrawer(param, key, '3')  }}>
        {myUtil.text.formatNum(param.text, '0,0')}
      </Button>
    );
  } else {
    return (
      <span> {myUtil.text.formatNum(param.text, '0,0')} </span>
    );
  }
}
,
 //征税或免税（条）
 renderFzxmZsms: (param: any) => {
  if(param.text == 0 || param.text == '0'){
    return param.text;
  }
  if (param.text) {
    const key = param.unitRef?.current?.getGridParams().key;
    return (
      <Button type="link" onClick={() => { Func.openDrawer(param, key, '4')  }}>
        {myUtil.text.formatNum(param.text, '0,0')}
      </Button>
    );
  } else {
    return (
      <span> {myUtil.text.formatNum(param.text, '0,0')} </span>
    );
  }
}
}
export default Func;