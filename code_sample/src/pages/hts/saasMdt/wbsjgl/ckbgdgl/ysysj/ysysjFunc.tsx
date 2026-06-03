import DDAlert from '@/components/DDAlert';
import { getBgdInfoHgck, bgdzbts, bgdpdfyl } from '@/services/hts/api';
import { message, Tooltip } from 'antd';
import React from 'react';
import {intl, intl as intl2} from '@/pages/common/myUtil';

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
        otherRef[1].current?.showModal(param,'7');
      }
    }
  })
}

// 关单信息状态标志
Func.columnsRender= {
  renderBgdscmx18bgdh: (param: any) => {
    const ckbgdh = param?.text;
    const html = <a onClick={(e)=>{ e.stopPropagation();Func.openCkbgdh2(param, ckbgdh)}}>{ckbgdh}</a>;
    const html2 = <Tooltip title={ckbgdh}>{html}</Tooltip>;
    return html2;
  },
};

Func.openCkbgdh = (param: any, ckbgd: any) => {
  const {otherRef } = param;
  ckbgd = ckbgd.substring(0, 18);
  getBgdInfoHgck({ckbgdh: ckbgd}).then((res: any) => {
    if (res.code == '200') {
      otherRef[0].current?.showModal(param, ckbgd, res?.body);
    }
  })
};

Func.openCkbgdh2 = (param: any, ckbgd: any) => {
  const { otherRef, record, unitRef} = param;
  unitRef.current!.setMasker(true);
  bgdpdfyl({ uuid: record?.uuid, bgdhgbh: record?.bgdhgbh }).then((res: any) => {
    unitRef.current!.setMasker(false);
    if (res.code == '200') {
      otherRef[0].current?.showModal(res?.body, { uuid: record?.uuid, bgdhgbh: record?.bgdhgbh });
    } else {
      message.error(res.msg);
    }
  })
}

export default Func;
