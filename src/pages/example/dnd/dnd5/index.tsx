import React, { useEffect, useRef, useState, Fragment, useImperativeHandle, memo } from 'react';
import {MultipleContainers} from './MultipleContainers';
import { Button, Modal } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';

const DragHandle: React.FC = () => {
  let meta: any =[
    { title: '报关单号', dataIndex: 'ckbgdh', width: 180, fixed: 'left' },
    { title: '项号', dataIndex: 'xh4', width: 60, fixed: 'left' },
    { title: '银行账号', dataIndex: 'yhzh', width: 160 },
    { title: '监管方式', dataIndex: 'jgfsDm', width: 155, sorter: true, codeTable: 'code_dm_ckts_hgjgfs', },
    { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
    { title: '商品代码', dataIndex: 'ckspDm', width: 95 },
    { title: '商品名称', dataIndex: 'ckspmc', width: 180, ellipsis: true, },
    { title: '海关商品名称', dataIndex: 'hgspmc', width: 180 },
    { title: '出口合同号', dataIndex: 'ckhth', width: 115 },
    { title: '成交方式', dataIndex: 'hgcjfsmc', width: 85 },
    { title: '成交单位', dataIndex: 'hgjldwmc', width: 90, ellipsis: true },
    { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' } },
    { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 85 },
    { title: '成交金额', dataIndex: 'cjzj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
    { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
    { title: '法定单位', dataIndex: 'dyjldwDm', width: 90, codeTable: 'code_dm_ckts_hgjldw', ellipsis: true },
    { title: '法定单位数量', dataIndex: 'cksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' } },
    { title: '第二单位', dataIndex: 'dejldwDm', width: 90, codeTable: 'code_dm_ckts_hgjldw', ellipsis: true },
    { title: '年度', dataIndex: 'year', width: 90 },
    { title: '季度', dataIndex: 'quarter', width: 90 },
    { title: '月份', dataIndex: 'month', width: 90 },
    { title: '业务类型', dataIndex: 'cktmsywlxmcjh', width: 90 },
    { title: '国内启运方式', dataIndex: 'gnqyfs', width: 90 },
    { title: '第二单位数量', dataIndex: 'decksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' }, fixed: 'right' },
  ];

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const refGrid: any = useRef();
  const test123 = () => {
    handleModalVisible(true);
    const gridData = refGrid.current?.get3ColData();
    return gridData;
  }
  return <>
    <Modal
      title={'编辑'}
      open={createModalVisible}
      wrapClassName="standard-modal-1"
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      okText="保存"
      cancelText="关闭"
      onCancel={() => handleModalVisible(false)}
      onOk={test123}
      mask={{ closable: false }}
    >

    <MultipleContainers handle actionRef={refGrid}
      trashable
      // vertical
      items={{
        // rows: [ 'year', 'quarter', 'month', ],
        // columns: [ 'cktmsywlxmcjh', 'gnqyfs', ],
        // values: [ 'ckbgdh', 'yhzh', 'hgspmc', 'dyjldwDm', 'cksl', 'dejldwDm', 'decksl', 'ckspDm', ],
        rows: [ '年度 - year', ' 季度 - quarter', '月份 - month' ],
        columns: [ '业务类型 - cktmsywlxmcjh', '国内启运方式 - gnqyfs' ],
        values: [ '报关单号 - ckbgdh', '银行账号 - yhzh', '海关商品名称 - hgspmc', '法定单位 - dyjldwDm', '法定单位数量 - cksl', '第二单位 - dejldwDm', '第二单位数量 - decksl', '商品代码 - ckspDm' ],
        all: [],
      }}
    />
    </Modal>
    <Button onClick={test123} type="default">sdsd</Button>

  </>;
}
export default DragHandle;