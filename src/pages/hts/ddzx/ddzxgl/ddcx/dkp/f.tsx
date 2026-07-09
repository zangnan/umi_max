
import React from 'react';
import DDAlert from '@/pages/hts/components/DDAlert';
import { Select, Input, message, Form } from 'antd';
import myUtil from '@/components/DDAssist/util';
import { createKptzs, ddPd, ddzyt } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';


const Func: any = {
  // 加载时蒙板使用
  refUnit: React.createRef(),
};

// 生成开票通知
Func.sckptz = async (param :any) => {
  const { selectionRowKeys, refUnit, } = param;
  if (selectionRowKeys?.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  refUnit.current?.setMasker(true);
  await createKptzs({ ddbhs: selectionRowKeys}).then((response2) => {
    refUnit.current?.setMasker(false);
    if (response2.code == '200') {
      refUnit.current!.reload2();
      const { blob, fileName } = response2.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response2.msg);
    }
  })
}
// 自动配单
Func.zdpd = async (param :any) => {
  const { selectionRowKeys, refUnit,otherRef,selectionRows } = param;
  if (selectionRowKeys?.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  const ckny = selectionRows[0].ckny.substring(0,4) ;
  refUnit.current?.setMasker(true);
  await ddPd({ ddbhs: selectionRowKeys}).then((response2) => {
    refUnit.current?.setMasker(false);
    if (response2.code == '200') {
      otherRef[0].current?.showModal(selectionRowKeys,refUnit,response2.body,ckny);
    } else {
      message.error(response2.msg);
    }
  })
}

//转用途
Func.zyt = async (param :any) => {
  const { selectionRowKeys,refUnit} = param;
  if (selectionRowKeys?.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  const obj = {"ddbhs":selectionRowKeys,"zhhbgdpdsblxDm":"2"};
  refUnit.current?.setMasker(true);
  await ddzyt(obj).then((response :any) => {
    refUnit.current?.setMasker(false);
    if (response.code == '200') {
      refUnit?.current?.reload2();
      message.success('操作成功！');
    } else {
      message.error(response.msg);
    }
  })
    
}

export default Func;
