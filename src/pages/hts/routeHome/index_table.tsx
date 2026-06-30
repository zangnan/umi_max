import cktsUtil from '@/pages/hts/cktsUtil';
import React, { useState, useEffect } from 'react';
import { Button, Spin, Space } from 'antd';
import ProCard from '@ant-design/pro-card';
import { queryBacklog } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import moment from 'moment';
import DDBaseGrid from '@/components/DDBaseGrid';
import { history } from 'umi';
import UrlhtmlShow from '@/pages/hts/components/UrlhtmlShow';

export interface BdjgProps {
  type?: any;
}

const Index: React.FC<BdjgProps> = ({
  type,
}) => {
  const [masker, setMasker] = useState<boolean>(false); // 打开明细
  const qylx = cktsUtil.sys.enterpriseType();
  const [flagKey, setFlagkey] = useState<any>(''); // 选中状态
  const [tsjdData, setTsjdData] = useState<any>([]); // 退税进度 表格 数据
  const [gsTable, setGsTable] = useState<any>(0); // 选中状态


  useEffect(() => {
    const ckts = ['/25/2501','/26/2601','/25/2505','/26/2605','/25/2506','/26/2606','/hts/badz/dzba/dzba'];
    const fp = ['/jsxj/ydgl/kpsh','/jsxj/ydgl/ycdd'];
    const isCkts = ckts.findIndex((item: any) => cktsUtil.menu.getMenuObjByPath(item));
    const isFp = fp.findIndex((item: any) => cktsUtil.menu.getMenuObjByPath(item));
    if(isCkts > -1 && isFp > -1) {
      tsjdTableData(''); // 得到列表
    } else if(isCkts > -1 && isFp === -1) {
      tsjdTableData('ckts'); // 得到列表
    } else if(isCkts === -1 && isFp > -1) {
      tsjdTableData('fp'); // 得到列表
    }
  }, []);

  const handleColumnRenderDate = (text: any, record: any) => {
    if(text) {  
      return (<span>{moment(new Date(Number(text))).format('YYYY-MM-DD')}</span>)
    } else {
      return (<span></span>)
    }
  }

  const handleColumnCz = (text: any, record: any,) => {
    const btnHtml:any = [];
    btnHtml.push(<Button type="link" onClick={()=>blCxData(record)}>去办理</Button>)
    return btnHtml
  }

  const tsjdColumns: any = [
    { title: '序号', dataIndex: 'xh', width: 60, align: 'center' },
    { title: '业务事项', dataIndex: 'ywsx', width: 95, ellipsis: true },
    { title: '待办任务', dataIndex: 'dbrw', width: 105, ellipsis: true },
    { title: '任务描述', dataIndex: 'rwms', ellipsis: true },
    { title: '时间', dataIndex: 'sj', width: 100, render: handleColumnRenderDate },
    { title: '操作', dataIndex: 'lcslid', width: 80, render: handleColumnCz},
  ];

  // 退税进度数据获取
  const tsjdTableData = (string:any) => {
    setFlagkey(string)
    const obj = {
      cxlx:string
    }
    setTsjdData({
      rows: [],
      page: 1,
      rowCount: 0,
    });
    setMasker(true)
    queryBacklog(obj).then((res: any)=>{
      setMasker(false)
      const {body, code}= res;
      if(code === '200') {
        setTsjdData({
          rows: body?.rows || [],
          page: 1,
          rowCount: body?.rowCount || 0,
        });
        if(!string){
          setGsTable(body?.rowCount)
        }
      } else {
        setTsjdData({
          rows: [],
          page: 1,
          rowCount: 0,
        })
      }
    })
  }

  // 去办理
  const blCxData = (record: any) => {
    const dbrwDm = record.dbrwDm;
    if(dbrwDm === '1' && qylx === 'SC'){
      history.push('/25/2501');
    } else if(dbrwDm === '1' && qylx === 'WM') {
      history.push('/26/2601');
    } else if(dbrwDm === '2' && qylx === 'SC' || dbrwDm === '3' && qylx === 'SC') {
      history.push('/25/2505');
    } else if(dbrwDm === '2' && qylx === 'WM' || dbrwDm === '3' && qylx === 'WM') {
      history.push('/26/2605');
    } else if(dbrwDm === '4' && qylx === 'SC') {
      history.push('/25/2506');
    } else if(dbrwDm === '4' && qylx === 'WM') {
      history.push('/26/2606');
    } else if(dbrwDm === '5') {
      history.push('/hts/badz/dzba/dzba');
    } else if(dbrwDm === '6') {
      history.push('/jsxj/ydgl/kpsh');
    } else if(dbrwDm === '7') {
      history.push('/jsxj/ydgl/ycdd');
    }
  }

  const getContent = (key: any) => {
    if(key == '1') {
      return  <ProCard
        title={<div className="col-pro-title">待办事项</div>}
        extra={
          <Space size={4}>
            <UrlhtmlShow url={['/jsxj/ydgl/kpsh','/jsxj/ydgl/ycdd']}>
              <UrlhtmlShow  url={['/25/2501','/26/2601','/25/2505','/26/2605','/25/2506','/26/2606','/hts/badz/dzba/dzba']}>
                { flagKey != 'ckts' && flagKey != 'fp' ?
                  <Button type="primary" className='btnStyle01' onClick={()=>tsjdTableData('')}>全部待办</Button>:
                  <Button onClick={()=>tsjdTableData('')}>全部待办</Button>
                }
              </UrlhtmlShow>
            </UrlhtmlShow>
            <UrlhtmlShow url={['/25/2501','/26/2601','/25/2505','/26/2605','/25/2506','/26/2606','/hts/badz/dzba/dzba']}>
              { flagKey==='ckts'?
                <Button type="primary" className='btnStyle01' onClick={()=>tsjdTableData('ckts')}>出口退税</Button> 
                : <Button onClick={()=>tsjdTableData('ckts')}>出口退税</Button>
              }
            </UrlhtmlShow>
            <UrlhtmlShow url={['/jsxj/ydgl/kpsh','/jsxj/ydgl/ycdd']}>
              { flagKey==='fp'?
                <Button type="primary" className='btnStyle01' onClick={()=>tsjdTableData('fp')} style={{width: '90px'}}>发票</Button> :
                <Button onClick={()=>tsjdTableData('fp')} style={{width: '90px'}}>发票</Button>
              }
            </UrlhtmlShow>
          </Space>
        }
        size="small"
        bodyStyle={{backgroundColor:'#F7F7F7'}}
      >
        <div className={gsTable > 5 ? 'table-box workbench-table' : 'table-box'}>
        <DDBaseGrid 
          columns={tsjdColumns}
          // showSerialNumber
          userDataSource={tsjdData.rows}
          pagination={{
              total: tsjdData.rowCount,
              pageSize: 5,
              current: tsjdData.page,
          }}
        />
        </div>
      </ProCard>
    }
    return <></>
  }

  return (
    <>
    <Spin tip="Loading..." spinning={masker} delay={200}>
      {getContent(1)}
    </Spin>
    </>
  );
};

export default Index;
