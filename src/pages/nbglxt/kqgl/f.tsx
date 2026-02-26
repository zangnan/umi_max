import React from 'react';
import { importByFileAndPathDdCbcb, importByFileAndPathDdDk } from '@/services/hts/api';
import myUtil from '@/components/DDAssist/util';

const Func: any = {
  refUnit: React.createRef(),
};

// 弹窗 导入钉钉考勤 入口：考勤管理 - 钉钉考勤原始数据
Func.drddkq = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
}

// 弹窗 导入钉钉餐补车补 入口：考勤管理 - 钉钉餐补车补数据
Func.drddcbcb = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
}

// 导入钉钉考勤
Func.importDDkq = (param: any) => {
  let setMasker: any = param.setMasker;
  let files: any = param.form.getFieldValue('file');
  const formData: any = new FormData();
  formData.append('file', files[0].originFileObj);
  if (setMasker) {
    setMasker(true);
  }
  importByFileAndPathDdDk(formData).then((response: any) => {
    let { code, msg} = response;
    param.setModalVisible(false);
    myUtil.modal.responseInfo({code, msg});
    if (setMasker) {
      setMasker(false);
    }
    if (code === '200') {
      param?.parentParam?.refUnit?.current?.reload();
    }
  })
}

// 导入钉钉餐补车补数据
Func.importDDCbcb = (param: any) => {
  let setMasker: any = param.setMasker;
  let files: any = param.form.getFieldValue('file');
  const formData: any = new FormData();
  formData.append('file', files[0].originFileObj);
  if (setMasker) {
    setMasker(true);
  }
  importByFileAndPathDdCbcb(formData).then((response: any) => {
    let { code, msg} = response;
    param.setModalVisible(false);
    myUtil.modal.responseInfo({code, msg});
    if (setMasker) {
      setMasker(false);
    }
    if (code === '200') {
      param?.parentParam?.refUnit?.current?.reload();
    }
  })
}

// 弹窗 生成每日考勤
Func.initDailyData = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal({...param, type: '1'});
  }
}

// 弹窗 生成考勤汇总
Func.initDataKq = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal({...param, type: '2'});
  }
}

// 弹窗 生成考勤汇总 导出
Func.exportDataKq = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal({...param, type: '4'});
  }
}

// 弹窗 生成加班汇总
Func.initDataJb = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal({...param, type: '3'});
  }
}

// 列表自定义渲染
Func.columnsRender = {
  // nbglRq
  nbglRq: (param: any) => {
    const nbglRq = param?.record.nbglRq;
    const nbglRqRender = myUtil.date.formatDate(nbglRq, 'YYYY年MM月');
    return nbglRqRender;
  },
  // 加班时长
  jbsc: (param: any) => {
    const nbglJbsc = param?.record.nbglJbsc;
    return myUtil.date.convertMinutes(nbglJbsc);
  }
}

// 报表自定义渲染
Func.indicator = {
  nbglJbsc: {
    SUM: {
      format: (param1: any) => myUtil.date.convertMinutes(param1),
      title: '加班总时长',
    },
    AVG: {
      format: (param1: any) => myUtil.date.convertMinutes(myUtil.text.formatNum(param1, '0,0')),
      title: '加班总时长',
    },
    MAX: {
      format: (param1: any) => myUtil.date.convertMinutes(param1),
      title: '加班总时长',
    },
    MIN: {
      format: (param1: any) => myUtil.date.convertMinutes(param1),
      title: '加班总时长',
    },
    COUNT: {
      title: '在职人数',
    },
  }
}

// 列表合计自定义渲染
Func.statistics = {
  sum2: {
    jbsc: ({sum2}: any) => myUtil.date.convertMinutes(sum2?.nbglJbsc || 0)
  },
  min2: {
    jbsc: ({min2}: any) => myUtil.date.convertMinutes(min2?.nbglJbsc || 0)
  },
  max2: {
    jbsc: ({max2}: any) => myUtil.date.convertMinutes(max2?.nbglJbsc || 0)
  },
  avg2: {
    jbsc: ({avg2}: any) => myUtil.date.convertMinutes(avg2?.nbglJbsc || 0)
  }
}


export default Func;