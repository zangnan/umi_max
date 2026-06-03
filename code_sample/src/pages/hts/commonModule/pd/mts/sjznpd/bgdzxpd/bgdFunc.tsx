/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { history, request } from 'umi';
import DDAlert from "@/components/DDAlert";
import locale from 'antd/es/date-picker/locale/zh_CN';
import { zdpd } from '@/services/hts/api';
import { message,Form, DatePicker } from 'antd';


const Func: any = {
  unitRef: React.createRef(),
};

// 配单
Func.handPdColumns = (param: any) => {
  const { unitRef, record, otherRef } = param;
  unitRef.current!.setMasker(true);
  const uuid = record.uuid;
  let tableKey;
  // 可用值替换原始值 确保以前的方法不需要调整
  record.cjsl1 = record.kycjsl1;
  record.cksl = record.kycksl;
  record.decksl = record.kydecksl;
  record.mylaj = record.kymylaj;
  record.rmblaj = record.kyrmblaj;
  if(history?.location?.pathname.indexOf('/04/0403/040301') > -1 || history?.location?.pathname.indexOf('/27/2704/270401') > -1) {
    // 外贸综合服务企业代办退税申报表
    tableKey = 'DBTS_ZXSB_SB_DB_TSSB_G';
  } else {
    // 货物劳务及服务退税申报
    tableKey = 'MTS_ZXSB_SB_MTS_TSSB_G';
  }
  request(`${API_URL_BASE}/yw/bszx/ggfw/sbcs/ywcsxx/queryCjCsh`, { method: 'POST', data: { tableKey: tableKey } }).then((response) => {
    const { code, body } = response;
    unitRef.current!.setMasker(false);
    if (code === '200') {
      const obj = {
        sbpc: body.sbpc,
        ssq: body.ssq,
      }
      const sbxh = body?.sbxh;
      request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/queryCjGlh`, { method: 'POST', data: obj}).then((res) => {
        if(res.code === '200') {
          const para = body;
          para.glh = res.body.glh
          para.sbxh = sbxh;
          otherRef[0].current!.showModal(para, unitRef, record);
        }
      })
    }
  })
}


// 自动配单
Func.abgdZdpd = (param: any) => {
  const { otherRef, unitRef } = param;
  DDAlert.open({
    title: '自动配单',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    content: <>
      <Form.Item label='出口日期' name="ckrq1" rules={[
        () => ({
          validator(_, value) {
            if (value && value.length === 2) {
              if (value[0].get('year') != value[1].get('year')) {
                return Promise.reject(new Error('出口日期不可跨年'));
              }
              return Promise.resolve();
            } else {
              return Promise.reject(new Error('请选择出口日期！'));
            }
          },
        })
      ]}>
        <DatePicker.RangePicker locale={locale} placeholder={['出口日期起', '出口日期止']} />
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        thisObj.setState({ masker: true });
        const ckrq1Q = values.ckrq1[0].format('YYYY-MM-DD');
        const ckrq1Z = values.ckrq1[1].format('YYYY-MM-DD');
        zdpd({ ckrq1Q, ckrq1Z }).then((res) => {
          const { code, body, desc } = res;
          thisObj.setState({ masker: false });
          if (code === '200') {
            DDAlert.close();
            unitRef?.current?.reload2();
            otherRef[1].current?.showModal({ ...param, zdpdResult: body });
          } else {
            message.error(desc);
          }
        })
      })
    }
  })
}
export default Func;
