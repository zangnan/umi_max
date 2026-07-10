import { Upload, message, Form, Radio, Button, Tooltip, Popover } from 'antd';
import DDAlert from '@/pages/hts/components/DDAlert';
import { qrkptj, scjc, xsfpzcx, fpsqdmxcx, fpsqdqrkp, queryDjbh, drmbkjSc, fpsqdsjdr, importTemplate, qrkpjy, kpddxz, ddtjkp, commonDrwtdc, skxxcx } from '@/pages/hts/services/htsApi';
import { ClockCircleOutlined, InboxOutlined, WarningOutlined } from '@ant-design/icons';
import myUtil, { intl as intl2 } from '@/components/DDAssist/util';
import React from 'react';
import { history } from 'umi';
import './style.less';
import importStyle from './importStyle.less';

const { Dragger } = Upload;

const drmbkjFunc: any = {
  // 加载时蒙板使用
  refUnit: React.createRef(),
};

const beforeUpload = (file: any) => {
  if (!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
    message.info('上传文件必须是Excel文件。');
    return Upload.LIST_IGNORE;
  } else {
    return false;
  }
}

// 导入Excel模板
drmbkjFunc.excelImport = (param: any) => {
  const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01')
  const tempCode = temp[0];

  const { refUnit, otherRef } = param;
  DDAlert.open({
    title: '导入Excel文件',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    width: 720,
    initFormContentValues: { drgz: 1 },
    button: [
      <Button key={'excelmbxz'} onClick={() => drmbkjFunc.downloadExcel('CKFP_FPKJ_DRMBKJ_EXCEL')}>Excel模板下载</Button>,
    ],
    content: <>
      <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="导入Excel文件" name="file" valuePropName="fileList" rules={[{ required: true, message: '请选择上传的文件' }]} getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
        <Dragger
          maxCount={1}
          showUploadList={true}
          beforeUpload={beforeUpload}
          itemRender={(originNode, file, currFileList, actions: { download: any, preview: any, remove: any }) => (
            <table className={importStyle.importTable}>
              <tr>
                <th>文件名</th>
                <th>文件大小</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
              <tr>
                <td width='45%' className={importStyle.textCenter}>
                  <Tooltip title={file.name}>
                    <div className={importStyle.textName}>{file.name}</div>
                  </Tooltip>
                </td>
                <td width="20%" className={importStyle.textCenter}>{myUtil.text.formatNum(file.size ? (file.size / 1024) : 0, '0,0')}KB</td>
                <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined />&nbsp;待上传</td>
                <td width="17%" className={importStyle.textCenter}><a onClick={() => actions.remove()}>删除</a></td>
              </tr>
            </table>
          )}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到此区域</p>
        </Dragger>
      </Form.Item>
      <Form.Item name="drgz" wrapperCol={{ offset: 8, span: 16 }} rules={[{ required: true, message: '请选择导入规则' }]}>
        <Radio.Group >
          <Radio key={'1'} value={1}>追加</Radio>
          <Radio key={'2'} value={2}>清空原有数据</Radio>
        </Radio.Group>
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        thisObj.setState({ masker: true });
        const formData = new FormData();
        formData.append('drgz', values.drgz);
        formData.append('file', values.file[0].originFileObj);
        fpsqdsjdr(formData).then((response) => {
          const { code, body, desc } = response;
          DDAlert.close();
          if (code === '200') {
            message.success('导入成功！');
            refUnit.current!.reload();
          } else if (code === '900') {
            otherRef[0].current!.showModal(body, 'ZXSB_SB_DRMBKJ');
          } else {
            message.error(desc);
          }
        }).catch(() => {
          message.error('导入失败，请重新上传文件。');
        }).finally(() => {
          thisObj.setState({ masker: false });
        });
      });
    },
  });
}


// 下载excel模板
drmbkjFunc.downloadExcel = (param: string) => {
  importTemplate({ key: param }).then((response) => {
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  })
}

