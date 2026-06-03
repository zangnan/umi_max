import React, { useImperativeHandle, useState, useEffect } from 'react';
import { DatePicker, message, Radio } from 'antd';
import ProCard from '@ant-design/pro-card';
import { getCkbgdsbDataApi, getJxfpsbApi } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import moment from 'moment';
import { MultiView } from '@ant-design/charts';

export interface BdjgProps {
  onRef?: any;
}

const Piecharts: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const js = new Date();
  const qylx = myUtil.sys.enterpriseType();
  const [btValue, setBtValue] = useState<any>('1'); // 饼图切换按钮 1：出口报关单申报情况；2：进项发票申报情况；
  const [defbt, setDefbt] = useState<any>(moment(js.getFullYear(), 'YYYY')); // 饼图日期
  const [btData, setBtData] = useState<any>([]); // 饼图 数据

  const theme1 = {
    colors10: [
      '#B8E1FF',
      '#9AC5FF',
      '#7DAAFF',
      '#5B8FF9',
      '#3D76DD',
      '#085EC0',
      '#0047A5',
      '#00318A',
      '#001D70',
    ],
    colors20: [
      '#B8E1FF',
      '#9AC5FF',
      '#7DAAFF',
      '#5B8FF9',
      '#3D76DD',
      '#085EC0',
      '#0047A5',
      '#00318A',
      '#001D70',
    ],
  };

   // 出口报关单申报情况饼状图
   const chart02: any = {
    height: 210,
    padding: 'auto',
    plots: [
      {
        type: 'pie',
        region: { start: { x: -0.3, y: -0.2 }, end: { x: 1, y: 1.2 } },
        options: {
          // animation: false, // 关闭动画
          data: btData,
          angleField: 'value',
          colorField: 'title',
          radius: 0.5,
          theme: theme1,
          tooltip: {
            formatter: (datum: any) => {
              if(btValue === '1') {
                return {
                  name: '条数',
                  value: myUtil.text.formatNum(datum.value, '0,0') + '条',
                  title: datum.text,
                };
              } else {
                return {
                  name: '金额',
                  value: myUtil.text.formatNum(datum.value, '0,0.00') + '万元',
                  title: datum.text,
                };
              }
            },
            showContent: false,
          },
          // label: {
          //   offset: '15%',
          //   content: btValue === '1' ? `{name}:\n占比{percentage}` : `{name}:\n占比{percentage}`,
          // },
          interactions: [{ type: 'element-active' }],
        //   label: {
        //     type: 'outer',
        //     formatter: (datum: any) => {
        //       return  `${datum.text}:\n ${myUtil.text.formatNum(datum.value, btValue === '1'?'0,0': '0,0.00')} ${btValue==='1'? '条': '万元'}\n (${(datum.percent * 100).toFixed(2)}%)`;
        //     },
        //     style: {
        //       fill: '#333',
        //       fontSize: 12,
        //       fontWeight: 'normal'
        //     },
        // },
        },
      },
    ],
    legend: {
      layout: 'vertical',
      position: 'right',
      marker: {
        symbol: 'square'
      },
      offsetX: -70, 
    },
  };

  useEffect(() => {
    getCkbgdsbList(); // 出口报关单
  }, []);

  
  // 出口报关单申报情况
  const getCkbgdsbList = (date?: any) =>{
    const js = new Date();
    const obj = {
      nd: date?(date.format('YYYY')).toString():(js.getFullYear()).toString()
    }
    getCkbgdsbDataApi(obj).then((res: any)=>{
      const {code, body} = res;
      if(code === '200'){
        const count = Number(body?.btsts||0) + Number(body?.wsbts||0) + Number(body?.ysbts||0) + Number(body?.dsbts||0);
        const btsZb = Number(count) === 0? 0.00 : Number(body?.btsts||0)/Number(count)*100;
        const wsbZb = Number(count) === 0? 0.00 : Number(body?.wsbts||0)/Number(count)*100;
        const ysbZb = Number(count) === 0? 0.00 : Number(body?.ysbts||0)/Number(count)*100;
        const dsbZb = Number(count) === 0? 0.00 : Number(body?.dsbts||0)/Number(count)*100;
        const btsTitle = '不退税' + (body?.btsts||0) + '条（' + Number(btsZb).toFixed(2) + '%）';
        const wsbTitle = '未申报' + (body?.wsbts||0) + '条（' + Number(wsbZb).toFixed(2) + '%）';
        const ysbTitle = '已申报' + (body?.ysbts||0) + '条（' + Number(ysbZb).toFixed(2) + '%）';
        const dsbTitle = '待申报' + (body?.dsbts||0) + '条（' + Number(dsbZb).toFixed(2) + '%）';
        const arry = [
          {
            "text": "不退税",
            "value": body.btsts?body.btsts:0,
            "title": btsTitle
          },
          {
            "text": "未申报",
            "value": body.wsbts?body.wsbts:0,
            "title": wsbTitle
          },
          {
            "text": "已申报",
            "value": body.ysbts?body.ysbts:0,
            "title": ysbTitle
          },
          {
            "text": "待申报",
            "value": body.dsbts?body.dsbts:0,
            "title": dsbTitle
          },
        ]
        setBtData(arry)
      }
    })
  }

  // 进项发票退税情况
  const getJxfpsbList = (date?: any) =>{
    const js = new Date();
    const obj = {
      nd: date?(date.format('YYYY')).toString():(js.getFullYear()).toString()
    }
    getJxfpsbApi(obj).then((res: any)=>{
      const {code, body} = res;
      if(code === '200'){
        const count = Number(body?.wsbje||0) + Number(body?.ysbje||0) + Number(body?.dsbje||0);
        const wsbZb = Number(count) === 0? 0.00 : Number(body?.wsbje||0)/Number(count)*100;
        const ysbZb = Number(count) === 0? 0.00 : Number(body?.ysbje||0)/Number(count)*100;
        const dsbZb = Number(count) === 0? 0.00 : Number(body?.dsbje||0)/Number(count)*100;
        const wsbTitle = '未申报' + (body?.wsbje||0) + '万元（' + Number(wsbZb).toFixed(2) + '%）';
        const ysbTitle = '已申报' + (body?.ysbje||0) + '万元（' + Number(ysbZb).toFixed(2) + '%）';
        const dsbTitle = '待申报' + (body?.dsbje||0) + '万元（' + Number(dsbZb).toFixed(2) + '%）';
        const arry =   [{
          "text": "未申报",
          "value":body.wsbje?body.wsbje:0,
          "title": wsbTitle
        },
        {
          "text": "已申报",
          "value":body.ysbje?body.ysbje:0,
          "title": ysbTitle
        },
        {
          "text": "待申报",
          "value":body.dsbje?body.dsbje:0,
          "title": dsbTitle
        }];
        setBtData(arry)
      }
    })
  }

