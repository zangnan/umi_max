/**
 * title: 发票开具管理-功能实现
 * author: yxy
 */
import React from 'react';
import DDAlert from '@/pages/hts/components/DDAlert';
import { message, Popover, Tooltip, Form, Radio, Space, Select } from 'antd';
import { cxkp, qxkp, fphc, fpzf, fpxz, fpztsx, dyjcx, dyfp, downloadTemplate, sdpfphc } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';
import myUtil from '@/components/DDAssist/util';
import { history } from 'umi';
import { WarningOutlined } from '@ant-design/icons';

const Func: any = {
  refUnit: React.createRef(),
};

// 重新开票
// Func.handleFpkj = (param: any) => {
//   const { selectionRowKeys, selectionRows, refUnit, gridRef } = param;
//   // 如果不勾选获得全部数据（没做）
//   const uuids = selectionRowKeys
//   for (let i = 0; i < selectionRows.length; i++) {
//     if (selectionRows[i].fpkjztDm !== '0') {
//       message.info('请选择发票状态为“待开票”的数据进行操作。');
//       return;
//     }
//   }
//   let title = '确定对勾选数据进行重新开票的操作吗？';
//   if (selectionRowKeys.length === 0) {
//     title = '确定对当前筛选条件下所有“待开票”的数据进行重新开票的操作吗？';
//   }
//   const searchModel = refUnit.current?.getGridParams().searchModel || [];
//   const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
//   const allSearchModel: any = searchModel.concat(headerSearchModel);
//   for (let i = 0; i < allSearchModel.length; i++) {
//     allSearchModel[i].op = 'zdy'
//   }
//   const params = {
//     fpsqduuids: uuids,
//     cxtj: allSearchModel,
//   }
//   DDAlert.open({
//     title: '重新开票',
//     info: title,
//     infoType: 'question',
//     modalType: 'confirm',
//     closeStatus: false,
//     okCallbackFn: function (thisObj: any) {
//       thisObj.setState({ masker: true });
//       cxkp(params).then((response) => {
//         thisObj.setState({ masker: false });
//         DDAlert.close();
//         if (response.code === '200') {
//           // 清空选中并设置按钮可用状态
//           refUnit.current!.reload();
//           DDAlert.open({
//             title: '重新开票',
//             info: '重新开票申请成功！',
//             infoType: 'success',
//             modalType: 'info',
//             okText: '确定',
//             content: '可通过点击“更新状态”按钮更新开票状态。',
//             okCallbackFn: function () {
//             }
//           });
//         } else if (response.code === '900') {
//           message.error(response.msg);
//         } else {
//           message.error(response.desc);
//         }
//       })
//     }
//   })
// }

// 发票撤回
Func.handleFpch = (param: any) => {
  const { selectionRows, refUnit } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  for (let i = 0; i < selectionRows.length; i++) {
    // 发票状态为“开票失败2”、未被撤回过的“红冲7”、“作废成功6”的数据才允许撤回
    if (selectionRows[i].fpkjztDm !== '2' && selectionRows[i].fpkjztDm !== '6' && selectionRows[i].fpkjztDm !== '7') {
      message.info('请选择发票状态为开票失败或未被撤回过的“红冲”、“作废成功”的数据进行操作。');
      return;
    }
    if (selectionRows[i].chfpkjbz === 'Y') {
      message.info('请选择未撤回的数据进行操作。');
      return;
    }
  }
  DDAlert.open({
    title: '发票撤回',
    info: '确定对勾选数据进行发票撤回的操作吗？',
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: false,
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      qxkp({ fpglVoList: selectionRows }).then((response) => {
        thisObj.setState({ masker: false });
        DDAlert.close();
        if (response.code === '200') {
          // 清空选中并设置按钮可用状态
          refUnit.current!.reload();
          message.success('发票撤回成功! 数据已转到“发票申请单”或“导入模板开具”页面。');
        } else {
          message.error(response.desc);
        }
      })
    }
  })
}
// 更新状态
Func.handleUpdateLz = (param: any) => {
  const { refUnit } = param;

  // 刷新发票状态（看后端设计
  refUnit.current?.setMasker(true);
  const params = {
    fpsqduuids: [],
    cxtj: [],
  }
  fpztsx(params).then((response: any) => {
    refUnit.current?.setMasker(false);
    if (response.code === '200') {
      message.success(response.body);
      refUnit.current!.reload();
    } else {
      message.error(response.desc);
    }
  })
}

