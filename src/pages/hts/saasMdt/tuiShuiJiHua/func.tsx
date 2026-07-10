import React from 'react';
import { tuishuijihuaAdd, tuishuijihuaDel, tuishuijihuaAddCheck, exportPager, updateDataTz } from '@/pages/hts/services/htsApi';
import { message, Tooltip, Form, Input, Select, Row, Col } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { intl as intl2 } from '@/components/DDAssist/util';
import myUtil from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/components/DDAlert';
import { history, useRouteData } from 'umi';
// import { constant } from 'lodash';

const tuiShuiJiHuaFunc: any = {
  refUnit: React.createRef(),
};

// 月度-修改
tuiShuiJiHuaFunc.monthModify = async (param: any) => {
  const { selectionRowKeys, refUnit } = param;
  // const selectDataSize = refUnit.current?.getSelectionRows().length;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  const xgObj = refUnit.current?.getSelectionRows()[0];

  param.xgObj = {};
  param.xgObj.tjqDm = xgObj.tjqDm;
  param.xgObj.ytse1 = xgObj.jhytse1;
  param.xgObj.tse = xgObj.jhtse;
  param.xgObj.mdse = xgObj.jhmdse;
  param.xgObj.bz = xgObj.bz;
  tuiShuiJiHuaFunc.monthAdd(param);
};

