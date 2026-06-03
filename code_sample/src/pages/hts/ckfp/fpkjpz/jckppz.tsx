/**
 * 发票开具配置  基础开票配置
 */
import React, { useEffect, useState } from 'react';
import { Form, Input, message, Radio, Space, Tooltip, Spin, Button } from 'antd';
import './style.less';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { kppzwh } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import { useIntl } from 'umi';
import baseValidator from '@/pages/common/field/baseValidator';

const Index: React.FC<{ data?: any }> = ({
  data
}) => {

  const [form] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false); // 蒙板
  const [fpsplxDisable, setFpsplxDisable] = useState<boolean>(true); // 根据税盘类型判断分机号是否可填
  const [kpfsDisabled, setKpfsDisabled] = useState<boolean>(true); // 在线开票/导出开票
  const [qdfpDisabled, setQdfpDisabled] = useState<boolean>(true); // 数电票（普通发票）
  const intl = useIntl(); // 提示信息

  const onChange = (event: any) => {
    const values = form.getFieldsValue(true);
    saveChange(values);
    changeQjfpDisabled(values)
  };

  // 数电票（普通发票），其他模块是否能选择
  const changeQjfpDisabled = (values: any) => {
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
    saveChange(values);
  }

  // 分机号
  const fjhChange = async () => {
    await form.validateFields(['fjh1']);
    const values = form.getFieldsValue(true);
    saveChange(values);
  }

  // 导出路径
  const dcwjccljChange = async () => {
    form.validateFields(['dcwjcclj']);
    const values = form.getFieldsValue(true);
    saveChange(values);
  }

  // 回填路径
  const ccljChange = async () => {
    form.validateFields(['cclj']);
    const values = form.getFieldsValue(true);
    saveChange(values);
  }

  // 备份路径
  const bfwjccljChange = async () => {
    form.validateFields(['bfwjcclj']);
    const values = form.getFieldsValue(true);
    saveChange(values);
  }

  const changeDisabled = (values: any) => {
    if (values.fpsplxDm == '1') { // 航天
      setFpsplxDisable(false);
    } else {
      setFpsplxDisable(true);
    }
    if (values.fpkjfsDm == '2') { // 在线开票
      setKpfsDisabled(false);
    } else { // 导出开票
      setKpfsDisabled(true);
    }
  }
  // 保存修改
  const saveChange = (values: any) => {
    setMasker(true);
    //数电票，如果关单开票设置里的不退税商品是“与退税商品分开开具”,将重置成“与退税商品一起开具”
    if(values && values.fpzlDm1 === '5' && values.fpbtsspxqgzDm ==='3'){
      values.fpbtsspxqgzDm = '2'
    }
    kppzwh({ key: 'CS_ZXSB_FPKJ_CSPZ', data: values }).then((response) => {
      const { code, desc } = response;
      setMasker(false);
      if (code === '200') {
        changeDisabled(values);
        myUtil.code.saveCodeToLocalTable('CODE_CS_ZXSB_FPKJ_CSPZ',[values],'01');
        message.success(intl.formatMessage({ id: 'message_ckfp_fppz_common_save_success' }));
      } else {
        message.error(desc);
      }
    })
  }

  // 下载驱动
  const downloadDriver = () => {
    // const a = document.createElement('a');
    // a.setAttribute('href', '../../../../../assets/docs/readme.docx');
    // a.setAttribute('download', 'test.docx');
    // a.click();
  }

  useEffect(() => {
    Promise.all([myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ', '01')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ', '01');
      if (temp && temp.length > 0) {
        form.setFieldsValue(temp[0]);
        changeDisabled(temp[0]);
      }
    });
  }, [data]);

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <Form className="jckppz_wrap" form={form} key={data}>
        <Space size={[20, 20]} wrap className="tile_group">
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">发票种类</div>
            <div className="title_main">
              <Form.Item name="fpzlDm1">
                <Radio.Group onChange={onChange}>
                  <Space direction="vertical" size={10}>
                    <Radio value='3'>增值税普通发票</Radio>
                    <Radio value='4'>增值税电子普通发票</Radio>
                    <Radio value='5'>数电票（普通发票）</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">税盘类型</div>
            <div className="title_main">
              <Form.Item name="fpsplxDm">
                <Radio.Group onChange={onChange} disabled={qdfpDisabled} >
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>航天</Radio>
                    <Radio value='2'>百旺</Radio>
                    <Radio value='3'>税务Ukey</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">抬头类型</div>
            <div className="title_main">
              <Form.Item name="fpttlxDm">
                <Radio.Group onChange={onChange} disabled={qdfpDisabled} >
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>企业</Radio>
                    <Radio value='2'>个人/非企业</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">发票限额</div>
            <div className="title_main">
              <Form.Item name="fpzgkpxeDm" className='content_fpxe'>
                <Radio.Group onChange={onChange} disabled={qdfpDisabled} >
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
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">明细开具模式</div>
            <div className="title_main">
              <Form.Item name="fpmxkjmsDm">
                <Radio.Group onChange={onChange} name="fpmxkjmsDm" disabled={qdfpDisabled} >
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>超过8行开具清单</Radio>
                    <Radio value='2'>超过8行开具新发票</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">拆分规则</div>
            <div className="title_main">
              <Form.Item name="fpcfgzDm">
                <Radio.Group onChange={onChange} disabled={qdfpDisabled} >
                  <Space direction="vertical" size={10}>
                    <Tooltip title="单条商品超限额进行拆分时，数量按照金额/单价，保留4位小数计算，无需将数量调整为整数。">
                      <Radio value='2'>数量无需调整<QuestionCircleOutlined /></Radio>
                    </Tooltip>
                    <Tooltip title="单条数量为整数且金额超限额时，保证拆分后的数量为整数且总金额总数量不变，调整最后一条的单价。">
                      <Radio value='1'>数量取整拆分<QuestionCircleOutlined /></Radio>
                    </Tooltip>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">税收分类编码版本号</div>
            <div className="title_main">
              <Form.Item name='bbh' rules={[{ required: true, message: '请输入税收分类编码版本号' }, baseValidator.numberFloat()]}>
                <Input onPressEnter={bbhChange} onBlur={bbhChange} maxLength={20} disabled={qdfpDisabled} />
              </Form.Item>
            </div>
          </div>

          <div className="fpkjpz_titl">
            <div className="group_tile_c1">开票方式</div>
            <div className="title_main">
              <Form.Item name="fpkjfsDm">
                <Radio.Group onChange={onChange} >
                  <Space direction="vertical" size={10}>
                    <Radio value='1' disabled={qdfpDisabled}>导出开票</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">分机号</div>
            <div className="title_main">
              <Form.Item name='fjh1' rules={[{ required: !kpfsDisabled, message: '请输入分机号' }, baseValidator.numberFloat()]}>
                <Input onPressEnter={fjhChange} onBlur={fjhChange} disabled={fpsplxDisable || kpfsDisabled || qdfpDisabled}/>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">导出路径 
                <Tooltip title='请配置开票系统中的导出文件路径'>
                      <QuestionCircleOutlined style={{ marginLeft: "5px", marginBottom:"0px", cursor: "pointer" }} />
                </Tooltip>
            </div>
            <div className="title_main">
              <Form.Item name='dcwjcclj' rules={[{ required: true, message: '导出路径' }]}>
                <Input onPressEnter={dcwjccljChange} onBlur={dcwjccljChange} placeholder="例：C:\Users\导出文件路径" />
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">回填路径 
                <Tooltip title='请配置开票系统中的回写文件路径'>
                      <QuestionCircleOutlined style={{ marginLeft: "5px", marginBottom:"0px", cursor: "pointer" }} />
                </Tooltip>
            </div>
            <div className="title_main">
              <Form.Item name='cclj' rules={[{ required: true, message: '回填路径' }]}>
                <Input onPressEnter={ccljChange} onBlur={ccljChange} placeholder="例：C:\Users\回填文件路径"/>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">备份路径 
                <Tooltip title='请配置开票系统中的备份文件路径'>
                      <QuestionCircleOutlined style={{ marginLeft: "5px", marginBottom:"0px", cursor: "pointer" }} />
                </Tooltip>
            </div>
            <div className="title_main">
              <Form.Item name='bfwjcclj' rules={[{ required: true, message: '备份路径' }]}>
                <Input onPressEnter={bfwjccljChange} onBlur={bfwjccljChange} placeholder="例：C:\Users\备份文件路径"/>
              </Form.Item>
            </div>
          </div>
        </Space>
      </Form>
    </Spin>
  );
};

export default Index;
