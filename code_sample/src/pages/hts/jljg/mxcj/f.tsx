import DDAlert from '@/components/DDAlert';
import { commonInitJbxx, recalculateMdthxfpl, checkSsqPcYsb, mdthxbplsc, queryYwsjBySzc } from '@/services/hts/api';
import { message, Form, Input, Modal } from 'antd';
import React from 'react';
import myUtil from '@/pages/common/myUtil';
import { intl as intl2 } from  '@/pages/common/myUtil';
import moment from 'moment';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';

const Func: any = {
  unitRef: React.createRef(),
};

// 免抵退核销配置项：自定义工具栏
// 免抵退核销重新计算分配率方法
Func.handleMdthxCxjsfpl = (param: any) => {
  const {selectionRows, unitRef,gridRef } = param;
  if (gridRef.current.getPagination().total === 0) {
    message.info(intl2.formatMessage({ id: 'validator_jhfpl_01' }));
    return;
  }
  let content = '';
  let info = '';
  let model: any = [];
  if (!selectionRows || selectionRows.length === 0) {
    unitRef.current?.getGridParams().searchModel.forEach((item:any) => {
      model.push(item);
    });
    if (gridRef.current?.getHeaderFilter()) {
      gridRef.current?.getHeaderFilter().forEach((item: any) => {
        model.push(item);
      });
    }
    content = '当前' + gridRef.current?.getPagination().total + '条数据';
    info = intl2.formatMessage({ id: 'message_jljghx_jhfpl_cxjs_check' });
  } else {
    const uuids = [];
    for (let i = 0; i< selectionRows.length; i++ ) {
      uuids.push(selectionRows[i].uuid);
    }
    model.push({property: "uuids", values: uuids, op: "ain"});
    content = '当前已勾选' + selectionRows.length + '条数据';
    info = intl2.formatMessage({ id: 'message_jljghx_jhfpl_gxjhfpl_check' });
  }
  DDAlert.open({
    title: '重新计算分配率确认',
    info: info,
    modalType: 'confirm',
    infoType: 'question',
    okText: '确认',
    content: [
      content,
     ],
    okCallbackFn: function () {
      const otherRefs = unitRef.current?.getOtherRefs();
      if (otherRefs[0]) {
        otherRefs[0].current?.showModal({searchModel: model}, gridRef);
      }
    }
  });
}

//查看明细
Func.handleCkmx = (param: any) => {
  const {record, gridRef } = param;
  const otherRefs = Func.unitRef.current?.getOtherRefs();
      if (otherRefs[1]) {
        otherRefs[1].current?.showModal({searchModel: record}, gridRef);
  }
}

Func.mdtshxMxtj = (param: any, e: any) => {
  e.stopPropagation()
  const {otherRef} = param;
  otherRef[2].current?.showModal(param);
}

// 已核销调整配置项：自定义工具栏
// 已核销调整重新计算分配率方法
Func.handleYhxtzCxjsfpl = (param: any) => {
  const { selectionRowKeys, gridRef, unitRef } = param;
  const gridData = unitRef.current?.getGridData();
  if (gridData.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_jljghx_jhfpl_sjcj_check' }));
    return;
  }
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    Modal.confirm({
      title: intl2.formatMessage({ id: 'message_jljghx_jhfpl_cxjssx_check' }),
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // 确认调用接口,
        unitRef.current!.setMasker(true);
        recalculateMdthxfpl({ id: 1 }).then((response) => {
          unitRef.current!.setMasker(false);
          if (response.code === '200') {
            DDAlert.open({
              title: intl2.formatMessage({ id: 'message_jljghx_jhfpl_cxjssj_check' }),
              info: intl2.formatMessage({ id: 'message_jljghx_jhfpl_cgjs_check' }),
              modalType: 'confirm',
              okText: '确认',
              content: [
                intl2.formatMessage({ id: 'message_jljghx_jhfpl_cxjssj_check' }) + response.ts + '条',
              ],
              okCallbackFn: function () {
                gridRef.current!.reload();
              }
            });
          } else {
            message.error(intl2.formatMessage({ id: 'message_jljghx_jhfpl_tzdc_error' }));
            return;
          }
        })
      }
    });
  } else {
    Modal.confirm({
      title: intl2.formatMessage({ id: 'message_jljghx_jhfpl_qrcxjs_check' }),
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // 确认调用接口,
        unitRef.current!.setMasker(true);
        recalculateMdthxfpl({ id: 1 }).then((response) => {
          unitRef.current!.setMasker(false);
          if (response.code === '200') {
            DDAlert.open({
              title: intl2.formatMessage({ id: 'message_jljghx_jhfpl_cxjssj_check' }),
              info: intl2.formatMessage({ id: 'message_jljghx_jhfpl_cgjs_check' }),
              modalType: 'confirm',
              okText: '确认',
              content: [
                intl2.formatMessage({ id: 'message_jljghx_jhfpl_cxjssj_check' }) + selectionRowKeys.length + '条',
              ],
              okCallbackFn: function () {
                gridRef.current!.reload();
              }
            });
          } else {
            message.error(intl2.formatMessage({ id: 'message_jljghx_jhfpl_tzdc_error' }));
            return;
          }
        })
      }
    });
  }
}

