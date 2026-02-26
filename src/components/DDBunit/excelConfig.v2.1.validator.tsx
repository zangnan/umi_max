import { isFinite, orderBy } from 'lodash';
import baseValidator from '../DDAssist/field/baseValidator';
import DDBunit2ADBUtil from './DDBunit2ADBUtil';
import myUtil from '../DDAssist/util';
import { ProCard } from '@ant-design/pro-components';
import { Button, Form, List, Spin, Avatar, Divider, message, Typography } from 'antd';

const excelV2Validator: any = {};

// 校验项配置 模块
let sheetRulesModule: any = {
  module_key: { excelTitle: '模块key', ruleType: ['required'] },
  module_name: { excelTitle: '模块名称', ruleType: ['required'] },
  // 前端校验项 ************************************
  grid_show_serial_number: { excelTitle: '列表序号', ruleType: ['fixed'], validValue: ['1'] },
  grid_border: { excelTitle: '列表边框', ruleType: ['fixed'], validValue: ['1'] },
  grid_selection_type: { excelTitle: '列表首选项', ruleType: ['fixed'], validValue: ['checkbox', 'radio'] },
  grid_ext: { excelTitle: '列表扩展', ruleType: ['fixed'], validValue: ['card'] },
  grid_col_edit: { excelTitle: '列表列编辑', ruleType: ['fixed'], validValue: ['1'] },
  grid_col_del: { excelTitle: '列表列删除', ruleType: ['fixed'], validValue: ['1'] },
  grid_col_detail: { excelTitle: '列表列详情', ruleType: ['fixed'], validValue: ['1'] },
  toolbar_default_add: { excelTitle: '工具栏增加', ruleType: ['fixed'], validValue: ['1'] },
  toolbar_default_delete: { excelTitle: '工具栏删除', ruleType: ['fixed'], validValue: ['1'] },
  toolbar_default_edit: { excelTitle: '工具栏编辑', ruleType: ['fixed'], validValue: ['1'] },
  toolbar_default_upload: { excelTitle: '工具栏导入', ruleType: ['fixed'], validValue: ['1'] },
  // toolbar_default_download: { excelTitle: '工具栏导出', ruleType: ['fixed'], validValue: ['1', '2'] },
  toolbar_default_setting: { excelTitle: '工具栏设置', ruleType: ['fixed'], validValue: ['1'] },
  toolbar_default_full: { excelTitle: '工具栏全屏', ruleType: ['fixed'], validValue: ['1'] },
  toolbar_default_reload: { excelTitle: '工具栏刷新', ruleType: ['fixed'], validValue: ['1'] },
  toolbar_default_advanced_filter: { excelTitle: '工具栏筛选', ruleType: ['fixed'], validValue: ['1'] },
  form_layout_type: { excelTitle: '表单布局', ruleType: ['fixed'], validValue: ['horizontal', 'vertical', '2', '3', '4'] },
  form_width: { excelTitle: '表单宽度', ruleType: ['fixed'], validValue: ['480', '720', '960', '1200', 'max'] },
  form_submit_type: { excelTitle: '表单提交方式', ruleType: ['fixed'], validValue: ['1'] },
}
if (ENV_TYPE !== 'node') {
  sheetRulesModule.dict_name = { excelTitle: '数据字典', ruleType: ['required'] };
}
excelV2Validator.sheetRulesModule = sheetRulesModule;

