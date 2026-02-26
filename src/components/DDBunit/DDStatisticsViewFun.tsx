import myUtil from '../DDAssist/util';
import { cloneDeep } from 'lodash';
import CONSTANTS from '../DDAssist/constants';
import { Button, Tooltip, Dropdown } from 'antd';
import { DeleteOutlined, DownOutlined } from '@ant-design/icons';

const Func: any = {
  defaultStatisticsName: '新建临时方案', // 默认方案名称
};

// 通用指标参数
Func.defaultIndicatorConfig = {
  width: 'auto',
  // showSort: false,
  style: {
    textAlign: 'right',
    fontSize: '14',
    borderColor: '#9c9c9c',
    fontWeight:  (arg: any) => {
      const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
      if (rowHeaderPaths?.[1]?.value === '行小计') {
        return 'bold';
      } else if (rowHeaderPaths?.[0]?.value === '行总计') {
        return 'bold';
      }
      return 'normal';
    },
    color: (arg: any) => {
      const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
      if (rowHeaderPaths?.[1]?.value === '行小计') {
        return '#0a6ed1';
      } else if (rowHeaderPaths?.[0]?.value === '行总计') {
        return '#882700';
      }
      if (arg.dataValue > 0) {
        return 'black';
      } else if (Number(arg.dataValue) === 0) {
        return '#8f8f8f';
      };
      return 'red';
    },
    bgColor(arg: any) {
      const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
      const colHeaderPaths = arg.cellHeaderPaths.colHeaderPaths;
      if (rowHeaderPaths?.[1]?.value === '行小计') {
        return '#ededed';
      } else if (rowHeaderPaths?.[0]?.value === '行总计') {
        return '#e0e0e0';
      }
      if (colHeaderPaths?.[0]?.value === '列总计') {
        return '#ededed';
      }
      return '#fff';
    },
    padding: [0, 16, 0, 16],
  },
  headerStyle: {
    borderColor: '#9c9c9c',
    textStick: true,
    fontSize: '14',
    bgColor: (arg: any) => {
      return '#ededed70';
    }
  },
}

// 通用指标索引
Func.defaultIndicatorMap = [
  {value: 'SUM', label: '合计', defaultSelected: true},
  {value: 'MIN', label: '最小', defaultSelected: false},
  {value: 'MAX', label: '最大', defaultSelected: false},
  {value: 'AVG', label: '平均', defaultSelected: false},
  {value: 'COUNT', label: '计数', defaultSelected: false},
];

// 通用指标索引, 默认选择项数组，如 ['SUM']
Func.defaultIndicatorMapForSelect = () => {
  let rulesTmpCurrent1: any = Func.defaultIndicatorMap.filter((item: any) => { return item.defaultSelected });
  let rulesTmpCurrent2: any = [];
  rulesTmpCurrent1.forEach((item: any) => {
    rulesTmpCurrent2.push(item.value);
  });
  return rulesTmpCurrent2;
}

