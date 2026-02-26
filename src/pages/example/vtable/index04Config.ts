const format1 = (rec: any) => {
  return '##$' + Number(rec).toFixed(2);
};
export default {
  api_grid_query: `${API_URL_EXAMPLE}/example/vtable03`,
  rows: [
    { dimensionKey: 'Category', title: '大类', width: 'auto', sort: true },
    { dimensionKey: 'Sub-Category', title: '子类', width: 'auto', sort: true }
  ],
  columns: [
    { dimensionKey: 'Region', title: 'Region', width: 'auto' },
    { dimensionKey: 'Segment', title: 'Segment', width: 'auto' }
  ],
  indicators: [
    { indicatorKey: 'QuantityMin', title: '数量【最小】', width: 'auto', format: format1, sort: true },
    { indicatorKey: 'QuantityMax', title: '数量【最大】', width: 'auto', sort: true },
    { indicatorKey: 'QuantitySum', title: '数量【合计】', width: 'auto', sort: true },
    { indicatorKey: 'Sales', title: '销售额', width: 'auto', sort: true },
    { indicatorKey: 'Profit', title: '利润', width: 'auto', sort: true }
  ],
  corner: { titleOnDimension: 'row', },
  dataConfig: {
    totals: {
      row: { showGrandTotals: true, showSubTotals: true, subTotalsDimensions: ['Category'], grandTotalLabel: '行总计', subTotalLabel: '行小计' },
      column: { showGrandTotals: true, showSubTotals: true, subTotalsDimensions: ['Region'], grandTotalLabel: '列总计', subTotalLabel: '列小计' }
    },
    aggregationRules: [
      { indicatorKey: 'QuantityMin', field: 'Quantity', aggregationType: 'MIN' },
      { indicatorKey: 'QuantityMax', field: 'Quantity', aggregationType: 'MAX' },
      { indicatorKey: 'QuantitySum', field: 'Quantity', aggregationType: 'SUM' },
    ]
  },
  widthMode: 'standard',
  heightMode: 'autoHeight',
};