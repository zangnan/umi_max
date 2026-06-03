import React, { useState, useEffect } from 'react';
import { message, Button, Row, Col, Tooltip, Badge, Divider, Spin } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { tsjdDataApi, tsrlApi, gztTsjdCxMx, ycsbZssbztCx } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import moment from 'moment';
import DDBaseGrid from '@/components/DDBaseGrid';
import DDTimeline from './sbsjgl/ddtimeline';
import { DrawerForm } from '@ant-design/pro-form';
import pro from '@/pages/common/proConfig';
import { useAccess } from 'umi';
import qxUtil from '@/pages/common/qxUtil';

export interface BdjgProps {
  type?: any;
}

const Index: React.FC<BdjgProps> = ({
  type,
}) => {
  const access = useAccess(); // 权限

  const [masker, setMasker] = useState<boolean>(false); // 打开明细
  const qylx = myUtil.sys.enterpriseType();
  const [flagKey, setFlagkey] = useState<any>(type); // 退税进度 表格 数据
  // 表格
  const js = new Date();
  const [tsjdData, setTsjdData] = useState<any>([]); // 退税进度 表格 数据
  const [mxData, setMxData] = useState<any>([]); // 退税进度明细 表格 数据
  const [modalVisible, setModalVisible] = useState<boolean>(false); // 打开明细

  // 日历
  const [rlData, setRlData] = useState<any>([]); // 日历 数据
  const [defRl, setDefRl] = useState<any>(js.getFullYear()); // 日历 年

  useEffect(() => {
    tsjdTableData(); // 得到列表
    getTsrlList(''); // 退税日历
  }, []);

  // 审核状态
  const handleColumnRenderZt = (text: any, record: any, index: any) => {
    let html = '';
    const sjsbuuid = record.sjsbuuid?.trim();
    if (sjsbuuid && record.sjsbztDm === '0') {
      html = '待审核';
    } else if (sjsbuuid && record.sjsbztDm === '1') {
      html = '审核中';
    } else if (sjsbuuid && record.sjsbztDm === '2') {
      html = '审核失败';
    } else if (sjsbuuid && record.sjsbztDm === '3') {
      html = '审核成功';
    }
    return (<span>{html}</span>);
  }

  const handleColumnRenderDate = (text: any, record: any) => {
    if(record.sjsbuuid?.trim() && record.sjsbsj) {
      return (<span>{moment(new Date(Number(record.sjsbsj))).format('YYYY-MM-DD HH:mm:ss')}</span>)
    } else if(record.sjzjuuid?.trim() && record.sjzjsj) {
      return (<span>{moment(new Date(Number(record.sjzjsj))).format('YYYY-MM-DD HH:mm:ss')}</span>)
    } else {
      return (<span></span>)
    }
  }

  const handleColumnCz = (text: any, record: any,) => {
    const btnHtml:any = [];
    if(record.sjsbuuid?.trim() && record.sjsbztDm === '1' || record.sjsbuuid?.trim() && record.sjsbztDm === '3') {
      if(record.lcswsxDm === 'LCSXA081038001' || record.lcswsxDm === 'LCSXA081039001' || record.lcswsxDm === 'LCSXA081040001') {
        btnHtml.push(<Button type="link" onClick={()=>jdmxDetail(record)}>查看详情</Button>)
      } else {
        btnHtml.push(<Button type="link" style={{width: '58px'}}></Button>)
      }
    } else {
      btnHtml.push(<Button type="link" style={{width: '58px'}}></Button>)
    }
    if(record.sjsbuuid?.trim() && record.sjsbztDm === '0' || record.sjsbuuid?.trim() && record.sjsbztDm === '1') {
      btnHtml.push(<Divider type="vertical" />)
      btnHtml.push(<Button type="link" onClick={()=>ycsbZssbztCxData(record)}>刷新</Button>)
    }
    return btnHtml
  }

  // 申报状态
  const handleColumnRenderSb = (text: any, record: any, index: any) => {
    let html = '';
    if(record.sjsbuuid?.trim()) {
      html = '已申报'
    } else if(record.sjzjuuid?.trim()) {
      html = '已自检'
    } else  {
      html = '未申报';
    }
    return (<span>{html}</span>);
  }

  let tsjdColumns: any = [
    { title: '办理事项', dataIndex: 'lcswsxmc', width: 180, ellipsis: true },
    { title: '所属期', dataIndex: 'ssq', width: 70 },
    { title: '批次', dataIndex: 'sbpc', width: 60 },
    { title: '申报状态', dataIndex: 'shjd', width: 80, render: handleColumnRenderSb },
    { title: '申报时间', dataIndex: 'sjsbsj', width: 160, render: handleColumnRenderDate },
    { title: '审核状态', dataIndex: 'shjd', width: 80, render: handleColumnRenderZt },
    { title: '操作', dataIndex: 'lcslid', width: 140, render: handleColumnCz},
  ];

  // 单一窗口隐藏操作列
  const paramQx = {
    qxCode: 'workplace_cz',
    accessObj: access,
  }
  if(qxUtil.getQxz(paramQx)) {
    tsjdColumns = [
      { title: '办理事项', dataIndex: 'lcswsxmc', width: 180, ellipsis: true },
      { title: '所属期', dataIndex: 'ssq', width: 70 },
      { title: '批次', dataIndex: 'sbpc', width: 60 },
      { title: '申报状态', dataIndex: 'shjd', width: 80, render: handleColumnRenderSb },
      { title: '申报时间', dataIndex: 'sjsbsj', width: 160, render: handleColumnRenderDate },
      { title: '审核状态', dataIndex: 'shjd', width: 80, render: handleColumnRenderZt },
    ];
  }

  const jdmxDetail = (record: any) => {
    const obj = {
      lcslid: record.lcslid,
      lcswsxDm: record.lcswsxDm,
    }
    setMasker(true);
    gztTsjdCxMx(obj).then((res: any)=> {
      setMasker(false);
      const {code, body, msg} = res;
      if(code === '200') {
        if(body && body.length > 0) {
          setMxData(body);
          setModalVisible(true);
        } else {
          message.info('暂无数据')
        }
      } else {
        message.info(msg)
      }
    })
  }

  // 退税进度数据获取
  const tsjdTableData = () => {
    const obj = {
      page:1,
      pageSize: 9999999,
      adQuery:[],
      searchModel:[],
    }
    tsjdDataApi(obj).then((res: any)=>{
      const {body, code}= res;
      if(code === '200') {
        setTsjdData(body);
      } else {
        setTsjdData({
          rows: [],
          page: 1,
          rowCount: 0,
        })
      }
    })
  }

  // 刷新
  const ycsbZssbztCxData = (record: any) => {
    const obj = {
      ssq: record.ssq,
      sbpc: record?.sbpc,
      sbwjuuid: record.sbwjuuid,
      lcswsxDm: record.lcswsxDm,
    }
    setMasker(true)
    ycsbZssbztCx(obj).then((res: any)=>{
      const {code, msg}= res;
      setMasker(false)
      if(code === '200') {
        tsjdTableData(); // 得到列表
        message.success('刷新成功');
      } else {
        message.info(msg);
      }
    })
  }


  // 得到退税日历数据
  const getTsrlList = (date: any) => {
    const obj = {
      nd: date?date.toString():(js.getFullYear()).toString()
    }
    tsrlApi(obj).then((res: any) => {
      const {code, body} = res;
      if(code == '200') {
        const newData = body?.rlList;
        const xzNum = findLastIndex(newData);
        newData.forEach((item: any, index: any) => {
          if (index === xzNum) {
            item.visible = true;
          } else {
            item.visible = false;
          }
        })
        // setRlData(body?.rlList);
        setRlData(newData)
      }
    })
  }

  const findLastIndex = (data: any) => {
    if (data && data?.length > 0) {
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i]?.ywsjbz === 'Y') {
            return i;
        }
      }
    }
    return -1;
  }

  // 改变日历 日期
  const changeRlnd = (flag: any) =>{
    if(flag == 1) {
      const newdate = Number(defRl) - 1;
      setDefRl(newdate)
      getTsrlList(newdate);
    } else {
      const newdate = Number(defRl) + 1;
      if(newdate > js.getFullYear()) {
        message.info('当前已是最新年度！')
      } else {
        setDefRl(newdate)
        getTsrlList(newdate);
      }
    }
  }

  const getTsrlHtml = () => {
    if(rlData.length > 0) {
      const html: any = [];
       for(let i=0; i<rlData.length; i++){
        const htmlBox: any = [];
        const item = rlData[i];
        if(qylx == 'SC') {
          htmlBox.push(
            <div style={{color: '#333',padding: '5px', fontWeight: 'bold'}}>
              <div>免抵退税额：{myUtil.text.formatNum(item.mdtse, '0,0.00')}万元</div>
              <div>应退税额：{myUtil.text.formatNum(item.ytse, '0,0.00')}万元</div>
              <div>免抵税额：{myUtil.text.formatNum(item.mdse, '0,0.00')}万元</div>
            </div>
          )
        } else {
          htmlBox.push(
            <div style={{color: '#333',padding: '5px', fontWeight: 'bold'}}>
              <div>退税额：{myUtil.text.formatNum(item.tse, '0,0.00')}万元</div>
              <div>增值税退税额：{myUtil.text.formatNum(item.zzstse, '0,0.00')}万元</div>
              <div>消费税退税额：{myUtil.text.formatNum(item.xfstse, '0,0.00')}万元</div>
            </div>
          )
        }
        html.push(
          <Col span={6}>
            <div className="rl-card">
              {rlData[i].ywsjbz === 'Y'?
                <Tooltip title={htmlBox} color='#FDE9E9' placement="bottomLeft" visible={rlData[i]?.visible} zIndex={999}>
                  <div style={{color: '#333'}}  id={"tsrlDiv" + i} onMouseEnter={handleMouseEnter} >{myUtil.text.toChinese(i + 1)}月</div>
                  <Badge color='blue' />
                </Tooltip> :
                <div style={{color: '#9d9d9d'}}>{myUtil.text.toChinese(i + 1)}月</div>
              }
            </div>
          </Col>
        )
       }
      return html;
    }
  }

  const handleMouseEnter = (event: any) => {
    const divId = event.currentTarget.id;
    const xzNum = divId.replace('tsrlDiv', '');
    const newData = [...rlData];
    newData.forEach((item: any, index: any) => {
      if (index === Number(xzNum)) {
        item.visible = true;
      } else {
        item.visible = false;
      }
    });
    setRlData(newData);
  }

  const getContent = (key: any) => {
    if(key == '1') {
      return  <ProCard
        title={<div className="col-pro-title">办理进度</div>}
        // extra={<Button type="link" onClick={tsjdTableData} style={{marginTop: '2px'}}>刷新</Button>}
        size="small"
        bodyStyle={{backgroundColor:'#F7F7F7'}}
      >
        <div className='table-box'>
        <DDBaseGrid
          columns={tsjdColumns}
          showSerialNumber
          userDataSource={tsjdData.rows}
          pagination={{
            total: tsjdData.rowCount,
            pageSize: 5,
            current: tsjdData.page,
          }}
        />
        </div>
      </ProCard>
    } else if(key == '3') {
      return  <ProCard
      title={<div className="col-pro-title">退税日历</div>}
      extra={
        <div>
          <a className="rlbtn-left" onClick={()=>changeRlnd(1)}><LeftOutlined color='#0A6ED1' /></a>
          <span style={{padding:'0 20px'}}><span>{defRl}</span>年</span>
          <a className="rlbtn-right" onClick={()=>changeRlnd(2)}><RightOutlined color='#0A6ED1' /></a>
        </div>
      }
      size="small"
    >
      <div className="ws-rl">
        <div className="rl-content">
          <Row>
            {getTsrlHtml()}
          </Row>
        </div>
      </div>
    </ProCard>
    }
    return <></>
  }

  return (
    <>
    <Spin tip="Loading..." spinning={masker} delay={200}>
      {getContent(flagKey)}
      <DrawerForm
        title=""
        visible={modalVisible}
        width={pro.c_modal_width_x2}
        className='abgd_bjkp_drawer'
        onVisibleChange={setModalVisible}
        submitter={false}
      >
        <DDTimeline timeData={mxData}></DDTimeline>
      </DrawerForm>
    </Spin>
    </>
  );
};

export default Index;
