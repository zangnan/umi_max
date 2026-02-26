import myUtil from '../DDAssist/util';
import CONSTANTS from '../DDAssist/constants';
import { groupBy, sumBy } from 'lodash';
import { queryList } from '@/services/hts/api';
import { cloneDeep } from 'lodash';
import DDBunit2ADBUtil from '../DDBunit/DDBunit2ADBUtil';

const DDChartUtil: any = {};

// 根据字段id获取字段Obj
const getFieldObj = (fieldId: any, config: any) => {
  if (Array.isArray(fieldId)) {
    let tmpFields: any = [];
    fieldId?.forEach((ccc: any) => {
      let tmpField = config?.grid_columns?.find((colItem: any) => { return colItem.dict_field_id === ccc });
      // tmpFields.push(tmpField?.dataIndex);
      tmpFields.push(tmpField);
    })
    return tmpFields;
  } else {
    let tmpField = config?.grid_columns?.find((colItem: any) => { return colItem.dict_field_id === fieldId });
    // debugger
    return tmpField;
    // return tmpField?.dataIndex;
  }
};

// 根据字段dataIndex获取字段Obj
const getFieldObjByDataIndex = (dataIndex: any, config: any) => {
  let tmpField = config?.grid_columns?.find((colItem: any) => { return colItem.dataIndex === dataIndex });
  return tmpField;
};

