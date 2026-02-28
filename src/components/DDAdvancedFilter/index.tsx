import React, { useEffect, useState } from 'react';
import { FloatButton, Row, Col, Space, Tree, Button, Typography, Divider, DatePicker, Input, Flex, Tag, Select, InputNumber, Switch, message } from 'antd';
import { DeleteOutlined, PlusOutlined, PlusCircleOutlined, CodeOutlined } from '@ant-design/icons';
import myUtil from '../DDAssist/util';
import { itemType } from '../DDForm/data.d';
import { cloneDeep } from 'lodash';
import dayjs from "dayjs";
import './style.less';
import DDBunit2ADBUtil from '../DDBunit/DDBunit2ADBUtil';
import CONSTANTS from '../DDAssist/constants';
import DDIT_TOOL_CONSTANTS from '../DDBunit/excelConfig.v2.constants';

const CONFIG_KEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

// 测试数据 树
const testDataAdfTreeData1: any = [
  {conditionId:  myUtil.text.uuid(), lop: 'and', isGroup: true, switchIsDisabled: true, children: [
    {conditionId:  myUtil.text.uuid(), dict_field_rel_table: 'nbgl_qx_rygl', selectVal: 'nbgl_qx_rygl___ckbgdh___2', dict_field_name: 'ckbgdh', lop: 'and', value: '陈', op: 'in', dict_field_type: 'varchar(32)', type: itemType.Input, inputIsShow: true, switchIsDisabled: true },
    {conditionId:  myUtil.text.uuid(), lop: 'and', isGroup: true, children: [
      {conditionId:  myUtil.text.uuid(), dict_field_rel_table: 'nbgl_qx_rygl', selectVal: 'nbgl_qx_rygl___mylaj___5', dict_field_name: 'mylaj', lop: 'and', value: '99999.99', op: 'dydy', dict_field_type: 'decimal(15,2)', type: itemType.InputNumber, inputIsShow: true, switchIsDisabled: true },
      {conditionId:  myUtil.text.uuid(), dict_field_rel_table: 'nbgl_qx_rygl', selectVal: 'nbgl_qx_rygl___mylaj___5', dict_field_name: 'mylaj', lop: 'and', value: '1000.99', op: 'dydy', dict_field_type: 'decimal(15,2)', type: itemType.InputNumber, inputIsShow: true },
      {conditionId:  myUtil.text.uuid(), dict_field_rel_table: 'nbgl_qx_rygl', selectVal: 'nbgl_qx_rygl___ckrq1___3', dict_field_name: 'ckrq1', lop: 'and', value: 1716307200000, op: 'dydy', dict_field_type: 'date', type: itemType.DatePicker, inputIsShow: true },
      {conditionId:  myUtil.text.uuid(), dict_field_rel_table: 'nbgl_qx_rygl', selectVal: 'nbgl_qx_rygl___ckrq1___3', dict_field_name: 'ckrq1', lop: 'and', value: 1716927200000, op: 'xydy', dict_field_type: 'date', type: itemType.DatePicker, inputIsShow: true },
    ]},
  ]},
  {conditionId:  myUtil.text.uuid(), lop: 'or', isGroup: true, children: [
    {conditionId:  myUtil.text.uuid(), dict_field_rel_table: 'nbgl_qx_rygl', selectVal: 'nbgl_qx_rygl___jgfsDm___4', dict_field_name: 'jgfsDm', lop: 'and', value: '1', op: 'in', dict_field_type: 'varchar(32)', type: itemType.Select, inputIsShow: true, switchIsDisabled: true, codeTable: 'code_dm_ckts_hgzfjsfs' },
    {conditionId:  myUtil.text.uuid(), dict_field_rel_table: 'nbgl_qx_rygl', selectVal: 'nbgl_qx_rygl___jgfsDm___4', dict_field_name: 'jgfsDm', lop: 'or', value: ['1', '3'], op: 'in', dict_field_type: 'varchar(32)', type: itemType.Select, inputIsShow: true, codeTable: 'code_dm_ckts_hgzfjsfs' },
  ]},
  {conditionId:  myUtil.text.uuid(), lop: 'or', isGroup: true, children: [
    {conditionId:  myUtil.text.uuid(), dict_field_rel_table: 'nbgl_qx_rygl', selectVal: 'nbgl_qx_rygl___jgfsDm___4', dict_field_name: 'jgfsDm', lop: 'and', value: ['1'], op: 'in', dict_field_type: 'varchar(32)', type: itemType.Select, inputIsShow: true, switchIsDisabled: true, codeTable: 'code_dm_ckts_hgzfjsfs' },
  ]},
  {conditionId:  myUtil.text.uuid(), lop: 'or', isGroup: true, children: [
    {conditionId:  myUtil.text.uuid(), dict_field_rel_table: 'nbgl_qx_rygl', selectVal: 'nbgl_qx_rygl___ckrq1___3', dict_field_name: 'ckrq1', lop: 'and', value: [1716927200000, 1716927200000], op: 'range', dict_field_type: 'date', type: itemType.DatePicker, inputIsShow: true, switchIsDisabled: true },
  ]}
];
const testDataAdfTreeData2: any = cloneDeep(testDataAdfTreeData1[0].children);
const testDataAdfTreeData3: any = cloneDeep(testDataAdfTreeData1[1].children);
const testDataAdfTreeData4: any = cloneDeep(testDataAdfTreeData1[0].children[1].children);
const testDataAdfTreeData5: any = cloneDeep(testDataAdfTreeData1[2].children);
const testDataAdfTreeData6: any = cloneDeep(testDataAdfTreeData1[3].children);

