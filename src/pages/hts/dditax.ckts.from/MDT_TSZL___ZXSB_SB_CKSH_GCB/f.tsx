/**
 * title: 出口收汇
 * author:
 */
import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { message } from 'antd';
import { queryCkxxByCondition } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import cktsUtil from '@/pages/hts/cktsUtil';


const Func: any = {
  refUnit: React.createRef(),
};

Func.validator = {
  // 所属期
  ssq01: (form: any) => {
    return DditCktsFormCommonFunc.validator.ssq01(form);
  },
  // 所属期
  ssq02: (form: any) => {
    return DditCktsFormCommonFunc.validator.ssq02(form);
  },
  // 申报序号
  sbxh02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbxh02(form);
  },
  // 出口报关单号
  ckbgdh03: (form: any) => {
    // 原系统不校验
    const validator = async (_rule: any, value: any) => {
      return Promise.resolve();
    };
    return { validator };
  },
  // 备注
  bz02: (form: any) => {
    return DditCktsFormCommonFunc.validator.bz02(form);
  },
}

// 表单页面onChange事件
Func.eventOnChange = {
  // 出口报关单号
  ckbgdh: (param: any) => {
    // 该报关单号当期出口明细中不存在
    // 走后台接口
    // 原系统内无对应代码
    // 出口报关单号
    const { form } = param;
    const ckbgdh = form?.getFieldValue('ckbgdh'); 
    const ssq = form?.getFieldValue('ssq'); 
    const sbxh = form?.getFieldValue('sbxh'); 
    const qylx = cktsUtil.sys.enterpriseType();
    const obj = {
      ckbgdh,
      qylx: qylx.toLocaleLowerCase(),
      sbxh,
      ssq,
    }
    queryCkxxByCondition(obj).then((res: any) => {
      const { body, code, msg } = res;
      if(code === '200') {
        if(body && body.length > 0){
          const option = myUtil.code.getCode('url_gy_hbhl:01');
          const tempRows = option.filter((row: any) => {
            return (row.hbzmDm === body[0]?.cjhbzmDm);
          });
          const cjhbzmmc = tempRows[0].hbmc;
          const ckxsermb =  DditCktsFormCommonFunc.util.setTaxAmt({ a: body[0]?.cjzj, b: body[0]?.cjhbhl, format: '0.00' })
          form.setFieldsValue({ 
            ckfph: body[0]?.ckfph ? body[0].ckfph : '',
            cjhbzmDm: body[0]?.cjhbzmDm ? body[0].cjhbzmDm : '',
            cjhbzmmc: cjhbzmmc,
            cjzj: body[0]?.cjzj ? body[0].cjzj : '',
            cjhbhl: body[0]?.cjhbhl ? body[0].cjhbhl : '',
            ckxsermb: Number(ckxsermb), 
          });
        }
      } else {
        message.info(msg)
      }
    })
  },

  // 收汇日期
  ckshrq: (param: any) => {
    DditCktsFormCommonFunc.eventOnChange.ckshrq(param);
  },


  // 视同收汇原因代码（原tableSelect）
  stshqkyy: (param: any) => {
    DditCktsFormCommonFunc.eventOnChange.stshqkyy(param);
  },
  // 视同收汇举证材料种类代码（原tableSelect）
  stshqkjzclzl: (param: any) => {
    DditCktsFormCommonFunc.eventOnBlur.stshqkjzclzl(param);
  },
  hbhlDm: (param: any) => {
    const { form } = param;
    const ckshhbzmDm = form?.getFieldValue('ckshhbzmDm'); // 出口收汇币种代码
    const cjhbzmDm = form?.getFieldValue('cjhbzmDm');  // 出口销售币种代码
    // 连带清空
    if(!ckshhbzmDm) {
      form.setFieldsValue({
        ckshhbzmDm: '',
        ckshhbzmmc: '',
        ckshhbhl: '',
      });
    }

    if(!cjhbzmDm) {
      form.setFieldsValue({cjhbzmmc: ''});
    }
  },
}

Func.eventOnFocus = {
  // 清算币种
  hbhlDm: (param: any) => {
    Func.eventOnChange.ckshrq(param);
  },
}

