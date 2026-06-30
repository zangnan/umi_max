/**
 * title: 生产企业出口货物劳务免抵退税申报明细表
 * author: wx
 */
import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { queryJhfpl, queryBgdByBgdNo21, queryHlxx, querySpdmXxCj, queryDlzmByDlckhwzmhm, checkYwlxSpdm, importTemplate, bgdtzsx, mdtImportUpdate } from '@/pages/hts/services/htsApi';
import {Button, Form, message, Tooltip, Upload} from 'antd';
import myUtil from '@/components/DDAssist/util';
import moment from 'moment';
import DDAlert from '@/pages/hts/components/DDAlert';
import importStyle from './importStyle.less';
import {ClockCircleOutlined, InboxOutlined} from "@ant-design/icons";
import tableStyle from './style.less';
import {history} from "@@/core/history";
const { Dragger } = Upload;

const Func: any = {
  unitRef: React.createRef(),
};

Func.tszbcs =(param: any) =>{
  const {otherRef} = param;
  otherRef[2].current?.showModal(param);
}
// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
  const {formItems, setFormItems} = param;
  const lableSpan1: any = document.querySelector("#mdt_zxsb_sb_mdt_tssb_gcb_form .dditem_label_hzcjyyDm span");
  if (lableSpan1) {
    lableSpan1.classList.remove('required');
    const tmpMyItems: any = [];
    formItems.map((item: any) => {
      if (item.name === 'hzcjyyDm') {
        item.disabled = true;
      }
      tmpMyItems.push(item);
    });
    setFormItems([...tmpMyItems]);
  }
}
// 编辑表单初始化
Func.initEditForm = (param: any) => {
  const { form, formItems, setFormItems, handleModalVisible, unitKey } = param;
  const params: any = {
    form: form,
    myItems: formItems,
    setMyItems: setFormItems,
  }
  DDAlert.open({
    title: '系统提示',
    info: '注意：如果修改【所属期】相同关联号对应的出口明细和进货明细将会一并修改！',
    infoType: 'question',
    modalType: 'confirm',
    okCallbackFn: function () {
      DDAlert.close();
      handleModalVisible(true);
      const cjhbzmDm = form?.getFieldValue('cjhbzmDm'); // 原币币别代码
      params.unitKey = unitKey;
      params.value = cjhbzmDm;
      params.item = { name: 'cjhbzmDm' };
      Func.eventOnBlur.hbhlDm(params);
      // 根据业务类型重新加载样式
      const otherParam = {
        unitKey : unitKey
      }
      params.otherParam = otherParam;
      Func.eventOnChange.cktmsywlxDm02(params);
    },
  });
};
// 表单提交前调用
Func.formBeforeSubmit = async (param: any) => {
  const { form } = param;
  const ckbgdh = form?.getFieldValue('ckbgdh'); // 出口报关单号
  const dlckhwzmhm = form?.getFieldValue('dlckhwzmhm'); // 代理证明号
  const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh'); // 业务类型
  // 添加业务类型选择GHQYTS时，报关单号与代理证明号都不能为空。add by shil 20201030
  if (cktmsywlxdmjh.indexOf('GHQYTS') == -1) {
    // 1.出口报关单号和代理证明号不能同时为空
    if (!ckbgdh && !dlckhwzmhm) {
      message.info('出口货物报关单号与代理出口货物证明号不能同时为空，请确认后填报！');
      return false;
    } else if (ckbgdh && dlckhwzmhm) {
      message.info('报关单号和代理证明号不需要同时采集，请确认！');
      return false;
    }
  } else if (cktmsywlxdmjh && cktmsywlxdmjh.indexOf('GHQYTS') != -1) {
    if (!ckbgdh || !dlckhwzmhm) {
      message.info('业务类型为横琴、平潭购进货物时，报关单号和代理证明号不得为空，请确认！'); // 报关单号与代理证明号都不能为空。
      return false;
    }
  }
  // 检查商品码和业务类型匹配，是否为结构物和列名原材料
  let checkFlag = true;
  const ckspDm = form?.getFieldValue('ckspDm');
  const ckrq1 = form?.getFieldValue('ckrq1'); // 出口日期
  if (ckspDm && cktmsywlxdmjh && cktmsywlxdmjh.length > 0) {
    await checkYwlxSpdm({
      ckspDm: ckspDm,
      ckrq1: moment(ckrq1).format('YYYY-MM-DD'),
      ywlx: form.getFieldValue('cktmsywlxdmjh').join(',')
    }).then((res) => {
      const { code, msg } = res;
        if (code != '200') {
          message.error(msg);
          checkFlag = false;
        }
    });
  }
  return checkFlag;
}

