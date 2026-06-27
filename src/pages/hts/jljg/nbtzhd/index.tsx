/**
 * title: 内部台账核对
 */
import React, { useState, useEffect, useRef } from 'react';
import { List, Checkbox, Spin, Button, Form, Input, Space, message, Upload, Tooltip, Popover, Badge, Select, Radio } from 'antd';
import ProCard from '@ant-design/pro-card';
import { importTemplate, importExecl, commonDrwtdc } from '@/pages/hts/services/htsApi';
import { queryNbtzhd18List, nbtzhdscmx18, exportNbtzhd, commonInitJbxx, deleteTz, tzhd } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import './style.less';
import Nbtzhdfb from './nbtzhdfb';
import ErrorMsgGrid from '@/components/DDImport/importError';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import { QuestionCircleOutlined, ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { history } from 'umi';
import fb18config from './fbconfig';
import { intl as intl2 } from '@/components/DDAssist/util';
import importStyle from './importStyle.less';
const { Dragger } = Upload;

const Nbtzhd: React.FC<unknown> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [checkedList, setCheckedList] = React.useState<any>([]); // 选中值
  const [indeterminate, setIndeterminate] = React.useState(false); // 全选状态
  const [checkAll, setCheckAll] = useState(false); // 是否全选
  const [masker, setMasker] = useState(false);
  const [data, setData] = useState<any>([]);
  const errorMsgRef: any = useRef();

  const [formVal, setFormVal] = useState<any>({});
  const otherRef: any[] = [];
  const [myConfig, setMyConfig] = React.useState<any>(null);
  const [searchForm] = Form.useForm();
  const [bgdws, setBgdws] = useState<any>('18');
  // 导入模板数据异常页面
  otherRef.push(errorMsgRef);

  const loadMoreData = () => {
    if (masker) {
      return;
    }
    const model = {
      key: 'JLJG_ZXSB_SB_JLJG_SZC_TZHD_18',
      param: {}
    };
    loadNbtzhd18List(model);
  };

  //  18位报关单加载左侧数据
  const loadNbtzhd18List = (params: any) => {
    setMasker(true);
    queryNbtzhd18List(params).then((response) => {
      const { code, body } = response;
      if (code === '200') {
        setData(body);
        // 初始加载时，默认加载第一条数据
        if (body.length > 0) {
          setMyConfig(null);
          getDetail(body[0], 0);
        } else {
          setMyConfig(null)
        }
      }
      setMasker(false);
    });
  }

  // 设置全选切换
  const onCheckAllChange = (e: any) => {
    if (e.target.checked) {
      const aaa: any = [];
      data.forEach((item: any) => {
        aaa.push(item);
      });
      setCheckedList(aaa);
    } else {
      setCheckedList([]);
    }
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  }

  // Checkbox 选中事件
  const onChange = (list: any) => {
    const ss = [...checkedList];
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < data.length);
    setCheckAll(list.length === data.length);
  };

  // 左侧列表点击，获取明细
  const getDetail = (param: any, index: number) => {
    const divCards: any = document.querySelectorAll(".fpsqd_item");
    divCards.forEach((card: any) => {
      card.classList.remove('selected');
    });
    const divCardCurrent: any = document.querySelector(".fpsqd_item" + index);
    divCardCurrent?.classList.add('selected');
    const c = { ...fb18config };
    const initSearchModal = [];
    initSearchModal.push({ property: 'bah', value: param.bah, op: 'dd' });
    if (param?.bah?.startsWith('C')) {
      initSearchModal.push({ property: 'jarq1', value: param.jarq, op: 'dd' ,type:5 });
    } else {
      initSearchModal.push({ property: 'hxqsrq1', value: param.hxqsrq, op: 'dd', type:5 });
      initSearchModal.push({ property: 'hxjzrq1', value: param.hxjzrq, op: 'dd', type:5 });
    }
    const gridParams: any = {
      initSearchModal: initSearchModal,
    }
    c.gridParams = gridParams;
    c.grid_scroll_y = `${document.documentElement.clientHeight - 315}px`;
    const bgdwsTmp = searchForm.getFieldValue('bgdws');
    if (bgdwsTmp === '18') {
      c.unit_key = c.unit_key_18;
      c.grid_columns = c.grid_columns_18;
    } else {
      c.unit_key = c.unit_key_21;
      c.grid_columns = c.grid_columns_21;
    }
    setMyConfig(c);
  }

  useEffect(() => {
    loadMoreData();
  }, []);

  // 点击
  const onFinish = (values: any) => {
    const param: any = { bah: '', sbztDm: '' };
    if (values.bah) {
      param.bah = values.bah;
    } else {
      delete param.bah;
    }
    if (values.sbztDm) {
      param.sbztDm = values.sbztDm;
    } else {
      delete param.sbztDm;
    }
    const model: any = {
      param: param
    };
    const bgdwsTmp = searchForm.getFieldValue('bgdws');
    if (bgdwsTmp === '18') {
      model.key = 'JLJG_ZXSB_SB_JLJG_SZC_TZHD_18';
    } else {
      model.key = 'JLJG_ZXSB_SB_JLJG_SZC_TZHD_21';
    }
    setFormVal(param);
    setIndeterminate(false);
    setCheckAll(false);
    setCheckedList([]);
    loadNbtzhd18List(model);
  }

  const onSearch = (value: any, event: any) => {
    if (event.target.tagName != 'INPUT') {
      searchForm.submit();
    }
  }

  const beforeUpload = (file: any) => {
    if(!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('上传文件必须是Excel文件。');
      return Upload.LIST_IGNORE;
    } else {
      return false;
    }
  }

  const onExeclUpload = (value: any, thisFun: any) => {
    const { importFileName, importMode } = value;
    const formData = new FormData();
    formData.append('file', importFileName[0].originFileObj);
    formData.append('importMode', importMode);
    formData.append('cxhxzq', 'N');
    let url = '';
    if (bgdws === '18') {
      url = `/yw/sb/jljg/tzhd/tzhd/sjdr18`;
    } else {
      url = `/yw/sb/jljg/tzhd/tzhd/sjdr21`;
    }
    // 导入的共同方法根据传key去判断
    importExecl(url, formData).then((response) => {
      const { code, body, desc } = response;
      DDAlert.close();
      if (code === '200') {
        const {hxzquuid} = body;
        if (hxzquuid === '') {
          setIndeterminate(false);
          setCheckAll(false);
          setCheckedList([]);
          onFinish(formVal);
        } else {
          formData.set('cxhxzq', 'Y');
          onExeclUploadCon(url, formData, body);
        }
      } else if (code === '900') {
        errorMsgRef.current!.showModal(body);
      } else {
        message.error(desc);
      }
    }).catch(() => {
      message.error('导入失败，请重新上传文件。');
    }).finally(() => {
      thisFun.setState({ masker: false });
    });
  }

  const onExeclUploadCon = (url: any, formData: any, body: any) => {
    const titleMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_tzdc_hxzqbyz' });
    const grid_columns = [
      { title: '序号', dataIndex: 'xh', width: 60, ellipsis: true,},
      { title: '手（账）册号', dataIndex: 'bah', width: 215, ellipsis: true, render: (text: any) => <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>},
      { title: '核销起始日期', dataIndex: 'hxqsrq', width: 140 },
      { title: '核销截止日期', dataIndex: 'hxjzrq', width: 140 },
      { title: '问题描述', dataIndex: 'wtms', width: 170, ellipsis: true, render: (text: any) => <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>},
    ];
    DDAlert.open({
      title: titleMessage,
      infoType: 'info',
      closeStatus: false,
      okText: '继续',
      isFormContent: false,
      isTableContent: true,
      tableData: body.rows,
      tableColumns: grid_columns,
      button: [
          {name: '数据导出', key: 'dcBtn', type: 'default',
            func: (thisObj: any) => {
              const dcP = {key: body.hxzquuid};
              thisObj.setState({ masker: true });
              commonDrwtdc(dcP).then((response) => {
                thisObj.setState({ masker: false });
                if (response.code === '200') {
                  const {blob, fileName} = response.body;
                  myUtil.file.downloadExcel(blob, fileName);
                } else {
                  message.error(response.desc);
                }
              });
            }
          }],
      width: 1200,
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        importExecl(url, formData).then((response) => {
          const { code,desc } = response;
          DDAlert.close();
          if (code === '200') {
            setIndeterminate(false);
            setCheckAll(false);
            setCheckedList([]);
            onFinish(formVal);
          } else {
            message.error(desc);
          }
        });
      },
      modalType: 'form',
    });
  }

  // 数据导入
  const nbtzhdSjdr = () => {
    const titleMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_tzdr_info' });
    const tailLayout = {
      wrapperCol: { offset: 7, span: 17 },
    };
    DDAlert.open({
      title: titleMessage,
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      initFormContentValues: { importMode: 1 },
      width: 720,
      button: [
        <Button key={"mbxz"} onClick={() => handleQtspglXzmb()}>Excel模板下载</Button>,
      ],
      content: <>
        <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} valuePropName="fileList" getValueFromEvent={normFile} label="导入Excel文件" name="importFileName"
          rules={[{ required: true, message: '请选择上传的文件' }]}>
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
                  <td width="20%" className={importStyle.textCenter}>{myUtil.text.formatNum(file.size?(file.size/1024):0, '0,0')}KB</td>
                  <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined />&nbsp;待上传</td>
                  <td width="17%" className={importStyle.textCenter}><a onClick={()=>actions.remove()}>删除</a></td>
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
        <Form.Item name="importMode" {...tailLayout}>
          <Radio.Group>
            <Space direction="horizontal">
              <Radio key={"1"} value={1}>追加原数据</Radio>
              <Radio key={"2"} value={2}>导入前清空数据</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          onExeclUpload(values, thisObj)
        });
      },
    });
  };
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  // 导入excel模板下载
  const handleQtspglXzmb = () => {
    // 18位key
    const param: any = {
      uuid: '1',
    }
    if (bgdws === '18') {
      param.key = 'JLJG_ZXSB_SB_JLJG_SZC_TZHD_JCKBGD_18_TMLT';
    } else {
      param.key = 'JLJG_ZXSB_SB_JLJG_SZC_TZHD_JCKBGD_21_TMLT';
    }
    importTemplate(param).then((response) => {
      const {code, desc} = response;
      if (code === '200') {
        const { blob, fileName } = response.body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(desc);
      }
    })
  }

  // 台账核对
  const nbtzhdTzhd = () => {
    let scTotal = 0;
    let zcTotal = 0;
    if (data.length === 0) {
      const titleMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_tzhd_no_data_title' });
      const infoMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_tzhd_no_data_info' });
      const cont1Message = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_tzhd_no_data_content_f' });
      const cont2Message = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_tzhd_no_data_content_s' });
      DDAlert.open({
        title: titleMessage,
        info: infoMessage,
        infoType: 'info',
        okText: '取消',
        content: <>
          <div className='nbtz-tzhd-div'>
            <p>{cont1Message}</p>
            <p>{cont2Message}</p>
          </div>
        </>,
      });
      return;
    } else {
      let gridData: any = [];
      let bz = '';
      if (checkedList && checkedList.length != 0) {
        gridData = checkedList;
        bz = 'GX';
      } else {
        gridData = data;
        bz = 'QB';
      }
      const szcQuery = [];
      for (let i = 0; i < gridData.length; i++) {
        if (bz === 'GX') {
          if (gridData[i].bah.startsWith('C')) {
            scTotal++;
            szcQuery.push({ bah: gridData[i].bah, jarq: gridData[i].jarq });
          } else {
            zcTotal++;
            szcQuery.push({ bah: gridData[i].bah, hxqsrq: gridData[i].hxqsrq, hxjzrq: gridData[i].hxjzrq });
          }
        } else {
          if (gridData[i].bah.startsWith('C')) {
            scTotal++;
          } else {
            zcTotal++;
          }
        }
      }
      const searchModel: any = { param: {} };
      if (bgdws === '18') {
        searchModel.key = 'JLJG_ZXSB_SB_JLJG_SZC_SXMX_TZHD_TZHD_18';
      } else {
        searchModel.key = 'JLJG_ZXSB_SB_JLJG_SZC_SXMX_TZHD_TZHD_21';
      }
      const param: any = {};
      if (szcQuery.length > 0) {
        param.szcQuery = szcQuery;
      } else {
        if (formVal.bah) {
          param.bah = formVal.bah;
        }
        if (formVal.sbztDm) {
          param.sbztDm = formVal.sbztDm;
        }
      }
      searchModel.param = param;
      const titleMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_tzhd_title' });
      const infoMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_tzhd_info' });
      const tmp1Message = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_tzhd_content_f' });
      const con1Message = myUtil.text.formatRepalce(tmp1Message, { scTotal: scTotal })
      const tmp2Message = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_tzhd_content_s' });
      const con2Message = myUtil.text.formatRepalce(tmp2Message, { zcTotal: zcTotal })
      DDAlert.open({
        title: titleMessage,
        info: infoMessage,
        infoType: 'question',
        modalType: 'confirm',
        closeStatus: false,
        okCallbackFn: function (thisObj: any) {
          thisObj.setState({masker: true});
          tzhd(searchModel).then((response) => {
            DDAlert.close();
            const { code, desc } = response;
            if (code === '200') {
              if (bz === 'GX') {
                setIndeterminate(false);
                setCheckAll(false);
                setCheckedList([]);
              }
              onFinish(formVal);
              const successMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_tzhd_success' });
              message.success(successMessage);
            } else {
              message.error(desc);
            }
          });
        },
        content: [
          con1Message,
          con2Message,
        ],
      });
    }
  }

  // 生成核销明细
  const nbtzhdSchxmx = () => {
    let scTotal = 0;
    let zcTotal = 0;
    if (data.length === 0) {
      const noDataMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_schxmx_no_data_info' });
      message.info(noDataMessage);
      return;
    }
    let listData = [];
    let bz = '';
    if (checkedList && checkedList.length != 0) {
      listData = checkedList;
      bz = 'GX';
    } else {
      listData = data;
      bz = 'QB';
    }
    let num = 0;
    const szcQuery: any[] = [];
    for (let i = 0; i < listData.length; i++) {
      if (listData[i].jmfxcgbz != 'N') {
        if (listData[i].bah.startsWith('C')) {
          if (bz === 'GX') {
            szcQuery.push({
              bah: listData[i].bah,
              jarq: listData[i].jarq,
              sbztDm: listData[i].sbztDm
            });
          }
          scTotal++;
        } else {
          if (bz === 'GX') {
            szcQuery.push({
              bah: listData[i].bah,
              hxqsrq: listData[i].hxqsrq,
              hxjzrq: listData[i].hxjzrq,
              sbztDm: listData[i].sbztDm
            });
          }
          zcTotal++;
        }
      } else {
        num = num + 1;
      }
    }
    // if (bz === 'QB' && num === listData.length) {
    //   const check1Message = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_schxmx_check_info_f' });
    //   message.info(check1Message);
    //   return;
    // }
    // if (bz === 'GX' && num > 0) {
    //   const check2Message = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_schxmx_check_info_s' });
    //   message.info(check2Message);
    //   return;
    // }
    const tmp1Message = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_schxmx_content_f' });
    const scxx = myUtil.text.formatRepalce(tmp1Message, { scTotal: scTotal });
    const tmp2Message = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_schxmx_content_s' });
    const zcxx = myUtil.text.formatRepalce(tmp2Message, { zcTotal: zcTotal });
    const titleMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_schxmx_title' });
    const vParam = { tableKey: 'JLJG_ZXSB_SB_JLJG_MDTHX_G', cxlx: 'add' };
    commonInitJbxx(vParam).then((response) => {
      const initFormVal: any = { sffg: false };
      if (response.code === '200') {
        initFormVal.ssq = response.body.ssq;
      } else {
        initFormVal.ssq = '';
      }
      DDAlert.open({
        title: titleMessage,
        infoType: 'info',
        closeStatus: false,
        initFormContentValues: initFormVal,
        isFormContent: true,
        isTableContent: false,
        okCallbackFn: function (thisObj: any) {
          DDAlert.getForms().validateFields().then((values: any) => {
            const qrData: any = {
              param: {
                ssq: values.ssq,
                cxscbz: 'N',
                fgbz: 'Y',
                szcQuery: szcQuery,
                cxtzbz:'N',
                bah: formVal.bah? formVal.bah: '',
                sbztDm: formVal.sbztDm?formVal.sbztDm: ''
              }
            }
            if (bgdws === '18') {
              qrData.key = 'JLJG_ZXSB_SB_JLJG_SZC_TZHD_SCSJ_18';
            } else {
              qrData.key = 'JLJG_ZXSB_SB_JLJG_SZC_TZHD_SCSJ_21';
            }
            thisObj.setState({ masker: true });
            nbtzhdscmx18(qrData).then((qrresponse) => {
              const {code, msg, desc, body} = qrresponse;
              if (code === '200') {
                const {druuid} = body;
                qrData.param.cxtzbz = '';
                if (druuid === '') {
                  nbtzhdSchxmxCon(qrData);
                } else {
                  DDAlert.close();
                  nbtzhdSchxmxJyCon(qrData, body);
                }
              }
              else if(code === '-999'){
                DDAlert.close();
                DDAlert.open({
                  title: '系统提示',
                  info: desc,
                  content: msg,
                  infoType: 'info',
                });
                return
              } else {
                // DDAlert.close();
                thisObj.setState({ masker: false });
                message.error(desc);
                return
              }
            });
          });
        },
        modalType: 'form',
        content: <>
          <Form.Item name='ssq' label='所属期' rules={[{ required: true, message: '请输入所属期' }, { pattern: new RegExp('^(20|19){1}[0-9]{2}(((0){1}[1-9]{1})|((1){1}(0|1|2){1}))$', 'g'), message: '只允许输入YYYYMM型' }]}>
            <Input placeholder='所属期' size='small' />
          </Form.Item>
          {/* <Form.Item valuePropName="checked" name='sffg' {...myUtil.layout.formX1.tailLayout}>
            <Checkbox>覆盖已生成的明细数据
              <Tooltip className='znfx-scmx-fgts'
                title='按照所属期，手（账）册号以及核销周期对已生成的明细数据进行覆盖操作。'
                overlayInnerStyle={{ width: '255px', }}>
                <QuestionCircleOutlined />
              </Tooltip>
            </Checkbox>
          </Form.Item> */}
          <Form.Item colon={true} label="手册信息">
            <span className="ant-form-text">{scTotal} 条</span>
          </Form.Item>
          <Form.Item colon={true} label="账册信息">
            <span className="ant-form-text">{zcTotal} 条</span>
          </Form.Item>
        </>,
      });
    });
  };

  const nbtzhdSchxmxCon = (params: any) => {
    nbtzhdscmx18(params).then((qrresponse) => {
      DDAlert.close();
      if (qrresponse.code === '200') {
        openResult({
          mdtTs: qrresponse.body.mdtTs,
          hxTs: qrresponse.body.hxTs
        });
      } else if (qrresponse.code === '902') {
        params.param.cxscbz = 'Y';
        nbtzhdscmx18FgSsq(params);
      } else {
        message.error(qrresponse.desc);
        return
      }
    });
  }

  const nbtzhdSchxmxJyCon = (params: any, body: any) => {
    const titleMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_schxmx_jy_title' });
    const grid_columns = [
      { title: '报关单号/核注清单编号', dataIndex: 'bgdhgbh', width: 170, ellipsis: true, render: (text: any) => <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>},
      { title: '手（账）册号', dataIndex: 'bah', width: 215, ellipsis: true, render: (text: any) => <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>},
      { title: '核销周期', dataIndex: 'hxzq', width: 150,},
      { title: '进（出）口标识', dataIndex: 'jckbzmc', width: 110},
      { title: '监管方式代码', dataIndex: 'jgfsDm', width: 100},
      { title: '监管方式名称', dataIndex: 'jgfsmc', width: 140, ellipsis: true, render: (text: any) => <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>},
      { title: '进（出）口日期', dataIndex: 'ckrq1', width: 130}
    ];
    DDAlert.open({
      title: titleMessage,
      infoType: 'info',
      closeStatus: false,
      okText: '继续',
      isFormContent: false,
      isTableContent: true,
      tableData: body.rows,
      tableColumns: grid_columns,
      button: [
          {name: '数据导出', key: 'dcBtn', type: 'default',
            func: (thisObj: any) => {
              const dcP = {key: body.druuid};
              thisObj.setState({ masker: true });
              commonDrwtdc(dcP).then((response) => {
                thisObj.setState({ masker: false });
                if (response.code === '200') {
                  const {blob, fileName} = response.body;
                  myUtil.file.downloadExcel(blob, fileName);
                } else {
                  message.error(response.desc);
                }
              });
            }
          }],
      width: 1200,
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        nbtzhdscmx18(params).then((qrresponse) => {
          DDAlert.close();
          if (qrresponse.code === '200') {
            openResult({
              mdtTs: qrresponse.body.mdtTs,
              hxTs: qrresponse.body.hxTs
            });
          } else if (qrresponse.code === '902') {
            params.param.cxscbz = 'Y';
            nbtzhdscmx18FgSsq(params);
          } else {
            message.error(qrresponse.desc);
            return
          }
        });
      },
      modalType: 'form',
    });
  }

  const tailLayoutform = {
    wrapperCol: { offset: 24, span: 0 },
  };

  // 生成明细覆盖所属期
  const nbtzhdscmx18FgSsq = (params: any) => {
    const titleMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_schxmx_fg_title' });
    const infoMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_schxmx_fg_info' });
    DDAlert.open({
      title: titleMessage,
      info: infoMessage,
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: false,
      content: '',
      isFormContent: false,
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        nbtzhdscmx18(params).then((response) => {
          DDAlert.close();
          if (response.code === '200') {
            openResult({
              mdtTs: response.body.mdtTs,
              hxTs: response.body.hxTs
            });
          } else {
            message.error(response.desc);
            return
          }
        });
      }
    });
  }

  // 生成明细完成后-回调
  const openResult = (params: any) => {
    const titleMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_schxmx_success_title' });
    const infoMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_schxmx_success_info' });
    const tmp1Message = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_schxmx_success_content_f' });
    const con1Message = myUtil.text.formatRepalce(tmp1Message, { mdtTs: params.mdtTs });
    const tmp2Message = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_schxmx_success_content_s' });
    const con2Message = myUtil.text.formatRepalce(tmp2Message, { hxTs: params.hxTs });
    DDAlert.open({
      title: titleMessage,
      info: infoMessage,
      infoType: 'success',
      modalType: 'confirm',
      okText: '跳转至明细',
      closeStatus: true,
      okCallbackFn: function () {
        setIndeterminate(false);
        setCheckAll(false);
        setCheckedList([]);
        history.push('/hts/jljg/mxcj');
      },
      content: <>
        <p className="item">
          {con1Message}
        </p>
        <p className="item">
          {con2Message}
        </p>
      </>,
    });
  }

  // 数据导出
  const nbtzhdSjdc = () => {
    if (!data || data.length <= 0) {
      const checkMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_tzdc_check' });
      message.info(checkMessage);
      return
    }
    let uuids:any = [];
    if(checkedList.length > 0) {
      checkedList.forEach((item:any)=>{
        uuids.push(item.uuid);
      })
      formVal.uuids = uuids;
    } else {
      formVal.uuids = [];
    }
    const model: any = {
      param: formVal
    }
    if (bgdws === '18') {
      model.key = 'JLJG_ZXSB_SB_JLJG_SZC_SXMX_TZHD_DC_18';
    } else {
      model.key = 'JLJG_ZXSB_SB_JLJG_SZC_SXMX_TZHD_DC_21';
    }
    setMasker(true);
    exportNbtzhd(model).then((response) => {
      setMasker(false);
      if (response.code === '200') {
        const { blob, fileName } = response.body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(response.desc)
      }
    })
  };
  // 数据删除
  const nbtzhdSc = () => {
    if (!data || data.length <= 0) {
      const nodataMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_plsc_nodata' });
      message.info(nodataMessage);
      return
    }
    if (!checkedList || checkedList.length === 0) {
      const noSelectMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_plsc_noselect' });
      message.info(noSelectMessage);
      return;
    } else {
      const titleMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_plsc_title' });
      const infoMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_plsc_info' });
      DDAlert.open({
        title: titleMessage,
        info: infoMessage,
        infoType: 'question',
        modalType: 'confirm',
        closeStatus: true,
        okCallbackFn: () => {
          const szcQuery: any = []
          for (let i = 0; i < checkedList.length; i++) {
            if (checkedList[i].bah.startsWith("C")) {
              szcQuery.push({ bah: checkedList[i].bah, jarq: checkedList[i].jarq });
            } else {
              szcQuery.push({ bah: checkedList[i].bah, hxqsrq: checkedList[i].hxqsrq, hxjzrq: checkedList[i].hxjzrq });
            }
          }
          const model: any = {
            param: {
              szcQuery: szcQuery
            }
          }
          if (bgdws === '18') {
            model.key = 'JLJG_ZXSB_SB_JLJG_SZC_SXMX_TZHD_PLSC_18';
          } else {
            model.key = 'JLJG_ZXSB_SB_JLJG_SZC_SXMX_TZHD_PLSC_21';
          }
          setMasker(true);
          deleteTz(model).then((response) => {
            const { code, desc } = response;
            setMasker(false);
            if (code === '200') {
              setIndeterminate(false)
              setCheckAll(false);
              setCheckedList([]);
              onFinish(formVal);
              const successMessage = intl2.formatMessage({ id: 'message_jljghx_nbtzhd_plsc_success' });
              message.success(successMessage);
            } else {
              message.error(desc);
            }
          })
        },
      });
    }
  };

  // 报关单位数change
  const handlerBgdwsChange = (value: any) => {
    setBgdws(value);
    setCollapsed(false);
    searchForm.setFieldsValue({bah: '', sbztDm: ''});
    const model: any = {
      param: {}
    };
    if (value === '18') {
      model.key = 'JLJG_ZXSB_SB_JLJG_SZC_TZHD_18';
    } else {
      model.key = 'JLJG_ZXSB_SB_JLJG_SZC_TZHD_21';
    }
    loadNbtzhd18List(model);
  }

  const leftContentEmpty = <div id="scrollableDiv"
    style={{
      height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '69px', '20px']),// header cardMargin 69搜索栏 40工具栏 40工具栏 20padding
    }}>
      <div className='lwrd_no_data_left_wrap'>
        <div className='lwrd_no_data_left'>
          <div className='lwrd_no_data_text'>暂无数据</div>
        </div>
      </div>
  </div>

  const leftContent = <>
    <div className="left_card_header">
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} /><span className="lch_title">手（账）册信息</span>
      <a className="lch_btn" onClick={toggleCollapsed}>{collapsed ? '展开' : '收起'}</a>
    </div>
    <div id="scrollableDiv"
      style={{
        height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '69px', '40px', '20px', '20px']),// header cardMargin 69搜索栏 40工具栏 40工具栏 20padding
        overflow: 'auto',
      }}>
      <Checkbox.Group value={checkedList} onChange={onChange}>
        <List
          dataSource={data}
          renderItem={(item: any, index: number) => (
            <List.Item key={index.toString() + 'listItem'} onClick={() => getDetail(item, index)} className={`fpsqd_item fpsqd_item${index} ${index === 0 ? 'selected' : ''}`}>
              <ProCard
                title={(<>
                  <Checkbox value={item} onClick={(e) => { e.stopPropagation(); }} />
                  {collapsed ?
                    <>
                      <span id="dcl_title_sq" className="dcl_title_sq">
                        {item.sbztdm === '2' ? <span className="dd_grid_icon"><Popover placement="top" content={"已申报"}><Badge status="success" /></Popover>{item.bah}</span> :
                          item.sbztdm === '0' ? <span className="dd_grid_icon"><Popover placement="top" content={"未申报"}><Badge status="error" /></Popover>{item.bah}</span> :
                            <span className="dd_grid_icon"><Popover placement="top" content={"待申报"}><Badge status="warning" /></Popover>{item.bah}</span>
                        }
                        <span className="dcl_title_sq_je">
                          {item.bah.startsWith('C') ?
                            <>
                              {myUtil.date.formatDate(item.jarq, 'YYYY-MM-DD')}
                            </> :
                            <>
                              {myUtil.date.formatDate(item.hxqsrq, 'YYYY-MM-DD')}至{myUtil.date.formatDate(item.hxjzrq, 'YYYY-MM-DD')}
                            </>
                          }
                        </span>
                      </span>
                    </> :
                    <>
                      <span className="dcl_title">
                        {item?.bah?.startsWith('C') ?
                          <>
                            手册号：{item.bah}
                          </> :
                          <>
                            账册号：{item.bah}
                          </>
                        }
                      </span>
                    </>
                  }
                </>)}
                size="small"
                collapsible
                collapsed={collapsed}
              >
                <div className="dd_card_list">
                  {item?.bah?.startsWith('C') ?
                    <>
                      <div className="dcl_item">结案日期：{myUtil.date.formatDate(item.jarq, 'YYYY-MM-DD')}</div>
                    </> :
                    <>
                      <div className="dcl_item">核销起始时间：{myUtil.date.formatDate(item.hxqsrq, 'YYYY-MM-DD')}</div>
                      <div className="dcl_item">核销截止时间：{myUtil.date.formatDate(item.hxjzrq, 'YYYY-MM-DD')}</div>
                    </>
                  }
                  {/* <div className="dcl_item">进口关单（张）：{item.jkgdzs}</div>
                  <div className="dcl_item">出口关单（张）：{item.ckgdzs}</div> */}
                  {bgdws=== '18'?
                    <>
                      <div className="dcl_item">进口关单（张）：{item.jkgdzs}</div>
                      <div className="dcl_item">出口关单（张）：{item.ckgdzs}</div>
                    </> :
                    <>
                      <div className="dcl_item">
                        <Popover placement="right" content={"当前手（账）册号下数据导入（台账数据列状态为【存在】的数据）的进口关单美元总金额"}>
                          进口总额（美元）：<a>{myUtil.text.formatNum(item.jkzemy, '0,0.00')}</a>
                        </Popover>
                      </div>
                      <div className="dcl_item">
                        <Popover placement="right" content={"当前手（账）册号下数据导入（台账数据列状态为【存在】的数据）的出口关单美元总金额"}>
                          出口总额（美元）：<a>{myUtil.text.formatNum(item.ckzemy, '0,0.00')}</a>
                        </Popover>
                      </div>
                      <div className="dcl_item">
                        <Popover placement="right" content={"当前手（账）册号下数据导入（台账数据列状态为【存在】的数据）的进口关单张数/条数"}>
                          进口报关单（张/条）：<a>{item.jkgdzs}/{item.jkgdts}</a>
                        </Popover>
                      </div>
                      <div className="dcl_item">
                        <Popover placement="right" content={"当前手（账）册号下数据导入（台账数据列状态为【存在】的数据）的出口关单张数/条数"}>
                          出口报关单（张/条）：<a>{item.ckgdzs}/{item.ckgdts}</a>
                        </Popover>
                      </div>
                    </>
                  }
                  <div className="dcl_item">申报状态：
                    {item.sbztdm === '2' ? <span className="dd_grid_icon"> <Badge status="success" />{"已申报"} </span> :
                      item.sbztdm === '0' ? <span className="dd_grid_icon"> <Badge status="error" />{"未申报"} </span> :
                        <span className="dd_grid_icon"> <Badge status="warning" />{"待申报"} </span>
                    }
                  </div>
                </div>
              </ProCard>
            </List.Item>
          )}
        />
      </Checkbox.Group>
    </div>

  </>;

  const rightContent = <>
    <div className="lay_wrap_right_d">
    {myConfig ? <Nbtzhdfb param={myConfig} /> :
      <div style={{
        height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '69px', '40px', '20px']),// header cardMargin 69搜索栏 40工具栏 40工具栏 20padding
      }}>
        <div className='lwrd_no_data_right'><div className='lwrd_no_data_text'>暂无数据</div></div>
      </div>
    }
    </div>
  </>;

  const initialFormValues = () => {
    return {
      bgdws: "18",
      sbztDm: "",
      bah: ""
    };
  }

  return (
    <>
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <ProCard split="horizontal" className="dd_nbtzhd_wrap">
          <ProCard className="dd_nbtzhd_top_wrap" title={
            <Form layout="inline" onFinish={onFinish} form={searchForm} initialValues={initialFormValues()}>
              {/* <Form.Item name="bgdws" >
                <Select style={{ width: 100 }} allowClear={false} onChange={handlerBgdwsChange}>
                  <Select.Option key={'18'} value="18">18位关单</Select.Option>
                  <Select.Option key={'21'} value="21">21位关单</Select.Option>
                </Select>
              </Form.Item> */}
              <Form.Item name="sbztDm" >
                <Select placeholder="申报状态" style={{ width: 100 }} allowClear={false}>
                  {<Select.Option key={''} value="">全部</Select.Option>}
                  <Select.Option key={'0'} value="0">未申报</Select.Option>
                  <Select.Option key={'1'} value="1">待申报</Select.Option>
                  <Select.Option key={'2'} value="2">已申报</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="bah">
                <Input.Search placeholder="手（账）册号" allowClear enterButton="查询" onSearch={onSearch}/>
              </Form.Item>
            </Form>
          } extra={
            <Form layout="inline" >
              <Form.Item >
                <Space>
                  <Button type="link" key={'tzdr'} onClick={nbtzhdSjdr}>台账导入</Button>
                  <Button type="link" key={'tzhd'} onClick={nbtzhdTzhd}>台账核对</Button>
                  <Button type="link" key={'schxmx'} onClick={nbtzhdSchxmx}>生成核销明细</Button>
                  <Button type="link" key={'sjsc'} onClick={nbtzhdSc}>删除</Button>
                  <Button type="link" key={'sjdc'} onClick={nbtzhdSjdc}>数据导出</Button>
                </Space>
              </Form.Item>
            </Form>
          }>
          </ProCard>
          <div className="dd_nbtzhd_bottom_wrap" style={{ position: 'relative', padding: '0 0 0 371px' }}>
            <div className="lay_wrap_left" style={{ position: 'absolute', top: '0', left: '0', paddingTop: '20px', width: '355px' }}>
              {data.length == 0 ? leftContentEmpty : leftContent}
            </div>
            <div className="lay_wrap_right" style={{ paddingTop: '20px' }}>
              {rightContent}
            </div>
          </div>
        </ProCard>
      </Spin>
      <ErrorMsgGrid onRef={errorMsgRef} />
    </>
  );
};

export default Nbtzhd;


