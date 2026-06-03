
import React from 'react';
import DDAlert from '@/components/DDAlert';
import { Select, Input, message, Form } from 'antd';
import myUtil from '@/pages/common/myUtil';
import { createKptzs,ddPd,ddzyt } from '@/services/hts/api';
import { intl as intl2 } from '@/pages/common/myUtil';


const Func: any = {
  // 加载时蒙板使用
  unitRef: React.createRef(),
};

// 生成开票通知
Func.sckptz = async (param :any) => {
  const { selectionRowKeys, unitRef, } = param;
  if (selectionRowKeys?.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  unitRef.current?.setMasker(true);
  await createKptzs({ ddbhs: selectionRowKeys}).then((response2) => {
    unitRef.current?.setMasker(false);
    if (response2.code == '200') {
      unitRef.current!.reload2();
      const { blob, fileName } = response2.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response2.msg);
    }
  })
}
// 自动配单
Func.zdpd = async (param :any) => {
  const { selectionRowKeys, unitRef,otherRef,selectionRows } = param;
  if (selectionRowKeys?.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  const ckny = selectionRows[0].ckny.substring(0,4) ;
  unitRef.current?.setMasker(true);
  await ddPd({ ddbhs: selectionRowKeys}).then((response2) => {
    unitRef.current?.setMasker(false);
    if (response2.code == '200') {
      otherRef[0].current?.showModal(selectionRowKeys,unitRef,response2.body,ckny);
    } else {
      message.error(response2.msg);
    }
  })
}

//转用途
Func.zyt = async (param :any) => {
  const { selectionRowKeys,unitRef} = param;
  if (selectionRowKeys?.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  const obj = {"ddbhs":selectionRowKeys,"zhhbgdpdsblxDm":"2"};
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
