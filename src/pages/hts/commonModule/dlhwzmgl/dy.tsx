import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Button, Form, Space, Input, message, Checkbox, DatePicker, Radio, Tooltip, Spin, Modal, Col, Upload, Badge, Select } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import myUtil from '@/components/DDAssist/util';
import cktsUtil from '@/pages/hts/cktsUtil';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
}

const Index: React.FC<DDModalGridProps> = ({
  onRef,
}) => {

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  //下载按钮是否显示
  const [paramList, setParamList] = useState();
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const [bgdsxbz, setBgdsxbz] = useState(false);
  const [rqsxbz, setRqsxbz] = useState(true);
  const [ssqbz, setSsqbz] = useState(true);
  const [pxgz, setPxgz] = useState("ckrq1");


  // 开启
  const showModal = (param: any,) => {
    //开启页面
    setModalVisible(true);
    setParamList(param);
    const rows = param?.selectionRows;
    if(rows.length > 0){
      var arr = new Array();
      let j=0;
      for(let i=0;i<rows.length ;i++){
        if(arr.indexOf(rows[i].dlckhwzmhm.substr(0,18)) == -1){
          arr[j] = rows[i].dlckhwzmhm.substr(0,18);
          j++;
        }
      }
      form.setFieldsValue({'bgdhs':arr.toString()});
    }

  };

  useEffect(() => {
    const promiseArr: any = [];
    promiseArr.push();

    setMasker(true);
    Promise.all(promiseArr).then().catch(() => {
    }).finally(() => {
      setMasker(false);
    });
  }, []);


  const handlerXzfsChange = (e: any) => {
    if (e.target.value === 'bgdhs') {
      setBgdsxbz(false);
      setRqsxbz(true);
      setSsqbz(true);
    }
    else if (e.target.value === 'ckrq1') {
      setBgdsxbz(true);
      setRqsxbz(false);
      setSsqbz(true);
    } else {
      setBgdsxbz(true);
      setRqsxbz(true);
      setSsqbz(false);
    }
  }

  const pxgzOnchange = (e: any) => {
    setPxgz(e);
  }

  const save = async () => {
    const value = await form.validateFields();
    const param = {};
    if(value?.dylx=='bgdhs') {
      param.dylx = 'dlzmhs';
      param.dlzmhs = value.bgdhs;
    }else if(value?.dylx=='ckrq1'){
      const time1 = moment(value.ckrq1[0]).format('yyyy-MM-DD');
      const time2 = moment(value.ckrq1[1]).format('yyyy-MM-DD');
      param.dylx = value?.dylx;
      param.ckrq1Q = time1;
      param.ckrq1Z = time2;
      // param.pxgz = pxgz;
    }else{
      param.dylx = value?.dylx;
      if(cktsUtil.sys.enterpriseType() === "WM"){
        const ssqpc = value?.ssq;
        param.ssq = ssqpc?.substr(0,6);
        param.sbpc = ssqpc?.substr(6,3);
      }else{
        param.ssq = value?.ssq;
      }
    }
    const url = '/hx/ty/report/pdfInZipExportGet/PDF_REPORT_SJGLSAAS_HGSJCX_STFYKJDLCKZMCX/';  
    setMasker(true);
    await cktsUtil.downloadFileCkts(url, param);
    setMasker(false);
    close();
  }

  const close = () => {
    form.setFieldsValue({bgdhs:'',ckrq1:'',ssq:'',ssqpc:'',dylx:'bgdhs'});
    setBgdsxbz(false);
    setRqsxbz(true);
    setSsqbz(true);
    setModalVisible(false)
  }


  const ms = "请输入18位代理证明号,多条数据以英文" + "," + "隔开";
  return (
    <Modal
      title="打印"
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X2}
      onCancel={() => close()}
      footer={(<>
        <Button onClick={() => save()} type="primary">确定</Button>
        <Button onClick={() => close()} type="default">关闭</Button>
      </>)}
    >   
     <Spin tip="Loading..." spinning={masker} delay={100}>

      <ProCard split="horizontal" className="dd_layout_form_01 dd_hgsjxzjy" >
        <Form
          form={form}
          name="form"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
        >
          <Form.Item name="dylx" initialValue={'bgdhs'} style={{marginLeft: '140px'}}>
            <Radio.Group  onChange={handlerXzfsChange}>
              <Space direction="vertical">
                <Radio key={'xzfs_abgd'} value={'bgdhs'} style={{height: 60}}>按代理证明号打印
                  <Form.Item name="bgdhs" rules={[
                    () => ({
                      validator(_, value) {
                        if (value) {
                          form.setFieldsValue({ bah: value.toUpperCase() });
                        } else {
                          if (!bgdsxbz) {
                            return Promise.reject(new Error('代理证明号为必填项不能为空。'));
                          }
                        }
                        return Promise.resolve();
                      },
                    })
                  ]}>
                    <Input placeholder={ms} style={{ width: 360 }} disabled={bgdsxbz} />
                  </Form.Item>
                </Radio>
                <Radio key={'xzfs_arq'} value={'ckrq1'}>按出口日期打印
                  <Form.Item name='ckrq1' key="4" rules={[
                    () => ({
                      validator(_, value) {
                        if(value){
                          if (value.length === 2) {
                            if (value[0].diff(value[1], 'years') > 4 || value[1].diff(value[0], 'years') > 4) {
                              return Promise.reject(new Error('数据下载最大下载时间范围是5年'));
                            }
                            if (value[0].diff(moment('2014-01-01', 'YYYY-MM-DD'), 'days') < 0) {
                              return Promise.reject(new Error('数据下载时间范围开始时间不能小于2014-01-01'));
                            }
                            return Promise.resolve();
                          }
                        }else{
                          if (!rqsxbz) {
                            return Promise.reject(new Error('按出口日期为必填项不能为空。'));
                          }
                        }
                       
                        return Promise.resolve();
                      },
                    })
                  ]} >
                    <DatePicker.RangePicker style={{ width: 360 }}
                      allowClear={false}
                      format={myUtil.date.formatList()}
                      disabled={rqsxbz}
                    />
                  </Form.Item>
                    {/* <Select  onChange={pxgzOnchange} disabled={rqsxbz} defaultValue="ckrq1" options={[
                      {
                        value: 'ckrq1',
                        label: '按出口日期排序',
                      },
                      {
                        value: 'ckfph',
                        label: '按出口发票号排序',
                      }]} onClick={(e)=>{e.preventDefault();e.stopPropagation();}}>
                    
                    </Select> */}
                </Radio>
                {/* <Radio key={'xzfs_assq'} value={'ssq'} style={{marginTop: '10px'}}>按所属期打印
                  
                  {cktsUtil.sys.enterpriseType() === "WM" ?
                    <Form.Item name="ssq" rules={[
                      ssqbz?{}:
                      { required: true, message: '请输入所属期批次' },
                    () => ({
                      validator(_, value) {
                        if (value) {
                          const temp1 = (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)); // YYYYMM
                          const temp2 = (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])\d{3}$/)); // YYYYMM001
                          if (value.length < 9) {
                              return Promise.reject(new Error('请输入正确的所属期格式'));
                          } else {
                            if (temp2) {
                              return Promise.reject(new Error('请输入正确的所属期批次格式'));
                            } else {
                              return Promise.resolve();
                            }
                          }
                        }
                        return Promise.resolve();
                      },
                    })
                    ]} >
                      <Input placeholder="请输入9位所属期批次" style={{ width: 360 }} disabled={ssqbz}></Input>
                    </Form.Item>
                    :
                    <Form.Item name="ssq" rules={[ ssqbz?{}:
                      { required: true, message: '请输入所属期' },
                    () => ({
                      validator(_, value) {
                        if (value) {
                          const temp1 = (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)); // YYYYMM
                          if (temp1) {
                            return Promise.reject(new Error('请输入正确的所属期格式'));
                          }
                          return Promise.resolve();
                        }
                        return Promise.resolve();
                      },
                    })
                    ]}>
                      <Input placeholder="请输入6位所属期" style={{ width: 360 }} disabled={ssqbz} ></Input>
                    </Form.Item>}
                </Radio> */}
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
      </ProCard>
      </Spin>
    </Modal>
  );
};

export default Index;
