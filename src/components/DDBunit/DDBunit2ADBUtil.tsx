import myUtil from '../DDAssist/util';
import { itemType } from '../DDForm/data.d';

const DDBunit2ADBUtil: any = {};

// 获取数据库表主键 & 组装excel导出时主键数据
DDBunit2ADBUtil.getFieldDefaultRules = ({ fieldObj, formItemKey }: any) => {
  let tmpFieldRulesExcelArr: any = [];
  let tmpFieldRulesConfig: any = [];
  // 设置默认校验
  if (DDBunit2ADBUtil.isFieldNotNull({
    dictFieldNotNull: fieldObj.dictFieldNotNull,
    dictFieldNullAble: fieldObj.dictFieldNullAble
  })) {
    if (!DDBunit2ADBUtil.isDictKey2({fieldObj})) {
      tmpFieldRulesExcelArr.push('必录');
    }
  }
  let commonRuleKey: any = {
    cellFlag: 'rules',
    formItemName: fieldObj?.dictFieldName,
    formItemKey: formItemKey,
    key: myUtil.text.uuid(),
  }
  // 设置默认校验：字段长度校验
  // 数据库格式：tinyint(1) int(10) bigint(20) unsigned decimal(8,2) unsigned char(1)
  // 格式：varchar(32) -> VARCHAR2(32)
  // 格式：decimal(4,0) -> NUMBER(15,5)
  if (DDBunit2ADBUtil.isStringType({dictFieldType: fieldObj?.dictFieldType?.toLowerCase()})) { // 字符
    let tmpRule = DDBunit2ADBUtil.getStringRuleLength({ dictFieldType: fieldObj?.dictFieldType?.toLowerCase() });
    // excel中的rule
    tmpFieldRulesExcelArr.push(`varchar2(${tmpRule})`);
    // config中的rule
    tmpFieldRulesConfig.push({
      ...commonRuleKey,
      type: 'base_string',
      range: Number(tmpRule),
    });
  } else if (DDBunit2ADBUtil.isNumberType({dictFieldType: fieldObj?.dictFieldType?.toLowerCase()})) { // 数值
    let tmpRule = DDBunit2ADBUtil.getNumberRuleLength({ dictFieldType: fieldObj?.dictFieldType?.toLowerCase() });
    // excel中的rule
    tmpFieldRulesExcelArr.push(`number(${tmpRule})`);
    // config中的rule
    let tmpNumberRule: any = tmpRule.split(',') || [];
    let tmpNumberLength = tmpNumberRule.length > 0 ? tmpNumberRule[0] : 0;
    let tmpRuleNumber = {
      ...commonRuleKey,
      type: 'base_number',
      length: Number(tmpNumberLength),
    }
    if (tmpNumberRule.length > 1) {
      tmpRuleNumber.decimal = tmpNumberRule[1];
    }
    tmpFieldRulesConfig.push(tmpRuleNumber);
  }
  return {
    fieldDefaultRules: tmpFieldRulesExcelArr,
    excelStr: tmpFieldRulesExcelArr.length > 0 ? tmpFieldRulesExcelArr.join(',') : '',
    fieldRulesConfig: tmpFieldRulesConfig,
  }
}

// 获取数据库表主键 & 组装excel导出时主键数据
// 基于表 dict_object 中的 hasDictKeys 字段
DDBunit2ADBUtil.getDictKeys = (objectTableObj: any) => {
  let tmpDbKeys = objectTableObj.hasDictKeys || [];
  let tmpDbKeyExcel: any = [];
  tmpDbKeys.forEach((itemKey: any) => {
    tmpDbKeyExcel.push(`${objectTableObj.dictObjectTableName.toLowerCase()}.${itemKey}`);
  })
  let tmpDbKeyExcelStr: any = tmpDbKeyExcel.join(',');
  return {
    dbKeys: tmpDbKeys,
    excelStr: tmpDbKeyExcelStr,
  };
}

// 当前字段是否为主键，fieldObj中需要含有格式为 hasDictKeys: ['id'] 信息
// 基于表 dict_object 中的 字段项 hasDictKeys 字段
DDBunit2ADBUtil.isDictKey = ({ fieldObj }: any) => {
  let tmpHasDictKeys = fieldObj?.hasDictKeys || [];
  let tmpDictFieldName = fieldObj?.dictFieldName?.toLowerCase();
  if (tmpHasDictKeys.indexOf(tmpDictFieldName) > -1) {
    return true;
  }
  return false;
}

