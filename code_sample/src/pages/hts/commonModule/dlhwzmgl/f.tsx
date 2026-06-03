// 代理货物证明管理
import React from 'react';
import { message, Badge, Tooltip, Button, Form, Upload } from 'antd';
import { intl as intl2 } from '@/pages/common/myUtil';
import { checkDlzm, importData, importTemplate, scdlzm } from '@/services/hts/api';
import DDAlert from '@/components/DDAlert';
import moment from 'moment';
import importStyle from './importStyle.less';
import myUtil from '@/pages/common/myUtil';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const Func: any = {
  unitRef: React.createRef(),
};

Func.columnsRender = {
  // 生成状态
  renderSybz: (param: any) => {
    const {record,text} = param;
    let sybz = record.sybz;
    let col: any = <></>;
    let badge :any = <></>;
     if (sybz === 'Y') {
      col = (
          <div>生成状态：<Badge status="success" />已生成</div>
      );
      badge = <Badge status="success" />;
    }  else{
      col = (
          <div>生成状态：<Badge status="error" />未生成</div>
      );
      badge = <Badge status="error" />;
    }
    const html2 = <Tooltip title={col}>{badge}{text}</Tooltip>;
    return html2;
  },

}

Func.scCkmx = (param: any) => {
  const { selectionRows,otherRef } = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  for(let i=0;i<selectionRows.length;i++){
    if(selectionRows[i].sybz == 'Y'){
      message.info(intl2.formatMessage({ id: 'message_mdts_validator_hasSybzSj' }));
      return;
    }
    if(selectionRows[i].cytgbz != 'Y'){
      message.info(intl2.formatMessage({ id: 'message_mdts_validator_hasSybzWjc' }));
      return;
    }
  }
   otherRef[0].current?.showModal(param);
}

Func.getSj= (param: any) => {
  const { otherRef } = param;
  otherRef[1].current?.showModal(param,'030501');
}
// 数据检查
Func.shjcFunc = (param: any, checkFlag: any = 'N') => {
  function funcCheckDlzm(params: any) {
    unitRef.current!.setMasker(true);
    checkDlzm(params).then(async (res) => {
      unitRef.current!.setMasker(false);
      const { body, code, desc } = res;
      if (code !== '200') {
        message.error(desc);
      } else {
        // 根据响应的结果判断是给出提示信息还是弹出维护页面
        const resData = JSON.parse(body);
        if ('N' == resData.msgKey) {
          message.success(resData.msgInfo);
          unitRef.current!.reload2();
        } else {
          if ('Y' == resData.errTypeHl) {
            const gridDataHl = JSON.parse(resData.gridDataHl);
            otherRef[3].current?.showModal(param, gridDataHl);
            return;
          } else if ('Y' == resData.errTypeSp) {
            const gridDataSp = JSON.parse(resData.gridDataSp);
            otherRef[2].current?.showModal(param, gridDataSp);
            return;
          } else if ('Y' == resData.msgLjDateKey) {
            message.error(resData.msgInfo);
          } else if ('Y' == resData.errTypeRe) {
            message.error(resData.gridDataRe);
            // 原系统代码
            // layui.myUtil.msgMore({
            //   msg: resData.gridDataRe,
            //   type: 'error'
            // });
          } else {
            message.error(resData.msgInfo);
          }
        }
      }
    })
  }

  const { otherRef, unitRef } = param;
  let params :any= {};
  let msg = '';
  let info = '';
  const selectionRowKeys = param?.selectionRowKeys;
  const searchModel =  param?.unitRef?.current?.getGridParams()?.searchModel;
  params.bgdNoEterArray = null;
  if (selectionRowKeys == null || selectionRowKeys.length == 0) {
    // 未勾选
    searchModel.forEach((item: any) => {
      if (item.op === 'dydy') {
        params[item.property + 'Qs'] = moment(item.value).format('YYYY-MM-DD')
      } else if (item.op === 'xydy') {
        params[item.property + 'Jz'] = moment(item.value).format('YYYY-MM-DD')
        params['rangeDate' + item.property] = params[item.property + 'Qs'] + ' - ' + params[item.property + 'Jz'];
        delete params[item.property + 'Qs'];
        delete params[item.property + 'Jz'];
      } else {
        params[item.property] = item.value;
      }
    });
    info = '确认对当前筛选条件下所有数据进行数据检查操作？'
  } else {
  //勾选
    params.uuids = selectionRowKeys;
    info ='确认对当前勾选数据进行数据检查操作？';
    msg = '温馨提示：若未勾选数据，将会对当前筛选条件下的所有报关单数据，进行数据检查。' ;
  }
  // checkFlag用于记录本次数据已进行过一次数据检查
  if (checkFlag != 'Y') {
    DDAlert.open({
      title: '系统提示',
      info: info,
      infoType: 'warning',
      content: msg,
      closeStatus: true,
      okCallbackFn: function () {
        funcCheckDlzm(params);
      },
    });
  } else {
    funcCheckDlzm(params);
  }

}

Func.dyFunc= (param: any) => {
  const otherRef = param.unitRef.current?.getOtherRefs();
  otherRef[4].current?.showModal(param);
}


Func.btnDr = (param: any) => {
  const { unitRef, otherRef } = param;
  const beforeUpload = (file: any) => {
    if(!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('上传文件必须是Excel文件。');
      return Upload.LIST_IGNORE;
    } else {
      return false;
    }
  }

  DDAlert.open({
    title: '导入Excel文件',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    width: 720,
    initFormContentValues: { drgz: 1 },
    button: [
      <Button key={'excelmbxz'} onClick={() => Func.downloadExcel('SAAS_SJGL_SJXZ_STFYKJDLZM_DC')}>Excel模板下载</Button>,
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
        thisObj.setState({ masker: true });
        const formData = new FormData();
        formData.append('file', values.file[0].originFileObj);
        formData.append('fileName', values.file[0].name);
        formData.append('drgz', values.file[0].name);
        importData(formData).then((response) => {
          const { code, msg, desc } = response;
          DDAlert.close();
          if (code === '200') {
            message.success(desc);
            unitRef.current!.reload2();
          } else if (code === '900') {
            message.error(msg);
          } else {
            message.error(desc);
          }
        }).catch(() => {
          message.error('导入失败，请重新上传文件。');
        }).finally(() => {
          thisObj.setState({ masker: false });
        });
      });
    },
  });
}

// 下载excel模板
Func.downloadExcel = (param: string) => {
  importTemplate({ key: param }).then((response) => {
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  })
}

// 删除
Func.btnDelete = (param: any) => {
  const { selectionRowKeys, unitRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    DDAlert.open({
      title: '系统提示',
      info: '确定要删除选择的数据吗？',
      infoType: 'question',
      modalType: 'confirm',
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        scdlzm({ uuids : selectionRowKeys }).then((response) => {
          DDAlert.close();
          const { code, desc } = response;
          if (code === '200') {
            message.success(intl2.formatMessage({ id: 'message_delete_success' }));
            unitRef.current!.reload2();
          } else {
            message.error(desc);
          }
        })
      },
    });
  }
}

export default Func;