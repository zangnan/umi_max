/**
 * title: 企业撤回退（免）税申报申请表
 * author: wx
 */
import React from 'react';
import myUtil from '@/pages/common/myUtil';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import config from './auto_config';

const Func: any = {
  unitRef: React.createRef(),
};

// 编辑表单初始化
Func.initEditForm = (param: any) => {
  const { form, myFormItems, setMyFormItems, handleModalVisible } = param;
  const params: any = {
    form: form,
    myItems: myFormItems,
    setMyItems: setMyFormItems,
  }
  handleModalVisible(true);
  Func.eventOnChange.chyyDm(params);
};

Func.initAddForm = (param: any) => {
  const {setMyFormItems, } = param;
  const myConfig = { ...config };
  myConfig.form_items[9].disabled = true;
  myConfig.form_items[7].disabled = true;
  myConfig.form_items[10].disabled = true;
  param.doSuccess = async () => {
    setMyFormItems(myConfig.form_items);
    document.querySelector("#qtyw_wm_zxsb_sb_qychsbsj_gcb_form .dditem_label_sbchysbpc span")?.classList.remove('required');
    document.querySelector("#qtyw_wm_zxsb_sb_qychsbsj_gcb_form .dditem_label_yglh span")?.classList.remove('required');
    document.querySelector("#qtyw_wm_zxsb_sb_qychsbsj_gcb_form .dditem_label_ysbxh span")?.classList.remove('required');
    document.querySelector("#qtyw_wm_zxsb_sb_qychsbsj_gcb_form .dditem_label_cktmspzlxDm span")?.classList.remove('required');
    document.querySelector("#qtyw_wm_zxsb_sb_qychsbsj_gcb_form .dditem_label_jhpzh span")?.classList.remove('required');
    await param.handleModalVisible(true);
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
    const validator = (_rule: any, value: any) => {
      // let qylx = layui.myUtil.enterpriseType(); // 企业类型
      if (chywlxDm == '102' || chywlxDm == '103' || chywlxDm == '105' || chywlxDm == '204' || chywlxDm == '205' || chywlxDm == '206' || chywlxDm == '208') {
        if (!sbchysbpc) {
          return Promise.reject(new Error('该项内容为必填项不能为空！'));
        }
      } else if (chywlxDm != '102' && chywlxDm != '103' && chywlxDm != '105' && chywlxDm != '204' && chywlxDm != '205' && chywlxDm != '206' && chywlxDm != '208') {
        if (sbchysbpc) {
          return Promise.reject(new Error('当撤回业务类型为“免退税申报”，“免退税货物劳务申报”，“免退税跨境应税行为申报”和“外贸综合服务企业代办退税”时，该项应为空！'));
        }
      }
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
    const validator = (_rule: any, value: any) => {
      // 外贸系统，撤回原因为2时，撤回业务类型为“免退税申报”、“横琴、平潭业务（货物）申报”时，必录，否则应为空
      // let qylx = layui.myUtil.enterpriseType(); // 企业类型
      if (chyyDm == '200' && (chywlxDm == '204' || chywlxDm == '208')) {
        if (!yglh) {
          return Promise.reject(new Error('该项内容为必填项不能为空！'));
        }
      } else if (chyyDm == '100' || (chyyDm == '200' && (chywlxDm != '204' && chywlxDm != '208'))) {
        if (yglh) {
          return Promise.reject(new Error('当撤回原因为“自愿放弃申请撤回”，并且撤回业务类型为“免退税货物劳务申报”和“免退税跨境应税行为申报”时，该项应为空！'));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 原申报序号
  ysbxh01: (form: any) => {
    const chyyDm = form?.getFieldValue('chyyDm');
    const ysbxh = form?.getFieldValue('ysbxh');
    // 撤回原因为2时,必录
    const validator = (_rule: any, value: any) => {
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
    const validator = (_rule: any, value: any) => {
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
    const validator = (_rule: any, value: any) => {
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
    const qylx = myUtil.sys.enterpriseType(); // 企业类型
    let viewKey = '02'
    if (chyyDm == '100') {
      viewKey = '04';
    } else if (chyyDm == '200') {
      viewKey = '06';
    }
    // 修改撤回原因重新获取码表
    const option = await myUtil.code.getCodeFromServerT1('code_dm_ckts_chywlx', viewKey);
    let list: any[] = [];
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

    const lableSpan1: any = document.querySelector("#qtyw_wm_zxsb_sb_qychsbsj_gcb_form .dditem_label_cktmspzlxDm span");
    const lableSpan2: any = document.querySelector("#qtyw_wm_zxsb_sb_qychsbsj_gcb_form .dditem_label_jhpzh span");
    const lableSpan3: any = document.querySelector("#qtyw_wm_zxsb_sb_qychsbsj_gcb_form .dditem_label_ysbxh span");

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
      } else {
        myItems[12].disabled = false;
        myItems[13].disabled = false;
      }
    }
    if (qylx != 'SC' && chyyDm == '100' || (qylx != 'SC' && chyyDm == '200' && chywlxDm != '204')) {
      // 原申报关联号
      myItems[10].disabled = true;
      form.setFieldsValue({ yglh: undefined });
    } else if (qylx != 'SC') {
      // 原申报关联号
      myItems[10].disabled = false;
    }
    if (chyyDm == '100') {
      // 原申报序号
      myItems[11].disabled = true;
      lableSpan3.classList.remove('required');
      form.setFieldsValue({ ysbxh: undefined });
    } else {
      // 原申报序号
      myItems[11].disabled = false;
      lableSpan3.classList.add('required');
    }

    // 离线版申报系统企业撤回申报数据表撤回原因选择“自愿放弃申请撤回”时，凭证号码和凭证种类不允许为空。
    if (chyyDm == '200') {
      // 凭证种类
      lableSpan1.classList.add('required');
      // 凭证号码
      lableSpan2.classList.add('required');
    } else {
      // 凭证种类
      lableSpan1.classList.remove('required');
      // 凭证号码
      lableSpan2.classList.remove('required');
    }
    myItems[7].disabled = false;
    setMyItems([...myItems]);
  },
  // 申请撤回的原申报业务类型
  chywlxDm02: (param: any) => {
    // 根据撤回原因获取不同的业务类型
    const { form, myItems, setMyItems } = param;
    const chyyDm = form?.getFieldValue('chyyDm');
    const chywlxDm = form?.getFieldValue('chywlxDm');
    const qylx = myUtil.sys.enterpriseType(); // 企业类型

    // 原申报批次
    const lableSpan1: any = document.querySelector("#qtyw_wm_zxsb_sb_qychsbsj_gcb_form .dditem_label_sbchysbpc span");
    // 原申报关联号
    const lableSpan2: any = document.querySelector("#qtyw_wm_zxsb_sb_qychsbsj_gcb_form .dditem_label_yglh span");
    // 原申报序号
    const lableSpan3: any = document.querySelector("#qtyw_wm_zxsb_sb_qychsbsj_gcb_form .dditem_label_ysbxh span");
    // 凭证种类
    const lableSpan4: any = document.querySelector("#qtyw_wm_zxsb_sb_qychsbsj_gcb_form .dditem_label_cktmspzlxDm span");
    // 凭证号码
    const lableSpan5: any = document.querySelector("#qtyw_wm_zxsb_sb_qychsbsj_gcb_form .dditem_label_jhpzh span");

    // 如“撤回原因”选择“2.自愿放弃申请撤回”的且“申请撤回的原申报业务类型”选择“2.免抵退税跨境应税行为申报”或“3.免抵退税国际运输申报”的
    // “凭证种类”和“凭证号码”不可录入
    if (qylx == 'SC') {
      if ('200' == chyyDm && ('202' == chywlxDm || '203' == chywlxDm)) {
        form.setFieldsValue({
          cktmspzlxDm: undefined,
          jhpzh: undefined,
        });
        myItems[12].disabled = true; // cktmspzlxDm 凭证种类
        myItems[13].disabled = true; // jhpzh 凭证号码
      } else {
        myItems[12].disabled = false;
        myItems[13].disabled = false;
      }
    } else {
      lableSpan1.classList.remove('required');
      lableSpan2.classList.remove('required');
      lableSpan3.classList.remove('required');
      lableSpan4.classList.remove('required');
      lableSpan5.classList.remove('required');
      myItems[9].disabled = true;
      myItems[10].disabled = true;
      if(chyyDm == '200'){
        if (chywlxDm == '204') {
          lableSpan1.classList.add('required');
          lableSpan2.classList.add('required');
          lableSpan3.classList.add('required');
          lableSpan4.classList.add('required');
          lableSpan5.classList.add('required');
          myItems[9].disabled = false;
          myItems[10].disabled = false;
        } else if (chywlxDm == '205' || chywlxDm == '206') {
          lableSpan1.classList.add('required');
          lableSpan3.classList.add('required');
          lableSpan4.classList.add('required');
          lableSpan5.classList.add('required');
          myItems[9].disabled = false;
        } else{
          lableSpan3.classList.add('required');
          lableSpan4.classList.add('required');
          lableSpan5.classList.add('required');
        }
      }else{
        if (chywlxDm == '102' || chywlxDm == '103') {
          lableSpan1.classList.add('required');
          myItems[9].disabled = false;
          myItems[11].disabled = true;
        }
        if (chywlxDm == '104' || chywlxDm == '106'|| chywlxDm == '107') {
          myItems[11].disabled = true;
        }
        
      }
   
    }
    setMyItems([...myItems]);
  },
}

export default Func;