// 表单校验
Func.validator = {
  // 所属期
  ssq02: (form: any) => {
    return DditCktsFormCommonFunc.validator.ssq02(form);
  },
  // 申报序号
  sbxh02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbxh02(form);
  },
  // 出口合同号
  ckhth01: (form: any) => {
    const validator =  (_rule: any, value: any) => {
			// 业务代码
      const cktmsywlxdmjh =  form?.getFieldValue('cktmsywlxdmjh');
			if (!value && cktmsywlxdmjh && cktmsywlxdmjh.indexOf('XTHH') > -1) {
				// 业务类型为XTHH时出口合同号不能为空，请确认后填报！
        return Promise.reject(new Error('业务类型为XTHH时出口合同号不能为空，请确认后填报！'));
			}
      return Promise.resolve();
    };
    return { validator };
  },
  // 正负数判定，业务类型红字冲减时为负数，其余为正数，不能为0 校验处理
  ywlxHzcjSzjy01: (form: any) => {
    const validator =  (_rule: any, value: any) => {
      const cktmsywlxdmjh =  form?.getFieldValue('cktmsywlxdmjh');
				if (cktmsywlxdmjh) {
					// ywlxArr = cktmsywlxdmjh.split(',');
					if (cktmsywlxdmjh.indexOf('HZCJ') > -1 || cktmsywlxdmjh.indexOf('HZCJ-TY') > -1 || cktmsywlxdmjh.indexOf('XTHH-CJ') > -1) {
						// 需要是负数
            if (myUtil.text.getNumVal(value) >= 0) {
              return Promise.reject(new Error('业务类型包含“HZCJ”、“HZCJ-TY”、“XTHH-CJ”时，必须小于0！'));
            }
            return Promise.resolve();
					} else {
						// 需要是正数
            if (myUtil.text.getNumVal(value) <= 0) {
              return Promise.reject(new Error('业务类型不包含“HZCJ”、“HZCJ-TY”、“XTHH-CJ”时，必须大于0！'));
            }
            return Promise.resolve();
          }
				}
      return Promise.resolve();
    };
    return { validator };
  },
  // 公共税率取值范围 校验处理
  ggslqzfw01: (form: any) => {
    return DditCktsFormCommonFunc.validator.ggslqzfw01(form);
  },
  // 国内启运方式
  gnqyfsDm01: (form: any) => {
    return DditCktsFormCommonFunc.validator.gnqyfsDm01(form);
  },
  // 海关总署认证企业类型
  hgzsrzqylxDm01: (form: any) => {
    return DditCktsFormCommonFunc.validator.hgzsrzqylxDm01(form);
  },
  // 备注
  bz01: (form: any) => {
    const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
    // 请求后端验证所属期是否已申报
    const validator =  (_rule: any, value: any) => {
			if (cktmsywlxdmjh && cktmsywlxdmjh.length > 0) {
				// 当业务代码为 JGW 或HXWH 或 HCWH 时 备注字段 应为 必录项
				if (!value) {
					if (cktmsywlxdmjh.indexOf('JGW') > -1) {
            return Promise.reject(new Error('业务类型代码包含“JGW”时，备注不能为空！'));
					}
					if (cktmsywlxdmjh.indexOf('HXWH') > -1) {
            return Promise.reject(new Error('业务类型代码包含“HXWH”时，备注不能为空！'));
					}
					if (cktmsywlxdmjh.indexOf('HCWH') > -1) {
            return Promise.reject(new Error('业务类型代码包含“HCWH”时，备注不能为空！'));
					}
				}
			}
      return Promise.resolve();
    };
    return { validator };
  },
  // 进货凭证号码
  hzcjyyDm: (form: any) => {
    return DditCktsFormCommonFunc.validator.hzcjyyDm01(form);
  }
}
// 表单事件：OnBlur
Func.eventOnBlur = {
  // 申报序号
  sbxh: (param: any) => {
    // 申报序号自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbxh(param);
  },
  // 进料加工手（账）册号
  jljgszch: (param: any) => {
    const { form } = param;
    // 根据手账册号带出数据
    const jljgszch = form?.getFieldValue('jljgszch');
    if (jljgszch) {
      form.setFieldsValue({
        jljgszch: jljgszch.toUpperCase(),
      });
      const ckrq1 = form?.getFieldValue('ckrq1');
      if (!ckrq1) {
        return;
      }
      queryJhfpl({
        jljgszch: jljgszch,
        ckrq: ckrq1
      }).then((res) => {
        const { code, body, msg } = res;
        if (code === '200') {
          if (res.body) {
            form.setFieldsValue({
              tzhjhfpl: res.body
            });
          } else {
            form.setFieldsValue({
              tzhjhfpl: 0,
              jljgbsjkljzcjsjg: 0
            });
          }
        } else {
          form.setFieldsValue({
            tzhjhfpl: 0,
            jljgbsjkljzcjsjg: 0
          });
          message.info(msg);
        }
        DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'tsxxjs');
      });
    }
  },
  // 原币离岸价
  cjzj: (param: any) => {
    DditCktsFormCommonFunc.eventOnBlur.cjzj(param);
    DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'ckxxjs-rmb');
    DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'ckxxjs-my');
    DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'tsxxjs');
  },
  // 原币汇率
  cjhbhl: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'ckxxjs-rmb');
    DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'ckxxjs-my');
    DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'tsxxjs');
  },
  // 人民币离岸价
  rmblaj: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'ckxxjs-my');
    DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'tsxxjs');
  },
  // 美元汇率
  myhl: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'ckxxjs-my');
    DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'tsxxjs');
  },
  // 征税率
  zssl: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'tsxxjs');
  },
  // 退税率
  tsl: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'tsxxjs');
  },
  // 进料加工保税进口料件组成计税价格
  jljgbsjkljzcjsjg: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'tsxxjs');
  },
  // 国内购进免税原材料价格
  gngjmsycljg: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'tsxxjs');
  },
  // 出口商品代码
  ckspDm: (param: any) => {
    const { form } = param;
    let ckspDm = form?.getFieldValue('ckspDm');
    let ssq = form?.getFieldValue('ssq');
    let ckrq1 = form?.getFieldValue('ckrq1');
    let dlckhwzmhm = form?.getFieldValue('dlckhwzmhm');
		// 如果商品代码为空则直接清空商品名称和计量单位
		if (!ckspDm) {
			setCkspxx(form, {});
			return;
		}
    querySpdmXxCj({
      ssq: ssq,
      slType: 'Y',
      ckrq1: ckrq1 ? moment(new Date(ckrq1)).format('YYYY-MM-DD') : '',
      ckspDm: ckspDm,
      ckbgdh: form.getFieldValue('ckbgdh'),
      dlckhwzmhm: dlckhwzmhm,
      ywlx: form.getFieldValue('cktmsywlxdmjh').join(',')
    }).then((res: any) => {
      const { body } = res;
      if (res.code == '200') {
				// 通用回显值
				setCkspxx(form, { ckspDm: body.ckspDm, sbhgspmc: body.sbspmc, sbspDm: body.sbspDm, sbspmc: body.sbspmc, hgjldwmc: body.hgjldwmc, tsl: body.tsl, zssl: body.zssl, cldezs: body.cldezs, cjdlzs: body.cjdlzs });
        DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'tsxxjs');
      } else {
        // setCkspxx(form, {});
        message.error(res.msg || res.desc);
      }
    })
  },
  // 原币币别代码
  hbhlDm: (param: any) => {
    DditCktsFormCommonFunc.eventOnBlur.hbhlDm(param);
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
  // 进料加工手（账）册号
  jljgszch: (param: any) => {
    const { form } = param;
    const ckrq1 = form?.getFieldValue('ckrq1');
    if (!ckrq1) {
      message.info('出口日期不能为空，请确认！');
    }
  },
  // 出口商品代码
  ckspDm: (param: any) => {
    const { form } = param;
    const ckrq1 = form?.getFieldValue('ckrq1');
    if (!ckrq1) {
      message.info('出口日期不能为空，请确认！');
    }
  },
  // 清算币种
  hbhlDm: (param: any) => {
    const { form } = param;
    // 根据收汇日期改变码表内容
    const url = '/yw/bszx/ggfw/sbcs/ywcsxx/queryHlxx';
    let ckrq1 = form?.getFieldValue('ckrq1');
    DditCktsFormCommonFunc.util.loadCodeDmHbhlAutoComplete({
      form,
      url,
      key: 'url_gy_hbhl',
      codeViewKey: '01',
      ckrq: ckrq1 ? moment(form?.getFieldValue('ckrq1')).format('YYYY-MM-DD') : ''
    })
  },
}
// 表单事件：OnChange
Func.eventOnChange = {
  // 出口报关单号
  ckbgdh: (param: any) => {
    // 该报关单号当期出口明细中不存在
    const { form } = param;
    const ckbgdh = form?.getFieldsValue().ckbgdh
    if(ckbgdh){
      // 走后台接口
      queryBgdByBgdNo21({ckbgdh}).then((res: any) => {
        const {body, code, msg} = res;
        const ssq = form?.getFieldsValue().ssq;
        if(code === '200'){
          if(body){
            let data = body;
            // ckrq_1 出口日期
            let ckrq1 = data.ckrq1;
            // cksp_dm	出口商品代码
            let ckspDm = data.ckspDm;
            // 出口数量/法定数量
            let cksl = myUtil.text.getNumVal(data.cksl);
            // mylaj	美元离岸价
            let mylaj = myUtil.text.getNumVal(data.mylaj);
            // cjhghbsz_dm 成交海关货币数字代码
            let cjhghbzmDm = data.cjhghbszDm;
            // yblaj	原币离岸价
            let yblaj = myUtil.text.getNumVal(data.yblaj);
            // rmblaj	美元离岸价
            let rmblaj = myUtil.text.getNumVal(data.rmblaj);
            if (ckrq1) {
              form.setFieldsValue({ ckrq1: moment(new Date(body.ckrq1)) });
              // 根据收汇日期改变码表内容
              const url = '/yw/bszx/ggfw/sbcs/ywcsxx/queryHlxx';
              DditCktsFormCommonFunc.util.loadCodeDmHbhlAutoComplete({
                form,
                url,
                key: 'url_gy_hbhl',
                codeViewKey: '01',
                ckrq: ckrq1
              })
            }
            if (cksl) {
              form.setFieldsValue({ cksl:  myUtil.text.getNumVal(cksl) });
            }
            if (yblaj) {
              form.setFieldsValue({ cjzj:  myUtil.text.getNumVal(yblaj) });
            }
            if (mylaj) {
              form.setFieldsValue({ mylaj: myUtil.text.getNumVal(mylaj) });
            }
            if (rmblaj) {
              form.setFieldsValue({ rmblaj: myUtil.text.getNumVal(rmblaj) });
              // form.setFieldsValue({ rmblaj: rmblaj });
            }
            // update by wangrp 20210113 根据报关单号带出出口发票号，长度超30时，截取前30
            let ckhth = data.ckhth;
            if (ckhth) {
              if (ckhth.length > 30) {
                ckhth = ckhth.substring(0, 30);
              }
              form.setFieldsValue({ ckfph: ckhth });
            }
            // 原币币别
            if (cjhghbzmDm) {
              form.setFieldsValue({ cjhbzmDm: cjhghbzmDm });
              const option = myUtil.code.getCode('url_gy_hbhl:01');
              let newVal: any = '';
              const tempRows = option.filter((row: any) => {
                return (row.hbzmDm === cjhghbzmDm);
              })
              newVal = tempRows[0].hbmc;
              if (newVal) {
                form.setFieldsValue({ biname: newVal });
              }
              // 带出汇率信息
              getCodeDmGyHbhl01({
                hbzmDm: cjhghbzmDm,
                ckrq1: ckrq1
              }, form);
            }
            if (ckspDm) {
              // 出口商品码
              form.setFieldsValue({ ckspDm: (data.tzhckspDm != null && data.tzhckspDm?.trim() != '') ? data.tzhckspDm : ckspDm });
              // 申报商品码 修正bug
              // myUtil.setFormItemVal(formId, 'sbspDm', ckspDm);
              // 更新商品信息
              querySpdmXxCjFun({
                ckrq1: ckrq1,
                ckspDm: form?.getFieldsValue().ckspDm,
                ckbgdh: ckbgdh,
                dlckhwzmhm: form?.getFieldsValue().dlckhwzmhm,
                ywlx: form?.getFieldsValue().cktmsywlxdmjh,
                slType: "Y",
                ssq: ssq
              }, form);
            }
          } else {
          }
        } else {
          message.info(msg)
        }
      })
    }
  },
  // 代理出口货物证明号
  dlckhwzmhm: (param: any) => {
    const { form } = param;
    const ckbgdh = form?.getFieldsValue().ckbgdh
    const dlckhwzmhm = form?.getFieldsValue().dlckhwzmhm
    /*
     * 根据代理证明编号带出关键项数据 (出口日期、
     * 出口商品代码、出口商品名称、第一计量单位代码（法定单位）、
     * 成交数量、成交海关货币数字代码、成交总价、人民币离岸价、美元离岸价);
     */
			if ((ckbgdh == null || ckbgdh == undefined || ckbgdh == '') && dlckhwzmhm) { // 报关单为空时
        const ssq = form?.getFieldsValue().ssq;
        queryDlzmByDlckhwzmhm({dlckhwzmhm}).then(async (res: any) => {
          const { body, code, msg } = res;
          if(code === '200') {
            if(body){
							let ckrq1 = body.ckrq1; // ckrq_1 出口日期
							let ckspDm = body.ckspDm; // cksp_dm	出口商品代码
							let cjsl = body.cjsl; // cjsl	成交数量
							let mylaj = body.mylaj; // mylaj	美元离岸价
							let cjhghbzmDm = body.cjhghbszDm; // cjhghbsz_dm 成交海关货币数字代码
							let yblaj = body.yblaj; // yblaj	原币离岸价
							let rmblaj = body.rmblaj; // rmblaj	美元离岸价
              if (ckrq1) {
                form.setFieldsValue({ ckrq1: ckrq1 ? moment(new Date(ckrq1)) : '' });
                // 根据收汇日期改变码表内容
                const url = '/yw/bszx/ggfw/sbcs/ywcsxx/queryHlxx';
                DditCktsFormCommonFunc.util.loadCodeDmHbhlAutoComplete({
                  form,
                  url,
                  key: 'url_gy_hbhl',
                  codeViewKey: '01',
                  ckrq: ckrq1
                })
              }
              if (cjsl) {
                form.setFieldsValue({ cksl:  myUtil.text.getNumVal(cjsl) });
              }
              if (yblaj) {
                form.setFieldsValue({ cjzj:  myUtil.text.getNumVal(yblaj) });
              }
              if (mylaj) {
                form.setFieldsValue({ mylaj: myUtil.text.getNumVal(mylaj) });
              }
              if (rmblaj) {
                form.setFieldsValue({ rmblaj: myUtil.text.getNumVal(rmblaj) });
                // form.setFieldsValue({ rmblaj: rmblaj });
              }

              // 原币币别
              if (cjhghbzmDm) {
                const option = await myUtil.code.getCodeFromServerT1('code_dm_gy_hb:01');
                option.forEach((row: any) => {
                  if (row.hbszdm == cjhghbzmDm) {
                    form.setFieldsValue({ cjhbzmDm: row.code });
                    cjhghbzmDm = row.code;
                  }
                })
                let biname = myUtil.code.getCodeValByKey(cjhghbzmDm, 'code_dm_gy_hb:01');
                if (biname) {
                  form.setFieldsValue({ biname: biname });
                }
                // 带出汇率信息
                getCodeDmGyHbhl01({
                  hbzmDm: cjhghbzmDm,
                  ckrq1: ckrq1
                }, form);
              }

              if (ckspDm) {
                // 出口商品码
                form.setFieldsValue({ ckspDm: ckspDm });
                // 申报商品码 修正bug
                // myUtil.setFormItemVal(formId, 'sbspDm', ckspDm);
                // 更新商品信息
                querySpdmXxCjFun({
                  ckrq1: ckrq1,
                  ckspDm: ckspDm,
                  ckbgdh: ckbgdh,
                  dlckhwzmhm: dlckhwzmhm,
                  ywlx: form?.getFieldsValue().cktmsywlxdmjh,
                  slType: "Y",
                  ssq: ssq
                }, form);
              }
            }
          } else {
            message.info(msg)
          }
        })
			}
  },
  // 出口日期
  ckrq1: (param: any) => {
    const { form } = param;
    // 根据收汇日期改变码表内容
    const url = '/yw/bszx/ggfw/sbcs/ywcsxx/queryHlxx';
    let ckrq1 = form?.getFieldValue('ckrq1');
    DditCktsFormCommonFunc.util.loadCodeDmHbhlAutoComplete({
      form,
      url,
      key: 'url_gy_hbhl',
      codeViewKey: '01',
      ckrq: ckrq1 ? moment(form?.getFieldValue('ckrq1')).format('YYYY-MM-DD') : ''
    })

    // 申报商品代码
    let ckspDm = form?.getFieldValue('ckspDm');
    let sbspDm = form?.getFieldValue('sbspDm');
    if (sbspDm) {
      ckspDm = sbspDm;
    }
    let ckbgdh = form?.getFieldValue('ckbgdh');
    let ssq = form?.getFieldValue('ssq');
    ckrq1 = form?.getFieldValue('ckrq1');
    if (!ssq) {
      return;
    }
    if (!ckspDm) {
      return;
    }
    // 增加对出口日期格式的校验 add by tjx
    if (!ckrq1) {
      message.info('出口日期不能为空，请确认！');
      form.setFieldsValue({
        ckspDm: '',
        sbhgspmc: '',
        hgjldwmc: ''
      });
      return;
    }
    querySpdmXxCj({
      ckspDm: ckspDm,
      ssq: ssq,
      ckrq1: ckrq1,
      slType: 'Y',
      ckbgdh: ckbgdh
    }).then((res: any) => {
      const { body, desc, msg } = res;
      if (res.code == '200') {
        if (sbspDm) {
          // 设置退税率
          form.setFieldsValue({ tsl: body?.tsl ? myUtil.text.getNumVal(body?.tsl): '' });
        } else {
          // 设置退税率
          form.setFieldsValue({
            sbhgspmc: body?.sbspmc,
            hgjldwmc: body?.hgjldwmc,
            zssl: body?.zssl ? myUtil.text.getNumVal(body?.zssl) : '',
            tsl: body?.tsl ? myUtil.text.getNumVal(body?.tsl) : '',
          });
        }
      } else {
        if (sbspDm) {
          message.error('申报商品代码无效，请确认后填报！');
          form.setFieldsValue({
            sbspDm: '',
            sbspmc: '',
          });
        } else {
          // modify by tjx 20200924
          if (desc != '') {
            if (msg) {
              message.error(msg);
            } else {
              message.error(desc);
            }
          } else {
            message.error('此商品码不存在，请确认后填报！');
          }
          form.setFieldsValue({
            ckspDm: '',
            sbhgspmc: '',
          });
        }
      }
    })
    // 出口日期的值有变化的时候，重新计算计划分配率
    let jljgszch = form?.getFieldValue('jljgszch');
    if (jljgszch) {
      jljgszch = jljgszch.toUpperCase();
      form.setFieldsValue({ jljgszch: jljgszch });
      let ckrq = form?.getFieldValue('ckrq1');
      if (ckrq == '') {
        return;
      }
      queryJhfpl({
        jljgszch: jljgszch,
        ckrq: ckrq
      }).then((res) => {
        const { code, body, msg } = res;
        if (code === '200') {
          if (res.body) {
            form.setFieldsValue({
              tzhjhfpl: res.body
            });
          } else {
            form.setFieldsValue({
              tzhjhfpl: 0,
              jljgbsjkljzcjsjg: 0
            });
          }
        } else {
          form.setFieldsValue({
            tzhjhfpl: 0,
            jljgbsjkljzcjsjg: 0
          });
          message.info(msg);
        }
        DditCktsFormCommonFunc.util.setMdtTssbgtjs(param, 'tsxxjs');
      });
    }
  },
  // 业务类型代码（原tableSelect）
  cktmsywlxDm02: (param: any) => {
    DditCktsFormCommonFunc.eventOnChange.cktmsywlxdmjh(param);
  },
  // 申报商品代码
  sbspDm2: (param: any) => {
    DditCktsFormCommonFunc.eventOnChange.sbspDm2(param);
  },
  // 原币币别代码
  hbhlDm: (param: any) => {
    const {form, value} = param;
    if(!value) {
      form.setFieldsValue({biname: ''})
    }
  },
}

