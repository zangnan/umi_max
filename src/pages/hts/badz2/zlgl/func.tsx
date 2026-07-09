import React from 'react';
import 'moment/locale/zh-cn';

const Func: any = {
  refUnit: React.createRef(),
};

// 资料下载
Func.zlglZlxz = (param: any) => {
  const { otherRef } = param;
  otherRef[0].current?.showModal(param);
}

// 列表自定义渲染
Func.columnsRender = {
}


export default Func;
