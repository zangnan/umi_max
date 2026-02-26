import { Button, Modal } from 'antd';
import DDBaseForm from '../DDForm/DDBaseForm';
import myUtil from '../DDAssist/util';
import CONSTANTS from '../DDAssist/constants';
import { groupBy, sumBy } from 'lodash';

const DDBunit2ChartUtil: any = {};

const getFieldName = (fieldId: any, config: any) => {
  if (Array.isArray(fieldId)) {
    let tmpFields: any = [];
    fieldId?.forEach((ccc: any) => {
      let tmpField = config?.grid_columns?.find((colItem: any) => { return colItem.dict_field_id === ccc });
      tmpFields.push(tmpField?.dataIndex);
    })
    return tmpFields;
  } else {
    let tmpField = config?.grid_columns?.find((colItem: any) => { return colItem.dict_field_id === fieldId });
    return tmpField?.dataIndex;
  }
};

// 图表展示 弹窗
DDBunit2ChartUtil.showChartModal = ({chartsConfigArr, config, refGrid}: any) => {
  let gridData = refGrid.current?.getSource();
  let chartArr: any = [];

  // debugger
  chartsConfigArr.forEach((chartsConfigItem: any) => {
    let { fieldType, chartData } = chartsConfigItem;
    fieldType = getFieldName(fieldType, config);
    let dataLine: any = [];
    let dataColumn1: any = [];
    let dataDualAxes: any = [];
    // debugger
    chartData?.forEach((eee: any, index: any) => {
      debugger
      let fieldValue = getFieldName(eee?.fieldValue, config);
      let fieldType2 = getFieldName(eee?.fieldType2, config);
      let fieldType2Series = getFieldName(eee?.fieldType2Series, config);
      // if (eee?.chartType === 'dualAxes') {

        let dataDualAxesTmp: any = [];
        console.info(chartsConfigItem);
        console.info(eee);
        // debugger
        let gridSource111: any = groupBy(gridData, fieldType) || [];
        Object.keys(gridSource111).forEach((key1: any) => {
          let aaa1: any;
          let bbb = gridSource111[key1];
          debugger

          if (fieldValue.length > 1) { // 多线
            fieldValue.forEach((fieldValueItem: any) => {
          //     aaa1 = sumBy(bbb, (item: any) => item[fieldValueItem]) * 5; // *10仅用于测试
            // 数据 线图2
        //     dataLine.push({ xValue: key1, yValue: aaa1, type: fieldValueItem });
            })
          } else { // 单线
            aaa1 = sumBy(bbb, (item: any) => item[fieldValue[0]]) * 5; // *10仅用于测试
            // 数据 线图1
            dataDualAxesTmp.push({ xValue: key1, yValue: aaa1, chartType: '' });
            // dataLine.push({ xValue: key1, yValue: aaa1 });
          }

          // aaa1 = sumBy(bbb, (item: any) => item[fieldValue]) * 5; // *10仅用于测试
          // dataDualAxesTmp.push({ xValue: key1, yValue: aaa1, chartType: '' });
        });
        dataDualAxes.push({chartType: eee.chartType, data: dataDualAxesTmp});

        // debugger
    //   } else if (eee?.chartType === 'pie') {

    //   } else if (eee?.chartType === 'line') {
    //     let gridSource111: any = groupBy(gridData, fieldType) || [];
    //     // console.info(gridSource111);
    //     // debugger
    //     Object.keys(gridSource111).forEach((key1: any) => {
    //       let aaa1: any;
    //       let bbb = gridSource111[key1];
    //       aaa1 = sumBy(bbb, (item: any) => item[fieldValue]) * 5; // *10仅用于测试
    //       // debugger
    //       dataLine.push({ xValue: key1, yValue: aaa1, type: fieldValue });
    //       // if (fieldValue.length > 1) { // 多线
    //       //   fieldValue.forEach((fieldValueItem: any) => {
    //       //     aaa1 = sumBy(bbb, (item: any) => item[fieldValueItem]) * 5; // *10仅用于测试
    //       //     // 数据 线图2
    //       //     dataLine.push({ xValue: key1, yValue: aaa1, type: fieldValueItem });
    //       //   })
    //       // } else { // 单线
    //       //   aaa1 = sumBy(bbb, (item: any) => item[fieldValue]) * 5; // *10仅用于测试
    //       //   // 数据 线图1
    //       //   dataLine.push({ xValue: key1, yValue: aaa1 });
    //       // }
    //     });
    //   } else if (eee?.chartType === 'column') {
    //     let gridSource1: any = groupBy(gridData, fieldType) || [];
    //     Object.keys(gridSource1).forEach((key1: any) => {
    //     let aaa1: any;
    //     let bbb = gridSource1[key1];
    //     aaa1 = sumBy(bbb, (item: any) => item[fieldValue]) * 5; // *10仅用于测试
    //     dataColumn1.push({ xValue: key1, yValue: aaa1, type: fieldValue });
    //     // debugger;
    // //     if (fieldValue.length > 1) { // 多柱
    // //       fieldValue.forEach((fieldValueItem: any) => {
    // //         aaa1 = sumBy(bbb, (item: any) => item[fieldValueItem]) * 5; // *10仅用于测试
    // //         // 数据 柱图
    // //         dataColumn1.push({ xValue: key1, yValue: aaa1, type: fieldValueItem });
    // //       })
    // //     } else { // 单柱
    // //       if (fieldType2 && fieldType2Series) {
    // //         // 数据 柱图3
    // //         const groupedData = myUtil.array.groupByFields(bbb, fieldType2, fieldType2Series);
    // //         // console.log(groupedData);
    // //         Object.keys(groupedData).forEach((key2: any) => {
    // //           aaa1 = sumBy(groupedData[key2], (item: any) => item[fieldValue]) * 5;
    // //           dataColumn1.push({
    // //             xValue: key1,
    // //             yValue: aaa1,
    // //             type: key2.split('|')[0],
    // //             series: key2.split('|')[1],
    // //           })
    // //         })
    // //       } else {
    // //         let aaa1 = sumBy(bbb, (item: any) => item[fieldValue]) * 5; // *10仅用于测试
    // //         // 数据 柱图
    // //         dataColumn1.push({ xValue: key1, yValue: aaa1 });
    // //       }
    // //     }
    //     });
    //   }
      // debugger
    })

    // 配置 双轴图 DualAxes
    let dualAxesChildren: any = [];
    chartData?.forEach((fff: any, index: any) => {
      let tmpChartType = fff.chartType;
      if (tmpChartType === 'column') {
        tmpChartType = 'interval'
      }
      let childConfig: any = {
        data: dataDualAxes[index].data,
        type: tmpChartType, // interval line
        yField: 'yValue',
        // axisYTitle: '支出',
        // valueFormat: '0,0.00',
        // valueUnit: 'A',
        axisYPosition: index === 0 ? 'left' : 'right',
        // shapeField: 'smooth',
        // colorField: 'type',
        // group: true,
      };
      debugger
      if (dataDualAxes[index].data.length > 1) {
        childConfig.colorField = 'type';
        childConfig.group = true;
      }
      dualAxesChildren.push(childConfig);
    });
    // debugger
    let configDualAxes = {
      ...myUtil.chartsAntD.configDualAxes({
        xField: 'xValue',
        axisXTitle: '出口年月',
        children: dualAxesChildren,
        //   {
        //     colorField: 'type',
        //     group: true,
        //   },
        //   {
        //     colorField: 'name',
        //     scale: { series: { independent: true } },
        //   },
      }),
    };
    chartArr.push({ type: 'dualAxes', config: configDualAxes });




    // 配置 线图
    // let configLine1 = {
    //   ...myUtil.chartsAntD.configLine({
    //     data: dataLine,
    //     colorField: 'type',
    //   }),
    // };
    // chartArr.push({ type: 'line', config: configLine1 });

    // 配置 柱图
    // let configColumn1 = {
    //   ...myUtil.chartsAntD.configColumn({
    //     data: dataColumn1,
    //     showLabel: true,
    //   }),
    // };
    // if (chartData.length > 1) { // 多柱
    //   configColumn1.colorField = 'type';
    //   configColumn1.group = true;
    // }
    // chartArr.push({ type: 'column', config: configColumn1 });


    // fieldValue = getFieldName(fieldValue);
    // fieldType2 = getFieldName(fieldType2);
    // fieldType2Series = getFieldName(fieldType2Series);
    // if (chartType === 'pie') {
    //   let dataPie: any = [];
    //   let gridSource1: any = groupBy(gridData, fieldType) || [];
    //   Object.keys(gridSource1).forEach((key1: any) => {
    //     let bbb = gridSource1[key1];
    //     let aaa1 = sumBy(bbb, (item: any) => item[fieldValue[0]]) * 5; // *10仅用于测试
    //     // 数据 饼图
    //     dataPie.push({ type: key1, value: aaa1 });
    //   });
    //   // 配置 饼图
    //   let configPie = {
    //     ...myUtil.chartsAntD.configPie({
    //       data: dataPie,
    //       showTotal: true,
    //     }),
    //   };
    //   chartArr.push({ type: 'pie', config: configPie });
    // } else if (chartType === 'line') {
    //   let dataLine: any = [];
    //   let gridSource111: any = groupBy(gridData, fieldType) || [];
    //   // console.info(gridSource111);
    //   // debugger
    //   Object.keys(gridSource111).forEach((key1: any) => {
    //     let aaa1: any;
    //     let bbb = gridSource111[key1];
    //     if (fieldValue.length > 1) { // 多线
    //       fieldValue.forEach((fieldValueItem: any) => {
    //         aaa1 = sumBy(bbb, (item: any) => item[fieldValueItem]) * 5; // *10仅用于测试
    //         // 数据 线图2
    //         dataLine.push({ xValue: key1, yValue: aaa1, type: fieldValueItem });
    //       })
    //     } else { // 单线
    //       aaa1 = sumBy(bbb, (item: any) => item[fieldValue]) * 5; // *10仅用于测试
    //       // 数据 线图1
    //       dataLine.push({ xValue: key1, yValue: aaa1 });
    //     }
    //   });
    //   // 配置 线图
    //   let configLine1 = {
    //     ...myUtil.chartsAntD.configLine({
    //       data: dataLine,
    //       colorField: 'type',
    //     }),
    //   };
    //   chartArr.push({ type: 'line', config: configLine1 });
    // } else if (chartType === 'column') {
    //   let dataColumn1: any = [];
    //   let gridSource1: any = groupBy(gridData, fieldType) || [];
    //   Object.keys(gridSource1).forEach((key1: any) => {
    //     let aaa1: any;
    //     let bbb = gridSource1[key1];
    //     // debugger;
    //     if (fieldValue.length > 1) { // 多柱
    //       fieldValue.forEach((fieldValueItem: any) => {
    //         aaa1 = sumBy(bbb, (item: any) => item[fieldValueItem]) * 5; // *10仅用于测试
    //         // 数据 柱图
    //         dataColumn1.push({ xValue: key1, yValue: aaa1, type: fieldValueItem });
    //       })
    //     } else { // 单柱
    //       if (fieldType2 && fieldType2Series) {
    //         // 数据 柱图3
    //         const groupedData = myUtil.array.groupByFields(bbb, fieldType2, fieldType2Series);
    //         // console.log(groupedData);
    //         Object.keys(groupedData).forEach((key2: any) => {
    //           aaa1 = sumBy(groupedData[key2], (item: any) => item[fieldValue]) * 5;
    //           dataColumn1.push({
    //             xValue: key1,
    //             yValue: aaa1,
    //             type: key2.split('|')[0],
    //             series: key2.split('|')[1],
    //           })
    //         })
    //       } else {
    //         let aaa1 = sumBy(bbb, (item: any) => item[fieldValue]) * 5; // *10仅用于测试
    //         // 数据 柱图
    //         dataColumn1.push({ xValue: key1, yValue: aaa1 });
    //       }
    //     }
    //   });
    //   // 配置 柱图
    //   let configColumn1 = {
    //     ...myUtil.chartsAntD.configColumn({
    //       data: dataColumn1,
    //       showLabel: true,
    //     }),
    //   };
    //   if (fieldValue.length > 1) { // 多柱
    //     configColumn1.colorField = 'type';
    //     configColumn1.group = true;
    //   }
    //   if (fieldType2 && fieldType2Series) { // 单组数据分组
    //     configColumn1.colorField = 'series';
    //     configColumn1.seriesField = 'type';
    //     configColumn1.stack = {
    //       groupBy: ['x', 'series'],
    //       series: false,
    //     };
    //   }
    //   chartArr.push({ type: 'column', config: configColumn1 });
    // }
  });
  myUtil.chartsAntD.modalChart(chartArr);
};

