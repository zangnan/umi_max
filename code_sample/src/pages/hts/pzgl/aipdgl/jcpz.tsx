/**
 * 发票开具配置  关单开票配置
 */
import { Form, message, Radio, Space, Spin, Checkbox, Select, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { cxjcpz, bcjcpz, cxsxx } from '@/services/hts/api';
import './style.less';
import { QuestionCircleOutlined } from '@ant-design/icons';
import importStyle from './style.less';

const Index: React.FC<{ data?: any, zlbsx: any ;form:any;}> = ({
  data,
  zlbsx,
  form
}) => {

  const [masker, setMasker] = useState<boolean>(false); // 蒙板
  const [zdy, setZdy] = useState<boolean>(true); // 蒙板
  const [zdyCode, setZdyCode] = useState<any>('05'); // 蒙板


  useEffect(() => {
    cxmm();
  }, []);


  const cxmm = async () => {
    await cxjcpz({}).then(async (res: any) => {
      setMasker(false);
      let zdycode = '';
      if (res.code === '200') {
        const dms = res.body?.aipdsxzdDms ? res.body?.aipdsxzdDms : [];
        const arr = ['01', '02', '03', '04'];
        const arr1 = dms.filter((item: string) => !arr.includes(item));
        if (arr1.length > 0) {
          setZdy(false);
          zdycode = arr1[0];
          setZdyCode(zdycode);
        }
        let hh = res.body;
        if(zlbsx?.length>0){
          hh.zdy = zdycode;
        }
        hh.sydwglddzgxpdbz = res.body?.sydwglddzgxpdbz == "Y"?"Y":"N";
        hh.pdppmsDm = res.body?.pdppmsDm == '1'?"1":"2";
        form.setFieldsValue(hh);
      } else {
        message.error(res.msg);
      }
    });
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
    if (values.bgdggxhbhfpggxhbz && values.bgdggxhbhfpggxhbz?.length > 0) {
      values.bgdggxhbhfpggxhbz = "Y";
    } else {
      values.bgdggxhbhfpggxhbz = "N";
    }
    if (values.zzbgddyzzfpyxppbz && values.zzbgddyzzfpyxppbz?.length > 0) {
      values.zzbgddyzzfpyxppbz = "Y";
    } else {
      values.zzbgddyzzfpyxppbz = "N";
    }

    const dms = values?.aipdsxzdDms ? values?.aipdsxzdDms : [];
    const arr = ['01', '02', '03', '04'];
    const arr1 = dms.filter((item: string) => !arr.includes(item));
    const apiDms = [];
    if (values.aipdsxzdDms.includes('01')) {
      apiDms.push('01');
    }
    if (values.aipdsxzdDms.includes('02')) {
      apiDms.push('02');
    }
    if (values.aipdsxzdDms.includes('03')) {
      apiDms.push('03');
    }
    if (values.aipdsxzdDms.includes('04')) {
      apiDms.push('04');
    }
    if (arr1.length > 0) {
      apiDms.push(values.zdy);
      setZdy(false);
    } else {
      setZdy(true);
    }
    values.aipdsxzdDms = apiDms;
    setMasker(true);
    bcjcpz(values).then((res2: any) => {
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
      }}>数据匹配顺序
      </div>
      <Form className={importStyle.jckppz_wrap} form={form} key={data} layout="vertical" style={{marginLeft:20,marginTop:20}}>
        <Space size={[20, 20]} wrap className={importStyle.tile_group}>
       <div className={importStyle.fpkjpz_titl}>
            <div className={importStyle.group_tile_c1}>计量单位转换</div>
            <div className={importStyle.title_main}>
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
            <div className= {importStyle.title_main}>
              <Form.Item name="qdgfhppbz" >
                <Checkbox.Group onChange={onChange}>
                  <Checkbox value={"Y"}>优先按商品品名、其次按规范化商品品名相同的顺序匹配</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </div>
          </div>

          <div className={importStyle.fpkjpz_titl} >
            <div className={importStyle.group_tile_c1}>发票备注匹配模式&nbsp;&nbsp;
            <Tooltip title="精准匹配指勾选的发票备注栏字段与出口报关单字段完全一致才能配单；模糊匹配指即使发票备注不满足，也可以按照其他配单规则执行配单；">
                  <QuestionCircleOutlined />
                </Tooltip>
            </div>
            <div className={importStyle.title_main}>
              <Form.Item name="pdppmsDm">
                <Radio.Group onChange={onChange}>
                  <Radio value='1'>精准匹配</Radio>
                  <Radio value='2'>模糊匹配</Radio>
                </Radio.Group>
              </Form.Item>
              
            </div>
          </div>
          <div className={importStyle.fpkjpz_titl} >
            <div className={importStyle.group_tile_c1}>发票备注匹配条件</div>
            <div className={importStyle.title_main}>
            <Form.Item name="aipdsxzdDms" >
                <Checkbox.Group onChange={onChange} style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Checkbox value='01'>报关单号(18位)</Checkbox>
                    <Checkbox value='02' style={{marginBottom: 10 }} >报关单号(21位)</Checkbox>
                    <Checkbox value='03'style={{ marginLeft: 0}}>提运单号</Checkbox>
                    <Checkbox value='04' style={{ marginLeft: 46,marginBottom: 10 }}>合同协议号</Checkbox>
                    <Checkbox value={zdyCode} disabled={zlbsx?.length==0} style={{ marginLeft: 0}}>自定义</Checkbox>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item name="zdy" style={{ marginLeft: 100, marginTop: -50 }}>
                <Select placeholder="请选择" disabled={zdy} onChange={onchange2}>
                  {zlbsx.map((item: any) => (
                    <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className={importStyle.fpkjpz_titl} >
            <div className={importStyle.group_tile_c1}>规格型号匹配顺序</div>
            <div className={importStyle.title_main}>
              <Form.Item name="bgdggxhbhfpggxhbz" >
                <Checkbox.Group onChange={onChange}>
                  <Space direction="vertical">
                    <Checkbox value='Y'>报关单规格型号包含发票规格型号优先匹配</Checkbox>
                  </Space>
                </Checkbox.Group>
              </Form.Item>
            </div>
          </div>
          <div className={importStyle.fpkjpz_titl}>
            <div className={importStyle.group_tile_c1}>整张匹配顺序</div>
            <div className={importStyle.title_main}>
              <Form.Item name="zzbgddyzzfpyxppbz">
                <Checkbox.Group onChange={onChange}>
                  <Checkbox value='Y'>整张报关单对应整张发票优先匹配</Checkbox>
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
    </Spin>
  );
};

export default Index;
