/**
 * title: 境外收货人配置-提取境外收货人
 */
import React from 'react';
import { message, Switch, Button, Form, DatePicker } from 'antd';
import { intl as intl2 } from '@/components/DDAssist/util';
import { deleteJwshr, qyHtyQy } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import myUtil from '@/components/DDAssist/util';
import { wsgltqkh } from '@/pages/hts/services/htsApi';
import locale from 'antd/es/date-picker/locale/zh_CN';
import CONSTANTS from '@/components/DDAssist/constants';


const Func: any = {
  unitRef: React.createRef(),
};

Func.columnsRender = {
  // 关联付汇人数
  renderGlfhrs: (param: any) => {
    const { record } = param;
    let html;
    if (param.text == 0 || !param.text) {
      html = <>0</>
    } else {
      html = <Button type="link" onClick={() => Func.fhrs(param,'1')}>{param.text}</Button>;
    }
    return html;
  },

  renderGljwshrs: (param: any) => {
    let html;
    if (param.text == 0 || !param.text) {
      html = <>0</>
    } else {
      html = <Button type="link" onClick={() => Func.jwshrs(param)}>{param.text}</Button>;
    }
    return html;
  },
  // renderSysj:(param: any) => {
  //   const { record } = param;
  //   if(record?.sqyxqSyts <= 5){
  //     return <div style={{color: '#FF0000'}}>{record?.sqyxqSyts}</div>
  //   }else{
  //     return <>{record?.sqyxqSyts}</>
  //   }
  // },
}

// 提取境外收货人
Func.handletqJwshr = (param: any) => {
  const { unitRef } = param;
  DDAlert.open({
    title: '提取境外收货人',
    infoType: 'warning',
    closeStatus: false,
    isFormContent: true,
    modalType: 'form',
    width:CONSTANTS.C_MODAL_WIDTH_X2,
    content: <>
      <Form.Item label="出口日期范围：" name="ckrq" rules={[{ required: true, message: '请输入提取时间' }]}  >
        <DatePicker.RangePicker placeholder={['出口日期起', '出口日期止']} locale={locale} format={myUtil.date.formatList()} />
      </Form.Item>
      <Form.Item name="drhcqd_wxts" wrapperCol={{ span: 40 }} style={{color: 'red'}}>
        温馨提示：扣除空格、大小写、小数点、逗号后内容相同视为同一规范化境外收货人。
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        thisObj.setState({ masker: true });
        const endTime = values.ckrq[1].endOf('day');
        const ckrq1ks = new Date(values.ckrq[0].format('YYYY/MM/DD')).valueOf();
        const ckrq1js = new Date(endTime.format('YYYY/MM/DD HH:mm:ss')).valueOf();
        wsgltqkh({ ckrq1ks: ckrq1ks, ckrq1js: ckrq1js }).then((response) => {
          const { code, body, desc } = response;
          DDAlert.close();
          if (code === '200') {
            unitRef.current!.reload2();
            if(body.tqsl === 0 ){
              message.error("未查询到报关单数据");
            } else {

              message.success(body);
            }

          } else {
            message.error(desc);
          }
        })
      });
    },
  });
}

Func.glfhr = (param: any) => {
  const {selectionRowKeys,otherRef ,selectionRows} = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  otherRef[1].current?.showModal(param, selectionRowKeys,'2');
}


// 关联付汇人下钻
Func.fhrs = (param: any) => {
  const {selectionRowKeys,otherRef ,selectionRows} = param;
    otherRef[2].current?.showModal(param, selectionRowKeys,'2');


}

// 关联境外收货人下钻
Func.jwshrs = (param: any) => {
  const {selectionRowKeys,otherRef ,selectionRows} = param;
    otherRef[3].current?.showModal(param,selectionRowKeys,'2');
}

Func.deleteJwshr = (param: any) => {
  const { gridRef, selectionRows, unitRef, selectionRowKeys } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_delete_unselected' }));
    return;
  }

  DDAlert.open({
    title: '系统提示',
    info: '确定要删除选择的数据吗？',
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: true,
    content: '',
    isFormContent: false,
    okCallbackFn: function () {
      const data = {
        jwshruuids: selectionRowKeys
      };
      unitRef.current!.setMasker(true);
      deleteJwshr(data).then((response: any) => {
        unitRef.current!.setMasker(false);
        const { code, msg } = response;
        if (code === '200') {
          unitRef.current?.setSelectionRowKeys([]);
          unitRef.current?.setSelectionRows([]);
          gridRef.current?.reload();
          message.success('删除成功！');
        } else {
          message.error(msg);
          return;
        }
      })
    }
  });

}

// 境外收货人编辑
Func.handleJwshrpzbj = (param: any) => {
  const { unitRef } = param;
  const otherRef = unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param,param?.record.jwshruuid, '境外收货人编辑');
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param, param?.record.jwshruuid, '境外收货人编辑');
  }

}

export default Func;
