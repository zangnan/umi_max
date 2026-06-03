/**
 * title: 导出开票：出口发票开具-出口发票开具-发票红冲（new）
 */
import React from 'react';
import DDAlert from '@/components/DDAlert';
import { Popover, Tooltip, message, Button } from 'antd';
import { fpch, fpzfDckp, downloadTemplate,dckphczftj } from '@/services/hts/api';
import { intl as intl2 } from '@/pages/common/myUtil';
import myUtil from '@/pages/common/myUtil';
import { CheckOutlined, TransactionOutlined, DeleteOutlined, CoffeeOutlined, CloudDownloadOutlined } from '@ant-design/icons';

const Func: any = {
  unitRef: React.createRef(),
};

// 设置红冲标志
Func.handleSzhcbz = (param: any) => {
  const { selectionRows, unitRef } = param;
  
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }  else {
    const tempArr = selectionRows.map((row: any) => {
      return (row.fpsqduuid)
    })
    unitRef.current?.setMasker(true);
    dckphczftj({'fpsqduuids':tempArr}).then((response) => {
      unitRef.current?.setMasker(false);
      const { code, body, desc ,msg} = response;
      if (code === '200') {
        DDAlert.open({
          title: '设置红冲标志',
          info: '确定对勾选数据进行设置红冲标志的操作吗?',
          infoType: 'question',
          modalType: 'confirm',
          isFormContent: false,
          content: [
            '单据号' +  myUtil.text.formatNum(body.fpsqdzs, '0,0') + '张',
            '金额合计' + myUtil.text.formatNum(body.kpje, '0,0.00') + '元',
            '税额合计' + myUtil.text.formatNum(body.sehj, '0,0.00') + '元'
          ],
          closeStatus: false,
          okCallbackFn: function (thisObj: any) {
            DDAlert.close();
            unitRef.current?.setMasker(true);
            fpch({ szchlx: '1', fpsqduuids: tempArr }).then((response) => {
              unitRef.current?.setMasker(false);
              const { code, desc } = response;
              if (code === '200') {
                unitRef.current?.reload2();
                message.success(intl2.formatMessage({ id: 'message_ckfp_fpkjgl_sethbbz_success' }))
              } else {
                message.error(desc)
              }
            })
            
          },
        });
      } else if(code === '300') {
        message.info(msg)
      }  else if(code === '900') {
        message.info(desc)
      } else {
        message.error(desc);
      }
    });



  }
}



// 设置作废标志
Func.handleSzzfbz = (param: any) => {
  const { selectionRows, unitRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    const tempRows = selectionRows.filter((row: any) => {
      return (row.fpzt != "YKP");
    })
    if (tempRows.length > 0) {
      message.info(intl2.formatMessage({ id: 'message_ckfp_fpkjgl_setzfbz_error' }));
      return;
    }
    const tempArr = selectionRows.map((row: any) => {
      return (row.fpsqduuid)
    })
    unitRef.current?.setMasker(true);
    fpzfDckp({ szzflx: '1', fpsqduuids: tempArr }).then((response) => {
      unitRef.current?.setMasker(false);
      const { code, desc } = response;
      if (code === '200') {
        unitRef.current?.reload2();
        message.success(intl2.formatMessage({ id: 'message_ckfp_fpkjgl_setzfbz_success' }));
      } else {
        message.error(desc)
      }
    })
  }
}


// 自定义工具栏：导出开票结果
Func.exportKpjg = (param: any) => {
  const { selectionRowKeys, selectionRows, unitRef, gridRef, } = param;
  const gridData  = param.unitRef.current.getGridData();
  if (gridData.length === 0) {
    message.info('当前筛选条件下无数据，请确认！');
    return;
  }
  let title = '确定对勾选数据进行导出开票结果的操作吗？';
  let key: any;
  for (let i = 0; i < selectionRows.length; i++) {
    if (selectionRows[i].fpzt !== 'YKP') {
      message.info('请选择数据状态为“已开票”的数据进行操作。');
      return;
    }
  }
  if (selectionRowKeys.length === 0) {
    title = '确定对当前筛选条件下所有数据状态为“已开票”的数据进行操作吗？';
  }
  key = 'SAAS_CKFPKJ_FPGL_DCKPJG_DCKP_DC';

  const searchModel = unitRef.current?.getGridParams().searchModel || [];
  const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
  const initSearchModel = unitRef.current.getGridParams().initSearchModal || [];
  let allSearchModel: any;
  if (selectionRowKeys?.length > 0) {
    allSearchModel = searchModel.concat([ ...headerSearchModel, { property: 'uuids', values: selectionRowKeys, op: 'ain' },...initSearchModel]);
  } else {
    allSearchModel = searchModel.concat([...headerSearchModel,...initSearchModel]);
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