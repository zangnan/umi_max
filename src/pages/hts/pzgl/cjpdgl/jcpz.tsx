/**
 * 发票开具配置  关单开票配置
 */
import { Checkbox, Col, Form, message, Radio, Row, Select, Space, Spin, Tooltip, } from 'antd';

import React, {useEffect, useState} from 'react';
import {bcjcpz2, cxjcpz2 } from '@/pages/hts/services/htsApi';
import importStyle from './style.less';
import {QuestionCircleOutlined} from '@ant-design/icons';

const Index: React.FC<{ data?: any, zlbsx: any ;form:any;}> = ({
  data,
  zlbsx,
  form
}) => {

  const [masker, setMasker] = useState<boolean>(false); // 蒙板
  const [zdy, setZdy] = useState<boolean>(true); // 蒙板
  const [zdyCode, setZdyCode] = useState<any>('05'); // 蒙板
  const [formppfs] = Form.useForm();
  const [formpp] = Form.useForm();
  const [ppgzDm, setPpgzDm] = useState<any>('1');

  useEffect(() => {
    cxmm();
  }, []);


  const cxmm = async () => {
    await cxjcpz2({}).then(async (res: any) => {
      setMasker(false);
      let zdycode = '';
      if (res.code === '200') {
        const dms = res.body?.cjpdsxzdDm ? res.body?.cjpdsxzdDm : [];
        const arr = ['01', '02', '03', '04'];
        const arr1 = dms.filter((item: string) => !arr.includes(item));
        if (arr1.length > 0) {
          setZdy(false);
          zdycode = arr1[0];
          setZdyCode(zdycode);
        }
        if(dms.includes('05')){
          setZdy(false);
        }
        let hh = res.body;
        if(zlbsx?.length>0){
          hh.zdy = zdycode;
        }
        hh.sydwglddzgxpdbz = res.body?.sydwglddzgxpdbz == "Y"?"Y":"N";
        hh.bgdggxhbhfpggxhbz = !res.body?.bgdggxhbhfpggxhbz ?"N":res.body?.bgdggxhbhfpggxhbz;
        hh.ppgzDm = !res.body?.ppgzDm ? "1" : res.body?.ppgzDm;
        formpp.setFieldsValue(hh);
        setPpgzDm(hh.ppgzDm);
        hh.gdppfsDm = !res.body?.gdppfsDm ? "2" : res.body?.gdppfsDm;
        form.setFieldsValue(hh);
        formppfs.setFieldsValue(hh);
      } else {
        message.error(res.msg);
      }
    });
  }

  const onPpgzDmChange = (param: any) => {
    const values = formpp.getFieldsValue(true);
    setPpgzDm(values?.ppgzDm);
    onChange();
  }

  const onchange2 = () => {
    onChange();
  }

  // 汇率规则选择
  const onChange = async () => {
    let values = await form.getFieldsValue();
    if (values?.qdgfhppbz?.length > 0) {
      values.qdgfhppbz = "Y";
    } else {
      values.qdgfhppbz = "N";
    }
    // if (values.bgdggxhbhfpggxhbz && values.bgdggxhbhfpggxhbz?.length > 0) {
    //   values.bgdggxhbhfpggxhbz = "Y";
    // } else {
    //   values.bgdggxhbhfpggxhbz = "N";
    // }
    if (values.jnhydyjxfpxfszdyzyxppbz && values.jnhydyjxfpxfszdyzyxppbz?.length > 0) {
      values.jnhydyjxfpxfszdyzyxppbz = "Y";
    } else {
      values.jnhydyjxfpxfszdyzyxppbz = "N";
    }
    let formppValues = await formpp.getFieldsValue();
    values.ppgzDm = formppValues?.ppgzDm;

    const dms = values?.cjpdsxzdDm ? values?.cjpdsxzdDm : [];
    const arr = ['01', '02', '03', '04'];
    const arr1 = dms.filter((item: string) => !arr.includes(item));
    const apiDms = [];
    if (values?.cjpdsxzdDm?.includes('01')) {
      apiDms.push('01');
    }
    if (values?.cjpdsxzdDm?.includes('02')) {
      apiDms.push('02');
    }
    if (values?.cjpdsxzdDm?.includes('03')) {
      apiDms.push('03');
    }
    if (values?.cjpdsxzdDm?.includes('04')) {
      apiDms.push('04');
    }
    if (arr1.length > 0) {
      apiDms.push(values.zdy);
      setZdy(false);
    } else {
      setZdy(true);
    }
    values.aipdsxzdDms = apiDms;
    let values2 = await formppfs.getFieldsValue();
    values.ydyppkcfjhslbz = values2?.ydyppkcfjhslbz ?values2?.ydyppkcfjhslbz :"N" ;
    values.yddppkcfjhslbz = values2?.yddppkcfjhslbz ?values2?.yddppkcfjhslbz :"N";
    values.gdppfsDm = values2?.gdppfsDm;
    bcjcpz2(values).then((res2: any) => {
      setMasker(false);
      if (res2.code === '200') {
        message.success('保存成功！');
      } else {
        message.error(res2.msg);
      }
    });
  };

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <div style={{
        backgroundColor: "#f1f4f7",
        padding: "8px 25px 30px",
        height: 30,
        marginRight: -50,
      }}>数据匹配范围
      </div>
      <Form className={importStyle.jckppz_wrap} style={{marginLeft: 20, height: 200}} form={formpp} key={data} layout="vertical">
        <Space size={[20, 20]} wrap className={importStyle.tile_group}>
          <div className={importStyle.fpkjpz_titl}>
            <div className={importStyle.title_main}>数据匹配范围</div>
            <div className="title_main" style={{marginTop:10}}>
              <Form.Item name="ppgzDm">
                <Radio.Group onChange={onPpgzDmChange}>
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>日期范围匹配</Radio>
                    <Radio value='2'>对照关系匹配</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
        </Space>
      </Form>
      <div style={{
        backgroundColor: "#f1f4f7",
        padding: "8px 25px 30px",
        height: 30,
        marginRight: -50,
      }}>数据匹配顺序
      </div>
      <Form className={importStyle.jckppz_wrap} style={{marginLeft: 20}} form={form} key={data}   layout="vertical">
        <Space size={[20, 20]} wrap className={importStyle.tile_group}>
        <div className={importStyle.fpkjpz_titl}>
          <div className={importStyle.title_main}>计量单位转换</div>
            <div className="title_main" style={{marginTop:10}}>
              <Form.Item name="sydwglddzgxpdbz">
                <Radio.Group onChange={onChange}>
                  <Space direction="vertical" size={10}>
                    <Radio value='Y'>使用计量单位转换</Radio>
                    <Radio value='N'>不使用计量单位转换</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className={importStyle.fpkjpz_titl}>
            <div className={importStyle.group_tile_c1}>商品品名匹配顺序</div>
            <div className={importStyle.title_main}>
              <Form.Item name="qdgfhppbz" >
                <Checkbox.Group onChange={onChange}>
                  <Checkbox value={"Y"}>优先按商品品名、其次按规范化商品品名相同的顺序匹配</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </div>
          </div>

          <div className={ppgzDm == '1' ? importStyle.fpkjpz_titl : importStyle.fpkjpz_titl_readOnly} >
            <div className={importStyle.group_tile_c1}>发票备注匹配模式&nbsp;&nbsp;
            <Tooltip title="精准匹配指勾选的发票备注栏字段与出口报关单字段完全一致才能配单；模糊匹配指即使发票备注不满足，也可以按照其他配单规则执行配单；">
                  <QuestionCircleOutlined />
                </Tooltip>
            </div>
            <div className={importStyle.title_main}>
              <Form.Item name="pdppmsDm">
                <Radio.Group onChange={onChange} disabled={ppgzDm != '1'}>
                  <Radio value='1'>精准匹配</Radio>
                  <Radio value='2'>模糊匹配</Radio>
                </Radio.Group>
              </Form.Item>

            </div>
          </div>
          <div className={ppgzDm == '1' ? importStyle.fpkjpz_titl : importStyle.fpkjpz_titl_readOnly} >
            <div className={importStyle.group_tile_c1}>发票备注匹配条件</div>
            <div className={importStyle.title_main}>
            <Form.Item name="cjpdsxzdDm" >
                <Checkbox.Group onChange={onChange} style={{ display: 'flex', flexWrap: 'wrap' }} disabled={ppgzDm != '1'}>
                    <Checkbox value='01'>报关单号(18位)</Checkbox>
                    <Checkbox value='02' style={{ marginBottom:10}} >报关单号(21位)</Checkbox>
                    <Checkbox value='03'style={{ marginLeft: 0}}>提运单号</Checkbox>
                    <Checkbox value='04' style={{ marginLeft: 46 ,marginBottom:10}}>合同协议号</Checkbox>
                    <Checkbox value={zdyCode} disabled={zlbsx?.length==0} style={{ marginLeft: 0}}>自定义</Checkbox>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item name="zdy" style={{ marginLeft: 100, marginTop: -49 }}>
                <Select placeholder="请选择"  disabled={ppgzDm != '1' || zdy} onChange={onchange2}>
                  {zlbsx.map((item: any) => (
                    <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className={importStyle.fpkjpz_titl} >
            <div className={importStyle.group_tile_c1}>报关单规格型号匹配模式</div>
            <div className={importStyle.title_main}>
              <Form.Item name="bgdggxhbhfpggxhbz" rules={[{ required: true, message: '请选择报关单规格型号匹配模式' },]}>
                <Radio.Group onChange={onChange}>
                  <Space direction="vertical" size={10}>
                    <Radio value='A'>仅匹配包含发票规格型号的发票</Radio>
                    <Radio value='Y'>包含发票规格型号优先匹配</Radio>
                    <Radio value='N'>不考虑规格型号</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>

          <div className={importStyle.fpkjpz_titl}>
            <div className={importStyle.group_tile_c1}>境内货源地匹配顺序 &nbsp;&nbsp;
              <Tooltip title="勾选后系统会判断报关单境内货源地与进项发票销方所在地是否为同一地区。">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <div className={importStyle.title_main}>
              <Form.Item name="jnhydyjxfpxfszdyzyxppbz">
                <Checkbox.Group onChange={onChange}>
                  <Checkbox value='Y'>境内货源地与进项发票销方所在地一致优先匹配</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </div>
          </div>

          <div className={importStyle.fpkjpz_titl}>
            <div className={importStyle.group_tile_c1}>发票匹配顺序</div>
            <div className={importStyle.title_main}>
              <Form.Item name="fpppsxDm" >
                <Radio.Group onChange={onChange}>
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>开票日期先入先出优先匹配</Radio>
                    <Radio value='2'>开票日期后入先出优先匹配</Radio>
                    <Radio value='3'>同一商品出口单价与进货单价由高至低进行匹配</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
        </Space>
      </Form>
      <div style={{
        backgroundColor: "#f1f4f7",
        padding: "8px 25px 30px",
        height: 30,
        marginRight: -50,
        marginTop: -20,
      }}>数据匹配方式
      </div>
      <Form className={importStyle.jckppz_wrap} form={formppfs} style={{marginLeft: 20}} key={data} layout="vertical">
        <Space size={[20, 20]} wrap className={importStyle.tile_group}>
          <div className={importStyle.fpkjpz_titl} style={{ width: 600, height: 180 }}>
            <div className={importStyle.group_tile_c1}> 发票匹配方式&nbsp;&nbsp;
            <Tooltip title="一对一匹配是指一张报关单与一张发票进行匹配的场景；一对多匹配是指一张报关单与多张发票进行匹配的场景">
                  <QuestionCircleOutlined />
             </Tooltip></div>
            <div className={importStyle.title_main}>
              <Row>
                <Col span={12} style={{ border: '0.5px dashed rgb(181 175 175)', padding: '10px' }}>
                  <Form.Item name="ydyppkcfjhslbz" >
                    <Radio.Group onChange={onChange}>
                      <Radio value='N'>一对一匹配（不拆分进货数量）</Radio>
                      <Radio value='Y'>一对一匹配（可拆分进货数量）</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12} style={{ border: '0.5px dashed rgb(181 175 175)', padding: '10px' }}>
                  <Form.Item name="yddppkcfjhslbz" >
                    <Radio.Group onChange={onChange}>
                      <Radio value='N'>一对多匹配（不拆分进货数量）</Radio>
                      <Radio value='Y'>一对多匹配（可拆分进货数量）</Radio>
                    </Radio.Group>
                  </Form.Item></Col>
              </Row>
            </div>
          </div>
          <div className={importStyle.fpkjpz_titl}>
            <div className={importStyle.group_tile_c1}>关单匹配方式&nbsp;&nbsp;
                <Tooltip title="整张匹配即一张关单的所有项都匹配成功才算匹配成功；单项商品即关单的一项商品匹配成功则匹配成功，与其他项不关联。">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <div className={importStyle.title_main}>
              <Form.Item name="gdppfsDm" rules={[{required: true, message: '请选择关单匹配方式'}]}>
                <Radio.Group onChange={onChange}>
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>整张关单匹配成功视为匹配成功</Radio>
                    <Radio value='2'>单项商品匹配成功视为匹配成功</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
        </Space>
      </Form>
    </Spin>
  );
};

export default Index;
