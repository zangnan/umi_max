import React from 'react';
import { Button } from 'antd';
import myUtil from '@/pages/common/myUtil';

const Func: any = {
  unitRef: React.createRef(),
};

// 下钻
Func.openDrawer = (param: any, unitKey: any,flag:any) => {
  const searchModel = myUtil.localStore.getItem(unitKey) || [];
  let initSearchModal: any = [];
  initSearchModal = [
    { property: 'ckny', value: param.record.ckny, op: 'zdy' },
    { property: "xzbz", value: flag, op: "zdy"}
  ];
  const otherRef = param.unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param, initSearchModal,searchModel);
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param, initSearchModal,searchModel);
  }
}

Func.afterReload = (param: any) => {
  const searchModel = param.unitRef.current?.getGridParams().searchModel;
  const key = param.unitRef.current?.getGridParams().key;
  if (searchModel.length > 0) {
    myUtil.localStore.setItem(key, searchModel);
  }
};

// 列表自定义渲染
Func.columnsRender = {
   // 信息不齐
   rendersjbbscBgdMylaj: (param: any) => {
    if(param.text == 0 || param.text == '0'){
      return param.text;
    }
    const key = param.unitRef.current?.getGridParams().key;
    return (
      <Button type="link" onClick={() => { Func.openDrawer(param, key,1) }}>
        {myUtil.text.formatNum(param.text, '0,0')}
      </Button>
    );
  },
  // 未申报
  rendersjbbscBgdWsb: (param: any) => {
    if(param.text == 0 || param.text == '0'){
      return param.text;
    }
      const key = param.unitRef.current?.getGridParams().key;
      return (
        <Button type="link" onClick={() => { Func.openDrawer(param, key,2) }}>
          {myUtil.text.formatNum(param.text, '0,0')}
        </Button>
      );
    },
  // 未开具出口发票
  rendersjbbscWkjfp: (param: any) => {
    if(param.text == 0 || param.text == '0'){
      return param.text;
    }
    const key = param.unitRef.current?.getGridParams().key;
    return (
      <Button type="link" onClick={() => { Func.openDrawer(param, key,3) }}>
        {myUtil.text.formatNum(param.text, '0,0')}
      </Button>
    );
  },
  //征税或免税
  rendersjbbscZshms: (param: any) => {
    if(param.text == 0 || param.text == '0'){
      return param.text;
    }
    const key = param.unitRef.current?.getGridParams().key;
    return (
      <Button type="link" onClick={() => { Func.openDrawer(param, key,4) }}>
        {myUtil.text.formatNum(param.text, '0,0')}
      </Button>
    );
  },
}
export default Func;