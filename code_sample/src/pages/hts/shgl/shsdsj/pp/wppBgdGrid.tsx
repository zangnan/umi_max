import React from 'react';
import { Table, Tooltip } from 'antd';
import './style.less';
import myUtil from '@/pages/common/myUtil';

export interface WppBgdGridProps {
  dataSource?: any;
  rowKey?: any;
  size?: any;
  scroll?: any;
  rowSelection?: any;
  actionRef?: any;
  loading?: any;
  wshje?: any;
  wshrmbje?: any;
}

const WppBgdGrid: React.FC<WppBgdGridProps> = ({
  dataSource,
  rowKey,
  size = 'small',
  scroll={ x: `${document.documentElement.clientWidth - 645}px`, y: `${document.documentElement.clientHeight - 313}px` },
  rowSelection,
  actionRef,
  loading,
  wshje,
  wshrmbje,
}) => {

  const wppBgdColumns: any = [
    { title: '出口报关单号', dataIndex: 'bgdhgbh', width: 120,ellipsis: true,  align: 'left',render: (text: any) => {
      return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
    }},
    { title: '合同号', dataIndex: 'ckhth', width: 120,ellipsis: true,  align: 'left',render: (text: any) => {
      return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
    }},
    { title: '境外收货人', dataIndex: 'jwshrmc', width: 130, ellipsis: true, align: 'left',render: (text: any) => {
      return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
    }},
    { title: '出口日期', dataIndex: 'ckrq1', width: 100,  ellipsis: true,align: 'left',render: (text: any) => {
      return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
    }},
    { title: '成交币制', dataIndex: 'cjhbzmDm', width: 80, ellipsis: true, align: 'left',render: (text: any) => {
      return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
    }},
    { title: '成交金额', dataIndex: 'cjzj', width: 85,  ellipsis: true, align: 'right' ,render: (text: any) => {
        return <><Tooltip placement="topLeft" title={myUtil.grid.formatNum(text, '0,0.00')}> {myUtil.grid.formatNum(text, '0,0.00')}</Tooltip></>
      }
    },
    { title: '原币汇率', dataIndex: 'cjhbhl', width: 85,  ellipsis: true, align: 'right' ,render: (text: any) => {
      return <><Tooltip placement="topLeft" title={myUtil.grid.formatNum(text, '0,0.00')}> {myUtil.grid.formatNum(text, '0,0.00000')}</Tooltip></>
      }
    },
    { title: '人民币成交金额', dataIndex: 'rmbcjzj', width: 125,  ellipsis: true, align: 'right' ,render: (text: any) => {
      return <><Tooltip placement="topLeft" title={myUtil.grid.formatNum(text, '0,0.00')}> {myUtil.grid.formatNum(text, '0,0.00')}</Tooltip></>
      }
    },
    { title: '未收汇原币金额', dataIndex: 'wshje', fixed: 'right', width: 125, ellipsis: true, align: 'right' ,render: (text: any) => {
        return <><Tooltip placement="topLeft" title={myUtil.grid.formatNum(text, '0,0.00')}> {myUtil.grid.formatNum(text, '0,0.00')}</Tooltip></>
      }
    },
    { title: '未收汇人民币金额', dataIndex: 'wshrmbje', fixed: 'right', width: 125, ellipsis: true, align: 'right' ,render: (text: any) => {
        return <><Tooltip placement="topLeft" title={myUtil.grid.formatNum(text, '0,0.00')}> {myUtil.grid.formatNum(text, '0,0.00')}</Tooltip></>
      }
    }
  ];

  const tableEle: any = <div className='dd-table dd_znpd_grid'>
    <Table
      tableLayout='fixed'
      showSorterTooltip={false}
      bordered={true}
      columns={wppBgdColumns}
      rowKey={rowKey}
      rowSelection={rowSelection}
      dataSource={dataSource}
      loading={loading}
      size={size}
      scroll={scroll}
      pagination={false}
      summary={(pageData) => {
        return <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}>&nbsp;</Table.Summary.Cell>
          <Table.Summary.Cell index={1} className="t_center">勾选合计</Table.Summary.Cell>
          <Table.Summary.Cell index={2}>&nbsp;</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>&nbsp;</Table.Summary.Cell>
          <Table.Summary.Cell index={4}>&nbsp;</Table.Summary.Cell>
          <Table.Summary.Cell index={5}>&nbsp;</Table.Summary.Cell>
          <Table.Summary.Cell index={6}>&nbsp;</Table.Summary.Cell>
          <Table.Summary.Cell index={7}>&nbsp;</Table.Summary.Cell>
          <Table.Summary.Cell index={8}>&nbsp;</Table.Summary.Cell>
          <Table.Summary.Cell index={9} className="t_right">{myUtil.text.formatNum(wshje, '0,0.00')}</Table.Summary.Cell>
          <Table.Summary.Cell index={10} className="t_right">{myUtil.text.formatNum(wshrmbje, '0,0.00')}</Table.Summary.Cell>

        </Table.Summary.Row>
      </Table.Summary >;
      }}
    />
  </div>;


  return tableEle;
};
export default WppBgdGrid;
