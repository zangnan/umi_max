import React from 'react';
import myUtil from '@/components/DDAssist/util';
import { saveXmbgqe, importXmgl } from '@/services/hts/api';
import * as jsondiffpatch from 'jsondiffpatch';
import { Typography, Tag } from 'antd';
import { itemType } from '@/components/DDForm/data.d';
import assembleConfigUtil from '@/components/DDBunit/assemble_config_util';
import formUtil from '@/components/DDForm/formUtil';
import JsonDiffReact from 'jsondiffpatch-react';

const Func: any = {
  refUnit: React.createRef(),
};

// 表单提交前调用
Func.formBeforeSubmit = (param: any) => {
  const { unitKey } = param;
  if (unitKey === 'nbgl_xmgl_xmjbxxb') { // 项目基本信息管理
    param?.param?.xmhtxx?.map((item1: any) => {
      let tmpContractId = item1.nbglContractId || [];
      let nbglContractId = tmpContractId?.length > 0 ? tmpContractId[0] : '';
      let nbglContractJdId = tmpContractId?.length > 1 ? tmpContractId[1] : '';
      item1.nbglContractId = nbglContractId;
      item1.nbglContractJdId = nbglContractJdId;
    });
  }
  return true;
}

// 表单保存成功后回调
Func.afterFormSaveSuccess = (param: any) => {
  const { unitKey } = param;
  if (unitKey === 'nbgl_xmgl_xmjbxxb') { // 项目基本信息管理
    myUtil.code.updateCodeTableByKeys(['code_dm_def_project']);
    myUtil.code.updateCodeTableByKeys(['code_dm_def_project_contract']);
  }
}

// 表单删除成功后回调
Func.afterFormDeleteSuccess = (param: any) => {
  const { unitKey } = param;
  if (unitKey === 'nbgl_xmgl_xmjbxxb') { // 项目基本信息管理
    myUtil.code.updateCodeTableByKeys(['code_dm_def_project']);
    myUtil.code.updateCodeTableByKeys(['code_dm_def_project_contract']);
  }
}

// 计算利润率预估
const countLrlyg = (param: any) => {
  const { form } = param;
  // 利润率预估计算r1=(预期收入a1-开发成本预估a2-非人力成本预估a3)/预期收入a1
  let a0 = form.getFieldValue('nbglJhgzlRy');           // 计划工作量（人月）
  let a3 = form.getFieldValue('nbglFrlcbygW');          // 非人力成本预估
  let xmhtxx = form.getFieldValue('xmhtxx') || [];      // 合同信息
  let a1: any = 0;                                      // 合同金额不含税
  for (let m = 0; m < xmhtxx?.length; m++) {
    a1 = a1 + Number(xmhtxx[m].nbglHtjeBhs);
  }
  if (a0 && a1 > 0 && a3) {
    let a2 = Number(a0) * 2.8;
    let r1 = (a1 - a2 - Number(a3)) / a1 * 100;
    form.setFieldsValue({
      nbglLrlyg: r1,
    });
  }
}

// 表单事件：OnBlur
Func.eventOnBlur = {
  // 变更人月
  changeJhgzlRy: (param: any) => {
    countLrlyg(param);  // 赋值利润率预估
  },
  // 变更非人力成本
  changeFrlcbyg: (param: any) => {
    countLrlyg(param);  // 赋值利润率预估
  },
}

