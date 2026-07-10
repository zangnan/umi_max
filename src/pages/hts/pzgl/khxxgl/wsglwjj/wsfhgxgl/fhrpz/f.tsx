/**
 * title: 用户管理
 * author: wx
 */
import React from 'react';
import { message, Button, Switch } from 'antd';
import { intl as intl2 } from '@/components/DDAssist/util';
import { deleteFhr, enableOrDisableYh } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import qxUtil from '@/pages/hts/common/qxUtil';

const Func: any = {
  refUnit: React.createRef(),
};

Func.columnsRender = {
  // 关联境外收货人数
  renderGljwshrs:(param: any) => {
    let html;
    if (param.text == 0 || !param.text) {
      html = <>0</>
    } else {
      html = <Button type="link" onClick={() => Func.jwshrs(param)}>{param.text}</Button>;
    }
    return html;
  },
}


// 打开弹窗-新建付汇人
Func.addFhr = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param,[], '付汇人采集');
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param, [], '付汇人采集');
  }
};
// 打开弹窗-修改付汇人
Func.editFhr = (param: any) => {
  const { selectionRows, refUnit } = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param, selectionRows[0], '付汇人修改');
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param, selectionRows[0], '付汇人修改');
  }
};

// 删除付汇人
Func.del = (param: any) => {
  const { selectionRows, refUnit } = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }

  DDAlert.open({
    title: '系统提示',
    info: '确定要删除选择的数据吗？',
    infoType: 'question',
    modalType: 'confirm',
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      const fhruuids: any = [];
      selectionRows.forEach((row: any) => {
        fhruuids.push(row.fhruuid)
      });
      deleteFhr({ fhruuids }).then((response) => {
        DDAlert.close();
        const { code, msg } = response;
        if (code === '200') {
          message.success(intl2.formatMessage({ id: 'message_delete_success' }));
          refUnit.current!.reload();
        } else {
          message.error(msg);
        }
      })
    },
  });
}


Func.gljwshr = (param: any) => {
  const {selectionRowKeys,otherRef ,selectionRows} = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  otherRef[1].current?.showModal(param, selectionRowKeys,'2');
}

// 关联境外收货人下钻
Func.jwshrs = (param: any) => {
  const {selectionRowKeys,otherRef ,selectionRows} = param;
    otherRef[2].current?.showModal(param);
}
export default Func;