// 单一图表config
DDChartUtil.getOneChartConfig = (chartsConfigItem: any, config: any, gridData: any) => {
  let { fieldType, chartData } = chartsConfigItem;
  let fieldTypeObj = getFieldObj(fieldType, config);
  let dataChart: any = [];
  chartData?.forEach((eee: any) => {
    let fieldValueObj = getFieldObj(eee?.fieldValue, config);
    let dataChartTmp: any = [];
    let fieldType2Obj = getFieldObj(eee?.fieldType2, config); // 单组数据分组堆叠柱图
    let fieldType2SeriesObj = getFieldObj(eee?.fieldType2Series, config); // 单组数据分组堆叠柱图
    let gridSource111: any = groupBy(gridData, fieldTypeObj.dataIndex) || [];
    Object.keys(gridSource111).forEach((key1: any) => {
      let aaa1: any;
      let bbb = gridSource111[key1];
      if (eee.chartType === 'pie') { // 饼图
        let dataIndexTmp: any = Array.isArray(fieldValueObj) ? fieldValueObj[0].dataIndex : fieldValueObj.dataIndex;
        aaa1 = sumBy(bbb, (item: any) => item[dataIndexTmp]);
        dataChartTmp.push({ type: key1, value: aaa1 });
      } else {
        if (fieldValueObj.length > 1) { // 多线 多组数据
          fieldValueObj.forEach((fieldValueItem: any) => {
            aaa1 = sumBy(bbb, (item: any) => item[fieldValueItem.dataIndex]);
            dataChartTmp.push({ xValue: key1, yValue: aaa1, type: fieldValueItem.dataIndex });
          })
        } else { // 单线 单组数据
          let dataIndexTmp: any = Array.isArray(fieldValueObj) ? fieldValueObj[0].dataIndex : fieldValueObj.dataIndex;
          aaa1 = sumBy(bbb, (item: any) => item[dataIndexTmp]);
          if (eee.chartType === 'pie') { // 饼图
            // dataChartTmp.push({ type: key1, value: aaa1 });
          } else {
            if (eee.chartType === 'column' && fieldType2Obj?.dataIndex && fieldType2SeriesObj?.dataIndex) { // 单组数据分组堆叠柱图
              // 数据 柱图3
              const groupedData = myUtil.array.groupByFields(bbb, fieldType2Obj.dataIndex, fieldType2SeriesObj.dataIndex);
              Object.keys(groupedData).forEach((key2: any) => {
                let aaa1 = sumBy(groupedData[key2], (item: any) => item[fieldValueObj[0].dataIndex]);
                dataChartTmp.push({ xValue: key1, yValue: aaa1, type: key2.split('|')[0], series: key2.split('|')[1], })
              })
            } else {
              // let yValueKey = 'yValue';
              // debugger;
              // dataChartTmp.push({ xValue: key1, yValue: aaa1, type: dataIndexTmp});
              dataChartTmp.push({ xValue: key1, yValue: aaa1});
            }
          }
        }
      }


    });
    dataChart.push({ chartType: eee.chartType, data: dataChartTmp });
  })

  // 图表配置
  let ccc: any;
  let dualAxesChildren: any = [];
  // debugger;
  chartData?.forEach((fff: any, index: any) => {
    let fieldValueObj = getFieldObj(fff?.fieldValue, config);
    let tmpChartType = fff.chartType;
    if (tmpChartType === 'pie') { // 饼图设置
      // debugger
      ccc = {
        ...myUtil.chartsAntD.configPie({
          data: dataChart[index].data,
          showTotal: true,
          colorFieldName: Array.isArray(fieldValueObj) ? fieldValueObj[0].title : fieldValueObj.title,
          angleFieldName: fieldTypeObj.title,
          // showLabel: false,
        }),
        chartType: 'pie',
      };
    } else { // 柱图、线图设置
      if (tmpChartType === 'column') {
        tmpChartType = 'interval'
      }
      // debugger
      let childConfig: any = {
        data: dataChart[index].data,
        type: tmpChartType, // interval line
        yField: 'yValue',
        colorField: fieldValueObj.length > 1 ? 'type' : () => 'yValue',
        // colorField: 'type',
        // valueFormat: '0,0.00',
        // valueUnit: 'A',
        // shapeField: 'smooth',
        // colorField: 'type',
        // group: true,
        legend: {
            color: {
              itemLabelText: (datum: any, index: any, data: any) => {
                let fieldLabelObj: any;
                let tmpFiledObj = data[index];
                let tmpLabel = tmpFiledObj.label;
                // debugger;
                if (tmpLabel === 'yValue') {
                  fieldLabelObj = fieldValueObj[0];
                } else {
                  fieldLabelObj = getFieldObjByDataIndex(tmpFiledObj.label, config);
                }
                return fieldLabelObj?.title || datum.label;
              },
            },
        }
      };
      let axisYTitleTmp = '';
      if (fieldValueObj.length === 1) {
        axisYTitleTmp = fieldValueObj[0].title;
      } else if (fieldValueObj.length > 1) {
        for (let i = 0; i < fieldValueObj.length; i++) {
          axisYTitleTmp += fieldValueObj[i].title + (i === fieldValueObj.length -1 ? '' : ' / ');
        }
      }
      childConfig.axisYTitle = axisYTitleTmp;
      // debugger;
      if (tmpChartType === 'interval' && fff.fieldType2 && fff.fieldType2Series) { // 单组数据分组堆叠柱图
        childConfig = {
          ...childConfig,
          colorField: 'series',// series type
          seriesField: 'type',//  type series
          stack: {
            groupBy: ['x', 'series'],
            series: false,
          },
        }
      }
      // debugger
      if (fff.fieldValue.length > 1) {
        childConfig.colorField = 'type';
        childConfig.group = true;
      }
      // debugger
      // let axisY = fff?.axisY?.length > 0 ? true : false; // 独占Y轴
      // console.info('图表配置', fff, axisY, fieldValue);
      // if (axisY) {
        // childConfig.axisYTitle = fieldValue[index];
      childConfig.axisYPosition = index === 0 ? 'left' : 'right';
      // }
      dualAxesChildren.push(childConfig);
    }
  });
  // debugger
  if (!ccc) { // 柱图、线图设置
    ccc = {
      ...myUtil.chartsAntD.configDualAxes({
        xField: 'xValue',
        axisXTitle: fieldTypeObj?.title,
        children: dualAxesChildren,
      }),
    };
  }

  return ccc;
}

// 获取当前页面的统计视图方案
DDChartUtil.getChartPlanByKey = ({moduleKey}: any) => {
  // let localStorePlan: any = myUtil.localStore.getItem('chart_plan') || {}; // 获取localstore中图表方案 所有
  // let localStorePlanCurrent: any = localStorePlan[moduleKey] || []; // 获取localstore中图表方案 当前
  // return localStorePlanCurrent;

  let planTmp = myUtil.sys.getCustomerConfigByKey({customer_config_key: 'chart_plan', unitKey: moduleKey});
  // let allPlan =  planTmp.all;
  let currentPlan = planTmp.current;
  return currentPlan;
}