// 打开弹窗: 维度表统计结果 VTable
Func.handleStatistics = ({ refMultipleContainers, setStatisticsResModalVisible, setStatisticsConfig, setStatisticsItems, config, planOnEdit, setStatisticsPlan, func }: any) => {
  let rulesTmp = Func.defaultIndicatorMap;
  const colData: any = refMultipleContainers.current?.get3ColData();
  let selRows = colData.rows || [];
  let selColumns = colData.columns || [];
  let selIndicators = colData.values || [];
  let rows: any = [];
  let columns: any = [];
  let indicatorsCurrent: any = [];
  let indicatorsAll: any = [];
  let subTotalsDimensionsRow: any = [];
  let subTotalsDimensionsColumn: any = [];
  let aggregationRules: any = [];
  for (let i = 0; i < selRows.length; i++) {
    let tmpFieldKey = selRows[i];
    let tmpFieldObj =  config.grid_columns?.find((item: any) => { return item.dataIndex === tmpFieldKey });
    rows.push({
      dimensionKey: tmpFieldKey,
      title: tmpFieldObj?.title,
      width: 'auto',
      headerStyle: {
        fontSize: '14',
        textStick: true,
        borderColor: '#9c9c9c',
        bgColor: (arg: any) => {
          if (arg.dataValue === '行小计') {
            return '#ededed';
          }
          if (arg.dataValue === '行总计') {
            return '#e0e0e0';
          }
          return '#ededed70';
        },
        color: (arg: any) => {
          if (arg.dataValue === '行小计') {
            return '#0a6ed1';
          }
          if (arg.dataValue === '行总计') {
            return '#882700';
          }
          return '#000000';
        },
      },
    })
    if (i !== 0) {
      subTotalsDimensionsRow.push(selRows[0]);
    }
  }
  for (let i = 0; i < selColumns.length; i++) {
    let tmpFieldKey = selColumns[i];
    let tmpFieldObj =  config.grid_columns?.find((item: any) => { return item.dataIndex === tmpFieldKey });
    columns.push({
      dimensionKey: tmpFieldKey,
      title: tmpFieldObj?.title,
      width: 'auto',
      headerStyle: {
        fontSize: '14',
        borderColor: '#9c9c9c',
        textStick: true,
        bgColor: (arg: any) => {
          if (arg.dataValue === '列小计') {
            return '#ededed70';
          }
          return '#ededed70';
        }
      },
    })
    if (i !== 0) {
      subTotalsDimensionsColumn.push(selColumns[0]);
    }
  }
  for (let i = 0; i < selIndicators.length; i++) {
    let tmpFieldKey = selIndicators[i];
    let tmpFieldObj =  config.grid_columns?.find((item: any) => { return item.dataIndex === tmpFieldKey });
    let tmpIndicatorsByRules = [];
    for (let m = 0; m < rulesTmp.length; m++) {
      let tmpIndicator: any = cloneDeep(Func.defaultIndicatorConfig);
      let tmpRule = rulesTmp[m].value; // SUM COUNT MAX MIN AVG
      let tmpFuncIndicator = func?.indicator ? (func?.indicator[tmpFieldObj.dataIndex] || {}) : {}; // 自定义的Indicator func中
      let tmpFuncIndicatorRule = tmpFuncIndicator[tmpRule]; // 自定义的Indicator func中
      if (tmpRule === 'COUNT') {
          tmpIndicator.format = (rec: any) => myUtil.text.formatNum(rec, '0,0');
      } else {
      //   if (func?.indicator[tmpFieldObj.dataIndex][tmpRule]['format']) { // 自定义格式化
      //     tmpIndicator.format = (rec: any) => func?.indicator[tmpFieldObj.dataIndex]?.format(rec);
      //   } else {
      //     if (tmpFieldObj?.render?.type === 'number' && tmpFieldObj?.render?.format) {
      //       tmpIndicator.format = (rec: any) => myUtil.text.formatNum(rec, tmpFieldObj?.render.format);
      //     }
      //   }

        if (tmpFieldObj?.render?.type === 'number' && tmpFieldObj?.render?.format) {
          tmpIndicator.format = (rec: any) => myUtil.text.formatNum(rec, tmpFieldObj?.render.format);
        }
        // debugger;
        if (tmpFuncIndicatorRule?.format) { // 自定义格式化
          tmpIndicator.format = (rec: any) => tmpFuncIndicatorRule?.format(rec);
        }
      }

      let tmpIndicatorKey = `${tmpFieldKey}_${tmpRule}`;
      let tmpIndicatorKeyTitle = `${(tmpFuncIndicatorRule?.title || tmpFieldObj?.title)} ${rulesTmp[m].label}`;
      tmpIndicator = {
        ...tmpIndicator,
        indicatorKey: tmpIndicatorKey,
        title: tmpIndicatorKeyTitle,
        aggregationType: tmpRule,
        // hide: tmpRule === 'SUM' ? false : true,
        sort: true,
      };
      tmpIndicatorsByRules.push(tmpIndicator);
      aggregationRules.push({ indicatorKey: tmpIndicatorKey, field: tmpFieldKey, aggregationType: tmpRule });
    }
    indicatorsAll.push(...tmpIndicatorsByRules);
  }
  let rulesTmpCurrent2: any = Func.defaultIndicatorMapForSelect();
  indicatorsCurrent = indicatorsAll.filter((item: any) => rulesTmpCurrent2.indexOf(item.aggregationType) > -1);
  let tmpConfig: any = {
    ...config,
    api_grid_query: `${myUtil.api.getApiRoot()}${config?.api_grid_query || CONSTANTS.DEFAULT_API.GRID_QUERY}`,
    rows,
    columns,
    indicators: indicatorsCurrent,
    indicatorsAll: indicatorsAll,
    corner: {
      titleOnDimension: 'row',
      headerStyle: {
        textStick: true,
        borderColor: '#9c9c9c',
        fontSize: '14',
        bgColor: (arg: any) => {
          return '#ededed70';
        }
      },
    },
    dataConfig: {
      totals: {
        row: {
          showGrandTotals: true,                //// 页面可配置
          showSubTotals: true,                  //// 页面可配置
          grandTotalLabel: '行总计',
          subTotalLabel: '行小计',
          subTotalsDimensions: subTotalsDimensionsRow,
          showSubTotalsOnTop: true,             //// 页面可配置
          showGrandTotalsOnTop: true,           //// 页面可配置
        },
        column: {
          showGrandTotals: true,                //// 页面可配置
          showSubTotals: true,                  //// 页面可配置
          grandTotalLabel: '列总计',
          subTotalLabel: '列小计',
          subTotalsDimensions: subTotalsDimensionsColumn,
        }
      },
      aggregationRules,
    },
    widthMode: 'standard',
    heightMode: 'autoHeight',
    // rowHierarchyType: 'tree', // 默认为平铺模式grid tree   //// 页面可配置
  }
  let finalColData = cloneDeep(colData);
  let finalConfig = cloneDeep(tmpConfig);
  setStatisticsItems(finalColData);
  setStatisticsConfig(finalConfig);
  setStatisticsResModalVisible(true);
  // 保存方案
  let moduleKey = config.module_key;
  if (moduleKey) {
    let tmpName = planOnEdit?.name;
    let tmpUuid = planOnEdit?.uuid;
    let tmpPlan = {
      col: finalColData,
      config: finalConfig,
      name: tmpName,
      uuid: tmpUuid,
    };
    // 保存方案
    // debugger;
    let planTmp = myUtil.sys.getCustomerConfigByKey({customer_config_key: 'statistics_plan', unitKey: moduleKey});
    let planAllTmp =  planTmp.all || {};
    let planCurrentTmp = planTmp.current || [];
    let tmpCurrentPlanIndex = planCurrentTmp?.findIndex((item: any) => { return item.uuid === tmpUuid });
    if (tmpCurrentPlanIndex >=0 ) {
      planCurrentTmp[tmpCurrentPlanIndex] = {...tmpPlan};
    } else {
      planCurrentTmp.push(tmpPlan);
    }
    planAllTmp[moduleKey] = planCurrentTmp;
    // 保存方案到 用户表
    myUtil.sys.saveCustomerConfig({ customer_config_key: 'statistics_plan', customer_config_value: planAllTmp, showResponseInfo: false });
    setStatisticsPlan(planCurrentTmp);
  }
}