// 校验项配置 字段
let sheetRulesField: any = {
  // 前端校验项 ************************************
  // 列表
  grid_used: { excelTitle: '列表项开启标识', ruleType: ['fixed'], validValue: ['1'] },
  grid_key: { excelTitle: '列表项主键标识', ruleType: ['fixed'], validValue: ['1'] },
  grid_align: { excelTitle: '列表项对齐方式', ruleType: ['fixed'], validValue: ['L', 'R', 'C'] },
  grid_width: { excelTitle: '列表项列宽', ruleType: ['number'] },
  grid_fixed: { excelTitle: '列表项固定列', ruleType: ['fixed'], validValue: ['L', 'R'] },
  grid_hidden: { excelTitle: '列表项隐藏标识', ruleType: ['fixed'], validValue: ['1'] },
  grid_ellipsis: { excelTitle: '列表项超出隐藏', ruleType: ['fixed'], validValue: ['1'] },
  grid_render: { excelTitle: '列表项格式化列' },
  grid_sort: { excelTitle: '列表项排序开关', ruleType: ['fixed'], validValue: ['1', 'mul'] },
  grid_index: { excelTitle: '列表项序列', ruleType: ['number'] },
  grid_stat: { excelTitle: '列表项统计', ruleType: ['include'], validValue: ['1', 'min', 'max', 'avg', 'sum', 'fun'] },
  grid_children: { excelTitle: '列表项合并列头', ruleType: ['number'] },
  // 筛选项
  filter_item_type: { excelTitle: '筛选项类型', ruleType: ['fixed'], validValue: ['Input', 'InputNumber', 'Select', 'DatePicker', 'Radio', 'Checkbox', 'TextArea', 'TreeSelect'] },
  filter_item_extend: { excelTitle: '筛选项类型扩展参数' },
  filter_item_index: { excelTitle: '筛选项序列', ruleType: ['number'] },
  filter_item_label: { excelTitle: '筛选项名称' },
  filter_item_position: { excelTitle: '筛选项位置', ruleType: ['fixed'], validValue: ['工具栏', '列表头']  },
  filter_item_placeholder: { excelTitle: '筛选项占位符'},
  filter_item_layout: { excelTitle: '筛选项布局', ruleType: ['fixed'], validValue: ['66', '100'] },
  // 表单
  form_item_used: { excelTitle: '表单项开启', ruleType: ['fixed'], validValue: ['1'] },
  form_item_type: { excelTitle: '表单项类型', ruleType: ['fixed'], validValue: ['Cascader', 'MarkdownEditor', 'Input', 'InputNumber', 'Select', 'DatePicker', 'Radio', 'Checkbox', 'TextArea', 'Hidden', 'Password', 'GroupTitle', 'Title', 'TreeSelect', 'Upload', 'UploadVideo', 'UploadAudio', 'UploadPicture', 'RichTextEditor', 'Switch', 'MediaLibrary'] },
  form_item_format: { excelTitle: '表单项格式化' },
  form_item_readonly: { excelTitle: '表单项只读', ruleType: ['fixed'], validValue: ['1'] },
  form_item_extend: { excelTitle: '表单项类型扩展参数' },
  form_item_layout: { excelTitle: '表单项布局', ruleType: ['fixed'], validValue: ['66', '100'] },
  form_item_event_onblur: { excelTitle: '表单项事件失去焦点', ruleType: ['english_number'] },
  form_item_event_onfocus: { excelTitle: '表单项事件得到焦点', ruleType: ['english_number'] },
  form_item_event_onchange: { excelTitle: '表单项事件值改变', ruleType: ['english_number'] },
  form_item_event_onsearch: { excelTitle: '表单项事件查询', ruleType: ['english_number'] },
  form_item_rule: { excelTitle: '表单项验证' },
  form_item_index: { excelTitle: '表单项序列', ruleType: ['number'] },
}
excelV2Validator.sheetRulesField = sheetRulesField;

// 校验项配置 表管理
let sheetRulesDictTable: any = {
  // 前端校验项 ************************************
  tableName: { excelTitle: '物理表名称', ruleType: ['required'] },
  tableDesc: { excelTitle: '物理表含义', ruleType: ['required'] },
  dict_name: { excelTitle: '数据字典', ruleType: ['required'] },
  dictDesc: { excelTitle: '数据字典含义', ruleType: ['required'] },
  tableAlias: { excelTitle: '逻辑名', ruleType: ['required'] },
  tableType: { excelTitle: '逻辑表类型', ruleType: ['fixed', 'required'], validValue: ['物理表', '虚拟表'] },
}

// 校验项配置 表 node env ns
let sheetRulesTableField: any = {
  // 前端校验项 ************************************
  dict_field_key: { excelTitle: '键', ruleType: ['fixed'], validValue: ['p_key'] },
  dict_field_not_null: { excelTitle: '非空', ruleType: ['fixed'], validValue: ['Y', 'N'] },
}

// 校验项配置 菜单构建
let sheetRulesMenu: any = {
  // 前端校验项 ************************************
  menu_hide: { excelTitle: '隐藏', ruleType: ['fixed'], validValue: ['Y', 'N'] },
  menu_full_screen: { excelTitle: '默认全屏', ruleType: ['fixed'], validValue: ['Y', 'N'] },
}

