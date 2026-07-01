/**
 * 导入模板开具 导入异常信息
 */
import myUtil from '@/components/DDAssist/util';
import React, {useImperativeHandle, useState} from 'react';
import { Button, message, Modal, Table} from 'antd';
import {commonDrwtdc } from '@/pages/hts/services/htsApi';
import CONSTANTS from '@/components/DDAssist/constants';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  data?: any;
}

const errData = [
  {uuid: '1', sbyy: '字符超长', yyms: '第23行“报关单号”字段最大长度应为18位字符', wtcl: '检查采集字段长度是否有误'},
  {uuid: '2', sbyy: '格式错误', yyms: '第23行“预录入编号”字段应为数字', wtcl: '检查采集字段是否为数字项'},
]

const ErrorMsgGrid: React.FC<DDModalGridProps> = ({
                                                    onRef,
                                                    visible = false,
                                                    data = errData,
                                                  }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);// Modal是否可以显示
  const [modalData, setModalData] = useState<any>(data);// Modal是否可以显示
  const [key, setKey] = useState<any>('');// Modal是否可以显示
  // 开启
  const showModal = (param: any, param1: any) => {
    setModalVisible(true);
    setModalData(param);
    setKey(param1);
  };
  // 导出错误信息
  const exportErrorMessage = (param: string) => {
    commonDrwtdc({key: param}).then((response) => {
      if (response.code === '200') {
        const {blob, fileName} = response.body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(response.desc);
      }
    })
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
    {title: 'SHEET页', dataIndex: 'sheetName', width: 100},
    {title: '失败原因', dataIndex: 'sbyy', width: 200},
  ];

  return (
    <>
      <Modal
        title='导出Excel模板'
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        wrapClassName='standard-modal-1'
        footer={(<>
          <Button onClick={() => setModalVisible(false)}>关闭</Button>
          <Button onClick={() => exportErrorMessage(key)}>导出异常信息</Button>
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