// 打开弹窗: Button 修改 维度表配置设计（行、列、指标...) VTable
Func.popupStatistics = ({ setStatisticsOptModalVisible, setStatisticsItems, plan, config }: any) => {
  setStatisticsOptModalVisible(true);
  if (setStatisticsItems && plan?.col) {
    let defaultItmes = Func.getDefaultValues({
      config,
      planCol: plan.col,
    });
    setStatisticsItems(cloneDeep(defaultItmes));
  }
}

// 打开弹窗: Button 新建 维度表配置设计（行、列、指标...) VTable
Func.popupStatisticsAdd = ({config, setStatisticsItems, setStatisticsPlanOnEdit, setStatisticsOptModalVisible}: any) => {
  let defaultItmes = Func.getDefaultValues({config});
  setStatisticsItems(defaultItmes);
  let planOnEdit: any = {
    name: Func.defaultStatisticsName,
    uuid: myUtil.text.uuid(),
  };
  setStatisticsPlanOnEdit(planOnEdit);
  Func.popupStatistics({
    setStatisticsOptModalVisible,
  });
};

// 获取维度表初始配置
Func.getDefaultValues = ({ config, planCol }: any) => {
  let plainColumns = myUtil.grid.formatColToPlain([...(config.grid_columns || [])]);
  let valuesTmp: any = [];
  plainColumns.forEach((item: any) => {
    valuesTmp.push(`${item.title} - ${item.dataIndex}`);
  });
  let planRows: any = [];
  let planColumns: any = [];
  let planValues: any = [];
  let planAll: any = [];
  let planRowsTmp = planCol?.rows || [];
  let planColumnsTmp = planCol?.columns || [];
  let planValuesTmp = planCol?.values || [];
  let planAllTmp = planCol?.all || [];
  planRowsTmp.forEach((item: any) => {
    let aaaa =  plainColumns?.find((item2: any) => { return item2.dataIndex === item });
    planRows.push(`${aaaa?.title} - ${aaaa?.dataIndex}`);
  });
  planColumnsTmp.forEach((item: any) => {
    let aaaa =  plainColumns?.find((item2: any) => { return item2.dataIndex === item });
    planColumns.push(`${aaaa?.title} - ${aaaa?.dataIndex}`);
  });
  planValuesTmp.forEach((item: any) => {
    let aaaa =  plainColumns?.find((item2: any) => { return item2.dataIndex === item });
    planValues.push(`${aaaa?.title} - ${aaaa?.dataIndex}`);
  });
  planAllTmp.forEach((item: any) => {
    let aaaa =  plainColumns?.find((item2: any) => { return item2.dataIndex === item });
    planAll.push(`${aaaa?.title} - ${aaaa?.dataIndex}`);
  });
  // debugger;
  let statisticsItems: any;
  if (planCol) {
    statisticsItems = {
      rows: planRows,
      columns: planColumns,
      values: planValues,
      all: planAll,
    };
  } else {
    statisticsItems = {
      rows: [],
      columns: [],
      // values: valuesTmp,
      // all: [],
      values: [],
      all: valuesTmp,
      // values: ['报关单号 - ckbgdh', '项号 - xh4', '银行账号 - yhzh', '监管方式代码 - jgfsDm2', '监管方式 - jgfsDm', '出口日期 - ckrq1', '审批状态 - spzt', '征免类型 - zmlx', '申报业务 - sbyw', '商品代码 - ckspDm', '状态 - spzt2', '调用耗时 - sbyw', '商品名称 - ckspmc'],
    };
  }
  return statisticsItems;
}

