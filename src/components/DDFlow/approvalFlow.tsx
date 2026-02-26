import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Modal, Button, Descriptions, Timeline, Space, Input, message } from 'antd';
import CONSTANTS from '../DDAssist/constants';
import myUtil from '../DDAssist/util';
import { procexeUpdate, queryProcBsAndTasks, interruptProc, queryForm, automaticPageDef } from '@/services/hts/api';
import { orderBy } from 'lodash';

const items: any = [
	{ key: '1', label: '员工编号', children: '00000000001' },
	{ key: '2', label: '姓名', children: '测试人' },
	{ key: '3', label: '性别', children: '男' },
	{ key: '4', label: '出生日期', children: '1998-8-8' },
	{ key: '5', label: '身份证号', children: '21010119980808080X' },
	{ key: '6', label: '联系电话', children: '13000000000' },
	{ key: '7', label: '入职时间', children: '2022-2-2' },
	{ key: '8', label: '职位', children: '测试职位' },
	{ key: '9', label: '申请内容', children: '测试申请内容', span: 2 },
];

const timelineData = [
	{ name: '测试人1', result: '通过', opinion: '测试意见1', color: '#0da50b', time: '2024-04-01 15:00' },
	{ name: '测试人2', result: '通过', opinion: '测试意见2', color: '#0da50b', time: '2024-04-01 15:48' },
	{ name: '测试人3', result: '未通过', opinion: '测试意见3', color: '#fa0023', time: '2024-04-01 17:15' },
	{ name: '测试人4', result: '未审批', opinion: '测试意见4', color: '#86929e', time: '' },
]

