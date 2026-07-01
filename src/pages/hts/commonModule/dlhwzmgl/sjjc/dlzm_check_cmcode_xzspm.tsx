/**
 * 数据检查 选择商品信息
 */
import React, { useImperativeHandle, useState } from 'react';
import DDBaseGrid from '@/components/DDBaseGrid';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Button } from 'antd';
import { getCmcode11 } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';

export interface XzspmProps {
  onRef?: any;
}

const DrawerXzspm: React.FC<XzspmProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [mainRef, setMainRef] = useState<any>();
  const [recordIndex, setRecordIndex] = useState<any>();
  const [gridData, setGridData] = useState<any>([]);

  // 开启
  const showModal = (param: any) => {
    const { onRef, record, index } = param;
    setMainRef(onRef);
    setRecordIndex(index);
    setModalVisible(true);
    const gridParams = {
      searchModel: [
        { property: 'ckrq1', value: record.ljDate, op: 'al' },
        { property: 'ckspDm', value: record.cmcode, op: 'al' },
      ],
    };
    getCmcode11(gridParams).then((res) => {
      const { body, code } = res;
      if (code === '200') {
        setGridData(body);
      } else{
        setGridData([]);
      }
    })
  }

  // 选择商品
  const addckspDm = (record: any) => {
    mainRef.current!.CallbackFmFunc({record, index: recordIndex});
    setModalVisible(false);
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 列表内容格式化: 税率
  const renderSl = (text: any, record: any, index: number) => {
    return text ? myUtil.text.formatNum(text, '0,0.00') : text;
  }
  // 配置列表列
  const columns = [
    { title: '商品代码', dataIndex: 'ckspDm', width: 100 },
    { title: '商品名称', dataIndex: 'ckspmc', width: 120, ellipsis: true, },
    { title: '征税税率', dataIndex: 'zssljh', align: 'right', width: 100, render: renderSl },
    { title: '退税率', dataIndex: 'tsl', align: 'right', width: 80, render: renderSl },
    { title: '操作', align: 'center', width: 100, render: (text: any, record: any, index: number) => (
        <Button type='link' onClick={() => addckspDm(record)}>选择</Button>
      )
    },
  ];

  return (
    <Drawer
      title="选择商品信息"
      open={modalVisible}
      onClose={() => { setModalVisible(false) }}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      className="dd_data_page_modal"
      mask={{ closable: false }}
      zIndex={1001}
    >
    <DDBaseGrid
      rowKey='uuid'
      userDataSource={gridData}
      columns={columns}
      pagination={false}
    />
    </Drawer>
  );
};

export default DrawerXzspm;