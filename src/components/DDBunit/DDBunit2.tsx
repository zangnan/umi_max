/**
 * DDBunit2 业务单元组件
 * 提供列表、表单、筛选、导入导出等功能的企业级表格组件
 */

import React, { useEffect, useState, useRef, useImperativeHandle, useCallback } from 'react';

// 类型定义与常量
import type { DDBunit2Props } from './DDBunit2.types';
import { DDBUNIT2_CONSTANTS, EXPORT_LIMITS, GRID_TYPE, EXPORT_TYPE, FORM_TYPE } from './DDBunit2.types';

// Ant Design 组件
import {
  Form,
  Card,
  Row,
  Col,
  Button,
  Modal,
  message,
  Tooltip,
  Space,
  Spin,
  Typography,
  Flex,
  Tag,
  Segmented,
  Dropdown,
  Descriptions,
  theme,
} from 'antd';

// 图标
import {
  PrinterOutlined,
  AppstoreOutlined,
  BarsOutlined,
  EllipsisOutlined,
  UploadOutlined,
  DownOutlined,
  FormOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  DownloadOutlined,
  RedoOutlined,
  DeleteOutlined,
  SettingOutlined,
} from '@ant-design/icons';

// 内部组件
import DDBaseGrid from '../DDBaseGrid';
import DDBaseForm from '../DDForm/DDBaseForm';
import DDDescriptions from '../DDForm/DDDescriptions';
import DDFilter from '../DDForm/DDFilter';
import DDFilterSimple from '../DDForm/DDFilterSimple';
import DDImport from '../DDImportNodeEnv';
import DDToolbar from '../DDToolbar';
import DDGridViewSetting from '../DDGridViewSetting';
import DDBunitFun from './DDBunitFun';
import DDStatisticsViewFun from './DDStatisticsViewFun';
import DDStatisticsView from './DDStatisticsView';
import SonTable from './DDBunit2SonTable';
import RelTable from './DDBunit2RelTable';
import DDBaseGridS2 from '../DDBaseGridS2';
import DDAdvancedFilter, { formatTreeData } from '../DDAdvancedFilter';
import DDExportNodeEnv from '../DDExportNodeEnv';
import ModalMediaList2 from '../DDMediaLibrary/modal_media_list_2';
import DDChartUtil from './DDChartUtil';
import DDChartConfigForm from './DDChartConfigForm';
import { MultipleContainers } from '../../pages/example/dnd/dnd5/MultipleContainers';

// 工具类
import tableUtil from '../DDBaseGrid/tableUtil';
import formUtil from '../DDForm/formUtil';
import UnitUtil from './unit_util';
import myUtil, { intl } from '../DDAssist/util';
import pdfUtil from '../DDAssist/util/pdfUtil';
import CONSTANTS from '../DDAssist/constants';
import DDIT_TOOL_CONSTANTS from './excelConfig.v2.constants';

// 第三方库
import { cloneDeep, isEqual } from 'lodash';
import { useKeyPress } from 'ahooks';
import ProCard from '@ant-design/pro-card';

// Umi 生态
import { useAccess } from 'umi';

// 常量定义
const CONFIG_KEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