// 表单事件：OnChange
Func.eventOnChange = {
  // 变更合同
  changeContract2: (param: any) => {
    const { value, form, myItems, setMyItems, field } = param;
    let tmpKey = field.key;
    let codeDmDefContract: any = myUtil.code.getCode('code_dm_def_contract');
    let tmpContract = (codeDmDefContract.find((tmp: any) => { return tmp.code === value[0] }) || {});
    // 表单赋值
    let xmhtxxValue =  form.getFieldValue('xmhtxx') || [];
    xmhtxxValue[tmpKey] = {
      ...xmhtxxValue[tmpKey],
      nbglHtje: tmpContract.nbgl_htje,
      nbglHtjeBhs: tmpContract.nbgl_htje_bhs,
      nbglHtzt: tmpContract.nbgl_htzt,
      nbglKhmc: tmpContract.nbgl_khmc,
      nbglHtyxq: tmpContract.nbgl_htyxq,
    }
    form.setFieldsValue({
      xmhtxx: xmhtxxValue,
    });
    // 赋值利润率预估
    countLrlyg(param);
    // 设置合同阶段下拉内容
    // let index001 = myItems.findIndex((tmp: any) => { return tmp.label === '合同信息'; });
    // let index002 = myItems[index001 + 1].children.findIndex((tmp: any) => { return tmp.label === '合同阶段'; });
    // let linkJd: any = []; // 关联到当前合同的阶段 下来列表展示项
    // let codeDmProContractJd =  myUtil.code.getCode('code_dm_def_contract_jd');      // 获取码表：阶段
    // codeDmProContractJd.forEach((jdItem: any) => {
    //   if (jdItem?.nbgl_contract_id === value) {
    //     linkJd.push({ ...jdItem, value: jdItem.code, label: jdItem.name });
    //   }
    // });
    // myItems[index001 + 1].children[index002].list = linkJd;
    // myItems[index001 + 1].children[index002].type = linkJd.length === 0 ? itemType.Hidden : itemType.Select;
    // myItems[index001 + 1].children[index002].disabled = linkJd.length === 0 ? true : false;
    setMyItems(myItems);
  },
  changeJd: (param: any) => {}
}

// 项目确认
Func.xmqr = (param: any) => {
  const { refUnit, record } = param;
  let apiParam = {
    projectId: record.projectId,
  }
  refUnit.current?.setMasker(true);
  saveXmbgqe(apiParam).then((response: any) => {
    let { code, msg} = response;
    myUtil.modal.responseInfo({code, msg});
    refUnit.current?.setMasker(false);
    if (code === '200') {
      refUnit?.current?.reload();
    }
  })
}

// 弹窗 项目变更
Func.xmbg = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal({...param, formFlag: 'xmbg'});
  }
}

// 弹窗 项目完结
Func.xmwj = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal({...param, formFlag: 'xmwj'});
  }
}

// 弹窗 里程碑config调整
Func.beforeShowSonTableModal = (param: any) => {
  param.grid_columns.shift();
}

// 变更标记 nbglBgbj
// 确认标记 nbglBgqrbj
// 有效标记 nbglYxbj

// 设置默认操作列-编辑 只读属性
Func.setEditDisabled_nbgl_xmgl_xmjbxxb = (param: any) => {
  // 有效标记 !== 1 置灰
  if (param.nbglYxbj !==  '1') {
    return true;
  }
  // 确认标记 === 1 置灰
  if (param.nbglBgqrbj ===  '1') {
    return true;
  }
  return false;
}

// 设置默认操作列-删除 只读属性
Func.setDeleteDisabled_nbgl_xmgl_xmjbxxb = (param: any) => {
  // 有效标记 !== 1 置灰
  if (param.nbglYxbj !==  '1') {
    return true;
  }
  // 确认标记 === 1 置灰
  if (param.nbglBgqrbj ===  '1') {
    return true;
  }
  // 变更标记 === 1 置灰
  if (param.nbglBgbj ===  '1') {
    return true;
  }
  return false;
}

// 设置操作列-变更 只读属性
Func.setXmbgDisabled = (param: any) => {
  // 有效标记 !== 1 置灰
  if (param.nbglYxbj !==  '1') {
    return true;
  }
  // 确认标记 === 1 已确认 置灰
  if (param.nbglBgqrbj ===  '1') {
    return false;
  } else {
    return true;
  }
}

// 设置操作列-确认 只读属性
Func.setXmqrDisabled = (param: any) => {
  // 有效标记 !== 1 置灰
  if (param.nbglYxbj !==  '1') {
    return true;
  }
  // 确认标记 === 1 已确认 置灰
  if (param.nbglBgqrbj ===  '1') {
    return true;
  }
  return false;
}

