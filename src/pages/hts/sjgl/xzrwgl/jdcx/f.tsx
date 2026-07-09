import cktsUtil from '@/pages/hts/cktsUtil';
import React from 'react';
import { message, Badge, Tooltip, Button, Divider } from 'antd';
import {
  sjxzDelrw, rwjdcxxz, rwjdsx, queryKakPassword, rwycgx, rwsxForGpt, queryPager, qxzxForGpt, gxBgdCzbzSx, qxzxForYbt, gdhdrwqxzx, gdhdrwqxzxcheck, qxzxForLtkhdgj, cxzirwForLtkhdgjqxzx, qxzxJshst } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import khdgjUtil from '@/pages/hts/ckfp/khdgjUtil';
import myUtil from '@/components/DDAssist/util';

const Func: any = {
  refUnit: React.createRef(),
};

Func.param = {};

Func.handleBatchDelete = (param: any) => {
  const { gridRef, selectionRows, refUnit } = param;
  if (!selectionRows || selectionRows.length === 0) {
    const unSelectedMessage = Func.intl.formatMessage({ id: 'message_delete_unselected' });
    message.info(unSelectedMessage);
    return;
  } else {
    const xzdyuuids: any = [];
    let num = 0;
    for (let i = 0; i < selectionRows.length; i++) {
      if (selectionRows[i].xzztDm === '0') {
        num = num + 1;
      }
      xzdyuuids.push(selectionRows[i].xzdyuuid);
    }
    if (num > 0) {
      const checkMessage = Func.intl.formatMessage({ id: 'message_jljghx_jdcx_plsc_check' });
      message.info(checkMessage);
      return;
    }
    const titleMessage = Func.intl.formatMessage({ id: 'message_jljghx_jdcx_plsc_title' });
    const infoMessage = Func.intl.formatMessage({ id: 'message_inquiry_delete' });
    DDAlert.open({
      title: titleMessage,
      info: infoMessage,
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: true,
      content: '',
      isFormContent: false,
      okCallbackFn: function () {
        const data = {
          xzdyuuids: xzdyuuids
        };
        refUnit.current!.setMasker(true);
        sjxzDelrw(data).then((response: any) => {
          refUnit.current!.setMasker(false);
          const { code, desc } = response;
          if (code === '200') {
            refUnit.current?.setSelectionRowKeys([]);
            refUnit.current?.setSelectionRows([]);
            gridRef.current?.reload();
            const successMessage = Func.intl.formatMessage({ id: 'message_delete_success' });
            message.success(successMessage);
          } else {
            message.error(desc);
            return;
          }
        })
      }
    });
  }
}

// 下载开票文件
Func.handleDownLoadKpwj = async (param: any) => {
  const { gridRef, selectionRows, refUnit } = param;
  if (!selectionRows || selectionRows.length === 0) {
    const unSelectedMessage = Func.intl.formatMessage({ id: 'message_jljghx_jdcx_cxxz_unSelected' });
    message.info(unSelectedMessage);
    return;
  } else {
    for (let i = 0; i < selectionRows.length; i++) {
      if (selectionRows[i]?.ywflDm == '004') {
        message.info("勾选数据中包含“税务反馈下载”，暂不支持重新下载。");
        return;
      }
    }
  }
  const xzdyuuids: any = [];
  let num = 0;
  for (let i = 0; i < selectionRows.length; i++) {
    if (selectionRows[i].xzztDm === '0') {
      num = num + 1;
    }
    xzdyuuids.push(selectionRows[i].xzdyuuid);
  }
  if (num > 0) {
    const checkMessage = Func.intl.formatMessage({ id: 'message_jljghx_jdcx_cxxz_check' });
    message.info(checkMessage);
    return;
  }

  const titleMessage = Func.intl.formatMessage({ id: 'message_jljghx_jdcx_cxxz_title' });
  const infoMessage = Func.intl.formatMessage({ id: 'message_jljghx_jdcx_cxxz_info' });
  const result = await queryKakPassword({});
  if (result?.code == '200') {
    refUnit.current!.setMasker(true);
    const { jcbz, msg } = await khdgjUtil.khdgjJc({ icCardPsw: result.body.kakmm, yhjq: result.body.yhjq });
    refUnit.current!.setMasker(false);
    if (jcbz != 'Y') {
      message.info(msg);
      return;
    }
  } else {
    message.info(result?.msg);
    return;
  }
  DDAlert.open({
    title: titleMessage,
    info: infoMessage,
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: true,
    content: '',
    isFormContent: false,
    okCallbackFn: function () {
      refUnit.current!.setMasker(true);
      rwjdcxxz({ xzdyuuids }).then(async (response: any) => {
        const { code, body, desc } = response;
        if (code === '200') {
          const taskIds = body.taskIds;
          const yhjq = body.yhjq;
          // 含有客户端工具的主键集合，调用客户端工具
          if (taskIds) {
            for (var item of body.taskIds) {
              param.taskId = item;
              param.yhjq = body?.yhjq;
              const flag = await khdgjUtil.khdgjGdxz(param);
              //调用反写状态接口
              if (flag.code != '200') {
                const p = { xzdyuuid: '', csz1: '', csz2: '' };
                p.xzdyuuid = item;
                p.csz1 = flag.code;
                p.csz2 = flag.msg;
                await rwycgx(p).then(async (res4) => {
                })
                refUnit.current!.setMasker(false);
                DDAlert.close;
                return;
              }
            }
            refUnit.current!.setMasker(false);
          }
          refUnit.current?.setSelectionRowKeys([]);
          refUnit.current?.setSelectionRows([]);
          gridRef.current?.reload();
          message.success(Func.intl.formatMessage({ id: 'message_jljghx_jdcx_cxxz_success' }));
        } else {
          refUnit.current!.setMasker(false);
          message.error(response?.msg);
          return;
        }
      })
    }
  });
}

