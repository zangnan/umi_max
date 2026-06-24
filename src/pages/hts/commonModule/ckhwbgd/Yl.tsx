/**
 * title: 海关出口货物报关单
 * creator: wxl
 */
import React, { useImperativeHandle, useState } from 'react';
import { Modal, Button, Table, message, Spin, Tabs } from 'antd';
import myUtil from '@/components/DDAssist/util';
import './style.less';
import CONSTANTS from '@/components/DDAssist/constants';
import cktsUtil from '@/pages/hts/cktsUtil';
import { cxscbgdpdf, bgdpdfyl } from '@/pages/hts/services/htsApi';

export interface DDModalGridProps {
	onRef?: any;
	visible?: any;
}

const Index: React.FC<DDModalGridProps> = ({ onRef, visible = false }) => {

	const [masker, setMasker] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [dzkablob, setDzkablob] = useState<any>();
	const [dyckblob, setDyckblob] = useState<any>();
	const [cxsc, setCxsc] = useState<any>();



	//绑定组件
	useImperativeHandle(onRef, () => {
		return {
			showModal,
		};
	});




	const showModal = (params: any, cxsc: any) => {
		setCxsc(cxsc);
		setModalVisible(true);
		const bstr = atob(params?.dzkablob);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		const fileURL = URL.createObjectURL(new Blob([u8arr], { type: 'application/pdf' }));
		setDzkablob(`${cktsUtil.getPdfLj()}?file=${fileURL}&name=${"电子口岸.pdf"}`);


		const bstr2 = atob(params?.dyckblob);
		let n2 = bstr2.length;
		const u8arr2 = new Uint8Array(n2);
		while (n2--) {
			u8arr2[n2] = bstr2.charCodeAt(n2);
		}
		const fileURL2 = URL.createObjectURL(new Blob([u8arr2], { type: 'application/pdf' }));
		setDyckblob(`${cktsUtil.getPdfLj()}?file=${fileURL2}&name=${"单一窗口.pdf"}`);

	};

	const closeModalVisible = () => {
		setModalVisible(false);
		setDzkablob("");
		setDyckblob("");
	}

	const reload = async () => {
		setMasker(true);
		await cxscbgdpdf(cxsc).then(async (response) => {
			const { code, desc, msg, body } = response;
			if (code == '200') {
				await bgdpdfyl(cxsc).then((res: any) => {
					setMasker(false);
				  if(res.code == '200'){
					const bstr = atob(res?.body?.dzkablob);
					let n = bstr.length;
					const u8arr = new Uint8Array(n);
					while (n--) {
						u8arr[n] = bstr.charCodeAt(n);
					}
					const fileURL = URL.createObjectURL(new Blob([u8arr], { type: 'application/pdf' }));
					setDzkablob(`${cktsUtil.getPdfLj()}?file=${fileURL}&name=${"电子口岸报关单.pdf"}`);
	
	
					const bstr2 = atob(res?.body?.dyckblob);
					let n2 = bstr2.length;
					const u8arr2 = new Uint8Array(n2);
					while (n2--) {
						u8arr2[n2] = bstr2.charCodeAt(n2);
					}
					const fileURL2 = URL.createObjectURL(new Blob([u8arr2], { type: 'application/pdf' }));
					setDyckblob(`${cktsUtil.getPdfLj()}?file=${fileURL2}&name=${"单一窗口报关单.pdf"}`);
				  }else{
					message.error(res.msg);
				  }
				});

			} else {
				setMasker(false);
				message.error(msg);
			}
		})


	}

	return (
		<>
			<Modal
				title={`备案单证预览`}
				centered
				destroyOnHidden
				visible={modalVisible}
				width={CONSTANTS.C_MODAL_WIDTH_X4}
				wrapClassName='standard-modal-1'
				zIndex={999}
				mask={{ closable: false }}
				footer={
					<>
						<Button type='primary' onClick={() => reload()}>重新生成</Button>
						<Button onClick={() => { closeModalVisible() }}>关闭</Button>
					</>
				}
				onCancel={closeModalVisible}
			>
				<Spin tip="Loading..." spinning={masker} delay={100}>
					<Tabs defaultActiveKey="dyck" >
						<Tabs.TabPane tab="单一窗口样式" key="dyck" >
							<iframe id="pdfContainer1" src={dyckblob} width="100%" frameborder="0" style={{ height: `${document.documentElement.clientHeight - 190}px` }}></iframe>
						</Tabs.TabPane>
						<Tabs.TabPane tab="电子口岸样式" key="dzka" >
							<iframe id="pdfContainer2" src={dzkablob} width="100%" frameborder="0" style={{ height: `${document.documentElement.clientHeight - 190}px` }}></iframe>
						</Tabs.TabPane>
					</Tabs>
				</Spin>
			</Modal>

		</>
	);
};

export default Index;
