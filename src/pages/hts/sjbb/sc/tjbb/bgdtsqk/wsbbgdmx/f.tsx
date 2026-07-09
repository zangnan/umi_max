import React from 'react';

const Func: any = {
  refUnit: React.createRef(),
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