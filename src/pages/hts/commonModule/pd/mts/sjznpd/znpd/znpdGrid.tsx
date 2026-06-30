import React, { useEffect, useState, useImperativeHandle } from 'react';
import { Table } from 'antd';
import type { DDBaseGridProps, PaginationProps } from '@/components/DDBaseGrid/data.d';
import { getGridData } from '@/pages/hts/services/htsApi';
import UnitUtil from '@/components/DDBunit/unit_util';
import DDAlert from '@/pages/hts/components/DDAlert';
import './style.less';

const ZnfxGrid: React.FC<DDBaseGridProps> = ({
  columns,
  queryParam,
  sort = [],
  url = '',
  rowKey,
  size = 'small',
  rowSelection,
  scroll={ x: `${document.documentElement.clientWidth - 645}px`, y: `${document.documentElement.clientHeight - 313}px` },
  showTotalText = true,
  bordered = false,
  actionRef,
  pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
    size: 'default',
    showLessItems: true,
    hideOnSinglePage: false,
    showSizeChanger: true,
    showQuickJumper: false,
    pageSizeOptions: [10, 20, 50, 100],
    showTotal(total: any, range: any[]) {
      return showTotalText ? `共${total}条，当前${range[0]}到${range[1]}条` : '';
    },
  },
  getAssembleSearchModel,
  ...otherProps
}) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myPagination, setPagination] = useState<PaginationProps>(pagination);
  const [mySorter, setMySorter] = useState<any>(sort);
  const [headerFilter, setHeaderFilter] = useState<any>();
  const [mySearchModel, setMySearchModel] = useState<any>([]);
  const [myInitSearchModel, setMyInitSearchModel] = useState<any>([]);



  // 获取当前表格排序方式
  const getGridSort = (paramSort?: any, flag?: any) => {
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
    let gridTotalNum: number = 0;
    let myGridDataSource: any = [];
    const { pageSize, page, orderModel, searchModel, initSearchModal = myInitSearchModel, headerSearchModel, afterReload, from, ...oth } = param;
    if (url && param?.key) {  // 通过接口查询数据
      setLoading(true);
      const gridSort = from === 'onchange' ? orderModel : getGridSort();
      // 获取列头筛选表单值
      let headerSearchModelTmp: any = headerSearchModel?.length >= 0 ? headerSearchModel : null;
      if (!headerSearchModelTmp) {
        headerSearchModelTmp = headerFilter || [];
      }
      setMySearchModel((searchModel && searchModel?.length > 0) ? [...searchModel] : []);
      setMyInitSearchModel(initSearchModal);
      let querySearchModel: any = (searchModel && searchModel?.length > 0) ? [...searchModel] : [];
      querySearchModel = querySearchModel.concat(headerSearchModelTmp);
      querySearchModel = querySearchModel.concat(initSearchModal);
      const data: any = {
        ...queryParam,
        pageSize,
        page,
        searchModel: [...querySearchModel],
        orderModel: [...gridSort],
        ...oth,
      }
      delete data.initSearchModal;
      getGridData(url, data).then((response) => {
        if (response.code === '-999') {
          DDAlert.open({
            title: '系统提示',
            info: response.desc,
            content: response.msg,
            infoType: 'info',
          });
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
      })
    }
  };


  // 设置: 分页
  const handleOnChange = (currentPagination: any, filters: any, sorter: any) => {
    let assembleSearchModel12: any = []
    if (getAssembleSearchModel) {
      assembleSearchModel12 = getAssembleSearchModel();
    }
    const newColumns = changeColumesRoF1(columns);
    // 获取列头筛选表单值
    const headerSearchModel = UnitUtil.grid.assembleColSearchModel(filters, newColumns) || [];
    setHeaderFilter(headerSearchModel);
    const assembleSearchModel: any = [...assembleSearchModel12];
    setMySorter(sorter);
    const newsort: any = getGridSort(sorter, 1);
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
        key: queryParam?.key,
      });
    }
  }


  useEffect(() => {
    const searchParam = {
      page: 1,
      pageSize: myPagination.pageSize,
      ...queryParam,  // 默认参数   { searchModel: [], orderModel: [], key: '' }
    };
    setGridData(searchParam);
  }, [queryParam]);

  // 获取表格header
  const getColumnsdata = () => {
    return [...columns];
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

  // useImperativeHandle
  useImperativeHandle(actionRef, () => {
    return {
      getColumnsdata,
      getPagination,
      getHeaderFilter,
      clearHeaderFilter,
    };
  });

  const changeColumesRoF1 = (columns: any[]) => {
    let newData: any = [];
    changeColumesRoF(columns, newData)
    return newData;
  }
  const changeColumesRoF = (columns: any[], newData: any[]) => {
    columns.map((data: any) => {
      if (data.children && data.children.length > 0) {
        changeColumesRoF(data.children, newData)
      } else {
        newData.push(data)
      }
    });
  }
  const tableEle: any = <div className='dd-table dd_znpd_grid'>
    <Table
      tableLayout='fixed'
      showSorterTooltip={false}
      bordered={bordered}
      columns={columns}
      rowKey={rowKey}
      rowSelection={rowSelection}
      dataSource={dataSource}
      pagination={myPagination}
      onChange={handleOnChange}
      size={size}
      loading={loading}
      scroll={scroll}
      {...otherProps}
    />
  </div>;


  return tableEle;
};
export default ZnfxGrid;