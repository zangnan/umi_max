import React from 'react';

const Func: any = {
  refUnit: React.createRef(),
};

// 列表行单击事件
Func.gridOnRowClick = (param: any) => {
  console.info('列表行单击事件', param);
}


// 配置项：自定义工具栏
Func.handleCus0 = (param: any) => {
  console.info(param);

  let aaa = param.selectionRowKeys;

  const { selectionRowKeys, refGrid, refUnit, otherRef } = param;
    if (otherRef && otherRef[0]) {
      otherRef[0].current?.showModal(param);
    }
}

export default Func;