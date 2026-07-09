/**
 * title: 外贸企业出口退税进货明细申报表
 * author: wx
 */
import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { getCmCode, queryCjCsh, queryCjGlh, queryFpWzxx, queryMdtCkxxByGlh, queryMdtGlhBySsq } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import {message} from 'antd';
import moment from 'moment';
import {history} from 'umi';

const Func: any = {
  refUnit: React.createRef(),
};

Func.tszbcs = (param: any) => {
  const {otherRef} = param;
  otherRef[1].current?.showModal(param);
}
// 编辑表单初始化
Func.initEditForm = async (param: any) => {
  const {form, myFormItems, setMyFormItems, handleModalVisible} = param;
  const obj = {
    ssq: form?.getFieldValue('ssq'),
  }
  queryMdtGlhBySsqFunc(param, obj, 'edit');
  const params: any = {
    form: form,
    myItems: myFormItems,
    setMyItems: setMyFormItems,
    flag: 'edit'
  }
  handleModalVisible(true);
  if (history.location.pathname.indexOf('/25/2503') > -1) {
    Func.eventOnChange.sz(params);
    Func.eventOnChange.glh(params);
  }
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  param.doSuccess = (res: any) => {
    queryMdtGlhBySsqFunc(param, res?.body, 'add');
  };
  param.form.setFieldsValue({sz: 'V'});
  param.form.setFieldsValue({cktmspzlxDm: '02'});
  DditCktsFormCommonFunc.initAddForm(param);
};

