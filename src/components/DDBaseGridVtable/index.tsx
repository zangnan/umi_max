/**
 * DDBaseGridVTable - 基于 VTable 的轻量级明细表组件
 *
 * 功能特性：
 * - 支持直接传入数据和 API 模式两种数据获取方式
 * - 支持冻结列、排序、筛选、统计行等常用功能
 * - 支持工具栏、操作列、设置弹窗、表单弹窗等交互功能
 * - 支持列配置动态调整（显示/隐藏、顺序拖拽）
 *
 * @author DD组件库
 * @version 1.0.0
 */

import React, { useMemo, useRef, useEffect, useCallback, useState } from 'react';
import type {
  DDVTableProps,
  DDVTableToolbarConfig,
  DDVTableColumnRender,
  DDVTableColumn,
  DDVTableRowSeriesNumber,
  DDVTableHandleColumnsConfig,
  DDVTableSelectionType,
  DDVTableSizeType,
  DDVTableSettingConfig,
  DDVTableGridConfig,
  DDVTableConfig,
  DDVTableData,
  DDVTableFilterRule,
  DDVTableFormItem,
  DDVTableFormConfig,
  DDVTableApiSearchItem,
  DDVTableApiOrderItem,
  DDVTableApiQueryParams,
  DDVTableApiResponse,
} from './types';
import { request } from 'umi';
import { ListTable } from '@visactor/react-vtable';
import * as VTable from '@visactor/vtable';
import { downloadExcel, exportVTableToExcel } from '@visactor/vtable-export';
import { Button, Space, message, Dropdown, Modal, Radio, Slider, Switch, Form, Spin, DatePicker, InputNumber, Card } from 'antd';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HolderOutlined } from '@ant-design/icons';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  FullscreenOutlined,
  DownloadOutlined,
  UploadOutlined,
  ReloadOutlined,
  FullscreenExitOutlined,
  EllipsisOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { createGroup, createText, createImage } from '@visactor/vtable/es/vrender';
import dayjs from 'dayjs';
import DDBaseForm from '../DDForm/DDBaseForm';
import DDDescriptions from '../DDForm/DDDescriptions';
import DDFilter from '../DDForm/DDFilter';
import formUtil from '../DDForm/formUtil';
import myUtil from '../DDAssist/util';

// 重新导出 types.ts 中的类型，供外部使用
export * from './types';

// ==================== 类型定义（已移至 types.ts） ====================
// 工具栏配置、列配置、表格配置、API类型等请参考 ./types.ts

// ==================== 工具函数 ====================

/**
 * 格式化数值
 * @param value - 数值或字符串数值
 * @param format - 格式字符串，如 '0,0.00'
 * @returns 格式化后的字符串
 */
