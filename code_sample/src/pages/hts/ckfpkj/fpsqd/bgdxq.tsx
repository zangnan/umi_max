import React from 'react';
import { Table, Tooltip } from 'antd';
import myUtil from '@/pages/common/myUtil';
import './style.less';

export interface BgdxqProps {
  data?: any;
}

const Bgdxq: React.FC<BgdxqProps> = ({
  data,
}) => {

  // 处理项号返回列
  const renderXhRow = (value: any, row: any) => {
    const obj = {
      children: value,
      props: { colSpan: 1 },
    };
    if (row.bgdhgbh) {
      obj.children = `报关单号：${row.bgdhgbh}`;
      obj.props.colSpan = 8;
    }
    return obj;
  };

  // 处理其他返回列
  const renderOtherRow = (value: any, row: any) => {
    const obj = {
      children: value,
      props: { colSpan: 1 },
    };
    if (row.bgdhgbh) {
      obj.props.colSpan = 0;
    }
    // 商品代码
    if (row.hgspmc === value) {
      obj.children = (<><Tooltip placement="topLeft" title={value}> {value}</Tooltip></>);
    }
    // 商品名称

    // 数量
    if (row.sl === value) {
      obj.children = myUtil.text.formatNum(value, '0,0.00000');
    }
    // 单位
    if (row.jldwmc === value) {
      obj.children = (<><Tooltip placement="topLeft" title={value}> {value}</Tooltip></>);
    }
    // 成交币制

    // 原币金额
    if (row.ybje === value) {
      obj.children = myUtil.text.formatNum(value, '0,0.00');
    }
    // 人民币金额
    if (row.rmbje === value) {
      obj.children = myUtil.text.formatNum(value, '0,0.00');
    }
    return obj;
  };
  // 配置列表列
  const columns = [
    { title: '项号', dataIndex: 'hwxh', width: 65, render: renderXhRow },
    { title: '商品代码', dataIndex: 'hgckspDm', width: 105, render: renderOtherRow },
    { title: '商品名称', dataIndex: 'hgspmc', width: 110, ellipsis: true, render: renderOtherRow },
    { title: '数量', dataIndex: 'sl', width: 110, align: 'right', render: renderOtherRow },
    { title: '单位', dataIndex: 'jldwmc', width: 70, ellipsis: true, render: renderOtherRow },
    { title: '成交币制', dataIndex: 'ybbz', width: 70, render: renderOtherRow },
    { title: '原币金额', dataIndex: 'ybje', width: 110, align: 'right', render: renderOtherRow },
    { title: '人民币金额', dataIndex: 'rmbje', width: 110, align: 'right', render: renderOtherRow }
  ];

  // 设置编辑列
  const mergedColumns: any = columns.map((col: any) => {
    return {
      ...col,
      // onCell: (record: any) => {
      //   if (col.dataIndex === 'hh') {
      //     if (record.bgdhgbh) {
      //       return { colSpan: 8 }
      //     } else {
      //       return { colSpan: 1 }
      //     }
      //   } else {
      //     if (record.bgdhgbh) {
      //       return { colSpan: 0 }
      //     } else {
      //       return { colSpan: 1 }
      //     }
      //   }
      // }
    };
  });

  return (
    <div className="dd_ant_table_group">
      <Table
        tableLayout="fixed"
        columns={mergedColumns}
        // rowKey='key'
        size="small"
        dataSource={data}
        pagination={false}
        expandable={{
          defaultExpandAllRows: true,
        }}
        rowClassName={(record: any) => record.bgdhgbh ? 'ddatg_group_title' : ''}
        scroll={{ x: '550px', y: `${document.documentElement.clientHeight - 266}px` }}
      />
    </div>
  );
};

export default Bgdxq;
