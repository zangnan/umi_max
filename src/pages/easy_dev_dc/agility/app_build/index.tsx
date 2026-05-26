import React, { useState } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Button, Tag, Form, message, Spin, Divider, List, Avatar, Flex, Progress, Card } from 'antd';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import { Typography } from 'antd';
import { FooterToolbar } from '@ant-design/pro-components';
import excelUtil from '@/components/DDAssist/util/excelUtil';
import myUtil from '@/components/DDAssist/util';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import { queryListNs } from '@/services/hts/apiNs'
import excelV2Validator from '@/components/DDBunit/excelConfig.v2.1.validator';
import { cloneDeep } from 'lodash';
import '../../../easy_dev/agility/app_build/style.less';
import { LoadingOutlined, FileExcelOutlined } from '@ant-design/icons';

const DB_TABLE = DDIT_TOOL_CONSTANTS.DB_TABLE;

const TableList: React.FC<unknown> = () => {

  const [fileList, setFileList] = useState<any>([]);
  const [buildMsg, setBuildMsg] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [excelFrontData, setExcelFrontData] = useState<any>([]);
  const [checkExcelMsg, setCheckExcelMsg] = useState<any>([]);
  const [form] = Form.useForm();
  const Func: any = {};

  // onReset
  const onReset = () => {
    form.resetFields();
  };

  let downloadUrl1 = `${APP_BASE ? '/' + APP_BASE : ''}/import_template/v0.2node/node_module_media.xlsx`;
  let downloadUrl3 = `${APP_BASE ? '/' + APP_BASE : ''}/import_template/v0.2node/node_module.xlsx`;

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
      { type: 'tableField', data: getFinalRes(excelData?.finalResAll[0]?.jsonData, DDIT_TOOL_CONSTANTS.SHEET_TABLE_FIELD) },
      { type: 'module', data: getFinalRes(excelData?.finalResAll[1]?.jsonData, DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE) },
      { type: 'field', data: getFinalRes(excelData?.finalResAll[2]?.jsonData, DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD_NODE) },
      { type: 'menu', data: getFinalRes(excelData?.finalResAll[3]?.jsonData, DDIT_TOOL_CONSTANTS.SHEET_MENU_NODE) },
    ] });
    return {
      ...excelData,
      msg
    };
  }

  // 表单事件：OnChange
  Func.eventOnChange = {
    changeUpload: (param: any) => {
      setExcelFrontData([]);
      setCheckExcelMsg([]);
      setBuildMsg([]);
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
      setBuildMsg(msgTmp);// 后端构建返回信息站位
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

  // Sheet.表 初始化数据库，创建表
  const createTables = async (param: any) => {
    let createTableData1: any = param;
    let tablesArr = await myUtil.mysql.formatCreateTableData([...createTableData1]);
    let res: any = await myUtil.mysql.createTable([...createTableData1]);
    return {tablesArr, createTablesRes: res};
  }

  // 表dict、表dict_field数据整理，需删除dict_name相同数据
  const getTableData1 = async (tablesArr: any) => {
    let tableDataTmp: any = []
    let dBDataDict: any = [];           // 需要导入的数据 表dict
    let dBDataDictField: any = [];      // 需要导入的数据 表dict_field
    tablesArr.forEach((item: any) => {  // 遍历sheet
      dBDataDict.push({
        dict_name: item.table_name_eng,
        dict_desc: item.table_name_chi,
        dict_type: '字典生成表',
      });
      let tmpFields = item.table_cols || [];
      tmpFields.forEach((itemField: any) => {
        dBDataDictField.push({
          dict_name: item.table_name_eng,
          dict_field_name: itemField.f_name,
          dict_field_desc: itemField.f_comment,
          dict_field_type: itemField.f_type,
          dict_field_key: itemField.f_key,
          dict_field_value: itemField.f_field_value,
          dict_field_not_null: itemField.f_not_null,
        });
      });
    });
    // 重复导入数据处理
    // 表dict、表dict_field删除dict_name相同数据
    tableDataTmp.push({ tableName: 'dict', data: dBDataDict, needDelDataKey: 'dict_name' });
    tableDataTmp.push({ tableName: 'dict_field', data: dBDataDictField, needDelDataKey: 'dict_name' });
    return tableDataTmp;
  }

  // 表app_module、表app_module_field、表sys_menu数据整理，需删除module_key、menu_id相同数据
  const getTableData2 = async (res: any) => {
    let tableDataTmp: any = []
    let menuData: any = [];
    res.forEach((data: any, index: any) => {
      if (index !== 0) {
        let tmpJsonData = data?.jsonData || [];
        let tmpJsonData2: any = [];
        let tmpSheetName: any = DB_TABLE?.find((item: any) => { return item.sheet_desc === data.sheetName})
        let tmpdbTableName = tmpSheetName?.db_table_name;
        let tmpConfigName: any = tmpSheetName?.config_name;
        // excel中文映射为英文
        let isTableNamRowModuleKey = '';
        tmpJsonData.forEach((data: any, index: any) => { // 遍历Excel数据行 row
          let tmpObj: any = {};
          Object.keys(data).forEach(key => { // 遍历Excel数据行的每列单元格 row -> cell
            const tmpFields = DDIT_TOOL_CONSTANTS[tmpConfigName];
            let keyEngTmp: any = tmpFields?.find((item: any) => { return item.title === key });
            if (keyEngTmp?.field) {
              tmpObj[keyEngTmp.field] = data[key];
            }
          });
          let isTableNamRow = false;
          if (tmpdbTableName === 'app_module_field') {
            let tableNameHasVauleNum = 0;
            Object.keys(data).forEach(key => {
              if (data[key]) {
                tableNameHasVauleNum++;
              }
            });
            // 如果只有一列有数据，则当前行为模块名所在行，仅用于获取module_key，不插入数据
            if (tableNameHasVauleNum === 1) {
              isTableNamRow = true;
              isTableNamRowModuleKey = tmpObj?.dict_name?.split(' ')[1];
            }
            tmpObj.dict_field_id = myUtil.text.uuid();
            tmpObj.module_key = isTableNamRowModuleKey;
            // 增加行号
            tmpObj.dict_field_index = index;
          } else if (tmpdbTableName === 'sys_menu') {
            menuData.push({...tmpObj}); // menuData用于处理菜单角色
            delete tmpObj.menu_role;
          } else if (tmpdbTableName === 'sys_customer_sql') {
            tmpObj.uuid = myUtil.text.uuid();
          } else if (tmpdbTableName === 'sys_customer_codetable') {
            tmpObj.code_manage_id = myUtil.text.uuid();
          }
          if (!isTableNamRow) {
            tmpJsonData2.push(tmpObj);
          }
        })
        // 重复导入数据处理
        // 表app_module、表app_module_field删除module_key相同数据
        // 表sys_menu删除menu_id相同数据
        let tmpaaa: any = { tableName: tmpdbTableName, data: tmpJsonData2 };
        if (tmpdbTableName === 'app_module' || tmpdbTableName === 'app_module_field') {
          tmpaaa.needDelDataKey = 'module_key';
        } else if (tmpdbTableName === 'sys_menu') {
          tmpaaa.needDelDataKey = 'menu_id';
        } else if (tmpdbTableName === 'sys_customer_codetable') {
          tmpaaa.needDelDataKey = 'code_manage_key';
        } else if (tmpdbTableName === 'sys_customer_sql') {
          tmpaaa.needDelDataKey = 'sql_key';
        }
        tableDataTmp.push(tmpaaa);
      }
    });
    return {
      tableData: tableDataTmp,
      menuData,
    };
  }

  // 表sys_menu_role_rel数据整理
  const getTableData3 = async (menuExcelData: any) => {
    let tableDataTmp: any = [];
    let roleRes: any = await queryListNs({page: 1, pageSize: 999999, searchModel: []}, 'sys_role');
    if (roleRes.code !== '200' || roleRes.body.rowCount <= 0) {
      return [];
    }
    let roleArr: any = roleRes?.body?.rows;
    menuExcelData.forEach((data: any) => { // 遍历Excel数据行 row
      let menu_id: any = data.menu_id;
      let roleNameArr: any = data.menu_role?.split(',') || [];
      roleNameArr.forEach((role_name: any) => {
        let roleObj: any = roleArr?.find((item: any) => { return item.role_name === role_name});
        let role_id = roleObj?.role_id;
        if (menu_id && role_id) {
          tableDataTmp.push({
            uuid: myUtil.text.uuid(),
            menu_id,
            role_id,
          });
        }
      })
    });
    let tmpaaa: any = {
      tableName: 'sys_menu_role_rel',
      data: tableDataTmp,
      needDelDataKey: ['menu_id', 'role_id'],
    };
    return [tmpaaa];
  }

  const setPercent = async (currentExcelUid: any, num: any) => {
    for (let m = 0; m < buildMsg.length; m++) {
      if (currentExcelUid === buildMsg[m].uid) {
        buildMsg[m].percent = num;
        setBuildMsg(cloneDeep(buildMsg));
        break;
      }
    }
  }

  // 处理单元Excel文件
  const handlSingleExcel = (excelFile: any) => {
    let reader = new FileReader();
    reader.onload = async function (e: any) {
      setLoading(true);
      let currentExcelUid = excelFile.uid;
      let currentExceMsgArr: any = [];
      let data = e.target.result;
      const finalResAll: any = [];
      let res = excelUtil.readSheet(data.toString());
      // res[0] 录入数据：表
      // res[1] 录入数据：模块
      // res[2] 录入数据：字段
      // res[3] 录入数据：菜单
      // res[4] 录入数据：自定义SQL
      // res[5] 录入数据：自定义码表
      res.forEach((item: any) => { // 遍历sheet
        let jsonData = item?.jsonData;
        finalResAll.push({
          jsonData: jsonData,
          sheetName: item.sheetName,
        });
      });

      // 1、创建表【基于sheet.表】
      let res1: any = await createTables(res[0]?.jsonData || []);
      let { tablesArr, createTablesRes } = res1;
      // 1.1、构建过程日志处理
      if (createTablesRes?.code === '200') {
        let tmpMsg = createTablesRes?.msg || [];
        currentExceMsgArr.push(...tmpMsg);
      }
      await setPercent(currentExcelUid, 10);

      // 2、表数据整理【基于sheet.表】: 表dict、表dict_field，需删除dict_name相同数据
      let tableData1: any = await getTableData1(tablesArr) || [];
      await setPercent(currentExcelUid, 20);

      // 3、表数据整理【基于sheet.模块、sheet.字段、sheet.菜单】表app_module、表app_module_field
      let inintData2: any = await getTableData2(res) || [];
      await setPercent(currentExcelUid, 30);

      // 4、表数据整理【基于sheet.菜单】表sys_menu_role_rel
      let inintData3: any = await getTableData3(inintData2?.menuData || []) || [];
      await setPercent(currentExcelUid, 50);

      // 5、插入表数据 表dict、表dict_field、表app_module、表app_module_field、表sys_menu
      let resInitTableData2 = await myUtil.mysql.initTableData([...tableData1, ...inintData2.tableData, ...inintData3
      ]);;
      if (resInitTableData2.code === '200') {
        // message.info('数据库数据初始化完成');
        // 5.1、构建过程日志处理
        let tmpMsg = resInitTableData2?.msg || [];
        currentExceMsgArr.push(...tmpMsg);
      } else {
        currentExceMsgArr.push({
          code: resInitTableData2?.code,
          msg: '',
          msgType: '',
        });
      }
      await setPercent(currentExcelUid, 70);

      for (let m = 0; m < buildMsg.length; m++) {
        if (currentExcelUid === buildMsg[m].uid) {
          buildMsg[m].msg = currentExceMsgArr;
          buildMsg[m].buildCompleted = true;buildMsg
          buildMsg[m].percent = 100;
          setBuildMsg(cloneDeep(buildMsg));
          break;
        }
      }
      setLoading(false);
    };
    reader.readAsBinaryString(excelFile.originFileObj);
  }

  // onSave
  const onSave = () => {
    if (fileList.length <= 0) {
      message.info('请选择构建文件');
      return;
    }
    const frontCheck = form.getFieldValue('frontCheck');
    if (frontCheck) {
      let aaa: any = [];
      for (let i = 0; i < excelFrontData.length; i++) {
        let excelCheckMsg = checkExcelFront(excelFrontData[i]);
        if (excelCheckMsg?.msg?.length > 0) {
          aaa.push(excelCheckMsg);
        }
      }
      setCheckExcelMsg(aaa);
      if (aaa?.length > 0) {
        return;
      }
    }
    form.validateFields().then((values: any) => {
      let formValue: any = form.getFieldsValue();
      for (let i = 0; i < formValue.fj1.length; i++) {
        handlSingleExcel(formValue.fj1[i]);
      }
    });
  };

  // formConfig
	let formConfig = {
		form_layout_type: 'vertical', // 表单整体一列或多列布局: horizontal vertical 2 3 4 6 8 12
		form_label_input_layout: 'horizontal', // 标签与录入框排列方式: horizontal vertical
		form_items: [
			{ label: '请选择系统构建Excel文件', type: 'Upload', name: 'fj1', eventOnChange: 'changeUpload', maxCount: 10, tooltip: '每次最多构建文件数量为10' },
			{ label: '开启前端校验', type: 'Switch', name: 'frontCheck', defaultValue: myUtil.localStore.getItem('buildMFCheck'), eventOnChange: 'changeFrontCheck' },
		],
	}

  let singleExcelMsgNode = (excelMsg: any) => {
    let tmpNode: any = [];
    let tmpProgress: any = [];
    let isShow: any = false;
    let buildSum: any = excelMsg.length;
    let buildSum2: any = 0;
    for (let i = 0; i < excelMsg.length; i++) {
      let tmpProgressStatus: any = 'normal';
      if (excelMsg[i].buildCompleted) {
        buildSum2++
      }
      if (excelMsg[i]?.percent) {
        isShow = true;
      }
      if (excelMsg[i]?.msg?.length > 0) {
        tmpNode.push(<div style={{margin: '12px 0 0 0'}}>
          <Card title={excelMsg[i]?.name || ''}>
            <List
              itemLayout="horizontal"
              dataSource={excelMsg[i].msg}
              className='excel_msg'
              renderItem={(item: any, index: number) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<>
                        <Avatar className='em_avatar' shape="square" gap={6} size={20} >{index + 1}</Avatar>
                    </>}
                    title={<div className='excel_msg_title'>
                      <span className='em_posi'><b style={{color: item.code === '200' ? '#272727' : '#f50'}}>{item.msgType}</b></span>
                    </div>}
                    description={<>
                      { item?.msg && <div className='em_valid_value' style={{color: item.code === '200' ? '#575757' : '#f50'}}>{JSON.stringify(item?.msg) || ''}</div>}
                    </>}
                  />
                  <div style={{margin: '12px'}}>
                    <span className='em_sheet'>
                      <Tag color={item.code === '200' ? '#108ee9' : '#f50'} variant="filled">{item.code}</Tag>
                    </span>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </div>)
      }
      for (let m = 0; m < excelMsg[i]?.msg?.length; m++) {
        if (excelMsg[i]?.msg[m].code !== '200') {
          tmpProgressStatus = 'exception';
        }
      }
      if (tmpProgressStatus !== 'exception' && excelMsg[i].percent === 100) {
        tmpProgressStatus = 'success';
      }
      tmpProgress.push(<>
        <span>{excelMsg[i].name}</span>
        <Progress percent={excelMsg[i].percent} status={tmpProgressStatus}/>
      </>)
    }
    return isShow && <>
      <Typography.Title level={4} style={{marginTop: '24px'}}>
        构建日志 {`${buildSum2}/${buildSum}`}  { buildSum2 !== buildSum && <LoadingOutlined style={{color: '#108ee9'}}/> }
      </Typography.Title>

      <Flex gap="small" vertical>
        {tmpProgress}
      </Flex>
      {tmpNode?.length > 0 && tmpNode}
    </>;
  }

  let singleExcelMsgNodeFront = (excelMsg: any) => {
    let tmpNode: any = [];
    let isShow: any = false;
    for (let i = 0; i < excelMsg.length; i++) {
      if (excelMsg[i]?.msg?.length > 0) {
        isShow = true;
        tmpNode.push(<div style={{margin: '12px 0 0 0'}}>
          <Card title={excelMsg[i]?.name || ''}>
            <List
              itemLayout="horizontal"
              dataSource={excelMsg[i].msg || []}
              className='excel_msg'
              renderItem={(item: any, index: number) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<>
                        <Avatar className='em_avatar' shape="square" gap={6} size={20} >{index + 1}</Avatar>
                    </>}
                    title={<div className='excel_msg_title'>
                      <span className='em_posi'>异常填报位置</span>
                      <span className='em_sheet'><b>{item.sheet}</b>sheet页</span>
                      <span className='em_title'><b>{item.excelTitle}</b>单元格</span>
                      <span className='em_rowno'>第<b>{item.rowNo}</b>行</span>
                    </div>}
                    description={<>
                      { item?.cellValue && <div className='em_cell_value'>录入值：{item?.cellValue || ''}</div>}
                      { item?.validValue && <div className='em_valid_value'>合法值：{item?.validValue || ''}</div>}
                      { item?.info && <div className='em_info'>异常信息：{item?.info || ''}</div>}
                    </>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>)
      }
    }
    return isShow && <>
      <Typography.Title level={4} style={{marginTop: '24px'}}>前端校验结果</Typography.Title>
      {tmpNode}
    </>;
  }

  return (<>
    <Spin spinning={loading} delay={500}>
      <Typography.Title level={4}>系统构建</Typography.Title>
      <Card>
        <DDBaseForm config={formConfig} form={form} initialValues={{}} func={Func}/>
        <Divider titlePlacement="left" style={{marginTop: '48px'}}> <Typography.Title level={5}>插槽模块下载</Typography.Title></Divider>
        <div style={{lineHeight: '28px'}}>
          <div><a href={downloadUrl1}><FileExcelOutlined /> 数据字典_媒体管理</a></div>
        </div>
        <Divider titlePlacement="left" style={{marginTop: '48px'}}> <Typography.Title level={5}>模板下载</Typography.Title></Divider>
        <div style={{lineHeight: '28px'}}>
          <div><a href={downloadUrl3}><FileExcelOutlined /> 数据字典_字典导入模板</a></div>
        </div>
      </Card>
      {singleExcelMsgNodeFront(checkExcelMsg)}
      {singleExcelMsgNode(buildMsg)}
      <FooterToolbar >
        <Button type='default' onClick={onReset}>重置</Button>
        <Button type='primary' onClick={onSave} loading={loading}>保存</Button>
      </FooterToolbar>
    </Spin>
  </>);
};

export default TableList;
