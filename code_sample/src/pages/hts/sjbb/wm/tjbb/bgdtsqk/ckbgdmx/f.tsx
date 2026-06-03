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

Func.columnsRender= {
  // 数据报表 退运业务类型
  rendersjbbTyybs: (param: any) => {
    const {record} = param;
    return (
      <span> {record?.tyybswtstylxmc} </span>
    );
  },
  // 数据报表 申报情况 
  rendersjbbSbqk: (param: any) => {
    const {record} = param;
    return (
      <span> {record?.bgdsbqkmc} </span>
    );
  },

  // 数据报表 申报类型
  rendersjbbCllx: (param: any) => {
    const {record} = param;
    return (
      <span> {record?.bgdcllxmc} </span>
    );
  }
};


export default Func;