// 设置操作列-完结 只读属性
Func.setXmwjDisabled = (param: any) => {
  // 有效标记 !== 1 置灰
  if (param.nbglYxbj !==  '1') {
    return true;
  }
  // 确认标记 !== 1 置灰
  if (param.nbglBgqrbj !==  '1') {
    return true;
  }
  return false;
}

// 变更相关字段: 变更因素 变更来源 变更原因 变更发起人 变更审批人 变更时间
let fieldsHidden1 = ['nbglBgys', 'nbglBgly', 'nbglBgyy', 'nbglBgfqr', 'nbglBgspr', 'nbglBz', 'nbglBgsj'];
// 变更相关字段: 表单组标题
let fieldsHidden2 = ['项目变更信息'];
// 展示变更信息中，除了变更字段外的其他无需比较的字段
let fieldHidden3 = ['projectMilestoneId', 'projectPid', 'projectId', 'nbglYxbj', 'nbglBgbj', 'nbglBgqrbj', 'addOrgId', 'addTime', 'addUserId', 'updateOrgId', 'updateTime', 'updateUserId'];

// 表单新建初始化
Func.initAddForm = (param: any) => {
  const { form, handleModalVisible, unitKey, formItems, setFormItems } = param;
  if (unitKey === 'nbgl_xmgl_xmjbxxb') { // 项目基本信息管理
    let formItemsNew: any = [];
    formItems.forEach((item: any) => {
      if (fieldsHidden1.indexOf(item?.name) > -1 || fieldsHidden2.indexOf(item?.label) > -1) {
      } else {
        formItemsNew.push(item);
      }
    });
    setFormItems(formItemsNew);
    form.setFieldsValue({
      xmhtxx: [{}],// nbgl_contract_id
    });
  }
  handleModalVisible(true);
}

// 表单编辑初始化
Func.initEditForm = (param: any) => {
  const { form, handleModalVisible, unitKey, formItems, setFormItems, formValue } = param;
  if (unitKey === 'nbgl_xmgl_xmjbxxb') { // 项目基本信息管理
    if (formValue.nbglBgbj === '0') { // 变更标记 nbglBgbj === 0 未变更过
      let formItemsNew: any = [];
      formItems.forEach((item: any) => {
        if (fieldsHidden1.indexOf(item?.name) > -1 || fieldsHidden2.indexOf(item?.label) > -1) {
        } else {
          formItemsNew.push(item);
        }
      });
      setFormItems(formItemsNew);
    } else {
      setFormItems(formItems);
    }
    let xmhtxx = formValue.xmhtxx || [];
    xmhtxx?.map((item1: any) => {
      let nbglContractId = item1.nbglContractId;
      let nbglContractJdId = item1.nbglContractJdId;
      let nbglContractIdNew = [];
      if (nbglContractId) {
        nbglContractIdNew.push(nbglContractId);
      }
      if (nbglContractJdId) {
        nbglContractIdNew.push(nbglContractJdId);
      }

      item1.nbglContractId = nbglContractIdNew;
    });
    // 表单编辑初始化
    form.setFieldsValue({
      xmhtxx: xmhtxx,
    });
  }
  handleModalVisible(true);
}

let style01: any = { color: myUtil.theme.getColor({type: 'error'}), whiteSpace: 'normal', wordWrap:' break-word', wordBreak: 'break-all' };
let style11: any = { color: myUtil.theme.getColor({type: 'error'}) };
let style12: any = { color: myUtil.theme.getColor({type: 'primary'}) };
let style13: any = { color: myUtil.theme.getColor({type: 'success'}) };