// 校验项配置 菜单构建 node env ns
let sheetRulesMenuNs: any = {
  // 前端校验项 ************************************
  menu_hide: { excelTitle: '隐藏', ruleType: ['fixed'], validValue: ['1', '0'] },
  menu_full_screen: { excelTitle: '默认全屏', ruleType: ['fixed'], validValue: ['1', '0'] },
  menu_active: { excelTitle: '有效标记', ruleType: ['fixed'], validValue: ['1', '0'] },
}

// 校验项： 固定录入内容校验、数值校验项、数字或字母校验项
let checkFixedContend = ({sheetRuleAll}: any) => {
  let msg: any = [];
  sheetRuleAll.forEach((sheet: any) => {
    let sheetData = sheet.data;
    let rule = sheet.rule;
    sheetData.forEach((row: any, index: any) => {
      Object.keys(rule).forEach((key: any) => {
        let msgCommon = {
          key,
          excelTitle: rule[key].excelTitle,
          rowNo: row?.record_row_index || index + 2, // 在线编辑时，采用record_row_index
          sheet: sheet.sheetName,
          cellValue: row[key],
        }
        if (rule[key]?.ruleType?.indexOf('required') > -1 && !row[key]) {
          msg.push({
            ...msgCommon,
            info: '该单元格不能为空',
          });
        }
        if (rule[key]?.ruleType?.indexOf('fixed') > -1 && row[key]) {
          // 固定录入内容校验
          let tmpRuleValidValue: any = [];
          rule[key].validValue.forEach((item: any) => {
            tmpRuleValidValue.push(item.toLowerCase());
          });
          if (tmpRuleValidValue.indexOf((row[key])?.toLowerCase()) < 0) {
            msg.push({
              ...msgCommon,
              validValue: rule[key].validValue.toString(),
            });
          }
        }
        if (rule[key]?.ruleType?.indexOf('include') > -1 && row[key]) {
          let tmpRuleValidValue: any = [];
          rule[key].validValue.forEach((item: any) => {
            tmpRuleValidValue.push(item.toLowerCase());
          });
          let tmpTargetVal = row[key]?.toLowerCase() || '';
          let tmpTargetValArr = tmpTargetVal.split(',') || [];
          for (let i = 0; i < tmpTargetValArr.length; i++) {
            if (tmpRuleValidValue.indexOf(tmpTargetValArr[i]) < 0) {
              msg.push({
                ...msgCommon,
                validValue: rule[key].validValue.toString(),
              });
              break;
            }
          }
        }
        if (rule[key]?.ruleType?.indexOf('number') > -1 && row[key]) {
          if (!isFinite(Number(row[key]))) {
            msg.push({
              ...msgCommon,
              info: '不是合法的数值',
            });
          }
        }
        if (rule[key]?.ruleType?.indexOf('english_number') > -1 && row[key]) {
          // 数字或字母校验项
          let regex = baseValidator.english_number().pattern;
          if (!regex.test(row[key])) {
            msg.push({
              ...msgCommon,
              info: '不是合法的数字或字母！',
            });
          }
        }
      });
    });
  });
  return msg;
}

// 校验项：【模块.sheet】【字典构建.sheet】【表管理.sheet】：'数据字典'字段
let checkDictName = ({sheetRuleAll}: any) => {
  let msg: any = [];
  let sheetModule = sheetRuleAll.find((item: any) => item.sheetName === '模块');
  let sheetDictTable = sheetRuleAll.find((item: any) => item.sheetName === '表管理');
  let sheetField = sheetRuleAll.find((item: any) => item.sheetName === '字典构建');
  let sheetModuleData = sheetModule?.data || [];
  let sheetDictTableData = sheetDictTable?.data || [];
  let sheetFieldData = sheetField?.data || [];
  // 遍历【模块.sheet】
  sheetModuleData.forEach((row: any, index: any) => {
    let targetDictName = row.dict_name;
    let counter1: any = 0;
    for (let i = 0; i < sheetDictTableData.length; i++) {
      let dictTableDictName = sheetDictTableData[i].dict_name || ''; // 字典名称  格式： aa bb
      if (targetDictName === dictTableDictName) {
        counter1++;
      }
    }
    let bbb = {
      key: '',
      excelTitle: '数据字典',
      rowNo: index + 2,
      sheet: sheetModule.sheetName,
      cellValue: row.dict_name,
    }
    if (counter1 === 0) {
      msg.push({
        ...bbb,
        info: '【Sheet.表管理】中不存在对应数据字典信息',
      })
    }
    if (counter1 > 1) {
      msg.push({
        ...bbb,
        info: '【Sheet.表管理】中存在一组以上数据字典信息',
      })
    }
  })
  // 遍历【模块.sheet】
  sheetModuleData.forEach((row: any, index: any) => {
    let targetDictName = row.dict_name;
    let counter2: any = 0;
    for (let i = 0; i < sheetFieldData.length; i++) {
      if (sheetFieldData[i].isDivider) {
        let dividerTitle = sheetFieldData[i].dict_field_name_main || ''; // 字典名称  格式： aa bb
        let dividerTitleArr = dividerTitle?.split(' ') || [];
        let fieldDictName = dividerTitleArr.length > 1 ? dividerTitleArr[1] : '';
        if (targetDictName === fieldDictName) {
          counter2++;
        }
      }
    }
    let bbb = {
      key: '',
      excelTitle: '数据字典',
      rowNo: index + 2,
      sheet: sheetModule.sheetName,
      cellValue: row.dict_name,
    }
    if (counter2 === 0) {
      msg.push({
        ...bbb,
        info: '【Sheet.字典构建】中不存在对应数据字典信息',
      })
    }
    if (counter2 > 1) {
      msg.push({
        ...bbb,
        info: '【Sheet.字典构建】中存在一组以上数据字典信息',
      })
    }
  })
  return msg;
}

