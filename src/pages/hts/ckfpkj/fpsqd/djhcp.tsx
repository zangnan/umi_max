/**
 * title: 发票申请单-单据号重排
 * author: yxy
 */
import React, { useImperativeHandle, useState} from 'react';
import { Modal, Button, Table,Divider,Switch } from 'antd';
import { DndProvider} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


export interface DDModalGridProps {
  onRef?: any;
  onOk?: any;
  onCancel?: any;
  visible?: boolean;
  data?: any;
}

const bgdData = [
  { pxzd: '合同号', pxgz: 'ASC'},
  { pxzd: '报关单号', pxgz: 'DESC'},
  { pxzd: '出口日期', pxgz: 'ASC'},
]

const DjhcpGrid: React.FC<DDModalGridProps> = ({
  onRef,
  onOk,
  visible = false,
  data = bgdData,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [gridData, setGridData] = useState<any>(data);

  const columns = [
    {
      title: '序号', dataIndex: 'index', width: 60, align: 'center', render: (_text: any, _record: any, index: number) => (
        <span>{index + 1}</span>)
    },
    { title: '排序字段', dataIndex: 'pxzd', width: 240 },
    {
      title: '排序规则', dataIndex: 'pxgz', align:'center',  key: 'pxgz', minwidth: 80, width: 120 ,editable: true, className: 'dd_editable_column',
      render: ()=> (
        <Switch  checkedChildren="升序" unCheckedChildren="降序" defaultChecked />)
    },
    {
      title: '操作', width: 120, align: 'center', render: (_text: any, _record: any, index: number) => (<>
        <Button type='link' onClick={() => setPosition(index, 'up')} disabled={index === 0}>上移</Button>
        <Divider type='vertical' />
        <Button type='link' onClick={() => setPosition(index, 'down')} disabled={index === (gridData.length - 1)}>下移</Button>
      </>)
    },
  ];

  // 上移 下移 置顶 置底
  const setPosition = (index: any, flag: any) => {
    if (flag === 'up') {
      [gridData[index], gridData[index - 1]] = [gridData[index - 1], gridData[index]];
    } else if (flag === 'down') {
      [gridData[index], gridData[index + 1]] = [gridData[index + 1], gridData[index]];
    }
    const newArr: any = [].concat(gridData);
    setGridData(newArr);
  };

  // 开启
  const showModal = (flag: boolean) => {
    setModalVisible(flag);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <>
      <Modal
        title='单据号重排'
        destroyOnHidden={true}
        open={modalVisible}
        width={650}
        footer={(<>
          <Button onClick={() => setModalVisible(false)} >取消</Button>
          <Button onClick={onOk} type="primary">确定</Button>
        </>)}
        onCancel={() => setModalVisible(false)}
      >
        <>
        <div>
          <DndProvider backend={HTML5Backend}>
            <Table
              dataSource={gridData}
              pagination={false}
              size="small"
              rowKey='pxzd'
              columns={columns}
              bordered={true}
            />
          </DndProvider>
        </div>
        </>
      </Modal>
    </>
  );
};

export default DjhcpGrid;