/**
 * title: 备案单证-核查调阅-单证核查
 * author: mfc
 */
import React from 'react';
import { message, Badge } from 'antd';
import { history } from "@@/core/history";
import badzUtil from "@/pages/hts/badz/badzcommon/badzUtil";
import DDAlert from '@/pages/hts/components/DDAlert';
import { intl as intl2 } from '@/components/DDAssist/util';
import { deleteHcrwHcrwsc, hcdyHcrwSchcwj, hcdyHcrwDy } from "@/pages/hts/services/htsApi";

const hcjlFunc: any = {
  // 加载时蒙板使用
  unitRef: React.createRef(),
};

// 根据路由获取业务key
hcjlFunc.getYwKey = () => {
  const { location } = history;
  const { pathname } = location;
  const arr: any = pathname.split('/');
  let tmpKey: string = '';
  if (arr?.length > 0) {
    tmpKey = arr[arr.length - 1];
  }
  return tmpKey;
};
// 操作列
// 调阅
hcjlFunc.handlebadzHcjlDyCz = (param: any, event: any) => {
  event.stopPropagation();
  const { record, unitRef } = param;
  const qqbw = {
    rwbh: record.rwbh,
    rzlx: 'rwbh',
    badzczlxDm: '2'
  };
  unitRef.current?.setMasker(true);
  hcdyHcrwDy(qqbw).then((response) => {
    unitRef.current?.setMasker(false);
    if (response.code === '200') {
      const otherRef = param.unitRef.current?.getOtherRefs();
      const listData = response.body.wjljs;
      if (otherRef && otherRef[0]) {
        otherRef[0].current?.showModal(listData, param.unitRef);
      } else if (param.otherRef && param.otherRef[0]) {
        param.otherRef[0].current?.showModal(listData, param.unitRef);
      }
    } else {
      message.error(response.desc);
      return;
    }
  });
};

// 去获取
hcjlFunc.handlebadzHcjlQhqCz = (param: any, event: any) => {
  event.stopPropagation();
  history.push('/hts/badz/dzba/dzba');
  return;
};

// 查看详情
hcjlFunc.handlebadzHcjlCkxqCz = (param: any, event: any) => {
  event.stopPropagation();
  history.push(`/hts/badz/hcdy/dzhc?rwbh=${param.record.rwbh}`);
  return;
};

// 删除
hcjlFunc.handlebadzHcjlScCz = (param: any, event: any) => {
  const { unitRef } = param;
  event.stopPropagation();
  DDAlert.open({
    title: '系统提示',
    info: intl2.formatMessage({ id: 'message_inquiry_delete' }),
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: true,
    okCallbackFn: function (thisObj: any) {
      unitRef.current!.setMasker(true);
      const obj = { uuids: [param.record.rwbh] };
      deleteHcrwHcrwsc(obj).then((response) => {
        unitRef.current!.setMasker(false);
        if (response.code === '200') {
          message.success(intl2.formatMessage({ id: 'message_delete_success' }));
          // 清空选中并设置按钮可用状态
          unitRef.current?.setSelectionRowKeys([]);
          unitRef.current?.setSelectionRows([]);
          unitRef.current!.reload2();
        } else {
          message.error(response.desc);
          return;
        }
      });
    },
  });
  return;
};
// 操作列显隐
// 获取
hcjlFunc.gridBadzDzhcQhqCz = (record: any) => {
  if (record.bswjscztDm === '1' && record.bgdzs == 0) {
    return false;
  }
  return true;
};
// 详情
hcjlFunc.gridBadzDzhcCkxqCz = (record: any) => {
  if (record.bswjscztDm === '1' && record.bgdzs != 0) {
    return false;
  }
  return true;
};
// 调阅
hcjlFunc.gridBadzDzhcDyCz = (record: any) => {
  if (record.bswjscztDm === '3') {
    return false;
  }
  return true;
};
// 删除
hcjlFunc.gridBadzDzhcScCz = (record: any) => {
  if (record.bswjscztDm === '1' || record.bswjscztDm === '4') {
    return false;
  }
  return true;
};
// 下载资料（下载zip）
hcjlFunc.xzzl = (param: any) => {
  const { selectionRows } = param;
  const bgdzss: any = [];  // 报关单张数
  const ygdbgdzss: any = []; // 已归档报关单张数
  selectionRows.forEach((item: any) => {
    bgdzss.push(item.bgdzs);
    ygdbgdzss.push(item.ygdbgdzs);
  });
  if (bgdzss.indexOf(0) > -1 || ygdbgdzss.indexOf(0) > -1) {
    message.info(intl2.formatMessage({ id: 'message_badz_hcdy_schcwj_bgdzs_ygdzs_info' }));
    return;
  } else {
    badzUtil.common.xzzl(param, 'hcrw');
  }
};

