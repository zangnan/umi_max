import { queryReportData } from '@/pages/hts/services/htsApi';
import { message, Form, Input } from 'antd';
import React from 'react';
import { history } from 'umi';
import DDAlert from '@/pages/hts/components/DDAlert';
import businessValidator from "../common/businessValidator";

const Func: any = {
  unitRef: React.createRef(),
};

// 申报结果查询的免抵退核销数据导出方法
Func.handleSbjgcxMdthxSjdc = (param: any) => {
  const { selectionRowKeys, selectionRows, gridRef } = param;
  console.info(selectionRowKeys);
  console.info(selectionRows);
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    // message.info('请选择要操作的数据！');
    message.info(Func.init.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    message.info({
      content: `当前选中 ${selectionRowKeys.length} 条数据！`,
      onClose: () => {
        gridRef.current!.reload();
      }
    });
  }
}

// 申报结果查询的免抵退核销数据数据标识改变刷新列表
Func.mdthxSjbsOnChange = (param: any) => {
  const { value } = param;
  if (value === 'JLJG_ZXSB_SB_JLJG_MDTHX_F') {
    history.push('/hts/jljg/sbjgcxHmdthxF');
  } else {
    history.push('/hts/jljg/sbjgcxHmdthxJ');
  }
}

// 申报结果查询的已核销调整数据导出方法
Func.handleSbjgcxYhxtzSjdc = (param: any) => {
  const { selectionRowKeys, selectionRows, gridRef } = param;
  console.info(selectionRowKeys);
  console.info(selectionRows);
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    // message.info('请选择要操作的数据！');
    message.info(Func.init.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    message.info({
      content: `当前选中 ${selectionRowKeys.length} 条数据！`,
      onClose: () => {
        gridRef.current!.reload();
      }
    });
  }
}

// 申报结果查询的已核销调整数据标识改变刷新列表
Func.yhxtzSjbsOnChange = (param: any) => {
  const { value } = param;
  if (history?.location?.pathname.indexOf('CXTJ_') > 0) { // 数据管理进入
    if (value === 'JLJG_ZXSB_SB_JLJG_HGSJTZ_F') {
      history.push('/02/0207/020708/CXTJ_02070804');
    } else {
      history.push('/02/0207/020708/CXTJ_02070805');
    }
  } else {
    if (value === 'JLJG_ZXSB_SB_JLJG_HGSJTZ_F') {
      history.push('/hts/jljg/sbjgcxHyhxtzF');
    } else {
      history.push('/hts/jljg/sbjgcxHyhxtzJ');
    }
  }
}

// 进料加工业务免抵退税核销表报表打印
Func.handleMdthxHgsjtzCxBbdy = (param: any) => {
  const { formQuickFilter, otherRef, unitRef } = param;
  const gridData = unitRef.current?.getGridData();
  if (!gridData || gridData.length <= 0) {
    message.info(Func.intl.formatMessage({ id: 'message_common_nodata_print' }));
    return ;
  }
  const sjbs = formQuickFilter.getFieldsValue().sjbs;
  let key = '';

  DDAlert.open({
    title: Func.intl.formatMessage({ id: 'message_jljghx_sbjgcx_bbdy_title' }),
    infoType: 'warning',
    closeStatus: false,
    initFormContentValues : {ssq: ''},
    isFormContent: true,
    modalType: 'form',
    okCallbackFn : function(thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        thisObj.setState({masker: true});
        values.Key = key;
        let value = {};
        let flag ="3";
       if (sjbs === 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J' || sjbs === 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J') {
        value ={
					"ywKey": "JLJG_MDTHX_HGSJTZ",
					"t2": "JLJG_ZXSB_SB_JLJG_HGSJTZ_S",
					"bussEnglish": "JLJG_ZXSB_SB_JLJG_HGSJTZ_J",
					"gridEnglish": "ZXSB_SB_JLJG_HGSJTZ_JGB",
					"cxtjdybz": "Y",
					"ssq": values.ssq,
          "sbpc": values.sbpc
				};
      } else {
        value ={
					"ywKey": "JLJG_MDTHX_HGSJTZ",
					"t2": "JLJG_ZXSB_SB_JLJG_HGSJTZ_S",
					"bussEnglish": "JLJG_ZXSB_SB_JLJG_HGSJTZ_J",
					"gridEnglish": "ZXSB_SB_JLJG_HGSJTZ_GCB",
					"cxtjdybz": "Y",
					"ssq": values.ssq,
          "sbpc": values.sbpc
				};
        flag='4';
      }
        queryReportData(value).then((response) => {
          thisObj.setState({masker: false});
          const {code, desc, body} = response;
          if (code === '200') {
            if (body && body.length > 0) {
              DDAlert.close();
              otherRef[0].current!.showModal({key: key, ssq: values.ssq, sbpc: values.sbpc}, body,flag);
            } else {
              message.info(Func.intl.formatMessage({ id: 'message_jljghx_sbjgcx_bbdy_nodata' }));
            }
          } else {
            DDAlert.close();
            message.error(desc);
          }
        });
      });
    },
    content: <>
      <Form.Item name='ssq' label='所属期' rules={[{ required: true, message: '' },businessValidator.ssq()]}>
        <Input placeholder='所属期' size='small' />
      </Form.Item>
      <Form.Item name='sbpc' label='申报批次' rules={[{ required: true, message: '' },businessValidator.sbpc()]}>
        <Input placeholder='申报批次' size='small' />
      </Form.Item>
     
    </>,
  });
}

export default Func;

