import React from 'react';
import { Form, Spin, Button, Card, List, Typography, theme } from 'antd';
import { importGzgl, scjxry, scgzxx } from '@/services/hts/api';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import { FooterToolbar } from '@ant-design/pro-components';
import { LoadingOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';
import CONSTANTS from '@/components/DDAssist/constants';

let initBuildFiles: any = [
  { title: '生成计薪人员', loading: true },
  { title: '导入提成', loading: true },
  { title: '导入社保基数', loading: true },
  { title: '导入专项扣除', loading: true },
  { title: '生成工资', loading: true },
]

const Unit2: React.FC<unknown> = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showRes, setShowRes] = React.useState<boolean>(false);
  const [buildFiles, setbuildFiles] = React.useState<any>(cloneDeep(initBuildFiles));
  const [form] = Form.useForm();
  const Func: any = {};
  // themeToken
  const { useToken } = theme;
  const { token }: any = useToken();
  const colorSuccess: any = token?.Tag?.colorSuccess;
  const colorError: any = token?.Tag?.colorError;
  const colorInfo: any = token?.colorInfo;

  // 表单配置
  const formConfig = {
    form_layout_type: '3',
    form_label_input_layout: 'horizontal',
    form_items: [
      { label: '统计日期', type: 'DatePicker', name: 'analysisDate', format: 'YYYY-MM', picker: 'month', rules: [ { type: 'base_required' } ] },
      { label: '导入提成', type: 'Upload', name: 'drtc', layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW },
      { label: '导入社保基数', type: 'Upload', name: 'drsbjs', layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW },
      { label: '导入专项扣除', type: 'Upload', name: 'drzxkc', layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW },
    ],
  };

  // 生成
  const onSave = async () => {
    form.validateFields().then(async values => {
      setLoading(true);
      setShowRes(true);
      let tmpBuildFiles = cloneDeep(initBuildFiles);
      // 1 生成计薪人员
      let res0: any = await scjxry({ ny: values.analysisDate?.format('YYYY-M') });
      tmpBuildFiles[0] = {...res0, ...tmpBuildFiles[0], loading: false };
      setbuildFiles([...tmpBuildFiles]);
      // 2 导入提成
      let filesDrtc: any = values.drtc;
      let formDataDrtc: any = new FormData();
      if (filesDrtc) {
        formDataDrtc.append('file', filesDrtc[0].originFileObj);
        let res1: any = await importGzgl(formDataDrtc, 1);
        tmpBuildFiles[1] = {...res1, ...tmpBuildFiles[1], loading: false };
      } else {
        tmpBuildFiles[1] = {code: '200', msg: '没有需要导入的数据',  ...tmpBuildFiles[1], loading: false };
      }
      setbuildFiles([...tmpBuildFiles]);
      // 3 导入社保基数
      let filesDrsbjs: any = values.drsbjs;
      let formDataDrsbjs: any = new FormData();
      if (filesDrsbjs) {
        formDataDrsbjs.append('file', filesDrsbjs[0].originFileObj);
        let res2: any = await importGzgl(formDataDrsbjs, 3);
        tmpBuildFiles[2] = {...res2, ...tmpBuildFiles[2], loading: false };
      } else {
        tmpBuildFiles[2] = {code: '200', msg: '没有需要导入的数据',  ...tmpBuildFiles[2], loading: false };
      }
      setbuildFiles([...tmpBuildFiles]);
      // 4 导入专项扣除
      let filesDrzxkc: any = values.drzxkc;
      let formDataDrzxkc: any = new FormData();
      if (filesDrzxkc) {
        formDataDrzxkc.append('file', filesDrzxkc[0].originFileObj);
        let res3: any = await importGzgl(formDataDrzxkc, 4);
        tmpBuildFiles[3] = {...res3, ...tmpBuildFiles[3], loading: false };
      } else {
        tmpBuildFiles[3] = {code: '200', msg: '没有需要导入的数据',  ...tmpBuildFiles[3], loading: false };
      }
      setbuildFiles([...tmpBuildFiles]);
      // 5 生成工资
      let res4: any = await scgzxx({ ny: values.analysisDate?.format('YYYY-M') });
      tmpBuildFiles[4] = {...res4, ...tmpBuildFiles[4], loading: false };
      setbuildFiles([...tmpBuildFiles]);
      // end ~~
      form.resetFields();
      setLoading(false);
    })
  }

  // 表单重置
  const onReset = () => {
    form.resetFields();
    setShowRes(false);
    setbuildFiles(cloneDeep(initBuildFiles));
  };

  return <>
    <Spin tip="Loading..." spinning={loading} delay={100}>
      <Card>
        <DDBaseForm config={formConfig} form={form} initialValues={{}} func={Func}/>
      </Card>
    </Spin>
    { showRes && <>
      <Typography.Title level={4} style={{marginTop: '24px'}}>数据处理中</Typography.Title>
      <Card>
        <List
          itemLayout="horizontal"
          dataSource={buildFiles}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                title={<div className='restitle'>
                  {item.loading ? <span><LoadingOutlined style={{ color: colorInfo }}/></span> : <span></span>}
                  {(!item.loading && item.code === '200') && <CheckOutlined style={{ color: colorSuccess }}/>}
                  {(!item.loading && item.code !== '200') && <CloseOutlined style={{ color: colorError }}/>}
                  <span style={{marginLeft: '10px'}}>{item.title}</span>
                </div>}
                description={<>
                  <div style={{ color: item.code === '200' ? colorSuccess : colorError }}>
                    {item.code === '200' && item?.msg}
                    {item.code !== '200' && JSON.stringify(item?.msg) || ''}
                  </div>
                </>}
              />
            </List.Item>
          )}
        />
      </Card>
    </>}
    <FooterToolbar >
      <Button type='default' onClick={onReset}>重置</Button>
      <Button type='primary' onClick={onSave} loading={loading}>保存</Button>
    </FooterToolbar>
  </>;
};

export default Unit2;