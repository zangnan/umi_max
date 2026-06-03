import React from 'react';
import { message, } from 'antd';
import { intl as intl2 } from '@/pages/common/myUtil';
import DDAlert from '@/components/DDAlert';
import badzUtil from "@/pages/hts/badz/badzcommon/badzUtil";
import { dzbaZlcdBgd, abgdDyData } from "@/services/hts/apiBadz";


const Func: any = {
  unitRef: React.createRef(),
};

//打印成册
Func.dycc = (param: any) => {
  badzUtil.common.dycc(param, 'abgd');
}
//下载资料 /yw/sb/badz/comn/abgdxzfj
Func.xzzl = (param: any) => {
  badzUtil.common.xzzl(param, 'abgd');
}
//资料撤档
Func.zlcd = (param: any) => {
  const { unitRef, gridRef, selectionRows } = param;
  const keys = param.selectionRowKeys;
  if (keys.length == 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  const uuids: any = [];
  for (let i = 0; i < selectionRows.length; i++) {
    uuids.push(selectionRows[i].badzbgduuid);
  }
  DDAlert.open({
    title: '系统提示',
    info: intl2.formatMessage({ id: 'message_badz_zlcd_message' }),
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: true,
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      const obj = {
        badzbgduuids: uuids,
      }
      dzbaZlcdBgd(obj).then((res: any) => {
        thisObj.setState({ masker: false });
        if (res.code == '200') {
          message.success(intl2.formatMessage({ id: 'message_badz_zlcd_success' }));
          unitRef.current!.setSelectionRowKeys([]);
          unitRef.current!.setSelectionRows([]);
          gridRef.current?.reload();
        } else {
          message.error(res.desc)
        }
      });
    },
  });
}
//资料调阅
Func.zldy = (param: any, event: any) => {
  event.stopPropagation();
  const { record, unitRef } = param;
  if(record.dycs == 0){
    message.info('暂无报告！请先打印成册！');
    return ;
  }
  const qqbw = {
    badzbgduuid: record.badzbgduuid,
    rzlx: 'badzbgduuid',
    badzczlxDm: '2'
  };
  unitRef.current!.setMasker(true);
  abgdDyData(qqbw).then((response) => {
    unitRef.current!.setMasker(false);
    if (response.code === '200') {
      const otherRef = param.unitRef.current?.getOtherRefs();
      const listData = [];
      const wjljs = {
        wjlj: response.body.wjlj,
        wjm: response.body.wjm,
      }
      listData.push(wjljs)
      if (otherRef && otherRef[0]) {
        otherRef[0].current?.showModal(listData, param.unitRef);
      } else if (param.otherRef && param.otherRef[0]) {
        param.otherRef[0].current?.showModal(listData, param.unitRef);
      }
    } else {
      message.error(response.msg);
      return;
    }
  });
}

// 预览
Func.dzbaZlgdPreview = (param: any, event: any) => {
  event.stopPropagation();
  const { unitRef, record } = param;
  // 打开弹窗
  const otherRef = param.unitRef.current?.getOtherRefs();
  unitRef.current!.setMasker(true);
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal(record, unitRef, 'zlgd');
    unitRef.current!.setMasker(false);
  } else if (param.otherRef && param.otherRef[1]) {
    param.otherRef[1].current?.showModal(record, unitRef, 'zlgd');
    unitRef.current!.setMasker(false);
  }
}

Func.columnsRender = {

}

export default Func;