// 确认开票（导出开票）
drmbkjFunc.qrkp_dc = (param: any) => {
  const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
 
  const { selectionRowKeys, refUnit, selectionRows, unit_key, gridRef } = param;
  const zbuuids: any = [];
  const djbhs: any = [];
  if (selectionRowKeys && selectionRowKeys.length > 0) {
    selectionRows.forEach((row: any) => {
      zbuuids.push(row.zbuuid);
      djbhs.push(row.djbh);
    });
  }
  const gridData = refUnit.current?.getGridData()
  const searchModel = refUnit.current?.getGridParams().searchModel || [];
  const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
  const allSearchModel: any = searchModel.concat(headerSearchModel);
  if (gridData.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  const obj = {
    zbuuids,
    djbhs,
    key: unit_key,
    cxtj: allSearchModel,
    flag: '02'
  }
  // 先调用 2.1.7导入模板开具-开票统计
  const kptj = {
    cxtj: myUtil.format.toZdy(allSearchModel),
    zbuuids,
    djbhs,
  }
  refUnit.current!.setMasker(true);
  qrkptj(kptj).then((res1: any) => {
    refUnit.current!.setMasker(false);
    if (res1.code != '200') {
      message.info(res1.msg);
      return;
    }
    DDAlert.open({
      title: '确认开票数据',
      info: '确定继续确认开票吗？',
      modalType: 'confirm',
      okText: '确认',
      content: [
        '单据号' + res1.body.fpsqdzs + '张',
        '金额合计' + myUtil.text.formatNum(res1.body.kpje, '0,0.00') + '元',
        '税额合计' + myUtil.text.formatNum(res1.body.sehj, '0,0.00') + '元'
      ],
      okCallbackFn: function () {
        //继续调用业务接口（原接口）
        refUnit.current!.setMasker(true);
        fpsqdqrkp(obj).then((response) => {
          refUnit.current!.setMasker(false);
          if (res1.code != '200') {
            message.success('确认开票成功！');
            return;
          }
          if(temp[0].fpzlDm1 == '5'){
            history.push('/hts/ckfpkj/ckfpkj/sdpkj');
          }else{
            history.push('/hts/ckfpkj/ckfpkj/skpkj');
          }
          
        });
      }
    });
  });
}


// 上传检查（在线开票）
drmbkjFunc.qrkp_zx = async (param: any) => {
  const { selectionRowKeys, refUnit, selectionRows, unit_key, gridRef } = param;
  const zbuuids: any = [];
  const djbhs: any = [];
  if (selectionRowKeys && selectionRowKeys.length > 0) {
    selectionRows.forEach((row: any) => {
      zbuuids.push(row.zbuuid);
      djbhs.push(row.djbh);
    });
  }
  const gridData = refUnit.current?.getGridData()
  const searchModel = refUnit.current?.getGridParams().searchModel || [];
  const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
  const allSearchModel: any = searchModel.concat(headerSearchModel);
  if (gridData.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  const obj = {
    zbuuids,
    djbhs,
    key: unit_key,
    cxtj: allSearchModel,
    flag: '02'
  }
  //基础校验
  zxjpjy(obj, refUnit);
}

//在线开票校验
const zxjpjy = (param: any, refUnit: any) => {
  // 校验
  refUnit.current!.setMasker(true);
  qrkpjy(param).then((res: any) => {
    refUnit.current!.setMasker(false);
    const { code, msg, desc } = res;
    if (code == '200') {
      //如果是数电票，检验
      Promise.all([myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ:01')]).then(() => {
      }).catch(() => {
        message.error('获取码表失败');
      }).finally(async () => {
        const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01')
        if (temp[0].fpkjfsDm === '2' && temp[0].fpzlDm1 === '5') {
          //数电票校验 
          sjpjy(refUnit,param);
        }else{
          const kptj = {
            cxtj: myUtil.format.toZdy(param.cxtj),
            zbuuids:param.zbuuids,
            djbhs:param.djbhs,
          }
          refUnit.current!.setMasker(true);
          qrkptj(kptj).then((res1: any) => {
            refUnit.current!.setMasker(false);
            if (res1.code != '200') {
              message.info(res1.msg);
              return;
            }
            DDAlert.open({
              title: '确认上传审核',
              info: '确认审核吗？',
              modalType: 'confirm',
              infoType:'warning',
              okText: '确认',
              content: [
                '单据号' + res1.body.fpsqdzs + '张',
                '金额合计' + myUtil.text.formatNum(res1.body.kpje, '0,0.00') + '元',
                '税额合计' + myUtil.text.formatNum(res1.body.sehj, '0,0.00') + '元'
              ],
              okCallbackFn: function () {
                kptj.flag = "02";
                //调用上传检查
                refUnit.current!.setMasker(true);
                scjc(kptj).then((res: any) => {
                  refUnit.current!.setMasker(false);
                  if (res.code != '200') {
                    message.error(res.msg);
                  } else {
                    message.success('审核申请成功！');
                    refUnit.current!.reload();
                  }
                });
              }
            });
          });
        }
      });
    } else if (code == '900') {
      refUnit.current!.setMasker(false);
      const cwxx = msg?.jyxx?.cwxx;
      const dm = msg?.jyxx?.dm;
      DDAlert.open({
        title: '确认开票',
        info: cwxx,
        infoType: 'warning',
        modalType: 'confirm',
        okText: '去配置',
        content: [],
        okCallbackFn: function () {
          if (dm === '01') {
            history.push({ pathname: '/hts/pzgl/fppzgl', query: { xh: '1' } });
          } else if (dm === '02') {
            history.push({ pathname: '/hts/pzgl/fppzgl', query: { xh: '3' } });
          } else if (dm === '03') {
            history.push({ pathname: '/hts/pzgl/fppzgl', query: { xh: '4' } });
          }
        }
      });
    } else {
      refUnit.current!.setMasker(false);
      message.error(desc);
    }
  });
}


//数电票校验
const sjpjy =  (refUnit: any,obj :any) => {
  refUnit.current!.setMasker(true);
  //  skxxcx().then((res1: any) => {
    refUnit.current!.setMasker(false);
    // if (res1.code === '200') {
      // const zcbz = res1.body.zcbz;
      // if (zcbz === '2') {
        // 先调用 2.1.7导入模板开具-开票统计
        const kptj = {
          cxtj: myUtil.format.toZdy(obj.cxtj),
          zbuuids:obj.zbuuids,
          djbhs:obj.djbhs,
        }
        refUnit.current!.setMasker(true);
        qrkptj(kptj).then((res1: any) => {
          refUnit.current!.setMasker(false);
          if (res1.code != '200') {
            message.info(res1.msg);
            return;
          }
          DDAlert.open({
            title: '确认审核',
            info: '确认继续审核吗？',
            modalType: 'confirm',
            okText: '确认',
            content: [
              '单据号' + res1.body.fpsqdzs + '张',
              '金额合计' + myUtil.text.formatNum(res1.body.kpje, '0,0.00') + '元',
              '税额合计' + myUtil.text.formatNum(res1.body.sehj, '0,0.00') + '元'
            ],
            okCallbackFn: function () {
              kptj.flag = "02";
              //调用上传检查
              refUnit.current!.setMasker(true);
              scjc(kptj).then((res: any) => {
                refUnit.current!.setMasker(false);
                if (res.code != '200') {
                  message.error(res.msg);
                } else {
                  refUnit.current!.reload();
                  message.success('审核申请成功！');
                }
              });
            }
          });
        });
      // } else {
      //   message.info('数电票在线开票注册审核中，请明天再试。')
      // }
    // } else {
    //   message.error(res1.desc);
    // }
  // });
}








// 手动采集开具
drmbkjFunc.sdcjkj = (param: any) => {
  const { otherRef, refUnit } = param;
  refUnit.current!.setMasker(true);
  xsfpzcx({}).then((response) => {
    const { code, body } = response;
    if (code === '200') {
      const temp = { xhfnsrmc: body.xsfNsrmc, xhfnsrsbh: body.shxydm, xhfdzdh: body.dz + body.dhhm, skr: body.skr, fhrxm: body.fhr1, kpr: body.kpr }
      // 账户信息配置
      const zhpzList = body.xsfzhpzVoList.filter((item: any) => item.qybz === 'Y');
      const fpsqdxx = Object.assign(temp, { xhfkhhjzh: zhpzList[0]?.yhzhmc + zhpzList[0]?.yhzh });
      queryDjbh({}).then((response) => {
        const { code, body } = response;
        refUnit.current!.setMasker(false);
        if (code === '200') {
          otherRef[1].current!.setDjh(body);
          otherRef[1].current!.showModal({ fpsqdxx, hw: [{ uuid: myUtil.text.uuid(32) }] }, false, refUnit);
        }
      })
    }
  })
}

// 根据单据号打开详情
drmbkjFunc.openFp = (djh: any, param: any) => {
  const { refUnit, record } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  refUnit.current!.setMasker(true);
  fpsqdmxcx({ zbuuid: record.zbuuid }).then((response) => {
    const { code, body } = response;
    refUnit.current!.setMasker(false);
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
      otherRef[1].current!.showModal({ fpsqdxx: body.fpsqdxx, hw, sbyy1: record?.sbyy1 }, true, refUnit);
      otherRef[1].current!.setDjh(djh);
    }
  })
}

// 删除
drmbkjFunc.deleteFpsqd = (param: any) => {
  const { selectionRows, refUnit } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    DDAlert.open({
      title: '系统提示',
      info: '确定要删除选择的数据吗？',
      infoType: 'question',
      modalType: 'confirm',
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        const zbuuids: any = [];
        selectionRows.forEach((row: any) => {
          zbuuids.push(row.zbuuid)
        });
        drmbkjSc({ zbuuids }).then((response) => {
          DDAlert.close();
          const { code, desc } = response;
          if (code === '200') {
            message.success(intl2.formatMessage({ id: 'message_delete_success' }));
            refUnit.current!.reload();
          } else {
            message.error(desc);
          }
        })
      },
    });
  }
}