Func.handleCkmx = (param: any, e: any) => {
  const { refUnit } = param;
  e.stopPropagation();
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef) {
    otherRef[0].current?.showModal(param);
  }
}

// 报关单备案单证缺失检查任务-查看详情
Func.handleBgddzqsjcCkxq = (param: any, e: any) => {
  const { refUnit } = param;
  e.stopPropagation();
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef) {
    otherRef[3].current?.showModal(param);
  }
}


Func.gdhdjcbg = async (param: any, e: any) => {
  const { refUnit } = param;
  e.stopPropagation();
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef) {
    otherRef[2].current?.showModal(param);
  }
}


// 列表自定义渲染
Func.columnsRender = {
  renderJdcz: (param: any) => {
    let col: any = [];
    const rt = param?.record;
    const ywflDm = rt?.ywflDm;
    const xzztdm = rt?.xzztDm;     //判断执行状态
    const sjgjsjDm = rt?.sjgjsjDm; // 任务
    const zrwts = rt?.zrwts;
    const zdxz = rt?.zdscbz;
    const zcgts = rt?.zcgts;
    const bdhdycts = rt?.bdhdycts;
    //先判断口岸卡是海关数据
    const bgdsjly = rt?.bgdsjlyDm ? rt?.bgdsjlyDm : cktsUtil.sys.bgdsjlyType();
    if (zdxz != "Y") {
      if (ywflDm === '001') {
        if (rt.kakuuid && rt.sdbz === 'Y') {
        } else {
          if (sjgjsjDm === '010111') {

          } else if (xzztdm === '0') {
            //执行中
            //不可执行
            // 关票通有刷新
            col.push(
              <>
                {(bgdsjly === '4' && (sjgjsjDm === '010101' || sjgjsjDm === '010201')) || (bgdsjly === '6' && (sjgjsjDm === '010101' || sjgjsjDm === '010201' || sjgjsjDm === '040000')) ?
                  <>
                    <span className="dd_grid_icon">
                      <Button type="link" onClick={() => { Func.qxzx(param) }} style={{ marginTop: '2px' }}>取消执行</Button>
                    </span>
                    <span className="dd_grid_icon">
                      <Divider type='vertical' />
                      <Button type="link" onClick={(e) => { Func.handleGptreload(param, e) }} style={{ marginTop: '2px' }}>刷新</Button>
                    </span>
                  </> :
                  sjgjsjDm === '030603' ?
                    <>
                      <span className="dd_grid_icon">
                        <Button type="link" onClick={(e) => { Func.handleJ4RpaSx(param, e) }} style={{ marginTop: '2px' }}>刷新</Button>
                      </span>
                    </> :
                    sjgjsjDm === '010106' ?
                      <>
                        <span className="dd_grid_icon">
                          <Button type="link" onClick={(e) => { Func.gdhdrwqxzx(param, e) }} style={{ marginTop: '2px' }}>取消执行</Button>
                        </span>
                      </> :
                      <>
                        <span className="dd_grid_icon">
                          <Button type="link" onClick={() => { Func.zyzx(param) }} style={{ marginTop: '2px' }}>暂停执行</Button>
                        </span>
                      </>
                }
              </>
            );
          } else if (sjgjsjDm === '010106' && zcgts > 0 && bdhdycts > 0) {
            // 异常报告
            col.push(
              <span className="dd_grid_icon">
                <Button type="link" onClick={(e) => { Func.gdhdjcbg(param, e) }} style={{ marginTop: '2px' }}>异常报告</Button>
              </span>
            );
          } else if (xzztdm === '1' && sjgjsjDm != '030603' && sjgjsjDm != '010106') {
            // 重新执行
            // 已完成
            /*col.push(
              <span className="dd_grid_icon">
              <Button type="link" onClick={(e) => { Func.zxrw(param, e)}}style={{marginTop: '2px'}}>重新执行</Button>
            </span>
            );*/
          } else if (xzztdm === '2' && sjgjsjDm != '010106') {
            col.push(
              //执行失败
              //重新执行和删除
              <span className="dd_grid_icon">
                <Button type="link" onClick={(e) => { Func.zxrw(param, e) }} style={{ marginTop: '2px' }}>重新执行</Button>
              </span>
            );
          } else if (xzztdm === '6') {
            col.push(
              //执行失败
              //重新执行和删除
              <>
                {bgdsjly === '4' && (sjgjsjDm === '010101' || sjgjsjDm === '010201') ?
                  <span className="dd_grid_icon">
                    <Button type="link" onClick={(e) => { Func.handleFpsqdTzreload(param) }} style={{ marginTop: '2px' }}>继续执行</Button>
                  </span> :
                  <span className="dd_grid_icon">
                    <Button type="link" onClick={(e) => { Func.zxrw(param, e) }} style={{ marginTop: '2px' }}>继续执行</Button>
                  </span>}
              </>
            );
          } else if (bgdsjly !== '6' && bgdsjly !== '4' && xzztdm === '3') {
            //下载成功无数据
            col.push(
              <span className="dd_grid_icon">
                <Button type="link" onClick={(e) => { Func.zxrw(param, e) }} style={{ marginTop: '2px' }}>重新执行</Button>
              </span>
            );
          } else if (xzztdm === '4') {
            //待下载
            col.push(
              <span className="dd_grid_icon">
                <Button type="link" onClick={(e) => { Func.zxrw(param, e) }} style={{ marginTop: '2px' }}>开始执行</Button>
              </span>
            )
          } else if (xzztdm === '5') {
            //下载中断 继续执行
            col.push(
              <span className="dd_grid_icon">
                <Button type="link" onClick={(e) => { Func.zxrw(param, e) }} style={{ marginTop: '2px' }}>继续执行</Button>
              </span>
            )
          } else if (xzztdm === '8') {
            // 已取消
            if (sjgjsjDm !== '010106') {
              col.push(
                <span className="dd_grid_icon">
                  <Button type="link" onClick={(e) => { Func.zxrw(param, e) }} style={{ marginTop: '2px' }}>重新执行</Button>
                </span>
              );
            }
          } else if (xzztdm === '9' && bgdsjly === '4' && (sjgjsjDm === '010101' || sjgjsjDm === '010201')) {
            // 已取消
            col.push(
              <span className="dd_grid_icon">
                <Button type="link" onClick={(e) => { Func.handleGptreload(param, e) }} style={{ marginTop: '2px' }}>刷新</Button>
              </span>
            );
          }
        }
      } else {
        if (sjgjsjDm === '050000') {
          if (xzztdm == '1') {
            col.push(
              <span className="dd_grid_icon">
                <Button type="link" onClick={(e) => { Func.dcsjxz(param) }} style={{ marginTop: '2px' }}>文件下载</Button>
              </span>
            );
          }
        } else if (xzztdm == '1' || xzztdm == '2' || xzztdm == '3') { // 未处理
        } else {
          if (ywflDm === '004' && rt?.fkdrbz === 'Y') {
            col.push(
              <span className="dd_grid_icon">
                <Button type="link" onClick={(e) => { Func.fpReload(param) }} style={{ marginTop: '2px' }}>刷新</Button>
              </span>
            );
          } else {
            col.push(
              <span className="dd_grid_icon">
                <Button type="link" onClick={() => { Func.handleFpsqdTzreload(param) }} style={{ marginTop: '2px' }}>刷新</Button>
              </span>
            );
          }
        }
      }
      if ((sjgjsjDm === '020004' || sjgjsjDm === '010106' || sjgjsjDm === '030603' || ((bgdsjly === '4' || bgdsjly === '6' || xzztdm == '9') && (sjgjsjDm === '010101' || sjgjsjDm === '010201'))) && zrwts > 0) {
        if (col.length > 0) {
          col.push(
            <span className="dd_grid_icon">
              <Divider type='vertical' />
              <Button type="link" onClick={(e) => { Func.handleCkmx(param, e) }} style={{ marginTop: '2px' }}>明细查看</Button>
            </span>
          )
        } else {
          col.push(
            <span className="dd_grid_icon">
              <Button type="link" onClick={(e) => { Func.handleCkmx(param, e) }} style={{ marginTop: '2px' }}>明细查看</Button>
            </span>
          )
        }
      }
      // 新增江苏RPA发票下载逻辑
      if (rt?.zxkpfwlxDm == '2' && (ywflDm == '003' || ywflDm == '006')) {
        col = [];
        if (xzztdm == '0') {
          if (sjgjsjDm === '020001' || sjgjsjDm === '020101') {
            // 执行中
            col.push(
              <>
                <span className="dd_grid_icon">
                  <Button type="link" onClick={(e) => { Func.fpReload(param) }} style={{ marginTop: '2px' }}>刷新</Button>
                </span>
                <span className="dd_grid_icon">
                  <Divider type='vertical' />
                  <Button type="link" onClick={(e) => { Func.handleCkmx(param, e) }} style={{ marginTop: '2px' }}>明细查看</Button>
                </span>
                <span className="dd_grid_icon">
                  <Divider type='vertical' />
                  <Button type="link" onClick={(e) => { Func.qxzxJshst(param, e) }} style={{ marginTop: '2px' }}>取消执行</Button>
                </span>
              </>
            );
          } else {
            // 执行中
            col.push(
              <>
                <span className="dd_grid_icon">
                  <Button type="link" onClick={(e) => { Func.fpReload(param) }} style={{ marginTop: '2px' }}>刷新</Button>
                </span>
                <span className="dd_grid_icon">
                  <Divider type='vertical' />
                  <Button type="link" onClick={(e) => { Func.handleCkmx(param, e) }} style={{ marginTop: '2px' }}>明细查看</Button>
                </span>
              </>
            );
          }
        }
        else if (xzztdm == '1' || xzztdm == '2' || xzztdm == '3') {
          if ((sjgjsjDm === '020001' || sjgjsjDm === '020101') && (xzztdm == '1' || xzztdm == '3')) {
            col.push(
              <>
                <span className="dd_grid_icon">
                  <Button type="link" onClick={(e) => { Func.handleCkmx(param, e) }} style={{ marginTop: '2px' }}>明细查看</Button>
                </span>
              </>
            );
          } else {
            // 执行完成  执行失败  执行成功无数据
            col.push(
              <>
                <span className="dd_grid_icon">
                  <Button type="link" onClick={(e) => { Func.kszx(param, e) }} style={{ marginTop: '2px' }}>重新执行</Button>
                </span>
                <span className="dd_grid_icon">
                  <Divider type='vertical' />
                  <Button type="link" onClick={(e) => { Func.handleCkmx(param, e) }} style={{ marginTop: '2px' }}>明细查看</Button>
                </span>
              </>
            );
          }
        }
        else if (xzztdm == '4') {
          // 待执行
          col.push(
            <>
              <span className="dd_grid_icon">
                <Divider type='vertical' />
                <Button type="link" onClick={(e) => { Func.kszx(param, e) }} style={{ marginTop: '2px' }}>开始执行</Button>
              </span>
              <span className="dd_grid_icon">
                <Divider type='vertical' />
                <Button type="link" onClick={(e) => { Func.handleCkmx(param, e) }} style={{ marginTop: '2px' }}>明细查看</Button>
              </span>
            </>
          );
        } else if (xzztdm == '9') {
          // 取消中
          col.push(
            <>
              <span className="dd_grid_icon">
                <Button type="link" onClick={(e) => { Func.fpReload(param) }} style={{ marginTop: '2px' }}>刷新</Button>
              </span>
              <span className="dd_grid_icon">
                <Divider type='vertical' />
                <Button type="link" onClick={(e) => { Func.handleCkmx(param, e) }} style={{ marginTop: '2px' }}>明细查看</Button>
              </span>
            </>
          );
        } else if (xzztdm == '8') {
          // 取消执行
          col.push(
            <>
              <span className="dd_grid_icon">
                <Button type="link" onClick={(e) => { Func.handleCkmx(param, e) }} style={{ marginTop: '2px' }}>明细查看</Button>
              </span>
            </>
          );
        }
      }

    } else {
      if (ywflDm === '001' && (rt?.bgdsjlyDm === '4' || rt?.bgdsjlyDm === '6') && (sjgjsjDm === '010101' || sjgjsjDm === '010201') && zrwts > 0) {
        col.push(
          <span className="dd_grid_icon">
            <Button type="link" onClick={(e) => { Func.handleCkmx(param, e) }} style={{ marginTop: '2px' }}>明细查看</Button>
          </span>
        )
      }
      if (ywflDm === '001' && rt?.bgdsjlyDm === '6' && sjgjsjDm === '040000' && zrwts > 0) {
        col.push(
          <span className="dd_grid_icon">
            <Button type="link" onClick={(e) => { Func.handleCkmx(param, e) }} style={{ marginTop: '2px' }}>明细查看</Button>
          </span>
        )
      }
    }

    return col;
  },
  // 进度查询 -- 执行状态
  renderJljghxSjxzJdcxZxzt: (param: any) => {
    let col: any = <></>;
    if (param.text === '1') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" /><span className='zxzt-text'>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_XZZT:01')}</span>
        </span>
      );
    } else if (param.text === '0') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="processing" /><span className='zxzt-text'>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_XZZT:01')}</span>
        </span>
      );
    } else if (param.text === '2') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="error" /><span className='zxzt-text'>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_XZZT:01')}</span>
        </span>
      );
    } else if (param.text === '3') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" /><span className='zxzt-text'>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_XZZT:01')}</span>
        </span>
      )
    } else if (param.text === '4') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="processing" /><span className='zxzt-text'>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_XZZT:01')}</span>
        </span>
      )
    } else if (param.text === '5') {
      col = (
        <span className="dd_grid_icon">
          <Badge color={"orange"} /><span className='zxzt-text'>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_XZZT:01')}</span>
        </span>
      )
    } else if (param.text === '6') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="warning" /><span className='zxzt-text'>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_XZZT:01')}</span>
        </span>
      )
    } else if (param.text === '7') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="processing" /><span className='zxzt-text'>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_XZZT:01')}</span>
        </span>
      )
    } else if (param.text === '8') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="default" /><span className='zxzt-text'>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_XZZT:01')}</span>
        </span>
      )
    } else {
      col = (
        <span className="dd_grid_icon">
          <Badge status="default" /><span className='zxzt-text'>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_XZZT:01')}</span>
        </span>
      )
    }
    return col;
  },
  rendersyzt: (param: any) => {
    let col: any = <></>;
    const rt = param?.record;
    if (rt.kakuuid) {
      if (rt.sdbz == 'Y') {
        col = (
          <span className="dd_grid_icon">
            <Tooltip placement="topLeft" title={'已锁定'}><Badge status="error" />{'已锁定'}</Tooltip>
          </span>
        )
      } else {
        if (rt.mmycbz == 'Y') {
          col = (
            <span className="dd_grid_icon">
              <Tooltip placement="topLeft" title={'警告（最近一次密码错误）'}><Badge status="warning" />{'警告（最近一次密码错误）'}</Tooltip>
            </span>
          )
        } else {
          col = (
            <span className="dd_grid_icon">
              <Tooltip placement="topLeft" title={'可使用'}><Badge status="success" />{'可使用'}</Tooltip>
            </span>
          )
        }
      }
    }
    return col;
  },
  renderJdcxRwzxqk: (param: any) => {
    let text = param.text;
    if (text != null && text != '') {
      const mh = new RegExp("：", "g");
      const fh = new RegExp("；", "g");
      const dh = new RegExp("、", "g");
      const doh = new RegExp("，", "g");
      text = text.replace(mh, '：{br}');
      text = text.replace(fh, '；{br}');
      text = text.replace(doh, "，{br}");
      text = text.replace(dh, "，{br}");
      const arr: any = text.split('{br}');
      const tooltips: any = [];
      arr?.forEach((tip: any, index1: number) => {
        if (tip != '' || index1 < arr.length - 1) {
          tooltips.push(tip);
          if (index1 !== arr.length) {
            tooltips.push(<br key={index1.toString()} />);
          }
        }
      });
      return <Tooltip placement="topLeft" title={tooltips}>{param.text}</Tooltip>;
    } else {
      return '';
    }
  },
  renderXztj: (param: any) => {
    const ywflDm = param?.record?.ywflDm;
    const sjgjsjDm = param?.record?.sjgjsjDm;
    const xztj = param?.record?.xztj;
    // 发票数据
    if (ywflDm == '003' || ywflDm == '006') {
      let text = '';
      // 增值税发票下载、销项发票下载
      if (sjgjsjDm === '020001' || sjgjsjDm === '020101') {
        const csz1 = param?.record?.csz1;
        const csz2 = param?.record?.csz2;
        text = '开票日期:' + csz1 + '至' + csz2;
        const srcs = param?.record?.srcs;
        if (srcs) {
          // const fplxs = JSON.parse(srcs)?.fplxs;
          // const fplxsTxt = fplxs? fplxs.join('，'): '';
          let fplxs: string[] | undefined;
          try {
            const parsedSrcs = JSON.parse(srcs);
            fplxs = parsedSrcs?.fplxs;
          } catch (error) {
            fplxs = undefined;
          }
          const fplxsTxt = Array.isArray(fplxs) && fplxs.length > 0 ? fplxs.join('，') : '';
          text = text + '；发票种类:' + fplxsTxt.replace('ZZSZYFP', '增值税专用发票').replace('ZZSPTFP', '增值税普通发票');
        } else {
          text = text + '；发票种类:增值税专用发票'
        }
      }
      // 进项数电版式文件、销项板式文件
      if (sjgjsjDm === '020011' || sjgjsjDm === '020111') {
        const srcs = param?.record?.srcs;
        if (srcs) {
          const srcsObj = JSON.parse(srcs);
          const xztjlx = srcsObj?.xztjlx;
          if (xztjlx === '1') {
            text = xztj;
          } else {
            var arr = new Array();
            const kprqQ = srcsObj?.kprqQ;
            const kprqZ = srcsObj?.kprqZ;
            if (kprqQ && kprqZ) {
              arr.push('开票日期:' + kprqQ + '至' + kprqZ);
            }
            const jhpzh = srcsObj?.jhpzh;
            if (jhpzh) {
              arr.push('发票号码:' + jhpzh);
            }
            const xhfnsrsbh = srcsObj?.xhfnsrsbh;
            if (xhfnsrsbh) {
              arr.push('供应商税号:' + xhfnsrsbh);
            }
            if (cktsUtil.menu.getMenuObjByPath('/02/0210') || cktsUtil.menu.getMenuObjByPath('/02/0212')) {
              // const fplxs = JSON.parse(srcs)?.fplxs;
              // const fplxsTxt = fplxs.join('，');
              let fplxs: string[] | undefined;
              try {
                const parsedSrcs = JSON.parse(srcs);
                fplxs = parsedSrcs?.fplxs;
              } catch (error) {
                fplxs = undefined;
              }
              const fplxsTxt = Array.isArray(fplxs) && fplxs.length > 0 ? fplxs.join('，') : '';
              arr.push('发票种类:' + fplxsTxt.replace('ZZSZYFP', '增值税专用发票').replace('ZZSPTFP', '增值税普通发票'));
            }
            if (arr.length > 0) {
              text = arr.join('；');
            }
          }
        }
      }
      // 发票用途更新
      if (sjgjsjDm === '020003') {
        const srcs = param?.record?.srcs;
        if (srcs) {
          const srcsObj = JSON.parse(srcs);
          const xztjlx = srcsObj?.xztjlx;
          if (xztjlx === '1') {
            text = '开票日期:' + srcsObj?.kprqQ + '至' + srcsObj?.kprqZ;
            if (srcsObj?.rzxfzzszyfpbz === 'N') {
              text = text + '仅未认证'
            }
          } else {
            text = '发票号码:' + srcsObj?.jhpzh;
          }
        }
      }
      if (!text) {
        text = xztj;
      }
      return <Tooltip placement="topLeft" title={text}>{text}</Tooltip>;
    }
    return <Tooltip placement="topLeft" title={xztj}>{xztj}</Tooltip>;
  },
  renderJdczNew: (param: any) => {
    const ywflDm = param?.record?.ywflDm;
    const sjgjsjDm = param?.record?.sjgjsjDm;
    const xzztDm = param?.record?.xzztDm;
    const bgdsjly = param?.record?.bgdsjlyDm ? param?.record?.bgdsjlyDm : cktsUtil.sys.bgdsjlyType();
    if ((ywflDm == '003' || ywflDm == '006')) {
      // 发票用途更新、进项板式文件、销项板式文件
      if (sjgjsjDm === '020003' || sjgjsjDm === '020011' || sjgjsjDm==='020111') {
        let col: any = [];
        // 待执行
        if (xzztDm === '4') {
          col.push(
            <>
              <span className="dd_grid_icon">
                <Divider type='vertical' />
                <Button type="link" onClick={(e) => { Func.kszx(param, e) }} style={{ marginTop: '2px' }}>开始执行</Button>
              </span>
              <span className="dd_grid_icon">
                <Divider type='vertical' />
                <Button type="link" onClick={(e) => { Func.handleCkmx(param, e) }} style={{ marginTop: '2px' }}>明细查看</Button>
              </span>
            </>
          );
        } else if (xzztDm === '0') {
          // 执行中
          col.push(
            <>
              <span className="dd_grid_icon">
                <Button type="link" onClick={(e) => { Func.fpReload(param) }} style={{ marginTop: '2px' }}>刷新</Button>
              </span>
              <span className="dd_grid_icon">
                <Divider type='vertical' />
                <Button type="link" onClick={(e) => { Func.handleCkmx(param, e) }} style={{ marginTop: '2px' }}>明细查看</Button>
              </span>
            </>
          );
        } else if (xzztDm === '2') {
          // 执行失败
          col.push(
            <>
              <span className="dd_grid_icon">
                <Button type="link" onClick={(e) => { Func.kszx(param, e) }} style={{ marginTop: '2px' }}>重新执行</Button>
              </span>
              <span className="dd_grid_icon">
                <Divider type='vertical' />
                <Button type="link" onClick={(e) => { Func.handleCkmx(param, e) }} style={{ marginTop: '2px' }}>明细查看</Button>
              </span>
            </>
          );
        } else {
          col.push(
            <>
              <span className="dd_grid_icon">
                <Button type="link" onClick={(e) => { Func.handleCkmx(param, e) }} style={{ marginTop: '2px' }}>明细查看</Button>
              </span>
            </>
          );
        }
        return col;
      }
    } else if (bgdsjly === '3' && ('010101' === sjgjsjDm || '010201' == sjgjsjDm)) { // LT客户端工具 进出口报关单下载任务
      let col: any = [];
      // 自动生成标志
      const zdscbz = param?.record?.zdscbz;
      //判断执行状态
      const xzztdm = param?.record?.xzztDm;
      // 0	执行中
      // 1	执行完成
      // 2	执行失败
      // 3	执行成功无数据
      // 4	待执行
      // 5	执行中断
      // 6	暂停执行
      // 7	待下载
      // 8	取消执行
      // 9	取消中
      if (xzztdm == '0') {
        if (zdscbz != 'Y') {
          col.push(
            <>
            <span className="dd_grid_icon">
              <Button type="link" onClick={() => {Func.qxzx(param)}} style={{marginTop: '2px'}}>取消执行</Button>
            </span>
            </>
          );
        }
        col.push(
          <>
            <span className="dd_grid_icon">
              {col.length > 0 ? <><Divider type='vertical'/></> : <></>}
              <Button type="link" onClick={(e) => {Func.handleGptreload(param, e)}} style={{marginTop: '2px'}}>刷新</Button>
            </span>
          </>
        );
      } else if (zdscbz != 'Y' && xzztdm == '2') {
        col.push(
          <>
            <Button type="link" onClick={(e) => { Func.zxrw(param, e)}} style={{marginTop: '2px'}}>重新执行</Button>
          </>
        );
      }
      col.push(
        <>
          <span className="dd_grid_icon">
            {col.length > 0 ? <><Divider type='vertical'/></> : <></>}
            <Button type="link" onClick={(e) => {Func.handleCkmx(param, e)}} style={{marginTop: '2px'}}>明细查看</Button>
          </span>
        </>
      );
      return col;
    } else if (param?.record?.zdscbz == 'Y' && '040000' === sjgjsjDm && param?.record?.xzztDm == '0') {
      let col: any = [];
      col.push(
        <>
            <span className="dd_grid_icon">
              <Divider type='vertical'/>
              <Button type="link" onClick={(e) => {Func.handleGptreload(param, e)}} style={{marginTop: '2px'}}>刷新</Button>
            </span>
        </>
      );
      return col;
    } else if ('010112' === sjgjsjDm) {
      let col: any = [];
      if (param?.record?.xzztDm == '1' && param?.record?.wdzbgdfs > 0) {
        col.push(
          <>
            <span className="dd_grid_icon">
              <Button type="link" onClick={(e) => {Func.handleBgddzqsjcCkxq(param, e)}} style={{marginTop: '2px'}}>明细查看</Button>
            </span>
          </>
        );
      }
      return col;
    }
    return Func.columnsRender.renderJdcz(param);
  }
}

