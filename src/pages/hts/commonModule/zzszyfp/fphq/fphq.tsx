import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Button, Form, Spin, DatePicker, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import myUtil from '@/components/DDAssist/util';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import shsjxz_config from './fphqConfig';
import Func from './fphqFun';
import { yzfPtDzfpSq, yzfPtDzfpCx, yzfPtDlzmSq, yzfPtDlzmCx } from '@/pages/hts/services/htsApi';
import moment from 'moment';

export interface BdjgProps {
  onRef?: any;
}

const Shsjxz: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>(shsjxz_config);
  const [form] = Form.useForm();
  const [sjgjsjDm, setSjgjsjDm] = useState();
  const [title ,setTitle] = useState('发票获取');
  
  // 列表列
  const getColumns = () => {
    // 列表内容格式化: 执行状态
    const renderColumnXzztDm = (text: string) => {
      if (text == '0') {
        return '下载中';
      }
      if (text == '1') {
        return '下载完成';
      }
      if (text == '2') {
        return '下载失败';
      }
      if (text == '3') {
        return '下载完成，无数据！';
      }
      return '未处理';
    }
    const cols = [];
    cols.push({ title: '任务名称', dataIndex: 'sjgjsjmc', width: 140, ellipsis: true });
    cols.push({ title: '下载条件', dataIndex: 'xztj', width: 260 });
    cols.push({ title: '执行状态', dataIndex: 'xzztDm', width: 100, render: renderColumnXzztDm });
    cols.push({ title: '任务执行情况', dataIndex: 'xxnr1', width: 300, ellipsis: true });
    cols.push({ title: '任务开始时间', dataIndex: 'zxkssj', width: 160, render: (text: any) => (myUtil.grid.formatDate(text, 'YYYY-MM-DD HH:mm:ss')) });
    cols.push({ title: '任务接收时间', dataIndex: 'zxjssj', width: 160, render: (text: any) => (myUtil.grid.formatDate(text, 'YYYY-MM-DD HH:mm:ss')) });
    return cols;
  }

  // 开启
  const showModal = (param: any,sjgjsjDm:any) => {
    const c = { ...myConfig };
    let gridParams: any ;
    if(sjgjsjDm){
      setSjgjsjDm(sjgjsjDm);
       gridParams= {
        initSearchModal: [
          { property: 'sjgjsjDm', value: sjgjsjDm, op: 'al' },
        ],
      }
      if(sjgjsjDm == '030501'){
        setTitle('代理出口货物证明获取');
      }
    }else{
       gridParams = {
        initSearchModal: [
          { property: 'sjgjsjDm', value: '020000', op: 'al' },
        ],
      }
    }

    c.gridParams = gridParams;
    // 配置列表列
    c.grid_columns = getColumns();
    // 配置项：自定义操作列
    c.handle_columns = [
      { name: '刷新', key: 'reload1', func: 'handleColumnReload', display: 'displayReload' }, // 未处理
    ];
    setMyconfig(c);
    form.resetFields();
    setModalVisible(true);
  };

  // 下载申请
  const xzsqBtn = async () => {
    const kprq = form.getFieldValue('kprq');
    if (!kprq) {
      message.info(`请选择申请下载${sjgjsjDm == '030501'? '出口日期' : '开票日期'}！`);
      return;
    }
    setMasker(true);
    if(sjgjsjDm =='030501'){
      let params = {
        ckrq1Start: moment(new Date(kprq[0])).format('yyyy-MM-DD'),
        ckrq1End: moment(new Date(kprq[1])).format('yyyy-MM-DD'),
      }
     await yzfPtDlzmSq(params).then((res: any) => {
        setMasker(false);
        const { code } = res;
        if (code === '200') {
          const unitRef = Func.unitRef;
          unitRef.current!.reload2();
        } else if (code === '900') {
          message.info(res.msg);
        } else {
          message.error(res.msg);
        }
      });
    }else{
      let params = {
        kprqStart: moment(new Date(kprq[0])).format('yyyy-MM-DD'),
        kprqEnd: moment(new Date(kprq[1])).format('yyyy-MM-DD'),
      }
      await yzfPtDzfpSq(params).then((res) => {
        setMasker(false);
        const { code } = res;
        if (code === '200') {
          const unitRef = Func.unitRef;
          unitRef.current!.reload2();
        } else if (code === '900') {
          message.info(res.msg);
        } else {
          message.error(res.msg);
        }
      });
    }
    
  }
  // 配置项：数据下载查询（刷新）
  Func.handleColumnReload = (param: any, event: any) => {
    event.stopPropagation();
    const { record } = param;
    let params = {
      csz1: record.csz1,
      csz2: record.csz2,
      zrwuuid: record.zrwuuid,
    };
    if(sjgjsjDm =='030501'){
      setMasker(true);
      yzfPtDlzmCx(params).then((res: any) => {
        setMasker(false);
        const { code } = res;
        if (code === '200') {
          const unitRef = Func.unitRef;
          unitRef.current!.reload2();
        } else if (code === '900') {
          message.info(res.msg);
        } else {
          message.error(res.msg);
        }
      });
    } else {
      setMasker(true);
      yzfPtDzfpCx(params).then((res) => {
        setMasker(false);
        const { code, msg } = res;
        if (code === '200') {
          const unitRef = Func.unitRef;
          unitRef.current!.reload2();
        } else {
          message.info(msg);
        }
      }) 
    }
  }

  // 表单项: 下载开票日期范围
  const getFormItems = () => {
    let placeholderText: any = ['开票日期起', '开票日期止'];
    let tooltip = <span>
    *输入下载开票日期范围，如2022-01-01 - 2022-01-02。
    <br/>
    *最大周期：一年。
  </span>
  if(sjgjsjDm=='030501') {
    placeholderText =  ['出口日期起', '出口日期止'];
    tooltip = <span>
    *输入下载出口日期范围，如2022-01-01 - 2022-01-02。
    <br/>
    *最大周期：一年。
  </span>
  }
    const formItem = [];
    formItem.push(
      <Form.Item
        name="kprq"
        label={sjgjsjDm=='030501'?'申请下载出口日期范围':'申请下载开票日期范围'}
        tooltip={tooltip}
        rules={[
          () => ({
            validator(_, value) {
              if (value.length === 2) {
                if (value[0].diff(value[1], 'years') > 1 || value[1].diff(value[0], 'years') > 1) {
                  return Promise.reject(new Error('数据下载最大下载时间范围是1年'));
                }
                return Promise.resolve();
              }
              return Promise.resolve();
            },
          })
        ]}
        >
        <DatePicker.RangePicker placeholder={placeholderText} format={myUtil.date.formatList()} />
      </Form.Item>
    )
    formItem.push(
      <Form.Item>
        <Button icon={<DownloadOutlined />} onClick={() => xzsqBtn()} type="primary">下载申请</Button>
      </Form.Item>
    )
    return formItem;
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Modal
      title={title}
      visible={modalVisible}
      wrapClassName='standard-modal-1'
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      destroyOnHidden={true}
      onCancel={() => setModalVisible(false)}
      footer={(<>
        <Button onClick={() => setModalVisible(false)} type="default">关闭</Button>
      </>)}
    >
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <Form
        form={form}
        name="form"
        layout='inline'
        style={{ paddingBottom: "20px" }}
      >
        {getFormItems()}
      </Form>
      <DDBunit2 config={myConfig} func={Func} />
    </Spin>
    </Modal>
  );
};

export default Shsjxz;
