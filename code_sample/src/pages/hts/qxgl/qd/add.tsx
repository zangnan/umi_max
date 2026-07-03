// 生成进货
import React, {useImperativeHandle, useState} from 'react';
import {Button, Col, DatePicker, Form, Input, message, Modal, Radio, Row, Spin, Switch, TreeSelect} from 'antd';
import pro from '@/pages/common/proConfig';
import '@/pages/hts/commonModule/style.less';
import {cxYhMrQxz, xzHxgQd,} from '@/services/hts/api';
import {TreeNodeProps} from 'rc-tree-select/lib/TreeNode';
import baseValidator from "@/pages/common/field/baseValidator";
import locale from "antd/es/date-picker/locale/zh_CN";
import myUtil from "@/pages/common/myUtil";
import moment from "moment/moment";

export interface DDTsort {
  onRef?: any;
  visible?: any;
  yhlx?: any;
}

const Add: React.FC<DDTsort> = ({onRef, visible = false, yhlx}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [form] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false);
  const [ediybz, setEdiybz] = useState<boolean>(false);
  const [title, setTitle] = useState('新增');
  const [mainRef, setMainRef] = useState<any>({}); //主页面的ref
  //登录验证标志
  const [dlyzbzCheck, setDlyzbzCheck] = useState<boolean>(false);
  //有效标志
  const [yxbzCheck, setYxbzCheck] = useState<boolean>(true);
  //API集成标志
  const [apijcbzCheck, setApijcbzCheck] = useState<boolean>(false);
  //页面集成标志
  const [ymjcbzCheck, setYmjcbzCheck] = useState<boolean>(false);

  //第三方API集成标志
  const [apijcdsfbz, setApijcdsfbz] = useState<boolean>(false);
  //API集成标志
  const [ymjcdsfbz, setYmjcdsfbz] = useState<boolean>(false);
  const [ywlxList, setYwlxList] = useState<any>([]);   // 右侧列选择
  const [apifwaqyjybz, setApifwaqyjybz] = useState<boolean>(false);
  const [zdsqbz, setZdsqbz] = useState<boolean>(false);

  const [yssqbz, setYssqbz] = useState<boolean>(false);
  const [sqyxqbz, setSqyxqbz] = useState<boolean>(false);

  // 开启
  const showModal = (param: any, flag: any) => {
    //
    setMainRef(param);
    setModalVisible(true);
    // 表单初始化
    initForm(param, flag);
    initSelect();
  };

  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 表单初始化
  const initSelect = async () => {
    setMasker(true);
    await cxYhMrQxz({}).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        setYwlxList(response?.body);
      } else {
        message.error(response.msg);
      }
    })
  };


  // 表单初始化
  const initForm = (param: any, flag: any) => {
    if (yhlx != '13') { // 运营管理员
      setSqyxqbz(true);
      setYssqbz(true);
    }
    if (flag == 'edit') {
      const {selectionRows} = param;
      setTitle('编辑');
      setEdiybz(true);
      const row = selectionRows[0];
      setDlyzbzCheck(row.dlyzbz == 'Y');
      setYxbzCheck(row.yxbz == 'Y');
      setApijcbzCheck(row.apijcbz == 'Y');
      setYmjcbzCheck(row.ymjcbz == 'Y');
      setApijcdsfbz(row.apijcdsfbz == 'Y');
      setYmjcdsfbz(row.ymjcdsfbz == 'Y');
      setApifwaqyjybz(row.apifwaqyjybz == 'Y');
      setZdsqbz(row.zdsqbz == 'Y');
      if (yhlx == '13') { // 只有运营管理员 才动态切换是否只读
        if (row?.sqfsDm == '1') {
          setSqyxqbz(true);
          setYssqbz(true);
        } else if (row?.sqfsDm == '2') {
          setYssqbz(true);
        }
      }
      if (row?.sqfsDm != '1' && row?.tjrqqmc && row?.tjrqzmc) {
        form.setFieldsValue({"sqyxq": [moment(row?.tjrqqmc, 'YYYY-MM-DD'), moment(row?.tjrqzmc, 'YYYY-MM-DD')]});
      }
      //登录验证标志
      form.setFieldsValue(row);
    }
  };

  const close = () => {
    form.resetFields();
    setEdiybz(false);
    setModalVisible(false);
    setMainRef({});
    setDlyzbzCheck(false);
    setYxbzCheck(true);
    setApijcbzCheck(false);
    setYmjcbzCheck(false);
    setApijcdsfbz(false);
    setYmjcdsfbz(false);
    setYssqbz(false);
    setSqyxqbz(false);
    form.setFieldsValue({"sqyxq": []});
    form.setFieldsValue({"syys": ''});
    form.setFieldsValue({"zsys": ''});
  }
  const save = async () => {
    const formValues = await form.validateFields();
    const sqfsDm = formValues?.sqfsDm;
    const sqyxq = formValues?.sqyxq;
    const syys = formValues?.syys;
    const zsys = formValues?.zsys;
    let tjrqqmc;
    let tjrqzmc;
    if (sqfsDm == '2') {
      if (!sqyxq || sqyxq.length != 2) {
        message.error('授权方式为“日期授权”时，授权有效期不能为空');
        return;
      } else {
        tjrqqmc = myUtil.date.formatDate(sqyxq[0], 'YYYY-MM-DD');
        tjrqzmc = myUtil.date.formatDate(sqyxq[1], 'YYYY-MM-DD');
      }
    } else if (sqfsDm == '3') {
      if (!sqyxq || sqyxq.length != 2) {
        message.error('授权方式为“日期授权”时，授权有效期不能为空');
        return;
      } else {
        tjrqqmc = myUtil.date.formatDate(sqyxq[0], 'YYYY-MM-DD');
        tjrqzmc = myUtil.date.formatDate(sqyxq[1], 'YYYY-MM-DD');
      }
      if (syys === null || syys === undefined || !zsys || zsys == 0) {
        message.error('授权方式为“月数授权”时，“试用月数”不能为空，“正式月数”不能为空或0');
        return;
      }
    }
    const data = {
      "qdDm": formValues.qdDm,
      "qdmc": formValues.qdmc,
      "dlyzbz": dlyzbzCheck ? 'Y' : 'N',
      "yxbz": yxbzCheck ? 'Y' : 'N',
      "apijcbz": apijcbzCheck ? 'Y' : 'N',
      "ymjcbz": ymjcbzCheck ? 'Y' : 'N',
      "apijcdsfbz": apijcdsfbz ? 'Y' : 'N',
      "ymjcdsfbz": ymjcdsfbz ? 'Y' : 'N',
      "apifwaqyjybz": apifwaqyjybz ? 'Y' : 'N',
      "zdsqbz": zdsqbz ? 'Y' : 'N',
      "mrQxzDm": formValues.mrQxzDm,
      "sqfsDm": sqfsDm,
      "tjrqqmc": tjrqqmc,
      "tjrqzmc": tjrqzmc,
      "syys": syys,
      "zsys": zsys,
      "editbz": ediybz ? 'Y' : 'N'
    };
    setMasker(true);
    await xzHxgQd(data).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        message.success('保存成功！');
        mainRef.unitRef.current!.reload2();
        close();
      } else {
        message.error(response.msg);
      }
    })
  }

  const renderTreeNodes = (data: any) =>
    data.map((item: JSX.IntrinsicAttributes & TreeNodeProps & { children?: React.ReactNode; }) => {
      if (item.children) {
        item.disabled = true;
        return (
          <TreeSelect.TreeNode key={item.id} title={item.title} value={item.id}>
            {renderTreeNodes(item.children)}
          </TreeSelect.TreeNode>
        );
      }
      return <TreeSelect.TreeNode {...item} key={item.id} title={item.title} value={item.id}/>;
    });


  //登录验证标志
  const onChangeDlyzbzCheck = (data: any) => {
    setDlyzbzCheck(data);
  }
  //有效标志
  const onChangeYxbzCheck = (data: any) => {
    setYxbzCheck(data);
  }
  //API集成标志
  const onChangeApijcbzCheck = (data: any) => {
    setApijcbzCheck(data);
  }
  //页面集成标志
  const onChangeYmjcbzCheck = (data: any) => {
    setYmjcbzCheck(data);
  }

  //API集成标志333
  const onChange3ApijcbzCheck = (data: any) => {
    setApijcdsfbz(data);
  }

  //API集成标志333
  const onChange3YmjcdsfbzCheck = (data: any) => {
    setYmjcdsfbz(data);
  }
  const onChange3Apifwaqyjybz = (data: any) => {
    setApifwaqyjybz(data);
  }
  const onChange3Zdsqbz = (data: any) => {
    setZdsqbz(data);
  }

  // 汇率规则选择
  const onSqfsChange = async () => {
    let values = await form.getFieldsValue();
    if (values?.sqfsDm == '1') {
      form.setFieldsValue({"sqyxq": []});
      form.setFieldsValue({"syys": ''});
      form.setFieldsValue({"zsys": ''});
      setSqyxqbz(true);
      setYssqbz(true);
    } else if (values?.sqfsDm == '3') {
      setYssqbz(false);
      setSqyxqbz(false);
    } else {
      form.setFieldsValue({"syys": ''});
      form.setFieldsValue({"zsys": ''});
      setYssqbz(true);
      setSqyxqbz(false);
    }
  };

  return (
    <Modal
      title={title}
      destroyOnClose={true}
      visible={modalVisible}
      width={pro.c_modal_width_x2}
      footer={<>
        <Button onClick={() => close()}>取消</Button>
        <Button onClick={save} type="primary">确定</Button>
      </>}
      onCancel={() => close()}
      maskClosable={false}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Form form={form}>
          <Form.Item labelCol={{span: 6}} wrapperCol={{span: 14}}
                     rules={[{required: true, message: '请输入渠道代码'}, baseValidator.range2({min: 0, max: 15})]} label="渠道代码" name="qdDm">
            <Input disabled={yhlx == '13' || ediybz}/>
          </Form.Item>
          <Form.Item labelCol={{span: 6}} wrapperCol={{span: 14}}
                     rules={[{required: true, message: '请输入渠道名称'}, baseValidator.range2({min: 0, max: 30})]} label="渠道名称" name="qdmc">
            <Input disabled={yhlx == '13'}/>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item labelCol={{span: 12}} wrapperCol={{span: 12}} label="有效标志" name="yxbz">
                <Switch onChange={onChangeYxbzCheck} checked={yxbzCheck} disabled={yhlx == '13'}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelCol={{span: 12}} wrapperCol={{span: 12}} label="登录验证标志" name="dlyzbz">
                <Switch onChange={onChangeDlyzbzCheck} checked={dlyzbzCheck} disabled={yhlx == '13'}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item labelCol={{span: 12}} wrapperCol={{span: 12}} label="API集成标志" name="apijcbz">
                <Switch onChange={onChangeApijcbzCheck} checked={apijcbzCheck} disabled={yhlx == '13'}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelCol={{span: 12}} wrapperCol={{span: 12}} label="页面集成标志" name="ymjcbz">
                <Switch onChange={onChangeYmjcbzCheck} checked={ymjcbzCheck} disabled={yhlx == '13'}/>
              </Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item labelCol={{span: 12}} wrapperCol={{span: 12}} label="接入三方API标志" name="apijcdsfbz">
                <Switch onChange={onChange3ApijcbzCheck} checked={apijcdsfbz} disabled={yhlx == '13'}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelCol={{span: 12}} wrapperCol={{span: 12}} label="接入三方集成标志" name="ymjcdsfbz">
                <Switch onChange={onChange3YmjcdsfbzCheck} checked={ymjcdsfbz} disabled={yhlx == '13'}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item labelCol={{span: 12}} wrapperCol={{span: 12}} label="授权API服务到企业" name="apifwaqyjybz">
                <Switch onChange={onChange3Apifwaqyjybz} checked={apifwaqyjybz} disabled={yhlx == '13'}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelCol={{span: 12}} wrapperCol={{span: 12}} label="三方服务自动授权标志" name="zdsqbz">
                <Switch onChange={onChange3Zdsqbz} checked={zdsqbz}/>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item labelCol={{span: 6}} wrapperCol={{span: 14}} name="sqfsDm" label="授权方式" rules={[ yhlx == '13' ? {required: true, message: '请选择授权方式'} : {},]}>
            <Radio.Group onChange={onSqfsChange} disabled={yhlx != '13'}>
              <Radio value='1'>人工授权</Radio>
              <Radio value='2'>日期授权</Radio>
              <Radio value='3'>月数授权</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item labelCol={{span: 6}} wrapperCol={{span: 14}} name="sqyxq" label="授权有效期">
            <DatePicker.RangePicker locale={locale} format={myUtil.date.formatList()} disabled={sqyxqbz}/>
          </Form.Item>
          <Form.Item labelCol={{span: 6}} wrapperCol={{span: 14}}
                     rules={[baseValidator.zzsOr0(), baseValidator.range2({min: 0, max: 3})]} label="试用月数" name="syys">
            <Input disabled={yssqbz}/>
          </Form.Item>
          <Form.Item labelCol={{span: 6}} wrapperCol={{span: 14}}
                     rules={[baseValidator.zzs(), baseValidator.range2({min: 0, max: 3})]} label="正式月数" name="zsys">
            <Input disabled={yssqbz}/>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default Add;
