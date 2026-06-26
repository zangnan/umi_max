import React, { useState, useEffect } from 'react';
import { Button, Form, Space, Input, message, Checkbox, Tooltip, Spin, Upload } from 'antd';
import ProCard from '@ant-design/pro-card';
import {ycsbYzfFkxzSq } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import getStaticTableCode from '@/pages/hts/commonModule/staticTableCode';
import './style.less';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import { history, useIntl } from 'umi';
import { shfkdr2, shfkdr2Check } from '@/pages/hts/services/htsApi';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import businessValidator from '@/pages/hts/common/field/businessValidator';
import importStyle from './importStyle.less';
import moment from 'moment';
import { intl as intl2 } from '@/components/DDAssist/util';
import Tsxx from '../../../ckts/scsbsj/tsxx';

const { Dragger } = Upload;
const errorMsgRef: any = React.createRef();

export type ActionType = {
  reload: (resetPageIndex?: boolean) => void;
}
export interface DDModalGridProps {
  onRef?: any;

}
const Hgdzxzjy: React.FC<DDModalGridProps> = ({ onRef}) => {
  const [form] = Form.useForm();
  //下载按钮是否显示
  const [masker, setMasker] = useState(false);
  const [codeList, setCodeList] = useState([]);
  const [codeList2, setCodeList2] = useState([]);
  const [sjgjsjDms, setSjgjsjDms] = useState<any>([]);
  const [sjgjsjDms2, setSjgjsjDms2] = useState<any>([]);

  const intl = useIntl();
  const [flag, setFlag] = useState(true);
  const [jhpzFlag, setJhpzFlag] = useState(true);


  useEffect(() => {
    let code = getStaticTableCode('code_static_fldm_ywlx_qtsb', '01');
    let code2 = getStaticTableCode('code_static_fldm_ywlx_qtsb', '02');
    setSjgjsjDms(['030401']);
    setCodeList(code.body);
    setCodeList2(code2.body);

  }, []);

  // 表单布局
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 19,
        offset: 5,
      },
    },
  };


  const onChange = (param: any) => {
    if(flag){
      setFlag(false);
    }else{
      setFlag(true);
    }
    setSjgjsjDms(param);
  }
  const onChange2 = (param: any) => {
    if(jhpzFlag){
      setJhpzFlag(false);
    }else{
      setJhpzFlag(true);
    }
    setSjgjsjDms2(param);
  }

  // 配置项：反馈读入
  const shfkdr = () => {
    const beforeUpload = (file: any) => {
      if(!file.name.toUpperCase().endsWith(".XML")) {
        message.info('上传文件必须是XML文件。');
        return Upload.LIST_IGNORE;
      } else {
        return false;
      }
    }
    DDAlert.open({
      title: '反馈读入',
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      width: 720,
      content: <>
        <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="文件选择" name="file" valuePropName="fileList" rules={[{ required: true, message: '请选择上传的文件' }]} getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
          <Dragger
            maxCount={1}
            showUploadList={true}
            beforeUpload={beforeUpload}
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
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或将文件拖拽到此区域</p>
          </Dragger>
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          const formData = new FormData();
          formData.append('fileName', values.file[0].originFileObj);
          formData.append('file-name-suffix', values.file[0].name);
          formData.append('cdDm', '02020405');
          shfkdr2Check(formData).then((res1) => {
            thisObj.setState({ masker: false });
            if (res1.code === '200') {
              // thisObj.setState({ masker: true });
              // DDAlert.close();
              // shfkdr2(formData).then((res) => {
              //   const { code, body, msg } = res;
              //   DDAlert.close();
              //   if (code === '200') {
              //     thisObj.setState({ masker: false });
              //     message.success(body);
              //   } else {
              //     thisObj.setState({ masker: false });
              //     message.error(msg);
              //   }
              // });
              DDAlert.close();
              drcgTz();
            } else if(res1.code === '901') {
              errorMsgRef.current!.showModal(res1.body,'901',formData,'1');
              DDAlert.close();
            }else if(res1.code === '902') {
              errorMsgRef.current!.showModal(res1.body,'902',formData,'1');
              DDAlert.close();
            }else{
              message.error(res1.msg);
            }
          });
        });
      },
    });
  }


  // 单证下载
  const downloadSj = async () => {
    const formValues =  await form.validateFields();
    setMasker(true);
    const dms = [];
    if(sjgjsjDms && sjgjsjDms.length>0){
      dms.push(sjgjsjDms[0]);
    }
    if(sjgjsjDms2 && sjgjsjDms2.length>0 ){
      dms.push(sjgjsjDms2[0]);
    }
    const params = {...formValues};
    params.sjgjsjDms = dms;
    ycsbYzfFkxzSq(params).then(async (response: any) => {
      setMasker(false);
      const { code, desc ,body} = response;
      if (code == '200') {
        setMasker(false);
        DDAlert.open({
          title: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_title' }),
          info: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_info' }),
          infoType: 'success',
          content: [
            intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_content_xzrw' }),
          ],
          okText: '转任务管理',
          okCallbackFn: function () {
            history.push('/02/0201');
          }
        });
      } else {
        setMasker(false);
        message.info(desc);
      }
    })
  }

  const drcgTz = () => {
    DDAlert.open({
      title: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_title' }),
      info: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_info' }),
      infoType: 'success',
      content: [
        intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_content_xzrw' }),
      ],
      okText: '转任务管理',
      okCallbackFn: function () {
        history.push('/02/0201');
      }
    });
  }

  const sbxxChange = (e: any) => {
    let sbpc = e.target.value;
    if(sbpc == "0") {
      form.setFieldsValue({jhpzhtSbpc: '001'});
    } else {
      form.setFieldsValue({jhpzhtSbpc: myUtil.text.leadingZeroize(sbpc, 3)});
    }
  }

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_hgdzxzjy" >
        <ProCard style={{ height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', 'footerBtn']), overflowY: 'auto' }}>
          <div className='groupTit'>数据下载</div>
          <Form form={form} {...layout} >
          <Form.Item name='sjgjsjDms' valuePropName="checked" {...tailFormItemLayout}
              rules={sjgjsjDms.length ==0 && sjgjsjDms2.length ==0 ?  [
                () => ({
                  validator(_, value) {
                    if (value && value.length <= 0) {
                      return Promise.reject(new Error('业务类型至少选中一项！'));
                    }
                    return Promise.resolve();
                  },
                })
              ]:[]}

            >
               <Checkbox.Group options={codeList} defaultValue={['030401']}  onChange={onChange}/>
            </Form.Item>
            <Form.Item name="ssq" {...tailFormItemLayout} rules={sjgjsjDms.length ==0?[]:[{ required: true, message: '请输入4位申报年或6位申报年月'},
                () => ({
                  validator(_, value) {
                    if (value) {
                      const temp1 = (!value.match(/^[2]\d{3}(0[1-9]|1[0-2])$/)); // YYYYMM
                      const temp2 = (!value.match(/^[2]\d{3}$/)); // YYYY
                      const nowYear = moment().format("YYYY");
                      const valueYear = value.substring(0, 4)
                      if (temp1 && temp2) {
                        return Promise.reject(new Error('请输入正确的格式'));
                      }
                      if(Number(valueYear) > Number(nowYear)) {
                        return Promise.reject(new Error('超过当前年份'));
                      }
                      return Promise.resolve();
                    }
                    return Promise.resolve();
                  },
                })
              ]} >
              <Input disabled={!flag} placeholder="请输入4位申报年或6位申报年月" style={{ width: 260 }}></Input>
            </Form.Item>
            <Form.Item name='sjgjsjDms' valuePropName="checked" {...tailFormItemLayout}
              rules={sjgjsjDms.length ==0 && sjgjsjDms2.length ==0 ?  [
                () => ({
                  validator(_, value) {
                    if (value && value.length <= 0) {
                      return Promise.reject(new Error('业务类型至少选中一项！'));
                    }
                    return Promise.resolve();
                  },
                })
              ]:[]}
            >
              <Checkbox.Group options={codeList2} onChange={onChange2}/>
            </Form.Item>
            <Form.Item  name="jhpzhtSsq" {...tailFormItemLayout} rules={sjgjsjDms2.length ==0?[]:[{ required: true, message: '' },
              () => ({
                validator(_, value) {
                  if (value) {
                    const temp1 = (!value.match(/^[2]\d{3}(0[1-9]|1[0-2])$/)); // YYYYMM
                    const nowYear = moment().format("YYYY");
                    const valueYear = value.substring(0, 4)
                    if (temp1) {
                      return Promise.reject(new Error('请输入正确的格式'));
                    }
                    if(Number(valueYear) > Number(nowYear)) {
                      return Promise.reject(new Error('超过当前年份'));
                    }
                    return Promise.resolve();
                  }
                  return Promise.resolve();
                },
              })
            ]} >
              <Input disabled={jhpzFlag} placeholder="请输入6位申报年月" style={{ width: 260 }}></Input>
            </Form.Item>
            <Form.Item name="jhpzhtSbpc" {...tailFormItemLayout} rules={sjgjsjDms2.length ==0?[]:[{ required: true, message: '' },
              () => ({
                validator(_, value) {
                  if (value) {
                    if (!value.match(/^\d+$/)) {
                      return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_number' })));// '该项内容只能输入数字！'
                    }
                    return Promise.resolve();
                  }
                  return Promise.resolve();
                },
              })
            ]}
            >
              <Input disabled={jhpzFlag} placeholder="请输入申报批次" style={{ width: 260 }} onBlur= {sbxxChange} ></Input>
            </Form.Item>
          </Form>
        </ProCard>
        <ProCard className="ddlf01_footer">
          <Space>
            <Button type='primary' onClick={() => { downloadSj() }}>数据下载</Button>
            <Button type='primary' onClick={() => { shfkdr() }}>反馈读入</Button>
          </Space>
        </ProCard>
      </ProCard>
      <Tsxx onRef={errorMsgRef} />
    </Spin>
  );
};

export default Hgdzxzjy;