// 比较列表中的字段
let compareObj: any = ({dDey, dLabel, formItem}: any) => {
  let textBefore;
  let textAfter;
  let deltaTag: any;
  if (dDey.length === 1) {
    deltaTag = <span style={style12}>新增</span>;
    textBefore = '空';
    textAfter = dDey[0];
  } else if (dDey.length > 1 && !dDey[1]) {
    deltaTag = <span style={style11}>删除</span>;
    textBefore = dDey[0];
    textAfter = dDey[1] || '空';
  } else {
    deltaTag = <span style={style13}>变更</span>;
    textBefore = dDey[0];
    textAfter = dDey[1] || '空';
  }
  // 字段格式化
  if (formItem?.type === itemType.Select && formItem?.codeTable) {
    if (textBefore && textBefore !== '空') {
      textBefore = myUtil.code.getCodeValByKey(textBefore, formItem?.codeTable)
    }
    if (textAfter && textAfter !== '空') {
      textAfter = myUtil.code.getCodeValByKey(textAfter, formItem?.codeTable)
    }
  } else if (formItem?.type === itemType.DatePicker) {
    if (textBefore && textBefore !== '空') {
      textBefore = myUtil.date.formatDate(textBefore, formItem?.format || 'YYYY-MM-DD');
    }
    if (textAfter && textAfter !== '空') {
      textAfter = myUtil.date.formatDate(textAfter, formItem?.format || 'YYYY-MM-DD');
    }
  }
  // debugger
  let aaa = <div>
    <span>【{deltaTag}】</span>
    <span>{dLabel}：</span>
    <span style={style12}>{textBefore}</span>
    <Typography.Text type="secondary" style={{margin: '0 4px'}}>变更为</Typography.Text>
    <span style={style12}>{textAfter}</span>
  </div>;
  return aaa;
}