// 发票作废
Func.handleFpzf = (param: any) => {
  const { selectionRowKeys, selectionRows, refUnit } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info('请选择一条“开票成功”或“作废失败”的数据进行操作。');
    return;
  }
  if (selectionRows.length > 1) {
    message.info('请选择一条“开票成功”或“作废失败”的数据进行操作。');
    return;
  }

  if (selectionRows[0].fpkjztDm !== '3' && selectionRows[0].fpkjztDm !== '5') {
    message.info('请选择一条“开票成功”或“作废失败”的数据进行操作。');
    return;
  }
  // 即发票种类为本月开具的增值税普通发票（开票日期和当前年月比对）才能作废
  if (selectionRows[0].fpzlDm1 != '3') {
    message.info('请选择本月的增值税普通发票进行作废操作');
    return;
  }

  DDAlert.open({
    title: '发票作废',
    info: '确定对勾选数据进行发票作废的操作吗？',
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: false,
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      fpzf({ fpsqduuid: selectionRowKeys[0] }).then((response) => {
        thisObj.setState({ masker: false });
        DDAlert.close();
        if (response.code === '200') {
          // 清空选中并设置按钮可用状态
          refUnit.current!.reload();
          DDAlert.open({
            title: '发票作废',
            info: '发票作废申请成功！',
            infoType: 'success',
            modalType: 'info',
            okText: '确定',
            content: '可通过点击“更新发票状态”按钮更新发票状态。发票作废成功后，可到“作废发票”页面对数据执行发票撤回的操作，进行重新开票。',
            okCallbackFn: function () {
            }
          });
        } else if (response.code === '900') {
          message.info(response.msg);
        } else {
          message.error(response.desc);
        }
      })
    }
  })
}



// 下载发票PDF
Func.downloadPDF = (param: any, event: any) => {
  event.stopPropagation();
  const { refUnit, record } = param;
  refUnit.current?.setMasker(true);
  fpxz({ fpsqduuid: record.fpsqduuid }).then((response) => {
    refUnit.current?.setMasker(false);
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadPdf(blob, fileName);
      message.success('下载成功');
    } else {
      message.error(response.desc);
    }
  })
}

