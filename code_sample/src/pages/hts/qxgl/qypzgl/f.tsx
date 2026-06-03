import React from 'react';
import {message} from 'antd';
import {intl as intl2} from "@/pages/common/myUtil";

const Func: any = {
  unitRef: React.createRef(),
};

Func.pz = (param: any) => {
  const {selectionRowKeys,selectionRows,unitRef,otherRef} = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info('请选择要操作的数据！');
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  otherRef[0].current?.showModal(selectionRows[0], unitRef,'add');
}

Func.ckxx= (param: any) => {
  const {record,unitRef,otherRef} = param;
  otherRef[1].current?.showModal(record, unitRef, record.sbqyuuidDqlb);
}

export default Func;
