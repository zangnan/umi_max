import React from 'react';
import myConfig from './config';
import myUtil from '@/pages/common/myUtil';

const Func: any = {
  unitRef: React.createRef(),
};

Func.afterReload = (param: any) => {
  const searchModel = param.unitRef.current?.getGridParams().searchModel;
  const key = param.unitRef.current?.getGridParams().key;
  if (searchModel.length > 0 && myConfig.unit_key === key) {
    myUtil.localStore.setItem(key, searchModel);
  }
};

// 数据报表
Func.columnsRender = {}

Func.sjgxCkbgdtsqk = (param: any) => {
  const otherRef = param.unitRef.current?.getOtherRefs();
  otherRef[0].current?.showModal(param);
}

export default Func;
