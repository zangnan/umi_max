import React from 'react';
import { message, Popover } from 'antd';
import myUtil from '@/components/DDAssist/util';
import { history } from 'umi';
import { downloadTemplate } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';

const ckfpFunc: any = {
  refUnit: React.createRef(),
};

// 自定义工具栏：导出开票结果
ckfpFunc.exportKpjg = (param: any) => {
  const { selectionRowKeys, refUnit, gridRef } = param;
  const gridData  = param.refUnit.current.getGridData();
  if (gridData.length === 0) {
    message.info('当前筛选条件下无数据，请确认！');
    return;
  }
  let title = '确定对当前筛选条件下所有数据进行操作吗？';
  if(selectionRowKeys.length > 0) {
    title = '确定对勾选数据进行导出开票结果的操作吗？';
  }

  const searchModel = refUnit.current?.getGridParams().searchModel || [];
  const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
  const initSearchModel = refUnit.current.getGridParams().initSearchModal || [];
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
    key: 'SAAS_CKFPKJ_FPGL_DCKPJG_ZXKP_LZFP_DC',
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
};

export default ckfpFunc;