// 列表自定义渲染
Func.columnsRender = {
  // 测试用 <JsonDiffReact />
  testTmp: (param: any) => {
    const { record } = param;
    let left: any;
    let right: any;
    if (param.unitKey === 'nbgl_xmgl_xmbgxxb') {
      left = { ...record?.bghnr || {}};
      right = { ...record?.bgqnr || {}};
    } else {
      left = { ...JSON.parse(record?.nbglBghnr) };
      right = { ...JSON.parse(record?.nbglBgqnr) };
    }
    left.lcbbgxx = record?.lcbbgxx?.bghnr || [];
    right.lcbbgxx = record?.lcbbgxx?.bgqnr || [];
    [...fieldsHidden1, ...fieldHidden3].forEach((item: any) => {
      delete left[item];
      delete right[item];
    });
    left.lcbbgxx.forEach((lcbItem: any) => {
      [...fieldsHidden1, ...fieldHidden3].forEach((item: any) => {
        delete lcbItem[item];
      });
    });
    right.lcbbgxx.forEach((lcbItem: any) => {
      [...fieldsHidden1, ...fieldHidden3].forEach((item: any) => {
        delete lcbItem[item];
      });
    });

    [...fieldsHidden1, ...fieldHidden3].forEach((item: any) => {
      delete left[item];
      delete right[item];
    });
    return <JsonDiffReact left={left} right={right} show={false} />;
  },
  // 变更发起人
  bgfqr: (param: any) => {
    const { record } = param;
    let style02: any = { color: myUtil.theme.getColor({type: 'textTertiary', antdToken: param.themeToken}) };
    return <div>
      <div><span style={style02}>发起人：</span>{myUtil.code.getCodeValByKey(record.nbglBgfqr, 'code_dm_def_yg')}</div>
      {record.nbglBgsj && <div><span style={style02}>发起时间：</span>{myUtil.date.formatDate(record.nbglBgsj, 'YYYY-MM-DD HH:mm')}</div>}
    </div>;
  },
  // 变更项目
  bgxm: (param: any) => {
    const { record } = param;
    let left: any = param.unitKey === 'nbgl_xmgl_xmbgxxb' ? { ...record.bgqnr } : { ...JSON.parse(record.nbglBgqnr) };  // 变更后
		let right: any = param.unitKey === 'nbgl_xmgl_xmbgxxb' ? { ...record.bghnr } : { ...JSON.parse(record.nbglBghnr) }; // 变更前
    left = myUtil.text.cleanNullObject(left);
    right = myUtil.text.cleanNullObject(right);
    left.lcbbgxx = record?.lcbbgxx?.bgqnr || [];
    right.lcbbgxx = record?.lcbbgxx?.bghnr || [];
    [...fieldsHidden1, ...fieldHidden3].forEach((item: any) => {
      delete left[item];
      delete right[item];
    });
    left.lcbbgxx.forEach((lcbItem: any) => {
      [...fieldsHidden1, ...fieldHidden3].forEach((item: any) => {
        delete lcbItem[item];
      });
    });
    right.lcbbgxx.forEach((lcbItem: any) => {
      [...fieldsHidden1, ...fieldHidden3].forEach((item: any) => {
        delete lcbItem[item];
      });
    });
    const delta: any = jsondiffpatch.diff(left, right) || {};
    let formItems = param.config.xmjbxxbFormItems;
    let formItemsLcb = param.config.xmlcbxxbFormItems;
    let arrXmbg: any = [];    // 项目变更
    let arrLcbbg: any = [];   // 里程碑变更
    let style02: any = { color: myUtil.theme.getColor({type: 'textTertiary', antdToken: param.themeToken}), margin: '0 5px' };
    Object.keys(delta).forEach(key => {
      let deltaByKey = delta[key];
      if (key === 'lcbbgxx') { // 里程碑变更内容
        Object.keys(deltaByKey).forEach(key2 => {
          let delta22 = deltaByKey[key2];
          Object.keys(delta22).forEach(key22 => {
            let deltaByKey22 = delta22[key22];
            if (Array.isArray(deltaByKey22)) {
              let tmpFormItem: any = formItemsLcb?.find((item: any) => { return item.name === key22});
              let tmpFormItemLabel: any = tmpFormItem.label;
              arrLcbbg.push(compareObj({ dDey: deltaByKey22, dLabel: tmpFormItemLabel, formItem: tmpFormItem }));
            }
          })
        })
      } else {
        let tmpFormItem: any = formItems?.find((item: any) => { return item.name === key});
        let tmpFormItemLabel: any = tmpFormItem?.label;
        arrXmbg.push(compareObj({ dDey: deltaByKey, dLabel: tmpFormItemLabel, formItem: tmpFormItem}));
      }
    });
    return <>
      {arrXmbg}
      {arrLcbbg.length > 0 && <>
        <Typography.Text strong style={{margin: '6px 6px 2px 6px', display: 'inline-block'}}>里程碑变更项</Typography.Text>
        {arrLcbbg}
      </>}
    </>;
  },
  // 工作量预警
  xmyjGzlyj: (param: any) => {
    //有预估：项目已产生总人月/项目预估总人月
    //无预估：按照合同额/1.06/2.8W推算出总人月
    //当工作量预警的数值≥95%。PMO提出工作量预警
    //预警方式:数值≥95%,黄色预警。数值≥100%，红色预警。
    const { record } = param;
    let nbglGzlyj = record.nbglGzlyj || '';
    let node = <></>;
    if (nbglGzlyj) {
      let nbglGzlyjNum = Number(nbglGzlyj);
      if (nbglGzlyjNum > 1) {
        node = <Tag color={myUtil.theme.getColor({type: 'error'})} variant="filled">{nbglGzlyjNum}</Tag>
      } else if (nbglGzlyjNum > 0.95 ) {
        node = <Tag color={myUtil.theme.getColor({type: 'warning'})} variant="filled">{nbglGzlyjNum}</Tag>
      }
    }
    return node;
  },
  // 变更预警
  xmyjBgyj: (param: any) => {
    // ○ 变更0次     △ 变更5次以内     X 偏差5次以上
    const { record } = param;
    let nbglBgyj = record.nbglBgyj || '';
    let node = <></>;
    if (nbglBgyj) {
      let nbglBgyjNum = Number(nbglBgyj);
      if (nbglBgyjNum > 5) {
        node = <Tag color={myUtil.theme.getColor({type: 'error'})} variant="filled">{nbglBgyjNum}</Tag>;
      } else if (nbglBgyjNum > 0 ) {
        node = <Tag color={myUtil.theme.getColor({type: 'warning'})} variant="filled">{nbglBgyjNum}</Tag>;
      }
    }
    return node;
  },
  // 进度预警
  xmyjJdyj: (param: any) => {
    // 进度延期预警：○正常进行中 △延期一周 X延期一周以上
    const { record } = param;
    let nbglJdyj = record.nbglJdyj || '';
    let node = <></>;
    if (nbglJdyj) {
      let nbglJdyjNum = Number(nbglJdyj);
      if (nbglJdyjNum > 7) {
        node = <Tag color={myUtil.theme.getColor({type: 'error'})} variant="filled">{nbglJdyjNum}</Tag>
      } else if (nbglJdyjNum > 0 ) {
        node = <Tag color={myUtil.theme.getColor({type: 'warning'})} variant="filled">{nbglJdyjNum}</Tag>
      }
    }
    return node;
  }
}