// 图表设置表单 弹窗
DDBunit2ChartUtil.openChartConfigModal = ({config, chartConfigForm, refGrid}: any) => {
  const onSaveaaa = () => {
    chartConfigForm.validateFields().then(async (values: any) => {
      // console.info(values);
      // debugger
      DDBunit2ChartUtil.showChartModal({chartsConfigArr:[values], config, refGrid});
    });
  };
  console.info(config);
  let fieldsArr: any  = [];
  config?.grid_columns?.forEach((item: any) => {
    fieldsArr.push({
      name: item.title,
      // value: item.dataIndex,
      value: item.dict_field_id,
    });
  })
  // debugger;
  let formConfig: any = {
    form_layout_type: 3,
    form_label_input_layout: 'vertical', // horizontal vertical
    // form_items: [
    //   { label: '类别', type: 'Select', name: 'chartType',  list: [
    //     { name: '饼图', value: 'pie' },
    //     { name: '柱图', value: 'column' },
    //     { name: '线图', value: 'line' },
    //   ] },
    //   { label: 'fieldType', type: 'Select', name: 'fieldType', list: fieldsArr },
    //   { label: 'fieldValue', type: 'Select', name: 'fieldValue', mode: 'multiple', list: fieldsArr },
    //   { label: 'fieldType2', type: 'Select', name: 'fieldType2', list: fieldsArr },
    //   { label: 'fieldType2Series', type: 'Select', name: 'fieldType2Series', list: fieldsArr },
    //   { label: '备注', type: 'Textarea', name: 'remark' },
    // ],
    form_items: [
      { label: '指标维度', type: 'Select', name: 'fieldType', list: fieldsArr },
      { label: '图表数据', name: 'chartData', type: 'List', children: [
        { label: '图表类别', type: 'Select', name: 'chartType',  list: [
          { name: '双轴图', value: 'dualAxes' },
          { name: '饼图', value: 'pie' },
          { name: '柱图', value: 'column' },
          { name: '线图', value: 'line' },
        ] },
        { label: '值域字段', type: 'Select', name: 'fieldValue', mode: 'multiple', list: fieldsArr }, // mode: 'multiple' 柱图可以多选 ？？
        { label: '指标维度2', type: 'Select', name: 'fieldType2', list: fieldsArr },
        { label: '指标维度3', type: 'Select', name: 'fieldType2Series', list: fieldsArr },
        { label: '独占Y轴', type: 'Select', name: 'axisY', list: [{ name: '是', value: '1' }, { name: '否', value: '0' }] },

        // {
        //   name: 'ckfslx', label: '出口方式类型', type: 'Radio', list: [
        //     { value: 'bqf', name: '不区分' },
        //     { value: 'zyck', name: '自营出口' },
        //   ],
        // },
        //   { label: '单位', name: 'dw', type: 'Input', rules: [{ type: 'base_string', range: [0, 150] }] },
        //   { label: '类别', type: 'Select', name: 'gb',  list: [
        //     { name: '饼图', value: 'pie' },
        //   ] },
        //   { label: '计算方式代码', type: 'Select', name: 'yfjsfsDm', codeTable: 'code_dm_ckts_hgyfjsfs' },
      ] },
      { label: '备注', type: 'Textarea', name: 'remark' },
      // { label: '出口日期', type: 'DatePicker', name: 'ckrq1', format: 'YYYY-MM-DD' },
      // { label: '海关成交方式', type: 'Select', name: 'hgcjfsmc', codeTable: 'code_static_hgcjfs_mc' },
      // { label: '成交总价', type: 'InputNumber', name: 'cjzj', format: '0,0.00' },
    ],
  };
  Modal.info({
    title: 'testChart',
    wrapClassName: 'standard-modal-fn',
    width: CONSTANTS.C_MODAL_WIDTH_X3,
    footer: null,
    icon: null,
    closable: true,
    content: (<div style={{margin: '24px'}}>
      <DDBaseForm config={formConfig} form={chartConfigForm} initialValues={{}}/>
      <Button type='primary' onClick={onSaveaaa}>保存</Button>
    </div>),
  });
};

// 图表测试 弹窗
DDBunit2ChartUtil.testChartModal = ({refGrid}: any) => {
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
    console.log(groupedData);
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
  // 配置 线图2
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

  let chartArr: any = [
    { type: 'pie', config: configPie },
    { type: 'column', config: configColumn1 },
    { type: 'column', config: configColumn2 },
    { type: 'column', config: configColumn3 },
    { type: 'line', config: configLine1 },
    { type: 'line', config: configLine2 },
  ];

  myUtil.chartsAntD.modalChart(chartArr);
};

export default DDBunit2ChartUtil;
