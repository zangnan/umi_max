import myUtil from '../DDAssist/util';
import baseValidator from '../DDAssist/field/baseValidator';
import { itemType } from './data.d';
import { cloneDeep } from 'lodash';
import { groupBy } from 'lodash';
import dayjs from "dayjs";

let formUtil: any = {};

// 根据公式计算目标值
const setFormulaValue = ({formObj, ps, tItem, ...param}: any) => {
  let cc: any = {};
  let formula = tItem.formula;
  // 解析参数依次取值
  for (let i = 0; i < ps.length; i++) {
    if (!formObj.getFieldValue(ps[i].name)) {
      cc[tItem.name] = null
      formObj.setFieldsValue(cc);
      return;
    }
    let bbbb = param.myItems?.find((aaaa: any) => { return aaaa.name === ps[i].name });
    if (bbbb?.type === itemType.DatePicker) {
      let dateValTmp: any = formObj.getFieldValue(ps[i].name);
      if (dateValTmp) {
        let aa = new Date(dayjs(dateValTmp)).getTime();
        ps[i].value = (aa || 0)/1000/60/60/24;
      }
    } else {
      ps[i].value = formObj.getFieldValue(ps[i].name) || 0;
    }
  }
  let formulaItemFinal = cloneDeep(formula);
  ps.forEach((ccc: any) => {
    formulaItemFinal = formulaItemFinal.replace(ccc.name, ccc.value);
  });
  formulaItemFinal = formulaItemFinal.replaceAll('{', '').replaceAll('}', '');
  let res = eval(formulaItemFinal);
  cc[tItem.name] = res
  formObj.setFieldsValue(cc);
};