// 月度-新增
tuiShuiJiHuaFunc.monthAdd = (param: any) => {
  // const { otherRef, refUnit } = param;
  const userInfo = myUtil.sessionStore.getItem('userInfo');
  const qxQys = userInfo?.qxQys[0];
  // if (qxQys?.cktsqylxDm === 'WM') {
  DDAlert.open({
    title: '退税计划登记',
    closeStatus: false,
    isFormContent: true,
    initFormContentValues: param.xgObj ? param.xgObj : {}, //初始化
    infoType: 'form',
    modalType: 'form',
    content: (
      <>
        <Form.Item
          label={
            <Tooltip title="退税申报的自然年月">
              年月
              <QuestionCircleOutlined />
            </Tooltip>
          }
          name="tjqDm"
          rules={[{ required: true, message: '请输入年月，例如202504' }, baseValidator.yyyyMM]}
        >
          <Input placeholder="请输入年月，例如202504" readOnly={param.xgObj ? true : false} />
        </Form.Item>
        <Form.Item
          label="计划退税额（元）"
          name={qxQys?.cktsqylxDm === 'WM' ? 'tse' : "ytse1"}
          rules={[
            baseValidator.numberFloat,
            {
              validator: (_, value) => {
                if (value) {
                  if (value <= 0) {
                    return Promise.reject(new Error('计划退税额必须大于0'));
                  }
                  if (value >  999999999999.99) {
                    return Promise.reject(new Error('计划退税额不能超过999999999999.99'));
                  }
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="请输入计划退税额"></Input>
        </Form.Item>
        {qxQys?.cktsqylxDm === 'WM' ? false : true && <Form.Item
          label="计划免抵额（元）"
          name="mdse"
          rules={[
            baseValidator.numberFloat,
            {
              validator: (_, value) => {
                if (value) {
                  if (value <= 0) {
                    return Promise.reject(new Error('计划免抵额必须大于0'));
                  }
                  if (value > 999999999999.99) {
                    return Promise.reject(new Error('计划免抵额不能超过999999999999.99'));
                  }
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="请输入计划免抵额" />
        </Form.Item>}
        <Form.Item
          label="备注"
          labelCol={{ span: 7 }}
          name="bz"
          rules={[baseValidator.range2({ min: 0, max: 3000 })]}
        >
          <TextArea
            autoSize={{ minRows: 6, maxRows: 14 }}
            placeholder="请输入备注的内容"
            rows={14}
            style={{ width: 300 }}
          />
        </Form.Item>
      </>
    ),
    //#region 回调方法
    okCallbackFn: function () {
      DDAlert.getForms()
        .validateFields()
        .then((values: any) => {
          const param1: any = { ...values, ...param};
          param1.tjqlxDm = '1';
          tuishuijihuaAddCheck(param1).then((res: any) => {
            const { code, msg, body } = res;
            if (code === '200') {
              tuiShuiJiHuaFunc.monthAddFun(param1);
              // refUnit.current!.reload();
            } else if (code === '900') {
              // 弹出提示信息
              DDAlert.open({
                title: '系统消息',
                closeStatus: false,
                isFormContent: true,
                infoType: 'form',
                modalType: 'form',
                content: <><QuestionCircleOutlined /> {msg.msg}</>,
                //#region 回调方法
                okCallbackFn: function () {
                  param1.tbgxbz = msg.tbgxbz;// 设置同步更新标志
                  tuiShuiJiHuaFunc.monthAddFun(param1);
                },
                cancelCallbackFn: function () {
                  DDAlert.close();
                  tuiShuiJiHuaFunc.monthAddFun(param1);
                },
              });
            }
          });
        });
    },
  });
};

tuiShuiJiHuaFunc.monthAddFun = (param: any) => {
  const { otherRef, refUnit } = param;
  tuishuijihuaAdd(param).then((res: any) => {
    const { code, msg, body } = res;
    if (code === '200') {
      DDAlert.close();
      message.success(body);
      refUnit.current!.reload();
    } else if (code === '900') {
      message.error(msg);
    }
  });
}

// 月度、季度、年度-删除
tuiShuiJiHuaFunc.monthDel = (param: any) => {
  const { selectionRowKeys, refUnit } = param;
  // const selectDataSize = refUnit.current?.getSelectionRows().length;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  const delArr = refUnit.current?.getSelectionRows();
  param.delArr = {};
  param.delArr = delArr;

  DDAlert.open({
    info: '确定删除勾选的数据吗？',
    infoType: 'warning',
    modalType: 'confirm',
    okText: '确定',
    closeStatus: false,
    isFormContent: false,
    okCallbackFn: async function (thisObj: any) {
      thisObj.setState({ masker: true });
      tuishuijihuaDel(param).then((res: any) => {
        const { code, msg, body } = res;
        if (code === '200') {
          DDAlert.close();
          message.success(body);
          refUnit.current!.reload();
        } else if (code === '900') {
          message.error(msg);
        }
      }
    ).catch(() => {
        thisObj.setState({ masker: false });
        DDAlert.close();
      }).finally(() => {
        DDAlert.close();
        thisObj.setState({ masker: false });
      });
    }
  });

};

// 季度-修改
tuiShuiJiHuaFunc.seasonModify = async (param: any) => {
  const { selectionRowKeys, refUnit } = param;
  // const selectDataSize = refUnit.current?.getSelectionRows().length;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  const xgObj = refUnit.current?.getSelectionRows()[0];

  param.xgObj = {};
  param.xgObj.tjqDm = xgObj.tjqDm;
  param.xgObj.year = param.xgObj.tjqDm.substring(0, 4);
  param.xgObj.season = param.xgObj.tjqDm.substring(4, 6);
  param.xgObj.ytse1 = xgObj.jhytse1;
  param.xgObj.tse = xgObj.jhtse;
  // param.xgObj.mdse= xgObj.jhmdse;
  param.xgObj.bz = xgObj.bz;
  tuiShuiJiHuaFunc.seasonAdd(param);
};

// 季度-新增
tuiShuiJiHuaFunc.seasonAdd = (param: any) => {
  const { otherRef, refUnit } = param;
  const userInfo = myUtil.sessionStore.getItem('userInfo');
  const qxQys = userInfo?.qxQys[0];
  DDAlert.open({
    title: '退税计划登记',
    closeStatus: false,
    isFormContent: true,
    initFormContentValues: param.xgObj ? param.xgObj : {}, //初始化
    infoType: 'form',
    modalType: 'form',
    content: (
      <>
        <Form.Item label="季度" name="tjqDm" >
          <Row align="middle" gutter={8}>
            {/* 年份输入框 - 宽度100px */}
            <Col>
              <Form.Item
                name="year"
                noStyle
                rules={[{ required: true, message: '请输入年份' }, baseValidator.yyyy]}
              >
                <Input
                  placeholder="年份"
                  style={{ width: '100px' }}
                  readOnly={param.xgObj ? true : false}
                />
              </Form.Item>
            </Col>

            <Col>
              <span></span>
            </Col>

            {/* 季度选择框 - 宽度100px */}
            <Col>
              <Form.Item
                name="season"
                noStyle
                rules={[{ required: true, message: '请选择季度' }]}
                initialValue={'01'}
              >
                <Select
                  placeholder="季度"
                  style={{ width: '100px' }}
                  disabled={param.xgObj ? true : false}
                >
                  <Select.Option value="01">一季度</Select.Option>
                  <Select.Option value="02">二季度</Select.Option>
                  <Select.Option value="03">三季度</Select.Option>
                  <Select.Option value="04">四季度</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label="计划退税额（元）"
          name={qxQys?.cktsqylxDm === 'WM' ? 'tse' : "ytse1"}
          rules={[
            baseValidator.numberFloat,
            {
              validator: (_, value) => {
                if (value) {
                  if (value <= 0) {
                    return Promise.reject(new Error('计划退税额必须大于0'));
                  }
                  if (value > 999999999999.99) {
                    return Promise.reject(new Error('计划退税额不能超过999999999999.99'));
                  }
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="请输入计划退税额"></Input>
        </Form.Item>
        <Form.Item
          label="备注"
          labelCol={{ span: 7 }}
          name="bz"
          rules={[baseValidator.range2({ min: 0, max: 3000 })]}
        >
          <TextArea
            autoSize={{ minRows: 6, maxRows: 14 }}
            placeholder="请输入备注的内容"
            rows={14}
            style={{ width: 300 }}
          />
        </Form.Item>
      </>
    ),
    //#region 回调方法
    okCallbackFn: function () {
      DDAlert.getForms()
        .validateFields()
        .then((values: any) => {
          const param: any = { ...values };
          param.tjqlxDm = '2';
          param.tjqDm = param.year + param.season;
          tuishuijihuaAdd(param).then((res: any) => {
            const { code, msg, body } = res;
            if (code === '200') {
              DDAlert.close();
              message.success(body);
              refUnit.current!.reload();
            } else if (code === '900') {
              message.error(msg);
            }
          });
        });
    },
  });
};

// 年度-修改
tuiShuiJiHuaFunc.yearModify = async (param: any) => {
  const { selectionRowKeys, refUnit } = param;
  // const selectDataSize = refUnit.current?.getSelectionRows().length;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  const xgObj = refUnit.current?.getSelectionRows()[0];

  param.xgObj = {};
  param.xgObj.tjqDm = xgObj.tjqDm;
  param.xgObj.ytse1 = xgObj.jhytse1;
  param.xgObj.tse = xgObj.jhtse;
  param.xgObj.bz = xgObj.bz;
  tuiShuiJiHuaFunc.yearAdd(param);
};

// 年度-新增
tuiShuiJiHuaFunc.yearAdd = (param: any) => {
  const { otherRef, refUnit } = param;
  const userInfo = myUtil.sessionStore.getItem('userInfo');
  const qxQys = userInfo?.qxQys[0];
  DDAlert.open({
    title: '退税计划登记',
    closeStatus: false,
    isFormContent: true,
    initFormContentValues: param.xgObj ? param.xgObj : {}, //初始化
    infoType: 'form',
    modalType: 'form',
    content: (
      <>
        <Form.Item
          label="年度"
          name="tjqDm"
          rules={[{ required: true, message: '请输入年度' }, baseValidator.yyyy]}
        >
          <Input
            placeholder="请输入年度"
            style={{ width: '100px' }}
            readOnly={param.xgObj ? true : false}
          />
        </Form.Item>
        <Form.Item
          label="计划退税额（元）"
          name={qxQys?.cktsqylxDm === 'WM' ? 'tse' : "ytse1"}
          rules={[
            baseValidator.numberFloat,
            {
              validator: (_, value) => {
                if (value) {
                  if (value <= 0) {
                    return Promise.reject(new Error('计划退税额必须大于0'));
                  }
                  if (value > 999999999999.99) {
                    return Promise.reject(new Error('计划退税额不能超过999999999999.99'));
                  }
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="请输入计划退税额"></Input>
        </Form.Item>
        <Form.Item
          label="备注"
          labelCol={{ span: 7 }}
          name="bz"
          rules={[baseValidator.range2({ min: 0, max: 3000 })]}
        >
          <TextArea
            autoSize={{ minRows: 6, maxRows: 14 }}
            placeholder="请输入备注的内容"
            rows={14}
            style={{ width: 300 }}
          />
        </Form.Item>
      </>
    ),
    //#region 回调方法
    okCallbackFn: function () {
      DDAlert.getForms()
        .validateFields()
        .then((values: any) => {
          const param: any = { ...values };
          param.tjqlxDm = '4';
          tuishuijihuaAdd(param).then((res: any) => {
            const { code, msg, body } = res;
            if (code === '200') {
              DDAlert.close();
              message.success(body);
              refUnit.current!.reload();
            } else if (code === '900') {
              message.error(msg);
            }
          });
        });
    },
  });
};

// 季度、年度、日志、导出
tuiShuiJiHuaFunc.seasonDownload = async (param: any) => {
  const { otherRef, selectionRowKeys, refUnit } = param;

  let modalTitle = '将导出当前筛选条件下的所有数据，是否确认';
  if (selectionRowKeys && selectionRowKeys.length > 0) {
    modalTitle = '将导出选中的数据，是否确认';
  }
  const commonValue = refUnit.current?.getGridParams();
  const val = commonValue.searchModel;
  const model: any = [];
  model.push(commonValue.initSearchModal[0]);
  if (val) {
    val.forEach((item: any) => {
      model.push(item);
    });
  }
  if (selectionRowKeys.length > 0) {
    model.push({ property: 'uuids', value: selectionRowKeys, op: 'zdy' });
  }

  let dcKey = '';
  const tjqlxDm = commonValue.initSearchModal[0].value;
  const userInfo = myUtil.sessionStore.getItem('userInfo');
  const qxQys = userInfo?.qxQys[0];
  const fullUrl = window.location.href;
  if (qxQys?.cktsqylxDm === 'WM') {
    if (fullUrl.endsWith('/259902') || fullUrl.endsWith('/269902')) {
      //退税计划日志
      dcKey = 'CX_SAAS_MTS_TUISHUIJIHUA_RZ'; //wm月度
      if (tjqlxDm == '2') {
        dcKey = 'CX_SAAS_MTS_TUISHUIJIHUA_RZ_SEASON';
      }
      if (tjqlxDm == '4') {
        dcKey = 'CX_SAAS_MTS_TUISHUIJIHUA_RZ_YEAR';
      }
    } else {
      // 退税计划
      dcKey = 'CX_SAAS_MTS_TUISHUIJIHUA'; //wm月度
      if (tjqlxDm == '2') {
        dcKey = 'CX_SAAS_MTS_TUISHUIJIHUA_SEASON';
      }
      if (tjqlxDm == '4') {
        dcKey = 'CX_SAAS_MTS_TUISHUIJIHUA_YEAR';
      }
    }
  } else {
    if (fullUrl.endsWith('/259902') || fullUrl.endsWith('/269902')) {
      //退税计划日志
      if (tjqlxDm == '2') {
        dcKey = 'CX_SAAS_MDT_TUISHUIJIHUA_RZ_SEASON';
      }
      if (tjqlxDm == '4') {
        dcKey = 'CX_SAAS_MDT_TUISHUIJIHUA_RZ_YEAR';
      }
    } else {
      if (tjqlxDm == '2') {
        dcKey = 'CX_SAAS_MDT_TUISHUIJIHUA_SEASON';
      }
      if (tjqlxDm == '4') {
        dcKey = 'CX_SAAS_MDT_TUISHUIJIHUA_YEAR';
      }
    }
  }

  const data: any = {
    key: dcKey,
    searchModel: model,
    orderModel: [],
  };
  DDAlert.open({
    info: modalTitle,
    infoType: 'warning',
    modalType: 'confirm',
    okText: '确定',
    closeStatus: false,
    isFormContent: false,
    okCallbackFn: async function (thisObj: any) {
      thisObj.setState({ masker: true });
      exportPager(data).then((response) => {
        const { code, body, desc } = response;
        if (code === '200') {
          const { blob, fileName } = body;
          myUtil.file.downloadExcel(blob, fileName);
        } else {
          message.error(desc);
        }
      }
    ).catch(() => {
        thisObj.setState({ masker: false });
        DDAlert.close();
      }).finally(() => {
        DDAlert.close();
        thisObj.setState({ masker: false });
      });
    }
  });
};


tuiShuiJiHuaFunc.btnGxsj = (param: any) => {
  const { otherRef, refUnit } = param;
  DDAlert.open({
    title: '更新数据',
    closeStatus: false,
    isFormContent: true,
    initFormContentValues: param.xgObj ? param.xgObj : {}, //初始化
    infoType: 'form',
    modalType: 'form',
    content: (
      <>
        <Form.Item
          label="申报年度"
          name="sbnd"
          initialValue={new Date().getFullYear()}
          rules={[{ required: true, message: '请输入年度，例如2025' }, baseValidator.yyyy]}
        >
          <Input placeholder="请输入年度"/>
        </Form.Item>
      </>
    ),
    //#region 回调方法
    okCallbackFn: function () {
      DDAlert.getForms()
        .validateFields()
        .then((values: any) => {
          const param: any = { ...values };
          param.key = 'ZXSB_TZ_RW_ADD51';
          const paramObj: any = {};
          paramObj.tzlxDm = '51';
          // 创建Date对象
          const date1 = new Date(param.sbnd, 0, 1);
          let date2 = new Date(param.sbnd, 11, 31);
          if (param.sbnd == new Date().getFullYear()) {
            date2 = new Date();
          }
          paramObj.csz1=date1.getTime();
          paramObj.csz2=date2.getTime();
          //":1735660800000,"csz2":1755499224150
          const params = [];
          params.push(paramObj);
          param.params = params;

          updateDataTz(param).then((res: any) => {
            const { code, msg, body } = res;
            // if (code === '200') {
            //   DDAlert.close();
            //   message.success(body);
            //   refUnit.current!.reload();
            // } else if (code === '900') {
            //   message.error(msg);
            // }
            if (code === '200') {
              DDAlert.close();
              DDAlert.open({
                title: '更新报表',
                okText: '任务进度查询',
                cancelText: '关闭',
                modalType: 'confirm',
                infoType: 'info',
                info: '报表数据正在更新，可通过报表更新任务查询执行进度。',
                okCallbackFn: function () {
                  const { location } = history;
                  history.push('/hts/sjbb/wm/sjgx');
                  DDAlert.close();
                },
                cancelCallbackFn: function () {
                  DDAlert.close();
                }
              });
            } else {
              message.error(msg);
            }
          });
        });
    },
  });
}
// tuiShuiJiHuaFunc.rzDownload = async (param: any) => {
//   const { otherRef, refUnit } = param;
//   const commonValue = refUnit.current?.getGridParams();
//   const val = commonValue.searchModel;
//   const model: any = [];
//   model.push(commonValue.initSearchModal[0]);
//   if (val) {
//     val.forEach((item: any) => {
//       model.push(item);
//     });
//   }

//   let dcKey = '';
//   const tjqlxDm = commonValue.initSearchModal[0].value;
//   if (tjqlxDm == '2') {
//     dcKey = 'CX_SAAS_MDT_TUISHUIJIHUA_RZ_SEASON';
//   }
//   if (tjqlxDm == '4') {
//     dcKey = 'CX_SAAS_MDT_TUISHUIJIHUA_RZ_YEAR';
//   }
//   const data: any = {
//     key: dcKey,
//     searchModel: model,
//     orderModel: [],
//   };
//   exportPager(data).then((response) => {
//     const { code, body, desc } = response;
//     if (code === '200') {
//       const { blob, fileName } = body;
//       myUtil.file.downloadExcel(blob, fileName);
//     } else {
//       message.error(desc);
//     }
//   });
// };

export default tuiShuiJiHuaFunc;
