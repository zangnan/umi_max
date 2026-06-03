/**
 * 发票开具配置  基础开票配置
 */
import React, { useEffect, useState } from 'react';
import { Form, Input, message, Radio, Space, Tooltip, Spin } from 'antd';
import '../style.less';
import { QuestionCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { kppzwh, skxxcx } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import { useIntl } from 'umi';
import cktsUtil from '@/pages/common/cktsUtil';
import baseValidator from '@/pages/common/field/baseValidator';
import { useAccess, Access } from 'umi';
import qxUtil from '@/pages/common/qxUtil';
import DDAlert from '@/components/DDAlert';

const Index: React.FC<{ data?: any, funcRef?: any }> = ({
  data,
  funcRef
}) => {
  const access = useAccess(); // 权限

  const [form] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false); // 蒙板
  const [fpsplxDisable, setFpsplxDisable] = useState<boolean>(true); // 根据税盘类型判断分机号是否可填
  const [kpfsDisabled, setKpfsDisabled] = useState<boolean>(true); // 在线开票/导出开票
  const [qdfpDisabled, setQdfpDisabled] = useState<boolean>(false); // 数电票（普通发票）
  const intl = useIntl(); // 提示信息
  const [mxkjmshs, setMxkjmshs] = useState<String>('8'); //明细开具模式 行数显示
  const [zcFlag, setZcFlag] = useState<String>('0'); // 是否注册 0未注册 1注册中 2册成功
 

  const onChange = (name: any) => {
    const values = form.getFieldsValue(true);
    changeQjfpDisabled(values); // 数电票（普通发票）
    if(values.fpzlDm1 === '5' && qxUtil.getQxz(paramQxz2)){
      form.setFieldsValue({fpkjfsDm: '1'});
      values.fpkjfsDm = '1'
    }
    if (name === 'fpzlDm1' && (values.fpzlDm1 === '3' || values.fpzlDm1 === '4')) {
      form.setFieldsValue({fpkjfsDm: '1'});
      values.fpkjfsDm = '1';
    }
    saveChange(values, name);
  };

  // 开票方式
  const onChangeKpfs  = (event: any) => {
    const values = form.getFieldsValue(true);
    if (values?.fpkjfsDm === '2' && (values?.fpzlDm1 === '3' || values?.fpzlDm1 === '4' )) {
      form.setFieldsValue({fpkjfsDm: '1'});
      message.warning('开票方式为在线开票时，不支持开税控票');
      return ;
    }
    // const values = form.getFieldsValue(true);
    saveChange(values, 'fpkjfsDm');
  };

  // 数电票（普通发票），其他模块是否能选择
  const changeQjfpDisabled = (values: any) => {
    // 发票种类是增值税普通发票
    if(values.fpzlDm1 === '3'){
      setMxkjmshs("8");
    } else if (values.fpzlDm1 === '4'){
      // 发票种类是增值税电子普通发票
      setMxkjmshs("100");
    }
    if(values.fpzlDm1 === '5'){
      setQdfpDisabled(true)
    } else{
      setQdfpDisabled(false)
    }
  };

  // 税收分类编码版本号
  const bbhChange = async () => {
    await form.validateFields(['bbh']);
    const values = form.getFieldsValue(true);
    saveChange(values, 'bbh');
  }

  // 税盘号
  const sphChange = async () => {
    await form.validateFields(['sph']);
    const values = form.getFieldsValue(true);
    saveChange(values, 'sph');
    
  }

  // 分机号
  const fjhChange = async () => {
    await form.validateFields(['fjh1']);
    const values = form.getFieldsValue(true);
    saveChange(values, 'fjh1');
  }

  // 导出路径
  const dcwjccljChange = async () => {
    form.validateFields(['dcwjcclj']);
    const values = form.getFieldsValue(true);
    saveChange(values, 'dcwjcclj');
  }

  // 回填路径
  const ccljChange = async () => {
    form.validateFields(['cclj']);
    const values = form.getFieldsValue(true);
    saveChange(values, 'cclj');
  }

  // 备份路径
  const bfwjccljChange = async () => {
    form.validateFields(['bfwjcclj']);
    const values = form.getFieldsValue(true);
    saveChange(values, 'bfwjcclj');
  }

  // 打印机名称
  const dyjmcChange = async () => {
    form.validateFields(['dyjmc']);
    const values = form.getFieldsValue(true);
    saveChange(values, 'dyjmc');
  }

  const changeDisabled = (values: any) => {
    if (values.fpsplxDm == '1') { // 航天
      setFpsplxDisable(false);
    } else {
      setFpsplxDisable(true);
      form.resetFields(['fjh1']); // 分机号还原
    }
    if (values.fpkjfsDm == '2') { // 在线开票
      setKpfsDisabled(false);
    } else { // 导出开票
      setKpfsDisabled(true);
      // form.resetFields(['sph','fjh1']); // 税盘号,分机号还原
    }

    setQdfpDisabled(false)
    if(values.fpzlDm1 === '3'){
      setMxkjmshs("8");
    } else if (values.fpzlDm1 === '4'){
      // 发票种类是增值税电子普通发票
      setMxkjmshs("100");
    } else if(values.fpzlDm1 === '5') {
      setQdfpDisabled(true)
    }
  }
  // 保存修改
  const saveChange = (values: any, name: any) => {
    setMasker(true);
    //数电票，如果关单开票设置里的不退税商品是“与退税商品分开开具”,将重置成“与退税商品一起开具”
    if(values && values.fpzlDm1 === '5' && values.fpbtsspxqgzDm ==='3'){
      values.fpbtsspxqgzDm = '2'
    }
    values.ctbs = name;
    kppzwh({ key: 'CS_ZXSB_FPKJ_CSPZ', data: values }).then((response) => {
      const { code, desc, msg,  body } = response;
      setMasker(false);
      if (code === '200') {
        if(values && values.fpzlDm1 === '3' && values.fpkjfsDm === '2') {
          funcRef(true) // 是否显示打印机
        } else {
          funcRef(false) // 是否显示打印机
        }
        if(values && values.fpzlDm1 === '5' && values.fpkjfsDm === '2') {
          getSkxxcxData('1');
          const sdpzcbz = body?.sdpzcbz || 'N';
          if(sdpzcbz === 'Y') {
            DDAlert.open({
              title: '数电票在线开票',
              info: '数电票在线开票申请成功!',
              content: '注册审核时间需1个工作日，建议次日再进行开具出口发票的操作。',
              modalType: 'info',
              infoType: 'success',
              okText: '确定',
              okCallbackFn: function (thisObj: any) {
                // 保存数据
                DDAlert.close();
              },
            });
          } else {
            message.success(intl.formatMessage({ id: 'message_ckfp_fppz_common_save_success' }));
          }
        } else {
          message.success(intl.formatMessage({ id: 'message_ckfp_fppz_common_save_success' }));  
        }
        changeDisabled(values);
        //myUtil.sessionStore.setItem('CODE_CS_ZXSB_FPKJ_CSPZ_01',[values] );
        myUtil.code.saveCodeToLocalTable('CODE_CS_ZXSB_FPKJ_CSPZ',[values],'01');
      } else if(code === '900') {
        message.info(msg);
      } else {
        message.error(desc);
      }
    })
  }

  // 下载工具（导出）
  const downloadGj = async () => {
    setMasker(true)
    let a=document.createElement('a') ;//创建一个a标签元素
    a.style.display='none'  ;//设置元素不可见
    a.href='https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
    document.body.appendChild(a)  ;//加入
    a.click(); //触发点击,下载
    document.body.removeChild(a) ;//释放 
    setMasker(false)
  }

  // 下载驱动（在线）
  const downloadDriver = async  () => {
    setMasker(true)
    let a=document.createElement('a') ;//创建一个a标签元素
    a.style.display='none'  ;//设置元素不可见
    a.href='https://crm.hstclouds.com/慧税发票助手.zip'; //设置下载地址
    document.body.appendChild(a)  ;//加入
    a.click(); //触发点击,下载
    document.body.removeChild(a) ;//释放 
    setMasker(false)


    // const params = {
    //   accessClientId: 'dditSaas',
    //   staticFilexx: 'hgickkj.exe',
    // }
    // setMasker(true)
    // await cktsUtil.downloadFileCkts(`/yw/bszx/wbsj/bgd/khdgjXzGet/`, params);
    // setMasker(false)
  }

  useEffect(() => {
    Promise.all([myUtil.code.getCodeFromServerT2('CODE_CS_ZXSB_FPKJ_CSPZ', '01')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ', '01');
      if (temp && temp.length > 0) {
        form.setFieldsValue(temp[0]);
        // 发票种类是增值税普通发票
        changeDisabled(temp[0]);
        if(temp[0].fpzlDm1 === '5' && temp[0].fpkjfsDm === '2'){
          getSkxxcxData('1');
        }
      }
    });
  }, [data]);

  const paramQxz = {
    qxCode: 'qz_zxkp',
    accessObj: access,
  }

  const paramQxz2 = {
    qxCode: 'qz_zxkp2',
    accessObj: access,
  }

  const getSkxxcxData = (flag: any) => {
    setMasker(true);
    skxxcx({}).then((res:any)=> {
      setMasker(false);
      const {code, body, desc} = res;
      if(code === '200') {
        const zcbz = body.zcbz;
        setZcFlag(zcbz);
        if(flag === '2') {
          message.success('刷新成功');
        }
      } else {
        setZcFlag('0');
        message.error(desc);
      }
    })
  }

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <Form className="jckppz_wrap" form={form} key={data}>
        <Space size={[20, 20]} wrap className="tile_group">
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">发票种类</div>
            <div className="title_main" style={{position: 'relative'}}>
              <Form.Item name="fpzlDm1">
                <Radio.Group onChange={()=>onChange('fpzlDm1')}>
                  <Space direction="vertical" size={10}>
                    {/* <Radio value='3'>增值税普通发票</Radio>
                    <Radio value='4'>增值税电子普通发票</Radio> */}
                    <Radio value='5'>数电票（普通发票）</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
              <div style={{position: 'absolute', top:'4px', left:'150px'}}>
                {
                  zcFlag != '0' && qdfpDisabled && !kpfsDisabled ?
                    zcFlag === '2' ? 
                    <>
                      <span className='fpk-text-zc'>注册成功</span>
                      <SyncOutlined className='fpk-icon-sx' style={{color: '#BFBFBF', cursor: 'inherit'}} />
                    </> :
                    zcFlag === '1' ? 
                    <>
                    <span className='fpk-text-zc'>注册中</span>
                    <SyncOutlined onClick={()=>getSkxxcxData('2')} className='fpk-icon-sx' />
                    </> :
                    <>
                      <span className='fpk-text-wzc'>注册失败</span>
                      <SyncOutlined onClick={()=>getSkxxcxData('2')} className='fpk-icon-sx' />
                    </>
                  : <></>
                }
              </div>
            </div>
          </div>
          {/* <div className="fpkjpz_titl">
            <div className="group_tile_c1">税盘类型</div>
            <div className="title_main">
              <Form.Item name="fpsplxDm">
                <Radio.Group onChange={()=>onChange('fpsplxDm')} disabled={qdfpDisabled} >
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>航天</Radio>
                    <Radio value='2'>百旺</Radio>
                    <Radio value='3'>税务Ukey</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div> */}
          {/* <div className="fpkjpz_titl">
            <div className="group_tile_c1">发票限额</div>
            <div className="title_main">
              <Form.Item name="fpzgkpxeDm" className='content_fpxe'>
                <Radio.Group onChange={()=>onChange('fpzgkpxeDm')} disabled={qdfpDisabled} >
                  <Space direction="horizontal" size={10} wrap>
                    <Radio value='1'>万元版</Radio>
                    <Radio value='2'>十万元版</Radio>
                    <Radio value='3'>百万元版</Radio>
                    <Radio value='4'>千万元版</Radio>
                    <Radio value='5'>亿元版</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div> */}
          {/* <div className="fpkjpz_titl">
            <div className="group_tile_c1">明细开具模式</div>
            <div className="title_main">
              <Form.Item name="fpmxkjmsDm">
                <Radio.Group onChange={()=>onChange('fpmxkjmsDm')} name="fpmxkjmsDm" disabled={qdfpDisabled} >
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>超过{mxkjmshs}行开具清单</Radio>
                    <Radio value='2'>超过{mxkjmshs}行开具新发票</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div> */}
          {/* <div className="fpkjpz_titl">
            <div className="group_tile_c1">税收分类编码版本号</div>
            <div className="title_main">
              <Form.Item name='bbh' rules={[{ required: true, message: '请输入税收分类编码版本号' }, baseValidator.numberFloat()]}>
                <Input onPressEnter={bbhChange} onBlur={bbhChange} maxLength={20} disabled={qdfpDisabled} />
              </Form.Item>
            </div>
          </div> */}

          <div className="fpkjpz_titl">
            <div className="group_tile_c1">开票方式</div>
            <div className="title_main" style={{position: 'relative'}}>
              <Form.Item name="fpkjfsDm">
                <Radio.Group onChange={onChangeKpfs} >
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>导出开票</Radio>
                    <Access accessible={qxUtil.getQxz(paramQxz)} fallback={<></>}>
                      <Radio value='2' disabled={qxUtil.getQxz(paramQxz2) && qdfpDisabled}>在线开票</Radio>
                    </Access>
                  </Space>
                </Radio.Group>
              </Form.Item>
              {/* <Access accessible={qxUtil.getQxz(paramQxz)} fallback={
              <>
                <span style={{position: 'absolute', top: '5px', left: '88px', fontSize: '14px'}}>{!kpfsDisabled ? <span style={{color: '#BFBFBF', cursor: 'inherit'}}>下载工具</span>:<a onClick={downloadGj}>下载工具</a>}</span>
              </>
              }>
                <span style={{position: 'absolute', top: '0px', left: '88px', fontSize: '14px'}}>{!kpfsDisabled ? <span style={{color: '#BFBFBF', cursor: 'inherit'}}>下载工具</span>:<a onClick={downloadGj}>下载工具</a>}</span>
                <span style={{position: 'absolute', top: '32px', left: '88px', fontSize: '14px'}}>{qdfpDisabled || kpfsDisabled || qxUtil.getQxz(paramQxz2) && qdfpDisabled ? <span style={{color: '#BFBFBF', cursor: 'inherit'}}>下载驱动</span>:<a onClick={downloadDriver}>下载驱动</a>}</span>
              </Access> */}
            </div>
          </div>
          {/* <div className="fpkjpz_titl">
            <div className="group_tile_c1">税盘号</div>
            <div className="title_main">
              <Form.Item name='sph' rules={!kpfsDisabled ? [{ required: !kpfsDisabled, message: '请输入税盘号' }, baseValidator.english_number(), baseValidator.range2({ min: 0, max: 12 }) ] : []}>
                <Input onPressEnter={sphChange} onBlur={sphChange} disabled={kpfsDisabled || qdfpDisabled}/>
              </Form.Item>
            </div>
          </div> */}
          {/* <div className="fpkjpz_titl">
            <div className="group_tile_c1">分机号</div>
            <div className="title_main">
              <Form.Item name='fjh1' rules={[{ required: !kpfsDisabled, message: '请输入分机号' }, baseValidator.numberFloat()]}>
                <Input onPressEnter={fjhChange} onBlur={fjhChange} disabled={fpsplxDisable || kpfsDisabled || qdfpDisabled}/>
              </Form.Item>
            </div>
          </div> */}
          {/* <div className="fpkjpz_titl">
            <div className="group_tile_c1">打印机名称</div>
            <div className="title_main">
              <Form.Item name='dyjmc' rules={[ baseValidator.english_number(), baseValidator.range2({ min: 0, max: 50 }) ]}>
                <Input onPressEnter={dyjmcChange} onBlur={dyjmcChange} disabled={kpfsDisabled} placeholder="例：Canon iR2520 UFRIILT" />
              </Form.Item>
            </div>
          </div> */}
          {/* <div className="fpkjpz_titl">
            <div className="group_tile_c1">导出路径 
              <Tooltip title='请配置开票系统中的导出文件路径'>
                <QuestionCircleOutlined style={{ marginLeft: "5px", marginBottom:"0px", cursor: "pointer" }} />
              </Tooltip>
            </div>
            <div className="title_main">
              <Form.Item name='dcwjcclj' rules={[{ required: true, message: '导出路径' }]}>
                <Input onPressEnter={dcwjccljChange} onBlur={dcwjccljChange} placeholder="例：C:\Users\导出文件路径" disabled={qdfpDisabled}/>
              </Form.Item>
            </div>
          </div> */}
          {/* <div className="fpkjpz_titl">
            <div className="group_tile_c1">回填路径 
              <Tooltip title='请配置开票系统中的回写文件路径'>
                <QuestionCircleOutlined style={{ marginLeft: "5px", marginBottom:"0px", cursor: "pointer" }} />
              </Tooltip>
            </div>
            <div className="title_main">
              <Form.Item name='cclj' rules={[{ required: true, message: '回填路径' }]}>
                <Input onPressEnter={ccljChange} onBlur={ccljChange} placeholder="例：C:\Users\回填文件路径" disabled={qdfpDisabled}/>
              </Form.Item>
            </div>
          </div> */}
          {/* <div className="fpkjpz_titl">
            <div className="group_tile_c1">备份路径 
              <Tooltip title='请配置开票系统中的备份文件路径'>
                <QuestionCircleOutlined style={{ marginLeft: "5px", marginBottom:"0px", cursor: "pointer" }} />
              </Tooltip>
            </div>
            <div className="title_main">
              <Form.Item name='bfwjcclj' rules={[{ required: true, message: '备份路径' }]}>
                <Input onPressEnter={bfwjccljChange} onBlur={bfwjccljChange} placeholder="例：C:\Users\备份文件路径" disabled={qdfpDisabled}/>
              </Form.Item>
            </div>
          </div> */}
        </Space>
      </Form>
    </Spin>
  );
};

export default Index;
