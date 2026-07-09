import { message } from "antd";
import React from 'react';
import { intl as intl2 } from '@/components/DDAssist/util';

const Func: any = {
  refUnit: React.createRef(),
};

Func.handleFpsqdTzSave = (param: any) => {
  const { record, otherRef } = param;
  // 主页面传输的值
  const mainData = otherRef[0].data;
  // 主页面对外暴露刷新值按钮
  const mainRef = otherRef[0].mainRef;
  // 将值返回到发票页面
  const drmbkjFmhx = mainRef.current!.drmbkjFmhx;
  drmbkjFmhx(record, mainData);
  message.success(intl2.formatMessage({ id: 'message_ckfp_fppz_fm_success' }));
  // 关闭赋码弹窗
  otherRef[1].current.closeModal();
}
export default Func;