// 校验项：【菜单构建】：'组件'字段 = ./common/automatic_page -> '菜单路径'字段: /aaa/bbb/cfgp/test_app_mts_tssb
let checkAutomaticPage = ({sheetRuleAll}: any) => {
  let msg: any = [];
  let sheetMenu = sheetRuleAll.find((item: any) => item.sheetName === '菜单');
  let sheetModule = sheetRuleAll.find((item: any) => item.sheetName === '模块');
  let sheetMenuData = sheetMenu?.data || [];
  let sheetModuleData = sheetModule?.data || [];
  // 遍历【菜单.sheet】
  sheetMenuData.forEach((row: any, index: any) => {
    if (row.menu_component === './common/automatic_page') {
      if (row.menu_path.indexOf('/cfgp/') < 0) {
        msg.push({
          key: '',
          excelTitle: '菜单路径',
          rowNo: index + 2,
          sheet: '菜单',
          cellValue: row.menu_path,
          info: '菜单路径中应包含关键字【/cfgp/】',
        })
      } else {
        let counter: any = 0;
        let ccc =row.menu_path.split('/cfgp/');
        let moduleNameFromPath = ccc.length > 1 ? ccc[1] : '';
        for (let i = 0; i < sheetModuleData.length; i++) {
          if (moduleNameFromPath === sheetModuleData[i].module_key) {
            counter++;
          }
        }
        if (counter < 1) {
          msg.push({
            key: '',
            excelTitle: '菜单路径',
            rowNo: index + 2,
            sheet: '菜单',
            cellValue: row.menu_path,
            info: `菜单路径中的模块信息【${moduleNameFromPath}】不存在`,
          })
        }
      }
    }
  });
  return msg;
}

// 校验项：【字段】：数值类型的录入框是否为inputNumber
let checkTypeNumber = ({sheetRuleAll}: any) => {
  let msg: any = [];
  let sheetField = sheetRuleAll.find((item: any) => item.sheetName === '字段');
  let sheetFieldData = sheetField?.data || [];
  // 遍历【字段.sheet】
  sheetFieldData.forEach((row: any, index: any) => {
    let isNumberType = DDBunit2ADBUtil.isNumberType({ dictFieldType: row?.dict_field_type });``
    let bbb: any = {
      key: 'form_items.type',
      rowNo: index + 2,
      sheet: '字典构建',
      cellValue: row.form_item_type,
      info: '表单项类型应为InputNumber',
      validValue: 'InputNumber',
    };
    if (isNumberType && row.form_item_type && row.form_item_type.toLowerCase() !== 'inputnumber') {
      bbb.excelTitle = '表单项类型';
      msg.push(bbb);
    }
    if (isNumberType && row.filter_item_type && row.filter_item_type.toLowerCase() !== 'inputnumber') {
      bbb.excelTitle = '筛选项类型';
      msg.push(bbb);
    }
  });
  return msg;
}

