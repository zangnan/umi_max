// 生成数据情况
import React, { useState, useImperativeHandle } from 'react';
import DDBaseGrid from '@/components/DDBaseGrid';
import { Modal, message } from 'antd';
import { scsbsjb, zdscFlzl, excelsingleZipExport, insertFlzlList } from '@/services/hts/api';
import pro from '@/pages/common/proConfig';

export type CreateDataProps = {
  gridData?: any;
  formData?: any;
  visible?: any;
  onRef?: any;
  showFlzl?: any;
}

const CreateData: React.FC<CreateDataProps> = ({
  gridData,
  formData,
  visible = false,
  onRef,
  showFlzl,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [initParam, setInitParam] = useState<any>({});
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  // 开启
  const showModal = (param: any) => {
    setModalVisible(true);
    console.info('createData.tsx -> showModal');
    console.info(param);
    setInitParam(param)
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 配置列表列 操作列
  const myColumns = [
    { title: '数据列表', dataIndex: 'bm' },
    { title: '数据条数', dataIndex: 'ts', width: 150, align: 'right'  },
  ];

  // 生成
  const generateDate = () => {
    const params = formData;
    setConfirmLoading(true);
    scsbsjb(params).then((response) => {
      setConfirmLoading(false);
      // childRefDDbunit.current!.setMasker(false);
      const { code, desc } = response;
      if (code !== '200') {
        message.error(desc);
        return;
      }
      // 按需处理附列资料
      // if(showFlzl) {
      //   params.sbwjuuid = desc;
      //   zdscFlzl(params).then((response1) => {
      //     // 1.自动生成附列资料
      //     if (response1.code === '200') {
      //       const params2 = params;
      //       params2.insertFlzlList = response1.body;
      //       return excelsingleZipExport(params2);
      //     }
      //     message.error(response1.desc);
      //     throw new Error(response1.desc);
      //   }).then((response2) => {
      //     // 2.生成单个附列资料zip
      //     if (response2.code === '200') {
      //       const params3: any = {};
      //       params3.insertList = response2.body;
      //       return insertFlzlList(params3);
      //     }
      //     message.error(response2.desc);
      //     throw new Error(response2.desc);
      //   }).then((response3) => {
      //     // 3.批量保存附列资料
      //     if (response3.code !== '200') {
      //       message.error(response3.desc);
      //     }
      //   }).catch((error) => {
      //     message.error(error);
      //   });
      // }
      setModalVisible(false);
      message.success('数据生成成功');
      initParam.unitRef.current?.reload2();
    })
  };

  return (
    <Modal
      title="生成数据情况"
      centered
      destroyOnClose
      visible={modalVisible}
      wrapClassName='standard-modal-1'
      width={pro.c_modal_width_x3}
      okText="生成"
      cancelText="关闭"
      onCancel={() => setModalVisible(false)}
      onOk={generateDate}
      confirmLoading={confirmLoading}
      maskClosable={false}
    >
      <DDBaseGrid
        userDataSource={gridData}
        columns={myColumns}
        showSerialNumber
        pagination={false}
      />
    </Modal>
  );
};
export default CreateData;
