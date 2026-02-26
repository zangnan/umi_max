import React, { useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Form, DatePicker, Radio, Select, Button, Spin, Empty } from 'antd';
import DDBaseGrid from '@/components/DDBaseGrid';
import { getReportGridData } from '@/services/hts/api';
import dayjs from 'dayjs';
import myUtil from '@/components/DDAssist/util';
import './style.less';

const Report02: React.FC<unknown> = () => {
  const [gridData, setGridData] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);
  const [masker, setMasker] = useState(false);
  const [showResult, setShowResult] = useState(false);    // show result
  const [form1] = Form.useForm();

  // 切换时间选项
  const getTimeRange = (quickChoice: any) => {
    const timeRange = quickChoice;
    let timeStart;
    let timeEnd;
    if (timeRange === 'rangeNow') {
      timeStart = dayjs(new Date()).subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
      timeEnd = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
    } else if (timeRange === 'rangeToday') {
      timeStart = `${dayjs(new Date()).format('YYYY-MM-DD')  } 00:00:00`;
      timeEnd = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
    } else if (timeRange === 'rangeYesterday') {
      timeStart = `${dayjs(new Date()).subtract(1, 'days').format('YYYY-MM-DD')  } 00:00:00`;
      timeEnd = `${dayjs(new Date()).subtract(1, 'days').format('YYYY-MM-DD')  } 23:59:59`;
    } else if (timeRange === 'range7') {
      timeStart = `${dayjs(new Date()).subtract(6, 'days').format('YYYY-MM-DD')  } 00:00:00`;
      timeEnd = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss') ;
    } else if (timeRange === 'range30') {
      timeStart = `${dayjs(new Date()).subtract(29, 'days').format('YYYY-MM-DD')  } 00:00:00`;
      timeEnd = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss') ;
    }
    form1.setFieldsValue({
      rangeTime: [dayjs(timeStart, ["YYYY-MM-DD HH:mm:ss"]), dayjs(timeEnd, ["YYYY-MM-DD HH:mm:ss"] )],
    });
    const param = {
      lrrqStart: dayjs(timeStart, ["YYYY-MM-DD HH:mm:ss"]).format('x'),
      lrrqEnd: dayjs(timeEnd, ["YYYY-MM-DD HH:mm:ss"]).format('x'),
    }
    return param;
  }

  // 获取数据
  const searchData = (byElement?: any) => {
    form1.validateFields().then((values: { rangeTime: any; groupType: any; quickChoice: any; tjgz: any}) => {
      // 获取表单数据
      const {rangeTime} = values;
      const timeStart = rangeTime ? `${dayjs(rangeTime[0]).format('YYYY-MM-DD') } 00:00:00` : `${dayjs(new Date()).format('YYYY-MM-DD') } 00:00:00`;
      const timeEnd = rangeTime ? `${dayjs(rangeTime[1]).format('YYYY-MM-DD') } 23:59:59`: `${dayjs(new Date()).format('YYYY-MM-DD') } 23:59:59`;
      const fztj = values.groupType;
      const {quickChoice} = values;
      const {tjgz} = values;
      // 接口数据
      let apiParam: any = {
        fztj, // 1=天  2=小时  3=5分钟  4=1分钟  5=周  6=月  7=季度  8=年
        lrrqStart: timeStart,
        lrrqEnd: timeEnd,
        tjgz, // 统计规则：地区=dq 接口=jk 企业=qy
      }
      // 接口数据 时间范围处理
      if (byElement === 'byRangeTime') { // 从时间范围控件选择
        form1.setFieldsValue({
          quickChoice: null,
        });
        apiParam.lrrqStart = dayjs(timeStart, ["YYYY-MM-DD HH:mm:ss"]).format('x');
        apiParam.lrrqEnd = dayjs(timeEnd, ["YYYY-MM-DD HH:mm:ss"]).format('x');
      } else if (quickChoice) { // 如果时间快速选择有值
          apiParam = {
            ...apiParam,
            ...getTimeRange(quickChoice),
          }
        } else {
          apiParam.lrrqStart = dayjs(timeStart, ["YYYY-MM-DD HH:mm:ss"]).format('x');
          apiParam.lrrqEnd = dayjs(timeEnd, ["YYYY-MM-DD HH:mm:ss"]).format('x');
        }
      // 切换查询条件时不查询，只能通过点击查询按钮查询
      if (byElement) {
        return;
      }
      setMasker(true);
      getReportGridData(`${API_URL_EXAMPLE}/hx/ty/crud/queryPager5`, apiParam).then((response) => {
        setMasker(false);
        setShowResult(true);
        const { code, body } = response;
        const { title = [], grid = [], total = [] } = body;
        if (code !== '200') {
          return;
        }
        const arr: any = [];
        // 标题
        const colConfig: any = [];
        let width = 120;
        if (tjgz === 'jk') {
          width = 200;
        } else if (tjgz === 'qy') {
          width = 150;
        }
        title.forEach((item: any, index: number) => {
          if (index === 0) {
            colConfig.push({ title: '', dataIndex: `col_${index}`, width, align: 'right', fixed: 'left', className: 'rpa-res-col-first' });
          } else if (index === title.length - 1) {
            colConfig.push({title: item?.lrrq, children: [
              { title: '流入', dataIndex: `col_${index}_reqCount`, width: 80, align: 'right', fixed: 'right', className: 'rpa-res-col-last' },
              { title: '流出', dataIndex: `col_${index}_resCount`, width: 80, align: 'right', fixed: 'right', className: 'rpa-res-col-last' },
            ]},);
          } else {
            colConfig.push({title: item?.lrrq, children: [
              { title: '流入', dataIndex: `col_${index}_reqCount`, width: 65, align: 'right' },
              { title: '流出', dataIndex: `col_${index}_resCount`, width: 65, align: 'right' },
            ]},);
          }
        });
        setColumns(colConfig);
        // 内容
        grid.forEach((row: any) => {
          const rowData: any = {};
          row.forEach((guoup: any, indexGuoup: number) => {
            if (indexGuoup === 0) {
              let tjgzTmp = guoup.tjgz;
              if (!tjgzTmp || tjgzTmp === 'null') {
                tjgzTmp = 'unknown';
              }
              // 首列
              if (tjgz === 'dq') {
                // rowData[`col_${indexGuoup}`] = rpaUtil.serviceCache.getCacheValByKey('DM_JK_DQ_G', tjgzTmp, 'sjswjgDm1', 'sjswjgmc1');
                rowData[`col_${indexGuoup}`] = tjgzTmp;
              } else {
                rowData[`col_${indexGuoup}`] = tjgzTmp;
              }
            } else {
              rowData[`col_${indexGuoup}_reqCount`] = guoup?.reqCount;
              rowData[`col_${indexGuoup}_resCount`] = guoup?.resCount;
            }
          });
          arr.push(rowData);
        });
        // 合计
        const rowDataTotal: any = {};
        total.forEach((guoup: any, indexGuoup: number) => {
          if (indexGuoup === 0) {
            rowDataTotal[`col_${indexGuoup}`] = guoup?.tjgz;
          } else {
            rowDataTotal[`col_${indexGuoup}_reqCount`] = guoup?.reqCount;
            rowDataTotal[`col_${indexGuoup}_resCount`] = guoup?.resCount;
          }
        });
        arr.push(rowDataTotal);
        setGridData(arr);
      })
    })
  };

  // 表单初始数据
  const initData= {
    quickChoice: 'rangeToday',
    groupType: '1',
    tjgz: 'jk',
    rangeTime: [dayjs(new Date()), dayjs(new Date())]
  };

  // 刷新
  const handleRefresh = () => {
    searchData();
  }

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className='dd-statistics-res'>
        <ProCard>
          <Form form={form1} layout='inline' initialValues={initData}>
            <Form.Item name="tjgz">
              <Radio.Group buttonStyle="solid" onChange={() => searchData('quickChoice')}>
                <Radio.Button value="jk">接口</Radio.Button>
                <Radio.Button value="dq">地区</Radio.Button>
                <Radio.Button value="qd">渠道</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="quickChoice">
              <Radio.Group buttonStyle="solid" onChange={() => searchData('quickChoice')}>
                <Radio.Button value="rangeToday">今天</Radio.Button>
                <Radio.Button value="rangeYesterday">昨天</Radio.Button>
                <Radio.Button value="range7">最近7天</Radio.Button>
                <Radio.Button value="range30">最近30天</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="rangeTime" style={{ width: 220 }}>
              <DatePicker.RangePicker onChange={() => searchData('byRangeTime')}/>
            </Form.Item>
            <Form.Item name="groupType" label="时间粒度">
              <Select style={{ width: 80 }} onChange={() => searchData('byGroupType')}>
                <Select.Option value="1">天</Select.Option>
                <Select.Option value="2">小时</Select.Option>
                <Select.Option value="6">月</Select.Option>
                <Select.Option value="7">季度</Select.Option>
                <Select.Option value="8">年</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={() => handleRefresh()} size='middle' >查询</Button>
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
              rowClassName={(record: any) => {
                if (record?.col_0 === '合计') {
                  return 'highlight_row';
                }
                return '';
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

export default Report02;
