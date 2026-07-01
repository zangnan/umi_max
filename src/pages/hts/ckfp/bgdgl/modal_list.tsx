import React, { useImperativeHandle, useState } from 'react';
import DDBaseGrid from '@/components/DDBaseGrid';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Button, Form, Spin, Input, Radio, Row, Col, Space, DatePicker, message, Tooltip } from 'antd';
import { CloseCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import khdgjUtil from '../khdgjUtil';
import cktsUtil from '@/pages/hts/cktsUtil';
import myUtil from '@/components/DDAssist/util';
import moment from 'moment';
import { queryPagerXzrw, queryKakPassword, saveKakPassword, sqxz } from '@/pages/hts/services/htsApi';

export interface BdjgProps {
  onRef?: any;
}

const ModalList: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [gridData, setGridData] = useState<any>([]);
  const [valRadio, setValRadio] = useState('1');
  const [jcMsg, setJcMsg] = useState('');
  const [jcbz, setJcbz] = useState('ND');
  const [form] = Form.useForm();

  // 配置列表列
  const getColumns = () => {
    const cols = [
      { title: '任务名称', dataIndex: 'sjgjsjmc', width: 140 },
      { title: '下载条件', dataIndex: 'xztj', width: 220, ellipsis: true },
      {
        title: '执行状态', dataIndex: 'xzztDm', width: 140, render: (text: any) => {
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
      },
      { title: '任务执行情况', dataIndex: 'xxnr1', width: 240, ellipsis: true },
      { title: '任务开始时间', dataIndex: 'zxkssj', width: 160, render: (text: any) => (myUtil.grid.formatDate(text, 'YYYY-MM-DD HH:mm:ss'))},
      { title: '任务结束时间', dataIndex: 'zxjssj', width: 160, render: (text: any) => (myUtil.grid.formatDate(text, 'YYYY-MM-DD HH:mm:ss'))},
    ];
    return cols;
  };

  // 单选change
  const onChangeRadio = (e: any) => {
    if (e.target.value === '1') {
      form.setFieldsValue({ bgdh: '' })
    } else if (e.target.value === '2') {
      form.setFieldsValue({ ckrq: '' })
    }
    setValRadio(e.target.value);
  };

  // 工具下载
  const getGridData = () => {
    const params = {
      page: 1,
      pageSize: 9999,
      searchModel: [
        { property: 'sjgjsjDm', value: '010101', op: 'dd' }
      ]
    };
    setMasker(true);
    queryPagerXzrw(params).then((res) => {
      setMasker(false);
      const { body, code } = res;
      if (code === '200' && body) {
        setGridData(body.rows);
      }
    })
  };

  // 开启
  const showModal = (param: any) => {
    // 报关单下载弹窗列表查询
    getGridData();
    // 报关单下载弹窗查询口岸卡密码
    setMasker(true);
    queryKakPassword({}).then((res) => {
      setMasker(false);
      const { body, code } = res;
      if (code === '200' && body) {
        form.setFieldsValue({
          kakmm: body.kakmm,
          uuid: body.uuid
        })
      }
    })

    setModalVisible(true);
  };

  // 重新检测
  const cxjcBtn = () => {
    const kakmm = form.getFieldValue('kakmm');
    const uuid = form.getFieldValue('uuid');
    if (!kakmm) {
      message.info('请输入海关IC卡密码');
      return;
    }
    setMasker(true);
    saveKakPassword({ kakmm, uuid }).then(async (res) => {
      const { body, code } = res;
      setMasker(false);
      if (code === '200') {
        setMasker(true);
        const { jcbz, msg } = await khdgjUtil.khdgjJc(body);
        setMasker(false);
        setJcbz(jcbz);
        message.info(msg);
        if (jcbz != 'Y') {
          setJcMsg(msg);
        }
      } else if (code === '900') {
        message.info(res.msg);
      } else {
        message.error(res.msg);
      }
    })
  };

  // 工具下载
  const gjxzBtn = async () => {
    setMasker(true)
    let a=document.createElement('a') ;//创建一个a标签元素
    a.style.display='none'  ;//设置元素不可见
    a.href='https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
    document.body.appendChild(a)  ;//加入
    a.click(); //触发点击,下载
    document.body.removeChild(a) ;//释放 
    setMasker(false)
  };

  // 申请下载
  const sqxzBtn = () => {
			// 判断口岸卡密码是否修改过
			if (jcbz == 'N' || jcbz == 'ND') {
        message.info('请进行工具检测');
				return;
			}
      const ckrq = form.getFieldValue('ckrq');
      const bgdh = form.getFieldValue('bgdh');
      let param = {};
			if (bgdh) {
				if (bgdh.length != 18) {
          message.info('请输入18位报关单号');
					return;
				}
				param = { csz1: bgdh };
			} else if (ckrq) {
        const ckrqStart = moment(ckrq[0]).format('YYYY-MM-DD');
        const ckrqEnd= moment(ckrq[1]).format('YYYY-MM-DD');
				const timec = myUtil.date.compareTime(12, ckrqStart, ckrqEnd)
				if (!timec) {
          message.info('日期间隔不能超过1年！');
					return;
				}
				param = { csz1: ckrqStart, csz2: ckrqEnd };
			} else {
        message.info('请输入出口货物报关单下载条件！');
				return;
			}
      setMasker(true);
      sqxz(param).then(async (res) => {
        const { body, code } = res;
        setMasker(false);
        if (code === '200') {
          await khdgjUtil.khdgjGdxz(body);
          // 报关单下载弹窗列表刷新
          getGridData();
        } else if (code === '900') {
          message.info(res.msg);
        } else {
          message.error(res.msg);
        }
      })
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Modal
      title="关单获取"
      open={modalVisible}
      wrapClassName='standard-modal-1'
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      onCancel={() => setModalVisible(false)}
      footer={(<>
        <Button onClick={() => setModalVisible(false)} type="default">关闭</Button>
      </>)}
      mask={{ closable: false }}
    >
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <Form
        form={form}
        name="form"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Row>
          <Col span={10}>
            <Form.Item name="kakmm" label="海关IC卡密码">
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item label="工具运行状态">
              <span style={{ fontSize: '18px'}}>
                {
                  jcbz === 'Y' ?
                    <Tooltip title="工具检测通过">
                      <CheckCircleOutlined style={{ color: '#52c41a' }}/>
                    </Tooltip> :
                  jcbz === 'N' ?
                    <Tooltip title={jcMsg}>
                      <CloseCircleOutlined style={{ color: '#ff4d4f' }}/>
                    </Tooltip> :
                    <Tooltip title="请进行工具检测">
                      <ExclamationCircleOutlined style={{ color: '#FFB800'}}/>
                    </Tooltip>
                }
              </span>
              <Button onClick={() => cxjcBtn()} type="link">重新检测</Button>
              <Button onClick={() => gjxzBtn()} type="link">工具下载</Button>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Radio.Group onChange={onChangeRadio} value={valRadio} style={{ marginLeft: '24px' }}>
              <Space direction="horizontal">
                <Radio value={'1'}>
                  <Form.Item name="ckrq" label="出口日期" labelCol={{ span: 5 }} wrapperCol={{ span: 24 }}>
                    <DatePicker.RangePicker style={{ width: '300px'}} disabled={valRadio === '2'} />
                  </Form.Item>
                </Radio>
                <Radio value={'2'}>
                  <Form.Item name="bgdh" label="报关单号" labelCol={{ span: 5 }} wrapperCol={{ span: 24 }}>
                    <Input placeholder="请输入报关单号" style={{ width: '300px'}} disabled={valRadio === '1'} />
                  </Form.Item>
                </Radio>
              </Space>
            </Radio.Group>
            <Button onClick={() => sqxzBtn()} type="primary">申请下载</Button>
          </Col>
        </Row>
      </Form>
      <DDBaseGrid
        queryParam={{}}
        userDataSource={gridData}
        columns={getColumns()}
        showSerialNumber
        pagination={{
          current: 1,
          pageSize: 10,
          total: 0,
          hideOnSinglePage: true,
          showSizeChanger: true,
          showQuickJumper: false,
          showTotal(total: any, range: any[]) {
            return `共${total}条，当前${range[0]}到${range[1]}条`;
          },
        }}
      />
    </Spin>
    </Modal>
  );
};

export default ModalList;