// 按钮显隐-刷新
Func.displayReload = (record: any) => {
  // if (record.xzztDm == '1' || record.xzztDm == '2' || record.xzztDm == '3') { // 未处理
  //   return true;
  // }
  return false;
}




Func.fpReload = (param: any) => {
  const { refUnit } = param;
  refUnit?.current?.reload2();
}

Func.dcsjxz = (param: any) => {
  const wjm = param?.record?.wjm;
  const wjlj = param?.record?.wjlj;
  myUtil.file.downloadFileByPath(wjlj, wjm);
}


// 海关数据下载-刷新
Func.handleGptreload = async (param: any, e: any) => {
  e.stopPropagation();
  const { refUnit, index } = param;
  const params = {
    zrwuuid: param?.record?.zrwuuid,
    xzztDm: param?.record?.xzztDm,
  };
  refUnit.current!.setMasker(true);
  await rwsxForGpt(params).then(async (response: any) => {
    const { code, desc, msg } = response;
    refUnit.current!.setMasker(false);
    if (code === '200') {
      message.success('操作成功');
      refUnit?.current?.reload2();
      // const num = index + 2;
      // const elemsBadge:any = document.querySelectorAll('.ant-table-tbody .ant-table-row:nth-child('+ num +') .ant-table-cell:nth-child(7) .ant-badge-status-dot');
      // const elems:any = document.querySelectorAll('.ant-table-tbody .ant-table-row:nth-child('+ num +') .ant-table-cell:nth-child(7) .zxzt-text');
      // elemsBadge[0].classList.remove('ant-badge-status-warning');
      // elemsBadge[0].classList.add('ant-badge-status-processing');
      // elems[0].innerText = '接收中';
    } else if (code === '900') {
      message.error(msg);
    } else if (code === '901') {
      refUnit?.current?.reload2();
    } else {
      message.error(desc);
      return;
    }
  })
}

