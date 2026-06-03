import React, {useEffect, useState} from 'react';
import {DatePicker, message} from 'antd';
import ProCard from '@ant-design/pro-card';
import {tsrlApi} from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import {Column} from '@ant-design/plots';
import moment from 'moment';

export interface BdjgProps {
  onRef?: any;
}

const Columncharts: React.FC<BdjgProps> = () => {
  const js = new Date();
  const [chartData, setChartData] = useState<any>([]); // 退税额 柱状图 数据
  const [maxValue, setMaxValue] = useState<any>([]); // 退税额 柱状图y轴最大值
  const [tsny, setTsny] = useState<any>(moment(js.getFullYear(), 'YYYY')); // 退税额值

  // 退税额  柱状图
  const chart01: any = {
    data: chartData,
    height: 260,
    xField: 'ny',
    yField: 'tse',
    label: {
      // 可手动配置 label 数据标签位置
      position: 'top',
      // 配置样式
      style: {
        fill: '#333',
        fontSize: 12,
      },
      formatter: (datum: any) => {
        if(datum.tse && datum.tse>0){
          return myUtil.text.formatNum(datum.tse, '0,0.00');
        } else {
          return '';
        }
      },
    },
    yAxis: {
      title: {
        text: '退税额 (万元)'
      },
      max: maxValue * 1.2 // 留出5%空间
    },
    /*柱 顶部显示 金额*/
    /*label: {
      text: (d: any) => d.tse,
      textBaseline: 'top',
      formatter: (datum: any) => {
        return myUtil.text.formatNum(datum.tse / 10000, '0,0.00') + '万元';
      },
      style: {
        rontSize: 4,
        textAlign: 'center',
        textBaseline: 'middle'
      },
      layout: [
        {type: 'interval-adjust-position'},
        {type: 'interval-hide-overlap'}
      ],
      /!*rotate: -45,*!/ // 标签倾斜45度
    },*/
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: '退税额',
          value: myUtil.text.formatNum(datum.tse, '0,0.00') + '万元',
          title: datum.ny,
        };
      },
      showContent: true,
    }
  };

  useEffect(() => {
    getMtseList(); // 得到退税额数据
  }, []);


  // 退税额
  const getMtseList = (date?: any) => {
    const js = new Date();
    const obj = {
      nd: date ? date.toString() : (js.getFullYear()).toString()
    }
    tsrlApi(obj).then((res: any) => {
      const {code, body} = res;
      if (code === '200') {
        setChartData(body?.rlList)
        setMaxValue(getMaxValue(body?.rlList, 'tse'))
      }
    })
  }

  const getMaxValue = (data: any[], field: string) => {
    if (!Array.isArray(data)) {
      return 0;
    }
    const values = data.map(item => {
      const value = item?.[field];
      return typeof value === 'number' ? value : Number(value) || 0;
    }).filter(Number.isFinite);
    return values.length > 0 ? Math.max(...values) : 0;
  };

  // 改变出口额日期
  const changeNy = (date: any, dateString: string) => {
    if (dateString && Number(dateString) > js.getFullYear()) {
      message.info('当前已是最新年度！')
    } else {
      getMtseList(dateString)
      setTsny(date);
    }
  }

  return (
    <ProCard
      title={
        <div className="col-pro-title">
          退税额情况
          <DatePicker picker="year" className="title-dateYear" value={tsny} bordered={false} allowClear={false} onChange={changeNy}/>
          年度
        </div>
      }
      size="small"
      bodyStyle={{backgroundColor: '#f7f7f7'}}
    >
      <div><Column {...chart01} /></div>
    </ProCard>
  );
};

export default Columncharts;
