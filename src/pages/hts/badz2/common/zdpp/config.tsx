/**
 * title: 自动匹配全部关单、单证不齐关单
 */
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
const unitConfig: any = {};

// 全部关单详情列表
unitConfig.qbgd_columns = [
  { title: '合计（份）', dataIndex: 'zfs', width: 100, align: 'center', fixed: 'left' },
  { title: '报关单号', dataIndex: 'ckbgdh', width: 160, align: 'center', fixed: 'left' },
  { title: '出口销售合同', dataIndex: 'ckxshtfs', width: 100, align: 'center' },
  { title: '购货合同', dataIndex: 'gwhtfs', width: 100, align: 'center' },
  { title: '外贸综合服务合同', dataIndex: 'wzfhtfs', width: 140, align: 'center' },
  { title: '提运单', dataIndex: 'tydfs', width: 100, align: 'center' },
  { title: '运输发票', dataIndex: 'ysfpfs', width: 100, align: 'center' },
  { title: '委托报关协议', dataIndex: 'wtbgxyfs', width: 100, align: 'center' },
  { title: '代理报关服务费发票', dataIndex: 'dlbgfwfpfs', width: 140, align: 'center' },
  { title: '其他单证', dataIndex: 'qtdzfs', width: 100, align: 'center' },
];

// 单证不齐配置列表
unitConfig.dzbq_columns = [
  {
    title: '序号', dataIndex: 'index', width: 80, fixed: 'left', align: 'center', render: (_text: any, _record: any, index: number) => (
      <span>{index + 1}</span>)
  },
  {
    title: '检查结果', dataIndex: 'jcjg', align: 'center', width: 100, fixed: 'left', render: (_text: any, _record: any, index: number) => {
      return (_record.dzqqfs + '/' + _record.pzglfs);
    },
  },
  { title: '报关单号', dataIndex: 'bgdhgbh', align: 'center', fixed: 'left', width: 160 },
  {
    title: '出口销售合同', dataIndex: 'ckxshtbz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => {
      return renderItems(_text);
    }
  },
  {
    title: '购货合同', dataIndex: 'gwhtbz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => {
      return renderItems(_text);
    }
  },
  {
    title: '外贸综合服务合同', dataIndex: 'wzfhtbz', align: 'center', width: 140, render: (_text: any, _record: any, index: number) => {
      return renderItems(_text);
    }
  },
  {
    title: '提运单', dataIndex: 'tydbz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => {
      return renderItems(_text);
    }
  },
  {
    title: '运输发票', dataIndex: 'ysfpbz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => {
      return renderItems(_text);
    }
  },
  {
    title: '委托报关协议', dataIndex: 'wtbgxybz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => {
      return renderItems(_text);
    }
  },
  {
    title: '代理报关服务费发票', dataIndex: 'dlbgfwfpbz', align: 'center', width: 140, render: (_text: any, _record: any, index: number) => {
      return renderItems(_text);
    }
  },
  // {
  //   title: '其他单据', dataIndex: 'qtdzbz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => {
  //     return renderItems(_text);
  //   }
  // },
{ title: '出口货物报关单', dataIndex: 'ckhwbgdfsxybz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => { return renderItems(_text); } },
{ title: '代理出口货物证明', dataIndex: 'dlckhwzdfsxybz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => { return renderItems(_text); } },
{ title: '无纸化放行通知书', dataIndex: 'wzhfxtzsdfsxybz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => { return renderItems(_text); } },
{ title: '装箱单', dataIndex: 'zxdfsxybz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => { return renderItems(_text); } },
{ title: '保税核注清单', dataIndex: 'bshzqdfsxybz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => { return renderItems(_text); } },
{ title: '出口发票', dataIndex: 'ckfpdfsxybz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => { return renderItems(_text); } },
{ title: 'INVOICE发票', dataIndex: 'invoicefpdfsxybz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => { return renderItems(_text); } },
{ title: '进项发票', dataIndex: 'jxfpdfsxybz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => { return renderItems(_text); } },
{ title: '代办退税专用发票', dataIndex: 'dbtstzyfpdfsxybz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => { return renderItems(_text); } },
{ title: '收汇凭证', dataIndex: 'shpzdfsxybz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => { return renderItems(_text); } },
{ title: '载货清单（舱单）', dataIndex: 'zhqdcddfsxybz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => { return renderItems(_text); } },
{ title: '货物付款水单', dataIndex: 'hwfksddfsxybz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => { return renderItems(_text); } },
{ title: '费用付款水单', dataIndex: 'fyfksddfsxybz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => { return renderItems(_text); } },
{ title: '离境备案清单', dataIndex: 'ljbaqddfsxybz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => { return renderItems(_text); } },
{ title: '其他类型单证', dataIndex: 'qtdzdfsxybz', align: 'center', width: 100, render: (_text: any, _record: any, index: number) => { return renderItems(_text); } }

];

// 格式化数据图标
const renderItems = (text: any) => {
  if ('Y' === text) {
    return <CheckOutlined style={{ color: '#87d068' }}/>;
  } else if ('N' === text) {
    return <CloseOutlined style={{ color: '#f50' }} />;
  } else {
    return <span>-</span>
  }
}

export default unitConfig;
