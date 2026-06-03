import React from 'react';
import { getBgdInfoHgck, bgdscDelete } from '@/services/hts/api';
import { message } from 'antd';
import { intl as intl2 } from '@/pages/common/myUtil';
import DDAlert from '@/components/DDAlert';

const jkbgdFunc: any = {
  unitRef: React.createRef(),
};

// 打印
jkbgdFunc.dyFunc= (param: any) => {
  const otherRef = param.unitRef.current?.getOtherRefs();
  otherRef[0].current?.showModal(param);
}

// 删除
jkbgdFunc.btnDelete = (param: any) => {
  const { selectionRowKeys, unitRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    DDAlert.open({
      title: '系统提示',
      info: '确定要删除选择的数据吗？',
      infoType: 'question',
      modalType: 'confirm',
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        bgdscDelete({ uuids: selectionRowKeys }).then((response) => {
          DDAlert.close();
          const { code, desc } = response;
          if (code === '200') {
            message.success(intl2.formatMessage({ id: 'message_delete_success' }));
            unitRef.current!.reload2();
          } else {
            message.error(desc);
          }
        })
      },
    });
  }
}

// 列表自定义渲染
jkbgdFunc.columnsRender = {
  renderBgdscmxbgdhSjgl: (param: any) => {
    return <a onClick={(e)=>{ e.stopPropagation();jkbgdFunc.openJkbgdh(param, param?.text)}}>{param?.text}</a>;
  },
}

jkbgdFunc.openJkbgdh = (param: any, ckbgd: any) => {
  const {otherRef } = param;
  ckbgd = String(ckbgd).substring(0, 18);
  getBgdInfoHgck({ckbgdh: ckbgd}).then((res: any) => {
    if (res.code == '200') {
      otherRef[1].current?.showModal(param, ckbgd, res?.body);
    }
  })
}


export default jkbgdFunc;