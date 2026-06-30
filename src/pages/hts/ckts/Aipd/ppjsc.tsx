// 疑点管理
import React, { useState, useEffect, } from 'react';
import { Spin, Button, Form, Input, Space, Radio, Modal, Select, Tabs, Checkbox, message, Tooltip, Progress } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import businessValidator from '@/pages/hts/common/field/businessValidator';
import { cxjcpz, initScmx, queryCjGlh, cxsxx, checkSsqPcYsb } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import { QuestionCircleOutlined } from '@ant-design/icons';
import baseValidator from '@/components/DDAssist/field/baseValidator';


export type YdglProps = {
  ppscSave: any;
  ywlxData: any;
  ppscModal: any;
  setPpscModal: any;
  ppgzMasker: any;
  setPpgzMasker: any;
  ppgzZc: any;
  setPpgzZc: any;
  ppgzForm: any;
  ssgzForm: any;
  percentNum: any;
}

const Ydgl: React.FC<YdglProps> = ({
  ppscSave,
  ywlxData,
  ppscModal,
  setPpscModal,
  ppgzMasker,
  setPpgzMasker,
  ssgzForm,
  ppgzForm,
  setPpgzZc,
  percentNum,
}) => {
  // 表单布局
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  // 主列表 匹配生成
  const [zlbppsc, setZlbppsc] = useState<any>([]);
  const [zdy, setZdy] = useState<boolean>(true); // 蒙板
  // 匹配规则form
  // const [ppgzForm] = Form.useForm();
  // 生成规则form
  // const [ssgzForm] = Form.useForm();
  // 主列表searchModal
  const [zdyCode, setZdyCode] = useState<any>('05'); // 蒙板
  // 匹配规则默认
  const [activeKey, setActiveKey] = useState<any>('ssgz');
  // 右侧查询条件
  const [hhcbname, setHhcbname] = useState<any>('');



  // 初始化执行
  useEffect(() => {
    if (ppscModal) {
      setActiveKey('ssgz');
      cxmm();
      initschz();
      setPpgzMasker(true);
      cxsxx({ "cxlx": "02" }).then((res2: any) => {
        setPpgzMasker(false);
        if (res2.code === '200') {
          setZlbppsc(res2.body);
          if(res2.body && res2.body.length >0){
            setZdy(false);
          }
        } else {
          message.error(res2.msg);
        }
      });
    }
  }, [ppscModal]);


  const initschz = async () => {
    setPpgzMasker(true);
    await initScmx({ tableKey: "MTS_ZXSB_SB_MTS_TSSB_G" }).then(async (res: any) => {
      if (res.code === '200') {
        const b = res.body;
        b.hhcbbz = [1,2,3];
        ssgzForm.setFieldsValue( b);
        setHhcbname(`换汇成本（${res.body?.hhcbhlxx}-${res.body?.hhcbhlsx}）`);
        myUtil.localStore.setItem('hhcbhlxx', res.body?.hhcbhlxx);
        myUtil.localStore.setItem('hhcbhlsx', res.body?.hhcbhlsx);
        setPpgzMasker(false);
      } else {
        message.error(res.msg);
      }
    });
  }


  const cxmm = async () => {
    setPpgzMasker(true);
    await cxjcpz({}).then(async (res: any) => {
      setPpgzMasker(false);
      let zdycode = '';
      if (res.code === '200') {
        const dms = res.body?.aipdsxzdDms ? res.body?.aipdsxzdDms : [];
        const arr = ['01', '02', '03', '04'];
        const arr1 = dms.filter((item: string) => !arr.includes(item));
        if (arr1.length > 0) {
          // setZdy(false);
          zdycode = arr1[0];
          setZdyCode(zdycode);
        }
      
        let hh = res.body;
        hh.zdy = zdycode;
        setPpgzZc(hh);
        ppgzForm.setFieldsValue(hh);
      } else {
        message.error(res.msg);
      }
    });
  }

  const blurpc = async (param: any) => {
    var sbpc = myUtil.text.leadingZeroize(param?.target?.value, 3);
    let data = { ssq: '', sbpc: '' };
    data.ssq = ssgzForm.getFieldsValue()?.ssq;
    data.sbpc = sbpc;
    queryCjGlh(data).then((res: any) => {
      const { code, body, desc } = res;
      if (code === '200') {
        ssgzForm.setFieldsValue({ glh: body?.glh, sbpc: data.sbpc, ssq: data.ssq })
      } else {
        message.error(desc);
      }
    });
  }
  const blurssq = async (param: any) => {
    var ssq = param?.target?.value;
    let data = { ssq: '', sbpc: '' };
    data.ssq = ssq;
    data.sbpc = ssgzForm.getFieldsValue()?.sbpc;
    queryCjGlh(data).then((res: any) => {
      const { code, body, desc } = res;
      if (code === '200') {
        ssgzForm.setFieldsValue({ glh: body?.glh, sbpc: data.sbpc, ssq: data.ssq })
      } else {
        message.error(desc);
      }
    });
  }

  const zdyOnchange = (e: any) => {
    if (e.target.checked) {
      setZdy(false);
      ppgzForm.setFieldsValue({ zdy: zdyCode });
    } else {
      setZdy(true);
    }
  }


  // 匹配及生成- 匹配规则- 规格型号
  const onPpgzfpyxppggxh = (e: any) => {
    if (e.target.checked) {
      ppgzForm.setFieldsValue({ bgdggxhbhfpggxhbz: "Y" })
    } else {
      ppgzForm.setFieldsValue({ bgdggxhbhfpggxhbz: "N" })
    }
  }

  return (
    <Modal
      title="匹配及生成规则"
      wrapClassName='standard-modal-1'
      visible={ppscModal}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      onCancel={() => setPpscModal(false)}
      footer={(<>
        <Button onClick={ppscSave} type="primary" disabled={ppgzMasker}>确定</Button>
        <Button onClick={() => setPpscModal(false) } type="default" disabled={ppgzMasker}>关闭</Button>
      </>)}
    >
      {
        percentNum==0?<></>:<div style={{width: 350,
          marginTop: 300,
          zIndex: 999,
          position: "fixed",
          marginLeft: 305
        }} >
          匹配及生成中......
          <Progress percent={percentNum} strokeWidth={30} strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}/>
        </div>
      }
      <Spin tip={'Loading...'} spinning={ppgzMasker} delay={100} style={percentNum==0?{}:{display:'none'}} >
        <Tabs defaultActiveKey={activeKey} >
          <Tabs.TabPane tab="匹配规则" key="ppgz" >
            {/* <Spin tip="Loading..." spinning={ppgzMasker} delay={200}> */}
            <Form form={ppgzForm} >
              <div style={{ backgroundColor: '#f1f4f7', padding: "0 10px", lineHeight: '32px', margin: '0 0 20px 0' }}>数据匹配顺序</div>
              <Form.Item name="sydwglddzgxpdbz" label="配单单位名称：">
                <Radio.Group >
                  <Radio value='Y'>使用单位管理的对照关系配单标志</Radio>
                  <Radio value='N'>不使用单位管理的对照关系配单标志</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="qdgfhppbz" label="商品品名匹配顺序：">
                <Checkbox.Group >
                  <Checkbox value={"Y"}>优先按商品品名、其次按规范化商品品名相同的顺序匹配</Checkbox>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item name="pdppmsDm" label={<>
                <>匹配模式&nbsp;&nbsp;</>
                <Tooltip title="精准匹配指勾选的发票备注栏字段与出口报关单字段完全一致才能配单；模糊匹配指即使发票备注不满足，也可以按照其他配单规则执行配单；">
                  <QuestionCircleOutlined />
                </Tooltip>
              </>}>
                <Radio.Group >
                  <Radio value='1'>精准匹配</Radio>
                  <Radio value='2'>模糊匹配</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="aipdsxzdDms" label="发票备注包含出口报关单字段：">
                <Checkbox.Group >
                  {/* <Space direction="vertical"> */}
                  <Checkbox value='01'>报关单号(18位)</Checkbox>
                  <Checkbox value='02'>报关单号(21位)</Checkbox>
                  <Checkbox value='03'>提运单号</Checkbox>
                  <Checkbox value='04'>合同协议号</Checkbox>
                  <Checkbox value={zdyCode} disabled={zlbppsc?.length==0}  onChange={zdyOnchange}>自定义</Checkbox>
                  {/* </Space> */}
                </Checkbox.Group>
              </Form.Item>
              <Form.Item name="zdy" style={{ marginLeft: 740, marginTop: -57 }}>
                <Select placeholder="请选择" disabled={zdy} style={{ width: 100 }}>
                  {zlbppsc.map((item: any) => (
                    <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="bgdggxhbhfpggxhbz" label="规格型号">
                <Checkbox.Group>
                  <Checkbox value={"Y"} onChange={onPpgzfpyxppggxh}>报关单规格型号包含发票规格型号优先匹配</Checkbox>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item name="fpppsxDm" label="进项发票匹配顺序：" >
                <Radio.Group>
                  <Radio value="1">开票日期先入先出优先匹配</Radio>
                  <Radio value="2">开票日期后入先出优先匹配</Radio>
                  <Radio value="3">同一商品出口单价与进货单价由高至低进行匹配</Radio>
                </Radio.Group>
              </Form.Item>
              <div style={{ backgroundColor: '#f1f4f7', padding: "0 10px", lineHeight: '32px', margin: '0 0 20px 0' }}>数据匹配方式</div>
              <Form.Item name="zzbgddyzzfpyxppbz" label="配单匹配设置：">
                <Checkbox.Group>
                  <Checkbox value='Y'>整张报关单对应整张发票优先匹配</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </Form>
            {/* </Spin> */}
          </Tabs.TabPane>
          <Tabs.TabPane tab="生成规则" key="ssgz" >
            {/* <Spin tip="Loading..." spinning={ssMasker} delay={200}> */}
            <Form form={ssgzForm} {...layout} >
              <Form.Item name="ssq" label="申报年月" rules={[{ required: true, message: '' }, businessValidator.ssq(), businessValidator.ssq02(ssgzForm)]} >
                <Input style={{ width: 450 }}  onBlur={blurssq}/>
              </Form.Item>
              <Form.Item name="sbpc" label="申报批次" rules={[{ required: true, message: '' }, businessValidator.sbpc(ssgzForm)]}>
                <Input style={{ width: 450 }}  onBlur={blurpc}/>
              </Form.Item>
              <Form.Item name="glh" label="关联号">
                <Input disabled={true} style={{ width: 450 }} />
              </Form.Item>
              <Form.Item name="cktmsywlxdmjh" label="业务类型代码" rules={[
                () => ({
                  validator(_, value) {
                    if (value && value.length > 3) {
                      return Promise.reject(new Error('最多选择3项业务类型代码！'));
                    }
                    return Promise.resolve();
                  },
                })
              ]} >
                <Select mode="multiple" maxTagCount={3} style={{ width: 450 }}>
                  {ywlxData.map((item: any) => (
                    <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="备注" name="bz" rules={[baseValidator.range2({ min: 0, max: 200 })]}>
                <Input style={{ width: 450 }} />
              </Form.Item>
              <Form.Item name="hhcbbz" label={hhcbname} rules={[{ required: true, message: '请选择换汇成本！' }]} >
                <Checkbox.Group>
                  <Checkbox key={1} value={1}>合理范围</Checkbox>
                  <Checkbox key={2} value={2}>低于合理范围</Checkbox>
                  <Checkbox key={3} value={3}>高于合理范围</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </Form>
            {/* </Spin> */}
          </Tabs.TabPane>
        </Tabs>
      </Spin>
    </Modal>
  );
};


export default Ydgl;
