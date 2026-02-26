import myUtil from '../DDAssist/util';
import { isFinite, orderBy } from 'lodash';
import baseValidator from '../DDAssist/field/baseValidator';
import DDBunit2ADBUtil from './DDBunit2ADBUtil';
import { itemType } from '../DDForm/data.d';

const excelV2Validator: any = {};

excelV2Validator.run = (param: any) => {
  let { excelOriginalData } = param;
  let sheet1Data = excelOriginalData.sheet0.data || [];   // sheet1.基础信息
  let sheet2Data = excelOriginalData.sheet1.data || [];   // sheet2.模块
  let sheet3Data = excelOriginalData.sheet2.data || [];   // sheet3.字段
  let sheet4Data = excelOriginalData.sheet3.data || [];   // sheet4.自定义SQL
  let excelDictDomainName = sheet1Data[0]?.pro_value;     // 产品线名称
  let excelDictDomainNameEng = sheet1Data[1]?.pro_value;  // 产品线英文
  let excelAppName = sheet1Data[2]?.pro_value;            // 应用名称
  let excelAppEnName = sheet1Data[3]?.pro_value;          // 应用英文名称
  let excelVersion = sheet1Data[4]?.pro_value;            // 应用版本
  let msg: any = [];

  // sheet2.模块 校验项
  let sheet2Rules: any = {
    module_key: { excelTitle: '业务单元key', ruleType: ['english_number'] },
    gridSerialNumber: { excelTitle: '序号', ruleType: ['fixed'], validValue: ['开启', '/'] },
    gridBorder: { excelTitle: '列表边框', ruleType: ['fixed'], validValue: ['开启', '/'] },
    grid_selection_type: { excelTitle: '列表首选项', ruleType: ['fixed'], validValue: ['checkbox', 'radio', '关闭'] },
    gridPager: { excelTitle: '分页', ruleType: ['fixed'], validValue: ['开启', '/'] },
    gridColEdit: { excelTitle: '列表列编辑', ruleType: ['fixed'], validValue: ['开启', '/'] },
    gridColDel: { excelTitle: '列表列删除', ruleType: ['fixed'], validValue: ['开启', '/'] },
    gridColDetail: { excelTitle: '列表列详情', ruleType: ['fixed'], validValue: ['开启', '/'] },
    toolbar_default_add: { excelTitle: '工具栏增加', ruleType: ['fixed'], validValue: ['开启', '/'] },
    toolbar_default_delete: { excelTitle: '工具栏删除', ruleType: ['fixed'], validValue: ['开启', '/'] },
    toolbar_default_edit: { excelTitle: '工具栏编辑', ruleType: ['fixed'], validValue: ['开启', '/'] },
    toolbar_default_upload: { excelTitle: '工具栏导入', ruleType: ['fixed'], validValue: ['开启', '/'] },
    toolbar_default_download: { excelTitle: '工具栏导出', ruleType: ['fixed'], validValue: ['开启', '开启后端', '/'] },
    toolbar_default_setting: { excelTitle: '工具栏设置', ruleType: ['fixed'], validValue: ['开启', '/'] },
    toolbar_default_full: { excelTitle: '工具栏全屏', ruleType: ['fixed'], validValue: ['开启', '/'] },
    toolbar_default_reload: { excelTitle: '工具栏刷新', ruleType: ['fixed'], validValue: ['开启', '/'] },
    toolbar_default_advanced_filter: { excelTitle: '工具栏筛选', ruleType: ['fixed'], validValue: ['开启', '/'] },
    form_layout_type: { excelTitle: '表单布局', ruleType: ['fixed'], validValue: ['horizontal', 'vertical', '2', '3', '4'] },
    form_width: { excelTitle: '表单宽度', ruleType: ['fixed'], validValue: ['480', '720', '960', '1200', 'max'] },
  }

  // sheet3.字段 校验项
  let sheet3Rules: any = {
    grid: { excelTitle: '列表', ruleType: ['fixed'], validValue: ['开启', '/'] },
    align: { excelTitle: '对齐方式', ruleType: ['fixed'], validValue: ['L', 'R', 'C', '/'] },
    fixed: { excelTitle: '固定列', ruleType: ['fixed'], validValue: ['L', 'R', '/'] },
    hidden: { excelTitle: '隐藏列', ruleType: ['fixed'], validValue: ['开启', '/'] },
    ellipsis: { excelTitle: '超出隐藏', ruleType: ['fixed'], validValue: ['开启', '/'] },
    sum: { excelTitle: '合计', ruleType: ['fixed'], validValue: ['开启', '/'] },
    sum2: { excelTitle: '后端合计', ruleType: ['fixed'], validValue: ['开启', '/'] },
    max: { excelTitle: '最大值', ruleType: ['fixed'], validValue: ['开启', '/'] },
    max2: { excelTitle: '后端最大值', ruleType: ['fixed'], validValue: ['开启', '/'] },
    min: { excelTitle: '最小值', ruleType: ['fixed'], validValue: ['开启', '/'] },
    min2: { excelTitle: '后端最小值', ruleType: ['fixed'], validValue: ['开启', '/'] },
    avg: { excelTitle: '平均值', ruleType: ['fixed'], validValue: ['开启', '/'] },
    avg2: { excelTitle: '后端平均值', ruleType: ['fixed'], validValue: ['开启', '/'] },
    sorter: { excelTitle: '排序', ruleType: ['fixed'], validValue: ['开启', '/'] },
    filterPosition: { excelTitle: '筛选位置', ruleType: ['fixed'], validValue: ['工具栏', '列表头', '/'] },
    form: { excelTitle: '表单', ruleType: ['fixed'], validValue: ['开启', '/'] },
    formItemReadonly: { excelTitle: '只读', ruleType: ['fixed'], validValue: ['开启', '/'] },
    formItemLayout: { excelTitle: '布局', ruleType: ['fixed'], validValue: ['66', '100', '/'] },
    filterLayout: { excelTitle: '筛选布局', ruleType: ['fixed'], validValue: ['66', '100', '/'] },
    formItemType: { excelTitle: '类型', ruleType: ['fixed'], validValue: ['input', 'select', 'date', 'datePicker', 'radio', 'checkbox', 'password', 'inputNumber', 'treeSelect', 'hidden', 'textarea', 'upload', 'title', 'richTextEditor', 'groupTitle', '/'] },
    filter: { excelTitle: '筛选', ruleType: ['fixed'], validValue: ['input', 'select', 'date', 'datePicker', 'radio', 'checkbox', 'password', 'inputNumber', 'treeSelect', '/'] },
    width: { excelTitle: '列宽', ruleType: ['number'] },
    filterOrder: { excelTitle: '筛选顺序', ruleType: ['number'] },
    formItemOrder: { excelTitle: '表单排序', ruleType: ['number'] },
    eventOnBlur: { excelTitle: 'blur', ruleType: ['english_number'] },
    eventOnFocus: { excelTitle: 'focus', ruleType: ['english_number'] },
    eventOnChange: { excelTitle: 'onchange', ruleType: ['english_number'] },
    dictObject: { excelTitle: '物理表', ruleType: ['english_number'] },
    dictFieldEng: { excelTitle: '物理表字段英文名', ruleType: ['english_number'] },
    dataIndex: { excelTitle: '字段英文名', ruleType: ['english_number'] },
  }

  // sheet4.自定义SQL 校验项
  let sheet4Rules: any = {
    sql_type: { excelTitle: 'Sql类别', ruleType: ['fixed'], validValue: ['查询列表', '查询表单', '删除'] },
  }

  // 全部校验项
  let sheetRuleAll = [
    { rule: sheet2Rules, data: sheet2Data, sheetName: '2.模块' },
    { rule: sheet3Rules, data: sheet3Data, sheetName: '3.字段' },
    { rule: sheet4Rules, data: sheet4Data, sheetName: '4.自定义SQL' },
  ];

  // 业务单元key校验项
  let sheetAll2 = [
    { data: sheet2Data, sheetName: '2.模块' },
    { data: sheet3Data, sheetName: '3.字段' },
    { data: sheet4Data, sheetName: '4.自定义SQL' },
  ];

  // 校验项： 固定录入内容校验、数值校验项
  sheetRuleAll.forEach((sheet: any) => {
    let sheetData = sheet.data;
    let rule = sheet.rule;
    sheetData.forEach((row: any, index: any) => {
      let needValidate = true;
      if (sheet.sheetName === '3.字段' && !row.dataIndex) {
        needValidate = false;
      }
      if (needValidate) {
        Object.keys(rule).forEach((key: any) => {
          let msgCommon = {
            key,
            excelTitle: rule[key].excelTitle,
            rowNo: index + 2,
            sheet: sheet.sheetName,
            cellValue: row[key],
          }
          if (rule[key].ruleType.indexOf('fixed') > -1) {
            // 固定录入内容校验
            if (rule[key].validValue.indexOf(row[key]) < 0) {
              msg.push({
                ...msgCommon,
                validValue: rule[key].validValue.toString(),
              });
            }
          }
          if (rule[key].ruleType.indexOf('number') > -1) {
            // 数值校验项
            if (row[key] !== '/' && !isFinite(Number(row[key]))) {
              msg.push({
                ...msgCommon,
                info: '不是合法的数值',
              });
            }
          }
          if (rule[key].ruleType.indexOf('english_number') > -1) {
            // 数字或字母校验项
            if (row[key] !== '/') {
              let regex = baseValidator.english_number().pattern;
              if (!regex.test(row[key])) {
                msg.push({
                  ...msgCommon,
                  info: '不是合法的数字或字母！',
                });
              }
            }
          }
        });
      }
    });
  });

  // 校验项：业务单元key
  // 校验项：【sheet2.模块】业务单元key前缀格式是否为应【用英文名称_】
  // 校验项：【sheet3.字段】【sheet4.自定义SQL】中业务单元key是否在【2.模块】中存在
  let key: any = [];
  sheet2Data.forEach((sheet: any) => {
    key.push(sheet.module_key);
  });
  key = Array.from(new Set(key));
  sheetAll2.forEach((sheet: any) => {
    let sheetData = sheet.data;
    sheetData.forEach((data: any, index: any) => {
      let needValidate = true;
      if (sheet.sheetName === '3.字段' && !data.dataIndex) {
        needValidate = false;
      }
      if (needValidate) {
        if (!data.module_key.startsWith(excelAppEnName)) {
          // 业务单元key前缀格式是否为应【用英文名称_】
          msg.push({
            key: 'module_key',
            excelTitle: '业务单元key',
            rowNo: index + 2,
            sheet: sheet.sheetName,
            cellValue: data.module_key,
            info: '业务单元key前缀为' + excelAppEnName + '_',
          });
        } else if (key.indexOf(data.module_key) < 0) {
          // 业务单元key是否在【2.模块】中存在
          msg.push({
            key: 'module_key',
            excelTitle: '业务单元key',
            rowNo: index + 2,
            sheet: sheet.sheetName,
            cellValue: data.module_key,
            info: '业务单元key在模块中不存在',
          });
        }
      }
    })
  })

  // 校验项：数值类型的录入框 是否为inputNumber
  sheet3Data.forEach((sheet: any, index: any) => {
    let dictObjectCreateFlag: any = sheet.dictObjectCreateFlag; // 数据库建表标识
    let dictObjectFieldType: any = sheet.dictObjectFieldType; // 数据库建表类型
    let formItemType: any = sheet.formItemType;
    let filter: any = sheet.filter;
    let rightInputType: any = DDBunit2ADBUtil.getFieldInputType({
      dict_field_type: dictObjectFieldType,
    });
    if (dictObjectCreateFlag !== '/' && dictObjectFieldType) {
      if (rightInputType === itemType.InputNumber) {
        if (formItemType !== '/' && formItemType !== 'inputNumber') {
          msg.push({
            key: 'form_items.type',
            excelTitle: '数值类型录入项不匹配',
            rowNo: index + 2,
            sheet: '3.字段',
            cellValue: formItemType,
            info: '表单项类型应为inputNumber',
            validValue: 'inputNumber',
          });
        }
        if (filter !== '/' && filter !== 'inputNumber') {
          msg.push({
            key: 'filter_items.type',
            excelTitle: '数值类型录入项不匹配',
            rowNo: index + 2,
            sheet: '3.字段',
            cellValue: filter,
            info: '筛选项类型应为inputNumber',
            validValue: 'inputNumber',
          });
        }
      }
    }
  });

  // 校验项：sheet1.基础信息 是否匹配
  let dictApp = myUtil.code.getCode('dict_app') || [];
  let targetApp = dictApp.find((item: any) => {
    return item.appName === excelAppName
        && item.appEnName === excelAppEnName
        && item.version === excelVersion;
  });
  if (targetApp) {
    let targetAppDictDomainId = targetApp.dictDomainId;
    let dictDomainName = myUtil.code.getCodeValByKey(targetAppDictDomainId, 'dict_domain', { matchKey:'dictDomainId', matchValKey: 'dictDomainName'}) || '';
    let dictDomainNameEng = myUtil.code.getCodeValByKey(targetAppDictDomainId, 'dict_domain', { matchKey:'dictDomainId', matchValKey: 'dictDomainNameEng'}) || '';
    if (dictDomainName !== excelDictDomainName || dictDomainNameEng !== excelDictDomainNameEng) {
      msg.push({
        excelTitle: '采集值',
        rowNo: '2,3',
        sheet: '1.基础信息',
        cellValue: `${excelDictDomainName}、${excelDictDomainNameEng}`,
        info: '产品线名称、产品线英文名称中的一个或多个在系统中不存在',
      });
    }
  } else {
    msg.push({
      excelTitle: '采集值',
      rowNo: '4,5,6',
      sheet: '1.基础信息',
      cellValue: `${excelAppName}、${excelAppEnName}、${excelVersion}`,
      info: '应用名称、应用英文名称、应用版本中的一个或多个在系统中不存在',
    });
  }

  msg = orderBy(msg, ['sheet', 'rowNo'], ['asc', 'asc'])
  return [];
  return msg;
}

export default excelV2Validator;