// 改变饼图日期
const changeCkbgd =  (date: any, dateString: string) => {
  if(dateString && Number(dateString) > js.getFullYear()){
    message.info('当前已是最新年度！')
  } else {
    setDefbt(date);
    if(btValue == '1') {
      getCkbgdsbList(date)
    } else {
      getJxfpsbList(date)
    }
  }
}

// 切换饼图数据
const changeBtValue = (e: any) =>{
  setBtValue(e)
  if(e == '1') {
    getCkbgdsbList(defbt);
  } else {
    getJxfpsbList(defbt);
  }
}

  return (
    <ProCard
      title={
        <Radio.Group defaultValue="1" buttonStyle="solid" onChange={(e) => { changeBtValue(e.target.value) }}>
          <Radio.Button value="1">出口报关单申报情况</Radio.Button>
          {qylx == 'WM' ? <Radio.Button value="2">进项发票申报情况</Radio.Button> : <></>}
        </Radio.Group>
      }
      extra={
        <div>
          <DatePicker picker="year" className="title-dateYear" value={defbt} bordered={false} allowClear={false} onChange={changeCkbgd} />
          <b>年度</b>
        </div>
      }
      size="small"
    >
      <div className='mul-box'>
        <MultiView {...chart02} key="22" />
      </div>
  </ProCard>
  );
};

export default Piecharts;
