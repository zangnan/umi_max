import React from 'react';
import DDBaseGrid from '@/components/DDBaseGrid';

export interface BgdxqProps {
  data?: any;
}

const Bgdxq: React.FC<BgdxqProps> = ({
  data = [],
}) => {

  // 配置列表列
  const columns = [
    { title: '报关单号', dataIndex: 'bgdh', width: 160, fixed: 'left' },
    { title: '项号', dataIndex: 'xh', width: 50, fixed: 'left' },
    { title: '商品代码', dataIndex: 'spdm', width: 80 },
    { title: '商品名称', dataIndex: 'spmc', width: 80, ellipsis: true },
    { title: '数量', dataIndex: 'sl', width: 60, align: 'right' },
    { title: '单位', dataIndex: 'dw', width: 60 },
    { title: '原币金额', dataIndex: 'ybje', width: 70, align: 'right' },
    { title: '人民币金额', dataIndex: 'rmbje', width: 80, align: 'right' }
  ];

  return (
    <DDBaseGrid
      queryParam={{}}
      userDataSource={data}
      columns={columns}
      showSerialNumber={false}
      pagination={false}
      scroll={{ y: `${document.documentElement.clientHeight - 266}px` }}
    // tableLayout='auto'
    />
  );
};

export default Bgdxq;
