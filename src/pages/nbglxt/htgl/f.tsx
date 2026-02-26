import React from 'react';
import myUtil from '@/components/DDAssist/util';
import { message } from 'antd';
import { cloneDeep, isEqual } from 'lodash';

const Func: any = {
  refUnit: React.createRef(),
};

// 表单保存成功后回调
Func.afterFormSaveSuccess = () => {
  myUtil.code.updateCodeTableByKeys(['code_dm_def_contract']);
  myUtil.code.updateCodeTableByKeys(['code_dm_def_contract_jd']);
  myUtil.code.updateCodeTableByKeys(['code_dm_def_contract_jd2']);
  myUtil.code.updateCodeTableByKeys(['code_dm_def_project_contract']);
  myUtil.treeCode.updateCodeTableByKeys(['code_dm_def_contract_jd2']);
}

// 表单删除成功后回调
Func.afterFormDeleteSuccess = () => {
  myUtil.code.updateCodeTableByKeys(['code_dm_def_contract']);
  myUtil.code.updateCodeTableByKeys(['code_dm_def_contract_jd']);
  myUtil.code.updateCodeTableByKeys(['code_dm_def_contract_jd2']);
  myUtil.code.updateCodeTableByKeys(['code_dm_def_project_contract']);
  myUtil.treeCode.updateCodeTableByKeys(['code_dm_def_contract_jd2']);
}

// 设置回款表单：项目、合同阶段的下拉项
const setOptions: any = (param: any) => {
  const { form, formItems, setFormItems, handleModalVisible, unitKey } = param;
  let codeDmProContract =  myUtil.code.getCode('code_dm_def_project_contract');   // 获取码表：项目 & 合同
  let codeDmPro =  myUtil.code.getCode('code_dm_def_project');                    // 获取码表：项目
  let codeDmProContractJd =  myUtil.code.getCode('code_dm_def_contract_jd');      // 获取码表：阶段
  let currentContractId = param?.config?.leaf_config.dictFieldValue;              // 当前选择的合同id
  let formItemNew: any = [];
  let linkPro: any = []; // 关联到当前合同的项目 下来列表展示项
  codeDmProContract.forEach((contractItem: any) => {
    if (contractItem?.name === currentContractId) {
      let projectTmp = codeDmPro.find((proItem: any) => { return proItem.code === contractItem.code });
      linkPro.push({...projectTmp,
        value: projectTmp.code,
        label: projectTmp.name,
      });
    }
  });
  let linkJd: any = []; // 关联到当前合同的阶段 下来列表展示项
  codeDmProContractJd.forEach((jdItem: any) => {
    if (jdItem?.nbgl_contract_id === currentContractId) {
      linkJd.push({
        ...jdItem,
        value: jdItem.code,
        label: jdItem.name,
      });
    }
  });
  formItems.forEach((formItem: any) => {
    if (formItem?.name === 'projectId') {
      delete formItem.codeTable;
      let tmp01: any = {
        ...formItem,
        list: linkPro,
      }
      if (linkPro.length === 1) { // 如果合同只关联一个项目，则设置当前项目为默认值
        tmp01.defaultValue = linkPro[0].value;
      }
      formItemNew.push(tmp01);
    } else if (formItem?.name === 'nbglContractJdId') {
      let tmp02: any = {
        ...formItem,
        list: linkJd,
      }
      if (linkJd.length === 1) { // 如果合同只关联一个阶段，则设置当前项目为默认值
        tmp02.defaultValue = linkJd[0].value;
      }
      formItemNew.push(tmp02);
    } else {
      formItemNew.push({...formItem});
    }
  });
  setFormItems(formItemNew);
}

// 表单新建初始化
Func.initAddForm = (param: any) => {
  const { form, handleModalVisible, unitKey } = param;
  if (unitKey === 'nbgl_xmgl_xmhthkjlxxb') { // 项目合同回款管理
    setOptions(param);
  } else if (unitKey === 'nbgl_xmgl_xmhtxxb') { // 项目合同管理
    form.setFieldsValue({
      xmhtjdxx: [{}],
    });
  }
  handleModalVisible(true);
}

// 表单编辑初始化
Func.initEditForm = (param: any) => {
  const { handleModalVisible, unitKey } = param;
  if (unitKey === 'nbgl_xmgl_xmhthkjlxxb') { // 项目合同回款管理
    setOptions(param);
  }
  handleModalVisible(true);
}

// 表单提交前调用
Func.formBeforeSubmit = (param: any) => {
  let nbglHtje = param?.param?.nbglHtje; // 合同金额
  if (!nbglHtje) {
    return true;
  }
  let xmhtjdxx = param?.param?.xmhtjdxx || []; // 合同阶段信息
  let xmhtjdxxSum = 0;
  xmhtjdxx.forEach((item: any) => { // 遍历sheet
    if (item.nbglJdje) {
      xmhtjdxxSum = xmhtjdxxSum + Number(item.nbglJdje);
    }
  });
  if (xmhtjdxxSum > Number(nbglHtje)) {
    message.info('阶段金额合计不能大于合同金额');
    return false;
  }
  return true;
}

export default Func;