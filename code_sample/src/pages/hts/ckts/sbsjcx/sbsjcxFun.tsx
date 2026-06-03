import React from 'react';
import { ycsbZssbztCx, getJ4TsshjdInfo } from '@/services/hts/api';
import { message, Form, Upload, Button, Tooltip } from 'antd';


const Func: any = {
  unitRef: React.createRef(),
};
// 配置项：自定义操作列 刷新数据审核结果
Func.reloadColumn = (param: any, event: any) => {
  event.stopPropagation();
  const { unitRef, record, otherRef } = param;
  const params = {
    ssq: record.ssq,
    sbwjuuid: record.sbwjuuid,
    ywKey: otherRef[2]
  }
  unitRef.current?.setMasker(true);
  ycsbZssbztCx(params).then((response) => {
    unitRef.current?.setMasker(false);
    const { code, msg, desc } = response;
    if (code === '200') {
      unitRef.current!.reload2();
    } else if (code === '900') {
      message.info(msg || desc);
    } else {
      message.error('刷新失败！');
    }
  });
};
//  配置项：自定义操作列-按钮显隐-刷新
Func.displayReload = (record: any) => {
  if (record.sjsbztDm != '2' && record.sjsbztDm != '3') {
    return false;
  }
  return true;
}

// 配置项：自定义操作列 审核进度查询
Func.shjdcxColumn = (param: any, event: any) => {
  event.stopPropagation();
  const { unitRef, record, otherRef } = param;
  unitRef.current?.setMasker(true);
  getJ4TsshjdInfo({ ssq: record.ssq, sbpc: record?.sbpc, sbwjuuid: record.sbwjuuid, sjsbsj: record.sjsbsj, ywKey: otherRef[2] }).then((response) => {
    unitRef.current?.setMasker(false);
    const { code, msg, body } = response;
    if (code === '200' && otherRef && otherRef[3]) {
      otherRef[3].current?.showModal(body);
    } else {
      message.error(msg);
    }
  });
};

//  配置项：自定义操作列-按钮显隐-审核进度查询
Func.displayShjdcx = (record: any) => {
  const lcswsxDm = record.lcswsxDm;
  const sjsbztDm = record.sjsbztDm;
  // 审核状态为审核中或者审核完成 并且业务为：免抵退、免退税、代办退税按钮显示
  if ((sjsbztDm === '1' || sjsbztDm === '3') && (lcswsxDm === 'LCSXA081038001' || lcswsxDm === 'LCSXA081039001' || lcswsxDm === 'LCSXA081040001')) {
    return false;
  }
  return true;
}

// 配置项：历史申报记录
Func.historyRecord = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
}

// 配置项：审核数据下载
Func.shsjxz = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal(param);
  }
}

export default Func;