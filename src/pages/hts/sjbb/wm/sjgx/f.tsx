import { message, Badge } from 'antd';
import React from 'react';
import { deleteTzData } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import { intl as intl2 } from '@/components/DDAssist/util';

const Func: any = {
  refUnit: React.createRef(),
};

// 更新报表
Func.updateDataSjbb = (param: any) => {
  const otherRef = param.refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
}

// 删除
Func.deleteDataSjbb = (param: any) => {
  const { selectionRows, selectionRowKeys, gridRef, refUnit } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info('请选择要操作的数据！');
    return;
  } else {
    for (let i = 0; i < selectionRows.length; i++) {
      if (!selectionRows[i].cgbz || selectionRows[i].cgbz == 'S') {
        message.info('运行中数据不能删除！');
        return;
      }
    }
    DDAlert.open({
      title: '提示',
      info: intl2.formatMessage({ id: 'message_inquiry_delete' }),
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: true,
      content: '',
      isFormContent: false,
      okCallbackFn: function () {
        const data = {
          rwuuids: selectionRowKeys,
          key: 'ZXSB_TZ_RW_DEL',
        };
        refUnit.current!.setMasker(true);
        deleteTzData(data).then((response: any) => {
          refUnit.current!.setMasker(false);
          const { code, desc } = response;
          if (code === '200') {
            refUnit.current?.setSelectionRowKeys([]);
            refUnit.current?.setSelectionRows([]);
            gridRef.current?.reload();
            message.success(intl2.formatMessage({ id: 'message_delete_success' }),);
          } else {
            message.error(desc);
            return;
          }
        })
      }
    });
  }
}

Func.columnsRender = {
  // 数据更新
  renderTzGxjdcx: (param: any) => {
    let col: any = <></>;
    if (param.text == 'Y') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" />{'已执行'}
        </span>
      );
    } else if (param.text == 'E') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="error" />{'执行失败'}
        </span>
      );
    }  else if (param.text == 'S') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="processing" />{'执行中'}
        </span>
      );
    } else {
      col = (
        <span className="dd_grid_icon">
          <Badge status="warning" />{'待执行'}
        </span>
      );
    }
    return col;
  },

  // 剩余时间
  renderTzSysj: (param: any) => {
    let col: any = <></>;
    if (param.text) {
      // 未获取、待备案
      col = (<span> {param.text + '分钟'} </span>);
    } else {
      col = (<span> {'--'} </span>);
    }
    return col;
  }
};

export default Func;