/**
 * 发票开具配置  关单开票配置
 */
import { intl } from '@/components/DDAssist/util';
import { Form, message, Radio, Space, Tooltip, Select, Spin } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { kppzwh } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';

const Index: React.FC<{ data?: any }> = ({
  data
}) => {

  const [form] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false); // 蒙板
  const [flag, setFlag] = useState<any>(false); // 汇率规则下拉框是否可选择
  const [btsspDisable, setBtsspDisable] = useState<boolean>(false); // 不退税商品是否可用

  // const intl = useIntl(); // 提示信息

  useEffect(() => {
    Promise.all([myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ:01')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
      form.setFieldsValue(temp[0]);
      if(temp && temp[0].fpzlDm1 === '5'){
        setBtsspDisable(true);
      }
      else{
        setBtsspDisable(false);
      }
    });
  }, [data]);

  const onChange = () => {
    const values = form.getFieldsValue(true);
    setMasker(true);
    kppzwh({ key: 'CS_ZXSB_FPKJ_CSPZ', data: values }).then((response) => {
      const { code, desc } = response;
      setMasker(false);
      if (code === '200') {
        myUtil.code.saveCodeToLocalTable('CODE_CS_ZXSB_FPKJ_CSPZ',[values],'01');
        message.success(intl.formatMessage({ id: 'message_ckfp_fppz_common_save_success' }));
      } else {
        message.error(desc);
      }
    })
  };

  // 汇率规则选择
  const onChangeHlgz = (e: any) => {
    message.info("修改成功");
    if (e.target.value === '2') {
      setFlag(false);
    } else {
      setFlag(true);
    }
  };

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <Form className="jckppz_wrap" form={form} key={data} layout="vertical">
        <Space size={[20, 20]} wrap className="tile_group">
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">数量单位</div>
            <div className="title_main">
              <Form.Item name="fpsldwxqgzDm">
                <Radio.Group onChange={onChange} >
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>成交单位及数量</Radio>
                    <Radio value='2'>第一单位及数量</Radio>
                    <Radio value='3'>第二单位及数量</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">发票金额</div>
            <div className="title_main">
              <Form.Item name="fpjelxxqgzDm">
                <Radio.Group onChange={onChange} >
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>人民币成交价</Radio>
                    <Radio value='2'>人民币FOB价</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">不退税商品</div>
            <div className="title_main">
              <Form.Item name="fpbtsspxqgzDm">
                <Radio.Group onChange={onChange} >
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>不开具</Radio>
                    <Radio value='2'>与退税商品一起开具</Radio>
                    <Radio value='3' disabled={btsspDisable} >与退税商品分开开具</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">发票规格型号</div>
            <div className="title_main">
              <Form.Item name="fpggxhxqgzDm">
                <Radio.Group onChange={onChange} >
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>不填写</Radio>
                    <Radio value='2'>取报关单规格型号</Radio>
                    <Radio value='3'>取报关单备注栏</Radio>
                    <Radio value='4'>取外销商品管理的发票规格型号</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">尾差调整</div>
            <div className="title_main">
              <Form.Item name="fpwctzbz">
                <Radio.Group onChange={onChange} >
                  <Space direction="vertical">
                    <Tooltip title="以报关单明细计算的金额为准开票，有可能该张关单开具的开票金额合计值与关单成交总价人民币值不一致">
                      <Radio value='N'>不调整尾差<QuestionCircleOutlined /></Radio>
                    </Tooltip>
                    <Tooltip title="按总金额开票，即该张关单最后一条发票的商品用减法计算">
                      <Radio value='Y'>报关单开票调整尾差<QuestionCircleOutlined /></Radio>
                    </Tooltip>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">商品维护规则</div>
            <div className="title_main">
              <Form.Item name="fphwxxxqgzDm">
                <Radio.Group onChange={onChange} >
                  <Space direction="vertical">
                    <Radio value='1'>按海关商品代码、海关商品名称生成商品信息</Radio>
                    <Radio value='2'>按海关商品代码、海关商品名称、海关规格型号生成商品信息</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          {/* <div className="fpkjpz_titl">
            <div className="group_tile_c1">发票购买方规则</div>
            <div className="title_main">
              <Form.Item name="fpgmfsfwjwshrbz">
                <Radio.Group onChange={onChange} >
                  <Space direction="vertical">
                    <Radio value='Y'>使用出口报关单的境外收发货人作为出口发票购买方的名称</Radio>
                    <Radio value='N'>不使用出口报关单的境外收发货人</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div> */}
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">开票汇率规则</div>
            <div className="title_main">
              {/* <Radio.Group onChange={onChangeHlgz} > */}
              {/* <Radio.Group value={10}> */}
              <Space direction="vertical">
                {/* <Radio value='1'>使用出口退税汇率</Radio> */}
                {/* <Radio value='10' checked>有出口日期开票汇率</Radio> */}
                {/* <span >有出口日期开票汇率</span> */}
                <Form.Item name="fphlxqgzDm" label="有出口日期开票汇率">
                  <Select style={{ width: 240 }} onChange={onChange} disabled={flag}>
                    <Select.Option value='11'>按出口日期当天汇率</Select.Option>
                    <Select.Option value='12'>按出口日期当月第一个工作日</Select.Option>
                    <Select.Option value='13'>按出口日期当月第一天</Select.Option>
                    <Select.Option value='14'>按出口日期当月最后一天</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="wckrqfphlxqgzDm" label="无出口日期开票汇率">
                  <Select style={{ width: 240 }} onChange={onChange} disabled={flag}>
                    <Select.Option value='21'>按申报日期当天汇率</Select.Option>
                    <Select.Option value='22'>按申报日期当月第一个工作日</Select.Option>
                    <Select.Option value='23'>按申报日期当月第一天</Select.Option>
                    <Select.Option value='24'>按申报日期当月最后一天</Select.Option>
                  </Select>
                </Form.Item>
              </Space>
              {/* </Radio.Group> */}
            </div>
          </div>
        </Space>
      </Form>
    </Spin>
  );
};

export default Index;