// 免抵退核销配置项：自定义工具栏
// 免抵退核销批量删除
Func.handlePlscMxbData = (param: any) => {
  const { gridRef } = param;
  const titleMessage = intl2.formatMessage({ id: 'message_jljghx_mdtmxb_plsc_title' });
  DDAlert.open({
    title: titleMessage,
    infoType: 'info',
    closeStatus: false,
    isFormContent: true,
    okCallbackFn : function(thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        const scData = {
          ssq : values.ssq,
          sbpc : values.sbpc
        }
        DDAlert.open({
          title: titleMessage,
          infoType: 'info',
          closeStatus: false,
          isFormContent: true,
          modalType: 'confirm',
          okCallbackFn : function(thisObj: any) {
            thisObj.setState({ masker: true });
            mdthxbplsc(scData).then((qrresponse) => {
              if (qrresponse.code === '200') {
                DDAlert.close();
                message.success('批量删除成功！');
              } else {
                DDAlert.close();
                message.error('批量删除失败！');
              }
              gridRef.current!.reload();
            });
          },
          content: '确认清空当前所属期批次的所有数据吗？',
        });
      })
    },
    modalType: 'form',
    content: <>
      <Form.Item name='ssq' label='所属期' rules={[{required: true,message: '请输入所属期'},{pattern: new RegExp('^(20|19){1}[0-9]{2}(((0){1}[1-9]{1})|((1){1}(0|1|2){1}))$','g'),message:'只允许输入YYYYMM型'}]}>
        <Input placeholder='所属期' size='small' />
      </Form.Item>
      <Form.Item name='sbpc' label='申报批次' rules={[{ required: true, message: '请输入申报批次' },() => ({
        validator(_, value) {
          if (value) {
            if (!value.match(/^\d+$/)) {
              return Promise.reject(new Error(intl2.formatMessage({id: 'validator_number'})));
            }
            if (value.length != 3) {
              let message = myUtil.text.formatRepalce(intl2.formatMessage({id: 'validator_v_eq'}), {len: 3});
              return Promise.reject(new Error(message));
            }
            return Promise.resolve();
          }
          return Promise.resolve();
        }
      })]}>
        <Input placeholder='申报批次' size='small'/>
      </Form.Item>
    </>,
  });
}

