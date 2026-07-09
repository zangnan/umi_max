// 海关IC卡操作日志
import React from 'react';

const Func: any = {
  refUnit: React.createRef(),
};

Func.columnsRender = {
  // 成功标志
  renderICCgbz: (param: any) => {
    let col: any = <></>;
    if (param.text == 'Y') {
      col = (
        <span>成功</span>
      );
    } else {
      col = (
        <span>失败</span>
      );
    }
    return col;
  },
}

export default Func;