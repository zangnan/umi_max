import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '../DDAssist/constants';
import { InboxOutlined } from '@ant-design/icons';
import { Modal, Form, Button, message, Upload, Drawer, Tabs, notification } from 'antd';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import myUtil from '../DDAssist/util';
import { createAppModuleByExcelData } from '@/services/hts/api';
import { DEFAULT_CONFIG } from './excelConfig.v2.constants';
import DDIT_TOOL_CONSTANTS from './excelConfig.v2.constants';
import excelUtil from '../DDAssist/util/excelUtil';
import excelV2Validator from './excelConfig.v2.validator';
// import '@antv/s2-react/dist/style.min.css';
import './style.less';
import assembleConfigUtil from './assemble_config_util';

const CONFIG_KEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

const DrawerList: React.FC<any> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalVisible2, setModalVisible2] = useState<boolean>(false);
  const [modalVisible3, setModalVisible3] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState('key_0');
  const [dataCfg0, setDataCfg0] = useState<any>();
  const [dataCfg1, setDataCfg1] = useState<any>();
  const [dataCfg2, setDataCfg2] = useState<any>();
  const [dataCfg3, setDataCfg3] = useState<any>();
  const [dataCfg4, setDataCfg4] = useState<any>();
  const [sortParams, setSortParams] = React.useState([]);
  const [fileList, setFileList] = useState([]);
  const [fparam, setParam] = useState<any>({});
  const [form] = Form.useForm();

  const columns0 = DDIT_TOOL_CONSTANTS.SHEET_CONFIG_APP;

  const columns1 = DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE;

  const columns2 = DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD;

  const columns3 = DDIT_TOOL_CONSTANTS.SHEET_CONFIG_SQL;

  const columns4 = [
    { title: 'sheet页', name: 'sheet页', field: 'sheet', width: 80 },
    { title: '行号', name: '行号', field: 'rowNo', width: 80 },
    { title: '标题', name: '标题', field: 'excelTitle', width: 180 },
    { title: '录入值', name: '录入值', field: 'cellValue', width: 180 },
    { title: '合法值', name: '合法值', field: 'validValue', width: 280 },
    { title: '异常信息', name: '异常信息', field: 'info' },
  ];

  // 开启
  const showModal = (param: any) => {
    setParam(param);
    setModalVisible(true);
  };

  // 下载模板
  const handleDownload =() => {
    window.open(`${APP_BASE ? '/' + APP_BASE : ''}/import_template/template_modules.xlsx`, '_self');
  }

  // beforeUpload
  const beforeUpload = (file: any) => {
    const isLt2M = file.size;
    if (isLt2M > 104857600) {
      message.info('上传文件不能超过100M。');
      return Upload.LIST_IGNORE;
    }
    return false;
  }

  // readWorkbook
  const readWorkbook = (excelData: any) => {
    let res = excelUtil.readSheet(excelData);
    // debugger
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
    setDataCfg0({
      fields: { columns: columns0 },
      meta: [ ...columns0 ],
      data: getFinalRes(res[0].jsonData, columns0),
    });
    setDataCfg1({
      fields: { columns: columns1 },
      meta: [ ...columns1 ],
      data: getFinalRes(res[1].jsonData, columns1),
    });
    setDataCfg2({
      fields: { columns: columns2 },
      meta: [ ...columns2 ],
      data: getFinalRes(res[2].jsonData, columns2),
    });
    setDataCfg3({
      fields: { columns: columns3 },
      meta: [ ...columns3 ],
      data: getFinalRes(res[3].jsonData, columns3),
    });
    setModalVisible2(true);
    setModalVisible(false);
  }

  // 上传文件更新
  const fileChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    if (newFileList.length <= 0) {
      return;
    }
    let reader = new FileReader();
    reader.onload = function (e: any) {
      let data = e.target.result;
      readWorkbook(data);
    };
    reader.readAsBinaryString(newFileList[0].originFileObj);
  };

  const s2Options: SheetComponentOptions = {
    height: 600,
    seriesNumber: {
      enable: true,
      text: '序号'
    },
    frozen: { colCount: 1, },
    // style: {
    //   colCell: {
    //     width: (colNode: any) => {
    //       return colNode.extra?.width;
    //     },
    //   },
    // },
  };

  const header: any =  {
    export: { open: true },
    advancedSort: {
      open: true,
      sortParams,
      onSortConfirm: (ruleValues: any, sortParams: any) => {
        setDataCfg0({ ...dataCfg0, sortParams });
        setSortParams(sortParams);
      },
    },
    switcher: { open: true },
  };

  const header0: any =  { ...header, title: '1.基础信息' };
  const header1: any =  { ...header, title: '2.模块' };
  const header2: any =  { ...header, title: '3.字段' };
  // const header3: any =  { ...header, title: '4.自定义SQL' };
  const header4: any =  { ...header, title: '下列数据存在异常，需核实后重新导入' };

  const sheetCompCfg: any = {
    sheetType: 'table',
    options: s2Options,
    adaptive: { width: true, height: true },
    themeCfg: { name: 'gray' },
  };

  // 加载Excel至视图
  const loadExcelToView = () => {
    let sheet0: any = dataCfg0?.data || [];   // 1.基础信息
    let sheet1: any = dataCfg1?.data || [];   // 2.模块
    let sheet2: any = dataCfg2?.data || [];   // 3.字段
    const excelUnitArr: any = [];
    for (let i = 0; i < sheet1.length; i++) { // 遍历所有模块
      let sheet1Arr: any = sheet1[i];
      let sheet1UnitKey: any = sheet1Arr?.module_key?.toLowerCase();
      let sheet2Arr: any = sheet2.filter((tmp: any) => (tmp?.module_key?.toLowerCase() === sheet1UnitKey));

      // 数据处理
      sheet2Arr.forEach((item: any) => {
        item[CONFIG_KEY.FIELD_ENG] = item[CONFIG_KEY.DICT_FIELD_ENG];
        item[CONFIG_KEY.FIELD_CHI] = item[CONFIG_KEY.DICT_FIELD_CHI];
      });
      // debugger;
      let sheet2ArrGrid: any = sheet2Arr.filter((tmp: any) => (tmp[CONFIG_KEY.GRID_USED] === '1'));
      let sheet2ArrForm: any = sheet2Arr.filter((tmp: any) => (tmp[CONFIG_KEY.FORM_ITEM_USED] === '1'));
      // let excelConfig = getViewConfig(sheet1Arr, sheet2ArrGrid, sheet2ArrForm);
      let excelConfig: any = getViewConfig({
        sheet0,
        sheet1Arr,
        sheet2Arr,
        sheet2ArrGrid,
        sheet2ArrForm,
      });
      if (!excelConfig?.backend_dev_dict) {
        excelConfig.backend_dev_dict = {};
      }
      excelConfig.backend_dev_dict.appModule = {
        appModuleName : sheet1Arr.unit_key_name,
        appModulePath : sheet1Arr.module_key,
      }
      // 如果多个模块，默认加载第一个
      if (i === 0) {
        fparam?.setMyConfig(excelConfig);
        fparam?.isShowPageElement(excelConfig);
        fparam?.loadConfigView(excelConfig)
        setModalVisible2(false);
      }
      // if (sheet1ArrAllModule.length > 1) {
      const excelUnit: any = {
        id: myUtil.text.uuid(),
        module_key: sheet1UnitKey,
        unit_key_name: sheet1Arr.unit_key_name,
        config: excelConfig,
        used: i === 0 ? true : false,
      }
      excelUnitArr.push(excelUnit);
      // currentSchemeConfig.forEach((item: any) => { delete item.used; });
      // currentSchemeConfig.push(scheme);
      // setModalVisible4(false)
      // setSchemeList(currentSchemeConfig);
      // }
    }
    fparam?.setExcelImportUnitList(excelUnitArr);
    if (sheet1.length > 1) {
      fparam?.setModalVisible6(true);
    }
    let originData = {
      sheet0: dataCfg0,
      sheet1: dataCfg1,
      sheet2: dataCfg2,
      sheet3: dataCfg3,
    }
    fparam?.setExcelOriginalData(originData)
    return {
      excelImportUnitList: excelUnitArr,
      excelOriginalData: originData
    }
  }

  const saveExcelView = () => {
    // fparam.setMasker(true);
    // fparam.setModal6Loading(true);
    let { excelImportUnitList, excelOriginalData } = loadExcelToView();
    // excel录入内容校验
    let msg = excelV2Validator.run({ excelImportUnitList, excelOriginalData });
    // console.table(msg);
    if (msg.length > 0) {
      setDataCfg4({
        fields: { columns: columns4 },
        meta: [ ...columns4 ],
        data: msg,
      });
      fparam?.setModalVisible6(false); // 不显示Excel导入模块一览
      setModalVisible3(true);
      return;
    }

    // setLoadingViewSetting(true);
    let excelData = excelImportUnitList;
    let para = {
      excelData,
      excelOriginalData
    }
    return;
    createAppModuleByExcelData(para).then((response1: any) => {
      fparam.setMasker(false);
      fparam.setModal6Loading(false);
      // setLoadingViewSetting(false);
      if (response1?.code === '200') {
        message.info('保存成功')
      } else {
        notification.error({
          message: '保存失败',
          description: <>{JSON.stringify(response1?.msg)}</>,
          placement: 'top',
          duration: null,
        });
      }
    });
  }

  // excel 获取视图配置
  const getViewConfig = ({sheet0, sheet1Arr, sheet2Arr, sheet2ArrGrid, sheet2ArrForm}: any) => {
    let excelConfig: any = { ...DEFAULT_CONFIG };
    // 每个config的原始数据
    excelConfig.origin_excel = {
      sheet0: sheet0,
      sheet1: sheet1Arr,
      sheet2: sheet2Arr,
    }
    // 主键
    let grid_row_key: any = 'uuid';
    // excelConfig.grid_row_key = grid_row_key;
    // 接口api处理
    let dbObj = (sheet1Arr.dbObj || '').toLowerCase();
    let dbKey = (sheet1Arr.dbKey || '').toLowerCase(); // table_test1.uuid           table_test1.uuid,table_test2.uuid
    // 接口api处理 主键
    let dictKeysArr = [];
    if (dbKey !== '/') {
      let tmpKey = dbKey.split(',') || [];
      tmpKey.forEach((itemKey: any) => {
        let tmpKey2 = itemKey.split('.') || [];
        let tmpKey2Object = tmpKey2[0];
        let tmpKey2Key = tmpKey2[1];
        dictKeysArr.push( { dictFieldName: tmpKey2Key, dictObjectTableName: tmpKey2Object });
      });
      if (tmpKey.length === 1) {
        grid_row_key = tmpKey[0].split('.')[1]; // table_test1.uuid
      } else if (tmpKey.length > 1) {
        grid_row_key = [];
        tmpKey.forEach((itemKey: any) => {
          grid_row_key.push(itemKey.split('.')[1]);
        });
      }
    } else {
      // 默认uuid
      dictKeysArr.push( { dictFieldName: 'uuid', dictObjectTableName: dbObj } );
    }
    excelConfig.grid_row_key = grid_row_key;
    // sheet2 - 筛选项
    let filterArr = [];
    for (let eld = 0; eld < sheet2ArrGrid.length; eld++) {
      if (sheet2ArrGrid[eld][CONFIG_KEY.FILTER_ITEM_TYPE]) {
        filterArr.push(sheet2ArrGrid[eld]);
      }
    }
    excelConfig = {
      ...excelConfig,
      ...assembleConfigUtil.module.getModule(sheet1Arr), // Module
      ...assembleConfigUtil.module.getModuleGrid(sheet1Arr), // Grid
      ...assembleConfigUtil.module.getModuleForm(sheet1Arr), // Form
      ...assembleConfigUtil.module.getModuleApi(sheet1Arr), // Api
      ...assembleConfigUtil.module.getModuleBtn(sheet1Arr), // 按钮
      grid_columns: assembleConfigUtil.module.getGrid(sheet2ArrGrid),
      filter_items: assembleConfigUtil.module.getFilter(filterArr)?.filter_items,
      grid_filter_quick: assembleConfigUtil.module.getFilter(filterArr)?.grid_filter_quick,
      form_items: assembleConfigUtil.module.getForm(sheet2ArrForm),
    }
    // debugger;
    // fparam?.setMyConfig(excelConfig);
    // fparam?.isShowPageElement(excelConfig);
    // fparam?.loadConfigView(excelConfig)
    // setModalVisible2(false);
    // debugger;
    return excelConfig;
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (<>
    <Modal
      title='导入'
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X1}
      destroyOnHidden={true}
      footer={<>
        {fileList.length > 0 && <Button onClick={() => setModalVisible2(true)}>预览</Button>}
        <Button onClick={() => handleDownload()}>模板下载</Button>
      </>}
      onCancel={() => setModalVisible(false)}
      maskClosable={false}
    >
      <Form initialValues={{}} form={form} layout="vertical">
        <Form.Item
          label="导入Excel文件"
          name="file" valuePropName="fileList"
          rules={[{ required: true, message: '请选择上传的文件' }]}
          getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}
        >
          <Upload.Dragger
            maxCount={1}
            showUploadList={true}
            beforeUpload={beforeUpload}
            accept=".xls, .xlsx"
            onChange={fileChange}
            fileList={fileList}
          >
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p className="ant-upload-text">点击或将文件拖拽到此区域</p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
    <Drawer title="导入数据预览" placement="bottom" onClose={() => setModalVisible2(false)} open={modalVisible2} height={document.documentElement.clientHeight}>
      <Tabs
        size="small"
        activeKey={activeKey}
        onChange={(actkey: any) => {setActiveKey(actkey)}}
        items={[
          { key: 'key_0', children: <SheetComponent {...sheetCompCfg} dataCfg={dataCfg0} header={header0} />, label: '1.基础信息' },
          { key: 'key_1', children: <SheetComponent {...sheetCompCfg} dataCfg={dataCfg1} header={header1} />, label: '2.模块' },
          { key: 'key_2', children: <SheetComponent {...sheetCompCfg} dataCfg={dataCfg2} header={header2} />, label: '3.字段' },
        ]}
        tabBarExtraContent={{ right: <>
          <Button type='link' size='small' onClick={() => {loadExcelToView()}} >载入视图</Button>
          <Button type='link' size='small' onClick={() => {saveExcelView()}} >载入并保存视图</Button>
        </> }}
      />
    </Drawer>
    <Drawer title="导入异常数据一览" placement="bottom" onClose={() => setModalVisible3(false)} open={modalVisible3} height={document.documentElement.clientHeight}>

    <div>
      <SheetComponent {...sheetCompCfg} dataCfg={dataCfg4} header={header4}/>
    </div>

    </Drawer>
  </>);
};

export default DrawerList;
