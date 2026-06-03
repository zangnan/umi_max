/**
 * title: 外贸企业出口退税出口明细申报表录入 ZXSB_SB_MTS_TSSB_GCB
 * author: wx
 */
import React from 'react';
import myUtil from '@/pages/common/myUtil';
import {
  checkMtsTssbGlh,
  queryBgdByBgdNo21,
  queryDlzmByDlckhwzmhm,
  querySpdmXxCj,
  checkYwlxSpdm,
  bgdtzsx, importTemplate, mtsImportUpdate
} from '@/services/hts/api';
import {Button, Form, message, Tooltip, Upload} from 'antd';
import moment from 'moment';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { history } from 'umi';
import { intl as intl2 } from "@/pages/common/myUtil";
import {queryCjCsh, queryCjGlh} from '@/services/hts/api';
import DDAlert from "@/components/DDAlert";
import importStyle from './importStyle.less';
import {ClockCircleOutlined, InboxOutlined} from "@ant-design/icons";
import tableStyle from './style.less';
const { Dragger } = Upload;

const Func: any = {
  unitRef: React.createRef(),
};

Func.tszbcs =(param: any) =>{
  const {otherRef} = param;
  otherRef[1].current?.showModal(param);
}

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
  // const { form } = param;
  // form.setFieldsValue({
  //   spxxList: [
  //     // {spxxMc: '测试1', spxxSl: 199},
  //     // {spxxMc: '测试2', spxxSl: 299},
  //     {},
  //   ],
  // });
}
// 表单提交前调用
Func.formBeforeSubmit = async (param: any) => {
  const { form } = param;
  const ckbgdh = form?.getFieldValue('ckbgdh'); // 出口报关单号
  const dlzmh = form?.getFieldValue('dlzmh'); // 代理证明号
  // 1.出口报关单号和代理证明号不能同时为空
  if (!ckbgdh && !dlzmh) {
    message.info('出口货物报关单号与代理出口货物证明号不能同时为空，请确认后填报！');
    return false;
  } else if (ckbgdh && dlzmh) {
    message.info('报关单号和代理证明号不需要同时采集，请确认！');
    return false;
  }
  // 2.申报年月与出口日期应在同一年份
  const ssq = form?.getFieldValue('ssq'); // 申报年月
  const ckrq1 = form?.getFieldValue('ckrq1'); // 出口日期
  if (ssq && ckrq1) {
    const tmpSsq = moment(ssq).format('YYYY');
    const tmpCkrq = moment(ckrq1).format('YYYY');
    if (tmpSsq !== tmpCkrq) {
      message.info('申报年月与出口日期非同一年度，请确认！')
      return false;
    }
  }
  // 检查商品码和业务类型匹配，是否为结构物和列名原材料
  let checkFlag = true;
  const ckspDm = form?.getFieldValue('ckspDm');
  const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh'); // 业务类型
  if (ckspDm && cktmsywlxdmjh && cktmsywlxdmjh.length > 0) {
    await checkYwlxSpdm({
      ckspDm: ckspDm,
      ckrq1: moment(ckrq1).format('YYYY-MM-DD'),
      ywlx: form.getFieldValue('cktmsywlxdmjh').join(',')
    }).then((res) => {
      const { code, msg } = res;
        if (code != '200') {
          message.error(msg);
          checkFlag = false;
        }
    });
  }
  return checkFlag;
}

