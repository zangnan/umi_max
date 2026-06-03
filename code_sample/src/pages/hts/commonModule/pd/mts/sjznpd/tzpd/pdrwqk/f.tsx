import React from 'react';
import { queryPager, deletePdrwByIds, tssbTzpdZdpd, tssbTzpdScmx, sjpp, initScmx } from '@/services/hts/api';
import { message, Button, Divider, Tooltip } from 'antd';
import { intl as intl2 } from "@/pages/common/myUtil";


const Func: any = {
  unitRef: React.createRef(),
};

// 列表自定义渲染
Func.columnsRender = {
  renderPdrwcz: (param: any) => {
    let col: any = [];
    const rt = param?.record;
    const tzpdztDm = rt?.tzpdztDm;//判断任务状态
    const pdrwlxDm = rt?.pdrwlxDm;
    if (pdrwlxDm == '02') {
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
            <Button type="link" onClick={(e) => { Func.handleZdpd02(param, e); }} style={{ marginTop: '2px' }}>重新配单</Button>
          </span><span className="dd_grid_icon">
              <Divider type='vertical' />
              <Button type="link" onClick={(e) => { Func.handlePdrwCkmx02(param, e); }} style={{ marginTop: '2px' }}>查看明细</Button>
            </span><span className="dd_grid_icon">
              <Divider type='vertical' />
              <Button type="link" onClick={(e) => { Func.handlePdrwRwxq02(param, e); }} style={{ marginTop: '2px' }}>任务详情</Button>
            </span></>
        );
      } else if (tzpdztDm === '04') {
        col = [];
        // 待生成
        col.push(
          <>
            <span className="dd_grid_icon">
              <Button type="link" onClick={(e) => { Func.handleZdpd02(param, e) }} style={{ marginTop: '2px' }}>重新配单</Button>
            </span>
            <span className="dd_grid_icon">
              <Divider type='vertical' />
              <Button type="link" onClick={(e) => { Func.handlePdrwCkmx02(param, e) }} style={{ marginTop: '2px' }}>查看明细</Button>
            </span>
            <span className="dd_grid_icon">
              <Divider type='vertical' />
              <Button type="link" onClick={(e) => { Func.handlePdrwRwxq02(param, e) }} style={{ marginTop: '2px' }}>任务详情</Button>
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
              <Button type="link" onClick={(e) => { Func.handlePdrwCkmx02(param, e) }} style={{ marginTop: '2px' }}>查看明细</Button>
            </span>
            <span className="dd_grid_icon">
              <Divider type='vertical' />
              <Button type="link" onClick={(e) => { Func.handlePdrwRwxq02(param, e) }} style={{ marginTop: '2px' }}>任务详情</Button>
            </span>
          </>
        );
      }
      else if (tzpdztDm === '13') {
        // 部分生成
        col.push(
          <>
            <span className="dd_grid_icon">
              <Button type="link" onClick={(e) => { Func.handlePdrwCkmx02(param, e) }} style={{ marginTop: '2px' }}>查看明细</Button>
            </span>
            <span className="dd_grid_icon">
              <Divider type='vertical' />
              <Button type="link" onClick={(e) => { Func.handlePdrwRwxq02(param, e) }} style={{ marginTop: '2px' }}>任务详情</Button>
            </span>
          </>
        );
      }
      else if (tzpdztDm === '14') {
        // 生成失败
        col.push(
          <>
            <span className="dd_grid_icon">
              <Button type="link" onClick={(e) => { Func.handleScmx02(param, e) }} style={{ marginTop: '2px' }}>重新生成</Button>
            </span>
            <span className="dd_grid_icon">
              <Divider type='vertical' />
              <Button type="link" onClick={(e) => { Func.handlePdrwCkmx02(param, e) }} style={{ marginTop: '2px' }}>查看明细</Button>
            </span>
            <span className="dd_grid_icon">
              <Divider type='vertical' />
              <Button type="link" onClick={(e) => { Func.handlePdrwRwxq02(param, e) }} style={{ marginTop: '2px' }}>任务详情</Button>
            </span>
          </>
        );
      }
    } else {
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
    }

    return col;
  },

  renderPdtj: (param: any) => {
    const { record } = param;
    const pdtj = param?.record?.srcs1;
    if (record?.pdrwlxDm == '02') {
      try {
        let pdtjCh = '';
        const parsedObject = JSON.parse(pdtj);
        const ppfs = parsedObject?.ppfs;
        const ppsx = parsedObject?.ppsx;
        const sjfw = parsedObject?.sjfw;
        if (parsedObject?.ppgzDm == '1') {
          pdtjCh = pdtjCh+"匹配规则:日期范围匹配；"
        } else if (parsedObject?.ppgzDm == '2') {
          pdtjCh = pdtjCh + "匹配规则:对照关系匹配:报关单" + param?.record?.kyppbgdts + '份，发票' + param?.record?.kyppfpts + '张；';
        }
        if (sjfw.bgdCkrqQ) {
          pdtjCh = pdtjCh+"报关单出口日期:" + sjfw.bgdCkrqQ + "至" + sjfw.bgdCkrqZ + "；"
        }
        if (sjfw.fpKprqQ) {
          pdtjCh = pdtjCh+"发票开票日期:" + sjfw.fpKprqQ + "至" + sjfw.fpKprqZ + "；"
        }
        if (ppfs.ydyppkcfjhslbz=='Y') {
          pdtjCh = pdtjCh+"一对一匹配（可拆分进货数量）；"
        }else{
          pdtjCh = pdtjCh+"一对一匹配（不拆分进货数量）；"
        }
        if (ppfs.yddppkcfjhslbz=='Y') {
          pdtjCh = pdtjCh+"一对多匹配（可拆分进货数量）；"
        }else{
          pdtjCh = pdtjCh+"一对多匹配（不拆分进货数量）；"
        }
        if (ppfs?.gdppfsDm == '1') {
          pdtjCh = pdtjCh + "整张匹配成功视为成功；"
        }else{
          pdtjCh = pdtjCh + "单项商品匹配视为成功；"
        }
        if (ppsx?.sydwglddzgxpdbz=='Y') {
          pdtjCh = pdtjCh + "使用计量单位转换；"
        }else{
          pdtjCh = pdtjCh + "不使用计量单位转换；"
        }
        if (ppsx?.qdgfhppbz=='Y') {
          pdtjCh = pdtjCh + "优先按商品品名、其次按规范化商品品名相同的顺序匹配；"
        }
        if (ppsx?.bgdggxhbhfpggxhbz=='Y') {
          pdtjCh = pdtjCh + "报关单规格型号包含发票规格型号优先匹配；"
        } else if (ppsx?.bgdggxhbhfpggxhbz=='N') {
          pdtjCh = pdtjCh + "不考虑规格型号；"
        } else if (ppsx?.bgdggxhbhfpggxhbz=='A') {
          pdtjCh = pdtjCh + "仅匹配报关单规格型号包含发票规格型号的发票；"
        }
        if (ppsx?.jnhydyjxfpxfszdyzyxppbz=='Y') {
          pdtjCh = pdtjCh + "境内货源地与进项发票销方所在地一致优先匹配；"
        }
        if (ppsx?.fpppsxDm=='1') {
          pdtjCh = pdtjCh + "开票日期先入先出优先匹配；"
        }else if(ppsx?.fpppsxDm=='2'){
          pdtjCh = pdtjCh + "开票日期后入先出优先匹配；"
        }else {
          pdtjCh = pdtjCh + "同一商品出口单价与进货单价由高至低进行匹配；"
        }
        if(ppsx?.cjpdsxzdDms?.length >0 ){
          pdtjCh = pdtjCh + "发票备注匹配条件："
          if (ppsx?.cjpdsxzdDms.includes("01")) {
            pdtjCh = pdtjCh + "报关单号(18位)；"
          }
          if (ppsx?.cjpdsxzdDms.includes("02")) {
            pdtjCh = pdtjCh + "报关单号(21位)；"
          }
          if (ppsx?.cjpdsxzdDms.includes("03")) {
            pdtjCh = pdtjCh + "提运单号；"
          }
          if (ppsx?.cjpdsxzdDms.includes("04")) {
            pdtjCh = pdtjCh + "合同协议号；"
          }
          if (ppsx?.cjpdsxzdDms.includes("05")) {
            pdtjCh = pdtjCh + "备注；"
          }
        }
        if (ppsx?.pdppmsDm == '1') {
          pdtjCh = pdtjCh + "精准匹配；"
        }else{
          pdtjCh = pdtjCh + "模糊匹配；"
        }
        return (<><Tooltip placement="topLeft" title={pdtjCh}>{pdtjCh}</Tooltip></>);
      } catch (e) {
        return (<><Tooltip placement="topLeft" title={pdtj}>{pdtj}</Tooltip></>);
      }
    } else {
      try {
        const parsedObject = JSON.parse(pdtj);
        const ckrq1Q = parsedObject?.ckrq1Q;
        const ckrq1Z = parsedObject?.ckrq1Z;
        const pdbgdts = parsedObject?.pdbgdts;
        const jhxfzzszyfpbz = parsedObject?.jhxfzzszyfpbz;
        const pdgz: any = parsedObject.pdgz;
        let pdtjCh = '';
        if (ckrq1Q) {
          pdtjCh = "出口日期:" + ckrq1Q + "至" + ckrq1Z + ";"
        }
        if (pdbgdts) {
          pdtjCh = pdtjCh + "本次配单涉及报关单" + pdbgdts + "条;";
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
        return (<><Tooltip placement="topLeft" title={pdtjCh}>{pdtjCh}</Tooltip></>);
      } catch (e) {
        return <Tooltip placement="topLeft" title={pdtj}>{pdtj}</Tooltip>;
      }
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
}

// 删除
Func.del = (param: any) => {
  const { selectionRowKeys, selectionRows, unitRef } = param;
  let flag = false;
  selectionRows.forEach((element: any) => {
    if (element.tzpdztDm == '02' || element.tzpdztDm == '11') {
      flag = true;
    }
  });
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else if (flag) {
    message.error("存在执行中数据，不可删除！");
    return;
  } else {
    deletePdrwByIds({ uuids: selectionRowKeys }).then((response) => {
      const { code, msg } = response;
      if (code === '200') {
        unitRef.current!.reload2();
        message.success('删除成功！');
      } else {
        message.error(msg);
      }
    });
  }
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


// 配单任务情况-查看明细
Func.handlePdrwCkmx = async (param: any, e: any) => {
  e.stopPropagation();
  const { record, otherRef, unitRef } = param;
  if (record?.pdrwlxDm == '02') {
    unitRef.current!.setMasker(true);
    await initScmx({ tableKey: "MTS_ZXSB_SB_MTS_TSSB_G" }).then(async (res: any) => {
      unitRef.current!.setMasker(false);
      if (res.code === '200') {
        const p = { "hhcbhlxx": res.body?.hhcbhlxx, 'hhcbhlsx': res.body?.hhcbhlsx };
        otherRef[2].current?.showModal(param, otherRef, p);
      } else {
        message.error(res.msg);
      }
    });

  } else {
    if (otherRef && otherRef[0]) {
      otherRef[0].current?.showModal(param);
    }
  }
}




// 配单任务情况-查看明细
Func.handlePdrwCkmx02 = async (param: any, e: any) => {
  e.stopPropagation();
  const { record, otherRef, unitRef } = param;
  unitRef.current!.setMasker(true);
  await initScmx({ tableKey: "MTS_ZXSB_SB_MTS_TSSB_G" }).then(async (res: any) => {
    unitRef.current!.setMasker(false);
    if (res.code === '200') {
      const p = { "hhcbhlxx": res.body?.hhcbhlxx, 'hhcbhlsx': res.body?.hhcbhlsx };
      otherRef[2].current?.showModal(param, otherRef, p);
    } else {
      message.error(res.msg);
    }
  });


}




// 配单任务情况-任务详情
Func.handlePdrwRwxq = async (param: any, e: any) => {
  e.stopPropagation();
  const { record, otherRef } = param;
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal(record);
  }
}

// 配单任务情况-任务详情
Func.handlePdrwRwxq02 = async (param: any, e: any) => {
  e.stopPropagation();
  const { record, otherRef } = param;
  otherRef[3].current?.showModal(record);
}




// 重新配单
Func.handleZdpd = async (param: any, e: any) => {
  e.stopPropagation();
  const {record, unitRef} = param;
  unitRef.current!.setMasker(true);
  const params = JSON.parse(record.srcs1);
  params.pduuid = record.pduuid;
  params.tzpdztDm = record.tzpdztDm;
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


// 重新配单
Func.handleZdpd02 = async (param: any, e: any) => {
  e.stopPropagation();
  const { record, unitRef } = param;
  const params = {};
  params.sjpp = JSON.parse(record.srcs1);
  params.pduuid = record.pduuid;
  params.tzpdztDm = record.tzpdztDm;
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



}
// 生成明细
Func.handleScmx = async (param: any, e: any) => {
  e.stopPropagation();
  const { record, unitRef, otherRef } = param;
  unitRef.current!.setMasker(true);
  const params = JSON.parse(record.sccs2);
  params.pduuid = record.pduuid;
  params.tzpdztDm = record.tzpdztDm;
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

// 生成明细
Func.handleScmx02 = async (param: any, e: any) => {
  e.stopPropagation();
  const { record, unitRef, otherRef } = param;
  otherRef[4].current?.showModal(param);


}
export default Func;
