import React, { useImperativeHandle, useState, useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import { Modal, message } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { CloseOutlined, CheckOutlined} from '@ant-design/icons';

export type PdrwProps = {
  children?: any;
  onRef?: any;
}

const Tzpd: React.FC<PdrwProps> = ({
  children,
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>();

  //绑定组件
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


  const showModal = (param: any) => {
    setModalVisible(true);
  }

  const config: any = {};

  config.grid_columns = [
    {
      title: '配单结果', dataIndex: 'pdbz', width: 90, fixed: 'left',
      filter: {
        type: 'Select',
        codeTable: 'CODE_STATIC_TZPD_PDJG_DM:01',
      }, render: { func: 'renderCkpdrwmxPdjg' }
    },
    {
      title: '换汇成本', dataIndex: 'hhcb', width: 90, render: { func: 'renderHhcb' },
      filter: {
        type: 'Select',
        codeTable: 'CODE_STATIC_TZPD_HHCB_DM:01',
      }
    },
    {
      title: '生成状态', dataIndex: 'scbz1', width: 90, codeTable: 'CODE_STATIC_TZPD_SCZT_DM:01',
      filter: {
        type: 'Select',
        codeTable: 'CODE_STATIC_TZPD_SCZT_DM:01',
      }
    },
    { title: '异常级别', dataIndex: 'ycjb', width: 180, ellipsis: true },
    {
      title: '异常分类', dataIndex: 'pdsblxDm', width: 90, ellipsis: true, codeTable: 'code_dm_zxsb_tzpdsblx_mc:01',
      filter: {
        type: 'Select',
        codeTable: 'code_dm_zxsb_tzpdsblx_mc:01',
      }
    },   
    { title: '异常说明', dataIndex: 'pdsblxsm', width: 160, ellipsis: true },
    { title: '是否为同一货源地', dataIndex: 'ycjb', width: 180, ellipsis: true },
    { title: '报关单号', dataIndex: 'bgdhgbh', width: 180, ellipsis: true },
    { title: '项号', dataIndex: 'hwxh', width: 50, ellipsis: true },
    { title: '出口发票号', dataIndex: 'ckfph', width: 260, ellipsis: true },
    { title: '发票代码', dataIndex: 'fpDm', width: 100, ellipsis: true },
    { title: '发票号码', dataIndex: 'fphm', width: 120, ellipsis: true },
    { title: '数电票号码', dataIndex: 'sdfphm', width: 180, ellipsis: true },
    { title: '行号', dataIndex: 'hh', width: 50, ellipsis: true },
   
    // { title: '占用发票数量', dataIndex: 'bcsl', width: 100, ellipsis: true, render: { type: 'number', format: '0,0.00000' }, align: 'right' },
    // { title: '占用发票计税金额', dataIndex: 'bcje', width: 140, ellipsis: true, render: { type: 'number', format: '0,0.00' } },
    { title: '合同协议号', dataIndex: 'ckhth', width: 160, ellipsis: true },
    { title: '出口日期', dataIndex: 'ckrq1', width: 100, ellipsis: true, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' } },
    { title: '海关商品代码', dataIndex: 'hgckspDm', width: 120, ellipsis: true },
    { title: '海关商品名称', dataIndex: 'hgspmc', width: 160, ellipsis: true },
    { title: '法定单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
    { title: '可用法定数量', dataIndex: 'tssbsl', width: 110, ellipsis: true, render: { type: 'number', format: '0,0.00000' }, align: 'right' },
    { title: '成交单位', dataIndex: 'sbjldwmc', width: 80, ellipsis: true },
    { title: '可用成交数量', dataIndex: 'bctssbsl', width: 110, ellipsis: true, render: { type: 'number', format: '0,0.00000' }, align: 'right' },
    { title: '可用美元离岸价', dataIndex: 'tssbmylaj', width: 140, ellipsis: true, render: { type: 'number', format: '0,0.00' } },
    
  ];

  const Func: any = {
    unitRef: React.createRef(),
  };

  Func.columnsRender = {
    renderHhcb: (param: any) => {
      const record = param?.record;
      let hhcbColor: any;
      let hhcbRange: any;
      if (record.hhcb === '03') {
        hhcbColor = '#f50'
        hhcbRange = '↑';
      } else if (record.hhcb === '02') {
        hhcbColor = '#87d068'
        hhcbRange = '↓';
      }
      return <><span><div style={{ color: hhcbColor }}>{record.hhcbsz}{hhcbRange}</div></span></>

    },
    renderCkpdrwmxPdjg: (param: any) => {
      const pdbz = param?.record?.pdbz;
      let col: any = <></>;
      if (pdbz === 'Y') {
        return col = <span className="dd_grid_icon"><CheckOutlined /></span>;
      } else if (pdbz === 'N') {
        return col = <span className="dd_grid_icon"><CloseOutlined style={{ color: 'red' }} /></span>;
      }
      return col;
    }
  }

  return (
    <>
      <Modal
        title="查看明细"
        destroyOnHidden={true}
        visible={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        wrapClassName="standard-modal-1"
        onCancel={() => setModalVisible(false)}
        footer={(<>
        </>)}
      >
        <DDBunit2 config={config} func={Func} />
      </Modal>
    </>
  );
};
export default Tzpd;
