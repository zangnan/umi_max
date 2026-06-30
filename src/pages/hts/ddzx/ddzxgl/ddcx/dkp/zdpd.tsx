/**
 * title: 角色管理-新增/修改角色
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Spin, Button, Table, Modal, message, Tooltip, Drawer, Radio, Form, Input } from 'antd';
import { scmx, downloadTemplate } from '@/pages/hts/services/htsApi';
import ProCard from '@ant-design/pro-card';
import businessValidator from '@/pages/hts/common/field/businessValidator';
import myUtil from '@/components/DDAssist/util';
import {  CloseCircleOutlined, CheckCircleFilled} from '@ant-design/icons';
import DDAlert from '@/pages/hts/components/DDAlert';
import { history } from 'umi';

export interface BdjgProps {
  onRef?: any;
}

const ModalForm: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [key, setKey] = useState('');
  const [unitRef, setUnitRef] = useState();
  const [body, setBody] = useState({});
  const [ckn, setCkn] = useState('');
  const [flag, setFlag] = useState('N');



  // 开启
  const showModal = async (key: any, unitRef: any, body: any,ckny:any) => {
    setModalVisible(true);
    setKey(key);
    setUnitRef(unitRef);
    setBody(body);
    setCkn(ckny);
    for (let index = 0; index < body?.pdmxList.length; index++) {
      const element = body?.pdmxList[index];
      if(element.pdjgbz === 'Y'){
        setFlag('Y');
        break;
      }
      
    }
  };

  const dcByParams = () => {
    const param = {
      key: "EXPORT_DDZX_DDGL_DKPDD_ZDPD_JGDC",
      sfBhsj :'Y',
      searchModel:[{property: "pduuid", value: body?.pdmxList[0].pduuid, op: "zdy"}]
    };
    setMasker(true);
    downloadTemplate(param).then((response) => {
      setMasker(false);
      const { code, body, desc } = response;
      DDAlert.close();
      if (code === '200') {
        const { blob, fileName } = body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(desc);
      }
    })
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const close = () => {
    unitRef?.current?.reload2();
    setModalVisible(false);
    setBody({});
    setCkn('');
    setFlag('N');
  }

  

  const scmxFunc = () => {
    DDAlert.open({
      title: '生成明细',
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      content: <>
        <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="所属期" name="ssq" rules={[businessValidator.ssq()]}>
          <Input placeholder="请输入所属期"  />
        </Form.Item>
        <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="申报批次" name="sbpc" rules={[ businessValidator.sbpc(),]}  >
          <Input placeholder="请输入申报批次"  maxLength={3} />
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then(async (values: any) => {
          if(ckn != values.ssq.substring(0,4)){
            message.info('所属期与出口日期非同一年度，请确认！');
            return;
          }
          let khsbywlxDm = '1';
          if (history?.location?.pathname === '/40/4002/400204/40020401') {
            khsbywlxDm = '3';
          }
          const param = {"pduuid":body?.pdmxList[0].pduuid,"ssq":values.ssq,"sbpc":values.sbpc, "khsbywlxDm":khsbywlxDm};
          thisObj.setState({ masker: true });
          await scmx(param).then((response :any) => {
            thisObj.setState({ masker: false });
            if(response.code == '200'){
              message.success('生成明细成功！');
              DDAlert.close();
              close();
            }else{
              message.error(response.msg);
            }
          });
        });
      }
    })
  }
  
  // 配比平衡配置列
  const pbphColumns = [
    {
      title: '配单结果', dataIndex: 'pdjgbz', width: 100, ellipsis: { showTitle: false }, align: 'center', render: (text: any) => {
        if (text == 'Y') {
          return <div style = {{color :'#52C41A'}}><CheckCircleFilled /></div>
        }
        return <div style = {{color :'#F5212D'}}><CloseCircleOutlined /></div>
      }
    },
    {
      title: '工厂', dataIndex: 'hzdwmc', width: 200, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '出口日期', dataIndex: 'ckrq1', width: 100, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <div> {myUtil.grid.formatDate(text, 'YYYY-MM-DD')} </div>
        }
        return '';
      }
    },
    {
      title: '报关合同号', dataIndex: 'ckhth', width: 150, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '报关单号', dataIndex: 'bgdhgbh', width: 150, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '项号', dataIndex: 'hwxh', width: 60, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '品名', dataIndex: 'hgspmc', width: 100, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '出口数量', dataIndex: 'sbsl1', width: 100, ellipsis: { showTitle: false }, align: 'right', render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {myUtil.grid.formatNum(text, '0, 0.0000')} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '成交单位', dataIndex: 'sbjldwmc', width: 100, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '美元金额', dataIndex: 'mylaj', width: 100, ellipsis: { showTitle: false }, align: 'right', render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {myUtil.grid.formatNum(text, '0, 0,0.00')}  </Tooltip>
        }
        return '';
      }
    },
    {
      title: '美元汇率', dataIndex: 'myhl', width: 100, ellipsis: { showTitle: false }, align: 'right',  render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {myUtil.grid.formatNum(text, '0, 0.00000')}  </Tooltip>
        }
        return '';
      }
    },
    {
      title: '不含税金额', dataIndex: 'rmblaj', width: 100, ellipsis: { showTitle: false }, align: 'right', render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {myUtil.grid.formatNum(text, '0, 0,0.00')}  </Tooltip>
        }
        return '';
      }
    },
    {
      title: '开票月份', dataIndex: 'kprq', width: 90, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {myUtil.grid.formatDate(text, 'yyyyMM')} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '发票代码', dataIndex: 'fpDm', width: 120, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '发票号码', dataIndex: 'fphm', width: 180, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    {
      title: '行号', dataIndex: 'hh', width: 90, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
    		
    {
      title: '失败原因', dataIndex: 'pdsblxsm', width: 220, ellipsis: { showTitle: false }, render: (text: any) => {
        if (text) {
          return <Tooltip placement="topLeft" title={text}> {text} </Tooltip>
        }
        return '';
      }
    },
  ]


  return (
    <Modal
      title='自动配单'
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      onCancel={() => close()}
      footer={(<>
        <Button onClick={() => dcByParams()} type="primary">导出</Button>
        <Button onClick={() => scmxFunc()} type="default" disabled={flag=='Y'?false:true}>生成明细</Button>
      </>)}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        配单完成，本次配单成功{body?.cgts}条，配单失败{body?.sbts}条！
      </Spin>
      <ProCard>
        <Table
          rowKey='uuid'
          size='small'
          dataSource={body?.pdmxList}
          columns={pbphColumns}
          pagination={false}
          bordered
          scroll={{ x: '700px', y: `${document.documentElement.clientHeight - 174}px` }}
        />
      </ProCard>
    </Modal>
  );
};

export default ModalForm;