// 表单事件：OnBlur
Func.eventOnBlur = {
  // 申报序号
  sbxh: (param: any) => {
    // 申报序号自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbxh(param);
  },
  // 出口报关单号
  ckbgdh: (param: any) => {
    const params = {...param};
    params.ywKey = 'MDT';
    params.dbtzd = ['ckfph', 'cjhbzmDm', 'cjhbzmmc', 'cjzj', 'cjhbhl', 'ckxsermb'];
    DditCktsFormCommonFunc.eventOnBlur.bgdCksh(params);
  },
  // 出口销售金额
  cjzj: (param: any) => {
    // 计算出口货物销售额折合人民币金额=出口销售金额*销售币种汇率/100，保留2位小数
    DditCktsFormCommonFunc.eventOnBlur.cjzj(param);
  },
  // 销售币种汇率
  cjhbhl: (param: any) => {
    // 计算出口货物销售额折合人民币金额=出口销售金额*销售币种汇率/100，保留2位小数
    DditCktsFormCommonFunc.eventOnBlur.cjhbhl(param);
  },
  // 出口收汇金额
  ckshje: (param: any) => {
    // 计算出口货物收汇折合人民币金额=出口收汇金额*出口收汇币种汇率/100，保留2位小数
    DditCktsFormCommonFunc.eventOnBlur.ckshje(param);
  },
  // 出口收汇币种汇率
  ckshhbhl: (param: any) => {
    // 计算出口货物收汇折合人民币金额=出口收汇金额*出口收汇币种汇率/100，保留2位小数
    DditCktsFormCommonFunc.eventOnBlur.ckshhbhl(param);
  },
  // 视同收汇原因代码
  stshqkyy: (param: any) => {
    // 原系统中无对应代码
  },
  // 出口货物收汇币种
  hbhlDm: (param: any) => {
    const glName = ["ckshhbzmmc", "ckshhbhl"]
    DditCktsFormCommonFunc.eventOnBlur.hbhlDm(param, glName);
  },
}

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
}
// 编辑表单初始化
Func.initEditForm = (param: any) => {
  const { form, formItems, setFormItems, handleModalVisible, unitKey } = param;
  const params: any = {
    form: form,
    myItems: formItems,
    setMyItems: setFormItems,
  }
  handleModalVisible(true);
  params.unitKey = unitKey;

  const ckshhbzmDm = form?.getFieldValue('ckshhbzmDm'); // 出口货物收汇币种
  if(ckshhbzmDm) {
    params.value = ckshhbzmDm;
    params.item = { name: 'ckshhbzmDm' };
    Func.eventOnBlur.hbhlDm(params);
  } else {
    form.setFieldsValue({
      ckshhbzmmc: ''
    })
  }
  const cjhbzmDm = form?.getFieldValue('cjhbzmDm'); // 出口货物销售额币种
  params.value = cjhbzmDm;
  params.item = { name: 'cjhbzmDm' };
  Func.eventOnBlur.hbhlDm(params);
};
// 表单保存
Func.formBeforeSubmit = (param: any) => {
  const { form } = param;
  const ckbgdh = form?.getFieldValue('ckbgdh'); // 出口货物报关单号
  const dlckhwzmhm = form?.getFieldValue('dlckhwzmhm'); // 代理出口货物证明号
  // 1.出口报关单号和代理证明号不能同时为空
  if (!ckbgdh && !dlckhwzmhm) {
    message.info('出口货物报关单号与代理出口货物证明号不能同时为空，请确认后填报！');
    return false;
  } else if (ckbgdh && dlckhwzmhm) {
    message.info('报关单号和代理证明号不需要同时采集，请确认！');
    return false;
  }
  // add by yzq 收汇信息条件必录校验
  const ckshrq = form?.getFieldValue('ckshrq'); // 收汇日期
  const pzhm2 = form?.getFieldValue('pzhm2'); // 收汇凭证号
  const yshqkpzzje = form?.getFieldValue('yshqkpzzje'); // 凭证总金额
  const ckshhbzmDm = form?.getFieldValue('ckshhbzmDm'); // 出口货物收汇币种
  const ckshje = form?.getFieldValue('ckshje'); // 出口货物收汇金额
  const ckshhbhl = form?.getFieldValue('ckshhbhl'); // 出口货物收汇币种汇率
  const ckshjermb = form?.getFieldValue('ckshjermb'); // 出口货物收汇折合人民币金额
  const fhr = form?.getFieldValue('fhr'); // 付汇人
  if (ckshrq || pzhm2 || yshqkpzzje || ckshhbzmDm || ckshje || ckshhbhl || ckshjermb || fhr) {
    let msg = [];
    if (!ckshrq) {
      msg.push('收汇日期');
    }
    if (!pzhm2) {
      msg.push('收汇凭证号');
    }
    if (!ckshhbzmDm) {
      msg.push('出口货物收汇币种');
    }
    if (!yshqkpzzje) {
      msg.push('凭证总金额');
    }
    if (!ckshje) {
      msg.push('出口货物收汇金额');
    }
    if (!ckshhbhl) {
      msg.push('出口货物收汇币种汇率');
    }
    if (!ckshjermb) {
      msg.push('出口货物收汇折合人民币金额');
    }
    if (!fhr) {
      msg.push('付汇人');
    }
    if (msg.length != 0) {
      message.info(msg.join('，') + '不能为空！');
      return false;
    }
  }
  // add by yzq 视同自产信息条件必录校验
  const stshqkyy = form?.getFieldValue('stshqkyy') || []; // 视同收汇原因代码
  const stshqkjzclzl = form?.getFieldValue('stshqkjzclzl') || []; // 视同收汇举证材料种类代码
  const stshqkzrmbje = form?.getFieldValue('stshqkzrmbje'); // 视同收汇人民币金额
  const stshqkhtydqbshzzrq = form?.getFieldValue('stshqkhtydqbshzzrq'); // 合同约定全部收汇最终日期
  const stshqkckhth = form?.getFieldValue('stshqkckhth'); // 出口合同号

  if ((stshqkyy && stshqkyy.length > 0) || (stshqkjzclzl && stshqkjzclzl.length>0) || (stshqkzrmbje && stshqkzrmbje !=0)) {
    let msg = [];
    if (stshqkyy.length === 0) {
      msg.push('视同收汇原因代码');
    } else {
      if (stshqkyy.indexOf('08') != -1) {
        // 视同收汇原因代码含有08，则合同约定收汇最终日期、出口合同号必录
        if (!stshqkhtydqbshzzrq) {
          msg.push('合同约定全部收汇最终日期');
        }
        if (!stshqkckhth) {
          msg.push('出口合同号');
        }
      }
    }
    if (stshqkjzclzl.length === 0) {
      msg.push('视同收汇举证材料种类代码');
    }
    if (!stshqkzrmbje || stshqkzrmbje === 0) {
      msg.push('视同收汇人民币金额');
    }
    if (msg.length != 0) {
      message.info(msg.join('，') + '不能为空！');
      return false;
    }
  }
  return true;
}

