import pdfUtil from '@/components/DDAssist/util/pdfUtil';
import myUtil from '@/components/DDAssist/util';
import { queryList, startProc, procexeUpdate, queryProcBsAndTasks } from '@/services/hts/api';
import { history } from '@umijs/max';
import { message, notification } from 'antd';

const customerBuss: any = {};

// 列表工具类
customerBuss.exportResumePDF = async (funParam: any) => {
  // pdfUtil.exportPDF({});
  // return;
  // console.info('customerBuss~~', funParam, event);

  // 0 数据整理
  let record: any = funParam.record || {};
  let param1: any = {page: 1, pageSize: 999999, searchModel: [
    {
      dict_field_name: 'staffUuid',
      dict_name: 's_eg_staff_education',
      op: 'eq',
      property: 'staffUuid',
      type: 4,
      value: record.staffUuid,
    }
  ]};
  let param2: any = {page: 1, pageSize: 999999, searchModel: [
    {
      dict_field_name: 'staffUuid',
      dict_name: 'eg_m_staff_work_exp',
      op: 'eq',
      property: 'staffUuid',
      type: 4,
      value: record.staffUuid,
    }
  ]};
  const dataEdu: any = await queryList(param1, 'eg_m_staff_education');
  const dataWorkExp: any = await queryList(param2, 'eg_m_staff_work_exp');
  let eduTmp: any = dataEdu?.body?.rows || [];
  let eduPdf: any = [];
  for (let i = 0; i < eduTmp.length; i++) {
    let tmpRow = [ `${myUtil.date.formatDate(eduTmp[i].timeStart, 'YYYY-MM-DD')} ~ ${myUtil.date.formatDate(eduTmp[i].timeEnd, 'YYYY-MM-DD')}`, eduTmp[i].graduationSchool, eduTmp[i].major];
    eduPdf.push(tmpRow);
  }
  let workExpTmp: any = dataWorkExp?.body?.rows || [];
  let workExpPdf: any = [];
  for (let i = 0; i < workExpTmp.length; i++) {
    let tmpRow = [ `${myUtil.date.formatDate(workExpTmp[i].timeStart, 'YYYY-MM-DD')} ~ ${myUtil.date.formatDate(workExpTmp[i].timeEnd, 'YYYY-MM-DD')}`, workExpTmp[i].company, workExpTmp[i].position];
    workExpPdf.push(tmpRow);
  }

  const doc = pdfUtil.pdfInit(); // 初始化jsPDF

  // 1 basicInfo
  const renderBasicInfo = () => {
    let basicInfo = [];
    basicInfo.push([`姓名: ${record.staffName}`, `身份证号: ${record.staffIdcard}`, `联系电话: ${record.staffPhone}` ]);
    basicInfo.push([
      `出生日期: ${record.staffBirthday}`,
      `文化程度: ${myUtil.code.getCodeValByKey(record.staffDegree, 'code_dm_education')}`,
      `婚姻状况: ${myUtil.code.getCodeValByKey(record.staffMarried, 'code_dm_married')}`,
    ]);
    pdfUtil.generatePDFTitle({ doc, title: '基本信息', CoordinateY: 10 });
    pdfUtil.generatePDFForm({ doc, data: basicInfo, CoordinateY: 20 });
  }

  // 2 education 教育表格
  let tmpCoordinateY1 = 45
  const renderEducation = () => {
    pdfUtil.generatePDFTitle({ doc, title: '教育经历', CoordinateY: tmpCoordinateY1 });
    pdfUtil.generatePDFGrid({
      doc,
      CoordinateY: tmpCoordinateY1 + 11,
      head: [
        { content: '求学时间', styles: { cellWidth: 50 } },
        { content: '毕业学校' },
        { content: '所学专业' },
      ],
      body: eduPdf,
    });
  }

  // 3 experience 经历卡片
  let tmpCoordinateY2 = tmpCoordinateY1 + (eduPdf.length + 1) * 9 + 14;
  const renderExperience = () => {
    pdfUtil.generatePDFTitle({ doc, title: '工作经历', CoordinateY: tmpCoordinateY2 });
    pdfUtil.generatePDFGrid({
      doc,
      CoordinateY: tmpCoordinateY2 + 11,
      head: [
        { content: '工作时间', styles: { cellWidth: 50 } },
        { content: '单位名称' },
        { content: '担任职位' },
      ],
      body: workExpPdf,
    });
  }

  // 4 renderOther 其他
  // function renderOther() {
  //   pdfUtil.generatePDFTitle({ doc, title: '自我介绍', CoordinateY: 208, hasBg: false });
  //   pdfUtil.generatePDFText({ doc, text: 'resumeData.description', CoordinateY: 215 });
  // }

  // 5 执行渲染
  renderBasicInfo();
  renderEducation();
  renderExperience();
  // renderOther();
  doc.save(`${record.staffIdcard}_${record.staffName}.pdf`);
};

