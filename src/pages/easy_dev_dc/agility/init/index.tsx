import React, { useState, useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProCard, StepsForm, ProFormUploadDragger, ProForm, ProFormText } from '@ant-design/pro-components';
import { Typography, Divider, Button, Tabs, notification, message } from 'antd';
import { FileExcelOutlined, LoadingOutlined, CheckOutlined, CoffeeOutlined, CloseOutlined } from '@ant-design/icons';
import { initTableDefault, initDataDefault } from '@/services/hts/api';
import CONSTANTS from '@/components/DDAssist/constants';
import { history } from '@umijs/max';
import excelUtil from '@/components/DDAssist/util/excelUtil';
import myUtil from '@/components/DDAssist/util';

export default () => {
  const [fileList, setFileList] = useState([]);
  const [fileList2, setFileList2] = useState([]);
  const [excelFrontData, setExcelFrontData] = useState<any>([]);
  const [excelFrontData2, setExcelFrontData2] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep1, setLoadingStep1] = useState<any>(0);
  const [loadingStep2, setLoadingStep2] = useState<any>(0);
  const formRef = useRef<ProFormInstance>();

  let downloadUrl1 = `${APP_BASE ? '/' + APP_BASE : ''}/import_template/v0.2node/node_init_table.xlsx`;
  let downloadUrl2 = `${APP_BASE ? '/' + APP_BASE : ''}/import_template/v0.2node/node_init_data.xlsx`;

  const initialValues = {
    dbIp: '127.0.0.1',
    dbName: 'testdb',
    dbUsername: 'root',
    dbPassword: 'root',
    dbPort: '3306',
  }

  // 初始化数据库
  const doInitDb = async () => {
    let createTableData1: any = excelFrontData[0].jsonData || [];
    let createTableData2: any = excelFrontData[1].jsonData || [];
    let res = await myUtil.mysql.createTable([...createTableData1, ...createTableData2]);
    if (res.code === '200') {
      message.info('数据表初始化完成');
      return true;
    } else {
      notification.error({
        message: `code: ${res?.code}`,
        description: <>{JSON.stringify(res?.msg)}</>,
        placement: 'top',
        duration: null,
      });
      return false;
    }
  }

  // readWorkbook
  const readWorkbook = (excelData: any, stepNum: any, isQuickInit?: any) => {
    const finalResAll: any = [];
    let res = excelUtil.readSheet(excelData.toString());
    res.forEach((item: any) => { // 遍历sheet
      let jsonData = item?.jsonData;
      finalResAll.push({
        jsonData: jsonData,
        sheetName: item.sheetName,
      });
    });
    if (stepNum === 'step1') {
      setExcelFrontData(finalResAll);
      if (isQuickInit) {
        let createTableParam: any = [];
        finalResAll.forEach((item: any) => {
          createTableParam.push(...(item?.jsonData || []));
        })
        return createTableParam;
      }
    } else if (stepNum === 'step2') {
      setExcelFrontData2(finalResAll);
      if (isQuickInit) {
        let initDataOrigin: any = finalResAll || [];
        let inintData: any = [];
        initDataOrigin.forEach((data: any) => {
          let tmpJsonData = data?.jsonData || [];
          let tmpSheetName = data?.sheetName;
          inintData.push({ tableName: tmpSheetName, data: tmpJsonData });
        });
        return inintData;
      }
    }
  }

  // 上传文件更新
  const fileChange = ({ fileList: newFileList }: any, stepNum: any) => {
    if (stepNum === 'step1') {
      setFileList(newFileList);
    } else if (stepNum === 'step2') {
      setFileList2(newFileList);
    }
    if (newFileList.length <= 0) {
      return;
    }
    let reader = new FileReader();
    reader.onload = function (e: any) {
      let data = e.target.result;
      readWorkbook(data, stepNum);
    };
    reader.readAsBinaryString(newFileList[0].originFileObj);
  };

  // 初始化数据库数据
  const initDbData = async () => {
    let initDataOrigin: any = excelFrontData2 || [];
    let inintData: any = [];
    initDataOrigin.forEach((data: any) => {
      let tmpJsonData = data?.jsonData || [];
      let tmpSheetName = data?.sheetName;
      inintData.push({ tableName: tmpSheetName, data: tmpJsonData });
    });
    let res = await myUtil.mysql.initTableData(inintData);
    if (res.code === '200') {
      message.info('数据库数据初始化完成');
      return true;
    } else {
      notification.error({
        message: `code: ${res?.code}`,
        description: <>{JSON.stringify(res?.msg)}</>,
        placement: 'top',
        duration: null,
      });
      return false;
    }
  }

  // 跳转至登录
  const goLogin = () => {
    history.push(CONSTANTS.ROUTE.LOGIN);
  }

  // 一键初始化
  const inintDbAndDbDataDefault = async () => {
    setLoading(true);
    setLoadingStep1(1);
    setLoadingStep2(1);
    await myUtil.mysql.dropAllTables();
    initTableDefault(downloadUrl1).then((response1: any) => {     // 1 读取文件: 数据表初始化默认文件
      return myUtil.file.readFileSync(response1);
    }).then((response2: any) => {                                 // 2 组装数据表初始化参数 -> 接口调用: 数据表初始化
      let bbb = readWorkbook(myUtil.file.arrayBufferToBinaryString(response2), 'step1', true);
      if (bbb?.length > 0) {
        return myUtil.mysql.createTable(bbb);
      } else {
        message.info('未找到表');
        throw "未找到表";
      }
    }).then((response3: any) => {                                 // 3 读取数据表数据初始化默认文件
      if (response3.code === '200') {
        message.info('数据表初始化完成');
        setLoadingStep1(2);
        return initDataDefault(downloadUrl2);
      } else {
        setLoading(false);
        setLoadingStep1(3);
        setLoadingStep2(3);
        notification.error({
          message: `code: ${response3?.code}`,
          description: <>{JSON.stringify(response3?.msg)}</>,
          placement: 'top',
          duration: null,
        });
        throw "数据表初始化失败";
      }
    }).then((response4: any) => {                                 // 4 读取文件: 数据表数据初始化默认文件
      return myUtil.file.readFileSync(response4);
    }).then((response5: any) => {                                 // 5 组装数据表数据初始化参数 -> 接口调用: 数据表数据初始化
      let bbb = readWorkbook(myUtil.file.arrayBufferToBinaryString(response5), 'step2', true);
      return  myUtil.mysql.initTableData(bbb);
    }).then((response6: any) => {                                 // 6 一键初始化完毕
      setLoading(false);
      if (response6?.code === '200') {
        message.info('数据表数据始化完成');
        setLoadingStep2(2);
      } else {
        setLoadingStep2(3);
        notification.error({
          message: `code: ${response6?.code}`,
          description: <>{JSON.stringify(response6?.msg)}</>,
          placement: 'top',
          duration: null,
        });
        throw "数据表数据始化失败";
      }
    }).catch(function (err) {
      console.log(err);
      setLoading(false);
      setLoadingStep1(3);
      setLoadingStep2(3);
    });
  }

  const getStepIcon = (loadingFlag: any) => {
    if (loadingFlag === 1) { // 初始化进行
      return <LoadingOutlined style={{ color: '#0A6ED1' }}/>;
    } else if (loadingFlag === 2) { // 初始化完结 成功
      return <CheckOutlined style={{ color: '#339c00' }}/>;
    } else if (loadingFlag === 3) { // 初始化完结 失败
      return <CloseOutlined style={{ color: '#ff6666' }}/>;
    }
    return <CoffeeOutlined style={{ color: '#8e8e8e' }}/>; // 初始状态
  }

  const items: any = [
    { key: '1', label: '一键初始化', children: <>
        <Button type="primary" onClick={inintDbAndDbDataDefault} loading={loading}>执行一键初始化</Button>
        <Button type="link" onClick={goLogin}>跳转至登录</Button>
        <div style={{lineHeight: '30px', marginTop: '24px'}}>
          <div>{ getStepIcon(loadingStep1) } 初始化基本表结构</div>
          <div>{ getStepIcon(loadingStep2) } 初始化系统基本信息</div>
        </div>
      </>,
    },
    { key: '2', label: '自定义初始化', children: <>
      <StepsForm stepsProps={{ direction: 'horizontal', }}
          formRef={formRef}
          onFinish={async () => { goLogin(); }}
          formProps={{ validateMessages: { required: '此项为必填项', }, }}
        >
          <StepsForm.StepForm name="step1" title="数据库初始化" stepProps={{ description: '创建基础表如：用户、菜单、角色、码表...', }}
            onFinish={async () => { return await doInitDb(); }}
            initialValues={initialValues}
          >
            <ProFormUploadDragger name="dbTemplate" label="数据库初始化模板" description="请选择用于数据库初始化的Excel文件" max={1} rules={[{ required: true }]}
              accept=".xls, .xlsx"
              onChange={(param) => {fileChange(param, 'step1')}}
              value={fileList}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm name="step2" title="数据初始化" stepProps={{ description: '初始化基础表数据如：用户、菜单、角色、码表...', }}
            onFinish={async () => { return await initDbData(); }}
          >
            <ProFormUploadDragger name="dbDataTemplate" label="数据库数据初始化模板" description="请选择用于数据库数据初始化的Excel文件" max={1} rules={[{ required: true }]}
              accept=".xls, .xlsx"
              onChange={(param) => {fileChange(param, 'step2')}}
              value={fileList2}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm name="step3" title="跳转至登录" stepProps={{ description: '' }}>
            <Typography.Title level={3}>数据库及数据初始化已完成，点击提交可跳转至登录页面</Typography.Title>
          </StepsForm.StepForm>
        </StepsForm>
        <Divider titlePlacement="left" style={{marginTop: '48px'}}> <Typography.Title level={5}>模板下载</Typography.Title></Divider>
        <div style={{lineHeight: '28px'}}>
          <div><a href={downloadUrl1}><FileExcelOutlined />数据字典_系统初始化_基本表结构</a></div>
          <div><a href={downloadUrl2}><FileExcelOutlined />数据字典_系统初始化_系统基本信息</a></div>
        </div>
      </>,
    },
  ];
  return (
    <div>
      <ProCard style={{ margin: '0 auto', padding: '0 48px'}}>
        <Divider titlePlacement="left"> <Typography.Title level={3}>系统初始化</Typography.Title></Divider>
        <div  style={{ maxWidth: '1400px', margin: '0 auto'}}><Tabs defaultActiveKey="1" items={items} /></div>
      </ProCard>
    </div>
  );
};