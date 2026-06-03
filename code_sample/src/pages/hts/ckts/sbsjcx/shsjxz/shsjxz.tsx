import React, { useImperativeHandle, useState } from 'react';
import pro from '@/pages/common/proConfig';
import { Modal, Button, Form, Spin, Input, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import myUtil from '@/pages/common/myUtil';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import shsjxz_config from './shsjxzConfig';
import Func from './shsjxzFun';
import { ycsbYzfFkxzSq, ycsbYzfFkxzsqztCx, ycsbYzfFksjjs } from '@/services/hts/api';
import cktsUtil from '@/pages/common/cktsUtil';

export interface BdjgProps {
  onRef?: any;
  ywKey?: any;
}

const Shsjxz: React.FC<BdjgProps> = ({
  onRef,
  ywKey
}) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>(shsjxz_config);
  const [form] = Form.useForm();

  // 列表列
  const getColumns = () => {
    // 列表内容格式化: 审核状态
    const renderColumnShjgxzztDm = (text: string) => {
      if (text == '1') { // 处理中
        return '下载中';
      }
      if (text == '2') { // 审核失败
        return '下载失败';
      }
      if (text == '3') { // 处理完成
        return '下载完成';
      }
      return '未处理';
    }
    let ssqTitle = '下载年月';
    if (ywKey == 'JLJG_MDTHX') {
      ssqTitle = '下载年度';
    }
    const cols = [];
    cols.push({ title: ssqTitle, dataIndex: 'ssq', width: 80 });
    cols.push({ title: '文件名称', dataIndex: 'wjm', width: 260, ellipsis: true });
    cols.push({ title: '状态', dataIndex: 'shjgxzztDm', width: 160, render: renderColumnShjgxzztDm });
    cols.push({ title: '操作时间', dataIndex: 'lrrq', width: 160, render: (text: any) => (myUtil.grid.formatDate(text, 'YYYY-MM-DD HH:mm:ss'))});
    return cols;
  }

  // 开启
  const showModal = (param: any) => {
    const c = { ...myConfig };
    const gridParams: any = {
      initSearchModal: [
        { property: 'ywKey', value: ywKey, op: 'al' },
      ],
    }
    c.gridParams = gridParams;
    // 配置列表列
    c.grid_columns = getColumns();
    // 配置项：自定义操作列
    c.handle_columns = [
      { name: '刷新', key: 'reload1', func: 'handleColumnReload', display: 'displayReload' }, // 未处理
      { name: '反馈数据接收', key: 'receive1', func: 'handleColumnReceive', display: 'displayReceive' }, // 审核完成 ywKey = JLJG_MDTHX
      { name: '反馈数据包下载', key: 'download1', func: 'handleColumnDownload', display: 'displayDownload' }, // 可下载文件
      { name: '删除', key: 'delete1', func: 'handleColumnDelete' },
    ];
    setMyconfig(c);
    form.resetFields();
    setModalVisible(true);
  };

  // 下载申请
  const xzsqBtn = () => {
    const ssq = form.getFieldValue('ssq');
    if (!ssq) {
      let msg = '年份或者年月不允许为空，请输入！';
      if (ywKey == 'JLJG_MDTHX') {
        msg = '年度不允许为空，请输入！';
      }
      if (ywKey === 'QTYW_HWCHS') {
        msg = '下载年月不允许为空，请输入！';
      }
      message.info(msg);
      return;
    }
    if (ywKey == 'JLJG_MDTHX') {
      if (!ssq.match(/^[1-9]\d{3}$/)) {
        message.info('请输入正确的年度！');
        return;
      }
    } else if (ywKey.indexOf('ZMKJ_') == 0) {
      if (!ssq.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)) {
        message.info('请输入正确的年月格式！');
        return;
      }
    } else if (ywKey == 'QTYW_JHPZXXHT' || ywKey == 'ZGBA_CKTSYWTX') {
      if (!ssq.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)) {
        message.info('请输入正确的年月格式！');
        return;
      }
    } else if (ywKey === 'QTYW_HWCHS') {
      if (!ssq.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)) {
        message.info('请输入正确的年月格式！');
        return;
      }
    } else {
      if (!ssq.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/) && !ssq.match(/^[1-9]\d{3}$/)) {
        message.info('请输入正确的年份或者年月格式！');
        return;
      }
    }
    const sbpc = form.getFieldValue('sbpc');
    if (ywKey == 'QTYW_JHPZXXHT') {
      if (!sbpc) {
        message.info('申报批次不允许为空，请输入！');
        return;
      }
      if (sbpc.length != 3) {
        message.info('申报批次应为3位数字！');
        return;
      }
      if (!sbpc.match(/^\d+$/)) {
        message.info('申报批次应为3位数字！');
        return;
      }
    }
    let params = {
      sbpc: sbpc || '',
      ssq: ssq || '',
      ywKey: ywKey
    };
    setMasker(true);
    ycsbYzfFkxzSq(params).then((res) => {
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
    })
  }

  // 按钮显隐-反馈数据接收 ywKey = JLJG_MDTHX
  Func.displayReceive = (record: any) => {
    if (ywKey === 'JLJG_MDTHX' && (record.shjgxzztDm == '3' && record.fkjszt?.trim() != '1')) { // 审核完成
      return false;
    }
    return true;
  }
  // 配置项：数据下载查询（刷新）
  Func.handleColumnReload = (param: any, event: any) => {
    event.stopPropagation();
    const { record } = param;
    let params = {
      ssq: record.ssq,
      shjgxzuuid: record.shjgxzuuid,
      ywKey: ywKey,
      uuid: record.uuid
    };
    setMasker(true);
    ycsbYzfFkxzsqztCx(params).then((res) => {
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
  // 配置项：反馈数据接收 ywKey = JLJG_MDTHX
  Func.handleColumnReceive = (param: any, event: any) => {
    event.stopPropagation();
    const { record } = param;
    let params = {
      ssq: record.ssq,
      ywKey: ywKey,
      uuid: record.uuid
    };
    setMasker(true);
    ycsbYzfFksjjs(params).then((res) => {
      setMasker(false);
      const { code, msg, desc } = res;
      if (code === '200') {
        message.success(desc);
        const unitRef = Func.unitRef;
        unitRef.current!.reload2();
      } else {
        message.info(msg);
      }
    })
  };
  // 配置项：反馈数据包下载
  Func.handleColumnDownload = async (param: any, event: any) => {
    event.stopPropagation();
    const { record } = param;
    const params = {
      uuid: record.uuid
    }
    const url = `/yw/bszx/ggfw/ycsb/yzqfk/ycsbYzfFkxzFksjbXz/`;
    setMasker(true);
    await cktsUtil.downloadFileCkts(url, params);
    setMasker(false);
  };

  // 表单项: 生成申报数据
  const getFormItems = () => {
    let maxLength = 6;
    let placeholder = '请输入下载年月';
    let tooltip = (
      <span>
        *下载年反馈，请在下载年月处填入申报年，如2015。
        <br/>
        *下载月反馈，请在下载年月处填入申报年月，如201505。
      </span>
    )
		if (ywKey == 'JLJG_MDTHX') {
      maxLength = 4;
      placeholder = '请输入下载年度';
      tooltip = (
        <span>下载年反馈，请在下载年月处填入申报年度，如2015</span>
      )
		}
    if (ywKey === 'QTYW_HWCHS') {
      tooltip = (
        <span>下载月反馈，请在下载年月处填入申报年月，如201505</span>
      )
    }
		if (ywKey.indexOf('ZMKJ_') == 0 || ywKey == 'QTYW_JHPZXXHT' || ywKey == 'ZGBA_CKTSYWTX') {
      tooltip = (
        <span>下载月反馈，请在下载年月处填入申报年月，如201505</span>
      )
		}
    const formItem = [];
    formItem.push(
      <Form.Item
        name="ssq"
        label="下载年月"
        tooltip={tooltip}>
        <Input placeholder={placeholder} maxLength={maxLength} style={{ width: '160px'}} />
      </Form.Item>
    )
    if (ywKey == 'QTYW_JHPZXXHT') {
      formItem.push(
        <Form.Item
          name="sbpc"
          label="申报批次" >
          <Input placeholder="请输入申报批次" style={{ width: '160px'}} />
        </Form.Item>
      )
    }
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
      title="审核数据下载"
      visible={modalVisible}
      wrapClassName='standard-modal-1'
      width={pro.c_modal_width_x4}
      destroyOnClose={true}
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
