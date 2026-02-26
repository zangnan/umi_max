import React, { useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Table, Form, DatePicker, Button, Spin, Empty, Space } from 'antd';
import DDBaseGrid from '@/components/DDBaseGrid';
import dayjs from 'dayjs';
import { groupBy } from 'lodash';
import { getReportGridData } from '@/services/hts/api';
import excelUtil from '@/components/DDAssist/util/excelUtil';
import myUtil from '@/components/DDAssist/util';

const Report01: React.FC<unknown> = () => {
  const [gridData, setGridData] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);
  const [masker, setMasker] = useState(false);
  const [showResult, setShowResult] = useState(false);    // show result
  const [form1] = Form.useForm();

  // 数据分组，计算合并单元格、分组求和
  const groupByType = (arr: any) => {
    const groupKey: any = 'swcode';
    const grouped = groupBy(arr, (v) => (v[groupKey]));
    const resultSum = Object.keys(grouped).map((k: any)=>{
      const sum = grouped[k].reduce((total, curr) => {
        return total + Number(curr.ts || 0)
      }, 0);
      return sum
    });
    return Object.keys(grouped)
      .map((k, index) =>
        grouped[k].map((v: any, i: any, arr2: any) => ({
          ...v,
          rowSpan: i === 0 ? arr2.length : 0,
          groupTotal: resultSum[index],
        }))
      )
      .flatMap((v) => v);
  };

  // 合并单元格
  function tableMergeCellsRender(value: any, record: any) {
    const obj: any = {
      children: value,
      props: {},
    };
    obj.props.rowSpan = record.rowSpan;
    obj.props.groupTotal = record.groupTotal;
    return obj;
  }

  // 获取数据
  const searchData = (byElement?: any) => {
    form1.validateFields().then((values: { rangeTime: any; tjgz: any}) => {
      // 获取表单数据
      const {rangeTime} = values;
      const tjyf = rangeTime ? rangeTime.format('YYYYMM') : dayjs(new Date()).format('YYYYMM');
      // 接口数据
      const apiParam: any = {
        tjyf, // 统计月份
      }
      // 切换查询条件时不查询，只能通过点击查询按钮查询
      if (byElement) {
        return;
      }
      setMasker(true);
      getReportGridData(`${API_URL_EXAMPLE}/hx/ty/crud/queryPager4`, apiParam).then((response) => {
        setMasker(false);
        setShowResult(true);
        const { code, body } = response;
        if (code !== '200') {
          return;
        }
        setColumns([
          { title: '统计月份', dataIndex: 'tjyf', width: 80, render: (value: any, record: any, index: any) => {
            const obj: any = {
              children: value,
              props: {},
            };
            if (index === 0) {
              obj.props.rowSpan = body.length || 0;
            } else {
              obj.props.rowSpan = 0;
            }
            return obj;
          }},
          { title: '序号', dataIndex: 'rowno', width: 50 },
          { title: '地区代码', dataIndex: 'swcode', width: 120, render: (value: any, record: any) => tableMergeCellsRender(value, record) },
          { title: '地区名称', dataIndex: 'swname', width: 120, render: (value: any, record: any) => tableMergeCellsRender(value, record) },
          { title: '渠道代码', dataIndex: 'channel_id' },
          { title: '渠道名称', dataIndex: 'channel_name' },
          { title: '访问次数', dataIndex: 'ts', width: 100, align: 'right' },
          { title: '合计', dataIndex: 'groupTotal', width: 120, align: 'right', render: (value: any, record: any) => tableMergeCellsRender(value, record)  },
        ]);
        body.forEach((tmpRow: any, index: number) => {
            const tmpRow2: any = { ...tmpRow };
            tmpRow2.rowno = index + 1;
            body[index] = tmpRow2;
        })
        setGridData(groupByType(body));
      })
    })
  };

  // 表单初始数据
  const initData= {
    rangeTime: dayjs(new Date()),
  };

  // 刷新
  const handleRefresh = () => {
    searchData();
  }

  // 导出
  const handleExport = () => {
    excelUtil.export({
      excelName: `${gridData[1].tjyf}_调用统计_地区渠道.xlsx`,
      setMasker,
      sheetData: [
        { gridData: gridData, sheetName: '地区渠道', showIndex: false, cols: [
          { title: '统计月份', dataIndex: 'tjyf', width: 80, align: 'center' },
          { title: '序号', dataIndex: 'rowno', width: 60, align: 'center', type: 'number' },
          { title: '地区代码', dataIndex: 'swcode', width: 130 },
          { title: '地区名称', dataIndex: 'swname', width: 130 },
          { title: '渠道代码', dataIndex: 'channel_id', width: 230 },
          { title: '渠道名称', dataIndex: 'channel_name', width: 240 },
          { title: '访问次数', dataIndex: 'ts', width: 100, type: 'number', sum: true },
          { title: '合计', dataIndex: 'groupTotal', width: 100, type: 'number' },
        ] },
      ]
    });
  }

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal">
        <ProCard>
          <Form form={form1} layout='inline' initialValues={initData}>
            <Form.Item name="rangeTime" >
              <DatePicker format='YYYYMM' picker="month" onChange={() => searchData('byRangeTime')} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={() => handleRefresh()} >查询</Button>
                {gridData?.length > 0 && <Button type="primary" onClick={() => handleExport()} >导出</Button>}
              </Space>
            </Form.Item>
          </Form>
        </ProCard>
        {showResult ?
          <ProCard>
            <DDBaseGrid
              bordered={true}
              columns={columns}
              userDataSource={gridData}
              scroll={{x: 'max-content'}}
              pagination={false}
              summary={(pageData: any) => {
                let totalRepayment = 0;
                pageData.forEach((rowData: any) => {
                  const ts: any = rowData?.ts || 0;
                  totalRepayment += Number(ts);
                });
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={6} index={0} ><div style={{ textAlign: 'right' }}>合计</div></Table.Summary.Cell>
                    <Table.Summary.Cell colSpan={2} index={6}><div style={{ textAlign: 'right' }}>{totalRepayment}</div></Table.Summary.Cell>
                  </Table.Summary.Row>
                )
              }}
            />
          </ProCard>
          :
          <Empty
            description='请录入查询条件后，点击查询。'
            style={{margin: '40px 0 40px 0'}}
            image={myUtil.theme.getNoDataImageUrl()}
          />
        }
      </ProCard>
    </Spin>
  );
};

export default Report01;
