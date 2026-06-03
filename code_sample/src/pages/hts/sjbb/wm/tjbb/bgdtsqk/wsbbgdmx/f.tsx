import React from 'react';
import config from './config';
import myUtil from '@/pages/common/myUtil';

const Func: any = {
  unitRef: React.createRef(),
};

const myConfig = { ...config }

Func.afterReload = (param: any) => {
  const searchModel = param.unitRef.current?.getGridParams().searchModel;
  const key = param.unitRef.current?.getGridParams().key;
  if (searchModel.length > 0 && myConfig.unit_key === key) {
    myUtil.localStore.setItem(key, searchModel);
  }
};

// 数据报表 信息状态 
Func.columnsRender = {
  renderSjbbXxzt: (param: any) => {
    if (param.text === 'Y') {
      return (
        <span>无信息</span>
      );
    } else {
      return (
        <span>有信息</span>
      );
    }
  }
}


export default Func;