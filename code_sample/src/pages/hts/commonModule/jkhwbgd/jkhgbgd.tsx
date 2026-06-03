/**
 * title: 海关进口货物报关单
 * creator: wxl
 */
import React, { useImperativeHandle, useState } from 'react';
import { Modal, Button, Table, message, Spin } from 'antd';
import myUtil from '@/pages/common/myUtil';
import './style.less';
import pro from '@/pages/common/proConfig';
import cktsUtil from '@/pages/common/cktsUtil';

export interface DDModalGridProps {
	onRef?: any;
	visible?: any;
}

const Index: React.FC<DDModalGridProps> = ({ onRef, visible = false }) => {
	const [masker, setMasker] = useState(false);
	const [ckVisible, setCkVisible] = useState(visible);
	// 报关单信息
	const [bgdxx, setBgdxx] = React.useState<any>({});
	const [bgdTable, setBgdTable] = React.useState<any>([]);
	const [ckbgdh, setCkbgdh] = React.useState<any>('');

	//绑定组件
	useImperativeHandle(onRef, () => {
		return {
			showModal,
		};
	});

	const showModal = (params: any, ckbgd: any, body: any) => {
		setCkVisible(true);
		setCkbgdh(ckbgd);
		setBgdxx(body?.form);
		setBgdTable(body?.rows)
	};

	const columns = [
		{ title: '商品序号', dataIndex: 'xh4', align: 'center', width: 70 },
		{ title: '商品编号', dataIndex: 'ckspDm', align: 'center', width: 100 },
		{
			title: '商品名称、规格型号', dataIndex: 'ggxh', align: 'left', render: (text: any, row: any) => (
				<div>{row.ckspmc}<div>{row.ggxh}</div></div>
			)
		},
		// {
		// 	title: '数量/单位', dataIndex: 'bgdsldw', align: 'center', width: 140, render: (text: any, row: any) => (
		// 		<div>法定数量/法定单位<div>第二数量/第二单位<div>申报数量/申报单位</div></div></div>
		// 	)
		// },
		{
			title: '数量及单位', dataIndex: 'fdQnt', align: 'center', width: 140, render: (text: any, row: any) => (
				<span>{myUtil.text.formatNum(row.cksl, '0, 0.00000')} {row.hgjldwmc}<br />
					{myUtil.text.formatNum(row.decksl, '0, 0.00000')} {row.dejldwmc}<br />
					{myUtil.text.formatNum(row.cjsl1, '0, 0.00000')} {row.sbjldwmc}</span>
			)
		},
		{ title: '原产国（地区）', dataIndex: 'bgdmdg', align: 'center', width: 110, render: (text: any, row: any) => (
			<><div>{row.ycggjhdqjc}</div><div>{row.ycggjhdqjc ? "(" + row.ycggjhdqszDm + ")" : ''}</div></>
		) },
		{ title: '单价', dataIndex: 'sbdj', align: 'right', width: 80, render: (text: any, row: any) => (
			<div>{myUtil.text.formatNum(text, '0, 0.0000')}</div>
		) },
		{
			title: '总价', dataIndex: 'cjzj', align: 'right', width: 100, render: (text: any) => (
				<span>{myUtil.text.formatNum(text, '0,0.00')}</span>
			)
		},
		{
			title: '币制', dataIndex: 'cjhghbzmDm', align: 'center', width: 70, render: (text: any, row: any) => (
				<div>{row.cjhghbzmDm}<div>{row.hbmc}</div></div>
			)
		},
		{ title: '征免', dataIndex: 'bgdzm', align: 'center', width: 60, render: (text: any, row: any) => (
			<><div>{row.zjmsfsmc}</div><div>{row.zjmsfsdm ? "(" + row.zjmsfsdm + ")" : ''}</div></>
		) },
	]

	// 打印
	const exportData = async () => {
		const url = '/hx/ty/report/pdfInZipExportGet/PDF_REPORT_SJGLSAAS_HGSJCX_SB_HGJKHWBGD/';  
		const param = {
			dylx: 'bgdhs',
			bgdhs: ckbgdh
		};
		setMasker(true);
		await cktsUtil.downloadFileCkts(url, param);
		setMasker(false);
	};

	return (
		<Modal
			title='报关单'
			visible={ckVisible}
			wrapClassName='standard-modal-1'
			width={pro.c_modal_width_x4}
			onCancel={() => setCkVisible(false)}
			footer={(
				<div style={{ textAlign: 'center' }}>
					<Button onClick={() => exportData()} type="primary">打印</Button>
					<Button onClick={() => setCkVisible(false)}>关闭</Button>
				</div>
			)}
			maskClosable={true}
		>
		<Spin tip="Loading..." spinning={masker} delay={100}>

			<div className="lay_wrap_hgckhwbgd" style={{
				overflowX: 'auto',
				height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', '10px'])
			}}>
				<h1 style={{ marginTop: '10px', textAlign: 'center' }}>中华人民共和国海关进口货物报关单</h1>

				<div style={{ margin: '20px auto', width: '977px', padding: '0 20px' }}>
					<div>
						<span id="text-ylrbh">
							<strong>
								预录入编号：{bgdxx.ylrbh}
							</strong>
						</span>
						<span id="text-hgbh" style={{ float: 'right' }}>
							<strong>
								海关编号：<span id='bgd-hgbh'>{ckbgdh}</span>
							</strong>
						</span>
					</div>
					<table className="ckbgd-table">
						<thead>
							<tr>
								<td colSpan={2} className="label-name noborder-b" width="150px">
									进口口岸
								</td>
								<td colSpan={4} className="label-name noborder-b" width="326px">
									备案号
								</td>
								<td colSpan={2} className="label-name noborder-b" width="141px">
									进口日期:
								</td>
								<td colSpan={4} className="label-name noborder-b" width="326px">
									申报日期
								</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td colSpan={2} className="label-name" width="150px">
									{bgdxx.ckka}
								</td>
								<td colSpan={4} className="label-name" width="326px">
									{bgdxx.bah}
								</td>
								<td colSpan={2} className="label-name" width="141px">
									<span id='bgd-ckrq'>{bgdxx.ckrq1}</span>
								</td>
								<td colSpan={4} className="label-name" width="326px">
									{bgdxx.sbrq}
								</td>
							</tr>
							<tr>
								<td colSpan={2} className="label-name noborder-b">
									境内收发货人
								</td>
								<td colSpan={4} className="label-name noborder-b">
									运输方式
								</td>
								<td colSpan={2} className="label-name noborder-b">
									运输工具名称
								</td>
								<td colSpan={4} className="label-name noborder-b">
									提运单号
								</td>
							</tr>
							<tr>
								<td colSpan={2} className="label-name">
									<span id='bgd-jydw'>{bgdxx.jydw}</span>
								</td>
								<td colSpan={4} className="label-name">
									{bgdxx.ysfsmc}
								</td>
								<td colSpan={2} className="label-name">
									<span id='bgd-ysgjmc'>{bgdxx.ysgjmc}</span>
								</td>
								<td colSpan={4} className="label-name">
									{bgdxx.tydh}
								</td>
							</tr>
							<tr>
								<td colSpan={2} className="label-name noborder-b">
									消费使用单位
								</td>
								<td colSpan={6} className="label-name noborder-b">
									贸易方式
								</td>
								<td colSpan={2} className="label-name noborder-b">
									征免性质
								</td>
								<td colSpan={2} className="label-name noborder-b">
									征税比例
								</td>
							</tr>
							<tr>
								<td colSpan={2} className="label-name">
									<span id='bgd-fhdw'>{bgdxx.hzdwmc}</span>
								</td>
								<td colSpan={6} className="label-name">
									<span id='bgd-myfs'>{bgdxx.jgfsmc}</span>
								</td>
								<td colSpan={2} className="label-name">
									{bgdxx.zmxzmc}
								</td>
								<td colSpan={2} className="label-name">
									{bgdxx.zmxzbl ? bgdxx.zmxzbl + '%' : ''}
								</td>
							</tr>
							<tr>
								<td colSpan={2} className="label-name noborder-b">
									许可证号
								</td>
								<td colSpan={4} className="label-name noborder-b">
									启运国（地区）
								</td>
								<td colSpan={2} className="label-name noborder-b">
									装货港
								</td>
								<td colSpan={4} className="label-name noborder-b">
									境内目的地
								</td>
							</tr>
							<tr>
								<td colSpan={2} className="label-name">
									{bgdxx.xkzh}
								</td>
								<td colSpan={4} className="label-name">
									{bgdxx.ydggjhdqjc}
								</td>
								<td colSpan={2} className="label-name">
									{bgdxx.jtgmc}
								</td>
								<td colSpan={4} className="label-name">
									{bgdxx.jnhyd}
								</td>
							</tr>
							<tr>
								<td colSpan={2} className="label-name noborder-b">
									批准文号
								</td>
								<td colSpan={2} className="label-name noborder-b">
									成交方式
								</td>
								<td colSpan={2} className="label-name noborder-b">
									运费
								</td>
								<td colSpan={2} className="label-name noborder-b">
									保费
								</td>
								<td colSpan={4} className="label-name noborder-b">
									杂费
								</td>
							</tr>
							<tr>
								<td colSpan={2} className="label-name">
									{bgdxx.pzwh}
								</td>
								<td colSpan={2} className="label-name">
									<span id='bgd-cjfs'>{bgdxx.hgcjfsmc}</span>
								</td>
								<td colSpan={2} className="label-name">
									<span id='bgd-yf'>{bgdxx.yf}</span>
								</td>
								<td colSpan={2} className="label-name">
									<span id='bgd-bf'>{bgdxx.bf}</span>
								</td>
								<td colSpan={4} className="label-name">
									<span id='bgd-zf'>{bgdxx.zf}</span>
								</td>
							</tr>
							<tr>
								<td colSpan={2} className="label-name noborder-b">
									合同协议号
								</td>
								<td colSpan={4} className="label-name noborder-b">
									件数
								</td>
								<td colSpan={2} className="label-name noborder-b">
									包装种类
								</td>
								<td colSpan={2} className="label-name noborder-b">
									毛重（千克）
								</td>
								<td colSpan={2} className="label-name noborder-b">
									净重（千克）
								</td>
							</tr>
							<tr>
								<td colSpan={2} className="label-name">
									<span id='bgd-htxyh'>{bgdxx.ckhth}</span>
								</td>
								<td colSpan={4} className="label-name">
									{bgdxx.js1}
								</td>
								<td colSpan={2} className="label-name">
									{bgdxx.hgbzzlmc}
								</td>
								<td colSpan={2} className="label-name">
									{bgdxx.mz2}
								</td>
								<td colSpan={2} className="label-name">
									{bgdxx.jz}
								</td>
							</tr>
							<tr>
								<td colSpan={2} className="label-name noborder-b">
									集装箱号
								</td>
								<td colSpan={8} className="label-name noborder-b">
									随附单据
								</td>
								<td colSpan={2} className="label-name noborder-b">
									用途
								</td>
							</tr>
							<tr>
								<td colSpan={2} className="label-name">
									{bgdxx.jzxh}
								</td>
								<td colSpan={8} className="label-name">
									{bgdxx.sfdzdmjh}
								</td>
								<td colSpan={2} className="label-name">
									{bgdxx.ytmc}
								</td>
							</tr>
							<tr>
								<td colSpan={12} className="label-name noborder-b">
									标记唛码及备注
								</td>
							</tr>
							<tr>
								<td colSpan={12} className="label-name">
									{bgdxx.bjmmjbz}
								</td>
							</tr>
							<tr>
								<td colSpan={12} className="label-name" style={{ height: '245px', padding: 0 }}>
									<Table
										dataSource={bgdTable}
										columns={columns}
										pagination={false}
										size="small"
										scroll={{ y: '240px' }}
										className="ckbgd-tb-table"
									/>
								</td>
							</tr>
							<tr>
								<td colSpan={2} className="label-name noborder-b noborder-r">
									税费征收情况
								</td>
								<td colSpan={10} className="label-name noborder-b">
								</td>
							</tr>
							<tr>
								<td colSpan={12} className="label-name">
								</td>
							</tr>
							<tr>
								<td colSpan={2} className="label-name noborder-b noborder-r">
									录入员
								</td>
								<td colSpan={2} className="label-name noborder-b">
									录入单位
								</td>
								<td colSpan={4} className="label-name noborder-b">
									兹声明以上申报无讹并承担法律责任
								</td>
								<td colSpan={4} className="label-name noborder-b">
									海关审单批注及放行日期（签章）
								</td>
							</tr>
							<tr>
								<td colSpan={2} className="label-name noborder-r">
								</td>
								<td colSpan={2} className="label-name">
								</td>
								<td colSpan={4} className="label-name noborder-b">
								</td>
								<td colSpan={4} className="label-name noborder-b">
								</td>
							</tr>
							<tr>
								<td colSpan={4} className="label-name noborder-b noborder-r">
								</td>
								<td colSpan={4} className="label-name noborder-b">
								</td>
								<td colSpan={2} className="label-name noborder-b noborder-r" width="165px">
									审单
								</td>
								<td colSpan={3} className="label-name noborder-b">
									审价
								</td>
							</tr>
							<tr>
								<td colSpan={4} className="label-name noborder-b noborder-r">
									报关员
								</td>
								<td colSpan={4} className="label-name noborder-b">
								</td>
								<td colSpan={2} className="label-name noborder-r">
								</td>
								<td colSpan={3} className="label-name">
								</td>
							</tr>
							<tr>
								<td colSpan={4} className="label-name noborder-b noborder-r">
								</td>
								<td colSpan={4} className="label-name noborder-b">
									申报单位（签章）
								</td>
								<td colSpan={2} className="label-name noborder-b noborder-r">
									征税
								</td>
								<td colSpan={3} className="label-name noborder-b noborder-r">
									统计
								</td>
							</tr>
							<tr>
								<td colSpan={4} className="label-name noborder-b noborder-r">
									单位地址
								</td>
								<td colSpan={4} className="label-name noborder-b">
								</td>
								<td colSpan={2} className="label-name noborder-r">
								</td>
								<td colSpan={3} className="label-name">
								</td>
							</tr>
							<tr>
								<td colSpan={4} className="label-name noborder-b noborder-r">
								</td>
								<td colSpan={4} className="label-name noborder-b">
								</td>
								<td colSpan={2} className="label-name noborder-b noborder-r">
									查验
								</td>
								<td colSpan={3} className="label-name noborder-b">
									放行
								</td>
							</tr>
							<tr>
								<td colSpan={2} className="label-name noborder-r">
									邮编
								</td>
								<td colSpan={2} className="label-name noborder-r">
									电话
								</td>
								<td colSpan={4} className="label-name">
									填制日期
								</td>
								<td colSpan={2} className="label-name noborder-r">
								</td>
								<td colSpan={2} className="label-name">
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			</Spin>
		</Modal>
	);
};

export default Index;
