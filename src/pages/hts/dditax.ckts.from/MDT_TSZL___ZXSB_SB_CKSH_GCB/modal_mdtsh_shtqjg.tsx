// 合同付汇
import React, { useState, useImperativeHandle } from 'react';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/components/DDAssist/util';
import { Spin, Button, Table, Tooltip, Modal, message } from 'antd';
import { downTqshJg } from '@/pages/hts/services/htsApi';


export interface ModalHtppProps {
  onRef?: any;
  visible?: any;
  gridRef?: any;
  gb?: any;
}

const ModalHtpp: React.FC<ModalHtppProps> = ({
  onRef,
  gb
}) => {

  const [masker, setMasker] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [mainXx, setMainXx] = useState<any>();

  const showModal = (dataSource : any, params: any) => {
    setData(dataSource);
    setMainXx(params);
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
      title: '出口报关单号', dataIndex: 'ckbgdh', width: 150, ellipsis: { showTitle: false }, render: (text: any) => {
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
      title: '合同协议号', dataIndex: 'ckhth', width: 100, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '境外收货人', dataIndex: 'jwshrmc', width: 100, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '失败原因', dataIndex: 'errMsg', width: 180, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
  ]

  const handlerDc = () => {
    const obj = {
      errlist: data?.errlist
    };
    setMasker(true);
    downTqshJg(obj).then((res: any) => {
      setMasker(false);
      const { code, body, msg } = res;
      if (code === '200') {
        const { blob, fileName } = body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(msg);
      }
    });
  }

  const close = () => {
    setModalVisible(false);
    gb(false);
    mainXx?.refUnit?.current!.reload2();
  }


  // 页面标题
  const bcJgTitle = (
   <>
    <span style={{fontSize: '14px', color: '#32363a'}}>提取完成，成功查询报关单
      <span style={{fontSize: '14px', color: 'green', fontWeight: 'bold'}}>{myUtil.text.formatNum(data?.ckbgdts, '0,0')}</span>
    </span>
    <span style={{fontSize: '14px', color: '#32363a'}}>条，提取成功报关单
      <span style={{fontSize: '14px', color: 'green', fontWeight: 'bold'}}>{myUtil.text.formatNum(data?.tqCgts, '0,0')}</span>
    </span>
    <span style={{fontSize: '14px', color: '#32363a'}}>条，收汇情况表
      <span style={{fontSize: '14px', color: 'green', fontWeight: 'bold'}}>{myUtil.text.formatNum(data?.shts, '0,0')}</span>
    </span>
    <span style={{fontSize: '14px', color: '#32363a'}}>；提取失败报关单
    <span style={{fontSize: '14px', color: 'red', fontWeight: 'bold'}}>{myUtil.text.formatNum(data?.tqSbts, '0,0')}</span>
    </span>
    <span style={{fontSize: '14px', color: '#32363a'}}>条。</span>
    </>
  )


  return (
    <>
      <Modal
        title={'保存结果'}
        destroyOnHidden={true}
        open={modalVisible}
        width={1000}
        wrapClassName='standard-modal-1'
        footer={(<>
          <Button onClick={() => handlerDc()}>导出</Button>
          <Button onClick={() => close()} type="primary">确定</Button>
        </>)}
        onCancel={() => close()}
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <ProCard
            title={bcJgTitle}
            bordered
          >
            <div className='dd-table'>
            <Table
                size='small'
                dataSource={data?.errlist}
                columns={htPpjgColumns}
                pagination={false}
                bordered={true}
              />
              </div>
          </ProCard>
        </Spin>
      </Modal>
    </>
  )
}


export default ModalHtpp;
