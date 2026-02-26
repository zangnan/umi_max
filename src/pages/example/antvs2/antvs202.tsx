import React, { useState, useEffect } from 'react';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
// import '@antv/s2-react/dist/style.min.css';
import { getS2GridData } from '@/services/hts/api';
import { Button, Radio, Form } from 'antd';
import ProCard from '@ant-design/pro-card';
import { cloneDeep } from 'lodash';
import { PivotSheet, EXTRA_FIELD, S2Options, Aggregation, S2DataConfig } from '@antv/s2';

const TableList: React.FC<unknown> = () => {
  const [dataCfg, setDataCfg] = useState<any>();
  const [sortParams, setSortParams] = useState([]);
  const [rowShowGrandTotals, setRowShowGrandTotals] = useState<any>(true);
  const [rowSubTotals, setRowSubTotals] = useState<any>(true);
  const [colShowGrandTotals, setColShowGrandTotals] = useState<any>(true);
  const [colSubTotals, setColSubTotals] = useState<any>(true);
  const [valueInCols, setValueInCols] = useState<any>(true);
  const [form] = Form.useForm();

  const header =  {
    title: '出口进货明细',
    description: '出口进货明细出口进货明细',
    export: { open: true },
    advancedSort: {
      open: true,
      sortParams,
      onSortConfirm: (ruleValues, sortParams) => {
        setDataCfg({ ...dataCfg, sortParams });
        setSortParams(sortParams);
      },
    },
    switcher: { open: true },
    extra: (
      <Button size={'small'} style={{ verticalAlign: 'top' }}>
        自定义按钮
      </Button>
    ),
  };

  // 获取数据
  const getData = () => {
    getS2GridData(`${API_URL_EXAMPLE}/dict/automatic/queryPagerStatistics`, {}).then((response) => {
      setDataCfg({
        fields: {
          rows: [
            'year',
            'quarter',
          ],
          columns: [
            'ckspmc',
            'cjhghbzmDm',
          ],
          values: [
            'mylaj',
            'tse',
            // 'cjzj',
          ],
          valueInCols: valueInCols
        },
        meta: [
          { name: '报关单号', field: 'ckbgdh', width: 90, fixed: 'left' },
          { name: '银行账号', field: 'yhzh', width: 90 },
          { name: '年度', field: 'year', width: 80 },
          { name: '季度', field: 'quarter', width: 80 },
          { name: '商品名称', field: 'ckspmc', width: 160, ellipsis: true },
          { name: '监管方式代码', field: 'jgfsDm2', width: 100 },
          { name: '监管方式', field: 'jgfsDm', width: 115, codeTable: 'code_dm_ckts_hgjgfs' },
          { name: '出口日期', field: 'ckrq1', width: 110, render: { type: 'date', format: 'YYYY-MM-DD' } },
          { name: '美元离岸价', field: 'mylaj', width: 120, align: 'right', render: { type: 'number', format: '0,0.00' } },
          { name: '成交币制', field: 'cjhghbzmDm', width: 85 },
          { name: 'uuid', field: 'uuid', width: 85 },
          { name: '成交金额', field: 'cjzj' },
          { name: '退税额', field: 'tse' },
        ],
        data: response.body.rows,
      });
    })
  }

  const s2Options: SheetComponentOptions = {
    height: 600,
    // interaction: {
    //   hoverHighlight: false,
    // },
    // hierarchyType: 'tree',
    totals: {
      row: {
        showGrandTotals: rowShowGrandTotals,
        showSubTotals: rowSubTotals,
        reverseGrandTotalsLayout: true,
        reverseSubTotalsLayout: true,
        subTotalsDimensions: ['year'],
        // grandTotalsLabel: '总计',
        // subTotalsLabel: '小计',
        // subTotalsGroupDimensions: ['cksl', 'ckspmc'],
        // grandTotalsGroupDimensions: ['cksl'],
        calcGrandTotals: {
          aggregation: Aggregation.SUM,
        },
        calcSubTotals: {
          aggregation: Aggregation.SUM,
        },
      },
      col: {
        showGrandTotals: colShowGrandTotals,
        showSubTotals: colSubTotals,
        reverseGrandTotalsLayout: true,
        reverseSubTotalsLayout: true,
        subTotalsDimensions: ['ckspmc'],
        // grandTotalsLabel: '总计',
        // subTotalsLabel: '小计',
        calcGrandTotals: {
          aggregation: Aggregation.SUM,
        },
        calcSubTotals: {
          aggregation: Aggregation.SUM,
        },
      },
    },
    // conditions: {
    //   text: [
    //     // 行头
    //     {
    //       field: 'ckspmc',
    //       mapping() {
    //         return {
    //           fill: '#DB6BCF',
    //         };
    //       },
    //     },
    //     // 列头
    //     {
    //       field: 'cjhghbzmDm',
    //       mapping() {
    //         return {
    //           fill: '#025DF4',
    //         };
    //       },
    //     },
    //     // 单独控制角头
    //     {
    //       field: 'jgfsDm',
    //       mapping(field) {
    //         if (field === '监管方式') {
    //           return {
    //             fill: '#327039',
    //           };
    //         }
    //       },
    //     },
    //     // 单独配置指标名
    //     {
    //       field: EXTRA_FIELD,
    //       mapping() {
    //         return {
    //           fill: '#5B8FF9',
    //         };
    //       },
    //     },
    //     // 配置数据单元格
    //     {
    //       field: 'cksl',
    //       mapping() {
    //         return {
    //           fill: '#2498D1',
    //         };
    //       },
    //     },
    //   ],
    // },
  };

  const options = [
    { label: '开启', value: true },
    { label: '关闭', value: false },
  ];

  const onChangeParam = ({ target: { value } }: any, targetParam: any) => {
    if (targetParam === 'rowShowGrandTotals') {
      setRowShowGrandTotals(value);
    } else if (targetParam === 'rowSubTotals') {
      setRowSubTotals(value);
    } else if (targetParam === 'colShowGrandTotals') {
      setColShowGrandTotals(value);
    } else if (targetParam === 'colSubTotals') {
      setColSubTotals(value);
    } else if (targetParam === 'valueInCols') {
      setValueInCols(value);
      let tmpDataCfg = cloneDeep(dataCfg);
      tmpDataCfg.fields.valueInCols = value;
      setDataCfg(tmpDataCfg);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <ProCard>
        <Form layout='inline' form={form} >
          <Form.Item label="行是否显示总计" name="rowShowGrandTotals">
            <Radio.Group options={options} onChange={(param: any) => {onChangeParam(param, 'rowShowGrandTotals') }} value={rowShowGrandTotals} optionType="button" defaultValue={rowShowGrandTotals} />
          </Form.Item>
          <Form.Item label="行是否显示小计" name="rowSubTotals">
            <Radio.Group options={options} onChange={(param: any) => {onChangeParam(param, 'rowSubTotals') }} value={rowSubTotals} optionType="button" defaultValue={rowSubTotals} />
          </Form.Item>
          <Form.Item label="列是否显示总计" name="colShowGrandTotals">
            <Radio.Group options={options} onChange={(param: any) => {onChangeParam(param, 'colShowGrandTotals') }} value={colShowGrandTotals} optionType="button" defaultValue={colShowGrandTotals} />
          </Form.Item>
          <Form.Item label="列是否显示小计" name="colSubTotals">
            <Radio.Group options={options} onChange={(param: any) => {onChangeParam(param, 'colSubTotals') }} value={colSubTotals} optionType="button" defaultValue={colSubTotals} />
          </Form.Item>
          <Form.Item label="数值置于列头" name="valueInCols">
            <Radio.Group options={options} onChange={(param: any) => {onChangeParam(param, 'valueInCols') }} value={valueInCols} optionType="button" defaultValue={valueInCols} />
          </Form.Item>
        </Form>
        <SheetComponent
          dataCfg={dataCfg}
          options={s2Options}
          header={header}
          adaptive={true}
        />
      </ProCard>
  </>);
};

export default TableList;
