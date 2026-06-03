// 图表主页
import React, { useEffect, useState } from 'react';
import { Spin, Row, Col, Button, DatePicker, message, Space, Avatar, Form, Upload, Tooltip } from 'antd';
import ProCard from '@ant-design/pro-card';
import './style.less';
import moment from 'moment';
import myUtil from '@/pages/common/myUtil';
import { ProjectOutlined, FileProtectOutlined, FileDoneOutlined, ContainerOutlined, ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { history } from 'umi';
import {drJ4HgCkbgd, bgdAndDlckzmTj, mdtseTj, queryWsxzSj} from '@/services/hts/api';
import cktsUtil from '@/pages/common/cktsUtil';
import DDAlert from '@/components/DDAlert';
import importStyle from './importStyle.less';

const { Dragger } = Upload;

const Index: React.FC<unknown> = () => {
  const sj = new Date();
  const month = (sj.getMonth() + 1) < 10 ? '0' + sj.getMonth() : sj.getMonth();
  let defTime: any;
  let defDate: any;
  if(sj.getMonth() === 0) {
    const year = sj.getFullYear() - 1;
    defTime = String(year) + 12;
    defDate = new Date(String(year) + '/' + 12 + '/01');
  } else {
    defTime = String(sj.getFullYear()) + month;
    defDate = new Date(String(sj.getFullYear()) + '/' + month + '/01');
  }
  const [masker, setMasker] = useState(false);
  const [defSsq, setDefSsq] = useState<any>(moment(defDate)); // 所属期
  // const [shhjValue, setShhjValue] = useState<any>(''); // 审核环节
  const [bgdAndDlckValue, setBgdAndDlckValue] = useState<any>({}); // 出口报关单条数
  const [mdtseValue, setMdtseValue] = useState<any>({}); // 免抵退税申报
  const [wsxzFlag, setWsxzFlag] = useState<any>(false); // 出口报关单条数

  useEffect(() => {
    // setShhjValue('业务核准');
    getbgdAndDlckzmTjData();
    getmdtseTjData(moment(defTime).format('YYYYMM'));
    // getqueryWsxzSjData(moment(defTime).format('YYYYMM'));  // 是否显示文书下载按钮
  }, []);

  // 出口报关单
  const getbgdAndDlckzmTjData = () => {
    bgdAndDlckzmTj({}).then((res: any)=>{
      const {code, body, msg} = res;
      if(code === '200') {
        setBgdAndDlckValue(body)
      } else {
        message.info(msg)
      }
    })
  }

  // 免抵退税申报
  const getmdtseTjData = (ssq: any) => {
    mdtseTj({ssq}).then((res: any)=> {
      const {code, msg, body} = res;
      if(code === '200') {
        setMdtseValue(body);
      } else {
        message.info(msg);
      }
    })
  }

  // 是否显示文书下载按钮
  // const getqueryWsxzSjData = (ssq: any) => {
  //   queryWsxzSj({ssq}).then((res: any)=> {
  //     const {code, msg, body} = res;
  //     if(code === '200') {
  //       if(Number(body.wssl) > 0) {
  //         setWsxzFlag(true);
  //       } else {
  //         setWsxzFlag(false);
  //       }
  //     } else {
  //       message.info(msg);
  //     }
  //   })
  // }

  // 改变所属期
  const changeSsq =  (date: any, dateString: string) => {
    const now = Number(moment(sj).format('YYYYMM'));
    if(dateString && Number(dateString) > now){
      message.info('当前已是最新所属期！')
    } else {
      setDefSsq(date);
      getmdtseTjData(dateString); // 获取免抵退税申报
      // getqueryWsxzSjData(dateString);  // 是否显示文书下载按钮
    }
  }

  // 自定义面板样式
  const monthCellRender = (date:any, locale:any) => {
    return moment(date).format('YYYYMM');
  }

  // 文书下载
  const wsxzClick = async () =>{
    const url = '/yw/bszx/mdt/hwlw/tssb/wsxz/';
    const params: any = {
      ssq: defSsq
    }
    setMasker(true)
    await cktsUtil.downloadFileCkts(url, params);
    setMasker(false)
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
                getbgdAndDlckzmTjData();
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
    let dclLink = '/25/2502/250202/25020201';
    let ksyLink = '/25/2502/250202/25020202';
    if(text === '出口报关单') {
      dclLink = '/25/2502/250201/25020101';
      ksyLink = '/25/2502/250201/25020103';
    }
    colHtml.push(
      // <ProCard
      //   title={<div className="col-pro-title">{text}</div>}
      //   extra={text === '出口报关单' ? <Button type="link" onClick={importWj}>报关单导入</Button> : <></>}
      //   size="small"
      //   style={{backgroundColor: '#F7F7F7'}}
      // >
      //   <Row>
      //     <Col span={12}>
      //       <div className="col-pro-textbox">
      //       <div className="textbox-title">待处理数据</div>
      //       <div onClick={()=>gotoHref(dclLink)} className="textbox-num">
      //         {myUtil.text.formatNum(value?.dclsj, '0,0')}条
      //       </div>
      //       </div>
      //     </Col>
      //     <Col span={12}>
      //       <div className="col-pro-textbox">
      //       <div className="textbox-title">可使用数据</div>
      //       <div onClick={()=>gotoHref(ksyLink)} className="textbox-num">
      //         {myUtil.text.formatNum(value?.ksysj, '0,0')}条
      //       </div>
      //       </div>
      //     </Col>
      //   </Row>
      // </ProCard>
       <div className="ckts-box">
        <div className='box-title'>
          {text}
          {text === '出口报关单' ? <a className="box-btn" onClick={importWj}>报关单导入</a> : <></>}
        </div>
        <div className="box-content-left">
          <div className='box-ftitle-left'>待处理</div>
          <div className="box-num-left" onClick={()=>gotoHref(dclLink)}>
            {myUtil.text.formatNum(value?.dclsj, '0,0')}
            <span className="box-dw">条</span>
          </div>
        </div>
        <div className="box-content-right">
          <div className='box-ftitle'>可使用</div>
          <div className="box-num-right" onClick={()=>gotoHref(ksyLink)}>
            {myUtil.text.formatNum(value?.ksysj, '0,0')}
            <span className="box-dw">条</span>
          </div>
        </div>
      </div>
    )
    return colHtml;
  }

  return (
    <Spin tip="Loading..." spinning={masker} delay={200}>
      <div className='tssb_home' style={{minWidth: '930px', overflowX: 'auto'}}>
        <Row gutter={[20, 20]} className="tssb_home_header">
          <Col span={12} style={{paddingLeft:'0'}}>
              {getbgdAndDlckHtml(bgdAndDlckValue?.ckbgd, '出口报关单')}
          </Col>
          <Col span={12} style={{paddingRight:'0'}}>
              {getbgdAndDlckHtml(bgdAndDlckValue?.dlckhwzm, '代理出口货物证明')}
          </Col>
        </Row>
        <div className="tssb_home_second" style={{marginTop: '20px'}}>
          <Row>
            <Col span={10}>
              <div className="col-pro-title">
                所属期：
                <DatePicker
                  className="title-dateMonth"
                  onChange={changeSsq}
                  format="YYYYMM"
                  picker="month"
                  value={defSsq}
                  bordered={false}
                  allowClear={false}
                  monthCellRender={monthCellRender}
                />
              </div>
            </Col>
            <Col span={10}>
              {/* <div className="col-pro-title">审核环节：<span className="second-shhjText">{shhjValue}</span></div> */}
            </Col>
            <Col span={4} style={{paddingTop:'1px'}}>
              {wsxzFlag ?
              <Button onClick={wsxzClick} style={{color:"#127BE3", borderColor:"#127BE3", float:'right', marginRight:'20px'}}>文书下载</Button>
              : <></> }
            </Col>
          </Row>
        </div>
        <div className="tssb_home_third" style={{marginTop: '20px'}}>
          <ProCard
            title={<div className="col-pro-title">免抵退税申报</div>}
            size="small"
            style={{padding: '0px!important'}}
          >
            <Row gutter={[20, 20]}>
              <Col span={8}>
                <div style={{backgroundColor: '#F7F7F7', padding: '40px 20px', height: '100%'}}>
                  <Space align="center" size={35}>
                    <ProjectOutlined className="mdtsIcon" rotate={180} />
                    <div className="col-pro-textbox">
                      <div className="textbox-title">当期免抵退税额</div>
                      <div className="textbox-yuan">{myUtil.text.formatNum(mdtseValue?.mdtse, '0,0.00')}元</div>
                    </div>
                  </Space>
                </div>
              </Col>
              <Col span={16}>
                <div style={{backgroundColor: '#F7F7F7', padding: '20px', height: '100%'}}>
                  <Row gutter={[20, 20]}>
                    <Col span={9}>
                      <div className="col-pro-textbox">
                        <div className="textbox-title">应退税额</div>
                        <div className="textbox-yuan">{myUtil.text.formatNum(mdtseValue?.ytse1, '0,0.00')}元</div>
                        <div className="textbox-title" style={{marginTop: '16px'}}>免抵税额</div>
                        <div className="textbox-yuan">{myUtil.text.formatNum(mdtseValue?.mdse, '0,0.00')}元</div>
                      </div>
                    </Col>
                    <Col span={9}>
                    <div className="col-pro-textbox">
                        <div className="textbox-title">出口货物及修理修配服务明细</div>
                        <div className="textbox-yuan">{myUtil.text.formatNum(mdtseValue?.ckhwmxts, '0,0.')}条</div>
                        <div className="textbox-title" style={{marginTop: '16px'}}>跨境销售服务及无形资产明细</div>
                        <div className="textbox-yuan">{myUtil.text.formatNum(mdtseValue?.kjysxwmxts, '0,0')}条</div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <Space direction="vertical" style={{float:'right'}}>
                        {mdtseValue.lx === 'wsb' ?
                        <>
                          <Button style={{color:"#127BE3", borderColor:"#127BE3", marginTop: '5px'}} onClick={()=>gotoHref('/25/2503/250301/25030101')}>明细采集</Button>
                          <Button style={{color:"#127BE3", borderColor:"#127BE3", marginTop: '5px'}} onClick={()=>gotoHref('/25/2504')}>确认汇总</Button>
                          <Button style={{color:"#127BE3", borderColor:"#127BE3", marginTop: '5px'}} onClick={()=>gotoHref('/25/2505')}>退税申报</Button>
                        </> :
                          <Button style={{color:"#127BE3", borderColor:"#127BE3", marginTop: '5px'}} onClick={()=>gotoHref('/25/2505')}>报表打印</Button>
                        }
                      </Space>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
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
                  <div onClick={()=>gotoHref('/25/2503/250301/25030101')} style={{backgroundColor: '#F7F7F7', padding: '20px', textAlign: 'center'}}>
                    <Avatar className="kjcd-avatar" size={90} icon={<FileDoneOutlined style={{color:"#4490DB"}} />} key='1' />
                    <div style={{marginTop: '5px'}}>生产企业出口货物及修理修配服务免抵退税申报</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div onClick={()=>gotoHref('/25/2503/250302/25030201')} style={{backgroundColor: '#F7F7F7', padding: '20px', textAlign: 'center'}}>
                    <Avatar className="kjcd-avatar" size={90} icon={<FileProtectOutlined style={{color:"#4490DB"}} />} key='2' />
                    <div style={{marginTop: '5px'}}>国际运输（港澳台运输）、航天运输免抵退税申报</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div onClick={()=>gotoHref('/25/2503/250303/25030301')} style={{backgroundColor: '#F7F7F7', padding: '20px', textAlign: 'center'}}>
                    <Avatar className="kjcd-avatar" size={90} icon={<ContainerOutlined style={{color:"#4490DB"}} />} key='1' />
                    <div style={{marginTop: '5px'}}>跨境销售服务及无形资产免抵退税申报</div>
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
