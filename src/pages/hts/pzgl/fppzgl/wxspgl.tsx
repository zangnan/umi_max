/**
 * 发票开具配置  外销商品管理
 */
import React, { useRef,useState } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './wxspglconfig';
import func from './wxspglFunc'
import FmGrid from './fm/wxspglfm'
import myUtil from '@/components/DDAssist/util';
import { message, Form, Button, Upload, Tooltip } from 'antd';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import importStyle from './importStyle.less';

import DDAlert from '@/pages/hts/components/DDAlert';
import { importTemplate, plfmdr } from '@/pages/hts/services/htsApi';
import { UploadOutlined } from '@ant-design/icons';
import ErrorMsgGrid from '@/components/DDImport/importError';
const { Dragger } = Upload;


const Index: React.FC<{ data?: any }> = ({
  data
}) => {
  const [masker, setMasker] = useState(false);
  const errorMsgRef: any = React.createRef();
  const fmGrid: any = useRef();
  func.getOtherRef = () => {
    const otherRef = [];
    // 赋码弹窗页面页面
    otherRef.push(fmGrid);
    otherRef.push(errorMsgRef);
    return otherRef;
  };

  let myConfig = { ...unitConfig };

  const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
  //模板下载key
  let  mbxzkey ='FPKJ_FPPZ_WXSPGGXHPZ_PRINT_REPORT';
  //导入参数
  let sfyggxh ='Y';
  myConfig.export_key = 'FPKJ_FPPZ_WXSPGGXHPZ_EXCEL';
  if (temp[0].fphwxxxqgzDm === '1') {
    mbxzkey = 'FPKJ_FPPZ_WXSPGL_PRINT_REPORT';
    myConfig.export_key = 'FPKJ_FPPZ_WXSPGL_EXCEL';
    sfyggxh ='N';
    const tempColumns = myConfig.grid_columns.filter((column: any) => {
      return (column.dataIndex != 'ggxhhgsh')
    })
    myConfig.grid_columns = tempColumns;
  }

  const beforeUpload = (file: any) => {
    const isLt2M = file.size;
    if (isLt2M > 10485760) {
      message.info('上传文件不能超过10M。');
      return Upload.LIST_IGNORE;
    }
    if(!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('上传文件必须是Excel文件。');
      return Upload.LIST_IGNORE;
    } else {
      return false;
    }
  }



 // 导入
 func.btnPldr  = async (param: any) => {
  const { unitRef, otherRef } = param;
  DDAlert.open({
    title: '导入Excel文件',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    button: [
      <Button key={'excelmbxz2'} onClick={() => func.downloadExcelMb(mbxzkey)}>Excel模板下载</Button>,
    ],
    isFormContent: true,
    width: 720,
    content: <>
      <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="导入Excel文件" name="file" valuePropName="fileList" 
      rules={[{ required: true, message: '请选择上传的文件' }]}
       getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
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
          unitRef.current!.setMasker(true);
          const formData = new FormData();
          formData.append('fileName', values.file[0].name);
          formData.append('sfyggxh',sfyggxh );
          formData.append('file', values.file[0].originFileObj);
          thisObj.setState({ masker: true });
          plfmdr(formData).then((response) => {
            const { code, msg, body } = response;
            DDAlert.close();
            if (code === '200') {
              message.success('导入成功');
              unitRef.current!.handleReset();
              otherRef[2].current!.getDclsjBttj(); // 刷新头部条数
            } else if (code === '900') {
              const obj: any = {
                drycxx: body.drycxx
              }
              otherRef[1].current?.showModal(obj,'N');
            } else {
              message.error(msg);
            }
          }).catch(() => {
           // message.error('导入失败，请重新上传文件。');
          }).finally(() => {
            unitRef.current!.setMasker(false);
          });
      });
    },
  });
};


  // 导入
  func.btnPldr2 = (param: any) => {
    const { unitRef, otherRef } = param;
    const beforeUpload = (file: any) => {
      const isLt2M = file.size;
      if (isLt2M > 10485760) {
        message.info('上传文件不能超过10M。');
        return Upload.LIST_IGNORE;
      }
      if (!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
        message.info('上传文件必须是Excel文件。');
        return Upload.LIST_IGNORE;
      }
      return true;
    }

    DDAlert.open({
      title: '导入',
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      button: [
        <Button key={'excelmbxz2'} onClick={() => func.downloadExcelMb(mbxzkey)}>Excel模板下载</Button>,
      ],
      content: <>
        <Form.Item label="导入Excel文件" name="file" valuePropName="fileList" rules={[{ required: true, message: '请选择上传的文件' }]} getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
          <Upload accept=".xls, .xlsx" maxCount={1} showUploadList={true} beforeUpload={beforeUpload} >
            <Button key={'scwj'} icon={<UploadOutlined />}>请选择上传的文件</Button>
          </Upload>
        </Form.Item>

      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          if (values.file[0].status === "done") {
            thisObj.setState({ masker: true });
            const formData = new FormData();
            formData.append('fileName', values.file[0].name);
            formData.append('sfyggxh',sfyggxh );
            formData.append('file', values.file[0].originFileObj);
            plfmdr(formData).then((response) => {
              thisObj.setState({ masker: false });
              const { code, msg, body } = response;
              DDAlert.close();
              if (code === '200') {
                message.success('导入成功');
                unitRef.current!.handleReset();
                otherRef[2].current!.getDclsjBttj(); // 刷新头部条数
              } else if (code === '900') {
                const obj: any = {
                  drycxx: msg
                }
                otherRef[1].current?.showModal(obj,'N');
                // if (!(msg === '' || msg === null)) {
                //   message.error(msg);
                // }
              } else {
                message.error(msg);
              }
            }).catch(() => {
             // message.error('导入失败，请重新上传文件。');
            }).finally(() => {
              thisObj.setState({ masker: false });
            });
          } else if (values.file[0].status === "uploading") {
            message.info('文件传输中，请稍后重试！')
          } else {
            message.info('文件传输失败，请重试！')
          }
        });
      },
    });
  }

  // 下载excel模板
  func.downloadExcelMb = (key: any) => {
    const obj = {
      sfBhsj: 'N',
      sfScsm: 'N',
      key,
    }
    setMasker(true);
    importTemplate(obj).then((response: any) => {
      if (response.code === '200') {
        const { blob, fileName } = response.body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(response.desc);
      }
    })
    setMasker(false);

  }

  return <>
    <div key={data} className='wxspgl'>
      <DDBunit2 config={myConfig} func={func} />
      <FmGrid onRef={fmGrid} />
      <ErrorMsgGrid onRef={errorMsgRef} />

    </div>
  </>;
};

export default Index;