// 表单校验
Func.validator = {
  // 申报批次
  sbpc01: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbpc01(form);
  },
  // 申报批次
  sbpc02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbpc02(form);
  },
  // 申报序号
  sbxh02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbxh02(form);
  },
  // 关联号
  glh01: (form: any) => {
    const uuid = form?.getFieldValue('uuid');
    const ssq = form?.getFieldValue('ssq');
    const sbpc = form?.getFieldValue('sbpc');
    // 请求后端验证所属期是否已申报
    const validator = async (_rule: any, value: any) => {
      const params = {
        uuid: uuid,
        ssq,
        sbpc,
        glh: value,
      }
      if (history.location.pathname.indexOf('SBMXCX') == -1 && history.location.pathname.indexOf('/27/2705') == -1
      && history.location.pathname.indexOf('/26/2605') == -1 && history.location.pathname.indexOf('/25/2505') == -1) {
        await checkMtsTssbGlh(params).then((res) => {
          if (res.code !== '200') {
            return Promise.reject(new Error(res.msg));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
      } else {
        return Promise.resolve();
      }
    };
    return { validator };
  },
  // 出口报关单号
  ckbgdh06: (form: any) => {
    const ckbgdh = form?.getFieldValue('ckbgdh');
    const dlzmh = form?.getFieldValue('dlzmh');
    const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
    // 添加业务类型选择GHQYTS时，报关单号与代理证明号都不能为空。
    const validator = (_rule: any, value: any) => {
      if (cktmsywlxdmjh === 'GHQYTS') {
        if (!ckbgdh || !dlzmh) {
          return Promise.reject(new Error('报关单号与代理证明号都不能为空'));
        }
        return Promise.resolve();
      } else {
        if (ckbgdh && dlzmh) {
          return Promise.reject(new Error('报关单号和代理证明号不需要同时采集，请确认！'));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 代理出口货物证明号
  dlzmh01: (form: any) => {
    const ckbgdh = form?.getFieldValue('ckbgdh');
    const dlzmh = form?.getFieldValue('dlzmh');
    const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
    // 添加业务类型选择GHQYTS时，报关单号与代理证明号都不能为空。
    const validator = (_rule: any, value: any) => {
      if (cktmsywlxdmjh === 'GHQYTS') {
        if (!ckbgdh || !dlzmh) {
          return Promise.reject(new Error('报关单号与代理证明号都不能为空'));
        }
        return Promise.resolve();
      } else {
        if (ckbgdh && dlzmh) {
          return Promise.reject(new Error('报关单号和代理证明号不需要同时采集，请确认！'));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 出口日期
  ckrq101: (form: any) => {
    const ssq = form?.getFieldValue('ssq');
    // 添加业务类型选择GHQYTS时，报关单号与代理证明号都不能为空。
    const validator = (_rule: any, value: any) => {
      if (ssq && ssq.length > 4) {
        let year = ssq.substr(0, 4);
        if (value.length > 4 && value.substr(0, 4) != year) {
          // 与当前年份判断
          return Promise.reject(new Error('非本年申报数据。'));
        }
        return Promise.resolve();
      } else {
        return Promise.reject(new Error('请正确填写申报年月！'));
      }
    };
    return { validator };
  },
  // 出口日期
  ckrq102: (form: any) => {
    // const ssq = form?.getFieldValue('ssq');
    // // 添加业务类型选择GHQYTS时，报关单号与代理证明号都不能为空。
    // const validator = (_rule: any, value: any) => {
    //   if (ssq && ssq.length == 6) {
    //     if (value.substr(5, 2) > ssq.substr(4, 2)) {
    //       // 与当前年份判断
    //       return Promise.reject(new Error('出口日期不应大于申报年月，请确认后填报！'));
    //     }
    //     return Promise.resolve();
    //   }
    // };
    // return { validator };
    const validator = (_rule: any, value: any) => {
      return Promise.resolve();
    };
    return { validator };
  },
  // 退（免）税业务类型
  cktmsywlxdmjh01: (form: any) => {
    const validator = (_rule: any, value: any) => {
      return Promise.resolve();
    };
    return { validator };
  },
  // 国内启运方式
  gnqyfsDm01: (form: any) => {
    return DditCktsFormCommonFunc.validator.gnqyfsDm01(form);
  },
  // 海关总署认证企业类型
  hgzsrzqylxDm01: (form: any) => {
    return DditCktsFormCommonFunc.validator.hgzsrzqylxDm01(form);
  },
  // 备注
  bz01: (form: any) => {
    const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
    // 请求后端验证所属期是否已申报
    const validator =  (_rule: any, value: any) => {
			if (cktmsywlxdmjh) {
				// 当业务代码为 JGW 时 备注字段 应为 必录项
				if (!value) {
					if (cktmsywlxdmjh === 'JGW') {
            return Promise.reject(new Error('业务类型代码包含“JGW”时，备注不能为空！'));
					}
          return Promise.resolve();
				}
        return Promise.resolve();
			}
      return Promise.resolve();
    };
    return { validator };
  },
}
// 表单事件：OnBlur
Func.eventOnBlur = {
  sbpc: (param: any) => {
    // 申报批次自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbpc(param);
  },
  // 申报序号
  sbxh: (param: any) => {
    // 申报序号自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbxh(param);
  },
  // 美元离岸价
  mylaj: (param: any) => {
    DditCktsFormCommonFunc.eventOnBlur.mylaj(param);
  },
  // 出口商品代码
  ckspDm: (param: any) => {
    const { form } = param;
    const ckbgdh = form?.getFieldsValue().ckbgdh
    const dlckhwzmhm = form?.getFieldsValue().dlzmh
    const ssq = form?.getFieldsValue().ssq;
    const sbpc = form?.getFieldsValue().sbpc;
    const ckrq1 = form?.getFieldsValue().ckrq1;
    const ckspDm = form?.getFieldsValue().ckspDm;

      const obj = {
        ckbgdh,
        ckrq1: ckrq1 ? moment(new Date(ckrq1)):'',
        ckspDm:  ckspDm ? ckspDm : '',
        dlckhwzmhm: dlckhwzmhm ? dlckhwzmhm : '',
        sbpc,
        slType: "Y",
        ssq,
      }
      if(ckrq1 && ckspDm){
        querySpdmXxCjFun(obj, form)
      }
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
  // 代理出口货物证明号
  dlzmh: (param: any) => {
    const { form } = param;
    const ckbgdh = form?.getFieldsValue().ckbgdh
    const dlzmh = form?.getFieldsValue().dlzmh;
    if (!ckbgdh && !dlzmh) {
      message.info('出口货物报关单号与代理出口货物证明号不能同时为空，请确认后填报！')
    }
  },
  // 出口商品代码
  ckspDm: (param: any) => {
    const { form } = param;
    const ckrq1 = form?.getFieldsValue().ckrq1
    if (!ckrq1) {
      message.info('出口日期不能为空，请确认！')
    }
  },
  // 申报商品代码
  sbspDm: (param: any) => {
    const { form } = param;
    const ckrq1 = form?.getFieldsValue().ckrq1
    if (!ckrq1) {
      message.info('出口日期不能为空，请确认！')
    }
  },
}
// 表单事件：OnChange
Func.eventOnChange = {
  // 出口报关单号
  ckbgdh: (param: any) => {
    const { form } = param;
    const ckbgdh = form?.getFieldsValue().ckbgdh
    const dlckhwzmhm = form?.getFieldsValue().dlzmh;
    const ssq = form?.getFieldsValue().ssq;
    const sbpc = form?.getFieldsValue().sbpc;
    /*
     * 根据21位报关单号带出关键项数据 (出口日期、
     * 出口商品代码、出口商品名称、第一计量单位代码（法定单位）、
     * 成交数量、成交海关货币数字代码、成交总价、人民币离岸价、美元离岸价);
     */
			if (ckbgdh && ckbgdh.length == 21) { // 报关单不为空时
        queryBgdByBgdNo21({ckbgdh}).then((res: any) => {
          const { body, code, msg } = res;
          if(code === '200') {
            if(res.body){
              form.setFieldsValue({
                ckfph:body.ckfph,
                ckrq1: body.ckrq1 ? moment(new Date(body.ckrq1)) : '',
                cksl: body.cksl ? myUtil.text.getNumVal(myUtil.text.formatNum(body.cksl, '0, 0.0000')) : '',
                mylaj: body.mylaj ? myUtil.text.getNumVal(myUtil.text.formatNum(body.mylaj, '0, 0.00')) : '',
                ckspDm: body.ckspDm,
              });
              const obj = {
                ckbgdh,
                ckrq1: body.ckrq1 ? moment(new Date(body.ckrq1)):'',
                ckspDm:  body.ckspDm ? body.ckspDm : '',
                dlckhwzmhm: dlckhwzmhm ? dlckhwzmhm : '',
                sbpc,
                slType: "Y",
                ssq,
              }
              querySpdmXxCjFun(obj, form)
            }
          } else {
            message.info(msg)
          }
        })
			}
  },
  // 代理出口证明编号
  dlckhwzmhm: (param: any) => {
    const { form } = param;
    const ckbgdh = form?.getFieldsValue().ckbgdh
    const dlckhwzmhm = form?.getFieldsValue().dlzmh
    const ssq = form?.getFieldsValue().ssq;
    const sbpc = form?.getFieldsValue().sbpc;
    /*
     * 根据代理证明编号带出关键项数据 (出口日期、
     * 出口商品代码、出口商品名称、第一计量单位代码（法定单位）、
     * 成交数量、成交海关货币数字代码、成交总价、人民币离岸价、美元离岸价);
     */
			if ((ckbgdh == null || ckbgdh == undefined || ckbgdh == '') && dlckhwzmhm) { // 报关单为空时
        queryDlzmByDlckhwzmhm({dlckhwzmhm}).then((res: any) => {
          const { body, code, msg } = res;
          if(code === '200') {
            if(res.body){
              form.setFieldsValue({
                ckrq1: body.ckrq1 ? moment(new Date(body.ckrq1)) : '',
                cjsl: body.cksl ? myUtil.text.getNumVal(myUtil.text.formatNum(body.cjsl, '0, 0.0000')) : '',
                mylaj: body.mylaj ? myUtil.text.getNumVal(myUtil.text.formatNum(body.mylaj, '0, 0.00')) : '',
                ckspDm: body.ckspDm,
              });
              const obj = {
                ckbgdh,
                ckrq1: body.ckrq1 ? moment(new Date(body.ckrq1)):'',
                ckspDm:  body.ckspDm ? body.ckspDm : '',
                dlckhwzmhm: dlckhwzmhm ? dlckhwzmhm : '',
                sbpc,
                slType: "Y",
                ssq,
              }
              querySpdmXxCjFun(obj, form)
            }
          } else {
            message.info(msg)
          }
        })
			}
  },
  // 所属期
  ssq: (param: any) => {
    DditCktsFormCommonFunc.eventOnChange.ssq(param);
  },
  // 申报批次
  sbpc: (param: any) => {
    const { form } = param;
    const ssq = form?.getFieldsValue().ssq;
    const sbpc = form?.getFieldsValue().sbpc;
    const glh = form?.getFieldsValue().glh;
    if (ssq && sbpc) {
      if (glh) {
        form.setFieldsValue({ glh: ssq + sbpc + glh.substring(glh.length - 8, glh.length) });
      } else {
        form.setFieldsValue({ glh: ssq + sbpc + '00000001' });
      }
    }
  },
  // 申报商品代码
  sbspDm2: (param: any) => {
    DditCktsFormCommonFunc.eventOnChange.sbspDm2(param);
  },
  // 出口日期
  ckrq1: (param: any) => {
    const { form } = param;
    // 通过出口日期，设置美元汇率
    let ckrq1 = form?.getFieldsValue().ckrq1;
    // 通过kprq获取美元汇率
    DditCktsFormCommonFunc.util.getmyhlByLjDate(ckrq1, param);
    // 20200808出口日期改变校验商品码或申报商品码
    // 申报商品代码
    let ckspDm = form?.getFieldsValue().ckspDm;
    let sbspDm = form?.getFieldsValue().sbspDm;
    if (sbspDm) {
      ckspDm = sbspDm;
    }
    let ckbgdh = form?.getFieldsValue().ckbgdh;
    let ssq = form?.getFieldsValue().ssq;
    if (!ssq) {
      return;
    }
    if (!ckspDm) {
      return;
    }
    if(ckrq1 && ckspDm){
      querySpdmXxCj({
        ckspDm: ckspDm,
        ssq: ssq,
        ckrq1: ckrq1,
        slType: 'Y',
        ckbgdh: ckbgdh
      }).then((res: any) => {
        const { body, desc, msg } = res;
        if (res.code == '200') {
          if (sbspDm) {
            // 设置退税率
            form.setFieldsValue({ tsl: body?.tsl ? body?.tsl: '' });
          } else {
            // 设置退税率
            form.setFieldsValue({
              zssl: body?.zssl ? myUtil.text.getNumVal(body?.zssl) : '',
              tsl: body?.tsl ? myUtil.text.getNumVal(body?.tsl) : '',
            });
          }
        } else {
          if (sbspDm) {
            message.error('申报商品代码无效，请确认后填报！');
            form.setFieldsValue({
              sbspDm: '',
              sbspmc: '',
            });
          } else {
            // modify by tjx 20200924
            if (desc != '') {
              if (msg) {
                message.error(msg);
              } else {
                message.error(desc);
              }
            } else {
              message.error('此商品码不存在，请确认后填报！');
            }
            form.setFieldsValue({
              ckspDm: '',
              sbhgspmc: '',
            });
          }
        }
      })
    }

  },

  // 业务类型代码（原tableSelect）
  cktmsywlxdmjh: (param: any) => {
    DditCktsFormCommonFunc.eventOnChange.cktmsywlxdmjh(param);
  }
}

// 改变调整前的商品名称 代码 出口日期 计量单位
const querySpdmXxCjFun = (obj: {}, form: any) => {
  querySpdmXxCj(obj).then((res: any) => {
    const { code, body, msg, desc } = res;
    if (code == '200') {
      form.setFieldsValue({
        ckspDm: body?.ckspDm,
        sbhgspmc: body?.sbspmc,
        hgjldwmc: body?.hgjldwmc,
      });
    } else {
      form.setFieldsValue({
        ckspDm: '',
        sbhgspmc: '',
        hgjldwmc: '',
      });
      message.info(msg || desc);
    }
  })
}

// 配置项：自定义工具栏 关联号重排
Func.glhcp = (param: any) => {
  DditCktsFormCommonFunc.glhcp(param);
}

// 配置项：自定义工具栏 报关单生成明细
Func.bgdscmx = (param: any) => {
  DditCktsFormCommonFunc.bgdscmx(param);
}


// 不予办理转证明采集
Func.byblzzmcj = (param:any) => {
  const { selectionRowKeys, selectionRows, unitRef,otherRef } = param;
  if (selectionRowKeys?.length === 0 || selectionRowKeys?.length === 0) {
    const gridData = unitRef.current?.getGridData();
    if (!gridData || gridData.length <= 0) {
      message.info(intl2.formatMessage({ id: 'message_common_nodata_export' }));
      return;
    }
    const gridParams = unitRef.current?.getGridParams();

    const model: any = [];
    gridParams.searchModel.forEach((item: any, index: number) => {
      model.push(item);
    });
    gridParams.initSearchModal.forEach((item: any, index: number) => {
      model.push(item);
    });
    Func.check(gridData,unitRef,otherRef);
  } else {
    Func.check(selectionRows,unitRef,otherRef);
  }


}

Func.check=(selectionRows:any,unitRef:any,otherRef:any)=>{
  const ckrqNd = myUtil.grid.formatDate(selectionRows[0].ckrq1 , 'YYYY-MM-DD').substr(0,4);
    let i = 0;
    let flag = false;
    selectionRows.forEach((item: any) => {
      if (!myUtil.grid.formatDate(item.ckrq1 , 'YYYY-MM-DD').startsWith(ckrqNd)) {
        i++;
      }
      if (item.byblbz != 'Y') {
        flag = true;
      }
    });
    if (i > 0) {
      // 校验对应报关单的出口日期是否在同一年度
      message.error("选择数据对应的出口日期不在同一年度，请重新选择。");
      return;
    }
    else if (flag) {
      // 校验不为不予办理
      message.error("仅对不予办理的数据支持该操作，请重新选择。");
      return;
    } else {
      queryCjCsh({tableKey: "MTS_ZXSB_SB_MTS_TSSB_G"}).then((response) => {
        const { code, body } = response;
        unitRef.current!.setMasker(false);
        if (code === '200') {
          const obj = {
            sbpc: body.sbpc,
            ssq: body.ssq,
          }
          queryCjGlh(obj).then((res: any)=>{
            if(res.code === '200') {
              const para = body;
              para.glh = res.body.glh
              otherRef[2].current!.showModal(para,selectionRows,"MTS",unitRef);
            }
          })
        }
      })
    }
}

// 台账筛选
Func.importTzsx = async (param: any) => {
  const { unitRef } = param;
  const beforeUpload = (file: any) => {
    const isLt2M = file.size;
    if (isLt2M > 10485760) {
      message.info('上传文件不能超过10M。');
      return Upload.LIST_IGNORE;
    }
    if (!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('请上传Excel文件。');
      return Upload.LIST_IGNORE;
    }
    return false;
  }
  DDAlert.open({
    title: '台账筛选',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    button: [
      <Button key={'excelmbxz'} onClick={() => Func.downloadExcel('SJGL_CKBGD_TZSX_PRINT_REPORT')}>Excel模板下载</Button>,
    ],
    width: 720,
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
      <div style={{ color: "#E51C23" }}>
        <p>导入说明：</p>
        <div style={{ marginLeft: '7px' }}>1. 请上传报关单台账Excel，文件中“报关单号”应为18位；</div>
        <div style={{ marginLeft: '7px' }}>2.  若多次上传，只保留最后一次上传的结果。</div>
      </div>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if (values.file[0].originFileObj) {
          thisObj.setState({ masker: true });
          const formData = new FormData();
          formData.append('file', values.file[0].originFileObj);
          formData.append('fileName', values.file[0].name);
          formData.append('cdDm', '26030101');
          bgdtzsx(formData).then((response: any) => {
            const { code, msg, body } = response;
            if (code === '200') {
              // 台账数据筛选 赋值
              unitRef.current?.addQueryModel("Y", 'tzsxbz');
              if (body?.sbzs != 0) {
                // 业务校验
                const sbyyList = body?.sbmx || [];
                const textAreaValues: any = []
                if (sbyyList.length > 0) {
                  sbyyList.forEach((item: any, index: any) => {
                    textAreaValues.push(
                      <tr>
                        <td width='10%' style={{ textAlign: 'center' }}>{index + 1}</td>
                        <td width='30%'>{item.bgdhgbh}</td>
                        <td width='60%'>
                          <Tooltip title={item.sbyy}>
                            <div className={tableStyle.errorTableText}>{item.sbyy}</div>
                          </Tooltip>
                        </td>
                      </tr>
                    )
                  })
                  DDAlert.open({
                    title: '台账筛选',
                    modalType: 'form',
                    width: 720,
                    closeStatus: false,
                    isFormContent: true,
                    content:
                      <>
                        <div style={{ marginTop: '10px' }}>本次导入台账中共{body?.drzs}张报关单，导入成功{body?.cgzs}张，导入失败{body?.sbzs}张。</div>
                        <table className={tableStyle.errorTable}>
                          <tr style={{ backgroundColor: '#FAFAFA' }}>
                            <th>序号</th>
                            <th>失败报关单号</th>
                            <th>失败原因</th>
                          </tr>
                          {textAreaValues}
                        </table>
                      </>,
                    okCallbackFn: function () {
                      DDAlert.close();
                    },
                  });
                }
              } else {
                message.success(`本次导入台账中共${body?.drzs}张报关单，导入成功${body?.cgzs}张！`);
                DDAlert.close();
              }
            } else {
              message.error(msg);
            }
          }).catch(() => {
            message.error('导入失败，请重新上传文件。');
          }).finally(() => {
            thisObj.setState({ masker: false });
          });
        } else {
          message.info('文件传输失败，请重试！')
        }
      });
    },
  });
}
// 下载excel模板
Func.downloadExcel = (param: string) => {
  importTemplate({ sfBhsj: "N", sfScsm: "N", key: param }).then((response) => {
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  })
}

// 导入修改
Func.importUpdate = async (param: any) => {
  const { unitRef, otherRef } = param;
  const beforeUpload = (file: any) => {
    const isLt2M = file.size;
    if (isLt2M > 10485760) {
      message.info('上传文件不能超过10M。');
      return Upload.LIST_IGNORE;
    }
    if (!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('请上传Excel文件。');
      return Upload.LIST_IGNORE;
    }
    return false;
  }
  DDAlert.open({
    title: '导入修改',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    button: [
      // <Button key={'excelmbxz'} onClick={() => Func.downloadExcel('LTS_TZGL_ZCWLFTZ_DR_TMLT')}>Excel模板下载</Button>,
    ],
    width: 720,
    content: <>
      <Form.Item labelCol={{span: 24}} wrapperCol={{span: 24}} label="导入Excel文件" name="file"
                 valuePropName="fileList" rules={[{required: true, message: '请选择上传的文件'}]}
                 getValueFromEvent={(e: any) => {
                   if (Array.isArray(e)) {
                     return e;
                   }
                   return e && e.fileList;
                 }}>
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
                <td width="20%"
                    className={importStyle.textCenter}>{myUtil.text.formatNum(file.size ? (file.size / 1024) : 0, '0,0')}KB
                </td>
                <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined/>&nbsp;待上传</td>
                <td width="17%" className={importStyle.textCenter}><a onClick={() => actions.remove()}>删除</a></td>
              </tr>
            </table>
          )}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined/>
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到此区域</p>
        </Dragger>
      </Form.Item>
      <div style={{color: "#E51C23"}}>
        <p>导入说明：</p>
        <div style={{marginLeft: '7px'}}>1.不提供导入模板，可直接使用系统导出的模板。</div>
        <div style={{marginLeft: '7px'}}>2.根据相同出口货物报关单号/代理出口货物证明号只更新如下字段：</div>
        <div style={{marginLeft: '7px'}}> 申报年月、申报批次、出口发票号、出口日期、业务类型代码、备注。</div>
        <div style={{marginLeft: '7px'}}>3.修改【申报年月】、【申报批次】时，相同关联号的出口明细和进货明细将会一并修改。</div>
      </div>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if (values.file[0].originFileObj) {
          const formData = new FormData();
          formData.append('file', values.file[0].originFileObj);
          formData.append('fileName', values.file[0].name);
          thisObj.setState({masker: true});
          mtsImportUpdate(formData).then((response: any) => {
            const { code, body, desc } = response;
            thisObj.setState({ masker: false });
            DDAlert.close();
            if (code === '200') {
              message.success(body);
              unitRef.current!.reload2();
            } else if (code === '900') {
              otherRef[3].current!.showModal(body, "MTS_TSSB_IMPORT_UPDATE_DRWTDC");
            } else {
              message.error(desc);
            }
          }).catch(() => {
            message.error('导入失败，请重新上传文件。');
          }).finally(() => {
            thisObj.setState({ masker: false });
          });
        } else {
          message.info('文件传输失败，请重试！')
        }
      });
    },
  });
}

export default Func;
