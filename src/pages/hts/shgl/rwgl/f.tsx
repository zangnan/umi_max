import React from 'react';
import { shglDelSdpprw } from '@/pages/hts/services/htsApi';
import { message, Button } from 'antd';
import { intl as intl2 } from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/commonModule/DDAlert';


const Func: any = {
  unitRef: React.createRef(),
};

// 列表自定义渲染
Func.columnsRender = {
  renderShrwglcz: (param: any) => {
    let col: any = [];
    const rt = param?.record;
    const xzztDm = rt?.xzztDm;//判断任务状态
    if (xzztDm === '0') {
      col.push(
        <span className="dd_grid_icon">
          <Button type="link" onClick={(e) => { Func.handleShppRwReload(param, e) }} style={{ marginTop: '2px' }}>刷新</Button>
        </span>
      );
    } else {
      col.push(
        <>
          <span className="dd_grid_icon">
            <Button type="link" onClick={(e) => { Func.handleShppRwCkmx(param, e) }} style={{ marginTop: '2px' }}>查看明细</Button>
          </span>
        </>
      );
    }
    return col;
  },
}

//任务刷新
Func.handleShppRwReload = (param: any) => {
  const { unitRef } = param;
  unitRef?.current?.reload2();
}


// 查看任务明细
Func.handleShppRwCkmx = async (param: any, e: any) => {
  e.stopPropagation();
  const {otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
}

// 删除
Func.handlerDel = (param: any) => {
  const {selectionRows, unitRef } = param;
  const gridData = unitRef.current?.getGridData();
  if(gridData.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  if (!selectionRows || selectionRows.length <= 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  const zxzRows = selectionRows.filter((item: any) => item?.xzztDm === '0');
  if (zxzRows && zxzRows.length > 0) {
    message.info('执行中的任务无法删除，请重新选择！');
    return;
  }
  const rwuuid1s: any = [];
  selectionRows.map((item: any) => rwuuid1s.push(item.rwuuid1));
  const titleMessage = intl2.formatMessage({ id: 'message_jljghx_jdcx_plsc_title' });
  const infoMessage = intl2.formatMessage({ id: 'message_inquiry_delete' });
  DDAlert.open({
    title: titleMessage,
    info: infoMessage,
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: true,
    content: '',
    isFormContent: false,
    okCallbackFn: function () {
      const obj: any = {
        uuids: rwuuid1s
      };
      unitRef.current!.setMasker(true);
      shglDelSdpprw(obj).then((res: any) => {
        unitRef.current!.setMasker(false);
        const { code, msg } = res;
        if (code === '200') {
          unitRef.current!.reload2();
          message.success('删除成功！');
        } else {
          message.error(msg);
        }
      });
    }
  });
}

export default Func;
