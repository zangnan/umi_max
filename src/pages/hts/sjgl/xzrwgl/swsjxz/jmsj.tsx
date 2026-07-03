import { intl } from '@/components/DDAssist/util';
import React, { useState } from 'react';
import { Button, Form, Space, message, DatePicker, Upload, Radio, Spin, Tooltip } from 'antd';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import { history } from 'umi';
import DDAlert from '@/pages/hts/components/DDAlert';
import { ycsbsjxz } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import { shfkdr2, shfkdr2Check } from '@/pages/hts/services/htsApi';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import importStyle from './importStyle.less';
import Tsxx from '../../../ckts/scsbsj/tsxx';

const { Dragger } = Upload;
const errorMsgRef: any = React.createRef();

export type ActionType = {
  reload: (resetPageIndex?: boolean) => void;
}

const Swfkjsxzjy: React.FC<unknown> = () => {
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const [masker, setMasker] = useState(false);
  const [hackValue, setHackValue] = useState<any>();
  const [value, setValue] = useState<any>();
  const [dates, setDates] = useState<any>();
  // const intl = useIntl();

  // 表单项目测试数据
  const itemList2 = [
    { value: '1', name: '一年' },
    { value: '2', name: '两年' },
    { value: '3', name: '三年' },
  ];
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
        formData.append('cdDm', '02020406');
        shfkdr2Check(formData).then((res1) => {
          thisObj.setState({ masker: false });
          if (res1.code === '200') {
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

  // 最大范围选择5年
  const disabledDate = (current: any) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'years') > 4;
    const tooEarly = dates[1] && dates[1].diff(current, 'years') > 4;
    return tooEarly || tooLate;
  };


  const onOpenChange = (open: any) => {
    if (open) {
      setHackValue([]);
      setDates([]);
    } else {
      setHackValue(undefined);
    }
  }

  const defaultRangeData = () => {
    return [moment(myUtil.date.getYearBeforeCurr(1), 'YYYY'), moment(myUtil.date.getYearBeforeCurr(1), 'YYYY')];
  }

  //时间选取
  const handleSelectTime = (values: any, formatString: [string, string]) => {
    if (formatString[0] == myUtil.date.getYearBeforeCurr(1) && formatString[1] == myUtil.date.getYearBeforeCurr(1)) {
      form.setFieldsValue({ ndsj: '1' });
    } else if (formatString[0] == myUtil.date.getYearBeforeCurr(2) && formatString[1] == myUtil.date.getYearBeforeCurr(1)) {
      form.setFieldsValue({ ndsj: '2' });
    } else if (formatString[0] == myUtil.date.getYearBeforeCurr(3) && formatString[1] == myUtil.date.getYearBeforeCurr(1)) {
      form.setFieldsValue({ ndsj: '3' });
    } else {
      form.setFieldsValue({ ndsj: '' });
    }
    setValue(values);
  }
  //itemList2值保存
  const handlerSjSxrqChange = (e: any) => {
    const value = e.target.value;
    if (value === '1') {
      form.setFieldsValue({ SjSxrq: [moment(myUtil.date.getYearBeforeCurr(1), 'YYYY'), moment(myUtil.date.getYearBeforeCurr(1), 'YYYY')] });
    }
    if (value === '2') {
      form.setFieldsValue({ SjSxrq: [moment(myUtil.date.getYearBeforeCurr(2), 'YYYY'), moment(myUtil.date.getYearBeforeCurr(1), 'YYYY')] });
    }
    if (value === '3') {
      form.setFieldsValue({ SjSxrq: [moment(myUtil.date.getYearBeforeCurr(3), 'YYYY'), moment(myUtil.date.getYearBeforeCurr(1), 'YYYY')] });
    }
  }



  // 单证下载
  const downloadSj = async () => {
    const formValues = await form.validateFields();
    const time1 = moment(formValues.SjSxrq[0]).format('yyyy-MM-DD')
    const time2 = moment(formValues.SjSxrq[1]).format('yyyy-MM-DD')
    const params = {};
    params.sqlx = 'JMFK';
    params.sjgjsjDm = '030300';
    params.czfdm = '08';
    params.tjzdmc = '所属年度';
    params.csz1 = moment(time1).startOf('day').format('x');
    params.csz2 = moment(time2).startOf('day').format('x');

    setMasker(true);
    await ycsbsjxz(params).then(async (response: any) => {
      const { desc, code } = response;
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

  // 表单布局
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  // 表单布局
  const tailLayout = {
    wrapperCol: { offset: 5, span: 19 },
  };

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_hgsjxzjy">
        <ProCard style={{ height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', 'footerBtn']), overflowY: 'auto' }}>
          <Form {...layout} form={form}
            initialValues={{ SjSxrq: defaultRangeData() }}
          >
            <div className='groupTit2'>数据下载</div>
            <Form.Item {...tailLayout} name='SjSxrq' rules={[
              () => ({
                validator(_, value) {
                  if (value.length === 2) {
                    if (value[0].diff(value[1], 'years') > 4 || value[1].diff(value[0], 'years') > 4) {
                      return Promise.reject(new Error('加工贸易审核结果最大下载时间范围是5年'));
                    }
                    if (value[0].diff(moment('2014', 'YYYY'), 'years') < 0) {
                      return Promise.reject(new Error('数据下载时间范围开始时间不能小于2014'));
                    }
                    return Promise.resolve();
                  }
                  return Promise.resolve();
                },
              })
            ]}>
              <RangePicker picker="year" style={{ width: 260 }}
                onChange={handleSelectTime}
                // onCalendarChange={val => setDates(val)}
                // disabledDate={disabledDate}
                allowClear={false}
                // onOpenChange={onOpenChange}
                format={myUtil.date.formatList('YYYY')}
              />
            </Form.Item>
            <Form.Item {...tailLayout} name='ndsj'>
              <Radio.Group defaultValue={'1'} onChange={handlerSjSxrqChange}>
                {itemList2.map((item) => (
                  <Radio key={item.value} value={item.value}>{item.name}</Radio>
                ))}
              </Radio.Group>
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

export default Swfkjsxzjy;