// ==================== 组件定义 ====================
const DDBunit2: React.FC<DDBunit2Props> = ({ refDDBunit2, config, func = {}, authority = {} }) => {
  // ==================== 状态定义 ====================
  // 全屏状态
  const [fullscreen, changeFullscreen] = useState<boolean>(false);

  // ==================== 表单实例 ====================
  const [formBase] = Form.useForm();
  const [formCommonFilter] = Form.useForm();
  const [formQuickFilter] = Form.useForm();
  const [chartConfigForm] = Form.useForm();

  // ==================== Ref 引用 ====================
  const refGrid = useRef<any>(null);
  const refGridSetting = useRef<any>(null);
  const refUnit = func.refUnit;
  const refDDImport = useRef<any>(null);
  const refDDExportFront = useRef<any>(null);
  const refMultipleContainers = useRef<any>(null);
  const refMediaModal = useRef<any>(null);
  const refSonTableModal = useRef<any>(null);
  const refRelTableModal = useRef<any>(null);
  const refStatistic = useRef<any>(null);
  const refDDChartConfigModal = useRef<any>(null);

  // 权限
  const access = useAccess();

  // ==================== 配置解析 - 基础信息 ====================
  const exportType = config?.toolbar_default?.download_config?.type === 'back' ? 'back' : 'front';
  const moduleType = config?.module_type;
  const unitKey = config?.module_key;
  const pageId = config?.page_id;
  const gridViewSettingSort = config?.grid_setting_sort;

  // ==================== 配置解析 - 表单 ====================
  const formTitle = config?.form_title;
  const formName = `${pageId}_form`;
  const formLayoutType = config?.form_layout_type;
  const formWidth = config?.form_width || CONSTANTS.C_MODAL_WIDTH_X4;
  const getEditValueByGrid = config?.get_edit_value_by_grid;
  const form_submit_type = config?.form_submit_type;

  // ==================== 配置解析 - 表格 ====================
  const gridIsInitSearch = config?.gridIsInitSearch === undefined ? true : config?.gridIsInitSearch;
  const gridClickChecked = config?.grid_click_checked;
  const rowKey = config?.grid_row_key || 'uuid';
  const deleteKey = config?.delete_key || 'uuids';
  const showSerialNumber = config?.grid_show_serial_number;
  const handleColumnsDefault = config?.grid_handle_columns_default;
  let handleColumns = config?.handle_columns;
  const gridBorder = config?.grid_border;
  const gridScrollX = config?.grid_scroll_x;
  const gridScrollY = config?.grid_scroll_y;
  const gridStickyAffix = config?.grid_sticky_affix;
  const gridParams = config?.gridParams;
  const gridTypeSwitch = config?.grid_type_switch;
  const gridListCardType = config?.grid_list_card_type;
  const gridListCardField = config?.grid_list_card_field;
  const gridListCardRender = config?.grid_list_card_render;
  const gridListCardAction = config?.grid_list_card_action;
  const gridHandleWidth = config?.grid_handle_width;

  // 表格类型状态（list：宫格卡片形式，空：普通列表形式）
  const [gridType, setGridType] = useState(config?.grid_type);
  const gridPagination = config?.grid_pagination;
  const initSearchModal: any = gridParams?.initSearchModal ? [...gridParams?.initSearchModal] : [];

  // ==================== 配置解析 - 工具栏 ====================
  const gridTitle = config?.grid_title;
  const sumField = config?.grid_sum_field;
  const toolBarDefault = config?.toolbar_default;
  const toolbarOpen = config?.toolbar_open;
  const toolbarShowGridCheckedNum = config?.toolbar_show_grid_checked_num;

  // ==================== 状态 - 视图与数据 ====================
  const [viewColumns, setViewColumns] = useState<any>([]); // 视图设置数据
  const [columns, setColumns] = useState<any>([]);
  const [gridViewPlan, setGridViewPlan] = useState<any>([]); // 视图设置：方案
  const [filterItems, setFilterItems] = useState(
    formUtil.init({ items: config?.filter_items || [] }),
  );
  const gridFilterQuick = formUtil.init({ items: config?.grid_filter_quick || []});
  const gridViewSettingFilter = UnitUtil.filterAdvanced.init(config?.grid_setting_filter_advanced);
  const initQueryParam: any = UnitUtil.grid.initAssembleSearchModel({
    unitKey,
    filterItems,
    gridFilterQuick,
    initSearchModal,
  });
  const [queryParam, setQueryParam] = useState({ ...initQueryParam });

  // ==================== 状态 - 弹窗 ====================
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalVisible2, handleModalVisible2] = useState<boolean>(false); // 详情弹窗
  const [formType, setFormType] = useState<string>(''); // 表单类型：edit：编辑，add：新建
  const [formDisabled, setFormDisabled] = useState<any>(false);
  const [formItems, setFormItems] = useState(
    formUtil.init({ items: config?.form_items, func: func, refMediaModal, form: formBase }),
  );

  // ==================== 状态 - 高级筛选 ====================
  const [adfPlanModalVisible, setAdfPlanModalVisible] = useState<boolean>(false); // 弹窗
  const [adfPlan, setAdFPlan] = useState<any>([]); // 方案
  const [adfField, setAdFField] = useState<any>([]); // 字段

  // ==================== 状态 - 统计 ====================
  const [statisticsOptModalVisible, setStatisticsOptModalVisible] = useState<boolean>(false);
  const [statisticsResModalVisible, setStatisticsResModalVisible] = useState<boolean>(false);
  const [statisticsConfig, setStatisticsConfig] = useState<any>({});
  const [statisticsItems, setStatisticsItems] = useState<any>({});
  const [statisticsPlan, setStatisticsPlan] = useState<any>([]); // 交叉表筛选：方案
  const [statisticsPlanOnEdit, setStatisticsPlanOnEdit] = useState<any>(null);

  // ==================== 状态 - 选中行 ====================
  const [selectionRowKeys, setSelectionRowKeys] = useState<any>([]);
  const [selectionRows, setSelectionRows] = useState<any>([]);
  const [selectionType, setSelectionType] = useState(
    config?.grid_selection_type === undefined ? 'checkbox' : config?.grid_selection_type,
  );

  // ==================== 状态 - 其他 ====================
  const [masker, setMasker] = useState(false);
  const [masker2, setMasker2] = useState(false);
  const [gridTotal, setGridTotal] = useState(0);
  const [myFormSaveCheck] = useState(config?.form_save_check);
  const [customerToobarBtn, setCustomerToobarBtn] = useState<any>(config?.customer_toolbar || []);
  const [leafConfig] = useState<any>(config?.leaf_config);
  const [descriptionsConfig, setDescriptionsConfig] = useState<any>(null); // 表单详情

  // ==================== 布局配置 ====================
  const layoutType = config?.layout_type || 'default';
  const toobarAffix = UnitUtil.layout.getToobarAffix({ layoutType, toobarAffix: config?.toobar_affix });

  // ==================== API 地址 ====================
  const apiPrefix = myUtil.api.getApiRoot();
  const apiGridQuery = `${apiPrefix}${config?.api_grid_query || CONSTANTS.DEFAULT_API.GRID_QUERY}`;
  const apiFormDelete = `${apiPrefix}${config?.api_form_delete || CONSTANTS.DEFAULT_API.FORM_DELETE}`;
  const apiFormQuery = `${apiPrefix}${config?.api_form_query || CONSTANTS.DEFAULT_API.FORM_QUERY}`;
  const apiFormEdit = `${apiPrefix}${config?.api_form_edit || CONSTANTS.DEFAULT_API.FORM_EDIT}`;
  const apiFormCheck = `${apiPrefix}${config?.api_form_check || CONSTANTS.DEFAULT_API.FORM_CHECK}`;
  const apiExport = `${apiPrefix}${config?.api_excel_export || CONSTANTS.DEFAULT_API.EXCEL_EXPORT}`;
  const apiImport = `${apiPrefix}${config?.api_excel_import || CONSTANTS.DEFAULT_API.EXCEL_IMPORT}`;
  const apiTemplate = `${apiPrefix}${config?.api_excel_template || CONSTANTS.DEFAULT_API.EXCEL_TEMPLATE}`;

  // ==================== 权限配置 ====================
  const auth_toolbar_default: any = authority.toolbar_default || {};
  const auth_grid_handle_columns_defaul: any = authority.grid_handle_columns_defaul || {};

  const auth_toobar_default_delete_by_condition = auth_toolbar_default.delete_by_condition;
  const auth_toobar_default_add = auth_toolbar_default.add;
  const auth_toobar_default_edit = auth_toolbar_default.edit;
  const auth_toobar_default_delete = auth_toolbar_default.delete;
  const auth_toobar_default_setting = auth_toolbar_default.setting;
  const auth_toobar_default_full = auth_toolbar_default.full;
  const auth_toobar_default_download = auth_toolbar_default.download;
  const auth_toobar_default_download_pdf = auth_toolbar_default.download_pdf;
  const auth_toobar_default_upload = auth_toolbar_default.upload;
  const auth_toobar_default_reload = auth_toolbar_default.reload;
  const auth_toobar_default_statistics = auth_toolbar_default.statistics;
  const auth_toobar_default_advanced_filter = auth_toolbar_default.advanced_filter;

  const auth_grid_handle_columns_defaul_edit = auth_grid_handle_columns_defaul.edit;
  const auth_grid_handle_columns_defaul_delete = auth_grid_handle_columns_defaul.delete;
  const auth_grid_handle_columns_defaul_detail = auth_grid_handle_columns_defaul.detail;

  // 主题 token
  const { token } = theme.useToken();

  // ==================== 回调函数（使用 useCallback 优化） ====================

  // 获取其他 ref
  const getOtherRefs = useCallback(() => {
    const funcName = 'getOtherRef';
    if (func[funcName]) {
      return func[funcName]();
    }
    return [];
  }, [func]);

  // 获取列表选中行 key
  const getSelectionRowKeys = useCallback(() => selectionRowKeys, [selectionRowKeys]);

  // 获取列表选中行
  const getSelectionRows = useCallback(() => selectionRows, [selectionRows]);

  // 获取列表查询参数
  const getGridParams = useCallback(() => queryParam, [queryParam]);

  // 获取列表数据
  const getGridData = useCallback(() => refGrid.current?.getSource(), []);

  // 设置自定义按钮 disabled
  const setBtnDisabled = useCallback((key: any, disabled: any) => {
    const newBtnList = customerToobarBtn.map((item: any) =>
      item.key === key ? { ...item, disabled } : item
    );
    setCustomerToobarBtn(newBtnList);
  }, [customerToobarBtn]);

  // 自定义按钮方法设置
  const handleCustomerToobarBtn = useCallback(() => ({
    customerToobarBtn,
    setCustomerToobarBtn,
    setBtnDisabled,
  }), [customerToobarBtn, setBtnDisabled]);

  // 组装当前页面查询参数
  const getAssembleSearchModel = useCallback(() => {
    const searchModel1 = filterItems?.length > 0
      ? UnitUtil.grid.assembleSearchModel(formCommonFilter, filterItems) || []
      : [];
    const searchModel2 = UnitUtil.grid.assembleSearchModel(formQuickFilter, gridFilterQuick) || [];
    return [...searchModel1, ...searchModel2];
  }, [filterItems, gridFilterQuick]);

  // 刷新并清空选中行
  const reload = useCallback((adfTreeOnEdit?: any) => {
    refGrid.current?.setIsInitSearch(true);
    const searchModel12 = getAssembleSearchModel();
    const searchModel3 = refGrid.current?.getHeaderFilter() || [];
    const searchParam: any = {
      ...queryParam,
      searchModel: searchModel12,
      headerSearchModel: searchModel3,
    };

    if (adfTreeOnEdit && Array.isArray(adfTreeOnEdit)) {
      let dataTmp1 = formatTreeData(adfTreeOnEdit);
      let dataTmp2: any;
      if (ENV_TYPE === 'node') {
        dataTmp2 = dataTmp1;
      } else {
        dataTmp2 = myUtil.text.underscoreToCamelArrayKey(dataTmp1, [
          CONFIG_KEY.DICT_FIELD_NAME,
          CONFIG_KEY.DICT_FIELD_REL_TABLE,
          CONFIG_KEY.DICT_FIELD_FLAG,
          CONFIG_KEY.DICT_FIELD_ALIAS,
          CONFIG_KEY.DICT_FIELD_ID,
          CONFIG_KEY.DICT_FIELD_TYPE,
        ]);
      }
      searchParam.searchModel2 = dataTmp2;
    }

    setQueryParam(searchParam);
    setSelectionRowKeys([]);
    setSelectionRows([]);
  }, [queryParam, getAssembleSearchModel]);

  // ==================== 业务操作函数 ====================

  // Button: 删除
  const handleDelete = (record: any = {}, event: any) => {
    DDBunitFun.delete({
      deleteType: 'row',
      record,
      event,
      unitKey,
      rowKey,
      apiFormDelete,
      refUnit,
      refGrid,
      reload,
      func,
      getYwKey: tableUtil.getYwKey,
      deleteKey,
    });
  };

  // Button: 批量删除
  const handleUBatchDelete = () => {
    DDBunitFun.delete({
      deleteType: 'batch',
      selectionRowKeys,
      selectionRows,
      unitKey,
      rowKey,
      apiFormDelete,
      refUnit,
      refGrid,
      reload,
      func,
      pageId,
      getYwKey: tableUtil.getYwKey,
      deleteKey,
    });
  };

  // Button: 条件删除
  const handleDeleteByCondition = () => {
    DDBunitFun.delete({
      deleteType: 'condition',
      selectionRowKeys,
      selectionRows,
      unitKey,
      rowKey,
      apiFormDelete,
      refUnit,
      refGrid,
      reload,
      func,
      pageId,
      getYwKey: tableUtil.getYwKey,
      deleteKey,
      getGridParams,
    });
  }

  // Button: PDF导出
  const handleExportPDF = () => {
    pdfUtil.doExportPdf({
      selectionRowKeys,
      selectionRows,
      unitKey,
      rowKey,
      refGrid,
      reload,
      func,
      pageId,
      getGridParams,
      setMasker,
    });
  };

  // 高级筛选按钮下拉列表
  const advencedFilterDropdownItems: any = () => {
    let tmpItemArr: any = [];
    adfPlan?.forEach((item: any) => {
      tmpItemArr.push(
        { label: item?.adfName, key: item?.adfId },
      );
    })
    return {
      items: tmpItemArr,
      onClick: (param: any) => {
        // 添加方案标签
        let tmpaaa = cloneDeep(adfPlan) || [];
        let currentAdfPlan: any;
        for (let i=0; i<tmpaaa.length; i++) {
          if (tmpaaa[i].adfId === param.key) {
            tmpaaa[i].adfNameIsShow = true;
            tmpaaa[i].adfNameCurrentUsed = true;
            currentAdfPlan = tmpaaa[i];
          } else {
            tmpaaa[i].adfNameCurrentUsed = false;
          }
        }
        setAdFPlan(tmpaaa);
        // 根据方案查询
        reload(currentAdfPlan?.adfTree || []);
      }
    };
  };

  // 高级筛选 打开高级筛选弹窗
  const popupAdvancedFilter = (item?: any) => {
    let tmpaaa = cloneDeep(adfPlan) || [];
    for (let i=0; i<tmpaaa.length; i++) {
      if (item) { // 打开编辑
        if (tmpaaa[i].adfId === item.adfId) {
          tmpaaa[i].onEdit = true;
        } else {
          tmpaaa[i].onEdit = false;
        }
      } else { // 打开新建
        tmpaaa[i].onEdit = false;
      }
    }
    setAdFPlan([...tmpaaa]);
    setAdfPlanModalVisible(true);
  };

  // 高级筛选 方案关闭
  const handleAdfPlanTagClose = (e: any, tagetItem: any) => {
    e.preventDefault();
    adfPlan?.forEach((item: any) => {
      if (item.adfId === tagetItem.adfId) {
        item.adfNameIsShow = false;
      }
    });
    setAdFPlan([ ...adfPlan ]);
  }

  // 高级筛选 设置选择方案
  const handleAdfPlanTagClick = (tagetItem: any) => {
    let currentAdfPlan: any;
    adfPlan?.forEach((item: any) => {
      if (item.adfId === tagetItem.adfId) {
        item.adfNameCurrentUsed = true;
        currentAdfPlan = item;
      } else {
        item.adfNameCurrentUsed = false;
      }
    });
    setAdFPlan([ ...adfPlan ]);
    // 根据方案查询
    reload(currentAdfPlan?.adfTree || []);
  }

  // 高级筛选 用于显示的高级筛选方案
  const getAdvancedFilterPlanShow = () => {
    const tagReactNode: any = [];
    adfPlan?.forEach((item: any) => {
      let { adfName, adfNameIsShow, adfNameCurrentUsed } = item;
      if (adfNameIsShow) {
        let commonTagProp: any = {
          variant: 'filled',
          color: adfNameCurrentUsed ? myUtil.theme.getColor({type: 'primary'}) : 'default',
          style: { cursor: 'pointer', marginInlineEnd: '4px' },
          closeIcon: true,
          onClick: () => handleAdfPlanTagClick(item),
          onClose: (e: any) => handleAdfPlanTagClose(e, item),
        }
        tagReactNode.push(<span>
          <Tag { ...commonTagProp }>{adfName}</Tag>
          <FormOutlined onClick={() => popupAdvancedFilter(item)} style={{ cursor: 'pointer', color: myUtil.theme.getColor({type: 'primary'}) }}/>
        </span>);
      }
    });
    return tagReactNode.length > 0 ? <div className="dd_advanced_filter_wrap" style={{margin: '12px 0 0 0'}}>
      <Flex gap="0 12px" wrap>
        { tagReactNode }
      </Flex>
    </div> : <></>;
  }

  // 查询
  const onAdfSearch = ({ adfTreeOnEdit = [] }: any) => {
    reload(adfTreeOnEdit);
    setAdfPlanModalVisible(false);
  }

  // 保存方案后回调
  const onAdfChangePlan= ({ adfPlan = [] }: any) => {
    setAdFPlan(adfPlan)
  }

  // Button: 打开新建弹窗
  const popupUserAdd = () => {
    setFormType('add'); // 表单类型
    setFormDisabled(false);
    formBase.resetFields();
    // 是否有初始化
    if (func.initAddForm) {
      func.initAddForm({
        form: formBase,
        handleModalVisible,
        pageId,
        unitKey,
        refUnit,
        formItems,
        setFormItems,
        setMasker,
        config,
      });
    } else {
      handleModalVisible(true);
    }
  };

  // Button: exportPDF
  const exportPDF = () => {
    pdfUtil.exportPDF({
      deleteType: 'batch',
      selectionRowKeys,
      selectionRows,
      unitKey,
      rowKey,
      apiFormDelete,
      // refUnit,
      refUnit: refUnit,
      refGrid,
      reload,
      func,
      pageId,
      getYwKey: tableUtil.getYwKey,
      deleteKey,
    });
  };

  // 编辑\详情参数
  const paramPopupModal = (record: any, event?: any) => {
    return {
      record,
      event,
      setMasker,
      setFormType,
      unitKey,
      rowKey,
      getYwKey: tableUtil.getYwKey,
      apiFormQuery,
      formItems: formUtil.init({ items: config?.form_items, func: func }),
      form: formBase,
      func,
      pageId,
      refUnit,
      handleModalVisible,
      setFormItems,
      getEditValueByGrid,
      config,
    }
  }

  // Button: 打开编辑弹窗 行入口
  const popupUpdate = (record: any, event?: any) => {
    setFormDisabled(false);
    DDBunitFun.popupUpdate(paramPopupModal(record, event));
  };

  // Button: 打开详情弹窗 行入口
  const popupDetail = (record: any, event?: any) => {
    setFormDisabled(true);
    // DDBunitFun.popupUpdate(paramPopupModal(record, event));
    DDBunitFun.popupDetail({...paramPopupModal(record, event), handleModalVisible: handleModalVisible2, setDescriptionsConfig});
  };

  // Button: 打开编辑弹窗 工具栏入口
  const popupUpdateFromToolbar = () => {
    if (selectionRowKeys?.length === 0) {
      message.info(intl.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    if (selectionRowKeys?.length !== 1) {
      message.info(intl.formatMessage({ id: 'message_one_selected' }));
      return;
    }
    popupUpdate(selectionRows[0]);
  };

  // Button: 新建、编辑保存
  const handleSave = () => {
    DDBunitFun.handleSave({
      masker2,
      formItems,
      form: formBase,
      unitKey,
      formType,
      myFormSaveCheck,
      func,
      pageId,
      refUnit,
      handleModalVisible,
      setFormItems,
      setMasker2,
      // apiFormCheck,
      apiFormCheck: `${apiFormCheck}/${unitKey}_CHECK`,
      apiFormEdit,
      reload,
      form_submit_type,
      leafConfig,
    });
  };

  // Button: 导出
  const handleExport = () => {
    const gridPagination = refGrid.current?.getPagination();
    if (gridPagination.total > 50000) {
      message.info('本次导出的数据条数已超过上限（5万条），无法导出。');
      return;
    }
    let sheetName = '导出数据';
    let excelName = '导出数据';
    if (typeof gridTitle === 'string') {
      sheetName = gridTitle;
      excelName = gridTitle;
    }
    const param: any = {
      unitKey,
      gridParams: getGridParams(),
      gridData: getGridData(),
      setMasker,
      searchModel3: refGrid.current?.getHeaderFilter() || [],
      orderModel: refGrid.current?.getGridSort(),
      url: apiExport,
      apiGridQuery: apiGridQuery,
      refDDExportFront: refDDExportFront,
      refUnit: refUnit,
      sheetName: sheetName,
      excelName: `${excelName}.xlsx`,
      // excelName: `${excelName}`,
      selectionRows,
      selectionRowKeys,
      columns,
    };
    if (func.handleExport) {
      // 自定义导出
      func.handleExport(param);
    } else if (exportType === 'front') {
      // 前端导出
      DDBunitFun.handleExportFront(param);
    } else {
      DDBunitFun.handleExport(param);
    }
  };

  // 自定义导入
  const handleImport = () => {
    let data: any = {
      refUnit,
      url: apiImport,
      // urlTemplate: apiTemplate,
      refGrid,
      unitKey,
    };
    let importColsTmpForm: any =  cloneDeep(config.form_items || []);
    let importColsTmpGrid: any =  cloneDeep(config.grid_columns || []);
    let importCols: any = [];
    let tableKey: any = '';
    for (let i = 0; i < importColsTmpForm.length; i++) {
      if (importColsTmpForm[i].dict_field_name && importColsTmpForm[i].dict_name) {
        tableKey = importColsTmpForm[i].dict_name;
        let targetEle = importColsTmpGrid?.find((item: any) => { return item.dict_field_id === importColsTmpForm[i].dict_field_id });
        importCols.push({
          title: importColsTmpForm[i].label,
          dataIndex: importColsTmpForm[i].name,
          width: targetEle?.width,
        });
      }
    }
    data.columns = importCols;
    //  [
    //   { title: '用户ID', dataIndex: 'user_id', width: 100 },
    //   { title: '用户名', dataIndex: 'user_name', width: 100 },
    //   { title: '登录名', dataIndex: 'login_name', width: 200 },
    // ];
    data.tableKey = tableKey;

    refDDImport.current!.showModal(data);
  };

  // 列选择
  const rowSelection = tableUtil.initRowSelection({
    selectionType,
    selectedRowKeys: selectionRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any[]) => {
      setSelectionRowKeys(selectedRowKeys);
      setSelectionRows(selectedRows);
      if (func.rowSelection) {
        func.rowSelection({
          selectedRowKeys,
          selectedRows,
          refGrid,
          refUnit,
        });
      }
    },
    onSelect: (
      record: any,
      selected: any,
      selectedRows: any,
      nativeEvent: any,
    ) => {
      if (func.onSelect) {
        func.onSelect({
          record,
          selected,
          selectedRows,
          nativeEvent,
          refGrid,
          refUnit,
        });
      }
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      if (func.onSelectAll) {
        func.onSelectAll({
          selected,
          selectedRows,
          changeRows,
          refGrid,
          refUnit,
        });
      }
    },
  });

  const addQueryModel = (val: any, name: any) => {
    let arr: any = {};
    arr[name] = val;
    let flag = false;
    const searchModel1: any =
      UnitUtil.grid.assembleSearchModel(formCommonFilter || []) || [];
    for (let i = 0; i < searchModel1.length; i++) {
      if (searchModel1[i]?.property === name) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      searchModel1.push({ type: 1, property: name, value: '', op: 'al' });
    }
    // 获取普通筛选区域表单值
    for (let i = 0; i < searchModel1.length; i++) {
      if (searchModel1[i].property === name) {
        formCommonFilter.setFieldsValue(arr);
        break;
      }
    }
    reload();
  };

  // 配置列表过滤项
  const initFilterItems = () => {
    const initResult = formUtil.init({ items: config?.filter_items || [] });
    const items = initResult ? [...initResult] : [];
    // 码表渲染
    items.forEach((item: any) => {
      const { codeTable, treeTable, isSelectLeaf = false } = item;
      if (codeTable) {
        item.list = myUtil.code.getSelectOption(codeTable);
      }
      if (treeTable) {
        item.list = myUtil.treeCode.getTreeCodeData(treeTable);
        if (isSelectLeaf) {
          myUtil.array.traverseTreeLeaf(item.list);
        }
      }
    });
    setFilterItems(items);
  };

  // 通过按钮key判断资源权限
  const hasResourceAuthorityByBtn = (rCode: any, prefix?: any) => {
    // return true;
    // if (!unitKey || !rCode) { // 如果未设置unitKey或资源代码rCode，则不出来资源权限，即默认有权限
    //   return true;
    // }
    // 菜单中资源代码格式：unitKey___rCode
    let tmpResourceCode: any = prefix ? prefix+ '_' + rCode : rCode;
    // let tmpResourceCode: any = rCode;
    // return access?.hasResourceAuthority(tmpResourceCode);
    let aaaa = myUtil.authority.hasAuthorityResource({ resourceCode: tmpResourceCode });
    return aaaa;
  }

  // 初始化列表列、过滤项、表单项
  const initItem = (cols: any) => {
    if (!cols || cols?.length <= 0) {
      return;
    }
    // 列表列默认按钮资源权限判断
    if (!hasResourceAuthorityByBtn(CONSTANTS.DICT_MODULE_RESOURCE.GRID_COL_EDIT, unitKey)) {
      delete handleColumnsDefault?.edit;
    }
    if (!hasResourceAuthorityByBtn(CONSTANTS.DICT_MODULE_RESOURCE.GRID_COL_DEL, unitKey)) {
      delete handleColumnsDefault?.delete;
    }
    // 列表列自定义按钮资源权限判断
    handleColumns?.forEach((tmpGridBtn: any) => {
      if (tmpGridBtn?.key && !hasResourceAuthorityByBtn(tmpGridBtn?.key)) {
        tmpGridBtn.tmpDeedDelete = true;
      }
    });
    handleColumns = handleColumns?.filter((tmp: any) => !tmp.tmpDeedDelete);
    // 列表初始化
    const col2: any = tableUtil.init({
      columns: cols,
      otherRef: getOtherRefs(),
      refGrid,
      refUnit,
      handleColumnsDefault,
      handleColumns,
      func,
      popupUpdate,
      popupDetail,
      handleDelete,
      gridHandleWidth,
      // changeDDB2PageData,
      auth_grid_handle_columns_defaul_edit,
      auth_grid_handle_columns_defaul_delete,
      auth_grid_handle_columns_defaul_detail,
      rowKey,
      refSonTableModal,
      refRelTableModal,
      unitKey,
      themeToken: token,
      config,
    });
    setColumns([...col2]);
    // 如果有isUsed=true视图方案，则置为当前视图
    if (unitKey) {
      const viewConfig: any = myUtil.localStore.getItem('view_config') || {};
      const gridViewPlan: any = viewConfig[unitKey] || [];
      let targetEle = gridViewPlan?.find((item: any) => { return item.isUsed === true });
      if (targetEle) {
        // debugger;
        let tmpColumn = {
          all: targetEle?.config?.column || []
        }
        updateGridViewTmpNew({ column: tmpColumn });
      }
    }
    initFilterItems();
    const formItemNew = formUtil.initFormItemsCodeTable([
      ...(formUtil.init({ items: config?.form_items, func: func }) || []),
    ]);
    const tmp = formUtil.initFormItemsCodeTable([
      ...(gridFilterQuick || []),
    ]);
    // const tmp2 = formUtil.initFormItemsCodeTable([
    //   ...(formUtil.init({ items: config?.filter_items }) || []),
    // ]);
    // setFilterItems(tmp2);
    gridFilterQuick.splice(0, gridFilterQuick.length);
    tmp.forEach((item: any) => {
      gridFilterQuick.push(item);
    });
    setFormItems(formItemNew);
  };

  // after useEffect
  const afterUseEffectEnd = () => {
    if (func.useEffectEnd) {
      const useEffectParam: any = {
        refGrid,
        refUnit,
      };
      return func.useEffectEnd(useEffectParam);
    }
  };

  // 整合列表、表单、筛选中的码表参数
  const initCode = (cols: any, tmpConfig?: any) => {
    // 整合列表、表单、筛选中的码表参数
    // let filterItemTmp = config?.filter_items || [];
    // let filterItemTmp2 = [...formUtil.init({ items: config?.filter_items || [] })];
    const param = myUtil.code.getCodeTableParamFromJson({
      // items: [...cols || [], ...filterItems || [], ...formItems || [], ...gridFilterQuick || []],
      // items: [...cols || [],[...formUtil.init({ items: config.filter_items || [] })] || [], ...formItems || [], ...gridFilterQuick || []],
      items: [...cols || [],...formUtil.init({ items: config?.filter_items || [] }) || [], ...formUtil.init({ items: config?.form_items, func: func }) || [], ...gridFilterQuick || []],
    });
    // 如果有path标识，则拼接
    if (tmpConfig?.backend_dev_dict?.appModule?.appModulePath) {
      param.forEach((item: any) => {
        item.path = tmpConfig.backend_dev_dict.appModule.appModulePath;
      });
    }
    // 获取码表接口promise
    const promiseArr = myUtil.code.getCodeTablePromise(param);
    // 整合表单、筛选中的treeSelect参数
    const param1 = myUtil.treeCode.getTreeCodeTableParamFromJson({
      items: [...formUtil.init({ items: config?.filter_items || [] }) || [], ...formUtil.init({ items: config?.form_items, func: func }) || [],],
    });
    const promiseArr1 = myUtil.treeCode.getTreeCodeTablePromise(param1);
    promiseArr1.forEach((item: any) => {
      promiseArr.push(item);
    });;
    // 获取码表
    if (promiseArr?.length > 0) {
      Promise.all(promiseArr)
        .then(() => {})
        .catch(() => { message.error('获取码表失败'); })
        .finally(() => {
          initItem(cols); // 初始化列表列、过滤项、表单项
          afterUseEffectEnd(); // useEffectEnd
        });
    } else {
      initItem(cols); // 初始化列表列、过滤项、表单项
      afterUseEffectEnd(); // useEffectEnd
    }
  };

  // 废弃 20250910
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
      });
    }

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
  };

  // 视图设置后更新
  const updateGridViewTmpNew = (params: any) => {
    const { column, rules, filter } = params;
    // 设置列
    // debugger
    setViewColumns(cloneDeep([...column?.all]));
    const col2: any = tableUtil.init({
      columns: cloneDeep([...column?.all]),
      otherRef: getOtherRefs(),
      refGrid,
      refUnit,
      handleColumnsDefault,
      handleColumns,
      func,
      popupUpdate,
      popupDetail,
      handleDelete,
      gridHandleWidth,
      auth_grid_handle_columns_defaul_edit,
      auth_grid_handle_columns_defaul_delete,
      auth_grid_handle_columns_defaul_detail,
      rowKey,
      refSonTableModal,
      refRelTableModal,
      unitKey,
      themeToken: token,
      config,
    });
    setColumns([...col2]);
  };
  const updateGridView: any = useCallback(updateGridViewTmpNew, []);

  // 重置查询
  const handleReset = () => {
    formCommonFilter.resetFields(); // 页面筛选
    formQuickFilter.resetFields(); //快捷筛选
    setQueryParam(initQueryParam);
  };

  // 列表设置
  const gridSetting = () => {
    refGridSetting.current!.showModal();
  };

  // 全屏
  const handleFullscreen = () => {
    const divRoot: any = document.querySelector('body');
    if (fullscreen) {
      divRoot.classList.remove('ant-fullscreen');
    } else {
      divRoot.classList.add('ant-fullscreen');
    }
    changeFullscreen(!fullscreen);
  };

  // 快捷筛选
  const getGridFilterQuick = () => {
    if (gridFilterQuick && gridFilterQuick.length > 0) {
      return (
        <DDFilterSimple
          form={formQuickFilter}
          items={gridFilterQuick}
          onSubmit={reload}
          onReset={handleReset}
          initialValues={{}}
          name="dd_quick_filter"
        />
      );
    }
    return;
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
            <Space size={3}>
              <Typography.Text type="secondary">
                {' '}
                {item1.label || ''}
              </Typography.Text>
              <Typography.Link>
                {myUtil.text.formatNum(sumItem, item1.format || '0,0.00')}
              </Typography.Link>
              <Typography.Text type="secondary">
                {item1.unit || ''}
              </Typography.Text>
            </Space>
          </span>,
        );
      });
    }
    let tit: any;
    if (typeof gridTitle === 'string') {
      tit = gridTitle;
    } else if (typeof gridTitle === 'object') {
      if (gridTitle.type === 'function') {
        if (gridTitle.func && func[gridTitle.func]) {
          tit = func[gridTitle.func]({
            refGrid,
            refUnit,
            unitKey,
          });
        }
      }
    }
    return (
      <div className="grid_header_info_wrap">
        <Space size="middle">
          <span>
            <Space size="middle">
            {tit && <Typography.Text>{tit || ''}</Typography.Text>}
              {selectionType !== 'radio' && toolbarShowGridCheckedNum === true && (
                <div>
                  <Typography.Text type="secondary">
                    共
                    <span className="tnum">
                      {selectionType === false ? (
                        <></>
                      ) : (
                        <>
                          <Typography.Link>{selectionRows.length}</Typography.Link>/
                        </>
                      )}
                      {gridTotal}
                    </span>
                    项
                  </Typography.Text>
                </div>
              )}
              {tttt}
            </Space>
          </span>
          {getGridFilterQuick()}
        </Space>
      </div>
    );
  };

  // costomerToobar2
  const getCustomerToobar = () => {
    if (!customerToobarBtn || customerToobarBtn.length <= 0) {
      return <></>;
    }
    const costomerToobarArr: any = [];
    customerToobarBtn.forEach((item: any, index: number) => {
      const param: any = {
        selectionRowKeys,
        selectionRows,
        refGrid,
        refUnit,
        formQuickFilter: formQuickFilter,
        unitKey,
        access,
      };

      const funcName = 'getOtherRef';
      let otherRef: any;
      if (func[funcName]) {
        otherRef = func[funcName]();
        param.otherRef = otherRef;
      }
      if (item.type === 'dropdown') {
        const dropdownMenu: any = [];
        item.list.forEach((item2: any) => {
          // 工具类自定义按钮资源权限判断
          let hasResourceAuthority1 = item2?.key && !hasResourceAuthorityByBtn(item2?.key);
          if (!hasResourceAuthority1) {
            dropdownMenu.push({
              label: (
                <a
                  onClick={() => {
                    func[item2.func](param);
                  }}
                >
                  {item2.name}
                </a>
              ),
              key: item2.name,
            });
          }
        });
        dropdownMenu?.length > 0 && costomerToobarArr.push(
          <Dropdown key={index.toString()} menu={{ items: dropdownMenu }}>
            <Button type="link" size="small">
              {item.name}
              <DownOutlined />
            </Button>
          </Dropdown>,
        );
      } else {
        // 工具类自定义按钮资源权限判断
        let hasResourceAuthority2 = item?.key && !hasResourceAuthorityByBtn(item?.key);
        if (!hasResourceAuthority2) {
          costomerToobarArr.push(
            <Button
              key={index.toString()}
              size="small"
              type="link"
              disabled={item.disabled}
              onClick={() => {
                if (item?.func && func[item.func]) {
                  func[item.func](param);
                } else {
                  message.info('function undefined');
                }
              }}
            >
              {item.name}
            </Button>,
          );
        }
      }
    });

    return costomerToobarArr;
  };

  // 高级筛选按钮下拉列表
  const gridViewDropdownItems: any = () => {
    let tmpItemArr: any = [];
    gridViewPlan?.forEach((item: any, index: any) => {
      tmpItemArr.push(
        { label: item?.famc, key: item?.faid,
          disabled: item.isUsed,
          extra: <Button type="link" size="small" color="danger" icon={<DeleteOutlined />} onClick={(e) => {
            const viewId = (pageId || unitKey) as string;
            const viewConfig: any = myUtil.localStore.getItem('view_config') || {};
            let gridData = cloneDeep(gridViewPlan) || [];
            gridData.splice(index, 1);
            viewConfig[viewId] = gridData;
            myUtil.localStore.setItem('view_config', viewConfig);
            setGridViewPlan(gridData);
            e.stopPropagation()
        }}></Button>
      });
    })
    if (tmpItemArr.length > 0) {
      tmpItemArr.push({ type: 'divider' }),
      tmpItemArr.push( { label: '重置', key: 'resetGridView' } );
    }
    return {
      items: tmpItemArr,
      onClick: (param: any) => {
        let tmpFaid = param.key;
        if (tmpFaid === 'resetGridView') {
          const col2: any = tableUtil.init({
            columns: cloneDeep(config?.grid_columns || []),
            otherRef: getOtherRefs(),
            refGrid,
            refUnit,
            handleColumnsDefault,
            handleColumns,
            func,
            popupUpdate,
            popupDetail,
            handleDelete,
            gridHandleWidth,
            auth_grid_handle_columns_defaul_edit,
            auth_grid_handle_columns_defaul_delete,
            auth_grid_handle_columns_defaul_detail,
            rowKey,
            refSonTableModal,
            refRelTableModal,
            unitKey,
            themeToken: token,
            config,
          });
          setColumns([...col2]);
          // 设置当前使用方案标识
          const viewId = (pageId || unitKey) as string;
          UnitUtil.gridViewSetting.setGridViewUsed(viewId, null, setGridViewPlan);
        } else {
          let tmpGridViewPlan = cloneDeep(gridViewPlan) || [];
          let targetEle = tmpGridViewPlan?.find((item: any) => { return item.faid === tmpFaid });
          let tmpColumn = {
            all: targetEle?.config?.column || []
          }
          updateGridViewTmpNew({ column: tmpColumn });
          // 设置当前使用方案标识
          const viewId = (pageId || unitKey) as string;
          UnitUtil.gridViewSetting.setGridViewUsed(viewId, targetEle, setGridViewPlan);
        }
      }
    };
  };

  // 列表右侧系统级工具 刷新 全屏 上传 下载
  const gridSystemMenu = () => {
    const itemsSelect = []; // 显示在...更多图标下的按钮
    if (toolBarDefault?.download && (auth_toobar_default_download || auth_toobar_default_download === undefined)) {
      if (hasResourceAuthorityByBtn(CONSTANTS.DICT_MODULE_RESOURCE.TOOLBAR_DEFAULT_DOWNLOAD, unitKey)) {
        itemsSelect.push({
          label: <a onClick={handleExport}>导出</a>,
          key: '1',
          icon: <DownloadOutlined />,
        });
      }
    }
    if (toolBarDefault?.upload && (auth_toobar_default_upload || auth_toobar_default_upload === undefined)) {
      if (hasResourceAuthorityByBtn(CONSTANTS.DICT_MODULE_RESOURCE.TOOLBAR_DEFAULT_UPLOAD, unitKey)) {
        itemsSelect.push({
          label: <a onClick={handleImport}>导入</a>,
          key: '2',
          icon: <UploadOutlined />,
        });
      }
    }
    if (toolBarDefault?.reload && (auth_toobar_default_reload || auth_toobar_default_reload === undefined)) {
      itemsSelect.push({
        label: <a onClick={reload}>刷新</a>,
        key: '3',
        icon: <RedoOutlined />,
      });
    }
    if (toolBarDefault?.full && (auth_toobar_default_full || auth_toobar_default_full === undefined)) {
      itemsSelect.push({
        label: (
          <a onClick={handleFullscreen}>{fullscreen ? '退出全屏' : '全屏'}</a>
        ),
        key: '4',
        icon: fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />,
      });
    }
    itemsSelect.push({
      label: <a onClick={handleWebPrint}>打印</a>,
      key: '5',
      icon: <PrinterOutlined />,
    });

    // 系统菜单组件
    const sysMenu = (
      <Space.Compact block>
        <Button
          type="default"
          onClick={() => {
            refDDChartConfigModal?.current?.showModal({ config, chartConfigForm, refGrid });
          }}
        >
          图表统计
        </Button>
        {toolBarDefault?.statistics &&
          (auth_toobar_default_statistics || auth_toobar_default_statistics === undefined) &&
          DDStatisticsViewFun.getToolbarDropDown({
            unitKey,
            statisticsPlan,
            setStatisticsPlan,
            setStatisticsPlanOnEdit,
            setStatisticsOptModalVisible,
            setStatisticsItems,
            config,
          })}
        {toolBarDefault?.advanced_filter &&
          (auth_toobar_default_advanced_filter || auth_toobar_default_advanced_filter === undefined) && (
            <>
              <Button onClick={popupAdvancedFilter}>筛选</Button>
              {adfPlan?.length > 0 && (

                <Dropdown placement="bottomRight" menu={advencedFilterDropdownItems()}>
                  <Tooltip title="筛选方案"><Button icon={<DownOutlined />} /></Tooltip>
                </Dropdown>
              )}
            </>
          )}
        {toolBarDefault?.setting && (auth_toobar_default_setting || auth_toobar_default_setting === undefined) && (
          <>
            <Button icon={<SettingOutlined />} onClick={gridSetting} />
            {gridViewPlan?.length > 0 && (

              <Dropdown placement="bottomRight" menu={gridViewDropdownItems()}>
                <Tooltip title="视图方案"><Button icon={<DownOutlined />} /></Tooltip>
              </Dropdown>

            )}
          </>
        )}
        {itemsSelect?.length > 0 &&
          (auth_toobar_default_advanced_filter || auth_toobar_default_advanced_filter === undefined) && (
            <Dropdown placement="bottomRight" menu={{ items: itemsSelect }}>
              <Button icon={<EllipsisOutlined />} />
            </Dropdown>
          )}
      </Space.Compact>
    );

    return sysMenu;
  };

  const handleWebPrint = () => {
    const gridPagination = refGrid.current?.getPagination();
    if (gridPagination.total > 5000) {
      message.info('本次打印的数据条数已超过上限（5千条），无法打印。');
      return;
    }
    let sheetName = typeof gridTitle === 'string' ? gridTitle : '打印数据';
    const param: any = {
      unitKey,
      gridParams: getGridParams(),
      gridData: getGridData(),
      setMasker,
      searchModel3: refGrid.current?.getHeaderFilter() || [],
      orderModel: refGrid.current?.getGridSort(),
      url: apiExport,
      apiGridQuery: apiGridQuery,
      refDDExportFront: refDDExportFront,
      refUnit: refUnit,
      sheetName: sheetName,
      selectionRows,
      selectionRowKeys,
      columns,
    };
    // 前后打印标识
    const printType: any = 'front';
    if (func.handlePrint) {
      // 自定义打印
      func.handlePrint(param);
    } else if (printType === 'front') {
      // 前端打印
      DDBunitFun.handlePrintFront(param);
    } else {
      // DDBunitFun.handleExport(param);
    }
  }

  // 工具栏
  const setToobar = () => {
    return (
      <div style={{ display: toolbarOpen !== false ? 'block' : 'none' }}>
        <DDToolbar affix={{ offsetTop: toobarAffix }} fullscreen={fullscreen}>
          <Row>
            <Col flex="none">{getGridHeaderInfo()}</Col>
            <Col flex="auto">
              <div className="toobar-right">
                <Space>
                  {getCustomerToobar()}
                  {toolBarDefault?.delete_by_condition &&
                    (auth_toobar_default_delete_by_condition || auth_toobar_default_delete_by_condition === undefined) &&
                    hasResourceAuthorityByBtn(CONSTANTS.DICT_MODULE_RESOURCE.TOOLBAR_DEFAULT_DELETE_BY_CONDITION, unitKey) && (
                      <Button size="small" type="link" onClick={handleDeleteByCondition}>
                        筛选删除
                      </Button>
                    )}
                  {toolBarDefault?.add &&
                    (auth_toobar_default_add || auth_toobar_default_add === undefined) &&
                    hasResourceAuthorityByBtn(CONSTANTS.DICT_MODULE_RESOURCE.TOOLBAR_DEFAULT_ADD, unitKey) && (
                      <Button size="small" type="link" onClick={popupUserAdd}>
                        新建
                      </Button>
                    )}
                  {toolBarDefault?.edit &&
                    (auth_toobar_default_edit || auth_toobar_default_edit === undefined) &&
                    hasResourceAuthorityByBtn(CONSTANTS.DICT_MODULE_RESOURCE.TOOLBAR_DEFAULT_EDIT, unitKey) && (
                      <Button size="small" type="link" onClick={popupUpdateFromToolbar}>
                        编辑
                      </Button>
                    )}
                  {toolBarDefault?.delete &&
                    (auth_toobar_default_delete || auth_toobar_default_delete === undefined) &&
                    hasResourceAuthorityByBtn(CONSTANTS.DICT_MODULE_RESOURCE.TOOLBAR_DEFAULT_DELETE, unitKey) && (
                      <Button size="small" type="link" onClick={handleUBatchDelete}>
                        删除
                      </Button>
                    )}
                  {toolBarDefault?.download_pdf && (
                    <Button size="small" type="link" onClick={handleExportPDF}>
                      PDF导出
                    </Button>
                  )}
                  {gridSystemMenu()}
                </Space>
              </div>
            </Col>
            {gridTypeSwitch && (
              <Col flex="none">
                <Segmented
                  defaultValue={config?.grid_type}
                  style={{ marginLeft: '12px' }}
                  options={[
                    { value: 'grid', icon: <BarsOutlined /> },
                    { value: 'list', icon: <AppstoreOutlined /> },
                  ]}
                  onChange={(value) => {
                    if (value === 'grid') {
                      setGridType('');
                      refGrid.current?.setMyGridType('');
                    } else if (value === 'list') {
                      setGridType('list');
                      refGrid.current?.setMyGridType('list');
                    }
                  }}
                />
              </Col>
            )}
          </Row>
        </DDToolbar>
      </div>
    );
  };

  // 列表数据加载后执行
  const afterReloadGridData = (param: any) => {
    const { gridTotalNum } = param;
    param.refUnit = refUnit;
    param.refGrid = refGrid;
    param.formQuickFilter = formQuickFilter;
    setGridTotal(gridTotalNum);
    if (func.afterReload) {
      func.afterReload(param);
    }
  };

  // 设置列表布局
  const setGridLayout = () => {
    return UnitUtil.layout.getGridLayout({
      filterItems,
      layoutType,
      columns,
      gridScrollX,
      gridScrollY,
      gridStickyAffix,
    });
  };

  // 设置列表边框
  const setGridBorder = () => {
    if (gridBorder !== undefined) {
      return {
        bordered: gridBorder,
      };
    }
    return;
  };

  // useEffect
  useEffect(() => {
    const initQueryParamNew: any = UnitUtil.grid.initAssembleSearchModel({
      unitKey: unitKey,
      filterItems,
      gridFilterQuick: gridFilterQuick,
      initSearchModal,
    });
    if (
      initQueryParamNew &&
      queryParam &&
      !isEqual(initQueryParamNew, queryParam)
      && unitKey
    ) {
      setQueryParam(initQueryParam);
    }
  }, [config]);

  // useEffect
  useEffect(() => {
    // 1 从配置文件中获取列表列配置
    let tmpCol: any; // 列表渲染数据
    let tmpColViews: any = []; // 视图设置数据
    // 通过配置文件获取默认列表列
    tmpColViews = cloneDeep(config?.grid_columns);
    tmpCol = cloneDeep(config?.grid_columns || []);
    initCode(tmpCol, cloneDeep(config));

    // 隐藏列
    tmpColViews = tmpColViews?.filter((col: any) => {
      return !(col.hidden && col.hidden !== false);
    });
    setViewColumns(tmpColViews);
    setSelectionType(config?.grid_selection_type === undefined ? 'checkbox' : config?.grid_selection_type)
    setCustomerToobarBtn(config?.customer_toolbar || []);

    // 维度表统计
    DDStatisticsViewFun.statisticsInit({config, unitKey, setStatisticsPlan});

    if (config?.toolbar_default?.advanced_filter) {
      UnitUtil.adf.getAdfPlanParam({ setAdFPlan, unitKey });
      UnitUtil.adf.getAdfFieldParam({ config, setAdFField })
    }
    setGridType(config.grid_type);

    // 视图设置方案
    if (config?.toolbar_default?.setting) {
      UnitUtil.gridViewSetting.getGridViewPlan({ setGridViewPlan, unitKey });
    }
  // }, []);
  }, [config]); // 20231226 edit 适配即使编辑config

  let imperativeHandle: any = {
    setMasker,
    getSelectionRowKeys,
    getSelectionRows,
    getGridParams,
    getOtherRefs,
    handleCustomerToobarBtn,
    getGridData,
    setSelectionRowKeys,
    setSelectionRows,
    reload,
    addQueryModel,
    handleReset,
    handleModalVisible,
    setFormType,
    form: formBase,
    setFormItems,
    formItems,
    refGrid,
  };

  // useImperativeHandle
  useImperativeHandle(refUnit, () => {
    return imperativeHandle;
  });

  // useImperativeHandle
  useImperativeHandle(refDDBunit2, () => {
    return imperativeHandle;
  });

  // 维度表 显示统计结果
  const handleStatistics = () => {
    DDStatisticsViewFun.handleStatistics({
      refMultipleContainers,
      setStatisticsResModalVisible,
      setStatisticsConfig,
      setStatisticsItems,
      planOnEdit: statisticsPlanOnEdit,
      config,
      setStatisticsPlan,
      func,
    });
  }

  // 维度表 导出
  const exportStaticticExcel = () => {
    refStatistic.current?.exportStaticticExcel();
  }

  // 维度表 刷新
  const refreshStaticticData = () => {
    refStatistic.current?.refreshStaticticData();
  }

  useKeyPress(['ctrl.alt.a', 'ctrl.alt.q', 'ctrl.alt.d', 'ctrl.alt.e', 'ctrl.alt.r', 'ctrl.alt.c', 'ctrl.alt.s'], (e, key) => {
    const keyCallbackMap: any = {
      'ctrl.alt.a': () => popupUserAdd(), // 打开新建弹窗
      'ctrl.alt.q': () => reload(), // 查询
      'ctrl.alt.d': () => handleUBatchDelete(), // 删除
      'ctrl.alt.e': () => popupUpdateFromToolbar(), // 打开编辑弹窗
      'ctrl.alt.r': () => handleReset(), // 重置查询条件
      'ctrl.alt.c': () => handleModalVisible(false), // 关闭表单
      'ctrl.alt.s': () => handleSave(), // 保存表单
    };
    if (CONSTANTS.SHORTCUT_KEYS_OPEN) {
      keyCallbackMap[key]();
    }
  });

  return (
    <Spin description="Loading..." spinning={masker} delay={100}>
      {filterItems && filterItems.length > 0 && (
        <Card variant="borderless" className="dd-filter-wrap">
          <DDFilter
            form={formCommonFilter}
            items={filterItems}
            onSubmit={reload}
            onReset={handleReset}
            layoutType={layoutType}
          />
          {adfPlan && adfPlan.length > 0 && (
            getAdvancedFilterPlanShow()
          )}
        </Card>
      )}
      {toolbarOpen !== false && (
        <div className="dd-toolbar-wrap"> {setToobar()} </div>
      )}
      {columns && columns.length > 0 && (
        <Card variant="borderless" className="dd-grid-wrap">
          <DDBaseGrid
            getAssembleSearchModel={getAssembleSearchModel}
            actionRef={refGrid}
            url={apiGridQuery}
            queryParam={queryParam}
            columns={columns}
            rowKey={rowKey}
            showSerialNumber={showSerialNumber}
            isInitSearch={gridIsInitSearch}
            pagination={gridPagination}
            {...setGridBorder()}
            {...setGridLayout()}
            {...rowSelection}
            {...refUnit}
            onRow={tableUtil.initOnRow({
              refGrid,
              refUnit,
              formQuickFilter,
              gridClickChecked,
              selectionRows,
              selectionRowKeys,
              setSelectionRowKeys,
              setSelectionRows,
              rowKey,
              func,
            })}
            func={func}
            afterReloadGridData={afterReloadGridData}
            gridType={gridType} // list 或 空
            gridListCardField={gridListCardField}
            gridListCardRender={gridListCardRender}
            gridListCardAction={gridListCardAction}
            gridListCardType={gridListCardType}
            {...gridParams}
          />
        </Card>
      )}
      {formItems && formItems.length > 0 && (
        <Modal
          title={`${formTitle || ''}${formType === 'add' ? '采集' : '编辑'}`}
          open={createModalVisible}
          wrapClassName="standard-modal-1"
          width={formWidth}
          okText="保存"
          okButtonProps={{
            className: 'dd_btn_focus',
            disabled: formDisabled,
            style: {display: formDisabled ? 'none' : 'inline-block'}
          }}
          cancelText="关闭"
          onCancel={() => handleModalVisible(false)}
          onOk={handleSave}
          className={`${masker2 ? 'dd_modal_show_masker' : ''}`}
          mask={{ closable: false }}
          destroyOnHidden={true}
          forceRender
        >
          <Spin
            description="Loading..."
            spinning={masker2}
            delay={100}
            key="DDBunit2DDBaseForm"
          >
            <DDBaseForm
              form={formBase}
              items={formItems}
              initialValues={{}}
              name={formName}
              layoutType={formLayoutType}
              disabled={formDisabled}
              otherParam={{
                otherRef: getOtherRefs(),
                unitKey,
              }}
            />
          </Spin>
        </Modal>
      )}

      {formItems && formItems.length > 0 && (
        <Modal
          title={`${formTitle || ''}详情`}
          open={createModalVisible2}
          wrapClassName="standard-modal-1"
          width={formWidth}
          cancelText="关闭"
          footer={null}
          onCancel={() => handleModalVisible2(false)}
          className={`${masker2 ? 'dd_modal_show_masker' : ''}`}
          mask={{ closable: false }}
          destroyOnHidden={true}
        >
          <Spin description="Loading..." spinning={masker2} delay={100} key="DDBunit2DDBaseForm" >
            <DDDescriptions config={descriptionsConfig}/>
          </Spin>
        </Modal>
      )}

      {config?.toolbar_default?.setting && (
        <DDGridViewSetting
          onRef={refGridSetting}
          updateGridView={updateGridView}
          settingDataColumn={viewColumns}
          settingDataFilter={gridViewSettingFilter}
          settingDataSort={gridViewSettingSort}
          pageId={pageId || unitKey}
          setGridViewPlan={setGridViewPlan}
        />
      )}
      {config?.toolbar_default?.upload && <DDImport onRef={refDDImport} showRules={false} />}
      <DDExportNodeEnv onRef={refDDExportFront} settingDataColumn={columns} />
      {config?.toolbar_default?.advanced_filter && <Modal
        title="高级筛选"
        open={adfPlanModalVisible}
        wrapClassName="standard-modal-1"
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        onCancel={() => setAdfPlanModalVisible(false)}
        mask={{ closable: false }}
        footer={null}
        destroyOnHidden={true}
      >
        <DDAdvancedFilter pAdfField={adfField} pAdfPlan={adfPlan} onSearch={onAdfSearch} unitKey={unitKey} onChangePlan={onAdfChangePlan}/>
      </Modal>}
      {config?.toolbar_default?.statistics && <Modal
        title={<Typography.Title level={4} editable={{ onChange: (changedText: any) => {
                DDStatisticsViewFun.changePlanTitle({changedText,statisticsPlanOnEdit, setStatisticsPlanOnEdit })
              }}}>
          {statisticsPlanOnEdit?.name || DDStatisticsViewFun.defaultStatisticsName}
        </Typography.Title>}
        open={statisticsOptModalVisible}
        wrapClassName="standard-modal-1"
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        okText="统计查询"
        cancelText="关闭"
        onCancel={() => setStatisticsOptModalVisible(false)}
        onOk={handleStatistics}
        mask={{ closable: false }}
        destroyOnHidden={true}
      >
        <MultipleContainers handle actionRef={refMultipleContainers} items={statisticsItems} />
      </Modal>}
      {config?.toolbar_default?.statistics && <Modal
        title="统计"
        open={statisticsResModalVisible}
        wrapClassName="standard-modal-1"
        width={CONSTANTS.C_MODAL_WIDTH_MAX}
        zIndex={1001}
        onCancel={() => setStatisticsResModalVisible(false)}
        footer={<>
          <Button type="primary" onClick={() => exportStaticticExcel()} >导出</Button>
          <Button type="default" onClick={() => refreshStaticticData()} >刷新</Button>
          <Button onClick={() => setStatisticsResModalVisible(false)} type="default">关闭</Button>
        </>}
        mask={{ closable: false }}
        destroyOnHidden={true}
      >
        <DDStatisticsView config={statisticsConfig} onRef={refStatistic} func={func} searchModel={queryParam}/>
      </Modal>}
      <ModalMediaList2 onRef={refMediaModal} />
      <SonTable onRef={refSonTableModal} />
      <RelTable onRef={refRelTableModal} />
      <DDChartConfigForm onRef={refDDChartConfigModal} config={config} refGrid={refGrid} />
    </Spin>
  );
};
export default DDBunit2;
