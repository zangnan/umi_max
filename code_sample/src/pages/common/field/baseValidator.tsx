import moment from "moment";
import { intl as intl2 } from '@/pages/common/myUtil';
import myUtil from '@/pages/common/myUtil';
import { itemType } from '@/components/DDForm/data.d';
import { history } from 'umi';

const baseValidator: any = {};

// 必录
baseValidator.required = () => {
  return { required: true }
};
// email
baseValidator.email = () => {
  return { pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, message: intl2.formatMessage({ id: 'validator_email' }) }
};

// 范围 type = 'string' 或 type = 'number'
baseValidator.range = (param: any) => {
  const { min, max, type = 'string' } = param;
  return [{ type, max, message: `最大数值不能超过${max}` }, { type, min, message: `最小数值不能超过${min}` }]
};
// 长度
baseValidator.lenOr= (name:any,param: any,param1 :any) => {
  const validator = (_rule: any, values: any) => {
    let value :any = values;
    if(value && value?.length != param && value?.length != param1){
      return Promise.reject(new Error(`${name}长度必须为${param}个字符或${param1}个字符`));
    }
    return Promise.resolve();
  }
  return { validator };
};

baseValidator.sjapifwdm = (form: any) => {
  const validator = async (_rule: any, value: any) => {
    if(value.length > 1 ){
      return Promise.reject(new Error('最多或输入选择一项内容！'));
    } else {
      return Promise.resolve();
    }
  }
  return { validator };
},

// 范围 type = 'string'
baseValidator.range2 = (param: any) => {
  const { item } = param;
  const validator = (_rule: any, values: any) => {
    let value :any = values;
    if (item && (item.type === itemType.Select && item.mode === 'multiple')) {
      value = values.join(',');
    }
    const { min, max } = param;
    let len = 0;
    const length = value ? value.length : 0;
    for (let i = 0; i < length; i++) {
      if (value.charCodeAt(i) > 127 || value.charCodeAt(i) == 94) { // 中文字符占3位
        const pathname = history?.location?.pathname;
        if(item?.name === 'ggxh') {
          len += 2;
        } else {
          len += 3;
        }
      } else {
        len++;
      }
    }
    let message1 = myUtil.text.formatRepalce(intl2.formatMessage({ id: 'validator_v_max' }), { len: max });
    let message2 = myUtil.text.formatRepalce(intl2.formatMessage({ id: 'validator_v_min' }), { len: min });
    if (len > max) {
      return Promise.reject(new Error(message1));
    }
    if (len < min) {
      return Promise.reject(new Error(message2));
    }
    return Promise.resolve();
  }
  return { validator };
};

// 长度
baseValidator.len = (targetLen: any) => {
  return { len: targetLen }
};

// 长度2
baseValidator.len2 = (targetLen: any) => {
  const validator = (_rule: any, value: any) => {
    if (value) {
      let value2 = value ? (value.toString()) : '';
      let len = 0;
      const length = value2 ? (value2.toString()).length : 0;
      for (let i = 0; i < length; i++) {
        if (value2.charCodeAt(i) > 127 || value2.charCodeAt(i) == 94) { // 中文字符占3位
          len += 3;
        } else {
          len++;
        }
      }
      if (len != targetLen) {
        let message = myUtil.text.formatRepalce(intl2.formatMessage({ id: 'validator_v_eq' }), { len: targetLen });
        return Promise.reject(new Error(message));
      }
      return Promise.resolve();
    }
    return Promise.resolve();
  }
  return { validator };
};

// 长度3 中文占2个字符
baseValidator.len3 = (targetLen: any) => {
  const validator = (_rule: any, value: any) => {
    if (value) {
      let value2 = value ? (value.toString()) : '';
      let len = 0;
      const length = value2 ? (value2.toString()).length : 0;
      for (let i = 0; i < length; i++) {
        if (value2.charCodeAt(i) > 127 || value2.charCodeAt(i) == 94) { // 中文字符占3位
          len += 2;
        } else {
          len++;
        }
      }
      if (len != targetLen) {
        let message = myUtil.text.formatRepalce(intl2.formatMessage({ id: 'validator_v_eq' }), { len: targetLen });
        return Promise.reject(new Error(message));
      }
      return Promise.resolve();
    }
    return Promise.resolve();
  }
  return { validator };
};

// 类型 string/number/boolean/method/regexp/integer/float/array/object/enum/date/url/hex/email/any
baseValidator.type = (type: any) => {
  return { type }
};

// 数字
baseValidator.number = () => {
  return { pattern: /^\d+$/, message: intl2.formatMessage({ id: 'validator_number' }) }
};

// 空格
baseValidator.empty = () => {
  return { pattern: /^[^\s]*$/, message: intl2.formatMessage({ id: 'validator_empty' }) }
};
// 数字
baseValidator.numberFloat = () => {
  return { pattern: /^\d+(?=\.{0,1}\d+$|$)/, message: intl2.formatMessage({ id: 'validator_number' }) }
};
// 正整数
baseValidator.zzs = () => {
  return { pattern: /^[1-9]\d*$/, message: '只能输入正整数！' }
};
// 正整数或者0
// 英文
baseValidator.zzsOr0 = () => {
  return { pattern: /^[0-9]\d*$/, message: '只能输入0或正整数！' }
};
baseValidator.english = () => {
  return { pattern: /^[A-Za-z]+$/, message: intl2.formatMessage({ id: 'validator_english' }) }
};