// 测试数据 高级筛选：方案
export const testDataAdfPlan: any = [
  { adfName: '筛选方案11', adfId: '1001', adfNameIsShow: false, adfNameCurrentUsed: false, onEdit: false, adfTree: testDataAdfTreeData2 },
  { adfName: '高级方案22', adfId: '1002', adfNameIsShow: false, adfNameCurrentUsed: true, onEdit: true, adfTree: testDataAdfTreeData1 },
  { adfName: '筛选方案33', adfId: '1003', adfNameIsShow: false, adfNameCurrentUsed: false, onEdit: false, adfTree: testDataAdfTreeData3 },
  { adfName: '筛选方案44', adfId: '1004', adfNameIsShow: false, adfNameCurrentUsed: false, onEdit: false, adfTree: testDataAdfTreeData4 },
  { adfName: '高级方案55', adfId: '1005', adfNameIsShow: false, adfNameCurrentUsed: false, onEdit: false, adfTree: testDataAdfTreeData5 },
  { adfName: '高级方案66', adfId: '1006', adfNameIsShow: false, adfNameCurrentUsed: false, onEdit: false, adfTree: testDataAdfTreeData6 },
];

const defaultNewAdfName: any = '新建临时方案';

// 测试数据 高级筛选：筛选字段
// dict_field_rel_table___dict_field_name 会存在重复，如同时码表代码和码表名称，下拉列表需要同时关联dict_field_id字段，避免重复
export const testDataAdfField: any =[
  { dict_field_id: '1', dict_field_rel_table: 'nbgl_qx_rygl', dict_field_name: 'ckhth', dict_field_desc: '出口合同号', dict_field_type: 'varchar(32)', type: DDBunit2ADBUtil.getFieldInputType({ dict_field_type: 'varchar(32)' }) },
  { dict_field_id: '2', dict_field_rel_table: 'nbgl_qx_rygl', dict_field_name: 'ckbgdh', dict_field_desc: '报关单号', dict_field_type: 'varchar(32)', type: DDBunit2ADBUtil.getFieldInputType({ dict_field_type: 'varchar(32)' }) },
  { dict_field_id: '3', dict_field_rel_table: 'nbgl_qx_rygl', dict_field_name: 'ckrq1', dict_field_desc: '出口日期', dict_field_type: 'date', type: DDBunit2ADBUtil.getFieldInputType({ dict_field_type: 'date' }) },
  { dict_field_id: '4', dict_field_rel_table: 'nbgl_qx_rygl', dict_field_name: 'jgfsDm', dict_field_desc: '监管方式', dict_field_type: 'varchar(32)', type: DDBunit2ADBUtil.getFieldInputType({ dict_field_type: 'varchar(32)', haveCodeTable: true }), codeTable: 'code_dm_ckts_hgzfjsfs' },
  { dict_field_id: '5', dict_field_rel_table: 'nbgl_qx_rygl', dict_field_name: 'mylaj', dict_field_desc: '美元离岸价', dict_field_type: 'decimal(15,2)', type: DDBunit2ADBUtil.getFieldInputType({ dict_field_type: 'decimal(15,2)' }) },
];

// 高级筛选：筛选条件 DatePicker
const conditionDatePicker: any =[
  CONSTANTS.FILTER_CONDITION.range,
  CONSTANTS.FILTER_CONDITION.equal,
  CONSTANTS.FILTER_CONDITION.notEqual,
  CONSTANTS.FILTER_CONDITION.greaterThan,
  CONSTANTS.FILTER_CONDITION.greaterThanOrEqual,
  CONSTANTS.FILTER_CONDITION.lessThan,
  CONSTANTS.FILTER_CONDITION.lessThanOrEqual,
  CONSTANTS.FILTER_CONDITION.isNull,
  CONSTANTS.FILTER_CONDITION.isNotNull,
];

// 高级筛选：筛选条件 Select
const conditionSelect: any =[
  CONSTANTS.FILTER_CONDITION.in,
  CONSTANTS.FILTER_CONDITION.notIn,
];

// 高级筛选：筛选条件 Input
const conditionInput: any =[
  CONSTANTS.FILTER_CONDITION.equal,
  CONSTANTS.FILTER_CONDITION.notEqual,
  CONSTANTS.FILTER_CONDITION.include,
  CONSTANTS.FILTER_CONDITION.notInclude,
  CONSTANTS.FILTER_CONDITION.startWith,
  CONSTANTS.FILTER_CONDITION.startEnd,
  CONSTANTS.FILTER_CONDITION.isNull,
  CONSTANTS.FILTER_CONDITION.isNotNull,
];

// 高级筛选：筛选条件 InputNumber
const conditionInputNumber: any =[
  CONSTANTS.FILTER_CONDITION.equal,
  CONSTANTS.FILTER_CONDITION.notEqual,
  CONSTANTS.FILTER_CONDITION.greaterThan,
  CONSTANTS.FILTER_CONDITION.greaterThanOrEqual,
  CONSTANTS.FILTER_CONDITION.lessThan,
  CONSTANTS.FILTER_CONDITION.lessThanOrEqual,
  CONSTANTS.FILTER_CONDITION.isNull,
  CONSTANTS.FILTER_CONDITION.isNotNull,
];

