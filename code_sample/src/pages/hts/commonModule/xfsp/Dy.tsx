import {Spin, Form, Modal, Radio, DatePicker, Input, Button, message, Progress} from 'antd';
import React, {useState, useImperativeHandle} from 'react';
import pro from '@/pages/common/proConfig';
import myUtil from '@/pages/common/myUtil';
import {xfspldy, xfspldyjy} from '@/services/hts/api';

export type LoginCompanyProps = {
  onRef?: any;
  doSubmit?: any;
}

const LoginCompany: React.FC<LoginCompanyProps> = ({
                                                     onRef,
                                                     doSubmit,
                                                   }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [masker, setMasker] = useState(false);
  const [dis, setDis] = useState<any>();
  const [searchModel, setSearchModel] = useState<any>([]);
  const [form] = Form.useForm();
  const [percentNum, setPercentNum] = useState(0);
  const [modalVisibleXz, setModalVisibleXz] = useState<boolean>(false);

  // 开启
  const showModal = (param: any) => {
    myUtil.sessionStore.setItem('numTimeXfsfp', 0);
    const {unitRef, gridRef} = param;
    const rows = param?.selectionRows;
    if(rows.length > 0){
      var arr = new Array();
      let j=0;
      for(let i=0;i<rows.length ;i++){
        if(arr.indexOf(rows[i].ssjkshm) == -1){
          arr[j] = rows[i].ssjkshm;
          j++;
        }
      }
      form.setFieldsValue({'ssjkshms':arr.toString()});
    }
    const searchModel = unitRef.current?.getGridParams().searchModel || [];
    const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
    const initSearchModel = unitRef.current.getGridParams().initSearchModal || [];
    let allSearchModel: any = searchModel.concat([...headerSearchModel, ...initSearchModel]);
    setSearchModel(allSearchModel);
    setModalVisible(true);
    form.setFieldsValue({sjfwlx: 1, pxgz: '01'});
    setDis(1);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const onchangeRadio = (param: any) => {
    const val = param.target.value;
    setDis(val);
    if (val == 1) {
      form.setFieldsValue({pxgz: '01', ssjkshms: "", tfrq: "", ssqPc: ""});
    } else if (val == 2) {
      form.setFieldsValue({pxgz: '01', ssjkshms: "", tfrq: "", ssqPc: ""});
    } else if (val == 3) {
      form.setFieldsValue({pxgz: '02', ssjkshms: "", tfrq: "", ssqPc: ""});
    } else if (val == 4) {
      form.setFieldsValue({pxgz: '01', ssjkshms: "", tfrq: "", ssqPc: ""});
    }
  }

  const handleSave = async () => {
    const param = await form.validateFields();
    const obj = {sjfwlx: param.sjfwlx, pxgz: param.pxgz};
    if (param.sjfwlx == '1') {
      obj.ssjkshms = param.ssjkshms;
    }
    if (param.sjfwlx == '2') {
      obj.tfrqQ = param.tfrq[0].format('YYYY-MM-DD');
      obj.tfrqZ = param.tfrq[1].format('YYYY-MM-DD');
    }
    if (param.sjfwlx == '3') {
      if (param.ssqPc.length == 9) {
        obj.ssq = param.ssqPc.substring(0, 6);
        obj.sbpc = param.ssqPc.substring(6);
      } else {
        obj.ssq = param.ssqPc;
      }
    }
    if (param.sjfwlx == '4') {
      obj.searchModels = searchModel;
    }
    setMasker(true);
    xfspldyjy(obj).then((response2: any) => {
      setMasker(false);
      if (response2.code == '200') {
        // 设置间隔为2000毫秒（2秒）
        let doTime = setInterval(function () {
          // 进度条
          // 1秒10条
          setModalVisibleXz(true);
          let timeNum = myUtil.sessionStore.getItem('numTimeXfsfp');
          if (timeNum != 99) {
            timeNum = timeNum + 1;
            myUtil.sessionStore.setItem('numTimeXfsfp', timeNum);
            setPercentNum(timeNum);
          }
        }, 2000);
        xfspldy(response2.body).then((response: any) => {
          clearInterval(doTime);
          setPercentNum(0);
          setModalVisibleXz(false);
          setMasker(false);
          const {code, msg} = response;
          if (code === '200') {
            handleOk(response.body.filePath, response.body.fileName);
            closeModal();
          } else {
            message.error(msg);
          }
        })
      } else {
        message.error(response2.msg);
      }
    });

  }

  const handleOk = (filePath: any, fileName: any) => {
    let a = document.createElement('a');//创建一个a标签元素
    a.style.display = 'none';//设置元素不可见
    a.href = filePath;
    a.download = fileName;
    document.body.appendChild(a);//加入
    a.click(); //触发点击,下载
    document.body.removeChild(a);//释放
  }

  const closeModal = () => {
    setModalVisible(false);
    form.setFieldsValue({pxgz: '01', ssjkshms: "", tfrq: "", ssqPc: "", sjfwlx: 1});
    setPercentNum(0);
  }

  return (
    <>
      <Modal
        title='打印'
        okText="保存"
        visible={modalVisible}
        width={pro.c_modal_width_x2}
        footer={<>
          <Button onClick={closeModal}>取消</Button>
          <Button onClick={handleSave} type="primary">确认</Button>
        </>}
        onCancel={closeModal}
        maskClosable={false}
        destroyOnClose
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <Form form={form}>
            <div style={{backgroundColor: '#f1f4f7', padding: "0 10px", lineHeight: '32px', margin: '0 0 20px 0'}}>1、选择打印数据范围</div>
            <Form.Item name="sjfwlx">
              <Radio.Group onChange={onchangeRadio}>
                <Radio value={1}>缴款书号码</Radio>
                <Radio value={2}>按填发日期打印</Radio>
                <Radio value={3}>按所属期批次打印</Radio>
                <Radio value={4}>按当前筛选数据打印</Radio>
              </Radio.Group>
            </Form.Item>
            {dis == 1 ?
              <Form.Item name="ssjkshms" rules={dis == 1 ? [{required: true, message: '请输入缴款书号码'}] : []}>
                <Input placeholder="请输入缴款书号码，多条数据以英文逗号隔开"/>
              </Form.Item> :
              <></>
            }
            {
              dis == 2 ? <Form.Item name="tfrq" rules={dis == 2 ? [
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject(new Error('请选择填发日期！'));
                      } else {
                        if (value[1].diff(value[0], 'months') > 1) {
                          return Promise.reject(new Error('选择区间不能大于1个月'));
                        } else if (value[1].diff(value[0], 'months') === 1) {
                          if (!myUtil.date.compareTime(1, value[0].format('YYYY-MM-DD'), value[1].format('YYYY-MM-DD'))) {
                            return Promise.reject(new Error('选择区间不能大于1个月'));
                          }
                        }
                      }
                      return Promise.resolve();
                    },
                  })
                ] : []}>
                  <DatePicker.RangePicker placeholder={['填发日期起', '填发日期止']}/>
                </Form.Item> :
                <></>
            }
            {
              dis == 3 ? <Form.Item name="ssqPc" rules={dis == 3 ? [
                  () => ({
                    validator(_, value) {
                      if (value) {
                        const temp2 = (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])\d{3}$/)); // YYYYMM001
                        if (value.length < 9) {
                          return Promise.reject(new Error('请输入正确的所属期批次格式'));
                        } else {
                          if (temp2) {
                            return Promise.reject(new Error('请输入正确的所属期批次格式'));
                          } else {
                            return Promise.resolve();
                          }
                        }
                      } else {
                        return Promise.reject(new Error('请输入所属期批次'));
                      }
                    },
                  })
                ] : []}>
                  <Input placeholder="请输入9位所属期批次，例202401001"/>
                </Form.Item> :
                <></>
            }
            {
              dis == 4 ?
                <Form.Item name="e1">
                  <Input disabled={true}/>
                </Form.Item> :
                <></>
            }
          </Form>
        </Spin>
      </Modal>
      <Modal
        title="下载进度"
        visible={modalVisibleXz}
        width={pro.c_modal_width_x1}
        closable={false}
        keyboard={false}
        maskClosable={false}
        zIndex={1001}
        style={{marginTop: '40px'}}
      >
        <>
          <div>生成打印文件进度：{percentNum}%</div>
          <Progress percent={percentNum}/>
        </>
      </Modal>
    </>
  );
};

export default LoginCompany;
