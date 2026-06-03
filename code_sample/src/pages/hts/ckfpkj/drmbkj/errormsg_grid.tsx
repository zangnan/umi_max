/**
 * 导入模板开具 导入异常信息
 */
import myUtil from '@/pages/common/myUtil';
import React, { useImperativeHandle, useState } from 'react';
import { Modal, Button, Table, message } from 'antd';
import { commonDrwtdc } from '@/services/hts/api';
import pro from '@/pages/common/proConfig';
import { useIntl } from 'umi';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  data?: any;
}
const errData = [
  { uuid: '1', sbyy: '字符超长', yyms: '第23行“报关单号”字段最大长度应为18位字符', wtcl: '检查采集字段长度是否有误' },
  { uuid: '2', sbyy: '格式错误', yyms: '第23行“预录入编号”字段应为数字', wtcl: '检查采集字段是否为数字项' },
]

const ErrorMsgGrid: React.FC<DDModalGridProps> = ({
  onRef,
  visible = false,
  data = errData,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);// Modal是否可以显示
  const [modalData, setModalData] = useState<any>(data);// Modal是否可以显示
  const [key, setKey] = useState<any>('');// Modal是否可以显示
  const intl = useIntl();
  // 开启
  const showModal = (param: any, param1: any) => {
    setModalVisible(true);
    setModalData(param);
    setKey(param1);
  };
  // 导出错误信息
  const exportErrorMessage = (param: string) => {
    commonDrwtdc({ key: param }).then((response) => {
      if (response.code === '200') {
        const { blob, fileName } = response.body;
        myUtil.file.downloadExcel(blob, fileName);
        setModalVisible(false);
      } else {
        message.error(response.desc);
      }
    })
  };

  const exportData = () => {
    if (modalData.fileBytes) {
      myUtil.file.downloadExcel(modalData.fileBytes, modalData.fileName);
      setModalVisible(false);
    } else {
      message.error(intl.formatMessage({ id: 'message_mdts_download_error' }));
    }
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 配置项：列表列
  const myColumns = [
    {
      title: '序号', dataIndex: 'index', width: 60, render: (_text: any, _record: any, index: number) => (
        <span key={index.toString()}>{index + 1}</span>)
    },
    { title: '失败原因', dataIndex: 'sbyy', width: 200 },
    { title: '原因描述', dataIndex: 'yyms', width: 200 },
    { title: '问题处理', dataIndex: 'wtcl', width: 300 },
  ];

  return (
    <>
      <Modal
        title='导出Excel模板'
        destroyOnClose={true}
        visible={modalVisible}
        width={pro.c_modal_width_x4}
        wrapClassName='standard-modal-1'
        footer={(<>
          <Button onClick={() => setModalVisible(false)} >关闭</Button>
          <Button onClick={() => exportErrorMessage(key)} >导出异常信息</Button>
          <Button onClick={() => exportData()} type="primary">导出数据</Button>
        </>)}
        onCancel={() => setModalVisible(false)}
      >
        <>
          <Table
            rowKey='uuid'
            dataSource={modalData.drycxx}
            columns={myColumns}
            pagination={false}
            size={'small'}
            bordered={true}
          />
        </>
      </Modal>
    </>
  );
};

export default ErrorMsgGrid;