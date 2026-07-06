import cktsUtil from '@/pages/hts/cktsUtil';
import { intl as intl2 } from '@/components/DDAssist/util';
import myUtil from '@/components/DDAssist/util';

const businessValidator: any = {};

// 所属期必录、格式校验#
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

businessValidator.sbpc = (form: any) => {
  const validator = async (_rule: any, value: any) => {
    if (value === '' || value === undefined) {
      return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_required' })));// '请输入申报批次！'
    } else if (value && myUtil.text.getNumVal(value) <= 0) {
      return Promise.reject(new Error('该项只能录入正数'));
    } else if (!value.match(/^\d+$/)) {
      return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_number' })));// '该项内容只能输入数字！'
    } else if (value.length != 3) {
      let message = cktsUtil.text.formatRepalce(intl2.formatMessage({ id: 'validator_v_eq' }), { len: 3 });
      return Promise.reject(new Error(message));
    }
    return Promise.resolve();
  };
  return { validator };
};
export default businessValidator;