import React from 'react';
import { importData, getBgdInfoHgck, downloadTemplate, bgdpdfyl } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import { message, Tooltip, Form, Upload, Button } from 'antd';
import { ClockCircleOutlined, InboxOutlined  } from '@ant-design/icons';
import myUtil from '@/components/DDAssist/util';
import importStyle from './importStyle.less';
const { Dragger } = Upload;
import CkbgdFunc from "../../common/CkbgdFunc";

const ckfpFunc: any = {
  refUnit: React.createRef(),
};

// 批量补填
ckfpFunc.btnPlbt = (param: any) => {
  const { refUnit, otherRef } = param;
  const gridData = refUnit.current?.getGridData()
  if (gridData.length === 0) {
    message.info('当前筛选条件下无数据，请确认！');
    return;
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
    }
    return false;
  }
  DDAlert.open({
    title: '导入Excel文件',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    width: 720,
    button: [
      <Button key={'excelmbxz'} onClick={() => ckfpFunc.downloadExcelMb('WBSJ_CKBGD_DQRYF_DC')}>Excel模板下载</Button>,
    ],
    content: <>
      <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="导入Excel文件" name="file" valuePropName="fileList" rules={[{ required: true, message: '请选择上传的文件' }]} getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
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
        if (values.file[0].originFileObj) {
          thisObj.setState({ masker: true });
          const formData = new FormData();
          formData.append('fileName', values.file[0].name);
          formData.append('file', values.file[0].originFileObj);
          formData.append('key', "WBSJ_CKBGD_DQRYF_DR");
          importData(formData).then((response: any) => {
            const { code, msg, body } = response;
            DDAlert.close();
            if (code === '200') {
              message.success('导入成功');
              // refUnit.current!.handleReset();
              // 刷新头部条数
              otherRef[1].current!.getDclsjBttj()
              setTimeout(() => {
                refUnit.current!.reload();
                thisObj.setState({ masker: false });
              },300)
            } else if (code === '900') {
              thisObj.setState({ masker: false });
              otherRef[2].current?.showModal(body.drycxx, 'dr', '系统消息', body.druuid);
            } else {
              thisObj.setState({ masker: false });
              message.error(msg);
            }
          }).catch(() => {
            message.error('导入失败，请重新上传文件。');
          }).finally(() => {
            thisObj.setState({ masker: false });
          });
        } else {
          message.info('文件传输失败，请重试！')
        }
      });
    },
  });
}

// 下载excel模板
ckfpFunc.downloadExcelMb = (key: any) => {
  const obj = {
    sfBhsj: 'N',
    sfScsm: 'N',
    key,
  }
  downloadTemplate(obj).then((response: any) => {
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  })
}

ckfpFunc.columnsRender = {
  renderBgdscmx18bgdh: (param: any) => {
    const ckbgdh = param?.text;
    const html = <a onClick={(e) => { e.stopPropagation(); ckfpFunc.openCkbgdh2(param, ckbgdh) }}>{ckbgdh}</a>;
    const html2 = <Tooltip title={ckbgdh}>{html}</Tooltip>;
    return html2;
  },
};

ckfpFunc.openCkbgdh = (param: any, ckbgd: any) => {
  const { otherRef } = param;
  ckbgd = ckbgd.substring(0, 18);
  getBgdInfoHgck({ ckbgdh: ckbgd }).then((res: any) => {
    if (res.code == '200') {
      otherRef[0].current?.showModal(param, ckbgd, res?.body);
    }
  })
}

ckfpFunc.openCkbgdh2 = (param: any, ckbgd: any) => {
  const { otherRef, record, refUnit} = param;
  refUnit.current!.setMasker(true);
  bgdpdfyl({ uuid: record?.uuid, bgdhgbh: record?.bgdhgbh }).then((res: any) => {
    refUnit.current!.setMasker(false);
    if (res.code == '200') {
      otherRef[0].current?.showModal(res?.body, { uuid: record?.uuid, bgdhgbh: record?.bgdhgbh });
    } else {
      message.error(res.msg);
    }
  })
}

// 转不退税
ckfpFunc.btnZbts = (param: any) => {
  const { otherRef } = param;
  CkbgdFunc.btnZbts(param, otherRef[1].current);
  /*const { refUnit, selectionRowKeys, otherRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  DDAlert.open({
    title: '转不退税',
    info: '确定对勾选数据进行转不退税操作吗？',
    modalType: 'confirm',
    infoType: 'question',
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      const data = { uuids: selectionRowKeys };
      bgdzbts(data).then((response: any) => {
        const { code, msg } = response;
        if (code === '200') {
          message.success('转不退税成功！');
          // 刷新头部条数
          otherRef[1].current!.getDclsjBttj();
          setTimeout(() => {
            refUnit.current!.reload();
            close();
            thisObj.setState({ masker: false });
          },300)
        } else {
          thisObj.setState({ masker: false });
          message.error(msg);
        }
      })
    }
  })*/
}

export default ckfpFunc;
