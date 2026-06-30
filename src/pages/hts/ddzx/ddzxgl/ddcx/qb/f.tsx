
import React from 'react';
import { Modal, Button, message } from 'antd';
import { intl as intl2 } from '@/components/DDAssist/util';
import {zdyxj } from '@/pages/hts/services/htsApi';



const Func: any = {
  // 加载时蒙板使用
  unitRef: React.createRef(),
};

Func.xj = (param:any) =>{
  const {unitRef,otherRef,selectionRowKeys} = param;
  if (unitRef?.current?.getGridData().length === 0) {
    message.info(intl2.formatMessage({ id: 'message_no_data_common_sum' }));
    return;
  }
  unitRef.current.setMasker(true);
  const initSearchModal = unitRef.current.getGridParams().initSearchModal || [];
  let searchModel = unitRef.current.getGridParams().searchModel || [];
  searchModel = [...searchModel,...initSearchModal];
  if(selectionRowKeys && selectionRowKeys.length > 0){
    searchModel?.push({ "type": 1,"property": "ddbhs","values": selectionRowKeys,"op": "zdy"});
  }  

  zdyxj({searchModel}).then((response) => {
    const { code, body } = response;
    unitRef.current.setMasker(false);
    if (code === '200') {
      otherRef[0].current?.showModal({
        gridData: body.rows
      });
    } else {
      message.info('获取数据失败');
    }
  })
}
export default Func;
