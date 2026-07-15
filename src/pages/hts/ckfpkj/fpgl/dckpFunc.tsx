/**
 * title: 发票开具管理-功能实现
 * author: yxy
 */
import React from 'react';
import DDAlert from '@/pages/hts/components/DDAlert';
import { Upload, Popover, Tooltip, message, Form, Button } from 'antd';
import { fpkjwjht, qxkp, fpch, fpzfDckp, xzkpwj, zdkpcx, fpljhq, xzkpwjCheck, downloadTemplate, commonDrwtdc } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';
import myUtil from '@/components/DDAssist/util';
import khdgjUtil from '../khdgjUtil';
import { CheckOutlined, TransactionOutlined, DeleteOutlined, CoffeeOutlined, CloudDownloadOutlined, ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import importStyle from './importStyle.less';
import tableStyle from './style.less';

const { Dragger } = Upload;

const Func: any = {
  refUnit: React.createRef(),
};

// 下载开票文件
Func.handleDownLoadKpwj = (param: any) => {
  const { selectionRows, refUnit, gridRef, unit_key } = param;
  const gridData = refUnit.current?.getGridData()
  if (gridData && gridData.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  const fpsqduuids: any = [];
  if (selectionRows && selectionRows.length > 0) {
    selectionRows.map((row: any) => {
      fpsqduuids.push(row.fpsqduuid);
    })
  }
  const searchModel = refUnit.current?.getGridParams().searchModel || [];
  const headerSearchModel = param.refGrid.current?.getHeaderFilter() || [];
  const allSearchModel: any = searchModel.concat(headerSearchModel);
  const obj = {
    xzlx: 'zip',
    fpsqduuids,
    key: unit_key,
    cxtj: allSearchModel
  }
  if (fpsqduuids.length > 0) {
    refUnit.current?.setMasker(true);
    xzkpwj(obj).then((response) => {
      refUnit.current?.setMasker(false);
      const { code, body } = response;
      if (code === '200') {
        if (JSON.stringify(body) != "{}") {
          const { blob, fileName } = response.body;
          myUtil.file.downloadExcel(blob, fileName);
          // 清空选中并设置按钮可用状态
          refUnit.current?.setSelectionRowKeys([]);
          refUnit.current?.setSelectionRows([]);
          refUnit.current!.reload();
        } else {
          message.info('下载失败！');
        }
      } else if (code === '300') {
        message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
      } else if (code === '900') {
        message.info(response.desc);
      } else {
        message.error(response.desc);
      }
    })
  } else {
    xzkpwjCheck(obj).then((res: any) => {
      if (res.code === '200') {
        openXz(refUnit, obj);
      } else if (res.code === '300') {
        message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
      } else {
        message.error(res.desc);
      }
    })
  }
}

const openXz = (refUnit: any, obj: any) => {
  DDAlert.open({
    title: '下载开票文件',
    info: '确定下载当前未回填且未下载过的开票文件吗?',
    modalType: 'info',
    infoType: 'question',
    isFormContent: false,
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      xzkpwj(obj).then((response) => {
        thisObj.setState({ masker: false });
        const { code, body } = response;
        if (code === '200') {
          if (JSON.stringify(body) != "{}") {
            const { blob, fileName } = response.body;
            myUtil.file.downloadExcel(blob, fileName);
            // 清空选中并设置按钮可用状态
            refUnit.current?.setSelectionRowKeys([]);
            refUnit.current?.setSelectionRows([]);
            refUnit.current!.reload();
          } else {
            message.info('下载失败！');
          }
        } else if (code === '300') {
          message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
        } else if (code === '900') {
          message.info(response.desc);
        } else {
          message.error(response.desc);
        }
      })
    }
  })
}

// 下载开票文件到发票配置的导出路径
Func.handleDownLoadKpwjToExportPath = async (param: any) => {
  const { selectionRows, refUnit } = param;
  if (!selectionRows || selectionRows.length === 0) {
    DDAlert.open({
      title: '导出开票',
      info: '确定对当前筛选条件下所有“非数电票”的待开票数据进行自动开票的操作吗？',
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: true,
      content: '',
      isFormContent: false,
      okCallbackFn: function (thisObj: any) {
        const param3 = {searchModel:refUnit.current.getGridParams().searchModel};
        // 不勾选导出校验
        zdkpcx(param3).then((response) => {
          if (response.code === '200') {
            SaveToExportPath(refUnit, response.body);
          } else {
            message.error(response.msg);
          }
        });
      },
    });

  } else {
    let ydcFlags = false;
    let ykpFlags = false;
    selectionRows.forEach((row: any) => {
      // ZF 作废 HC 红冲 YKP 已开票 DKP 待开票
      if (row.fpzt == 'YDC') {//已导出 若勾选包含数据状态为已导出且不包含已开票的数据，自动开票时校验：存在已导出过的数据，是否重新导出？
        ydcFlags = true;
      }
      if (row.fpzt === 'YKP' || row.fpzt === 'HC' || row.fpzt === 'ZF') {//已开票 若勾选包含数据状态为已开票的数据，自动开票时强制校验：存在已开票的数据，不能再次开票！
        ykpFlags = true;
      }
    });
    if (ykpFlags) {
      message.error("勾选数据中存在“已开票”、“作废”或“红冲”的数据，无法操作。");
      return;
    }
    if (ydcFlags) {
      DDAlert.open({
        title: '导出开票',
        info: '勾选数据中存在已导出数据，重复操作可能会导致重复开票，确定继续操作吗？',
        infoType: 'question',
        modalType: 'confirm',
        closeStatus: true,
        content: '',
        isFormContent: false,
        okCallbackFn: function (thisObj: any) {
          const fpsqduuids = selectionRows.map((row: any) => {
            return (row.fpsqduuid);
          })
          SaveToExportPath(refUnit, fpsqduuids);
        },
      });
    } else {
      const fpsqduuids = selectionRows.map((row: any) => {
        return (row.fpsqduuid);
      })
      SaveToExportPath(refUnit, fpsqduuids);
    }
  }

}

const SaveToExportPath = (refUnit: any, fpsqduuids: any) => {
  refUnit.current?.setMasker(true);
  // 获取发票设置路径
  fpljhq({}).then((response) => {
    if (response.code === '200') {
      // 调用客户端上传相关路径设置、出口发票下载调用
      khdgjUtil.khdgjFpXgljSet({ ...response.body, uuids: fpsqduuids, refUnit });
    } else {
      refUnit.current?.setMasker(false);
      message.error(response.msg);
      DDAlert.close();
    }
  })
};

// 下载点击的开票文件
Func.handleDownLoadClickKpwj = (param: any) => {
  const { refUnit, record } = param;
  const fpsqduuids: any = [record.fpsqduuid];
  refUnit.current?.setMasker(true);
  xzkpwj({ xzlx: 'single', fpsqduuids }).then((response) => {
    refUnit.current?.setMasker(false);
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadExcel(blob, fileName);
      // 清空选中并设置按钮可用状态
      refUnit.current?.setSelectionRowKeys([]);
      refUnit.current?.setSelectionRows([]);
      // bug 24734
      refUnit.current?.reload();
    } else {
      message.error(response.desc);
    }
  })
}

