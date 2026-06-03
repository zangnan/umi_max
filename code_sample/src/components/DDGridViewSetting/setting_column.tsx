import React, { useState, useImperativeHandle, useEffect, useCallback, useRef } from 'react';
import { Table, Alert, Input, Button, Divider, Space, Checkbox, message } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DownOutlined, UpOutlined, DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';
import './style.less';

const type = 'DraggableBodyRow';

const DraggableBodyRow: any = ({ index, moveRow, className, style, ...restProps }) => {
  const ref: any = useRef();
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
    drop: (item: any, monitor: any) => {
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

export interface DDColumnProps {
  onRef?: any;
  data?: any;
}

const DDColumn: React.FC<DDColumnProps> = ({
  onRef,
  data,
}) => {
  const [tmpGridData, setTmpGridData] = useState<any>([]);
  const [gridData, setGridData] = useState<any>(data);
  const [selectionRowKeys, setSelectionRowKeys] = useState<any>([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState<any>(false);
  const [searchText, setSearchText] = useState<any>('');



  // 配置列表列
  const columns: any = [
    { title: '序号', dataIndex: 'index', width: 80, align: 'center', render: (_text: any, _record: any, index: number) => {
      if (_record?.type !== 'children') {
        _record.serialNumber = index + 1;
      }
      let i: any = _record.serialNumber;
      if (_record.children && _record.children.length > 0) {
        _record.children.map((item: any, indexChildren: any) => {
          item.serialNumber = _record.serialNumber + '-' + (indexChildren + 1);
        })
      }
      return <><span>{i}</span></>
    }},
    { title: '列', dataIndex: 'title', render: (_text: any) => {
      let aa:any = _text;
      if(typeof(aa)=='string'){
        const reg = new RegExp("{br}");
        aa = _text.replace(reg,"");
      }
      return <><span>{aa}</span></>
    }},
    { title: '固定列', width: 100, dataIndex: 'fixed', render: (_text: any) => {
      if (_text === 'left') {
        return <>居左</>
      }
      if (_text === 'right') {
        return <>居右</>
      }
      return <></>
    }},
    { title: '操作', width: 400, align: 'center', render: (_text: any, _record: any, index: number) => (<>
      <Button type='link' onClick={() => setPosition(index ,'top', _record)} disabled={isDisabled(index, 'top', _record)}><DoubleLeftOutlined rotate={90}/></Button>
      <Divider type='vertical' />
      <Button type='link' onClick={() => setPosition(index, 'up', _record)} disabled={isDisabled(index, 'up', _record)}><UpOutlined /></Button>
      <Divider type='vertical' />
      <Button type='link' onClick={() => setPosition(index, 'down', _record)} disabled={isDisabled(index, 'down', _record)}><DownOutlined /></Button>
      <Divider type='vertical' />
      <Button type='link' onClick={() => setPosition(index, 'bottom', _record)} disabled={isDisabled(index, 'bottom', _record)}><DoubleRightOutlined rotate={90} /></Button>
      <Divider type='vertical' />
      <Button type='link' onClick={() => setPosition(index, 'left', _record)} disabled={isDisabled(index, 'left', _record)}>居左冻结</Button>
      <Divider type='vertical' />
      <Button type='link' onClick={() => setPosition(index, 'right', _record)} disabled={isDisabled(index, 'right', _record)}>居右冻结</Button>
      <Divider type='vertical' />
      <Button type='link' onClick={() => setPosition(index, 'cancel', _record)} disabled={isDisabled(index, 'cancel', _record)}>取消冻结</Button>
    </>)},
  ];

  // 操作列按钮禁用判断
  /*
    1 居左列的最上一个，置顶、上移置灰
    2 居左列的最后一个，置底、下移置灰
    3 居右列的最上一个，置顶、上移置灰
    4 居右列的最后一个，置底、下移置灰
    5 自由列的最上一个，置顶、上移置灰
    6 自由列的最后一个，置底、下移置灰
    7 固定列的置顶、置底、上移、下移的范围仅限于固定列
    8 自由列的置顶、置底、上移、下移的范围仅限于自由列
    9 二级表头列活动范围为其所在一级表头下，适用以上自由列规则
  */
  useEffect(() => {
    setTmpGridData(gridDataFilter())
  }, [gridData]);

  const isDisabled = (index: any, flag: any, record: any) => {
    let tmpArr: any = [];
    // 过滤需要隐藏的列
    if (tmpGridData.length === 0) {
      tmpArr = gridDataFilter();
    } else {
      tmpArr = tmpGridData;
    }

    const fixedType = record.fixed; // 获取列类型（固定列、自由列）

    let tempData: any = [];
    if (record.type === 'children') {// 当前列为二级表头时，做以下处理（将操作数据源替换为当前二级表头所在的范围）
      tempData = tmpArr.filter((item: any) => {
        return record.parentNode === item.dataIndex;
      })
      tempData = [].concat(tempData[0]?.children);
    } else {// 不是二级表头时正常获取数据源
      tempData = [].concat(tmpArr);
    }

    let leftFreeIndex = 0; // 自由列首列索引
    let leftFixedIndex = 0; // 居左末列索引
    for (let i = 0; i < tempData.length; i++) {
      if (tempData[i]?.fixed !== 'left') {
        leftFreeIndex = i;
        leftFixedIndex = i - 1;
        break;
      }
    }
    let rightFreeIndex = tempData.length - 1; // 自由列末列索引
    let rightFixedIndex = tempData.length - 1; // 居右首列索引
    for (let i = tempData.length - 1; i >= 0; i--) {
      if (tempData[i]?.fixed !== 'right') {
        rightFreeIndex = i;
        rightFixedIndex = i + 1;
        break;
      }
    }
    let fixedLeftTop = record?.fixed === 'left' && index === 0 ? true : false;
    let freeTop = leftFreeIndex === index || index === 0 ? true : false;
    let fixedRightTop = rightFixedIndex === index ? true : false;
    let fixedLeftBottom = leftFixedIndex === index ? true : false;
    let freeBottom = rightFreeIndex === index || (tempData.length - 1) === index ? true : false;
    let fixedRightBottom = record?.fixed === 'right' && (tempData.length - 1) === index ? true : false;

    if (flag === 'up') {
      return (fixedLeftTop || freeTop || fixedRightTop) ? true : false;
    } else if (flag === 'down') {
      return (fixedLeftBottom || freeBottom || fixedRightBottom) ? true : false;
    } else if (flag === 'top') {
      return (fixedLeftTop || freeTop || fixedRightTop) ? true : false;
    } else if (flag === 'bottom') {
      return (fixedLeftBottom || freeBottom || fixedRightBottom) ? true : false;
    } else if (flag === 'left') {
      return (fixedType === 'left' || record.type === 'children') ? true : false;
    } else if (flag === 'right') {
      return (fixedType === 'right' || record.type === 'children') ? true : false;
    } else if (flag === 'cancel') {
      return (!fixedType || !(fixedType === 'left' || fixedType === 'right') || record.type === 'children') ? true : false;
    } else {
      return true;
    }
  };

  // 上移 下移 置顶 置底
  const setPosition = (index: any, flag: any, record: any) => {
    const tmpArr = gridDataFilter();// 过滤需要隐藏的列
    const fixedType = record.fixed; // 获取列类型（固定列、自由列）

    let tempData: any = [];
    let parentIndex: any = '';
    if (record.type === 'children') {// 当前列为二级表头时，做以下处理（将操作数据源替换为当前二级表头所在的范围）
      tempData = tmpArr.filter((item: any, index: any) => {
        if (record.parentNode === item.dataIndex) {
          parentIndex = index;
        }
        return record.parentNode === item.dataIndex;
      })
      tempData = [].concat(tempData[0].children);
    } else {// 不是二级表头时正常获取数据源
      tempData = [].concat(tmpArr);
    }
  
    let leftFreeIndex = 0; // 自由列首列索引
    let leftFixedIndex = 0; // 居左末列索引
    for (let i = 0; i < tempData.length; i++) {
      if (tempData[i]?.fixed !== 'left') {
        leftFreeIndex = i;
        leftFixedIndex = i - 1;
        break;
      }
    }
    // for (let i = 0; i < tempData.length; i++) {
    //   if (tempData[i]?.fixed === 'left') {
    //     leftFreeIndex = i + 1;
    //     leftFixedIndex = i - 1;
    //   }
    // }
    let rightFreeIndex = tempData.length - 1; // 自由列末列索引
    let rightFixedIndex = tempData.length - 1; // 居右首列索引
    for (let i = tempData.length - 1; i >= 0; i--) {
      if (tempData[i]?.fixed !== 'right') {
        rightFreeIndex = i + 1;
        rightFixedIndex = i + 2;
        break;
      }
    }
    // for (let i = tempData.length - 1; i >= 0; i--) {
    //   if (tempData[i]?.fixed === 'right') {
    //     rightFreeIndex = i;
    //     rightFixedIndex = i + 1;
    //   }
    // }
    if (flag === 'up') {// 上移
      [tempData[index], tempData[index - 1]] = [tempData[index - 1], tempData[index]];
    } else if (flag === 'down') {// 下移
      [tempData[index], tempData[index + 1]] = [tempData[index + 1], tempData[index]];
    } else if (flag === 'top') {// 置顶
      if (fixedType === 'left') {
        tempData.unshift(tempData.splice(index, 1)[0]);
      } else if (fixedType === 'right') {
        tempData.splice(rightFixedIndex - 1, 0, tempData.splice(index, 1)[0]);
      } else {
        tempData.splice(leftFreeIndex, 0, tempData.splice(index, 1)[0]);
      }
    } else if (flag === 'bottom') {// 置底
      if (fixedType === 'right') {
        const newtemp = tempData[index];
        tempData.push(newtemp);
        tempData.splice(index, 1);
      } else if (fixedType === 'left') {
        const newtemp = tempData[index];
        tempData.splice(leftFixedIndex + 1, 0, newtemp);
        tempData.splice(index, 1);
      } else {
        const newtemp = tempData[index];
        tempData.splice(rightFreeIndex, 0, newtemp);
        tempData.splice(index, 1);
      }
    } else if (flag === 'left') {// 居左冻结
      tempData[index].fixed = 'left';
      const newtemp = tempData[index];
      tempData.splice(leftFreeIndex, 0, newtemp);
      tempData.splice(index + 1, 1);
    } else if (flag === 'right') {// 居右冻结
      tempData[index].fixed = 'right';
      const newtemp = tempData[index];
      tempData.splice(rightFreeIndex, 0, newtemp);
      tempData.splice(index, 1);
    } else if (flag === 'cancel') {// 取消冻结
      delete tempData[index].fixed;
      if (fixedType === 'left') {
        const newtemp = tempData[index];
        tempData.splice(leftFreeIndex, 0, newtemp);
        tempData.splice(index, 1);
      } else if (fixedType === 'right') {
        const newtemp = tempData[index];
        tempData.splice(rightFreeIndex, 0, newtemp);
        tempData.splice(index + 1, 1);
      }
    }

    let newArr: any = [];
    if (record.parentNode) {// 当前列为二级表头时，做以下处理后重新赋值
      tmpArr[parentIndex].children = [].concat(tempData);
      newArr = [].concat(tmpArr);
    } else {// 不是二级表头时正常赋值
      newArr = [].concat(tempData);
    }
    // 重新赋值渲染
    setGridData(newArr);
  };

  // 列信息处理
  const columnHandle = (list: any) => {
    let tmpArr: any = [];
    list.map((tmp: any) => {
      delete tmp.settingFlagColumn;
      if (selectionRowKeys.indexOf(tmp.dataIndex) === -1) {
        tmp.settingFlagColumn = 'hidden';
      }
      if (tmp.children && tmp.children.length > 0) {
        tmpArr = columnHandle(tmp.children);
        tmp.children = tmpArr;
      }
    });
    return list
  }
  // 获取设置信息
  const getSettingColumn = () => {
    const show: any = [];
    const hidden: any = [];
    gridData.map((tmp: any) => {
      delete tmp.settingFlagColumn;
      if (selectionRowKeys.indexOf(tmp.dataIndex) === -1) {
        tmp.settingFlagColumn = 'hidden';
        hidden.push(tmp);
      } else {
        show.push(tmp);
      }
      if (tmp.children && tmp.children.length > 0) {
        const tmpArr = columnHandle(tmp.children);
        tmp.children = tmpArr;
      }
    });
    const all: any = [].concat(gridData);
    setGridData(all);
    return {
      show,   // 显示列
      hidden, // 隐藏列
      all,    // 全量列
    };
  };

  // 获取设置源信息
  const getSettingColumnSource = () => {
    gridData.map((tmp: any) => {
      delete tmp.settingFlagColumn;
      if (selectionRowKeys.indexOf(tmp.dataIndex) === -1) {
        tmp.settingFlagColumn = 'hidden';
      } else {
      }
      if (tmp.children && tmp.children.length > 0) {
        const tmpArr = columnHandle(tmp.children);
        tmp.children = tmpArr;
      }
    });
    return gridData
  };

  const changeDataChildren = (data: any, dataindex: any) => {
    data.map((item: any) => {
      if(item.children && item.children.length > 0) {
        item.type = 'children';
        item.parentNode = dataindex ? dataindex : item.dataIndex;
        changeDataChildren(item.children, item.parentNode);
      }
    })
    return data;
  }

  // 选择方案设置源信息
  const setSettingColumnSource = (data: any) => {
    let tmpSelectRowKeys: any = []
    tmpSelectRowKeys = defaultSelectRowKeys(data);
    setSelectionRowKeys(tmpSelectRowKeys);
    data.map((row: any) => {
      if (row.children && row.children.length > 0) {
        changeColumesRoF(row.children, row.dataIndex);
        // row.children.map((item: any) => {
        //   item.type = 'children';
        //   item.parentNode = row.dataIndex;
        // })
      }
    })
    setGridData([].concat(data));
  };

  useImperativeHandle(onRef, () => {
    return {
      getSettingColumn,
      getSettingColumnSource,
      setSettingColumnSource
    };
  });

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };


  const changeColumesMove = (columns: any, arry: any, index: any, code: any) => {
    index++;
    columns.map((data: any) => {
      data.cj = index;
      data.code = code;
      arry.push(data)
      if(data.children && data.children.length > 0) {
        changeColumesMove(data.children, arry, index, code);
      }
    })
    return arry
  }

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      let tempData: any = [];
      const tmpArr = gridDataFilter();// 过滤需要隐藏的列
      tmpArr.forEach((item: any, index:any) => {// 重新组装数据至同一级
        const cj  = 1;
        item.cj = cj;
        item.code = item.dataIndex + '-' + index;
        tempData.push(item);
        if (item.children && item.children.length > 0) {
          tempData = changeColumesMove(item.children, tempData, cj, item.code)
        }
      });
      const dragRow = tempData[dragIndex]; // 选择的列
      const dropRow = tempData[hoverIndex]; // 拖拽至的列
      // 拖拽行与目标行类型判断，同类才可拖拽
      if ((dragRow.type && dragRow.type === 'children') || (dropRow.type && dropRow.type === 'children')) {
        if (dragRow.cj === dropRow.cj) {
          const dragCode  = dragRow.code;
          const xgArry:any = [];
          tempData.forEach((item: any) => {
            if(item.cj === 1 && item.code === dragCode) {
              // 处理数据
              if(dragRow.cj === 2 && item.children && item.children.length > 0) {
                // 第二层
                const newDragRow = item.children.filter((item2: any) => {
                  return item2.dataIndex != dragRow.dataIndex;
                });
                let newDropRowIndex = 0;
                for(let i=0; i<newDragRow.length; i++) {
                  if(newDragRow[i].dataIndex === dropRow.dataIndex){
                    newDropRowIndex = i;
                    break;
                  }
                }
                newDragRow.splice(newDropRowIndex, 0, dragRow);
                item.children = newDragRow;
              } else if(dragRow.cj === 3 && item.children && item.children.length > 0) {
                // 第三层
                let newChildren:any;
                let newChildrenIndex = 0;
                for(let j=0; j<item.children.length; j++) {
                  if(item.children[j].dataIndex === dragRow.parentNode){
                    newChildren = item.children[j]?.children;
                    newChildrenIndex = j
                  }
                }
                const newDragRow = newChildren.filter((item2: any) => {
                  return item2.dataIndex != dragRow.dataIndex;
                });
                let newDropRowIndex = 0;
                for(let i=0; i<newDragRow.length; i++) {
                  if(newDragRow[i].dataIndex === dropRow.dataIndex){
                    newDropRowIndex = i;
                    break;
                  }
                }
                newDragRow.splice(newDropRowIndex, 0, dragRow);
                item.children[newChildrenIndex].children = newDragRow;
              }
            }
          })
          tempData.forEach((item: any) => {
            if (item.cj === 1) {
              xgArry.push(item)
            }
          })
          setGridData(xgArry);
        } else {
          message.error('此列只能跟与其同层级列进行调换顺序的操作。');
        }
      } else {
        if (dragRow?.fixed === dropRow?.fixed) {
          tempData.splice(hoverIndex, 0, tempData.splice(dragIndex, 1)[0]);
          const arr: any = [];
          tempData.forEach((item: any) => {
            if (item.type !== 'children') {
              if(item.children && item.children.length > 0){
                item.children = [];
                tempData.forEach((itemChildren: any) => {
                  if (itemChildren.parentNode === item.dataIndex) {
                    item.children.push(itemChildren);
                  }
                })
              }
              arr.push(item)
            }
          });
          setGridData(arr);
        } else {
          const dragType = dragRow?.fixed === 'left' ? '居左冻结列' : dragRow?.fixed === 'right' ? '居右冻结列' : '自由列';
          const dropType = dropRow?.fixed === 'left' ? '居左冻结列' : dropRow?.fixed === 'right' ? '居右冻结列' : '自由列';
          message.error('当前列为' + dragType + '，不能将其拖拽至' + dropType + '中。');
        }
      }
    },
    [gridData],
  );

  // 列选择
  const rowSelection = {
    onChange: (selectedRowKeys: any) => {
      setSelectionRowKeys(selectedRowKeys);
    }
  };

  // input enter
  const inputEnter = (e: any) => {
    filterData(showSelectedOnly, e.target.value);
  }
  // input search
  const inputSearch = (val: any) => {
    filterData(showSelectedOnly, val);
  }
  // input change
  const inputChange = (e: any) => {
    setSearchText(e.target.value);
  }

  // 左侧数据筛选
  const filterData = (showFlag: boolean, val?: any) => {
    function gridDataFilter(list: any) {
      list.map((tmp: any) => {
        delete tmp.filterFlag;
        // checkbox过滤
        if (showFlag) {
          if (selectionRowKeys.indexOf(tmp.dataIndex) === -1) {
            tmp.filterFlag = 'unshown';
          }
        }
        // 筛选字段过滤
        let title = tmp.title;
        if(typeof(title)!='string'){
          title = tmp.title.props.children;
        }
        if (val && title.indexOf(val) === -1) {
          tmp.filterFlag = 'unshown';
        }
        if (tmp.children && tmp.children.length > 0) {
          gridDataFilter(tmp.children);
        }
      });

    }
    gridDataFilter(gridData)
    const newArr: any = [].concat(gridData);
    setGridData(newArr);
  }

  // checkbox onChange
  function onChangeShowOnly(e: any) {
    setShowSelectedOnly(e.target.checked);
    filterData(e.target.checked, searchText);
  }

  // 默认勾选数据
  const defaultSelectRowKeys = (list: any) => {
    let tmpSelectRowKeys: any = [];
    list.forEach((row: any) => {
      if (!row.settingFlagColumn || row.settingFlagColumn !== 'hidden') {
        tmpSelectRowKeys.push(row.dataIndex);
        if (row.children && row.children.length > 0) {
          tmpSelectRowKeys = tmpSelectRowKeys.concat(defaultSelectRowKeys(row.children));
        }
      }
    });
    return tmpSelectRowKeys;
  }

  useEffect(() => {
    let tmpSelectRowKeys: any = []
    tmpSelectRowKeys = defaultSelectRowKeys(gridData);
    setSelectionRowKeys(tmpSelectRowKeys);
    gridData.map((row: any) => {
      if (row.children && row.children.length > 0) {
        changeColumesRoF(row.children, row.dataIndex);
        // row.children.map((item: any) => {
        //   item.type = 'children';
        //   item.parentNode = row.dataIndex;
        // })
      }
    })
    setGridData([].concat(gridData));
  }, []);

  const changeColumesRoF = (columns: any, dataIndex: any) => {
    columns.map((data: any) => {
      data.type = 'children';
      data.parentNode = dataIndex;
      if(data.children && data.children.length > 0) {
        changeColumesRoF(data.children, data.dataIndex);
      }
    })
  }

  const gridDataFilter = () => {
    let isChildrenCol: Boolean = false;
    gridData.forEach((col: any) => {
      if (col.children && col.children.length > 0) {
        isChildrenCol = true;
      }
    });

    let temp: any = [];
    if (isChildrenCol) {
      temp = cloneDeep(gridData);
    } else {
      temp = [].concat(gridData);
    }
    temp = temp.filter((item: any) => {
      const isShow: boolean = item.filterFlag !== 'unshown'
        && item.title !== '操作'
        // && item.title !== '序号';
      return isShow;
    });
    if (showSelectedOnly) {
      temp.map((tmp: any) => {
        if (tmp.children && tmp.children.length > 0) {
          for (let i = tmp.children.length - 1; i >= 0; i--) {
            tmp.children[i] = { ...tmp.children[i] };
            if (tmp.children[i].filterFlag === 'unshown') {
              tmp.children.splice(i, 1);
            }
          }
        }
      });
      return temp;
    }
    return temp;
  }

  return (
    <>
      <div className="dd_set_grid_column_wrap">
        <Space direction="vertical" style={{width: '100%'}} >
          {/* <Space>
            <Input.Search placeholder="请输入字段名称" style={{width: '300px'}}
              onChange={inputChange}
              onPressEnter={inputEnter}
              onSearch={inputSearch}
            />
            <Checkbox onChange={onChangeShowOnly} checked={showSelectedOnly}>仅显示已选项</Checkbox>
          </Space> */}
          <Alert type="info" showIcon message={
            <Space>
              <span>已选择：{selectionRowKeys.length}/{gridData.length}</span>
              <span>可拖拽表单行进行上下排序</span>
            </Space>
            }
          />
          <DndProvider backend={HTML5Backend}>
            <Table
              id='myTable'
              dataSource={gridDataFilter()}
              components={components}
              pagination={false}
              size="small"
              rowSelection={{
                selectedRowKeys: selectionRowKeys,
                type: 'checkbox',
                ...rowSelection,
              }}
              expandable={{defaultExpandAllRows: true, showExpandColumn: false,}}
              rowKey='dataIndex'
              columns={columns}
              onRow={(_record, index) => ({
                index,
                moveRow,
              })}
              // sticky={{
              //   offsetHeader: 36
              // }}
              // tableLayout='fixed'
              // scroll={{x: 'max-content'}}
              // scroll={{ y: 240 }}
            />
          </DndProvider>
        </Space>
      </div>
    </>
  );
};

export default DDColumn;