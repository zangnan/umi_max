import { getBgdInfoHgck, btssjZts, plxgYfzssl, queryPager, btssjSsjy, btssjSsxx, bgdpdfyl } from '@/pages/hts/services/htsApi';
import { Form, InputNumber, Tooltip, message, Input, Checkbox } from 'antd';
import React from 'react';
import myUtil, { intl as intl2 } from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/components/DDAlert';
import importStyle from './importStyle.less';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import businessValidator from '@/pages/hts/common/field/businessValidator';
import CkbgdFunc from "../../common/CkbgdFunc";

const Func: any = {
  refUnit: React.createRef(),
};

// 关单信息状态标志
Func.columnsRender= {
  renderBgdscmx18bgdh: (param: any) => {
    const ckbgdh = param?.text;
    const html = <a onClick={(e)=>{ e.stopPropagation();Func.openCkbgdh2(param, ckbgdh)}}>{ckbgdh}</a>;
    const html2 = <Tooltip title={ckbgdh}>{html}</Tooltip>;
    return html2;
  },
  // 不退税类型
  renderBtslx: (param: any) => {
    let col: any = <></>;
    if (param.text === 'zs') {
      col = (
        <span>征税</span>
      );
    } else if (param.text === 'ms') {
      col = (
        <span>免税</span>
      );
    } else {
      col = (
        <span>人工设置</span>
      )
    }
    return col;
  },
};

Func.openCkbgdh = (param: any, ckbgd: any) => {
  const {otherRef } = param;
  ckbgd = ckbgd.substring(0, 18);
  getBgdInfoHgck({ckbgdh: ckbgd}).then((res: any) => {
    if (res.code == '200') {
      otherRef[0].current?.showModal(param, ckbgd, res?.body);
    }
  })
};
Func.openCkbgdh2 = (param: any, ckbgd: any) => {
  const { otherRef, record, refUnit} = param;
  refUnit.current!.setMasker(true);
  bgdpdfyl({ uuid: record?.uuid, bgdhgbh: record?.bgdhgbh }).then((res: any) => {
    refUnit.current!.setMasker(false);
    if (res.code == '200') {
      otherRef[0].current?.showModal(res?.body, { uuid: record?.uuid, bgdhgbh: record?.bgdhgbh });
    } else {
      message.error(res.msg);
    }
  })
}

// 批量修改汇率
Func.btnPlXgHl = (param: any) => {
  const { refUnit, selectionRowKeys, otherRef } = param;
  if (selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  const obj2 = {
    searchModel: [
      { property: 'uuids', values: selectionRowKeys, op: 'zdy' },
      { property: 'xgbz', values: 'bts', op: 'zdy' },
    ],
    key: 'WBSJ_CKBGD_PLXGHLABZ_QUERY_PAGER'
  }
  otherRef[1].current?.showModal(refUnit, selectionRowKeys, null, obj2);
};


// 批量修改运费折算数量
Func.yfzsslPlxg = (param: any) => {
  const {refUnit, selectionRowKeys, gridRef} = param;
  const gridData = refUnit.current?.getGridData();
  if (gridData.length === 0) {
    message.info(intl2.formatMessage({id: 'message_common_type_no_griddata'}));
    return;
  }
  const searchModel = refUnit.current?.getGridParams().searchModel || [];
  const headerSearchModel = param.refGrid.current?.getHeaderFilter() || [];
  const allSearchModel: any = searchModel.concat(headerSearchModel);
  allSearchModel.push({property: 'cxlx', value: '8', op: 'zdy'});
  allSearchModel.push({property: 'sfcxZj', value: "Y", op: 'zdy'});
  let uuids: any = [];
  DDAlert.open({
    title: '批量修改',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    content: <>
      <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="运费折算数量（吨）" name="yfzssl" rules={[{required: true, message: '请输入运费折算数量（吨）'}, baseValidator.numberFloat()]}>
        <InputNumber placeholder="请输入运费折算数量（吨）" min={0.00001} max={9999999999.99999} formatter={(value: any, info: any)=>{return inputNumperFormatter(value, info, '0,0.00000')}}></InputNumber>
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if (values) {
          if (selectionRowKeys.length === 0) {
            // 走获取全部uuid的接口
            const obj = {
              page: 1,
              pageSize: 999999,
              key: 'WBSJ_CKBGD_QUERY_PAGE',
              searchModel: allSearchModel,
            }
            queryPager(obj).then((res: any) => {
              const {code, body, msg} = res;
              if (code === '200') {
                uuids = body.rows;
                const obj2 = {
                  uuids,
                  yfzssl: values.yfzssl
                }
                plxgyfzsslApi(obj2, refUnit, thisObj)
              } else {
                message.error(msg)
              }
            })
          } else {
            uuids = selectionRowKeys;
            const obj2 = {
              uuids,
              yfzssl: values.yfzssl
            }
            plxgyfzsslApi(obj2, refUnit, thisObj)
          }
        }
      })
    }
  })
}