// 表单校验
Func.validator = {
  // 申报批次
  sbpc01: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbpc01(form);
  },
  // 关联号
  glh01: (form: any) => {
    // 请求后端验证所属期是否已申报
    const validator = async (_rule: any, value: any) => {
      return Promise.resolve();
    };
    return {validator};
  },
  // 关联号
  glh02: (form: any) => {
    const uuid = form?.getFieldValue('uuid');
    const ssq = form?.getFieldValue('ssq');
    // 请求后端验证所属期是否已申报
    const validator = async (_rule: any, value: any) => {
      const params = {
        uuid: uuid,
        ssq: ssq,
        sbxh: value,
      }
      if (history.location.pathname.indexOf('/25/2503') > -1) {
        await queryMdtCkxxByGlh(params).then((res) => {
          if (res.code != '200') {
            return Promise.reject(new Error(res.msg));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
      }
      return Promise.resolve();
    };
    return {validator};
  },
  // 税种
  sz01: (form: any) => {
    return DditCktsFormCommonFunc.validator.sz01(form);
  },
  // 进货凭证号
  jhpzh03: (form: any) => {
    return DditCktsFormCommonFunc.validator.jhpzh03(form);
  },
  // 供货方纳税人识别号
  ghgnsrsbh01: (form: any) => {
    const validator = (_rule: any, value: any) => {
      const ghgnsrsbh = form?.getFieldValue('ghgnsrsbh');
      if (ghgnsrsbh && ghgnsrsbh.length <= 15) {
        return Promise.reject(new Error('该项数值必须大于或等于15位，请确认后填报！'));
      }
      return Promise.resolve();
    };
    return {validator};
  },
  // 供货方纳税人识别号
  ghgnsrsbh02: (form: any) => {
    const validator = (_rule: any, value: any) => {
      // 凭证种类为02增值税专用发票06消费税专用缴款书07分割单时，供货方税号必录
      const cktmspzlxDm = form?.getFieldValue('cktmspzlxDm');
      // let bz = myUtil.getNameVal(item, 'bz');
      if ((cktmspzlxDm == '02' || cktmspzlxDm == '06' || cktmspzlxDm == '07') && !value) {
        return Promise.reject(new Error('凭证种类为02时，供货方纳税号必录，请确认后填报！'));
      }
      return Promise.resolve();
    };
    return {validator};
  },
  // 数量
  sl01: (form: any) => {
    const validator = (_rule: any, value: any) => {
      const glh = form?.getFieldValue('glh');
      const ywLy = glh?.substring(0, 2) ?? undefined;
      if (glh && ywLy != 'FW' && ywLy != 'YS' && !value) {
        return Promise.reject(new Error('关联号为出口明细关联号时，数量必录！'));
      }
      return Promise.resolve();
    };
    return {validator};
  },
}

// 表单事件：OnBlur
Func.eventOnBlur = {
  // 申报年月
  ssq: (param: any) => {
    const {form} = param;
    const obj = {
      ssq: form?.getFieldValue('ssq'),
    }
    queryMdtGlhBySsqFunc(param, obj, 'blur');
    if (form?.getFieldValue('glh')) {
      Func.eventOnChange.glh(param);
    }
  },
  // 关联号
  glh: (param: any) => {
    // 申报序号自动补零
    const {event, form} = param;
    const inputValue = event.target.value;
    form.setFieldsValue({
      glh: myUtil.text.leadingZeroize(inputValue, 8),
    });
  },
  // 出口商品代码
  ckspDm: (param: any) => {
    const {form} = param;
    // 通用的商品码回显逻辑
    const ckspDm = form?.getFieldValue('ckspDm');
    if (ckspDm) {
      handleCkspxxEvent(form);
    }
  },
}

// 表单事件：OnFocus
Func.eventOnFocus = {}

// 表单事件：OnChange
Func.eventOnChange = {
  // 关联号
  glh: (param: any) => {
    param.slgx = true;
    queryMtsTssbByGlh(param);
  },
  cktmspzlxDm01: (param: any) => {
    const {form} = param;
    const cktmspzlxDm = form?.getFieldValue('cktmspzlxDm');
    const lableSpan1: any = document.querySelector("#mdt_zxsb_sb_mdt_tsjh_gcb_form .dditem_label_ghfnsrsbh1 span");
    if (cktmspzlxDm == '02' || cktmspzlxDm == '06' || cktmspzlxDm == '07') {
      lableSpan1?.classList.add('required');
    } else {
      lableSpan1?.classList.remove('required');
    }
  },
  // 税种
  sz: async (param: any) => {
    const {form, myItems, setMyItems, flag} = param;
    const sz = form?.getFieldValue('sz');
    const cktmspzlxDm = form?.getFieldValue('cktmspzlxDm');
    const lableSpan3: any = document.querySelector("#mdt_zxsb_sb_mdt_tsjh_gcb_form .dditem_label_ghfnsrsbh1 span");
    // 影响凭证类型选择项
    if (sz) {
      param.slgx = true; // 税率更新
      if (flag != 'edit') {
        queryMtsTssbByGlh(param);
      }
    }
    if (cktmspzlxDm == '02' || cktmspzlxDm == '06' || cktmspzlxDm == '07') {
      lableSpan3?.classList.add('required');
    } else {
      lableSpan3?.classList.remove('required');
    }
    setMyItems([...myItems]);
  },
  // 进货凭证号
  jhpzh: (param: any) => {
    queryFpxxByMtsTsjhJhpzh(param);
  },
  // 开票日期
  kprq: (param: any) => {
    param.slgx = true;
    queryMtsTssbByGlh(param);
  },
  // 计税金额
  jsje: (param: any) => {
    queryMtsTssbByGlh(param);
  }
}

/**
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
  const param = {ckspDm, ssq, ckrq1};
  getCmCode(param).then((response) => {
    const {code, body, desc, msg} = response;
    if (code === '200') {
      if (body) {
        setCkspxx(form, {
          ckspDm: body.ckspDm,
          sbhgspmc: body.ckspmc,
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

// 设置商品信息
const setCkspxx = (form: any, obj: any, eleName?: any) => {
  form.setFieldsValue({
    ckspDm: obj.ckspDm || '',
    sbhgspmc: obj.sbhgspmc || '',
    hgjldwmc: obj.hgjldwmc || '',
  });
}

// 设置商品信息
const queryMdtGlhBySsqFunc = (param: any, param02: any, flag?: any) => {
  const {form, refUnit, myFormItems, myItems, setMyFormItems, setMyItems} = param;
  queryMdtGlhBySsq({
    ssq: param02.ssq
  }).then((response) => {
    const {code, body} = response;
    refUnit?.current?.setMasker(false);
    if (code === '200') {
      form.setFieldsValue(body);
      let dataarr = [];
      for (let i = 0; i < body.length; i++) {
        const obj = {
          value: body[i],
          name: body[i]
        };
        dataarr.push(obj);
      }
      if (myItems && myItems.length > 0 || myFormItems && myFormItems.length > 0) {
        if (flag == 'blur') {
          myItems[4].list = dataarr;
          myItems[4].showType = '2';
          setMyItems([...myItems])
        } else {
          myFormItems[4].list = dataarr;
          myFormItems[4].showType = '2';
          if (flag === 'add') {
            const lableSpan1: any = document.querySelector("#mdt_zxsb_sb_mdt_tsjh_gcb_form .dditem_label_ghfnsrsbh1 span");
            lableSpan1?.classList.add('required');
          }
          setMyFormItems([...myFormItems])
        }
      }
    }
  });
}

/**
 * @method queryFpxxByMtsTsjhJhpzhm
 * @desc 计算：给根据进货明细进货凭证号查询发票信息
 * @param param
 */
const queryFpxxByMtsTsjhJhpzh = (param: any) => {
  const {form} = param;
  if (!form) {
    return;
  }
  // 进货凭证号/已使用过设备凭证号
  let jhpzh;
  jhpzh = form.getFieldValue('jhpzh');
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
  if (jhpzh.length === 18 || jhpzh.length === 20) {
    queryFpWzxx({fpDm, fphm}).then((response) => {
      const {code, body} = response;
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
        // if (body.jsje) {
        //   form.setFieldsValue({
        //     jsje: body.jsje || '',  // 计税金额
        //   });
        // }
        if (kprq) {
          form.setFieldsValue({
            kprq: kprq ? moment(new Date(kprq)) : '',
          });
          // 进货明细表需带出税率
          // 根据关联号、税种、开票日期，带出出口信息
          // param.slgx = true; // 税率更新
          queryMtsTssbByGlh({
            form,
            slgx: true, // 税率更新
          });
        }
      }
    })
  }
};

/**
 * 根据关联号获取出口信息
 */
const queryMtsTssbByGlh = (param: any) => {
  const form = param.form;
  const glh = form.getFieldValue('glh');
  const sz = form.getFieldValue('sz');
  const ssq = form.getFieldValue('ssq');
  if (glh) {
    const ywLy = glh.substring(0, 2);
    const lableSpan1: any = document.querySelector("#mdt_zxsb_sb_mdt_tsjh_gcb_form .dditem_label_hgjldwmc span");
    const lableSpan2: any = document.querySelector("#mdt_zxsb_sb_mdt_tsjh_gcb_form .dditem_label_sl span");
    if (ywLy == 'YS' || ywLy == 'FW') {
      lableSpan1?.classList.remove('required');
      lableSpan2?.classList.remove('required');
    } else {
      lableSpan1?.classList.add('required');
      lableSpan2?.classList.add('required');
    }
    let params = {
      ssq: ssq, // 所属期
      sbxh: glh,
      sz: sz,
      kprq: form.getFieldValue('kprq'),
    };
    queryMdtCkxxByGlh(params).then((response) => {
      const {code, body} = response;
      if (code === '200' && body) {
        let ckxx = body;
        // 根据查出的结果带出出口信息
        // 商品代码
        const ckspDm = ckxx.ckspDm;
        if (ckspDm) {
          form.setFieldsValue({
            ckspDm,
          });
        }
        // 商品名称
        const sbhgspmc = ckxx.sbhgspmc;
        if (sbhgspmc) {
          form.setFieldsValue({
            sbhgspmc,
          });
        }
        // 计量单位
        const hgjldwmc = ckxx.hgjldwmc;
        if (hgjldwmc) {
          form.setFieldsValue({
            hgjldwmc,
          });
        } else {
          form.setFieldsValue({
            hgjldwmc:'',
          });
        }
        // 业务类型代码
        const cktmsywlxdmjh = ckxx.cktmsywlxdmjh;
        if (cktmsywlxdmjh) {
          form.setFieldsValue({
            cktmsywlxdmjh,
          });
        }
        // 业务类型名称
        const cktmsywlxmcjh = ckxx.cktmsywlxmcjh;
        if (cktmsywlxmcjh) {
          form.setFieldsValue({
            cktmsywlxmcjh,
          });
        }
        // 赋值formId
        ckxx.form = form;
      }
    });
  }
};

// 配置项：自定义工具栏 生成进货明细
Func.jhmx = (param: any) => {
  DditCktsFormCommonFunc.jhmx(param);
}

Func.check = (selectionRows: any, refUnit: any, otherRef: any) => {
  const ckrqNd = myUtil.grid.formatDate(selectionRows[0].ckrq1, 'YYYY-MM-DD').substr(0, 4);
  let i = 0;
  let flag = false;
  selectionRows.forEach((item: any) => {
    if (!myUtil.grid.formatDate(item.ckrq1, 'YYYY-MM-DD').startsWith(ckrqNd)) {
      i++;
    }
    if (item.byblbz != 'Y') {
      flag = true;
    }
  });
  if (i > 0) {
    // 校验对应报关单的出口日期是否在同一年度
    message.error("选择数据对应的出口日期不在同一年度，请重新选择。");
    return;
  } else if (flag) {
    // 校验不为不予办理
    message.error("仅对不予办理的数据支持该操作，请重新选择。");
    return;
  } else {
    queryCjCsh({tableKey: "MTS_ZXSB_SB_MTS_TSSB_G"}).then((response) => {
      const {code, body} = response;
      refUnit.current!.setMasker(false);
      if (code === '200') {
        const obj = {
          sbpc: body.sbpc,
          ssq: body.ssq,
        }
        queryCjGlh(obj).then((res: any) => {
          if (res.code === '200') {
            const para = body;
            para.glh = res.body.glh
            otherRef[2].current!.showModal(para, selectionRows, "MDT", refUnit);
          }
        })
      }
    })
  }
}

export default Func;
