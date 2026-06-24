import React, { useEffect, useState, useContext } from 'react';
import { Table, Form, Tooltip, Button, Divider, message} from 'antd';
import type { DDBaseGridProps, PaginationProps } from '@/components/DDBaseGrid/data.d';
import UnitUtil from '@/components/DDBunit/unit_util';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import './style.less';
import myUtil from '@/components/DDAssist/util';
import { EditOutlined, DeleteOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import EditableCell from './editableCell';
import { updateShglYppBgd } from '@/pages/hts/services/htsApi';



export interface YppBgdGridProps {
  dataSource?: any;
  rowKey?: any;
  size?: any;
  scroll?: any;
  rowSelection?: any;
  actionRef?: any;
  loading?: any;
  setLoading?: any;
  leftPagination?: any;
  setLeftPagination?: any;
  query?: any;
  topData?: any;
  setTopData?: any;
}

const YppBgdGrid: React.FC<YppBgdGridProps> = ({
  dataSource,
  rowKey,
  size = 'small',
  scroll={ x: `${document.documentElement.clientWidth - 645}px`, y: `${document.documentElement.clientHeight - 313}px` },
  rowSelection,
  actionRef,
  loading,
  setLoading,
  leftPagination,
  setLeftPagination,
  query,
  topData,
  setTopData
}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<any>('');                        // 编辑行标识
  const isEditing = (record: any) => record.uuid === editingKey;

  // 编辑
  const handleEdit = (record: any) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.uuid);
  };

  // 修改
  const handleSaveRow = async (record: any) => {
    const row = await form.validateFields();
    const newData = [...dataSource];
    const index = newData.findIndex((item) => record?.uuid === item?.uuid);
    const yitem = newData[index];
    // 修改前已匹配金额
    const yYzje1 = Number(yitem?.ppyzje || '0.00').toFixed(2);
    // 修改后已匹配金额
    const xYzje1 = Number(row?.ppyzje || '0.00').toFixed(2);
    // 水单已匹配金额
    const zYzje1 = Number(topData?.yzje1 || '0.00').toFixed(2);
    // 水单收汇总金额
    const ckshje = yitem.ppbzDm === '1' ? Number(topData?.ckshje || 0.00).toFixed(2) : Number(topData?.ckshjermb|| 0.00).toFixed(2);
    const obj = {
      uuid: record.uuid,
      yzje1: row?.ppyzje,
      ppbzDm: record.ppbzDm
    };
    setLoading(true);
    updateShglYppBgd(obj).then((res: any) => {
      setLoading(false);
      if (res?.code === '200') {
        setEditingKey('');
        const newTopData = {...topData};
        const newYzje1 = Number(zYzje1) - Number(yYzje1) + Number(xYzje1);
        const newSyje = Number(ckshje) - Number(newYzje1);
        newTopData.yzje1 = Number(newYzje1 || 0.00).toFixed(2);
        newTopData.syje = Number(newSyje).toFixed(2);
        setTopData(newTopData);
        query();
      } else {
        message.error(res?.msg);
      }
    });
  };

  // 取消修改
  const handleCancel = (record: any) => {
    setEditingKey('');
  };

  // 设置: 分页
  const handleOnChange = (currentPagination: any) => {
    setLeftPagination(Object.assign(leftPagination, currentPagination));
    query();
  }

  const yppBgdColumns: any = [
    { title: '出口报关单号', dataIndex: 'bgdhgbh', width: 140,ellipsis: true,align: 'left',render: (text: any) => {
      return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
    }},
    { title: '合同号', dataIndex: 'ckhth', width: 120,ellipsis: true,  align: 'left',render: (text: any) => {
      return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
    }},
    { title: '境外收货人', dataIndex: 'jwshrmc', width: 120, ellipsis: true, align: 'left',render: (text: any) => {
      return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
    }},
    { title: '出口日期', dataIndex: 'ckrq1', width: 90,  ellipsis: true,align: 'left',render: (text: any) => {
      return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
    }},
    { title: '是否提取收汇申报', dataIndex: 'sftqsh', width: 140,  ellipsis: true,align: 'left',render: (text: any) => {
      return <><Tooltip placement="topLeft" title={text==='Y'? '是': '否'}> {text==='Y'? '是': '否'}</Tooltip></>
    }},
    { title: '成交币制', dataIndex: 'cjhbzmDm', width: 80, ellipsis: true, align: 'left',render: (text: any) => {
      return <><Tooltip placement="topLeft" title={text}>{text}</Tooltip></>
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
    { title: '匹配币制', dataIndex: 'ppbzmc', width: 85,  ellipsis: true, align: 'right' ,render: (text: any) => {
      return <><Tooltip placement="topLeft" title={text}>{text}</Tooltip></>
      }
    },
    { title: '未收汇金额', dataIndex: 'ppwshje', width: 85, ellipsis: true, align: 'right' ,render: (text: any) => {
        return <><Tooltip placement="topLeft" title={myUtil.grid.formatNum(text, '0,0.00')}> {myUtil.grid.formatNum(text, '0,0.00')}</Tooltip></>
      }
    },
    { title: '本次匹配金额', dataIndex: 'ppyzje',editable: true, editType: 'InputNumber', fixed: 'right', width: 120, ellipsis: true, align: 'right' ,render: (text: any) => {
      return <><Tooltip placement="topLeft" title={myUtil.grid.formatNum(text, '0,0.00')}> {myUtil.grid.formatNum(text, '0,0.00')}</Tooltip></>
      }
    },
    {
      title: '操作', dataIndex: 'operation', width: 80, align: 'center', fixed: 'right', render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <Button type="link" onClick={() => handleSaveRow(record)}><CheckOutlined /></Button>
            <Divider type='vertical' />
            <Button type="link" onClick={() => handleCancel(record)}><CloseOutlined /></Button>
          </>
        ) :
        (
          <>
            <Button type="link" disabled={record?.sftqsh==='Y' ? true: false} onClick={() => handleEdit(record)}><EditOutlined /></Button>
          </>
        )
      }
    }
  ];

  const mergedColumns = yppBgdColumns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any, index: number) => {
        return {
          record,
          editType: col.editType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          handleRowOnchange: handleRowOnchange,
          index,
        };
      }
    };
  });

  const handleRowOnchange = (param: any) => {
    const { dataIndex } = param;
    // 调整金额 计算单价和税额
    if (dataIndex === 'ppyzje') {
      const ppyzje = Number(form.getFieldValue('ppyzje') || '0.00').toFixed(2);
      form.setFieldsValue({
        ppyzje: ppyzje
      });
    }
  }

  const tableEle: any = <div className='dd-table dd_znpd_grid'>
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell.editableCell,
          },
        }}
        tableLayout='fixed'
        showSorterTooltip={false}
        bordered={true}
        columns={mergedColumns}
        rowKey={'uuid'}
        scroll={{ x: `${document.documentElement.clientWidth - 645}px` }}
        rowSelection={rowSelection}
        dataSource={dataSource}
        loading={loading}
        size={size}
        pagination={leftPagination}
        onChange={handleOnChange}
        summary={(pageData) => {
          let totalPpwshje = 0;
          let totalPpYzje = 0;
          pageData.forEach(({ ppwshje, ppyzje }) => {
            totalPpwshje += Number(ppwshje) || 0;
            totalPpYzje += Number(ppyzje) || 0;
          });
          return <Table.Summary fixed>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>&nbsp;</Table.Summary.Cell>
            <Table.Summary.Cell index={1} className="t_center">合计</Table.Summary.Cell>
            <Table.Summary.Cell index={2}>&nbsp;</Table.Summary.Cell>
            <Table.Summary.Cell index={3}>&nbsp;</Table.Summary.Cell>
            <Table.Summary.Cell index={4}>&nbsp;</Table.Summary.Cell>
            <Table.Summary.Cell index={5}>&nbsp;</Table.Summary.Cell>
            <Table.Summary.Cell index={6}>&nbsp;</Table.Summary.Cell>
            <Table.Summary.Cell index={7}>&nbsp;</Table.Summary.Cell>
            <Table.Summary.Cell index={8}>&nbsp;</Table.Summary.Cell>
            <Table.Summary.Cell index={9}>&nbsp;</Table.Summary.Cell>
            <Table.Summary.Cell index={10}>&nbsp;</Table.Summary.Cell>
            <Table.Summary.Cell index={11} className="t_right">{myUtil.text.formatNum(totalPpwshje, '0,0.00')}</Table.Summary.Cell>
            <Table.Summary.Cell index={12} className="t_right">{myUtil.text.formatNum(totalPpYzje, '0,0.00')}</Table.Summary.Cell>
            <Table.Summary.Cell index={13}>&nbsp;</Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary >;
        }}
      />
    </Form>
  </div>;


  return tableEle;
};
export default YppBgdGrid;
