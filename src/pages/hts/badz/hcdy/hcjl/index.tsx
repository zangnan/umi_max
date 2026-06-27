/**
 * title: 备案单证-核查调阅-核查记录
 * author: mfc
 */
import cktsUtil from '@/pages/hts/cktsUtil';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import React, { useState, useRef } from 'react';
import { useIntl } from 'umi';
import hcjlFunc from './f';
import config from "./config";
import { Modal, Button, Form, Radio, Space, Input, Upload, Tooltip, message, Select, Spin } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { QuestionCircleOutlined, ClockCircleOutlined, InboxOutlined } from "@ant-design/icons";
import style from "@/pages/hts/badz/badzsz/jcsz/style.less";
import businessValidator from '@/pages/hts/common/field/businessValidator';
import myUtil, { intl as intl2 } from '@/components/DDAssist/util';
import { hcdyHcrwCjrw, hcrwAbgdcjrwbgd} from "@/pages/hts/services/htsApi";
import { importTemplate } from '@/pages/hts/services/htsApi';
import DyBadzViewer from "@/pages/hts/badz/badzcommon/dyBadzViewer";
import importStyle from './importStyle.less';

const { Dragger } = Upload;

export type ActionType = {
  reload: () => void;
}

export type ScsbsjProps = {
  ywKey?: any;
}