// 表单保存后执行
Func.formAfterSubmit = (param: any) => {
  // 初始化新建界面的基本信息
  DditCktsFormCommonFunc.initAddForm(param);
  // 需求单独提，保存并新增不清空已采集的字段
}

// 模板下载
Func.mdtShMbxz = (param: any) => {
  const {otherRef,refUnit} = param;
  otherRef[0].current?.showModal(refUnit);
}

Func.mdtShDr = (param: any) => {
  const {otherRef, gridRef} = param;
  const data = {
    key: 'SAAS_TSSB_MXCJ_CKSH_SC_DR',
    // url: importUrl,
    // templateUrl: templateUrl,
    gridRef: gridRef,
    showType: true,
    unit_lcswsx_dm: 'LCSXA081038001',
    exkey: cjpzUtil.bdcj.formatExkey('SAAS_TSSB_MXCJ_CKSH_SC_DC',  'SAAS_SJGL_SWFKCX_MDT_CKSH_DC', 'SAAS_TSSB_MDT_SBMXCK_CKSH_DC', '', 'TSZL_ZXSB_SB_CKSH_G'),
    showStyle: '',
    exprotMsg:'',
    buttenHidden: false, // 失败原因导出按钮
    isYcMbxzBtn: true
  }
  otherRef[1].current?.showModal(data);
}

Func.mdtShTq = (param: any) => {
  const {otherRef} = param;
  otherRef[2].current?.showModal(param);
}


export default Func;