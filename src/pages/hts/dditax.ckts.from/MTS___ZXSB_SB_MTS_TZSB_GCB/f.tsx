/**
 * title: 外贸企业调整申报
 * author: wx
 */
import React from 'react';
import { checkYglhYcj, hysbqkByIds } from '@/pages/hts/services/htsApi';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { intl as intl2 } from '@/components/DDAssist/util';
import { message,Table } from 'antd';
import DDAlert from '@/pages/hts/components/DDAlert';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';


const Func: any = {
  unitRef: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
  const {form} = param;
  form.setFieldsValue({
    cktmsywlxdmjh: 'HZCJ',
    cktmsywlxmcjh: '红字冲减',
    hzcjyyDm: null
  });


}

//  编辑表单初始化
Func.initEditForm = (param: any) => {
  const {handleModalVisible, form} = param
  handleModalVisible(true)
  form.validateFields(['yglh'])
}

Func.handleCjsb = (param: any) => {
  const {otherRef,unitRef} = param;
  otherRef[0].current?.showModal(unitRef);
}

// 表单校验
Func.validator = {
  // 申报批次
  sbpc01: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbpc01(form);
  },
  // 申报批次
  sbpc02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbpc02(form);
  },
  // 申报序号
  sbxh02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbxh02(form);
  },
  // 原关联号
  yglh01: (form: any) => {
    const uuid = form?.getFieldValue('uuid');
    const ssq = form?.getFieldValue('ssq');
    const sbpc = form?.getFieldValue('sbpc');
    const yglh = form?.getFieldValue('yglh');
    // 请求后端验证所属期是否已申报



    const validator = async (_rule: any, value: any) => {
      const params = {
        uuid: uuid,
        ssq,
        sbpc,
        yglh,
      }
      if(ssq && sbpc && yglh) {
        await checkYglhYcj(params).then((res) => {
          if (res.code !== '200') {
            return Promise.reject(new Error(res.msg));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
      }
      return Promise.resolve();
    };
    return { validator };
  },
  hzcjyyDm: (form: any) => {
    const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
    const validator = async (_rule: any, value: any) => {
      if (cktmsywlxdmjh === 'HZCJ') {
        if (!value) {
          return Promise.reject(new Error('业务类型包含“HZCJ”时，红字冲减原因不能为空'));
        }
        return Promise.resolve();
      } else {
        if (value) {
          return Promise.reject(new Error('业务类型不包括“HZCJ”时，红字冲减原因须为空'));
        }
        return Promise.resolve();
      }
    };
    return { validator };
  }
}
// 表单事件：OnBlur
Func.eventOnBlur = {
  // 申报批次
  sbpc: (param: any) => {
    // 申报批次自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbpc(param);
  },
  // 申报序号
  sbxh: (param: any) => {
    // 申报序号自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbxh(param);
  },
  cktmsywlxdmjhOnblur: (param: any) => {
    const { form, event, value } = param;
    const inputValue = event?.target?.value || value;
    const rows = myUtil.code.getCode('code_dm_ckts_cktmsywlx:08');
    const tempRows = rows.filter((row: any) => {
      return (row.code === inputValue);
    });
    if (tempRows && tempRows.length > 0) {
      const obj: any = {
        cktmsywlxmcjh: tempRows[0].name
      }
      if (tempRows[0].code != 'HZCJ') {
        obj.hzcjyyDm = null;
      }
      form.setFieldsValue(obj);
    } else {
      form.setFieldsValue({
        cktmsywlxmcjh: null,
        hzcjyyDm: null,
      });
    }
  }
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
}

const columnsSucc = [
  { title: '原关联号', dataIndex: 'yglh', width: '180px', ellipsis: true },
  { title: '报关单号', dataIndex: 'ckbgdh',  width: '180px', ellipsis: true },
  { title: '进货凭证号', dataIndex: 'jhpzh',  width: '180px', ellipsis: true },
  { title: '行号', dataIndex: 'hh',  width: '40px', ellipsis: true },
  { title: '缴款书号码', dataIndex: 'ssjkshm',  width: '180px', ellipsis: true },

];
// 还原申报情况
Func.hysbqk = (param:any) =>  {
  const { selectionRows,selectionRowKeys,unitRef,otherRef} = param;
  if (selectionRowKeys?.length === 0 || selectionRowKeys?.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
  } else {
    let yglhArr: any[] = [];
      selectionRows.forEach((item: any) => {
        yglhArr.push(item.yglh);
      });
    hysbqkByIds({ glhs: yglhArr, uuids:selectionRowKeys }).then((response) => {
      const { code, msg,body,desc } = response;
      if (code === '200') {
        unitRef.current!.reload2();
        DDAlert.open({
          title: '系统提示',
          isShowcancelText: false,
          infoType: 'success',
          modalType: 'form',
          closeStatus: false,
          width: CONSTANTS.C_MODAL_WIDTH_X3,
          isFormContent: false,
          okCallbackFn: async function (thisObj: any) {
            DDAlert.close();
          },
          content: <>
            <div>{desc}</div>
            <br/>
            <Table dataSource={body} columns={columnsSucc} size="small" />
          </>
        })
      } else if(code === '900'){
        otherRef[1].current?.showModal(unitRef,body);
      } else {
        message.error(msg);
      }
    });
  }
}

// 配置项：自定义工具栏 海外仓冲击爱你
Func.hwccj = (param: any) => {
  const {unitRef} = param;
  const otherRef = unitRef.current?.getOtherRefs();
  otherRef[2].current!.showModal(param);
}
export default Func;
