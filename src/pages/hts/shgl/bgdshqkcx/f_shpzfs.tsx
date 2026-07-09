/**
 * title: 收汇凭证份数
 */
import React from 'react';

const Func: any = {
  refUnit: React.createRef(),
};

Func.columnsRender = {
  // 匹配方式
  ppfs : (param: any) => {
    const sgppbz = param?.record.sgppbz; // 认证发票状态
    let rzrtn = '';
    if(sgppbz == '1'){
      rzrtn = '手动匹配';
    } else if(sgppbz == '2'){
      rzrtn = '自动匹配';
    } else {
      rzrtn='';
    }
    const html = <div>{rzrtn} </div>;
    return html;
  },
}
export default Func;
