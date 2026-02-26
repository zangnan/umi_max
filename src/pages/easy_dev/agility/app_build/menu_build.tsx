import React, { useState } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Button, Form, List, Spin, Divider, message } from 'antd';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import { Typography } from 'antd';
import { FooterToolbar } from '@ant-design/pro-components';
import { initMenuByExcel } from '@/services/hts/api';
import CONSTANTS from '@/components/DDAssist/constants';
import excelUtil from '@/components/DDAssist/util/excelUtil';
import myUtil from '@/components/DDAssist/util';
import { FileExcelOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import excelV2Validator from '@/components/DDBunit/excelConfig.v2.1.validator';
import { cloneDeep } from 'lodash';
import './style.less';

const TableList: React.FC<unknown> = () => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [buildFiles, setbuildFiles] = React.useState<any>([]);
  const [excelFrontData, setExcelFrontData] = useState<any>([]);
  const [checkExcelMsg, setCheckExcelMsg] = useState<any>([]);
  const [form] = Form.useForm();
  const Func: any = {};

  const onReset = () => {
    form.resetFields();
  };

  let downloadUrl1 = `${APP_BASE ? '/' + APP_BASE : ''}/import_template/v0.2/data_menu_template.xlsx`;

  // readWorkbook
  const readWorkbook = ({excelData, uid, name, msgArr}: any) => {
    const finalResAll: any = [];
    let res = excelUtil.readSheet(excelData.toString());
    res.forEach((item: any) => { // 遍历sheet
      let jsonData = item?.jsonData;
      finalResAll.push({
        jsonData: jsonData,
        sheetName: item.sheetName,
      });
    });
    let currentExcelUid = uid;
    for (let m = 0; m < msgArr.length; m++) {
      if (currentExcelUid === msgArr[m].uid) {
        msgArr[m].finalResAll = finalResAll;
        setExcelFrontData(cloneDeep(msgArr));
        break;
      }
    }
  }

  // getFinalRes
  let getFinalRes = (jsonResParam: any, columnsParam: any) => {
    // 数据处理 中文key转换为英文key
    const finalRes: any = [];
    jsonResParam.forEach((row: any) => {
      let rowNew: any = {};
      Object.keys(row).forEach((key: any) => {
        let keyEng = '';
        let targetHeader = columnsParam?.find((item: any) => { return key === item.title });
        keyEng = targetHeader?.field;
        rowNew[keyEng] = row[key];
      });
      finalRes.push(rowNew);
    });
    return finalRes;
  };

  // checkExcel
  const checkExcelFront = (excelData: any) => {
    let msg = excelV2Validator.run({ excelData: [
      { type: 'menu', data: getFinalRes(excelData?.finalResAll[0]?.jsonData, DDIT_TOOL_CONSTANTS.SHEET_MENU) },
      { type: 'module', data: getFinalRes(excelData?.finalResAll[1]?.jsonData, DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE) },
      { type: 'dictTable', data: getFinalRes(excelData?.finalResAll[2]?.jsonData, DDIT_TOOL_CONSTANTS.SHEET_CONFIG_DICT_TABLE) },
      { type: 'field', data: getFinalRes(excelData?.finalResAll[3]?.jsonData, DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD) },
    ] });
    return {
      ...excelData,
      msg
    };
  }

  const onSave = () => {
    if (fileList.length <= 0) {
      message.info('请选择构建文件');
      return;
    }
    // const frontCheck = form.getFieldValue('frontCheck');
    // if (frontCheck) {
    //   let aaa: any = [];
    //   for (let i = 0; i < excelFrontData.length; i++) {
    //     let excelCheckMsg = checkExcelFront(excelFrontData[i]);
    //     if (excelCheckMsg?.msg?.length > 0) {
    //       aaa.push(excelCheckMsg);
    //     }
    //   }
    //   setCheckExcelMsg(aaa);
    //   if (aaa?.length > 0) {
    //     return;
    //   }
    // }
    form.validateFields().then(async (values: any) => {
      let formValue: any = form.getFieldsValue();
      setLoading(true);
      let files = formValue.fj1 || [];
      let apiParma = [];
      let filesTmp: any = [];
      for(let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i].originFileObj);
        formData.append('appId', 'app_dict_test');
        apiParma.push({formData});
        filesTmp.push({...files[i]});
      }
      const promiseArr: any = [];
      for (let i = 0; i < apiParma.length; i += 1) {
        const { formData } = apiParma[i];
        let tmpCodeTable = await initMenuByExcel(formData)
        promiseArr.push(tmpCodeTable);
      }
      const allSettledPromise = Promise.allSettled(promiseArr);
      allSettledPromise.then(function (results: any) {
        setLoading(false);
        for (let i = 0; i < results.length; i++) {
          if (filesTmp[i]) {
            const { status, value } = results[i];
            if (status === 'fulfilled') {
              const { code, codeDesc } = value;
              if (code === '200') {
                filesTmp[i].promise = 'success';
                filesTmp[i].promiseCode = code;
                filesTmp[i].promiseCodeDesc = codeDesc;
                filesTmp[i].promiseMsg = value[CONSTANTS.RESPONSE.MESSAGE_KEY_SUCCESS];
              } else {
                filesTmp[i].promise = 'error';
                filesTmp[i].promiseCode = code;
                filesTmp[i].promiseCodeDesc = codeDesc;
                filesTmp[i].promiseMsg = JSON.stringify(value[CONSTANTS.RESPONSE.MESSAGE_KEY_ERROR]);
              }
            } else if (status === 'rejected') {
              filesTmp[i].promise = 'error';
              filesTmp[i].promiseCode = '-';
              filesTmp[i].promiseCodeDesc = '请求失败';
              filesTmp[i].promiseMsg = JSON.stringify(value);
            }
          }
        }
        setbuildFiles(filesTmp);
      });
    });
  };

  // 表单事件：OnChange
  Func.eventOnChange = {
    changeUpload: (param: any) => {
      setExcelFrontData([]);
      setCheckExcelMsg([]);
      const { event, form } = param;
      const frontCheck = form.getFieldValue('frontCheck');
      let newFileList = event.fileList;
      setFileList(newFileList);
      if (newFileList.length <= 0) {
        return;
      }
      // 后端构建返回信息、前端校验信息占位
      let msgTmp: any = [];
      for (let i = 0; i < newFileList.length; i++) {
        msgTmp.push({
          uid: newFileList[i].uid,
          name: newFileList[i].name,
          buildCompleted: false,
        })
      }
      let msgTmp2 = cloneDeep(msgTmp);
      if (!frontCheck) {
        return;
      }
      for (let i = 0; i < newFileList.length; i++) {
        let reader = new FileReader();
        reader.onload = async function (e: any) {
          let data = e.target.result;
          readWorkbook({ excelData: data, uid: newFileList[i].uid, name: newFileList[i].name, msgArr: msgTmp2});
        };
        reader.readAsBinaryString(newFileList[i].originFileObj);
      }
    },
    changeFrontCheck: (param: any) => {
      const { form } = param;
      myUtil.localStore.setItem('buildMFCheck', form.getFieldValue('frontCheck'));
    }
  }

  let formConfig = {
    form_layout_type: 'vertical', // 表单整体一列或多列布局: horizontal vertical 2 3 4 6 8 12
    form_label_input_layout: 'horizontal', // 标签与录入框排列方式: horizontal vertical
    form_items: [
      { label: '请选择菜单重构Excel文件', type: 'Upload', name: 'fj1', eventOnChange: 'changeUpload', maxCount: 10, tooltip: '每次最多构建文件数量为10' },
      // { label: '开启前端校验', type: 'Switch', name: 'frontCheck', defaultValue: myUtil.localStore.getItem('buildMFCheck'), eventOnChange: 'changeFrontCheck' },
    ],
  }

  return (<>
    <Spin spinning={loading} delay={500}>
      <Typography.Title level={4}>菜单构建</Typography.Title>
      <ProCard>
        <DDBaseForm config={formConfig} form={form} initialValues={{}} func={Func}/>
        <Divider titlePlacement="left" style={{marginTop: '48px'}}> <Typography.Title level={5}>模版下载</Typography.Title></Divider>
        <div style={{lineHeight: '28px'}}>
          <div><a href={downloadUrl1}><FileExcelOutlined />菜单构建模版</a></div>
        </div>
      </ProCard>
      {excelV2Validator.singleExcelMsgNodeFront(checkExcelMsg)}
      { buildFiles?.length > 0 && <>
        <Typography.Title level={4} style={{marginTop: '24px'}}>系统构建结果</Typography.Title>
        <ProCard>
          <List
            itemLayout="horizontal"
            dataSource={buildFiles}
            renderItem={(item: any, index: number) => (
              <List.Item>
                <List.Item.Meta
                  title={<div className='restitle'>
                    {item.promiseCode === '200' ? <CheckOutlined style={{ color: '#339c00' }}/> : <CloseOutlined style={{ color: '#ff6666' }}/>}
                    {item.name}
                  </div>}
                  description={<>
                    <div className={item.promiseCode === '200' ? 'promiseMsgCodeSuccess' : 'promiseMsgCodeError'}>【{item.promiseCode}】{item.promiseCodeDesc}</div>
                    <div className={item.promiseCode === '200' ? 'promiseMsgSuccess' : 'promiseMsgError'}>{item?.promiseMsg || ''}</div>
                  </>}
                />
              </List.Item>
            )}
          />
        </ProCard>
      </>}
      <FooterToolbar >
        <Button type='default' onClick={onReset}>重置</Button>
        <Button type='primary' onClick={onSave} loading={loading}>保存</Button>
      </FooterToolbar>
    </Spin>
  </>);
};

export default TableList;
