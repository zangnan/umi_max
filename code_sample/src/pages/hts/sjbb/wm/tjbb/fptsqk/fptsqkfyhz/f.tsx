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
    { property: 'kpyf', value: param.record.kpyf, op: 'zdy' },
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
   // 发票
   rendersjbbscBgdFp: (param: any) => {
    const key = param.unitRef.current?.getGridParams().key;
    if(param.text == 0 || param.text == '0'){
      return param.text;
    }
    return (
      <Button type="link" onClick={() => { Func.openDrawer(param, key,1) }}>
        {myUtil.text.formatNum(param.text, '0,0')}
      </Button>
    );
  },
  // 未申报退税情况
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
  // 转内销发票
  rendersjbbscZnx: (param: any) => {
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
}
export default Func;