// 汉字
baseValidator.chinese = () => {
  return { pattern: /^[\u0391-\uFFE5]+$/, message: intl2.formatMessage({ id: 'validator_chinese' }) }
};

// 数字和字母
baseValidator.english_number = () => {
  return { pattern: /^\w+$/, message: intl2.formatMessage({ id: 'validator_english_number' }) }
};

// 移动电话
baseValidator.phone = () => {
  return { pattern: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/, message: intl2.formatMessage({ id: 'validator_phone' }) }
};

// 手机号
baseValidator.phone2 = () => {
  return { pattern: /^1[34578]\d{9}$/, message: intl2.formatMessage({ id: 'validator_phone' }) }
};

// 身份证
baseValidator.idcard = () => {
  return { pattern: /(^[0-9]{15}$)|(^[0-9]{18}$)|(^[0-9]{17}([0-9]|X|x)$)/, message: intl2.formatMessage({ id: 'validator_idCard' }) }
};

// 禁止输入转义字符
baseValidator.ESC = () => {
  return { pattern: /^[^&]+$/, message: intl2.formatMessage({ id: 'validator_ESC' }) }
};

// yyyy
baseValidator.yyyy = () => {
  return { pattern: /^[1-9]\d{3}$/, message: intl2.formatMessage({ id: 'validator_d_yyyy' }) }
};

// MM
baseValidator.MM = () => {
  return { pattern: /^(0?[1-9]|1[0-2])$/, message: intl2.formatMessage({ id: 'validator_d_MM' }) }
};

// yyyyMM
baseValidator.yyyyMM = () => {
  return { pattern: /^[1-9]\d{3}(0[1-9]|1[0-2])$/, message: intl2.formatMessage({ id: 'validator_d_yyyyMM' }) }
};

// yyyy-MM-dd yyyyMMdd
baseValidator.yyyyMMdd = () => {
  const validator = (_rule: any, value2: any) => {
    let value = value2;
    if (value2 && value2._isAMomentObject) {
      value = moment(value2).format('YYYY-MM-DD');
    }
    if (!value) {
      return Promise.resolve();
    }
    const reg1 = /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229))$/;
    const reg2 = /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))$/;
    if (!new RegExp(reg1).test(value) && !new RegExp(reg2).test(value)) {
      return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_d_yyyyMMdd' })));
    }
    return Promise.resolve();
  }
  return { validator };
};

// 正负0校验 ['-','0', '+'] 6种排练组合
baseValidator.numRange = (arr: any) => {
  const validator = (_rule: any, value: any) => {
    // 正数和0校验
    if (arr.indexOf('+') !== -1 && arr.indexOf('0') !== -1 && arr.indexOf('-') === -1) {
      if (value < 0) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_num_pz' })));
      }
    }
    // 负数和0校验
    if (arr.indexOf('-') !== -1 && arr.indexOf('0') !== -1 && arr.indexOf('+') === -1) {
      if (value > 0) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_num_nz' })));
      }
    }
    // 负数和正数校验
    if (arr.indexOf('-') !== -1 && arr.indexOf('+') !== -1 && arr.indexOf('0') === -1) {
      if (value == 0) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_num_pn' })));
      }
    }
    // 单独是负数校验
    if (arr.indexOf('-') !== -1 && arr.indexOf('+') === -1 && arr.indexOf('0') === -1) {
      if (value > 0 || value === 0) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_num_n' })));
      }
    }
    // 单独是正数校验
    if (arr.indexOf('+') !== -1 && arr.indexOf('-') === -1 && arr.indexOf('0') === -1) {
      if (value < 0 || value === 0) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_num_p' })));
      }
    }
    // 单独是0校验
    if (arr.indexOf('0') !== -1 && arr.indexOf('-') === -1 && arr.indexOf('+') === -1) {
      if (value !== 0) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_num_z' })));
      }
    }

    return Promise.resolve();
  }
  return { validator };
};

export default baseValidator;

// import Schema from 'async-validator';

// string: Must be of type string. This is the default type.
// number: Must be of type number.
// boolean: Must be of type boolean.
// method: Must be of type function.
// regexp: Must be an instance of RegExp or a string that does not generate an exception when creating a new RegExp.
// integer: Must be of type number and an integer.
// float: Must be of type number and a floating point number.
// array: Must be an array as determined by Array.isArray.
// object: Must be of type object and not Array.isArray.
// enum: Value must exist in the enum.
// date: Value must be valid as determined by Date
// url: Must be of type url.
// hex: Must be of type hex.
// email: Must be of type email.
// any: Can be any type.

// {validator: (_rule: any, value: any) => {
//   const password = form2.getFieldValue('password')
//   if (password === value) {
//     return Promise.resolve();
//   }
//   return Promise.reject(new Error('请输入相同的密码！'));
// }}