Func.handleFpsqdTzreload = async (param: any) => {
  const { refUnit } = param;
  const params = {
    xzdyuuid: param?.record?.xzdyuuid,
    sjgjsjDm: param?.record?.sjgjsjDm,
    zrwuuid: param?.record?.zrwuuid,
    csz1: param?.record?.csz1,
    csz2: param?.record?.csz2,
  };
  refUnit.current!.setMasker(true);
  await rwjdsx(params).then(async (response: any) => {
    const { code, body, desc } = response;
    if (code === '200') {
      refUnit?.current?.reload2();
      refUnit.current!.setMasker(false);
    } else {
      refUnit.current!.setMasker(false);
      message.error(desc);
      return;
    }
  })
}

Func.zyzx = async (param: any) => {
  const { record, refUnit } = param;
  DDAlert.open({
    title: '提示信息',
    info: '确定暂停执行？',
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: true,
    content: '',
    isFormContent: false,
    okCallbackFn: async function () {
      const result = await queryKakPassword({});
      if (result?.code == '200') {
        const obj = await khdgjUtil.khdZtzx({ yhjq: result.body.yhjq });
        if (obj.code === '200') {
          const params = {
            csz1: "Q",
            csz2: "任务暂停执行",
            xzdyuuid: record.xzdyuuid,
          }
          refUnit.current!.setMasker(true);
          await rwycgx(params).then(async (res) => {
            refUnit.current!.setMasker(false);
            if (res.code === '200') {
              message.success('操作成功!')
              refUnit?.current?.reload2();
            } else {
              message.error(res.msg);
            }
          })
        } else {
          message.info(obj.msg)
        }
      } else {
        message.info(result?.msg);
      }
    }
  })
}

