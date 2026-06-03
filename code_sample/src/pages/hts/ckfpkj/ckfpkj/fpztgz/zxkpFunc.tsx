/**
 * title: 开票状态跟踪
 */
import React from 'react';
import DDAlert from '@/components/DDAlert';
import { message, Popover,Button } from 'antd';
import { cxkp, qxkp, fpzf } from '@/services/hts/api';
import { lzorzfGxzt, ztgzHpDelete, gxhpfpzt, djcsjkptj, ztgzZfDelete,fpmxcx2,fpxz } from '@/services/hts/api'; // 新加接口
import { intl as intl2 } from '@/pages/common/myUtil';
import myUtil from '@/pages/common/myUtil';
import { history } from 'umi';

const Func: any = {
  unitRef: React.createRef(),
};

// 蓝票发票撤回-仅蓝票有
// 其他走原来接口
Func.handleFpchLz = (param: any) => {
  const { selectionRows, unitRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  for (let i = 0; i < selectionRows.length; i++) {
    // 发票状态为“开票失败2”、“登录失败F”才允许撤回
    if (selectionRows[i].fpkjztDm !== '2' && selectionRows[i].fpkjztDm !== 'F') {
      message.info('请选择发票状态为“开票失败”的数据进行操作!');
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
          unitRef.current!.reload2();
          message.success('发票撤回成功! 数据已转到“发票申请单”或“导入模板开具”页面。');
        } else {
          message.error(response.msg);
        }
      })
    }
  })
}

// 蓝字 更新状态
Func.handleUpdateLzLp = (param: any) => {
  const { unitRef } = param;
  unitRef.current?.setMasker(true);
  lzorzfGxzt({fpkjztDm:'1'}).then((response: any) => {
    unitRef.current?.setMasker(false);
    if (response.code === '200') {
      message.success('更新状态申请成功!');
      unitRef.current!.reload2();
    } else {
      message.error(response.msg);
    }
  })
}

// 作废更新状态
Func.handleUpdateLz = (param: any) => {
  const { unitRef } = param;
  unitRef.current?.setMasker(true);
  lzorzfGxzt({fpkjztDm:'4'}).then((response: any) => {
    unitRef.current?.setMasker(false);
    if (response.code === '200') {
      message.success('更新状态申请成功!');
      unitRef.current!.reload2();
    } else {
      message.error(response.msg);
    }
  })
}

// 红字 更新状态（新接口加完)
Func.handleUpdateHz = (param: any) => {
  const { unitRef } = param;
  unitRef.current?.setMasker(true);
  gxhpfpzt({}).then((response: any) => {
    unitRef.current?.setMasker(false);
    if (response.code === '200') {
      message.success('更新状态申请成功!');
      unitRef.current!.reload2();
    } else {
      message.error(response.msg);
    }
  })
}

// 发票作废
Func.handleFpzf = (param: any) => {
  const { selectionRowKeys, selectionRows, unitRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows.length > 1) {
    message.info('请选择一条数据进行操作。');
    return;
  }
  if (selectionRows[0].fpkjztDm !== '5') {
    message.info('请选择发票状态为“作废失败”的数据进行操作。');
    return;
  }

  const obj = {
    fpsqduuids: selectionRowKeys
  }
  djcsjkptj(obj).then((res:any)=> {
    if(res.code === '200') {
      const tjInfo = res.body;
      DDAlert.open({
        title: '重新作废',
        info: '确定重新作废吗？',
        infoType: 'question',
        modalType: 'info',
        okText: '确定',
        content: <>
                  <div>单据号{myUtil.text.formatNum(tjInfo?.fpsqdzs, '0,0.00')}张</div>
                  <div>金额合计{myUtil.text.formatNum(tjInfo?.kpje, '0,0.00')}元</div>
                  <div>税额合计{myUtil.text.formatNum(tjInfo?.sehj, '0,0.00')}元</div>
                </>,
        closeStatus: false,
        okCallbackFn: function (thisObj: any) {
          thisObj.setState({ masker: true });
          fpzf({ fpsqduuid: selectionRowKeys[0] }).then((response) => {
            thisObj.setState({ masker: false });
            DDAlert.close();
            if (response.code === '200') {
              // 清空选中并设置按钮可用状态
              unitRef.current!.reload2();
              message.success('重新作废申请成功！')
            } else if (response.code === '900') {
              message.info(response.msg);
            } else {
              message.error(response.desc);
            }
          })
        }
      })
    } else {
      message.error(res.msg)
    }
  })
}

// 红票 删除 （新) 完成
Func.deleteHz = (param: any) => {
  const { selectionRows, unitRef, selectionRowKeys } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  for (let i = 0; i < selectionRows.length; i++) {
    // 发票状态为“开票失败2”才允许删除
    if (selectionRows[i].fpkjztDm !== '2') {
      message.info('请选择“开票失败”的数据进行操作。');
      return;
    }
  }
  DDAlert.open({
    title: '删除',
    info: '确定对勾选数据进行删除的操作吗？',
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: false,
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      ztgzHpDelete({ fpsqduuids: selectionRowKeys }).then((response) => {
        thisObj.setState({ masker: false });
        DDAlert.close();
        if (response.code === '200') {
          // 清空选中并设置按钮可用状态
          unitRef.current!.reload2();
          message.success('删除成功！');
        } else {
          message.error(response.msg);
        }
      })
    }
  })
}