// 列表自定义渲染
drmbkjFunc.columnsRender = {
  // 导入模板开具数据类型
  renderSjlx: (param: any) => {
    let reVal = '';
    if (param.text === '1') {
      reVal = '人工采集';
    } else if (param.text === '2') {
      reVal = '外部导入';
    }
    return reVal;
  },
  // 单据号
  renderDjh: (param: any) => {
    const { record } = param;
    const sbyy1 = record?.sbyy1;
    const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
    return (
      <>
        <Button type="link" onClick={(event: any) => { event.stopPropagation(); drmbkjFunc.openFp(param.text, param) }}>
          {param.text}
        </Button>
        {sbyy1 && temp[0]?.fpkjfsDm === '2' ? <Tooltip title={sbyy1}> <span style={{ marginLeft: '5px' }}>
          <WarningOutlined style={{ color: '#ef8724', cursor: "pointer" }} />
        </span></Tooltip> : <></>}
      </>
    );
  },

  renderDrmbkjBgdh: (param: any) => {
    const text = param?.text?.split(',');
    const array: any = [];
    text?.forEach((element: any) => {
      array.push(<div key={element}>{element}</div>)
    });
    return <Popover key={param.record.zbuuid} placement="left" content={array} title="报关单号">{param.text}</Popover>;
  }
}

// 修改
drmbkjFunc.gxDrmbkj = (param: any) => {
  const { selectionRowKeys, refUnit, selectionRows } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  const record = selectionRows[0];
  const otherRef = refUnit.current?.getOtherRefs();
  fpsqdmxcx({ zbuuid: record.zbuuid }).then((response) => {
    const { code, body } = response;
    refUnit.current!.setMasker(false);
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
      otherRef[1].current!.showModal({ fpsqdxx: body.fpsqdxx, hw, sbyy1: record?.sbyy1 }, false, refUnit, '4');
      otherRef[1].current!.setDjh(record.djbh);
    }
  })
}

export default drmbkjFunc;
