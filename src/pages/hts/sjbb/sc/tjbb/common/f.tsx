import React from 'react';
import { Button, Tooltip } from 'antd';
import { history } from 'umi';
import myUtil from '@/components/DDAssist/util';

const Func: any = {
  refUnit: React.createRef(),
};

// 下钻
Func.openDrawer = (param: any, unitKey: any) => {
  let value: any = param.text;
  const {record} = param;
  let initSearchModal: any = [];
  if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/ckqk/fyhz') { // 分月汇总
    initSearchModal = [
      { property: 'ckny', value: record.fzxm, op: 'zdy' },
    ]
  } else if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/ckqk/fgbckqk') { // 分国别出口情况
    initSearchModal = [
      { property: 'zzmdgdqszDm', value: record.fzxm, op: 'zdy' },
    ]
  } else if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/ckqk/fkackqk') { // 分口岸出口情况
    initSearchModal = [
      { property: 'hggqkaDm', value: record.fzxm, op: 'zdy' },
    ]
  } else if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/ckqk/fjgfsckqk') { // 分监管方式出口情况
    initSearchModal = [
      { property: 'jgfsDm', value: record.fzxm, op: 'zdy' },
    ]
  } else if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/ckqk/fysfsckqk') { // 分运输方式出口情况
    initSearchModal = [
      { property: 'ysfsDm', value: record.fzxm, op: 'zdy' },
    ]
  } else if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/ckqk/htckqk') { // 合同出口情况
    initSearchModal = [
      { property: 'ckhth', value: record.fzxm, op: 'zdy' },
      { property: 'zdflag', value: 1, op: 'zdy' },
    ]
  } else if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/ckqk/fjwshrckqk') { // 分境外收货人出口情况
    initSearchModal = [
      { property: 'jwshrmc', value: record.fzxm, op: 'zdy' },
    ]
  } else if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/ckqk/fspckqk') { // 分商品出口情况
    initSearchModal = [
      { property: 'hgckspDm', value: value, op: 'zdy' },
    ]
  } else if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/ckqk/cktslfb') { // 出口退税率分布
    initSearchModal = [
      { property: 'tsl', value: record.tsl, op: 'zdy' },
    ]
  }

  const otherRef = param.refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param, initSearchModal, unitKey);
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param, initSearchModal, unitKey);
  }
}

Func.afterReload = (param: any) => {
  const searchModel = param.refUnit?.current?.getGridParams().searchModel;
  const key = param.refUnit?.current?.getGridParams().key;
  if (searchModel?.length > 0) {
    myUtil.localStore.setItem(key, searchModel);
  }
};

// 列表自定义渲染
Func.columnsRender = {
  // 分组项目
  renderFzxm: (param: any) => {
    const key = param.refUnit?.current?.getGridParams().key;
    const fzxmmc = param.record?.fzxmmc;
    return (
      <Tooltip title={fzxmmc}>
        <Button type="link" onClick={() => { Func.openDrawer(param, key) }}>
          {fzxmmc}
        </Button>
      </Tooltip>
    );
  },
  // 商品代码
  renderFzxmQt: (param: any) => {
    const key = param.refUnit?.current?.getGridParams().key;
    return (
      <Tooltip title={param.text}>
        <Button type="link" onClick={() => { Func.openDrawer(param, key) }}>
          {param.text}
        </Button>
      </Tooltip>
    );
  },
  // 美元离岸价本期
  renderMylajbq: (param: any) => {
    const key = param.refUnit?.current?.getGridParams().key;
    if(param.text && param.text != "0"){
      return (
        <Button type="link" onClick={() => { Func.openDrawer(param, key) }}>
          {myUtil.text.formatNum(param.text, '0,0.00')}
        </Button>
      );
    } else {
      return (
        <span>{myUtil.text.formatNum(param.text, '0,0.00')}</span>
      );
    }
  },
}
export default Func;