import React, { useState, useEffect } from 'react';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
// import '@antv/s2-react/dist/style.min.css';
import { getS2GridData } from '@/services/hts/api';
import { CustomTreeNode, PivotSheet, S2DataConfig, S2Options, SpreadSheet, } from '@antv/s2';
import { Button } from 'antd';
import ProCard from '@ant-design/pro-card';

const TableList: React.FC<unknown> = () => {
  const [dataCfg, setDataCfg] = useState<any>();
  const [sortParams, setSortParams] = React.useState([]);

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

  const columns: any = ['year', 'quarter', 'month', 'ckbgdh', 'xh4', 'yhzh', 'jgfsDm', 'ckrq1', 'ckspDm', 'ckspmc', 'hgspmc', 'ckhth', 'hgcjfsmc',
    'hgjldwmc', 'cjsl1', 'cjhghbzmDm', 'cjzj', 'mylaj', 'dyjldwDm', 'cksl', 'dejldwDm', 'decksl'];
  const customTree: any = [
    { field: 'year', title: '年度', width: 100, description: 'a-1-1 描述' },
    { field: 'quarter', title: '季度', width: 100, description: 'a-1-1 描述' },
    // { field: 'month', title: '月份', width: 120, description: 'a-1-1 描述' },
    { field: 'cktmsywlxmcjh', title: '退（免）税业务类型', width: 180, description: 'a-1-1 描述' },
    { field: 'gnqyfs', title: '国内启运方式', width: 180, description: 'a-1-1 描述' },
    { field: 'ckbgdh', title: '报关单号', width: 180, description: 'a-1-1 描述' },
    { field: 'xh4', title: '项号', width: 60, description: 'a-1-1 描述' },
    { field: 'yhzh', title: '银行账号', width: 160, description: 'a-1-1 描述' },
    { field: 'jgfsDm', title: '监管方式', width: 155, description: 'a-1-1 描述' },
    { field: 'uu1', title: '单位及数量', width: 140, align: 'right', description: 'a-1-1 描述', children: [
      { field: 'dyjldwDm', title: '法定单位', width: 90, description: 'a-1-1 描述' },
      { field: 'cksl', title: '法定单位数量', width: 140, align: 'right', description: 'a-1-1 描述' },
      { field: 'dejldwDm', title: '第二单位', width: 90, description: 'a-1-1 描述' },
      { field: 'decksl', title: '第二单位数量', width: 140, align: 'right', description: 'a-1-1 描述' },
    ]},
    { field: 'ckrq1', title: '出口日期', width: 120, description: 'a-1-1 描述' },
    { field: 'ckspDm', title: '商品代码', width: 95, description: 'a-1-1 描述' },
    { field: 'ckspmc', title: '商品名称', width: 180, description: 'a-1-1 描述' },
    { field: 'hgspmc', title: '海关商品名称', width: 180, description: 'a-1-1 描述' },
    { field: 'ckhth', title: '出口合同号', width: 115, description: 'a-1-1 描述' },
    { field: 'hgcjfsmc', title: '成交方式', width: 85, description: 'a-1-1 描述' },
    { field: 'hgjldwmc', title: '成交单位', width: 90, description: 'a-1-1 描述' },
    { field: 'cjsl1', title: '成交数量', width: 140, align: 'right', description: 'a-1-1 描述' },
    { field: 'cjhghbzmDm', title: '成交币制', width: 85, description: 'a-1-1 描述' },
    { field: 'cjzj', title: '成交金额', width: 140, align: 'right', description: 'a-1-1 描述' },
    { field: 'mylaj', title: '美元离岸价', width: 140, align: 'right', description: 'a-1-1 描述' },
  ];

  // 获取数据
  const getData = () => {
    getS2GridData(`${API_URL_EXAMPLE}/hx/ty/crud/queryPagerS21`, {}).then((response) => {
      setDataCfg({
        fields: {
          // columns: columns,
          columns: customTree,
        },
        meta: [
          { name: '报关单号', field: 'ckbgdh' },
          { name: '项号', field: 'xh4' },
          { name: '银行账号', field: 'yhzh' },
          { name: '监管方式', field: 'jgfsDm' },
          { name: '法定单位', field: 'dyjldwDm' },
          { name: '法定单位数量', field: 'cksl' },
          { name: '第二单位', field: 'dejldwDm' },
          { name: '第二单位数量', field: 'decksl' },
          { name: '出口日期', field: 'ckrq1' },
          { name: '商品代码', field: 'ckspDm' },
          { name: '商品名称', field: 'ckspmc' },
          { name: '海关商品名称', field: 'hgspmc' },
          { name: '出口合同号', field: 'ckhth' },
          { name: '成交方式', field: 'hgcjfsmc' },
          { name: '成交单位', field: 'hgjldwmc' },
          { name: '成交数量', field: 'cjsl1' },
          { name: '成交币制', field: 'cjhghbzmDm' },
          { name: '成交金额', field: 'cjzj' },
          { name: '美元离岸价', field: 'mylaj' },
        ],
        data: response,
      });
    })
  }

  // const s2Options: S2Options = {
  const s2Options: SheetComponentOptions = {
    // width: 900,
    height: 600,
    seriesNumber: {
      enable: true,
      text: '序号'
    },
    frozen: {
      //   rowCount: 2, // 冻结行的数量，从顶部开始计数
      //   trailingRowCount: 1, // 冻结行数量，从底部开始计数
      colCount: 2, // 冻结列的数量，从左侧开始计数
      // trailingColCount: 3 // 冻结列的数量，从右侧开始计数
    },
    style: {
      // dataCell: {
      //   width: 190,
      //   height: 90
      // },
      colCell: {
        width: (colNode: any) => {
          console.info(colNode);
          // 例：前两列宽度 100px, 其他 50px
          // return colNode.colIndex <= 2 ? 190 : 50
          return colNode.extra?.width || 80;
        },
        // height: (colNode) => {
        //   // 例：前两列高度 100px, 其他 50px
        //   return colNode.colIndex <= 2 ? 100 : 50
        // },
      },
    },
  };

  const themeCfg: any = {
    name: 'gray', // default, colorful, gray, dark
    // theme: {
      // dataCell: {
        // bolderText: {
        //   textAlign: 'left',
        //   textBaseline: 'bottom',
        // },
        // text: {
        //   textAlign: 'left',
        //   textBaseline: 'bottom',
        // }
      // },
    // }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <ProCard>
        <SheetComponent
          sheetType="table"
          dataCfg={dataCfg}
          options={s2Options}
          header={header}
          themeCfg={themeCfg}
          adaptive={true}
          // adaptive={{ width: true, height: true }}
      />
      </ProCard>
  </div>);
};

export default TableList;
