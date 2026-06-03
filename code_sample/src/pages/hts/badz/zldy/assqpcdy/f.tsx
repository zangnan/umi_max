import React from 'react';
import { message, Badge } from 'antd';
import { intl as intl2 } from '@/pages/common/myUtil';
import DDAlert from '@/components/DDAlert';
import badzUtil from "@/pages/hts/badz/badzcommon/badzUtil";
import { badzScssqsj, dzbaZlcdSsq, assqDyData } from '@/services/hts/api';

const Func: any = {
  unitRef: React.createRef(),
};

//打印成册
Func.dycc = (param: any) => {
  badzUtil.common.dycc(param, 'assq');
}
//下载资料
Func.xzzl = (param: any) => {
  badzUtil.common.xzzl(param, 'assq');
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
    uuids.push(selectionRows[i].badzssquuid);
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
        badzssquuids: uuids,
      }
      dzbaZlcdSsq(obj).then((res: any) => {
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
  if(record.bswjscztDm != 3){
    message.info('暂无报告！请先生成PDF报告！');
    return ;
  }
  const uuid: any = [];
  uuid.push(record.badzssquuid);
  const qqbw = {
    badzssquuids: uuid,
    rzlx: 'badzssquuid',
    badzczlxDm: '2'
  };
  unitRef.current!.setMasker(true);
  assqDyData(qqbw).then((response: any) => {
    unitRef.current!.setMasker(false);
    if (response.code === '200') {
      const otherRef = param.unitRef.current?.getOtherRefs();
      const listData = response.body.wjljs;
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

// 生成所属期数据
Func.scssqsj = (param: any) => {
  const { unitRef, selectionRows } = param;
  if (selectionRows.length == 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  const uuids: any = [];
  const bswjscztDms: any = [];
  for (let i = 0; i < selectionRows.length; i++) {
    uuids.push(selectionRows[i].badzssquuid);
    bswjscztDms.push(selectionRows[i].bswjscztDm)
  }
  if (bswjscztDms.indexOf('2') > -1) {
    message.info(intl2.formatMessage({ id: 'message_badz_scssqsj_infoing' }));
    return;
  } else if (bswjscztDms.indexOf('3') > -1) {
    DDAlert.open({
      title: '系统提示',
      info: intl2.formatMessage({ id: 'message_badz_scssqsj_info' }),
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: true,
      okCallbackFn: async function () {
        unitRef.current!.setMasker(true);
        const obj = {
          badzssquuids: uuids,
        }
        badzScssqsj(obj).then((res: any) => {
          unitRef.current!.setMasker(false);
          if (res.code == '200') {
            message.success(intl2.formatMessage({ id: 'message_badz_scssqsj_success' }));
            unitRef.current!.reload2();
          } else {
            message.error(res.desc)
          }
        })
        DDAlert.close();
      },
    });
  } else if (bswjscztDms.indexOf('1') > -1 || bswjscztDms.indexOf('4') > -1) {
    const obj = {
      badzssquuids: uuids,
    }
    badzScssqsj(obj).then((res: any) => {
      unitRef.current!.setMasker(false);
      if (res.code == '200') {
        message.success(intl2.formatMessage({ id: 'message_badz_scssqsj_success' }));
        unitRef.current!.reload2();
      } else {
        message.error(res.desc)
      }
    })
  }
}

Func.gridBadzDy = (record: any) => {
  if (record.bswjscztDm === '3') {
    return false;
  }
  return true;
};

Func.columnsRender = {
  // 备案单证-备案状态
  renderBadzSczt: (param: any) => {
    let col: any = <></>;
    if (param.text === '1') {
      // 未生成
      col = (
        <span className="dd_grid_icon">
          <Badge status="default" />未生成
        </span>
      );
    } else if (param.text === '2') {
      // 生成中
      col = (
        <span className="dd_grid_icon">
          <Badge status="processing" />生成中
        </span>
      );
    } else if (param.text === '3') {
      // 生成成功
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" />生成成功
        </span>
      );
    } else if (param.text === '4') {
      // 生成失败
      col = (
        <span className="dd_grid_icon">
          <Badge status="error" />生成失败
        </span>
      );
    }
    return col;
  },
}



export default Func;