export interface Props {
  onRef?: any;
  visible?: any;
}
const Index: React.FC<Props> = ({
  onRef,
  visible = false,
}) => {
	const [modalVisible, setModalVisible] = useState<boolean>(visible);
	const [timelineItem, setTimelineItem] = useState<any>([]);
	const [approvalOpinion, setApprovalOpinion] = useState<any>('');
	const [approvalCancel, setApprovalCancel] = useState<any>('');
	const [isCancelledForm, setIsCancelledForm] = useState<any>(false);
	const [isReadOnlyForm, setIsReadOnlyForm] = useState<any>(false);
	const [param, setParam] = useState<any>({});
	const [processRun, setprocessRun] = useState<any>({});
	const [processDefForm, setProcessDefForm] = useState<any>([]);
	const [bussForm, setBussForm] = useState<any>([]);
	// const [formItem, setFormItem] = useState<any>([]);

  useEffect(() => {
  }, []);

  // 审批
  const handleSave = (flag: any) => {
		let record: any = param?.record || {};
		let xtglProcessId: any = record.xtglProcessId;
		let xtglProcessRunId: any = record.xtglProcessRunId;
		let xtglProcessTaskRunId: any = record.xtglProcessTaskRunId;
		let xtglProcessTaskId: any = record.xtglProcessTaskId;
		let xtglProcessTaskFlag: any = flag;
		let xtglProcessTaskContext: any = approvalOpinion;
		let xtglProcessRunInterruptReason: any = approvalCancel;
		let apiParams: any;
		if (isCancelledForm) { // 流程中止
			apiParams = {
				xtglProcessRunId,
				xtglProcessRunInterruptReason,
			};
			interruptProc(apiParams).then((res: any) => {
				const { code, msg } = res;
				if (code === '200') {
					message.success(msg);
				} else {
					message.error(msg);
				}
				param.refGrid.current?.reload();
				setModalVisible(false);
			})
		} else { // 流程办理
			apiParams = {
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
				param.refGrid.current?.reload();
				setModalVisible(false);
			})
		}
  }

	// 获取表单码表
	const initCode = async (cols: any) => {
		let param: any = [];
		cols.forEach((item: any) => {
			if (item.formItemType === 'Select' && item.formItemExtend) {
				param.push({ key: item.formItemExtend});
			}
		});
    const promiseArr = myUtil.code.getCodeTablePromise(param);
    if (promiseArr?.length <= 0) {
			return;
		}
		Promise.all(promiseArr)
			.then(() => {})
			.catch(() => { message.error('获取码表失败'); })
			.finally(() => {});
  };

  // 开启
  const showModal = async (param: any) => {
		setIsCancelledForm(param.isCancelledForm);
		setIsReadOnlyForm(param.isReadOnlyForm);
		// debugger
		setParam(param);
    setModalVisible(true);
		setApprovalOpinion('');
		setApprovalCancel('');
		let apiParams: any = {
			xtglProcessRunId: param?.record?.xtglProcessRunId,
		};
		let moduleKey: any;
		let formId: any;
		let formItem: any;
		queryProcBsAndTasks(apiParams).then((res: any) => {
			const { body } = res;
			let { processTaskRun, xtglBusinessData, taskDef }: any = body;
			setprocessRun({...body?.processDef, ...body?.processRun});
			// debugger;
			setProcessDefForm([
				{ key: '1', label: '发起人', children: body?.processRun?.xtglProcessRunOwnerName },
				{ key: '2', label: '发起时间', children: myUtil.date.formatDate(body?.processRun?.xtglProcessRunStartTime, 'YYYY-MM-DD HH:mm:ss') },
				{ key: '3', label: '流程实例状态', children: myUtil.code.getCodeValByKey(body?.processRun?.xtglProcessRunState, 'code_dm_process_run_state') },
				// { key: '3', label: '业务类型', children: body?.processRun?.xtglBusinessType },
			]);
			moduleKey = body?.processRun?.xtglBusinessType;
			formId = body?.processRun?.xtglBusinessId;
			// 审批信息
			const element: any = [];
			processTaskRun = orderBy(processTaskRun, ['xtglProcessTaskRunEndTime'], ['asc'])
			processTaskRun?.forEach((item: any) => {
				let currentXtglProcessTaskId = item.xtglProcessTaskId;
				let currentTask: any = taskDef?.find((item: any) => { return item.xtglProcessTaskId === currentXtglProcessTaskId });
				let taskFlag: any = item.xtglProcessTaskFlag;
				let taskFlagDesc: any = myUtil.code.getCodeValByKey(taskFlag, 'code_dm_task_flag');
				let flagColor: any = '#86929e';
				if (taskFlag === '1') {
					flagColor = '#0da50b'; // 通过
				} else if (taskFlag === '0') {
					flagColor = '#fa0023'; // 未通过
				}
				element.push({
					color: flagColor,
					children: <>
						<div>
							{item.xtglProcessTaskRunApplyUser} <span style={{color: '#878787', marginLeft: '6px'}}>（{currentTask.xtglProcessTaskName}）</span>
							<span style={{color: flagColor, marginLeft: '12px'}}>{taskFlagDesc}</span>
							<span style={{float: 'right', color: '#C8C8C8'}}>{myUtil.date.formatDate(item.xtglProcessTaskRunEndTime, 'YYYY-MM-DD HH:mm:ss')}</span>
						</div>
						<div style={{color: '#878787', lineHeight: '24px', margin: '5px 0 0 0'}}>{item.xtglProcessTaskContext}</div>
					</>})
			})
			setTimelineItem(element);
			// 模块配置信息
			return automaticPageDef(moduleKey);
		}).then((moduleRes: any) => {
			let appTableDict = moduleRes?.body?.appTableDict || [];
			formItem = appTableDict.filter((item2: any) => { return item2.formItemUsed === '1' && item2.formItemType !== 'Title' && item2.formItemType !== 'Hidden' });
			initCode(formItem);
			// 业务表单数据
			return queryForm({ key : moduleKey, uuid : formId }); // 模块配置信息
		}).then((resForm: any) => {
			// console.info('业务表单数据', resForm, formItem);
			let nnn: any = [];
			for (let uuu = 0; uuu < formItem.length; uuu++) {
				let formVal = resForm.body || {};
				let dictFieldAlias = formItem[uuu].dictFieldAlias;
				let formItemType = formItem[uuu].formItemType;
				let formItemFormat = formItem[uuu].formItemFormat;
				let formItemExtend = formItem[uuu].formItemExtend;
				let tmpVal  = formVal[dictFieldAlias];
				if (formItemType === 'DatePicker') { // 日期格式化
					tmpVal = myUtil.date.formatDate(tmpVal, formItemFormat || 'YYYY-MM-DD');
				} else if (formItemExtend) { // 码表格式化
					tmpVal = myUtil.code.getCodeValByKey(tmpVal, formItemExtend);
				} else if (formItemType === 'InputNumber') { // 数值格式化
					tmpVal = myUtil.text.formatNum(tmpVal, formItemExtend || '0,0');
				} else if (formItemType === 'TreeSelect') { // 树格式化
					tmpVal = myUtil.code.getCodeValByKey(tmpVal, formItemExtend);
				}
				let valTmp = {
					key: uuu,
					label: formItem[uuu].dictFieldDesc,
					children: tmpVal,
				};
				nnn.push(valTmp);
				setBussForm(nnn);
			}
		})
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

return <>
	<Modal
		open={modalVisible}
		width={CONSTANTS.C_MODAL_WIDTH_X2}
		wrapClassName='standard-modal'
		footer={<>
			{!isReadOnlyForm && !isCancelledForm && <>
				<Button onClick={() => setModalVisible(false)}>关闭</Button>
				<Button  onClick={() => handleSave('0')}>驳回</Button>
				<Button type="primary" onClick={() => handleSave('1')}>通过</Button>
			</>}
			{isCancelledForm && <Button type="primary" onClick={() => handleSave('1')}>中止</Button>}
		</>}
		onCancel={() => setModalVisible(false)}
		maskClosable={false}
	>
		<Space orientation="vertical" size={12} style={{ display: 'flex' }}>
			<Descriptions size='small' title={processRun.xtglProcessName} column={2} bordered={false} items={processDefForm} />
			<Descriptions size='small'
			// title={`审核信息`}
			column={2} bordered items={bussForm} />
			<Timeline items={timelineItem} style={{marginTop: '20px'}}/>
		</Space>
		{!isReadOnlyForm && !isCancelledForm && <Input.TextArea value={approvalOpinion} placeholder="请输入审批意见" rows={4} onChange={(e: any) => {
			setApprovalOpinion(e.target.value);
		}} />}
		{isCancelledForm && <Input.TextArea value={approvalCancel} placeholder="请输入中止原因" rows={4} onChange={(e: any) => {
			setApprovalCancel(e.target.value);
		}} />}
	</Modal>
</>};

export default Index;