Func.validator = {
  validatorSsq: () => {
    const validator = (_rule: any, value: any) => {
      if (value === '' || value === undefined) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_ssq_02' })));
      } else if (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_d_yyyyMM' })));
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 所属期
  ssq02: (form: any) => {
    return DditCktsFormCommonFunc.validator.ssq01(form);
  },
  // 申报批次
  sbpc02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbpc01(form);
  },
  // 自定义校验
  validatorMdthxSzch: () => {
    const validator =  (_rule: any, value: any) => {
      if (!(value.toUpperCase().startsWith('C') ||value.toUpperCase().startsWith('E') || value.toUpperCase().startsWith('H') || value.toUpperCase().startsWith('T')
      || value.toUpperCase().startsWith('J'))) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_szch_01' })));
      }
      return Promise.resolve();
    };
    return { validator };
  },
  validatorMdthxFpl: () => {
    const validator =  (_rule: any, value: any) => {
      if (!(value >=0 && value <=100)) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_sjfpl_01' })));
      }
      return Promise.resolve();
    };
    return { validator };
  },
  validatorYhxtzSzch: () => {
    const validator =  (_rule: any, value: any) => {
      if (!(value.toUpperCase().startsWith('C') ||value.toUpperCase().startsWith('E') || value.toUpperCase().startsWith('H') || value.toUpperCase().startsWith('T')
      || value.toUpperCase().startsWith('J'))) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_szch_01' })));
      }
      return Promise.resolve();
    };
    return { validator };
  },
  validatorMdthxHxqsrq: (form: any)=> {
    const jljgszch = form?.getFieldValue('jljgszch');
    const validator = async (_rule: any, value: any) => {
      if (jljgszch && (jljgszch.toUpperCase().startsWith('E') || jljgszch.toUpperCase().startsWith('H') || jljgszch.toUpperCase().startsWith('T') || jljgszch.toUpperCase().startsWith('J'))) {
        if (!value) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_hesj_01' })));
        }
      }
      const hxqsrq = form?.getFieldValue('hxqsrq');
      const hxjzrq = form?.getFieldValue('hxjzrq');
      if (hxqsrq && hxjzrq) {
        if (new Date(hxqsrq.format('YYYY-MM-DD')).getTime() > new Date(hxjzrq.format('YYYY-MM-DD')).getTime()) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_hesj_02' })));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  validatorMdthxHxjzrq: (form: any)=> {
    const jljgszch = form?.getFieldValue('jljgszch');
    const validator = async (_rule: any, value: any) => {
      if (jljgszch && (jljgszch.toUpperCase().startsWith('E') || jljgszch.toUpperCase().startsWith('H') || jljgszch.toUpperCase().startsWith('T') || jljgszch.toUpperCase().startsWith('J'))) {
        if (!value) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_hesj_03' })));
        }
      }
      const hxqsrq = form?.getFieldValue('hxqsrq');
      const hxjzrq = form?.getFieldValue('hxjzrq');
      if (hxqsrq && hxjzrq) {
        if (new Date(hxqsrq.format('YYYY-MM-DD')).getTime() > new Date(hxjzrq.format('YYYY-MM-DD')).getTime()) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_hesj_02' })));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  validatorYhxtzHxqsrq: (form: any)=> {
    const jljgszch = form?.getFieldValue('jljgszch');
    const validator = async (_rule: any, value: any) => {
      if (jljgszch && (jljgszch.toUpperCase().startsWith('E') || jljgszch.toUpperCase().startsWith('H') || jljgszch.toUpperCase().startsWith('T') || jljgszch.toUpperCase().startsWith('J'))) {
        if (!value) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_hesj_01' })));
        }
      }
      const hxqsrq = form?.getFieldValue('hxqsrq');
      const hxjzrq = form?.getFieldValue('hxjzrq');
      if (hxqsrq && hxjzrq) {
        if (new Date(hxqsrq.format('YYYY-MM-DD')).getTime() > new Date(hxjzrq.format('YYYY-MM-DD')).getTime()) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_hesj_02' })));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  validatorYhxtzHxjzrq: (form: any)=> {
    const jljgszch = form?.getFieldValue('jljgszch');
    const validator = async (_rule: any, value: any) => {
      if (jljgszch && (jljgszch.toUpperCase().startsWith('E') || jljgszch.toUpperCase().startsWith('H') || jljgszch.toUpperCase().startsWith('T') || jljgszch.toUpperCase().startsWith('J'))) {
        if (!value) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_hesj_03' })));
        }
      }
      const hxqsrq = form?.getFieldValue('hxqsrq');
      const hxjzrq = form?.getFieldValue('hxjzrq');
      if (hxqsrq && hxjzrq) {
        if (new Date(hxqsrq.format('YYYY-MM-DD')).getTime() > new Date(hxjzrq.format('YYYY-MM-DD')).getTime()) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_hesj_02' })));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  validatorYhxtzBgdh: (form: any) => {
    const dlckhwzmhm = form?.getFieldValue('dlckhwzmhm');
    const validator =  (_rule: any, value: any) => {
      if (value && dlckhwzmhm) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_bgdanddlzm_01' })));
      }
      if (value.trim() === '' && dlckhwzmhm.trim() === '') {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_bgdanddlzm_02' })));
      }
      if (value && value.length != 21) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_bgd21_01' })));
      }
      return Promise.resolve();
    };
    return { validator };
  },
  validatorYhxtzDlzm: (form: any) => {
    const ckbgdh = form?.getFieldValue('ckbgdh');
    const validator =  (_rule: any, value: any) => {
      if (value && ckbgdh) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_bgdanddlzm_01' })));
      }
      if (value?.trim() === ''  && ckbgdh?.trim() === '' ) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_bgdanddlzm_02' })));
      }
      return Promise.resolve();
    };
    return { validator };
  },
  validatorYhxtzmyxse: (form: any)=> {
    const jckbzDm = form?.getFieldValue('jckbzDm');
    const validator = async (_rule: any, value: any) => {
      if (jckbzDm==='E') {
        if (!value || value ===0) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_myxse_01' })));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  validatorYhxtzrmbxse: (form: any)=> {
    const jckbzDm = form?.getFieldValue('jckbzDm');
    const validator = async (_rule: any, value: any) => {
      if (jckbzDm==='E') {
        if (!value || value ===0) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_rmbxse_02' })));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  validatorYhxtzmydaj: (form: any)=> {
    const jckbzDm = form?.getFieldValue('jckbzDm');
    const validator = async (_rule: any, value: any) => {
      if (jckbzDm==='I') {
        if (!value || value ===0) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_myda_01' })));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  validatorYhxtzrmbdaj: (form: any)=> {
    const jckbzDm = form?.getFieldValue('jckbzDm');
    const validator = async (_rule: any, value: any) => {
      if (jckbzDm==='I') {
        if (!value || value ===0) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_rmbda_01' })));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
}
// 表单事件：OnChange
Func.eventOnChange = {
  checkMdthxJljgszch: (param: any) => {
    const { event, myItems, setMyItems, form} = param;
    // 表单id、录入值
    const inputValue = event.target.value;
    const lableSpan1: any = document.querySelector("#mxcj_mdthx_form .dditem_label_hxqsrq span");
    const lableSpan2: any = document.querySelector("#mxcj_mdthx_form .dditem_label_hxjzrq span");
    if (inputValue) {
      form.setFieldsValue({
        jljgszch: inputValue.toUpperCase(),
      });
      if (inputValue.toUpperCase().startsWith('E') || inputValue.toUpperCase().startsWith('H') || inputValue.toUpperCase().startsWith('T') || inputValue.toUpperCase().startsWith('J')) {
        lableSpan1.classList.add('required');
        lableSpan2.classList.add('required');
        myItems[7].disabled = false; // 日期禁用
        myItems[8].disabled = false; // 日期禁用
      } else {
        lableSpan1.classList.remove('required');
        lableSpan2.classList.remove('required');
        myItems[7].disabled = false; // 日期禁用
        myItems[8].disabled = false; // 日期禁用
        if(inputValue.toUpperCase().startsWith('C')) {
          myItems[7].disabled = true; // 日期禁用
          myItems[8].disabled = true; // 日期禁用
          form.setFieldsValue({
            hxqsrq: '',
            hxjzrq: ''
          });
        }
      }
    } else {
      lableSpan1.classList.remove('required');
      lableSpan2.classList.remove('required');
      myItems[7].disabled = false;
      myItems[8].disabled = false;
    }
    setMyItems([...myItems]);
  },
  checkYhxtzJljgszch: (param: any) => {
    const { event, form} = param;
    // 表单id、录入值
    const inputValue = event.target.value;
    const lableSpan1: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_hxqsrq span");
    const lableSpan2: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_hxjzrq span");
    if (inputValue) {
      form.setFieldsValue({
        jljgszch: inputValue.toUpperCase(),
      });
      if (inputValue.toUpperCase().startsWith('E') || inputValue.toUpperCase().startsWith('H') || inputValue.toUpperCase().startsWith('T') || inputValue.toUpperCase().startsWith('J')) {
        lableSpan1.classList.add('required');
        lableSpan2.classList.add('required');
      } else {
        lableSpan1.classList.remove('required');
        lableSpan2.classList.remove('required');
      }
    } else {
      lableSpan1.classList.remove('required');
      lableSpan2.classList.remove('required');
    }
  },
  mdthxChangeHxjzrq: (param: any) => {
    const {form, dateString} = param;
    const inputValue = form.getFieldValue('hxjzrq');
    if (dateString) {
      form.setFieldsValue({nd: inputValue.format('YYYY')});
      const formVal = form.getFieldsValue();
      if (undefined != typeof formVal.jljgszch && formVal.jljgszch &&
        undefined != typeof formVal.ssq && formVal.ssq && undefined != typeof formVal.sbpc && formVal.sbpc) {
        let flag = false;
        if (formVal.jljgszch && (formVal.jljgszch.toUpperCase().startsWith("E") ||
          formVal.jljgszch.toUpperCase().startsWith("T") ||
          formVal.jljgszch.toUpperCase().startsWith("H") ||
          formVal.jljgszch.toUpperCase().startsWith("J"))) {
          if (undefined != typeof formVal.hxqsrq && formVal.hxqsrq &&
            undefined != typeof formVal.hxjzrq && formVal.hxjzrq) {
              flag = true;
          }
        }
        if (flag) {
          const data: any = {
            ssq: formVal.ssq,
            sbpc: formVal.sbpc,
            jljgszch: formVal.jljgszch,
            type: '1',
            hxqsrq : moment(formVal.hxqsrq.valueOf()).format('YYYY-MM-DD'),
            hxjzrq : moment(formVal.hxjzrq.valueOf()).format('YYYY-MM-DD')
          }

          Func.setReadOnly(true, param);
          queryYwsjBySzc(data).then((response) => {
            Func.setReadOnly(false, param);
            if (response.code === '200') {
              form.setFieldsValue(response.body);
            }
          });
        }
      }
    } else {
      form.setFieldsValue({nd:''});
    }
  },
  mdthxChangeHxqsrq: (param: any) => {
    const { form,dateString } = param;
    if (dateString) {
      const formVal = form.getFieldsValue();
      if (undefined != typeof formVal.jljgszch && formVal.jljgszch &&
        undefined != typeof formVal.ssq && formVal.ssq && undefined != typeof formVal.sbpc && formVal.sbpc) {
        let flag = false;
        if (formVal.jljgszch && (formVal.jljgszch.toUpperCase().startsWith("E") ||
          formVal.jljgszch.toUpperCase().startsWith("T") ||
          formVal.jljgszch.toUpperCase().startsWith("H") ||
          formVal.jljgszch.toUpperCase().startsWith("J"))) {
          if (undefined != typeof formVal.hxqsrq && formVal.hxqsrq &&
            undefined != typeof formVal.hxjzrq && formVal.hxjzrq) {
              flag = true;
          }
        }
        if (flag) {
          const data: any = {
            ssq: formVal.ssq,
            sbpc: formVal.sbpc,
            jljgszch: formVal.jljgszch,
            type: '1',
            hxqsrq : formVal.hxqsrq.valueOf(),
            hxjzrq : formVal.hxjzrq.valueOf(),
            tableKey : form?.otherParam?.unit_key
          }
          Func.setReadOnly(true, param);
          checkSsqPcYsb(data).then((response) => {
            Func.setReadOnly(false, param);
            if (response.code === '200') {
              form.setFieldsValue(response.body);
            }
          });
        }
      }
     // Func.tsxx(param);
    }
  },
  checkYhxtzJckbz: (param: any) => {
    const {form} = param;
    // 表单id、录入值
    // const inputValue = event.target.value;
    const inputValue = form.getFieldValue('jckbzDm');
    const lableSpan1: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_sbckxsemy span");
    const lableSpan2: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_ckxse span");
    const lableSpan3: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_jljgmsjkljzcjsjgmy span");
    const lableSpan4: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_jljgmsjkljzcjsjgrmb span");
    const inputEle1: any = document.querySelector("#mxcj_hgsjtz_form_sbckxsemy");
    const inputEle2: any = document.querySelector("#mxcj_hgsjtz_form_ckxse");
    const inputEle3: any = document.querySelector("#mxcj_hgsjtz_form_jljgmsjkljzcjsjgmy");
    const inputEle4: any = document.querySelector("#mxcj_hgsjtz_form_jljgmsjkljzcjsjgrmb");
    if (inputValue) {
      if (inputValue === 'I') {
        form.setFieldsValue({sbckxsemy:0,ckxse:0});
        lableSpan1.classList.remove('required');
        inputEle1.setAttribute('readonly', true);
        lableSpan2.classList.remove('required');
        inputEle2.setAttribute('readonly', true);
        lableSpan3.classList.add('required');
        inputEle3.removeAttribute('readonly');
        lableSpan4.classList.add('required');
        inputEle4.removeAttribute('readonly');
      } else {
        form.setFieldsValue({jljgmsjkljzcjsjgmy:0,jljgmsjkljzcjsjgrmb:0});
        lableSpan1.classList.add('required');
        inputEle1.removeAttribute('readonly');
        lableSpan2.classList.add('required');
        inputEle2.removeAttribute('readonly');
        form.setFieldsValue({sbckxsemy:0,ckxse:0});
        lableSpan3.classList.remove('required');
        inputEle3.setAttribute('readonly', true);
        lableSpan4.classList.remove('required');
        inputEle4.setAttribute('readonly', true);

      }
    }
  },
  checkYhxtzJgfs: (param: any) => {
    const {form} = param;
    const inputValue = form.getFieldValue('jgfsDm');
    if (inputValue) {
      form.setFieldsValue({jgfsmc: myUtil.code.getCodeValByKey(inputValue, 'CODE_DM_CKTS_HGJGFS', '01')});
    }
  },
  yhxtzChangeHxjzrq: (param: any) => {
    const {form, dateString} = param;
    const inputValue = form.getFieldValue('hxjzrq');
    if (dateString) {
      form.setFieldsValue({nd: inputValue.format('YYYY')});
    } else {
      form.setFieldsValue({nd: ''});
    }
  },
  yhxtzBgdZmToUpper: (param: any) => {
    const { event, form} = param;
    const inputValue = event.target.value;
    if (inputValue) {
      form.setFieldsValue({
        ckbgdh: inputValue.toUpperCase(),
      });
    }
  },
  yhxtzDlzmZmToUpper: (param: any) => {
    const { event, form} = param;
    const inputValue = event.target.value;
    if (inputValue) {
      form.setFieldsValue({
        dlckhwzmhm: inputValue.toUpperCase(),
      });
    }
  }
}

Func.eventOnBlur = {
  mdthxBlurJljgszch: (param: any) => {
    const { form } = param;
		// 所属期
		const ssq = form.getFieldValue('ssq');
    const sbpc = form.getFieldValue('sbpc');
    // 手账册号
		const jljgszch = form.getFieldValue('jljgszch');
		// 手（账）册标识
		const szcbz = jljgszch?.substring(0, 1).toUpperCase();
		let hxqsrq;
		let hxjzrq;
		// 账册标志为：H,E,T
		if (szcbz == 'H' || szcbz == 'E' || szcbz == 'T' || szcbz == 'J') {
			hxqsrq = form.getFieldValue('hxqsrq') ? moment(form.getFieldValue('hxqsrq')).format('YYYY-MM-DD') : '';
			hxjzrq = form.getFieldValue('hxjzrq') ? moment(form.getFieldValue('hxjzrq')).format('YYYY-MM-DD') : '';
			// 手册标志为：C
		} else {
			hxqsrq = '';
			hxjzrq = '';
		}

    if((hxqsrq && hxjzrq) ||  szcbz === 'C') {
      const data = {
        ssq: ssq,
        sbpc:sbpc,
        jljgszch: jljgszch,
        hxqsrq: hxqsrq,
        hxjzrq: hxjzrq
      }
      queryYwsjBySzc(data).then((res) => {
        const { code, msg, desc, body } = res;
        if (code != '200' && desc.trim() != '') {
          message.info(msg);
          return;
        }
        if (body) {
          form.setFieldsValue({
            jljgsjfpl: body.jljgsjfpl ? myUtil.text.getNumVal(myUtil.text.formatNum(body.jljgsjfpl, '0,0.00000')) : myUtil.text.getNumVal(myUtil.text.formatNum(0, '0,0.00000')),
            ytzmdtse: body.ytzmdtse ? myUtil.text.getNumVal(myUtil.text.formatNum(body.ytzmdtse, '0,0.00')) : myUtil.text.getNumVal(myUtil.text.formatNum(0, '0,0.00')),
            mdtsbdmzhdkse: body.mdtsbdmzhdkse ? myUtil.text.getNumVal(myUtil.text.formatNum(body.mdtsbdmzhdkse, '0,0.00')) : myUtil.text.getNumVal(myUtil.text.formatNum(0, '0,0.00')),
            rmblaj: body.rmblaj ? myUtil.text.getNumVal(myUtil.text.formatNum(body.rmblaj, '0,0.00')) : myUtil.text.getNumVal(myUtil.text.formatNum(0, '0,0.00')),
            // 隐藏变量赋值
            jsjkzz: body.jsjkzz,
            jsckzz: body.jsckzz,
          });
        }
      })
    }
  },
  queryMdthxJe: (param: any) => {
    const { form,event } = param;
    // 表单id、录入值
    if (event.target.value) {
      const formVal = form.getFieldsValue();
      if (undefined != typeof formVal.jljgszch && formVal.jljgszch &&
        undefined != typeof formVal.ssq && formVal.ssq && undefined != typeof formVal.sbpc && formVal.sbpc) {
        let flag = false;
        if (formVal.jljgszch && formVal.jljgszch.toUpperCase().startsWith("C")) {
          flag = true;
        }
        if (formVal.jljgszch && (formVal.jljgszch.toUpperCase().startsWith("E") ||
          formVal.jljgszch.toUpperCase().startsWith("T") ||
          formVal.jljgszch.toUpperCase().startsWith("H") ||
          formVal.jljgszch.toUpperCase().startsWith("J"))) {
          if (undefined != typeof formVal.hxqsrq && formVal.hxqsrq &&
            undefined != typeof formVal.hxjzrq && formVal.hxjzrq) {
              flag = true;
          }
        }
        if (flag) {
          const data: any = {
            ssq: formVal.ssq,
            sbpc: formVal.sbpc,
            jljgszch: formVal.jljgszch,
            type: '0',
            jljgsjfpl:formVal.jljgsjfpl
          }
          if (!formVal.jljgszch.startsWith("C")) {
            const hxqsrq = moment(form.getFieldValue('hxqsrq')).format('YYYY-MM-DD');
            const hxjzrq = moment(form.getFieldValue('hxjzrq')).format('YYYY-MM-DD');
            data.hxqsrq = hxqsrq;
            data.hxjzrq = hxjzrq;
          }
          //Func.setReadOnly(true);
          // queryYwsjBySzc(data).then((response) => {
          //   Func.setReadOnly(false);
          //   if (response.code === '200') {
          //     form.setFieldsValue(response.body);
          //   }
          // });
        }
      }
    }
  },
  mdthxBlurMdthxSsq: (param: any) => {
    const { form,event } = param;
    const formVal = form.getFieldsValue();
    const sbpc = formVal.sbpc;
    if (event.target.value && sbpc) {
      if (undefined != typeof formVal.jljgszch && formVal.jljgszch) {
        let flag = false;
        if (formVal.jljgszch && formVal.jljgszch.toUpperCase().startsWith("C")) {
          flag = true;
        }
        if (formVal.jljgszch && (formVal.jljgszch.toUpperCase().startsWith("E") ||
          formVal.jljgszch.toUpperCase().startsWith("T") ||
          formVal.jljgszch.toUpperCase().startsWith("H") ||
          formVal.jljgszch.toUpperCase().startsWith("J"))) {
          if (undefined != typeof formVal.hxqsrq && formVal.hxqsrq &&
            undefined != typeof formVal.hxjzrq && formVal.hxjzrq) {
              flag = true;
          }
        }
        if (flag) {
          const data: any = {
            ssq: event.target.value,
            sbpc: sbpc,
            jljgszch: formVal.jljgszch,
            type: '1',
            tableKey: form?.otherParam?.unit_key
          }
          if (!formVal.jljgszch.startsWith("C")) {
            data.hxqsrq = formVal.hxqsrq.valueOf();
            data.hxjzrq = formVal.hxjzrq.valueOf();
          }
          Func.setReadOnly(true, param);
          checkSsqPcYsb(data).then((response) => {
            Func.setReadOnly(false, param);
            if (response.code === '200') {
              form.setFieldsValue(response.body);
            }
          });
        }
      }
    }
  },
  mxcjBlursbxh: (param: any) => {
    const { form,event } = param;
    if (event.target.value) {
      if (event.target.value.length < 8) {
        const val = myUtil.text.leadingZeroize(event.target.value, 8);
        form.setFieldsValue({sbxh: val});
      }
    }
  },
  jsYhxtzJlzcjsjghj: (param: any) => {
    const { form,event } = param;
    const jckbzDm = form.getFieldValue('jckbzDm');
    if (event.target.value && jckbzDm === 'I') {
      const jljgmsjkljzcjsjgrmb = form.getFieldValue('jljgmsjkljzcjsjgrmb');
      const msjkljhgszgshxfs = form.getFieldValue('msjkljhgszgshxfs');
      const tmp = jljgmsjkljzcjsjgrmb + msjkljhgszgshxfs;
      form.setFieldsValue({jljgmsjkljzcjsjg: tmp});
    }
  }
}

Func.initAddForm = (param: any) => {
  const {form, unit_key, handleModalVisible, page_id, myFormItems, setMyFormItems} = param;
  const vParam = {tableKey: unit_key, lcswsxDm: ''}
  if (page_id === 'mxcj_mdthx') {
    const initValue: any = {
      jljgsjfpl : 0,
      ytzmdtse : 0,
      mdtsbdmzhdkse : 0,
      rmblaj : 0,
    };
    myFormItems[6].disabled = false;
    myFormItems[7].disabled = false;
    commonInitJbxx(vParam).then((response) => {
      const {code, body} = response;
      body.jljgsjfpl = 0;
      body.ytzmdtse = 0;
      body.mdtsbdmzhdkse = 0;
      body.rmblaj = 0;
      if (code === '200') {
        initValue.ssq = body.ssq;
        initValue.sbpc = body.sbpc;
        initValue.sbxh = body.sbxh;
      }
      form.setFieldsValue(initValue);
      handleModalVisible(true);
      const lableSpan1: any = document.querySelector("#mxcj_mdthx_form .dditem_label_hxqsrq span");
      lableSpan1.classList.remove('required');
      const lableSpan2: any = document.querySelector("#mxcj_mdthx_form .dditem_label_hxjzrq span");
      lableSpan2.classList.remove('required');
    })
  } else {
    const initValue: any = {
      ckbgdh: '',
      dlckhwzmhm: '',
      sbckxsemy: 0,
      ckxse: 0,
      jljgmsjkljzcjsjgmy: 0,
      jljgmsjkljzcjsjgrmb: 0,
      msjkljhgszgshxfs:0,
      jljgmsjkljzcjsjg:0
    }
    form.setFieldsValue({ckbgdh:'', dlckhwzmhm: ''});
    commonInitJbxx(vParam).then((response) => {
      const {code, body} = response;
      if (code === '200') {
        initValue.ssq = body.ssq;
        initValue.sbxh = body.sbxh;
      }
      form.setFieldsValue(initValue);
      handleModalVisible(true);
      const lableSpanhxqsrq: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_hxqsrq span");
      lableSpanhxqsrq.classList.remove('required');
      const lableSpanhxjzrq: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_hxjzrq span");
      lableSpanhxjzrq.classList.remove('required');
      const lableSpan1: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_sbckxsemy span");
      lableSpan1.classList.remove('required');
      const lableSpan2: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_ckxse span");
      lableSpan2.classList.remove('required');
      const lableSpan3: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_jljgmsjkljzcjsjgmy span");
      lableSpan3.classList.remove('required');
      const lableSpan4: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_jljgmsjkljzcjsjgrmb span");
      lableSpan4.classList.remove('required');
      const inputEle1: any = document.querySelector("#mxcj_hgsjtz_form_sbckxsemy");
      inputEle1.removeAttribute('readonly');
      const inputEle2: any = document.querySelector("#mxcj_hgsjtz_form_ckxse");
      inputEle2.removeAttribute('readonly');
      const inputEle3: any = document.querySelector("#mxcj_hgsjtz_form_jljgmsjkljzcjsjgmy");
      inputEle3.removeAttribute('readonly');
      const inputEle4: any = document.querySelector("#mxcj_hgsjtz_form_jljgmsjkljzcjsjgrmb");
      inputEle4.removeAttribute('readonly');
    })
  }
  setMyFormItems([...myFormItems]);
}

Func.initEditForm= (param: any) => {
  const {formValue, handleModalVisible, page_id, myFormItems, setMyFormItems} = param;
  if (page_id === 'mxcj_mdthx') {
    handleModalVisible(true);
    const jljgszch = formValue.jljgszch;
    const lableSpan1: any = document.querySelector("#mxcj_mdthx_form .dditem_label_hxqsrq span");
    const lableSpan2: any = document.querySelector("#mxcj_mdthx_form .dditem_label_hxjzrq span");
    if (jljgszch.startsWith('C')) {
      lableSpan1.classList.remove('required');
      lableSpan2.classList.remove('required');
      myFormItems[7].disabled = true;
      myFormItems[8].disabled = true;
    } else {
      lableSpan1.classList.add('required');
      lableSpan2.classList.add('required');
      myFormItems[7].disabled = false;
      myFormItems[8].disabled = false;
    }
  } else {
    handleModalVisible(true);
    const lableSpanhxqsrq: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_hxqsrq span");
    const lableSpanhxjzrq: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_hxjzrq span");
    const jljgszch = formValue.jljgszch;
    if (jljgszch.startsWith('C')) {
      lableSpanhxqsrq.classList.remove('required');
      lableSpanhxjzrq.classList.remove('required');
    } else {
      lableSpanhxqsrq.classList.add('required');
      lableSpanhxjzrq.classList.add('required');
    }
    const lableSpan1: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_sbckxsemy span");
    const lableSpan2: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_ckxse span");
    const lableSpan3: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_jljgmsjkljzcjsjgmy span");
    const lableSpan4: any = document.querySelector("#mxcj_hgsjtz_form .dditem_label_jljgmsjkljzcjsjgrmb span");
    const inputEle1: any = document.querySelector("#mxcj_hgsjtz_form_sbckxsemy");
    const inputEle2: any = document.querySelector("#mxcj_hgsjtz_form_ckxse");
    const inputEle3: any = document.querySelector("#mxcj_hgsjtz_form_jljgmsjkljzcjsjgmy");
    const inputEle4: any = document.querySelector("#mxcj_hgsjtz_form_jljgmsjkljzcjsjgrmb");
    const jckbzDm = formValue.jckbzDm;
    if (jckbzDm === 'I') {
      lableSpan1.classList.remove('required');
      inputEle1.setAttribute('readonly', true);
      lableSpan2.classList.remove('required');
      inputEle2.setAttribute('readonly', true);
      lableSpan3.classList.add('required');
      inputEle3.removeAttribute('readonly');
      lableSpan4.classList.add('required');
      inputEle4.removeAttribute('readonly');
    } else {
      lableSpan1.classList.add('required');
      inputEle1.removeAttribute('readonly');
      lableSpan2.classList.add('required');
      inputEle2.removeAttribute('readonly');
      lableSpan3.classList.remove('required');
      inputEle3.setAttribute('readonly', true);
      lableSpan4.classList.remove('required');
      inputEle4.setAttribute('readonly', true);
    }
  }
  setMyFormItems([...myFormItems]);
}

Func.setReadOnly = (bz: any, param: any) => {
  const {myItems, setMyItems} = param;
  const inputEle1: any = document.querySelector("#mxcj_mdthx_form_ssq");
  const inputEle2: any = document.querySelector("#mxcj_mdthx_form_sbxh");
  const inputEle3: any = document.querySelector("#mxcj_mdthx_form_jljgszch");
  // const inputEle4: any = document.querySelector("#mxcj_mdthx_form_hxqsrq");
  // const inputEle5: any = document.querySelector("#mxcj_mdthx_form_hxjzrq");
  const inputEle6: any = document.querySelector("#mxcj_mdthx_form_jljgsjfpl");
  if (bz) {
    inputEle1.setAttribute('readonly', true);
    inputEle2.setAttribute('readonly', true);
    inputEle3.setAttribute('readonly', true);
    // inputEle4.setAttribute('disabled', true);
    // inputEle5.setAttribute('disabled', true);
    inputEle6.setAttribute('readonly', true);
    myItems[7].disabled = true;
    myItems[8].disabled = true;
  } else {
    inputEle1.removeAttribute('readonly');
    inputEle2.removeAttribute('readonly');
    inputEle3.removeAttribute('readonly');
    // inputEle4.removeAttribute('disabled');
    // inputEle5.removeAttribute('disabled');
    inputEle6.removeAttribute('readonly');
    myItems[7].disabled = false;
    myItems[8].disabled = false;
  }
  setMyItems([...myItems]);
}





Func.tsxx = (param: any) => {
  let jljgszch = param?.form.getFieldsValue().jljgszch;
  let hxjzrq = moment(param?.form.getFieldsValue().hxjzrq.valueOf()).format('YYYY-MM');
  let hxqsrq = moment(param?.form.getFieldsValue().hxqsrq.valueOf()).format('YYYY-MM');
  const timeDiff = moment(hxjzrq).diff(hxqsrq, 'month');  // 两个月份差值
  let t = jljgszch.substr(0,1);
  if(('H'==t || 'E'==t || 'T'==t) && timeDiff<=3){
    DDAlert.open({
      title: '系统提示',
      info: '手账册号为H、E、T开头时，报核开始日期和报核截至日期间隔至少三个月，请注意！',
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: false,
      okCallbackFn: function (thisObj: any) {
        DDAlert.close();
        return true;
      },
      cancelCallbackFn: function (thisObj: any) {
        return false;
      }
    });
  }else{
    return true;
  }
  return false;
}




export default Func;
