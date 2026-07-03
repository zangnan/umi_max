import React from 'react';
import { intl as intl2 } from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/components/DDAlert';
import {message} from 'antd';
import {sffwglDeleteSffw } from '@/pages/hts/services/htsApi';


const Func: any = {
  unitRef: React.createRef(),
};

Func.add = (param: any) => {
  const {otherRef} = param;
  otherRef[0].current?.showModal(param, 'add');
}

Func.columnsRender = {

}

Func.edit = (param: any) => {
  const {selectionRowKeys, otherRef} = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({id: 'message_handle_unselected'}));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({id: 'message_one_selected'}));
    return;
  }
  otherRef[0].current?.showModal(param, 'edit');
}

Func.del = async (param: any) => {
  const {selectionRowKeys, unitRef} = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({id: 'message_handle_unselected'}));
    return;
  }
  DDAlert.open({
    title: '删除',
    info: '确定对勾选数据进行删除的操作吗？',
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: false,
    okCallbackFn: async function (thisObj: any) {
      thisObj.setState({masker: true});
      await sffwglDeleteSffw({sffwDms: selectionRowKeys}).then((response: any) => {
        thisObj.setState({masker: false});
        if (response.code === '200') {
          // 清空选中并设置按钮可用状态
          message.success('删除成功！');
          DDAlert.close();
          unitRef.current!.reload2();
        } else {
          message.error(response.msg);
        }
      })
    }
  });
}

export default Func;
