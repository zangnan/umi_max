import React, { useState, useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProCard, ProFormText, StepsForm, ProForm, ProFormUploadDragger } from '@ant-design/pro-components';
import { message, Typography, Divider, notification, Button, Spin, Tabs } from 'antd';
import { FileExcelOutlined, LoadingOutlined, CheckOutlined, CoffeeOutlined, CloseOutlined } from '@ant-design/icons';
import { initDbByExcel, initBaseDataByExcel, initTableDefault, initDataDefault, initModuleDefault, initDictByExcel } from '@/services/hts/api';
import CONSTANTS from '@/components/DDAssist/constants';

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep1, setLoadingStep1] = useState<any>(0);
  const [loadingStep2, setLoadingStep2] = useState<any>(0);
  const [loadingStep3, setLoadingStep3] = useState<any>(0);
  const formRef = useRef<ProFormInstance>();

  let downloadUrl1 = `${APP_BASE ? '/' + APP_BASE : ''}/import_template/v0.2/init_table.xlsx`;
  let downloadUrl2 = `${APP_BASE ? '/' + APP_BASE : ''}/import_template/v0.2/init_data.xlsx`;
  let downloadUrl3 = `${APP_BASE ? '/' + APP_BASE : ''}/import_template/v0.2/init_module_system.xlsx`;

  const initialValues = {
    dbIp: '127.0.0.1',
    dbName: 'testdb',
    dbUsername: 'root',
    dbPassword: 'root',
    dbPort: '3306',
  }

  // 初始化数据库
  const doInitDb = async () => {
    let formValue: any = formRef.current?.getFieldsValue();
    const formData = new FormData();
    formData.append('dbIp', formValue.dbIp);
    formData.append('dbName', formValue.dbName);
    formData.append('dbPassword', formValue.dbPassword);
    formData.append('dbPort', formValue.dbPort);
    formData.append('dbUsername', formValue.dbUsername);
    formData.append('file', formValue.dbTemplate[0].originFileObj);
    const response: any = await initDbByExcel(formData);
    if (response?.code === '200') {
      message.info(response[CONSTANTS.RESPONSE.MESSAGE_KEY_SUCCESS]);
      return true;
    } else {
      notification.error({
        message: `code: ${response?.code}`,
        description: <>{JSON.stringify(response?.msg)}</>,
        placement: 'top',
        duration: null,
      });
      return false;
    }
  }

  // 初始化数据库数据
  const initDbData = async () => {
    let formValue: any = formRef.current?.getFieldsValue();
    const formData = new FormData();
    formData.append('file', formValue.dbDataTemplate[0].originFileObj);
    const response: any = await initBaseDataByExcel(formData);
    if (response?.code === '200') {
      message.info(response[CONSTANTS.RESPONSE.MESSAGE_KEY_SUCCESS]);
      return true;
    } else {
      notification.error({
        message: `code: ${response?.code}`,
        description: <>{JSON.stringify(response[CONSTANTS.RESPONSE.MESSAGE_KEY_ERROR])}</>,
        placement: 'top',
        duration: null,
      });
      return false;
    }
  }

  // 跳转至登录
  const goLogin = () => {
    const { hash, origin, pathname } = window.location;
    if (hash) { // 打包后hash模式跳转
      window.location.href = `${origin}${pathname}#/${APP_BASE}${CONSTANTS.ROUTE.LOGIN}`;
    } else { // 本地普通跳转
      window.location.href = `${origin}${CONSTANTS.ROUTE.LOGIN}`;
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  // 一键初始化
  const inintDbAndDbDataDefault = async () => {
    setLoading(true);
    setLoadingStep1(1);
    setLoadingStep2(1);
    setLoadingStep3(1);
    initTableDefault().then((response: any) => { // 读取数据表初始化默认文件
      const formData = new FormData();
      formData.append('file', response);
      return initDbByExcel(formData); // 初始化数据库表
    }).then((response2: any) => {
      if (response2?.code === '200') {
        // message.info(response2[CONSTANTS.RESPONSE.MESSAGE_KEY_SUCCESS]);
        setLoadingStep1(2);
        return initDataDefault();  // 读取数据表数据初始化默认文件
      } else {
        setLoading(false);
        setLoadingStep1(3);
        setLoadingStep2(3);
        notification.error({
          message: `code: ${response2?.code}`,
          description: <>{JSON.stringify(response2?.msg)}</>,
          placement: 'top',
          duration: null,
        });
      }
    }).then((response3: any) => {
      const formData =new FormData();
      formData.append('file', response3);
      return initBaseDataByExcel(formData); // 初始化数据库数据
      // initBaseDataByExcel(formData).then((response5: any)=>{
      //   setLoading(false);
      //   debugger;
      //   if (response5?.code === '200') {
      //     setLoadingStep2(2);
      //     // message.info(response5[CONSTANTS.RESPONSE.MESSAGE_KEY_SUCCESS]);
      //     return initModuleDefault();  // 读取数据表数据初始化默认文件
      //   } else {
      //     setLoadingStep2(3);
      //     notification.error({
      //       message: `code: ${response5?.code}`,
      //       description: <>{JSON.stringify(response5?.msg)}</>,
      //       placement: 'top',
      //       duration: null,
      //     });
      //   }
      // })
    }).then((response4: any) => {
      // debugger;
      // debugger;
      if (response4?.code === '200') {
        setLoadingStep2(2);
        // message.info(response5[CONSTANTS.RESPONSE.MESSAGE_KEY_SUCCESS]);
        return initModuleDefault();  // 读取数据表数据初始化默认文件
      } else {
        setLoadingStep2(3);
        setLoading(false);
        notification.error({
          message: `code: ${response4?.code}`,
          description: <>{JSON.stringify(response4?.msg)}</>,
          placement: 'top',
          duration: null,
        });
      }
    }).then((response5: any) => {
      const formData = new FormData();
      formData.append('file', response5);
      formData.append('appId', 'app_dict_test');
      return initDictByExcel(formData); // 初始化数据库数据
    }).then((response6: any) => {
      if (response6?.code === '200') {
        setLoadingStep3(2);
        setLoading(false);
        // message.info(response5[CONSTANTS.RESPONSE.MESSAGE_KEY_SUCCESS]);
        // return initModuleDefault();  // 读取数据表数据初始化默认文件
      } else {
        setLoadingStep3(3);
        setLoading(false);
        notification.error({
          message: `code: ${response6?.code}`,
          description: <>{JSON.stringify(response6?.msg)}</>,
          placement: 'top',
          duration: null,
        });
      }
    }).finally(() => {
      // setLoading(false);
    })
  }

  // const getSubmitter = () => {
  //   return {
  //     render: (props: { step: number; onSubmit: () => void; onPre: () => void; }) => {
  //       if (props.step === 0) {
  //         return <Button type="primary" onClick={() => {props.onSubmit?.()}}>下一步</Button>;
  //       }
  //       if (props.step === 1) {
  //         return [ <Button onClick={() => props.onPre?.()}>上一步</Button>,
  //           <Button type="primary" onClick={() => props.onSubmit?.()}>下一步</Button>, ];
  //       }
  //       return [ <Button key="gotoTwo" onClick={() => props.onPre?.()}>上一步</Button>,
  //         <Button type="primary" onClick={() => props.onSubmit?.()} >跳转至登录</Button>, ];
  //     },
  //   }
  // }

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
          <div>{ getStepIcon(loadingStep3) } 初始化系统管理模块</div>
        </div>
      </>,
    },
    { key: '2', label: '自定义初始化', children: <>
      <StepsForm<{
          name: string;
        }>
          stepsProps={{ direction: 'horizontal', }}
          formRef={formRef}
          onFinish={async () => { goLogin(); }}
          formProps={{
            validateMessages: {
              required: '此项为必填项',
            },
          }}
          // submitter={getSubmitter()}
        >
          <StepsForm.StepForm name="step1" title="初始化基本表结构" stepProps={{ description: '创建基础表如：用户、菜单、角色、码表...', }}
            onFinish={async () => { return await doInitDb(); }}
            initialValues={initialValues}
          >
            {/* <ProForm.Group>
              <ProFormText name="dbIp" label="数据库IP地址" width="sm" tooltip="数据库IP地址" placeholder="请输入数据库IP地址" rules={[{ required: true }]} />
              <ProFormText name="dbName" label="数据库名" width="sm" placeholder="请输入数据库名" rules={[{ required: true }]} />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormText name="dbUsername" label="数据库用户名" width="sm" placeholder="请输入数据库用户名" rules={[{ required: true }]} />
              <ProFormText name="dbPassword" label="数据库密码" width="sm" placeholder="请输入数据库密码" rules={[{ required: true }]} />
            </ProForm.Group>
            <ProFormText name="dbPort" label="数据库端口" width="sm" placeholder="请输入数据库端口" rules={[{ required: true }]} /> */}
            <ProFormUploadDragger name="dbTemplate" label="数据库初始化模板" description="请选择用于数据库初始化的Excel文件" max={1} rules={[{ required: true }]}/>
          </StepsForm.StepForm>
          <StepsForm.StepForm name="step2" title="初始化系统基本信息" stepProps={{ description: '初始化基础表数据如：用户、菜单、角色、码表...', }}
            onFinish={async () => { return await initDbData(); }}
          >
            <ProFormUploadDragger name="dbDataTemplate" label="数据库数据初始化模板" description="请选择用于数据库数据初始化的Excel文件" max={1} rules={[{ required: true }]}/>
            {/* <Button type="link" onClick={goLogin}>跳转至登录</Button> */}
          </StepsForm.StepForm>
          <StepsForm.StepForm name="step3" title="初始化系统管理模块" stepProps={{ description: '初始化系统管理模块如：用户管理、菜单管理、角色管理、码表...', }}
            onFinish={async () => { return await initDbData(); }}
          >
            <ProFormUploadDragger name="dbDataTemplate" label="数据库数据初始化模板" description="请选择用于数据库数据初始化的Excel文件" max={1} rules={[{ required: true }]}/>
            {/* <Button type="link" onClick={goLogin}>跳转至登录</Button> */}
          </StepsForm.StepForm>
          <StepsForm.StepForm name="step4" title="跳转至登录" stepProps={{ description: '' }}>
            <Typography.Title level={3}>数据库及数据初始化已完成，点击提交可跳转至登录页面</Typography.Title>
            {/* <Button type="link" onClick={goLogin}>跳转至登录</Button> */}
            {/* <ProFormUploadDragger name="dbDataTemplate" label="自定义功能文件" description="请选择用于自定义功能的文件" max={1} /> */}
          </StepsForm.StepForm>
        </StepsForm>
        <Divider titlePlacement="left" style={{marginTop: '48px'}}> <Typography.Title level={5}>模板下载</Typography.Title></Divider>
        <div style={{lineHeight: '28px'}}>
          <div><a href={downloadUrl1}><FileExcelOutlined /> 数据字典_系统初始化_基本表结构</a></div>
          <div><a href={downloadUrl2}><FileExcelOutlined /> 数据字典_系统初始化_系统基本信息</a></div>
          <div><a href={downloadUrl3}><FileExcelOutlined /> 数据字典_字典导入模板_系统管理模块</a></div>
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