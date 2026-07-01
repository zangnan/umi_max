// 合同付汇
import React, { useState, useImperativeHandle } from 'react';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/components/DDAssist/util';
import { Spin, Button, Table, Tooltip, Modal, message } from 'antd';
import shsdppStyle from './style.less';
import { downHtfhJg } from '@/pages/hts/services/htsApi';


export interface ModalHtppProps {
  onRef?: any;
  visible?: any;
  gridRef?: any;
  topData?: any;

}

const ModalHtpp: React.FC<ModalHtppProps> = ({
  onRef,
  topData,
}) => {

  const [masker, setMasker] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [ppjg, setPpjg] = useState<any>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);


  const showModal = (dataSource : any, tmpPpjg: any) => {
    setData(dataSource);
    setPpjg(tmpPpjg);
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
      title: '业务号', dataIndex: 'ckhth', width: 100, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '占用收汇金额', dataIndex: 'zyshje', width: 80, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={myUtil.text.formatNum(text, '0,0.00')}> {myUtil.text.formatNum(text, '0,0.00')} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '错误信息', dataIndex: 'errMsg', width: 280, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
  ]


  // 页面标题
  const ppJgTitle = (
     <>
    <span className={shsdppStyle.shsdpp_main_title_ytj}>成功匹配了报关单
      <span className={shsdppStyle.shsdpp_main_title_je}>{myUtil.text.formatNum(ppjg?.bgdzs, '0,0')}</span>
    </span>
    <span className={shsdppStyle.shsdpp_main_title_ytj}>份，收汇水单剩余金额：
      <span className={shsdppStyle.shsdpp_main_title_syje}>{myUtil.text.formatNum(ppjg?.syje, '0,0.00')}</span>
    </span>
    </>
  )

  const xzHtjg = () => {
    const obj = {
      htPpjg : data
    };
    setMasker(true);
    downHtfhJg(obj).then((res: any) => {
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


  return (
    <>
      <Modal
        title={'匹配结果'}
        destroyOnHidden={true}
        open={modalVisible}
        width={1000}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={() => xzHtjg()}>导出</Button>
            <Button onClick={() => setModalVisible(false)} type="primary">确定</Button>
          </>
        }
        onCancel={() => setModalVisible(false)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <ProCard
            title={ppJgTitle}
            bordered
            className={shsdppStyle.sdpd_main}
          >
            <div className='dd-table'>
              <Table
                rowKey='ckhth'
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