const inputNumperFormatter = (value: any, info: any, format: any) => {
  if (info.userTyping) {
    if (info.input) {
      return info.input;
    } else {
      if (value) {
        return value;
      }
      return '';
    }
  } else {
    if (value) {
      return myUtil.text.formatNum(value, format);
    }
    return '';
  }
}

// 批量修改运费折算数量接口
const plxgyfzsslApi = (params: any, refUnit: any, thisObj: any) => {
  thisObj.setState({ masker: true });
  plxgYfzssl(params).then((res: any) => {
    thisObj.setState({ masker: false });
    const {code, msg} = res;
    if (code === '200') {
      message.success(intl2.formatMessage({ id: 'message_common_batchedit_success' }));
      refUnit.current!.reload();
      refUnit.current?.setSelectionRowKeys([]);
      refUnit.current?.setSelectionRows([]);
      DDAlert.close();
    } else {
      message.error(msg)
    }
  })
};

// 转退税
Func.btnZts = (param: any) => {
  const { refUnit, selectionRowKeys } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  DDAlert.open({
    title: '转退税',
    info: '确定将勾选数据进行转退税的操作吗？',
    modalType: 'confirm',
    infoType: 'question',
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      const data = { uuids: selectionRowKeys };
      btssjZts(data).then((response: any) => {
        thisObj.setState({ masker: false });
        const { code, msg } = response;
        if (code === '200') {
          message.success('转退税成功！');
          close();
          refUnit.current!.reload();
        } else if(code === '900') {
          close();
          refUnit.current!.reload();
          const tableData = response.body?.wfztsList;
          const html:any = []
          tableData.forEach((item:any) => {
            html.push(
              <tr>
                <td width='26%' className={importStyle.textCenter}>{item.bgdhgbh}</td>
                <td width="10%" className={importStyle.textCenter}>{item.xh4}</td>
                <td width="20%" className={importStyle.textCenter}>{item.jgfsDm}</td>
                <td width='24%' className={importStyle.textCenter}>
                  <Tooltip title={item.jgfsmc}>
                    <div className={importStyle.textName}>{item.jgfsmc}</div>
                  </Tooltip>
                </td>
                <td width="20%" className={importStyle.textCenter}>{item.hgckspDm}</td>
              </tr>
            )
          });
          DDAlert.open({
            title: '转退税',
            infoType: 'warning',
            modalType: 'form',
            closeStatus: false,
            isFormContent: true,
            width: 800,
            content: <>
                <p>以下报关单的商品退税率为0或监管方式为不退税或退税类型为仅退消费税，无法转退税。</p>
                <p>如因人工误操作将数据转为了不退税，请到“数据管理-海关数据查询-出口货物报关单”中，删除该数据并重新下载或导入。</p>
                <table className={importStyle.importTable}>
                  <tr>
                    <th>报关单号</th>
                    <th>项号</th>
                    <th>监管方式代码</th>
                    <th>监管方式名称</th>
                    <th>海关商品代码</th>
                  </tr>
                  {html}
                </table>
            </>,
            okCallbackFn: function (thisObj: any) {
              DDAlert.close();
            }
          })
        } else {
          message.error(msg);
        }
      })
    }
  })
}

// 转不退税
Func.btnZbts = (param: any) => {
  const {selectionRowKeys, selectionRows} = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({id: 'message_handle_unselected'}));
    return;
  }
  if (selectionRows.some((item: { [x: string]: string; }) => item['btslx'] == 'JTXFS')) {
    message.error('仅退消费税商品不支持修改');
    return;
  }
  CkbgdFunc.btnZbts(param, null, 'btsplxg');
}

