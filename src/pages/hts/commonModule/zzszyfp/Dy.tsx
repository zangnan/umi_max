import { Spin, Form, Modal, Radio, DatePicker, Input, Button, message, Progress } from 'antd';
import React, { useState, useImperativeHandle } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import { pldy, pldyjy, tszljydc } from '@/pages/hts/services/htsApi';
import DDBaseGrid from '@/components/DDBaseGrid';
import { history, } from 'umi';

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
  const [initSearchModal, setInitSearchModal] = useState<any>([]);
  const [modalVisible2, setModalVisible2] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [gridData, setGridData] = useState<any>([]);
  const [max, setMax] = useState<any>();
  const [min, setMin] = useState<any>();
  const [percentNum, setPercentNum] = useState(0);
  const [modalVisibleXz, setModalVisibleXz] = useState<boolean>(false);
  const [cdDm, setCdDm] = useState<any>();


  // 开启
  const showModal = (param: any) => {
    myUtil.sessionStore.setItem('numTimeJxfp', 0);
    const { refUnit, gridRef} = param;

    const searchModel = refUnit.current?.getGridParams().searchModel || [];
    const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
    const initSearchModel = refUnit.current.getGridParams().initSearchModal || [];
    let allSearchModel: any = searchModel.concat([...headerSearchModel,...initSearchModel]);
    setSearchModel(allSearchModel);

    setModalVisible(true);
    form.setFieldsValue({ sjfwlx: 1, pxgz: '01' });
    setDis(1);
    setCdDm(param?.unit_key === 'CX_SAAS_SJGL_JXFPSJCX_ZZSFPDZSJCX_FPXX' ? 'JXFP_020602' : 'JXFP_020601');
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
      form.setFieldsValue({ pxgz: '01', fphms: "", kprq: "", ssqPc: "" });
    } else if (val == 2) {
      form.setFieldsValue({ pxgz: '01', fphms: "", kprq: "", ssqPc: "" });
    } else if (val == 3) {
      form.setFieldsValue({ pxgz: '02', fphms: "", kprq: "", ssqPc: "" });
    } else if (val == 4) {
      form.setFieldsValue({ pxgz: '01', fphms: "", kprq: "", ssqPc: "" });
    }
  }


  const handleSave = async () => {
    const param = await form.validateFields();
    const obj = { sjfwlx: param.sjfwlx, pxgz: param.pxgz };
    if (param.sjfwlx == '1') {
      obj.fphms = param.fphms;
    }
    if (param.sjfwlx == '2') {
      obj.kprqQ = param.kprq[0].format('YYYY-MM-DD');
      obj.kprqZ = param.kprq[1].format('YYYY-MM-DD');
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
      obj.cdDm = cdDm;
      obj.searchModels = searchModel;
      // obj.initSearchModals = initSearchModal;
    }
    setMasker(true);
    pldyjy(obj).then((response2: any) => {

      setMasker(false);
      if (response2.code == '200') {
     // 设置间隔为2000毫秒（2秒）
      let doTime = setInterval(function () {
        // 进度条
        // 1秒10条
        setModalVisibleXz(true);
        let timeNum = myUtil.sessionStore.getItem('numTimeJxfp');
        if (timeNum != 99) {
          timeNum = timeNum + 1;
          myUtil.sessionStore.setItem('numTimeJxfp', timeNum);
          setPercentNum(timeNum);
          console.log('++');
        }
      }, 2000);
        pldy(response2.body).then((response: any) => {
          clearInterval(doTime);
          setPercentNum(0);
          setModalVisibleXz(false);
          setMasker(false);
          const { code, msg } = response;
          if (code === '200') {
            // message.success('保存成功！');
            handleOk(response.body.filePath, response.body.fileName);
            closeModal();
          } else {
            message.error(msg);
          }
        })
      } else if (response2.code === '900') {
        setGridData(response2.body);
        const numbers: any[] = [];
        response2.body?.forEach((element: any) => {
          numbers.push(element.kprqdc);
        });
        setMax(Math.max(...numbers));
        setMin(Math.min(...numbers));
        setModalVisible2(true);
      } else {
        message.error(response2.msg);
      }
    });

  }


  const downloadExcel = () => {
    const params = {
      dcList: gridData,
    }
    setMasker(true);
    tszljydc(params).then((res1) => {
      setMasker(false);
      if (res1.code == '200') {
        closeModal2();
        myUtil.file.downloadExcel(res1?.body?.blob, res1?.body?.fileName);
      } else {
        message.error(res1.msg);
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
    form.setFieldsValue({ pxgz: '01', fphms: "", kprq: "", ssqPc: "", sjfwlx: 1 });
    setPercentNum(0);
  }

  const closeModal2 = () => {
    setModalVisible2(false);
    setModalVisible(false);
    form.setFieldsValue({ pxgz: '01', fphms: "", kprq: "", ssqPc: "", sjfwlx: 1 });
  }

  const qxz = () => {
    closeModal2();
    history.push({ pathname: '/02/0202/020203', query: { max: max, min: min } });
  }



  // 配置列表列
  const columns = [
    { title: '序号', dataIndex: 'xh', width: 80 },
    // { title: '进货凭证号', dataIndex: 'jhpzh', ellipsis: true },
    { title: '发票号码', dataIndex: 'fphm',  ellipsis: true },
    { title: '发票代码', dataIndex: 'fpDm', width: 180, ellipsis: true },
    { title: '开票日期', dataIndex: 'kprq', width: 150 }
  ];
  // myUtil.date.getMonthLastDay(ckny1)
  return (
    <>
      <Modal
        title='打印'
        okText="保存"
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        footer={<>
          <Button onClick={closeModal}>取消</Button>
          <Button onClick={handleSave} type="primary">确认</Button>
        </>}
        onCancel={closeModal}
        mask={{ closable: false }}
        destroyOnHidden
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <Form form={form}>
            <div style={{ backgroundColor: '#f1f4f7', padding: "0 10px", lineHeight: '32px', margin: '0 0 20px 0' }}>1、选择打印数据范围</div>
            <Form.Item name="sjfwlx" >
              <Radio.Group onChange={onchangeRadio}>
                <Radio value={1}>按发票号打印</Radio>
                <Radio value={2}>按开票日期打印</Radio>
                <Radio value={3}>按所属期批次打印</Radio>
                <Radio value={4}>按当前筛选数据打印</Radio>
              </Radio.Group>
            </Form.Item>
            {dis == 1 ?
              <Form.Item name="fphms" rules={dis == 1 ? [{ required: true, message: '请输入发票号' }] : []}>
                <Input placeholder="请输入发票号，多条数据以英文逗号隔开" />
              </Form.Item> :
              <></>
            }
            {
              dis == 2 ? <Form.Item name="kprq" rules={dis == 2 ? [
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject(new Error('请选择开票日期！'));
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
                <DatePicker.RangePicker placeholder={['开票日期起', '开票日期止']} />
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
                <Input placeholder="请输入9位所属期批次，例202401001" />
              </Form.Item> :
                <></>
            }
            {
              dis == 4 ? <Form.Item name="e1" >
                <Input disabled={true} />
              </Form.Item> :
                <></>
            }
            {/* <div style={{ backgroundColor: '#f1f4f7', padding: "0 10px", lineHeight: '32px', margin: '0 0 20px 0' }}>2、选择打印顺序</div>
            <Form.Item name="pxgz">
              <Radio.Group>
                {
                  dis == 1 || dis == 2 ? <Radio key='1719983987' value='01'>开票日期顺序</Radio> : <></>
                }
                {
                  dis == 3 ? <Radio key='1719983988' value='02'>申报顺序</Radio> : <></>
                }
                {
                  dis == 4 ? <>
                    <Radio key='1719983987' value='01'>开票日期顺序</Radio>
                    <Radio key='1719983989' value='03'>界面显示顺序</Radio>
                  </> : <></>
                }
              </Radio.Group>
            </Form.Item> */}
          </Form>
        </Spin>
      </Modal>
      <Modal
        title='增值税发票文件缺失提醒'
        visible={modalVisible2}
        wrapClassName='standard-modal-1 dd-gpy'
        width={CONSTANTS.C_MODAL_WIDTH_X3}
        footer={<>
          {/* <Button onClick={closeModal2}>取消</Button> */}
          <Button onClick={downloadExcel} type="primary">导出</Button>
          <Button onClick={qxz} type="primary">去下载文件</Button>
        </>}
        onCancel={closeModal2}
        mask={{ closable: false }}
        destroyOnHidden
      >
        <span>以下数电票缺少发票版式文件：</span>
        <DDBaseGrid userDataSource={gridData} columns={columns} pagination={false} />
      </Modal>
      <Modal
        title="下载进度"
        visible={modalVisibleXz}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        closable={false}
        keyboard={false}
        mask={{ closable: false }}
        zIndex={1001}
        style={{ marginTop: '40px' }}
      >
        <>
          <div>生成打印文件进度：{percentNum}%</div>
          <Progress percent={percentNum} />
        </>
      </Modal>
    </>
  );
};

export default LoginCompany;