// 打开发票开具回填
Func.handleFpkjht = (param: any) => {
  const { refUnit } = param;
  Promise.all([myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ:01')]).then(() => {
  }).catch(() => {
    message.error('获取码表失败');
  }).finally(() => {
    const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
    let filetype = true;
    // 数电票（普通发票），其他模块是否能选择
    if (temp[0].fpzlDm1 === "5") {
      filetype = false;
    }
    DDAlert.open({
      title: '开具发票文件回填',
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      width: 720,
      // initFormContentValues: { drgz: 1 },
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          const formData = new FormData();
          formData.append('fileName', values.fileStream[0].name);
          formData.append('file', values.fileStream[0].originFileObj);
          fpkjwjht(formData).then((response) => {
            DDAlert.close();
            const { code, body, desc } = response;
            if (code === '200') {
              refUnit.current!.reload();
              const successInfo = body[0].htxq;
              if(body[0].tsxxbz === 'Y') {
                 // 业务校验
                const sbyyList = body[0]?.tsxxlist || [];
                const textAreaValues: any = []
                if(sbyyList.length > 0) {
                  sbyyList.forEach((item: any, index: any) => {
                    textAreaValues.push(
                    <tr>
                      <td width='10%' style={{textAlign: 'center'}}>{item.xh}</td>
                      <td width='90%'>
                        <Tooltip title={item.tsxx + item.sbyy}>
                          <div className={tableStyle.errorTableText}>{item.tsxx}{item.sbyy}</div>
                        </Tooltip>
                      </td>
                    </tr>
                    )
                  })
                  DDAlert.open({
                    title: '发票开具文件回填',
                    modalType: 'form',
                    width: '700px',
                    closeStatus: false,
                    isFormContent: true,
                    button: [
                      <Button key={"dc"} onClick={() => handleDownload(body[0]?.tsxxDcKey)}>导出数据</Button>,
                    ],
                    content:
                    <>
                      <div>{successInfo}</div>
                      <div style={{marginTop:'10px'}}>以下数电发票回填失败：</div>
                      <table className={tableStyle.errorTable}>
                        <tr style={{backgroundColor: '#FAFAFA'}}>
                          <th>序号</th>
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
                message.success(successInfo);
              }
            } else {
              message.error(desc)
              // const temp: any = [];
              // temp.push(body[0]?.htztdesc);
              // temp.push(<div>{body[0]?.htxq}</div>);
              // message.error(temp)
            }
          }).catch(() => {
            message.error('导入失败，请重新上传文件。');
          }).finally(() => {
            thisObj.setState({ masker: false });
          });
        })
      },
      content: <>
        <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name="fileStream" label="回填文件" valuePropName="fileList" rules={[{ required: true, message: '请选择上传的文件' }]}
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
    });
  });
}
// 导出
const handleDownload = (id: any) => {
  const params = {key: id};
  commonDrwtdc(params).then((response) => {
    if (response.code === '200') {
      const {blob, fileName} = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  });
}
const beforeUpload = (file: any) => {
  if(!file.name.toUpperCase().endsWith(".TXT") && !file.name.toUpperCase().endsWith(".XML") && !file.name.toUpperCase().endsWith(".XLSX") && !file.name.toUpperCase().endsWith(".XLS")) {
    message.info('请上传正确的文件格式。');
    return Upload.LIST_IGNORE;
  } else {
    return false;
  }
}
{/* const beforeUpload = (file: any) => {
  return file.name.toUpperCase().endsWith(".TXT") || file.name.toUpperCase().endsWith(".XML") ? true : Upload.LIST_IGNORE;
} */}
// 退回至未开票状态
Func.handleThzwkpzt = (param: any) => {
  const { selectionRows, refUnit } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    const tempRows = selectionRows.filter((row: any) => {
      return (row.fpzt === 'YKP');
    })
    if (tempRows.length > 0) {
      message.info(intl2.formatMessage({ id: 'message_ckfp_fpkjgl_thwkpzt_error' }));
      return;
    }
    DDAlert.open({
      title: '发票撤回',
      info: '确认要将数据退回至上一环节吗？',
      infoType: 'question',
      modalType: 'confirm',
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        qxkp({ fpglVoList: selectionRows }).then((response) => {
          DDAlert.close();
          const { code, desc } = response;
          if (code === '200') {
            refUnit.current!.reload();
            message.success('发票撤回成功! 数据已转到“发票申请单”或“导入模板开具”页面。')
          } else {
            message.error(desc)
          }
        })
      },
    });

  }
}

