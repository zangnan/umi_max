import React, { useImperativeHandle, useState } from 'react';
import { Modal, Button, Spin,  } from 'antd';
import pro from '@/pages/common/proConfig';
import cktsUtil from '@/pages/common/cktsUtil';

export interface DDModalGridProps {
	onRef?: any;
	visible?: any;
}

const Index: React.FC<DDModalGridProps> = ({ onRef, visible = false }) => {

	const [masker, setMasker] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [dyckblob, setDyckblob] = useState<any>();

	//绑定组件
	useImperativeHandle(onRef, () => {
		return {
			showModal,
		};
	});

	const showModal = (params: any) => {
		setModalVisible(true);
		const bstr2 = atob(params?.blob);
		let n2 = bstr2.length;
		const u8arr2 = new Uint8Array(n2);
		while (n2--) {
			u8arr2[n2] = bstr2.charCodeAt(n2);
		}
		const fileURL2 = URL.createObjectURL(new Blob([u8arr2], { type: 'application/pdf' }));
		setDyckblob(`${cktsUtil.getPdfLj()}?file=${fileURL2}&name=${params?.fileName}`);

	};

	const closeModalVisible = () => {
		setModalVisible(false);
		setDyckblob("");
	}

	return (
		<>
			<Modal
				title={`消费税票预览`}
				centered
				destroyOnClose
				visible={modalVisible}
				width={pro.c_modal_width_x4}
				wrapClassName='standard-modal-1'
				zIndex={999}
				maskClosable={false}
				footer={
					<>
						<Button onClick={() => { closeModalVisible() }}>关闭</Button>
					</>
				}
				onCancel={closeModalVisible}
			>
				<Spin tip="Loading..." spinning={masker} delay={100}>
				 <iframe id="pdfContainer1" src={dyckblob} width="100%" style={{ height: `${document.documentElement.clientHeight - 180}px` }}></iframe>
				</Spin>
			</Modal>

		</>
	);
};

export default Index;