// 试算进项税额转出额
Func.btnSsjxseByGdw = (param: any) => {
  const { refUnit, selectionRowKeys, gridRef } = param;
  const gridData = refUnit.current?.getGridData();
  if (gridData.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  let title = '';
  let infoType = 'warning';
  let data = {}
  if (selectionRowKeys.length > 0) {
    data = { uuids: selectionRowKeys };
    title = '确定对勾选数据进行试算进项税额转出额操作吗？';
    infoType = 'warning';
  } else {
    title = '确认对当前筛选条件下所有数据进行试算进项税额转出额操作？';
    infoType = 'question';
    const searchModel: any = [...refUnit?.current?.getGridParams()?.initSearchModal];

    const gridValues = refUnit.current?.getGridParams();
    gridValues.searchModel.forEach((item: any) => {
      searchModel.push(item);
    });
    const headerValues = param.refGrid.current?.getHeaderFilter();
    if (headerValues && headerValues.length > 0) {
      headerValues.forEach((item: any) => {
        searchModel.push(item);
      });
    }
    if (searchModel?.length > 0) {
      searchModel.forEach((item: any) => {
        if (item.value) {
          data[item.property] = item.value
        } else {
          data[item.property] = item.values
        }
      });
    }
  }
  // 创建一个Date对象，表示当前日期和时间
  let now = new Date();
  // 获取当前年份
  let currentYear = now.getFullYear();
  // 获取当前月份并减1（注意：月份是从0开始的）
  let currentMonth = now.getMonth() ;
  // 如果月份已经是0（即1月），那么年份需要减1，月份设置为11（即12月）
  if (currentMonth === 0) {
    currentYear--;
    currentMonth = 12;
  }
  // 如果月份小于10，前面补0
  let monthStr = currentMonth < 10 ? '0' + currentMonth : currentMonth.toString();

  // 拼接结果
  let initSsq = currentYear + '' + monthStr;
  refUnit.current?.setMasker(true);
  btssjSsxx(data).then((resJy: any) => {
    refUnit.current?.setMasker(false);
    if (resJy.code === '200') {
      DDAlert.open({
        title: '试算进项税额转出额',
        infoType: 'warning',
        modalType: 'form',
        closeStatus: false,
        isFormContent: true,
        content: <>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="报关单条数" name="bgdts" initialValue={resJy?.body?.bgdts + '条'}>
            <Input placeholder='报关单条数' disabled={true} />
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="人民币离岸价总额" name="rmblajHj" initialValue={myUtil.grid.formatNum(resJy?.body?.rmblajHj, '0,0.00')}>
            <Input placeholder='人民币离岸价总额' disabled={true} />
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="试算税率" name="sssl" rules={[{ required: true, message: '请输入试算税率' },{ type: 'base_number', range: '+'}]} initialValue={13}>
            <Input placeholder='试算税率'  />
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="试算进项转出所属期" name="ssjxzcssq" rules={[{ required: true, message: '请输入试算进项转出所属期' },businessValidator.ssq03()]} initialValue={initSsq}>
            <Input placeholder='试算进项转出所属期' />
          </Form.Item>
          <Form.Item name="sfcxjs" valuePropName="checked" {...myUtil.layout.formX1.tailLayout} >
            <Checkbox>已试算数据重新试算进项税额转出额</Checkbox>
          </Form.Item>
        </>,
        okCallbackFn: async function (thisObj: any) {
          const val = await DDAlert.getForms().validateFields();
          const sfcxjs = val.sfcxjs ? "Y" : "N";
          thisObj.setState({ masker: true });
          await btssjSsjy({ uuids: resJy?.body.uuids }).then((resJy2: any) => {
            let obj = {};
            thisObj.setState({ masker: false });
            DDAlert.close();
            if (resJy2.code === '200') {
              const otherRef = refUnit.current?.getOtherRefs();
              if (otherRef[3]) {
                 obj = {
                  uuids: resJy?.body?.uuids,
                  bgdts: myUtil.grid.formatNum(resJy?.body?.bgdts, '0,0.00000'),
                  sfcxjs: sfcxjs,
                  sssl: val.sssl,
                  rmblajHj: myUtil.grid.formatNum(resJy?.body?.rmblajHj, '0,0.00'),
                  ssjxzcssq: val.ssjxzcssq,
                }
                otherRef[3].current?.showModal(refUnit, obj);
              }
            } else if (resJy2.code === '900') {
              const otherRef = refUnit.current?.getOtherRefs();
              if (otherRef[2]) {
                const obj2 = {
                  uuids: resJy?.body?.uuids
                }
                obj = {
                  uuids: resJy2?.body?.uuids,
                  bgdts: myUtil.grid.formatNum(resJy?.body?.bgdts, '0,0.00000'),
                  sfcxjs: sfcxjs,
                  sssl: val.sssl,
                  rmblajHj: myUtil.grid.formatNum(resJy?.body?.rmblajHj, '0,0.00'),
                  ssjxzcssq: val.ssjxzcssq,
                }
                otherRef[2].current?.showModal(refUnit, obj2, resJy2?.body,obj);
              }
            } else {
              message.error(resJy2.msg)
            }
          })
        }
      });
    } else {
      message.error(resJy.msg)
    }
  })
}

export default Func;
