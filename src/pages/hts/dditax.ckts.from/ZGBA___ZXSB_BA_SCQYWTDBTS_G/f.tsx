/**
 * title: 代办退税备案
 * author: wxl
 */
import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { checkScqywtdbtsSqrqZfnsrsbh, queryScqywtdbtsLssj, checkScqywtdbtsSqrqZfqydm, checkScqywtdbtsSqrqZfqymc, queryCjCsh, checkScqywtdbtsSqrqYsb, checkScqywtdbtsSqrqDbtshth } from '@/pages/hts/services/htsApi';
import { message } from 'antd'
import moment from 'moment';

const Func: any = {
  unitRef: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  // DditCktsFormCommonFunc.initAddForm(param);
  const { form, handleModalVisible, unitKey, unitRef, doSuccess, setMasker } = param;
  let apiParam: any = {
    lcswsxDm: '',
    tableKey: unitKey,
    ywKey: "ZGBA_SCQYWTDBTS_BA",
  };
  // 表单初始化1 除关联号外的其他字段
  queryCjCsh(apiParam).then((response) => {
    const { code, body } = response;
    if (code === '200') {
      form.setFieldsValue({
        ssq: body.ssq,
        sbpc: body.sbpc,
        sbxh: body.sbxh,
        sbbh1: body.sbbh1,
        xh4: body.xh4,
        xh: body.xh,
        sqrq: body.sqrq ? moment(new Date(body.sqrq)) : null,
        tbrq1: body.tbrq1 ? moment(new Date(body.tbrq1)) : null,
      });
      if (doSuccess) {
        doSuccess(response);
      }
    }
    return;
  }).then((response2: any) => {
    if (response2) {
      const { code, body } = response2;
      if (code === '200') {
        form.setFieldsValue(body);  // 设置关联号
      }
    }
  }).finally(() => {
    if (setMasker) {
      setMasker(false);  // 按报关单生成明细：外贸、生产、证明开具
    } else {
      unitRef.current?.setMasker(false); // 通用页面
    }
    if (handleModalVisible) {
      handleModalVisible(true); // 通用页面
    }
  });
};

