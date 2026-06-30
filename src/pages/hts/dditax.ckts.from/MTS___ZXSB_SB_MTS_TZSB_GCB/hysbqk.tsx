import React, { useState, useImperativeHandle } from 'react';
import { Modal, message, Spin, Table, Button} from 'antd';
import { commonDrwtdc } from '@/pages/hts/services/htsApi';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/components/DDAlert';

export interface DDInvoiceProps {
  onRef?: any;
  visible?: any;
}

const Hysbqk: React.FC<DDInvoiceProps> = ({
  onRef, visible = false
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [unitRef, setUnitRef] = useState<any>();
  const [body, setbody] = useState<any>();

  //下载按钮是否显示
  const [masker, setMasker] = useState(false);

 //绑定组件
 useImperativeHandle(onRef, () => {
  return {
    showModal,
  };
});

  // 开启
  const showModal = (param: any,body:any) => {
    setModalVisible(true);
    setUnitRef(param);
    setbody(body);
  };
  const exportModalError = async () => {
    setMasker(true);
    commonDrwtdc({ key: 'SJGL_SWFKSJCX_WMQYTZSB_HYSBQK_ERRORLIST'}).then((response) => {
      const { code, body, desc } = response;
      if (code === '200') {
        const { blob, fileName } = body;
        message.success('错误信息导出成功！');
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(desc);
      }
      setMasker(false);
    });
  };

  const columns = [
    { title: '原关联号', dataIndex: 'glh', width: '180px', ellipsis: true },
  ];
  const handleSave = () => {
    setModalVisible(false);
    DDAlert.close();
  }
  return (
<Modal
        title="系统提示"
        centered
        destroyOnHidden
        visible={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        okText="确定"
        cancelText="取消"
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        zIndex={1001}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={handleSave}>取消</Button>
            <Button onClick={exportModalError}>导出</Button>
            <Button onClick={handleSave}>确定</Button>
          </>
        }
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
        <div>以下数据未使用本系统申报退税，无法还原。</div>
        <br/>
        <Table dataSource={body} columns={columns} size="small" />
        </Spin>
      </Modal>
  );
};

export default Hysbqk;