// 配置项：自定义工具栏 报关单生成明细
Func.bgdscmx = (param: any) => {
  DditCktsFormCommonFunc.bgdscmx(param);
}

// 配置项：自定义工具栏 货物冲减
Func.hwcj = (param: any) => {
  DditCktsFormCommonFunc.hwcj({...param, modelIndex: 1});
}

// 改变调整前的商品名称 代码 出口日期 计量单位
const querySpdmXxCjFun = (obj: {}, form: any) => {
  querySpdmXxCj(obj).then((res: any) => {
    const { body } = res;
    if (res.code == '200') {
      form.setFieldsValue({
        ckspDm: body?.ckspDm,
        sbhgspmc: body?.sbspmc,
        hgjldwmc: body?.hgjldwmc,
        zssl: body?.zssl ? myUtil.text.getNumVal(body?.zssl) : '',
        tsl: body?.tsl ? myUtil.text.getNumVal(body?.tsl) : '',
      });
    } else if(res.code == '900') {} else {
      message.error(res.desc)
    }
  })
}

/**
 * @author liwc
 * @method setVal
 * @desc 带出表单其他项（针对getCodeDmGyHbhl01反写）
 */
 const getCodeDmGyHbhl01 = (data: any, form: any) => {
  if (data && data.hbzmDm) {
    const params = {
      // searchModel: {
      //   hbzmDm: data.hbzmDm,
      //   ssq: data.ssq,
      //   ckrq: data.ckrq1,
      //   hlny: data.hlny
      // }
      searchModel: [
        { property: "hbzmDm", value: data.hbzmDm, op: "al" },
        { property: "ssq", value: data.ssq, op: "al" },
        { property: "ckrq", value: data.ckrq1, op: "al" },
        { property: "hlny", value: data.hlny, op: "al" },
      ],
    };
    let result;
    queryHlxx(params).then((res: any) => {
      const { body, code } = res;
      if (code == '200' && body) {
        if (body.rows && body.rows.length > 0) {
          result = body.rows[0];
          if (result.rmbhl) {
            form.setFieldsValue({ cjhbhl: myUtil.text.getNumVal(result.rmbhl)});
          } else {
            form.setFieldsValue({ cjhbhl: 0.00000 });
          }
          if (result.myhl) {
            form.setFieldsValue({ myhl: myUtil.text.getNumVal(result.myhl) });
          } else {
            form.setFieldsValue({ myhl: 0.00000 });
          }
        }
      } else if(code == '900') {
        message.info(res.msg)
      } else {
        message.error(res.desc)
      }
    })
    return result;
  } else {
    return null;
  }
}

