import React, { useEffect, useState, Fragment, useImperativeHandle, useMemo, useCallback, memo } from 'react';
import { Table, message, Empty, Button, theme } from 'antd';
import type { DDBaseGridProps, PaginationProps } from './data';
import { getGridData } from '@/services/hts/api';
import myUtil from '../DDAssist/util';
import tableUtil from './tableUtil';
import UnitUtil from '../DDBunit/unit_util';
import CONSTANTS from '../DDAssist/constants';
import { cloneDeep } from 'lodash';
import { List, Card, Image } from 'antd';
import { C_GRID_COLUMNS } from '../DDBunit/excelConfig.v2.constants';

const DDBaseGrid: React.FC<DDBaseGridProps> = ({
  /** 表格配置对象，包含列配置、滚动、边框等设置 */
  config,
  /** 业务函数集合，包含统计、操作等回调函数 */
  func,
  /** 前端传入的数据源（可选，若不传则通过接口获取） */
  userDataSource,
  /** 表格列配置 */
  columns,
  /** 查询参数，用于数据过滤 */
  queryParam,
  /** 初始排序配置 */
  sort = [],
  /** 数据接口地址（config中配置优先） */
  url = '',
  /** 行唯一标识字段，支持字符串、数组（联合主键）或函数 */
  rowKey = 'uuid',
  /** 表格尺寸 */
  size = myUtil.theme.getThemeItem('gridSize'),
  /** 滚动配置 */
  scroll,
  /** 是否显示序号列 */
  showSerialNumber = false,
  /** 显示合计文本配置 */
  showTotalText = CONSTANTS.GRID_SHOW_TOTAL_TEXT,
  /** 是否显示边框 */
  bordered = myUtil.theme.getThemeItem('gridBorder'),
  /** 表格引用，用于暴露方法给父组件 */
  actionRef,
  /** 分页配置（设为false则无分页） */
  pagination = {
    ...CONSTANTS.GRID_PAGINATION,
    pageSize: myUtil.theme.getThemeItem('gridPaginationPagesize'),
  },
  /** 数据加载完成后的回调函数 */
  afterReloadGridData,
  /** Sticky 偏移配置 */
  isSticky,
  /** 获取组合查询模型的方法 */
  getAssembleSearchModel,
  /** 是否初始查询（默认true） */
  isInitSearch = true,
  /** 展示类型：空字符串为表格模式，'list'为卡片列表模式 */
  gridType = '',
  /** 卡片模式下的字段配置 */
  gridListCardField = {
    title: 'title',
    description: 'description',
    imagepath: '',
    videopath: '',
  },
  /** 卡片类型：1-图片 2-图片+视频 3-媒体库 4-字典生成 */
  gridListCardType = 1,
  /** 自定义卡片渲染函数 */
  gridListCardRender,
  /** 卡片操作按钮配置 */
  gridListCardAction = [],
  /** 透传给 Table 的其他属性 */
  ...otherProps
}) => {
  const [myIsInitSearch, setMyIsInitSearch] = useState<any>(isInitSearch); // 是否初始查询
  const [sum2, setSum2] = useState<any>({}); // 后端合计
  const [min2, setMin2] = useState<any>({}); // 后端最大值
  const [max2, setMax2] = useState<any>({}); // 后端最小值
  const [avg2, setAvg2] = useState<any>({}); // 后端平均值
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  let paginationTmp: any = CONSTANTS.GRID_PAGINATION;
  if (pagination) {
    paginationTmp = {
      ... CONSTANTS.GRID_PAGINATION,
      ...pagination,
    };
  } else if (pagination !== undefined && pagination === false) {
    paginationTmp = false;
  }
  const [myPagination, setPagination] = useState<PaginationProps>(paginationTmp);
  const [mySorter, setMySorter] = useState<any>(sort);
  const [headerFilter, setHeaderFilter] = useState<any>();
  const [mySearchModel, setMySearchModel] = useState<any>([]);
  const [myInitSearchModel, setMyInitSearchModel] = useState<any>([]);
  const myBordered = config?.grid_border !== undefined ? config?.grid_border : bordered;
  const api_grid_query = config?.api_grid_query || url;
  const grid_show_serial_number = config?.grid_show_serial_number !== undefined ? config?.grid_show_serial_number : showSerialNumber;
  const [myColumns, setMyColumns] = useState<any>(columns || []);
  const [myColumnsPlane, setMyColumnsPlane] = useState<any>([]);
  const myRowKey = config?.grid_row_key !== undefined ? config?.grid_row_key : rowKey;
  const gridScrollX = config?.grid_scroll_x || scroll?.x;
  const [defaultScrollX, setDefaultScrollX] = useState(700);
  const gridScrollY = config?.grid_scroll_y;
  const mySticky = config?.grid_sticky_affix || isSticky;
  const [myGridType, setMyGridType] = useState<any>(gridType);
  const [imageVisible, setImageVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<any>();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<any>();
  // themeToken
  const { useToken } = theme;
  const { token }: any = useToken();
  const colorSuccess: any = token?.Tag?.colorSuccess;
  const colorError: any = token?.Tag?.colorError;
  const colorInfo: any = token?.colorInfo;

  const changeColumesRoF = (newData: any[], col: any) => {
    col.forEach((data: any) => {
      if (data.children && data.children.length > 0) {
        changeColumesRoF(newData, data.children)
      } else {
        newData.push(data);
      }
    });
  }
  const changeColumesRoF1 = (col: any) => {
    let newData: any = [];
    changeColumesRoF(newData, col);
    return newData;
  }

  // 设置: 列
  const initTableColumns = () => {
    let col = columns?.length > 0 ? columns : tableUtil.init({
      columns: config?.grid_columns || [],
      func,
      handleColumnsDefault: config?.grid_handle_columns_default,
      handleColumns: config?.handle_columns,
      gridHandleWidth: config?.grid_handle_width,
      themeToken: token,
      config,
    })
    // 码表解析处理：从json类型入参中解析码表查询参数
    const param = myUtil.code.getCodeTableParamFromJson({
      items: [...col || []],
    });
    // 码表解析处理：获取码表接口promise
    const promiseArr = myUtil.code.getCodeTablePromise(param);
    // 码表解析处理：获取码表
    Promise.all(promiseArr)
      .then(() => {})
      .catch(() => { message.error('获取码表失败'); })
      .finally(() => {
        let finalCols: any = [...col];
        let finalCols2: any = [...col];
        // 设置: 序号
        if (grid_show_serial_number) {
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
            finalCols2.unshift(colSerialNumber);
          }
        }
        let isChildrenCol: boolean = false;
        finalCols.forEach((col: any) => {
          if (col.children && col.children.length > 0) {
            isChildrenCol = true;
          }
        });

        /**
         * 通用列过滤函数 - 提取公共逻辑减少重复代码
         * @param list 列列表
         * @param filterFn 顶层过滤条件
         * @param childFilterFn 子节点过滤条件
         */
        function filterColumns(list: any[], filterFn: (item: any) => boolean, childFilterFn?: (item: any) => boolean): any[] {
          const temp = cloneDeep(list);
          temp.filter(filterFn);
          temp.forEach((tmp: any) => {
            if (tmp.children && tmp.children.length > 0) {
              for (let i = tmp.children.length - 1; i >= 0; i--) {
                tmp.children[i] = { ...tmp.children[i] };
                if (childFilterFn && childFilterFn(tmp.children[i])) {
                  tmp.children.splice(i, 1);
                }
              }
            }
          });
          return temp;
        }

        if (isChildrenCol) {
          // 设置: 隐藏列(配置中的隐藏列) - 顶层和子节点都需要过滤
          finalCols = filterColumns(
            finalCols,
            (item: any) => !(item.hidden && item.hidden !== false),
            (item: any) => item.hidden && item.hidden === true
          );
          // 设置: 隐藏列(视图中可供用户调整的隐藏列) - 保留操作列和序号列
          finalCols = filterColumns(
            finalCols,
            (item: any) => item.settingFlagColumn === undefined || item.settingFlagColumn !== 'hidden' || item.title === '操作' || item.title === '序号',
            (item: any) => item.settingFlagColumn && item.settingFlagColumn === 'hidden'
          );
        } else {
          // 设置: 隐藏列(配置中的隐藏列)
          finalCols = finalCols.filter((col: any) => {
            return !(col.hidden && col.hidden !== false);
          });
          // 设置: 隐藏列(视图中可供用户调整的隐藏列)
          finalCols = finalCols.filter((col: any) => {
            return col.settingFlagColumn === undefined || col.settingFlagColumn !== 'hidden' || col.title === '操作' || col.title === '序号';
          });
        }
        let aa = changeColumesRoF1([...finalCols2]);
        setScrollX(aa);

        setMyColumnsPlane(aa);
        setMyColumns(finalCols);
      });
  }

  // 获取联合主键 默认___拼接
  const getYwKey = (record: any, connector: any = '___') => {
    const tmp: any = [];
    if (typeof myRowKey === 'object') {
      (myRowKey?.key || []).forEach((item: any) => {
        tmp.push(record[item]);
      });
      return tmp.join(connector);
    } 
    myRowKey.forEach((item: any) => {
      tmp.push(record[item]);
    });
    return tmp.join(connector);
  }

  // 设置: 列表主键
  const getRowKey = () => {
    let key: any;
    if (typeof myRowKey === 'function') {
      key = myRowKey;
    } else if (Array.isArray(myRowKey)) { // 联合主键
      key = (record: any) => getYwKey(record);
    } else if (typeof myRowKey === 'object' && myRowKey.type === '1') {
      key = (record: any) => getYwKey(record, '');
    } else {
      key = (record: any) => record[myRowKey];
    }
    return key;
  }

  const setScrollX = (columnsPlane: any) => {
    let defaultScrollX = 0;
    columnsPlane.forEach((item: any) => {
      // if (!item.hidden) {
      if (!item.hidden && item.settingFlagColumn !== 'hidden') {
        defaultScrollX += item.width || 150;
      }
    })
    defaultScrollX += 20;
    setDefaultScrollX(defaultScrollX);
  }

  // 使用 useMemo 缓存滚动条配置，避免重复计算
  const scrollConfig = useMemo(() => {
    if (scroll) {
      return scroll;
    }
    return {
      x: gridScrollX || defaultScrollX,
      ...(gridScrollY && { y: gridScrollY }),
    };
  }, [scroll, gridScrollX, defaultScrollX, gridScrollY]);

  // 获取当前表格排序方式
  const getGridSort = (paramSort?: any) => {
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
            dict_field_alias: item?.column?.dict_field_alias,
            dict_field_desc: item?.column?.dict_field_desc,
            dict_field_flag: item?.column?.dict_field_flag,
            dict_field_id: item?.column?.dict_field_id,
            dict_field_name: item?.column?.dict_field_name,
            dict_field_rel_table: item?.column?.dict_field_rel_table,
            dict_field_type: item?.column?.dict_field_type,
            dict_name: item?.column?.dict_name,
          });
        }
      })
    } else {
      if (targetSortObj?.order) {
        gridSort.push({
          field: targetSortObj.field,
          order: targetSortObj.order === 'ascend' ? 'asc' : 'desc', // ascend descend
          dict_field_alias: targetSortObj?.column?.dict_field_alias,
          dict_field_desc: targetSortObj?.column?.dict_field_desc,
          dict_field_flag: targetSortObj?.column?.dict_field_flag,
          dict_field_id: targetSortObj?.column?.dict_field_id,
          dict_field_name: targetSortObj?.column?.dict_field_name,
          dict_field_rel_table: targetSortObj?.column?.dict_field_rel_table,
          dict_field_type: targetSortObj?.column?.dict_field_type,
          dict_name: targetSortObj?.column?.dict_name,
        });
      }
    }
    return gridSort;
  }

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

  // 如果出入的是字符串类型queryParam
  // 则转成Object类型
  // 避免因传入Objcet类型导致多次渲染
  const convertQueryParam = () => {
    if (typeof queryParam === 'string') {
      const fromStrQueryParam = JSON.parse(queryParam);
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
        setPagination(Object.assign(myPagination, {
          total: filterData.length
        }));
      } else if (!myPagination) { // 无分页 myPagination === null
        myGridDataSource = filterData;
        setDataSource(myGridDataSource);
      }
      setLoading(false);
      handleAfterReload(gridTotalNum, myGridDataSource);
    } else if (api_grid_query) {  // 通过接口查询数据
      setLoading(false);
      if (myIsInitSearch) {
        setLoading(true);
        const { pageSize, page, orderModel, searchModel, initSearchModal = myInitSearchModel, headerSearchModel, afterReload, from, ...oth } = param;
        // const gridSort = (orderModel && orderModel.length > 0) ? orderModel : getGridSort();
        const gridSort = from === 'onchange' ? orderModel : getGridSort();

        // 获取列头筛选表单值
        let headerSearchModelTmp: any = headerSearchModel?.length >= 0 ? headerSearchModel : null;
        if (!headerSearchModelTmp) {
          headerSearchModelTmp = headerFilter || [];
        }
        setMySearchModel((searchModel && searchModel.length > 0) ? [...searchModel] : []);
        setMyInitSearchModel(initSearchModal);
        let querySearchModel: any = (searchModel && searchModel.length > 0) ? [...searchModel] : [];
        querySearchModel = querySearchModel.concat(headerSearchModelTmp);
        // querySearchModel = querySearchModel.concat(initSearchModal);
        querySearchModel = [ ...initSearchModal, ...querySearchModel ];
        const data: any = {
          ...convertQueryParam(),
          pageSize,
          page,
          searchModel: [...querySearchModel],
          orderModel: [...gridSort],
          ...oth,
        }
        delete data.initSearchModal;
        getGridData(api_grid_query, data).then((response) => {
          // 列表查询返回非200给出提示，
          if (response.code !== '200') {
            message.error(<>
              {JSON.stringify(response.msg)}
            </>);
            // notification.error({
            //   message: '查询失败',
            //   description: <>{JSON.stringify(JSON.stringify(response.msg))}</>,
            //   placement: 'top',
            //   duration: null,
            // });
            setLoading(false);
            return;
          }
          if (myPagination) { // 含有分页 && 查询出数据
            myGridDataSource = response?.body?.rows || [];
            setDataSource(response?.body?.rows || []);
            gridTotalNum = response?.body?.rowCount || 0;
            setPagination(Object.assign(myPagination, {
              total: gridTotalNum,
              pageSize,
              current: page,
            }));
            setSum2(response?.body?.statistics?.sum || {});
            setMin2(response?.body?.statistics?.min || {});
            setMax2(response?.body?.statistics?.max || {});
            setAvg2(response?.body?.statistics?.avg || {});
          } else if (!myPagination) { // 无分页 myPagination === false
            let tmpData = response?.body?.rows ? response?.body?.rows : response?.body;
            myGridDataSource = Array.isArray(tmpData) ? tmpData : [];
            setDataSource(myGridDataSource);
            gridTotalNum = tmpData || 0;
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
  // 设置: 分页
  const handleOnChange = (currentPagination: any, filters: any, sorter: any) => {
    let assembleSearchModel12: any = []
    if (getAssembleSearchModel) {
      assembleSearchModel12 = getAssembleSearchModel();
    }
    // 获取列头筛选表单值
    const headerSearchModel = UnitUtil.grid.assembleColSearchModel(filters, myColumnsPlane) || [];
    setHeaderFilter(headerSearchModel);
    const assembleSearchModel: any = [...assembleSearchModel12];
    setMySorter(sorter);
    const newsort: any = getGridSort(sorter);
    // if (pagination) {
    if (myPagination) {
      // setPagination(Object.assign(myPagination, currentPagination));
      let tmpPagination = Object.assign(myPagination, myGridType ? { current: currentPagination, pageSize: filters } : currentPagination );
      setPagination(tmpPagination);
      setGridData({
        page: tmpPagination.current,
        pageSize: tmpPagination.pageSize,
        orderModel: [...newsort],
        initSearchModal: myInitSearchModel,
        searchModel: [...assembleSearchModel],
        headerSearchModel: headerSearchModel,
        from: 'onchange',
      });
    }
  }

  // by james 2021-01-27 支持前端查询不走接口
  useEffect(() => {
    initTableColumns();
    const searchParam = {
      page: 1,//myPagination.current
      pageSize: myPagination.pageSize,
      ...convertQueryParam(),  // 默认参数   { searchModel: [], orderModel: [], key: '' }
    };
    setGridData(searchParam);
  }, [queryParam, userDataSource]);

  useEffect(() => {
    initTableColumns();
  }, [config, C_GRID_COLUMNS, columns]);

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
  // 使用 useMemo 缓存 sticky 配置，避免重复计算
  // 参考: https://github.com/ant-design/ant-design/issues/28762
  const stickyConfig = useMemo(() => {
    if (mySticky) {
      return {
        sticky: {
          offsetHeader: loading ? 0 : mySticky,
        }
      };
    }
    return;
  }, [mySticky, loading]);

  // 设置预览图地址
  const setPreviewConfig = (param: any) => {
    setImageVisible(param.imageVisible);
    let tmpImgUrl = param.imageUrl;
    let tmpImgPreUrl = param.imagePreviewUrl;
    if (tmpImgUrl?.indexOf('http://') > -1 || tmpImgUrl?.indexOf('https://') > -1) {
    } else {
      tmpImgUrl = `${API_URL_BASE}/dict/${tmpImgUrl}`; // 非node环境
    }
    if (tmpImgPreUrl?.indexOf('http://') > -1 || tmpImgPreUrl?.indexOf('https://') > -1) {
    } else {
      tmpImgPreUrl = `${API_URL_BASE}/dict/${tmpImgPreUrl}`; // 非node环境
    }
    setImageUrl(tmpImgUrl);
    setImagePreviewUrl(tmpImgPreUrl);
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
      setPreviewConfig,
      setMyGridType,
    };
  });

  // summary
  const summary = () => {
    const Cell = Table.Summary.Cell;
    let firstIndex = 0;
    // if (grid_show_serial_number) {
    //   firstIndex += 1;
    // }
    if (otherProps.rowSelection && (otherProps.rowSelection.type === 'radio' || otherProps.rowSelection.type === 'checkbox')) {
      firstIndex += 1;
    }
    let myColumnsPlaneTmp = myColumnsPlane.filter((item: any) => {
      return (!(item.hidden && item.hidden !== false));
    });
    // myColumnsPlaneTmp = myColumnsPlane.filter((item: any) => { return (item.settingFlagColumn !== 'hidden'); });
    // 前端
    const getSummaryRow = ({ type, firstColText }: any) => {
      let tmpRow: any = [];
      let isShow: any = false;
      for (let i = 0; i < myColumnsPlaneTmp.length; i++) {
        if (i === 0) {
          tmpRow.push(<Cell className="tableSumClass" key="heji" index={0} colSpan={1 + firstIndex}>{firstColText}</Cell>)
        } else if (myColumnsPlaneTmp[i][type]) {
          let statisticsNum = 0;
          let sumNum = 0;
          let culumnString = '';
          let firstSum = 0;
          let lastSum = 0;
          let arr: any = [];
          dataSource.forEach((items, index) => {
            const itemNum = items[myColumnsPlaneTmp[i].dataIndex] ? items[myColumnsPlaneTmp[i].dataIndex] : '';
            if (itemNum.toString().indexOf('/') > -1) {
              arr = itemNum.split('/');
              firstSum += Number(arr[0]);
              lastSum += Number(arr[1]);
              culumnString = myUtil.text.formatNum(firstSum, myColumnsPlaneTmp[i].format) + '/' + myUtil.text.formatNum(lastSum, myColumnsPlaneTmp[i].format);
            } else {
              if (type === 'sum') {
                statisticsNum += Number(itemNum);
              } else if (type === 'max') {
                if (index === 0) {
                  statisticsNum = Number(itemNum);
                } else {
                  if (Number(itemNum) > statisticsNum) {
                    statisticsNum = Number(itemNum);
                  }
                }
              } else if (type === 'min') {
                if (index === 0) {
                  statisticsNum = Number(itemNum);
                } else {
                  if (Number(itemNum) < statisticsNum) {
                    statisticsNum = Number(itemNum);
                  }
                }
              } else if (type === 'avg') {
                sumNum += Number(itemNum);
                statisticsNum = sumNum / dataSource.length;
              }
            }
          });
          isShow = true;
          tmpRow.push(<Cell key={i} align='right' index={i + firstIndex}><span style={{color: colorSuccess, fontWeight: 'bold'}}>{culumnString ? culumnString : myUtil.text.formatNum(statisticsNum, myColumnsPlaneTmp[i].format)}</span></Cell>)
        } else {
          tmpRow.push(<Cell key={i} index={i + firstIndex}></Cell>)
        }
      }
      return {
        row: [...tmpRow],
        isShow,
      };
    }
    // 前端合计
    let summaryTableObj: any = getSummaryRow({ type: 'sum', firstColText: '当前合计' });
    let showTotal = summaryTableObj.isShow;
    let summaryTable = summaryTableObj.row;
    // 前端最大值
    let showMaxObj: any = getSummaryRow({ type: 'max', firstColText: '当前最大值' });
    let showMax = showMaxObj.isShow;
    let maxTable = showMaxObj.row;
    // 前端最小值
    let showMinObj: any = getSummaryRow({ type: 'min', firstColText: '当前最小值' });
    let showMin = showMinObj.isShow;
    let minTable = showMinObj.row;
    // 前端平均值
    let showAvgObj: any = getSummaryRow({ type: 'avg', firstColText: '当前平均值' });
    let showAvg = showAvgObj.isShow;
    let avgTable = showAvgObj.row;
    // 后端
    const getSummaryRow2 = ({ type, firstColText }: any) => {
      let tmpRow: any = [];
      let isShow: any = false;
      for (let i = 0; i < myColumnsPlaneTmp.length; i++) {
        if (i === 0) {
          tmpRow.push(
            <Cell className="tableSumClass" key="heji2" index={0} colSpan={1 + firstIndex}>{firstColText}</Cell>
          )
        } else if (myColumnsPlaneTmp[i][type]) {
          isShow = true;
          let tmpNum: any = 0;
          // 后端合计
          if (type === 'sum2') {
            if (myColumnsPlaneTmp[i][type] === 'fun') {
              tmpNum = (func.statistics.sum2[myColumnsPlaneTmp[i]?.dataIndex])({sum2, min2, max2, avg2});
            } else {
              tmpNum = sum2[myColumnsPlaneTmp[i]?.dataIndex] || 0;
              tmpNum = myUtil.text.formatNum(tmpNum, myColumnsPlaneTmp[i].format);
            }
          } else if (type === 'min2') {
            if (myColumnsPlaneTmp[i][type] === 'fun') {
              tmpNum = (func.statistics.min2[myColumnsPlaneTmp[i]?.dataIndex])({sum2, min2, max2, avg2});
            } else {
              tmpNum = min2[myColumnsPlaneTmp[i]?.dataIndex] || 0;
              tmpNum = myUtil.text.formatNum(tmpNum, myColumnsPlaneTmp[i].format);
            }
          } else if (type === 'max2') {
            if (myColumnsPlaneTmp[i][type] === 'fun') {
              tmpNum = (func.statistics.max2[myColumnsPlaneTmp[i]?.dataIndex])({sum2, min2, max2, avg2});
            } else {
              tmpNum = max2[myColumnsPlaneTmp[i]?.dataIndex] || 0;
              tmpNum = myUtil.text.formatNum(tmpNum, myColumnsPlaneTmp[i].format);
            }
          } else if (type === 'avg2') {
            if (myColumnsPlaneTmp[i][type] === 'fun') {
              tmpNum = (func.statistics.avg2[myColumnsPlaneTmp[i]?.dataIndex])({sum2, min2, max2, avg2});
            } else {
              tmpNum = avg2[myColumnsPlaneTmp[i]?.dataIndex] || 0;
              tmpNum = myUtil.text.formatNum(tmpNum, myColumnsPlaneTmp[i].format);
            }
          }
          if (myColumnsPlaneTmp[i].settingFlagColumn !== 'hidden') {
            tmpRow.push(<Cell key={i+'_2'} align='right' index={i + firstIndex}>
              <span style={{color: colorInfo, fontWeight: 'bold'}}>{tmpNum}</span>
            </Cell>)
          }
        } else {
          // 后端合计
          if (myColumnsPlaneTmp[i].settingFlagColumn !== 'hidden') {
            tmpRow.push(<Cell key={i+'_2'} index={i + firstIndex}></Cell>)
          }
        }
      }
      return {
        row: [...tmpRow],
        isShow,
      };
    }
    // 后端合计
    let summaryTableObj2: any = getSummaryRow2({ type: 'sum2', firstColText: '合计' });
    let showTotal2 = summaryTableObj2.isShow;
    let summaryTable2 = summaryTableObj2.row;
    // 最大值
    let maxTableObj2: any = getSummaryRow2({ type: 'max2', firstColText: '最大值' });
    let showMax2 = maxTableObj2.isShow;
    let maxTable2: any = maxTableObj2.row;
    // 最小值
    let minTableObj2: any = getSummaryRow2({ type: 'min2', firstColText: '最小值' });
    let showMin2 = minTableObj2.isShow;
    let minTable2: any = minTableObj2.row;
    // 平均值
    let avgTableObj2: any = getSummaryRow2({ type: 'avg2', firstColText: '平均值' });
    let showAvg2 = avgTableObj2.isShow;
    let avgTable2: any = avgTableObj2.row;

    if (showTotal || showTotal2 || showMax || showMax2 || showMin || showMin2 || showAvg || showAvg2) {
      return <Table.Summary fixed>
        {showTotal && <Table.Summary.Row>{summaryTable}</Table.Summary.Row>}
        {showTotal2 && <Table.Summary.Row>{summaryTable2}</Table.Summary.Row>}
        {showMax && <Table.Summary.Row>{maxTable}</Table.Summary.Row>}
        {showMax2 && <Table.Summary.Row>{maxTable2}</Table.Summary.Row>}
        {showMin && <Table.Summary.Row>{minTable}</Table.Summary.Row>}
        {showMin2 && <Table.Summary.Row>{minTable2}</Table.Summary.Row>}
        {showAvg && <Table.Summary.Row>{avgTable}</Table.Summary.Row>}
        {showAvg2 && <Table.Summary.Row>{avgTable2}</Table.Summary.Row>}
      </Table.Summary>;
    } else {
      return false;
    }
  }
  const tableEle: any = <div className='dd-table'>
    <Table
      tableLayout='fixed'
      showSorterTooltip={false}
      bordered={myBordered}
      columns={myColumns}
      rowKey={getRowKey()}
      dataSource={dataSource}
      pagination={myPagination}
      onChange={handleOnChange}
      size={size}
      loading={loading}
      scroll={scrollConfig}
      summary={summary}
      locale={{
          emptyText() {
            if (myIsInitSearch) {
              return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
            }
            return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='请点击查询搜索数据'/>
          },
      }}
      {...stickyConfig}
      {...otherProps}
    />
  </div>;

  const listEle: any = <div className='dd-table'>
    <div>
      <List
        // grid={{ gutter: 16, column: 4 }}
        grid={{ gutter: 16, xs: 1, sm: 1, md: 5, lg: 5, xl: 5, xxl: 5 }}
        dataSource={dataSource}
        pagination={{...myPagination,
          onChange: handleOnChange
        }}
        renderItem={(item: any, index00: any) => {
          let itemClone = cloneDeep(item);
          let mediaPathVideo: any; // 处理后媒体视频
          let mediaPathPic: any; // 处理后媒体图片路径
          let mediaTypeVideo: any; //
          let mediaTypePic: any; //
          let mediaType: any = ENV_TYPE === 'node' ? itemClone.media_type : itemClone.mediaType; // 媒体类型
          if (gridListCardType === 1) {
            // 通用格式：图片
            mediaPathPic = itemClone[gridListCardField?.imagepath] || '';
            mediaType = 'picture';
          } else if (gridListCardType === 2) {
            // 通用格式：图片 + 视频
            mediaPathPic = itemClone[gridListCardField?.imagepath] || '';
            mediaPathVideo = itemClone[gridListCardField?.videopath] || '';
            mediaType = 'video';
          } else if (gridListCardType === 3) {
            // 媒体库
            if (mediaType) {
              if (CONSTANTS.MEDIA.TYPE_PICTURED.indexOf(mediaType) > -1) {
                mediaPathPic = itemClone[gridListCardField?.imagepath] || '';
              } else if (CONSTANTS.MEDIA.TYPE_VIDEO.indexOf(mediaType) > -1 ||
                  CONSTANTS.MEDIA.TYPE_MUSIC.indexOf(mediaType) > -1) {
                mediaPathVideo = itemClone[gridListCardField?.videopath] || itemClone[gridListCardField?.imagepath];
              }
            }
          } else if (gridListCardType === 4) {
            if (ENV_TYPE === 'node') {
              if (itemClone[gridListCardField?.imagepath]) {
                let mediaFileMD51 = itemClone[gridListCardField?.imagepath + '_media_file_md5'];
                mediaType = itemClone[gridListCardField?.imagepath + '_media_type'];
                mediaPathPic = mediaFileMD51;
                mediaTypePic = mediaType;
              }
              if (itemClone[gridListCardField?.videopath]) {
                let mediaFileMD52 = itemClone[gridListCardField?.videopath + '_media_file_md5'];
                mediaType = itemClone[gridListCardField?.videopath + '_media_type'];
                mediaPathVideo = mediaFileMD52;
                mediaTypeVideo = mediaType;
              }
            } else {
              // 字典生成格式， 同一字典中描述名称、类别、地址
              if (itemClone[gridListCardField?.imagepath]) {
                let imagepathTmp = itemClone[gridListCardField?.imagepath];
                if (imagepathTmp.split('---').length >= 3) {
                  mediaType = imagepathTmp.split('---')[1];
                  mediaPathPic = imagepathTmp.split('---')[3];
                }
              }
              if (itemClone[gridListCardField?.videopath]) {
                let videopathTmp = itemClone[gridListCardField?.videopath];
                if (videopathTmp.split('---').length >= 3) {
                  mediaType = videopathTmp.split('---')[1];
                  mediaPathVideo = videopathTmp.split('---')[3];
                }
              }
            }
          }
          itemClone.mediaPathPic = mediaPathPic;
          itemClone.mediaPathVideo = mediaPathVideo;
          itemClone.mediaTypeVideo = mediaTypeVideo;
          itemClone.mediaTypePic = mediaTypePic;
          if (ENV_TYPE === 'node') {
            itemClone.media_type = mediaType;
          } else {
            itemClone.mediaType = mediaType;
          }
          // itemClone.media_type = mediaType;

          let previewVideo: any = {};
          if (mediaPathVideo) {
            // videopath = videopath.split('---')[3];
            previewVideo = {
              preview:{
                // destroyOnClose: true,
                imageRender: () => (
                  <video
                    muted
                    width="100%"
                    height="100%"
                    controls
                    src={`${mediaPathVideo}`}
                  />
                ),
                actionsRender: () => null,
              }
            }
          }
          let getCardAction = (cardItemTmp: any) => {
            let cardActionEle:any = [];
            gridListCardAction.forEach((data: any, index11: any) => {
              cardActionEle.push(<Button key={index11} type='link' onClick={() => { data.fun(cardItemTmp); }}>{data.btnName}</Button>
            )});
            return cardActionEle;
          }
          return (
            <List.Item key={index00}>
              { gridListCardRender ? gridListCardRender(itemClone, reload) : <>
                <Card hoverable variant="borderless"
                  style={{ width: '100%' }}
                  cover={myUtil.media.getCardContent(itemClone)}
                  // cover={
                  //   <Image
                  //     src={imagepath}
                  //     fallback="data:image/png;base64,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"
                  //     {...previewVideo}
                  //   />
                  // }
                  actions={getCardAction(item)}
                  >
                  <Card.Meta title={item[gridListCardField?.title]} description={item[gridListCardField?.description]} />
                </Card>
              </>}
            </List.Item>
          )}}
      />
    </div>
  </div>;

  // const showEle = myGridType ? listEle : tableEle;

  return <>
    {myGridType ? listEle : tableEle}
    <Image
      style={{ display: 'none' }}
      src={imageUrl}
      preview={{
        open: imageVisible,
        scaleStep: 0.5,
        src: imagePreviewUrl,
        onOpenChange: (value) => {
          setImageVisible(value);
        },
      }}
    />
  </>
};
export default memo(DDBaseGrid);