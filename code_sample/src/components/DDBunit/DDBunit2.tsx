import React, {useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import cjpzUtil from '@/pages/common/cjpzUtil';
import {Button, Checkbox, DatePicker, Dropdown, Form, Input, Menu, message, Modal, Select, Space, Spin, Switch, Tooltip} from 'antd';
import {DownloadOutlined,  DownOutlined,  EllipsisOutlined,  FullscreenExitOutlined,  FullscreenOutlined,  QuestionCircleOutlined,  ReloadOutlined,  SettingOutlined,  UploadOutlined} from '@ant-design/icons';
import {baseDelete, baseEdit, baseShow, callServiceCheck, downloadTemplate, exportPager, getColumn} from '@/services/hts/api';
import {itemType} from '@/components/DDForm/data.d';
import DDBaseGrid from '@/components/DDBaseGrid';
import DDFilter from '@/components/DDForm/DDFilter';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import DDToolbar from '@/components/DDToolbar';
import DDGridViewSetting from '@/components/DDGridViewSetting';
import DDExport from '@/components/DDExport';
import DDImport from '@/components/DDImport';
import DDAlert from '@/components/DDAlert';
import UnitUtil from '@/components/DDBunit/unit_util';
import CommonFunc from '@/components/DDBunit/f';
import myUtil, {intl as intl2} from '@/pages/common/myUtil';
import CKTS_Sjxj from '@/pages/hts/commonModule/xj/xj'; // 原在线申报系统模块 小计
import CKTS_Sort from '@/pages/hts/commonModule/xhcp/xhcp'; // 原在线申报系统模块 序号重排
import Dybbxz from '@/pages/hts/commonModule/dybbxz/dybbxz'; // 查询统计-打印报表下载
// import DDXhSort from '@/pages/hts/common/xhcp/DDXhSort';
// import DDXhSortDr from '@/pages/hts/common/xhcp/DDXhSortDr';
import DDBatchUpdate from '@/pages/hts/commonModule/plxg/DDBatchUpdate';
// import DDTzUpdateData from '@/pages/hts/commonModule/tz/DDTzUpdateData';
import DDSjgxUpdateData from '@/pages/hts/commonModule/sjgx/DDSjgxUpdateData';
import ProCard from '@ant-design/pro-card';
import pro from '@/pages/common/proConfig';
import moment from 'moment';
import {useAccess, useIntl, useModel} from 'umi';
import './style.less';
import {cloneDeep, isEqual} from 'lodash';
import {history} from "@@/core/history";

export type DDBunit2Props = {
  config: any;
  func?: any;
  onRef?: any;
}

const DDBunit2: React.FC<DDBunit2Props> = ({
  config,
  func,
  onRef
}) => {
  if (!config) {
    return <>暂无数据</>
  }
  // config 修正
  config = UnitUtil.config.modify(config);
  const intl = useIntl();
  // useForm
  const [form] = Form.useForm();
  const [formCommonFilter] = Form.useForm();
  const [formQuickFilter] = Form.useForm();
  const access = useAccess(); // 权限
  // ref
  const refDDBaseGrid: any = useRef();
  // const refSum: any = useRef();               // 数据小计
  // const refOrder: any = useRef();             // 序号重排 选择排序
  // const refOrder2: any = useRef();            // 序号重排 导入排序
  const refBatchUpdate: any = useRef();       // 批量修改
  const refTzUpdateData: any = useRef();      // 更新台账数据
  const refSjgxUpdateData: any = useRef();      // 更新报表
  const refDDGridViewSetting: any = useRef();
  const refDDExport: any = useRef();
  const refDDImport: any = useRef();
  const unitRef = func.unitRef;
  const refCktsSum: any = useRef();              // 原在线申报系统模块 小计
  const refCktsOrder: any = useRef();              // 原在线申报系统模块 序号重排
  const refDybbxz: any = useRef();              // 查询统计-打印报表下载
  const getOtherRefs = () => {
    const funcName = 'getOtherRef';
    if (func[funcName]) {
      return func[funcName]();
    } else {
      return [];
    }
  }
  // 业务标识
  const moduleType = config.module_type;
  // page
  const unit_key = config.unit_key;
  const pageSizeOptions = config.pageSizeOptions;
  const page_id = UnitUtil.config.modifyPageId(config.page_id, unit_key); // config.page_id || unit_key; // 设置父页面视图方案调整项 Add@251021
  const batch_delete_key = config.batch_delete_key;
  const export_key = config.export_key;
  // 是否开启全量数据导出
  const export_large = config.export_large ? config.export_large : false;
  // 导入的模板下载是否调用downloadTemplate
  const import_download_template = config.import_download_template ? config.import_download_template : false;
  // 导入是否显示选项 1: 有选择项 2：无选择项
  const import_style = config.import_style ? config.import_style : '1';
  const order_key = config.order_key;
  // const export_xz_key = config.export_xz_key;
  const gridViewSettingSort = config.grid_setting_sort;
  const unit_constant = config.unit_constant;
  const unit_lcswsx_dm = UnitUtil.getLcswsxDm(unit_constant);
  // filter
  const filterItems = UnitUtil.filter.init(config.filter_items);
  const grid_filter_quick = UnitUtil.filter.init(config.grid_filter_quick);
  const gridViewSettingFilter = UnitUtil.filterAdvanced.init(config.grid_setting_filter_advanced);
  // form
  const form_title = config.form_title;
  // form表单保存并添加按钮展示开关
  const form_save_add_flag = config.form_save_add_flag;
  const formName = `${page_id}_form`
  const formSaveCheck = config.form_save_check;
  const batch_update_items = config.batch_update_items;
  const formItems = UnitUtil.form.init({
    items: config.form_items,
    func: func,
  });
  // toolbar btn
  const grid_title = config.grid_title;
  const export_name = config.export_name ?  config.export_name : '导出';

  const grid_title_end = config.grid_title_end;
  const sumField = config.grid_sum_field;
  const toolBarDefault = config.toolbar_default;
  const costomerToobar = config.costomer_toobar;
  const showToolBar = config.show_toolbar;
  const grid_show_data_num = config.grid_show_data_num;
  // export_key1
  const export_key1 = config.export_key1;
  const export_key2 = config.export_key2;
  const export_key3 = config.export_key3;
  const exprotMsg = config.exprotMsg;
  // layout
  const layout_type = config.layout_type || 'default';
  const layout_scroll_type = layoutScrollType ? layoutScrollType : myUtil.localStore.getItem('theme')?.layoutScrollType || 'bodyScroll';
  const toobar_affix = () => {
    const jcfs = localStorage.getItem('jcfs');
    let affix: any = (PRO_TYPE === 'xt' || jcfs === 'menu_ym') ? 0 : 44;  // 44
    // 首先根据layout_type设置工具栏affix
    if (layout_type === 'tabs') {
      affix = (PRO_TYPE === 'xt' || jcfs === 'menu_ym') ? 40 : 84;  // 84
    } else if (layout_type === 'modal') {
      affix = false;
    }
    // 如果配置中另外设置了toobar_affix，则采用配置中toobar_affix
    if (config.toobar_affix !== undefined) {
      affix = config.toobar_affix;
    }
    return affix;
  };
  // grid
  const gridIsInitSearch = config.gridIsInitSearch === undefined ? true : config.gridIsInitSearch;
  const isAllBatchEdit = config.is_all_batch_edit || false;
  const click_checked = config.click_checked;
  const rowKey = config.grid_row_key || 'uuid';
  const showSerialNumber = config.grid_show_serial_number;
  const handleColumnsDefault = config.grid_handle_columns_default;
  const handleColumns = config.handle_columns;
  const grid_border = config.grid_border;
  const grid_scroll_x = config.grid_scroll_x;
  const grid_scroll_y = config.grid_scroll_y;
  const grid_sticky_affix = config.grid_sticky_affix;
  const gridParams = config.gridParams;
  const initSearchModal: any = gridParams?.initSearchModal ? [...gridParams?.initSearchModal] : [];
  const initQueryParam: any = UnitUtil.grid.initAssembleSearchModel({
    unitKey: unit_key,
    filterItems: filterItems,
    gridFilterQuick: grid_filter_quick,
    initSearchModal,
    moduleType,
  });
  const grid_selection_type = config.grid_selection_type === undefined ? 'checkbox' : config.grid_selection_type;
  const grid_handle_width = config.grid_handle_width;   // 自定义操作列宽度
  // useState
  const [viewColumnsOriginal, setViewColumnsOriginal] = useState<any>([]); // 视图设置数据
  const [viewColumns, setViewColumns] = useState<any>([]); // 视图设置数据
  const [myColumns, setMyColumns] = useState<any>([]);
  const [myFormItems, setMyFormItems] = useState(formItems);
  const [myFilterItems, setMyFilterItems] = useState(filterItems);
  const [customerToobarBtn, setCustomerToobarBtn] = useState<any>(costomerToobar || []);
  const [selectionType] = useState(grid_selection_type);
  const [queryParam, setQueryParam] = useState({ ...initQueryParam });
  const [masker, setMasker] = useState(false);
  const [masker2, setMasker2] = useState(false);
  // const [myFormSaveCheck] = useState(formSaveCheck || false);
  const [myFormSaveCheck] = useState(formSaveCheck);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [selectionRowKeys, setSelectionRowKeys] = useState<any>([]);
  const [selectionRows, setSelectionRows] = useState<any>([]);
  const [formType, setFormType] = useState<string>(''); // 表单类型：edit：编辑，add：新建
  const [gridTotal, setGridTotal] = useState(0);
  const [pagination2, setPagination2] = useState(config.pagination2);
  // const [fullscreenstate, setfullscreenstate] = useState<boolean>(false);
  const [gridHeaderInfoCustomer, setGridHeaderInfoCustomer] = useState<any>(config.grid_header_info);
  const [showBtnNum] = useState(4);
  // api
  const gridParamsApiQuery = config.grid_api_grid_query || `${API_URL_BASE}/hx/ty/crud/queryPager`;
  const deleteUrl = config.form_api_delete || `${API_URL_BASE}/hx/ty/crud/delete`;
  const formShowUrl = config.form_api_show || `${API_URL_BASE}/hx/ty/crud/queryForm`;
  const formSaveUrl = config.form_api_save || `${API_URL_BASE}/hx/ty/crud/saveOrUpdate`;
  const formUploadUrl = config.form_api_save_upload || `${API_URL_BASE}/hx/ty/crud/saveOrUpdate`;
  const formCheckUrl = config.form_api_check;
  const importUrl = config.grid_api_import;
  const templateUrl = config.grid_api_templateUrl;
  const import_key = config.import_key || config.unit_key;
  const batchUpdateUrl = config.batch_update_url;

  // const { globalLoading, setGlobalLoading } = useModel('globalLoading');
  const { fullscreen, changeFullscreen } = useModel('fullscreen');
  const { DDB2PageData, changeDDB2PageData } = useModel('ddb2');

  const [gridViewPlan, setGridViewPlan] = useState<any>([]); // 视图设置：方案  // 设置父页面视图方案调整项 Add@251021

  // useImperativeHandle
  useImperativeHandle(unitRef, () => {
    return {
      // setGlobalLoading,
      setMasker,
      getSelectionRowKeys,
      getSelectionRows,
      getGridParams,
      getOtherRefs,
      handleCostomerToobarBtn,
      getGridData,
      getPagination,
      setSelectionRowKeys,
      setSelectionRows,
      reload2,
      addQueryModel,
      setGridHeaderInfoCustomer,
      handleReset,
      setPagination2,
    };
  });
  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      // setGlobalLoading,
      setMasker,
      getSelectionRowKeys,
      getSelectionRows,
      getGridParams,
      getOtherRefs,
      handleCostomerToobarBtn,
      getGridData,
      getPagination,
      setSelectionRowKeys,
      setSelectionRows,
      reload2,
      addQueryModel,
      setGridHeaderInfoCustomer,
      handleReset,
      setPagination2,
    };
  });

  // 获取列表选中行key
  const getSelectionRowKeys = () => {
    return selectionRowKeys;
  };

  // 获取列表选中行
  const getSelectionRows = () => {
    return selectionRows;
  };

  // 获取列表查询参数
  const getGridParams = () => {
    const params = queryParam
    return params;
  };

  // 获取列表数据
  const getGridData = () => {
    const gridData = refDDBaseGrid.current?.getSource();
    return gridData;
  };

  // 获取当前筛选下总条数
  const  getPagination = () =>{
    return refDDBaseGrid.current?.getPagination();
  }



  // 设置自定义按钮disabled
  const setBtnDisabled = (key: any, disabled: any) => {
    customerToobarBtn.forEach((item: any) => {
      if (key === item.key) {
        item.disabled = disabled;
      }
    });
    setCustomerToobarBtn([].concat(customerToobarBtn));

  };

  // 自定义按钮按钮方法设置
  const handleCostomerToobarBtn = () => {
    const reVal: any = {
      customerToobarBtn,
      setCustomerToobarBtn,
      setBtnDisabled,
    };
    return reVal;
  };

  // 删除
  const handleDelete = (record: any = {}, event: any) => {
    event.stopPropagation();
    DDAlert.open({
      title: '系统提示',
      info: intl2.formatMessage({ id: 'message_inquiry_delete' }),
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: false,
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        const data: any = {
          key: unit_key || ''
        };
        const gridKey = rowKey;
        if (Array.isArray(gridKey)) { // 联合主键
          data.ywKeys = [getYwKey(record)];
        } else if (typeof gridKey === 'object' && gridKey.type === '1') {
          let zdyCs: any = {};
          rowKey.key.forEach((item: any) => {
            zdyCs = Object.assign(zdyCs, { [item]: record[item] });
          });
          Object.assign(data, zdyCs);
        } else {
          data.uuids = [record[gridKey]];
        }
        baseDelete({ data, url: deleteUrl }).then((response) => {
          DDAlert.close();
          const { code, body } = response;
          if (code === '200') {
            message.success(intl.formatMessage({ id: 'message_delete_success' }));
            reload2();
          } else {
            if (func.afterDeletionFailure) {
              func.afterDeletionFailure({
                unitRef,
                gridRef: refDDBaseGrid,
                body
              });
            } else {
              message.error(intl.formatMessage({ id: 'message_delete_error' }));
            }
          }
        })
      },
    });
  };

  // 批量删除
  const handleUBatchDelete = () => {
    const gridData = getGridData();
    if (gridData.length === 0) {
      message.info(intl.formatMessage({ id: 'message_jljghx_nbtzhd_plsc_nodata' }));
      return;
    }

    // 定义特殊unit_key常量数组
    const SPECIAL_UNIT_KEYS = ['MTS_ZXSB_SB_MTS_TSSB_G', 'MTS_SJPP_TZPD_QUERY_PAGE', 'MDT_ZXSB_SB_MDT_TSSB_G'];
    const isSpecialUnit = SPECIAL_UNIT_KEYS.includes(unit_key);
    let text = intl2.formatMessage({ id: 'message_inquiry_delete' });

    // 处理未选择行的情况
    if (selectionRowKeys?.length <= 0) {
      if (!isSpecialUnit) {
        message.info(intl.formatMessage({ id: 'message_delete_unselected' }));
        return;
      }
      text = '将删除当前筛选条件下的所有数据，是否确认？';
      if (unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G' || unit_key === 'MDT_ZXSB_SB_MDT_TSSB_G') {
        // 修改这里，将需要变红的文字用span包裹并添加样式
        text = [
          '将删除当前筛选条件下的所有数据，是否确认？',
          '温馨提示：',
          <span key="tip1">1.点击【确定】将删除<span style={{ color: '#ff0000', fontWeight: 'bold' }}>当前筛选条件下的所有数据</span>，请谨慎操作！</span>,
          '2.相同关联号的出口明细和进货明细将会一并删除。'
        ];
      } else if (unit_key === 'MTS_SJPP_TZPD_QUERY_PAGE' || unit_key === 'MDT_ZXSB_SB_MDT_TSSB_G') {
        text = [
          '将删除当前筛选条件下的所有数据，是否确认？',
          '温馨提示：',
          <span key="tip1">1.点击【确定】将删除<span style={{ color: '#ff0000', fontWeight: 'bold' }}>当前筛选条件下的所有数据</span>，请谨慎操作！</span>,
        ];
      }
    } else {
      if (unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G' || unit_key === 'MDT_ZXSB_SB_MDT_TSSB_G' || unit_key === 'MDT_ZXSB_SB_MDT_GJYS_G' || unit_key === 'MDT_ZXSB_SB_MDT_YFSJ_G') {
        // 修改这里，将需要变红的文字用span包裹并添加样式
        text = [
          '将删除已勾选的所有数据，是否确认？',
          '温馨提示：',
          <span key="tip1">1.点击【确定】将删除<span style={{ color: '#ff0000', fontWeight: 'bold' }}>已勾选的所有数据</span>，请谨慎操作！</span>,
          '2.相同关联号的出口明细和进货明细将会一并删除。'
        ];
      }
    }

    // 批量删除前调用钩子函数
    if (func.beforeDelete) {
      const beforeResult = func.beforeDelete({
        page_id, unit_key, unitRef, unit_lcswsx_dm, selectionRowKeys, selectionRows
      });
      const result = beforeResult !== undefined ? beforeResult : true;
      if (!result) return;
    }

    DDAlert.open({
      title: '系统提示',
      info: text,
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: false,
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        const data: any = { key: unit_key || '' };
        const gridKey = rowKey;

        // 处理不同主键类型
        if (typeof gridKey === 'object') {
          data.ywKeys = selectionRowKeys;
        } else {
          if (batch_delete_key) {
            data[batch_delete_key] = selectionRowKeys;
          } else {
            if (selectionRowKeys?.length <= 0) {
              data.param = queryParam;
            }
            data.uuids = selectionRowKeys;
          }
        }

        // 执行删除请求
        baseDelete({ data, url: deleteUrl }).then((response) => {
          DDAlert.close();
          const { code, body } = response;
          if (code === '200') {
            message.success(intl.formatMessage({ id: 'message_delete_success' }));
            reload2();
          } else {
            if (func.afterDeletionFailure) {
              func.afterDeletionFailure({ unitRef, gridRef: refDDBaseGrid, body });
            } else {
              message.error(intl.formatMessage({ id: 'message_delete_error' }));
            }
          }
        });
      },
    });
  };

  // 列选择
  const rowSelection = selectionType ? {
    rowSelection: {
      selectedRowKeys: selectionRowKeys,
      type: selectionType,
      fixed: true,
      onChange: (selectedRowKeys: any, selectedRows: any[]) => {
        setSelectionRowKeys(selectedRowKeys);
        setSelectionRows(selectedRows);
        if (func.rowSelection) {
          func.rowSelection({
            selectedRowKeys,
            selectedRows,
            gridRef: refDDBaseGrid,
            unitRef,
          });
        }
      },
      onSelect: (record: any, selected: any, selectedRows: any, nativeEvent: any) => {
        if (func.onSelect) {
          func.onSelect({
            record,
            selected,
            selectedRows,
            nativeEvent,
            gridRef: refDDBaseGrid,
            unitRef,
          });
        }
      },
      onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
        if (func.onSelectAll) {
          func.onSelectAll({
            selected,
            selectedRows,
            changeRows,
            gridRef: refDDBaseGrid,
            unitRef,
          });
        }
      }
    }
  } : {};

  // 组装当前页面查询参数
  const getAssembleSearchModel = () => {
    let searchModel1: any = [];
    if (myFilterItems && myFilterItems.length > 0) {
      searchModel1 = UnitUtil.grid.assembleSearchModel(formCommonFilter, myFilterItems || [], moduleType) || [];  // 获取普通筛选区域表单值
    }
    const searchModel2: any = UnitUtil.grid.assembleSearchModel(formQuickFilter, grid_filter_quick || [], moduleType) || [];     // 获取标题区域筛选表单值
    const searchModel: any = [...searchModel1, ...searchModel2];
    return searchModel;
  };

  // 刷新并清空SelectionRows
  const reload2 = () => {
    refDDBaseGrid.current?.setIsInitSearch(true);

    const searchModel12: any = getAssembleSearchModel();
    const searchModel3: any = refDDBaseGrid.current?.getHeaderFilter() || [];                    // 获取列头筛选表单值
    const searchParam: any = {
      ...queryParam,
      searchModel: searchModel12,
      headerSearchModel: searchModel3,
    }
    setQueryParam(searchParam);
    setSelectionRowKeys([]);
    setSelectionRows([])
  };
  // const reload2: any = useCallback(reload2Tmp, []);

  const addQueryModel = (val: any, name: any) => {
    let arr = {};
    arr[name] = val;
    let flag = false;
    const searchModel1: any = UnitUtil.grid.assembleSearchModel(formCommonFilter || []) || [];
    for (let i = 0; i < searchModel1.length; i++) {
      if (searchModel1[i]?.property == name) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      searchModel1.push({ type: 1, property: name, value: "", op: "al" });
    }
    // 获取普通筛选区域表单值
    for (let i = 0; i < searchModel1.length; i++) {
      if (searchModel1[i].property == name) {
        formCommonFilter.setFieldsValue(arr);
        break;
      }
    }
    reload2();
  }

  // 视图设置后更新
  const updateGridViewTmp = (params: any) => {
    const { column, rules, filter } = params;
    // 设置序号
    const gridSort: any = [];
    if (rules?.length > 0) {
      rules.forEach((item: any) => {
        if (item.order) {
          gridSort.push({
            field: item.name,
            order: item.order,
          });
        }
      })
    };

    // 设置列
    const tmpColViews = cloneDeep([...column?.all]);
    setViewColumns(tmpColViews);
    initCode([...column?.all]);

    let searchModel = getAssembleSearchModel();
    let param = {
      ...queryParam,
      searchModel: searchModel,
    };
    // 设置高级筛选
    if (filter?.length > 0) {
      searchModel = [].concat(filter);
      param.searchModel = searchModel;
    }
    // 设置排序
    if (gridSort?.length > 0) {
      param = { ...param, orderModel: gridSort };
    }
    // 不知道 from: 'onchange' 作用
    // if (gridSort?.length > 0) {
    //   param = { ...param, orderModel: gridSort, from: 'onchange' };
    // }
    setQueryParam(param);
  }
  // 视图设置后更新
  const updateGridViewTmpNew = (params: any) => {
    const { column } = params;
    setViewColumns(cloneDeep([...column?.all]));
    const col2: any = UnitUtil.grid.init({
      columns: cloneDeep([...column?.all]),
      otherRef: getOtherRefs(),
      gridRef: refDDBaseGrid,
      unitRef: unitRef,
      handleColumnsDefault,
      handleColumns,
      func,
      popupUpdate,
      handleDelete,
      grid_handle_width,
      changeDDB2PageData,
    });
    setMyColumns([...col2]);
  };
  // const updateGridView: any = useCallback(updateGridViewTmp, []);
  const updateGridView: any = useCallback(updateGridViewTmpNew, []);

  // 重置查询
  const handleReset = () => {
    // 修改 2022-12-14 加 页面筛选 清空
    formCommonFilter.resetFields(); // 页面筛选
    formQuickFilter.resetFields(); //快捷筛选
    setQueryParam(initQueryParam);
  };
  // const handleReset: any = useCallback(handleResetTmp, []);

  // 打开编辑弹窗 工具栏入口
  const popupUpdateFromToolbar = () => {
    if (selectionRowKeys?.length === 0) {
      message.info(intl.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    if (selectionRowKeys?.length !== 1) {
      message.info(intl.formatMessage({ id: 'message_one_selected' }));
      return;
    }
    let record: any = selectionRows[0];
    popupUpdate(record);
  }

  // 主键是联合主键时获取ywKey
  const getYwKey = (record: any) => {
    const tmp: any = [];
    if (Array.isArray(rowKey)) {
      rowKey.forEach((item: any) => {
        tmp.push(record[item]);
      })
    } else if (typeof rowKey === 'object' && rowKey.type === '1') {
      rowKey.key.forEach((item: any) => {
        tmp.push(record[item]);
      })
    } else {
      tmp.push(record[rowKey]);
    }
    return tmp.join("");
  }

  // 打开编辑弹窗 行入口
  const popupUpdate = (record: any, event?: any) => {
    // setGlobalLoading(true);
    setMasker(true);
    setFormType('edit');
    event?.stopPropagation();

    const param: any = {
      key: unit_key || '',
    }
    if (Array.isArray(rowKey)) { // 联合主键
      param.ywKeys = [getYwKey(record)];
    } else if (typeof rowKey === 'object' && rowKey.type === '1') {
      // 自定义联合主键
      let zdyCs: any = {};
      rowKey.key.forEach((item: any) => {
        zdyCs = Object.assign(zdyCs, { [item]: record[item] });
      });
      Object.assign(param, zdyCs);
    } else {
      param[rowKey] = record[rowKey];
    }
    baseShow({ data: param, url: formShowUrl }).then((response) => {
      // setGlobalLoading(false);
      setMasker(false);
      const { code, body } = response;
      let vBody = null;
      if (body instanceof Array) {
        vBody = body[0];
      } else {
        vBody = body;
      }
      if (code === '200') {
        const formValue = { ...vBody };
        // 表单特殊类型处理
        formItems.forEach((item: any) => {
          if (formValue[item.name]?.constructor === String) {
            formValue[item.name] = formValue[item.name]?.trim() || '';
          }
          if (item.type === itemType.DatePicker && formValue[item.name]) {  // 日期类型
            const reg1 = /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229))$/;
            const reg2 = /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))$/;
            if (new RegExp(reg1).test(formValue[item.name]) || new RegExp(reg2).test(formValue[item.name])) {
              // 后端返回 yyyymmdd
              formValue[item.name] = moment(new Date(formValue[item.name]))
            } else {
              // 后端返回时间戳格式
              if (formValue[item.name]?.constructor === String) {
                formValue[item.name] = moment(new Date(Number(formValue[item.name])));
              } else {
                formValue[item.name] = moment(new Date(formValue[item.name]));
              }
            }
          }
          if (item.type === itemType.InputNumber && formValue[item.name]?.constructor === String) {
            formValue[item.name] = Number(formValue[item.name]);
          }
          if (item.type === itemType.Input && formValue[item.name]?.constructor === String && (formValue[item.name] === null || formValue[item.name]?.trim() === '')) {
            formValue[item.name] = '';
          }
          if (item.type === itemType.Select && item.mode === 'multiple') {
            if (formValue[item.name]) {
              formValue[item.name] = formValue[item.name]?.split(',') || [];
            } else {
              formValue[item.name] = [];
            }
          }
          if (item.type === itemType.Upload) {
            if (formValue[item.fileName]?.trim()) {
              formValue[item.name] = [{name: formValue[item.fileName]}];
            } else {
              formValue[item.name] = [];
            }
          }
        })
        if (Object.keys(formValue).length !== 0) {
          form.setFieldsValue(formValue);
        } else {
          form.resetFields();
          message.error(intl.formatMessage({ id: 'message_query_error' }));
          return
        }
        if (func.initEditForm) {
          func.initEditForm({
            formValue,
            form,
            page_id,
            unit_key,
            unitRef,
            handleModalVisible,
            myFormItems,
            setMyFormItems,
            unit_lcswsx_dm,
          });
        } else {
          handleModalVisible(true);
        }
      } else {
        message.error(intl.formatMessage({ id: 'message_query_error' }));
      }
    })
  };

  // 打开新建弹窗
  const popupUserAdd = () => {
    setFormType('add'); // 表单类型
    form.resetFields();
    // 是否有初始化
    if (func.initAddForm) {
      func.initAddForm({
        form,
        handleModalVisible,
        page_id,
        unit_key,
        unitRef,
        myFormItems,
        setMyFormItems,
        unit_lcswsx_dm,
      });
    } else {
      handleModalVisible(true);
    }
  };

  // 自定义导出
   // 自定义导出
   const customerExport = () => {
    const gridPagination = refDDBaseGrid.current?.getPagination();
    if (gridPagination.total > 50000) {
      message.info('本次导出的数据条数已超过上限（5万条），无法导出。');
      return;
    }
    const gridData = unitRef.current?.getGridData();
    if (!gridData || gridData.length <= 0) {
      message.info(intl.formatMessage({ id: 'message_common_nodata_export' }));
      return;
    }
    const gridParams = getGridParams();
    const tmp = refDDBaseGrid.current?.getHeaderFilter() || [];
    const orderModel =refDDBaseGrid.current?.getGridSort() || [];
    const model: any = [];
    gridParams.searchModel.forEach((item: any, index: number) => {
      model.push(item);
    });
    gridParams.initSearchModal.forEach((item: any, index: number) => {
      model.push(item);
    });
    tmp.forEach((item: any, index: number) => {
      model.push(item);
    });
    let modalTitle = '将导出当前筛选条件下的所有数据，是否确认';
    if (selectionRowKeys && selectionRowKeys.length > 0) {
      modalTitle = '将导出选中的数据，是否确认';
      if (typeof rowKey === 'object') {
        model.push({ property: 'ywKey', values: selectionRowKeys, op: 'ain' });
      } else {
        model.push({ property: rowKey, values: selectionRowKeys, op: 'ain' });
      }
    }

    let exkey = cjpzUtil.bdcj.formatExkey(export_key3 ,export_key2 ,export_key1 ,export_key ,unit_key );

    DDAlert.open({
      info: modalTitle,
      infoType: 'warning',
      modalType: 'confirm',
      okText: '确定',
      closeStatus: false,
      isFormContent: false,
      okCallbackFn: async function (thisObj: any) {
        const data: any = {
          key: exkey,
          orderModel: orderModel,
          searchModel: model,
        }
        thisObj.setState({ masker: true });
        // unitRef.current?.setMasker(true);
        exportPager(data).then((response) => {
          // unitRef.current?.setMasker(false);
          thisObj.setState({ masker: false });
          const { code, body, desc } = response;
          DDAlert.close();
          if (code === '200') {
            const { blob, fileName } = body;
            myUtil.file.downloadExcel(blob, fileName);
          } else {
            message.error(desc);
          }
        }).catch(() => {
          thisObj.setState({ masker: false });
          DDAlert.close();
        }).finally(() => {
          DDAlert.close();
          thisObj.setState({ masker: false });
        });
      }
    })
    // 新版导出bak
    // exportPager(data).then((response) => {
    //   unitRef.current?.setMasker(false);
    //   const { code, body, desc } = response;
    //   if (code === '200') {
    //     const { filePath } = body;
    //     DDAlert.open({
    //       title: '数据导出',
    //       info: '数据导出成功',
    //       content: <>
    //         <p className="item">文件路径：<a type="link" onClick={(event: any) => openCommonDcFile({ filePath: filePath })}>{filePath}</a></p>
    //       </>,
    //     });
    //   } else {
    //     message.error(desc);
    //   }
    // })
  };

  // 退税申报（金四）导出
  // 可选择列表进行导出
  const customerExportTssb = () => {
    const gridData = unitRef.current?.getGridData();
    if (!gridData || gridData.length <= 0) {
      message.info(intl.formatMessage({ id: 'message_common_nodata_export' }));
      return;
    }
    const gridParams = getGridParams();
    const tmp = refDDBaseGrid.current?.getHeaderFilter() || [];
    const orderModel = refDDBaseGrid.current?.getGridSort() || [];
    const model: any = [];
    let modalTitle = '将导出当前筛选条件下的所有数据，是否确认';
    let exportLarge = false;
    let cdDm: any = '';
    if (selectionRowKeys && selectionRowKeys.length > 0) {
      modalTitle = '将导出选中的数据，是否确认';
      model.push({ property: 'uuids', values: selectionRowKeys, op: 'zdy' });
    } else {
      // 同步最大导出限制条数
      const userInfo = myUtil.sessionStore.getItem('userInfo');
      const dctszdxz = Number(userInfo?.qypz?.QYPZGL_TBSJDCZDSJTS ? userInfo?.qypz?.QYPZGL_TBSJDCZDSJTS : 20000);
      const gridPagination = refDDBaseGrid.current?.getPagination();
      // 正常导出，依然限制 2万限制
      if (export_large != true && gridPagination.total > dctszdxz) {
        message.info('您导出数据超出' + dctszdxz + '条，请调整筛选条件，分批导出！');
        return;
      } else if (export_large == true && gridPagination.total > dctszdxz) { // 大数据量导出 并且导出数据量大于2万，需要启动异步方法，小于等于2万依然同步
        exportLarge = true;
        const cdPath = history?.location?.pathname;
        const menuObj = myUtil.menu.getMenuObjByPath(cdPath);
        cdDm = menuObj?.id;
      }
    }
    gridParams.searchModel.forEach((item: any, index: number) => {
      model.push(item);
    });
    gridParams.initSearchModal.forEach((item: any, index: number) => {
      model.push(item);
    });
    tmp.forEach((item: any, index: number) => {
      model.push(item);
    });
    //获得key
    let exkey = cjpzUtil.bdcj.formatExkey(export_key3 ,export_key2 ,export_key1 ,export_key ,unit_key );
    DDAlert.open({
      info: modalTitle,
      infoType: 'question',
      modalType: 'confirm',
      isFormContent: exportLarge,
      okText: '确定',
      closeStatus: false,
      content: <>
        {exportLarge == true ?
          <>
            <div>{modalTitle}</div>
            <Form.Item name='zdydcms'>
              <Input maxLength={30} style={{width: 440, marginTop: 15}} placeholder="自定义导出任务描述" ></Input>
            </Form.Item>
          </>
          : <></>}
      </>,
      okCallbackFn: async function (thisObj: any) {
        const data: any = {
          sfBhsj: 'Y',
          sfScsm: 'Y',
          key: exkey,
          exportLarge: exportLarge, // 是否开启全量数据导出 异步 超过指定条数数据一次性全部导出
          exportFileCompleted: true, // 导出文件落地后返回文件路径
          cdDm: cdDm,
          orderModel: orderModel,
          searchModel: model,
          zdydcms: exportLarge ? DDAlert.getContentFormData()?.zdydcms : null
        }
        thisObj.setState({ masker: true });
        downloadTemplate(data).then((response) => {
          thisObj.setState({ masker: false });
          const { code, body, desc } = response;
          if (code === '200') {
            DDAlert.close();
            if (exportLarge) {
              DDAlert.open({
                title: '系统提示',
                info: '创建任务成功，是否跳转任务管理？',
                infoType: 'question',
                modalType: 'confirm',
                okCallbackFn: function () {
                  history.push({ pathname: '/02/0201' });
                },
              });
            } else {
              if (data?.exportFileCompleted === true) {
                const { wjm, wjlj } = body;
                myUtil.file.downloadFileByPath(wjlj, wjm);
              } else {
                const { blob, fileName } = body;
                myUtil.file.downloadExcel(blob, fileName);
              }
            }
          } else {
            DDAlert.close();
            message.error(desc);
          }
        }).catch(() => {
          DDAlert.close();
          thisObj.setState({ masker: false });
        }).finally(() => {
          thisObj.setState({ masker: false });
        });
      }
    })
    // 新版导出bak
    // exportPager(data).then((response) => {
    //   unitRef.current?.setMasker(false);
    //   const { code, body, desc } = response;
    //   if (code === '200') {
    //     const { filePath } = body;
    //     DDAlert.open({
    //       title: '数据导出',
    //       info: '数据导出成功',
    //       content: <>
    //         <p className="item">文件路径：<a type="link" onClick={(event: any) => openCommonDcFile({ filePath: filePath })}>{filePath}</a></p>
    //       </>,
    //     });
    //   } else {
    //     message.error(desc);
    //   }
    // })
  };

  // const openCommonDcFile = (params: any) => {
  //   openDcFile(params).then((response) => {
  //     const { code, desc } = response;
  //     if (code != '200') {
  //       message.error(desc);
  //     }
  //   })
  // }

  //导出台账、数据报表导出
  // const handleExportTz = () => {
  //   const key = export_key;
  //   const tmp = getGridParams();
  //   const model: any = [];
  //   unitRef.current?.setMasker(true);
  //   const searchModel3: any = refDDBaseGrid.current?.getHeaderFilter() || [];
  //   tmp.searchModel.forEach((item: any, index: number) => {
  //     model.push(item);
  //   });
  //   tmp.initSearchModal.forEach((item: any, index: number) => {
  //     model.push(item);
  //   });
  //   searchModel3.forEach((item: any, index: number) => {
  //     model.push(item);
  //   });
  //   if (key.indexOf("PRINT_REPORT") == -1) {
  //     const data: any = {
  //       key: key,
  //       searchModel: model,
  //       orderModel: tmp.orderModel,
  //     }
  //     exportTzPagerDc(data).then((response) => {
  //       const { code, body, desc } = response;
  //       unitRef.current?.setMasker(false);
  //       if (code === '200') {
  //         const { blob, fileName } = body;
  //         myUtil.file.downloadExcel(blob, fileName);
  //       } else {
  //         message.error(desc);
  //       }
  //     })
  //   } else {
  //     if(moduleType != 'sjbb') {
  //       model.push({ property: 'xzlx', value: export_xz_key == undefined ? '' : export_xz_key, op: 'dd' });
  //     }
  //     const data: any = {
  //       key: key,
  //       relx: 'xls',
  //       iszip: 'N',
  //       searchModel: model,
  //       orderModel: tmp.orderModel,
  //     }
  //     exportTzPager(data).then((response) => {
  //       const { code, body, desc } = response;
  //       unitRef.current?.setMasker(false);
  //       if (code === '200') {
  //         const { blob, fileName } = body;
  //         myUtil.file.downloadExcel(blob, fileName);
  //       } else {
  //         message.error(desc);
  //       }
  //     })
  //   }
  // }

  // 自定义导入
  const customerImport = () => {
    let showType = import_download_template;
    let showStyle = import_style;
    let exkey = cjpzUtil.bdcj.formatExkey(export_key3, export_key2, export_key1, export_key, unit_key);
    // showType false: 2个导入选择项
    // showType false: 3个导入选择项
    // showStyle 1: 有选择项
    // showStyle 2: 无选择项
    const data = {
      key: import_key,
      url: importUrl,
      templateUrl: templateUrl,
      gridRef: refDDBaseGrid,
      showType: showType,
      unit_lcswsx_dm,
      exkey: '',
      showStyle: showStyle,
      exprotMsg:exprotMsg,
      buttenHidden: false // 失败原因导出按钮
    }
    if (showType) {
      data.exkey = exkey;
    }
    // 是否为采集页面（免抵退、免退税、代办退税、证明开具、其他申报）
    if (page_id && (page_id.indexOf('mdt_') > -1 || page_id.indexOf('dbts_') > -1 || page_id.indexOf('mts_') > -1 || page_id.indexOf('zmkj_') > -1 || page_id.indexOf('qtyw_') > -1)) {
      data.showType = true
      data.exkey = exkey;
    }
    // 特定样式（无Radio, 有提示信息）[单位管理]
    if(import_key === 'PZGL_ZDPDPZGL_DWGL_DR' || import_key === 'SAAS_DDZX_KHGL_ZRKH_DR' || import_key === 'CKFPKJ_FPPZ_JNHYD_DR' ) {
      data.showStyle = '2';
      data.showType = true
      data.exkey = exkey;
    } else if (import_key === 'JLJGHX_HXSBSJGL_YHXSZCHGSJTZB_DR') {
      data.showType = false;
      data.exkey = exkey;
    }
    if (import_key.indexOf('ZXSB_BADZBASE') > -1) {
      data.showStyle = '2';
      data.buttenHidden = 'N';
    }
    refDDImport.current!.showModal(data);
  };

  // 列表设置
  const gridSetting = () => {
    refDDGridViewSetting.current!.showModal();
  };

  // 原在线申报系统模块 小计
  const cktsCommonSum = () => {
    const param: any = {
      refCktsSum: refCktsSum,
      unit_key,
      unit_lcswsx_dm,
      gridData: getGridData(),
      gridParams: getGridParams(),
      selectionRowKeys:selectionRowKeys,
      setMasker,
    }
    CommonFunc.cktsCommonSum(param);
  };

  // 原在线申报系统模块 序号重排
  const cktsCommonOrder = () => {
    const param: any = {
      refCktsOrder: refCktsOrder,
      unit_key,
      unit_lcswsx_dm,
      type: config?.toolbar_default?.ckts_order,
      unitRef,
      gridData: getGridData(),
      order_key,
    }
    CommonFunc.cktsCommonOrder(param);
  };

  // 原在线申报系统模块 导出
  const cktsCommonExport = () => {
    const gridPagination = refDDBaseGrid.current?.getPagination();
    if (gridPagination.total > 50000) {
      message.info('本次导出的数据条数已超过上限（5万条），无法导出。');
      return;
    }
    const param: any = {
      unit_key,
      unit_lcswsx_dm,
      gridParams: getGridParams(),
      gridData: getGridData(),
      setMasker,
      export_key,
      searchModel3: refDDBaseGrid.current?.getHeaderFilter() || [],
      orderModel: refDDBaseGrid.current?.getGridSort(),
      flag: moduleType,
      selectionRowKeys :selectionRowKeys,
    }
    CommonFunc.cktsCommonExport(param);
  };

  // 序号重排
  // const commonOrder = (type: string) => {
  //   const gridData = getGridData();
  //   if (gridData.length === 0) {
  //     message.info(intl.formatMessage({ id: 'message_no_data_common_sort' }));
  //     return;
  //   }
  //   const data = {
  //     key: `${unit_key}`,
  //     gridRef: refDDBaseGrid,
  //     unitRef: unitRef,
  //   }
  //   if (type === '2') {
  //     // 导入排序
  //     refOrder.current?.showModal(data);
  //   } else {
  //     // 选择排序
  //     refOrder2.current?.showModal(data);
  //   }
  // };

  // 批量修改
  const batchEdit = () => {
    if(unit_key != 'MTS_ZXSB_SB_MTS_TSSB_G' && unit_key != 'MTS_ZXSB_SB_MTS_TSJH_G' && unit_key != 'MDT_ZXSB_SB_MDT_TSSB_G') {
      if (!isAllBatchEdit && selectionRowKeys?.length <= 0) {
        message.info(intl.formatMessage({ id: 'message_handle_unselected' }));
        return;
      }
    }
    let param = (func.getBatchEditParam && func.getBatchEditParam({
      unitRef,
      gridRef: refDDBaseGrid,
      uuids: selectionRowKeys,
      selectionRows,
      selectionRowKeys,
    })) || {
      uuids: selectionRowKeys,
      selectionRows,
      selectionRowKeys,
    };
    refBatchUpdate.current?.showModal({
      data: batch_update_items || [],
      url: batchUpdateUrl,
      ref: unitRef,
      apiParams: param,
      gridParams: getGridParams(),
    })
  };

  // 打印报表下载 todo
  const reportDownload = () => {
    refDybbxz.current?.showModal({
      unit_key,
      unit_lcswsx_dm
    });
  };
  // 更新台账数据
  const tzUpdateData = () => {
    refTzUpdateData.current?.showModal();
  };
  // 更新报表
  const sjgxUpdateData = () => {
    refSjgxUpdateData.current?.showModal();
  };

  // 全屏
  const handleFullscreen = () => {
    // if (fullscreenstate) {
    //   document.getElementsByClassName('ant-pro-basicLayout-has-header')[0].classList.remove("ant-fullscreen");
    // } else {
    //   document.getElementsByClassName('ant-pro-basicLayout-has-header')[0].classList.add("ant-fullscreen");
    // }
    // setfullscreenstate(!fullscreenstate)
    const divRoot: any = document.querySelector("body");
    if (fullscreen) {
      divRoot.classList.remove("ant-fullscreen");
    } else {
      divRoot.classList.add("ant-fullscreen");
    }
    changeFullscreen(!fullscreen);
  };

  // 快捷筛选
  const getGridFilterQuick = () => {
    const kkkk: any = [];
    const initialValues: any = {};
    if (grid_filter_quick && grid_filter_quick.length > 0) {
      grid_filter_quick.forEach((item1: any, index: number) => {
        const formItemOutsideCommonProps: any = {
          label: item1.isLabel ? item1.label : ''
        };
        const formItemCommonProps: any = {
          name: item1.name,
        };
        const inputCommonProps = {
          'data-dd-type': item1.type,
          'data-dd-searchmodelbz': item1.searchModelBz,
          autoComplete: 'off',
          placeholder: item1.placeholder || `${item1.label}`,
          // onInput:() => { return onInput ? fieldEvent[onInput](useform) : true },
        };
        const param: any = {
          gridRef: refDDBaseGrid,
          unitRef: unitRef,
          formQuickFilter: formQuickFilter,
        }
        // tooltips
        let tooltipsEle: any = <></>;
        if (item1.tooltip) {
          const tooltips: any = [];
          const titleTooltipArr: any = item1.tooltip.split('{br}');
          titleTooltipArr?.forEach((tip: any, index1: number) => {
            tooltips.push(tip);
            if (index1 !== titleTooltipArr.length) {
              tooltips.push(<br key={index1.toString()} />);
            }
          });
          tooltipsEle = <Tooltip title={tooltips}>
            <span><QuestionCircleOutlined /></span>
          </Tooltip>
        }
        // style
        let inputDefaultWidth = 160; // 80px:1w     120px:2w      160px:3w      200px:4w      240px:5w      280px:6w
        let searchBtnWidth = 63;
        if (item1.width === '1w') {
          inputDefaultWidth = 80;
        } else if (item1.width === '2w') {
          inputDefaultWidth = 120;
        } else if (item1.width === '3w') {
          inputDefaultWidth = 160;
        } else if (item1.width === '4w') {
          inputDefaultWidth = 200;
        } else if (item1.width === '5w') {
          inputDefaultWidth = 240;
        } else if (item1.width === '6w') {
          inputDefaultWidth = 280;
        }
        if (item1.type === itemType.Select) {
          const inputProps: any = {
            ...inputCommonProps,
            showArrow: true,
            allowClear: item1.allowClear ? item1.allowClear : false,
            mode: item1.mode ? item1.mode : false,
            showSearch: item1.showSearch
            // defaultValue: item1.defaultValue || item1.list[0]?.value,
          };
          inputProps.onChange = (value: any, option: any) => {
            if (item1.onChange) {
              param.value = value;
              param.option = option;
              func[item1.onChange](param);
            }
            if (item1.isReload === undefined || item1.isReload === true) {
              reload2();
            }
          }
          if (item1.style) {
            inputProps.style = item1.style;
          }
          if (item1.defaultValue) {
            initialValues[item1.name] = item1.defaultValue;
          }
          let maxTagCount;
          if (item1.mode === 'multiple') {
            maxTagCount = {
              maxTagCount: 'responsive',
            }
          }
          if (item1.codeTable) {
            item1.list = myUtil.code.getSelectOption(item1.codeTable[0], item1.codeTable[1])
            if (item1.showCode) {
              item1.list.forEach((item: any) => {
                item.name = `[${item.value}]   ${item.name}`
              })
            }
          }
          // initialValues[item1.name] = item1.defaultValue || ((item1.list && item1.list.length> 0) ? item1.list[0].value :'' );
          // inputProps.defaultValue = item1.list[0].value; // ??
          const ele: any = <Select {...inputProps} {...maxTagCount} style={{ width: inputDefaultWidth + 'px' }} filterOption={(input, option) => {
            return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }}>
            {(item1.list ? item1.list : []).map((selectItem: any) => (
              <Select.Option key={selectItem.value} value={selectItem.value}>{selectItem.name || selectItem.label}</Select.Option>
            ))}
          </Select>;
          kkkk.push(
            <Form.Item key={index.toString()} {...formItemOutsideCommonProps}>
              <Space size={4}>
                <Form.Item {...formItemCommonProps} noStyle >
                  {ele}
                </Form.Item>
                {item1.tooltip && tooltipsEle}
              </Space>
            </Form.Item>
          );
        } else if (item1.type === itemType.Input) {
          const inputProps: any = {
            ...inputCommonProps,
            allowClear: true,
            onPressEnter: (e: any) => {
              param.event = e;
              if (item1.onPressEnter) {
                func[item1.onPressEnter](param);
              }
              if (item1.isReload === undefined || item1.isReload === true) {
                // refDDBaseGrid.current!.reload();
                reload2();
              }
            },
            onSearch: (value: any, e: any) => {
              param.value = value;
              param.event = e;
              if (item1.onSearch) {
                func[item1.onSearch](param);
              }
              if (!value) {
                formQuickFilter.setFieldsValue({ [item1.name]: '' })
              }
              if (item1.isReload === undefined || item1.isReload === true) {
                reload2();
              }
            }
          };
          if (item1.searchButton) {
            inputProps.enterButton = '查询';
          }
          initialValues[item1.name] = item1.defaultValue || '';
          // 校验规则
          if (item1.validator) {
            formItemCommonProps.rules = func[item1.validator]();
          }
          if (item1.range) {
            // 当前未使用， 待完善
            // **********
            // 当前未使用， 待完善
            const formItemCommonProps1: any = {
              placeholder: item1.placeholder || `${item1.label}` + '起',
              name: item1.name + 'Q',
            };
            const formItemCommonProps2: any = {
              placeholder: item1.placeholder || `${item1.label}` + '止',
              name: item1.name + 'Z',
            };
            const inputProps1: any = { placeholder: `${item1.label}起` };
            const inputProps2: any = { placeholder: `${item1.label}止` };
            // if (item1.searchBtnStatus) {
            //   inputProps2.enterButton ="查询";
            //   inputProps2.onSearch= (value: any, e: any) => {
            //     param.value = value;
            //     param.event = e;
            //     if (item1.onSearch) {
            //       func[item1.onSearch](param);
            //     }
            //     if (item1.isReload === undefined || item1.isReload === true) {
            //       reload2();
            //     }
            //   }
            // }
            kkkk.push(
              <Form.Item key={index.toString()} {...formItemOutsideCommonProps}>
                <Input.Group compact>
                  <Form.Item {...formItemCommonProps1} noStyle>
                    <Input {...inputProps1} style={{ width: inputDefaultWidth + 'px' }} />
                  </Form.Item>
                  <Input className="site-input-split" placeholder="~" disabled />
                  <Form.Item {...formItemCommonProps2} noStyle>
                    <Input {...inputProps2} className="site-input-right" style={{ width: inputDefaultWidth + 'px' }} />
                  </Form.Item>
                  {/* { item1.tooltip && tooltipsEle } */}
                </Input.Group>
              </Form.Item>
            );
          } else {
            kkkk.push(
              <Form.Item key={index.toString()} {...formItemOutsideCommonProps}>
                <Space size={4}>
                  <Form.Item {...formItemCommonProps} noStyle>
                    {item1.searchButton ?
                      <Input.Search {...inputProps} style={{ width: (inputDefaultWidth + searchBtnWidth) + 'px' }} />
                      :
                      <Input.Search {...inputProps} className='grid-filter-input-search-noBtn' style={{ width: inputDefaultWidth + 'px' }} />}
                  </Form.Item>
                  {item1.tooltip && tooltipsEle}
                </Space>
              </Form.Item>
            );
          }
        } else if (item1.type === itemType.Checkbox) {
          const inputProps: any = {
            ...inputCommonProps,
            onChange: (e: any) => {
              param.event = e;
              if (item1.onChange) {
                func[item1.onChange](param);
              }
              if (item1.isReload === undefined || item1.isReload === true) {
                reload2();
              }
            }
          };
          initialValues[item1.name] = item1.defaultValue || [];
          kkkk.push(
            <Form.Item key={index.toString()} {...formItemOutsideCommonProps}>
              <Space size={4}>
                <Form.Item {...formItemCommonProps} noStyle >
                  <Checkbox.Group {...inputProps}>
                    {item1.list.map((selectItem: any) => (
                      <Checkbox key={selectItem.value} value={selectItem.value}>{selectItem.label}</Checkbox>
                    ))}
                  </Checkbox.Group>
                </Form.Item>
                {item1.tooltip && tooltipsEle}
              </Space>
            </Form.Item>
          );
        } else if (item1.type === itemType.DatePicker) {
          const { picker } = item1;
          const dataPickFormat = item1.format == undefined ? 'YYYY-MM-DD' : item1.format === 'YYYY-MM' || item1.format === 'yyyy-MM' ? '' : item1.format;
          const inputProps: any = {
            ...inputCommonProps,
            format: dataPickFormat,
            picker,
            onChange: (value: any, option: any) => {
              // refDDBaseGrid.current!.reload();
              reload2();
              if (item1.onChange) {
                param.value = value;
                param.option = option;
                func[item1.onChange](param);
              }
            },
          };
          if (item1.range) {
            if (item1.defaultValue) {
              initialValues[item1.name] = [moment(item1.defaultValue[0], dataPickFormat), moment(item1.defaultValue[1], dataPickFormat)];
            }
            inputProps.placeholder = [`${item1.label}起`, `${item1.label}止`];
            if (item1.allowClear === undefined) {
              inputProps.allowClear = true;
            } else {
              inputProps.allowClear = item1.allowClear;
            }
            if (item1.style) {
              inputProps.style = item1.style;
            }
            kkkk.push(
              <Form.Item key={index.toString()} {...formItemOutsideCommonProps}>
                <Space size={4}>
                  <Form.Item {...formItemCommonProps} noStyle >
                    <DatePicker.RangePicker {...inputProps} />
                  </Form.Item>
                  {item1.tooltip && tooltipsEle}
                </Space>
              </Form.Item>
            );
          } else {
            if (item1.defaultValue) {
              initialValues[item1.name] = moment(item1.defaultValue, dataPickFormat);
            }
            kkkk.push(
              <Form.Item key={index.toString()} {...formItemOutsideCommonProps}>
                <Space size={4}>
                  <Form.Item {...formItemCommonProps} noStyle >
                    <DatePicker {...inputProps} />
                  </Form.Item>
                  {item1.tooltip && tooltipsEle}
                </Space>
              </Form.Item>
            );
          }
        } else if (item1.type === itemType.Switch) {
          const inputProps: any = {
            ...inputCommonProps,
            onChange: (value: any, option: any) => {
              // refDDBaseGrid.current!.reload();
              reload2();
              if (item1.onChange) {
                param.value = value;
                param.option = option;
                func[item1.onChange](param);
              }
            },
          };
          if (item1.defaultValue) {
            initialValues[item1.name] = item1.defaultValue;
          }
          kkkk.push(
            <Form.Item key={index.toString()} {...formItemOutsideCommonProps}>
              <Space size={4}>
                <Form.Item {...formItemCommonProps} noStyle valuePropName="checked">
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={true} />
                </Form.Item>
                {item1.tooltip && tooltipsEle}
              </Space>
            </Form.Item>
          );
        }
      });
    }
    return (
      <Form form={formQuickFilter} initialValues={initialValues} name="dd_quick_filter" layout="inline" className="dd_quick_filter">
        {kkkk}
      </Form>
    );
  };

  // 提示信息
  const getGridHeaderInfo = () => {
    const tttt: any = [];
    if (sumField && sumField.length > 0) {
      sumField.forEach((item1: any, index: number) => {
        let sumItem = 0;
        selectionRows.forEach((item: any) => {
          sumItem += item[item1.field] || 0;
        });
        tttt.push(
          <span className="grid_header_info_group" key={index.toString()}>
            {item1.label || ''}
            <b className="txt_b txt_h">{myUtil.text.formatNum(sumItem, item1.format || '0,0.00')}</b>
            {item1.unit || ''}
          </span>
        )
      });
    }
    let tit: any;
    if (typeof grid_title === 'string') {
      tit = grid_title;
    } else if (typeof grid_title === 'object') {
      if (grid_title.type === 'function') {
        tit = func[grid_title.func]();
      }
    }
    let titleEnd: any;
    if (typeof grid_title_end === 'string') {
      titleEnd = grid_title_end;
    } else if (typeof grid_title_end === 'object') {
      if (grid_title_end.type === 'function') {
        titleEnd = func[grid_title_end.func]();
      }
    }
    return (
      <div className="grid_header_info_wrap">
        <Space size={0} align="start">
          {tit && (<span className="title">{tit || ''}</span>)}
          {(grid_selection_type !== 'radio' && grid_show_data_num === true) && <div className="grid_header_tatal">
            共
            <span className="tnum">
              {grid_selection_type === false ? <></> : <><b className="txt_b txt_h">{selectionRows.length}</b>/</>}{gridTotal}
            </span>
            项
          </div>}
          <div className="grid_header_info">{tttt}</div>
          <div className="grid_header_info_customer">{gridHeaderInfoCustomer}</div>
          {getGridFilterQuick()}
          {titleEnd && (titleEnd || '')}
        </Space>
      </div>
    );
  };

  // costomerToobar2
  const getCostomerToobar = () => {
    if (!customerToobarBtn || customerToobarBtn.length <= 0) {
      return <></>;
    }
    const costomerToobarArr: any = [];
    customerToobarBtn.forEach((item: any, index: number) => {
      const param: any = {
        selectionRowKeys,
        selectionRows,
        gridRef: refDDBaseGrid,
        unitRef: unitRef,
        formQuickFilter: formQuickFilter,
        unit_key,
        access,
      }

      const funcName = 'getOtherRef';
      let otherRef: any;
      if (func[funcName]) {
        otherRef = func[funcName]();
        param.otherRef = otherRef;
      }
      if (item.type === 'dropdown') {
        const dropdownMenu: any = [];
        item.list.forEach((item2: any) => {
          dropdownMenu.push(<Menu.Item onClick={() => { func[item2.func](param) }} key={item2.name}>{item2.name}</Menu.Item>);
        })
        costomerToobarArr.push(
          <Dropdown key={index.toString()} overlay={(
            <Menu>
              {dropdownMenu}
            </Menu>
          )}>
            <Button type="link">{item.name}<DownOutlined /></Button>
          </Dropdown>
        );
      } else {
        costomerToobarArr.push(
          <Button key={index.toString()} type="link" disabled={item.disabled} onClick={() => {
            func[item.func](param);
          }}>
            {item.name}
          </Button>
        );
      }
    });

    return costomerToobarArr;
  };

 // 列表右侧系统级工具 刷新 全屏 上传 下载
  const gridSystemMenu = (btnNumAll: number) => {
    let toolbarBtnNum = btnNumAll || 0;     // 显示在工具条上的按钮数量
    const param: any = {
      selectionRowKeys,
      selectionRows,
      gridRef: refDDBaseGrid,
      unitRef: unitRef,
      formQuickFilter: formQuickFilter,
    };
    const itemsSelect = [];                       // 显示在...更多图标下的按钮
    const itemsToobar = [];                       // 显示在工具栏上的按钮
    if (toolBarDefault?.download) {
      if (toolbarBtnNum > showBtnNum) {
        // 显示在 ...图标 下
        if (toolBarDefault?.download && toolBarDefault?.download?.constructor === Object) {
          itemsSelect.push(<Menu.Item key={toolBarDefault.download.key} onClick={() => { func[toolBarDefault.download.func](param); }} icon={<DownloadOutlined />}>{toolBarDefault.download.name}</Menu.Item>);
        } else {
          itemsSelect.push(<Menu.Item key="2" onClick={customerExport} icon={<DownloadOutlined />}>{export_name}</Menu.Item>);
        }
      } else {
        // 直接显示在工具栏上，不隐藏
        if (toolBarDefault?.download && toolBarDefault?.download?.constructor === Object) {
          itemsToobar.push(<Button type="link" key={toolBarDefault.download.key} onClick={() => { func[toolBarDefault.download.func](param); }}>{toolBarDefault.download.name}</Button>);
        } else {
          itemsToobar.push(<Button type="link" key="2" onClick={customerExport}>{export_name}</Button>);
        }
        toolbarBtnNum++;
      }
    }
    if (toolBarDefault?.tssb_download) {
      if (toolbarBtnNum > showBtnNum) {
        // 显示在 ...图标 下
        if (toolBarDefault?.tssb_download && toolBarDefault?.tssb_download?.constructor === Object) {
          itemsSelect.push(<Menu.Item key={toolBarDefault.download.key} onClick={() => { func[toolBarDefault.download.func](param); }} icon={<DownloadOutlined />}>{toolBarDefault.download.name}</Menu.Item>);
        } else {
          itemsSelect.push(<Menu.Item key="2" onClick={customerExportTssb} icon={<DownloadOutlined />}>{export_name}</Menu.Item>);
        }
      } else {
        // 直接显示在工具栏上，不隐藏
        if (toolBarDefault?.tssb_download && toolBarDefault?.tssb_download?.constructor === Object) {
          itemsToobar.push(<Button type="link" key={toolBarDefault.download.key} onClick={() => { func[toolBarDefault.download.func](param); }}>{toolBarDefault.download.name}</Button>);
        } else {
          itemsToobar.push(<Button type="link" key="2" onClick={customerExportTssb}>{export_name}</Button>);
        }
        toolbarBtnNum++;
      }
    }
    // 原在线申报系统模块 导出
    if (toolBarDefault?.ckts_download) {
      if (toolbarBtnNum > showBtnNum) {
        // 显示在 ...图标 下
        if (toolBarDefault?.ckts_download && toolBarDefault?.ckts_download?.constructor === Object) {
          itemsSelect.push(<Menu.Item key={toolBarDefault.download.key} onClick={() => { func[toolBarDefault.download.func](param); }} icon={<DownloadOutlined />}>{toolBarDefault.download.name}</Menu.Item>);
        } else {
          itemsSelect.push(<Menu.Item key="2" onClick={cktsCommonExport} icon={<DownloadOutlined />}>{export_name}</Menu.Item>);
        }
      } else {
        // 直接显示在工具栏上，不隐藏
        if (toolBarDefault?.ckts_download && toolBarDefault?.ckts_download?.constructor === Object) {
          itemsToobar.push(<Button type="link" key={toolBarDefault.download.key} onClick={() => { func[toolBarDefault.download.func](param); }}>{toolBarDefault.download.name}</Button>);
        } else {
          itemsToobar.push(<Button type="link" key="2" onClick={cktsCommonExport}>{export_name}</Button>);
        }
        toolbarBtnNum++;
      }
    }
    if (toolBarDefault?.upload) {
      if (toolbarBtnNum > showBtnNum) {
        // 显示在 ...图标 下
        if (toolBarDefault?.upload && toolBarDefault?.upload?.constructor === Object) {
          itemsSelect.push(<Menu.Item key={toolBarDefault.upload.key} onClick={() => { func[toolBarDefault.upload.func](param); }} icon={<UploadOutlined />}>{toolBarDefault.upload.name}</Menu.Item>);
        } else {
          itemsSelect.push(<Menu.Item key="1" onClick={customerImport} icon={<UploadOutlined />}>导入</Menu.Item>);
        }
      } else {
        // 直接显示在工具栏上，不隐藏
        if (toolBarDefault?.upload && toolBarDefault?.upload?.constructor === Object) {
          itemsToobar.push(<Button type="link" key={toolBarDefault.upload.key} onClick={() => { func[toolBarDefault.upload.func](param); }}>{toolBarDefault.upload.name}</Button>);
        } else {
          itemsToobar.push(<Button type="link" key="1" onClick={customerImport}>导入</Button>);
        }
        toolbarBtnNum++;
      }
    }
    // if (toolBarDefault?.setting) {
    //   itemsSelect.push(<Menu.Item key="3" onClick={gridSetting} icon={<SettingOutlined />}>设置</Menu.Item>);
    // }
    if (toolBarDefault?.reload) {
      if (toolbarBtnNum > showBtnNum) {
        // 显示在 ...图标 下
        itemsSelect.push(<Menu.Item key="3" onClick={reload2} icon={<ReloadOutlined />}>刷新</Menu.Item>);
      } else {
        // 直接显示在工具栏上，不隐藏
        itemsToobar.push(<Button type="link" key="3" onClick={reload2}>刷新</Button>);
        toolbarBtnNum++;
      }
      // itemsSelect.push(<Menu.Item key="3" onClick={reload2} icon={<ReloadOutlined />}>刷新</Menu.Item>);
    }
    if (toolBarDefault?.full) {
      // if (toolbarBtnNum > showBtnNum) {
      //   // 显示在 ...图标 下
      //   itemsSelect.push(<Menu.Item key="4" onClick={fullscreen} icon={fullscreenstate ? <FullscreenExitOutlined /> : <FullscreenOutlined />} >{fullscreenstate ? '退出全屏' : '全屏'}</Menu.Item>);
      // } else {
      //   // 直接显示在工具栏上，不隐藏
      //   itemsToobar.push(<Button type="link" key="4" onClick={fullscreen} >{fullscreenstate ? '退出全屏' : '全屏'}</Button>);
      //   toolbarBtnNum ++;
      // }
      if (toolbarBtnNum > showBtnNum) {
        // 显示在 ...图标 下
        itemsSelect.push(<Menu.Item key="4" onClick={handleFullscreen} icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} >{fullscreen ? '退出全屏' : '全屏'}</Menu.Item>);
      } else {
        // 直接显示在工具栏上，不隐藏
        itemsToobar.push(<Button type="link" key="4" onClick={handleFullscreen} >{fullscreen ? '退出全屏' : '全屏'}</Button>);
        toolbarBtnNum++;
      }
      // itemsSelect.push(<Menu.Item key="4" onClick={handleFullscreen} icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} >{fullscreen ? '退出全屏' : '全屏'}</Menu.Item>);
    }
    let sysMenu: any;
    const overlayMenu = <>
      <Menu>{itemsSelect}</Menu>
    </>;

    // 设置当前使用方案标识
    const setGridViewUsed = (pageId: any, schemeData: any, setGridViewPlan: any) => {
      const viewConfig: any = myUtil.localStore.getItem('view_config') || {};
      const viewId: string = pageId;
      const currentViewConfig: any = viewConfig[viewId] || [];
      currentViewConfig.forEach((item: any) => {
        if (schemeData) {
          item.isUsed = schemeData.faid === item.faid;
        } else {
          item.isUsed = false;
        }
      });
      viewConfig[viewId] = currentViewConfig;
      myUtil.localStore.setItem('view_config', viewConfig);
      setGridViewPlan(currentViewConfig);
    }

    // 设置父页面视图方案调整项 Add@251021 Start
    sysMenu = [];
    // 列表视图选择按钮下拉列表
    const gridViewDropdownItems: any = () => {
      let tmpItemArr: any = [];
      gridViewPlan?.forEach((item: any, index: any) => {
        tmpItemArr.push(
          <Menu.Item key={item?.faid} disabled={item.isUsed} onClick={(param: any) => {
            let tmpFaid = param.key;
            let targetEle = gridViewPlan?.find((item: any) => { return item.faid === tmpFaid });
            let tmpColumn = {
              all: targetEle?.config?.column || []
            }
            updateGridViewTmpNew({ column: tmpColumn });
            // 设置当前使用方案标识
            const viewId: string = page_id || unit_key;
            setGridViewUsed(viewId, targetEle, setGridViewPlan);
          }}
          >{item?.famc}
        </Menu.Item>,
        );
      });
      if (tmpItemArr.length > 0) {
        tmpItemArr.push( <Menu.Item key='resetGridView' onClick={(param: any) => {
          const col2: any = UnitUtil.grid.init({
            columns: cloneDeep(config?.grid_columns || []),
            otherRef: getOtherRefs(),
            gridRef: refDDBaseGrid,
            unitRef: unitRef,
            handleColumnsDefault,
            handleColumns,
            func,
            popupUpdate,
            handleDelete,
            grid_handle_width,
            changeDDB2PageData,
          });
          setMyColumns([...col2]);
          // 设置当前使用方案标识
          const viewId: string = page_id || unit_key;
          setGridViewUsed(viewId, null, setGridViewPlan);
        }}
        >重置</Menu.Item>);
      }
      const overlayMenuView = <div>
        <Menu>{tmpItemArr}</Menu>
      </div>;
      return overlayMenuView;
    };
    // 列表视图选择按钮
    const gridViewDtn = gridViewPlan?.length > 0 ? <Tooltip title="视图方案">
      <Dropdown placement="bottomRight" overlay={gridViewDropdownItems()} >
        <Button icon={<DownOutlined />} style={{position: 'relative', top: '-1px', left: '-1px'}}/>
      </Dropdown>
    </Tooltip> : <></>;
    // 导入导出等按钮存在一个及以上
    if (itemsSelect.length > 0) {
      sysMenu.push(<><Dropdown overlay={overlayMenu} placement="bottomRight">
        <Button icon={<EllipsisOutlined />} size="small" style={{ width: '27px', height: '27px', border: 'none', background: 'none' }} />
      </Dropdown></>)
    }
    // 配置了列表视图设置按钮
    if (toolBarDefault?.setting) {
      sysMenu.push(<>
        <Button icon={<SettingOutlined />} onClick={gridSetting} size="small" style={{ marginLeft: "10px" }} />
        {gridViewDtn}
      </>);
    }
    // 设置父页面视图方案调整项 Add@251021 End


    // sysMenu = <Dropdown overlay={overlayMenu} placement="bottomRight">
    //   <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
    //     <EllipsisOutlined />
    //   </a>
    // </Dropdown>

    // if (toolBarDefault?.setting) {
    //   sysMenu = <Dropdown.Button style={{ marginLeft: "10px" }} className="grid_system_menu" onClick={gridSetting} overlay={overlayMenu}>
    //     <SettingOutlined />
    //   </Dropdown.Button>;
    // } else {
    //   sysMenu = <Dropdown overlay={overlayMenu} >
    //     <Button icon={<EllipsisOutlined />} style={{ width: '27px', height: '27px' }} size="small" />
    //   </Dropdown>
    // }

    // sysMenu = sysMenu = <Dropdown.Button style={{ marginLeft: "10px" }} className="grid_system_menu" onClick={gridSetting} overlay={overlayMenu}>
    //   <SettingOutlined />
    // </Dropdown.Button>;

    return <>
      {itemsToobar}
      {sysMenu}
    </>;
  };

  // 序号重排按钮
  // const getXhcpBtn = () => {
  //   let xhcpBtn: any;
  //   // 含有两种排序：选择 && 导入
  //   if (toolBarDefault?.order && toolBarDefault?.orderDrpx) {
  //     xhcpBtn = <Dropdown overlay={(
  //       <Menu>
  //         <Menu.Item onClick={() => commonOrder('1')} key='toolbar_default_order_1'>选择排序</Menu.Item>
  //         <Menu.Item onClick={() => commonOrder('2')} key='toolbar_default_order_2'>导入排序</Menu.Item>
  //       </Menu>
  //     )}>
  //       <Button type="link">序号重排<DownOutlined /></Button>
  //     </Dropdown>
  //     // 只有一种排序，选择
  //   } else if (toolBarDefault?.order && !toolBarDefault?.orderDrpx) {
  //     xhcpBtn = <Button type="link" onClick={() => commonOrder('1')}>序号重排</Button>;
  //     // 只有一种排序，导入
  //   } else if (toolBarDefault?.orderDrpx && !toolBarDefault?.order) {
  //     xhcpBtn = <Button type="link" onClick={() => commonOrder('2')}>序号重排</Button>;
  //   }
  //   return xhcpBtn;
  // }

  // 工具栏
  const setToobar = () => {
    let btnNumDefault: number = 0;                                  // 默认按钮数量
    let btnNumCustomer: number = customerToobarBtn?.length || 0;    // 自定义按钮数量
    toolBarDefault?.add && btnNumDefault++;
    toolBarDefault?.edit && btnNumDefault++;
    toolBarDefault?.delete && btnNumDefault++;
    toolBarDefault?.sum && btnNumDefault++;
    toolBarDefault?.batchEdit && btnNumDefault++;
    toolBarDefault?.tzUpdateData && btnNumDefault++;
    toolBarDefault?.sjgxUpdateData && btnNumDefault++;
    toolBarDefault?.tzExport && btnNumDefault++;
    toolBarDefault?.cxtj_report && btnNumDefault++;
    (toolBarDefault?.order || toolBarDefault?.orderDrpx) && btnNumDefault++;
    // 原在线申报系统模块 小计
    toolBarDefault?.ckts_sum && btnNumDefault++;
    const btnNumAll: number = btnNumDefault + btnNumCustomer;
    return <div style={{ display: showToolBar !== false ? 'block' : 'none' }} >
      <DDToolbar affix={{ offsetTop: toobar_affix() }}>
        {getGridHeaderInfo()}
        <div className='toobar-right'>
          <Space size={0}>
            {getCostomerToobar()}
            {toolBarDefault?.cxtj_report && <Button type="link" onClick={reportDownload}>打印报表下载</Button>}
            {toolBarDefault?.tzUpdateData && <Button type="link" onClick={tzUpdateData}>更新台账数据</Button>}
            {toolBarDefault?.sjgxUpdateData && <Button type="link" onClick={sjgxUpdateData}>更新报表</Button>}
            {toolBarDefault?.ckts_sum && <Button type="link" onClick={cktsCommonSum}>小计</Button>}
            {toolBarDefault?.batchEdit && <Button type="link" onClick={batchEdit}>批量修改</Button>}
            {/* {getXhcpBtn()} */}
            {toolBarDefault?.ckts_order && <Button type="link" onClick={cktsCommonOrder}>序号重排</Button>}
            {toolBarDefault?.add && <Button type="link" onClick={popupUserAdd}>新建</Button>}
            {toolBarDefault?.edit && <Button type="link" onClick={popupUpdateFromToolbar}>修改</Button>}
            {toolBarDefault?.delete && <Button type="link" onClick={handleUBatchDelete} >删除</Button>}
            {/* {toolBarDefault?.tzExport && <Button type="link" onClick={handleExportTz}>导出</Button>} */}
            {gridSystemMenu(btnNumAll)}
          </Space>
        </div>
      </DDToolbar>
    </div>
  };

  // 新建、编辑保存
  const handleSave = (savaAddFlag : any) => {
    if (masker2) {
      return;
    }
    // 表单特殊类型处理
    formItems.forEach((item: any) => {
      // 去除后端空格
      if (item.type === itemType.Input && typeof form.getFieldValue(item.name) === 'string') {
        let itemValueTmp = {};
        itemValueTmp[item.name] = form.getFieldValue(item.name)?.trim() || '';
        form.setFieldsValue(itemValueTmp);
      }
    })
    form.validateFields().then(async values => {
      // 表单特殊类型处理
      formItems.forEach((item: any) => {
        if (item.type === itemType.DatePicker && values[item.name]) {  // 日期类型
          values[item.name] = moment(values[item.name]).format('YYYY-MM-DD');
        }
        if (item.type === itemType.Select && item.mode === 'multiple') {
          if (values[item.name]) {
            values[item.name] = values[item.name].join(',');
          }
        }
        if (typeof values[item.name] === 'string') {
          values[item.name] = values[item.name]?.trim() || '';
        }
        if (item.type === itemType.Upload) {
          if (Array.isArray(values[item.name])) {
            values[item.name].fileList = values[item.name]
          }
          if (item.editInit == 'true' && (values[item.name])?.fileList?.length > 0 && !values[item.name].fileList[0]?.originFileObj) {
            values[item.fileName || 'wjm'] = values[item.name][0]?.name;
            values[item.name] = values[item.name][0]?.name;
          } else if ((values[item.name])?.fileList?.length > 0) {
            values[item.fileName || 'wjm'] = values[item.name].fileList[0]?.originFileObj?.name;
            values[item.name] = values[item.name].fileList[0]?.originFileObj?.fjxx;
          }
        }
      })
      if (unit_lcswsx_dm) {
        values.lcswsxDm = unit_lcswsx_dm;
      }
      const param: any = {
        key: unit_key,
        formType: formType,
        ...values,
        // data: values,
      }
      // 是否执行后端校验
      let Check = [
        'MDT_ZXSB_SB_MDT_TLHY_G', 'MDT_ZXSB_SB_MDT_XTHH_G', 'MDT_ZXSB_SB_MDT_STZC_G', 'MDT_ZXSB_SB_MDT_SYYK_G',
        'MDT_ZXSB_SB_MDT_YFSJ_G', 'MDT_ZXSB_SB_MDT_HKYS_QS_G', 'MDT_ZXSB_SB_MDT_GJYS_G', 'MDT_ZXSB_SB_MDT_KYHJ_G','MDT_ZXSB_SB_MDT_TSJH_G',
        'MDT_ZXSB_SB_MDT_TSSB_G', 'MTS_ZXSB_SB_MTS_YSFWCK_G', 'MTS_ZXSB_SB_MTS_TZSB_G', 'MTS_ZXSB_SB_MTS_TSSB_G',
        'MTS_ZXSB_SB_MTS_TSJH_G', 'TSZL_ZXSB_SB_CKSH_G', 'TSZL_ZXSB_SB_BNSH_G', 'TSZL_ZXSB_SB_MDT_CYSM_G', 'TSZL_ZXSB_SB_HGSPTZ_G',
        'QTYW_ZXSB_QT_QYGLLBFPPD_G', 'ZGBA_ZXSB_SB_MDT_XTHHZG_G', 'ZBYW_ZXSB_SB_GJ_SBMX_G', 'ZXSB_BADZ_GWHT'
      ];
      // 如果未配置
      let needCheck = myFormSaveCheck;
      if (myFormSaveCheck === undefined) {
        if (!(Check.indexOf(unit_key) < 0)) {
          needCheck = true;
        }
      }
      // 表单提交前调用
      if (func.formBeforeSubmit) {
        let result;
        const beforeResult = await func.formBeforeSubmit({
          form,
          page_id,
          unit_key,
          unitRef,
          handleModalVisible,
          myFormItems,
          setMyFormItems,
          unit_lcswsx_dm,
        });
        result = beforeResult !== undefined ? beforeResult : true;
        if (!result) {
          return
        }
      }
      if (needCheck) {
        setMasker2(true);
        callServiceCheck({ unit_key: unit_key + '_CHECK', data: values, url: formCheckUrl }).then((response1) => {
          const { code, msg, desc } = response1;
          if (code === '200') {
            return baseEdit({ data: param, url: formType === 'add' ? formSaveUrl : formUploadUrl });
          } else if (code === '901') {
            setMasker2(false);
            DDAlert.open({
              title: '系统提示',
              info: '温馨提示',
              // info: desc,
              content: msg,
              modalType: 'confirm',
              infoType: 'info',
              okText: '继续',
              cancelText: '关闭',
              okCallbackFn: function (thisObj: any) {
                DDAlert.close();
                handleModalVisible(false);
                reload2();
                setMasker2(true);
                baseEdit({ data: param, url: formType === 'add' ? formSaveUrl : formUploadUrl }).then((response) => {
                  handleSave2(response, savaAddFlag);
                });
              },
              cancelCallbackFn: function () {
              }
            });
          } else {
            setMasker2(false);
            message.error(msg);
          }
          // message.error(msg);
          // throw new Error(desc);
        }).then((response) => {
          if (response) {
            handleSave2(response, savaAddFlag);
          } else {
            setMasker2(false);
          }
        }).catch((error) => {
          setMasker2(false);
          message.error(error.message);
        });
      } else {
        setMasker2(true);
        baseEdit({ data: param, url: formType === 'add' ? formSaveUrl : formUploadUrl }).then((response) => {
          handleSave2(response, savaAddFlag);
        })
      }
    })
  }

  // 新建、编辑保存
  const handleSave2 = (response: any,savaAddFlag:any) => {
    const { code, desc ,msg} = response;
    if (code === '200') {
      message.success(desc);
      // 表单提交后调用
      if (savaAddFlag && func.formAfterSubmit) {
        func.formAfterSubmit({
          form,
          page_id,
          unit_key,
          unitRef,
          handleModalVisible,
          unit_lcswsx_dm,
        });
      } else {
        handleModalVisible(false);
      }
      setMasker2(false);
      // refDDBaseGrid.current!.reload();
      reload2();
    } else if(code === '900'){
      setMasker2(false);
      message.error(msg);
    } else {
      setMasker2(false);
      message.error(desc);
    }
  }

  // 配置列表过滤项
  const initFilterItems = () => {
    const items = myFilterItems.concat();
    // 码表渲染
    myFilterItems.map((item: any) => {
      const { codeTable, treeTable, isSelectLeaf = false } = item;
      if (codeTable) {
        item.list = myUtil.code.getSelectOption(codeTable[0], codeTable[1])
      }
      if (treeTable) {
        item.list = myUtil.treeCode.getTreeCodeData(treeTable[0], treeTable[1]);
        if (isSelectLeaf) {
          myUtil.array.traverseTreeLeaf(item.list);
        }
      }
    });
    setMyFilterItems(items);
  }

  // 列表数据加载后执行
  const afterReloadGridData = (param: any) => {
    const { gridTotalNum } = param;
    param.unitRef = unitRef;
    param.gridRef = refDDBaseGrid;
    param.formQuickFilter = formQuickFilter;
    setGridTotal(gridTotalNum);
    if (func.afterReload) {
      func.afterReload(param);
    }
  }

  // 单击双击选中事件
  const clickCheckedToggle = (record: any) => {
    // const key: any = rowKey;
    const existRow: any = selectionRows.find((item: any) => {
      // return item[key] === record[key];
      return getYwKey(item) === getYwKey(record);
    })
    if (existRow) {
      // 删除
      const newSelectionRowKeys = selectionRowKeys.filter((item: any) => {
        // return item !== record[key];
        return item !== getYwKey(record);
      });
      const newSelectionRows = selectionRows.filter((item: any) => {
        // return item[key] !== record[key];
        return getYwKey(item) !== getYwKey(record);
      });
      setSelectionRowKeys([].concat(newSelectionRowKeys));
      setSelectionRows([].concat(newSelectionRows));
    } else {
      // 添加
      selectionRowKeys.push(getYwKey(record));
      selectionRows.push(record);
      setSelectionRowKeys([].concat(selectionRowKeys));
      setSelectionRows([].concat(selectionRows));
    }
  }

  // 单击行
  const rowClick = (record: any, event: any) => {
    if (click_checked === '1') {
      clickCheckedToggle(record);
    }
    // 执行自定义行单击事件
    if (func.gridOnRowClick) {
      func.gridOnRowClick({
        record,
        event,
        gridRef: refDDBaseGrid,
        unitRef: unitRef,
        formQuickFilter: formQuickFilter,
      });
    }
  }

  // 双击行
  const rowDoubleClick = (record: any, event: any) => {
    if (click_checked === '2') {
      clickCheckedToggle(record);
    }
    // 执行自定义行双击事件
    if (func.gridOnRowDoubleClick) {
      func.gridOnRowDoubleClick({
        record,
        event,
        gridRef: refDDBaseGrid,
        unitRef: unitRef,
        formQuickFilter: formQuickFilter,
      });
    }
  }

  // 设置布局
  const setGridLayout = () => {
    const calcParam = ['header', 'cardMargin', 'toolbar', 'pagination', 'gridHeader', '20px', '20px', '1px'];
    if (filterItems?.length > 0) {
      calcParam.push('filter')
    }
    if (layout_type === 'tabs') {
      calcParam.push('headerTab')
    }
    const sumFlag = UnitUtil.grid.isSum(myColumns);
    if (sumFlag) {
      calcParam.push('60px');
    }
    let tmp = myUtil.heightCalc.getCalc(calcParam);
    let lay: any;
    if (layout_scroll_type === 'bodyScroll') {
      if (layout_type === 'tabs') { // tabs
        lay = {
          isSticky: PRO_TYPE === 'xt' ? 90 : 134,
          scroll: {
            x: grid_scroll_x || '700px',
          },
        };
      } else if (layout_type === 'modal') { // modal
        // lay = {
        //   isSticky: 50,
        // };
        lay = {
          scroll: {
            x: grid_scroll_x || '700px',
            y: sumFlag ? `${document.documentElement.clientHeight - 363}px` : `${document.documentElement.clientHeight - 270}px`
          },
        }
      } else { // default
        lay = {
          isSticky: PRO_TYPE === 'xt' ? 50 : 94,
          scroll: {
            x: grid_scroll_x || '700px',
          },
        };
      }
    } else { // layout_scroll_type = gridScroll
      if (layout_type === 'tabs') { // tabs
        lay = {
          // isSticky: PRO_TYPE === 'xt' ? 90 : 134,
          scroll: {
            x: grid_scroll_x || '700px',
            y: tmp,
          },
        };
      } else if (layout_type === 'modal') { // modal
        // lay = {
        //   isSticky: 50,
        // };
        lay = {
          scroll: {
            x: grid_scroll_x || '700px',
            y: `${document.documentElement.clientHeight - 270}px`
          },
        }
      } else { // default
        lay = {
          // isSticky: PRO_TYPE === 'xt' ? 50 : 94,
          scroll: {
            x: grid_scroll_x || '700px',
            y: tmp,
          },
        };
      }
    }
    // 如果配置中另外设置了grid_sticky_affix，则采用配置中grid_sticky_affix
    if (grid_sticky_affix !== undefined) {
      lay = {
        isSticky: grid_sticky_affix,
      };
    }
    if (grid_scroll_y) {
      lay.scroll.y = grid_scroll_y;
    }
    return lay;
  }

  // 设置列表边框
  const setGridBorder = () => {
    if (layout_type === 'tz') {
      return {
        bordered: true,
      }
    }
    if (grid_border) {
      return {
        bordered: true,
      }
    }
    return;
  }

  // 初始化列表列、过滤项、表单项
  const initItem = (cols: any) => {
    const col2: any = UnitUtil.grid.init({
      columns: cols,
      otherRef: getOtherRefs(),
      gridRef: refDDBaseGrid,
      unitRef: unitRef,
      handleColumnsDefault,
      handleColumns,
      func,
      popupUpdate,
      handleDelete,
      grid_handle_width,
      changeDDB2PageData,
    });
    setMyColumns([...col2]);
    // 如果有isUsed=true视图方案，则置为当前视图
    if (page_id) {
      let viewConfig: any = myUtil.localStore.getItem('view_config') || {};
      let gridViewPlanTmp: any = viewConfig[page_id];
      let targetEle = gridViewPlanTmp?.find((item: any) => { return item.isUsed === true });
      if (targetEle) {
        let tmpColumn = {
          all: targetEle?.config?.column || []
        }
        updateGridViewTmpNew({ column: tmpColumn });
      }
    }
    initFilterItems();
    const formItemNew = UnitUtil.code.initFormItemsCodeTable([...(formItems || [])]);
    const tmp = UnitUtil.code.initFormItemsCodeTable([...(grid_filter_quick || [])]);
    grid_filter_quick.splice(0, grid_filter_quick.length);
    tmp.forEach((item: any) => {
      grid_filter_quick.push(item);
    })
    setMyFormItems(formItemNew);
  }

  // after useEffect
  const afterUseEffectEnd = () => {
    if (func.useEffectEnd) {
      const useEffectParam: any = {
        gridRef: refDDBaseGrid,
        unitRef: unitRef,
      };
      return func.useEffectEnd(useEffectParam);
    }
  }

  // 整合列表、表单、筛选中的码表参数
  const initCode = (cols: any) => {
    // 整合列表、表单、筛选中的码表参数
    const param = UnitUtil.code.getCodeTableParam({
      column: cols,
      filterItems: [...(myFilterItems || [])],
      formItems: [...(formItems || [])],
      grid_filter_quick: [...(grid_filter_quick || [])],
    });
    // 获取码表接口promise
    const promiseArr = UnitUtil.code.getCodeTablePromise(param, unit_key);
    // 整合表单、筛选中的treeSelect参数
    const param1 = UnitUtil.treeCode.getTreeCodeTableParam({
      filterItems: [...(myFilterItems || [])],
      formItems: [...(formItems || [])],
    });
    const promiseArr1 = UnitUtil.treeCode.getTreeCodeTablePromise(param1);
    promiseArr1.forEach((item: any) => {
      promiseArr.push(item);
    })
    // 获取码表
    Promise.all(promiseArr).then(() => {
      // do nothing
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      initItem(cols);               // 初始化列表列、过滤项、表单项
      afterUseEffectEnd();          // useEffectEnd
    });
  }

  // useEffect
  useEffect(() => {
    const initQueryParamNew: any = UnitUtil.grid.initAssembleSearchModel({
      unitKey: unit_key,
      filterItems: filterItems,
      gridFilterQuick: grid_filter_quick,
      initSearchModal,
      moduleType,
    });
    if (initQueryParamNew && queryParam && !isEqual(initQueryParamNew, queryParam)) {
      if (unit_key && unit_key?.indexOf('BADZ_SJPP_') >= 0) { // 备案单证业务中数据匹配合资料管理页面不走此分支
        return;
      }
      setQueryParam(initQueryParam);
    }
  }, [config]);

  // useEffect
  useEffect(() => {
    // const viewConfig = refDDGridViewSetting?.current?.getViewConfigScheme();
    // 1 从配置文件中获取列表列配置
    let tmpCol: any; // 列表渲染数据
    let tmpColViews: any = []; // 视图设置数据
    if (config?.service_columns) {
      // 如果开启通过接口获取列表配置列
      getColumn({ key: unit_key }).then((res: any) => {  // 测试数据 'MDT_ZXSB_SB_MDT_TSSB_G'
        // 2 从后端接口获取列表列配置
        if (res.code === '200' && res?.body?.length > 0) {
          tmpCol = res.body;
          tmpColViews = [].concat(res.body);
          initCode(tmpCol);
        } else {
          message.error(intl2.formatMessage({ id: 'message_query_error' }));
        }
      })
    } else {
      // 通过配置文件获取默认列表列
      tmpColViews = cloneDeep(config?.grid_columns);
      tmpCol = cloneDeep(config?.grid_columns || []);
      initCode(tmpCol);
      // initCode(viewConfig?.column || tmpCol);
    }

    // 隐藏列
    tmpColViews = tmpColViews?.filter((col: any) => {
      return (!(col.hidden && col.hidden !== false));
    })
    setViewColumns(tmpColViews);
    // setViewColumnsOriginal(tmpColViews);
    // setViewColumns(viewConfig?.column || tmpColViews);

    // 设置父页面视图方案调整项 Add@251021 Start
    if (config?.toolbar_default?.setting) {
      if (page_id) {
        const viewConfig: any = myUtil.localStore.getItem('view_config') || {};
        const currentViewConfig: any = viewConfig[page_id] || [];
        setGridViewPlan(currentViewConfig);
      }
    }
    // 设置父页面视图方案调整项 Add@251021 End
  }, []);

  // if (globalLoading) {
  //   return <PageLoading tip='数据处理中' />;
  // }

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      {/* globalLoading = {globalLoading ? 'true' : 'false'} */}
      <ProCard split="horizontal" className={`main_pro_card ${layout_type === 'tz' ? 'layout_tz' : ''}
          ${layout_scroll_type === 'gridScroll' ? 'layout_grid_scroll' : ''}
          ${moduleType ? `model_type_${moduleType}` : ''}`
      }>
        {myFilterItems && myFilterItems.length > 0 &&
          <ProCard className="dd-filter-wrap" >
            <DDFilter
              form={formCommonFilter}
              items={myFilterItems}
              onSubmit={reload2}
              onReset={handleReset}
              filterValidate={func.filterValidate}
            />
          </ProCard>
        }
        <ProCard className="dd-grid-wrap">
          {/* {showToolBar !== false && setToobar()} */}
          {setToobar()}
          {(myColumns && myColumns.length > 0) && <DDBaseGrid
            getAssembleSearchModel={getAssembleSearchModel}
            actionRef={refDDBaseGrid}
            url={gridParamsApiQuery}
            queryParam={queryParam}
            columns={myColumns}
            rowKey={rowKey}
            showSerialNumber={showSerialNumber}
            isInitSearch={gridIsInitSearch}
            {...setGridBorder()}
            {...setGridLayout()}
            {...rowSelection}
            {...unitRef}
            pagination2={pagination2}
            pageSizeOptions={pageSizeOptions}
            onRow={(record: any) => {
              return {
                onClick: (event: any) => {
                  rowClick(record, event);
                },
                onDoubleClick: (event: any) => {
                  rowDoubleClick(record, event);
                },
              };
            }}
            afterReloadGridData={afterReloadGridData}
            {...gridParams}
          />}
          {formItems && formItems.length > 0 &&
            <Modal
              title={`${form_title}${formType === 'add' ? '采集' : '编辑'}`}
              visible={createModalVisible}
              wrapClassName='standard-modal-1'
              width={pro.c_modal_width_x4}
              okButtonProps={{ className: 'dd_btn_focus' }}
              onCancel={() => handleModalVisible(false)}
              className={`${masker2 ? 'dd_modal_show_masker' : ''}`}
              maskClosable={false}
              footer={[
                <Button key="close" onClick={() => handleModalVisible(false)}>
                  关闭
                </Button>,
                 formType === 'add' && form_save_add_flag ? (
                  <Button key="saveWithParam" type="primary" onClick={() => handleSave(true)}>
                    保存并增加
                  </Button>
                ) : null,
                <Button key="save" type="primary" onClick={() => handleSave(false)} className="dd_btn_focus">
                  保存
                </Button>,
              ]}
            >
              <Spin tip="Loading..." spinning={masker2} delay={100} key='DDBunit2DDBaseForm'>
                <DDBaseForm otherParam={{
                  otherRef: getOtherRefs(),
                  unit_key,
                }} items={myFormItems} form={form} initialValues={{}} name={formName} />
              </Spin>
            </Modal>
          }
          {config?.toolbar_default?.setting && <DDGridViewSetting
            onRef={refDDGridViewSetting}
            updateGridView={updateGridView}
            settingDataColumn={viewColumns}
            settingDataFilter={gridViewSettingFilter}
            settingDataSort={gridViewSettingSort}
            pageId={page_id}
            setGridViewPlan={setGridViewPlan}
            // originalColumn={viewColumnsOriginal}
            // cacheId={page_id}
          />}
          {config?.toolbar_default?.download && <DDExport onRef={refDDExport} />}
          {config?.toolbar_default?.upload && <DDImport onRef={refDDImport} />}
          {/* {config?.toolbar_default?.orderDrpx && <DDXhSortDr onRef={refOrder} />}
          {config?.toolbar_default?.order && <DDXhSort onRef={refOrder2} />} */}
          {config?.toolbar_default?.batchEdit && <DDBatchUpdate onRef={refBatchUpdate} />}
          {/* {config?.toolbar_default?.tzUpdateData && <DDTzUpdateData onRef={refTzUpdateData} />} */}
          {config?.toolbar_default?.sjgxUpdateData && <DDSjgxUpdateData onRef={refSjgxUpdateData} />}
          {/* 原在线申报系统模块       */}
          {/* 原在线申报系统模块 小计 */}
          {config?.toolbar_default?.ckts_sum && <CKTS_Sjxj onRef={refCktsSum} />}
          {config?.toolbar_default?.ckts_order && <CKTS_Sort onRef={refCktsOrder} />}
          {config?.toolbar_default?.cxtj_report && <Dybbxz onRef={refDybbxz} />}
        </ProCard>
      </ProCard>
    </Spin>
  );
};
export default DDBunit2;