// 保存图表配置
DDChartUtil.saveChartConfig = ({config, setChartPlan, chartConfigForm}: any) => {
  chartConfigForm.validateFields().then(async (values: any) => {
    let unitKey: any = config.module_key;
    if (unitKey) {
      let planTmp = myUtil.sys.getCustomerConfigByKey({customer_config_key: 'chart_plan', unitKey});
      let allPlan =  planTmp.all || {};
      let currentPlan = planTmp.current || [];

      // let localStorePlan: any = myUtil.localStore.getItem('chart_plan') || {}; // 获取localstore中图表方案 所有
      // let localStorePlanCurrent: any = localStorePlan[unitKey] || []; // 获取localstore中图表方案 当前
      let newChartPlan: any = {...values};
      if (!values.tagId) { // 新建
        newChartPlan.tagId = myUtil.text.uuid();
        currentPlan.push(newChartPlan);
      } else { // 更新
        currentPlan?.forEach((eee: any, index: any) => {
          if (eee.tagId === values.tagId) {
            currentPlan[index] = {
              ...eee,
              ...values,
            }
          }
        })
      }
      setChartPlan(currentPlan)
      // localStorePlan[unitKey] = localStorePlanCurrent;
      // myUtil.localStore.setItem('chart_plan', localStorePlan);
      // // 保存方案到用户表
      // // myUtil.sys.saveCustomerConfig({ customer_config_key: 'chart_plan', customer_config_value: localStorePlan });

      // 保存方案
      allPlan[unitKey] = currentPlan;
      // 保存方案到 用户表
      myUtil.sys.saveCustomerConfig({ customer_config_key: 'chart_plan', customer_config_value: allPlan, showResponseInfo: true });
    }
  });
};

// 清空图表配置
DDChartUtil.clearAllChartConfig = ({config, setChartPlan}: any) => {
  let unitKey: any = config.module_key;
  if (unitKey) {
    let localStorePlan: any = myUtil.localStore.getItem('chart_plan') || {}; // 获取localstore中图表方案 所有
    setChartPlan([]);
    localStorePlan[unitKey] = [];
    myUtil.localStore.setItem('chart_plan', localStorePlan);
  }
}

// 是否有能够统计的数值类型字段
DDChartUtil.haveNumTypeField = ({config}: any) => {
  let fieldsArrNumber = config?.grid_columns?.filter((tmp: any) => DDBunit2ADBUtil.isNumberType({ dictFieldType: tmp?.dict_field_type}));
  return fieldsArrNumber?.length > 0;
}

// 图表配置设置表单
DDChartUtil.getChartFormConfig = ({config}: any) => {
  let fieldsArr: any  = [];
  config?.grid_columns?.forEach((item: any) => {
    fieldsArr.push({
      name: item.title,
      value: item.dict_field_id || item.dataIndex,
      dictFieldType: item.dict_field_type,
    });
  })
  let fieldsArrNumber = fieldsArr.filter((tmp: any) => DDBunit2ADBUtil.isNumberType({ dictFieldType: tmp?.dictFieldType}));
  let fieldsArrNotNumber = [];
  if (fieldsArrNumber?.length > 0) {
    fieldsArrNotNumber = fieldsArr.filter((tmp: any) => !(DDBunit2ADBUtil.isNumberType({ dictFieldType: tmp?.dictFieldType})));
  }

  return {
    form_layout_type: 2,
    form_label_input_layout: 'horizontal',
    form_items: [
      { label: 'ID', type: 'Hidden', name: 'tagId' },
      { label: '图表设置', type: 'GroupTitle', name: 'chartInfo' },
      { label: '数据范围', type: 'Radio', name: 'dataRange', defaultValue: '2', optionType: 'button', list: [
        { name: '所有', value: '2' },
        { name: '当前页', value: '1' },
      ] },
      { label: '指标维度', type: 'Select', name: 'fieldType', list: fieldsArrNotNumber, rules: [
        { type: 'base_required' },
      ]},
      { label: '图表数据', name: 'chartData', type: 'List', children: [
        { label: '图表类别', type: 'Radio', name: 'chartType', eventOnChange: 'changeChartType', defaultValue: 'line', optionType: 'button', list: [
          { name: '线', value: 'line' },
          { name: '柱', value: 'column' },
          { name: '面积', value: 'area' },
          { name: '饼', value: 'pie' },
        ] },
        { label: '值域字段', type: 'Select', name: 'fieldValue', mode: 'multiple', list: fieldsArrNumber, rules: [
          { type: 'base_required' },
          // { func: 'checkFieldValue' }
        ] },
        { label: '指标维度2', type: 'Select', name: 'fieldType2', list: fieldsArrNotNumber, disabled: true },
        { label: '指标维度3', type: 'Select', name: 'fieldType2Series', list: fieldsArrNotNumber, disabled: true },
      ] },
      { label: '方案设置', type: 'GroupTitle', name: 'tagInfo' },
      { label: '方案标题', type: 'Input', name: 'tagName', layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW },
      { label: '方案备注', type: 'TextArea', name: 'tagRemark', autoSize: { minRows:3, maxRows: 3}, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW },
    ],
  };
}