// 设置红冲标志
Func.handleSzhcbz = (param: any) => {
  const { selectionRows, refUnit } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    const tempRows = selectionRows.filter((row: any) => {
      return (row.fpzt != "YKP");
    })
    if (tempRows.length > 0) {
      message.info(intl2.formatMessage({ id: 'message_ckfp_fpkjgl_sethbbz_error' }));
      return;
    }
    const tempArr = selectionRows.map((row: any) => {
      return (row.fpsqduuid)
    })
    refUnit.current?.setMasker(true);
    fpch({ szchlx: '1', fpsqduuids: tempArr }).then((response) => {
      refUnit.current?.setMasker(false);
      const { code, desc } = response;
      if (code === '200') {
        refUnit.current?.reload();
        message.success(intl2.formatMessage({ id: 'message_ckfp_fpkjgl_sethbbz_success' }))
      } else {
        message.error(desc)
      }
    })
  }
}

// 取消红冲标志
Func.handleQxhcbz = (param: any) => {
  const { selectionRows, refUnit } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    const tempRows = selectionRows.filter((row: any) => {
      return (row.fpzt != 'HC' || (row.fpzt === 'HC' && row.chfpkjbz === 'Y') );
    })
    if (tempRows.length > 0) {
      message.info('取消红冲标志失败，只有发票状态为“红冲”且撤回标志为“未撤回”数据的才允许操作！');
      return;
    }
    
    const tempArr = selectionRows.map((row: any) => {
      return (row.fpsqduuid)
    })
    refUnit.current?.setMasker(true);
    fpch({ szchlx: '2', fpsqduuids: tempArr }).then((response) => {
      refUnit.current?.setMasker(false);
      const { code, desc ,msg} = response;
      if (code === '200') {
        refUnit.current?.reload();
        message.success('取消红冲标志成功! ');
      } else {
        message.error(msg)
      }
    })
  }
}

