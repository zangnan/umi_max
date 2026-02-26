import React, { useImperativeHandle, useState } from 'react';
import { baseImportExcel } from '@/services/hts/apiNs';
import CONSTANTS from '../DDAssist/constants';
import { InboxOutlined } from '@ant-design/icons';
// import DDBaseGrid from '../DDBaseGrid';
import { Modal, Form, Button, message, Upload, Radio, Spin, Drawer } from 'antd';
import excelUtil from '../DDAssist/util/excelUtil';

export interface ImportProps {
  onRef?: any;
  showRules?: any;
  doSubmit?: any;
  doTemplateDownload?: any;
  label?: any;
  maxCount?: any;
  multiple?: any;
  modalTitle?: any;
}

const DrawerList: React.FC<ImportProps> = ({
  onRef,
  showRules = true,
  doSubmit,
  doTemplateDownload,
  label = '导入Excel文件',
  maxCount = 100,
  multiple = false,
  modalTitle = '导入',
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalVisible2, setModalVisible2] = useState<boolean>(false);
  const [columns, setColumns] = useState<any>([]);
  const [templateUrl, setTemplateUrl] = useState<any>('');
  const [tableKey, setTableKey] = useState<any>('');
  const [masker, setMasker] = useState<any>(false);
  const [parseType, setParseType] = useState<any>(''); // front 前端解析
  const [current, setCurrent] = useState<any>();
  const [fileList, setFileList] = useState([]);
  const [excelFrontData, setExcelFrontData] = useState([]);
  const [parentParam, setParentParam] = useState<any>(null);
  const [form] = Form.useForm();

  // 开启
  const showModal = (param: any) => {
    const { refUnit } = param;
    setParentParam(param);
    setCurrent(refUnit?.current);
    setColumns(param?.columns || []);
    setTemplateUrl(param.templateUrl || '');
    setTableKey(param.tableKey || '');
    setParseType(param.parseType);
    form.resetFields();
    setExcelFrontData([])
    setModalVisible(true);
  };

  // handleDownload
  const handleDownload =() => {
    if (doTemplateDownload) { // 自行处理导入逻辑
      doTemplateDownload();
    } else {
      if (templateUrl) {
        window.open(templateUrl, '_self');
      } else {
        // message.info('模板地址不正确');
        excelUtil.export({
          excelName: `导入模版_${parentParam?.unitKey}.xlsx`,
          // setMasker: refUnitCurrent?.setMasker,
          sheetData: [
            { gridData: [], sheetName: `导入模版_${parentParam?.unitKey}`, cols: parentParam?.columns || [] },
          ]
      });
      }
    }
  }

  // doBaseImportExcel
  const doBaseImportExcel = (tabkeKey: any, data: any) => {
    if (!tableKey) {
      message.info('缺少导入物理表名称');
      return;
    }
    setMasker(true);
    baseImportExcel(tableKey, data).then((response: any) => {
      if (response.code !== '200') {
        message.error(response.msg);
      } else {
        message.success(response.msg);
        parentParam?.refGrid?.current?.reload();
      }
      setModalVisible(false);
      setMasker(false);
    });
  }

  // handleSave
  const handleSave = () => {
    if (doSubmit) { // 自行处理导入逻辑
      doSubmit({
        form,
        tableKey,
        header: columns,
        setModalVisible,
        data: excelFrontData,
        parentParam,
        setMasker,
      });
    } else {
      form.validateFields().then(values => {
        if (parseType === 'front') {
          const param: any = {
            header: columns,
            drgz: values.drgz,
            exportData: excelFrontData,
            parseType,
          }
          doBaseImportExcel(tableKey, param);
        } else {
          const formData = new FormData();
          formData.append('header', JSON.stringify(columns));
          formData.append('file', values.file[0].originFileObj);
          formData.append('drgz', values.drgz);
          doBaseImportExcel(tableKey, formData);
        };
        return false;
      })
    }
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
    const finalResAll: any = [];
    let res = excelUtil.readSheet(excelData);
    res.forEach((item: any) => { // 遍历sheet
      let jsonData = item?.jsonData;
      finalResAll.push({
        jsonData: jsonData,
        sheetName: item.sheetName,
      });
    });
    setExcelFrontData(finalResAll);
    setModalVisible2(true);
  }

  // 上传文件更新
  const fileChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    if (newFileList.length <= 0) {
      return;
    }
    let reader = new FileReader();
    reader.onload = function (e: any) {
      // if (!doSubmit) { // 自行处理则不展示
      let data = e.target.result;
      readWorkbook(data);
      // }
    };
    reader.readAsBinaryString(newFileList[0].originFileObj);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Modal
      title={modalTitle}
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X1}
      destroyOnHidden={true}
      footer={<>
        {!doSubmit && fileList.length > 0 && <>
          <Button onClick={() => setModalVisible2(true)}>预览</Button>
        </>}
        {!doSubmit && <>
          <Button onClick={() => handleDownload()}>模板下载</Button>
        </>}
        <Button type="primary" onClick={() => handleSave()}>提交</Button>
      </>}
      onCancel={() => setModalVisible(false)}
      maskClosable={false}
      className={`${masker ? 'dd_modal_show_masker' : ''}`}
    >
      <Spin tip="Loading..." spinning={masker} key={'sjdrspin'} delay={100}>
        <Form initialValues={{}} form={form} layout="vertical">
          <Form.Item
            label={label}
            name="file" valuePropName="fileList"
            rules={[{ required: true, message: '请选择上传的文件' }]}
            getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}
          >
            <Upload.Dragger
              maxCount={maxCount}
              multiple={multiple}
              showUploadList={true}
              beforeUpload={beforeUpload}
              accept=".xls, .xlsx"
              onChange={fileChange}
              fileList={fileList}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或将文件拖拽到此区域</p>
            </Upload.Dragger>
          </Form.Item>
          {showRules && <>
            <Form.Item label="导入规则" name="drgz" rules={[{ required: true, message: '请选择导入规则' }]} >
              <Radio.Group >
                <Radio key={'addOnly'} value={'addOnly'}>追加</Radio>
                <Radio key={'cleanAndAdd'} value={'cleanAndAdd'}>清空原有数据</Radio>
              </Radio.Group>
            </Form.Item>
          </>}
        </Form>
        {/* <Drawer title="导入数据预览" placement="bottom" onClose={() => setModalVisible2(false)} open={modalVisible2} height={350}>
          <DDBaseGrid userDataSource = {excelFrontData} columns={columns} showSerialNumber pagination={false} scroll={{y: 245}} />
        </Drawer> */}
      </Spin>
    </Modal>
  );
};

export default DrawerList;
