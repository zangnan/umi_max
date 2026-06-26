import React from 'react';

const Func: any = {
  unitRef: React.createRef(),
};

// 按钮显隐-刷新
Func.displayReload = (record: any) => {
  if (record.xzztDm == '0') { // 未处理
    return false;
  }
  return true;
}

export default Func;