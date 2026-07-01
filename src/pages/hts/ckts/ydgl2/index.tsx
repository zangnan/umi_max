/**
 * title: 免抵退疑点处理
 */
import React, { useState, useEffect, useContext, useImperativeHandle } from 'react';
import { List, Checkbox, Spin, Button, Form, Space, message, Input, Typography, Row, Col, Badge, Popover, Drawer, Dropdown, Menu, Modal, Table, DatePicker, Tooltip } from 'antd';
import ProCard from '@ant-design/pro-card';
import { changeYdcl, querySpdmXxCj, mxSetzbsb, ydtj, queryYdclList, queryYdclXxList, queryYdxxTzff, queryYdclSpList, scHgsptzGcb, queryYdplclSpList, pageRightYdtj, checkSsqPcYsb, checkSsqYsbCj, checkYdglYsb } from '@/pages/hts/services/htsApi';
import './style.less';
import DDBaseGrid from '@/components/DDBaseGrid';
import DDAlert from '@/pages/hts/components/DDAlert';
import CONSTANTS from '@/components/DDAssist/constants';
import { QuestionCircleOutlined, DownOutlined } from '@ant-design/icons';
import cktsUtil from '@/pages/hts/cktsUtil';
import { useIntl } from 'umi';
import EditModal from './ydclrightContent'
import moment from 'moment';
import { cloneDeep } from 'lodash';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import { intl as intl2 } from '@/components/DDAssist/util';
import myUtil from '@/components/DDAssist/util';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';