// 设置作废标志
Func.handleSzzfbz = (param: any) => {
  const { selectionRows, refUnit } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    const tempRows = selectionRows.filter((row: any) => {
      return (row.fpzt != "YKP");
    })
    if (tempRows.length > 0) {
      message.info('取消作废标志失败，只有发票状态为“作废”且撤回标志为“未撤回”数据的才允许操作！');
      return;
    }
    const tempArr = selectionRows.map((row: any) => {
      return (row.fpsqduuid)
    })
    refUnit.current?.setMasker(true);
    fpzfDckp({ szzflx: '1', fpsqduuids: tempArr }).then((response) => {
      refUnit.current?.setMasker(false);
      const { code, desc } = response;
      if (code === '200') {
        refUnit.current?.reload();
        message.success(intl2.formatMessage({ id: 'message_ckfp_fpkjgl_setzfbz_success' }));
      } else {
        message.error(desc)
      }
    })
  }
}

// 取消作废标志
Func.handleQxzfbz = (param: any) => {
  const { selectionRows, refUnit } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    const tempRows = selectionRows.filter((row: any) => {
      return (row.fpzt != 'ZF' || (row.fpzt === 'ZF' && row.zfbz1 === 'Y'));
    })
    if (tempRows.length > 0) {
      message.info(intl2.formatMessage({ id: 'message_ckfp_fpkjgl_cancelzfbz_error' }));
      return;
    }
    if (selectionRows[0].chfpkjbz == 'Y' && selectionRows[0].fpzt == 'ZF') {
      message.info('取消作废标志失败，只有发票状态为“作废”且撤回标志为“未撤回”数据的才允许操作！');
      return;
    }

    const tempArr = selectionRows.map((row: any) => {
      return (row.fpsqduuid)
    })
    refUnit.current?.setMasker(true);
    fpzfDckp({ szzflx: '2', fpsqduuids: tempArr }).then((response) => {
      refUnit.current?.setMasker(false);
      const { code, desc } = response;
      if (code === '200') {
        refUnit.current?.reload();
        message.success(intl2.formatMessage({ id: 'message_ckfp_fpkjgl_cancelzfbz_success' }));
      } else {
        message.error(desc)
      }
    })
  }
}

