import React from 'react';
import 'moment/locale/zh-cn';
import { Form, message, Upload, Button, Tooltip } from 'antd';
import DDAlert from '@/pages/hts/components/DDAlert';
import importStyle from '../../../style.less';
import myUtil from '@/components/DDAssist/util';
import { badzCallServiceCheck, uploadBadzWjnr, deleteGhhtDatas } from '@/pages/hts/services/htsApi';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { intl as intl2 } from '@/components/DDAssist/util';
import htFun from '../../../common/htcx/func';
const { Dragger } = Upload;

const Func: any = {
  refUnit: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  const { handleModalVisible, form } = param;
  const userInfo = myUtil.sessionStore.getItem('userInfo');
  console.log(userInfo?.qxQys[0]);
  const cktsqylxDm = userInfo?.qxQys[0]?.cktsqylxDm;
  let htlxDm;
  if(cktsqylxDm == 'WM') {
    htlxDm = '01';
  } else {
    htlxDm = '02';
  }
  form.setFieldsValue({
    ywbh: myUtil.localStore.getItem('ywbh'),
    jfmc: userInfo?.qxQys[0]?.nsrmc,
    htlxDm: htlxDm
  });
  handleModalVisible(true);
}
// 编辑表单初始化
Func.initEditForm = (param: any) => {
  const { handleModalVisible, refUnit } = param;
  const selectionRows = refUnit.current.getSelectionRows()
  if (selectionRows[0].sfzdcc === 'Y') {
    message.info('已经装订成册的数据不允许修改');
    return;
  } else if (selectionRows[0].sjlyDm === '02') {
    message.info('外部来源的数据不允许修改');
    return;
  } else {
    handleModalVisible(true);
  }
}

// 表单保存前调用
Func.formBeforeSubmit = (param: any) => {
  const { form } = param;
  const ywbh = form?.getFieldsValue().ywbh;
  if(ywbh) {
    myUtil.localStore.setItem('ywbh', ywbh);
  }
  return true;
}

// 列表自定义渲染
Func.columnsRender = {
  // 商品名称及数量
  renderSpmcjsl: (param: any) => {
    const { otherRef } = param;
    return (
      <>
        <Button type="link" onClick={(event: any) => { 
          event.stopPropagation();
          otherRef[0].current?.showModal(param, 'ghht');
        }}>
          查看详情
        </Button>
      </>
    );
  },
  // 关联关系
  renderGlgx: (param: any) => {
    const { otherRef } = param;
    return (
      <>
        <Button type="link" onClick={(event: any) => { 
          event.stopPropagation();
          otherRef[1].current?.showModal(param);
        }}>
          关联关系
        </Button>
      </>
    );
  },
}

// 表单校验
Func.validator = {
  // 合同编号
  htbh: (form: any) => {
    const validator = async (_rule: any) => {
      const formValue = form?.getFieldsValue();
      const obj = {
        uuid: formValue.uuid,
        property: "htbh",
        value: formValue.htbh,
        ywKey: "ghht"
      };
      await badzCallServiceCheck(obj).then((res: any)=> {
        if (res.code === '900') {
          return Promise.reject(new Error(res.msg));
        }
        return Promise.resolve();
      }).catch((err) => {
        return Promise.reject(err);
      });
      return Promise.resolve();
    };
    return { validator };
  },
}

// 预览
Func.handleColumnsYl = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[2].current?.showModal(param, true);
  }
}


Func.del = (param: any) => {
  const { selectionRowKeys, selectionRows, refUnit } = param;
  let flag = false;
  selectionRows.forEach((element: any) => {
    if (element.sfzdcc == 'Y') {
      flag = true;
    }
  });
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else if (flag) {
    message.info("存在已装订成册的数据，不可删除！");
    return;
  } else {
    DDAlert.open({
      title: '系统提示',
      info: '确定要删除选择的数据吗？',
      infoType: 'question',
      modalType: 'confirm',
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        deleteGhhtDatas({ uuids: selectionRowKeys }).then((response) => {
          thisObj.setState({ masker: false });
          const { code, msg } = response;
          if (code === '200') {
            DDAlert.close();
            refUnit.current!.reload2();
            message.success('删除成功！');
          } else {
            message.error(msg);
          }
        });
      },
    });
  }
}


// 上传附件
Func.handleColumnsScfj = async (param: any) => {
  const { record, refUnit } = param;
  const beforeUpload = (file: any) => {
    const isLt2M = file.size;
    if(isLt2M > 10485760) {
      message.info('上传文件不能超过10M。');
      return Upload.LIST_IGNORE;
    }
    if(!(file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'application/pdf')) {
      message.info('请上传JPG/JPEG/PNG/PDF文件');
      return Upload.LIST_IGNORE;
    }
    return false;
  }
  DDAlert.open({
    title: '上传附件',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    width: 720,
    content: <>
      <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="上传文件" name="file" valuePropName="fileList" rules={[{ required: true, message: '请选择上传的文件' }]} getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
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
      <div style={{color:"#E51C23"}}>
        <p>导入说明：</p>
        <div>请上传JPG/JPEG/PNG/PDF文件，大小不超过10MB</div>
      </div>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if(values.file[0].originFileObj) {
          thisObj.setState({ masker: true });
          const formData = new FormData();
          formData.append('uuid', record.uuid);
          formData.append('dzlx', record.dzlx);
          formData.append('file', values.file[0].originFileObj);
          uploadBadzWjnr(formData).then((response: any) => {
            const { code, msg } = response;
            thisObj.setState({ masker: false });
            DDAlert.close();
            if (code === '200') {
              refUnit.current!.reload2();
              message.success(`上传成功`);
            } else{
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
// 是否展示预览按钮
Func.ylDisplay = (record: any) => {
  if (record.wjm?.trim()) {
    return false;
  } else {
    return true;
  }
};
// 是否展示上传附件按钮
Func.scfjDisplay = (record: any) => {
  if (record.wjm?.trim()) {
    return true;
  } else {
    return false;
  }
};

Func.plxz = (param: any) => {
  htFun.commonPlxz(param,'02');
};
export default Func;
