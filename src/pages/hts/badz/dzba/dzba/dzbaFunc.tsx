/**
 * title: 备案单证 - 单证备案 - 单证备案
 */
import DDAlert from '@/pages/hts/components/DDAlert';
import { modifySlrqjk, sbsjsc } from '@/pages/hts/services/htsApi';
import { DatePicker, Form, message, Button, Tooltip } from 'antd';
import React from 'react';
import { intl as intl2 } from '@/components/DDAssist/util';
import { history } from 'umi';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { EditOutlined, WarningOutlined } from '@ant-design/icons';
const dzbaFunc: any = {
  unitRef: React.createRef(),
};

// 根据路由获取业务key
dzbaFunc.getYwKey = () => {
  const { location } = history;
  const { pathname } = location;
  const arr: any = pathname.split('/');
  let tmpKey: string = '';
  if (arr?.length > 0) {
    tmpKey = arr[arr.length - 1];
  }
  return tmpKey;
};

// 获取申报数据
dzbaFunc.obtainDeclarationData = (param: any, event: any) => {
  const otherRef = param.unitRef.current?.getOtherRefs();
  otherRef[0].current?.showModal(param);
}

//删除
dzbaFunc.del = (param: any) => {
  const { selectionRowKeys, selectionRows, gridRef, unitRef, formQuickFilter } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  for (let i = 0; i < selectionRows.length; i++) {
    if (selectionRows[i].bgdzs != selectionRows[i].dbabgdzs) {
      message.info(intl2.formatMessage({ id: 'message_badz_dzba_zlcj_czdba_warning' }));
      return;
    }
  }
  DDAlert.open({
    title: '系统提示',
    info: intl2.formatMessage({ id: 'message_inquiry_delete' }),
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: true,
    okCallbackFn: function (thisObj: any) {
      unitRef.current!.setMasker(true);
      const data = { uuids: selectionRowKeys };
      sbsjsc(data).then((response) => {
        const { code, desc } = response;
        if (code === '200') {
          message.success(intl2.formatMessage({ id: 'message_delete_success' }));
          close();
          unitRef.current!.reload2();
          unitRef.current!.setMasker(false);
        } else {
          message.error(desc);
          unitRef.current!.setMasker(false);
        }
      })
    }
  });
}
// 办理
dzbaFunc.dzbaHandle = (param: any, event: any) => {
  //   办理按钮：
  // 1. 待备案报关单张数与备案中报关单张数有一个不为0时，跳转至“资料采集”界面；
  // 2. 待备案报关单张数、备案中报关单张数为0、已备案不为0时，跳转至资料归档界面；
  // 3. 报关单张数=已归档报关单张数时，点击该按钮，跳转至“报关单调阅”界面
  event.stopPropagation();
  const { record } = param;
  if (record.dbabgdzs != 0 || record.bazbgdzs != 0) {
    history.push({ pathname: '/hts/badz/dzba/zlcj', query: { ssq: record.ssq, sbpc: record.sbpc,lcswsxDm:record.lcswsxDm } });
  } else if (record.dbabgdzs == 0 && record.bazbgdzs == 0 && record.dgdbgdzs != 0) {
    history.push({ pathname: '/hts/badz/zlgd', query: { ssq: record.ssq, sbpc: record.sbpc,lcswsxDm:record.lcswsxDm  } });
  } else if (record.bgdzs == record.ygdbgdzs) {
    history.push({ pathname: '/hts/badz/zldy/abgddy', query: { ssq: record.ssq, sbpc: record.sbpc,lcswsxDm:record.lcswsxDm  } });
  }
}

// 修改受理日期
dzbaFunc.modifySlrq = (param: any) => {
  // record原始数据的所有数据信息
  const { record, unitRef } = param;
  DDAlert.open({
    title: '修改受理日期',
    infoType: 'info',
    isFormContent: true,
    modalType: 'form',
    initFormContentValues: { slrq: moment(new Date(Number(record.slrq))) },
    content: <>
      <Form.Item name="slrq" label="受理日期" >
        <DatePicker locale={locale} allowClear={false} />
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      // 修改后的受理日期
      const c2 = DDAlert.getContentFormData().slrq.valueOf();
      record.slrq = moment(new Date(Number(c2))).format('YYYY-MM-DD');
      thisObj.setState({ masker: true });
      // 受理日期修改接口
      modifySlrqjk(record).then((response) => {
        DDAlert.close();
        const { code, desc } = response;
        DDAlert.close();
        if (code === '200') {
          message.success(intl2.formatMessage({ id: 'message_badz_dzba_dzba_xgslrq_success' }))
          unitRef.current!.reload2();
        } else {
          message.error(desc);
        }
      })
    },
  });
}

// 列表自定义渲染
dzbaFunc.columnsRender = {
  // 备案单证 - 单证备案 - 单证备案 - 受理日期
  renderBadzSlrq:(param: any) => {
    let col: any = <span></span>;
    if (param.text) {
      col = <>
        <span>{moment(new Date(Number(param.text))).format('yyyy-MM-DD')}</span>
        <Button style={{ marginLeft: '5px' }} type="link" onClick={(event: any) => { event.stopPropagation(); dzbaFunc.modifySlrq(param) }}><EditOutlined /></Button>
      </>
    }
    return col;
  },

  // 备案单证 - 单证备案 - 单证备案 - 备案日期
  renderBadzBaqx: (param: any) => {
    let col: any = <span></span>;
    if (param.text) {
      if (param.text > moment(new Date())) {
        col = <span>{moment(new Date(Number(param.text))).format('YYYY-MM-DD')}</span>
      } else {
        col = <><span>{moment(new Date(Number(param.text))).format('YYYY-MM-DD')}</span><span style={{ marginLeft: '5px', color: 'red' }}><Tooltip placement="topLeft" title="超过备案期限" arrowPointAtCenter><WarningOutlined /></Tooltip></span></>
      }
    }
    return col;
  },
}


export default dzbaFunc;