import React from 'react';
import pdfUtil from '@/components/DDAssist/util/pdfUtil';

const Func: any = {
  refUnit: React.createRef(),
};

// 列表自定义渲染
Func.columnsRender = {
  // render01
  render01: (param: any) => {
    return <>11</>;
  },
  // render02
  render02: (param: any) => {
    return <>2</>;
  },
  // render03
  render03: (param: any) => {
    return <>2</>;
  },
}

// 表单事件：OnClick
Func.eventOnSearch = {
  sbpc: (param: any) => {
    console.info(param);
  },
}

// 导出PDF
Func.doExportPdf = (param: any) => {
  pdfUtil.doExportPdf(param);
}

export default Func;