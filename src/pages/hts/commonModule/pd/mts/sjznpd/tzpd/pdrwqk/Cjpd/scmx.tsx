import React, { useImperativeHandle, useState,} from 'react';
import { Modal, message, Form, Select, Input, Checkbox, Spin, Button } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import myUtil from '@/components/DDAssist/util';
import businessValidator from '@/pages/hts/common/field/businessValidator';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import { sjsc3, initScmx, queryCjGlh } from '@/pages/hts/services/htsApi';


export type PdrwProps = {
  children?: any;
  onRef?: any;
  setModalVisible?: any;
}

const Tzpd: React.FC<PdrwProps> = ({
  children,
  onRef,
  setModalVisible,
}) => {
  const [modalVisibleMx, setModalVisibleMx] = useState<boolean>();
  const [pduuid, setPduuid] = useState<any>();
  const [tzpdztDm, setTzpdztDm] = useState<any>();

  const [ywlxData, setYwlxData] = useState<any>([]);
  const [hhcbname, setHhcbname] = useState<any>('');
  const [ppgzMasker, setPpgzMasker] = useState<any>('');

  const [ssgzForm] = Form.useForm();
  const [param, setParam] = useState<any>();
  const [param2, setParam2] = useState<any>();

  // 表单布局
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  //绑定组件
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


  // 开启页面，并设置参数
  const showModal = (param: any,param2:any) => {
    setParam(param);
    setParam2(param2);
    const promiseArr: any = [myUtil.code.getCodeFromServerT1('code_dm_ckts_cktmsywlx:10')];
    Promise.all(promiseArr).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const tmpCodeTable: any = myUtil.code.getSelectOption('code_dm_ckts_cktmsywlx', '10');
      setYwlxData(tmpCodeTable);
    });
    const pduuid = param.record?.pduuid ;
    const tzpdztDm = param.record?.tzpdztDm ;
    setPduuid(pduuid);
    setTzpdztDm(tzpdztDm);
    initschz();
    setModalVisibleMx(true);
  };
  const initschz = async () => {
    setPpgzMasker(true);
    await initScmx({ tableKey: "MTS_ZXSB_SB_MTS_TSSB_G" }).then(async (res: any) => {
      if (res.code === '200') {
        const b = res.body;
        b.hhcbbz = [1,2,3];
        ssgzForm.setFieldsValue( b);
        setHhcbname(`换汇成本（${res.body?.hhcbhlxx}-${res.body?.hhcbhlsx}）`);
        setPpgzMasker(false);
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


  const closeMx = () => {
    setModalVisibleMx(false);
    ssgzForm.resetFields();
    param?.unitRef?.current?.reload2();
    param2?.unitRef?.current?.reload2();
  }

  const save = async () => {
    const ssgzV = await ssgzForm.validateFields();
    const cktmsywlxmcjh: any = [];
    for (let i = 0; i < ssgzV?.cktmsywlxdmjh?.length; i++) {
      ywlxData?.map((item: any, index: number) => {
        if (item?.value == ssgzV?.cktmsywlxdmjh[i]) {
          cktmsywlxmcjh.push(item?.name);
        }
      })
    }
    ssgzV.cktmsywlxmcjh = cktmsywlxmcjh?.join(',');
    ssgzV.cktmsywlxdmjh = ssgzV?.cktmsywlxdmjh?.join(',');
    const params = { sjsc: ssgzV, pduuid: pduuid, tzpdztDm: tzpdztDm };
    setPpgzMasker(true);
    sjsc3(params).then(async (res) => {
      setPpgzMasker(false);
      const { code, desc } = res;
      if (code === '200') {
        closeMx();
        if(setModalVisible){
          setModalVisible(false);
        }
      } else {
        message.error(desc);
      }
    });


  }

  return (
    <>
      <Modal
        title="生成明细"
        destroyOnHidden={true}
        visible={modalVisibleMx}
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        onCancel={() => closeMx()}
        footer={(<>
          <Button onClick={() => closeMx()} type="default">取消</Button>
          <Button onClick={save} type="primary">确定</Button>
        </>)}
      >
        <Spin tip={'Loading...'} spinning={ppgzMasker} delay={100} >
          <Form form={ssgzForm} {...layout} >
            <Form.Item name="ssq" label="申报年月" rules={[{ required: true, message: '' }, businessValidator.ssq(), businessValidator.ssq02(ssgzForm)]} >
              <Input style={{ width: 450 }} onBlur={blurssq} />
            </Form.Item>
            <Form.Item name="sbpc" label="申报批次" rules={[{ required: true, message: '' }, businessValidator.sbpc(ssgzForm)]}>
              <Input style={{ width: 450 }} onBlur={blurpc} />
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
            <Form.Item name="hhcbhlxx"  >
              <Input hidden={true}></Input>
            </Form.Item>
            <Form.Item name="hhcbhlsx"  >
              <Input hidden={true}></Input>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
export default Tzpd;
