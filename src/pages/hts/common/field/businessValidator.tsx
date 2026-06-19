import { intl as intl2 } from '@/components/DDAssist/util';
import { checkSsqPcYsb,checkMtsTssbGlh } from '@/pages/hts/services/htsApi';;
import myUtil from '@/components/DDAssist/util';

const businessValidator: any = {};

// 所属期必录、格式校验
businessValidator.ssq = () => {
  const validator = (_rule: any, value: any) => {
    if (value === '' || value === undefined) {
      return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_required' })));// '请输入所属期！'
    } else if (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)) {
      return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_d_yyyyMM' })));// '请输入正确的年月格式yyyyMM！'
    }
    return Promise.resolve();
  };
  return { validator };
};

// 所属期必录、格式校验
businessValidator.ssq02 = (form: any) => {
  const validator = async (_rule: any, value: any) => {
    const qylx = myUtil.sys.enterpriseType();
    if('WM' == qylx){
      const sbpc = form?.getFieldValue('sbpc');    // 表单其他项目
      if (value) {
        let params = {
          tableKey: 'MTS_ZXSB_SB_MTS_TSSB_G',
          ssq:value,
          sbpc:sbpc
        };
        await checkSsqPcYsb(params).then((response) => {
          const { code, msg } = response;
          if (code !== '200') {
            return Promise.reject(new Error(msg));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
      }
    }else{
      if (value) {
          let params = {
            tableKey: 'MDT_ZXSB_SB_MDT_TSSB_G',
            ssq:value,
          };
          await checkSsqPcYsb(params).then((response) => {
            const { code, msg } = response;
            if (code !== '200') {
              return Promise.reject(new Error(msg));
            }
            return Promise.resolve();
          }).catch((err) => {
            return Promise.reject(err);
          });
      }

    }
    return Promise.resolve();
  };
  return { validator };
};

businessValidator.ssq03 = () => {
  const validator = (_rule: any, value: any) => {
    if(value){
      if (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_d_yyyyMM' })));// '请输入正确的年月格式yyyyMM！'
      }
    }
    return Promise.resolve();
  };
  return { validator };
};


// 申报批次
businessValidator.sbpc = (form: any) => {
  const validator = async (_rule: any, value: any) => {
    const formId = form?.__INTERNAL__?.name;    // 表单id
    const ssq = form?.getFieldValue('ssq');    // 表单其他项目
    if (value === '' || value === undefined) {
      return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_required' })));// '请输入申报批次！'
    } else if (value && myUtil.text.getNumVal(value) <= 0) {
      return Promise.reject(new Error('该项只能录入正数'));
    } else if (!value.match(/^\d+$/)) {
      return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_number' })));// '该项内容只能输入数字！'
    } else if (value.length != 3) {
      let message = myUtil.text.formatRepalce(intl2.formatMessage({ id: 'validator_v_eq' }), { len: 3 });
      return Promise.reject(new Error(message));
    }

    if (value) {
      if (formId == 'bgdscmx_form') { // 报关单生成明细
        let params = {
          tableKey: 'MTS_ZXSB_SB_MTS_TSSB_G',
          ssq,
          sbpc: myUtil.text.leadingZeroize(value, 3),
        };
        await checkSsqPcYsb(params).then((response) => {
          const { code, msg } = response;
          if (code !== '200') {
            return Promise.reject(new Error(msg));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
      }
    }
    return Promise.resolve();
  };
  return { validator };
};

// 申报序号必录、格式校验
businessValidator.sbxh = () => {
  const validator = (_rule: any, value: any) => {
    if (value === '' || value === undefined) {
      return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_required' })));// '请输入序号'
    } else if (!value.match(/^\d+$/)) {
      return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_number' })));// '该项内容只能输入数字！'
    }
    return Promise.resolve();
  };
  return { validator };
};

// 业务类型校验
businessValidator.cktmsywlxdmjh = () => {
  const validator = (_rule: any, value: any) => {
    if (value != undefined && value != '') {
      if (value.length > 3) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_cktmsywlxdmjh_01' })));// '业务类型最多选择三项，请确认后填报！'
      }
    }
    return Promise.resolve();
  };
  return { validator };
};

// 关联号
businessValidator.glh = (form:any) => {
  const validator = async (_rule: any, value: any) => {
    var param =  {"glh":value,"ssq":form?.getFieldsValue()?.ssq,"sbpc":form?.getFieldsValue()?.sbpc}
    await checkMtsTssbGlh(param).then((response) => {
      const { code, msg } = response;
      if (code !== '200') {
        return Promise.reject(new Error(msg));
      }
      return Promise.resolve();
    }).catch((err) => {
      return Promise.reject(err);
    });
    return Promise.resolve();
  };
  return { validator };
};

export default businessValidator;