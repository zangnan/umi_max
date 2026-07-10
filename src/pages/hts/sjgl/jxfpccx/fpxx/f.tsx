import React from 'react';
import { Button, Form, message, Radio, Tooltip, Upload} from 'antd';
import DDAlert from '@/pages/hts/components/DDAlert';
import myUtil, {intl as intl2 } from '@/components/DDAssist/util';
import importStyle from './style.less';
import {batchSetJxfpccx, fpyl, importTemplate, zzsfptzsx } from '@/pages/hts/services/htsApi';
import {ClockCircleOutlined, InboxOutlined} from '@ant-design/icons';
import tableStyle from "@/pages/hts/commonModule/ckhwbgd/style.less";
import { history } from 'umi';

const {Dragger} = Upload;

const fpxxFunc: any = {
  refUnit: React.createRef(),
};

fpxxFunc.filterValidate = (param: any) => {
  const kprq = param?.form.getFieldValue('kprq');
  if (!kprq || kprq.length !== 2) {
    message.info('请输入筛选条件，开票日期必填！');
    return false;
  } else {
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    const fpcxzdyffw = userInfo?.qypz?.QYPZGL_FPCXZDYFFW ? userInfo?.qypz?.QYPZGL_FPCXZDYFFW : 24;
    const kprqQ = kprq[0];
    const kprqZ = kprq[1];

    // 计算两个日期之间的月份差
    const date1 = new Date(kprqQ);
    const date2 = new Date(kprqZ);
    const monthsDiff = (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());

    if (monthsDiff > fpcxzdyffw) {
      message.info('开票日期范围不能超过' + fpcxzdyffw + '个月！');
      return false;
    }
    return true;
  }
}

fpxxFunc.importTzsxComn = async (param: any, cdDm :any) => {
  const {refUnit} = param;
  const beforeUpload = (file: any) => {
    const isLt2M = file.size;
    if (isLt2M > 10485760) {
      message.info('上传文件不能超过10M。');
      return Upload.LIST_IGNORE;
    }
    if (!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('请上传Excel文件。');
      return Upload.LIST_IGNORE;
    }
    return false;
  }
  DDAlert.open({
    title: '台账筛选',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    button: [
      <Button key={'excelmbxz'} onClick={() => fpxxFunc.downloadExcel('SJGL_JXFP_TZSX_PRINT_REPORT')}>Excel模板下载</Button>,
    ],
    width: 720,
    content: <>
      <Form.Item labelCol={{span: 24}} wrapperCol={{span: 24}} label="导入Excel文件" name="file" valuePropName="fileList" rules={[{required: true, message: '请选择上传的文件'}]}
                 getValueFromEvent={(e: any) => {
                   if (Array.isArray(e)) {
                     return e;
                   }
                   return e && e.fileList;
                 }}>
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
                <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined/>&nbsp;待上传</td>
                <td width="17%" className={importStyle.textCenter}><a onClick={() => actions.remove()}>删除</a></td>
              </tr>
            </table>
          )}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined/>
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到此区域</p>
        </Dragger>
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if (values.file[0].originFileObj) {
          thisObj.setState({masker: true});
          DDAlert.close();
          const formData = new FormData();
          formData.append('file', values.file[0].originFileObj);
          formData.append('fileName', values.file[0].name);
          formData.append('cdDm', cdDm);
          refUnit.current?.setMasker(true);
          zzsfptzsx(formData).then((response: any) => {
            const {code, msg, body} = response;
            thisObj.setState({masker: false});
            if (code === '200') {
              // 台账数据筛选 赋值
              refUnit.current?.addQueryModel("Y", 'tzsxbz');
              if (body?.sbzs != 0) {
                // 业务校验
                const sbyyList = body?.sbmx || [];
                const textAreaValues: any = []
                if (sbyyList.length > 0) {
                  sbyyList.forEach((item: any, index: any) => {
                    textAreaValues.push(
                      <tr>
                        <td width='10%' style={{textAlign: 'center'}}>{index + 1}</td>
                        <td width='30%'>{item.fphm}</td>
                        <td width='20%'>{item.fpDm}</td>
                        <td width='40%'>
                          <Tooltip title={item.sbyy}>
                            <div className={tableStyle.errorTableText}>{item.sbyy}</div>
                          </Tooltip>
                        </td>
                      </tr>
                    )
                  })
                  DDAlert.open({
                    title: '台账筛选',
                    modalType: 'form',
                    width: 780,
                    closeStatus: false,
                    isFormContent: true,
                    content:
                      <>
                        <div style={{marginTop: '10px'}}>本次导入台账中共{body?.drzs}张进项发票，导入成功{body?.cgzs}张，导入失败{body?.sbzs}张。</div>
                        <table className={tableStyle.errorTable}>
                          <tr style={{backgroundColor: '#FAFAFA'}}>
                            <th>序号</th>
                            <th>失败发票号码</th>
                            <th>失败发票代码</th>
                            <th>失败原因</th>
                          </tr>
                          {textAreaValues}
                        </table>
                      </>,
                    okCallbackFn: function () {
                      DDAlert.close();
                    },
                  });
                }
              } else {
                message.success(`本次导入台账中共${body?.drzs}张，导入成功${body?.cgzs}张！`);
              }
            } else {
              message.error(msg);
            }
          }).catch(() => {
            message.error('导入失败，请重新上传文件。');
          }).finally(() => {
            thisObj.setState({masker: false});
            refUnit.current?.setMasker(false);
          });
        } else {
          message.info('文件传输失败，请重试！')
        }
      });
    },
  });
}

