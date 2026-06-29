/**
 * title: 角色管理-关联用户
 * author: wx
 */
import React from 'react';

const Func: any = {
  unitRef: React.createRef(),
};

Func.columnsRender = {
  // 关联用户列表-启用标志
  renderYxbz: (param: any) => {
    return <>
      {param.text === 'Y' ? '启用' : '停用'}
    </>
  }
}
export default Func;