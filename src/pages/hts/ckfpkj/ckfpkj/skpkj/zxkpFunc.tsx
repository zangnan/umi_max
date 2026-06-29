import React from 'react';
import { queryPager, checkCkspSheet, djcsjkptj } from '@/pages/hts/services/htsApi';
import { message, Popover, Tooltip } from 'antd';
import { intl as intl2 } from '@/components/DDAssist/util';
import { WarningOutlined } from '@ant-design/icons';
import myUtil from '@/components/DDAssist/util';
import { history } from 'umi';
import { fpmxcx2, qxkp } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/commonModule/DDAlert';

const ckfpFunc: any = {
  unitRef: React.createRef(),
};

ckfpFunc.columnUpdate = (param: any, event: any) => {
  event.stopPropagation();
  const { unitRef, record } = param;
  const otherRef = unitRef.current?.getOtherRefs();
  unitRef.current!.setMasker(true);
  const obj = {
    djbh: record?.djbh,
    fpsqduuid: record?.fpsqduuid,
    ly: record?.fpkjsjlyDm,
  }
  fpmxcx2(obj).then((response) => {
    const { code, body } = response;
    unitRef.current!.setMasker(false);
    if (code === '200') {
      const hw: any = [...body.hwxxList]
      hw.forEach((item: any) => {
        item.uuid = myUtil.text.uuid(32);
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
      otherRef[0].current!.showModal({ fpsqdxx: body.fpsqdxx, hw, sbyy1: record?.sbyy1 }, true, unitRef, isFpsqd);
      otherRef[0].current!.setDjh(record?.djbh);
    }
  })
}

// 发票撤回
ckfpFunc.handleFpch = (param: any) => {
  const { selectionRows, unitRef,selectionRowKeys } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }

  const fpsqduuids: any = [];
  if (selectionRowKeys && selectionRowKeys.length > 0) {
    selectionRows.forEach((row: any) => {
      fpsqduuids.push(row.fpsqduuid);
    });
  }

  const kptj = {
    fpsqduuids: fpsqduuids,
    cxlx:'2',
  };

  djcsjkptj(kptj).then((res1: any) => {
    unitRef.current!.setMasker(false);
    if (res1.code != '200') {
      message.info(res1.msg);
      return;
    }
    DDAlert.open({
      title: '发票撤回',
      info: '确定发票撤回吗？',
      modalType: 'confirm',
      okText: '确定',
      content: [
        '单据号' + res1.body.fpsqdzs + '张',
        '金额合计' + myUtil.text.formatNum(res1.body.kpje, '0,0.00') + '元',
        '税额合计' + myUtil.text.formatNum(res1.body.sehj, '0,0.00') + '元'
      ],
      okCallbackFn: function () {
        unitRef.current!.setMasker(true);
        qxkp({ fpglVoList: selectionRows }).then((response) => {
          unitRef.current!.setMasker(false);
          DDAlert.close();
          if (response.code === '200') {
            // 清空选中并设置按钮可用状态
            unitRef.current!.reload2();
            message.success('发票撤回成功! 数据已转到“发票申请单”或“导入模板开具”页面。');
          } else {
            message.error(response.msg);
          }
        });
      }
    });
  });


}

ckfpFunc.columnsRender= {
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

  // 检查状态
  renderFpkjglJczt: (param: any) => {
    let col: any = <></>;
    col = <span>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_FPKJZT:09')}</span>
    return col;
  },
  renderFpkjglXgbz: (param: any) => {
    let col: any = <></>;
    if (param.text === 'Y') {
      col = <span>已修改</span>
    } else {
      col = <span>未修改</span>
    }
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

};

export default ckfpFunc;