// 改变方案名称
Func.changePlanTitle = ({changedText, statisticsPlanOnEdit, setStatisticsPlanOnEdit}: any) => {
  let tmpPlanCurrent = cloneDeep(statisticsPlanOnEdit);
  if (!tmpPlanCurrent) {
    tmpPlanCurrent = {
      name: changedText || Func.defaultStatisticsName,
      uuid: statisticsPlanOnEdit?.uuid || myUtil.text.uuid(),
    }
  } else {
    tmpPlanCurrent = {
      ...tmpPlanCurrent,
      name: changedText,
    }
  }
  setStatisticsPlanOnEdit(tmpPlanCurrent);
}

// 获取数据
Func.searchStatisticsData = ({formStatistics, statisticsConfig, setStatisticsConfig}: any) => {
  formStatistics.validateFields().then((values:any) => {
    let newStatisticsConfig: any = cloneDeep(statisticsConfig);
    let indicatorsAll = newStatisticsConfig.indicatorsAll;
    // 聚合方式
    let aggregationRules = values.aggregationRules || [];
    let indicatorsNew: any = [];
    for (let i = 0; i < aggregationRules.length; i++) {
      for (let m = 0; m < indicatorsAll.length; m++) {
        if (indicatorsAll[m].aggregationType === aggregationRules[i]) {
          indicatorsNew.push(indicatorsAll[m]);
        }
      }
    }
    newStatisticsConfig.indicators = indicatorsNew;
    newStatisticsConfig.rowHierarchyType = values.rowHierarchyType;
    newStatisticsConfig.dataConfig.totals.row.showSubTotalsOnTop = values.showSubTotalsOnTop;
    newStatisticsConfig.dataConfig.totals.row.showGrandTotals = values.rowShowGrandTotals;
    newStatisticsConfig.dataConfig.totals.row.showSubTotals = values.rowShowSubTotals;
    newStatisticsConfig.dataConfig.totals.column.showGrandTotals = values.columnShowGrandTotals;
    newStatisticsConfig.dataConfig.totals.column.showSubTotals = values.columnShowSubTotals;
    newStatisticsConfig.dataConfig.totals.row.showGrandTotalsOnTop = values.showGrandTotalsOnTop;
    setStatisticsConfig(newStatisticsConfig);
  })
}

