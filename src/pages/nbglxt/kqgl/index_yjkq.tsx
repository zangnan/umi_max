import React from 'react';
import { Form, Spin, Button, Card, List, Typography, theme } from 'antd';
import { importByFileAndPathDdCbcb, importByFileAndPathDdDk, dd2mrtj, createkq, createJb } from '@/services/hts/api';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import { FooterToolbar } from '@ant-design/pro-components';
import { LoadingOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';
import CONSTANTS from '@/components/DDAssist/constants';

const { useToken } = theme;

let initBuildFiles: any = [
  { title: '导入钉钉考勤原始数据', loading: true },
  { title: '导入钉钉餐补车补数据', loading: true },
  { title: '生成每日考勤', loading: true },
  { title: '生成考勤汇总', loading: true },
  { title: '生成加班汇总', loading: true },
]

const Unit2: React.FC<unknown> = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showRes, setShowRes] = React.useState<boolean>(false);
  const [buildFiles, setbuildFiles] = React.useState<any>(cloneDeep(initBuildFiles));
  let { token }: any = useToken();
  const [form] = Form.useForm();
  const Func: any = {};

  // 表单配置
  const formConfig = {
    form_layout_type: '3',
    form_label_input_layout: 'horizontal',
    form_items: [
      { label: '统计日期', type: 'DatePicker', name: 'analysisDate', format: 'YYYY-MM', picker: 'month', rules: [ { type: 'base_required' } ] },
      { label: '钉钉考勤原始数据', type: 'Upload', name: 'ddkqyssj', rules: [ { type: 'base_required' } ], layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW },
      { label: '钉钉餐补车补数据', type: 'Upload', name: 'ddcbcbsj', rules: [ { type: 'base_required' } ], layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW },
    ],
  };

  // 生成
  const onSave = async () => {
    form.validateFields().then(async values => {
      setLoading(true);
      setShowRes(true);
      let tmpBuildFiles = cloneDeep(initBuildFiles);
      // 1 钉钉考勤原始数据 - 导入钉钉考勤原始数据
      let filesDdkqyssj: any = values.ddkqyssj;
      let formDataDdkqyssj: any = new FormData();
      formDataDdkqyssj.append('file', filesDdkqyssj[0].originFileObj);
      let res0: any = await importByFileAndPathDdDk(formDataDdkqyssj);
      tmpBuildFiles[0] = {...res0, ...tmpBuildFiles[0], loading: false };
      setbuildFiles([...tmpBuildFiles]);
      // 2 钉钉餐补车补数据 - 导入钉钉餐补车补数据
      let filesDdcbcbsj: any = values.ddcbcbsj;
      let formDataDdcbcbsj: any = new FormData();
      formDataDdcbcbsj.append('file', filesDdcbcbsj[0].originFileObj);
      let res1: any = await importByFileAndPathDdCbcb(formDataDdcbcbsj);
      tmpBuildFiles[1] = {...res1, ...tmpBuildFiles[1], loading: false };
      setbuildFiles([...tmpBuildFiles]);
      // 3 每日统计 - 生成每日考勤
      let formParam = { nbglTjlx: '2', nbglTjnhy: values.analysisDate?.format('YYYY-M'), key: 'nbgl_yggl_mrtj' }
      let res2: any = await dd2mrtj(formParam);
      tmpBuildFiles[2] = {...res2, ...tmpBuildFiles[2], loading: false };
      setbuildFiles([...tmpBuildFiles]);
      // 4 考勤汇总 - 生成考勤汇总
      formParam = { nbglTjlx: '2', nbglTjnhy: values.analysisDate?.format('YYYY-M'), key: 'nbgl_yggl_lzgl', }
      let res3: any = await createkq(formParam);
      tmpBuildFiles[3] = {...res3, ...tmpBuildFiles[3], loading: false };
      setbuildFiles([...tmpBuildFiles]);
      // 5 加班汇总 - 生成加班汇总
      formParam = { nbglTjlx: '2', nbglTjnhy: values.analysisDate?.format('YYYY-M'), key: 'nbgl_yggl_lzgl', }
      let res4: any = await createJb(formParam);
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

  // theme token
  const colorSuccess: any = token?.Tag?.colorSuccess;
  const colorError: any = token?.Tag?.colorError;
  const colorInfo: any = token?.colorInfo;

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