// 格式化树数据
export const formatTreeData = (treeData: any) => {
  // function formatting(treeData: any) {
  //   // 从当前数组中取出需要处理的条目索引
  //   const newArr = cloneDeep(treeData);
  //   let indexArr: any[] = [];
  //   treeData.forEach((item: any, index: any) => {
  //     if (item.children && item.children.length > 0) {
  //       newArr[index].children = formatting(item.children);
  //     } else if (item.op === 'range') {
  //       indexArr.push(index);
  //     };
  //   });
  //   if (indexArr.length > 0) {
  //     // 循环条目索引集合，由于每次会像指定位置修改并插入一条数据，所以下一次循环时对应修改位置需要向后挪一位，也就是索引+1
  //     let counter: any = 0;
  //     indexArr.forEach((item: any) => {
  //       const inserPosition = item + counter;
  //       const data = newArr[inserPosition]
  //       newArr[inserPosition] = { ...data, op: 'dydy', value: data.value[0] }
  //       newArr.splice(inserPosition + 1, 0, { ...data, op: 'xydy', value: data.value[1] });
  //       counter++;
  //     })
  //   }
  //   return newArr;
  // }
  function formatting(treeData: any) {
    const newArr = cloneDeep(treeData);
    treeData.map((item: any, index: any) => {
      if (item.children && item.children.length > 0) {
        newArr[index].children = formatting(item.children);
      } else if (item.op === 'range') {
        newArr[index] = {
          lop: item.lop,
          children: [
            { ...item, lop: 'and', op: CONSTANTS.FILTER_CONDITION.greaterThanOrEqual.condetionCode, value: item.value[0] },
            { ...item, lop: 'and', op: CONSTANTS.FILTER_CONDITION.lessThanOrEqual.condetionCode, value: item.value[1] },
          ]
        }
      };
    });
    return newArr;
  }
  // 调用格式化方法
  const finalArray = formatting(treeData);
  return finalArray;
}

export type DDAdvancedFilterProps = {
  pAdfPlan?: any;
  pAdfField?: any;
  onSearch?: any;
  unitKey?: any;
  onChangePlan?: any;
};