// #region 工作流 *********

// 打开流程
customerBuss.openModalFlow = (funParam: any) => {
  let record: any = funParam?.record || {};
  // 兼容 Node(eggjs) 后端的蛇形字段 xtgl_process_data 与 Java 后端的驼峰 xtglProcessData
  let xtglProcessDataStr = record.xtgl_process_data || record.xtglProcessData;
  let xtglProcessDataS = xtglProcessDataStr ? JSON.parse(xtglProcessDataStr) : '';
  const state: any = {
    data: xtglProcessDataS || [],
    record,
  };
  history.push('/splc/cfgp/nbgl_process_def/flow_edit', state);
}

// 打开流程 readonly
customerBuss.openModalFlowReadonly = (funParam: any) => {
  let record: any = funParam?.record || {};
  // 兼容 Node(eggjs) 后端的蛇形字段 xtgl_process_run_id 与 Java 后端的驼峰 xtglProcessRunId
  let xtglProcessRunId: any = record.xtgl_process_run_id || record.xtglProcessRunId;
  // 请求体也按 ENV_TYPE 区分：Node 后端的 queryProcBsAndTasks 需要蛇形字段
  let apiParams: any = ENV_TYPE === 'node'
    ? { xtgl_process_run_id: xtglProcessRunId }
    : { xtglProcessRunId };
  queryProcBsAndTasks(apiParams).then((res: any) => {
    // 兼容 Node(eggjs) 后端的蛇形字段 xtgl_process_data 与 Java 后端的驼峰 xtglProcessData
    let processDef: any = res?.body?.processDef || {};
    let xtglProcessDataStr: any = processDef.xtgl_process_data || processDef.xtglProcessData || {};
    let xtglProcessDataS = JSON.parse(xtglProcessDataStr);
    const state: any = {
      data: xtglProcessDataS || [],
      processTaskRun: res?.body?.processTaskRun,
      // record,
      viewFlag: 'readonly',
    };
    history.push('/splc/cfgp/nbgl_process_def/flow_edit', state);
  });
}

// 通用业务功能 工作流 提交审批
customerBuss.cActBpm = (funParam: any, event: any, unitKey: any) => {
  let record: any = funParam?.record || {};
  let xtglBusinessId: any = record[funParam.rowKey || 'uuid'];// 表主键
  let xtglBusinessType: any = unitKey; // 模块名
  let apiParams: any = {
    xtglBusinessType,
    xtglBusinessId,
  };
  myUtil.modal.confirm({
    title: '提交',
    content: '确认要提交审批吗？',
    onOk() {
      startProc(apiParams).then((res: any) => {
        funParam.refGrid?.current?.reload();
        myUtil.modal.responseInfo(res);
      })
    },
  });
}

// 工作流 办理
customerBuss.doFlow = (funParam: any) => {
  let record: any = funParam?.record || {};
  let xtglProcessId: any = record.xtglProcessId;
  let xtglProcessRunId: any = record.xtglProcessRunId;
  let xtglProcessTaskRunId: any = record.xtglProcessTaskRunId;
  let xtglProcessTaskId: any = record.xtglProcessTaskId;
  let xtglProcessTaskFlag: any = '1';
  let xtglProcessTaskContext: any = '...';
  let apiParams: any = {
    xtglProcessId,
    xtglProcessRunId,
    xtglProcessTaskRunId,
    xtglProcessTaskId,
    xtglProcessTaskFlag,
    xtglProcessTaskContext,
  };
  procexeUpdate(apiParams).then((res: any) => {
    const { code, msg } = res;
    if (code === '200') {
      message.success(msg);
    } else {
      message.error(msg);
    }
  })
}

// 工作流 办理按钮是否可用
customerBuss.setDoFlowDisabled = (record: any) => {
  if (record.xtglProcessTaskFlag === '1' || record.xtglProcessTaskFlag === '0') {
    return true;
  }
  return false;
}

// 工作流 提交审批按钮是否可用
// 4-通过   3-不通过    1-待审批    2-进行中    空-未提交
customerBuss.setSubmitFlowDisabled = (record: any) => {
  if (record.xtglProcessRunState === '1' || record.xtglProcessRunState === '2') {
    return true;
  }
  return false;
}

export default customerBuss;
