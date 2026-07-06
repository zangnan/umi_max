import cktsUtil from '@/pages/hts/cktsUtil';
import formUtil from '@/components/DDForm/formUtil';
import React, { useEffect, useState, useRef, useImperativeHandle, useCallback } from 'react';
import { Dropdown, Menu, Button, message, Form, Space, Spin, Select, Input, Checkbox, DatePicker, Tooltip, Tree } from 'antd';
import { EllipsisOutlined, QuestionCircleOutlined, UploadOutlined, DownOutlined, ReloadOutlined, FullscreenOutlined, FullscreenExitOutlined, DownloadOutlined, SettingOutlined } from '@ant-design/icons';
import { baseDelete, baseEdit, baseShow, callServiceCheck } from '@/pages/hts/services/htsApi';
import { itemType } from '@/components/DDForm/data.d';
import DDBaseGrid from '@/components/DDBaseGrid';
import DDFilter from '@/components/DDForm/DDFilter';
import treeData2 from '../data';
import DDToolbar from '@/components/DDToolbar';
import DDAlert from '@/pages/hts/components/DDAlert';
import UnitUtil from '@/components/DDBunit/unit_util';

import myUtil from '@/components/DDAssist/util';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import { useModel } from 'umi';
import { useAccess } from 'umi';
import { intl as intl2 } from '@/components/DDAssist/util';
import './style.less';
import { exportPager, downloadTemplate, queryXtBbh } from '@/pages/hts/services/htsApi';
import { getColumn } from '@/pages/hts/services/htsApi';
import { isEqual } from 'lodash';
import { cloneDeep } from 'lodash';
import {history} from "@@/core/history";

export type DDBunit2Props = {
  config: any;
  func?: any;
}

