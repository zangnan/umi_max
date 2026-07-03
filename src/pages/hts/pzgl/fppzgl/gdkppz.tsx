/**
 * 发票开具配置  关单开票配置
 */
import { intl } from '@/components/DDAssist/util';
import { Form, message, Radio, Space, Tooltip, Select, Spin } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { kppzwh } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import { useAccess, Access } from 'umi';
import DDAlert from '@/pages/hts/components/DDAlert';

const Index: React.FC<{ data?: any }> = ({
  data
}) => {

  const access = useAccess(); // 权限

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

  // 修改拆分规则
  const onChangeFpcfgzDm = (e: any, name: any) => {
    const values = form.getFieldsValue(true);
    if(values.fpcfgzDm === '3'){
      DDAlert.open({
        title: '系统提示',
        info: '该选项数据计算逻辑为：最后一张发票金额使用剩余数量*单价进行计算，可能会出现开具发票总金额与关单实际总金额不一致情况，请确认无误后操作。',
        modalType: 'info',
        infoType: 'question',
        okText: '确认',
        okCallbackFn: function (thisObj: any) {
          // 保存数据
          DDAlert.close();
        },
        cancelCallbackFn: function () {
        }
      });
    }
    onChange(e, name);
  }

  const onChange = (e:any, flag: any) => {
    if(flag === 'spwhgz'){
     const value =  e.target.value;
      DDAlert.open({
        title: '系统提示',
        info: '切换商品维护规则后，按报关单开具中已配置好的税收分类编码，有可能会被清空，需要到外销商品管理中按照新的商品维护规则配置税收分类编码，确定继续操作吗？',
        infoType: 'question',
        modalType: 'confirm',
        okCallbackFn: function (thisObj: any) {
          onChangeHlgz();
          DDAlert.close();
        },
        cancelCallbackFn: function () {
          form.setFieldsValue({fphwxxxqgzDm:value ==='1'? '2' :'1' });
        }
      });
    }else{
      onChangeHlgz();
    }
  };

  // 汇率规则选择
  const onChangeHlgz = () => {
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

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <Form className="jckppz_wrap" form={form} key={data} layout="vertical">
        <Space size={[20, 20]} wrap className="tile_group">
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">数量单位</div>
            <div className="title_main">
              <Form.Item name="fpsldwxqgzDm">
                <Radio.Group onChange={onChange}>
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>成交单位及数量</Radio>
                    <Radio value='2'>法定单位及数量</Radio>
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
                <Radio.Group onChange={onChange}>
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
                <Radio.Group onChange={onChange}>
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>不开具</Radio>
                    <Radio value='2'>与退税商品一起开具</Radio>
                    <Radio value='3'>与退税商品分开开具</Radio>
                    {/* <Radio value='3' disabled={btsspDisable}>与退税商品分开开具</Radio> */}
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">发票规格型号</div>
            <div className="title_main">
              <Form.Item name="fpggxhxqgzDm">
                <Radio.Group onChange={onChange}>
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
                <Radio.Group onChange={onChange}>
                  <Space direction="vertical">
                    <Tooltip title="以报关单明细计算的金额为准开票，有可能该张关单开具的开票金额合计值与关单成交总价人民币值不一致">
                      <Radio value='N'>不调整尾差<QuestionCircleOutlined/></Radio>
                    </Tooltip>
                    <Tooltip title="按总金额开票，即该张关单最后一条发票的商品用减法计算">
                      <Radio value='Y'>报关单开票调整尾差<QuestionCircleOutlined/></Radio>
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
                <Radio.Group onChange={(e: any) => onChange(e, 'spwhgz')}>
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
            <div className="group_tile_c1">开票汇率来源</div>
            <div className="title_main">
              <Form.Item name="hllyDm">
                <Radio.Group onChange={onChange}>
                  <Space direction="vertical">
                    <Radio value='01'>外汇管理局</Radio>
                    <Radio value='02'>中国银行</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>

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
                  <Select style={{width: 240}} onChange={onChange} disabled={flag}>
                    <Select.Option value='11'>按出口日期当天汇率</Select.Option>
                    <Select.Option value='12'>按出口日期当月第一个工作日</Select.Option>
                    <Select.Option value='13'>按出口日期当月第一天</Select.Option>
                    <Select.Option value='14'>按出口日期当月最后一天</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="wckrqfphlxqgzDm" label="无出口日期开票汇率">
                  <Select style={{width: 240}} onChange={onChange} disabled={flag}>
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
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">开票排序规则</div>
            <div className="title_main">
              <Space direction="vertical">
                <Form.Item name="pxgzDm" label="排序规则">
                  <Select style={{width: 240}} onChange={onChange} disabled={flag}>
                    <Select.Option value='1'>出口日期</Select.Option>
                    <Select.Option value='2'>报关单号</Select.Option>
                    <Select.Option value='3'>合同协议号</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="pxfsDm" label="排序方式">
                  <Select style={{width: 240}} onChange={onChange} disabled={flag}>
                    <Select.Option value='1'>升序</Select.Option>
                    <Select.Option value='2'>降序</Select.Option>
                  </Select>
                </Form.Item>
              </Space>
              {/* </Radio.Group> */}
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">生成开票数据方式</div>
            <div className="title_main">
              <Form.Item name="scfpsqdfsDm">
                <Radio.Group onChange={(e: any) => onChange(e, 'scfpsqdfsDm')}>
                  <Space direction="vertical" size={10}>
                    <Tooltip title="同一18位报关单号的开一张出口发票">
                      <Radio value='1'>每张关单分开生成<QuestionCircleOutlined/></Radio>
                    </Tooltip>
                    <Tooltip title="同一购买方名称的关单开一张出口发票">
                      <Radio value='2'>多张关单合并生成<QuestionCircleOutlined/></Radio>
                    </Tooltip>
                    <Tooltip title="每项商品开一张出口发票">
                      <Radio value='3'>每项商品分开生成<QuestionCircleOutlined/></Radio>
                    </Tooltip>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">拆分规则</div>
            <div className="title_main">
              <Form.Item name="fpcfgzDm">
                <Radio.Group onChange={(e: any) => onChangeFpcfgzDm(e, 'fpcfgzDm')} disabled={flag}>
                  <Space direction="vertical" size={10}>
                    <Tooltip title="单条商品超限额进行拆分时，数量按照金额/单价，保留4位小数计算，无需将数量调整为整数。">
                      <Radio value='2'>数量无需调整<QuestionCircleOutlined/></Radio>
                    </Tooltip>
                    <Tooltip title="单条数量为整数且金额超限额时，保证拆分后的数量为整数且总金额总数量不变，调整最后一条的单价。">
                      <Radio value='1'>数量取整拆分<QuestionCircleOutlined/></Radio>
                    </Tooltip>
                    <Tooltip title="单条数量为整数且金额超限额时，保证拆分后的数量为整数且总数量与单价不变，最后一张发票金额使用剩余数量*单价进行计算。">
                      <Radio value='3'>数量取整拆分单价保持一致<QuestionCircleOutlined/></Radio>
                    </Tooltip>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">立即开票规则</div>
            <div className="title_main">
              <Form.Item name="ljkpgzDm">
                <Radio.Group onChange={(e: any) => onChange(e, 'ljkpgzDm')}>
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>立即开票后，生成开票数据到发票申请单</Radio>
                    <Radio value='2'>立即开票后，生成开票数据并直接提交开票</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <Access accessible={access.is040001()} fallback={<></>}>
            <div className="fpkjpz_titl">
              <div className="group_tile_c1">自动开票</div>
              <div className="title_main">
                <Form.Item name="zdscbz">
                  <Radio.Group onChange={(e: any) => onChange(e, 'zdscbz')}>
                    <Space direction="vertical" size={10}>
                      <Radio value='Y'>是</Radio>
                      <Radio value='N'>否</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>
          </Access>
        </Space>
      </Form>
    </Spin>
  );
};

export default Index;
