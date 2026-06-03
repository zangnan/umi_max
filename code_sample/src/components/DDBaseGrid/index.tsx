import React, { useEffect, useState, Fragment, useImperativeHandle, memo } from 'react';
import { Table, Spin, message } from 'antd';
import type { DDBaseGridProps, PaginationProps } from './data.d';
import { getGridData } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import UnitUtil from '@/components/DDBunit/unit_util';
import { getEditcomponents, setEditColumns } from '@/components/DDBaseGrid/editable';
import DDAlert from '@/components/DDAlert';
import './style.less';
import { cloneDeep } from 'lodash';
import Decimal from 'decimal.js'; // 引入库

const DDBaseGrid: React.FC<DDBaseGridProps> = ({
  userDataSource,
  columns,
  queryParam,
  pagination2,
  sort = [],
  url = '',
  rowKey = 'uuid',
  size = 'small',
  scroll = { x: '700px' }, // {x:'max-content'}, {x:'600px',y:`${document.documentElement.clientHeight-250}px`},
  showSerialNumber = false,
  showTotalText = true,
  bordered = myUtil.localStore.getItem('theme')?.gridBorder || false,
  actionRef,
  pageSizeOptions,
  pagination = {
    current: 1,
    pageSize: myUtil.settings.getProgramType() === 'fpzs' ? 50 : 10,
    total: 0,
    size: 'default',
    hideOnSinglePage: false,
    showSizeChanger: true,
    showQuickJumper: false,
    pageSizeOptions: pageSizeOptions?.length ? pageSizeOptions : [10, 20, 50, 100, 300 ,500, 1000],
    showTotal(total: any, range: any[]) {
      return showTotalText ? `共${total}条，当前${range[0]}到${range[1]}条` : '';
    },
  },
  components,
  afterReloadGridData,
  isSticky,
  getAssembleSearchModel,
  afterOnChange,
  isInitSearch = true,
  ...otherProps
}) => {
  const [myIsInitSearch, setMyIsInitSearch] = useState<any>(isInitSearch); // 是否初始查询
  const [dataSource, setDataSource] = useState([]);

  const [loading, setLoading] = useState(true);
  const [myPagination, setPagination] = useState<PaginationProps>(pagination);
  const [fyFlag, setFyFlag] = useState<boolean>(pagination2);
  const [mySorter, setMySorter] = useState<any>(sort);
  const [headerFilter, setHeaderFilter] = useState<any>();
  const [mySearchModel, setMySearchModel] = useState<any>([]);
  const [myInitSearchModel, setMyInitSearchModel] = useState<any>([]);

  // 设置: 列
  const getColumns = (cols: any) => {
    let finalCols: any = [...cols];
    // 设置: 序号
    if (showSerialNumber) {
      const colSerialNumber: any = {
        title: '序号', dataIndex: 'serialNumber', width: 80, fixed: 'left', align: 'center', ellipsis: true, render: (_text: string, _record: any, index: number) => (
          <Fragment>
            {myPagination ? ((myPagination.current - 1) * (myPagination.pageSize) + index + 1) : (index + 1)}
          </Fragment>
        )
      };
      const [first] = [...finalCols];
      if (first && first.title !== '序号') {
        finalCols.unshift(colSerialNumber);
      }
    }

    let isChildrenCol: Boolean = false;
    finalCols.forEach((col: any) => {
      if (col.children && col.children.length > 0) {
        isChildrenCol = true;
      }
    });
    if (isChildrenCol) {
      // 设置: 隐藏列(配置中的隐藏列)
      finalCols = setFinalCols(finalCols);
      function setFinalCols(list: any) {
        let temp = cloneDeep(list);
        temp = temp.filter((item: any) => {
          return (!(item.hidden && item.hidden !== false));
        });
        temp.map((tmp: any) => {
          if (tmp.children && tmp.children.length > 0) {
            for (let i = tmp.children.length - 1; i >= 0; i--) {
              tmp.children[i] = { ...tmp.children[i] };
              if (tmp.children[i].hidden && tmp.children[i].hidden === true) {
                tmp.children.splice(i, 1);
              }
            }
          }
        });
        return temp;
      }
      // 设置: 隐藏列(视图中可供用户调整的隐藏列)
      finalCols = setFinalColsFlag(finalCols);
      function setFinalColsFlag(list: any) {
        let temp = cloneDeep(list);
        temp = temp.filter((item: any) => {
          return item.settingFlagColumn === undefined || item.settingFlagColumn !== 'hidden' || item.title === '操作' || item.title === '序号';
        });
        temp.map((tmp: any) => {
          if (tmp.children && tmp.children.length > 0) {
            for (let i = tmp.children.length - 1; i >= 0; i--) {
              tmp.children[i] = { ...tmp.children[i] };
              if (tmp.children[i].settingFlagColumn && tmp.children[i].settingFlagColumn === 'hidden') {
                tmp.children.splice(i, 1);
              }
            }
          }
        });
        return temp;
      }
    } else {
      // 设置: 隐藏列(配置中的隐藏列)
      finalCols = finalCols.filter((col: any) => {
        return (!(col.hidden && col.hidden !== false));
      })
      //设置: 隐藏列(视图中可供用户调整的隐藏列)
      finalCols = finalCols.filter((col: any) => {
        return col.settingFlagColumn === undefined || col.settingFlagColumn !== 'hidden' || col.title === '操作' || col.title === '序号';
      })
    }

    // 设置: 编辑列
    finalCols = setEditColumns({
      columns: finalCols,
      reload,
      handleSave: handleSavecell,
      onClick: handleClickcell,
      unitRef:''
    });
    return finalCols;
  }

  // 设置: 列表主键
  const getRowKey = () => {
    let myRowkey: any;
    if (typeof rowKey === 'function') {
      myRowkey = rowKey;
    } else if (Array.isArray(rowKey)) { // 联合主键
      myRowkey = (record: any) => getYwKey(record);
    } else if (typeof rowKey === 'object' && rowKey.type === '1') {
      myRowkey = (record: any) => getZdyYwKey(record);
    }
    else {
      myRowkey = (record: any) => record[rowKey];
    }
    return myRowkey;
  }
  // 自定义业务key
  const getZdyYwKey = (record: any) => {
    const tmp: any = [];
    rowKey.key.forEach((item: any) => {
      tmp.push(record[item]);
    });
    return tmp.join("");
  }

  const getYwKey = (record: any) => {
    const tmp: any = [];
    rowKey.forEach((item: any) => {
      tmp.push(record[item]);
    });
    return tmp.join("");
  }

  // 获取当前表格排序方式
  const getGridSort = (paramSort?: any, flag?: any) => {
    // console.info('获取当前表格排序方式');
    // 点击列表组件的排序按钮，则传入paramSort
    // 其他渠道查询数据，如点击筛选区域查询按钮，则采用state：mySorter
    const targetSortObj: any = paramSort ? paramSort : mySorter;
    const gridSort: any = [];
    if (Array.isArray(targetSortObj)) {
      targetSortObj.forEach((item: any) => {
        if (item.order) {
          gridSort.push({
            field: item.field,
            order: item.order === 'ascend' ? 'asc' : 'desc', // ascend descend
          });
        }
      })
    } else {
      if (targetSortObj.order) {
        gridSort.push({
          field: targetSortObj.field,
          order: targetSortObj.order === 'ascend' ? 'asc' : 'desc', // ascend descend
        });
      }
    }
    return gridSort;
  }

  // 设置: 表格数据
  const setGridData = (param?: any) => {
    setLoading(true);
    
    let gridTotalNum: number = 0;
    let myGridDataSource: any = [];
    if (userDataSource) { // 数据直接传入
      const filterData = filterGridData(userDataSource);
      gridTotalNum = filterData.length;
      if (myPagination) {
        myGridDataSource = filterData;
        setDataSource(filterData);
        setPagination(Object.assign(pagination, {
          total: filterData.length
        }));
      } else if (!myPagination) { // 无分页 myPagination === null
        myGridDataSource = filterData;
        setDataSource(myGridDataSource);
      }
      setLoading(false);
      handleAfterReload(gridTotalNum, myGridDataSource);
    } else if (url) {  // 通过接口查询数据
      setLoading(false);
      if (myIsInitSearch) {
        setLoading(true);
        const { pageSize, page, orderModel, searchModel, initSearchModal = myInitSearchModel, headerSearchModel, afterReload, from, ...oth } = param;
        // const gridSort = (orderModel && orderModel.length > 0) ? orderModel : getGridSort();
        // const gridSort = (orderModel && orderModel.length > 0) ? orderModel : getGridSort();
        const gridSort = from === 'onchange' ? orderModel : getGridSort();
        // 获取列头筛选表单值
        let headerSearchModelTmp: any = headerSearchModel?.length >= 0 ? headerSearchModel : null;
        if (!headerSearchModelTmp) {
          headerSearchModelTmp = headerFilter || [];
        }
        setHeaderFilter(headerSearchModelTmp)
        setMySearchModel((searchModel && searchModel.length > 0) ? [...searchModel] : []);
        setMyInitSearchModel(initSearchModal);
        let querySearchModel: any = (searchModel && searchModel.length > 0) ? [...searchModel] : [];
        querySearchModel = querySearchModel.concat(headerSearchModelTmp);
        querySearchModel = querySearchModel.concat(initSearchModal);
        const data: any = {
          ...convertQueryParam(),
          pageSize,
          page,
          searchModel: [...querySearchModel],
          orderModel: [...gridSort],
          ...oth,
        }
        delete data.initSearchModal;
        if (pagination2 == false) {
          data.pageSize = 1000000000
        }
        getGridData(url, data).then((response) => {
          // 列表查询返回非200给出提示，
          if (response.code != '200') {
            message.error(response.msg);
            setLoading(false);
            return;
          }
          if (myPagination) { // 含有分页 && 查询出数据
            myGridDataSource = response?.body?.rows || [];
            setDataSource(response?.body?.rows || []);
            gridTotalNum = response?.body?.rowCount || 0;
            setPagination(Object.assign(pagination, {
              total: gridTotalNum,
              pageSize,
              current: page,
            }));
          } else if (!myPagination) { // 无分页 myPagination === false
            myGridDataSource = response?.body;
            setDataSource(response.body);
            gridTotalNum = response?.body?.length || 0;
          }
          setLoading(false);
          // 共通的加载后执行
          handleAfterReload(gridTotalNum, myGridDataSource);
          // 自定义的加载后执行
          if (afterReload) {
            afterReload();
          }
        })
      } 
    }
  };

  // 共通的加载后执行
  const handleAfterReload = (gridTotalNum: number, gridDataSource: any) => {
    if (afterReloadGridData) {
      const param: any = {
        gridTotalNum: gridTotalNum || 0,
        dataSource: [...gridDataSource],
      };
      afterReloadGridData(param);
    }
  }

  // 设置: 分页
  const handleOnChange = (currentPagination: any, filters: any, sorter: any, extra: any) => {
    let assembleSearchModel12: any = []
    if (getAssembleSearchModel) {
      assembleSearchModel12 = getAssembleSearchModel();
    }
    const newColumns = changeColumesRoF1(columns);
    // 获取列头筛选表单值
    const headerSearchModel = UnitUtil.grid.assembleColSearchModel(filters, newColumns) || [];
    // setHeaderFilter(filters);
    setHeaderFilter(headerSearchModel);
    // const assembleSearchModel: any = [...assembleSearchModel12, ...headerSearchModel];
    const assembleSearchModel: any = [...assembleSearchModel12];
    setMySorter(sorter);
    const newsort: any = getGridSort(sorter, 1);
    // console.info('设置: 分页');
    // console.info(sorter);
    // console.info(newsort);
    if (pagination) {
      setPagination(Object.assign(pagination, currentPagination));
      setGridData({
        page: currentPagination.current,
        pageSize: currentPagination.pageSize,
        orderModel: [...newsort],
        initSearchModal: myInitSearchModel,
        searchModel: [...assembleSearchModel],
        headerSearchModel: headerSearchModel,
        from: 'onchange',
      });
    }
    // 自定义的onchange事件，并且需要组件内部onchange正常执行时使用
    if (afterOnChange) {
      afterOnChange(currentPagination, filters, sorter, extra);
    }
  }

  // 如果出入的是字符串类型queryParam
  // 则转成Object类型
  // 避免因传入Objcet类型导致多次渲染
  const convertQueryParam = () => {
    if (typeof queryParam === 'string') {
      const fromStrQueryParam = JSON.parse(queryParam);
      console.info('字符串类型queryParam', fromStrQueryParam);
      return fromStrQueryParam;
    } else {
      return queryParam;
    }
  }

  // 前端数据过滤 文字
  const filterGridData = (basicData: any) => {
    const searchModel = convertQueryParam()?.searchModel;
    if (!searchModel) {
      return basicData;
    }
    let result = basicData;		// 列表数组
    Object.keys(searchModel).forEach(key => {
      if (searchModel[key]) {
        result = result.filter((data: any) => data[key].indexOf(searchModel[key]) > -1);
      }
    });
    return result;
  }

  // by james 2021-01-27 支持前端查询不走接口
  useEffect(() => {
    const newColumns = changeColumesRoF1(columns);
    const newHeader = changeColumesHeader(columns)
    const headerSearchModel = UnitUtil.grid.assembleColSearchModel(newHeader, newColumns) || [];
    const searchParam = {
      page: 1,
      pageSize: myPagination.pageSize,
      headerSearchModel: headerFilter ? headerFilter : headerSearchModel,
      ...convertQueryParam(),  // 默认参数   { searchModel: [], orderModel: [], key: '' }
    };
    setGridData(searchParam);
  }, [queryParam, userDataSource]);

  // 刷新
  const reload = (param?: any) => {
    const { afterReload } = param || {};
    setGridData({
      page: myPagination.current,
      pageSize: myPagination.pageSize,
      searchModel: mySearchModel,
      // param,
      afterReload,
    });
    otherProps?.current?.setSelectionRowKeys([]);
    otherProps?.current?.setSelectionRows([]);
  }

  // 单元格编辑保存
  const handleSavecell = (row: any) => {
    const rowobj = { ...row }
    const newData: any = [...dataSource];
    otherProps?.current?.setSelectionRowKeys([''])
    const index = newData.findIndex((item: any) => {
      let myRowkey: any;
      let itemKey: any;
      if (typeof rowKey === 'function') {
        myRowkey = rowKey;
        itemKey = rowKey;
      } else if (Array.isArray(rowKey)) { // 联合主键
        myRowkey = getYwKey(rowobj);
        itemKey = getYwKey(item);
      } else if (typeof rowKey === 'object' && rowKey.type === '1') {
        myRowkey = getZdyYwKey(rowobj);
        itemKey = getZdyYwKey(item);
      } else {
        myRowkey = rowobj[rowKey];
        itemKey = item[rowKey];
      }
      if (myRowkey === itemKey) {
        return true;
      }
    });
    const item: any = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...rowobj,
    });
    setDataSource(newData)
  };

  // 单元格编辑时点击阻止选中
  const handleClickcell = (event: any) => {
    event.stopPropagation();
  }

  // 获取表格header
  const getColumnsdata = () => {
    return [...columns];
  }

  // 获取表格数据
  const getSource = () => {
    const getData = [...dataSource];
    return getData;
  }

  // 获取页头筛选数据
  const getHeaderFilter = () => {
    return headerFilter;
  }

  // 清空页头筛选数据
  const clearHeaderFilter = () => {
    return setHeaderFilter([]);
  }

  // 获取分页数据
  const getPagination = () => {
    return myPagination;
  }

  // 设置sticky
  const getSticky = () => {
    // https://github.com/ant-design/ant-design/issues/28762
    // Table使用了sticky并设置了offsetHeader的情况，loading的时候表格会往下掉，loading完成后又上去了
    if (isSticky) {
      return {
        sticky: {
          offsetHeader: loading ? 0 : isSticky, // offsetHeader: loading? 0: 94   offsetHeader: 94
          // offsetHeader: isSticky // 新版本已修复，待观察
          // getContainer: () => { document.getElementsByClassName('ant-table-container')[0] }
        }
      }
    }
    return;
  }

  // useImperativeHandle
  useImperativeHandle(actionRef, () => {
    return {
      getColumnsdata,
      getSource,
      reload,
      getPagination,
      getHeaderFilter,
      clearHeaderFilter,
      getGridSort,
      setIsInitSearch: setMyIsInitSearch,
    };
  });


  const summary = () => {
    let showTotal = false;
    let newColumns = changeColumesRoF1(columns);
    const summaryTable = [];
    let firstIndex = 0;
    if (showSerialNumber) {
      firstIndex += 1;
    }
    if (otherProps.rowSelection && (otherProps.rowSelection.type === 'radio' || otherProps.rowSelection.type === 'checkbox')) {
      firstIndex += 1;
    }
    for (let i = 0; i < newColumns.length; i++) {
      if (i === 0) {
        summaryTable.push(<Table.Summary.Cell className="tableSumClass" key={'heji'} index={0} colSpan={1 + firstIndex}>合计</Table.Summary.Cell>)
      } else if (newColumns[i].sum) {
        let columnSum = 0;
        let columnSumDecimal = new Decimal(0);
        let culumnString = '';
        let firstSum = 0;
        let lastSum = 0;
        let arr: any = [];
        dataSource.forEach((items) => {
          const itemNum = items[newColumns[i].dataIndex] ? items[newColumns[i].dataIndex] : '';
          if (itemNum.toString().indexOf('／') > -1) {
            arr = itemNum.split('／');
            firstSum += Number(arr[0]);
            lastSum += Number(arr[1]);
            culumnString = myUtil.text.formatNum(firstSum, newColumns[i].format) + '／' + myUtil.text.formatNum(lastSum, newColumns[i].format);
          } else if (itemNum.toString().indexOf('/') > -1) {
            arr = itemNum.split('/');
            firstSum += Number(arr[0]);
            lastSum += Number(arr[1]);
            culumnString = myUtil.text.formatNum(firstSum, newColumns[i].format) + '/' + myUtil.text.formatNum(lastSum, newColumns[i].format);
          } else {
            // columnSum += Number(itemNum);
            if (itemNum) {
              columnSumDecimal = columnSumDecimal.plus(new Decimal(itemNum));
              columnSum = Number(columnSumDecimal.toFixed(2));
            }
          }
        });
        showTotal = true;
        summaryTable.push(<Table.Summary.Cell key={i} align='right' index={i + firstIndex}>{culumnString ? culumnString : myUtil.text.formatNum(columnSum, newColumns[i].format)}</Table.Summary.Cell>)
      } else {
        summaryTable.push(<Table.Summary.Cell key={i} index={i + firstIndex}></Table.Summary.Cell>)
      }
    }
    if (showTotal) {
      return <Table.Summary fixed><Table.Summary.Row>{summaryTable}</Table.Summary.Row></Table.Summary>;
    } else {
      return false;
    }
  }

  const changeColumesRoF1 = (columns: any[]) => {
    let newData: any = [];
    changeColumesRoF(columns, newData, '');
    return newData;
  }
  const changeColumesRoF = (columns: any[], newData: any[], fixed:any) => {
    columns.map((data: any) => {
      if (data.children && data.children.length > 0) {
        if(data?.fixed === 'left' || data?.fixed === 'right' || fixed){
          changeColumesRoF(data.children, newData, fixed ? fixed : data.fixed)
        } else {
          changeColumesRoF(data.children, newData, '')
        }
      } else {
        if(fixed){
          data.fixed = fixed;
        }
        newData.push(data)
      }
    });
  }

  const changeColumesHeader = (columns: any[]) => {
    let headerSearch: any = {};
    changeColumesRoHeader(columns, headerSearch)
    return headerSearch;
  }
  const changeColumesRoHeader = (columns: any[], headerSearch: any) => {
    columns.map((data: any) => {
      if (data.children && data.children.length > 0) {
        changeColumesRoHeader(data.children, headerSearch)
      } else {
        if(data.defaultFilteredValue?.length > 0){
          headerSearch[data.dataIndex] = data.defaultFilteredValue
        }
      }
    });
  }
  const tableEle: any = <div className='dd-table'>
    <Table
      // getPopupContainer={
      //   (triggerNode: any) => {
      //     return triggerNode.parentNode;
      //     return triggerNode;
      // }}
      tableLayout='fixed'
      showSorterTooltip={false}
      bordered={bordered}
      columns={getColumns(columns)}
      rowKey={getRowKey()}
      components={getEditcomponents(columns)}
      dataSource={dataSource}
      pagination={pagination2 == false ? false : myPagination}
      onChange={handleOnChange}
      size={size}
      loading={loading}
      scroll={scroll}
      summary={summary}
      {...getSticky()}
      {...otherProps}
    />
  </div>;

  const getResult: any = () => {
    if (loading) {
      // return <Spin><div style={{minHeight: '200px'}}>&nbsp;</div></Spin>;
      return tableEle;
    }
    if (loading === false && dataSource?.length > 0) {
      return tableEle;
    }
    // return <DDEmpty image={<></>} description='暂无数据' />;
    return tableEle;
  }

  return getResult();
};
export default memo(DDBaseGrid);