// 合同付汇
import React, { useState, useImperativeHandle } from 'react';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/pages/common/myUtil';
import { Spin, Button, Table, Tooltip, Modal } from 'antd';
import shsdppStyle from './style.less';


export interface ModalHtppProps {
  onRef?: any;
  visible?: any;
  gridRef?: any;

}

const ModalHtpp: React.FC<ModalHtppProps> = ({
  onRef,
}) => {

  const [masker, setMasker] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);


  const showModal = (dataSource : any) => {
    setData(dataSource);
    // 进行深拷贝，防止改变原始值
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


  // 配置列
  const htPpjgColumns = [
    {
      title: '报关单号', dataIndex: 'bgdhgbh', width: 100, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '出口日期', dataIndex: 'ckrq1', width: 100, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '可匹配金额', dataIndex: 'wshje', width: 80, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={myUtil.text.formatNum(text, '0,0')}> {myUtil.text.formatNum(text, '0,0')} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '本次匹配金额', dataIndex: 'yzje1', width: 80, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={myUtil.text.formatNum(text, '0,0')}> {myUtil.text.formatNum(text, '0,0')} </Tooltip>
        }
        return '';
      }
    },
  ]


  // 页面标题
  const bcJgTitle = (
     <>
    <span className={shsdppStyle.shsdpp_main_title_ytj}>以下报关单匹配金额超出报关单成交金额
    </span>
    </>
  )


  return (
    <>
      <Modal
        title={'保存结果'}
        destroyOnClose={true}
        visible={modalVisible}
        width={1000}
        maskClosable={false}
        footer={
          <>
            <Button onClick={() => setModalVisible(false)} type="primary">确定</Button>
          </>
        }
        onCancel={() => setModalVisible(false)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <ProCard
            title={bcJgTitle}
            bordered
            className={shsdppStyle.sdpd_main}
          >
            <div className='dd-table'>
              <Table
                rowKey='bgdhgbh'
                size='small'
                dataSource={data}
                columns={htPpjgColumns}
                pagination={false}
                bordered={true}
                scroll={{ x: '500px', y: `${document.documentElement.clientHeight - 174}px` }}
              />
            </div>
          </ProCard>
        </Spin>
      </Modal>
    </>
  )
}


export default ModalHtpp;
