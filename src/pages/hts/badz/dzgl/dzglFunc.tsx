/**
 * 备案单证 单证管理 func
 */
import { message, } from 'antd';
import { intl as intl2 } from '@/components/DDAssist/util';
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import { dzbadzglxz, badzZlgdYlCkxq, deleteCheck } from '@/pages/hts/services/htsApi';

const dzglFunc: any = {
  // 加载时蒙板使用
  unitRef: React.createRef(),
};

// 新建；导入
dzglFunc.dzglImport = (param: any) => {
  const { unitRef, selectionRows } = param;
  if (selectionRows.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  if("N" == selectionRows[0]?.badzlxxybz){
    message.info("该单证已禁用，无法操作，如确需操作，请到”备案设置-资料设置中，将该单证设置为启用!");
    return;
  }
  // if (selectionRows[0]?.jybs == 'N') {
  //   message.info(intl2.formatMessage({ id: 'message_badz_dzgl_czygd_warning' }));
  //   return;
  // }
  // 打开导入弹窗
  const otherRef = unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    if (selectionRows.length === 0) {
      otherRef[0].current!.showModal({ ref: unitRef, data: [] });
      return;
    }
    unitRef.current!.setMasker(true);
    badzZlgdYlCkxq({ badzuuid: selectionRows[0].badzuuid }).then((response) => {
      unitRef.current!.setMasker(false);
      if (response.code === '200') {
        // 打开导入弹窗
        if(selectionRows[0]?.jybs == 'N'){
          otherRef[2].current!.showModal({ ref: unitRef, data: response.body });
        }else{
          otherRef[0].current!.showModal({ ref: unitRef, data: response.body });
        }
      } else {
        message.error(response.msg);
      }
    });
  }
}

// 新建:扫描
dzglFunc.dzglSm = async (param: any) => {
  const { unitRef, selectionRows } = param;
  // 检测高拍仪服务是否启动
  unitRef.current!.setMasker(true);
  const flag = await checkeServices();
  unitRef.current!.setMasker(false);
  if (flag === false || flag === undefined) {
    message.info(intl2.formatMessage({ id: 'message_badz_common_gpycheck_error' }));
    return;
  }

  if (selectionRows.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }

  // 打开扫描仪弹窗
  const otherRef = unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[1]) {
    if (selectionRows.length === 0) {
      otherRef[1].current!.showModal({ ref: unitRef, data: [] });
      return;
    }
    badzZlgdYlCkxq({ badzuuid: selectionRows[0].badzuuid }).then((response) => {
      unitRef.current!.setMasker(false);
      if (response.code === '200') {
        // 打开导入弹窗
        if (selectionRows[0].jybs == 'N') {
          otherRef[2].current!.showModal({ ref: unitRef, data: response.body, editFlag: selectionRows[0] ? true : false });
          return;
        }else{
          otherRef[1].current!.showModal({ ref: unitRef, data: response.body, editFlag: selectionRows[0] ? true : false });
        }
      } else {
        message.error(response.msg);
      }
    });
  }
}

// 删除
dzglFunc.dzglDelete = (param: any) => {
  const { selectionRowKeys, unitRef, selectionRows } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  for (let i = 0; i < selectionRows.length; i++) {
    if (selectionRows[i].jybs == 'N') {
      message.info(intl2.formatMessage({ id: 'message_badz_dzgl_czygd_warning' }));
      return;
    }
  }
  for (let i = 0; i < selectionRows.length; i++) {
    if (selectionRows[i].jybs == 'T') {
      DDAlert.open({
        title: '删除',
        info: intl2.formatMessage({ id: 'message_badz_delete_check_ygl' }),
        infoType: 'question',
        modalType: 'confirm',
        closeStatus: false,
        okCallbackFn: function (thisObj: any) {
          thisObj.setState({ masker: true });
          deleteCheck({ uuids: selectionRowKeys }).then((response) => {
            DDAlert.close();
            const { code } = response;
            if (code === '200') {
              message.success(intl2.formatMessage({ id: 'message_delete_success' }));
              unitRef.current!.reload2();
            } else {
              message.error(intl2.formatMessage({ id: 'message_delete_error' }));
            }
          })
        },
      });
      return;
    }
  }
  DDAlert.open({
    title: '删除',
    info: intl2.formatMessage({ id: 'message_inquiry_delete' }),
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: false,
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      deleteCheck({ uuids: selectionRowKeys }).then((response) => {
        DDAlert.close();
        const { code } = response;
        if (code === '200') {
          message.success(intl2.formatMessage({ id: 'message_delete_success' }));
          unitRef.current!.reload2();
        } else {
          message.error(intl2.formatMessage({ id: 'message_delete_error' }));
        }
      })
    },
  });
}

// 下载
dzglFunc.dzglDownload = (param: any, event: any) => {
  event.stopPropagation();
  const { record, unitRef } = param;
  const badzbgduuid = record.badzuuid;
  const model = { badzuuids: [badzbgduuid] }
  unitRef.current!.setMasker(true);
  // 备案单证 - 单证备案 - 资料查询 - 下载
  dzbadzglxz(model).then((response) => {
    unitRef.current!.setMasker(false);
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadZip(blob, fileName);
      //message.success(intl2.formatMessage({ id: 'message_common_dlownload_success' }));
    } else {
      message.error(response.desc)
    }
  })
}
export default dzglFunc;
