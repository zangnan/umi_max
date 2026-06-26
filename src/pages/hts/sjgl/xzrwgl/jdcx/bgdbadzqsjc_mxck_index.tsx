import unitConfig from './config';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import Func from './f';
import React, { useRef } from 'react';
import { useIntl } from 'umi';
import IcList from '@/pages/hts/pzgl/icCard/common/icCardTsList';
import IcListGpt from '@/pages/hts/pzgl/icCard/common/icCardTsListGpt';
import IcListYbt from '@/pages/hts/pzgl/icCard/common/icCardTsListYbt';
import { queryKakPassword, checkDlt2, gxBgdCzbzCxzx, queryPager } from '@/pages/hts/services/htsApi';
import khdgjUtil from '@/pages/hts/ckfp/khdgjUtil';
import { message, Button } from 'antd';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import cktsUtil from '@/pages/hts/cktsUtil';
import { useAccess } from 'umi';
import qxUtil from '@/pages/hts/common/qxUtil';
import myUtil from '@/components/DDAssist/util';
import XzMoadl from './modal_index'
import JcbgMoadl from './gdhdjcbg_index'
import TabSfyz from '../../../pzgl/sdppzgl/djdlpz/tab_sfyz';
import { request, useLocation } from 'umi';
import qs from 'qs';
import BgdbadzqsjcMxckMoadl from './bgdbadzqsjc_mxck_index'

