import React, { useImperativeHandle, useState, useEffect } from 'react';
import { DatePicker, message } from 'antd';
import ProCard from '@ant-design/pro-card';
import { getCkmyeDataApi } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import { Column } from '@ant-design/plots'; 
import moment from 'moment';

export interface BdjgProps {
  onRef?: any;
}

const Columncharts: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const js = new Date();
  const [ckmyeData, setCkmyeData] = useState<any>([]); // 出口美元额 柱状图 数据
  const [defCkmy, setDefCkmy] = useState<any>(moment(js.getFullYear(), 'YYYY')); // 出口美元额值
  const [maxValue, setMaxValue] = useState<any>([]); // 柱状图y轴最大值
  // 出口美元额  柱状图
  const chart01: any = {
    data: ckmyeData,
    height: 260,
    // animation: false, // 关闭动画
    xField: 'ckny',
    yField: 'mylaj',
    label: {
      // 可手动配置 label 数据标签位置
      position: 'top',
      // 配置样式
      style: {
        // fill: '#333',
        // opacity: 0.6,
        fill: '#333',
        fontSize: 12,
      },
      formatter: (datum: any) => {
        if(datum.mylaj && datum.mylaj>0){
          return myUtil.text.formatNum(datum.mylaj, '0,0.00');
        } else {
          return '';
        }
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      }
    },
    yAxis: {
      title: {
        text: '出口美元额 (万美元)'
      },
      max: maxValue * 1.2
    },
    meta: {
      ckny: {
        alias: '所属期',
      },
      mylaj: {
        alias: '出口美元额',
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: '出口美元额',
          value: myUtil.text.formatNum(datum.mylaj, '0,0.00') +  '万美元',
          title: datum.ckny,
        };
      },
      showContent: true,
    },
  };

  useEffect(() => {
    getCkmyeList(); // 得到出口美元额数据
  }, []);


  // 出口美元额
  const getCkmyeList = (date?: any) => {
    const js = new Date();
    const obj = {
      nd: date?date.toString():(js.getFullYear()).toString()
    }
    getCkmyeDataApi(obj).then((res: any)=>{
      const {code, body} = res;
      if(code === '200'){
        setCkmyeData(body?.nyList);
        setMaxValue(getMaxValue(body?.nyList, 'mylaj'))
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
  const changeCkerq = (date: any, dateString: string) => {
    if(dateString && Number(dateString) > js.getFullYear()){
      message.info('当前已是最新年度！')
    } else {
      getCkmyeList(dateString)
      setDefCkmy(date);
    }
  }

  return (
    <ProCard
      title={
        <div className="col-pro-title">
          出口美元额情况
          <DatePicker picker="year" className="title-dateYear" value={defCkmy} bordered={false} allowClear={false} onChange={changeCkerq} />
          年度
        </div>
      }
      size="small"
      bodyStyle={{backgroundColor:'#f7f7f7'}}
    >
      <div><Column {...chart01} /></div>
    </ProCard>
  );
};

export default Columncharts;
