/**
 * title: 购进自用货物
 * author: wx
 */
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { message } from 'antd';
import { queryFpWzxx } from '@/pages/hts/services/htsApi';
import moment from 'moment';

const Func: any = {
  unitRef: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
}

// 表单校验
Func.validator = {
  // 所属期
  ssq02: (form: any) => {
    return DditCktsFormCommonFunc.validator.ssq02(form);
  },
  // 申报批次
  sbpc02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbpc02(form);
  },
  // 公共税率取值范围 校验处理
  ggslqzfw01: (form: any) => {
    // todo 原系统内有对应方法 但无本页面key对应代码
    return DditCktsFormCommonFunc.validator.ggslqzfw01(form);
  },
  // 备注
  bz01: (form: any) => {
    const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
    // 请求后端验证所属期是否已申报
    const validator =  (_rule: any, value: any) => {
			// 1. 业务类型为“GJSDQ”时，备注必录
      const bz = form?.getFieldValue('bz');
			if (cktmsywlxdmjh == 'GJSDQ' && !bz) {
        return Promise.reject(new Error('业务类型为GJSDQ时，备注必录，请确认后填报！'));
			}
      return Promise.resolve();
    };
    return { validator };
  },
}
// 表单事件：OnBlur
Func.eventOnBlur = {
  // 申报序号
  sbxh: (param: any) => {
    // 申报序号自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbxh(param);
  },
  // 进货凭证号码
  jhpzh: (param: any) => {
    const { form } = param;
    /*
     * add by shil 购进自用货物 ： 进货凭证种类选择“增值税专用发票”时，进货凭证号光标离开，调用现存接口查询发票数据，采集字段回显发票相关信息
     */
    const jhpzzlDm = form?.getFieldValue('jhpzzlDm');
    if (jhpzzlDm && jhpzzlDm != '1') { // 不是增值税专用发票类型
      return;
    }
    // 进货凭证号/已使用过设备凭证号
    let jhpzh;
    jhpzh = form?.getFieldsValue().jhpzh; // 美元离岸价
    // 发票代码10位
    let fpDm;
    // 发票号码8位
    let fphm;
    if (jhpzh && jhpzh.length == 18) {
      fpDm = jhpzh.substring(0, 10);
      fphm = jhpzh.substring(10, 18);
    } else if (jhpzh && jhpzh.length == 20) {
      // edit by yangzq 20211103 数电票改造
      fpDm = '';
      fphm = jhpzh;
    }
    // edit by yangzq 20211103 数电票改造
    if ((fpDm && fphm && fpDm.length == 10 && fphm.length == 8) || (fphm && fphm.length == 20)) {
      queryFpWzxx({
        fpDm: fpDm,
        fphm: fphm
      }).then((res: any) => {
        const { body } = res;
        if (res.code == '200') {
          // 开票日期
          const kprq = body.kprq;
          // 供方纳税人识别号（销货方）
          const xfnsrsbh = body.xfnsrsbh;
          if (xfnsrsbh) {
            form.setFieldsValue({ ghfnsrsbh1: xfnsrsbh });
          }
          if (body.jsje != null) {
            form.setFieldsValue({ jsje: myUtil.text.getNumVal(myUtil.text.formatNum(body.jsje, '0,0.00')) }); // 计税金额
          }
          if (kprq) {
            form.setFieldsValue({ kprq: kprq ? moment(new Date(kprq)) : '' });
          }
          // ZBYW___ZXSB_SB_GJ_SBMX_GCB
          if (body.jldwmc) {
            form.setFieldsValue({ hgjldwmc: body.jldwmc }); // 单位
          }
          if (body.sl) {
            form.setFieldsValue({ sl: myUtil.text.getNumVal(myUtil.text.formatNum(body.sl, '0, 0.0000')) }); // 数量
          }
          if (body.dj) {
            form.setFieldsValue({ dj: myUtil.text.getNumVal(myUtil.text.formatNum(body.dj, '0, 0.00')) }); // 单价
          }
          if (body.zssl) {
            form.setFieldsValue({ zssl: body.zssl }); // 征税率
          }
          if (body.se) {
            form.setFieldsValue({ se: myUtil.text.getNumVal(myUtil.text.formatNum(body.se, '0, 0.00')) }); // 税额
            form.setFieldsValue({ tse: myUtil.text.getNumVal(myUtil.text.formatNum(body.se, '0, 0.00')) }); // 申报退税额（等于税额）
          }
        } else if(res.code == '900') {
          message.info(res.msg)
        } else {
          message.error(res.desc)
        }
      })
    }
  },
  // 数量
  sl: (param: any) => {
    const { form } = param;
    // 购进自用货物
    const sl = form?.getFieldValue('sl');
    const dj = form?.getFieldValue('dj');
    if (!sl || !dj) {
      form.setFieldsValue({
        jsje: '',
        se: '',
        tse: '',
      });
      return;
    }
    form.setFieldsValue({
      jsje: myUtil.text.getNumVal(myUtil.text.formatNum(DditCktsFormCommonFunc.util.setAmt({ a: dj, b: sl, format: '0.0000' }), '0,0.00')),
    });
  },
  // 单价
  dj: (param: any) => {
    const { form } = param;
    // 购进自用货物
    const sl = form?.getFieldValue('sl');
    const dj = form?.getFieldValue('dj');
    if (!sl || !dj) {
      form.setFieldsValue({
        jsje: '',
        se: '',
        tse: '',
      });
      return;
    }
    form.setFieldsValue({
      jsje: myUtil.text.getNumVal(myUtil.text.formatNum(DditCktsFormCommonFunc.util.setAmt({ a: dj, b: sl, format: '0.0000' }), '0,0.00')),
    });
  },
  // 计税金额
  jsje: (param: any) => {
    const { form } = param;
    // 购进自用货物
    const jsje = form?.getFieldValue('jsje');
    const zssl = form?.getFieldValue('zssl');
    form.setFieldsValue({
      se: myUtil.text.getNumVal(myUtil.text.formatNum(DditCktsFormCommonFunc.util.setTaxAmt({ a: jsje, b: zssl, format: '0.00' }), '0,0.00')),
      tse: myUtil.text.getNumVal(myUtil.text.formatNum(DditCktsFormCommonFunc.util.setTaxAmt({ a: jsje, b: zssl, format: '0.00' }), '0,0.00')),
    });
  },
  // 征税率
  zssl: (param: any) => {
    const { form } = param;
    // 购进自用货物
    const jsje = form?.getFieldValue('jsje');
    const zssl = form?.getFieldValue('zssl');
    form.setFieldsValue({
      se: myUtil.text.getNumVal(myUtil.text.formatNum(DditCktsFormCommonFunc.util.setTaxAmt({ a: jsje, b: zssl, format: '0.00' }), '0,0.00')),
      tse: myUtil.text.getNumVal(myUtil.text.formatNum(DditCktsFormCommonFunc.util.setTaxAmt({ a: jsje, b: zssl, format: '0.00' }), '0,0.00')),
    });
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
  // 税额
  se: (param: any) => {
    const { form } = param;
    const se = form?.getFieldValue('se');
    if (se) {
      form.setFieldsValue({ tse: se });
    }
  },
  // 业务类型
  cktmsywlxDm03: (param: any) => {
    const { form, value } = param;
    const cktmsywlxmcjh = myUtil.code.getCodeValByKey(value, 'code_dm_ckts_cktmsywlx:03');
		if (value) {
      form.setFieldsValue({ cktmsywlxmcjh: cktmsywlxmcjh });
		}
    // ZBYW_ZXSB_SB_GJ_SBMX_G
    if ('GCSB' == value) {
      form.setFieldsValue({ bz: '科技开发、科学研究、教学设备' });
    } else if ('CBTS' == value) {
      const bz = form?.getFieldValue('bz');
      if (bz == '' || bz == null) {
        form.setFieldsValue({ bz: '船舶退税' });
      }
    } else {
      form.setFieldsValue({ bz: '' });
    }
  },
}

export default Func;