// 自定义工具栏：导出开票结果
Func.exportKpjg = (param: any) => {
  const { selectionRowKeys, selectionRows, refUnit, gridRef } = param;
  const gridData  = param.refUnit.current.getGridData();

  if (gridData.length === 0) {
    message.info('当前筛选条件下无数据，请确认！');
    return;
  }
  let title = '确定对勾选数据进行导出开票结果的操作吗？';
  let key: any;
  // bug 25104 要求可导出红冲 begin 
  for (let i = 0; i < selectionRows.length; i++) {
    if (selectionRows[i].fpzt !== 'YKP' && selectionRows[i].fpzt !== 'HC') {
      message.info('请选择数据状态为“已开票”或“红冲”的数据进行操作。');
      return;
    }
  }
  if (selectionRowKeys.length === 0) {
    title = '确定对当前筛选条件下所有数据状态为“已开票”或“红冲”的数据进行操作吗？';
  }
 // bug 25104 要求可导出红冲 end

  key = 'SAAS_CKFPKJ_FPGL_DCKPJG_DCKP_DC';

  const searchModel = refUnit.current?.getGridParams().searchModel || [];
  const headerSearchModel = param.refGrid.current?.getHeaderFilter() || [];
  let allSearchModel: any;
  if (selectionRowKeys?.length > 0) {
    allSearchModel = searchModel.concat([ ...headerSearchModel, { property: 'uuids', values: selectionRowKeys, op: 'ain' }]);
  } else {
    allSearchModel = searchModel.concat([...headerSearchModel]);
  }
  for (let i = 0; i < allSearchModel.length; i++) {
    allSearchModel[i].op = 'zdy'
  }
  const obj = {
    sfBhsj: 'Y',
    sfScsm: 'Y',
    key,
    searchModel: allSearchModel
  }
  DDAlert.open({
    title: '导出开票结果',
    info: title,
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: false,
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      downloadTemplate(obj).then((response: any) => {
        thisObj.setState({ masker: false });
        DDAlert.close();
        if (response.code === '200') {
          const { blob, fileName } = response.body;
          myUtil.file.downloadExcel(blob, fileName);
        } else {
          message.error(response.desc);
        }
      })
    }
  })
};

// 列表自定义渲染
Func.columnsRender = {
  // 发票状态
  renderFpkjglSjzt: (param: any) => {
    const record = param.record;
    let col: any = <></>;
    if (record.fpzt === 'ZF') {
      col = <span className="dd_grid_icon"><DeleteOutlined style={{ color: '#b7b7b7' }} key={record.uuid} />作废</span>
    } else if (record.fpzt === 'HC') {
      col = <span className="dd_grid_icon"> <TransactionOutlined key={record.uuid} />红冲</span>
    } else if (record.fpzt === 'YKP') {
      col = <span key={record.uuid} className="dd_grid_icon"><CheckOutlined key={record.uuid} />已开票</span>
    } else if (record.fpzt === 'DKP') {
      col = <span key={record.uuid} className="dd_grid_icon"><CoffeeOutlined key={record.uuid} />待开票</span>
    } else if (record.fpzt === 'YDC') {
      col = <span key={record.uuid} className="dd_grid_icon"><CloudDownloadOutlined key={record.uuid} />已下载</span>
    }
    return col;
  },
  // 发票开具管理 报关单气泡渲染
  renderFpkjglBgdh: (param: any) => {
    const text = param?.text?.split(',');
    const array: any = [];
    text?.forEach((element: any) => {
      array.push(<div key={element}>{element}</div>)
    });
    return <Popover key={param.record.fpsqduuid} placement="left" content={array} title="报关单">{param.text}</Popover>;
  },
  // 发票开具管理 开票文件下载
  renderKpwj: (param: any) => {
    const html = [];
    const kpwjEle = (
      <Button key={param.record.fpsqduuid} type="link" onClick={() => Func.handleDownLoadClickKpwj(param)}>
        {param.text}
      </Button>
    );
    html.push(kpwjEle);
    const html2 = <Tooltip key={param.record.fpsqduuid} title={param.text}>{html}</Tooltip>;
    return html2;
  },
  // 发票管理 发票类型格式化
  renderFpkjglFpzl: (param: any) => {
    if (param.text === '3') {
      return '增值税普通发票';
    } else if (param.text === '4') {
      return '增值税电子普通发票';
    } else if (param.text === '5') {
      return '数电票（普通发票）';
    }
    return param.text;
  },
  // 发票管理 开具类型
  renderFpkjglKjlx: (param: any) => {
    if (param.text === '1') {
      return '按报关单开具';
    } else if (param.text === '3') {
      return '导入模板开具';
    }
    return param.text;
  },
  renderFpkjglChbz: (param: any) => {
    let col: any = <></>;
    if (param.text === 'Y') {
      col = <span>已撤回</span>
    } else {
      col = <span>未撤回</span>
    }
    return col;
  },
}


export default Func;