/**
 * title: 角色管理
 * author: wx
 */
import React from 'react';

import { Button, message } from 'antd';

const Func: any = {
  unitRef: React.createRef(),
};

Func.columnsRender = {
  // 关联用户数
  renderGlyhs: (param: any) => {
    if(param.text == "0" || !param.text) {
      return <>
       <span>0</span>
      </>
    } else {
      return <>
       <Button type='link' onClick={() => openModalGlyh(param)}>{param.text || 0}</Button>
      </>
    }

  },

  // 关联用户列表-启用标志
  renderYxbz: (param: any) => {
    return <>
      {param.text === 'Y' ? '启用' : '停用'}
    </>
  }
}
// 打开弹窗-关联用户
const openModalGlyh = (param: any) => {
  const { unitRef } = param;
  const otherRef = unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal(param);
  } else if (param.otherRef && param.otherRef[1]) {
    param.otherRef[1].current?.showModal(param);
  }
};

// 打开弹窗-新建角色
Func.addJs = (param: any) => {
  const { unitRef } = param;
  const otherRef = unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param,[],'新建');
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param,[],'新建');
  }
};
// 打开弹窗-修改角色
Func.editJs = (param: any, event: any) => {
  event.stopPropagation();
  const { unitRef, record } = param;
  const otherRef = unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param, record,'修改');
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param, record,'修改');
  }
};

export default Func;