// 设置商品信息
const setCkspxx = (form: any, obj: any, eleName?: any) => {
  form.setFieldsValue({
    ckspDm: obj.ckspDm || '',
    sbhgspmc: obj.sbhgspmc || '',
    hgjldwmc: obj.hgjldwmc || '',
    zssl: obj.zssl ? myUtil.text.getNumVal(myUtil.text.formatNum(obj.zssl, '0,0.00')) : '',
    tsl: obj.tsl ? myUtil.text.getNumVal(myUtil.text.formatNum(obj.tsl, '0,0.00')) : '',
  });
}

// 台账筛选
Func.importTzsx = async (param: any) => {
  const { unitRef } = param;
  const beforeUpload = (file: any) => {
    const isLt2M = file.size;
    if (isLt2M > 10485760) {
      message.info('上传文件不能超过10M。');
      return Upload.LIST_IGNORE;
    }
    if (!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('请上传Excel文件。');
      return Upload.LIST_IGNORE;
    }
    return false;
  }
  DDAlert.open({
    title: '台账筛选',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    button: [
      <Button key={'excelmbxz'} onClick={() => Func.downloadExcel('SJGL_CKBGD_TZSX_PRINT_REPORT')}>Excel模板下载</Button>,
    ],
    width: 720,
    content: <>
      <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="导入Excel文件" name="file" valuePropName="fileList" rules={[{ required: true, message: '请选择上传的文件' }]} getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
        <Dragger
          maxCount={1}
          showUploadList={true}
          beforeUpload={beforeUpload}
          itemRender={(originNode, file, currFileList, actions: { download: any, preview: any, remove: any }) => (
            <table className={importStyle.importTable}>
              <tr>
                <th>文件名</th>
                <th>文件大小</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
              <tr>
                <td width='45%' className={importStyle.textCenter}>
                  <Tooltip title={file.name}>
                    <div className={importStyle.textName}>{file.name}</div>
                  </Tooltip>
                </td>
                <td width="20%" className={importStyle.textCenter}>{myUtil.text.formatNum(file.size ? (file.size / 1024) : 0, '0,0')}KB</td>
                <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined />&nbsp;待上传</td>
                <td width="17%" className={importStyle.textCenter}><a onClick={() => actions.remove()}>删除</a></td>
              </tr>
            </table>
          )}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到此区域</p>
        </Dragger>

      </Form.Item>
      <div style={{ color: "#E51C23" }}>
        <p>导入说明：</p>
        <div style={{ marginLeft: '7px' }}>1. 请上传报关单台账Excel，文件中“报关单号”应为18位；</div>
        <div style={{ marginLeft: '7px' }}>2.  若多次上传，只保留最后一次上传的结果。</div>
      </div>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if (values.file[0].originFileObj) {
          thisObj.setState({ masker: true });
          const formData = new FormData();
          formData.append('file', values.file[0].originFileObj);
          formData.append('fileName', values.file[0].name);
          formData.append('cdDm', '25030101');
          bgdtzsx(formData).then((response: any) => {
            const { code, msg, body } = response;
            if (code === '200') {
              // 台账数据筛选 赋值
              unitRef.current?.addQueryModel("Y", 'tzsxbz');
              if (body?.sbzs != 0) {
                // 业务校验
                const sbyyList = body?.sbmx || [];
                const textAreaValues: any = []
                if (sbyyList.length > 0) {
                  sbyyList.forEach((item: any, index: any) => {
                    textAreaValues.push(
                      <tr>
                        <td width='10%' style={{ textAlign: 'center' }}>{index + 1}</td>
                        <td width='30%'>{item.bgdhgbh}</td>
                        <td width='60%'>
                          <Tooltip title={item.sbyy}>
                            <div className={tableStyle.errorTableText}>{item.sbyy}</div>
                          </Tooltip>
                        </td>
                      </tr>
                    )
                  })
                  DDAlert.open({
                    title: '台账筛选',
                    modalType: 'form',
                    width: 720,
                    closeStatus: false,
                    isFormContent: true,
                    content:
                      <>
                        <div style={{ marginTop: '10px' }}>本次导入台账中共{body?.drzs}张报关单，导入成功{body?.cgzs}张，导入失败{body?.sbzs}张。</div>
                        <table className={tableStyle.errorTable}>
                          <tr style={{ backgroundColor: '#FAFAFA' }}>
                            <th>序号</th>
                            <th>失败报关单号</th>
                            <th>失败原因</th>
                          </tr>
                          {textAreaValues}
                        </table>
                      </>,
                    okCallbackFn: function () {
                      DDAlert.close();
                    },
                  });
                }
              } else {
                message.success(`本次导入台账中共${body?.drzs}张报关单，导入成功${body?.cgzs}张！`);
                DDAlert.close();
              }
            } else {
              message.error(msg);
            }
          }).catch(() => {
            message.error('导入失败，请重新上传文件。');
          }).finally(() => {
            thisObj.setState({ masker: false });
          });
        } else {
          message.info('文件传输失败，请重试！')
        }
      });
    },
  });
}
// 下载excel模板
Func.downloadExcel = (param: string) => {
  importTemplate({ sfBhsj: "N", sfScsm: "N", key: param }).then((response) => {
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  })
}


