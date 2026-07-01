// 固德威 打印
import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Button, Form, Row, Radio, Spin, Modal, Col, DatePicker, Input, Progress, message } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/components/DDAssist/util';
import cktsUtil from '@/pages/hts/cktsUtil';
import './style.less';
import moment from 'moment';
import { queryCkbgdslForDy, pldyBgd } from '@/pages/hts/services/htsApi';
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
  const [paramList, setParamList] = useState({});
  const [listSearchModel, setListSearchModel] = useState([]);
  const [listHeaderSearchModel, setListHeaderSearchModel] = useState([]);
  const [listGridSort, setListGridSort] = useState([]);
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalVisibleXz, setModalVisibleXz] = useState<boolean>(false);
  const [form] = Form.useForm();

  const [showInput, setShowInput] = useState('bgdhs');
  const [showDysx, setShowDysx] = useState(false);
  const [flag, setFlag] = useState('dz'); // dy 单一窗口横版样式 dz 电子口岸竖版样式
  const [percentNum, setPercentNum] = useState(0);
  const [showBtn, setShowBtn] = useState<boolean>(true); // 是否显示进度条确认按钮

  // 开启
  const showModal = (param: any, flag: any) => {
    myUtil.sessionStore.setItem('numTimeBgddy', 0);
    //开启页面
    setModalVisible(true);
    form.setFieldsValue({ dylx: 'bgdhs', ckrq1: '', ssq: '', ssqpc: '', dyfs: '01', pxgz: 'ckrq', bgdhs: '', dcmmgz: getMrDcmmgz() });
    setFlag(flag)
    const { unitRef, gridRef } = param;
    const rows = param?.selectionRows;
    if (rows.length > 0) {
      var arr = new Array();
      let j = 0;
      for (let i = 0; i < rows.length; i++) {
        if (arr.indexOf(rows[i].ckbgdh) == -1) {
          arr[j] = rows[i].ckbgdh;
          j++;
        }
      }
      form.setFieldsValue({ 'bgdhs': arr.toString() });
    }

    // const gridData = unitRef.current?.getGridData()
    // 列表筛选条件
    const obj: any = {}
    const searchModel = unitRef.current.getGridParams().searchModel || []; // 筛选
    setListSearchModel(searchModel);
    const headerSearchModel = gridRef.current?.getHeaderFilter() || []; // 列头筛选
    setListHeaderSearchModel(headerSearchModel);
    const gridSort: any = gridRef.current?.getGridSort() || []; //  排序
    setListGridSort(gridSort)
    headerSearchModel.forEach((element: any) => {
      obj[element.property + 'Arr'] = element.value == undefined ? element.values : element.value;
    });
    searchModel.forEach((element: any) => {
      if (element.op === 'xydy') {
        obj[element.property + 'End'] = element.value == undefined ? element.values : element.value;
      } else if (element.op === 'dydy') {
        obj[element.property + 'Start'] = element.value == undefined ? element.values : element.value;
      } else {
        obj[element.property] = element.value == undefined ? element.values : element.value;
      }
    });
    // 列表排序
    if (gridSort.length > 0) {
      obj.orderField = gridSort[0].field;
      obj.order = gridSort[0].order;
    }
    setParamList(obj);
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


  const save = async () => {
    const values = await form.validateFields();
    setMrDcmmgz(values?.dcmmgz);

    const paramDy = values; // 下载参数
    // 处理日期和所属期批次
    if (values?.dylx == 'ckrq1') {
      const time1 = moment(values.ckrq1[0]).format('yyyy-MM-DD');
      const time2 = moment(values.ckrq1[1]).format('yyyy-MM-DD');
      paramDy.ckrq1Q = time1;
      paramDy.ckrq1Z = time2;
      delete paramDy.ckrq1
    } else if (values?.dylx == 'sbrq') {
      const time1 = moment(values.sbrq[0]).format('yyyy-MM-DD');
      const time2 = moment(values.sbrq[1]).format('yyyy-MM-DD');
      paramDy.sbrqq = time1;
      paramDy.sbrqz = time2;
      delete paramDy.sbrq
    } else if (values?.dylx === 'ssq') {
      if (cktsUtil.sys.enterpriseType() === "WM") {
        const ssqpc = values?.ssqpc;
        paramDy.ssq = ssqpc?.substr(0, 6);
        paramDy.sbpc = ssqpc?.substr(6, 3);
      } else {
        paramDy.ssq = values?.ssq;
      }
    }
    let newSearchModel1: any = [];
    for (let i in paramDy) {
      newSearchModel1.push({ property: i, values: values[i], op: "al" });
    }
    newSearchModel1.push({ property: "jckbzDm", values: "E", op: "xydy" });
    newSearchModel1.push({ property: "cdDm", values: "020301", op: "zdy" });
    if (showInput === 'dqsx') {
      newSearchModel1 = newSearchModel1.concat(listSearchModel);
    }

    const allSearchModel: any = newSearchModel1.concat(listHeaderSearchModel);


    // 如果当前列表筛选 加条件
    // 获得数量的入参
    const paramCount = {
      key: "EXCEL_REPORT_WBSJ_CKBGD",
      searchModel: allSearchModel,
      orderModel: listGridSort,
      headerSearchModel: listHeaderSearchModel,
    }

    if (flag && flag == 'dy') {
      // dy 单一窗口横版样式 dz 电子口岸竖版样式
      paramCount?.searchModel.push({ "property": "bgdpdflx", "value": "DYCK", "op": "zdy" });
    } else {
      // dy 单一窗口横版样式 dz 电子口岸竖版样式
      paramCount?.searchModel.push({ "property": "bgdpdflx", "value": "DZKA", "op": "zdy" });
    }
    setMasker(true);
    queryCkbgdslForDy(paramCount).then((res02) => {
      setMasker(false);
      if (res02.code === '200') {
        // 设置间隔为2000毫秒（2秒）
        let doTime = setInterval(function () {
          // 进度条
          // 1秒10条
          setModalVisibleXz(true);
          let timeNum = myUtil.sessionStore.getItem('numTimeBgddy');
          if (timeNum != 99) {
            timeNum = timeNum + 1;
            myUtil.sessionStore.setItem('numTimeBgddy', timeNum);
            setPercentNum(timeNum);
            console.log('++');
          }
        }, 2000);
        pldyBgd(paramCount).then((res01) => {
          clearInterval(doTime);
          setPercentNum(0);
          console.log('結束');
          setMasker(false);
          setModalVisibleXz(false);
          if (res01.code === '200') {
            // const fileName = res01.fileName;
            const filePath = res01?.body.filePath;
            setMasker(true)
            let a = document.createElement('a');//创建一个a标签元素
            a.download = res01?.body.fileName;
            a.style.display = 'none';//设置元素不可见
            a.href = filePath; //设置下载地址
            // a.href ='https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip';
            document.body.appendChild(a);//加入
            a.click(); //触发点击,下载
            document.body.removeChild(a);//释放 
            setMasker(false);
          } else {
            message.error(res01.msg);
            handleOk();
          }
        })
      } else {
        message.error(res02.msg);
      }
    });
    setMasker(true)
  }

  const close = () => {
    form.setFieldsValue({ dylx: 'bgdhs', ckrq1: '', ssq: '', ssqpc: '', dyfs: '01', pxgz: 'ckrq' });
    setShowInput('bgdhs');
    setShowDysx(false);
    setModalVisible(false)
  }

  const handleSjfwChange = (e: any) => {
    const value = e.target.value;
    console.log(value)
    setShowInput(value); // 显示出口报关单输入
    // 隐藏出口日期选择
    if (value === 'bgdhs') { // 报关单打印
      form.setFieldsValue({ pxgz: 'ckrq' })// 默认按出口日期顺序
    } else if (value === 'ckrq1') { // 出口日期
      form.setFieldsValue({ pxgz: 'ckrq' })// 默认按出口日期顺序
    } else if (value === 'ssq') { // 所属期
      form.setFieldsValue({ pxgz: 'sbsx' })// 默认按申报顺序
    } else if (value === 'sbrq') {
      form.setFieldsValue({ pxgz: 'sbrq' }) // 默认按申报日期顺序
    } else if (value === 'dqsx') {
      form.setFieldsValue({ pxgz: 'dqlbsx' }) // 默认按当前列表顺序
    }
  }

  const handleDyysChange = (e: any) => {
    const value = e.target.value;
    // 选择多张报关单生产一个打印文件 打印顺序才可选
    if (value === '02') {
      setShowDysx(true);
    } else {
      setShowDysx(false);
    }
  }

  const handleOk = () => {
    setPercentNum(0)
    setModalVisibleXz(false)
    setShowBtn(true)
  }

  const getMrDcmmgz = () => {
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    const sbqyuuid = userInfo?.qxQys[0]?.sbqyuuid;
    const yhuuid1 = userInfo?.qxyh?.yhuuid1;
    const key = yhuuid1 + sbqyuuid + 'ckbgdhdydcmmgz';
    const values: any = myUtil.localStore.getItem(key) || '1';
    return values;
  }

  const setMrDcmmgz = (val: any) => {
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    const sbqyuuid = userInfo?.qxQys[0]?.sbqyuuid;
    const yhuuid1 = userInfo?.qxyh?.yhuuid1;
    const key = yhuuid1 + sbqyuuid + 'ckbgdhdydcmmgz';
    myUtil.localStore.setItem(key, val);
  }






  const ms = "请输入18位报关单号,多条数据以英文" + "," + "隔开";
  return (
    <>
      <Modal
        title="打印"
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        onCancel={() => close()}
        destroyOnHidden
        footer={(<>
          <Button onClick={() => close()} type="default">取消</Button>
          <Button onClick={() => save()} type="primary">确定</Button>
        </>)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <ProCard split="horizontal" className="dd_layout_form_01 dyStyle" >
            <Form
              form={form}
              name="form"
            >
              <div className='groupTit'>1、选择打印数据范围</div>
              <Form.Item name="dylx" initialValue={'bgdhs'} style={{ marginLeft: '30px', marginBottom: '15px' }}>
                <Radio.Group onChange={handleSjfwChange}>
                  <Row style={{ lineHeight: '30px' }}>
                    <Col span={8}>
                      <Radio key='bgdhs' value='bgdhs'>按报关单打印</Radio>
                    </Col>
                    <Col span={8}>
                      <Radio key='ckrq1' value='ckrq1'>按出口日期打印</Radio>
                    </Col>
                    <Col span={8}>
                      {cktsUtil.sys.enterpriseType() === "WM" ? <Radio key='ssq' value='ssq'>按所属期批次打印</Radio>
                        : <Radio key='ssq' value='ssq'>按所属期打印</Radio>
                      }
                    </Col>
                    <Col span={8}>
                      <Radio key='sbrq' value='sbrq'>按申报日期打印</Radio>
                    </Col>
                    <Col span={8}>
                      <Radio key='dqsx' value='dqsx'>按当前筛选数据打印</Radio>
                    </Col>
                  </Row>
                </Radio.Group>
              </Form.Item>
              {/* 报关单号输入 */}
              {showInput === 'bgdhs' ? <Form.Item name="bgdhs" style={{ marginLeft: '30px', marginRight: '30px' }} rules={[
                () => ({
                  validator(_, value) {
                    if (value) {
                      form.setFieldsValue({ bah: value.toUpperCase() });
                    } else {
                      return Promise.reject(new Error('报关单号不能为空'));
                    }
                    return Promise.resolve();
                  },
                })
              ]}>
                <Input placeholder={ms} />
              </Form.Item> : <></>}
              {/* 所属期批次输入 */}
              {showInput === 'ssq' && cktsUtil.sys.enterpriseType() === 'WM' ?
                <Form.Item name="ssqpc" rules={[() => ({
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
                ]} >
                  <Input placeholder="请输入9位所属期批次" style={{ marginLeft: '30px', marginRight: '30px', width: '600px' }}></Input>
                </Form.Item> : <></>
              }
              {/* 所属期输入 */}
              {showInput === 'ssq' && cktsUtil.sys.enterpriseType() === 'SC' ?
                <Form.Item name="ssq" style={{ marginLeft: '30px', marginRight: '30px' }} rules={[() => ({
                  validator(_, value) {
                    if (value) {
                      const temp1 = (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)); // YYYYMM
                      if (temp1) {
                        return Promise.reject(new Error('请输入正确的所属期格式'));
                      }
                      return Promise.resolve();
                    } else {
                      return Promise.reject(new Error('请输入所属期'));
                    }
                  },
                })
                ]}>
                  <Input placeholder="请输入6位所属期" ></Input>
                </Form.Item> : <></>
              }
              {/* 出口日期输入 */}
              {showInput === 'ckrq1' ? <Form.Item name="ckrq1" style={{ marginLeft: '30px', marginRight: '30px' }} rules={[
                () => ({
                  validator(_, value) {
                    if (value && value.length === 2) {
                      if (value[1].diff(value[0], 'day') > 30) {
                        return Promise.reject(new Error('选择区间30天'));
                      }
                      return Promise.resolve();
                    } else {
                      return Promise.reject(new Error('请选择出口日期'));
                    }
                  },
                })
              ]}>
                <DatePicker.RangePicker placeholder={['出口日期起', '出口日期止']} format={myUtil.date.formatList()} />
              </Form.Item> : <></>}
              {/* 申报日期输入 */}
              {showInput === 'sbrq' ?
                <Form.Item name='sbrq' style={{ marginLeft: '30px', marginRight: '30px' }} rules={[
                  () => ({
                    validator(_, value) {
                      if (value && value.length === 2) {
                        if (value[1].diff(value[0], 'day') > 30) {
                          return Promise.reject(new Error('选择区间30天'));
                        }
                        return Promise.resolve();
                      } else {
                        return Promise.reject(new Error('请选择申报日期'));
                      }
                    },
                  })
                ]} >
                  <DatePicker.RangePicker placeholder={['申报日期起', '申报日期止']} format={myUtil.date.formatList()} />
                </Form.Item> : <></>
              }
              <div className='groupTit'>2、选择打印文件样式</div>
              <Form.Item name="dyfs" initialValue={'01'} style={{ marginLeft: '30px', marginBottom: '15px' }}>
                <Radio.Group onChange={handleDyysChange}>
                  <Row style={{ lineHeight: '30px' }}>
                    <Col span={24}>
                      <Radio key='1' value='01'>一张报关单生成一个打印文件</Radio>
                    </Col>
                    <Col span={24}>
                      <Radio key='2' value='02'>多张报关单生成一个打印文件，超过500张分批</Radio>
                    </Col>
                  </Row>
                </Radio.Group>
              </Form.Item>
              <div className='groupTit'>3、选择打印顺序</div>
              <Form.Item name="pxgz" style={{ marginLeft: '30px' }}>
                <Radio.Group disabled={!showDysx}>
                  <Row style={{ lineHeight: '30px' }}>
                    {showInput === 'dqsx' ?
                      <Col span={24}>
                        <Radio key='dqlbsx' value='dqlbsx'>按当前列表顺序</Radio>
                      </Col> : <></>
                    }
                    {showInput === 'sbrq' ?
                      <Col span={24}>
                        <Radio key='sbrq' value='sbrq'>按申报日期顺序</Radio>
                      </Col> : <></>
                    }
                    {showInput === 'bgdhs' || showInput === 'ckrq1' || showInput === 'dqsx' ?
                      <Col span={24}>
                        <Radio key='ckrq' value='ckrq'>按出口日期顺序</Radio>
                      </Col> : <></>
                    }
                    {showInput === 'bgdhs' || showInput === 'ckrq1' || showInput === 'sbrq' ?
                      <Col span={24}>
                        <Radio key='ckfph' value='ckfph'>按出口发票号顺序</Radio>
                      </Col> : <></>
                    }
                    {showInput === 'ssq' ?
                      <Col span={24}>
                        <Radio key='sbsx' value='sbsx'>按申报顺序</Radio>
                      </Col> : <></>
                    }
                  </Row>
                </Radio.Group>
              </Form.Item>
              <div className='groupTit'>4、文件命名规则</div>
              <Form.Item name="dcmmgz" style={{ marginLeft: '30px' }}>
                <Radio.Group disabled={showDysx}>
                  <Row style={{ lineHeight: '30px' }}>
                      <Col span={24}>
                        <Radio key='ckhthbgdhgbh' value='1'>合同协议号+报关单号（18位）</Radio>
                      </Col>
                      <Col span={24}>
                        <Radio key='bgdhgbhckhth' value='2'>报关单号（18位）+合同协议号</Radio>
                      </Col>
                  </Row>
                </Radio.Group>
              </Form.Item>
            </Form>
          </ProCard>
        </Spin>
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
        footer={
          <Button onClick={() => handleOk()} type="primary" key="ok" disabled={showBtn}>确定</Button>
        }
      >
        <>
          <div>生成打印文件进度：{percentNum}%</div>
          <Progress percent={percentNum} />
        </>
      </Modal>
    </>
  );
};

export default Index;