// 取消执行
Func.qxzx = async (param: any) => {
  const { record, refUnit } = param;
  DDAlert.open({
    title: '提示信息',
    info: '确定取消执行？',
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: true,
    content: '',
    isFormContent: false,
    okCallbackFn: async function () {
      if ('6' === record?.bgdsjlyDm) {
        await qxzxForYbt({ zrwuuid: record?.zrwuuid }).then(async (res) => {
          refUnit.current!.setMasker(false);
          if (res.code === '200') {
            message.success('操作成功!');
            refUnit?.current?.reload2();
          } else if (res.code === '901') {
            refUnit?.current?.reload2();
          } else {
            message.error(res.msg);
          }
        })
      } else if ('3' === record?.bgdsjlyDm) {
        const result = await cxzirwForLtkhdgjqxzx({zrwuuid:record?.zrwuuid});
        if(result?.code == '200'){
          const obj = await khdgjUtil.khdZtzx(result.body);
          if(obj.code === '200'){
            refUnit.current!.setMasker(true);
            await qxzxForLtkhdgj({zrwuuid: record?.zrwuuid, taskIds: result?.body.taskIds}).then(async (res) => {
              refUnit.current!.setMasker(false);
              if(res.code === '200') {
                message.success('操作成功!')
                refUnit?.current?.reload2();
              } else {
                message.error(res.msg);
              }
            })
          } else {
            message.info(obj.msg)
          }
        } else {
          message.info(result?.msg);
        }
      } else {
        const result = await queryKakPassword({});
        if (result?.code == '200') {
          // 新的加接口
          // body 获取 CX_SJGL_HGSJXZ_ZIRW_QUERY
          const paramQ = {
            key: 'CX_SJGL_HGSJXZ_ZIRW_QUERY',
            page: 1,
            pageSize: 9999,
            searchModel: [
              { property: "zrwuuid", value: record.xzdyuuid, op: "zdy" }
            ]
          }
          refUnit.current!.setMasker(true);
          const resultQ = await queryPager(paramQ);
          refUnit.current!.setMasker(false);
          if (resultQ?.code == '200') {
            const bodyRows = resultQ?.body?.rows || [];
            if (bodyRows || bodyRows.length > 0) {
              let rwuuid1s = '';
              bodyRows.forEach((item: any) => {
                rwuuid1s += item.rwuuid1 + ','
              });
              rwuuid1s = rwuuid1s?.substring(0, rwuuid1s.length - 1);
              const obj = await khdgjUtil.khdQxzx({ yhjq: result.body.yhjq, body: { opSeqNo: rwuuid1s } });
              if (obj.code === '200') {
                if (obj?.body?.Code === '0' || obj?.body?.Code === '1') {
                  const params = {
                    zrwuuid: record.xzdyuuid,
                  }
                  // 新加接口
                  refUnit.current!.setMasker(true);
                  await qxzxForGpt(params).then(async (res) => {
                    refUnit.current!.setMasker(false);
                    if (res.code === '200') {
                      message.success('操作成功!')
                      refUnit?.current?.reload2();
                    } else {
                      message.error(res.msg);
                    }
                  })
                } else {
                  message.info(obj?.body?.Message)
                }
              } else {
                message.info(obj.msg)
              }
            }
          } else {
            message.error(resultQ?.msg);
          }
        } else {
          message.info(result?.msg);
        }
      }
    }
  })
}