// 批量修改---设置签收章台
fpxxFunc.btnSetQszt = async (param: any) => {
  const {selectionRowKeys, refUnit} = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({id: 'message_handle_unselected'}));
    return;
  } else {
    DDAlert.open({
      title: '签收状态',
      infoType: 'info',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      content: <>
        <Form.Item name="qszt" initialValue={'Y'} label="选择签收状态" rules={[{required: true, message: '请选择签收状态'}]} labelCol={{span: 11}} wrapperCol={{span: 11}}>
          <Radio.Group>
            <Radio value="1">已签收</Radio>
            <Radio value="2">未签收</Radio>
          </Radio.Group>
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({masker: true});
          batchSetJxfpccx({szlx: 'qszt', uuids: selectionRowKeys, qszt: values.qszt}).then((response: any) => {
            DDAlert.close();
            thisObj.setState({masker: false});
            const {code, msg} = response;
            if (code === '200') {
              message.success('设置签收状态成功');
              refUnit.current!.reload();
            } else {
              message.error(msg);
            }
          })
        });
      },
    });
  }
}

// 下载excel模板
fpxxFunc.downloadExcel = (key: any) => {
  const obj = {
    sfBhsj: 'N',
    sfScsm: 'N',
    key,
  }
  importTemplate(obj).then((response: any) => {
    if (response.code === '200') {
      const {blob, fileName} = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  })
}

// 关单信息状态标志
fpxxFunc.columnsRender = {
  renderJxfpccxFpyl: (param: any) => {
    const {record} = param;
    if (record.sfyfj == 'Y' && (record.fplxDm == '81' || record.fplxDm == '82')) {
      return <a onClick={(e) => {
        e.stopPropagation();
        fpxxFunc.openfp(param)
      }}>{record?.fphm}</a>;
    } else if ((record.fplxDm != '81' && record.fplxDm != '82')) {
      return <a onClick={(e) => {
        e.stopPropagation();
        fpxxFunc.openfp(param)
      }}>{record?.fphm}</a>;
    } else {
      return <>{record?.fphm}</>
    }
  }
};

fpxxFunc.openfp = async (param: any) => {
  const {record, refUnit, otherRef} = param;
  refUnit.current?.setMasker(true);
  await fpyl({uuid: record?.uuid, jhpzh: record?.jhpzh, exportKey:'PDF_REPORT_SJGLSAAS_JXFPCCX_FP'}).then(async (response) => {
    refUnit.current?.setMasker(false);
    if (response.code == '200') {
      otherRef[0].current?.showModal(response.body);
    } else {
      message.error(response.msg);
    }
  });
}
fpxxFunc.handleOnChangeCxlx = (param: any) => {
  const p = {};
  const { value } = param;
  if (value == '1') {
    history.push({ pathname: '/02/0211', query: p } )
  } else {
    history.push({ pathname: '/02/0210', query: p } )
  }
}


export default fpxxFunc;