// 高级筛选按钮下拉列表
Func.statisticsDropdownItems = ({unitKey, statisticsPlan, setStatisticsPlan, setStatisticsPlanOnEdit, setStatisticsOptModalVisible, setStatisticsItems, config}: any) => {
  let tmpItemArr: any = [];
  statisticsPlan?.forEach((item: any) => {
    tmpItemArr.push({ label: item?.name, key: item?.uuid, extra: <Button type="link" size="small" color="danger" icon={<DeleteOutlined />} onClick={(e) => {
      let planTmp = myUtil.sys.getCustomerConfigByKey({customer_config_key: 'statistics_plan', unitKey});
      let planCurrentTmp = planTmp.current;
      let planAllTmp = planTmp.all;
      let localStorePlanCurrentNew = planCurrentTmp?.filter((item2: any) => { return item2.uuid !== item.uuid });
      planAllTmp[unitKey] = localStorePlanCurrentNew;

      // myUtil.sys.saveCustomerConfigByKey({customer_config_key: 'statistics_plan', customer_config_value: planAllTmp});
      // 保存方案到用户表
      myUtil.sys.saveCustomerConfig({ customer_config_key: 'statistics_plan', customer_config_value: planAllTmp, showResponseInfo: true });
      setStatisticsPlan(localStorePlanCurrentNew);
      e.stopPropagation()
    }}></Button>});
  })
  return {
    items: tmpItemArr,
    onClick: (param: any) => {
      // 添加方案标签
      let tmpaaa = cloneDeep(statisticsPlan) || [];
      let currentPlan: any;
      for (let i=0; i<tmpaaa.length; i++) {
        if (tmpaaa[i].uuid === param.key) {
          currentPlan = tmpaaa[i];
          setStatisticsPlanOnEdit(currentPlan);
          Func.popupStatistics({
            setStatisticsOptModalVisible,
            plan: currentPlan,
            setStatisticsItems,
            config,
          });
          break;
        }
      }
    }
  };
};

// 获取工具类按钮按钮
Func.getToolbarDropDown = ({ unitKey, statisticsPlan, setStatisticsPlan, setStatisticsPlanOnEdit, setStatisticsOptModalVisible, setStatisticsItems, config, }: any) => {
  return <>
  <Button onClick={() => {
    Func.popupStatisticsAdd({config, setStatisticsItems, setStatisticsPlanOnEdit, setStatisticsOptModalVisible});
  }}>维度表统计</Button>
  {statisticsPlan?.length > 0 && <Tooltip title="维度表统计方案">
    <Dropdown placement="bottomRight" menu={Func.statisticsDropdownItems({
      unitKey,
      statisticsPlan,
      setStatisticsPlan,
      setStatisticsPlanOnEdit,
      setStatisticsOptModalVisible,
      setStatisticsItems,
      config,
    })}>
      <Button icon={<DownOutlined />} />
    </Dropdown>
  </Tooltip>}
</>
}

// 页面初始化
Func.statisticsInit = ({config, unitKey, setStatisticsPlan}: any) => {
  if (config?.toolbar_default?.statistics) {
    if (unitKey) {
      // debugger
      let planTmp = myUtil.sys.getCustomerConfigByKey({customer_config_key: 'statistics_plan', unitKey});
      let planCurrentTmp = planTmp.current;
      setStatisticsPlan(planCurrentTmp);
    }
  }
}

// 打开维度表统计弹窗 弃用 采用VTable ！！！！！！
Func.handleStatisticsS2 = ({ refMultipleContainers, setStatisticsResModalVisible, setStatisticsConfig, setStatisticsItems, config }: any) => {
  const colData: any = refMultipleContainers.current?.get3ColData();
  let tmpConfig = {
    api_grid_query: `${myUtil.api.getApiRoot()}${config?.api_grid_query || CONSTANTS.DEFAULT_API.GRID_QUERY}`,
    sheet_type: '',
    grid_columns: config.grid_columns,
    sheet_type_table: {
      ...colData
    },
  }
  setStatisticsItems(cloneDeep(colData));
  setStatisticsConfig(cloneDeep(tmpConfig));
  setStatisticsResModalVisible(true);
}

export default Func;