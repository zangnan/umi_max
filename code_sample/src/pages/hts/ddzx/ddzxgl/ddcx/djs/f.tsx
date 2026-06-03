
import React from 'react';
import { message } from 'antd';
import { intl as intl2 } from '@/pages/common/myUtil';
import { ddzyt } from '@/services/hts/api';


const Func: any = {
  // 加载时蒙板使用
  unitRef: React.createRef(),
};

// 服务费结算
Func.funcFwf = (param:any) =>{
  const { otherRef, selectionRows, unitRef } = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  otherRef[0].current!.showModal(selectionRows, unitRef);
}

// 收汇结算
Func.funcSh = (param:any) =>{
  const { otherRef, selectionRows, unitRef } = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  otherRef[1].current!.showModal(selectionRows, unitRef);
}

// 退税结算
Func.funcTs = (param:any) =>{
  const { otherRef, selectionRows, unitRef } = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  otherRef[2].current!.showModal(selectionRows, unitRef);
}

// 专用途
Func.zyt = async (param :any) => {
  const { selectionRowKeys,unitRef} = param;
  if (selectionRowKeys?.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  const obj = {"ddbhs":selectionRowKeys,"zhhbgdpdsblxDm":"1"};
  unitRef.current?.setMasker(true);
  await ddzyt(obj).then((response :any) => {
    unitRef.current?.setMasker(false);
    if (response.code == '200') {
      unitRef?.current?.reload2();
      message.success('操作成功！');
    } else {
      message.error(response.msg);
    }
  })
    
}
export default Func;
