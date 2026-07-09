import React from 'react';
import config from './config';
import myUtil from '@/components/DDAssist/util';

const Func: any = {
  refUnit: React.createRef(),
};

const myConfig = { ...config }

Func.afterReload = (param: any) => {
  const searchModel = param.refUnit?.current?.getGridParams().searchModel;
  const key = param.refUnit?.current?.getGridParams().key;
  if (searchModel?.length > 0 && myConfig.module_key === key) {
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