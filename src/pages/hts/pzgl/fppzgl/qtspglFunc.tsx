import { message } from 'antd';
import React from 'react';
import { qtspsc, qtspwhcheck } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import 'moment/locale/zh-cn';
import { intl as intl2 } from '@/components/DDAssist/util';

const Func: any = {
  unitRef: React.createRef(),
};

const sl1vListF = [
  { value: "1", name: '免税' },
  { value: "2", name: '不征税' },
];
const sl1vList = [
  { value: 0, name: '0%' },
  { value: 0.03, name: '3%' },
  { value: 0.06, name: '6%' },
  { value: 0.09, name: '9%' },
  { value: 0.13, name: '13%' },
];

Func.initEditForm = (param: any) => {
  const { handleModalVisible, page_id, form, formValue, formItems, setFormItems } = param;
  if (page_id === 'qtspgl') {
    handleModalVisible(true);
    // const inputEle1: any = document.querySelector("#qtspgl_form_ggxh");
    // inputEle1.setAttribute('disabled', true);
    // const inputEle2: any = document.querySelector("#qtspgl_form_hwhyslwmc");
    // inputEle2.setAttribute('disabled', true);
    const lableSpan: any = document.querySelector("#qtspgl_form .dditem_label_fpssyhlxDm span");
    if (formValue?.syyhzcbz === '1') {
      formItems[5].disabled = false;
      formItems[4].enterFocus = true;
      formItems[6].disabled = true;
      formItems[6].list = sl1vListF;
      // 按需必填字段
      lableSpan.classList.add('required');
      // 税率
      if(formValue?.fpssyhlxDm === '1') {
        form.setFieldsValue({ sl1: '1' });
      } else {
        form.setFieldsValue({ sl1: '2' });
      }
    } else if (formValue?.syyhzcbz === '0') {
      formItems[4].enterFocus = false;
      formItems[5].disabled = true;
      formItems[5].value = '';
      formItems[6].disabled = false;
      formItems[6].list = sl1vList;
      lableSpan.classList.remove('required');
      form.setFieldsValue({ fpssyhlxDm: '' });
      // form.resetFields(['fpssyhlxDm']);
    }

    setFormItems([...formItems]);

    // form.setFieldsValue({ uuid: 'edit' });
  } else {
    handleModalVisible(true);
  }
}

// 外销商品管理 表单页面onChange事件
Func.eventOnChange = {
  // 享受优惠政策
  syyhzcbzOnChange: (param: any) => {
    const { value, myItems, setMyItems, form } = param;
    const lableSpan: any = document.querySelector("#qtspgl_form .dditem_label_fpssyhlxDm span");
    const sl1vListF = [
      { value: "1", name: '免税' },
      { value: "2", name: '不征税' },
    ];
    const sl1vList = [
      { value: 0, name: '0%' },
      { value: 0.03, name: '3%' },
      { value: 0.06, name: '6%' },
      { value: 0.09, name: '9%' },
      { value: 0.13, name: '13%' },
    ];
    if (value === '1') {
      myItems[5].disabled = false;
      myItems[4].enterFocus = true;
      myItems[6].disabled = true;
      myItems[6].list = sl1vListF;
      // 按需必填字段
      lableSpan.classList.add('required');
    } else if (value === '0') {
      myItems[4].enterFocus = false;
      myItems[5].disabled = true;
      myItems[5].value = '';
      myItems[6].disabled = false;
      myItems[6].list = sl1vList;
      lableSpan.classList.remove('required');
      form.setFieldsValue({ fpssyhlxDm: '' });
      // form.resetFields(['fpssyhlxDm']);
    }
    form.setFieldsValue({ sl1:  ''});
    setMyItems([...myItems]);
  },
  // 优惠政策类型
  fpssyhlxDmOnChange: (param: any) => {
    const { value, form } = param;
    // 优惠政策类型选择免税、不征税时税率不可编辑
    if(value === "1") {
      form.setFieldsValue({ sl1:  '1'});
    } else{
      form.setFieldsValue({ sl1:  '2'});
    }
  },
}

Func.eventOnFocus = {
  // 外销商品管理 税收分类编码选择
  qtspHbbmFocus: (param: any) => {
    const { form, otherParam } = param;
    if (otherParam.otherRef) {
      otherParam.otherRef[0].current!.showModal({ zslx: 'qtspForm', form: form });
    }
  },
}

// 税收分类编码选中回显到表单
Func.setFormValues = (param: any) => {
  const { form, record, fmMainRef } = param;
  message.success(intl2.formatMessage({ id: 'message_ckfp_fppz_fm_success' }));
  fmMainRef.current.closeModal();
  form.setFieldsValue({
    sphfwssflhbbm: record.sphfwssflhbbm,
    hwhlwmc: record.hwhlwmc,
  });
}

// 表单校验
Func.validator = {
  //自定义校验：新增其他商品信息，校验商品信息是否已存在。
  qtspwhcheck: (form: any) => {
    // 新增其他商品信息，校验商品信息是否已存在。
    const qyspbm = form?.getFieldValue('qyspbm');
    const ggxh = form?.getFieldValue('ggxh');
    const uuid = form?.getFieldValue("uuid");
    const validator = async (_rule: any, value: any) => {
      if (uuid != 'edit' && qyspbm && ggxh) {
        await qtspwhcheck({ ggxh, qyspbm, uuid }).then((response) => {
          if (response.code === '300') {
            return Promise.reject(new Error(response.desc));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
      } else {
        return Promise.resolve();
      }
    };
    return { validator };
  },

  //自定义校验：是否享受优惠政策判断优惠政策类型是否必填
  fpssyhlxDmCheck: (form: any) => {
    const syyhzcbz = form?.getFieldValue('syyhzcbz');    // 是否享受优惠政策
    const validator = async (_rule: any, value: any) => {
      if (syyhzcbz === '1') {
        if (!value) {
          return Promise.reject(new Error('该项内容为必填项不能为空！'));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
}

// 其他商品管理页面:删除
Func.deleteQtspgl = (param: any) => {
  const { selectionRows, unitRef, selectionRowKeys } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    DDAlert.open({
      title: '系统提示',
      info: '确定要删除选择的数据吗？',
      infoType: 'question',
      modalType: 'confirm',
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        qtspsc({ uuids: selectionRowKeys }).then((response) => {
          DDAlert.close();
          const { code, desc } = response;
          if (code === '200') {
            message.success(intl2.formatMessage({ id: 'message_delete_success' }));
            unitRef.current!.reload2();
          } else {
            message.error(desc);
          }
        })
      },
    });
  }
}

export default Func;