const DDBunit2: React.FC<DDBunit2Props> = ({
  config,
  func,
}) => {
  if (!config) {
    return <>暂无数据</>
  }
  const { TreeNode } = Tree;
  // config 修正
  config = UnitUtil.config.modify(config);
  // const intl = useIntl();
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
  const pagination2 = config.pagination2;
  const page_id = config.page_id;
  const batch_delete_key = config.batch_delete_key;
  const export_key = config.export_key;
  // 是否开启全量数据导出
  const export_large = config.export_large ? config.export_large : false;
  const order_key = config.order_key;
  // const export_xz_key = config.export_xz_key;
  const gridViewSettingSort = config.grid_setting_sort;
  const unit_constant = config.unit_constant;
  const unit_lcswsx_dm = cktsUtil.getLcswsxDm(unit_constant);
  // filter
  const filterItems = UnitUtil.filter.init(config.filter_items);
  const grid_filter_quick = UnitUtil.filter.init(config.grid_filter_quick);
  const gridViewSettingFilter = UnitUtil.filterAdvanced.init(config.grid_setting_filter_advanced);
  // form
  const form_title = config.form_title;
  const formName = `${page_id}_form`
  const formSaveCheck = config.form_save_check;
  const batch_update_items = config.batch_update_items;
  const formItems = formUtil.init({
    items: config.form_items,
    func: func,
  });
  // toolbar btn
  const grid_title = config.grid_title;
  const sumField = config.grid_sum_field;
  const toolBarDefault = config.toolbar_default;
  const costomerToobar = config.customer_toolbar;
  const showToolBar = config.show_toolbar;
  const grid_show_data_num = config.grid_show_data_num;
  // layout
  const layout_type = config.layout_type || 'default';
  const layout_scroll_type = layoutScrollType ? layoutScrollType : myUtil.localStore.getItem('theme')?.layoutScrollType || 'bodyScroll';
  const toobar_affix = () => {
    let affix: any = PRO_TYPE === 'xt' ? 0 : 44;  // 44
    // 首先根据layout_type设置工具栏affix
    if (layout_type === 'tabs') {
      affix = PRO_TYPE === 'xt' ? 40 : 84;  // 84
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
  // const [fullscreenstate, setfullscreenstate] = useState<boolean>(false);
  const [gridHeaderInfoCustomer, setGridHeaderInfoCustomer] = useState<any>(config.grid_header_info);
  const [showBtnNum] = useState(5);
  // api
  const gridParamsApiQuery = config.api_grid_query || `/hx/ty/crud/queryPager`;
  const deleteUrl = config.api_form_delete || `/hx/ty/crud/delete`;
  const formShowUrl = config.form_api_show || `/hx/ty/crud/queryForm`;
  const formSaveUrl = config.api_form_edit || `/hx/ty/crud/saveOrUpdate`;
  const formCheckUrl = config.form_api_check;
  const importUrl = config.grid_api_import;
  const import_key = config.import_key || config.unit_key;
  const batchUpdateUrl = config.batch_update_url;
  const [treeData, setTreeData] = useState<any>([]);
  const [expandedKeys, setExpandedKeys] = useState<any>([]);


  // const { globalLoading, setGlobalLoading } = useModel('globalLoading');
  const { fullscreen, changeFullscreen } = useModel('fullscreen');
  const { DDB2PageData, changeDDB2PageData } = useModel('ddb2');

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
      setSelectionRowKeys,
      setSelectionRows,
      reload2,
      addQueryModel,
      setGridHeaderInfoCustomer,
      handleReset,
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
    if (selectionRowKeys?.length <= 0) {
      message.info(intl.formatMessage({ id: 'message_delete_unselected' }));
      return;
    }
    // 批量删除前调用
    if (func.beforeDelete) {
      let result;
      const beforeResult = func.beforeDelete({
        page_id,
        unit_key,
        unitRef,
        unit_lcswsx_dm,
        selectionRowKeys,
        selectionRows
      });
      result = beforeResult !== undefined ? beforeResult : true;
      if (!result) {
        return
      }
    }
    DDAlert.open({
      title: '系统提示',
      info: intl2.formatMessage({ id: 'message_inquiry_delete' }),
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: false,
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        const data: any = {
          key: unit_key || '',
        };
        const gridKey = rowKey;
        if (typeof gridKey === 'object') { // 联合主键
          data.ywKeys = selectionRowKeys;
        } else {
          if (batch_delete_key) {
            data[batch_delete_key] = selectionRowKeys;
          } else {
            data.uuids = selectionRowKeys;
          }
        }
        baseDelete({ data: data, url: deleteUrl }).then((response) => {
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
      param = { ...param, orderModel: gridSort, from: 'onchange' };
    }
    setQueryParam(param);
  }
  const updateGridView: any = useCallback(updateGridViewTmp, []);

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
    const orderModel = refDDBaseGrid.current?.getGridSort() || [];
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

    if (selectionRowKeys && selectionRowKeys.length > 0) {
      if (typeof rowKey === 'object') {
        model.push({ property: 'ywKey', values: selectionRowKeys, op: 'ain' });
      } else {
        model.push({ property: rowKey, values: selectionRowKeys, op: 'ain' });
      }
    }
    const modalTitle = '将导出当前筛选条件下的所有数据，是否确认';
    DDAlert.open({
      info: modalTitle,
      infoType: 'warning',
      modalType: 'confirm',
      okText: '确定',
      closeStatus: false,
      isFormContent: false,
      okCallbackFn: async function (thisObj: any) {
        const data: any = {
          key: export_key || unit_key + '_EXCEL',
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
        })
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
    const gridPagination = refDDBaseGrid.current?.getPagination();
    let exportLarge = false;
    let cdDm: any = '';
    // 同步最大导出限制条数
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    const dctszdxz = Number(userInfo?.qypz?.QYPZGL_TBSJDCZDSJTS ? userInfo?.qypz?.QYPZGL_TBSJDCZDSJTS : 20000);
    // 正常导出，依然限制 2万限制
    if (export_large != true && gridPagination.total > dctszdxz) {
      message.info('您导出数据超出' + dctszdxz + '条，请调整筛选条件，分批导出！');
      return;
    } else if (export_large == true && gridPagination.total > dctszdxz) { // 大数据量导出 并且导出数据量大于2万，需要启动异步方法，小于等于2万依然同步
      exportLarge = true;
      const cdPath = history?.location?.pathname;
      const menuObj = cktsUtil.menu.getMenuObjByPath(cdPath);
      cdDm = menuObj?.id;
    }
    const gridData = unitRef.current?.getGridData();
    if (!gridData || gridData.length <= 0) {
      message.info(intl.formatMessage({ id: 'message_common_nodata_export' }));
      return;
    }
    const gridParams = getGridParams();
    const tmp = refDDBaseGrid.current?.getHeaderFilter() || [];
    const orderModel = refDDBaseGrid.current?.getGridSort() || [];
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
    if (selectionRowKeys && selectionRowKeys.length > 0) {
      model.push({ property: 'uuids', values: selectionRowKeys, op: 'zdy' });
    }
    const modalTitle = '将导出当前筛选条件下的所有数据，是否确认';
    DDAlert.open({
      info: modalTitle,
      infoType: 'question',
      modalType: 'confirm',
      okText: '确定',
      closeStatus: false,
      isFormContent: exportLarge,
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
          exportLarge: exportLarge, // 是否开启全量数据导出 异步 超过指定条数数据一次性全部导出
          cdDm: cdDm,
          key: export_key || unit_key + '_EXCEL',
          orderModel: orderModel,
          searchModel: model,
          zdydcms: exportLarge ? DDAlert.getContentFormData()?.zdydcms : null
        }
        thisObj.setState({ masker: true });
        downloadTemplate(data).then((response) => {
          thisObj.setState({ masker: false });
          const { code, body, desc } = response;
          DDAlert.close();
          if (code === '200') {
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
              const { blob, fileName } = body;
              myUtil.file.downloadExcel(blob, fileName);
            }
          } else {
            message.error(desc);
          }
        })
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
    const data = {
      key: import_key,
      url: importUrl,
      gridRef: refDDBaseGrid,
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
      setMasker,
    }
    cktsUtil.cktsCommonSum(param);
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
    cktsUtil.cktsCommonOrder(param);
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
    if (selectionRowKeys?.length <= 0) {
      message.info(intl.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    let param = (func.getBatchEditParam && func.getBatchEditParam({
      unitRef,
      gridRef: refDDBaseGrid,
      selectionRows,
      selectionRowKeys,
    })) || {
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
          itemsSelect.push(<Menu.Item key="2" onClick={customerExport} icon={<DownloadOutlined />}>导出</Menu.Item>);
        }
      } else {
        // 直接显示在工具栏上，不隐藏
        if (toolBarDefault?.download && toolBarDefault?.download?.constructor === Object) {
          itemsToobar.push(<Button type="link" key={toolBarDefault.download.key} onClick={() => { func[toolBarDefault.download.func](param); }}>{toolBarDefault.download.name}</Button>);
        } else {
          itemsToobar.push(<Button type="link" key="2" onClick={customerExport}>导出</Button>);
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
          itemsSelect.push(<Menu.Item key="2" onClick={customerExportTssb} icon={<DownloadOutlined />}>导出</Menu.Item>);
        }
      } else {
        // 直接显示在工具栏上，不隐藏
        if (toolBarDefault?.tssb_download && toolBarDefault?.tssb_download?.constructor === Object) {
          itemsToobar.push(<Button type="link" key={toolBarDefault.download.key} onClick={() => { func[toolBarDefault.download.func](param); }}>{toolBarDefault.download.name}</Button>);
        } else {
          itemsToobar.push(<Button type="link" key="2" onClick={customerExportTssb}>导出</Button>);
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
          itemsSelect.push(<Menu.Item key="2" onClick={cktsCommonExport} icon={<DownloadOutlined />}>导出</Menu.Item>);
        }
      } else {
        // 直接显示在工具栏上，不隐藏
        if (toolBarDefault?.ckts_download && toolBarDefault?.ckts_download?.constructor === Object) {
          itemsToobar.push(<Button type="link" key={toolBarDefault.download.key} onClick={() => { func[toolBarDefault.download.func](param); }}>{toolBarDefault.download.name}</Button>);
        } else {
          itemsToobar.push(<Button type="link" key="2" onClick={cktsCommonExport}>导出</Button>);
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
      // if (toolbarBtnNum > showBtnNum) {
      //   // 显示在 ...图标 下
      //   itemsSelect.push(<Menu.Item key="3" onClick={reload2} icon={<ReloadOutlined />}>刷新</Menu.Item>);
      // } else {
      //   // 直接显示在工具栏上，不隐藏
      //   itemsToobar.push(<Button type="link" key="3" onClick={reload2}>刷新</Button>);
      //   toolbarBtnNum++;
      // }
      itemsSelect.push(<Menu.Item key="3" onClick={reload2} icon={<ReloadOutlined />}>刷新</Menu.Item>);
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
      // if (toolbarBtnNum > showBtnNum) {
      //   // 显示在 ...图标 下
      //   itemsSelect.push(<Menu.Item key="4" onClick={handleFullscreen} icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} >{fullscreen ? '退出全屏' : '全屏'}</Menu.Item>);
      // } else {
      //   // 直接显示在工具栏上，不隐藏
      //   itemsToobar.push(<Button type="link" key="4" onClick={handleFullscreen} >{fullscreen ? '退出全屏' : '全屏'}</Button>);
      //   toolbarBtnNum++;
      // }
      itemsSelect.push(<Menu.Item key="4" onClick={handleFullscreen} icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} >{fullscreen ? '退出全屏' : '全屏'}</Menu.Item>);
    }
    let sysMenu: any;
    // 不存在任何一个下拉按钮
    // if (itemsSelect.length === 0) {
    //   if (toolBarDefault?.setting) {
    //     sysMenu = <Button style={{ marginLeft: "10px" }} onClick={gridSetting} icon={<SettingOutlined />} />;
    //   }
    //   // 存在一个以上下拉按钮
    // } else {
    //   if (toolBarDefault?.setting) {
    //     sysMenu = <Dropdown.Button style={{ marginLeft: "10px" }} className="grid_system_menu" onClick={gridSetting} overlay={overlayMenu}>
    //       <SettingOutlined />
    //     </Dropdown.Button>;
    //   } else {
    //     sysMenu = <Dropdown overlay={overlayMenu} >
    //       <Button icon={<EllipsisOutlined />} style={{ width: '27px', height: '27px' }} size="small" />
    //     </Dropdown>
    //   }
    // }

    const overlayMenu = <>
      <Menu>{itemsSelect}</Menu>
    </>;
    // sysMenu = <Dropdown overlay={overlayMenu} placement="bottomRight">
    //   <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
    //     <EllipsisOutlined />
    //   </a>
    // </Dropdown>

    if (toolBarDefault?.setting) {
      sysMenu = <Dropdown.Button style={{ marginLeft: "10px" }} className="grid_system_menu" onClick={gridSetting} overlay={overlayMenu}>
        <SettingOutlined />
      </Dropdown.Button>;
    } else {
      sysMenu = <Dropdown overlay={overlayMenu} >
        <Button icon={<EllipsisOutlined />} style={{ width: '27px', height: '27px' }} size="small" />
      </Dropdown>
    }

    // sysMenu = sysMenu = <Dropdown.Button style={{ marginLeft: "10px" }} className="grid_system_menu" onClick={gridSetting} overlay={overlayMenu}>
    //   <SettingOutlined />
    // </Dropdown.Button>;

    return <>
      {itemsToobar}
      {/* {sysMenu} */}
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
    (toolBarDefault?.order || toolBarDefault?.orderDrpx) && btnNumDefault++;
    // 原在线申报系统模块 小计
    toolBarDefault?.ckts_sum && btnNumDefault++;
    const btnNumAll: number = btnNumDefault + btnNumCustomer;
    return <div style={{ display: showToolBar !== false ? 'block' : 'none' }} >
      <DDToolbar affix={{ offsetTop: toobar_affix() }}>
        {/* {getGridHeaderInfo()} */}
        <div className='toobar-right'>
          <Space size={0}>
            {/* {getCostomerToobar()} */}
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
  const handleSave = () => {
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
            return baseEdit({ data: param, url: formSaveUrl });
          } else if (code === '901') {
            setMasker2(false);
            DDAlert.open({
              title: '系统提示',
              info: msg,
              // info: desc,
              // content: msg,
              modalType: 'confirm',
              infoType: 'info',
              okText: '继续',
              cancelText: '关闭',
              okCallbackFn: function (thisObj: any) {
                DDAlert.close();
                handleModalVisible(false);
                reload2();
                setMasker2(true);
                baseEdit({ data: param, url: formSaveUrl }).then((response) => {
                  handleSave2(response);
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
            handleSave2(response);
          } else {
            setMasker2(false);
          }
        }).catch((error) => {
          setMasker2(false);
          message.error(error.message);
        });
      } else {
        setMasker2(true);
        baseEdit({ data: param, url: formSaveUrl }).then((response) => {
          handleSave2(response);
        })
      }
    })
  }

  // 新建、编辑保存
  const handleSave2 = (response: any) => {
    const { code, desc } = response;
    if (code === '200') {
      message.success(desc);
      handleModalVisible(false);
      setMasker2(false);
      // refDDBaseGrid.current!.reload();
      reload2();
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
            y: sumFlag ? `${document.documentElement.clientHeight - 363}px` : `${document.documentElement.clientHeight - 325}px`
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
    initFilterItems();
    const formItemNew = formUtil.initFormItemsCodeTable([...(formItems || [])]);
    const tmp = formUtil.initFormItemsCodeTable([...(grid_filter_quick || [])]);
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
    const promiseArr = myUtil.code.getCodeTablePromise(param, unit_key);
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
    gridParams.initSearchModal[1].value='N'; // 默认值ysbspbz
    const initQueryParamNew: any = UnitUtil.grid.initAssembleSearchModel({
      unitKey: unit_key,
      filterItems: filterItems,
      gridFilterQuick: grid_filter_quick,
      initSearchModal,
      moduleType,
    });
    if (initQueryParamNew && queryParam && !isEqual(initQueryParamNew, queryParam)) {
      setQueryParam(initQueryParam);
    }
  }, [config]);

  // useEffect
  useEffect(() => {
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
    }

    // 隐藏列
    tmpColViews = tmpColViews.filter((col: any) => {
      return (!(col.hidden && col.hidden !== false));
    })
    setViewColumns(tmpColViews);
    tree();

  }, []);



  const tree = () => {
    let treebosy =  treeData2;
     queryXtBbh({}).then((response) => {
      const { body, code, msg } = response;
      if(code == '200'){
        const bbh = body.bbh;
        const ckspmc= body.ckspmc;
        treebosy[0]={
          title: '商品码版本',
          id: '100000',
          children: [
            {
               title: ckspmc,
               id: bbh,
               disabled: true,
            }
          ]
        };
        setTreeData(treebosy);
        setExpandedKeys(['1000','100000']);
      }
    });
  }

  const onSelect =(param :any, e: any) => {
    const cp = [...expandedKeys];
    const nodeKey = e?.node?.key;
    setMasker(true);
    if(nodeKey >= 1000){
      if(cp.indexOf(nodeKey) == -1){
        cp.push(nodeKey);
        setExpandedKeys(cp);
      }else{
        let newSet = new Set(cp);
        newSet.delete(nodeKey);
        let newArr = [...newSet];
        setExpandedKeys(newArr);
      }
      setMasker(false);
      // return;
    }
    if(param[0] == 'ysb' || param[0] == "1000"){
       gridParams.initSearchModal[1].value='Y';
       formCommonFilter.setFieldsValue({ckspDm:''});
    }else{
      gridParams.initSearchModal[1].value='N';
      formCommonFilter.setFieldsValue({ckspDm:param[0]});
    }
    setMasker(false);
    reload2();
  }

  const titleRender = (nodeData: any) => {
    return <Tooltip title={nodeData.title}>
      <div className="tree-title">{nodeData.title}</div>
    </Tooltip>
  }

  // 自定义树节点
  const getTreeNode = (data: any) => {
    if (data && data.length > 0) {
      return data.map((item: any) => {
        if (item.children) {
          return (
            <TreeNode key={item.id} {...item} title={
              <Tooltip title={item.title} placement="rightBottom"><div className="tree-title">{item.title}</div></Tooltip>
            }>
              {getTreeNode(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode key={item.id} {...item} title={
            <Tooltip title={item.title} placement="rightBottom"><div className="tree-title">{item.title}</div></Tooltip>
          }/>
        );
      });
    }
    return [];
  };

  // tree 展开/关闭节点事件
  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" style={{height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '90px'])}}>
        {myFilterItems && myFilterItems.length > 0 &&
          <ProCard className="dd-filter-wrap" >
            <DDFilter
              form={formCommonFilter}
              items={myFilterItems}
              onSubmit={reload2}
              onReset={handleReset}
            />
          </ProCard>
        }

        <ProCard split="vertical">
            <ProCard colSpan="380px" style={{height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '115px'])}}>
              {/* <Tree.DirectoryTree
                fieldNames={{
                  title: 'title',
                  key: 'id',
                  children: 'children'
                }}
                expandedKeys={expandedKeys}
                defaultSelectedKeys={['ysb']}
                showIcon={false}
                treeData={treeData}
                onSelect ={onSelect}
                blockNode
                className="mbTree"
                style={{height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '155px']), overflowY: 'auto', marginRight:'5px'}}
                titleRender={titleRender}
              /> */}
            <Tree
              expandedKeys={expandedKeys}
              // defaultSelectedKeys={['ysb']}
              defaultSelectedKeys={[]}
              onExpand={onExpand}
              showIcon={false}
              onSelect ={onSelect}
              blockNode
              className="mbTree"
              style={{height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '155px']), overflowY: 'auto', marginRight:'5px'}}
            >
              {getTreeNode(treeData)}
            </Tree>
            </ProCard>
            <ProCard className="dd-grid-wrap" colSpan="calc(100% - 380px)" style={{height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '115px'])}} >
              <div style={{overflowX: 'auto'}}>
                { setToobar()}
                {(myColumns && myColumns.length > 0) && <DDBaseGrid
                  getAssembleSearchModel={getAssembleSearchModel}
                  actionRef={refDDBaseGrid}
                  url={gridParamsApiQuery}
                  queryParam={queryParam}
                  columns={myColumns}
                  rowKey={rowKey}
                  showSerialNumber={showSerialNumber}
                  {...setGridBorder()}
                  {...setGridLayout()}
                  {...rowSelection}
                  {...unitRef}
                  pagination2={pagination2}
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
              </div>
          </ProCard>
        </ProCard>
      </ProCard>
    </Spin>
  );
};
export default DDBunit2;
