import React from 'react';
import { queryCjCsh, queryCjGlh } from '@/pages/hts/services/htsApi';
import { Button, DatePicker, Spin, Modal, Form, Radio, Space, Input, message, Upload, Tooltip} from 'antd';
import DDAlert from '@/pages/hts/components/DDAlert';
import myUtil from '@/components/DDAssist/util';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import importStyle from './importStyle.less';
import { importData, queryPager } from '@/pages/hts/services/htsApi';



const { Dragger } = Upload;

const Func: any = {
  refUnit: React.createRef(),
};

// 配单
Func.handPdColumns = (param: any) => {
  const { refUnit, record, otherRef } = param;
  refUnit.current!.setMasker(true);
  queryCjCsh({tableKey: "MTS_ZXSB_SB_MTS_TSSB_G"}).then((response) => {
    const { code, body } = response;
    refUnit.current!.setMasker(false);
    if (code === '200') {
      const obj = {
        sbpc: body.sbpc,
        ssq: body.ssq,
      }
      queryCjGlh(obj).then((res: any)=>{
        if(res.code === '200') {
          const para = body;
          para.glh = res.body.glh
          otherRef[0].current!.showModal(para, refUnit,record);
        }
      })
    }
  })
}
// 模板下载
Func.mbxz = (param: any) => {
  const {otherRef,refUnit} = param;
  otherRef[0].current?.showModal(refUnit);
}

const beforeUpload = (file: any) => {
  if (!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
    message.info('上传文件必须是Excel文件。');
    return Upload.LIST_IGNORE;
  } else {
    return false;
  }
}
//台账导入
Func.tzdr = (param: any) => {
  const { refUnit, otherRef } = param;
  DDAlert.open({
    title: '台账导入',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    width: 720,
    initFormContentValues: { drgz: 1 },
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
                <td width="20%" className={importStyle.textCenter}>{myUtil.text.formatNum(file.size ? (file.size / 1024) : 0, '0,0')}KB</td>
                <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined />&nbsp;待上传</td>
                <td width="17%" className={importStyle.textCenter}><a onClick={() => actions.remove()}>删除</a></td>
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
      <Form.Item name="drhcqd_wxts" wrapperCol={{  span: 24 }}>
        温馨提示：<br/>
        1、未使用的数据重复导入会覆盖，已使用的数据不支持重复导入;<br/>
        2、若导入台账的出口发票号不为空，更新报关单表的出口发票号;<br/>
        3、单次导入最多支持3万条
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if (values.file[0].originFileObj) {
          thisObj.setState({ masker: true });
          const formData = new FormData();
          formData.append('fileName', values.file[0].name);
          formData.append('file', values.file[0].originFileObj);
          formData.append('key', "CKTS_MTS_TZPD_TZPDMX_TZDR");
          importData(formData).then((response) => {
            const { code, msg, body } = response;
            DDAlert.close();
            if (code === '200') {
              message.success(msg);
              thisObj.setState({ masker: false });
              refUnit.current!.reload();
            } else if (code === '900') {
              otherRef[1].current?.showModal(body.drycxx,  body.druuid);
              if(!(msg === '' || msg === null)){
                message.error(msg);
              }
              thisObj.setState({ masker: false });
            } else {
              message.error(msg);
              thisObj.setState({ masker: false });
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
    }
  });
}

// 自动配单
Func.zdpd = (param: any) => {
  const {otherRef,refUnit, selectionRowKeys, gridRef} = param;
  const gridData  = refUnit.current.getGridData();
  if (gridData.length === 0) {
    message.info('当前筛选条件下无数据，请确认！');
    return;
  }
  const cxModel: any = [];
  if (selectionRowKeys?.length > 0) {
    cxModel.push({op: 'zdy', property: 'uuids', values: selectionRowKeys});
  } else {
    const searchModel = refUnit.current?.getGridParams().searchModel || [];
    const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
    const allSearchModel: any = searchModel.concat(headerSearchModel);
    cxModel.push(...allSearchModel);
  }
  cxModel.push({ property: 'sfcxZj', value: 'Y', op: 'zdy' });
  cxModel.push({ property: 'sfcxYwzj', value: 'Y', op: 'zdy' });
  const obj = {
    page: 1,
    pageSize: 1000000,
    key : 'MTS_SJPP_TZPD_QUERY_PAGE',
    searchModel: cxModel
  }
  refUnit.current?.setMasker(true);
  queryPager(obj).then((res: any) => {
    refUnit.current?.setMasker(false);
    const { code, body, msg } = res;
    if (code === '200') {
      const bgdts = body?.rowCount || 0;
      if (bgdts <= 0) {
        message.warning('无可配单的数据');
      } else {
        const params = {
          bgdts: body?.rowCount || 0,
          sxtj : cxModel
        }
        otherRef[2].current?.showModal(refUnit, params);
      }
    } else {
      message.error(msg);
    }
  })
  // otherRef[2].current?.showModal(refUnit);
}

export default Func;
