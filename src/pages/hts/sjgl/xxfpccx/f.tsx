import React from 'react';
import { message } from 'antd';
import { fpyl } from '@/pages/hts/services/htsApi';
import { history } from 'umi';
import myUtil from '@/components/DDAssist/util';

const fpxxFunc: any = {
  unitRef: React.createRef(),
};

fpxxFunc.filterValidate = (param: any) => {
  const kprq = param?.form.getFieldValue('kprq');
  if (!kprq || kprq.length !== 2) {
    message.info('请输入筛选条件，开票日期必填！');
    return false;
  } else {
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    const fpcxzdyffw = userInfo?.qypz?.QYPZGL_FPCXZDYFFW ? userInfo?.qypz?.QYPZGL_FPCXZDYFFW : 24;
    const kprqQ = kprq[0];
    const kprqZ = kprq[1];

    // 计算两个日期之间的月份差
    const date1 = new Date(kprqQ);
    const date2 = new Date(kprqZ);
    const monthsDiff = (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());

    if (monthsDiff > fpcxzdyffw) {
      message.info('开票日期范围不能超过' + fpcxzdyffw + '个月！');
      return false;
    }
    return true;
  }
}

// 关单信息状态标志
fpxxFunc.columnsRender = {
  renderJxfpccxFpyl: (param: any) => {
    const { record } = param;
    if (record.sfyfj == 'Y' && (record.fplxDm == '81' || record.fplxDm == '82')) {
      return <a onClick={(e) => {
        e.stopPropagation();
        fpxxFunc.openfp(param)
      }}>{record?.fphm}</a>;
    } else if ((record.fplxDm != '81' && record.fplxDm != '82')) {
      return <a onClick={(e) => {
        e.stopPropagation();
        fpxxFunc.openfp(param)
      }}>{record?.fphm}</a>;
    } else {
      return <>{record?.fphm}</>
    }
  }
};

fpxxFunc.openfp = async (param: any) => {
  const { record, unitRef, otherRef } = param;
  unitRef.current?.setMasker(true);
  await fpyl({ sjgjsjDm: '020101', uuid: record?.uuid, jhpzh: record?.jhpzh, exportKey: 'PDF_REPORT_SJGLSAAS_XXFPCCX_FP' }).then(async (response) => {
    unitRef.current?.setMasker(false);
    if (response.code == '200') {
      otherRef[0].current?.showModal(response.body);
    } else {
      message.error(response.msg);
    }
  });
}

fpxxFunc.handleOnChangeCxlx = (param: any) => {
  const p = {};
  const { value } = param;
  if (value == '1') {
    history.push({ pathname: '/02/0213', query: p })
  } else {
    history.push({ pathname: '/02/0212', query: p })
  }
}


export default fpxxFunc;