// 列表工具类
formUtil = {
  // 列表初始化入口
  init(param: any) {
    const { items, func, refMediaModal, form } = param;
    if (!items) {
      return;
    }
    let formulaArr: any = [];
    items.forEach((item: any) => {
      const { type, rules: configRules, eventOnChange, eventOnBlur, eventOnFocus, eventOnSearch, children, formula } = item;
      if (typeof (item?.type) === 'string') {
        item.type = itemType[type];
      }
      if (item.format && typeof (item.format) !== 'function') {
        const { format } = item.format;
        if (item.format.type === 'number') {
          item.format = (text: any) => {
            if (text.constructor === String) {
              return myUtil.text.formatNum(Number(text), format);
            } else {
              return myUtil.text.formatNum(text, format);
            }
          }
        }
      }
      // 表单项校验
      const rules: any = [];
      if (configRules && configRules.length > 0) {
        configRules.forEach((itemRule: any) => {
          if (itemRule.type === 'base_required') {
            // 必录项目校验
            rules.push(baseValidator.required());
          } else if (itemRule.type === 'base_string') {
            // 字符串基础校验
            if (itemRule.length) {
              rules.push(baseValidator.len2(itemRule.length));
            } else if (itemRule.range && typeof itemRule.range === 'number') {
              rules.push(baseValidator.range2({ min: 0, max: itemRule.range, item: item }));
            } else if (itemRule.range && Array.isArray(itemRule.range)) {
              rules.push(baseValidator.range2({ min: itemRule.range[0], max: itemRule.range[1], item: item }));
            }
          } else if (itemRule.type === 'base_date') {
            // 日期校验
            if (itemRule.format === 'yyyyMMdd' || itemRule.format === 'yyyy-MM-dd') {
              rules.push(baseValidator.yyyyMMdd());
            } else if (itemRule.format === 'yyyyMM') {
              rules.push(baseValidator.yyyyMM());
            } else if (itemRule.format === 'yyyy') {
              rules.push(baseValidator.yyyy());
            } else if (itemRule.format === 'MM') {
              rules.push(baseValidator.MM());
            }
          } else if (itemRule.type === 'base_number') {
            // 数值校验
            if (itemRule.length && itemRule.decimal) {
              let maxVal = '';
              let decimalVal = '';
              for (let i = 0; i < itemRule.length - itemRule.decimal; i++) {
                maxVal += '9';
              }
              for (let i = 0; i < itemRule.decimal; i++) {
                decimalVal += '9';
              }
              const max = Number(maxVal + '.' + decimalVal);
              const min = Number('-' + max);
              rules.push(...baseValidator.range({ max, min, type: 'number', item: item }));
            } else if (itemRule.length) {
              let maxVal = '';
              for (let i = 0; i < itemRule.length; i++) {
                maxVal += '9';
              }
              const max = Number(maxVal);
              rules.push(...baseValidator.range({ max, min: -max, type: 'number', item: item }));
            } else if (itemRule.range === '+') {
              rules.push(baseValidator.numRange(['+']));
            } else if (itemRule.range === '-') {
              rules.push(baseValidator.numRange(['-']));
            } else if (itemRule.range === '0') {
              rules.push(baseValidator.numRange(['0']));
            } else if (itemRule.range === '+-') {
              rules.push(baseValidator.numRange(['+', '-']));
            } else if (itemRule.range === '+0') {
              rules.push(baseValidator.numRange(['+', '0']));
            } else if (itemRule.range === '-0') {
              rules.push(baseValidator.numRange(['-', '0']));
            }
          } else if (itemRule.type === 'base_type_number') {
            // 类型校验：数字
            rules.push(baseValidator.number());
          } else if (itemRule.type === 'base_type_mail') {
            // 类型校验：数字及字母
            rules.push({ type: 'email' });
          } else if (itemRule.type === 'base_type_number_english') {
            // 类型校验：邮件
            rules.push(baseValidator.english_number());
          } else if (itemRule.type === 'base_type_phone') {
            // 类型校验：电话
            rules.push(baseValidator.phone());
          } else if (itemRule.type === 'base_type_idcard') {
            // 类型校验：身份证
            rules.push(baseValidator.idcard());
          } else if (itemRule.type === 'base_type_chinese') {
            // 类型校验：汉字
            rules.push(baseValidator.chinese());
          } else if (itemRule.func && func?.validator && func?.validator[itemRule.func]) {
            // 自定义校验
            rules.push(func.validator[itemRule.func]);
          }
        });
        item.validator = rules;
      }
      // 表单项事件
      if (eventOnChange && func?.eventOnChange && func?.eventOnChange[eventOnChange]) {
        item.onChange = func.eventOnChange[eventOnChange];
      }
      if (eventOnChange && func[eventOnChange]) {// 兼容老版本
        item.onChange = func[eventOnChange];
      }
      if (eventOnBlur && func?.eventOnBlur && func?.eventOnBlur[eventOnBlur]) {
        item.onBlur = func.eventOnBlur[eventOnBlur];
      }
      if (eventOnFocus && func?.eventOnFocus && func?.eventOnFocus[eventOnFocus]) {
        item.onFocus = func.eventOnFocus[eventOnFocus];
      }
      if (eventOnSearch && func?.eventOnSearch && func?.eventOnSearch[eventOnSearch]) {
        item.onSearch = func.eventOnSearch[eventOnSearch];
      } else if (eventOnSearch && type === itemType.MediaLibrary) {
        item.onSearch = (param: any) => {
          refMediaModal.current?.showModal(param);
        };
      } else if (eventOnSearch === 'searchSegmentation') {
        item.onSearch = (param: any) => {
          if (param?.value) {
            myUtil.segmentation.setSegmentation(param);
          }
        };
      }
      // 提取所有公式
      if (formula) {
        formulaArr.push({
          formulaOriginal: formula,
          targetItem: item,
        });
      }
      // 子表处理
      if (children && children.length > 0) {
        formUtil.init({
          items: children,
          func: func,
          form,
        })
      }
    });
    // 公式
    let fnBlurArr: any = [];
    if (formulaArr?.length > 0) {
      // 遍历每个公式，解析参数
      formulaArr.forEach(({formulaOriginal, targetItem}: any) => {
        let aa = myUtil.text.parseBraces(formulaOriginal) || []; // {p1}*{p2}*{p3} -> ['p1','p2','p3']
        let paraArr: any = [];
        aa.forEach((aaItem: any) => paraArr.push({ name: aaItem })); // [{name:'p1'},{name:'p2'},{name:'p3'}]
        paraArr.forEach((parItem: any) => {
          let tmpFormItem: any = items?.find((item: any) => { return item.name === parItem.name });
          fnBlurArr.push({
            ps: paraArr,
            tItem: targetItem,
            bindItem: tmpFormItem,
          });
        })
      })
      // 汇总公式，绑定onBlur
      const grouped: any = groupBy(fnBlurArr, (v) => (v?.bindItem?.name));
      Object.keys(grouped).forEach(bindItemName => {
        let ffff = grouped[bindItemName] || [];
        let tmpFormItem: any = items?.find((item: any) => { return item.name === bindItemName });
        if (tmpFormItem) {
          let tmpFormItemType = tmpFormItem?.type;
          if (tmpFormItemType === itemType.DatePicker) {
            tmpFormItem.onChange = (param: any) => {
              for (let m = 0; m < ffff.length; m++ ) {
                setFormulaValue({
                  ...ffff[m],
                  ...param,
                  formObj: form,
                });
              };
            };
          } else {
            tmpFormItem.onBlur = (param: any) => {
              for (let m = 0; m < ffff.length; m++ ) {
                setFormulaValue({
                  ...ffff[m],
                  formObj: form,
                });
              };
              // 如果表单项目含有公式配置，在需要重新设置自定义的onblur事件
              if (tmpFormItem.eventOnBlur && func?.eventOnBlur && func?.eventOnBlur[tmpFormItem.eventOnBlur]) {
                func.eventOnBlur[tmpFormItem.eventOnBlur](param);
              }
            };
          }
        }
      });
    }
    return items;
  },
  // 配置表单项目
  initFormItemsCodeTable(formItems: any) {
    const items = formItems?.concat() || [];
    // 码表渲染
    items.forEach((item: any) => {
      const { codeTable, showCode, treeTable, showType, isSelectLeaf = false, children } = item;
      if (children?.length > 0) {
        this.initFormItemsCodeTable(children);
      } else {
        if (codeTable) {
          item.list = myUtil.code.getSelectOption(codeTable)
          if (showCode) {
            item.list.forEach((item1: any) => {
              item1.name = `[${item1.value}]   ${item1.name}`
            })
          }
        }
        if (treeTable) {
          item.list = myUtil.treeCode.getTreeCodeData(treeTable)
          if (isSelectLeaf) {
            myUtil.array.traverseTreeLeaf(item.list);
          }
        }
      }
    });
    return items;
  },
};

export default formUtil;
