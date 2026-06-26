import React, { useImperativeHandle, useState, memo } from 'react';
import { Button, Form, Modal, Upload, message, Radio, Space, Spin, Tooltip } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import ErrorMsgGrid from '@/components/DDImport/importError';
import { importTemplate, importExecl, downloadTemplate, templateDownloadCustom } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import importStyle from './importStyle.less';
import { useRouteData } from 'umi';

const { Dragger } = Upload;

export interface DDImportProps {
  onRef?: any;
  visible?: any;
  data?: [];
}
const errorMsgRef: any = React.createRef();
const DDImport: React.FC<DDImportProps> = ({
  onRef,
  visible = false,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);

  const [gridRef, setGridRef] = useState<any>(''); // 主表页面ref用于刷新
  const [masker, setMasker] = useState<any>(false);
  const [form] = Form.useForm();

  // 开启
  const showModal = (param: any, unitRef: any) => {
    setGridRef(param);
    form.resetFields();
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const onFinish = (value: any) => {
    const { importFile, importMode } = value;
    const data = new FormData();
    data.append('file', importFile[0].originFileObj);
    data.append('fileName', importFile[0].name);

    // showType 为true 传 drgz  为false 传 importMode
    if(gridRef.showType) {
      data.append('drgz', importMode);
    } else {
      data.append('importMode', importMode?importMode:'1');
    }

    if(gridRef.unit_lcswsx_dm) {
      data.append('lcswsxDm', gridRef.unit_lcswsx_dm);
    }
    if(gridRef.key){
      data.append('key', gridRef.key);
    }
    // 导入的共同方法根据传key去判断
    setMasker(true);
    if(!gridRef.url) {
      gridRef.url = `/ty/hx/dr/importData`;
    }
    importExecl(gridRef.url, data).then((response) => {
      setMasker(false);
      const { code, body, desc } = response;
      if (code === '200') {
        setModalVisible(false);
        gridRef.gridRef.current!.reload();
        message.success(`${desc?desc:'导入成功'}`);
      } else if (code === '900') {
        if(body){
          errorMsgRef.current!.showModal(body, gridRef.buttenHidden);
        } else {
          message.info(desc);
        }
      } else {
        setModalVisible(false);
        message.error(desc);
      }
    }).catch(() => {
      message.error('导入失败，请重新上传文件。');
    }).finally(() => {
      setMasker(false);
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // 字段设置
  const handleExcelXz = () => {
    if (gridRef.templateUrl) {
      setMasker(true);
      templateDownloadCustom(gridRef.templateUrl, gridRef.key).then((response) => {
        setMasker(false);
        if (response.code === '200') {
          const { blob, fileName } = response.body;
          myUtil.file.downloadExcel(blob, fileName);
        } else {
          message.error(response.desc);
        }
      })
    } else {
      if(gridRef.showType) {
        // let mbkey = gridRef.key.substring(0,gridRef.key.length-1) + 'C';
        // if(gridRef.import_mb_key) {
        //   mbkey = gridRef.import_mb_key;
        // }

        const data = {
          sfBhsj: 'N',
          sfScsm: 'N',
          key: gridRef.exkey,
        }
        setMasker(true);
        downloadTemplate(data).then((response) => {
          setMasker(false);
          if (response.code === '200') {
            const { blob, fileName } = response.body;
            myUtil.file.downloadExcel(blob, fileName);
          } else {
            message.error(response.desc);
          }
        })
      } else {
        const data = {
          key: gridRef.key + '_TMLT',
          uuid: '1',
        }
        setMasker(true);
        importTemplate(data).then((response) => {
          setMasker(false);
          if (response.code === '200') {
            const { blob, fileName } = response.body;
            myUtil.file.downloadExcel(blob, fileName);
          } else {
            message.error(response.desc);
          }
        })
      }
    }
  };

  const save = () => {
    form.submit();
  }

  const beforeUpload = (file: any) => {
    const isLt2M = file.size;
    if(isLt2M > 20971520) {
      message.info('上传文件不能超过20M。');
      return Upload.LIST_IGNORE;
    }
    if(!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('上传文件必须是Excel文件。');
      return Upload.LIST_IGNORE;
    } else {
      return false;
    }
  }

  const tailLayout = gridRef.showType?{
    wrapperCol: { offset: 5, span: 19 },
  } : {
    wrapperCol: { offset: 8, span: 16 },
  };
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  return (
    <>
      <Modal
        title="导入Excel文件"
        destroyOnHidden
        visible={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        onCancel={() => setModalVisible(false)}
        footer={(<>
          <Button onClick={() => setModalVisible(false)} type="default">取消</Button>
          {gridRef?.isYcMbxzBtn ? <></> : <Button onClick={handleExcelXz} type="default" >Excel模板下载</Button>}
          <Button onClick={save} type="primary">确定</Button>
        </>)}
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} key={'sjdrspin'} delay={100}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ importMode: gridRef.showType ? '1' : 1 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
          >
            <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="导入Excel文件" name="importFile" valuePropName="fileList" getValueFromEvent={normFile}
              rules={[{ required: true, message: '请选择上传的文件' }]}>
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
            { //
              gridRef.showStyle === '2' ? <div>{gridRef.exprotMsg?gridRef.exprotMsg:'提示：相同的数据，仅保留最后一次导入结果。'}</div> :
              <Form.Item name="importMode" {...tailLayout}>
                <Radio.Group>
                  <Space direction="horizontal">
                    {gridRef.showType ?
                    <>
                    <Radio key={"1"} value="1">覆盖并追加数据</Radio>
                    <Radio key={"2"} value="2">不覆盖只追加数据</Radio>
                    <Radio key={"3"} value="3">导入前清空数据</Radio>
                    </>
                    :
                    <>
                      <Radio key={"1"} value={1}>追加数据</Radio>
                      <Radio key={"2"} value={2}>导入前清空数据</Radio>
                    </>
                    }
                  </Space>
                </Radio.Group>
              </Form.Item>
            }
            {/* {
              gridRef.showType === '3' ? <></> :
              <Form.Item name="importMode" {...tailLayout}>
                <Radio.Group>
                  <Space direction="horizontal">
                    {gridRef.showType === '2' || gridRef.showType ?
                    <>
                    <Radio key={"1"} value="1">覆盖并追加数据</Radio>
                    <Radio key={"2"} value="2">不覆盖只追加数据</Radio>
                    <Radio key={"3"} value="3">导入前清空数据</Radio>
                    </>
                    :
                    <>
                      <Radio key={"1"} value={1}>追加原数据</Radio>
                      <Radio key={"2"} value={2}>导入前清空数据</Radio>
                    </>
                    }
                  </Space>
                </Radio.Group>
              </Form.Item>
              } */}

          </Form>
        </Spin>
      </Modal>
      <ErrorMsgGrid onRef={errorMsgRef} />
    </>
  );
};

export default memo(DDImport);

