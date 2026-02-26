import React from 'react';
import myUtil from '@/components/DDAssist/util';

const Func: any = {
  refUnit: React.createRef(),
};

// 列表自定义渲染
Func.columnsRender = {
  // 用户名
  yhm: (param: any) => {
    let requestBodyStr = param?.record?.requestBody || '';
    let requestBodyObj;
    if (requestBodyStr) {
      try {
        requestBodyObj = JSON.parse(requestBodyStr);
      } catch (err) {
        requestBodyObj = [];
      }
    }
    let tmp1: any = {};
    if (Array.isArray(requestBodyObj) && requestBodyObj.length > 0) {
      tmp1 = requestBodyObj[0];
    }
    let tmp2 = tmp1?.loginUserId || '';
    if (!tmp2) {
      tmp2 = tmp1?.searchModel?.loginUserId || '';
    }
    if (!tmp2 && Array.isArray(requestBodyObj) && requestBodyObj.length > 1) {
      tmp1 = requestBodyObj[1];
      tmp2 = tmp1?.loginUserId || '';
    }
    let tmp3 = '';
    if (tmp2) {
      tmp3 = myUtil.code.getCodeValByKey(tmp2, 'code_dm_def_user');
    }
    return tmp3;
  },
}

export default Func;