const Jdcx: React.FC<unknown> = () => {
  Func.intl = useIntl();
  const refICList: any = useRef(); // 环境检测
  const refICListGpt: any = useRef(); // 环境检测
  const refICListYbt: any = useRef(); // YBT 环境检测
  const access = useAccess();
  const refXz: any = useRef(); // 环境检测
  const refFpxz: any = useRef(); //
  const jcbbXz: any = useRef();
  const refBgdbadzqsjcMxckRef: any = useRef(); // 环境检测

  const bgdsjly = cktsUtil.sys.bgdsjlyType();

  Func.zxrw = async (param: any, e: any) => {
    const { unitRef, record, gridRef } = param;
    const sjgjsjDm = record?.sjgjsjDm;
    const xzztDm = record?.xzztDm;
    const bgdsjlyDm = record?.bgdsjlyDm ? record?.bgdsjlyDm : bgdsjly;
    e.stopPropagation();
    if ((bgdsjlyDm === '3' || bgdsjlyDm === '4' || bgdsjlyDm === '6') && record.dxzts == 0 && (sjgjsjDm === '010101' || sjgjsjDm === '010201') && xzztDm != '1' && xzztDm != '3') {
      message.success('操作成功');
      gridRef.current?.reload();
    } else if (bgdsjlyDm === '6' && record.dxzts > 0 && (sjgjsjDm === '010101' || sjgjsjDm === '010201')) {
      const curShowModalYbt = refICListYbt.current!.showModal;
      unitRef.current!.setMasker(true);
      const result = await queryKakPassword({ uuid: param.record.kakuuid });
      const { code, msg, body } = result;
      unitRef.current!.setMasker(false);
      if (code === '200') {
        const param2 = {};
        param2['taskId'] = param.record.xzdyuuid;
        param2['yhjq'] = body?.yhjq;
        const zrwuuid = record.zrwuuid;
        curShowModalYbt('', param.record.kakuuid, zrwuuid, param);
      } else {
        message.error(msg);
        return;
      }
    } else if (sjgjsjDm === '030603') {
      // 更新报关单信息状态
      const param = { zrwuuid: record.zrwuuid };
      unitRef.current!.setMasker(true);
      gxBgdCzbzCxzx(param).then(async (res: any) => {
        unitRef.current!.setMasker(false);
        const { msg, code } = res;
        if (code === '200') {
          gridRef.current?.reload();
        } else {
          message.error(msg);
          return;
        }
      })
    } else {
      unitRef.current!.setMasker(true);
      await khdgjUtil.checkIsExistTaskGy(param.record.kakuuid, bgdsjlyDm).then(async (res: any) => {
        unitRef.current!.setMasker(false);
        if (res == 'Y') {
          message.error('存在正在执行中任务，请稍后重试！');
          return;
        } else if (res == 'E') {
          // message.error('客户端工具连接失败。');
          // return;
          DDAlert.open({
            title: '提示信息',
            info: `客户端工具运行异常，建议尝试以下解决方案：`,
            infoType: 'warning',
            okText: '下载工具',
            closeStatus: false,
            content: <>
              <div style={{ height: '105', lineHeight: '35px' }}>
                <div>（1）若已下载最新版本客户端工具，请运行启动客户端工具；</div>
                <div>（2）若未下载最新版本客户端工具，请下载工具；</div>
                {bgdsjly != '4' ? <div>（3）请确保当前电脑可以登录国际贸易单一窗口</div> : <></>}
              </div>
            </>,
            button: [
              <Button key='close' onClick={() => DDAlert.close()}>关闭</Button>,
              // bgdsjly != '4' ? <Button type="primary" key={'excelmbxz'} onClick={() => downloadDriver()}>下载IC卡客户端控件</Button> : <></>,
            ],
            okCallbackFn: async function (thisObj: any) {
              thisObj.setState({ masker: true });
              const params = {
                accessClientId: 'dditSaas',
                staticFilexx: 'hgickkj.exe',
              }
              // 工具类下载
              await cktsUtil.downloadFileCkts('/yw/bszx/wbsj/bgd/khdgjXzGet/', params);
              thisObj.setState({ masker: false });
            }
          });
        } else {
          const curShowModal = refICList.current!.showModal;
          const curShowModalGpt = refICListGpt.current!.showModal;
          unitRef.current!.setMasker(true);
          const result = await queryKakPassword({ uuid: param.record.kakuuid });
          const { code, body } = result;
          unitRef.current!.setMasker(false);
          if (code === '200') {
            const param2 = {};
            param2['taskId'] = param.record.xzdyuuid;
            param2['yhjq'] = body?.yhjq;
            param2['sjgjsjDm'] = sjgjsjDm;
            const zrwuuid = record.zrwuuid;
            if ('010106' == sjgjsjDm) {
              const obj = {
                page: 1,
                pageSize: 999,
                key: 'CX_SJGL_HGSJXZ_ZIRW_QUERY',
                searchModel: [{
                  property: 'zrwuuid', value: zrwuuid, op: 'zdy'
                }]
              }
              queryPager(obj).then((res) => {
                const { code, body } = res;
                if (code == '200') {
                  const taskIds: any[] = [];
                  if (body.rows && body.rows.length > 0) {
                    body.rows.forEach((item: any) => {
                      taskIds.push(item.rwuuid1);
                    });
                    param2['taskIds'] = taskIds;
                  } else {
                    message.error('未获取到子任务明细');
                    return;
                  }
                } else {
                  message.error('子任务明细查询失败');
                  return;
                }
              });
            } else {
              param2['taskId'] = param.record.xzdyuuid;
            }
            if (bgdsjly === '4' && (sjgjsjDm === '010101' || sjgjsjDm === '010201')) {
              curShowModalGpt('', param.record.kakuuid, zrwuuid, param);
            } else {
              curShowModal('', param.record.kakuuid, param2, param);
            }
          }
        }
      })
    }
  }

  // 下载驱动（在线）
  const downloadDriver = async () => {
    setMasker(true)
    let a = document.createElement('a');//创建一个a标签元素
    a.style.display = 'none';//设置元素不可见
    a.href = 'https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
    document.body.appendChild(a);//加入
    a.click(); //触发点击,下载
    document.body.removeChild(a);//释放
    setMasker(false)
  }

  const saveHjjc = (flag: any) => {
    refICList.current!.closeModal();
  }

  // 数据管理-下载任务管理 不应存在代理证明下载任务、发票下载任务
  const paramSjgl = {
    qxCode: 'sjgl_xzrwgl',
    accessObj: access,
  }

  const myConfig = { ...unitConfig };
  if (qxUtil.getQxz(paramSjgl)) {
    myConfig.grid_columns[5] = {
      title: '任务分类', dataIndex: 'ywflDm', align: 'left', width: 170, codeTable: 'CODE_DM_ZXSB_YWFL:03', filter: {
        type: 'Select',
        codeTable: 'CODE_DM_ZXSB_YWFL:02'
      },
    };
  } else {
    const qylx = cktsUtil.sys.enterpriseType();

    if (qylx === 'SC') {
      myConfig.grid_columns[5] = {
        title: '任务分类', dataIndex: 'ywflDm', align: 'left', width: 170, codeTable: 'CODE_DM_ZXSB_YWFL:03', filter: {
          type: 'Select',
          codeTable: 'CODE_DM_ZXSB_YWFL:01'
        },
      };
    } else {
      myConfig.grid_columns[5] = {
        title: '任务分类', dataIndex: 'ywflDm', align: 'left', width: 170, codeTable: 'CODE_DM_ZXSB_YWFL:03', filter: {
          type: 'Select',
          codeTable: 'CODE_DM_ZXSB_YWFL:03'
        },
      };
    }
  }

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(refXz);
    otherRef.push(refFpxz);
    otherRef.push(jcbbXz);
    otherRef.push(refBgdbadzqsjcMxckRef);
    return otherRef;
  };



  Func.kszx = (param: any, e: any) => {
    const { unitRef, record } = param;
    Func.param = param;
    e.stopPropagation();
    unitRef.current!.setMasker(true);
    let url = `/saas/sjgl/fpsjxz/zxqjy`;
    if (record?.sjgjsjDm == "020011" || record?.sjgjsjDm == "020111") {
      url = `/saas/sjgl/fpsjxz/zxqjySdbswj`;
    }
    if (record?.sjgjsjDm == "020003") {
      url = `/saas/sjgl/fpztgx/zxqjy`;
    }
    // zxqjy({}).then(async (response: any) => {
    request(url, { method: 'POST', data: {} }).then(async (response: any) => {
      unitRef.current!.setMasker(false);
      const { body, code, msg } = response;
      if (code == '200') {
        if (body?.jybz == 'Y') {
          unitRef.current!.setMasker(true);
          await checkDlt2({ jxbz: "Y" }).then(async (res: any) => {
            unitRef.current!.setMasker(false);
            const { code, body, msg } = res;
            if (code == '200') {
              const dl = body?.dlbz == 'Y' ? true : false;
              if (dl) {
                // 如果已登录，
                Func.save2();
              } else {
                // 如果未登录，弹出登录
                logon('3');
              }
            } else {
              message.error(msg);
            }
          });

        } else {
          message.error(body?.jyxx);
        }
      } else {
        message.error(msg);
      }
    });
  }

  Func.save2 = async (param: any) => {
    const { unitRef, record } = Func.param;
    unitRef.current!.setMasker(true);
    let url = `/saas/sjgl/fpsjxz/kszx`;
    if (record?.sjgjsjDm == "020011" || record?.sjgjsjDm == "020111") {
      url = `/saas/sjgl/fpsjxz/kszxSdbswj`;
    }
    if (record?.sjgjsjDm == "020003") {
      url = `/saas/sjgl/fpztgx/kszx`;
    }
    request(url, { method: 'POST', data: { "zrwuuid": record?.zrwuuid, "xzztDm": record?.xzztDm, sjgjsjDm: record?.sjgjsjDm } }).then(async (response: any) => {
      // await kszx({ "zrwuuid": record?.zrwuuid, "xzztDm": record?.xzztDm }).then(async (res: any) => {
      unitRef.current!.setMasker(false);
      const { code, body, msg } = response;
      if (code == '200') {
        unitRef.current!.reload2();
      } else {
        message.error(msg);
      }
    });

  }


  const logon = async (flag: any) => {
    // 用户发起登录
    if (flag == '1' || flag == '3' || flag == '5') {
      refFpxz.current!.showModal(flag);
      return;
    }
  }

  // 新户数据准入-查看详情跳转，默认查询条件
  // 获取URL参数
  const location = useLocation();
  const { tp } = qs.parse(location.search.substring(1)); // 解析query参数
  const { sjzruuid } = qs.parse(location.search.substring(2));
  // 根据tp参数确定查询模型
  const getSearchModel = () => {
    switch(tp) {
      case '1':
        return [
          {
            property: "sjgjsjDm",
            values: ["030604", "030605", "030606", "030607", '030101', '030102'],
            op: "ain"
          },
          {
            property: "sjzruuid",
            value: sjzruuid,
            op: "al",
            type: 1
          },
        ];
      case '2':
        return [
          {
            property: "sjgjsjDm",
            values: ["010101", "020001"],
            op: "ain"
          },
          {
            property: "sjzruuid",
            value1: sjzruuid,
            op: "al",
            type: 1
          },
        ];
      default:
        return [];
    }
  };

  const gridParams: any = {
    initSearchModal: getSearchModel()
  };

  myConfig.gridParams = gridParams;

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <IcList onRef={refICList} saveBtn={saveHjjc} />
    <IcListGpt onRef={refICListGpt} saveBtn={saveHjjc} />
    <IcListYbt onRef={refICListYbt} saveBtn={saveHjjc} />
    <XzMoadl onRef={refXz} />
    <BgdbadzqsjcMxckMoadl onRef={refBgdbadzqsjcMxckRef}/>
    <TabSfyz onRef={refFpxz} getdlFlag={Func.save2} />
    <JcbgMoadl onRef={jcbbXz} />
  </>
};

export default Jdcx;
