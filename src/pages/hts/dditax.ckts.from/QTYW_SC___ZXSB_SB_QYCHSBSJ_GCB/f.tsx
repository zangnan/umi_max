/**
 * title: 企业撤回退（免）税申报申请表
 * author: wx
 */
import cktsUtil from '@/pages/hts/cktsUtil';
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';

const Func: any = {
  unitRef: React.createRef(),
};

// 编辑表单初始化
Func.initEditForm = (param: any) => {
  const { form, formItems, setFormItems, handleModalVisible } = param;
  const params: any = {
    form: form,
    myItems: formItems,
    setMyItems: setFormItems,
  }
  handleModalVisible(true);
  Func.eventOnChange.chyyDm(params);
};

Func.initAddForm = (param: any) => {
  param.doSuccess = async () => {
    await param.handleModalVisible(true);
    const inputEle1: any = document.querySelector("#qtyw_sc_zxsb_sb_qychsbsj_gcb_form_sbchysbpc");
    inputEle1.setAttribute('disabled', true);
    const inputEle2: any = document.querySelector("#qtyw_sc_zxsb_sb_qychsbsj_gcb_form_yglh");
    inputEle2.setAttribute('disabled', true);
  };
  DditCktsFormCommonFunc.initAddForm(param);
};

// 表单校验
Func.validator = {
  // 所属期
  ssq01: (form: any) => {
    return DditCktsFormCommonFunc.validator.ssq01(form);
  },
  // 申报批次
  sbpc02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbpc02(form);
  },
  // 申报序号
  sbxh02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbxh02(form);
  },
  // 申请撤回的原申报批次
  sbchysbpc01: (form: any) => {
    const chywlxDm = form?.getFieldValue('chywlxDm');
    const sbchysbpc = form?.getFieldValue('sbchysbpc');
    // 根据撤回业务类型判断，免退税、代办退税等有批次的业务，该项必录
    const validator =  (_rule: any, value: any) => {
      // let qylx = layui.myUtil.enterpriseType(); // 企业类型
      // qylx === 'SC'不校验

    //  if (chywlxDm == '102' || chywlxDm == '103' || chywlxDm == '105' || chywlxDm == '204' || chywlxDm == '205' || chywlxDm == '206' || chywlxDm == '208') {
    //    if (!sbchysbpc) {
    //      return Promise.reject(new Error('该项内容为必填项不能为空！'));
    //    }
    //  } else if (chywlxDm != '102' && chywlxDm != '103' && chywlxDm != '105' && chywlxDm != '204' && chywlxDm != '205' && chywlxDm != '206' && chywlxDm != '208') {
    //    if (sbchysbpc) {
    //      return Promise.reject(new Error('当撤回业务类型为“免退税申报”，“免退税货物劳务申报”，“免退税跨境应税行为申报”和“外贸综合服务企业代办退税”时，该项应为空！'));
    //    }
    //  }
      return Promise.resolve();
    };
    return { validator };
  },
  // 原申报关联号
  yglh02: (form: any) => {
    const chyyDm = form?.getFieldValue('chyyDm');
    const chywlxDm = form?.getFieldValue('chywlxDm');
    const yglh = form?.getFieldValue('yglh');
    // 根据撤回业务类型判断，免退税、代办退税等有批次的业务，该项必录
    const validator =  (_rule: any, value: any) => {
      // 外贸系统，撤回原因为2时，撤回业务类型为“免退税申报”、“横琴、平潭业务（货物）申报”时，必录，否则应为空
      // let qylx = layui.myUtil.enterpriseType(); // 企业类型
      // qylx === 'SC'不校验

    //  if (chyyDm == '200' && (chywlxDm == '204' || chywlxDm == '205' || chywlxDm == '208')) {
    //    if (!yglh) {
    //      return Promise.reject(new Error('该项内容为必填项不能为空！'));
    //    }
    //  } else if (chyyDm == '100' || (chyyDm == '200' && (chywlxDm != '204' && chywlxDm != '205' && chywlxDm != '208'))) {
    //    if (yglh) {
    //      return Promise.reject(new Error('当撤回原因为“自愿放弃申请撤回”，并且撤回业务类型为“免退税货物劳务申报”和“免退税跨境应税行为申报”时，该项应为空！'));
    //    }
    //  }
      return Promise.resolve();
    };
    return { validator };
  },
  // 原申报序号
  ysbxh01: (form: any) => {
    const chyyDm = form?.getFieldValue('chyyDm');
    const ysbxh = form?.getFieldValue('ysbxh');
    // 撤回原因为2时,必录
    const validator =  (_rule: any, value: any) => {
      // 外贸系统，撤回原因为2时，撤回业务类型为“免退税申报”、“横琴、平潭业务（货物）申报”时，必录，否则应为空
      if (chyyDm == '200') {
        if (!ysbxh) {
          return Promise.reject(new Error('该项内容为必填项不能为空！'));
        }
      } else if (chyyDm == '100') {
        if (ysbxh) {
          return Promise.reject(new Error('当撤回原因为“申报错误申请撤回”时，该项应为空！'));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 凭证种类
  cktmspzlxDm01: (form: any) => {
    const chyyDm = form?.getFieldValue('chyyDm');
    const chywlxDm = form?.getFieldValue('chywlxDm');
    const cktmspzlxDm = form?.getFieldValue('cktmspzlxDm');
    // 根据撤回业务类型判断，免退税、代办退税等有批次的业务，该项必录
    const validator =  (_rule: any, value: any) => {
      // 撤回原因为2 不得为空
      if (chyyDm == '200') {
        // let qylx = layui.myUtil.enterpriseType(); // 企业类型
        if ('202' == chywlxDm || '203' == chywlxDm) {
          return Promise.resolve();
        }
        if (!cktmspzlxDm) {
          return Promise.reject(new Error('该项内容为必填项不能为空！'));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 凭证号码
  jhpzh03: (form: any) => {
    return DditCktsFormCommonFunc.validator.jhpzh03(form);
  },
  // 具体原因说明
  yysm01: (form: any) => {
    const chyyDm = form?.getFieldValue('chyyDm');
    const yysm = form?.getFieldValue('yysm');
    // 根据撤回业务类型判断，免退税、代办退税等有批次的业务，该项必录
    const validator =  (_rule: any, value: any) => {
      // 撤回原因为2 不得为空
      if (chyyDm == '2') {
        if (!yysm) {
          return Promise.reject(new Error('该项内容为必填项不能为空！'));
        }
        return Promise.resolve();
      }
      return Promise.resolve();
    };
    return { validator };
  },
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
  // 申请撤回的原申报批次
  sbchysbpc: (param: any) => {
    // 申报序号自动补零
    const { event, form } = param;
    const inputValue = event.target.value;
    if (inputValue) {
      form.setFieldsValue({
        sbchysbpc: myUtil.text.leadingZeroize(inputValue, 3),
      });
    }
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
  // 撤回原因
  chyyDm: async (param: any) => {
    // 根据撤回原因获取不同的业务类型
    const { form, myItems, setMyItems } = param;
    const chyyDm = form?.getFieldValue('chyyDm');
    const chywlxDm = form?.getFieldValue('chywlxDm');
    if (chywlxDm && (chywlxDm.length == 3 && chywlxDm.substring(0, 1) != chyyDm.substring(0, 1))) {
      form.setFieldsValue({ chywlxDm: '' });
    }
    const qylx = cktsUtil.sys.enterpriseType(); // 企业类型
    let viewKey = '01'
    if (chyyDm == '100') {
			viewKey = '03';
    } else if (chyyDm == '200') {
			viewKey = '05';
    }
    // 修改撤回原因重新获取码表
    const option = await myUtil.code.getCodeFromServerT1('code_dm_ckts_chywlx', viewKey);
    let list :any[] = [];
    if (option && option.length > 0) {
      option.forEach((item: any) => {
        list.push({
          value: item['code'],
          name: item['name'],
        });
      })
    }
    myItems[7].codeTable[1] = viewKey;
    myItems[7].list = list;
    const lableSpan1: any = document.querySelector("#qtyw_sc_zxsb_sb_qychsbsj_gcb_form .dditem_label_cktmspzlxDm span");
    const lableSpan2: any = document.querySelector("#qtyw_sc_zxsb_sb_qychsbsj_gcb_form .dditem_label_jhpzh span");
    const lableSpan3: any = document.querySelector("#qtyw_sc_zxsb_sb_qychsbsj_gcb_form .dditem_label_ysbxh span");

    if (chyyDm == '100') {
      // 原申报序号
      myItems[11].disabled = true;
      form.setFieldsValue({ ysbxh: undefined });
    } else {
      // 原申报序号
      myItems[11].disabled = false;
    }
    // 离线版申报系统企业撤回申报数据表撤回原因选择“自愿放弃申请撤回”时，凭证号码和凭证种类不允许为空。
    if (chyyDm == '200') {
      // 凭证种类
      lableSpan1.classList.add('required');
      // 凭证号码
      lableSpan2.classList.add('required');
      // 原申报序号
      lableSpan3.classList.add('required');
    } else {
      // 凭证种类
      lableSpan1.classList.remove('required');
      // 凭证号码
      lableSpan2.classList.remove('required');
      // 原申报序号
      lableSpan3.classList.remove('required');
    }

    // 如“撤回原因”选择“2.自愿放弃申请撤回”的且“申请撤回的原申报业务类型”选择“2.免抵退税跨境应税行为申报”或“3.免抵退税国际运输申报”的
    // “凭证种类”和“凭证号码”不可录入
    if (qylx == 'SC') {
      if ('200' == chyyDm && ('202' == chywlxDm || '203' == chywlxDm)) {
        form.setFieldsValue({
          cktmspzlxDm: undefined,
          jhpzh: undefined,
        });
        myItems[12].disabled = true;
        myItems[13].disabled = true;
        // 凭证种类
        lableSpan1.classList.remove('required');
        // 凭证号码
        lableSpan2.classList.remove('required');
      } else {
        myItems[12].disabled = false;
        myItems[13].disabled = false;
        // // 凭证种类
        // lableSpan1.classList.add('required');
        // // 凭证号码
        // lableSpan2.classList.add('required');
      }
    }
    if (qylx != 'SC' && chyyDm == '100') {
      // 原申报关联号
      myItems[10].disabled = true;
      form.setFieldsValue({ yglh: undefined });
    } else if (qylx != 'SC') {
      // 原申报关联号
      myItems[10].disabled = false;
    }

  

    setMyItems([...myItems]);
  },
  // 申请撤回的原申报业务类型
  chywlxDm01: (param: any) => {
    // 根据撤回原因获取不同的业务类型
    const { form, myItems, setMyItems } = param;
    const chyyDm = form?.getFieldValue('chyyDm');
    const chywlxDm = form?.getFieldValue('chywlxDm');
    const qylx = cktsUtil.sys.enterpriseType(); // 企业类型
    // 如“撤回原因”选择“2.自愿放弃申请撤回”的且“申请撤回的原申报业务类型”选择“2.免抵退税跨境应税行为申报”或“3.免抵退税国际运输申报”的
    // “凭证种类”和“凭证号码”不可录入

    // 凭证种类
    const lableSpan3: any = document.querySelector("#qtyw_sc_zxsb_sb_qychsbsj_gcb_form .dditem_label_cktmspzlxDm span");
    // 凭证号码
    const lableSpan2: any = document.querySelector("#qtyw_sc_zxsb_sb_qychsbsj_gcb_form .dditem_label_jhpzh span");

    if (qylx == 'SC') {
      if ('200' == chyyDm && ('202' == chywlxDm || '203' == chywlxDm)) {
        form.setFieldsValue({
          cktmspzlxDm: undefined,
          jhpzh: undefined,
        });
        myItems[12].disabled = true;
        myItems[13].disabled = true;
        lableSpan3.classList.remove('required');
        lableSpan2.classList.remove('required');
      } 
      else {
        myItems[12].disabled = false;
        myItems[13].disabled = false;
        // lableSpan3.classList.add('required');
        // lableSpan2.classList.add('required');
      }
    }
    // 设置必录标识
    // 原关联号
    const lableSpan1: any = document.querySelector("#qtyw_sc_zxsb_sb_qychsbsj_gcb_form .dditem_label_yglh span");
    if (qylx != 'SC' && chywlxDm == '204') {
      // 原申报关联号
      myItems[10].disabled = false;
      lableSpan1.classList.add('required');
    } else if (qylx != 'SC') {
      // 原申报关联号
      myItems[10].disabled = true;
      lableSpan1.classList.remove('required');
    }

    if (qylx != 'SC' && (chywlxDm != '102' && chywlxDm != '103' && chywlxDm != '105' && chywlxDm != '204' && chywlxDm != '205' && chywlxDm != '206' && chywlxDm != '208')) {
      // 申报撤回原申报批次
      myItems[9].disabled = true;
      form.setFieldsValue({ sbchysbpc: undefined });
    } else if (qylx != 'SC') {
      // 申报撤回原申报批次
      myItems[9].disabled = false;
    }

    setMyItems([...myItems]);
  },
}

export default Func;