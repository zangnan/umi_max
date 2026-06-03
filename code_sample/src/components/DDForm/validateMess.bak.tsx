import { intl as intl2 } from  '@/pages/common/myUtil';

const validateMessages = {
  required: intl2.formatMessage({ id: 'validator_required' }),
  string: {
    len: "'${label}' 内容长度必须为 ${len} ",
    min: "'${label}'至少 ${min} 个字符",
    max: "'${label}' 不能超过 ${max} 个字符",
    range: "'${label}' must be between ${min} and ${max} characters",
  },
  number: {
    len: "'${name}' must equal ${len}",
    min: "'${name}' cannot be less than ${min}",
    max: "'${name}' cannot be greater than ${max}",
    range: "'${name}' must be between ${min} and ${max}",
  },
  types: {
    integer: intl2.formatMessage({ id: 'validator_int' }),
    float: intl2.formatMessage({ id: 'validator_float' }),
    email: intl2.formatMessage({ id: 'validator_email' }),
    url: intl2.formatMessage({ id: 'validator_url' }),
    number: intl2.formatMessage({ id: 'validator_n' }),
    string: "'${label}' 不是一个有效的 字符串",
    method: "'${label}' 不是一个有效的 ${type}",
    array: "'${label}' 不是一个有效的 ${type}",
    object: "'${label}' 不是一个有效的 ${type}",
    date: "'${label}' 不是一个有效的 日期格式",
    boolean: "'${label}' 不是一个有效的 布尔类型",
    regexp: "'${label}' 不是一个有效的 正则表达式",
    hex: "'${label}' 不是一个有效的 ${type}",
  },
};

export default validateMessages;