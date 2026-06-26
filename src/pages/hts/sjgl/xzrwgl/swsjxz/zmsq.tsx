import cktsUtil from '@/pages/hts/cktsUtil';
import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Button, Form, Space, Input, message, Checkbox, Tooltip, Spin, Popover, DatePicker, Row, Upload } from 'antd';
import ProCard from '@ant-design/pro-card';
import { ycsbYzfFkxzSq } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import getStaticTableCode from '@/pages/hts/commonModule/staticTableCode';
import './style.less';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import { history, useIntl, useAccess } from 'umi';
import { shfkdr2, shfkdr2Check } from '@/pages/hts/services/htsApi';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import importStyle from './importStyle.less';
import moment from 'moment';
import qxUtil from '@/pages/hts/common/qxUtil';
import Tsxx from '../../../ckts/scsbsj/tsxx';

const errorMsgRef: any = React.createRef();

const { Dragger } = Upload;

export type ActionType = {
  reload: (resetPageIndex?: boolean) => void;
}
export interface DDModalGridProps {
  onRef?: any;

}
const Hgdzxzjy: React.FC<DDModalGridProps> = ({ onRef }) => {
  const [form] = Form.useForm();
  //下载按钮是否显示
  const [masker, setMasker] = useState(false);
  const [codeList, setCodeList] = useState([]);
  const [qylx, setQylx] = useState<any>('');
  const [ywlxDm, setYwlxDm] = useState<any>([]);
  const intl = useIntl();
  const access = useAccess(); // 权限
  useEffect(() => {
    const qylx = cktsUtil.sys.enterpriseType();
    setQylx(qylx);
    let code = '';
    if ('WM' == qylx) {
      code = getStaticTableCode('code_static_fldm_ywlx_zm', '02');
    } else {
      code = getStaticTableCode('code_static_fldm_ywlx_zm', '01');
    }
    setYwlxDm(['030204']);
    const temp1 = code.body;
    // 金四地区没有代理进口依职权反馈
    if (qxUtil.getZy({ zycode: 'S_000001_000001', accessObj: access, })) {
      for (let index = 0; index < temp1.length; index++) {
        if (temp1[index].value === '030202') {
          temp1.splice(index, 1);
        }
      }
    }
    setCodeList(temp1);
  }, []);

  // 表单布局
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  // 表单布局
  const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
  };

  const onChange = (param: any) => {
    setYwlxDm(param);
  }



  // 单证下载
  const downloadSj = async () => {
    const formValues = await form.validateFields();
    setMasker(true);
    const params = { ...formValues };
    params.sjgjsjDms = ywlxDm;
    ycsbYzfFkxzSq(params).then(async (response: any) => {
      setMasker(false);
      const { code, msg, body, desc } = response;
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


  // 配置项：反馈读入
  const shfkdr = () => {
    const beforeUpload = (file: any) => {
      if (!file.name.toUpperCase().endsWith(".XML")) {
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
                  <td width="20%" className={importStyle.textCenter}>{myUtil.text.formatNum(file.size ? (file.size / 1024) : 0, '0,0')}KB</td>
                  <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined />&nbsp;待上传</td>
                  <td width="17%" className={importStyle.textCenter}><a onClick={() => actions.remove()}>删除</a></td>
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
          if (cktsUtil.sys.enterpriseType() == 'WM') {
            formData.append('cdDm', '02020404');
          } else {
            formData.append('cdDm', '02020402');
          }
          shfkdr2Check(formData).then((res1) => {
            thisObj.setState({ masker: false });
            if (res1.code === '200') {
              // DDAlert.close();
              // thisObj.setState({ masker: true });
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
            } else if (res1.code === '901') {
              errorMsgRef.current!.showModal(res1.body, '901', formData, '1');
              DDAlert.close();
            } else if (res1.code === '902') {
              errorMsgRef.current!.showModal(res1.body, '902', formData, '1');
              DDAlert.close();
            } else {
              message.error(res1.msg);
            }
          });
        });
      },
    });
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

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_hgdzxzjy" >
        <ProCard style={{ height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', 'footerBtn']), overflowY: 'auto' }}>
          <div className='groupTit'>数据下载</div>
          <Form form={form} {...layout} >
            <Form.Item name='sjgjsjDms' valuePropName="checked" label="业务类型"
              rules={[
                () => ({
                  validator(_, value) {
                    if (value && value.length <= 0) {
                      return Promise.reject(new Error('业务类型至少选中一项！'));
                    }
                    return Promise.resolve();
                  },
                })
              ]}
            >
              <Checkbox.Group options={codeList} defaultValue={['030204']} onChange={onChange} />
            </Form.Item>
            <Form.Item name="ssq" rules={[{ required: true, message: '请输入6位申报年月' },
            () => ({
              validator(_, value) {
                if (value) {
                  const temp1 = (!value.match(/^[2]\d{3}(0[1-9]|1[0-2])$/)); // YYYYMM
                  const nowYear = moment().format("YYYY");
                  const valueYear = value.substring(0, 4)
                  if (temp1) {
                    return Promise.reject(new Error('请输入正确的格式'));
                  }
                  if (Number(valueYear) > Number(nowYear)) {
                    return Promise.reject(new Error('超过当前年份'));
                  }
                  return Promise.resolve();
                }
                return Promise.resolve();
              },
            })
            ]}  {...tailLayout}>
              <Input placeholder="请输入6位申报年月" style={{ width: 260 }}></Input>
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
