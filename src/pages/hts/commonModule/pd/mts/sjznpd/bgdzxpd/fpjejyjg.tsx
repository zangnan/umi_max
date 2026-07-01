import myUtil from '@/components/DDAssist/util';
import React, { useImperativeHandle, useState } from 'react';
import { Modal, Button, Table, message, Spin, Space } from 'antd';
import { commonDrwtdc } from '@/pages/hts/services/htsApi';
import CONSTANTS from '@/components/DDAssist/constants';
import ProCard from '@ant-design/pro-card';
import './style.less';

/**发票金额校验异常页面 */
export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  data?: any;
}

const ErrorMsgGrid: React.FC<DDModalGridProps> = ({
  onRef,
  visible = false,
  data = {},
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);// Modal是否可以显示
  const [modalData, setModalData] = useState<any>(data);// Modal是否可以显示
  const [masker, setMasker] = useState<boolean>(false);
  // const [yymParam, setYymParam] = useState<any>('');// Modal是否可以显示
  // 开启
  const showModal = (param: any) => {// , param1: any
    setModalVisible(true);
    setModalData(param);
    // setYymParam(param1);
  };

  // 数据导出
  const exportXfsycdsj = (param: string) => {
    commonDrwtdc({ key: param }).then((response) => {
      if (response.code === '200') {
        const { blob, fileName } = response.body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(response.desc);
      }
    })
  };

  // // 对照关系配单
  // const ddzgxpdContinue = () => {
  //   const { otherRef, unitRef } = yymParam;
  //   setMasker(true);
  //   ddzgxpd({}).then((response: any) => {
  //     setMasker(false);
  //     const { body, msg } = response;
  //     unitRef.current?.setMasker(false);
  //     if (response.code == '200') {
  //       otherRef[0].current?.showModal({ zdpdResult: body });
  //       setModalVisible(false);
  //     } else {
  //       message.error(msg);
  //     }
  //   })
  // };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 配置项：列表列
  const myColumns = [
    { title: '进货凭证号', dataIndex: 'jhpzh', width: 100, align: 'center' },
    { title: '可用金额', dataIndex: 'syZje', width: 60, align: 'right', render: (text: any) => {
          return <span>{myUtil.grid.formatNum(text, '0, 0.00')}</span>
        }
    },
    { title: '本次配单金额', dataIndex: 'pdZje', width: 60, align: 'right', render: (text: any) => {
          return <span>{myUtil.grid.formatNum(text, '0, 0.00')}</span>
        }
    },
  ];

  return (
    <>
      <Modal
        title='系统消息'
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        wrapClassName='standard-modal-1'
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        footer={(<>
          <Button onClick={() => setModalVisible(false)} >关闭</Button>
          {/* <Button onClick={() => exportXfsycdsj(yymParam)} >导出</Button> */}
          {/* <Button type="primary" onClick={() => ddzgxpdContinue()} >继续配单</Button> */}
        </>)}
        onCancel={() => setModalVisible(false)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <>
            <ProCard className="dd_fpjejyjg_top_wrap" title={
              <span>{`以下发票超额申报，请调整金额后重新提交`}</span>
            }>
            </ProCard>
            <Table
              rowKey='uuid'
              dataSource={modalData.msg}
              columns={myColumns}
              pagination={false}
              size={'small'}
              bordered={true}
            />
          </>
        </Spin>
      </Modal>
    </>
  );
};

export default ErrorMsgGrid;