// 导入修改
Func.importUpdate = async (param: any) => {
  const { unitRef, otherRef } = param;
  const beforeUpload = (file: any) => {
    const isLt2M = file.size;
    if (isLt2M > 10485760) {
      message.info('上传文件不能超过10M。');
      return Upload.LIST_IGNORE;
    }
    if (!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('请上传Excel文件。');
      return Upload.LIST_IGNORE;
    }
    return false;
  }
  DDAlert.open({
    title: '导入修改',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    button: [
      // <Button key={'excelmbxz'} onClick={() => Func.downloadExcel('LTS_TZGL_ZCWLFTZ_DR_TMLT')}>Excel模板下载</Button>,
    ],
    width: 720,
    content: <>
      <Form.Item labelCol={{span: 24}} wrapperCol={{span: 24}} label="导入Excel文件" name="file"
                 valuePropName="fileList" rules={[{required: true, message: '请选择上传的文件'}]}
                 getValueFromEvent={(e: any) => {
                   if (Array.isArray(e)) {
                     return e;
                   }
                   return e && e.fileList;
                 }}>
        <Dragger
          maxCount={1}
          showUploadList={true}
          beforeUpload={beforeUpload}
          itemRender={(originNode, file, currFileList, actions: { download: any, preview: any, remove: any }) => (
            <table className={importStyle.importTable}>
              <tr>
                <th>文件名</th>
                <th>文件大小</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
              <tr>
                <td width='45%' className={importStyle.textCenter}>
                  <Tooltip title={file.name}>
                    <div className={importStyle.textName}>{file.name}</div>
                  </Tooltip>
                </td>
                <td width="20%"
                    className={importStyle.textCenter}>{myUtil.text.formatNum(file.size ? (file.size / 1024) : 0, '0,0')}KB
                </td>
                <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined/>&nbsp;待上传</td>
                <td width="17%" className={importStyle.textCenter}><a onClick={() => actions.remove()}>删除</a></td>
              </tr>
            </table>
          )}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined/>
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到此区域</p>
        </Dragger>
      </Form.Item>
      <div style={{color: "#E51C23"}}>
        <p>导入说明：</p>
        <div style={{marginLeft: '7px'}}>1.不提供导入模板，可直接使用系统导出的模板。</div>
        <div style={{marginLeft: '7px'}}>2.根据相同出口报关单号/代理出口证明号只更新如下字段：</div>
        <div style={{marginLeft: '7px'}}> 所属期、原币汇率、美元汇率、出口发票号、出口日期、业务类型代码、进料加工手账册号、备注。</div>
        <div style={{marginLeft: '7px'}}>3.修改【所属期】时，相同关联号的出口明细和进货明细将会一并修改。</div>
      </div>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if (values.file[0].originFileObj) {
          const formData = new FormData();
          formData.append('file', values.file[0].originFileObj);
          formData.append('fileName', values.file[0].name);
          thisObj.setState({masker: true});
          mdtImportUpdate(formData).then((response: any) => {
            const { code, body, desc } = response;
            thisObj.setState({ masker: false });
            DDAlert.close();
            if (code === '200') {
              message.success(body);
              unitRef.current!.reload2();
            } else if (code === '900') {
              otherRef[3].current!.showModal(body, "MDT_TSSB_IMPORT_UPDATE_DRWTDC");
            } else {
              message.error(desc);
            }
          }).catch(() => {
            message.error('导入失败，请重新上传文件。');
          }).finally(() => {
            thisObj.setState({ masker: false });
          });
        } else {
          message.info('文件传输失败，请重试！')
        }
      });
    },
  });
}

// 配置项：自定义工具栏 海外仓冲击爱你
Func.hwccj = (param: any) => {
  const {unitRef} = param;
  const otherRef = unitRef.current?.getOtherRefs();
  otherRef[4].current!.showModal(param);
}

export default Func;
