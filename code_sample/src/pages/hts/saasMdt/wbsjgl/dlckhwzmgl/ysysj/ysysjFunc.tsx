import DDAlert from '@/components/DDAlert';
import { intl } from '@/pages/common/myUtil';
import { message } from 'antd';
import React from 'react';

const Func: any = {
  unitRef: React.createRef(),
};

Func.produceDetailsReport = (param: any) => {
  const { unitRef } = param;
  const gridData = unitRef.current?.getGridData();
  if (gridData.length === 0) {
    message.info(intl.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  DDAlert.open({
    title: '系统消息',
    info:
      <span>
        &nbsp;&nbsp;<span style={{ fontWeight: "bold" }}>生成明细报表<br /></span>
        <span>该数据已生成过明细，再次生成可能会造成重复申报退税，确定要生成明细吗？</span>
      </span>
    ,
    modalType: 'confirm',
    infoType: 'warning',
    okCallbackFn: function () {
      const otherRef = param.unitRef.current?.getOtherRefs();
      if (otherRef) {
        otherRef[0].current?.showModal(param,'4');
      }
    }
  })
}



export default Func;