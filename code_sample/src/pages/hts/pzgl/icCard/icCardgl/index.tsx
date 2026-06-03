
import React, { useState, useEffect } from 'react';
import { Spin, Row, Col, Card, Button, Badge, Tooltip, message, Modal, Form } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import cardStyle02 from './cardLess.less';
import './cardLess.less';
import pro from '@/pages/common/proConfig';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import { itemType } from '@/components/DDForm/data.d';
import baseValidator from '@/pages/common/field/baseValidator';
import { queryKak, saveOrUpdateKak,deleteKak } from '@/services/hts/api';
import { history } from 'umi';

const Index: React.FC<{ data: any }> = ({
  data
}) => {
  const [masker, setMasker] = useState(false);
  const [pdata, setPdata] = useState<any>([]);
  const [frcrrd, setFrcrrd] = useState<any>(false);
  const [addflag,setAddflag] = useState<any>('1');
  // 新增按钮开关
  const [addModalVisible, setAddModalVisible] = useState(false);
  // 新增按钮form 
  const [addform] = Form.useForm();

  useEffect(() => {
    if(history.location.search){
      setTimeout( function(){
        const inputEle1: any = document.querySelector("#bgdscmx_form_kakmm");
        inputEle1?.removeAttribute('readonly');
      }, 500);
      setAddModalVisible(true);
    };
    queryKakxx({});
  }, [data]);


  //查询口岸卡
  const queryKakxx = (param: any) => {
    setMasker(true);
    setFrcrrd(false);
    queryKak(param).then((res: any) => {
      const { code, msg, body } = res;
      if (code === '200') {
        setPdata(body);
        setMasker(false);
        for(let i=0;i<body.length;i++){
          if(body[i].kaklxDm == '2'){
            setFrcrrd(true);
          }
        }
      } else {
        message.error(msg);
        setMasker(false);
      }
      setMasker(false);
    });
  }


  // 表单项: 新增表单项
  const getFormItemsCreateAdd = (param :any) => {
    const formItems = [];
    formItems.push({ name: 'groupTitle1', type: itemType.GroupTitle, label: 'IC卡信息' });
    if(param =='1'){
      const lx = addform.getFieldValue('kaklxDm');
      if(lx =='2'){
        formItems.push({
          name: 'kaklxDm', type: itemType.Select, label: 'IC卡类型', rules: [{ type: 'base_required' }], validator: [
            baseValidator.required(),
          ],
          list: [
            { value: "2", name: "法人卡"},
            { value: "1", name: "操作员卡" },
          ]
        });
      }else{
        formItems.push({
          name: 'kaklxDm', type: itemType.Select, label: 'IC卡类型', rules: [{ type: 'base_required' }], validator: [
            baseValidator.required(),
          ],
          list: [
            { value: "1", name: "操作员卡" },
          ]
        });
      }
    }else{
      formItems.push({
        name: 'kaklxDm', type: itemType.Select, label: 'IC卡类型', rules: [{ type: 'base_required' }], validator: [
          baseValidator.required(),
        ],
        list: [
          { value: "2", name: "法人卡"},
          { value: "1", name: "操作员卡" },
        ]
      });
    }
    formItems.push({
      name: 'kakbm', type: itemType.Input, label: 'IC卡别名', rules: [{ type: 'base_required' }], validator: [
        baseValidator.required(),
        baseValidator.range2({ min: 0, max: 60 }) 
      ]
    });

    if(addflag === '1') {
      formItems.push({
        name: 'kakmm', type: itemType.Password, label: 'IC卡密码', readOnly: true, rules: [{ type: 'base_required' }], validator: [
          baseValidator.required(),
          baseValidator.range2({ min: 8, max: 8 })
        ]
      });
    } else {
      formItems.push({
        name: 'kakmm', type: itemType.Password, label: 'IC卡密码', rules: [{ type: 'base_required' }], validator: [
          baseValidator.required(),
          baseValidator.range2({ min: 8, max: 8 })
        ]
      });
    }

    formItems.push({ name: 'kakuuid', type: itemType.Hidden, label: 'IC卡信息' });
    return formItems;
  }

  // 新增
  const add = () => {
    setAddflag('1');
    addform.setFieldsValue({ kakbm: '', kakmm: ''});
    setTimeout( function(){
      const inputEle1: any = document.querySelector("#bgdscmx_form_kakmm");
      inputEle1?.removeAttribute('readonly');
    }, 500);
    setAddModalVisible(true);
  }

  // 关闭新增页面
  const close = () => {
    setAddModalVisible(false);
    // addform.setFieldsValue({ kaklxDm: '', kakbm: '', kakmm: '' });
  }


  // 新增保存
  const addsave = async () => {
    const values = await addform.validateFields();
    setMasker(true);
    saveOrUpdateKak(values).then((res: any) => {
      const { code, msg, } = res;
      if (code === '200') {
        setAddModalVisible(false);
        queryKakxx({});
        close();
        if(addflag =='1'){
          message.success('保存成功！');
        }else{
          message.success('修改成功！');
        }
        setMasker(false);
      } else {
        message.error(msg);
        setMasker(false);
      }
      setMasker(false);
    });
  }

  //删除口岸卡
  const del = (param: any) => {
    const param2=  {"kakuuids":[param]}
    setMasker(true);
    deleteKak(param2).then((res: any) => {
      const { code, msg, } = res;
      if (code === '200') {
        queryKakxx({});
        message.success('删除成功！');
        setMasker(false);
      } else {
        message.error(msg);
        setMasker(false);
      }
      setMasker(false);
    });
  }

  //口岸卡日志查询
  const selRz = (param: any) => {
    const search = encodeURI(param); // 转码
    history.push('/hts/pzgl/icCard/icCardrz?kakbm=' + search);
  }
  
  //口岸卡修改
  const edit = (param: any) => {
    addform.setFieldsValue({ kaklxDm: param?.kaklxDm, kakbm: param?.kakbm, kakmm: param?.kakmm ,kakuuid: param?.kakuuid});
    setAddflag('2');
    setAddModalVisible(true);
  }
  return <>
    <Spin tip="Loading..." spinning={masker} delay={100}>

      <Row gutter={[16, 16]} >
        {
          pdata.map((item: any) => (
            <Col className="gutter-row" span={6}>
              <Card
                style={{ height: 180 }}
                actions={[
                  <Button type="link" block onClick={() => edit(item)}>修改</Button>,
                  <Button type="link" block onClick={() => del(item.kakuuid)}>刪除</Button>,
                  <Button type="link" block onClick={() => selRz(item.kakbm)}>查看日志</Button>,
                ]}
              >
                <Card.Meta
                  avatar={<div className={cardStyle02.cardAvatar}></div>}
                  title={item.kakbm}
                  description={<>
                    <div>{item.kaklxDm == '1' ? '操作员卡' : '法人卡'}</div>
                    {item.sdbz == 'Y' ? <div><Badge status="error" />已禁用&nbsp;<Tooltip title="请进行工具检测"><ExclamationCircleOutlined /></Tooltip></div>
                      : <div>&nbsp;</div>}
                  </>}
                />
              </Card>
            </Col>
          ))
        }
        <Col className="gutter-row" span={6}>
          <Card style={{ height: 180, textAlign: 'center', color: '#0854A0' }} >
            <PlusOutlined style={{ fontSize: '74px', marginTop: '10px' }} onClick={() => { add() }} />
            <div style={{ fontSize: '22px', color: '#0854A0' }}>新增</div>
          </Card>
        </Col>
      </Row>
    </Spin>
    <Modal
      title={addflag=='1'?'新增海关IC卡':'修改海关IC卡'}
      keyboard={false}
      visible={addModalVisible}
      width={pro.c_modal_width_x4}
      wrapClassName='standard-modal-1'
      destroyOnClose={true}
      onCancel={close}
      footer={
        <>
          <Button key="close" onClick={close} >
            关闭
          </Button>
          <Button key="save" type="primary" onClick={addsave} >
            保存
          </Button>
        </>
      }
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
       {frcrrd?  <DDBaseForm items={getFormItemsCreateAdd('1')} form={addform} name="bgdscmx_form" />
       :<DDBaseForm items={getFormItemsCreateAdd('2')} form={addform} name="bgdscmx_form" />}
      </Spin>

    </Modal>
  </>;
};

export default Index;