// 打印发票
Func.printInvoice = (param: any, event: any) => {
  event.stopPropagation();
  const { refUnit, record } = param;
  dyjcx({}).then((res) => {
    const { code, desc, body } = res;
    if (code === '200') {
      const dyjname = body?.dyjList || [];
      const temp = dyjname.filter((item: any) => {
        return item.mrbz === 'Y';
      })
      if (dyjname.length > 0) {
        DDAlert.open({
          title: '打印发票',
          infoType: 'info',
          closeStatus: false,
          isFormContent: true,
          modalType: 'form',
          content: <>
            <Form.Item label="打印机名称" initialValue={temp.length > 0 ? temp[0].printName : ''} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} name='printName' rules={[{ required: true, message: '请选择打印机' }]}>
              <Select>
                {dyjname?.map((item: any) => (
                  <Select.Option key={item.id} value={item.printName}>{item.printName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </>,
          okCallbackFn: function (thisObj: any) {
            DDAlert.getForms().validateFields().then((values: any) => {
              thisObj.setState({ masker: true });
              dyfp({ fpsqduuid: record.fpsqduuid, printName: values.printName }).then((response: any) => {
                thisObj.setState({ masker: false });
                if (response.code === '200') {
                  // 清空选中并设置按钮可用状态
                  refUnit.current!.reload();
                  message.success('操作成功');
                  DDAlert.close();
                } else {
                  message.error(response.desc);
                }
              })
            })
          }
        })
      } else {
        DDAlert.open({
          title: '打印发票',
          info: '尚未配置打印机，请到“配置管理-发票配置管理-打印机管理”中配置打印机。',
          infoType: 'warning',
          modalType: 'confirm',
          okText: '去配置',
          content: [],
          okCallbackFn: function () {
            history.push({ pathname: '/hts/pzgl/fppzgl', query: { xh:'4'} });
          }
        });
      }
    } else if (code === '900') {
      DDAlert.open({
        title: '打印发票',
        info: '尚未配置打印机，请到“配置管理-发票配置管理-打印机管理”中配置打印机。',
        infoType: 'warning',
        modalType: 'confirm',
        okText: '去配置',
        content: [],
        okCallbackFn: function () {
          history.push({ pathname: '/hts/pzgl/fppzgl', query: { xh:'4'} });
        }
      });
    } else {
      message.error(desc);
    }
  })
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
  if (history?.location?.pathname === '/hts/ckfp/fpkjgl') { // 蓝字开票
    for (let i = 0; i < selectionRows.length; i++) {
      if (selectionRows[i].fpkjztDm !== '3' && selectionRows[i].fpkjztDm !== '7' && selectionRows[i].fpkjztDm !== '5') {
        message.info('请选择发票状态为“开票成功”、“红冲”、“作废失败”的数据进行操作。');
        return;
      }
    }
    if (selectionRowKeys.length === 0) {
      title = '确定对当前筛选条件下所有发票状态为“开票成功”、“红冲”、“作废失败”的数据进行操作吗？';
    }
    key = 'SAAS_CKFPKJ_FPGL_DCKPJG_ZXKP_LZFP_DC';
  } else if (history?.location?.pathname === '/hts/ckfp/hzfp') { // 红字开票
    for (let i = 0; i < selectionRows.length; i++) {
      if (selectionRows[i].fpkjztDm !== '3' && selectionRows[i].fpkjztDm !== '5' ) {
        message.info('请选择发票状态为“开票成功”、“作废失败”的数据进行操作。');
        return;
      }
    }
    if (selectionRowKeys.length === 0) {
      title = '确定对当前筛选条件下所有发票状态为“开票成功”、“作废失败”的数据进行操作吗？';
    }
    key = 'SAAS_CKFPKJ_FPGL_DCKPJG_ZXKP_HZFP_DC';
  } else if (history?.location?.pathname === '/hts/ckfp/zffp') { // 作废开票
    for (let i = 0; i < selectionRows.length; i++) {
      if (selectionRows[i].fpkjztDm !== '6') {
        message.info('请选择发票状态为“作废成功”的数据进行操作。');
        return;
      }
    }
    if (selectionRowKeys.length === 0) {
      title = '确定对当前筛选条件下所有发票状态为“作废成功”的数据进行操作吗？';
    }
    key = 'SAAS_CKFPKJ_FPGL_DCKPJG_ZXKP_ZFFP_DC';
  }

  const searchModel = refUnit.current?.getGridParams().searchModel || [];
  const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
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

// 配置项：快捷筛选
Func.handleOnChangeFplx = (param: any) => {
  const { value } = param;
  let bz:any = ''
  if(history.location.query) {
    bz = history.location.query?.bz;
  }

  if (value == '1') {
    history.push('/hts/ckfp/fpkjgl?bz=' + bz);
  } else if (value == '2') {
    history.push('/hts/ckfp/hzfp?bz=' + bz);
  } else {
    history.push('/hts/ckfp/zffp?bz=' + bz);
  }
};

// 配置项：自定义操作列-下载PDF-红字
Func.downloadDisplay = (record: any) => {
  if (record.fpkjztDm === '3' && record.fpzlDm1 === '4') {
    return false;
  }
  return true;
}
// 配置项：自定义操作列-下载PDF-蓝字
Func.downloadDisplayLz = (record: any) => {
  if ((record.fpzlDm1 === '4' ||record.fpzlDm1 === '5')  && (record.fpkjztDm === '3' || record.fpkjztDm === '7')   ) {
    return false;
  }
  return true;
}
// 配置项：自定义操作列-打印发票
Func.printDisplay = (record: any) => {
  if ((record.fpzlDm1 === '3' ) && (record.fpkjztDm === '3'  || record.fpkjztDm === '5' || record.fpkjztDm === '7' ) ) {
    return false;
  }
  return true;
}

// 列表自定义渲染
Func.columnsRender = {
  // 开票类型
  renderFpkjglFplx: (param: any) => {
    if (param.text === '3') {
      return '增值税普通发票';
    } else if (param.text === '4') {
      return '增值税电子普通发票';
    } else if (param.text === '5') {
      return '数电票（普通发票）';
    }
    return param.text;
  },
  // 开具方式
  renderFpkjglKjlx: (param: any) => {
    if (param.text === '1') {
      return '报关单开具';
    } else if (param.text === '2') {
      return '代理证明开具';
    } else if (param.text === '3') {
      return '导入模板开具';
    } else if (param.text === '4') {
      return '采集开具';
    }
    return param.text;
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

  // 发票状态
  renderFpkjglSjzt: (param: any) => {
    const record = param.record;
    let col: any = <></>;
    if (param.text === '2') {
      col = <span className="dd_grid_icon">开票失败
        <Tooltip title={record?.sbyy1}>
          <WarningOutlined style={{ color: '#ef8724' }} key={record.uuid} />
        </Tooltip>
      </span>
    } else {
      console.log(myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_FPKJZT:01'))
      if(history?.location?.pathname.indexOf('/hts/ckfp/hzfp') > -1){
        col = <span>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_FPKJZT:02')}</span>
      } else {
        col = <span>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_FPKJZT:01')}</span>
      }
    }
    // if (record.fpkjztDm === '0') {
    //   col = <span>待开票</span>
    // } else if (param.text === '1') {
    //   col = <span>开票中</span>
    // } else if (param.text === '2') {
    //   col = <span className="dd_grid_icon">开票失败
    //     <Tooltip title={record?.sbyy1}>
    //       <WarningOutlined style={{ color: '#ef8724' }} key={record.uuid} />
    //     </Tooltip>
    //   </span>
    // } else if (param.text === '3') {
    //   col = <span>开票成功</span>
    // } else if (param.text === '4') {
    //   col = <span>作废中</span>
    // } else if (param.text === '5') {
    //   col = <span>作废失败</span>
    // } else if (param.text === '6') {
    //   col = <span>作废成功</span>
    // } else if (param.text === '7') {
    //   col = <span>红冲</span>
    // }
    return col;
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