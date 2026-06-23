import React from 'react';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import cktsUtil from '@/pages/hts/cktsUtil';
import { chsbCheck, chsb, ycsbSjzjSq, ycsbZssbNew, queryJgbHzsj, queryDsbsjLb, ycsbSjzjztCx, chBadzSJ, ycsbZssbztCx } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';
import { history,useIntl } from 'umi';
import DDAlert from '@/pages/hts/commonModule/DDAlert';

const Func: any = {
  unitRef: React.createRef(),
};

// 配置项：生成申报数据
Func.dataCreate = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
}

// 配置项：撤销申报数据 1.检查
Func.dataRecall = (param: any) => {
  const { selectionRows, unitRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  // 自检中数据不允许撤销
  if (selectionRows[0]?.fkztDm === '1' && selectionRows[0]?.sjzjsj) {
    message.info("当前申报数据正在自检中，无法撤销");
    return;
  }
  // 已申报且审核状态为“待审核”、“审核中”、“审核成功”的数据不可撤销申报数据
  if (selectionRows[0].sjsbuuid?.trim() && (selectionRows[0].sjsbztDm != '2')) {
    message.info("当前申报数据已正式申报，无法撤销");
    return;
  }
  Modal.confirm({
    title: '执行撤销操作将会删除此条申报记录，是否继续？',
    onOk() {
      unitRef.current?.setMasker(true);
      chsbCheck({ sbwjuuid: selectionRows[0].sbwjuuid }).then((response) => {
        unitRef.current?.setMasker(false);
        const { code, body } = response;
        if (code === '200') {
          if (body.msgInfo) {
            Modal.confirm({
              title: body.msgInfo,
              onOk() {
                Func.dataRecallS2(param);
              }
            });
          } else {
            Func.dataRecallS2(param);
          }
        } else {
          message.error(body.msgInfo);
        }
      })
    },
  });
}

// 配置项：撤销申报数据 2.撤销
Func.dataRecallS2 = (param: any) => {
  const { selectionRows, unitRef } = param;
  unitRef.current?.setMasker(true);
  chsb({ sbwjuuid: selectionRows[0].sbwjuuid }).then((response) => {
    unitRef.current?.setMasker(false);
    const { code, msg } = response;
    if (code === '200') {
      Func.dataRecallChBadzSJ(param)
      unitRef.current?.reload2();
    } else {
      message.error(msg);
    }
  })
}

// 撤销申备案单证数据
Func.dataRecallChBadzSJ = (param: any) => {
  const { selectionRows, unitRef } = param;
  unitRef.current?.setMasker(true);
  chBadzSJ({ sbwjuuid: selectionRows[0].sbwjuuid }).then((response) => {
    unitRef.current?.setMasker(false);
    const { code, msg } = response;
    unitRef.current?.reload2();
    if (code === '200') {
      unitRef.current?.reload2();
      message.success('数据撤销成功');
    } else {
      message.error(msg);
    }
  })
}

// 配置项：数据汇总
Func.dataGather = (param: any) => {
  const { selectionRows, unitRef, otherRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  unitRef.current?.setMasker(true);
  const params = {
    ssq: selectionRows[0].ssq,
    sbpc: selectionRows[0].sbpc
  };
  queryJgbHzsj(params).then((response) => {
    unitRef.current?.setMasker(false);
    const { code, body, msg } = response;
    if (code === '200') {
      body.ssq = params.ssq;
      body.sbpc = params.sbpc;
      if (otherRef && otherRef[1]) {
        otherRef[1].current?.showModal(selectionRows[0], body);
      }
    } else {
      message.error(msg);
    }
  })
}

// 配置项：数据自检
Func.dataCheck = (param: any) => {
  const { selectionRows, unitRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows[0].sjzjsj) {
    message.info('此条数据已做过数据自检，不能重复自检，请确认！');
    return;
  }
  Modal.confirm({
    title: '确定要执行数据自检功能么？',
    onOk() {
      unitRef.current?.setMasker(true);
      ycsbSjzjSq({ sbwjuuid: selectionRows[0].sbwjuuid }).then((response) => {
        unitRef.current?.setMasker(false);
        const { code, msg } = response;
        if (code === '200') {
          unitRef.current?.reload2();
          message.success('数据自检成功');
        } else {
          message.error(msg);
        }
      })
    },
  });
}

// 配置项：证明申请正式申报
Func.proveApply = (param: any) => {
  const { selectionRows, unitRef } = param;
  // 检查: 1.数据未选择
  if (!selectionRows || selectionRows.length === 0) {
    message.info('请选择要操作的数据！');
    return;
  }
  // 检查: 2.正式申报增加强制校验-数据自检中，提示稍后申报
  if (selectionRows[0].sjzjpw || selectionRows[0].fkztDm === '1' || selectionRows[0].fkztDm === '0') {
    message.warn('数据自检中，请稍后正式申报！');
    return;
  }
  // 检查: 3.正式申报增加强制校验-已进行数据自检且自检结果存在不可挑过疑点时，不可直接正式申报
  if (selectionRows[0].btgCnt > 0) {
    message.warn('存在不可挑过疑点，不可直接正式申报！');
    return;
  }
  // 检查: 4.正式申报弹窗前，正在正式申报的数据或已经正式申报完成的数据，不弹窗，直接给提示
  if (selectionRows[0].sjsbuuid && selectionRows[0].sjsbuuid.trim()) {
    message.warn('此条数据已做过数据申报，不能重复申报，请确认！');
    return;
  }
  // 检查: 5.自检失败，不允许正式申报       是否会出现这种情况 ???  btgCnt>0的检查是否已经覆盖???
  if (selectionRows[0].fkztDm === '2') {
    message.warn('此条数据自检失败，不允许转入正式申报，请确认！');
    return;
  }
  if (!selectionRows || selectionRows.length === 0) {
    message.info('请选择要操作的数据！');
    return;
  }
  if (selectionRows[0].sjzjsj && selectionRows[0]?.fkztDm === '1' ) {
    message.info('当前申报数据正在自检中，无法正式申报');
    return;
  }
  Modal.confirm({
    title: '确定要正式申报么？',
    onOk() {
      unitRef.current?.setMasker(true);
      //flzlCheck(selectionRows[0]).then((res) => {
        //if(res.code === '200') {
          ycsbZssbNew({ sbwjuuid: selectionRows[0].sbwjuuid }).then((response) => {
            unitRef.current?.setMasker(false);
            const { code, msg } = response;
            if (code === '200') {
              if(history.location.pathname.indexOf('/25/2505') > -1){
                Func.successTz('/25/2506',unitRef);
              }
              if(history.location.pathname.indexOf('/26/2605') > -1){
                Func.successTz('/26/2606',unitRef);
              }
              if(history.location.pathname.indexOf('/27/2705') > -1){
                Func.successTz('/27/2706',unitRef);
              }
              if(history.location.pathname.indexOf('/hts/jljg/ckts/scsbsj/JLJG_MDTHX') > -1){
                Func.successTz('/hts/jljg/ckts/sbsjcx/JLJG_MDTHX',unitRef);
              }
            } else {
              message.error(msg);
            }
          })
      //})
    },
  });
}


  Func.successTz=(param :any,unitRef:any)=>{
    DDAlert.open({
      title: '系统提示',
      info: '数据正式申报成功，请跳转至申报结果查询，尝试刷新操作，更新审核状态',
      modalType: 'confirm',
      infoType: 'success', 
      isShowcancelText:false, 
      okText: '转申报结果查询',
      okCallbackFn: function (thisObj: any) {
        history.push(param);
        unitRef.current?.reload2();
        // message.success('数据申报成功');
      },
    });

  }

// 配置项：报表打印下载
Func.reportPrint = (param1: any) => {
  const { selectionRows, otherRef } = param1;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  const param: any = selectionRows[0];
  let myYwKey = otherRef[3];
  if (cktsUtil.moduleType(myYwKey, 'SQRQ')) { // 资格备案
    param.tbrq1 = moment(new Date(selectionRows[0].tbrq1)).format('yyyy-MM-DD');
  } else {
    param.ssq = selectionRows[0].ssq;
    if (cktsUtil.moduleType(myYwKey, 'SBPC')) { // 是否有申报批次
      param.sbpc = selectionRows[0].sbpc;
    }
  }
  param.ywKey = myYwKey;
  param.isJgbbz = 'Y';
  queryDsbsjLb(param).then((response) => {
    const { code, body, msg } = response;
    if (code === '200') {
      if (otherRef && otherRef[2]) {
        otherRef[2].current?.showModal(param, body);
      }
    } else if (code === '200') {
      message.info(msg);
    }
  })
}

// 配置项 下载申报文件
Func.downloadFileBtn = async (param: any) => {
  const { selectionRows, otherRef, unitRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  let myYwKey = otherRef[3];
  const url = '/yw/bszx/ggfw/scsbsj/sjgl/sbwjXzGet/';
  const params = {
    ssq: selectionRows[0].ssq,
    sbwjuuid: selectionRows[0].sbwjuuid,
    ywKey: myYwKey
  }
  unitRef.current?.setMasker(true);
  await cktsUtil.downloadFileCkts(url, params);
  unitRef.current?.setMasker(false);
};


// 配置项：自定义操作列 资料上传
Func.viewData = (param: any, event: any) => {
  event.stopPropagation();
  const { record, otherRef, changeDDB2PageData } = param;
  let obj: any = {
    ssq: record.ssq,
    sbpc: record.sbpc,
  }
  if (otherRef[3].indexOf("ZGBA_") > -1 && otherRef[3] != 'ZGBA_BMDLCKBA') {
    obj = {
      tbrq1: moment(record.tbrq1).format('YYYY-MM-DD')
    }
  }
  changeDDB2PageData(obj);
  if (otherRef && otherRef[5]) {
    otherRef[5].current?.showModal(record);
  }
}


// 配置项：退税资料下载
Func.tszlxz = (param: any, event: any) => {
  event.stopPropagation();
  const { record, otherRef, changeDDB2PageData } = param;
  let obj: any = {
    ssq: record.ssq,
    sbpc: record.sbpc,
  }
  otherRef[6].current?.showModal(obj);
}


// 配置项：自定义操作列 刷新数据审核结果
Func.reloadColumn = async (param: any, event: any) => {
  const { unitRef, record, otherRef } = param;
  const params = {
    ssq: record.ssq,
    sbwjuuid: record.sbwjuuid,
    ywKey: otherRef[3]
  }
  const sjzjuuid = record?.sjzjuuid;
  const fkztDm = record?.fkztDm;
  const sjsbuuid = record?.sjsbuuid;
  const sjsbztDm = record?.sjsbztDm;
  let isSjzj = false;
  if (sjzjuuid?.trim() && (fkztDm === '0' || fkztDm === '1')) {
    isSjzj = true;
  }
  let isZssb = false;
  if (sjsbuuid?.trim() && sjsbztDm != '1' && sjsbztDm != '2' && sjsbztDm != '3') {
    isZssb = true;
  }
  const sjzj = {
    code: '200',
    desc : '',
    msg: ''
  };
  const zssb = {
    code: '200',
    desc : '',
    msg: ''
  };
  event.stopPropagation();
  unitRef.current?.setMasker(true);
  if (isSjzj) {
    const sjzjjg = await ycsbSjzjztCx(params);
    sjzj.code = sjzjjg.code;
    sjzj.desc = sjzjjg.desc;
    sjzj.msg = sjzjjg.msg;
  }
  if (isZssb) {
    const zssbjg = await ycsbZssbztCx(params);
    zssb.code = zssbjg.code;
    zssb.desc = zssbjg.desc;
    zssb.msg = zssbjg.msg;
  }
  unitRef.current?.setMasker(false);
  if (sjzj.code === '200') {
    if (zssb?.code === '200') {
      unitRef.current!.reload2();
    } else if (zssb?.code === '900'){
      message.info(zssb?.msg || zssb?.desc);
    } else {
      message.error('申报状态刷新失败！');
    }
  } else if (sjzj.code === '900') {
    message.info(sjzj.msg || sjzj.desc);
  } else {
    message.error('数据自检结果刷新失败！');
  }
};
//  配置项：自定义操作列-按钮显隐-刷新
Func.displayReload = (record: any) => {
  if (record?.sjzjuuid?.trim() && (record.fkztDm == '0' || record.fkztDm == '1')) {
    return false;
  }
  if (record?.sjsbuuid?.trim() && record?.sjsbztDm != '1' && record?.sjsbztDm != '2' && record?.sjsbztDm != '3') {
    return false;
  }
  return true;
}
//  配置项：自定义操作列-按钮显隐-疑点智能处理
Func.displayYdzncl = (record: any) => {
  if ((record.fkztDm != '0' && record.fkztDm != '1')
  && (String(record.sjzjsj).trim() && !String(record?.sjsbuuid).trim() && (record.fkztDm === '3' || record.fkztDm === '2') && record.cnt > 0)) {
    return false;
  }
  return true;
}

Func.proveApplyNew = (param: any) => {
  const { selectionRows, unitRef, otherRef } = param;
  // 检查: 1.数据未选择
  if (!selectionRows || selectionRows.length === 0) {
    message.info('请选择要操作的数据！');
    return;
  }
  // 检查: 2.正式申报增加强制校验-数据自检中，提示稍后申报
  if (selectionRows[0].sjzjpw || selectionRows[0].fkztDm === '1' || selectionRows[0].fkztDm === '0') {
    message.warn('数据自检中，请稍后正式申报！');
    return;
  }
  // 检查: 3.正式申报增加强制校验-已进行数据自检且自检结果存在不可挑过疑点时，不可直接正式申报
  if (selectionRows[0].btgCnt > 0) {
    message.warn('存在不可挑过疑点，不可直接正式申报！');
    return;
  }
  // 检查: 4.正式申报弹窗前，正在正式申报的数据或已经正式申报完成的数据，不弹窗，直接给提示
  if (selectionRows[0].sjsbuuid && selectionRows[0].sjsbuuid.trim()) {
    message.warn('此条数据已做过数据申报，不能重复申报，请确认！');
    return;
  }
  // 检查: 5.自检失败，不允许正式申报       是否会出现这种情况 ???  btgCnt>0的检查是否已经覆盖???
  if (selectionRows[0].fkztDm === '2') {
    message.warn('此条数据自检失败，不允许转入正式申报，请确认！');
    return;
  }
  if (!selectionRows || selectionRows.length === 0) {
    message.info('请选择要操作的数据！');
    return;
  }
  if (selectionRows[0].sjzjsj && selectionRows[0]?.fkztDm === '1') {
    message.info('当前申报数据正在自检中，无法正式申报');
    return;
  }
  if (!selectionRows[0].sjzjuuid || !selectionRows[0].sjzjuuid.trim()) {
    message.info('请先进行数据自检');
    return;
  }
  const obj = selectionRows[0];
  obj.ywKey = otherRef[3];
  otherRef[7].current?.showModal(obj, unitRef);
}


export default Func;