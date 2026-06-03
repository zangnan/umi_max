// 报送资料
import React, { useState, useImperativeHandle, useEffect } from 'react';
import { Modal, Input, Select, Form, Radio, Checkbox, message, Button, Spin, Table, Progress } from 'antd';
import pro from '@/pages/common/proConfig';
import { history, } from 'umi';
import { tszlxzjy, tszljydc, tszlxz } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import DDAlert from '@/components/DDAlert';
import { cloneDeep } from 'lodash';

export type AttachmentDataProps = {
  visible?: any;
  onRef?: any;
  gridRef?: any;
  ywKey?: any;
}

const Hqsbsj: React.FC<AttachmentDataProps> = ({
  visible = false,
  onRef,
  ywKey,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [form] = Form.useForm();
  const [obj, setObj] = useState<any>();
  const [sjfwlx, setSjfwlx] = useState<any>('1');
  const [msg, setMsg] = useState<any>('');
  const [bgdxzlx, setBgdxzlx] = useState<any>(['CKBGD']);
  const [bgdbslx, setBgdbslx] = useState<any>('DZKA');
  const [masker, setMasker] = useState<any>(false);
  const [qxQys, setQxQys] = useState<any>(false);
  const [modalVisibleXz, setModalVisibleXz] = useState<boolean>(false);
  const [percentNum, setPercentNum] = useState(0);
  const [showBtn, setShowBtn] = useState<boolean>(true); // 是否显示进度条确认按钮
  const [filePath, setFilePath] = useState<any>(); // 是否显示进度条确认按钮
  const [fileName, setfileName] = useState<any>(); // 是否显示进度条确认按钮
  const [status, setStatus] = useState<any>("active"); // 是否显示进度条确认按钮



  // 开启
  const showModal = (param: any) => {
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    const qxQys = userInfo?.qxQys[0];
    setQxQys(qxQys);

    if(qxQys?.cktsqylxDm === 'WM' || qxQys?.cktsqylxDm === 'wm' ){
      if (myUtil.menu.getMenuObjById('020207')) {
        form.setFieldsValue({bgdxzlx:['XFSFP','ZZSFP','CKBGD'],sjfwnr:''});
        setBgdxzlx(['XFSFP','ZZSFP','CKBGD']);
      } else {
        form.setFieldsValue({bgdxzlx:['ZZSFP','CKBGD'],sjfwnr:''});
        setBgdxzlx(['ZZSFP','CKBGD']);
      }
    }else{
      form.setFieldsValue({bgdxzlx:['CKBGD'],sjfwnr:''});
      setBgdxzlx(['CKBGD']);

    }
    setModalVisible(true);
    setObj(param);

  };
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


 
  useEffect(() => {
    if(percentNum != 0){
      setTimeout(function(){
        myFunction(percentNum+1,status);
       }, 500);
    }
  }, [percentNum,status]);



  const myFunction = (i :any,status2:any) => {
    if (status2 == "success") {
      setPercentNum(100);
    }else{
      if(percentNum < 99){
        setPercentNum(i);
      }
    }
  }

  const onChange = (p: any) => {
    setSjfwlx(p.target.value);
    if (p.target.value == "1" || p.target.value == "5") {
      setMsg('');
    } else if (p.target.value == "2") {
      setMsg('请录入疑点代码，多条数据以英文逗号隔开！');
    } else if (p.target.value == "3") {
      setMsg('请录入报关单号，多条数据以英文逗号隔开！');
    } else {
      setMsg('请录入出口发票号，多条数据以英文逗号隔开！');
    }

  }

  const onChangeLx = (p: any) => {
    setBgdbslx(p);
  }

  const checkBoxOnchange = (p: any) => {
    setBgdxzlx(p);
  }

  const onclose = () => {
    setSjfwlx('1');
    setObj('');
    setMsg('');
    setBgdxzlx(['CKBGD']);
    setBgdbslx('DZKA');
    setShowBtn(true);
    setFilePath('');
    setfileName('');
    setModalVisible(false);
  }

  const columns = [
    { title: '序号', dataIndex: 'xh', key: 'xh', width: '90px', ellipsis: true },
    { title: '发票号码', dataIndex: 'fphm', key: 'fphm', width: '180px', ellipsis: true },
    { title: '发票代码', dataIndex: 'fpDm', key: 'fpDm', width: '180px', ellipsis: true },
    { title: '开票日期', dataIndex: 'kprq', key: 'kprq', width: '180px', ellipsis: true },
  ];

  const downloadExcel = (param: any) => {
    const params = {
      dcList: param,
      ssq: obj?.ssq,
      sbpc: obj?.sbpc,
    }
    tszljydc(params).then((res1) => {
      if (res1.code == '200') {
        myUtil.file.downloadExcel(res1?.body?.blob, res1?.body?.fileName);
      } else {
        message.error(res1.msg);
      }
    });
  }

  const confirm = async () => {
    const val = await form.validateFields();
    const xzlx = [];
    if (bgdxzlx?.indexOf("CKBGD") > -1) {
      xzlx.push(bgdbslx);
    }
    if (bgdxzlx?.indexOf("ZZSFP") > -1) {
      xzlx.push('ZZSFP');
    }
    if (bgdxzlx?.indexOf("XFSFP") > -1) {
      xzlx.push('XFSFP');
    }
    const params = {
      ywKey: ywKey,
      ssq: obj?.ssq,
      sbpc: obj?.sbpc,
      sjfwlx: sjfwlx,
      sjfwnr: val?.sjfwnr,
      xzlx: xzlx,
    }
    setMasker(true);
    await tszlxzjy(params).then(async (res1) => {
      setMasker(false);
      if (res1.code == '200') {
        const p = { xzList: res1?.body.xzList, xzlx: res1.body.xzlx, ssq: res1.body.ssq, sbpc: res1.body.sbpc };
        setMasker(true);
        setModalVisibleXz(true);
        // setPercentNum(1);
        myFunction(1,status);
        await tszlxz(p).then((res2) => {
          if (res2.code == '200') {
            setFilePath(res2.body.filePath);
            setfileName(res2.body.fileName);
            setMasker(false);
            setShowBtn(false);
            setStatus("success");
          } else {
            setModalVisibleXz(false);
            setMasker(false);
            message.error(res2.msg);
          }
        });
      } else if (res1.code == '900') {
        DDAlert.open({
          title: '增值税发票文件缺失提醒',
          isShowcancelText: false,
          infoType: 'warning',
          modalType: 'form',
          closeStatus: false,
          width: '650px',
          okText: '去下载文件',
          isFormContent: false,
          button: [
            <Button key={'excelmbxz'} onClick={() => downloadExcel(res1?.body)}>导出</Button>,
          ],
          content: <>
            <div>以下数电票缺少发票版式文件：</div>
            <br/>
            <Table dataSource={res1?.body} columns={columns} size="small" />
          </>,
          okCallbackFn: function (thisObj: any) {
            history.push({ pathname: '/02/0202/020203', query: { ssqpc: obj?.ssq + obj?.sbpc, sjfwlx: sjfwlx, sjfwnr: val?.sjfwnr } });
            DDAlert.close();
          }
        })
      } else {
        message.error(res1.msg);
      }
    })
  }

  const handleOk = async () => {
    setModalVisibleXz(false);
    setPercentNum(0);
    onclose();
    setStatus("active");
    let a = document.createElement('a');//创建一个a标签元素
    a.style.display = 'none';//设置元素不可见
    a.href = filePath;
    a.download = fileName;
    document.body.appendChild(a);//加入
    a.click(); //触发点击,下载
    document.body.removeChild(a);//释放 
  }





  return (
    <>
      <Modal
        title="退税资料下载"
        centered
        maskClosable= {false}
        destroyOnClose
        visible={modalVisible}
        onCancel={onclose}
        width={pro.c_modal_width_x3}
        footer={
          <>
            <Button onClick={onclose} type="default">关闭</Button>
            <Button onClick={confirm} type="primary">确认</Button>
          </>
        }
      >
        <Spin tip="Loading..." spinning={masker} key={'sjdrspin'} delay={100}>
          <Form form={form}>
            <div style={{ backgroundColor: "#f1f4f7", padding: "0 10px", lineHeight: "32px", margin: " 0 0 20px 0", }}>{`1、选择下载数据范围（所属期${myUtil.sys.enterpriseType() == 'WM'?"批次":""}${obj?.ssq}${obj?.sbpc}）`}</div>
            <Radio.Group onChange={onChange} defaultValue={sjfwlx}>
              <Radio value={"1"}>按疑点代码（全部）</Radio>
              <Radio value={"2"}>按疑点代码（指定）</Radio>
              <Radio value={"3"}>按报关单号打印</Radio>
              <Radio value={"4"}>按出口发票号</Radio>
              {/* <Radio value={"5"}>全部数据打印</Radio> */}
            </Radio.Group>
            <br /><br />
            <Form.Item name="sjfwnr" initialValue="" rules={sjfwlx == "1" || sjfwlx == "5" ? [] : [{ required: true, message: `${msg}` }, { type: 'string', max: 900, message: '最大长度不能超过900位' }]} >
              <Input placeholder={msg} disabled={sjfwlx == "1" || sjfwlx == "5"} />
            </Form.Item>
            <div style={{ backgroundColor: "#f1f4f7", padding: "0 10px", lineHeight: "32px", margin: " 0 0 20px 0", }}>{`2、选择下载资料类型`}</div>
            <Form.Item name="bgdxzlx" rules={[{ required: true, message: `请勾选下载资料类型` }]} >
              <Checkbox.Group onChange={checkBoxOnchange}>
                <Checkbox value='CKBGD'>出口货物报关单
                <Select defaultValue={bgdbslx} disabled={bgdxzlx?.indexOf("CKBGD") == -1} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} onChange={onChangeLx} style={{ width: 200, marginLeft: 10 }} options={[{ value: 'DZKA', label: '电子口岸竖版样式' }, { value: 'DYCK', label: '单一窗口横板样式' }]} />
                </Checkbox>
                {qxQys?.cktsqylxDm === 'WM' || qxQys?.cktsqylxDm === 'wm' ? <Checkbox value='ZZSFP'>增值税发票</Checkbox> : <></>}
                {(qxQys?.cktsqylxDm === 'WM' || qxQys?.cktsqylxDm === 'wm') && myUtil.menu.getMenuObjById('020207') ? <Checkbox value='XFSFP'>消费税票</Checkbox> : <></>}
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
      <Modal
        title="资料准备"
        visible={modalVisibleXz}
        width={pro.c_modal_width_x1}
        closable={false}
        keyboard={false}
        maskClosable={false}
        zIndex={1001}
        style={{ marginTop: '40px' }}
        footer={
          <Button onClick={() => handleOk()} type="primary" key="ok" disabled={showBtn}>下载资料</Button>
        }
      >
        <>
          <div>资料准备中，请耐心等待！</div>
          <Progress percent={percentNum} />
        </>
      </Modal>
    </>
  );
};
export default Hqsbsj;