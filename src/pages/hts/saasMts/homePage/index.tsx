// 图表主页
import React, { useEffect, useState } from 'react';
import { Spin, Row, Col, Button, message, Avatar, Form, Upload, Tooltip } from 'antd';
import ProCard from '@ant-design/pro-card';
import './style.less';
import myUtil from '@/components/DDAssist/util';
import { FileProtectOutlined, FileDoneOutlined, ContainerOutlined, ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { history } from 'umi';
import {drJ4HgCkbgd, dclsjAndKsysjTj, queryPager } from '@/pages/hts/services/htsApi';
import cktsUtil from '@/pages/hts/cktsUtil';
import DDAlert from '@/pages/hts/components/DDAlert';
import DDBaseGrid from "@/components/DDBaseGrid";
import importStyle from './importStyle.less';

const { Dragger } = Upload;

const Index: React.FC<unknown> = () => {
  const [masker, setMasker] = useState(false);
  const [mtssbData, setMtssbData] = useState<any>([]); // 免退税申报
  const [bgdAndDlckValue, setBgdAndDlckValue] = useState<any>({}); // 待处理数据条数

  useEffect(() => {
    getdclsjAndKsysjTjData();
    getmtssbData();
  }, []);

  // 待处理数据
  const getdclsjAndKsysjTjData = () => {
    setMasker(true);
    dclsjAndKsysjTj({}).then((res: any)=>{
      setMasker(false);
      const {code, body, msg} = res;
      if(code === '200') {
        setBgdAndDlckValue(body)
      } else {
        message.info(msg)
      }
    })
  }

  // 免退税申报
  const getmtssbData = () => {
    const obj = {
      key: 'CX_TSSB_MTS_SY_MTSSBCX',
      searchModel: [],
      orderModel:[],
    }
    setMasker(true);
    queryPager(obj).then((res: any)=> {
      setMasker(false);
      const {code, msg, body} = res;
      if(code === '200') {
        setMtssbData(body)
      } else {
        message.error(msg);
      }
    })
  }

  // 跳转
  const gotoHref = (path: any) => {
    if(path) {
      history.push(path);
    }
  }

  const downloadGj = async (thisObj: any) => {
    thisObj.setState({ masker: true });
    let a=document.createElement('a') ;//创建一个a标签元素
    a.style.display='none'  ;//设置元素不可见
    a.href='https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
    document.body.appendChild(a)  ;//加入
    a.click(); //触发点击,下载
    document.body.removeChild(a) ;//释放 
    thisObj.setState({ masker: false });
  }

  // 导入
  const importWj = () => {
    const beforeUpload = (file: any) => {
      const isLt2M = file.size;
      if(isLt2M > 10485760) {
        message.info('上传文件不能超过10M。');
        return Upload.LIST_IGNORE;
      }
      if(!file.name.toUpperCase().endsWith(".XML")) {
        message.info('请上传XML文件。');
        return Upload.LIST_IGNORE;
      }
      return false;
    }
    DDAlert.open({
      title: '报关单导入',
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      width: 720,
       content: <>
        <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="文件选择" name="file" valuePropName="fileList" rules={[{ required: true, message: '请选择上传的文件' }]} getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
          <Dragger
            maxCount={1}
            showUploadList={true}
            beforeUpload={beforeUpload}
            itemRender={(originNode, file, currFileList, actions: { download: any, preview: any, remove: any }) => (
              <table className={importStyle.importTable}>
                <tr>
                  <th>文件名</th>
                  <th>文件大小</th> 
                  <th>状态</th>
                  <th>操作</th>
                </tr>
                <tr>
                  <td width='45%' className={importStyle.textCenter}>
                    <Tooltip title={file.name}>
                      <div className={importStyle.textName}>{file.name}</div>
                    </Tooltip>
                  </td>
                  <td width="20%" className={importStyle.textCenter}>{myUtil.text.formatNum(file.size?(file.size/1024):0, '0,0')}KB</td>
                  <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined />&nbsp;待上传</td>
                  <td width="17%" className={importStyle.textCenter}><a onClick={()=>actions.remove()}>删除</a></td>
                </tr>
              </table>
            )}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或将文件拖拽到此区域</p>
          </Dragger>

        </Form.Item>
        <div>从电子口岸下载的XML文件，需要通过客户端工具（
          <Button key={'xz'} type="link" onClick={() => downloadGj(DDAlert)}>下载</Button>
          ）解密后，进行关单导入。</div>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          if(values.file[0].originFileObj) {
            thisObj.setState({ masker: true });
            const formData = new FormData();
            formData.append('fileName', values.file[0].originFileObj);
            formData.append('file-name-suffix', values.file[0].name);
            drJ4HgCkbgd(formData).then((response: any) => {
              const { code, msg ,body} = response;
              thisObj.setState({ masker: false });
              DDAlert.close();
              if (code === '200') {
                message.success(body?.msgInfo);
                getdclsjAndKsysjTjData();
              } else if (code === '900') {
                message.error(msg);
              }else{
                message.error(msg);
              }
            }).catch(() => {
              message.error('导入失败，请重新上传文件。');
            }).finally(() => {
              thisObj.setState({ masker: false });
            });
          } else {
            message.info('文件传输失败，请重试！')
          }
        });
      },
    });
  }

  const getbgdAndDlckHtml = (value: any, text: any) => {
    const colHtml: any = [];
    if(text === '待处理数据') {
      colHtml.push(
        // <ProCard
        //   title={<div className="col-pro-title">{text}</div>}
        //   extra={<Button type="link" onClick={importWj}>报关单导入</Button>}
        //   size="small"
        //   style={{backgroundColor: '#F7F7F7'}}
        // >
        //   <Row>
        //     <Col span={12}>
        //       <div className="col-pro-textbox">
        //       <div className="textbox-title">出口报关单</div>
        //       <div onClick={()=>gotoHref('/26/2602/260201/26020101')} className="textbox-num">
        //         {myUtil.text.formatNum(value?.ckbgd, '0,0')}条
        //       </div>
        //       </div>
        //     </Col>
        //     <Col span={12}>
        //       <div className="col-pro-textbox">
        //       <div className="textbox-title">代理出口货物证明</div>
        //       <div onClick={()=>gotoHref('/26/2602/260202/26020201')} className="textbox-num">
        //         {myUtil.text.formatNum(value?.dlckhwzm, '0,0')}条
        //       </div>
        //       </div>
        //     </Col>
        //   </Row>
        // </ProCard>

        <div className="ckts-box">
          <div className='box-title'>
            {text}
            <a className="box-btn" onClick={importWj}>报关单导入</a>
          </div>
          <div className="box-content-left">
            <div className='box-ftitle-left'>出口报关单</div>
            <div className="box-num-left" onClick={()=>gotoHref('/26/2602/260201/26020101')}>
              {myUtil.text.formatNum(value?.ckbgd, '0,0')}
              <span className="box-dw">条</span>
            </div>
          </div>
          <div className="box-content-right">
            <div className='box-ftitle'>代理出口货物证明</div>
            <div className="box-num-right" onClick={()=>gotoHref('/26/2602/260202/26020201')}>
              {myUtil.text.formatNum(value?.dlckhwzm, '0,0')}
              <span className="box-dw">条</span>
            </div>
          </div>
        </div>
      )
    } else {
      colHtml.push(
        // <ProCard
        //   title={<div className="col-pro-title">{text}</div>}
        //   extra={<Button type="link" onClick={()=>gotoHref('/26/2604/260401')}>去配单</Button>}
        //   size="small"
        //   // headerBordered={true}
        //   // headStyle={{ backgroundColor: '#EEF3FC' }}
        //   style={{backgroundColor: '#F7F7F7'}}
        // >
        //   <Row>
        //     <Col span={8}>
        //       <div className="col-pro-textbox">
        //         <div className="textbox-title">出口报关单</div>
        //         <div onClick={()=>gotoHref('/26/2602/260201/26020103')} className="textbox-num">
        //           {myUtil.text.formatNum(value?.ckbgd, '0,0')}条
        //         </div>
        //       </div>
        //     </Col>
        //     <Col span={8}>
        //       <div className="col-pro-textbox">
        //         <div className="textbox-title">代理出口货物证明</div>
        //         <div onClick={()=>gotoHref('/26/2602/260202/26020202')} className="textbox-num">
        //           {myUtil.text.formatNum(value?.dlckhwzm, '0,0')}条
        //         </div>
        //       </div>
        //     </Col>
        //     <Col span={8}>
        //       <div className="col-pro-textbox">
        //       <div className="textbox-title">进项发票</div>
        //       <div onClick={()=>gotoHref('/26/2602/260203/26020301')} className="textbox-num">
        //         {myUtil.text.formatNum(value?.jxfp, '0,0')}条
        //       </div>
        //       </div>
        //     </Col>
        //   </Row>
        // </ProCard>
        <div className="ckts-box">
          <div className='box-title'>
            {text}
            <a className="box-btn" onClick={()=>gotoHref('/26/2604/260401')}>去配单</a>
          </div>
            <div className="box-content-left">
              <div className='box-ftitle-left'>出口报关单</div>
              <div className="box-num-left" onClick={()=>gotoHref('/26/2602/260201/26020103')}>
                {myUtil.text.formatNum(value?.ckbgd, '0,0')}
                <span className="box-dw">条</span>
              </div>
            </div>
            <div className="box-content-mid">
              <div className='box-ftitle-left'>代理出口货物证明</div>
              <div className="box-num-left" onClick={()=>gotoHref('/26/2602/260202/26020202')}>
                {myUtil.text.formatNum(value?.dlckhwzm, '0,0')}
                <span className="box-dw">条</span>
              </div>
            </div>
            <div className="box-content-right">
              <div className='box-ftitle'>进项发票</div>
              <div className="box-num-right" onClick={()=>gotoHref('/26/2602/260203/26020301')}>
                {myUtil.text.formatNum(value?.jxfp, '0,0')}
                <span className="box-dw">条</span>
              </div>
            </div>
        </div>
      )
    }
    return colHtml;
  }

  // 申报状态
  const handleColumnRenderSb = (text: any, record: any, index: any) => {
    let html = '';
    if(text === '1') {
      html = '采集中'
    } else if(text === '3') {
      html = '已自检'
    } else  {
      html = '未申报';
    }
    return (<span>{html}</span>);
  }

  const mtssbColumns: any = [
    { title: '所属期', dataIndex: 'ssq', width: 70 },
    { title: '批次', dataIndex: 'sbpc', width: 60 },
    { title: '应退税额合计', dataIndex: 'ytsehj', align: 'right', width: 130, render: (text: any) => myUtil.grid.formatNum(text, '0,0.00') },
    { title: '增值税退税额', dataIndex: 'zzstse', align: 'right', width: 130, render: (text: any) => myUtil.grid.formatNum(text, '0,0.00') },
    { title: '消费税退税额', dataIndex: 'xfstse', align: 'right', width: 130, render: (text: any) => myUtil.grid.formatNum(text, '0,0.00') },
    { title: '申报状态', dataIndex: 'sbztDm', width: 80, render: handleColumnRenderSb },
  ];


  return (
    <Spin tip="Loading..." spinning={masker} delay={200}>
      <div className='tssb_home' style={{minWidth: '930px', overflowX: 'auto'}}>
        <Row gutter={[20, 20]} className="tssb_home_header">
          <Col span={12} style={{paddingLeft:'0px'}}>
              {getbgdAndDlckHtml(bgdAndDlckValue?.dclsj, '待处理数据')}
          </Col>
          <Col span={12} style={{paddingRight:'0px'}}>
              {getbgdAndDlckHtml(bgdAndDlckValue?.ksysj, '可使用数据')}
          </Col>
        </Row>
        <div className="tssb_home_second" style={{marginTop: '20px'}}>
          <ProCard
            title={<div className="col-pro-title">免退税申报</div>}
            size="small"
          >
            <DDBaseGrid 
              columns={mtssbColumns}
              userDataSource={mtssbData.rows}
              pagination={{
                  total: mtssbData.rowCount,
                  pageSize: 5,
                  current: mtssbData.page,
              }}
            />
          </ProCard>
        </div>
        <div className="tssb_home_third" style={{marginTop: '20px'}}>
          <ProCard
            title={<div className="col-pro-title">快捷菜单</div>}
            size="small"
            style={{padding: '0px!important'}}
          >
            <div className='kjcd-box'>
              <Row>
                <Col span={8}>
                  <div onClick={()=>gotoHref('/26/2603/260301/26030101')} style={{backgroundColor: '#F7F7F7', padding: '20px', textAlign: 'center'}}>
                    <Avatar className="kjcd-avatar" size={90} icon={<FileDoneOutlined style={{color:"#4490DB"}} />} key='1' />
                    <div style={{marginTop: '5px'}}>外贸企业出口退税出口明细申报</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div onClick={()=>gotoHref('/26/2603/260302/26030201')} style={{backgroundColor: '#F7F7F7', padding: '20px', textAlign: 'center'}}>
                    <Avatar className="kjcd-avatar" size={90} icon={<FileProtectOutlined style={{color:"#4490DB"}} />} key='1' />
                    <div style={{marginTop: '5px'}}>免退税调整申报</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div onClick={()=>gotoHref('/26/2603/260303/26030301')} style={{backgroundColor: '#F7F7F7', padding: '20px', textAlign: 'center'}}>
                    <Avatar className="kjcd-avatar" size={90} icon={<ContainerOutlined style={{color:"#4490DB"}} />} key='1' />
                    <div style={{marginTop: '5px'}}>跨境销售服务及无形资产免退税申报明细</div>
                  </div>
                </Col>
              </Row>
            </div>
          </ProCard>
        </div>
      </div>
    </Spin>
  );
};
export default Index;