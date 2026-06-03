/**
 * title: 出口货物转内销证明
 * author: wx
 */
import React from 'react';
import myUtil from '@/pages/common/myUtil';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import moment from 'moment';
import { message } from 'antd';
import { getCmCode, queryFpWzxx } from '@/services/hts/api';

const Func: any = {
  unitRef: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
}
// 编辑表单初始化
Func.initEditForm = (param: any) => {
  const { form, handleModalVisible } = param;
  form.setFieldsValue({  czlx: '2'  })
  handleModalVisible(true);
}

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
  // 编号
  sbbh101: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbbh101(form);
  },
  // 编号
  sbbh102: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbbh102(form);
  },
  // 项号
  xh401: (form: any) => {
    return DditCktsFormCommonFunc.validator.xh401(form);
  },
  // 内销情况_转内销数量
  nxsl01: (form: any) => {
    const validator =  async (_rule: any, value: any) => {
      // 转内销数量＜＝购货数量
      const { ghsl, yzsl, ynxsl } = form?.getFieldsValue();
      const sl = ghsl - yzsl - ynxsl;
      if (sl) {
        if (value > Number(myUtil.text.formatNum(sl, '0.00000'))) {
          return Promise.reject(new Error(`转内销数量超过${myUtil.text.formatNum(sl, '0,0.00000')}`));
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
  // 序号
  xh4: (param: any) => {
    DditCktsFormCommonFunc.eventOnBlur.xh4(param);
  },
  // 购货数量
  ghsl: (param: any) => {
    const { form } = param;
    const ghzsse  = form?.getFieldsValue().ghzsse; // 购货征税税额
    const ghsl  = form?.getFieldsValue().ghsl; // 购货数量
    const nxsl  = form?.getFieldsValue().nxsl; // 内销数量
    const ghje  = form?.getFieldsValue().ghje; // 购货金额
    const ghzssl  = form?.getFieldsValue().ghzssl; // 购货征税税率

		// 计算：可抵扣税额 = 税额 ÷ 数量 × 转内销数量
    const kdkse = DditCktsFormCommonFunc.util.setDeductibleTax({
			se: ghzsse, // 购货税额
			qnt: ghsl, // 购货数量
			nxQnt: nxsl, // 内销数量
			amt: ghje, // 购货金额
			sl: ghzssl // 购货征税税率
		});
		if (kdkse) {
      form.setFieldsValue({ kdkse: myUtil.text.getNumVal(myUtil.text.formatNum(kdkse, '0,0.00')) });
		} else {
      form.setFieldsValue({ kdkse: '' });
		}
	},
  // 购货金额
  ghje: (param: any) => {
    const { form } = param;
    const ghsl  = form?.getFieldsValue().ghsl; // 购货数量
    const nxsl  = form?.getFieldsValue().nxsl; // 内销数量
    const ghje  = form?.getFieldsValue().ghje; // 购货金额
    const ghzssl  = form?.getFieldsValue().ghzssl; // 购货征税税率

		// 计算：购货税额 =  购货金额 * 购货征税税率 / 100
		const ghzsse = DditCktsFormCommonFunc.util.setPurchaseTax({
			ghje: ghje,
			ghzssl: ghzssl
		});
		if (ghzsse) {
      form.setFieldsValue({ ghzsse: myUtil.text.getNumVal(myUtil.text.formatNum(ghzsse, '0,0.00')) });
      // 计算：可抵扣税额 = 税额 ÷ 数量 × 转内销数量
      const kdkse = DditCktsFormCommonFunc.util.setDeductibleTax({
        se: ghzsse, // 购货税额
        qnt: ghsl, // 购货数量
        nxQnt: nxsl, // 内销数量
        amt: ghje, // 购货金额
        sl: ghzssl // 购货征税税率
      });
      if (kdkse) {
        form.setFieldsValue({ kdkse: myUtil.text.getNumVal(myUtil.text.formatNum(kdkse, '0,0.00')) });
      } else {
        form.setFieldsValue({ kdkse: '' });
      }
    } else {
      form.setFieldsValue({
        kdkse: '',
        ghzsse: ''
      });
    }
	},
  // 购货征税率
  ghzssl: (param: any) => {
    const { form } = param;
    const ghsl  = form?.getFieldsValue().ghsl; // 购货数量
    const nxsl  = form?.getFieldsValue().nxsl; // 内销数量
    const ghje  = form?.getFieldsValue().ghje; // 购货金额
    const ghzssl  = form?.getFieldsValue().ghzssl; // 购货征税税率

		// 计算：购货税额 =  购货金额 * 购货征税税率 / 100
		const ghzsse = DditCktsFormCommonFunc.util.setPurchaseTax({
			ghje: ghje,
			ghzssl: ghzssl
		});

		if (ghzsse) {
      form.setFieldsValue({ ghzsse: myUtil.text.getNumVal(myUtil.text.formatNum(ghzsse, '0,0.00')) });
      // 计算：可抵扣税额 = 税额 ÷ 数量 × 转内销数量
      const kdkse = DditCktsFormCommonFunc.util.setDeductibleTax({
        se: ghzsse, // 购货税额
        qnt: ghsl, // 购货数量
        nxQnt: nxsl, // 内销数量
        amt: ghje, // 购货金额
        sl: ghzssl // 购货征税税率
      });
      if (kdkse) {
        form.setFieldsValue({ kdkse: myUtil.text.getNumVal(myUtil.text.formatNum(kdkse, '0,0.00')) });
      } else {
        form.setFieldsValue({ kdkse: '' });
      }
    } else {
      form.setFieldsValue({
        kdkse: '',
        ghzsse: ''
      });
    }
	},
  // 购货税额
  ghzsse: (param: any) => {
    const { form } = param;
    const ghzsse  = form?.getFieldsValue().ghzsse; // 购货征税税额
    const ghsl  = form?.getFieldsValue().ghsl; // 购货数量
    const nxsl  = form?.getFieldsValue().nxsl; // 内销数量

		// 计算：可抵扣税额 = 税额 ÷ 数量 × 转内销数量
    const kdkse = DditCktsFormCommonFunc.util.setDeductibleTax({
			se: ghzsse, // 购货税额
			qnt: ghsl, // 购货数量
			nxQnt: nxsl, // 内销数量
		});
		if (kdkse) {
      form.setFieldsValue({ kdkse: myUtil.text.getNumVal(myUtil.text.formatNum(kdkse, '0,0.00')) });
		} else {
      form.setFieldsValue({ kdkse: '' });
		}
	},
  // 内销情况_转内销数量
  nxsl: (param: any) => {
    const { form } = param;
    const ghzsse  = form?.getFieldsValue().ghzsse; // 购货征税税额
    const ghsl  = form?.getFieldsValue().ghsl; // 购货数量
    const nxsl  = form?.getFieldsValue().nxsl; // 内销数量
    const ghje  = form?.getFieldsValue().ghje; // 购货金额
    const ghzssl  = form?.getFieldsValue().ghzssl; // 购货征税税率

		// 计算：可抵扣税额 = 税额 ÷ 数量 × 转内销数量
    const kdkse = DditCktsFormCommonFunc.util.setDeductibleTax({
			se: ghzsse, // 购货税额
			qnt: ghsl, // 购货数量
			nxQnt: nxsl, // 内销数量
			amt: ghje, // 购货金额
			sl: ghzssl // 购货征税税率
		});
		if (kdkse) {
      form.setFieldsValue({ kdkse: myUtil.text.getNumVal(myUtil.text.formatNum(kdkse, '0,0.00')) });
		} else {
      form.setFieldsValue({ kdkse: '' });
		}
	},
  // 出口商品代码
  ckspDm: (param: any) => {
    // 通用的商品码回显
    const { form } = param;
    const ckspDm = form?.getFieldValue('ckspDm');
    if(ckspDm) {
      handleCkspxxEvent(form);
    }
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
  // 所属期
  ssq: (param: any) => {
    return DditCktsFormCommonFunc.eventOnChange.ssq(param);
  },
  // 原购货凭证号
  yghpzh: (param: any) => {
		queryFpxxByMtsTsjhJhpzh(param);
  },
}

// 配置项：自定义工具栏 报关单生成明细
Func.fpscmx = (param: any) => {
  DditCktsFormCommonFunc.fpscmx({...param, type: 'zmkj'});
}

// 设置商品信息
const setCkspxx = (form: any, obj: any, eleName?: any) => {
  form.setFieldsValue({
    ckspDm: obj.ckspDm || '',
    ckspmc: obj.ckspmc || '',
    hgjldwmc: obj.hgjldwmc || '',
  });
}

/**
 * @author jiangyg
 * @method handleCkspxxEvent
 * @desc 通用的商品码回显
 */
 const handleCkspxxEvent = (form: any) => {
  const ckspDm = form.getFieldValue('ckspDm');
  const ssq = form.getFieldValue('ssq');
  const ckrq1 = form.getFieldValue('ckrq1');
  // 如果商品代码为空则直接清空商品名称和计量单位
  if (!ckspDm) {
    setCkspxx(form, {});
    return;
  }
  const param = { ckspDm, ssq, ckrq1 };
  getCmCode(param).then((response) => {
    const { code, body, desc, msg } = response;
    if (code === '200') {
      if (body) {
        setCkspxx(form, {
          ckspDm: body.ckspDm,
          ckspmc: body.ckspmc,
          hgjldwmc: body.hgjldwmc,
        });
      } else {
        message.info('此商品码不存在，请确认后填报');
        setCkspxx(form, {});

      }
    } else if (code !== '200' && desc.trim()) {
      message.error(msg);
      return;
    }
  })
}

/**
 * @author liwc
 * @method queryFpxxByMtsTsjhJhpzhm
 * @desc 计算：给根据进货明细进货凭证号查询发票信息
 * @param param
 */
 const queryFpxxByMtsTsjhJhpzh = (param: any) => {
  const { form } = param;
  if (!param) {
    return;
  }
  // 进货凭证号/已使用过设备凭证号
  let jhpzh;
  jhpzh = form.getFieldValue('yghpzh');
  // 发票代码10位
  let fpDm;
  // 发票号码8位
  let fphm;
  if (jhpzh && jhpzh.length === 18) {
    fpDm = jhpzh.substring(0, 10);
    fphm = jhpzh.substring(10, 18);
  } else if (jhpzh && jhpzh.length == 20) {
    // edit by yangzq 20211103 数电票改造
    fpDm = '';
    fphm = jhpzh;
  }

  if (jhpzh.length === 18 || jhpzh.length == 20) {
    queryFpWzxx({ fpDm, fphm }).then((response) => {
      const { code, body } = response;
      if (code === '200' && body) {
        // 开票日期
        const kprq = body.kprq;
        // 供方纳税人识别号（销货方）
        const xfnsrsbh = body.xfnsrsbh;
        if (xfnsrsbh) {
          form.setFieldsValue({
            ghfnsrsbh1: xfnsrsbh || '',
          });
        }
        if (body.jsje) {
          form.setFieldsValue({
            jsje: body.jsje || '',  // 计税金额
          });
        }
        if (kprq) {
          form.setFieldsValue({
            ghkprq: kprq ? moment(new Date(kprq)) : '',
            ghje: body.je ? myUtil.text.getNumVal(myUtil.text.formatNum(body.je, '0,0.00')) : '',
            ghzssl: body.zssl || '',
          });
        }
      }
    })
  }
};

export default Func;