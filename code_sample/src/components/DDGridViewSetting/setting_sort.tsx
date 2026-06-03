import React, { useState, useImperativeHandle, useCallback, useRef } from 'react';
import { Table, Button,  Divider, Tag, Alert } from 'antd';
import { FallOutlined, RiseOutlined, MinusOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import './style.less';

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
    drop: (item: any) => {
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

export interface DDSortProps {
  onRef?: any;
  data?: any;
}

const DDSort: React.FC<DDSortProps> = ({
  onRef,
  data,
}) => {
  const [gridData, setGridData] = useState<any>(data);

  // 配置列表列
  const columns: any= [
    { title: '序号', dataIndex: 'index', width: 80, align: 'center', render: (_text: any, _record: any, index: number) => (
      <span>{index + 1}</span>)
    },
    { title: '排序列', dataIndex: 'col' },
    { title: '排序规则', dataIndex: 'order', align: 'center', width: 80, render: (text: string) => {
      if (text === 'desc') {
        return <FallOutlined style={{fontSize: '14px', color: '#3b5999'}} />;
      } else if (text === 'asc') {
        return <RiseOutlined style={{fontSize: '14px', color: '#55acee'}} />;
      }
      return <MinusOutlined style={{fontSize: '14px', color: '#d2d2d2'}}/>;
    }},
    { title: '操作', width: 230, align: 'center', render: (_text: any, _record: any, index: number) => (<>
      <Button type='link' disabled={_record.order === 'asc'} onClick={() => changeRule(index ,'asc')} >升序</Button>
      <Divider type='vertical' />
      <Button type='link' disabled={_record.order === 'desc'} onClick={() => changeRule(index, 'desc')} >降序</Button>
      <Divider type='vertical' />
      <Button type='link' disabled={_record.order !== 'desc' && _record.order !== 'asc'} onClick={() => changeRule(index, 'default')} >取消</Button>
    </>)},
  ];

  // 获取设置信息
  const getSettingSort = () => {
    const rules = gridData.filter((row: any) => { return row.order !== 'default' })
    return rules;
  };

  // 获取设置源信息
  const getSettingSortSource = () => {
    return gridData;
  };
  // 选择方案设置源信息
  const setSettingSortSource = (data: any) => {
    setGridData(data);
  };
  useImperativeHandle(onRef, () => {
    return {
      getSettingSort,
      getSettingSortSource,
      setSettingSortSource
    };
  });

  // 切换规则
  const changeRule = useCallback(
    (index: number, rule: any) => {
      const newData = gridData.concat([]);
      newData[index].order = rule;
      setGridData(newData);
    },
    [gridData]
  );

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };

  const getRuleTag = () => {
    const showRules: any = [];
    if (!gridData || gridData.length === 0) {
      return showRules;
    }
    gridData.forEach((row: any, index: number) => {
      if (row.order === 'desc') {
        showRules.push(<Tag icon={<FallOutlined />} key={index.toString()} color="#55acee">{row.col}</Tag>);
      }
      if (row.order === 'asc') {
        showRules.push(<Tag icon={<RiseOutlined />} key={index.toString()} color="#3b5999">{row.col}</Tag>);
      }
    });
    return showRules;
  }

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

  return (
    <>
      <div className="dd_sort_wrap">
        <div style={{margin: '0px 5px 10px 5px'}}>选中排序规则：{getRuleTag()}</div>
        <Alert message="拖拽表单行进行上下排序" type="info" showIcon style={{margin: '0 0 10px 0'}}/>
        <DndProvider backend={HTML5Backend}>
          <Table
            dataSource={gridData}
            components={components}
            pagination={false}
            size="small"
            columns={columns}
            rowKey="name"
            onRow={(_record, index) => ({
              index,
              moveRow,
            })}
          />
        </DndProvider>
      </div>
    </>
  );
};

export default DDSort;