export type YdclProps = {
  onRef?: any;
  visible?: any;
  ywKey?: any
}
const Ydcl: React.FC<YdclProps> = ({
  onRef,
  visible = false,
  ywKey
}) => {
  const intl = useIntl();
  const [checkedList, setCheckedList] = React.useState<any>([]); // 选中值
  const [indeterminate, setIndeterminate] = React.useState(false); // 全选状态
  const [checkAll, setCheckAll] = useState(false); // 是否全选
  const [maskerYdcl, setMaskerYdcl] = useState(false);
  const [dataLeft, setDataLeft] = useState<any>([]);
  const [ydclrightList, setydclrightList] = useState<any>([]);
  const [yddmzs, setYdlbSl] = useState('');// 疑点类别
  const [ydzs, setYdzsSl] = useState(1);// 疑点总数量
  const [yclydzs, setYdytzSl] = useState('');// 疑点已调整数量
  const [bktgydzs, setBktgSl] = useState('');// 不可挑过疑点数量
  const [bktgyclydzs, setBktgtzSl] = useState('');//不可挑过疑点已调整数量
  const [mxydzs, setMxydzs] = useState('');// 明细疑点总数
  const [zbsbydzs, setZbsbydzs] = useState('');// 下期申报疑点总数
  const [wtzydzs, setWtzydzs] = useState('');// 未调整疑点总数
  const [ytzydzs, setYtzydzs] = useState('');// 已调整疑点总数
  const [jglydzs, setJglydzs] = useState('');// 提示疑点
  const [formSearch] = Form.useForm();
  const [selectionRowRight, setSelectionRowRight] = useState<any>([]);;   // 右侧列选择
  const [selectionRowKeyRight, setSelectionRowKeyRight] = useState<any>([]);;   // 右侧列选择
  const [collapsed, setCollapsed] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [cs, setCsData] = useState<any>([]); //页面跳转传递的参数包括所属期和申报批次
  const [type, setType] = useState<any>([]); // 传递过来的cytgbz 用于勾选错误类型
  const [leftParams, setLeftParams] = useState<any>({}); // 左侧传参
  const [bModel, showB0022Model] = useState(false); // 显示批量处理列表
  const [maskerYdclB0022, setMaskerYdclB0022] = useState(false); // B0022批量疑点处理页面蒙版
  const [sbnyPc, setSbnyPc] = useState<any>({}); // 申报年月批次
  const [modalData, setModalData] = useState<any>([]); // 批量处理列表传递的数据
  const EditableContext = React.createContext(null);
  const [modalVisibleForm, setModalVisibleForm] = useState<boolean>(false);
  const [rightSearchParam, setRightSearchParam] = useState<any>([]); // 右侧列表筛选条件
  const refModal: any = React.createRef();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  }
  // 页面初始化方法
  useEffect(() => {
    const ydjbDms: any = [];
    if (type === '') {
      ydjbDms.push('E', 'W');
    } else {
      ydjbDms.push(type);
    }
    formSearch.setFieldsValue({
      ydjbDms: ydjbDms,
      ydbh: '',
      ydnr: '',
    });
  }, [cs]);

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 开启
  const showModal = (param: any, param2: any) => {
    const {ywKey, ktgydbz} = param;
    // 展示页面
    setModalVisible(true);
    setCsData(param2);
    setType(ktgydbz);
    const ydtjObj = {
      sjzjuuid: param2?.sjzjuuid,
      ywKey: ywKey
    }
    getYdtj(ydtjObj);
    const ydjbDms: any = [];
    if (ktgydbz === '') {
      ydjbDms.push('E', 'W');
    } else {
      ydjbDms.push(ktgydbz);
    }
    const leftObj = {
      error: ktgydbz === 'E' ? "E" : '',
      sjzjuuid: param2?.sjzjuuid,
      warning: ktgydbz === 'W' ? "W" : '',
      ydbh: "",
      ydjbDms: ydjbDms,
      ydnr: "",
      ywKey: ywKey,
    }
    getYdclleftdata(leftObj, true);
  };

  // 获得疑点条数
  const getYdtj = (ydtjObj: any) => {
    ydtj(ydtjObj).then((res: any)=>{
      const {code, body} = res;
      if(code == '200') {
        setYdlbSl(body.yddmzs);
        setYdzsSl(body.ydzs);
        setYdytzSl(body.yclydzs);
        setBktgSl(body.bktgydzs);
        setBktgtzSl(body.bktgyclydzs);
        setJglydzs(body.jglydzs);
      }
    })
  }

  // 获取疑点处理左半部分表数据
  const getYdclleftdata = (leftObj: any, flag: any) => {
    setMaskerYdcl(true);
    queryYdclList(leftObj).then((response) => {
      setMaskerYdcl(false);
      const { code, body } = response;
      if (code === '200') {
        if(body && body.length > 0) {
          setLeftParams(leftObj);// 如果成功保存左侧列表传参
          setDataLeft([...body]);
          if(flag){
            // 初始,重置加载时，默认加载第一条数据
            setCheckedList([body[0]]);
            const ydbh = body[0].ydbh
            getYdclrightdata([ydbh], leftObj.sjzjuuid, leftObj.ywKey)
          } else {
            const ydbh: any = [];
            const ydbhArry: any = []
            checkedList.forEach((item: any)=>{
              ydbh.push(item.ydbh)
            })
            body.forEach((item: any)=>{
              if(ydbh.indexOf(item.ydbh) > -1){
                ydbhArry.push(item)
              }
            })
            setCheckedList(ydbhArry);
            getYdclrightdata(ydbh, leftObj.sjzjuuid, leftObj.ywKey)
          }
        } else {
          setCheckedList([]);
          setDataLeft([]);
          setydclrightList([]);  // 右侧清空
          setSelectionRowKeyRight([]);
          setSelectionRowRight([]); // 右侧选中状态清空
        }
      }
    });
  };
  // 疑点处理页面最上方调整标识checkbox
  const optionsCwlx = [
    { label: '错误', value: 'E' },
    { label: '警告', value: 'W' },
  ];

  // 设置全选切换
  const onCheckAllChange = (e: any) => {
    if (e.target.checked) {
      const aaa: any = [];
      dataLeft.forEach((item: any) => {
        aaa.push(item);
      });
      setCheckedList(aaa);
      setIndeterminate(true);
      const ydbh: any = [];
      dataLeft.forEach((item: any)=>{
        ydbh.push(item.ydbh)
      })
      // 右侧接口
      getYdclrightdata(ydbh, cs.sjzjuuid, cs.ywKey)
    } else {
      setCheckedList([]);
      setydclrightList([]);  // 右侧清空
      setSelectionRowKeyRight([]);
      setSelectionRowRight([]); // 右侧选中状态清空
      setIndeterminate(false);
      setMxydzs('0');
      setZbsbydzs('0');
      setWtzydzs('0');
      setYtzydzs('0');
    }
    setCheckAll(e.target.checked);
  };

  // Checkbox 选中事件
  const onChangeCheck = (list: any) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < dataLeft.length);
    setCheckAll(list.length === dataLeft.length);
    const ydbh: any = [];
    list.forEach((item: any)=>{
      ydbh.push(item.ydbh)
    })
    // 右侧接口
    getYdclrightdata(ydbh, cs.sjzjuuid, cs.ywKey)
  };

  // 查看疑点产生原因
  const getYyCkxq = (param: any, e: any) => {
    e.stopPropagation();
    const obj = {
			ydbh: param?.ydbh,
			lcswsxDm: cs?.lcswsxDm
    }
		queryYdxxTzff(obj).then((res: any) => {
      const {code, body, desc} = res;
      if(code == '200'){
        const ydcsyy = body.zxsbydtzffStr;
        let array: any = ydcsyy.split('---');
        let tzffHtml: any = [];
        tzffHtml.push(<h2 style={{textAlign: 'center'}}>疑点调整方法</h2>)
        for (let i = 0; i < array.length; i++) {
          if (array[i].indexOf('原因解析') !== -1) {
            tzffHtml.push(<h3 style={{fontWeight: 'bolder'}}>{array[i]}</h3>);
          } else if (array[i].indexOf('处理办法') !== -1) {
            tzffHtml.push(<><br/><br/><h3 style={{fontWeight: 'bolder'}}>{array[i]}</h3></>);
          } else {
            // 大连疑点医生后台新结构-需显示base64图片
            if (array[i].indexOf('data:image/png;base64,') !== -1) {
              tzffHtml.push(<img style={{width: '800px'}} src={array[i]}></img>);
            } else {
              tzffHtml.push(<h3>{array[i]}</h3>);
            }
          }
        }
        if(ydcsyy){
          DDAlert.open({
            title: '疑点调整方法',
            width: 900,
            isFormContent: true,
            content: <>{tzffHtml}</>
          })
        }
      } else if(code == '900') {
        message.info(desc);
      } else {
        message.error(desc);
      }
    })
  }

  // 获取疑点处理右半部数据
  const getYdclrightdata = (ydbhs: any, sjzjuuid: any, ywKey: any) => {
    if(ydbhs.length > 0){
      const obj = {
        page: 1,
        pageSize: 10,
        searchModel: [
          { property: "sjzjuuid",  value: sjzjuuid, op: "al" },
          { property: "ydbhs", value: ydbhs, op: "al" },
          { property: "ywKey", value: ywKey, op: "al" },
        ]
      }
      setRightSearchParam(obj.searchModel);
      setSelectionRowKeyRight([])
      setSelectionRowRight([]); // 右侧选中状态清空
      queryYdclXxList(obj).then((response) => {
        const { code, body } = response;
        const { rows } = body;
        if (code === '200') {
          if(body){
            setydclrightList(rows);
          } else {
            setydclrightList([]);
          }
        }
      })
      const YdtjObj = {
        sjzjuuid ,
        ydbhs ,
        ywKey ,
      }
      pageRightYdtj(YdtjObj).then((res: any) => {
        DDAlert.close();
        const { code, desc, body } = res;
        if (code == '200') {
          setMxydzs(body.mxydzs);
          setZbsbydzs(body.zbsbydzs);
          setWtzydzs(body.wtzydzs);
          setYtzydzs(body.ytzydzs);
        } else {
          message.error(desc);
        }
      })
    } else {
      setydclrightList([]);
      setMxydzs('0');
      setZbsbydzs('0');
      setWtzydzs('0');
      setYtzydzs('0');
    }
  };
  const getNextSsq = (params: any) => {
    const ssq = params.ssq;
    const ywKey = params.ywKey;
    let tmpY = ssq.substring(0, 4);
    let tmpM = ssq.substring(4, 7);
    if (tmpM != '12') {
      const m = Number(tmpM) + 1;
      tmpM = (m < 10 ? '0' + m : m).toString();
      return tmpY + tmpM;
    } else {
      if (ywKey === 'MTS' || ywKey === 'DBTS') {
        return ssq;
      } else {
        tmpY = (Number(tmpY) + 1).toString();
        return tmpY + '01';
      }
    }
  }

  const getNextSbpc = (params: any) => {
    const ssq = params.ssq;
    const sbpc = params.sbpc;
    const tmpM = ssq.substring(4, 7);
    const ywKey = params.ywKey;
    if (tmpM != '12') {
      return '001';
    } else {
      if (ywKey === 'MTS' || ywKey === 'DBTS') {
        const sbpcNew = Number(sbpc) + 1;
        return myUtil.text.leadingZeroize(sbpcNew, 3)
      } else {
        return '001';
      }
    }
  }
  // 申报批次
  const sbpc = (event: any, form: any) => {
    // 申报批次自动补零
    const param = { event, form };
    DditCktsFormCommonFunc.eventOnBlur.sbpc(param);
  }
  // 明细下期申报点击事件
  const setMxzbsb = () => {
    // edit by yangzq 20240625 由致欧提出问题，确认为标准版修正
    // if (!isButton(checkedList, 'next')) {
    //   message.info('该疑点暂不支持设为“下期申报”，如需调整，请将数据撤销到明细数据采集界面处理！');
    //   return;
    // }
    if (checkedList.length == 0 && selectionRowRight.length == 0) {
      message.info(intl.formatMessage({ id: 'message_mdts_sjsb_ydcl_unselected_info' }));
      return;
    }
    confirmXqsb();
  };
  // 明细下期申报页面
  const showConfirmMxzbsb = () => {
    DDAlert.open({
      title: '消息确认',
      info: '确定对勾选数据进行下期申报工作吗？',
      infoType: 'info',
      modalType: 'confirm',
      closeStatus: true,
      okCallbackFn: function (thisObj: any) {
        DDAlert.close();
        confirmXqsb();
      }
    });
  };
  // 明细下期申报确认事件
  const confirmXqsb = () => {
    DDAlert.open({
      title: '下期申报',
      infoType: 'info',
      closeStatus: false,
      isFormContent: true,
      modalType: 'form',
      content: <>
        <Form.Item name="ssq" label="申报年月" initialValue={getNextSsq(cs)} rules={[{ required: true, message: '请输入6位申报年月'},
            () => ({
              validator(_, value) {
                if (value) {
                  const temp1 = (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)); // YYYYMM
                  if (temp1) {
                    return Promise.reject(new Error('请输入正确的格式'));
                  }
                  if (value.length > 4 && (cs.ywKey === 'MTS' || cs.ywKey === 'DBTS' ) && cs.ssq.substring(0, 4) != value.substring(0, 4) ) {
                    return Promise.reject(new Error('申报年月与出口日期非同一年度'));
                  }
                  return Promise.resolve();
                }
                return Promise.resolve();
              },
            }),
            (form: any) => ({
              async validator(_, value) {
                if (value) {
                  const ssq = DDAlert.getForms()?.getFieldValue('ssq');
                  const sbpc = DDAlert.getForms()?.getFieldValue('sbpc');
                  let apiParam = {};
                  if (cktsUtil.moduleType(ywKey, 'SBPC')) {
                    apiParam = { ssq, sbpc, ywKey };
                  } else {
                    apiParam = { ssq, ywKey };
                  }
                  await checkYdglYsb(apiParam).then((response) => {
                    if (response.code !== '200') {
                      return Promise.reject(new Error(response.msg));
                    }
                    return Promise.resolve();
                  }).catch((err) => {
                    return Promise.reject(err);
                  });
                }
                return Promise.resolve();
              },
            })
          ]}>
          <Input placeholder="请输入申报年月" ></Input>
        </Form.Item>
        {cktsUtil.moduleType(ywKey, 'SBPC') ? <Form.Item name="sbpc" label="申报批次" initialValue={getNextSbpc(cs)}  rules={[{ required: true, message: '请输入3位申报批次' },
          () => ({
            validator(_, value) {
              if (value) {
                if (!value.match(/^\d+$/)) {
                  return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_number' })));
                }
              }
            return Promise.resolve();
          }}),
          (form: any) => ({
            async validator(_, value) {
              if (value) {
                const ssq = DDAlert.getForms()?.getFieldValue('ssq');
                const sbpc = DDAlert.getForms()?.getFieldValue('sbpc');
                const apiParam: any = { ssq, sbpc, ywKey };
                await checkYdglYsb(apiParam).then((response) => {
                  if (response.code !== '200') {
                    return Promise.reject(new Error(response.msg));
                  }
                  return Promise.resolve();
                }).catch((err) => {
                  return Promise.reject(err);
                });
              }
              return Promise.resolve();
            },
          })
        ]}>
          <Input placeholder="请输入申报批次" onBlur={(event: any) => sbpc(event, DDAlert.getForms())} />
        </Form.Item> : <></>}
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          let obj: any = {};
          if(selectionRowKeyRight.length > 0) {
            obj = {
              sjzjuuid: cs.sjzjuuid,
              ssq: cs.ssq,
              swsxDm: cs.lcswsxDm,
              uuids: selectionRowKeyRight,
              ywKey: cs.ywKey,
              newSsq: values.ssq,
              newSbpc: values.sbpc
            }
          } else {
            const ydbhs: any = [];
            checkedList.forEach((item: any) => {
              ydbhs.push(item.ydbh)
            });
            obj = {
              sjzjuuid: cs.sjzjuuid,
              ssq: cs.ssq,
              swsxDm: cs.lcswsxDm,
              ydbhs,
              ywKey: cs.ywKey,
              newSsq: values.ssq,
              newSbpc: values.sbpc
            }
          }
          mxSetzbsb(obj).then((res: any) => {
            thisObj.setState({ masker: false });
            if (res.code == '200') {
              DDAlert.close();
              message.success(res.body);
              // 重新加载一遍列表
              getYdclleftdata(leftParams, false);
            } else if (res.code == '900'){
              DDAlert.open({
                title: '系统提示',
                infoType: 'warning',
                info: '以下关联号已存在，请更换申报年月或申报批次',
                isShowcancelText: false,
                isFormContent: false,
                closeStatus: false,
                width: CONSTANTS.C_MODAL_WIDTH_X2,
                modalType: 'confirm',
                content: <>
                  <List
                    size="small"
                    split={false}
                    locale={{ emptyText: '暂无数据' }}
                    dataSource={res.desc}
                    renderItem={(item: any) => <List.Item>{item.glh}</List.Item>}
                  />
                </>,
                okCallbackFn: function (temp: any) {
                  DDAlert.close();
                },
              });
            } else {
              message.error(res.desc)
            }
          })
        });
      },
    });
  }

  // 数据导出
  const ydclSjdc = () => {
    const ywkey = cs.ywKey;
    let url = '/hx/ty/report/excelExportGet/EXCEL_REPORT_GGFW_MDT_YDDC/';
    if (ywkey == 'MDT') {
      url = '/hx/ty/report/excelExportGet/EXCEL_REPORT_GGFW_MDT_YDDC/';
    } else if (ywkey == 'MTS') {
      url = '/hx/ty/report/excelExportGet/EXCEL_REPORT_GGFW_MTS_YDDC/';
    } else if (ywkey.substr(0, 5) == 'ZMKJ_') {
      url = '/hx/ty/report/excelExportGet/EXCEL_REPORT_GGFW_ZMKJ_YDDC/';
    } else if (ywkey == 'DBTS') {
      url = '/hx/ty/report/excelExportGet/EXCEL_REPORT_GGFW_DBTS_YDDC/';
    } else if (ywkey.substr(0, 5) == 'ZBYW_') {
      url = '/hx/ty/report/excelExportGet/EXCEL_REPORT_GGFW_ZBYW_YDDC/';
    } else if (ywkey.substr(0, 5) == 'JLJG_') {
      url = '/hx/ty/report/excelExportGet/EXCEL_REPORT_GGFW_JLJG_YDDC/';
    }

    const ydbhs: any = [];
    const qylx = cktsUtil.sys.enterpriseType();
    let qyxx = qylx === 'SC'?'所属期':'批次';
    let infoHtml = `即将导出当前${qyxx}下所有疑点数据，是否导出？`;
    if (checkedList.length > 0) {
      let ydsjts = 0;
      checkedList.forEach((item: any) => {
        ydsjts += parseInt(item.dtydzs);
        ydbhs.push(item.ydbh);
      })
      infoHtml = `当前选择${ydsjts}条疑点数据，确定导出吗？`;
    }
    const paramObj = {
      sjzjuuid: cs.sjzjuuid,
      ydbhs: JSON.stringify(ydbhs),
      ywkey: cs.ywKey,
      sys: 'cp'
    };
    DDAlert.open({
      title: '疑点导出',
      info: infoHtml,
      infoType: 'info',
      modalType: 'confirm',
      isFormContent: false,
      closeStatus: false,
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        cktsUtil.downloadFileCkts(url, paramObj);
        DDAlert.close();
      }
    });
  };

  // 设置调整状态
  const setTzzt = (flag: any) => {
    if (checkedList.length == 0 && selectionRowRight.length == 0) {
      message.info(intl.formatMessage({ id: 'message_mdts_sjsb_ydcl_unselected_info' }))
      return;
    } else if (selectionRowRight.length > 0) {
      // 右侧有数据
      const arrChangeYtz = [];
      const arrChangeWtz = [];
      // 是否有下期申报
      const arrChangeZbsbbz = [];
      for (let i = 0; i < selectionRowRight.length; i++) {
        if(selectionRowRight[i].zbsbbz === 'Y') {
          arrChangeZbsbbz.push(selectionRowRight[i]);
        }
        if (selectionRowRight[i].tgbz == 'Y') {
          arrChangeYtz.push(selectionRowRight[i]);
        } else {
          arrChangeWtz.push(selectionRowRight[i]);
        }
      }
      if(arrChangeZbsbbz.length > 0) {
        message.info('存在疑点状态为下期申报的数据，不可设置疑点状态！')
        return;
      }
      if(flag == 'Y'){
        if (arrChangeYtz.length != 0) {
          message.info(intl.formatMessage({ id: 'message_mdts_sjsb_ydcl_selectedwtz_info' }));
          return;
        }
      } else {
        if (arrChangeWtz.length != 0) {
          message.info(intl.formatMessage({ id: 'message_mdts_sjsb_ydcl_selectedytz_info' }));
          return;
        }
      }
      showConfirmYdzncl({ ydl: checkedList.length, dtydzs: selectionRowRight.length }, flag)
    } else if(checkedList.length > 0) {
      const checkRow = [];
      for (let i = 0; i < checkedList.length; i++) {
        if (checkedList[i].dtydzs == checkedList[i].yclyds) {
          checkRow.push(checkedList[i]);
        }
      }
      // 是否有下期申报
      const arrChangeZbsbbz = [];
      for (let f = 0; f < ydclrightList.length; f++) {
        if(ydclrightList[f].zbsbbz === 'Y') {
          arrChangeZbsbbz.push(ydclrightList[f]);
        }
      }
      if(arrChangeZbsbbz.length > 0) {
        message.info('存在疑点状态为下期申报的数据，不可设置疑点状态！')
        return;
      }
      if(flag == 'Y'){
        if (checkRow.length != 0) {
          message.info(intl.formatMessage({ id: 'message_mdts_sjsb_ydcl_selectedwtz_info' }));
          return;
        }
      } else {
        if (checkRow.length != checkedList.length) {
          message.info(intl.formatMessage({ id: 'message_mdts_sjsb_ydcl_selectedytz_info' }));
          return;
        }
      }

      let ydsjts = 0;
      for (let i = 0; i < checkedList.length; i++) {
        ydsjts+=parseInt(checkedList[i].dtydzs);
      }
      showConfirmYdzncl({ ydl: checkedList.length, dtydzs: ydsjts}, flag)
    }
  };

  // 设置调整状态
  const showConfirmYdzncl = (param: any, flag: any) => {
    const { ydl, dtydzs } = param
    DDAlert.open({
      title: '疑点智能处理',
      info: '确定对勾选数据进行设置疑点状态操作吗？',
      infoType: 'info',
      modalType: 'confirm',
      closeStatus: false,
      content: [
        '当前勾选了' + ydl + '类疑点，共' + dtydzs + '条疑点数据',
      ],
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        let obj = {}
        if(selectionRowKeyRight.length > 0) {
          obj = {
            sjzjuuid: cs.sjzjuuid,
            uuids: selectionRowKeyRight,
            ydzt: flag,
            ywKey: cs.ywKey,
          }
        } else {
          const ydbhs: any = [];
          checkedList.forEach((item: any) => {
            ydbhs.push(item.ydbh)
          });
          obj = {
            sjzjuuid: cs.sjzjuuid,
            ydbhs,
            ydzt: flag,
            ywKey: cs.ywKey,
          }
        }
        changeYdcl(obj).then((res) => {
          DDAlert.close();
          if (res.code == '200') {
            message.success(res.body)
            getYdclleftdata(leftParams, false);
          } else {
            message.error(res.desc)
          }
        })
      }
    });
  };

  // 列表查询
  const handleSearch = () => {
    formSearch.validateFields().then(values => {
      const leftObj = {
        sjzjuuid: cs?.sjzjuuid,
        ydbh: values.ydbh,
        ydjbDms: values.ydjbDms.length>0 ?values.ydjbDms : null,
        ydnr: values.ydnr,
        ywKey: cs?.ywKey,
      }
      getYdclleftdata(leftObj, true);
    })
  };

  // 重置
  const onReset = () => {
    formSearch.setFieldsValue({
      ydjbDms: ['E', 'W'],
      ydbh: '',
      ydnr: '',
    });
    const obj = {
      sjzjuuid: cs.sjzjuuid,
      ywKey: cs.ywKey,
      ydjbDms: ['E', 'W'],
    }
    getYdclleftdata(obj, true);
  };

  const tileGroup = () => {
    const groups = <>
      <div className="ydcl_card_wrap" style={{ marginBottom: '20px' }}>
        <ProCard
          title={
            <Form layout="inline" form={formSearch}>
              <Form.Item name="ydbh"><Input placeholder="疑点代码" /></Form.Item>
              <Form.Item name="ydnr"><Input placeholder="疑点内容" /></Form.Item>
            </Form>
          }
          extra={
            <Space>
              <Button onClick={handleSearch} type="primary">查询</Button>
              <Button onClick={onReset} type="default">重置</Button>
            </Space>
          }
        >
          <Form form={formSearch}>
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item name="ydjbDms" label="错误类型："><Checkbox.Group options={optionsCwlx} /></Form.Item>
              </Col>
            </Row>
          </Form>
        </ProCard>
      </div>
    </>;
    return groups;
  };

  // 批量调整按钮
  const pltzBtn = (value: any, e: any) => {
    e.stopPropagation();
    const clljms = value.clljms;
    DDAlert.open({
      title: '疑点智能处理',
      info: '确定批量调整这些疑点吗？',
      infoType: 'info',
      modalType: 'confirm',
      closeStatus: false,
      content: [
        '即将对' + value.dtydzs + '条疑点，进行批量调整；',
        '调整方案：' + clljms,
      ],
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        const obj: any = {
          sjzjuuid: cs.sjzjuuid,
          ssq: cs.ssq,
          ydbh: value.ydbh,
          sbpc: cs.sbpc?.trim(),
          ywKey: cs.ywKey
        }
        if (value.ydbh == 'B0022' || value.ydbh == 'A0005') {
          queryYdclSpList(obj).then((res: any) => {
            DDAlert.close();
            if (res.code == '200') {
              // 弹窗B0022交互页面
              res.body.map((item: any) => {
                if (item.hgckhwbgdsbrq) {
                  item.hgckhwbgdsbrq = moment(new Date(Number(item.hgckhwbgdsbrq)));
                } else {
                  item.hgckhwbgdsbrq = '';
                }
              })
              setModalData(res.body);
              setSbnyPc(res.body[0])
              showB0022Model(true)
            } else {
              message.info(res.msg);
            }
          })
        } else {
          obj.ydcllx = value.ydcllx;
          queryYdplclSpList(obj).then((res: any) => {
            DDAlert.close();
            if (res.code == '200') {
              message.success(res.body);
              onReset();
            } else {
              message.error(res.desc);
            }
          })

        }
      }
    });
  }

  // 保存商品码表
  const saveSpmbModal = () => {
    for (let i = 0; i < modalData.length; i++) {
      if (!modalData[i].tzhckspDm) {
        message.info('请填写调整商品代码');
        return;
      }
    }
    const tmpModalData = cloneDeep(modalData);
    tmpModalData.map((item: any) => {
      item.hgckhwbgdsbrq = (new Date(item.hgckhwbgdsbrq)).getTime();
    })
    const obj = {
      sjzjuuid: cs.sjzjuuid,
      ssq: cs.ssq,
      sbpc: cs.sbpc,
      ywKey: cs.ywKey,
      gcbData: tmpModalData,
    }
    setMaskerYdclB0022(true);
    scHgsptzGcb(obj).then((res: any) => {
      setMaskerYdclB0022(false);
      if (res.code == '200') {
        message.success(res.body);
      } else {
        message.error(res.desc);
      }
      onReset();
      showB0022Model(false);
    })
  }

  // 列表单元格过长省略tooltip提示
  const renderToolTip = (text: any) => {
    return (<Tooltip placement="topLeft" title={text}>
      {text}
    </Tooltip>)
  }
  // 设置B0022列表
  const columnsB = [
    { title: 'UUID', dataIndex: 'yduuid', hidden: true },
    { title: '申报序号', dataIndex: 'sbxh', width: 110, fixed: 'left' },
    { title: '出口报关单号', dataIndex: 'ckbgdh', width: 190, ellipsis: { showTitle: false }, render: renderToolTip },
    { title: '出口商品代码', dataIndex: 'ckspDm', width: 110 },
    { title: '商品名称', dataIndex: 'sbhgspmc', width: 160, ellipsis: { showTitle: false }, render: renderToolTip },
    { title: '疑点描述', dataIndex: 'ydnr', width: 150, ellipsis: { showTitle: false }, render: renderToolTip },
    { title: '申报日期', dataIndex: 'hgckhwbgdsbrq', width: 140, editable: true, editType: 'DatePicker' },
    { title: '调整商品代码', dataIndex: 'tzhckspDm', width: 120, editable: true, editType: 'Input' },
    { title: '调整商品名称', dataIndex: 'tzhhgspmc', width: 160, ellipsis: { showTitle: false }, render: renderToolTip },
    { title: '退税率', dataIndex: 'tzhtsl', width: 80, align: 'right' },
  ];

  // 隐藏列
  const myColumns = columnsB.filter((col: any) => {
    return (!(col.hidden && col.hidden !== false));
  })

  // 设置列
  const mergedColumns = myColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any, index: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editType: col.editType,
        ssflbmList: [],
        handleSave: handleSave,
        index
      }),
    };
  });

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    editType,
    ssflbmList,
    selectChange,
    index,
    ...restProps
  }) => {
    const form: any = useContext(EditableContext);

    useEffect(() => {
      form.setFieldsValue(record);
    }, []);

    const save = async () => {
      try {
        const values = await form.validateFields();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;
    if (editable) {
      if (editType === 'Input' && dataIndex === 'tzhckspDm') {
        childNode =
          <Form.Item name={dataIndex} style={{ margin: 0 }} >
            <Input onPressEnter={save} onBlur={save} />
          </Form.Item>;
      }
      if (editType === 'DatePicker' && dataIndex === 'hgckhwbgdsbrq') {
        childNode =
          <Form.Item name={dataIndex}  style={{ margin: 0 }}>
            <DatePicker onChange={save} />
          </Form.Item>;
      }
    }
    return <td {...restProps}>{childNode}</td>;
  };

  const EditableRow: any = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  // 文本框调整
  const handleSave = (param: any) => {
    //根据商品代码请求后台，查询商品名称
    const newData = [...modalData];
    const index = newData.findIndex((item) => param.uuid === item.uuid);
    if (param.tzhckspDm) {
      const obj = {
        ckbgdh: param.ckbgdh,
        ckrq1: param.hgckhwbgdsbrq ? moment(new Date(param.hgckhwbgdsbrq)) : '',
        ckspDm: param.tzhckspDm ? param.tzhckspDm : '',
        slType: "Y",
        ssq: cs.ssq,
      }
      querySpdmXxCj(obj).then((res: any) => {
        const { code, body, msg, desc } = res;
        if (code == '200') {
          param.tzhhgspmc = res.body.sbspmc;
          param.tzhtsl = res.body.tsl;
          newData.splice(index, 1, param);
          setModalData(newData);
        } else {
          param.tzhckspDm = '';
          param.tzhhgspmc = '';
          param.tzhtsl = '';
          newData.splice(index, 1, param);
          setModalData(newData);
          message.info(msg || desc);
        }
      })
    } else {
      param.tzhhgspmc = '';
      param.tzhtsl = '';
      newData.splice(index, 1, param);
      setModalData(newData);
    }
  };

  // 根据疑点代码控制按钮显隐
  const isButton = (row: any, type: any) => {
    const ydbhDetail = ['B0191', 'C0305', 'C0410', 'B0025','C0007','C0009','C0011','C0004','C0030','C0012','C0020','C0075','B0061','B0269','B0131','B0020','B0022','B0052','B0008','B0021','B0053','A0212','A0217','A0013','A0267','A0019','A0020','A0135','A0209','A0211','A9113','A0210','A0002','A0086']; // 根据需求添加
    const ydbhBatch = ['B0025']; // 根据需求添加
    const ydbhNext = [ 'A0017','A0018','A0215','A0220','A0221','A0223','A0226','A0288','C0015','C0019','C0028','C0122','B0018','B0019']; // 根据需求添加
    let ydbh: any;
    if (type === 'detail') {
      ydbh = ydbhDetail;
    } else if (type === 'batch') {
      ydbh = ydbhBatch;
    } else if (type === 'next') {
      ydbh = ydbhNext;
      for (let i = 0; i < row.length; i++) {
          if (ydbh.indexOf(row[i].ydbh) < 0) {
            return false;
          }
      }
      return true;
    }
    return ydbh.find((item: any) => item === row.ydbh);
  }

  // 单击选中事件
  const clickCheckedToggle = (record: any, e: any) => {
    e.stopPropagation();
    const existRow: any = checkedList.find((item: any) => {
      return item.ydbh === record.ydbh;
    })
    if (existRow) {
      // 删除
      const newCheckedList = checkedList.filter((item: any) => {
        // return item[key] !== record[key];
        return item.ydbh !== record.ydbh;
      });
      setCheckedList([].concat(newCheckedList));
      onChangeCheck(newCheckedList);
    } else {
      // 添加
      checkedList.push(record);
      setCheckedList([].concat(checkedList));
      onChangeCheck(checkedList);
    }
  }

  // 疑点处理左下卡片不符
  const leftContent = <>
    <div className="left_card_header">
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} /><span className="lch_title">所属期/申报批次：{cs.ssq}/{cs.sbpc}</span>
      <a className="lch_btn" onClick={toggleCollapsed}>{collapsed ? '展开' : '收起'}</a>
    </div>
    <div
      id="scrollableDiv"
      style={{
        height: 'calc(100vh - 290px)',
        overflow: 'auto',
      }}
    >
      <Checkbox.Group value={checkedList} onChange={onChangeCheck}>
        <List
          dataSource={dataLeft}
          renderItem={(item: any, index: number) => (
            <List.Item key={item.uuid} className={`ydcl_item ydcl_item${index}`}>
              <ProCard
                onClick={(e) => clickCheckedToggle(item, e)}
                title={(<>
                  <Checkbox value={item} onClick={(e) => { e.stopPropagation(); }} />
                  <span className="dcl_title">
                    疑点代码：<span>{item.ydbh}</span>（<span className="ydcl_green_text">{item.yclyds}</span>/{item.dtydzs}）
                    <Popover placement="right" content={<><div>已处理条数：{item.yclyds}</div><div>疑点条数：{item.dtydzs}</div></>}><QuestionCircleOutlined /></Popover>
                  </span>
                </>)}
                //  extra={isButton(item, 'batch') ?
                //   <Space style={{ marginBottom: '10px' }}>
                //     <Button type="link" onClick={(e) => pltzBtn(item, e)}>{item.clljms}</Button>
                //   </Space>
                //   : <></>
                // }
                size="small"
                collapsed={collapsed}
              >
                <div className="dd_card_list">
                  <div className="dcl_item">疑点级别： <span>{item.ydjbDm === 'E'?<span style={{color: '#ff4d4f'}}>错误</span>:'警告'}</span></div>
                  <div className="dcl_item">疑点对象：{item.shdxmc}</div>
                  {
                    isButton(item, 'detail') ?
                    <div>
                      <Typography.Paragraph className="dcl_item_typography" ellipsis={{ rows: 2, expandable: false }}>疑点产生原因：{item.ydcsyy}</Typography.Paragraph>
                      <a className="dcl_item_ckxq" onClick={(e) => getYyCkxq(item, e)}>查看详情</a>
                    </div>
                    : <></>
                  }
                </div>
              </ProCard>
            </List.Item>
          )}
        />
      </Checkbox.Group>
    </div>
  </>;

  const renderYdclYdzt = (param: any, record: any) => {
    let col: any = <></>;
    if(record.zbsbbz == 'Y'){
      col = (
        <span className="dd_grid_icon">
          <Badge status="warning" />下期申报
        </span>
      );
    } else if (param === 'Y') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" />已调整
        </span>
      );
    } else {
      col = (
        <span className="dd_grid_icon">
          <Badge status="error" />未调整
        </span>
      );
    }
    return col;
  };

  // 点击修改
  const showModelCk = (record: any) => {
    // setModalVisibleForm(true)
    refModal.current!.showModal(record, cs);
  }

  // 配置列表列xi
  const columnsSjxz = [
    // { title: 'uuid', dataIndex: 'uuid', width: 0 },
    { title: '疑点编号', dataIndex: 'ydbh', width: 75 },
    { title: '申报序号', dataIndex: 'sbxh', width: 80 },
    { title: '疑点状态', dataIndex: 'tgbz', width: 100, render: (text: any, _record: any) => { return renderYdclYdzt(text, _record) },
      onFilter: (value: string, record: any) => {
        if(value === 'W' && record.zbsbbz === 'Y') {
          return true;
        } else if(value === 'Y' && record.tgbz === "Y"){
          return true;
        } else if(value === 'N' && record.tgbz != "Y" && record.zbsbbz != 'Y'){
          return true;
        }
        return false;
      },
      filters: [
        { value: 'N', text: '未调整' },
        { value: 'Y', text: '已调整' },
        { value: 'W', text: '下期申报' },
      ]
    },
    { title: '疑点内容', dataIndex: 'ydnr', ellipsis: true  },
    {
      title: '操作', width: 60, align: 'center', fixed: 'right', render: (_text: any, _record: any) => {
        if(_record.zbsbbz === 'Y' || !_record.sbxh?.trim()  || ! _record.tablekey?.trim()) {
          return <></>
        } else {
          if (isButton(_record, 'detail')) {
            return <Button type='link' onClick={() => showModelCk(_record)}>修改</Button>
          }
        }
      }
    },
  ];

  // 列选择
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any) => {
    setSelectionRowKeyRight(newSelectedRowKeys);
    setSelectionRowRight(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys: selectionRowKeyRight,
    onChange: onSelectChange,
  };

  const proCardTitle = () => {
    const cardTitle = <>
      （疑点总数：{ydzs}/提示类疑点：{jglydzs}/错误类疑点：{bktgydzs}）
      <Popover
        placement="right"
        content={<>
          <div>共检查出</div>
          <div>疑点代码{yddmzs}类；</div>
          <div>疑点总条数：{ydzs}（其中已处理条数：{yclydzs}）；</div>
          <div>不可挑过疑点条数： <span className="ydcl_red_text">{bktgydzs}</span>（其中已处理条数： {bktgyclydzs}）；</div>
        </>}>
        <QuestionCircleOutlined />
      </Popover>
    </>
    return cardTitle;
  }
  const rightTableTitle = () => {
    const cardTitle = <>
      （明细疑点总数：{mxydzs}/下期申报疑点总数：{zbsbydzs}/未调整疑点总数：{wtzydzs}/已调整疑点总数：{ytzydzs}）
    </>
    return cardTitle;
  }
  // 疑点处理右下列表
  const rightContent = <>
    <div className="lay_wrap_right_d">
      {rightTableTitle()}
      <DDBaseGrid
        rowKey='uuid'
        queryParam={{}}
        userDataSource={ydclrightList}
        columns={columnsSjxz}
        rowSelection={rowSelection}
        pagination={false}
        scroll={{ y: `${document.documentElement.clientHeight - 290}px`, x: '580px' }}
        components={true}
      />
    </div>
  </>;
  return (
    <Drawer
      title="疑点管理"
      className='dd_data_page_modal'
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      onClose={() => setModalVisible(false)}
      mask={{ closable: false }}
    >
      <Spin tip="Loading..." spinning={maskerYdcl} delay={100}>
        {tileGroup()}
        <ProCard
          split="horizontal"
          className="dd_ydcl_wrap"
          title={proCardTitle()}
          style={{ marginTop: '-20px' }}
          extra={
            <Space style={{ marginBottom: '10px' }}>
              <Dropdown overlay={(
                <Menu>
                  <Menu.Item onClick={()=>setTzzt('Y')} key='szwytz'>设置为已调整</Menu.Item>
                  <Menu.Item onClick={()=>setTzzt('N')} key='szwwtz'>设置为未调整</Menu.Item>
                </Menu>
              )}>
                <Button type="link">设置疑点状态<DownOutlined /></Button>
              </Dropdown>
              <Button type="link" onClick={setMxzbsb}>下期申报</Button>
              <Button type="link" onClick={ydclSjdc}>导出</Button>
            </Space>
          }
        >
          <div className="dd_ydcl_bottom_wrap" style={{ position: 'relative', padding: '0 0 0 501px' }}>
            <div className="lay_wrap_left" style={{ position: 'absolute', top: '0', left: '0', paddingTop: '20px', width: '500px' }}>
              {leftContent}
            </div>
            <div className="lay_wrap_right" style={{ paddingTop: '20px' }}>
              {rightContent}
            </div>
          </div>
        </ProCard>
        <Modal
          title="疑点批量处理"
          destroyOnHidden={true}
          visible={bModel}
          width={CONSTANTS.C_MODAL_WIDTH_X4}
          wrapClassName="standard-modal-1"
          footer={
            <>
              <Button onClick={() => showB0022Model(false)}>取消</Button>
              <Button onClick={saveSpmbModal} type="primary">确定</Button>
            </>
          }
          onCancel={() => showB0022Model(false)}
          className={`${maskerYdclB0022 ? 'dd_modal_show_masker' : ''}`}
          mask={{ closable: false }}
        >
          <Spin tip="Loading..." spinning={maskerYdclB0022} delay={100}>
            <div>
              所属期/申报批次：{cs.ssq}/{cs.sbpc} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              疑点编码：B0022
            </div>
            <Table
              components={{
                body: {
                  row: EditableRow,
                  cell: EditableCell,
                }
              }}
              bordered
              dataSource={modalData}
              columns={mergedColumns}
              pagination={false}
              scroll={{ x: '1100px' }}
            />
          </Spin>
        </Modal>
        <EditModal onRef={refModal} />
      </Spin>
    </Drawer>
  );
};

export default Ydcl;


