import React, { useState, useCallback, useRef, useImperativeHandle } from 'react';
import { Table, Row, Col, Button, Modal, Input } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import './style.less';
import pro from '@/pages/common/proConfig';

export interface FieldSettingProps {
  onRef?: any;
  visible?: any;
  data?: any;
}

const type = 'DraggableBodyRow';

const DraggableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: item => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

const FieldSetting: React.FC<FieldSettingProps> = ({
  onRef,
  visible = false,
  data = {
    col: [
      { col: '报关单号', name: 'ckbgdh' },
      { col: '项号', name: 'xh4' },
      { col: '出口日期', name: 'ckrq1' },
      { col: '数据检查状态', name: 'cytgbz' },
      { col: '征免类型', name: 'zmlx' },
      { col: '申报业务', name: 'sbyw' },
      { col: '商品代码', name: 'ckspDm' },
      { col: '商品名称', name: 'ckspmc' },
      { col: '海关商品名称', name: 'hgspmc' },
      { col: '出口合同号', name: 'ckhth' },
      { col: '监管方式', name: 'jgfsDm' },
      { col: '成交方式', name: 'hgcjfsmc' },
      { col: '成交单位', name: 'hgjldwmc' },
      { col: '成交数量', name: 'cjsl1' },
      { col: '成交币制', name: 'cjhghbzmDm' },
      { col: '成交金额', name: 'cjzj' },
      { col: '美元离岸价', name: 'mylaj' },
      { col: '法定单位', name: 'dyjldwDm' },
      { col: '法定单位数量', name: 'cksl' },
      { col: '第二单位', name: 'dejldwDm' },
      { col: '第二单位数量', name: 'decksl' },
      { col: '是否不予退税', name: 'bytsbz' },
      { col: '是否不予办理', name: 'byblbz' },
      { col: '是否暂不办理', name: 'zbblbz' },
    ]
  }
}) => {
  // 左侧数据：备选字段
  const [leftData, setLeftData] = useState<any>(data.col);
  // 右侧数据：已添加字段
  const [gridData, setGridData] = useState<any>([]);

  const [modalVisible, setModalVisible] = useState<boolean>(visible);

  // 开启
  const showModal = () => {
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 配置列表列：左侧
  const columnsLeft = [
    { title: '序号', dataIndex: 'index', width: 80, align: 'center', render: (_text: any, _record: any, index: number) => (
      <span>{index + 1}</span>)
    },
    { title: '备选字段', dataIndex: 'col' },
    { title: '操作', align: 'center', width: 100, render: (_text: any, record: any, index: number) => (<>
      <Button type='link' onClick={() => setDataFormLeft(record, index)} >添加</Button>
    </>)},
  ];

  // 配置列表列：右侧
  const columnsRight = [
    { title: '序号', dataIndex: 'index', width: 80, align: 'center', render: (_text: any, _record: any, index: number) => (
      <span>{index + 1}</span>)
    },
    { title: '已添加字段', dataIndex: 'col'},
    { title: '操作（上下拖拽可以改变字段顺序）', width: 100, align: 'center', render: (_text: any, record: any, index: number) => (<>
      <Button type='link' onClick={() => setDataFormRight(_text, record, index)} >删除</Button>
    </>)},
  ];

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = gridData[dragIndex];
      setGridData(
        update(gridData, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [gridData],
  );

  // 编辑选中列：添加
  const setDataFormLeft = (record: any, index: number) => {
    console.info(record);
    // 添加右侧数据
    const newArrRight: any = [].concat(gridData);
    newArrRight.push(record);
    setGridData(newArrRight);
    // 删除左侧数据
    leftData.splice(index, 1);
    const newArrleft: any = [].concat(leftData);
    setLeftData(newArrleft);
  };

  // 编辑选中列：删除
  const setDataFormRight = (_text: any, record: any, index: number) => {
    console.info(record);
    // 删除右侧数据
    const newArrRight: any = [].concat(gridData);
    newArrRight.splice(index, 1);
    setGridData(newArrRight);
    // 添加左侧数据
    const newArrleft: any = [].concat(leftData);
    newArrleft.push(record);
    setLeftData(newArrleft);
  };

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };

  const filterLeftData = (val: any) => {
    leftData.map((tmp: any) => {
      if (!val) {
        tmp.filterFlag = '';
      } else if (tmp.col.indexOf(val) === -1 ) { // 不包含
        tmp.filterFlag = 'unshown';
      }
    });
    const newArrleft: any = [].concat(leftData);
    setLeftData(newArrleft);
  }

  const filterLeftDataEnter = (e: any) => {
    filterLeftData(e.target.value);
  }

  // 获取数据
  const handleSave = () => {
    console.info(gridData);
  };

  return (
    <Modal
      title="字段设置"
      centered
      destroyOnClose
      visible={modalVisible}
      wrapClassName='standard-modal-1'
      width={pro.c_modal_width_x3}
      onCancel={() => setModalVisible(false)}
      footer={(<>
        <span className="select_data">已选择<b>{gridData.length}</b>个字段</span>
        <Button onClick={handleSave}type="primary">确定</Button>
        <Button onClick={() => setModalVisible(false)} type="default">关闭</Button>
      </>)}
    >
      <Row gutter={20}>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <div>
            <div style={{height: '45px'}}>
              <Input.Search placeholder="请输入字段名称" onPressEnter={filterLeftDataEnter} onSearch={filterLeftData} />
            </div>
            <div style={{border: '1px solid #d9d9d9', height: 'calc(100vh - 36px - 51px - 85px)', overflowY: 'auto'}}>
              <Table
                dataSource={leftData.filter((item: any) => { return item.filterFlag !== 'unshown' })}
                pagination={false}
                size="small"
                showHeader={false}
                columns={columnsLeft}
                onRow={(record: any, index: number) => {
                  return {
                    onClick: () => {
                      setDataFormLeft(record, index);
                    },
                  };
                }}
              />
            </div>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} >
          <div>
            <div style={{height: '45px', lineHeight: '36px'}}>
              <span style={{color: '#333333'}}>已添加字段</span>
              <span style={{color: '#1890ff', margin: '0 0 0 20px'}}>上下拖拽可以改变字段顺序</span>
            </div>
            <DndProvider backend={HTML5Backend}>
              <div style={{border: '1px solid #d9d9d9', height: 'calc(100vh - 36px - 51px - 85px)', overflowY: 'auto'}}>
                <Table
                  dataSource={gridData}
                  components={components}
                  pagination={false}
                  size="small"
                  showHeader={false}
                  columns={columnsRight}
                  onRow={(_record, index) => ({
                    index,
                    moveRow,
                  })}
                />
              </div>
            </DndProvider>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default FieldSetting;