// 图表标题
DDChartUtil.getChartTitle = ({chartType, chartConfig}: any) => {
  let title = '图表统计';
  if (chartType === 'pie') {
    title = `${chartConfig.angleFieldName}、${chartConfig.colorFieldName}占比`;
  } else if (chartType === 'dualAxes') {
    let tttt = '';
    chartConfig?.children?.forEach((childItemTmp: any, index: any) => {
      tttt = tttt + childItemTmp.axisYTitle + (index === chartConfig.children.length - 1 ? '' : '、')
    });
    // debugger;
    title = `${chartConfig.axisXTitle}维度，${tttt}统计`;
  }
  return title;
}

// 图表展示 弹窗
DDChartUtil.showChartModal = ({chartConfigForm, config, refGrid, showJson}: any) => {
  chartConfigForm.validateFields().then(async (values: any) => {
    let dataRange = values.dataRange;
    let gridData: any;
    if (dataRange === '1') { // 当前页面
      gridData = refGrid.current?.getSource();
    } else if (dataRange === '2') { // 所有
      const dataTmp: any = await queryList({page: 1, pageSize: 999999, searchModel: []}, config.module_key);
      if (dataTmp?.code === '200' && dataTmp?.body?.rowCount > 0) {
        gridData = dataTmp.body.rows || [];
      }
    }
    let chartArr: any = [];
    [values].forEach((chartParamItem: any) => {
      let cc: any = DDChartUtil.getOneChartConfig(chartParamItem, config, gridData);
      let chartType: any = cc.chartType === 'pie' ? 'pie' : 'dualAxes';
      let title: any = DDChartUtil.getChartTitle({chartType, chartConfig: cc});
      chartArr.push({ type: chartType, config: cc, title });
    });
    if (showJson) {
      myUtil.modal.viewJson({ data: chartArr });
      return;
    }
    myUtil.chartsAntD.modalChart(chartArr);
  });
};

// 图表展示 弹窗 基于方案
DDChartUtil.showChartModalFromPlan = async ({config, refGrid, chartPlan}: any) => {
  let aaa: any = cloneDeep(chartPlan) || [];
  aaa = aaa.filter((tmp: any) => (tmp.onEdit)) || [];
  let chartArr: any = [];
  for (let mmm = 0; mmm < aaa.length; mmm++) {
    let values: any = aaa[mmm];
    let dataRange = values.dataRange;
    let gridData: any;
    if (dataRange === '1') { // 当前页面
      gridData = refGrid.current?.getSource();
    } else if (dataRange === '2') { // 所有
      const dataTmp: any = await queryList({page: 1, pageSize: 999999, searchModel: []}, config.module_key);
      if (dataTmp?.code === '200' && dataTmp?.body?.rowCount > 0) {
        gridData = dataTmp.body.rows || [];
      }
    }
    [values].forEach((chartParamItem: any) => {
      let cc: any = DDChartUtil.getOneChartConfig(chartParamItem, config, gridData);
      let chartType: any = cc.chartType === 'pie' ? 'pie' : 'dualAxes';
      let title: any = DDChartUtil.getChartTitle({chartType, chartConfig: cc});
      chartArr.push({ type: chartType, config: cc, title });
    });
  }
  myUtil.chartsAntD.modalChart(chartArr);
  return;
};