const DDAdvancedFilter: React.FC<DDAdvancedFilterProps> = ({
  pAdfPlan = testDataAdfPlan,
  pAdfField = testDataAdfField,
  onSearch,
  unitKey,
  onChangePlan,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [advancedFilterPlan, setAdvancedFilterPlan] = useState<any>(pAdfPlan);     // 高级筛选：方案
  const [advancedFilterField, setAdvancedFilterField] = useState<any>(pAdfField);  // 高级筛选：筛选字段
  const [showSql, setShowSql] = useState<any>(true);                               // 是否显示SQL伪代码

  // 下拉列表 筛选字段
  const getSelectField = () => {
    let optionTmp: any = [];
    // debugger;
    advancedFilterField.forEach((item: any) => {
      let dictName: any = ENV_TYPE === 'node' ? item.dict_name : item.dict_field_rel_table;
      optionTmp.push({ value: `${dictName}___${item.dict_field_name}___${item.dict_field_id}`, label: item.dict_field_desc });
      // optionTmp.push({ value: `${item.dict_field_rel_table}___${item.dict_field_name}___${item.dict_field_id}`, label: item.dict_field_desc });
    });
    return optionTmp;
  }

  // 下拉列表 筛选条件
  const getSelectCondition = (nodeData: any) => {
    let tmpType = nodeData.type
    let tmpSelOption: any = [];
    if (tmpType === itemType.DatePicker) {
      tmpSelOption = conditionDatePicker;
    } else if (tmpType === itemType.InputNumber) {
      tmpSelOption = conditionInputNumber;
    } else if (tmpType === itemType.Input) {
      tmpSelOption = conditionInput;
    } else if (tmpType === itemType.Select) {
      tmpSelOption = conditionSelect;
    }
    let optionTmp: any = [];
    tmpSelOption.forEach((item: any) => {
      optionTmp.push({
        value: item.condetionCode,
        label: <span>{`${item.conditionCodeDesc}${item.conditionDescChi}`}</span>
      })
    });
    return optionTmp;
  }

  // 高级筛选 用于显示的高级筛选方案
  const getAdvancedFilterPlanShow = () => {
    const tagReactNode: any = [];
    advancedFilterPlan?.forEach((item: any) => {
      let { adfId, adfName, onEdit } = item;
      let commonTagProp: any = {
        color: onEdit ? '#ff4d4f' : '#0a6ed1',
        style: { cursor: 'pointer', marginInlineEnd: '4px' },
        closeIcon: true,
        onClick: () => {
          let tmpPlanArr = cloneDeep(advancedFilterPlan);
          tmpPlanArr.forEach((item2: any) => {
            if (item2.adfId === item.adfId) {
              item2.onEdit = true;
            } else {
              item2.onEdit = false;
            }
          });
          setAdvancedFilterPlan([...tmpPlanArr]);
          let tmpTreeIdArr: any = [];
          treeRecursive(item.adfTree, tmpTreeIdArr);  // 获取树所有id并拼接成数组
          setExpandedKeys(tmpTreeIdArr);          // 设置树展开节点
        },
        onClose: (e: any) => {
          e.preventDefault();
          let tmpPlanArr = cloneDeep(advancedFilterPlan);
          tmpPlanArr = tmpPlanArr.filter((item2: any) => {
            return adfId !== item2.adfId;
          });
          setAdvancedFilterPlan([...tmpPlanArr]);
          if (unitKey) {
            // 获取 1、所有配置 2、当前业务单元配置
            let planTmp = myUtil.sys.getCustomerConfigByKey({customer_config_key: 'adf_plan', unitKey});
            let adf_plan =  planTmp.all;
            let existPlanTmp = planTmp.current;
            existPlanTmp = existPlanTmp.filter((item2: any) => {
              return item.adfId !== item2.adfId;
            });
            adf_plan[unitKey] = existPlanTmp;
            // 保存至 sessionStore  ?? 可删除 ？？？？？？？？？？？？？？？？？
            myUtil.sys.saveCustomerConfigByKey({customer_config_key: 'adf_plan', customer_config_value: adf_plan});
            // 保存至 用户表
            myUtil.sys.saveCustomerConfig({ customer_config_key: 'adf_plan', customer_config_value: adf_plan, showResponseInfo: true });
          }
          afterSavePlan();
        },
      }
      // 判断每个方式是否已保存
      if (unitKey) {
        let customerConfig22: any = myUtil.sessionStore.getItem('customerConfig') || {};
        let adf_plan22: any = customerConfig22.adf_plan || {};
        let existPlanTmp: any = adf_plan22[unitKey] || [];
        // let existPlanTmp: any = localStorePlan[unitKey] || [];
        let tmpPlanInLocalStore = existPlanTmp.find((item2: any) => {
          return item.adfId === item2.adfId;
        });
        if (!tmpPlanInLocalStore) {
          adfName += '（未保存）';
        }
      }

      tagReactNode.push(<Tag key={adfId} { ...commonTagProp }>{adfName}</Tag>);
    });
    return tagReactNode;
  }

  // 变更方案
  const modifyPlan = ({ treeData }: any) => {
    let tmpPlanArr = cloneDeep(advancedFilterPlan);
    let tmpOnEdit = tmpPlanArr.find((tmp: any) => { return tmp.onEdit });
    tmpOnEdit.adfTree = treeData;
    setAdvancedFilterPlan([...tmpPlanArr]);
    let tmpTreeIdArr: any = [];
    treeRecursive(treeData, tmpTreeIdArr);  // 获取树所有id并拼接成数组
    setExpandedKeys(tmpTreeIdArr);          // 设置树展开节点
  }

  // 树操作 新建树节点
  const addTreeNode = ({data, event, isGroup}: any) => {
    event?.stopPropagation();
    let targetconditionId: any;
    let targetCondition: any;
    let currentTreeData = cloneDeep(getPlanTreeOnEdit());
    let newConditionItem: any = {conditionId: myUtil.text.uuid(), selectVal: '', dict_field_name: '', lop: 'and'};
    if (data) { // 非根节点
      targetconditionId = data?.conditionId;
      targetCondition = myUtil.tree.findNodeInTree({ tree: currentTreeData, targetId: targetconditionId, idText: 'conditionId' });
      if (!data?.children || data?.children?.length === 0) {
        newConditionItem.switchIsDisabled = true;
      }
    }
    if (isGroup) {
      newConditionItem.isGroup = true;
      newConditionItem.children = [];
    } else {
      newConditionItem.type = itemType.Input;
      newConditionItem.inputIsShow = true;
    }
    if (data) { // 非根节点
      targetCondition.children.push(newConditionItem);
    } else { // 根节点
      if (currentTreeData.length > 0) {
        currentTreeData.push({ ...newConditionItem });
      } else {
        currentTreeData.push({ ...newConditionItem, switchIsDisabled: true });
      }
    }
    modifyPlan({ treeData: currentTreeData });
  };

  // 树操作 删除树节点
  const delTreeNode = (data: any, event: any) => {
    event.stopPropagation();
    let targetconditionId = data.conditionId;
    let currentTreeData = getPlanTreeOnEdit();
    let tmpTreeWithRoot = {
      conditionId: '-1',
      children: currentTreeData,
    }
    myUtil.tree.deleteNode({ tree: tmpTreeWithRoot, targetId: targetconditionId, parent: tmpTreeWithRoot, idText: 'conditionId'});
    modifyPlan({ treeData: cloneDeep(tmpTreeWithRoot?.children) });
  };

  // 变更筛选条件
  const onChangeCondition = ({value, nodeData, targetKey}: any) => {
    let inputValueTmp: any = value?.target?.value || value;
    // debugger;
    if (targetKey === 'value' && nodeData?.type === itemType.DatePicker) {
      if (nodeData.op === 'range') {
        inputValueTmp = [(new Date(value[0].format('YYYY-MM-DD'))).getTime(), (new Date(value[1].format('YYYY-MM-DD'))).getTime()]
      } else {
        inputValueTmp = (new Date(value.format('YYYY-MM-DD'))).getTime();
      }
    }
    let currentTreeData = getPlanTreeOnEdit();
    let targetconditionId = nodeData.conditionId;
    let targetCondition = myUtil.tree.findNodeInTree({ tree: currentTreeData, targetId: targetconditionId, idText: 'conditionId' });
    targetCondition[targetKey] = inputValueTmp;
    // debugger;
    if (targetKey === 'dict_field_name') { // 变更: 字段
      let tmpArr = inputValueTmp.split('___'); // dict_field_rel_table___dict_field_name___dict_field_id
      let tmpFieldObj = advancedFilterField.find((tmp: any) => {
        let dictName: any = ENV_TYPE === 'node' ? tmp.dict_name : tmp.dict_field_rel_table;
        return dictName === tmpArr[0] && tmp.dict_field_name === tmpArr[1] && tmp.dict_field_id === tmpArr[2];
        // return tmp.dict_field_rel_table === tmpArr[0] && tmp.dict_field_name === tmpArr[1] && tmp.dict_field_id === tmpArr[2];
      }) || {};
      targetCondition.type = Number(tmpFieldObj?.type || itemType.Input);
      targetCondition[CONFIG_KEY.DICT_FIELD_REL_TABLE] = tmpFieldObj[CONFIG_KEY.DICT_FIELD_REL_TABLE];
      targetCondition[CONFIG_KEY.DICT_FIELD_TYPE] = tmpFieldObj[CONFIG_KEY.DICT_FIELD_TYPE];
      targetCondition[CONFIG_KEY.DICT_FIELD_NAME] = tmpFieldObj[CONFIG_KEY.DICT_FIELD_NAME];
      targetCondition[CONFIG_KEY.DICT_FIELD_ID] = tmpFieldObj[CONFIG_KEY.DICT_FIELD_ID];
      targetCondition[CONFIG_KEY.DICT_FIELD_FLAG] = tmpFieldObj[CONFIG_KEY.DICT_FIELD_FLAG];
      targetCondition[CONFIG_KEY.DICT_FIELD_ALIAS] = tmpFieldObj[CONFIG_KEY.DICT_FIELD_ALIAS];
      targetCondition[CONFIG_KEY.DICT_NAME] = tmpFieldObj[CONFIG_KEY.DICT_NAME];
      // debugger;
      targetCondition.selectVal = inputValueTmp;
      targetCondition.codeTable = tmpFieldObj?.codeTable;
      // 改变字段，清空选择条件和筛选内容录入框
      delete targetCondition.op;
      delete targetCondition.value;
    } else if (targetKey === 'lop') { // 变更: 组合条件
      targetCondition[targetKey] = value ? 'and' : 'or';
    } else if (targetKey === 'op') {
      targetCondition.inputIsShow = true;
      if (value === 'isEmpty' || value === 'isNotEmpty') {
        // 选择为空或不为空，清空并隐藏筛选内容录入框
        delete targetCondition.value;
        targetCondition.inputIsShow = false;
      }
    }
    modifyPlan({ treeData: cloneDeep(currentTreeData) });
  };

  // 保存方案后回调
  const afterSavePlan = () => {
    if (onChangePlan) {
      onChangePlan({adfPlan: advancedFilterPlan});
    }
  }

  // 保存方案
  const saveAdfPlanToLocalStore = async ({newAdfPlan, showResponseInfo}: any) => {
    if (unitKey) {
      if (!checkTreeData(cloneDeep(getPlanTreeOnEdit()))) {
        return;
      }
      // 保存方案
      let planTmp = myUtil.sys.getCustomerConfigByKey({customer_config_key: 'adf_plan', unitKey});
      let adf_plan =  planTmp.all || {};
      adf_plan[unitKey] = newAdfPlan || advancedFilterPlan;
      // 保存方案到 用户表
      myUtil.sys.saveCustomerConfig({ customer_config_key: 'adf_plan', customer_config_value: adf_plan, showResponseInfo });
      afterSavePlan();
    }
  }

  const getSqlTxt = (treeData: any) => {
    let tmpSql: any = [];
    const treeRecursive = (targetTreeData: any = []) => {
      let nodeSqlBracketleft: any = '(';
      let nodeSqlBracketRight: any = ')';
      let nodeSqlLop: any = (item: any) => item.lop;
      targetTreeData.forEach((item: any, index: any) => {
        if (item.children && item.children.length > 0) {
          if (index === 0) {
            tmpSql.push(nodeSqlBracketleft);
          } else {
            tmpSql.push(`${nodeSqlLop(item)} ${nodeSqlBracketleft}`);
          }
          treeRecursive(item.children);
          tmpSql.push(nodeSqlBracketRight);
        } else {
          let dictName: any = item.dict_name;
          let opObj: any = {};
          let fieldVal: any = item.value?.toString() || '';
          Object.keys(CONSTANTS.FILTER_CONDITION).forEach((key) => {
            if (CONSTANTS.FILTER_CONDITION[key].condetionCode === item.op) {
              opObj = CONSTANTS.FILTER_CONDITION[key];
            }
          });
          if (opObj?.conditionCodeDesc === '=' || opObj?.conditionCodeDesc === '<>') {
            fieldVal = `'${fieldVal}'`;
          }
          if (opObj?.conditionCodeDesc === 'like' || opObj?.conditionCodeDesc === 'not like') {
            fieldVal = `'%${fieldVal}%'`;
          }
          if (opObj?.conditionCodeDesc === 'llike') {
            fieldVal = `'${fieldVal}%'`;
          }
          if (opObj?.conditionCodeDesc === 'rlike') {
            fieldVal = `'%${fieldVal}'`;
          }
          if (opObj?.conditionCodeDesc === 'in' || opObj?.conditionCodeDesc === 'not in') {
            fieldVal = fieldVal.replaceAll(",", "','")
            fieldVal = `('${fieldVal}')`;
          }
          let tmpGroup: any = `${nodeSqlBracketleft} ${dictName}.${item.dict_field_name} ${opObj?.conditionCodeDesc} ${fieldVal} ${nodeSqlBracketRight}`;
          if (index === 0) {
            tmpSql.push(tmpGroup);
          } else {
            tmpSql.push(`${nodeSqlLop(item)} ${tmpGroup}`);
          }
        }
      });
    };
    treeRecursive(treeData);
    let tmpSqlTxt = tmpSql.join(' ');
    return tmpSqlTxt;
  }

  // 拼装sql伪代码
  const getSql = () => {
    let tmpSql: any = [];
    let getLopStyle = (tmp: any) => {
      return { color: tmp.lop === 'and' ? '#e38000' : '#339c00' };
    }
    const treeRecursive = (targetTreeData: any = []) => {
      let getNodeSqlBracketleft = () => <span key={`bracket-left-${tmpSql.length}`} className='sql_bracket'>(</span>;
      let getNodeSqlBracketRight = () => <span key={`bracket-right-${tmpSql.length}`} className='sql_bracket'>(</span>;
      let nodeSqlLop: any = (item: any) => {
        return <span key={`lop-${tmpSql.length}`} style={getLopStyle(item)} className='sql_lop'>{item.lop}</span>
      };
      targetTreeData.forEach((item: any, index: any) => {
        if (item.children && item.children.length > 0) {
          if (index === 0) {
            tmpSql.push(getNodeSqlBracketleft());
          } else {
            tmpSql.push(<span key={`span-${tmpSql.length}`} className=''>
              {nodeSqlLop(item)}
              {getNodeSqlBracketleft()}
            </span>);
          }
          treeRecursive(item.children);
          tmpSql.push(getNodeSqlBracketRight());
        } else {
          let dictName: any = ENV_TYPE === 'node' ? item.dict_name : item.dict_field_rel_table;
          let opObj: any = {};
          let fieldVal: any = item.value?.toString() || '';
          Object.keys(CONSTANTS.FILTER_CONDITION).forEach((key) => {
            if (CONSTANTS.FILTER_CONDITION[key].condetionCode === item.op) {
              opObj = CONSTANTS.FILTER_CONDITION[key];
            }
          });
          if (opObj?.conditionCodeDesc === '=' || opObj?.conditionCodeDesc === '<>') {
            fieldVal = `'${fieldVal}'`;
          }
          if (opObj?.conditionCodeDesc === 'like' || opObj?.conditionCodeDesc === 'not like') {
            fieldVal = `'%${fieldVal}%'`;
          }
          if (opObj?.conditionCodeDesc === 'llike') {
            fieldVal = `'${fieldVal}%'`;
          }
          if (opObj?.conditionCodeDesc === 'rlike') {
            fieldVal = `'%${fieldVal}'`;
          }
          if (opObj?.conditionCodeDesc === 'in' || opObj?.conditionCodeDesc === 'not in') {
            fieldVal = fieldVal.replaceAll(",", "','")
            fieldVal = `('${fieldVal}')`;
          }
          let tmpGroup: any = <React.Fragment key={`group-frag-${tmpSql.length}`}>
            {getNodeSqlBracketleft()}
            <span className='sql_prop'><b className='sql_table'>{`${dictName}.`}</b><b>{item.dict_field_name}</b></span>
            <span className='sql_condition'>{opObj?.conditionCodeDesc}</span>
            <span className='sql_value'>{fieldVal}</span>
            {getNodeSqlBracketRight()}
          </React.Fragment>
          if (index === 0) {
            tmpSql.push(<div key={`group-${tmpSql.length}`} className='sql_group'>
              {tmpGroup}
            </div>);
          } else {
            tmpSql.push(<div key={`group-${tmpSql.length}`} className='sql_group'>
              {nodeSqlLop(item)}
              {tmpGroup}
            </div>);
          }
        }
      });
    };
    let tmpPlayTree = getPlanTreeOnEdit();
    treeRecursive(tmpPlayTree);
    let sqlTxt = getSqlTxt(tmpPlayTree);
    return <div className='sql_wrap'>{tmpSql}</div>;
  }

  // 树数据校验
  const checkTreeData = (treeData: any) => {
    let errorMsg: any = [];
    const recursiveFind = (nodes: any) => {
      for (let i = 0; i < nodes.length; i++) {
        let nodeTmp = nodes[i] || {};
        if (nodeTmp?.children?.length > 0) {
          recursiveFind(nodeTmp?.children);
        } else {
          let { selectVal, op, value } = nodeTmp;
          if (op === 'isEmpty' || op === 'isNotEmpty') {
            if (!selectVal || !op) {
              errorMsg.push({ info: '请补全筛选字段、筛选条件、筛选值', });
            }
          } else {

            if (!selectVal || !op || !value) {
              errorMsg.push({ info: '请补全筛选字段、筛选条件、筛选值', });
            }
          }
        }
      }
    }
    recursiveFind(treeData);
    if (errorMsg.length > 0) {
      message.error(errorMsg[0].info);
      return false;
    }
    return true;
  }

  // 查询
  const onAdfSearch = () => {
    let tmpTreeOnEdit = cloneDeep(getPlanTreeOnEdit());
    if (!checkTreeData(tmpTreeOnEdit)) {
      return;
    }
    // myUtil.tree.deleteTargetKey({
    //   tree: tmpTreeOnEdit,
    //   // targetKey: [ 'conditionId', 'dict_field_rel_table', 'inputIsShow', 'selectVal', 'type', 'codeTable', 'isGroup', 'switchIsDisabled' ],
    //   targetKey: [ 'conditionId', 'inputIsShow', 'selectVal', 'type', 'codeTable', 'isGroup', 'switchIsDisabled' ],
    // });
    tmpTreeOnEdit = formatTreeData(tmpTreeOnEdit);
    if (onSearch) {
      // myUtil.modal.confirm({
      //   title: '操作提示',
      //   content: '需要保存为方案吗',
      //   icon: 'info',
      //   onOk() {
          advancedFilterPlan?.forEach((item: any) => {
            item.adfNameCurrentUsed = false;
            // myUtil.tree.deleteTargetKey({
            //   tree: item.adfTree,
            //   // targetKey: [ 'conditionId', 'inputIsShow', 'selectVal', 'type', 'codeTable', 'isGroup', 'switchIsDisabled' ],
            //   targetKey: [ 'conditionId', 'inputIsShow', 'type', 'codeTable', 'isGroup', 'switchIsDisabled' ],
            // });
          });
          getPlanOnEdit().adfNameIsShow = true;
          getPlanOnEdit().adfNameCurrentUsed = true;
          saveAdfPlanToLocalStore({showResponseInfo: false});
          afterSavePlan();
          onSearch({
            adfPlan: advancedFilterPlan,
            adfTreeOnEdit: tmpTreeOnEdit,
          });
        // },
        // onCancel() {
        //   onSearch({
        //     adfPlan: advancedFilterPlan,
        //     adfTreeOnEdit: tmpTreeOnEdit,
        //   });
        // }
      // });
    }
    // 拼接sql
    getSql();
  }

  // 清空筛选条件
  const clearFilterSearchModal = () => {
    modifyPlan({ treeData: []});
  }

  // 获取正在编辑的方案
  const getPlanOnEdit: any = () => {
    let tmpOnEdit = advancedFilterPlan.find((tmp: any) => { return tmp.onEdit });
    return tmpOnEdit;
  }

  // 获取正在编辑的方案树
  const getPlanTreeOnEdit: any = () => {
    let tmpPlanTree = getPlanOnEdit()?.adfTree || [];
    return tmpPlanTree;
  }

  // 改变方案名称
  const changePlanTitle: any = (changedText: any) => {
    let tmpPlanArr = cloneDeep(advancedFilterPlan) || [];
    let tmpPlanOnEdit = tmpPlanArr.find((tmp: any) => { return tmp.onEdit });
    tmpPlanOnEdit.adfName = changedText;
    setAdvancedFilterPlan(tmpPlanArr);
  }

  // 获取树所有id并拼接成数组
  const treeRecursive = (targetTreeData: any = [], targetId: any) => {
    targetTreeData.forEach((item: any) => {
      if (item.children && item.children.length > 0) {
        targetId.push(item.conditionId);
        treeRecursive(item.children, targetId);
      }
    });
    return expandedKeys;
  };

  // 新建方案
  const addNewAdfPlan = () => {
    let tmpPAdfPlan = cloneDeep(advancedFilterPlan) || [];
    tmpPAdfPlan.forEach((tmp: any) => { tmp.onEdit = false });
    let tmpNewAdfPlanOnEdit = {
      adfId: myUtil.text.uuid(),
      onEdit: true,
      adfName: defaultNewAdfName,
    };
    tmpPAdfPlan.push(tmpNewAdfPlanOnEdit);
    setAdvancedFilterPlan(tmpPAdfPlan);
  };

  // useEffect
  useEffect(() => {
    // debugger;
    let tmpPAdfPlan = cloneDeep(pAdfPlan) || [];
    let tmpOnEdit = tmpPAdfPlan.find((tmp: any) => { return tmp.onEdit });  // 获取编辑状态中的方案
    if (!tmpOnEdit) { // 新建临时方案
      tmpOnEdit = {
        adfId: myUtil.text.uuid(),
        onEdit: true,
        adfName: defaultNewAdfName,
      };
      tmpPAdfPlan.push(tmpOnEdit);
    }
    let expandedKeys: any = [];
    treeRecursive(tmpOnEdit?.adfTree || [], expandedKeys);  // 获取树所有id并拼接成数组
    setExpandedKeys(expandedKeys);                          // 设置树展开节点
    setAdvancedFilterPlan(tmpPAdfPlan);
  // }, [pAdfPlan]);
  }, []);

  // DataPicker 快速选择
  const rangePresets: any = [
    { label: '最近7天', value: myUtil.date.getRecentNDay(7).dayjsFormat},
    { label: '最近14天', value: myUtil.date.getRecentNDay(14).dayjsFormat},
    { label: '最近30天', value: myUtil.date.getRecentNDay(30).dayjsFormat},
    { label: '最近90天', value: myUtil.date.getRecentNDay(90).dayjsFormat},
    { label: '本周', value: myUtil.date.getCurrentWeek().dayjsFormat },
    { label: '上周', value: myUtil.date.getLastWeek().dayjsFormat },
    { label: '下周', value: myUtil.date.getNextWeek().dayjsFormat },
    { label: '本月', value: myUtil.date.getCurrentMonth().dayjsFormat },
    { label: '上月', value: myUtil.date.getLastMonth().dayjsFormat },
    { label: '下月', value: myUtil.date.getNextMonth().dayjsFormat },
    { label: '本季度', value: myUtil.date.getCurrentQuarter().dayjsFormat },
    { label: '上季度', value: myUtil.date.getLastQuarter().dayjsFormat },
    { label: '下季度', value: myUtil.date.getNextQuarter().dayjsFormat },
    { label: '今年', value: myUtil.date.getCurrentYear().dayjsFormat },
    { label: '去年', value: myUtil.date.getLastMonth().dayjsFormat },
    { label: '明年', value: myUtil.date.getNextYear().dayjsFormat },
  ];

  // 获取树节点
  const getTreeNode: any = (nodeData: any) => {
    let inputType = nodeData.type;
    let codeTable = nodeData.codeTable;
    let inputNode: any;
    let inputCommonPro: any = {
      style: { width: '220px' },
      allowClear: true,
      onChange: (param: any) => {onChangeCondition({value: param, nodeData, targetKey: 'value'})},
      placeholder: '请输入筛选内容',
    };
    if (codeTable) {
      let tmpOption: any = myUtil.code.getSelectOption(codeTable);
      const multipleValue = Array.isArray(nodeData.value) ? nodeData.value : nodeData.value ? [nodeData.value] : [];
      inputNode = <Select { ...inputCommonPro } options={tmpOption} mode='multiple' maxTagCount='responsive' value={multipleValue}/>
    } else if (inputType === itemType.Input) {
      const { allowClear, ...inputProps } = inputCommonPro;
      inputNode = <Input { ...inputProps } value={nodeData.value}/>
    } else if (inputType === itemType.DatePicker) {
      let valTmp: any;
      if (nodeData?.op === 'range') {
        if (nodeData?.value) {
          valTmp = [dayjs(new Date(nodeData.value[0])), dayjs(new Date(nodeData.value[1]))]
        }
        inputNode = <DatePicker.RangePicker presets={rangePresets} { ...inputCommonPro } value={valTmp}/>
      } else {
        if (nodeData?.value) {
          valTmp = dayjs(new Date(nodeData.value))
        }
        inputNode = <DatePicker { ...inputCommonPro } value={valTmp}/>
      }
    } else if (inputType === itemType.InputNumber) {
      const { allowClear, ...inputNumberProps } = inputCommonPro;
      inputNode = <InputNumber { ...inputNumberProps } value={nodeData.value} controls={false}/>
    }
    // debugger;
    let treeNodeTmp = <Space>
      <Flex gap="small">
        <Switch defaultChecked checkedChildren="与" unCheckedChildren="或" value={nodeData.lop === 'and' ? true : false}
          disabled={nodeData?.switchIsDisabled}
          onChange={(param: any) => {onChangeCondition({value: param, nodeData, targetKey: 'lop'})}}/>
        {nodeData.isGroup && <React.Fragment key="group-buttons">
          <Button icon={<PlusOutlined />} onClick={(event: any) => addTreeNode({data: nodeData, event})} size='small' type="primary">添加条件</Button>
          <Button icon={<PlusCircleOutlined />}onClick={(event: any) => addTreeNode({data: nodeData, event, isGroup: true})} size='small' type="primary">添加分组</Button>
        </React.Fragment>}
      </Flex>
      {!nodeData.isGroup && <React.Fragment key="non-group-items">
        <Select options={getSelectField()} value={nodeData.selectVal} style={{width: '200px'}} placeholder="请选择字段"
          onChange={(value: any) => {onChangeCondition({value, nodeData, targetKey: 'dict_field_name'})}}/>
        <Select options={getSelectCondition(nodeData)} value={nodeData.op} style={{width: '120px'}} placeholder="请选择条件"
          onChange={(value: any) => {onChangeCondition({value, nodeData, targetKey: 'op'})}}/>
        { nodeData.inputIsShow && inputNode }
      </React.Fragment>}
      <DeleteOutlined onClick={(event: any) => delTreeNode(nodeData, event)} />
    </Space>;
    return treeNodeTmp;
  }

  return <>
    {/* <Row gutter={24} style={{backgroundColor: '#ffffff'}}> */}
    <Row gutter={24}>
      <Col flex="auto">
          <Divider titlePlacement="left" styles={{ content: { margin: '0 0 0 -24px' } }}>
            <Typography.Title level={4} editable={{ onChange: (changedText: any) => {changePlanTitle(changedText)} }}>
              {getPlanOnEdit()?.adfName || defaultNewAdfName}
            </Typography.Title>
          </Divider>
          <Space orientation="vertical" size="large" style={{ display: 'flex' }}>
            <Space>
              <Button type='primary' icon={<PlusOutlined />} onClick={() => {addTreeNode({})}}>添加条件</Button>
              <Button type='primary' icon={<PlusCircleOutlined />} onClick={() => {addTreeNode({ isGroup: true })}}>添加分组</Button>
              <Space.Compact block>
                <Button type='default' onClick={onAdfSearch}>查询</Button>
                <Button type='default' onClick={() => {saveAdfPlanToLocalStore({showResponseInfo: true})}}>保存方案</Button>
                <Button type='default' onClick={clearFilterSearchModal}>清空</Button>
              </Space.Compact>
              <Button icon={<PlusOutlined />} onClick={() => {addNewAdfPlan()}}>新建方案</Button>
            </Space>
            {getPlanTreeOnEdit().length>0 && <Tree
              showLine
              blockNode
              expandedKeys={expandedKeys}
              className='tree_advanced_filter'
              treeData={getPlanTreeOnEdit()}
              // height={myUtil.heightCalc.getCalc(['header', 'cardMargin', '80px'])}
              fieldNames={{ key: 'conditionId', title: 'dict_field_name', children: 'children' }}
              titleRender={(nodeData: any) => getTreeNode(nodeData) }
            />}
          </Space>
      </Col>
      <Col flex="300px">
        <Divider titlePlacement="left" styles={{ content: { margin: '0 0 0 -24px' } }}>
          <Typography.Title level={4}>我的方案</Typography.Title>
        </Divider>
        <Flex gap="12px 12px" wrap>
          { getAdvancedFilterPlanShow() }
        </Flex>
      </Col>
    </Row>
    {showSql && <React.Fragment key="sql-row">
      {/* {<Row gutter={24} style={{backgroundColor: '#ffffff'}}> */}
      {<Row gutter={24}>
      <Col flex="auto">
        <Divider titlePlacement="left" styles={{ content: { margin: '0 0 0 -24px' } }}>
          <Typography.Title level={4} >
            SQL伪代码
          </Typography.Title>
        </Divider>
        <div style={{margin: '0 0 20px 0'}}>{getSql()}</div>
      </Col>
    </Row>}
    </React.Fragment>}
    <FloatButton onClick={() => setShowSql(!showSql)} icon={<CodeOutlined />} tooltip={`${showSql ? '隐藏' : '显示'}SQL伪代码`} />
  </>
};

export default DDAdvancedFilter;