// 作废 删除 （新) 完成
Func.deleteZf = (param: any) => {
  const { selectionRows, unitRef, selectionRowKeys } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  for (let i = 0; i < selectionRows.length; i++) {
    // 发票状态为“作废失败5”才允许删除
    if (selectionRows[i].fpkjztDm !== '5') {
      message.info('请选择“作废失败”的数据进行操作。');
      return;
    }
  }
  DDAlert.open({
    title: '删除',
    info: '确定对勾选数据进行删除的操作吗？',
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: false,
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      ztgzZfDelete({ fpsqduuids: selectionRowKeys }).then((response) => {
        thisObj.setState({ masker: false });
        DDAlert.close();
        if (response.code === '200') {
          // 清空选中并设置按钮可用状态
          unitRef.current!.reload2();
          message.success('删除成功！');
        } else {
          message.error(response.msg);
        }
      })
    }
  })
}


// 配置项：快捷筛选
Func.handleOnChangeFplx = (param: any) => {
  let bz:any = '';
  if(history.location.query) {
    bz = history.location.query?.bz;
  }
  const { value } = param;
  if (value == '1') {
    if(bz) {
      history.push('/hts/ckfpkj/ckfpkj/fpztgz?bz='+bz);
    } else {
      history.push('/hts/ckfpkj/ckfpkj/fpztgz');
    }
  } else if (value == '2') {
    if(bz) {
      history.push('/hts/ckfpkj/ckfpkj/hzFpztgz?bz='+bz);
    } else {
      history.push('/hts/ckfpkj/ckfpkj/hzFpztgz');
    }
  } else {
    // history.push('/hts/ckfpkj/ckfpkj/zfFpztgz');
    if(bz) {
      history.push('/hts/ckfpkj/ckfpkj/zfFpztgz?bz='+bz);
    } else {
      history.push('/hts/ckfpkj/ckfpkj/zfFpztgz');
    }
  }
};
Func.gridBadzDzhc23Cz = (param: any) => {
  if (param.fpkjztDm === '2' ) {
    return  false;
  }
  return true;
}

Func.gridBadzDzhc23Cz2 = (param: any) => {
  if (param.fpkjztDm === '3' && param.fpzlDm1 === '4' || param.fpkjztDm === '3' && param.fpzlDm1 === '5') {
    return  false;
  }
  return true;
}

Func.columnUpdate = (param: any,event:any) => {
  event.stopPropagation();
  const { unitRef, record } = param;
  const otherRef = unitRef.current?.getOtherRefs();
  unitRef.current!.setMasker(true);
  const obj = {
    djbh: record?.djbh,
    fpsqduuid: record?.fpsqduuid,
    ly: record?.fpkjsjlyDm,
    fpkjfsDm:record?.fpkjfsDm,
  }
  fpmxcx2(obj).then((response) => {
    const { code, body } = response;
    unitRef.current!.setMasker(false);
    if (code === '200') {
      const hw: any = [...body.hwxxList]
      hw.forEach((item: any) => {
        item.uuid = myUtil.getUUID(32);
        // je是未税金额，dj是未税单价 需要保存返回后台 
        item.wsje = item.je;
        item.wsdj = item.dj;
        // jshj是含税金额,hsdj是含税单价
        item.je = item.jshj;
        item.dj = item.hsdj;
      })
      let isFpsqd = '1'; // 是否为发票申请单
      if(record?.fpkjfsDm === '3') {
        isFpsqd = '3';
      }
      body.fpsqdxx.fpkjfsDm = record?.fpkjfsDm;
      otherRef[0].current!.showModal({ fpsqdxx: body.fpsqdxx, hw, sbyy1: record?.sbyy1 }, false, unitRef, isFpsqd);
      otherRef[0].current!.setDjh(record?.djbh);
    } else{
      message.error(body?.msg);
    }
  })
}


Func.printInvoice = (param: any,event:any) => {
  event.stopPropagation();
  const { unitRef, record } = param;
  unitRef.current?.setMasker(true);
  fpxz({ fpsqduuid: record.fpsqduuid }).then((response) => {
    unitRef.current?.setMasker(false);
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadPdf(blob, fileName);
      message.success('下载成功');
    } else {
      message.error(response.desc);
    }
  })
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
    let col: any = <></>;
    if(history?.location?.pathname.indexOf('/hts/ckfpkj/ckfpkj/fpztgz') > -1) {
      col = <span>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_FPKJZT', '03')}</span>
    } else if(history?.location?.pathname.indexOf('/hts/ckfpkj/ckfpkj/hzFpztgz') > -1){
      col = <span>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_FPKJZT', '04')}</span>
    } else if(history?.location?.pathname.indexOf('/hts/ckfpkj/ckfpkj/zfFpztgz') > -1) {
      col = <span>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_FPKJZT', '05')}</span>
    } else {
      col = <span>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_FPKJZT', '01')}</span>
    }
    
    // if (record.fpkjztDm === '0') {
    //   col = <span>待开票</span>
    // } else if (param.text === '1') {
    //   col = <span>开票中</span>
    // } else if (param.text === '2') {
    //   col = <span className="dd_grid_icon">开票失败</span>
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