// 项目变更页面设置
Func.initXmbg = ({setMyConfig, res, token, moduleKey}: any) => {
  if (res[0].code === '200' && res[1].code === '200') {
    let tmpConfig = assembleConfigUtil.module.assembleAll({
      moduleInfo: res[0].body.moduleInfo,
      appTableDict: res[0].body.appTableDict,
    });
    let tmpConfig2 = assembleConfigUtil.module.assembleAll({
      moduleInfo: res[1].body.moduleInfo,
      appTableDict: res[1].body.appTableDict,
    });
    let style02: any = { color: myUtil.theme.getColor({type: 'textTertiary', antdToken: token}) };
    let style03: any = { whiteSpace: 'normal', wordWrap:' break-word', wordBreak: 'break-all' };
    const expandedRowRender = (record: any) => {
      return <>
        {record.nbglBgly && <div><span style={style02}>变更来源：</span><span style={style03}>{myUtil.code.getCodeValByKey(record.nbglBgly, 'code_dm_pm_bgly')}</span></div>}
        {record.nbglBgys && <div><span style={style02}>变更因素：</span><span style={style03}>{myUtil.code.getCodeValByKey(record.nbglBgys, 'code_dm_pm_bgys')}</span></div>}
        {record.nbglBgyy && <div><span style={style02}>变更原因：</span><span style={style03}>{record.nbglBgyy}</span></div>}
        {record.nbglBz && <div><span style={style02}>备注：</span><span style={style03}>{record.nbglBz}</span></div>}
        {record.nbglBgspr && <div><span style={style02}>审批人：</span>{myUtil.code.getCodeValByKey(record.nbglBgspr, 'code_dm_def_yg')}</div>}
      </>
    };
    let extendConfig: any = {
      xmjbxxbFormItems: tmpConfig.form_items,
      xmlcbxxbFormItems: tmpConfig2.form_items,
      gridParams: {
        expandable: {
          columnWidth: 35,
          size: 'small',
          expandedRowRender,
        },
      }
    };
    // let beforeSetConfig: any;
    let beforeSetConfig = (cc: any) => {
      // console.log("🚀 ~ beforeSetConfig ~ cc:", cc)
      // debugger;
    }
    myUtil.module.initAutomaticPageDef({ module_key: moduleKey, setMyConfig, extendConfig, beforeSetConfig});
  }
}

// 里程碑子表是否可以编辑
Func.isSonTableEdit = ({record}: any) => {
  if (record.nbglBgqrbj === '1') {
    return false;
  }
  return true;
}

// 弹窗 项目基本信息 入口：项目管理 - 项目基本信息管理
Func.drxmjbxx = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal(param);
  }
}

// 弹窗 导入项目人月统计 入口：项目管理 - 项目月报日报管理
Func.drrytj = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
}

// 项目管理 导入 项目基本信息2  项目人月统计1
Func.importXmgl = (param: any, importType: any) => {
  let setMasker: any = param.setMasker;
  let files: any = param.form.getFieldValue('file');
  const formData: any = new FormData();
  formData.append('file', files[0].originFileObj);
  if (setMasker) {
    setMasker(true);
  }
  importXmgl(formData, importType).then((response: any) => {
    let { code, msg} = response;
    param.setModalVisible(false);
    myUtil.modal.responseInfo({code, msg});
    if (setMasker) {
      setMasker(false);
    }
    if (code === '200') {
      param?.parentParam?.refUnit?.current?.reload();
    }
  })
}

export default Func;