// 当前字段是否为主键
DDBunit2ADBUtil.isDictKey2 = ({ fieldObj }: any) => {
  if (fieldObj?.dictFieldKey === '主键') {
    return true;
  }
  return false;
}

// 当前字段对应录入类型
DDBunit2ADBUtil.getFieldInputType = ({ dict_field_type, haveCodeTable }: any) => {
  let fieldType: any = '';
  if (dict_field_type?.indexOf('char') > -1) {
    if (haveCodeTable) {
      fieldType = itemType.Select;
    } else {
      fieldType = itemType.Input;
    }
  } else if (dict_field_type?.indexOf('decimal') > -1
      || dict_field_type?.indexOf('int') > -1) {
    fieldType = itemType.InputNumber;
  } else if (dict_field_type?.indexOf('date') > -1) {
    fieldType = itemType.DatePicker;
  }
  return fieldType;
}

// 类型判断 数值
DDBunit2ADBUtil.isNumberType = ({ dictFieldType }: any) => {
  if (dictFieldType?.indexOf('decimal') > -1
      || dictFieldType?.indexOf('double') > -1
      || dictFieldType?.indexOf('bigint') > -1
      || dictFieldType?.indexOf('tinyint') > -1
      || dictFieldType?.indexOf('int') > -1) {
    return true;
  }
  return false;
}

// 类型判断 日期
DDBunit2ADBUtil.isDateType = ({ dictFieldType }: any) => {
  if (dictFieldType?.indexOf('date') > -1) {
    return true;
  }
  return false;
}

// 类型判断 字符
DDBunit2ADBUtil.isStringType = ({ dictFieldType }: any) => {
  if (dictFieldType?.indexOf('char') > -1) {
    return true;
  }
  return false;
}

// 类型判断 
DDBunit2ADBUtil.formatApiType = ({ dictFieldType }: any) => {
  if (DDBunit2ADBUtil.isNumberType({ dictFieldType })) {
    return 'number';
  }
  if (DDBunit2ADBUtil.isDateType({ dictFieldType })) {
    return 'number';
  }
  if (DDBunit2ADBUtil.isStringType({ dictFieldType })) {
    return 'string';
  }
  return 'string';
}

// 获取数值格式化格式 eg: 0,0.0000
DDBunit2ADBUtil.getNumberFormat = ({ dictFieldType }: any) => {
  let aa = dictFieldType?.replace('unsigned', '')?.replace('(', '')?.replace(')', '').trim().split(',') || [];
  if (aa.length > 1) {
    let result2 = Array.from({ length: aa[1] }, (_, i) => '0').join('');
    let cc = aa[1] === '0' ? `0,0`: `0,0.${result2}`;
    return cc;
  }
  return '';
}

// 判断是否字典属于字典值长度不确定的字段
DDBunit2ADBUtil.isFieldValLenUnknown = ({ dictFieldDesc }: any) => {
  if (dictFieldDesc.indexOf('名称') > -1
      || dictFieldDesc.indexOf('备注') > -1
      || dictFieldDesc.indexOf('用途') > -1) {
    return true;
  }
  return false;
}

// 获取字符串校验长度
DDBunit2ADBUtil.getStringRuleLength = ({ dictFieldType }: any) => {
  let tmpLength = dictFieldType?.toLowerCase()?.replace('varchar2', '')?.replace('varchar', '')?.replace('char', '');
  tmpLength = tmpLength?.replace('(', '')?.replace(')', '')?.trim();
  return tmpLength;
}

// 获取字符串校验长度
DDBunit2ADBUtil.getNumberRuleLength = ({ dictFieldType }: any) => {
  let tmpLength = dictFieldType?.toLowerCase()?.replace('unsigned', '');
  tmpLength = tmpLength.replace('decimal', '').replace('bigint', '').replace('tinyint', '')?.replace('int', '');
  tmpLength = tmpLength?.replace('(', '')?.replace(')', '')?.trim();
  return tmpLength;
}

// 判断是否属于数据库非空字段
DDBunit2ADBUtil.isFieldNotNull = ({ dictFieldNotNull, dictFieldNullAble }: any) => {
  if (ENV_TYPE === 'node') {
    if (dictFieldNotNull === 'Y') { // v0.2 ns node
      return true;
    }
  } else {
    if (dictFieldNotNull === 'N') { // v0.2
      return true;
    } else if (dictFieldNullAble?.toLowerCase() === 'yes') { // v0.1
      return true;
    }
  }
  return false;
}

export default DDBunit2ADBUtil;
