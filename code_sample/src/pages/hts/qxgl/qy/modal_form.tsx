/**
 * title: 企业管理-新增/修改企业
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import pro from '@/pages/common/proConfig';
import { Modal, Button, Form, Spin, Input, Select, message } from 'antd';
import myUtil from '@/pages/common/myUtil';
import { saveOrUpdateQy, queryDmDqLoginSaas } from '@/services/hts/api';
import baseValidator from '@/pages/common/field/baseValidator';
import DDAlert from '@/components/DDAlert';


export interface BdjgProps {
  onRef?: any;
}

const ModalForm: React.FC<BdjgProps> = ({
  onRef,
}) => {

  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [cktsqylxOption, setCktsqylxOption] = useState<any>([]);
  const [yhzxqygxlxOption, setYhzxqygxlxOption] = useState<any>([]);
  const [szdqOption, setSzdqOption] = useState<any>([]); // 所在地区
  const [name, setName] = useState<any>([]); // 所在地区
  const [initParam, setInitParam] = useState<any>({});
  const [form] = Form.useForm();
  const [hidden, setHidden] = useState<any>(false); // 所在地区

  const [pageTypq, setPageType] = useState<boolean>(false);

  // 开启
  const showModal = async (param: any, record: any, flag: any, yhuuid1: any, yhlx: any) => {
    setName(flag);
    if (flag == "修改") {
      setHidden(true);
    }
    const cktsqylxCodeTable: any = await myUtil.code.getCodeFromServerT1('code_dm_rd_cktsqylx', '01');
    setCktsqylxOption(cktsqylxCodeTable);
    const yhzxqygxlxCodeTable: any = await myUtil.code.getCodeFromServerT1('code_dm_gy_yhzxqygxlx', '01');
    setYhzxqygxlxOption(yhzxqygxlxCodeTable);
    await getSzdqCode(yhuuid1, yhlx);
    if (record?.nsrsbhDqlb) {
      setPageType(true);
      record.ssdq1Dqlb = record.swcode;
      record.hgqyDmDqlb = record.hgqyDmDqlb?.trim();
      record.shxydmDqlb = record.shxydmDqlb?.trim();
      form.setFieldsValue(record);
    } else {
      setPageType(false)
      form.resetFields();
    }
    setInitParam(param);
    setModalVisible(true);
  };

  // 得到所在地区列表
  const getSzdqCode = (yhuuid1: any, yhlx: any) => {
    const object = {
      codeStoreKey: "CODE_DM_DQLOGIN_JS",
      codeViewKey: "01",
      yhuuid1: yhuuid1,
      yhlx: yhlx,
    }
    queryDmDqLoginSaas(object).then((res: any) => {
      const { code, body, msg } = res;
      if (code === '200') {
        setSzdqOption(body)
      } else {
        message.error(msg)
      }
    })
  }

  // 保存
  const save = () => {
    if (name == '修改') {
      form.validateFields().then(values => {
        const params = form.getFieldsValue(true);
        setMasker(true);
        saveOrUpdateQy(params).then((res: any) => {
          const { code, msg } = res;
          setMasker(false);
          if (code == '200') {
            close();
            message.success("保存成功！");
            initParam?.unitRef.current!.reload2();
          } else {
            message.error(msg)
          }
        })
      });
    } else {
      form.validateFields().then(values => {
        const params = form.getFieldsValue(true);
        DDAlert.open({
          title: '系统提示',
          info: '保存后，“社会信用代码”将无法修改，确定信息无误并继续操作吗？',
          infoType: 'question',
          modalType: 'confirm',
          okCallbackFn: function (thisObj: any) {
            setMasker(true);
            saveOrUpdateQy(params).then((res: any) => {
              const { code, msg } = res;
              setMasker(false);
              if (code == '200') {
                close();
                message.success("保存成功！");
                initParam?.unitRef.current!.reload2();
              } else {
                message.error(msg)
              }
            })
          },
        });
      });
    }

  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const onbeload = (param: any) => {
    if (form.getFieldValue('nsrsbhDqlb')) {
      return;
    } else {
      form.setFieldsValue({ nsrsbhDqlb: param?.target?.value });
    }
  }

  const close = () => {
    setModalVisible(false);
    setCktsqylxOption([]);
    setYhzxqygxlxOption([]);
    setName([]);
    setSzdqOption([]);
    setInitParam([]);
    setHidden(false);
    form.resetFields();
  }

  return (
    <Modal
      title={name}
      visible={modalVisible}
      width={pro.c_modal_width_x1}
      onCancel={() => close()}
      footer={(<>
        <Button onClick={() => save()} type="primary">保存</Button>
        <Button onClick={() => close()} type="default">关闭</Button>
      </>)}
      maskClosable={false}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Form
          form={form}
          name="form"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 14 }}
        >
          <Form.Item name="shxydmDqlb" label="社会信用代码" rules={[{ required: true, message: '请录入社会信用代码' }, baseValidator.len(18), baseValidator.english_number()]}>
            <Input placeholder="请录入社会信用代码" maxLength={20} onBlur={onbeload} disabled={hidden} />
          </Form.Item>
          <Form.Item name="nsrmcDqlb" label="纳税人名称" rules={[{ required: true, message: '请录入纳税人名称' }]}>
            <Input placeholder="请录入纳税人名称" maxLength={100} />
          </Form.Item>
          <Form.Item name="hgqyDmDqlb" label="海关企业代码" rules={[{ required: true, message: '请录入海关企业代码' }, baseValidator.len(10), baseValidator.english_number()]}>
            <Input placeholder="请录入海关企业代码" maxLength={25} />
          </Form.Item>
          <Form.Item name="nsrsbhDqlb" label="纳税人识别号" rules={[{ required: true, message: '请录入纳税人识别号' }, baseValidator.lenOr('纳税人识别号', 15, 18), baseValidator.english_number()]}>
            <Input placeholder="请录入纳税人识别号" maxLength={20} />
          </Form.Item>
          <Form.Item name="cktsqylxDmDqlb" label="出口退税企业类型代码" rules={[{ required: true, message: '请选择出口退税企业类型代码' }]}>
            <Select placeholder="请选择出口退税企业类型代码">
              {cktsqylxOption.map((item: any) => (
                <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="ssdq1Dqlb" label="所属地区" rules={[{ required: true, message: '请录入所属地区' }]}>
            <Select placeholder="请选择所属地区">
              {szdqOption.map((item: any) => (
                <Select.Option key={item.swcode} value={item.swcode}>{item.swname}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          {/* <Form.Item name="yhzxqygxlxDmDqlb" label="与当前企业关系" >
            <Select placeholder="请选择与当前企业关系">
              {yhzxqygxlxOption.map((item: any) => (
                <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item> */}
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalForm;