const formatNumber = (value: number | string, format?: string): string => {
  if (value === null || value === undefined) return '';
  const num = Number(value);
  if (isNaN(num)) return String(value);
  if (!format) return String(num);
  // 处理千分位格式，如 '0,0.00'
  const parts = format.split('.');
  const integerPart = parts[0].replace(/,/g, '');
  const decimalPart = parts[1] || '';
  const formattedInteger = Number(integerPart).toLocaleString('en-US');
  if (decimalPart) {
    const decimals = decimalPart.length;
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  return formattedInteger;
};


/**
 * 格式化日期
 * @param value - 日期值（时间戳、字符串或 Date 对象）
 * @param format - 格式字符串，如 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
const formatDate = (value: number | string | Date, format?: string): string => {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return String(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  }
  if (format === 'YYYY-MM-DD HH:mm:ss') {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  // 默认格式
  return `${year}-${month}-${day}`;
};

/**
 * 从表格列配置中提取码表 key
 * @param columns - 表格列配置数组
 * @returns 码表 key 数组
 */
const extractCodeTableKeysFromColumns = (columns: DDVTableColumn[]): string[] => {
  const keys: string[] = [];
  if (!columns) return keys;

  columns.forEach((col) => {
    // 处理 render 配置中的码表
    if (col.render?.type === 'code_table' && col.render?.key) {
      if (!keys.includes(col.render.key)) {
        keys.push(col.render.key);
      }
    }
  });

  return keys;
};

/**
 * 从筛选项/表单项配置中提取码表 key
 * @param items - 筛选项/表单项配置数组
 * @returns 码表 key 数组
 */
const extractCodeTableKeysFromItems = (items: DDVTableFormItem[]): string[] => {
  const keys: string[] = [];
  if (!items) return keys;

  items.forEach((item) => {
    // 处理 codeTable 配置
    if (item.codeTable) {
      if (!keys.includes(item.codeTable)) {
        keys.push(item.codeTable);
      }
    }
    // 处理 treeTable 配置（树形码表）
    if (item.treeTable) {
      if (!keys.includes(item.treeTable)) {
        keys.push(item.treeTable);
      }
    }
  });

  return keys;
};

// ==================== 默认配置 ====================

/**
 * VTable 默认配置
 * 包含编辑、文本、冻结、样式等默认设置
 */
const defaultConfig: Record<string, any> = {
  // 编辑配置
  editCellTrigger: 'click',
  keyboardOptions: {
    copySelected: true,
    pasteValueToCell: true,
    selectAllOnCtrlA: true,
  },
  // 文本配置
  enableLineBreak: true,
  autoWrapText: false,
  // 拖拽表头配置
  dragHeaderMode: 'column',
  // 冻结配置
  showFrozenIcon: true,
  allowFrozenColCount: 0,
  frozenColCount: 0,
  // 高度模式
  heightMode: 'standard',
  // 显示聚合
  showAggregation: true,
  // 默认样式
  defaultHeaderBgColor: '#fafafa',
  defaultCellBgColor: '#fff',
  hover: {
    highlightMode: 'cross',
  },
  selection: {
    fill: '#c6e3ff',
    stroke: '#007acc',
    strokeWidth: 1,
  },
  // 主题配置：设置默认字体和滚动条常驻显示
  theme: VTable.themes.DEFAULT.extends({
    defaultStyle: {
      fontFamily: 'Microsoft YaHeu, 微软雅黑, PingFang SC, sans-serif',
      fontSize: 14,
    },
    headerStyle: {
      fontFamily: 'Microsoft YaHeu, 微软雅黑, PingFang SC, sans-serif',
      fontSize: 14,
    },
    bodyStyle: {
      fontFamily: 'Microsoft YaHeu, 微软雅黑, PingFang SC, sans-serif',
      fontSize: 14,
    },
    // 滚动条样式配置
    scrollStyle: {
      visible: 'always', // 常驻显示滚动条
      width: 8,
      scrollSliderColor: '#c1c1c1',
      scrollRailColor: '#f0f0f0',
      scrollSliderCornerRadius: 4,
      barToSide: false,
    },
  }),
};

// ==================== 图标注册 ====================

// 注册复制图标
VTable.register.icon('dd-copy', {
  type: 'svg',
  svg: '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="#999" d="M5.75 2h6.5A.75.75 0 0 1 13 2.75v9.5a.75.75 0 0 1-.75.75h-6.5a.75.75 0 0 1-.75-.75v-9.5a.75.75 0 0 1 .75-.75zM5 3.5a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25H5z"/><path fill="#999" d="M2.75 5h6.5a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-.75.75H2.75a.75.75 0 0 1-.75-.75V5.75a.75.75 0 0 1 .75-.75zM2 5.5a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25h6.5a.25.25 0 0 0 .25-.25V5.75a.25.25 0 0 0-.25-.25H2z"/></svg>',
  width: 16,
  height: 16,
  name: 'dd-copy',
  positionType: VTable.TYPES.IconPosition.left,
  marginRight: 4,
  hover: {
    width: 16,
    height: 16,
    bgColor: '#e6f7ff',
  },
  cursor: 'pointer',
});

// 注册过滤图标
VTable.register.icon('filter', {
  name: 'filter',
  type: 'svg',
  width: 16,
  height: 16,
  marginLeft: 4,
  positionType: VTable.TYPES.IconPosition.right,
  svg: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z" fill="#999"/></svg>',
  hover: {
    width: 16,
    height: 16,
    bgColor: '#f0f0f0',
  },
  cursor: 'pointer',
});

// 注册已过滤图标
VTable.register.icon('filtered', {
  name: 'filtered',
  type: 'svg',
  width: 16,
  height: 16,
  marginLeft: 4,
  positionType: VTable.TYPES.IconPosition.right,
  svg: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z" fill="#1296db"/></svg>',
  hover: {
    width: 16,
    height: 16,
    bgColor: '#e6f7ff',
  },
  cursor: 'pointer',
});

/**
 * DDVTable - 基于 VTable 的轻量级明细表组件
 *
 * 特性：
 * - 简单配置：仅需 config.grid_columns 和 data.rows 即可使用
 * - 局部刷新：data 变化时仅刷新数据，表头不刷新
 * - 支持两种数据模式：直接传入数据 或 通过 API 查询
 * - 支持冻结列、排序、工具栏等常用功能
 *
 * @example
 * ```tsx
 * // 方式1：直接传入数据
 * <DDVTable
 *   config={{
 *     grid_columns: [
 *       { title: '姓名', field: 'name', width: 120 },
 *       { title: '年龄', field: 'age', width: 80, sort: true },
 *     ],
 *     frozenColCount: 1,
 *     toolbar_default: { add: true, reload: true },
 *   }}
 *   data={{ rows: [{ name: '张三', age: 25 }] }}
 *   onAdd={() => console.log('新增')}
 * />
 *
 * // 方式2：API 查询数据
 * <DDVTable
 *   apiParams={{ page: 1, pageSize: 20 }}
 *   config={{
 *     grid_columns: [
 *       { title: '姓名', field: 'name' },
 *       { title: '年龄', field: 'age' },
 *     ],
 *     api_config: {
 *       api_grid_query: '/hx/ty/crud/queryPager',
 *     },
 *   }}
 *   onDataLoad={(data) => console.log(data)}
 * />
 * ```
 */
const DDVTable: React.FC<DDVTableProps> = ({
  config,
  data,
  apiParams,
  autoLoad = true,
  customFormatters,
  onReady,
  onCellClick,
  onSort,
  onAdd,
  onEdit,
  onDelete,
  onSetting,
  onRowEdit,
  onRowDelete,
  onRowDetail,
  onSelectionChange,
  onFilter,
  onLoadingChange,
  onDataLoad,
  onError,
  onRefresh,
  onFormSave,
  onFormDataLoaded,
}) => {
  // 从 config.form_config 获取表单配置
  const formConfig = config?.form_config;
  const tableRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ==================== 码表加载状态 ====================
  const [codeTableLoading, setCodeTableLoading] = useState(false);

  // ==================== API 模式相关状态 ====================
  const [loading, setLoading] = useState(false);
  const [apiTableData, setApiTableData] = useState<DDVTableData | null>(null);
  const [pagination, setPagination] = useState<DDVTableApiQueryParams>({
    page: 1,
    pageSize: 5000,
    ...apiParams,
  });
  const hasInitialLoad = useRef(false);
  const onFormSaveRef = useRef(onFormSave);

  // 同步 onFormSave ref
  useEffect(() => {
    onFormSaveRef.current = onFormSave;
  }, [onFormSave]);

  // 码表预加载 - 在组件加载前预先加载 grid_columns、filter_items、form_items 中配置的码表
  useEffect(() => {
    const initCodeTables = async () => {
      // 从 grid_columns 中提取码表 key
      const columns = config?.grid_columns || [];
      const codeTableKeysFromColumns = extractCodeTableKeysFromColumns(columns);

      // 从 filter_items 中提取码表 key
      const filterItems = config?.filter_items || [];
      const codeTableKeysFromFilter = extractCodeTableKeysFromItems(filterItems);

      // 从 form_items 中提取码表 key
      const formItems = config?.form_items || [];
      const codeTableKeysFromForm = extractCodeTableKeysFromItems(formItems);

      // 合并所有码表 key
      const allCodeTableKeys = [...codeTableKeysFromColumns, ...codeTableKeysFromFilter, ...codeTableKeysFromForm];
      // 去重
      const uniqueKeys = Array.from(new Set(allCodeTableKeys));

      if (uniqueKeys.length === 0) return;

      setCodeTableLoading(true);

      // 构建码表参数
      const param = uniqueKeys.map((key) => ({ key }));

      // 获取码表 Promise 数组
      const promiseArr = myUtil.code.getCodeTablePromise(param);

      if (promiseArr.length > 0) {
        try {
          await Promise.all(promiseArr);
        } catch (error) {
          console.error('码表加载失败:', error);
        } finally {
          setCodeTableLoading(false);
        }
      } else {
        setCodeTableLoading(false);
      }
    };

    initCodeTables();
  }, [config?.grid_columns, config?.filter_items, config?.form_items]);

  // 从 config.api_config 中获取 API 地址
  const apiGridQuery = config?.api_config?.api_grid_query;

  // 判断是否使用 API 模式
  const isApiMode = !!apiGridQuery;

  // 获取最终数据（API 模式使用内部状态，否则使用外部传入）
  const finalData = isApiMode ? (apiTableData || undefined) : data;

  // 获取工具栏配置
  const toolbarConfig = config?.toolbar_default || {};

  // 设置弹窗状态
  const [settingVisible, setSettingVisible] = useState(false);

  // 初始化设置配置 - 仅组件首次加载时从 grid_config 读取
  const [settingConfig, setSettingConfig] = useState<DDVTableSettingConfig>(() => {
    const gridConfig = config?.grid_config || {};
    return {
      size: 'default',
      showIndex: true,
      showHandleColumn: true,
      frozenColCount: gridConfig.grid_frozen_col_count || 0,
      allowFrozenColCount: gridConfig.grid_allow_frozen_col_count || 5,
      showSummary: true,
      selectionType: gridConfig.grid_selection_type || false,
      columnVisibility: {},
      columnOrder: [],
      gridHeight: typeof gridConfig.grid_height === 'number' ? gridConfig.grid_height : 500,
    };
  });

  // 打开设置弹窗时，保留当前设置值（不再从 config 重置）
  const handleOpenSetting = useCallback(() => {
    setSettingVisible(true);
  }, []);

  // 计算表格高度：优先使用 settingConfig.gridHeight（本地预览），否则使用配置的 grid_height，默认 500
  const tableHeight = useMemo(
    () => (settingConfig?.gridHeight ?? config?.grid_config?.grid_height ?? 500) as number,
    [settingConfig?.gridHeight, config?.grid_config?.grid_height],
  );

  // 过滤面板状态
  const [filterPanelVisible, setFilterPanelVisible] = useState(false);
  const [filterPanelPosition, setFilterPanelPosition] = useState({ top: 0, left: 0, width: 200 });
  const [filterColumn, setFilterColumn] = useState<DDVTableColumn | null>(null);
  const [filterValue, setFilterValue] = useState<string | { min?: number; max?: number }>('');
  const [filterRules, setFilterRules] = useState<DDVTableFilterRule[]>([]);
  const [filteredCount, setFilteredCount] = useState<number | undefined>(undefined);

// ==================== 表单相关状态 ====================
  const [form] = Form.useForm();
  const [formVisible, setFormVisible] = useState(false);
  const [formType, setFormType] = useState<'add' | 'edit'>('add');
  const [formMasker, setFormMasker] = useState(false);
  const [formMasker2, setFormMasker2] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [formDataLoaded, setFormDataLoaded] = useState(false); // 标记表单数据是否已加载（避免重复）
  const [queryFormData, setQueryFormData] = useState<any>(null); // 查询到的表单数据
  // 详情弹窗相关状态
  const [detailVisible, setDetailVisible] = useState(false); // 详情弹窗显示状态
  const [detailLoading, setDetailLoading] = useState(false); // 详情加载状态
  const [detailData, setDetailData] = useState<any>(null); // 详情数据

  // ==================== API 配置辅助函数 ====================

  /** 获取表单 API 地址 */
  const getFormApiUrl = useCallback((apiType: 'api_form_query' | 'api_form_edit'): string | undefined => {
    if (config?.api_config?.[apiType]) {
      return config.api_config[apiType];
    }
    return undefined;
  }, [config]);

  /** 构建完整的 API 地址（自动添加 API 根路径） */
  const buildFullApiUrl = useCallback((apiUrl: string | undefined): string | undefined => {
    if (!apiUrl) return undefined;
    // 如果已经是完整路径，直接返回
    if (/^https?:\/\//i.test(apiUrl)) {
      return apiUrl;
    }
    // 否则拼接 API 根路径
    return myUtil.api.getApiRoot() + apiUrl;
  }, []);

  /** 获取删除 API 地址 */
  const getDeleteApiUrl = useCallback((): string | undefined => {
    return config?.api_config?.api_form_delete;
  }, [config]);

  // ==================== API 数据加载逻辑（仅 API 模式使用） ====================

  /** 构建请求参数 */
  const buildRequestData = useCallback((params: DDVTableApiQueryParams): Record<string, any> => {
    const requestData: Record<string, any> = {};

    // 分页参数
    if (params.page !== undefined) requestData.page = params.page;
    if (params.pageSize !== undefined) requestData.pageSize = params.pageSize;

    // 查询条件数组
    if (params.searchModel && Array.isArray(params.searchModel)) {
      requestData.searchModel = params.searchModel;
    }

    // 排序条件数组
    if (params.orderModel && Array.isArray(params.orderModel)) {
      requestData.orderModel = params.orderModel;
    } else if (params.sortField) {
      // 兼容旧格式：单个排序字段转换为 orderModel 数组
      requestData.orderModel = [{
        field: params.sortField,
        direction: params.sortOrder || 'asc',
      }];
    }

    // 兼容旧格式：如果有 pageNum，映射到 page
    if (params.pageNum !== undefined && params.page === undefined) {
      requestData.page = params.pageNum;
    }

    // 其他查询参数
    Object.keys(params).forEach((key) => {
      if (!['page', 'pageSize', 'pageNum', 'searchModel', 'orderModel', 'sortField', 'sortOrder'].includes(key)) {
        requestData[key] = (params as any)[key];
      }
    });

    return requestData;
  }, []);

  /** 获取最终请求参数 */
  const getFinalParams = useCallback((params?: DDVTableApiQueryParams): Record<string, any> => {
    // 优先使用传入的 params，否则使用 pagination
    let finalParams: DDVTableApiQueryParams = params ? { ...pagination, ...params } : { ...pagination };
    // 合并外部传入的 apiParams - 只有当 apiParams 中的 searchModel 不为空时才覆盖
    if (apiParams) {
      finalParams.page = apiParams.page ?? finalParams.page;
      finalParams.pageSize = apiParams.pageSize ?? finalParams.pageSize;
      // 只在 apiParams.searchModel 非空时才覆盖
      if (apiParams.searchModel && apiParams.searchModel.length > 0) {
        finalParams.searchModel = apiParams.searchModel;
      }
      if (apiParams.orderModel && apiParams.orderModel.length > 0) {
        finalParams.orderModel = apiParams.orderModel;
      }
    }
    return buildRequestData(finalParams);
  }, [pagination, apiParams, buildRequestData]);

  /** 加载数据（API 模式） */
  const loadData = useCallback(async (params?: DDVTableApiQueryParams) => {
    // 从 config.api_config 获取 API 地址
    const queryUrl = config?.api_config?.api_grid_query;
    if (!queryUrl) {
      console.warn('[DDVTable] config.api_config.api_grid_query is required in API mode');
      return;
    }

    setLoading(true);
    onLoadingChange?.(true);

    try {
      const requestData = getFinalParams(params);

      // 构建完整的 API 地址
      const fullApiUrl = buildFullApiUrl(queryUrl);

      const response = await request<DDVTableApiResponse>(fullApiUrl, {
        method: 'POST',
        data: requestData,
      });

      if (response) {
        // 解析响应数据 - 支持多种响应格式
        let rows: any[] = [];

        // 格式1: { code: "200", body: { rowCount: 50, rows: [...] } }
        if (response.body?.rows) {
          rows = response.body.rows;
        }
        // 格式2: { data: { list: [...] } }
        else if (response.data?.list) {
          rows = response.data.list;
        }
        // 格式3: { data: [...] }
        else if (Array.isArray(response.data)) {
          rows = response.data;
        }
        // 格式4: { data: { rows: [...] } }
        else if (response.data?.rows) {
          rows = response.data.rows;
        }
        // 格式5: { rows: [...] } - 直接数组格式
        else if (Array.isArray(response)) {
          rows = response;
        }
        // 格式6: { data: { result: [...] } }
        else if (response.data?.result) {
          rows = response.data.result;
        }

        const tableDataResult: DDVTableData = { rows };

        setApiTableData(tableDataResult);
        onDataLoad?.(tableDataResult, response);
      }
    } catch (error) {
      console.error('[DDVTable] 数据加载失败:', error);
      onError?.(error);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  }, [config, getFinalParams, onLoadingChange, onDataLoad, onError, buildFullApiUrl]);

  // ==================== 筛选表单相关 ====================
  const [filterForm] = Form.useForm();
  // 使用 formUtil.init 对 filter_items 进行格式转换
  const filterItems = formUtil.init({ items: config?.filter_items || [] });
  // 码表渲染：为 filter_items 中的 codeTable/treeTable 配置生成选项列表
  filterItems?.forEach((item: any) => {
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
  const hasFilter = filterItems && filterItems.length > 0;

  // 处理筛选表单提交 - 由于 DDFilter 内部的 assembleSearchModel 没有传 items，导致返回空数组
  // 所以这里直接从 filterForm 获取值，手动构建 searchModel
  const handleFilterSubmit = useCallback(async () => {
    try {
      const values = await filterForm.validateFields();
      console.log('[DDVTable] filter form values:', values);

      // 手动构建 searchModel 格式: [{ property: "sbpc", value: "999", op: "alike" }, ...]
      const searchModel: any[] = [];
      filterItems.forEach((item: any) => {
        const key = item.name;
        const value = values[key];
        // 跳过空值
        if (value === undefined || value === null || value === '') {
          return;
        }
        // 获取操作符，默认 like（包含）
        const op = item.op || 'alike';
        // 处理范围查询
        if (item.range && value && typeof value === 'object' && value.length === 2) {
          // 范围查询：创建两个条件
          if (value[0] !== undefined && value[0] !== null && value[0] !== '') {
            searchModel.push({
              property: key,
              value: value[0],
              op: 'ge', // 大于等于
            });
          }
          if (value[1] !== undefined && value[1] !== null && value[1] !== '') {
            searchModel.push({
              property: key,
              value: value[1],
              op: 'le', // 小于等于
            });
          }
        } else {
          // 普通查询
          searchModel.push({
            property: key,
            value: value,
            op: op,
          });
        }
      });

      console.log('[DDVTable] handleFilterSubmit searchModel:', searchModel);

      // 更新分页并重新加载数据
      const newParams: DDVTableApiQueryParams = {
        ...pagination,
        page: 1, // 筛选时重置到第一页
        searchModel: searchModel,
      };
      console.log('[DDVTable] handleFilterSubmit newParams:', newParams);
      setPagination(newParams);
      loadData(newParams);
    } catch (error) {
      console.log('[DDVTable] handleFilterSubmit validate error:', error);
    }
  }, [pagination, loadData, filterForm, filterItems]);

  // 处理筛选表单重置
  const handleFilterReset = useCallback(() => {
    filterForm.resetFields();
    // 重置分页并重新加载数据（不带筛选条件）
    const newParams: DDVTableApiQueryParams = {
      ...pagination,
      page: 1,
      searchModel: undefined,
    };
    setPagination(newParams);
    loadData(newParams);
  }, [filterForm, pagination, loadData]);

  /** 封装 onFormSave 回调，保存成功后自动刷新列表（API 模式） */
  const handleApiFormSave = useCallback(
    async (values: any, formType: 'add' | 'edit', record?: any) => {
      // 先调用用户传入的 onFormSave 回调
      if (onFormSaveRef.current) {
        await onFormSaveRef.current(values, formType, record);
      }
      // 保存成功后自动刷新列表（仅 API 模式）
      if (isApiMode) {
        loadData();
      }
    },
    [isApiMode, loadData],
  );

  // API 模式：数据加载逻辑
  useEffect(() => {
    if (!isApiMode || !autoLoad || loading) return;

    // 首次加载
    if (!hasInitialLoad.current) {
      hasInitialLoad.current = true;
      loadData();
    }
    // apiParams 变化时的后续加载由外部 refreshKey 控制
  }, [isApiMode, autoLoad, loadData]);

  /** 处理排序变化（API 模式联动后端排序） */
  const handleApiSortChange = useCallback((sortField: string, sortOrder: 'asc' | 'desc') => {
    if (!isApiMode) return;
    const newParams: DDVTableApiQueryParams = {
      ...pagination,
      orderModel: [{ field: sortField, direction: sortOrder }],
    };
    setPagination(newParams);
    loadData(newParams);
  }, [isApiMode, pagination, loadData]);

  // ==================== 日期字段处理 ====================

  // 日期字段名称集合（根据配置动态获取）
  const getDateFields = useCallback(() => {
    if (!config?.form_items) return [];
    const dateFields: string[] = [];
    config.form_items?.forEach((item: any) => {
      if (item.type === 'DatePicker' || item.type === 'RangePicker') {
        dateFields.push(item.name);
      }
    });
    return dateFields;
  }, [config?.form_items]);

  // 处理表单数据，将日期字符串转换为 dayjs 对象
  const formatFormData = useCallback((data: Record<string, any>): Record<string, any> => {
    if (!data) return {};
    if (!config?.form_items) return data;
    const formatted: Record<string, any> = { ...data };

    // 参照 DDBunitFun.tsx 中的日期转换逻辑
    config.form_items?.forEach((item: any) => {
      if (!item?.name) return;
      const value = formatted[item.name];
      if (!value) return;

      if (item.type === 'DatePicker' && value && typeof value === 'string') {  // 日期类型
        // yyyymmdd 格式正则
        const reg1 = /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229))$/;
        // yyyy-mm-dd 或 yyyy-mm-dd HH:mm:ss 格式正则
        const reg2 = /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))(\s\d{2}:\d{2}:\d{2})?$/;

        if (reg1.test(value) || reg2.test(value)) {
          // 后端返回 yyyymmdd 或 yyyy-mm-dd 或 yyyy-mm-dd HH:mm:ss 格式
          formatted[item.name] = dayjs(new Date(value));
        } else {
          // 后端返回时间戳格式
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            formatted[item.name] = dayjs(new Date(numValue));
          }
          // 否则保留原值，让 AntD DatePicker 自行处理
        }
      }
    });
    return formatted;
  }, [config?.form_items]);
  // 初始化表单项（使用 useMemo 避免重复计算）
  const formItems = useMemo(() => {
    const items = config?.form_items || [];
    if (!items || items.length === 0) return [];
    return formUtil.init({
      items,
      func: {},
      form,
    });
  }, [config?.form_items, form]);

  // 拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // ==================== 表单相关回调函数 ====================

  // 打开新建表单弹窗
  const handlePopupAdd = useCallback(() => {
    setFormType('add');
    form.resetFields();
    setEditingRecord(null);
    // 先显示弹窗，再调用回调（如果有）
    setFormVisible(true);
    if (onAdd) {
      onAdd();
    }
  }, [form, onAdd]);

  // 打开编辑表单弹窗
  const handlePopupEdit = useCallback(
    (record?: any) => {
      setFormType('edit');
      setEditingRecord(record || null);
      form.resetFields();
      setFormVisible(true);
      setFormMasker(true);

      // 获取表单查询 API 地址
      const apiFormQueryUrl = getFormApiUrl('api_form_query');

      // 检查是否配置了 api_form_query
      if (apiFormQueryUrl && record) {
        // 构建完整 API 路径
        const fullApiUrl = buildFullApiUrl(apiFormQueryUrl);

        // 构建查询参数
        const gridRowKey = config?.grid_config?.grid_row_key || 'id';
        const queryParam: Record<string, any> = {
          key: config?.module_key || '',
          [gridRowKey]: record[gridRowKey] || record.id,
        };

        // 调用查询 API
        request(fullApiUrl, { method: 'POST', data: queryParam })
          .then((response: any) => {
            // 兼容 code 为字符串 "200" 或数字 200 的情况
            if (response?.code === '200' || response?.code == 200 || response?.success) {
              // 优先从 body 获取数据，其次是 data，最后是整个响应
              // 调试日志
              console.log('[DDVTable] 查询响应:', response);
              const formData = response?.body?.data || response?.body || response?.data || response;
              console.log('[DDVTable] 表单数据:', formData);
              // 通过 onFormDataLoaded 回调赋值表单
              if (onFormDataLoaded) {
                onFormDataLoaded(form, formData);
              }
              // 存储查询到的数据，useEffect 中赋值
              setQueryFormData(formData);
              // 标记表单数据已加载
              setFormDataLoaded(true);
            } else {
              message.error(response?.msg || '查询表单数据失败');
            }
          })
          .catch((error: any) => {
            console.error('查询表单数据失败:', error);
            message.error(error.message || '查询表单数据失败');
          })
          .finally(() => {
            setFormMasker(false);
          });
      } else {
        // 如果没有配置 api_form_query，使用 getEditValueByGrid 或默认逻辑
        setFormMasker(false);
        if (onFormDataLoaded && record) {
          onFormDataLoaded(form, record);
        } else if (record) {
          // 处理日期格式
          const formattedData = formatFormData(record);
          form.setFieldsValue(formattedData);
        }
      }

      if (onEdit) {
        onEdit(record);
      }
    },
    [form, formConfig, config, onEdit, onFormDataLoaded, getFormApiUrl, buildFullApiUrl],
  );

  // 显示详情弹窗
  const handleShowDetail = useCallback(
    async (record: any) => {
      // 检查是否有表单配置
      if (!formItems || formItems.length === 0) {
        message.warn('请先配置 form_items 以显示详情');
        return;
      }

      setDetailLoading(true);
      setDetailVisible(true);

      // 获取表单查询 API 地址
      const apiFormQueryUrl = getFormApiUrl('api_form_query');
      // 获取 getEditValueByGrid 配置
      const getEditValueByGrid = formConfig?.form_get_value_by_grid || config?.form_config?.form_get_value_by_grid;

      // 构建查询参数
      const gridRowKey = config?.grid_config?.grid_row_key || 'id';
      const param: Record<string, any> = {
        key: config?.module_key || '',
        [gridRowKey]: record[gridRowKey] || record.id,
      };

      try {
        let detailDataResult: any;

        if (getEditValueByGrid || !apiFormQueryUrl) {
          // 直接从行数据获取
          detailDataResult = record;
          setDetailLoading(false);
        } else {
          // 调用 API 获取详情
          const fullApiUrl = buildFullApiUrl(apiFormQueryUrl);
          const response: any = await request(fullApiUrl, { method: 'POST', data: param });

          if (response?.code === '200' || response?.code == 200 || response?.success) {
            // 优先从 body 获取数据
            detailDataResult = response?.body?.data || response?.body || response?.data || response;
            setDetailLoading(false);
          } else {
            message.error(response?.msg || '查询详情失败');
            setDetailVisible(false);
            setDetailLoading(false);
            return;
          }
        }

        setDetailData(detailDataResult);
      } catch (error: any) {
        console.error('查询详情失败:', error);
        message.error(error.message || '查询详情失败');
        setDetailVisible(false);
        setDetailLoading(false);
      }
    },
    [formItems, formConfig, config, getFormApiUrl, buildFullApiUrl],
  );

  // 关闭详情弹窗
  const handleCloseDetail = useCallback(() => {
    setDetailVisible(false);
    setDetailData(null);
  }, []);

  // 表单提交
  const handleFormSubmit = useCallback(async () => {
    if (!form) return;

    try {
      const values = await form.validateFields();
      setFormMasker2(true);

      // 获取表单保存 API 地址
      const apiFormEditUrl = getFormApiUrl('api_form_edit');

      // 检查是否配置了 api_form_edit
      if (apiFormEditUrl) {
        // 构建完整 API 路径
        const fullApiUrl = buildFullApiUrl(apiFormEditUrl);

        // 构建请求参数
        const gridRowKey = config?.grid_config?.grid_row_key || 'id';
        const param: Record<string, any> = {
          key: config?.module_key || '',
          formType: formType,
          ...values,
        };
        // 编辑模式下，将 gridRowKey 作为主键参数
        if (formType === 'edit' && editingRecord) {
          const pkValue = editingRecord[gridRowKey] || editingRecord.id;
          if (pkValue) {
            param[gridRowKey] = pkValue;
          }
        }

        // 调用保存 API
        try {
          const response = await request(fullApiUrl, { method: 'POST', data: param });
          const { code, desc, msg } = response || {};
          if (code === '200') {
            message.success(desc || '保存成功');
            setFormVisible(false);
            form.resetFields();
            // 触发保存成功回调（使用 handleApiFormSave 以支持 API 模式自动刷新）
            await handleApiFormSave(values, formType, editingRecord);
          } else {
            message.error(desc || msg || '保存失败');
          }
        } catch (error: any) {
          message.error(error.message || '保存失败');
        }
      } else {
        // 如果没有配置 api_form_edit，使用回调方式
        await handleApiFormSave(values, formType, editingRecord);
      }
    } catch (error: any) {
      // 验证失败
      console.error('表单验证失败:', error);
    } finally {
      setFormMasker2(false);
    }
  }, [form, formType, editingRecord, formConfig, config, getFormApiUrl, buildFullApiUrl, handleApiFormSave]);

  // 关闭表单弹窗
  const handleCloseForm = useCallback(() => {
    setFormVisible(false);
    setFormMasker(false);
    setFormMasker2(false);
    form.resetFields();
    setEditingRecord(null);
    setFormDataLoaded(false); // 重置表单数据加载标志
    setQueryFormData(null); // 重置查询到的表单数据
  }, [form]);

  // 查询到表单数据后赋值
  useEffect(() => {
    if (queryFormData && form) {
      console.log('[DDVTable] 赋值表单数据:', queryFormData);
      // 处理日期格式
      const formattedData = formatFormData(queryFormData);
      form.setFieldsValue(formattedData);
      setQueryFormData(null); // 赋值后清空
    }
  }, [queryFormData, form, formatFormData]);

  // 刷新表单数据（用于编辑时回填）- 仅当数据未通过 API 加载时调用
  useEffect(() => {
    if (formVisible && formType === 'edit' && editingRecord && !formDataLoaded && onFormDataLoaded) {
      // 处理日期格式
      const formattedData = formatFormData(editingRecord);
      onFormDataLoaded(form, formattedData);
      // 即使有 onFormDataLoaded 回调，也自动补充日期字段的值
      // 因为用户回调可能没有正确转换日期
      const dateFields = getDateFields();
      const dateValues: Record<string, any> = {};
      dateFields.forEach((field) => {
        if (formattedData[field] !== undefined) {
          dateValues[field] = formattedData[field];
        }
      });
      if (Object.keys(dateValues).length > 0) {
        form.setFieldsValue(dateValues);
      }
    }
  }, [formVisible, formType, editingRecord, form, onFormDataLoaded, formDataLoaded, formatFormData, getDateFields]);

  // ==================== 原有回调函数 ====================

  // 从 config 初始化设置配置（首次加载时）
  useEffect(() => {
    const initConfig: DDVTableSettingConfig = {};

    // 从 config 读取初始值
    if (config?.grid_config?.grid_row_series_number !== undefined) {
      initConfig.showIndex = config.grid_config.grid_row_series_number === true || (typeof config.grid_config.grid_row_series_number === 'object');
    }
    if (config?.grid_config?.grid_frozen_col_count !== undefined) {
      initConfig.frozenColCount = config.grid_config.grid_frozen_col_count;
    }
    // 统计行初始值从 grid_columns 的聚合配置推断
    const hasAggregation = config?.grid_columns?.some(
      (col: DDVTableColumn) => col.sum || col.min || col.max || col.avg,
    );
    initConfig.showSummary = hasAggregation;

    // 首列选择类型初始值
    if (config?.grid_config?.grid_selection_type !== undefined) {
      initConfig.selectionType = config.grid_config.grid_selection_type;
    }

    // 自动换行初始值 - 如果开启自动换行，列表紧凑程度设为 'auto'
    if (config?.grid_config?.grid_auto_wrap_text !== undefined) {
      initConfig.autoWrapText = config.grid_config.grid_auto_wrap_text;
      initConfig.size = config.grid_config.grid_auto_wrap_text ? 'auto' : 'default';
    }

    // 初始化列配置
    if (config?.grid_columns) {
      // 列显示配置：默认全部显示，隐藏初始 hidden: true 的列
      // 使用 field + grid_columns 中的实际索引作为唯一键，支持相同 field 不同 title 的列
      const visibility: Record<string, boolean> = {};
      config.grid_columns.forEach((col, index) => {
        const key = `${col.field}_${index}`;
        visibility[key] = col.hidden !== true;
      });
      initConfig.columnVisibility = visibility;

      // 列顺序配置：过滤掉初始 hidden: true 的列，只显示可见列供用户调整
      // 使用 field + grid_columns 中的实际索引作为唯一键
      initConfig.columnOrder = config.grid_columns
        .filter((col) => col.hidden !== true)
        .map((col) => {
          // 找到当前列在原始数组中的索引
          const originalIndex = config.grid_columns.indexOf(col);
          return `${col.field}_${originalIndex}`;
        });
    }

    setSettingConfig((prev) => ({ ...prev, ...initConfig }));
  }, [config?.grid_config?.grid_row_series_number, config?.grid_config?.grid_frozen_col_count, config?.grid_columns, config?.grid_config?.grid_selection_type, config?.grid_config?.grid_auto_wrap_text]);

  // 拖拽结束处理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSettingConfig((prev) => {
        const oldOrder = prev.columnOrder || [];
        const newOrder = arrayMove(oldOrder, oldOrder.indexOf(String(active.id)), oldOrder.indexOf(String(over.id)));
        return { ...prev, columnOrder: newOrder };
      });
    }
  };

  // 获取可显示的列（按配置顺序）
  const getOrderedColumns = () => {
    if (!config?.grid_columns) return [];

    // 性能模式：只返回最基础的列配置，用于性能测试
    if (config.grid_config?.grid_performance_mode) {
      return config.grid_columns
        .filter((col: any) => col.hidden !== true)
        .map((col: any) => ({
          field: col.field,
          title: col.title,
          width: col.width || 100,
        }));
    }

    const order = settingConfig.columnOrder || [];
    const visibility = settingConfig.columnVisibility || {};

    return config.grid_columns
      .filter((col, index) => {
        const fieldKey = `${col.field}_${index}`;
        return visibility[fieldKey] !== false;
      })
      .sort((a, b) => {
        // 获取每个列在 grid_columns 中的索引
        const idxA = config.grid_columns.indexOf(a);
        const idxB = config.grid_columns.indexOf(b);
        const keyA = `${a.field}_${idxA}`;
        const keyB = `${b.field}_${idxB}`;
        const posA = order.indexOf(keyA);
        const posB = order.indexOf(keyB);
        if (posA === -1) return 1;
        if (posB === -1) return -1;
        return posA - posB;
      });
  };

  // 导出功能
  const handleExport = useCallback(async () => {
    if (tableRef.current) {
      try {
        const excelBlob = await exportVTableToExcel(tableRef.current, {
          ignoreIcon: true,
        });
        downloadExcel(excelBlob, 'export');
        message.success('导出成功');
      } catch (error) {
        console.error('导出失败:', error);
        message.error('导出失败');
      }
    }
  }, []);

  // 刷新功能
  const handleReload = useCallback(() => {
    // 获取选中行数据
    const selectedRecords = tableRef.current?.getSelectedRecords?.() || [];

    // 如果传入了 onRefresh 回调，优先调用
    if (onRefresh) {
      onRefresh(selectedRecords);
      message.success('刷新成功');
      return;
    }

    // API 模式下调用 loadData 重新获取数据
    if (isApiMode) {
      loadData();
      message.success('刷新成功');
      return;
    }

    // 非 API 模式使用本地数据刷新
    if (tableRef.current && data) {
      tableRef.current.setRecords(data.rows || []);
      message.success('刷新成功');
    }
  }, [data, isApiMode, loadData, onRefresh]);

  // 全屏切换
  const handleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 构建系统菜单下拉项（设置、导入、导出、刷新、全屏）
  const getSystemMenuItems = () => {
    const items: any[] = [];

    if (toolbarConfig.download) {
      items.push({
        key: 'download',
        label: <a onClick={handleExport}>导出</a>,
        icon: <DownloadOutlined />,
      });
    }

    if (toolbarConfig.upload) {
      items.push({
        key: 'upload',
        label: <a onClick={() => message.info('导入功能')}>导入</a>,
        icon: <UploadOutlined />,
      });
    }

    if (toolbarConfig.reload) {
      items.push({
        key: 'reload',
        label: <a onClick={handleReload}>刷新</a>,
        icon: <RedoOutlined />,
      });
    }

    if (toolbarConfig.full) {
      items.push({
        key: 'full',
        label: <a onClick={handleFullscreen}>{isFullscreen ? '退出全屏' : '全屏'}</a>,
        icon: isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />,
      });
    }

    return items.length > 0 ? items : null;
  };

  // 渲染主按钮组（新增、编辑、删除）
  const renderMainButtonGroup = () => {
    const buttons: React.ReactNode[] = [];

    if (toolbarConfig.add) {
      buttons.push(
        <Button
          key="add"
          type="default"
          icon={<PlusOutlined />}
          onClick={handlePopupAdd}
        >
          新增
        </Button>
      );
    }

    if (toolbarConfig.edit) {
      buttons.push(
        <Button
          key="edit"
          type="default"
          icon={<EditOutlined />}
          onClick={handlePopupEdit}
        >
          编辑
        </Button>
      );
    }

    if (toolbarConfig.delete) {
      buttons.push(
        <Button
          key="delete"
          type="default"
          icon={<DeleteOutlined />}
          onClick={() => {
            if (tableRef.current) {
              // 获取 checkbox 选中状态
              const checkedStates = tableRef.current.getCheckboxState('') as boolean[];
              // 获取所有数据 - 使用 records 属性
              const allRecords = tableRef.current.records || [];
              // 过滤出选中的数据
              const selectedData = allRecords.filter((_: any, index: number) => checkedStates[index]);
              // 控制台输出选中的数据
              console.log('选中的列表数据:', selectedData);
              // 执行批量删除
              handleBatchDelete(selectedData);
            }
          }}
        >
          删除
        </Button>
      );
    }

    if (buttons.length === 0) return null;

    return <Space.Compact>{buttons}</Space.Compact>;
  };

  // 渲染系统菜单（设置、导入、导出、刷新、全屏）
  const renderSystemMenu = () => {
    const items: any = getSystemMenuItems();
    return (
      <Space.Compact block>
        {/* <Button type="default" onClick={() => {}} >图表统计</Button>
        <Button type="default" onClick={() => {}} >维度表统计</Button>
        <Button type="default" onClick={() => {}} >筛选</Button> */}
        { toolbarConfig.setting && <Button icon={<SettingOutlined />} onClick={handleOpenSetting} /> }
        { items?.length > 0 && <Dropdown placement="bottomRight" menu={{ items }}>
          <Button icon={<EllipsisOutlined />} />
        </Dropdown>}
      </Space.Compact>
    );
  };

  // 渲染设置弹窗
  const renderSettingModal = () => {
    return (
      <Modal
        title="表格设置"
        open={settingVisible}
        onCancel={() => setSettingVisible(false)}
        onOk={() => {
          setSettingVisible(false);
          if (onSetting) {
            onSetting(settingConfig);
          }
        }}
        okText="确定"
        cancelText="取消"
        width={800}
      >
        <div style={{ display: 'flex', gap: 24 }}>
          {/* 左侧：其他设置 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 280 }}>
            {/* 列表高度 */}
            <div>
              <div style={{ marginBottom: 8, color: '#666' }}>列表高度</div>
              <InputNumber
                min={100}
                max={2000}
                value={settingConfig.gridHeight}
                onChange={(value) => setSettingConfig({ ...settingConfig, gridHeight: value ?? 500 })}
                style={{ width: '100%' }}
                placeholder="请输入列表高度"
              />
            </div>

            {/* 首列选择类型 */}
            <div>
              <div style={{ marginBottom: 8, color: '#666' }}>首列选择类型</div>
              <Radio.Group
                value={settingConfig.selectionType}
                onChange={(e) => setSettingConfig({ ...settingConfig, selectionType: e.target.value })}
              >
                <Radio.Button value={false}>不显示</Radio.Button>
                <Radio.Button value="checkbox">复选框</Radio.Button>
                <Radio.Button value="radio">单选框</Radio.Button>
              </Radio.Group>
            </div>

            {/* 显示统计行 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>显示统计行</span>
                <Switch
                  checked={settingConfig.showSummary}
                  onChange={(checked) => setSettingConfig({ ...settingConfig, showSummary: checked })}
                />
              </div>
            </div>

            {/* 显示序号 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>显示序号</span>
                <Switch
                  checked={settingConfig.showIndex}
                  onChange={(checked) => setSettingConfig({ ...settingConfig, showIndex: checked })}
                />
              </div>
            </div>

            {/* 显示操作列 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>显示操作列</span>
                <Switch
                  checked={settingConfig.showHandleColumn}
                  onChange={(checked) => setSettingConfig({ ...settingConfig, showHandleColumn: checked })}
                />
              </div>
            </div>

            {/* 自动换行 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>自动换行</span>
                <Switch
                  checked={settingConfig.autoWrapText}
                  onChange={(checked) => {
                    setSettingConfig({
                      ...settingConfig,
                      autoWrapText: checked,
                      size: checked ? 'auto' : 'default',
                    });
                  }}
                />
              </div>
            </div>

            {/* 列表紧凑程度 */}
            <div>
              <div style={{ marginBottom: 8, color: '#666' }}>列表紧凑程度</div>
              <Radio.Group
                value={settingConfig.size === 'auto' ? 'default' : settingConfig.size}
                onChange={(e) => setSettingConfig({ ...settingConfig, size: e.target.value })}
              >
                <Radio.Button value="compact">紧凑</Radio.Button>
                <Radio.Button value="default">中等</Radio.Button>
                <Radio.Button value="loose">宽松</Radio.Button>
              </Radio.Group>
            </div>

            {/* 冻结列数 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#666' }}>冻结列数</span>
                <span>{settingConfig.frozenColCount} 列</span>
              </div>
              <Slider
                min={0}
                max={settingConfig.allowFrozenColCount || 5}
                value={settingConfig.frozenColCount}
                onChange={(value) => setSettingConfig({ ...settingConfig, frozenColCount: value })}
              />
            </div>

            {/* 可选冻结的最大列数 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#666' }}>可选冻结列数</span>
                <span>{settingConfig.allowFrozenColCount} 列</span>
              </div>
              <Slider
                min={0}
                max={config?.grid_columns?.length || 10}
                value={settingConfig.allowFrozenColCount}
                onChange={(value) => setSettingConfig({ ...settingConfig, allowFrozenColCount: value })}
              />
            </div>
          </div>

          {/* 右侧：列设置 */}
          <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 8, color: '#666' }}>列设置（可拖拽调整顺序）</div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={settingConfig.columnOrder || []} strategy={verticalListSortingStrategy}>
                <div style={{ maxHeight: 400, overflowY: 'auto', border: '1px solid #f0f0f0', borderRadius: 4, padding: 8, flex: 1 }}>
                  {settingConfig.columnOrder?.map((fieldKey) => {
                    // fieldKey 格式为 "field_索引"，解析出 field 和索引
                    // 使用 lastIndexOf 处理 field 中可能包含下划线的情况
                    const lastUnderscoreIndex = fieldKey.lastIndexOf('_');
                    const field = fieldKey.substring(0, lastUnderscoreIndex);
                    const fieldIndex = parseInt(fieldKey.substring(lastUnderscoreIndex + 1), 10);
                    // 直接使用 fieldIndex 从 grid_columns 中获取列
                    const col = config?.grid_columns?.[fieldIndex];
                    if (!col) return null;
                    return (
                      <SortableItem
                        key={fieldKey}
                        id={fieldKey}
                        title={col.title}
                        visible={settingConfig.columnVisibility?.[fieldKey] !== false}
                        onVisibleChange={(visible) => {
                          setSettingConfig((prev) => ({
                            ...prev,
                            columnVisibility: { ...prev.columnVisibility, [fieldKey]: visible },
                          }));
                        }}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </Modal>
    );
  };

  // 排序项组件
  const SortableItem = ({ id, title, visible, onVisibleChange }: { id: string; title: string; visible: boolean; onVisibleChange: (v: boolean) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };
    return (
      <div
        ref={setNodeRef}
        style={{ ...style, display: 'flex', alignItems: 'center', padding: '4px 8px', gap: 8 }}
      >
        <HolderOutlined style={{ cursor: 'grab', color: '#999', flexShrink: 0 }} {...attributes} {...listeners} />
        <Switch
          size="small"
          checked={visible}
          onChange={onVisibleChange}
          style={{ flexShrink: 0 }}
        />
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
      </div>
    );
  };

  // 渲染表单弹窗
  const renderFormModal = () => {
    // 如果没有配置表单，则不显示
    if (!config?.form_items || config.form_items.length === 0) return null;

    // 获取表单配置
    const formWidth = formConfig.form_width || 720;
    const formLayoutType = formConfig.form_layout_type || 'vertical';
    const formLabelLayout = formConfig.form_label_input_layout || 'horizontal';

    return (
      <Modal
        title={`${formConfig.form_title || ''}${formType === 'add' ? '采集' : '编辑'}`}
        open={formVisible}
        width={formWidth}
        okText="保存"
        cancelText="关闭"
        onCancel={handleCloseForm}
        onOk={handleFormSubmit}
        confirmLoading={formMasker2}
        mask={{ closable: false }}
        destroyOnHidden
        wrapClassName="standard-modal-1"
        className={`${formMasker ? 'dd_modal_show_masker' : ''}`}
      >
        <Spin spinning={formMasker} description="Loading...">
          <DDBaseForm
            form={form}
            items={formItems}
            config={{
              form_layout_type: formLayoutType,
              form_label_input_layout: formLabelLayout,
              form_style: formConfig.form_style,
            }}
            initialValues={{}}
            otherParam={{
              module_key: config?.module_key,
            }}
          />
        </Spin>
      </Modal>
    );
  };

  // 渲染详情弹窗
  const renderDetailModal = () => {
    if (!formItems || formItems.length === 0) return null;

    const formWidth = formConfig?.width || formConfig?.form_width || 600;

    return (
      <Modal
        title={`${formConfig?.form_title || ''}详情`}
        open={detailVisible}
        width={formWidth}
        cancelText="关闭"
        footer={null}
        onCancel={handleCloseDetail}
        wrapClassName="standard-modal-1"
        className={`${detailLoading ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
        destroyOnHidden
      >
        <Spin spinning={detailLoading} description="Loading...">
          <DDDescriptions
            config={{
              form_items: formItems,
              form_value: detailData || {},
            }}
          />
        </Spin>
      </Modal>
    );
  };

  // 渲染过滤面板
  const renderFilterPanel = () => {
    if (!filterPanelVisible || !filterColumn) return null;

    const filterType = filterColumn.render?.type === 'number' ? 'number' : filterColumn.render?.type === 'date' ? 'date' : 'text';
    const isNumber = filterType === 'number';
    const isDate = filterType === 'date';

    // 检查是否已有该列的过滤规则
    const existingRule = filterRules.find((r) => r.field === filterColumn.field);
    // 优先使用 filterValue（用户当前输入），否则使用已保存的规则值
    const currentValue = filterValue || existingRule?.value || '';

    return (
      <div
        className="dd-vtable-filter-panel"
        style={{
          position: 'fixed',
          top: filterPanelPosition.top,
          left: filterPanelPosition.left,
          width: Math.max(filterPanelPosition.width + 100, 220),
          minHeight: 120,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
          border: '1px solid #e8e8e8',
          zIndex: 1000,
          padding: 12,
          overflow: 'visible',
          pointerEvents: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div style={{ fontWeight: 500, marginBottom: 8, color: '#333' }}>
          过滤: {filterColumn.title}
        </div>

        {/* 文本类型 - 模糊搜索 */}
        {filterType === 'text' && (
          <input
            type="text"
            placeholder="请输入关键词"
            value={currentValue as string}
            onChange={(e) => setFilterValue(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        )}

        {/* 数值类型 - 范围输入 */}
        {isNumber && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              type="number"
              placeholder="最小值"
              value={(currentValue as { min?: number })?.min ?? ''}
              onChange={(e) =>
                setFilterValue({
                  ...(currentValue as object),
                  min: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                padding: '6px 10px',
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <input
              type="number"
              placeholder="最大值"
              value={(currentValue as { max?: number })?.max ?? ''}
              onChange={(e) =>
                setFilterValue({
                  ...(currentValue as object),
                  max: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                padding: '6px 10px',
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        {/* 日期类型 - 范围输入 */}
        {isDate && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              type="date"
              placeholder="开始日期"
              value={(currentValue as { min?: string })?.min ?? ''}
              onChange={(e) =>
                setFilterValue({
                  ...(currentValue as object),
                  min: e.target.value || undefined,
                })
              }
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                padding: '6px 10px',
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <input
              type="date"
              placeholder="结束日期"
              value={(currentValue as { max?: string })?.max ?? ''}
              onChange={(e) =>
                setFilterValue({
                  ...(currentValue as object),
                  max: e.target.value || undefined,
                })
              }
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                padding: '6px 10px',
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        {/* 操作按钮 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <button
            onClick={() => {
              // 清除过滤
              const newRules = filterRules.filter((r) => r.field !== filterColumn.field);
              setFilterRules(newRules);
              if (onFilter) {
                onFilter(newRules);
              }
              setFilterPanelVisible(false);
            }}
            style={{
              padding: '4px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              background: '#fff',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            清除
          </button>
          <button
            onClick={() => {
              // 应用过滤
              const newRule: DDVTableFilterRule = {
                field: filterColumn.field,
                filter_type: filterType,
                value: filterValue,
              };
              const newRules = [...filterRules.filter((r) => r.field !== filterColumn.field), newRule];
              setFilterRules(newRules);
              if (onFilter) {
                onFilter(newRules);
              }
              setFilterPanelVisible(false);
            }}
            style={{
              padding: '4px 12px',
              border: 'none',
              borderRadius: 4,
              background: '#1890ff',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            确定
          </button>
        </div>
      </div>
    );
  };

  // 构建操作列配置
  const getHandleColumn = useCallback(() => {
    const handleColumnsConfig = config?.grid_handle_columns_default;
    if (!handleColumnsConfig) return null;

    // 计算操作列宽度
    let colWidth = 0;
    if (handleColumnsConfig.edit) colWidth += 45;
    if (handleColumnsConfig.delete) colWidth += 45;
    if (handleColumnsConfig.detail) colWidth += 45;

    // 如果没有配置任何按钮，不显示操作列
    if (colWidth === 0) return null;

    return {
      field: 'handleCol',
      title: '操作',
      width: colWidth,
      pinned: 'right',
      customLayout: (args: any) => {
        const { table, row, col, rect } = args;
        const record = table.getCellOriginRecord(col, row);

        // 统计行或无数据时不显示操作列
        if (!record) {
          return {
            rootContainer: createGroup({ width: 0, height: 0 }),
            renderDefault: false,
          };
        }

        const { height, width } = rect ?? table.getCellRect(col, row);
        const container = createGroup({
          height,
          width,
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          justifyContent: 'center',
        });

        // 收集所有要显示的按钮配置
        const buttonConfigs: { text: string; actionType: string; index: number }[] = [];
        if (handleColumnsConfig.edit) buttonConfigs.push({ text: '编辑', actionType: 'edit', index: 0 });
        if (handleColumnsConfig.delete) buttonConfigs.push({ text: '删除', actionType: 'delete', index: 1 });
        if (handleColumnsConfig.detail) buttonConfigs.push({ text: '详情', actionType: 'detail', index: 2 });

        // 使用 VGroup 包裹每个按钮，通过 boundsPadding 实现 10px 间距
        buttonConfigs.forEach((btnConfig, btnIndex) => {
          const btnGroup = createGroup({
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boundsPadding: [0, btnIndex < buttonConfigs.length - 1 ? 10 : 0, 0, 0],
          });

          const btnText = createText({
            text: btnConfig.text,
            fontSize: 12,
            fill: '#0a6ed1',
            cursor: 'pointer',
          });
          // 添加 actionType 用于点击识别
          (btnText as any).attribute.actionType = btnConfig.actionType;

          btnGroup.add(btnText);
          container.add(btnGroup);
        });

        return {
          rootContainer: container,
          renderDefault: false,
        };
      },
    };
  }, [config?.grid_handle_columns_default]);

  // 计算统计行总数（去重）
  const bottomFrozenRowCount = useMemo(() => {
    if (!config?.grid_columns || !settingConfig.showSummary) return 0;

    const aggregationTypes = new Set<string>();
    config.grid_columns
      .filter((col: DDVTableColumn) => !col.hidden)
      .forEach((col: DDVTableColumn) => {
        if (col.sum) aggregationTypes.add('SUM');
        if (col.min) aggregationTypes.add('MIN');
        if (col.max) aggregationTypes.add('MAX');
        if (col.avg) aggregationTypes.add('AVG');
      });

    return aggregationTypes.size;
  }, [config?.grid_columns, settingConfig.showSummary]);

  // 构建 VTable 列配置
  const columns = useMemo(() => {
    if (!config?.grid_columns) return [];

    // 性能模式：只返回最基础的列配置，跳过所有复杂处理
    if (config.grid_config?.grid_performance_mode) {
      return config.grid_columns
        .filter((col: any) => col.hidden !== true)
        .map((col: any): Record<string, any> => ({
          field: col.field,
          title: col.title,
          width: col.width || 100,
        }));
    }

    const order = settingConfig.columnOrder || [];
    const visibility = settingConfig.columnVisibility || {};

    // 收集所有列配置的统计类型，按固定顺序（SUM → MIN → MAX → AVG）
    const fixedOrder = ['SUM', 'MIN', 'MAX', 'AVG'] as const;
    const neededAggregationTypes: string[] = [];
    if (settingConfig.showSummary) {
      const neededTypes = new Set<string>();
      config.grid_columns?.forEach((col: DDVTableColumn) => {
        if (col.sum) neededTypes.add('SUM');
        if (col.min) neededTypes.add('MIN');
        if (col.max) neededTypes.add('MAX');
        if (col.avg) neededTypes.add('AVG');
      });
      // 按固定顺序输出
      fixedOrder.forEach((type) => {
        if (neededTypes.has(type)) {
          neededAggregationTypes.push(type);
        }
      });
    }

    // 根据配置排序并过滤列
    const sortedColumns = [...config.grid_columns].sort((a, b) => {
      const idxA = config.grid_columns.indexOf(a);
      const idxB = config.grid_columns.indexOf(b);
      const keyA = `${a.field}_${idxA}`;
      const keyB = `${b.field}_${idxB}`;
      const posA = order.indexOf(keyA);
      const posB = order.indexOf(keyB);
      if (posA === -1) return 1;
      if (posB === -1) return -1;
      return posA - posB;
    });

    return sortedColumns
      .filter((col: DDVTableColumn) => {
        // 使用列在原始 config.grid_columns 中的索引
        const originalIndex = config.grid_columns.indexOf(col);
        const fieldKey = `${col.field}_${originalIndex}`;
        return !col.hidden && visibility[fieldKey] !== false;
      })
      .map((col: DDVTableColumn) => {
      const vtableCol: Record<string, any> = {
        title: col.title,
        field: col.field,
        width: col.width ?? 'auto',
        sort: col.sort ?? false,
      };

      // 应用对齐方式
      if (col.align) {
        vtableCol.style = { textAlign: col.align };
      }

      // 构建聚合配置（统计行）- 使用固定顺序 SUM -> MIN -> MAX -> AVG
      // 统计类型到显示文本的映射
      const aggregationLabels: Record<string, string> = {
        SUM: '合计',
        MIN: '最小',
        MAX: '最大',
        AVG: '平均',
      };

      // 获取格式化函数，用于统计行
      const getFormatter = () => {
        if (!col.render) return null;
        const renderConfig = col.render;
        return (value: any) => {
          if (value === null || value === undefined || value === '') return value;
          if (renderConfig.type === 'number') {
            return formatNumber(value, renderConfig.format);
          } else if (renderConfig.type === 'date') {
            return formatDate(value, renderConfig.format);
          } else if (renderConfig.type === 'custom' && renderConfig.format && customFormatters?.[renderConfig.format]) {
            return customFormatters[renderConfig.format](value);
          }
          return value;
        };
      };
      const formatter = getFormatter();

      // 根据实际配置的统计类型构建 aggregation
      const aggregation: any[] = [];

      // 使用之前收集的 neededAggregationTypes，只包含实际需要的统计类型
      neededAggregationTypes.forEach((type) => {
        const typeKey = type.toLowerCase() as 'sum' | 'min' | 'max' | 'avg';
        const configKey = typeKey;

        if (col[configKey]) {
          // 该列配置了此统计类型，使用格式化函数
          aggregation.push({ aggregationType: type, formatFun: formatter });
        } else {
          // 该列未配置此统计类型，formatFun 返回空
          aggregation.push({
            aggregationType: type,
            formatFun: () => '',
          });
        }
      });

      // 如果有聚合配置且显示统计行，添加到列配置中
      if (settingConfig.showSummary && aggregation.length > 0) {
        vtableCol.aggregation = aggregation;
      }

      // 应用渲染配置（格式化）
      if (col.render) {
        const renderConfig = col.render;
        // 复制功能：添加复制图标（统计行不显示）
        if (renderConfig.type === 'copy') {
          vtableCol.icon = (args: any) => {
            const { col: colIndex, row, table } = args;
            const record = table.getCellOriginRecord(colIndex, row);
            // 统计行不显示复制图标
            if (!record) {
              return '';
            }
            return {
              name: 'dd-copy',
              type: 'svg',
              // 复制图标
              svg: '<svg width="14" height="14" viewBox="0 0 16 16" fill="#1890ff" xmlns="http://www.w3.org/2000/svg"><path d="M4 2h7l2 2v9h-9V2zm2 2v5h5V4H6l2-2h-2z"/><path d="M11 3H9.5v1H11v1h1v1.5h1V4h-1V3h-1z"/><path d="M12 6.5h-2v1H7v1h3v-1H9v-.5h3v1h-.5v-1H12v.5z"/></svg>',
              width: 16,
              height: 16,
              positionType: VTable.TYPES.IconPosition.left,
              marginRight: 4,
              cursor: 'pointer',
            };
          };
          // 复制列样式（文字蓝色）
          vtableCol.style = {
            ...vtableCol.style,
            textAlign: 'left',
            fill: '#1890ff',
            cursor: 'pointer',
          };
        }
        vtableCol.fieldFormat = (rec: any) => {
          const value = rec[col.field];
          if (value === null || value === undefined || value === '') {
            return value;
          }
          if (renderConfig.type === 'number') {
            return formatNumber(value, renderConfig.format);
          } else if (renderConfig.type === 'date') {
            return formatDate(value, renderConfig.format);
          } else if (renderConfig.type === 'custom' && renderConfig.format && customFormatters?.[renderConfig.format]) {
            return customFormatters[renderConfig.format](value);
          } else if (renderConfig.type === 'code_table' && renderConfig.key) {
            // 码表映射：根据 key 获取码表显示值，未匹配到则显示原始值
            const codeVal = myUtil.code.getCodeValByKey(value, renderConfig.key);
            return codeVal || value;
          }
          return value;
        };
      }

      // 保留其他自定义配置（排除统计相关属性和对齐方式和渲染配置和titleTooltip和filter）
      Object.keys(col).forEach((key) => {
        if (!['title', 'field', 'width', 'sort', 'sum', 'min', 'max', 'avg', 'align', 'render', 'hidden', 'titleTooltip', 'filter'].includes(key)) {
          vtableCol[key] = col[key];
        }
      });

      // 处理 titleTooltip 列头说明
      if (col.titleTooltip) {
        // 字符串类型：使用问号图标和 tooltip
        vtableCol.headerIcon = [
          {
            name: 'dd-tooltip',
            type: 'svg',
            svg: '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6" fill="#999" opacity="0.2"/><text x="8" y="11" text-anchor="middle" fill="#666" font-size="10" font-weight="bold">?</text></svg>',
            width: 14,
            height: 14,
            positionType: VTable.TYPES.IconPosition.right,
            marginLeft: 4,
            cursor: 'pointer',
            tooltip: {
              style: {
                arrowMark: true,
              },
              title: col.titleTooltip,
              placement: VTable.TYPES.Placement.right,
            },
          },
        ];
      }

      // 处理 filter 过滤图标
      if (col.filter) {
        // 检查该列是否已有过滤规则
        const hasFilterRule = filterRules.some((rule) => rule.field === col.field);
        const isFiltered = hasFilterRule;

        const filterIcon = {
          name: isFiltered ? 'filtered' : 'filter',
          type: 'svg',
          width: 16,
          height: 16,
          svg: isFiltered
            ? '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z" fill="#1296db"/></svg>'
            : '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z" fill="#999"/></svg>',
          positionType: VTable.TYPES.IconPosition.right,
          marginLeft: 4,
          cursor: 'pointer',
        };
        // 如果已有 headerIcon，追加到数组末尾
        if (vtableCol.headerIcon) {
          vtableCol.headerIcon.push(filterIcon as any);
        } else {
          vtableCol.headerIcon = [filterIcon];
        }
      }

      return vtableCol;
    });
  }, [config, customFormatters, settingConfig.showSummary, settingConfig.columnOrder, settingConfig.columnVisibility, filterRules]);

  // 操作列配置
  const handleColumn = useMemo(() => getHandleColumn(), [getHandleColumn]);

  // 构建完整的 VTable 配置
  const option = useMemo(() => {
    // 性能模式：直接返回最简配置，跳过所有复杂处理
    if (config?.grid_config?.grid_performance_mode) {
      return {
        ...defaultConfig,
        columns,
      };
    }

    const baseOption: Record<string, any> = {
      ...defaultConfig,
      columns,
    };

    // 应用设置配置 - 列表紧凑程度（通过 padding 控制）
    const sizeConfig: Record<DDVTableSizeType, { fontSize: number; padding: [number, number, number, number] }> = {
      compact: { fontSize: 13, padding: [8, 6, 8, 6] },
      default: { fontSize: 14, padding: [11, 6, 11, 6] },
      loose: { fontSize: 14, padding: [16, 6, 16, 6] },
    };
    // 兼容处理：如果 size 不存在或不在配置中，使用 default
    const sizeKey = (settingConfig.size && sizeConfig[settingConfig.size]) ? settingConfig.size : 'default';
    const currentSize = sizeConfig[sizeKey];
    // 使用 'auto' 行高
    baseOption.defaultRowHeight = 'auto';
    baseOption.defaultHeaderRowHeight = 'auto';
    baseOption.theme = VTable.themes.DEFAULT.extends({
      ...defaultConfig.theme?.exts?.[0]?.defaultStyle,
      defaultStyle: {
        fontFamily: 'Microsoft YaHeu, 微软雅黑, PingFang SC, sans-serif',
        fontSize: currentSize.fontSize,
        padding: currentSize.padding,
      },
      headerStyle: {
        fontFamily: 'Microsoft YaHeu, 微软雅黑, PingFang SC, sans-serif',
        fontSize: currentSize.fontSize,
        padding: currentSize.padding,
      },
      bodyStyle: {
        fontFamily: 'Microsoft YaHeu, 微软雅黑, PingFang SC, sans-serif',
        fontSize: currentSize.fontSize,
        padding: currentSize.padding,
      },
      // 滚动条样式配置
      scrollStyle: {
        visible: 'always',
        width: 8,
        scrollSliderColor: '#c1c1c1',
        scrollRailColor: '#f0f0f0',
        scrollSliderCornerRadius: 4,
        barToSide: false,
      },
    });

    // 应用配置覆盖
    if (config) {
      // 可选冻结的最大列数 - 优先使用设置配置，否则使用 config 配置
      baseOption.allowFrozenColCount = settingConfig.allowFrozenColCount ?? config.grid_config?.grid_allow_frozen_col_count ?? 5;
      // 冻结列数 - 优先使用设置配置，否则使用 config 配置
      baseOption.frozenColCount = settingConfig.frozenColCount ?? config.grid_config?.grid_frozen_col_count ?? 0;
      if (config.grid_config?.grid_show_frozen_icon !== undefined) {
        baseOption.showFrozenIcon = config.grid_config.grid_show_frozen_icon;
      }
      // 设置底部冻结行数（统计行）- 优先使用设置配置
      if (settingConfig.showSummary && bottomFrozenRowCount > 0) {
        baseOption.bottomFrozenRowCount = bottomFrozenRowCount;
      }
      // 行序号配置 - 当为 true 时手动添加行号列
      if (config.grid_config?.grid_row_series_number === true) {
        // 手动添加行号列，不使用 rowSeriesNumber 属性
      } else if (typeof config.grid_config?.grid_row_series_number === 'object') {
        // 使用自定义行序号配置
        baseOption.rowSeriesNumber = config.grid_config.grid_row_series_number;
      }
      // 自动换行配置 - 优先使用设置配置，否则使用 config 配置
      // debugger;
      if (settingConfig.autoWrapText !== undefined) {
        baseOption.autoWrapText = settingConfig.autoWrapText;
      } else if (config.grid_config?.grid_auto_wrap_text !== undefined) {
        baseOption.autoWrapText = config.grid_config.grid_auto_wrap_text;
      }
      // baseOption.autoWrapText = false;

      // 允许 config 中传入其他 VTable 配置
      Object.keys(config).forEach((key) => {
        if (!['grid_columns', 'grid_config', 'grid_handle_columns_default', 'gridSelectionType', 'toolbar_default', 'api_config', 'form_config'].includes(key)) {
          baseOption[key] = config[key];
        }
      });
    }

    // 构建列数组
    let finalColumns = [...columns];

    // 添加操作列 - 优先使用设置配置，否则检查是否有操作列配置
    if (handleColumn) {
      const showHandleColumn = settingConfig.showHandleColumn ?? true;
      if (showHandleColumn) {
        finalColumns = [...finalColumns, handleColumn];
        baseOption.rightFrozenColCount = 1;
      }
    }

    // 选择类型配置（复选框/单选框）- 优先使用设置配置，否则使用 config 配置
    const selectionType = settingConfig.selectionType ?? config?.grid_config?.grid_selection_type;

    // 构建选择列（checkbox/radio）
    let selectionColumn: Record<string, any> | null = null;
    if (selectionType === 'checkbox') {
      selectionColumn = {
        field: '',
        title: '',
        width: 50,
        cellType: 'checkbox',
        headerType: 'checkbox',
        frozenCol: 'left',
        disable: (param: any) => {
          const { bottomFrozenRowCount } = param.table.options;
          // 数据行数 = 总行数 - 底部冻结行（统计行）
          const dataLength = (param.table.rowCount || 0) - (bottomFrozenRowCount || 0);
          return param.row >= dataLength;
        },
        // hide: true,
      };
    } else if (selectionType === 'radio') {
      selectionColumn = {
        field: '',
        title: '',
        width: 50,
        cellType: 'radio',
        // headerType: 'radio', // radio 不需要表头全选配置
        frozenCol: 'left',
      };
    }

    // 添加选择列到最前面
    if (selectionColumn) {
      finalColumns = [selectionColumn, ...finalColumns];
      // 保留用户设置的冻结列数，确保选择列也能冻结
      baseOption.frozenColCount = Math.max(baseOption.frozenColCount || 0, 1);
    }

    // 手动添加行号列（当 settingConfig.showIndex=true 时）- 添加到选择列后面
    if (settingConfig.showIndex) {
      const rowNumberColumn: Record<string, any> = {
        field: '_dd_row_number_',
        title: '序号',
        width: 100,
        fieldFormat: (_data: any, _col: number, row: number, _table: any) => {
          return row;
        },
      };
      if (selectionColumn) {
        // 有 checkbox/radio 时，行号列添加到第二列
        finalColumns = [finalColumns[0], rowNumberColumn, ...finalColumns.slice(1)];
        // 保留用户设置的冻结列数，确保选择列和行号列都能冻结
        baseOption.frozenColCount = Math.max(baseOption.frozenColCount || 0, 2);
      } else {
        // 没有 checkbox/radio 时，添加到最前面
        finalColumns = [rowNumberColumn, ...finalColumns];
      }
    }

    // 为第一列添加统计类型标签显示
    if (settingConfig.showSummary && bottomFrozenRowCount > 0 && finalColumns.length > 0) {
      // 统计类型到显示文本的映射
      const aggregationLabels: Record<string, string> = {
        SUM: '合计',
        MIN: '最小',
        MAX: '最大',
        AVG: '平均',
      };

      // 确定统计标签应该放在哪一列
      let labelColIndex = -1;
      let needCopyAggregation = false;

      if (settingConfig.showIndex) {
        // 如果开启了序号显示，优先放在序号列
        // 序号列索引：有 selectionColumn 时在 index=1，否则在 index=0
        labelColIndex = selectionColumn ? 1 : 0;
        needCopyAggregation = true;
      }

      // 如果没有序号列，则放在第一列数据列
      if (labelColIndex === -1) {
        if (selectionColumn) {
          labelColIndex = settingConfig.showIndex ? 2 : 1;
        } else if (settingConfig.showIndex) {
          labelColIndex = 1;
        } else {
          labelColIndex = 0;
        }
      }

      const labelCol = finalColumns[labelColIndex];

      // 如果需要从其他列复制 aggregation 配置
      if (needCopyAggregation && !labelCol?.aggregation) {
        // 找到第一列数据列的 aggregation
        let firstDataColIndex = labelColIndex + 1;
        const firstDataCol = finalColumns[firstDataColIndex];
        if (firstDataCol?.aggregation) {
          // 复制 aggregation 配置到序号列
          labelCol.aggregation = firstDataCol.aggregation;
        }
      }

      if (labelCol?.aggregation) {
        // 修改对应列的 aggregation，让 formatFun 返回统计类型标签
        labelCol.aggregation = labelCol.aggregation.map((agg: any) => ({
          ...agg,
          formatFun: () => aggregationLabels[agg.aggregationType] || '',
        }));
      }
    }

    baseOption.columns = finalColumns;

    return baseOption;
  }, [config, columns, handleColumn, bottomFrozenRowCount, settingConfig]);

  // 统一处理数据更新和过滤 - 避免重复调用 setRecords
  useEffect(() => {
    // 获取当前数据源（API 模式使用 apiTableData，直接数据模式使用 data）
    const currentData = isApiMode ? apiTableData : data;
    if (!tableRef.current || !currentData) return;

    const allRecords = currentData.rows || [];

    if (filterRules.length === 0) {
      // 没有过滤规则，显示全部数据
      tableRef.current.setRecords(allRecords);
      setFilteredCount(undefined);
    } else {
      // 有过滤规则，进行过滤
      const filteredRecords = allRecords.filter((record) => {
        return filterRules.every((rule) => {
          const value = record[rule.field];
          if (value === null || value === undefined) return true;

          if (rule.filter_type === 'text') {
            // 文本类型 - 模糊搜索
            const filterValue = rule.value as string;
            if (!filterValue) return true;
            return String(value).toLowerCase().includes(filterValue.toLowerCase());
          } else if (rule.filter_type === 'number') {
            // 数值类型 - 范围过滤
            const range = rule.value as { min?: number; max?: number };
            const numValue = Number(value);
            if (isNaN(numValue)) return true;
            if (range.min !== undefined && numValue < range.min) return false;
            if (range.max !== undefined && numValue > range.max) return false;
            return true;
          } else if (rule.filter_type === 'date') {
            // 日期类型 - 范围过滤
            const range = rule.value as { min?: string; max?: string };
            const dateValue = new Date(value).getTime();
            if (isNaN(dateValue)) return true;
            if (range.min) {
              const minDate = new Date(range.min).getTime();
              if (dateValue < minDate) return false;
            }
            if (range.max) {
              // 结束日期设置为当天23:59:59
              const maxDate = new Date(range.max);
              maxDate.setHours(23, 59, 59, 999);
              if (dateValue > maxDate.getTime()) return false;
            }
            return true;
          }
          return true;
        });
      });
      tableRef.current.setRecords(filteredRecords);
      setFilteredCount(filteredRecords.length);
    }
  }, [data, filterRules, apiTableData, isApiMode]);

  // 点击外部关闭过滤面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterPanelVisible) {
        const target = event.target as HTMLElement;
        // 检查点击是否在过滤面板内
        if (target.closest('.dd-vtable-filter-panel') === null) {
          setFilterPanelVisible(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterPanelVisible]);

  // 表格就绪回调
  const handleReady = useCallback(
    (tableInstance: any) => {
      tableRef.current = tableInstance;

      // 注册选择变化事件 - 优先使用设置配置，否则使用 config 配置
      const selectionType = settingConfig.selectionType ?? config?.grid_config?.grid_selection_type;
      if (selectionType && onSelectionChange) {
        tableInstance.on('change_selection', (args: any) => {
          const selectedRowIds = tableInstance.getSelectedRowIds();
          const selectedRecords = tableInstance.getSelectedRecords();
          onSelectionChange(selectedRecords, selectedRowIds);
        });
      }

      // 注册过滤图标点击事件
      tableInstance.on('icon_click', (args: any) => {
        const { col, row, name } = args;
        // 同时响应 'filter' 和 'filtered' 两个图标
        if (name === 'filter' || name === 'filtered') {
          // 获取点击的列信息
          const field = tableInstance.getHeaderField(col, row);
          const colConfig = config?.grid_columns?.find((c: DDVTableColumn) => c.field === field);

          if (colConfig) {
            // 获取单元格位置（需要考虑滚动偏移）
            const cellRect = tableInstance.getCellRect(col, row);
            // 获取滚动位置
            const scrollLeft = tableInstance.scrollLeft || 0;
            const scrollTop = tableInstance.scrollTop || 0;

            // 获取表格容器的绝对位置（相对于视口）
            const tableContainer = tableInstance.getElement?.();
            let tableTop = 0, tableLeft = 0;
            if (tableContainer) {
              const rect = tableContainer.getBoundingClientRect?.();
              if (rect) {
                tableTop = rect.top;
                tableLeft = rect.left;
              }
            }

            setFilterColumn(colConfig);

            // 计算绝对坐标：表格位置 + (单元格位置 - 滚动偏移)
            const panelLeft = tableLeft + cellRect.left - scrollLeft;
            const panelTop = tableTop + cellRect.top - scrollTop + cellRect.height;

            setFilterPanelPosition({
              top: panelTop,
              left: panelLeft,
              width: cellRect.width,
            });
            // 恢复当前过滤值到输入框
            const existingRule = filterRules.find((r) => r.field === colConfig.field);
            setFilterValue(existingRule?.value ?? '');
            setFilterPanelVisible(true);
          }
        }
      });

      if (onReady) {
        onReady(tableInstance);
      }
    },
    [config?.grid_config?.grid_selection_type, settingConfig.selectionType, onReady, onSelectionChange, filterRules, config],
  );

  // 检查是否有任何按钮需要显示
  const showToolbar = Object.values(toolbarConfig).some((v) => v === true);

  // ==================== 删除处理逻辑 ====================

  /** 执行删除请求（可复用的删除核心逻辑） */
  const performDelete = useCallback(
    async (uuidValues: string[], deleteApiUrl: string | undefined, content: string) => {
      if (!deleteApiUrl) {
        message.error('未配置删除 API');
        return false;
      }

      // 构建完整 API 地址
      const fullApiUrl = buildFullApiUrl(deleteApiUrl);
      console.log('[删除] 完整URL:', fullApiUrl, ', 参数:', { uuids: uuidValues });

      try {
        const response = await request(fullApiUrl, {
          method: 'POST',
          data: { uuids: uuidValues },
        });
        console.log('[删除] 响应:', response);
        console.log('[删除] code:', response?.code, ', msg:', response?.msg);

        // 处理返回结果
        if (response?.code === '200' || response?.code === 200) {
          message.success(response?.msg || `删除 ${uuidValues.length} 条数据成功`);
          return true;
        } else {
          message.error(response?.msg || `删除失败，状态码: ${response?.code}`);
          return false;
        }
      } catch (error: any) {
        console.error('[删除] 请求错误:', error);
        console.error('[删除] 错误响应:', error?.response?.data);
        message.error(error?.response?.data?.msg || error?.message || '删除失败');
        return false;
      }
    },
    [buildFullApiUrl],
  );

  /** 处理行删除操作（单行删除） */
  const handleRowDelete = useCallback(
    async (rowData: any) => {
      const gridRowKey = config?.grid_config?.grid_row_key || 'id';
      const uuidValue = rowData[gridRowKey];

      console.log('[删除] gridRowKey:', gridRowKey, ', uuidValue:', uuidValue);
      console.log('[删除] formConfig:', formConfig);
      console.log('[删除] getDeleteApiUrl():', getDeleteApiUrl());

      if (!uuidValue) {
        message.error('无法获取删除所需的主键值');
        return;
      }

      // 弹窗确认
      Modal.confirm({
        title: '确认删除',
        content: '确定要删除选择的数据吗？',
        onOk: async () => {
          const success = await performDelete([uuidValue], getDeleteApiUrl(), '删除选择的数据');
          if (success) {
            // 刷新列表
            loadData();
          }
        },
      });
    },
    [formConfig, getDeleteApiUrl, performDelete, loadData],
  );

  /** 处理批量删除操作（多行删除） */
  const handleBatchDelete = useCallback(
    async (selectedData: any[]) => {
      if (!selectedData || selectedData.length === 0) {
        message.warning('请先选择要删除的数据');
        return;
      }

      const gridRowKey = config?.grid_config?.grid_row_key || 'id';
      // 提取所有选中行的主键值
      const uuidValues = selectedData.map((row) => row[gridRowKey]).filter(Boolean);

      if (uuidValues.length === 0) {
        message.error('无法获取删除所需的主键值');
        return;
      }

      console.log('[批量删除] gridRowKey:', gridRowKey);
      console.log('[批量删除] 选中数据:', selectedData);
      console.log('[批量删除] uuidValues:', uuidValues);
      console.log('[批量删除] getDeleteApiUrl():', getDeleteApiUrl());

      // 弹窗确认
      Modal.confirm({
        title: '确认删除',
        content: `确定要删除选择的 ${uuidValues.length} 条数据吗？`,
        onOk: async () => {
          const success = await performDelete(uuidValues, getDeleteApiUrl(), '删除选择的数据');
          if (success) {
            // 刷新列表
            loadData();
          }
        },
      });
    },
    [formConfig, getDeleteApiUrl, performDelete, loadData],
  );

  // 处理单元格点击（包含操作列按钮点击）
  const handleCellClick = useCallback(
    (args: any) => {
      const { col, row, target } = args;

      // 检查是否是复制图标点击
      const targetIcon = args?.targetIcon;
      if (targetIcon?.name === 'dd-copy' && tableRef.current) {
        const value = tableRef.current.getCellValue(col, row);
        if (value !== null && value !== undefined) {
          // 复制到剪贴板
          const textToCopy = String(value);
          navigator.clipboard.writeText(textToCopy).then(() => {
            message.success(`已复制: ${textToCopy}`);
          }).catch(() => {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            message.success(`已复制: ${textToCopy}`);
          });
        }
        return;
      }

      // 检查是否是操作列的按钮点击
      const actionType = target?.attribute?.actionType;
      if (actionType && tableRef.current) {
        const record = tableRef.current.getCellOriginRecord(col, row);
        const rowData = record;

        switch (actionType) {
          case 'edit':
            // 如果配置了表单字段，自动弹出编辑表单
            if (config?.form_items) {
              handlePopupEdit(rowData);
            }
            // 调用外部回调
            if (onRowEdit) {
              onRowEdit(rowData, tableRef.current);
            }
            return;
          case 'delete':
            if (onRowDelete) {
              onRowDelete(rowData, tableRef.current);
            } else {
              // 默认调用内置删除处理
              handleRowDelete(rowData);
            }
            return;
          case 'detail':
            if (onRowDetail) {
              onRowDetail(rowData, tableRef.current);
            } else {
              // 默认处理：显示详情弹窗
              handleShowDetail(rowData);
            }
            return;
        }
      }

      // 其他单元格点击，调用原始回调
      if (onCellClick) {
        onCellClick(args);
      }
    },
    [onCellClick, onRowEdit, onRowDelete, onRowDetail, handlePopupEdit, handleRowDelete, formConfig],
  );

  return (
    <div ref={containerRef}
      // style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}
    >
      {/* 筛选组件 - 配置了 filter_items 时显示 */}
      {hasFilter && (
        <Card variant="borderless" className="dd-filter-wrap">
          <DDFilter
            form={filterForm}
            items={filterItems}
            onSubmit={handleFilterSubmit}
            onReset={handleFilterReset}
          />
        </Card>
      )}
      {showToolbar && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0px',
            // borderBottom: '1px solid #f0f0f0',
            // background: '#fff',
          }}
        >
          <div style={{ color: '#999', fontSize: 14 }}>
            {config?.grid_config?.grid_title && (
              <span style={{ marginRight: 8, color: '#333' }}>
                {config.grid_config.grid_title}
              </span>
            )}
            共 {filteredCount !== undefined ? filteredCount : finalData?.rows?.length || 0} 条
          </div>
          <Space size={8}>
            {renderMainButtonGroup()}
            {renderSystemMenu()}
          </Space>
        </div>
      )}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Card variant="borderless" className="dd-grid-wrap">
          <Spin spinning={codeTableLoading}>
            <ListTable
              option={option}
              records={finalData?.rows || []}
              height={(showToolbar || hasFilter) ? (typeof tableHeight === 'number' ? tableHeight - 56 : tableHeight) : tableHeight}
              onReady={handleReady}
              onClickCell={handleCellClick}
              onSort={(args) => {
                // API 模式：联动后端排序
                if (isApiMode && args.field && args.order && args.order !== 'normal') {
                  handleApiSortChange(args.field, args.order === 'asc' ? 'asc' : 'desc');
                }
                // 调用外部回调
                onSort?.(args);
              }}
            />
          </Spin>
        </Card>
      </div>
      {/* 加载状态遮罩（仅 API 模式显示） */}
      {isApiMode && loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <span>加载中...</span>
        </div>
      )}
      {renderFilterPanel()}
      {renderSettingModal()}
      {renderFormModal()}
      {renderDetailModal()}
    </div>
  );
};

export default DDVTable;