// 更新报关单信息状态刷新
Func.handleJ4RpaSx = async (param: any) => {
  const { record, refUnit } = param;
  const params = {
    sjgjsjDm: record?.sjgjsjDm,
    zrwuuid: record?.zrwuuid
  }
  refUnit.current!.setMasker(true);
  await gxBgdCzbzSx(params).then(async (response: any) => {
    refUnit.current!.setMasker(false);
    const { code, msg } = response;
    if (code === '200') {
      refUnit?.current?.reload2();
    } else {
      message.error(msg);
      return;
    }
  })
}

// 报关单核对任务 取消执行
Func.gdhdrwqxzx = async (param: any) => {
  const { record, refUnit } = param;
  const params = {
    zrwuuid: record?.zrwuuid
  }
  refUnit.current!.setMasker(true);
  await gdhdrwqxzxcheck(params).then(async (response: any) => {
    const { code, msg, body } = response;
    if (code === '200') {
      const gjqxzx = await khdgjUtil.gdhdrwqxzx(body);
      if (gjqxzx['code'] == '200' || (gjqxzx['code'] == '300' && gjqxzx['msg'] == '没有正在执行的任务')) {
        await gdhdrwqxzx(body).then(async (qxzxRes: any) => {
          refUnit.current!.setMasker(false);
          const { code, msg } = qxzxRes;
          if (code === '200') {
            refUnit.current!.setMasker(false);
            refUnit?.current?.reload2();
          } else {
            refUnit.current!.setMasker(false);
            message.error(msg);
          }
        })
      } else {
        refUnit.current!.setMasker(false);
        message.error(gjqxzx['msg']);
      }
    } else if (code === '901') {
      refUnit.current!.setMasker(false);
      refUnit?.current?.reload2();
    } else {
      refUnit.current!.setMasker(false);
      message.error(msg);
    }
  })
}

Func.qxzxJshst = (param: any, e: any) => {
  const { gridRef, record } = param;
  // refUnit.current!.setMasker(true);
  DDAlert.open({
    title: '提示信息',
    info: '确定取消执行？',
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: false,
    content: '',
    isFormContent: false,
    okCallbackFn: async function (thisObj: any) {
      thisObj.setState({ masker: true });
      const obj = {
        zrwuuid : record.zrwuuid
      };
      qxzxJshst(obj).then((res: any) => {
        thisObj.setState({ masker: false });
        if (res.code == '200') {
          message.success('取消执行成功');
          DDAlert.close();
          gridRef.current?.reload();
        } else {
          message.error(res.desc);
          DDAlert.close();
        }
      });
    }
  });
}

export default Func;