// 打印成册（预览PDF）
hcjlFunc.dycc = (param: any, event: any) => {
  const { selectionRows } = param;
  const rwbhs = [];
  const bgdzss: any = [];  // 报关单张数
  const ygdbgdzss: any = []; // 已归档报关单张数
  selectionRows.forEach((item: any) => {
    if (item.bswjscztDm !== '3') {
      rwbhs.push(item.rwbh);
    }
    bgdzss.push(item.bgdzs);
    ygdbgdzss.push(item.ygdbgdzs);
  });
  if (rwbhs.length > 0) {
    message.info(intl2.formatMessage({ id: 'message_badz_hcdy_hcrw_dycc_warning' }));
  } else if (bgdzss.indexOf(0) > -1 || ygdbgdzss.indexOf(0) > -1) {
    message.info(intl2.formatMessage({ id: 'message_badz_hcdy_schcwj_bgdzs_ygdzs_info' }));
    return;
  } else {
    badzUtil.common.dycc(param, 'hcrw');
  }
};

// 下载excel模板
hcjlFunc.downloadExcel = () => {
  var eleLink = document.createElement('a');
  eleLink.download = '核查清单模板.xlsx'
  eleLink.href = `/public/template/badz/hcqdmb.xlsx`;
  eleLink.style.display = 'none';
  document.body.appendChild(eleLink);
  document.body.removeChild(eleLink);
  return;
};
// 生成核查文件
hcjlFunc.schcwj = (param: any) => {

  const { selectionRows, unitRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  // 任务编号数组
  const rwbhs: any = [];
  for (let i = 0; i < selectionRows.length; i++) {
    if (selectionRows[i].sczt === '2') {
      message.info(intl2.formatMessage({ id: 'message_badz_hcdy_schcwj_scz' }));
      return;
    } else if (selectionRows[i].bgdzs > selectionRows[i].ygdbgdzs) {
      message.info(intl2.formatMessage({ id: 'message_badz_hcdy_schcwj_info' }));
      return;
    } else if (!selectionRows[i].bgdzs || !selectionRows[i].ygdbgdzs) {
      message.info(intl2.formatMessage({ id: 'message_badz_hcdy_schcwj_bgdzs_ygdzs_info' }));
      return;
    } else {
      rwbhs.push(selectionRows[i].rwbh);
    }
  }
  if (rwbhs.length == selectionRows.length) {
    unitRef.current!.setMasker(true);
    // 生成核查文件
    hcdyHcrwSchcwj({ rwbhs }).then((response) => {
      unitRef.current!.setMasker(false);
      if (response.code === '200') {
        message.success(intl2.formatMessage({ id: 'message_badz_hcdy_schcwj_success' }));
        // 清空选中并设置按钮可用状态
        unitRef.current?.setSelectionRowKeys([]);
        unitRef.current?.setSelectionRows([]);
        unitRef.current!.reload2();
      } else {
        message.error(response.desc);
        return;
      }
    });
  }
};

hcjlFunc.columnsRender = {
  // 备案单证-备案状态
  renderBadzSczt: (param: any) => {
    let col: any = <></>;
    if (param.text === '1') {
      // 未生成
      col = (
        <span className="dd_grid_icon">
          <Badge status="default" />未生成
        </span>
      );
    } else if (param.text === '2') {
      // 生成中
      col = (
        <span className="dd_grid_icon">
          <Badge status="processing" />生成中
        </span>
      );
    } else if (param.text === '3') {
      // 生成成功
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" />生成成功
        </span>
      );
    } else if (param.text === '4') {
      // 生成失败
      col = (
        <span className="dd_grid_icon">
          <Badge status="error" />生成失败
        </span>
      );
    }
    return col;
  },
}
export default hcjlFunc;
