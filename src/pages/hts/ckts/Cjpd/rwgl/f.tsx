import React from 'react';
import { queryPager, tssbTzpdZdpd, tssbTzpdScmx, sjpp } from '@/pages/hts/services/htsApi';
import { message, Button, Divider, Tooltip } from 'antd';
import { intl as intl2 } from '@/components/DDAssist/util';


const Func: any = {
  unitRef: React.createRef(),
};

Func.columnsRender = {

  renderPdtj: (param: any) => {
    const pdtj = param?.record?.srcs1;
    try {
      const parsedObject = JSON.parse(pdtj);
      const ckrq1Q = parsedObject?.ckrq1Q;
      const ckrq1Z = parsedObject?.ckrq1Z;
      const jhxfzzszyfpbz = parsedObject?.jhxfzzszyfpbz;
      const pdgz: any = parsedObject.pdgz;
      let pdtjCh = '';
      if (ckrq1Q) {
        pdtjCh = "出口日期:" + ckrq1Q + "至" + ckrq1Z + ";"
      }
      if (pdgz) {
        let pdgzCh = '配单规则:';
        pdgz.forEach((item: any) => {
          if (item === "SPMC") {
            pdgzCh = pdgzCh + '商品名称校验;'
          }
          if (item === "DW") {
            pdgzCh = pdgzCh + '单位校验;'
          }
          if (item === "SL") {
            pdgzCh = pdgzCh + '数量校验;'
          }
        });
        pdtjCh = pdtjCh + pdgzCh;
      }
      if (jhxfzzszyfpbz && jhxfzzszyfpbz === 'Y') {
        pdtjCh = pdtjCh + "发票状态:需要稽核信息;"
      }
      return (<>      <Tooltip placement="topLeft" title={pdtjCh}>{pdtjCh}</Tooltip></>);
    } catch (e) {
      return <Tooltip placement="topLeft" title={pdtj}>{pdtj}</Tooltip>;
    }
  },
  renderSctj: (param: any) => {
    const sccs2 = param?.record?.sccs2;
    try {
      const parsedObject = JSON.parse(sccs2);
      const ssq = parsedObject?.ssq;
      const sbpc = parsedObject?.sbpc;
      const glh = parsedObject?.glh;
      const hhcbbz = parsedObject?.hhcbbz;
      let pdtjCh = '';
      if (ssq) {
        pdtjCh = pdtjCh + "申报年月:" + ssq + ";"
      }
      if (sbpc) {
        pdtjCh = pdtjCh + "申报批次:" + sbpc + ";"
      }
      if (glh) {
        pdtjCh = pdtjCh + "起始关联号:" + glh + ";"
      }
      if (hhcbbz) {
        let pdgzCh = '换汇成本:';
        hhcbbz.forEach((item: any) => {
          if (item === "1") {
            pdgzCh = pdgzCh + '合理范围内;'
          }
          if (item === "2") {
            pdgzCh = pdgzCh + '低于合理范围;'
          }
          if (item === "3") {
            pdgzCh = pdgzCh + '高于合理范围;'
          }
        });
        pdtjCh = pdtjCh + pdgzCh;
      }
      return (<><Tooltip placement="topLeft" title={pdtjCh}>{pdtjCh}</Tooltip></>);
    } catch (e) {
      return sccs2;
    }
  },
  renderPdrwcz: (param: any) => {
    let col: any = [];
    const rt = param?.record;
    const tzpdztDm = rt?.tzpdztDm;//判断任务状态
    if (tzpdztDm === '02') {
      // 配单中-刷新
      col.push(
        <span className="dd_grid_icon">
          <Button type="link" onClick={(e) => { Func.handlePdrwreload(param, e) }} style={{ marginTop: '2px' }}>刷新</Button>
        </span>
      );
    } else if (tzpdztDm === '03') {
      // 配单失败
      col = [];
      col.push(
        <><span className="dd_grid_icon">
          <Button type="link" onClick={(e) => { Func.handleZdpd(param, e); }} style={{ marginTop: '2px' }}>重新配单</Button>
        </span><span className="dd_grid_icon">
            <Divider type='vertical' />
            <Button type="link" onClick={(e) => { Func.handlePdrwCkmx(param, e); }} style={{ marginTop: '2px' }}>查看明细</Button>
          </span><span className="dd_grid_icon">
            <Divider type='vertical' />
            <Button type="link" onClick={(e) => { Func.handlePdrwRwxq(param, e); }} style={{ marginTop: '2px' }}>任务详情</Button>
          </span></>
      );
    } else if (tzpdztDm === '04') {
      col = [];
      // 待生成
      col.push(
        <>
          <span className="dd_grid_icon">
            <Button type="link" onClick={(e) => { Func.handleZdpd(param, e) }} style={{ marginTop: '2px' }}>重新配单</Button>
          </span>
          <span className="dd_grid_icon">
            <Divider type='vertical' />
            <Button type="link" onClick={(e) => { Func.handlePdrwCkmx(param, e) }} style={{ marginTop: '2px' }}>查看明细</Button>
          </span>
          <span className="dd_grid_icon">
            <Divider type='vertical' />
            <Button type="link" onClick={(e) => { Func.handlePdrwRwxq(param, e) }} style={{ marginTop: '2px' }}>任务详情</Button>
          </span>
        </>
      );
    }
    else if (tzpdztDm === '11') {
      // 生成中
      col.push(
        <>
          <span className="dd_grid_icon">
            <Button type="link" onClick={(e) => { Func.handlePdrwreload(param, e) }} style={{ marginTop: '2px' }}>刷新</Button>
          </span>
        </>
      );
    }
    else if (tzpdztDm === '12') {
      // 生成成功
      col.push(
        <>
          <span className="dd_grid_icon">
            <Button type="link" onClick={(e) => { Func.handlePdrwCkmx(param, e) }} style={{ marginTop: '2px' }}>查看明细</Button>
          </span>
          <span className="dd_grid_icon">
            <Divider type='vertical' />
            <Button type="link" onClick={(e) => { Func.handlePdrwRwxq(param, e) }} style={{ marginTop: '2px' }}>任务详情</Button>
          </span>
        </>
      );
    }
    else if (tzpdztDm === '13') {
      // 部分生成
      col.push(
        <>
          <span className="dd_grid_icon">
            <Button type="link" onClick={(e) => { Func.handlePdrwCkmx(param, e) }} style={{ marginTop: '2px' }}>查看明细</Button>
          </span>
          <span className="dd_grid_icon">
            <Divider type='vertical' />
            <Button type="link" onClick={(e) => { Func.handlePdrwRwxq(param, e) }} style={{ marginTop: '2px' }}>任务详情</Button>
          </span>
        </>
      );
    }
    else if (tzpdztDm === '14') {
      // 生成失败
      col.push(
        <>
          <span className="dd_grid_icon">
            <Button type="link" onClick={(e) => { Func.handleScmx(param, e) }} style={{ marginTop: '2px' }}>重新生成</Button>
          </span>
          <span className="dd_grid_icon">
            <Divider type='vertical' />
            <Button type="link" onClick={(e) => { Func.handlePdrwCkmx(param, e) }} style={{ marginTop: '2px' }}>查看明细</Button>
          </span>
          <span className="dd_grid_icon">
            <Divider type='vertical' />
            <Button type="link" onClick={(e) => { Func.handlePdrwRwxq(param, e) }} style={{ marginTop: '2px' }}>任务详情</Button>
          </span>
        </>
      );
    }
    return col;
  },
}