excelV2Validator.run = (param: any) => {
  let { excelData, pageFrom } = param;
  let sheetModule = (excelData.find((item: any) => item.type === 'module'))?.data || [];
  let sheetField = (excelData.find((item: any) => item.type === 'field'))?.data || [];
  let sheetDictTable = (excelData.find((item: any) => item.type === 'dictTable'))?.data || [];
  let sheetMenu = (excelData.find((item: any) => item.type === 'menu'))?.data || [];
  let sheetTableField = (excelData.find((item: any) => item.type === 'tableField'))?.data || []; // node env ns
  let msg: any = [];

  // 设置字段sheet行隔断标记
  sheetField.forEach((row: any, index: any) => {
    let haveValueFieldNum: any = 0;
    Object.keys(row).forEach((key: any) => {
      if (row[key]) {
        haveValueFieldNum++;
      }
    });
    if (haveValueFieldNum === 1 && row.dict_field_name_main) {
      row.isDivider = true;
    }
  });

  // 全部校验项
  let sheetRuleAll = [
    { rule: sheetRulesModule, data: sheetModule, sheetName: '模块' },
    { rule: sheetRulesField, data: sheetField, sheetName: '字典构建' },
    { rule: sheetRulesDictTable, data: sheetDictTable, sheetName: '表管理' },
    { rule: ENV_TYPE === 'node' ? sheetRulesMenuNs : sheetRulesMenu, data: sheetMenu, sheetName: '菜单' },
    { rule: sheetRulesTableField, data: sheetTableField, sheetName: '表' }, // node env ns
  ];

  // 校验项：固定录入内容校验、数值校验项、数字或字母校验项、必录校验项
  let msg1 = checkFixedContend({sheetRuleAll});

  // 校验项：【模块.sheet】【字典构建.sheet】【表管理.sheet】：'数据字典'字段
  let msg2 = ENV_TYPE !== 'node' ? checkDictName({sheetRuleAll}) : [];
  msg2 = pageFrom === 'onlineEdit' ? [] : msg2; // 在线采集时不校验

  // 校验项：【菜单构建】：'组件'字段 = ./common/automatic_page -> '菜单路径'字段: /aaa/bbb/cfgp/test_app_mts_tssb
  let msg3 = checkAutomaticPage({sheetRuleAll});
  msg3 = pageFrom === 'onlineEdit' ? [] : msg3; // 在线采集时不校验

  // 校验项：【字段】：数值类型的录入框是否为inputNumber
  let msg4 = ENV_TYPE !== 'node' ? checkTypeNumber({sheetRuleAll}) : [];
  msg4 = pageFrom === 'onlineEdit' ? [] : msg4; // 在线采集时不校验

  msg = [ ...msg1, ...msg2, ...msg3, ...msg4 ];
  msg = orderBy(msg, ['sheet', 'rowNo'], ['asc', 'asc'])
  return msg;
}

excelV2Validator.singleExcelMsgNodeFront = (excelMsg: any) => {
  let tmpNode: any = [];
  let isShow: any = false;
  for (let i = 0; i < excelMsg.length; i++) {
    if (excelMsg[i]?.msg?.length > 0) {
      isShow = true;
      tmpNode.push(<div style={{margin: '12px 0 0 0'}}>
        <ProCard title={excelMsg[i]?.name || ''}>
          <List
            itemLayout="horizontal"
            dataSource={excelMsg[i].msg || []}
            className='excel_msg'
            renderItem={(item: any, index: number) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<>
                      <Avatar className='em_avatar' shape="square" gap={6} size={20} >{index + 1}</Avatar>
                  </>}
                  title={<div className='excel_msg_title'>
                    <span className='em_posi'>异常填报位置</span>
                    <span className='em_sheet'><b>{item.sheet}</b>sheet页</span>
                    <span className='em_title'><b>{item.excelTitle}</b>单元格</span>
                    <span className='em_rowno'>第<b>{item.rowNo}</b>行</span>
                  </div>}
                  description={<>
                    { item?.cellValue && <div className='em_cell_value'>录入值：{item?.cellValue || ''}</div>}
                    { item?.validValue && <div className='em_valid_value'>合法值：{item?.validValue || ''}</div>}
                    { item?.info && <div className='em_info'>异常信息：{item?.info || ''}</div>}
                  </>}
                />
              </List.Item>
            )}
          />
        </ProCard>
      </div>)
    }
  }
  return isShow && <>
    <Typography.Title level={4} style={{marginTop: '24px'}}>前端校验结果</Typography.Title>
    <div style={{marginBottom: '24px'}}>{tmpNode}</div>
  </>;
}
export default excelV2Validator;