// 表单校验
Func.validator = {
  // 申请日期
  tbrq01: (form: any) => {
    const unitKey = form?.otherParam?.unit_key;
    const validator = async (_rule: any, value: any) => {
			// 该应税服务代码应为货物类商品代码！
      const obj = {
        tableKey: unitKey,
        tbrq1: moment(value).format('YYYY-MM-DD'),
        uuid: "",
        ywKey: "ZGBA_SCQYWTDBTS_BA",
      }
      await checkScqywtdbtsSqrqYsb(obj).then((response) => {
        if (response.code === '900') {
          return Promise.reject(new Error(response.msg));
        }
        return Promise.resolve();
      }).catch((err) => {
        return Promise.reject(err);
      });
      return Promise.resolve();
    };
    return { validator };
  },
  // 申报序号
  sbxh02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbxh02(form);
  },
  // 统一社会信用代码
  wmzhfwqynsrsbh01: (form: any) => {
    const validator = async (_rule: any, value: any) => {
      // 1. 委托企业名称重复采集
      const tbrq1 = form?.getFieldValue('tbrq1');
      const wmzhfwqynsrsbh = form?.getFieldsValue('wmzhfwqynsrsbh');
      const uuid = form?.getFieldsValue('uuid');
      if (tbrq1 && wmzhfwqynsrsbh) {
        const params = {
          tbrq1: moment(tbrq1).format('YYYY-MM-DD'),
          wmzhfwqynsrsbh: wmzhfwqynsrsbh,
          uuid: uuid,
          ywKey: 'ZGBA_SCQYWTDBTS_BA', // 撤回 ZGBA_SCQYWTDBTS_CH
        };
        checkScqywtdbtsSqrqZfnsrsbh(params).then((res: any)=>{
          const {code, msg} = res;
          if(code === '200') {
            return Promise.resolve();
          } else  {
            return Promise.reject(new Error(msg));
          }
        })
      }
    };
    return { validator };
  },
  // 海关企业代码
  wmzhfwqyhgqydm02: (form: any) => {
    const validator = async (_rule: any, value: any) => {
      if (value && value.length != 10 && value.length != 18) {
        return Promise.reject(new Error('综服企业海关代码长度为10位或18位，请确认后填报！'));
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 海关企业代码
  wmzhfwqyhgqydm01: (form: any) => {
    const validator = async (_rule: any, value: any) => {
      if(value && value.length == 10 || value &&  value.length == 18) {
        // 1. 委托企业代码重复采集
        const tbrq1 = form?.getFieldValue('tbrq1');
        const wmzhfwqyhgqydm = form?.getFieldValue('wmzhfwqyhgqydm');
        const uuid = form?.getFieldValue('uuid');

        if (tbrq1 && wmzhfwqyhgqydm) {
          const params = {
            tbrq1: moment(tbrq1).format('YYYY-MM-DD'),
            wmzhfwqyhgqydm: wmzhfwqyhgqydm,
            uuid: uuid,
            ywKey: 'ZGBA_SCQYWTDBTS_BA', // 撤回 ZGBA_SCQYWTDBTS_CH
          };
          checkScqywtdbtsSqrqZfqydm(params).then((res: any)=>{
            const {code, msg} = res;
            if(code === '200') {
              return Promise.resolve();
            } else  {
              return Promise.reject(new Error(msg));
            }
          })
        }
      }
    };
    return { validator };
  },
  wmzhfwqynsrmc01: (form: any) => {
    const validator = async (_rule: any, value: any) => {
      // 1. 委托企业名称重复采集
      const tbrq1 = form?.getFieldValue('tbrq1');
      const wmzhfwqynsrmc = form?.getFieldValue('wmzhfwqynsrmc');
      const uuid = form?.getFieldValue('uuid');
      if (tbrq1 && wmzhfwqynsrmc) {
        const params = {
          tbrq1: moment(tbrq1).format('YYYY-MM-DD'),
          wmzhfwqynsrmc: wmzhfwqynsrmc,
          uuid: uuid,
          ywKey: 'ZGBA_SCQYWTDBTS_BA', // 备案，变更 撤回 ZGBA_SCQYWTDBTS_CH
        };
        checkScqywtdbtsSqrqZfqymc(params).then((res: any)=>{
          const {code, msg} = res;
          if(code === '200') {
            return Promise.resolve();
          } else  {
            return Promise.reject(new Error(msg));
          }
        })
      }
    };
    return { validator };
  },
  // 外贸综合服务合同（协议）号码
  wmzhfwhtxyhm01: (form: any) => {
    const validator = async (_rule: any, value: any) => {
      // 1. 合同号重复采集
      const tbrq1 = form?.getFieldValue('tbrq1');
      const wmzhfwhtxyhm = form?.getFieldValue('wmzhfwhtxyhm');
      const uuid = form?.getFieldValue('uuid');
      if (tbrq1 && wmzhfwhtxyhm) {
        var params = {
          tbrq1: moment(tbrq1).format('YYYY-MM-DD'),
          wmzhfwhtxyhm: wmzhfwhtxyhm,
          uuid: uuid,
          ywKey: 'ZGBA_SCQYWTDBTS_BA', // 撤回ZGBA_SCQYWTDBTS_CH
        };
        checkScqywtdbtsSqrqDbtshth(params).then((res: any)=>{
          const {code, msg} = res;
          if(code === '200') {
            return Promise.resolve();
          } else  {
            return Promise.reject(new Error(msg));
          }
        })
      }
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
  // 统一社会信用代码
  wmzhfwqynsrsbh: (param: any) => {
    const {form} = param;
		// 生产企业委托代办退税情况备案
    const wmzhfwqynsrsbh = form?.getFieldValue('wmzhfwqynsrsbh');
    if (wmzhfwqynsrsbh) {
      const obj = { 
        wmzhfwqynsrsbh: wmzhfwqynsrsbh,
        ywKey: 'ZGBA_SCQYWTDBTS_BA'
      };
      queryScqywtdbtsLssj(obj).then((res: any)=> {
        if (res.code = '200' && res.msg) {
          message.info(res.msg)
          return;
        }
        if (!res.body) {
          return;
        }
        const data = res.body;
        data.dbtsbalcztDm = '2';// 撤回不写
        form.setFieldsValue(data);
      })
    }
		
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
}

export default Func;