// 配单任务情况-刷新
Func.handlePdrwreload = async (param: any, e: any) => {
  e.stopPropagation();
  const { unitRef, record } = param;
  const searchModel: any[] = [];
  searchModel.push({
    type: "1",
    property: "pduuid",
    value: param?.record?.pduuid,
    op: "zdy",
  });
  const params = {
    key: "MTS_SJPP_PDRW_QUERY_PAGE",
    searchModel: [
      ...searchModel
    ],
    orderModel: [],
  };
  unitRef.current!.setMasker(true);
  await queryPager(params).then(async (response: any) => {
    const { code, desc, msg } = response;
    unitRef.current!.setMasker(false);
    if (code === '200') {
      message.success('操作成功');
      unitRef?.current?.reload2();
    } else {
      message.error(desc);
      return;
    }
  });

}

// 重新配单
Func.handleZdpd = async (param: any, e: any) => {
  e.stopPropagation();
  const { record, unitRef } = param;
  const params = JSON.parse(record.srcs1);
  params.pduuid = record.pduuid;
  params.tzpdztDm = record.tzpdztDm;
  if (record?.pdrwlxDm == '02') {
    //超级配单
    unitRef.current!.setMasker(true);
    sjpp(params).then((response) => {
      unitRef.current!.setMasker(false);
      const { code, msg } = response;
      if (code === '200') {
        unitRef.current!.reload2();
      } else {
        message.error(msg);
      }
    });

  } else {
    //台账配单
    unitRef.current!.setMasker(true);
    tssbTzpdZdpd(params).then((response) => {
      unitRef.current!.setMasker(false);
      const { code, msg } = response;
      if (code === '200') {
        unitRef.current!.reload2();
      } else {
        message.error(msg);
      }
    });
  }

}

// 配单任务情况-查看明细
Func.handlePdrwCkmx = async (param: any, e: any) => {
  e.stopPropagation();
  const { record, otherRef } = param;
  if (record?.pdrwlxDm == '02') {
    otherRef[2].current?.showModal(param);
  } else {
    if (otherRef && otherRef[0]) {
      otherRef[0].current?.showModal(param);
    }
  }
}


// 配单任务情况-任务详情
Func.handlePdrwRwxq = async (param: any, e: any) => {
  e.stopPropagation();
  const { record, otherRef } = param;
  if (record?.pdrwlxDm == '02') {
    otherRef[3].current?.showModal(record);
  } else {
    if (otherRef && otherRef[1]) {
      otherRef[1].current?.showModal(record);
    }
  }
}



// 生成明细
Func.handleScmx = async (param: any, e: any) => {
  e.stopPropagation();
  const { record, unitRef } = param;
  const params = JSON.parse(record.sccs2);
  params.pduuid = record.pduuid;
  params.tzpdztDm = record.tzpdztDm;
  unitRef.current!.setMasker(true);
  tssbTzpdScmx(params).then((response) => {
    unitRef.current!.setMasker(false);
    const { code, msg } = response;
    if (code === '200') {
      unitRef.current!.reload2();
    } else {
      message.error(msg);
    }
  });

}

export default Func;