const Index: React.FC<ScsbsjProps> = ({
  ywKey = 'MDT',
}) => {
  const [masker, setMasker] = useState(false);
  const dyRef: any = useRef();
  const myConfig = { ...config }
  // 区分生产外贸
  const qylx = cktsUtil.sys.enterpriseType();
  // 取企业类型，生产SC， 外贸WM
  if (qylx === 'WM') {
    myConfig.grid_columns[1].codeTable = ['CODE_WM_CS_ZXSB_LCSWSX', '01'];
    myConfig.grid_columns[1].filter = { type: 'Radio', codeTable: 'CODE_WM_CS_ZXSB_LCSWSX:01' };
    myConfig.grid_columns[3].hidden = false;
    myConfig.filter_items = [
      { name: 'ssq', label: '所属期', type: 'Input' },
      { name: 'sbpc', label: '批次', type: 'Input' },
      { name: 'bswjscztDm', label: '生成状态', type: 'Select', codeTable: 'CODE_DM_ZXSB_BSWJSCZT:01' },
    ];
  } else {
    myConfig.grid_columns[1].codeTable = ['CODE_SC_CS_ZXSB_LCSWSX', '01'];
    myConfig.grid_columns[1].filter = {};
    myConfig.grid_columns[3].hidden = true;
    myConfig.filter_items = [
      { name: 'ssq', label: '所属期', type: 'Input' },
      { name: 'bswjscztDm', label: '生成状态', type: 'Select', codeTable: 'CODE_DM_ZXSB_BSWJSCZT:01' },
    ];
  }
  const [myflag, setMyflag] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [param, setParam] = useState<any>();

  hcjlFunc.init = useIntl();
  const [form] = Form.useForm();

  hcjlFunc.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(dyRef);
    return otherRef;
  };

  // 创建任务
  hcjlFunc.cjrw = (param: any) => {
    form.resetFields();
    setMyflag(true);
    setParam(param);
    setModalVisible(true);
  };
  const onChangeByzy = (e: any) => {
    if (e.target.value == 'N') {
      setMyflag(false);
    } else {
      setMyflag(true);
    }
  }
  const save = () => {
    form.validateFields().then((values: any) => {
      if (values.assqpchcbz === 'N') {
        if (values.fjxx == undefined) {
          message.info(intl2.formatMessage({ id: 'message_mdts_no_data_file' }));
          return;
        }
        let fileName = values.fjxx[0].name;
        // 上传文件校验
        if (!fileName.toUpperCase().endsWith(".XLS") && !fileName.toUpperCase().endsWith(".XLSX")) {
          message.info(intl2.formatMessage({ id: 'message_common_type_excle' }));
          return;
        }
      }
      const { unitRef } = param;
      unitRef.current?.setMasker(true);
      setMasker(true)
      const data = new FormData();
      let obj;
      if (values.assqpchcbz === 'Y') {
        obj = {
          assqpchcbz: values.assqpchcbz,
          ssq: values.ssq,
          sbpc: values.sbpc,
          lcswsxDm: qylx === 'WM' ? values?.lcswsxDm : 'LCSXA081038001',
        }
        
        // 创建核查任务保存
        hcdyHcrwCjrw(obj).then((response) => {
          setMasker(false)
          const { code } = response;
          if (code === '200') {
            setModalVisible(false);
            unitRef.current!.reload2();
            message.success(intl2.formatMessage({ id: 'message_badz_hcdy_hcrw_success' }));
          } else if (code === '900') {
            message.info(response.desc);
          } else {
            message.error(intl2.formatMessage({ id: 'message_badz_hcdy_hcrw_fail' }));
          }
        });
      } else {
        data.append('ssq', values.ssq);
        data.append('assqpchcbz', values.assqpchcbz);
        data.append('lcswsxDm', qylx === 'WM' ? values.lcswsxDm : 'LCSXA081038001');
        if (values.fjxx && values.fjxx[0].originFileObj) {
          data.append('file', values.fjxx ? values.fjxx[0].originFileObj : '');
        }
        if (values.sbpc) {
          data.append('sbpc', values.sbpc);
        }
        obj = data;
        // 创建核查任务保存
        hcrwAbgdcjrwbgd(obj).then((response) => {
          setMasker(false)
          const { code, desc } = response;
          if (code === '200') {
            setModalVisible(false);
            unitRef.current!.reload2();
            message.success(intl2.formatMessage({ id: 'message_badz_hcdy_hcrw_success' }));
          } else if (code === '900') {
            const html: any = [];
            desc?.forEach((item: any, index: any) => {
              html.push(<span className="item" key={index}>{item}<br /></span>);
            });
            message.info(<>{html}</>);
          } else {
            message.error(intl2.formatMessage({ id: 'message_badz_hcdy_hcrw_fail' }));
          }
        }).catch(() => {
          message.error('导入失败，请重新上传文件。');
        }).finally(() => {
          setMasker(false);
        });
      }
      unitRef.current?.setMasker(false);
    });
  }
  // 模板下载
  const handleExcelXz = () => {
    const data = {
      key: "ZXSB_BADZ_DZHC_MX_EXCEL",
    }
    importTemplate(data).then((response: any) => {
      if (response.code === '200') {
        const { blob, fileName } = response.body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(response.desc);
      }
    })
  };

  const onSearch = async (param: any) => {
    let val = await form.getFieldValue('sbpc');
    if(val === 0 || val === "0" || val === "00" ||  val === "000") {
      val = "001"
    } else if(val){
      val = myUtil.text.leadingZeroize(val, 3);
    } else {
      val = "";
    }
    form.setFieldsValue({sbpc:val});
  };

  const beforeUpload = (file: any) => {
    if(!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('上传文件必须是Excel文件。');
      return Upload.LIST_IGNORE;
    }
    return false;
  }

  return (
    <>
      <DDBunit2 config={myConfig} func={hcjlFunc} />
      <DyBadzViewer onRef={dyRef} />
      <Modal
        title="创建核查任务"
        destroyOnHidden={true}
        visible={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        footer={
          <>
            <Button onClick={() => setModalVisible(false)}>取消</Button>
            <Button key={'excelmbxz'} onClick={handleExcelXz} >Excel模板下载</Button>
            <Button type="primary" onClick={() => save()}>确定</Button>
          </>
        }
        onCancel={() => setModalVisible(false)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <div className={style.groupTit}>1、确认核查所属期</div>
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            {qylx === "WM" ?<Form.Item label="业务事项" name="lcswsxDm" rules={[{ required: true, message: '请选择业务事项' }]} initialValue="LCSXA081039001" >
              <Select>
                <Select.Option value="LCSXA081039001">免退税申报</Select.Option>
                <Select.Option value="LCSXA081040001">代办退税申报</Select.Option>
              </Select>
            </Form.Item> :
            <></>}
            <Form.Item label="所属期" name="ssq" rules={[{ required: true, message: '' },businessValidator.ssq()]}  >
              <Input placeholder="请输入所属期" />
            </Form.Item>
            {qylx === "WM" ? <Form.Item label="批次" name="sbpc" rules={[{ required: true, message: '' }, businessValidator.sbpc()]}  >
              <Input placeholder="请输入批次" onBlur ={onSearch} maxLength={3} />
            </Form.Item> : 
            <></>}
            <div className={style.groupTit}>2、选择核查数据范围</div>
            <Form.Item initialValue={'Y'} name="assqpchcbz" wrapperCol={{ offset: 6, span: 18 }}>
              <Radio.Group onChange={onChangeByzy}>
                <Space direction="vertical">
                  <Radio value={'Y'}>{qylx == 'WM' ? '核查该所属期批次下所有数据' : '核查该所属期下所有数据' }</Radio>
                  <Radio value={'N'}>按导入的核查清单进行核查&nbsp;
                    <span><Tooltip title={qylx == 'WM' ? "导入核查清单后，本次将按照核查清单中对应该所属期批次的内容进行核查" : "导入核查清单后，本次将按照核查清单中对应该所属期的内容进行核查"}><QuestionCircleOutlined /></Tooltip></span>
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="导入Excel文件" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name="fjxx" valuePropName="fileList" getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }} >
              <Dragger
                maxCount={1}
                showUploadList={true}
                beforeUpload={beforeUpload}
                disabled={myflag}
                itemRender={(originNode, file, currFileList, actions: { download: any, preview: any, remove: any }) => (
                  <table className={importStyle.importTable}>
                    <tr>
                      <th>文件名</th>
                      <th>文件大小</th> 
                      <th>状态</th>
                      <th>操作</th>
                    </tr>
                    <tr>
                      <td width='45%' className={importStyle.textCenter}>
                        <Tooltip title={file.name}>
                          <div className={importStyle.textName}>{file.name}</div>
                        </Tooltip>
                      </td>
                      <td width="20%" className={importStyle.textCenter}>{myUtil.text.formatNum(file.size?(file.size/1024):0, '0,0')}KB</td>
                      <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined />&nbsp;待上传</td>
                      <td width="17%" className={importStyle.textCenter}><a onClick={()=>actions.remove()}>删除</a></td>
                    </tr>
                  </table>
                )}
              >
                <p className="ant-upload-drag-icon">
                  {myflag ? <InboxOutlined style={{color: '#DDD'}} /> : <InboxOutlined />} 
                </p>
                <p className="ant-upload-text" style={{height: '25px'}}>{myflag ? ' ' :'点击或将文件拖拽到此区域'}</p>
              </Dragger>  
            </Form.Item>
          </Form>
        </Spin>
      </Modal >
    </>
  );
};

export default Index;
