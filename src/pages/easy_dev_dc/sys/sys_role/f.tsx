import React from 'react';
const Func: any = {
  refUnit: React.createRef(),
};

// 配置项：绑定菜单
Func.bindMenu = (param: any, event: any) => {
  event.stopPropagation();
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
}

export default Func;