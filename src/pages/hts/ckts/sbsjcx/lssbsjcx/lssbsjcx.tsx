import React, { useState, useImperativeHandle } from 'react';
import { Tag, Drawer } from 'antd';
import cktsUtil from '@/pages/hts/cktsUtil';
import CONSTANTS from '@/components/DDAssist/constants';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import history_config from './lssbsjcxConfig';
import Func from './lssbsjcxFun';

export type HistoryProps = {
  onRef?: any;
  ywKey?: any;
}

const History: React.FC<HistoryProps> = ({
  onRef,
  ywKey,
}) => {

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>(history_config);

  // 列表列
  const getColumns = () => {
    // 列表内容格式化: 审核状态
    const renderColumnSjsbztDm = (text: string) => {
      if (text === '0') {
        return <Tag color="cyan">待审核</Tag>
      }
      if (text === '1') {
        return <Tag color="blue">审核中</Tag>
      }
      if (text === '2') {
        return <Tag color="red">审核失败</Tag>
      }
      if (text === '3') {
        return <Tag color="green">审核成功</Tag>
      }
      return null;
    }
    const cols = [];
    cols.push({ title: '文件名称', dataIndex: 'fjwjm', width: 260, ellipsis: true });
    cols.push({ title: '申报时间', dataIndex: 'wjscsj', width: 160, align: 'center' });
    if (!cktsUtil.moduleType(ywKey, 'SQRQ')) { // 是否有申请日期
      cols.push({ title: '所属期', dataIndex: 'ssq', width: 65, align: 'center' });
      if (cktsUtil.moduleType(ywKey, 'SBPC')) { // 是否有申报批次
        cols.push({ title: '批次', dataIndex: 'sbpc', width: 50, align: 'center' });
      }
    }
    cols.push({ title: '反馈信息', dataIndex: 'sjsbxxms', ellipsis: true });
    cols.push({ title: '审核状态', dataIndex: 'sjsbztDm', width: 100, render: renderColumnSjsbztDm });
    return cols;
  }

  // 开启
  const showModal = (param: any) => {
    const c = { ...myConfig };
    const gridParams: any = {
      initSearchModal: [
        { property: 'ywKey', value: ywKey, op: 'al' },
      ],
    }
    c.gridParams = gridParams;
    // 配置列表列
    c.grid_columns = getColumns();
    setMyconfig(c);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title="历史申报记录"
      visible={modalVisible}
      onClose={() => {setModalVisible(false)}}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      destroyOnHidden={true}
      className="dd_data_page_modal"
    >
      <DDBunit2 config={myConfig} func={Func} />
    </Drawer>
  );
};
export default History;