// 图表测试 弹窗
DDChartUtil.testChartModal = ({refGrid}: any) => {
  let dataPie: any = [];
  let dataColumn1: any = [];
  let dataColumn2: any = [];
  let dataColumn3: any = [];
  let dataLine: any = [];
  let dataLine2: any = [];
  let gridData = refGrid.current?.getSource();
  let fieldType = 'ssq'; // ssq cktmspzlxDm sz
  let fieldValue1 = 'tse'; // tse jsje sl
  let fieldValue2 = 'jsje'; // tse jsje sl
  let fieldValue3 = 'sl'; // tse jsje sl
  let fieldType2 = 'cktmspzlxDm';
  let fieldType2Series = 'sz';
  let gridSource1: any = groupBy(gridData, fieldType) || [];

  Object.keys(gridSource1).forEach((key1: any) => {
    let bbb = gridSource1[key1];
    let aaa1 = sumBy(bbb, (item: any) => item[fieldValue1]) * 5; // *10仅用于测试
    let aaa2 = sumBy(bbb, (item: any) => item[fieldValue2]);
    let aaa3 = sumBy(bbb, (item: any) => item[fieldValue3]) * 200; // *200仅用于测试
    // 数据 饼图
    dataPie.push({ type: key1, value: aaa1 });
    // 数据 柱图1
    dataColumn1.push({ xValue: key1, yValue: aaa1 });
    // 数据 柱图2
    dataColumn2.push({ xValue: key1, yValue: aaa1, type: fieldValue1 });
    dataColumn2.push({ xValue: key1, yValue: aaa2, type: fieldValue2 });
    dataColumn2.push({ xValue: key1, yValue: aaa3, type: fieldValue3 });
    // 数据 柱图3
    const groupedData = myUtil.array.groupByFields(bbb, fieldType2, fieldType2Series);
    Object.keys(groupedData).forEach((key2: any) => {
      let aaa1 = sumBy(groupedData[key2], (item: any) => item[fieldValue1]) * 5;
      dataColumn3.push({
        xValue: key1,
        yValue: aaa1,
        type: key2.split('|')[0],
        series: key2.split('|')[1],
      })
    })
    // 数据 线图1
    dataLine.push({ xValue: key1, yValue: aaa1 });
    // 数据 线图2
    dataLine2.push({ xValue: key1, yValue: aaa1, type: fieldValue1 });
    dataLine2.push({ xValue: key1, yValue: aaa2, type: fieldValue2 });
    dataLine2.push({ xValue: key1, yValue: aaa3, type: fieldValue3 });
  });
  // 配置 饼图
  let configPie = {
    ...myUtil.chartsAntD.configPie({
      data: dataPie,
      showTotal: true,
    }),
  };
  // 配置 柱图1
  let configColumn1 = {
    ...myUtil.chartsAntD.configColumn({
      data: dataColumn1,
      showLabel: true,
    }),
  };
  // 配置 柱图2
  let configColumn2 = {
    ...myUtil.chartsAntD.configColumn({
      data: dataColumn2,
    }),
    colorField: 'type',
    group: true,
  };
  // 配置 柱图3
  let configColumn3 = {
    ...myUtil.chartsAntD.configColumn({
      data: dataColumn3,
    }),
    colorField: 'series',
    seriesField: 'type',
    stack: {
      groupBy: ['x', 'series'],
      series: false,
    },
  };
  // 配置 线图1
  let configLine1 = {
    ...myUtil.chartsAntD.configLine({
      data: dataLine,
    }),
  };
  // 配置 线图2
  let configLine2 = {
    ...myUtil.chartsAntD.configLine({
      data: dataLine2,
    }),
    colorField: 'type',
  };
  // 配置 双轴图1
  let configDualAxes1 = {
    ...myUtil.chartsAntD.configDualAxes({
      xField: 'xValue',
      axisXTitle: fieldType,
      children: [
        {
          type: 'line',
          yField: 'yValue',
          shapeField: 'smooth',
          axisYPosition: 'right',
          axisYTitle: 'Temperature (°C)',
          valueFormat: '0,0',
          valueUnit: 'A',
          data: dataLine,
        },
        {
          type: 'interval',
          yField: 'yValue',
          axisYTitle: '毛利率',
          valueFormat: '0,0.00',
          valueUnit: '万美元',
          data: dataColumn1,
        },
        // {
        //   type: 'line',
        //   yField: 'yValue2',
        //   shapeField: 'smooth',
        //   axisYPosition: 'right',
        //   // axisYTitle: 'Precipitation (ml)',
        //   // valueFormat: '0,0',
        //   // valueUnit: 'B',
        // },
      ],
    }),
    // colorField: 'type',
  };
  // 配置 双轴图2
  let configDualAxes2 = {
    ...myUtil.chartsAntD.configDualAxes({
      xField: 'xValue',
      axisXTitle: fieldType,
      children: [
        {
          type: 'line',
          yField: 'yValue',
          shapeField: 'smooth',
          axisYPosition: 'right',
          axisYTitle: 'Temperature (°C)',
          valueFormat: '0,0',
          valueUnit: 'A',
          data: dataLine2,
          colorField: 'type', // 多线标识字段
          scale: { series: { independent: true } },
        },
        {
          type: 'interval',
          yField: 'yValue',
          axisYTitle: '毛利率',
          valueFormat: '0,0.00',
          valueUnit: '万美元',
          data: dataColumn2,
          colorField: 'type',
          group: true,
        },
      ],
    }),
    // colorField: 'type',
  };
  // 配置 双轴图3
  let configDualAxes3 = {
    ...myUtil.chartsAntD.configDualAxes({
      xField: 'xValue',
      axisXTitle: fieldType,
      children: [
        {
          data: dataColumn3,
          type: 'interval',
          yField: 'yValue',
          // colorField: 'group',
          group: true,
          axisYTitle: '支出',
          valueFormat: '0,0.00',
          valueUnit: 'A',
          colorField: 'series',
          seriesField: 'type',
          stack: {
            groupBy: ['x', 'series'],
            series: false,
          },
        },
        {
          data: dataLine2,
          type: 'line',
          yField: 'yValue',
          axisYTitle: '收益',
          axisYPosition: 'right',
          colorField: 'type',
          scale: { series: { independent: true } },
          valueFormat: '0,0.00',
          valueUnit: 'B',
        },
      ],
    }),
    // colorField: 'type',
  };
  // 配置 双轴图4
  let configDualAxes4 = {
    ...myUtil.chartsAntD.configDualAxes({
      xField: 'xValue',
      axisXTitle: fieldType,
      children: [
        {
          type: 'line',
          yField: 'yValue',
          shapeField: 'smooth',
          axisYTitle: 'Temperature (°C)',
          valueFormat: '0,0',
          valueUnit: 'A',
          data: dataLine2,
          colorField: 'type', // 多线标识字段
          scale: { series: { independent: true } },
        },
        {
          type: 'area',
          yField: 'yValue',
          axisYPosition: 'right',
          data: dataLine2,
          axisXTitle: fieldType,
          axisYTitle: fieldValue1,
          colorField: 'type',
          shapeField: 'smooth',
          stack: true, // Try to remove this line.
        },
      ],
    }),
  };
  // 配置 面积图1
  let configArea1 = {
    ...myUtil.chartsAntD.configArea({
      data: dataLine,
      axisXTitle: fieldType,
      axisYTitle: fieldValue1,
    }),
  };
  // 配置 面积图2
  let configArea2 = {
    ...myUtil.chartsAntD.configArea({
      data: dataLine2,
      axisXTitle: fieldType,
      axisYTitle: fieldValue1,
    }),
    colorField: 'type',
    shapeField: 'smooth',
    stack: true, // Try to remove this line.
  };
  let chartArr: any = [
    { type: 'pie', config: configPie, title: '所属期数值占比' },
    { type: 'column', config: configColumn1 },
    { type: 'column', config: configColumn2 },
    { type: 'column', config: configColumn3 },
    { type: 'line', config: configLine1 },
    { type: 'line', config: configLine2 },
    { type: 'area', config: configArea1 },
    { type: 'area', config: configArea2 },
    { type: 'dualAxes', config: configDualAxes1 },
    { type: 'dualAxes', config: configDualAxes2 },
    { type: 'dualAxes', config: configDualAxes3 },
    { type: 'dualAxes', config: configDualAxes4 },
  ];

  myUtil.chartsAntD.modalChart(chartArr);
};

export default DDChartUtil;
