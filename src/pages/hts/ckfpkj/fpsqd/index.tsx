/**
 * title: 发票
 * creator: zn
 */
import React, { useState, useEffect, useRef } from 'react';
import { List, Skeleton, Tabs, Checkbox, Space, Button, Dropdown, Menu, message, Spin, Popover, Form, Input, Drawer, Tooltip, Select, Upload, Modal} from 'antd';
import { DownOutlined, FullscreenOutlined, FullscreenExitOutlined, WarningOutlined, InboxOutlined, ClockCircleOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import ProCard from '@ant-design/pro-card';
import Invoice from '@/pages/hts/components/DDdocs/Invoice';
import DDAlert from '@/pages/hts/components/DDAlert';
import { scjc, queryPager, querySqdmxcx, saveFpsqdxxbc, querySqdqrkptj, sqdqrkp, sqdSccz, sqddjxhcp, xzsqdtzmxcx, xzsqdtzbc, queryParams, kpddxz, commonDrwtdc, qrkpjy, ddtjkp, sdpqrkp, sdpddtjkp, skxxcx, downloadTemplate, importExecl } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import Bgdxq from './bgdxq';
import Hwqd from './hwqd';
import './style.less';
import CONSTANTS from '@/components/DDAssist/constants';
import Fpsqdtz from './fpsqdtz';
import { intl as intl2 } from '@/components/DDAssist/util';
import { useAccess, Access } from 'umi';
import { history } from 'umi';
import SfyzModal from '../common/modal_sfyz'
import KprzModal from '../common/modal_kprz'
import Zjbz from './zjbz'
import { debounce } from 'lodash';
import importStyle from './import_style.less';
import DDBaseGrid from '@/components/DDBaseGrid';



const { Dragger } = Upload;

const refSfyz: any = React.createRef();
const refKprz: any = React.createRef();
const refZjbz: any = React.createRef();

const Fp: React.FC<unknown> = () => {
  const access = useAccess(); // 权限

  const [activeTab, setActiveTab] = useState<any>('1');                         // tabKey
  const [collapsed, setCollapsed] = useState(false);                            // 左侧列表收起标志
  const [checkedList, setCheckedList] = React.useState<any>([]);                // 左侧列表选中值
  const [indeterminate, setIndeterminate] = React.useState(false);              // 全选状态
  const [checkAll, setCheckAll] = useState(false);                              // 是否全选
  const [masker, setMasker] = useState(false);                                  // loading标志
  const [data, setData] = useState<any>([]);                                    // 左侧列表加载数据
  const [fpxx, setFpxx] = useState<any>({});                                    // 发票信息 Tab 数据
  const [bgdxqList, setBgdxqList] = useState<any>([]);                          // 报关单详情 Tab 数据
  const [hwqdList, setHwqdList] = useState<any>([]);                            // 货物清单 Tab 数据
  const [tzModalVisible, setTzModalVisible] = useState<boolean>(false);

  const [editFlag] = useState(false);
  const refFpsqdtz: any = React.createRef();
  const [fullScreenView, setFullScreenView] = useState<any>(false);

  const [tzData, setTzData] = useState<any>([]);                                // 调整开票数据
  const [tzMxData, setTzMxData] = useState<any>([]);                            // 调整开票明细数据

  const [exRowKeys, setExRowKeys] = useState<any>([]);                          // 调整开票展开key
  // const [bzform] = Form.useForm();
  const invoicemRef: any = useRef();
  const hwqdRef: any = useRef();

  const [gdPage, setGdPage] = useState<any>(1);                                   // 滚动加载时，记录加载的page
  const [pageSize] = useState<any>(200);                                          // 滚动加载每次加载条数
  const [maxRowCount, setMaxRowCount] = useState<any>(0);                         // 每次查询时，数据条数
  const [queryModel, setQueryModel] = useState<any>({});                          // 查询条件
  const [searchForm] = Form.useForm();                                            // 查询form
  const [fpzgkpxe, setFpzgkpxe] = useState<any>(9999.99);                         // 最高开票限额
  const [fpmxLen, setFpmxLen] = useState<any>(false);                             // 每条单据下发票明细数量检验
  const [hwqdLen, setHwqdLen] = useState<any>(0);                                 // 货物清单长度
  const [gmfList, setGmfList] = useState<any>([]);
  const [searchModel, setSearchModel] = useState<any>([]);
  const [tjkpParams, setTjkpParams] = useState<any>({}); // 提交开票条件
  const [tempCode, setTempCode] = useState<any>({});

  const [modalVisibleExport, setModalVisibleExport] = useState<boolean>(false);
  const [errList, setErrListt] = useState<any>([]);
  
  const [errMasker, setErrMasker] = useState(false);                                  // loading标志

  const errColumns = [
    { title: '序号', dataIndex: 'xh', width: 70 },
    { title: '失败原因', dataIndex: 'sbyy', width: 300 },
  ]

  const loadMoreData = (param: any) => {
    if (masker) {
      return;
    }
    const params = dealCxcs(param, 1);
    queryZbxx(params);
  };

  // 左侧列表查询
  const queryZbxx = (params: any) => {
    setMasker(true);
    setSearchModel(params);
    queryPager(params).then((response) => {
      setMasker(false);
      const { code, body } = response;
      if (code === '200') {
        const { rows, page, rowCount } = body;
        setGdPage(page);
        setMaxRowCount(rowCount);
        if (page === 1 && rowCount === 0) {
          setData([]);
          setActiveTab("1");
          ycxxIsNull();
        } else if (page === 1 && rowCount > 0) {
          setData(rows);
          getDetail(rows[0], 0);
        } else {
          setData([...data, ...rows]);
          if (checkAll) {
            setCheckedList([...checkedList, ...rows]);
          }
        }
      } else {
        setActiveTab("1");
        ycxxIsNull();
      }
    })
  }

  // 右侧列表为空
  const ycxxIsNull = () => {
    setHwqdLen(0);
    setFpxx({});
    setHwqdList([]);
    setBgdxqList([]);
  }

  // 滚动加载
  const gdloadMoreData = () => {
    const params = dealCxcs(queryModel, gdPage + 1);
    queryZbxx(params);
  }

  // 处理主表查询条件
  const dealCxcs = (params: any, cxPage: any) => {
    const searchModel: any = [];
    if (params.hasOwnProperty('bgdhgbh') && params.bgdhgbh != '') {
      searchModel.push({ property: 'bgdhgbh', value: params.bgdhgbh, op: 'zdy' });
    }
    if (params.hasOwnProperty('ckhth') && params.ckhth != '') {
      searchModel.push({ property: 'ckhth', value: params.ckhth, op: 'zdy' });
    }
    const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
    // 检查
    if (temp[0]?.fpkjfsDm === '2' && params.hasOwnProperty('sjztDm') && params.sjztDm != ''&& undefined != params.sjztDm) {
      searchModel.push({ property: 'sjztDm', value: params.sjztDm, op: 'zdy' });
    }
    // 发票种类
    if (temp[0]?.fpkjfsDm === '2' && params.hasOwnProperty('fpzlDm1') && params.fpzlDm1 != '' && undefined != params.fpzlDm1) {
      searchModel.push({ property: 'fpzlDm1', value: params.fpzlDm1, op: 'zdy' });
    }
    const orderModel: any = [{ field: 'djbh', order: 'asc' }];
    return {
      key: 'FPZS_FPSQD_FPSQDFYLBCX',
      searchModel,
      orderModel,
      pageSize,
      page: cxPage
    }
  }

  const onFinish = (values: any) => {
    setIndeterminate(false);
    setCheckAll(false);
    setCheckedList([]);
    setGdPage(1);
    setQueryModel(values);
    loadMoreData(values);
  }


  const closeModal = () => {
    onFinish(queryModel);
  }



  const handleSearch = (value: any, event: any) => {
    if (event.target.tagName != 'INPUT') {
      searchForm.submit();
    }
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

  // 处理操作参数
  const dealCzcs = () => {
    const params: any = {};
    if (checkAll) {
      params.qbxzbz = 'Y';
      if (queryModel.hasOwnProperty('ckhth')) {
        params.ckhth = queryModel.ckhth;
      }
      if (queryModel.hasOwnProperty('bgdhgbh')) {
        params.bgdhgbh = queryModel.bgdhgbh;
      }
      if (tempCode?.fpkjfsDm === '2' && queryModel.hasOwnProperty('sjztDm')) {
        params.sjztDm = queryModel.sjztDm;
      }
      if (tempCode?.fpkjfsDm === '2' && queryModel.hasOwnProperty('fpzlDm1')) {
        params.fpzlDm1 = queryModel.fpzlDm1;
      }
    } else {
      const arr: any = [];
      checkedList.forEach((item: any) => {
        arr.push(item.fpsqduuid);
      });
      params.fpsqduuids = arr;
    }
    return params;
  }


  // 防止多次点击
  const qrkpsj = debounce(function() {
    qrkpsj2();
  }, 500);

  // 确认开票数据
  const qrkpsj2 = () => {
    if(data && data.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
      return;
    }
    Promise.all([myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ:01')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
      setTempCode(temp[0])
      // 开票方式为在线开票且税盘类型为“航天”，并且发票种类不是数电票，点击“确认开票”后，校验“税盘号”和“分机号”是否有值
      if(temp[0].fpkjfsDm === '2' && temp[0].fpsplxDm === '1' && temp[0].fpzlDm1 != '5') {
        if(!temp[0].sph || !temp[0].fjh1) {
          DDAlert.open({
            title: '确认开票',
            info: '请进行税盘号和分机号的配置',
            infoType: 'warning',
            modalType: 'confirm',
            okText: '去配置',
            content: [],
            okCallbackFn: function () {
              history.push('/hts/pzgl/fppzgl');
            }
          });
          return;
        }
      }
      // 在线开票且税盘类型为“百旺”或“税务Ukey”，并且发票种类不是数电票，点击“确认开票”后，校验“税盘号”是否有值
      if(temp[0].fpkjfsDm === '2' && temp[0].fpsplxDm === '2' && temp[0].fpzlDm1 != '5' || temp[0].fpkjfsDm === '2' && temp[0].fpsplxDm === '3' && temp[0].fpzlDm1 != '5') {
        if(!temp[0].sph) {
          DDAlert.open({
            title: '确认开票',
            info: '请进行税盘号的配置',
            infoType: 'warning',
            modalType: 'confirm',
            okText: '去配置',
            content: [],
            okCallbackFn: function () {
              history.push('/hts/pzgl/fppzgl');
            }
          });
          return;
        }
      }
      let leftList = checkedList && checkedList.length > 0 ? checkedList : data;
      for(let i=0; i<leftList.length;i++) {
        // “数电票（普通发票）”, 在线开票 不共存
        // if(leftList[i].fpzlDm1 === '5' && temp[0].fpkjfsDm === '2') {
        //   message.info('在线开票功能暂不支持开具数电票（普通发票），请删除后重新立即开票。');
        //   return;
        // }
        // 数据中存在与当前设置的开票种类不一致的数据，不支持确认开票。 
        if(leftList[i].fpzlDm1 != temp[0].fpzlDm1) {
          message.info(intl2.formatMessage({ id: 'message_ckfp_fpsqd_szkp_qrkpinfo' }));
          return;
        }
      }
      // 不勾选数据但当前筛选条件下的数据中存在发票种类为“数电票（普通发票）”数据，确认开票时阻断提示
      const params: any = dealCzcs();
      params.key = 'FPZS_FPSQD_FPSQDFYLBCX';
      params.cxtj = searchModel?.searchModel || [];
      params.flag = '01';
      if(temp[0].fpkjfsDm === '2' && temp[0].fpzlDm1 === '5') {
        qrkpsj_zxkp();
      } else if(temp[0].fpkjfsDm === '2'&& temp[0].fpzlDm1 != '5') {
        qrkpsj_zxkp();
      } else {
        qrkpsj_dckp();
      }
    })
  }

  // 导出开票
  const qrkpsj_dckp = () => {
    setMasker(true);
    // 2.1.6发票申请单-开票统计
    const params: any = dealCzcs();
    params.key = 'FPZS_FPSQD_FPSQDFYLBCX';
    params.cxtj = searchModel?.searchModel || [];
    params.flag = '01'
    setMasker(true);
    querySqdqrkptj(params).then((response) => {
      setMasker(false);
      const { code, body, desc } = response;
      if (code === '200') {
        DDAlert.open({
          title: '确认开票',
          info: '确定继续确认开票吗？',
          infoType: 'question',
          modalType: 'confirm',
          isFormContent: false,
          content: [
            '单据号' + myUtil.text.formatNum(body.fpsqdzs, '0,0') + '张',
            '开票金额' + myUtil.text.formatNum(body.kpje, '0,0.00') + '元',
            '税额合计' + myUtil.text.formatNum(body.sehj, '0,0.00') + '元'
          ],
          closeStatus: false,
          okCallbackFn: function (thisObj: any) {
            thisObj.setState({ masker: true });
            sqdqrkp(params).then((response) => {
              const { code, body, desc } = response;
              DDAlert.close();
              if (code === '200') {
                message.success(intl2.formatMessage({ id: 'message_ckfp_fpsqd_qrkp_success' }));
                onFinish(queryModel);
              } else {
                if (code === '300' && body.cwlx) {
                  let info = '';
                  if (body.cwlx === '1') {
                    info = '以下单据号备注超长，请调整备注后重新确认开票';
                  } else if (body.cwlx === '2') {
                    info = '以下单据号购买方失效，请调整购买方后重新确认开票';
                  } else if (body.cwlx === '3') {
                    info = '以下单据号申请单已开票，请重新选择';
                  }
                  let djbhs = body.djbhs ? body.djbhs : [];
                  if (djbhs.length > 1) {
                    djbhs.sort(function (a: any, b: any) {
                      if (a > b) {
                        return 1;
                      } else {
                        return -1;
                      };
                    })
                  }
                  const textAreaValues: any = []
                  djbhs.forEach((item: any) => {
                    textAreaValues.push(<div>{item}</div>)
                  })
                  DDAlert.open({
                    title: '确认开票失败',
                    infoType: 'warning',
                    modalType: 'info',
                    info: info,
                    content: <div className="fpsqd_qrkp_bzcheck">
                      {textAreaValues}
                    </div>,
                    okCallbackFn: function () {
                      DDAlert.close();
                    },
                  });
                } else if (code === '300') {
                  message.info('当前筛选条件下存在与当前设置的发票种类不一致的数据，不支持确认开票。')
                } else if (code === '900') {
                  message.info(desc)
                } else {
                  message.error(desc);
                }
              }
            })
          },
        });
      } else if (code === '300') {
        message.info('当前筛选条件下存在与当前设置的发票种类不一致的数据，不支持确认开票。')
      } else if (code === '900') {
        message.info(desc)
      } else {
        message.error(desc);
      }
    });
  }

  const fpsqddc = () => {
    if (data && data.length === 0) {
      message.info('当前无可导出的数据！');
      return ;
    }
    const model : any = [];
    let modalTitle = '将导出当前筛选条件下的所有数据，是否确认';
    if (checkedList && checkedList.length > 0) {
      modalTitle = '将导出选中的数据，是否确认';
      const fpsqduuids: any = [];
      const tmpCheckList = [...checkedList];
      tmpCheckList.forEach((item: any) => {
        fpsqduuids.push(item.fpsqduuid);
      });
      model.push({
        values: fpsqduuids,
        op: 'zdy',
        property: 'fpsqduuids'
      });
    } else {
      const cxParams = dealCxcs(queryModel, 1);
      if (cxParams?.searchModel && cxParams?.searchModel?.length > 0) {
        model.push(...cxParams?.searchModel);
      }
    }
    DDAlert.open({
      info: modalTitle,
      infoType: 'question',
      modalType: 'confirm',
      isFormContent: false,
      okText: '确定',
      closeStatus: false,
      okCallbackFn: async function (thisObj: any) {
        thisObj.setState({ masker: true });
        const obj: any = {
          sfBhsj: 'Y',
          sfScsm: 'Y',
          key: 'SAAS_CKFPKJ_FPSQD_FPHW_DC',
          exportFileCompleted: true,
          exportLarge: false, 
          searchModel:model
        }
        downloadTemplate(obj).then((res: any) => {
          thisObj.setState({ masker: false });
          DDAlert.close();
          const { code, body, desc } = res;
          if (code === '200') {
            const { wjm, wjlj } = body;
            myUtil.file.downloadFileByPath(wjlj, wjm);
          } else {
            message.error(desc);
          }
        });
      }
    });
  }

  const beforeUpload = (file: any) => {
    if(!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('上传文件必须是Excel文件。');
      return Upload.LIST_IGNORE;
    } else {
      return false;
    }
  }
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    if (e && e.fileList) {
      return e.fileList.filter((file: any) => file.status !== 'error');
    }
    if (e && e.target && e.target.files) {
      return Array.from(e.target.files);
    }
    return e && e.fileList ? e.fileList : e;
  };

  const dccwxx = () => {
    const params = {key: 'SAAS_CKFPKJ_FPSQD_DR'};
    setErrMasker(true);
    commonDrwtdc(params).then((response) => {
      setErrMasker(false);
      if (response.code === '200') {
        const {blob, fileName} = response.body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(response.desc);
      }
    });
  }

  const fpsqddr = () => {
    DDAlert.open({
      title: '发票申请单导入',
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      width: 720,
      content: <>
        <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="导入Excel文件" name="file" valuePropName="fileList" 
          rules={[{ required: true, message: '请选择上传的文件' }]} 
          getValueFromEvent={normFile}>
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
        <div style={{ color: "#E51C23" ,marginTop: '10px'}}>
            <p>导入说明：</p>
            <div style={{ marginLeft: '7px' }}>1. 模板：不单独提供导入模板，可直接使用系统导出模板；</div>
            <div style={{ marginLeft: '7px' }}>2. 更新：按“单据号+行号”匹配，仅更新购买方名称、备注、规格型号、金额。</div>
          </div>
      </>,
       okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          const formData = new FormData();
          formData.append('file', values.file[0].originFileObj);
          formData.append('importMode', '1');
          formData.append('key', 'SAAS_CKFPKJ_FPSQD_DR');
          const url = `/ty/hx/dr/importData`;
          importExecl(url, formData).then((response) => {
            const { code, body, msg } = response;
            if (code === '200') {
              DDAlert.close();
              message.success(msg);
              onFinish(queryModel);
            } else if (code === '900') {
              setModalVisibleExport(true);
              setErrListt(body.drycxx);
            } else {
              message.warning(msg);
            }
          }).catch(() => {
            message.error('导入失败，请重新上传文件。');
          }).finally(() => {
            thisObj.setState({ masker: false });
          });
        });
       }
    });
  }

  // 防止多次点击
  const qrkpsj_zxkp = debounce(function() {
    qrkpsj_zxkp2();
  }, 500);

  // 2.1.1上传检查(在线开票)
  const qrkpsj_zxkp2 = () => {
    if(data && data.length === 0) {
      message.info('当前无可操作的数据。');
      return;
    }
    setMasker(true);
    // 2.1.6发票申请单-开票统计
    const params: any = dealCzcs();
    params.key = 'FPZS_FPSQD_FPSQDFYLBCX';
    params.cxtj = searchModel?.searchModel || [];
    params.flag = '01'

    Promise.all([myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ:01')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01')
      setMasker(true);
      qrkpjy(params).then((res: any) => {
        setMasker(false);
        const { code, desc, msg } = res;
        if (code === '200') {
          // 数电票
          if (temp[0].fpkjfsDm === '2' && temp[0].fpzlDm1 === '5') {
            // 判断是否审核中
            setMasker(true);
            zxkpsjjc(params);

            // skxxcx().then((res1: any) => {
            //   setMasker(false);
            //   if (res1.code === '200') {
            //     const zcbz = res1.body.zcbz;
            //     if (zcbz === '2') {
            //       zxkpsjjc(params);
            //     } else {
            //       message.info('数电票在线开票注册审核中，请明天再试。')
            //     }
            //   } else {
            //     message.error(res1.desc);
            //   }
            // });
          } else {
            zxkpsjjc(params);
          }
        } else if (code === '900') {
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
          message.error(desc);
        }
      })
    });



  }



  
  //在线开票
  const zxkpsjjc = (params: any) => {
    setMasker(true);
    querySqdqrkptj(params).then((response) => {
      setMasker(false);
      let info = '确认对勾选数据进行审核操作吗？';
      if(params?.fpsqduuids?.length > 0){
       
      }else{
        info = '确认对当前筛选条件下的数据进行审核操作吗？'
      }
      const { code, body, desc } = response;
      if (code === '200') {
        DDAlert.open({
          title: '审核',
          info: info,
          infoType: 'question',
          modalType: 'confirm',
          isFormContent: false,
          content: [
            '单据号' + myUtil.text.formatNum(body.fpsqdzs, '0,0') + '张',
            '开票金额' + myUtil.text.formatNum(body.kpje, '0,0.00') + '元',
            '税额合计' + myUtil.text.formatNum(body.sehj, '0,0.00') + '元'
          ],
          closeStatus: false,
          okCallbackFn: function (thisObj: any) {
            thisObj.setState({ masker: true });
            params.flag = "01";
            setMasker(true);
            scjc(params).then((response) => {
              setMasker(false);
              const { code, body, desc } = response;
              DDAlert.close();
              if (code === '200') {
                message.success('审核申请成功！');
                onFinish(queryModel);
              } else {
                if (code === '300' && body.cwlx) {
                  let info = '';
                  if (body.cwlx === '1') {
                    info = '以下单据号备注超长，请调整备注后重新确认开票';
                  } else if (body.cwlx === '2') {
                    info = '以下单据号购买方失效，请调整购买方后重新确认开票';
                  } else if (body.cwlx === '3') {
                    info = '以下单据号申请单已开票，请重新选择';
                  }
                  let djbhs = body.djbhs ? body.djbhs : [];
                  if (djbhs.length > 1) {
                    djbhs.sort(function (a: any, b: any) {
                      if (a > b) {
                        return 1;
                      } else {
                        return -1;
                      };
                    })
                  }
                  const textAreaValues: any = []
                  djbhs.forEach((item: any) => {
                    textAreaValues.push(<div>{item}</div>)
                  })
                  DDAlert.open({
                    title: '审核失败',
                    infoType: 'warning',
                    modalType: 'info',
                    info: info,
                    content: <div className="fpsqd_qrkp_bzcheck">
                      {textAreaValues}
                    </div>,
                    okCallbackFn: function () {
                      DDAlert.close();
                    },
                  });
                } else if (code === '300') {
                  message.info('当前筛选条件下存在与当前设置的发票种类不一致的数据，不支持确认开票。')
                } else if (code === '900') {
                  message.error(desc)
                } else {
                  message.error(desc);
                }
              }
            })
          },
        });
      } else if (code === '300') {
        message.info('当前筛选条件下存在与当前设置的发票种类不一致的数据，不支持确认开票。')
      } else if (code === '900') {
        message.info(desc)
      } else {
        message.error(desc);
      }
    });
  }

  // 取消发票申请单
  const qxkpsqd = () => {
    if (!checkedList || checkedList.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    const params: any = dealCzcs();
    setMasker(true);
    querySqdqrkptj(params).then((response) => {
      setMasker(false);
      const { code, body, desc } = response;
      if (code === '200') {
        const titleMsg = intl2.formatMessage({ id: 'message_ckfp_fpsqd_del_title' });
        const infoMsg = intl2.formatMessage({ id: 'message_ckfp_fpsqd_del_info' });
        const tmpfMsg = intl2.formatMessage({ id: 'message_ckfp_fpsqd_qrkp_content_f' });
        const confMsg = myUtil.text.formatRepalce(tmpfMsg, { fpsqdzs: myUtil.text.formatNum(body.fpsqdzs, '0,0') });
        const tmpsMsg = intl2.formatMessage({ id: 'message_ckfp_fpsqd_qrkp_content_s' });
        const consMsg = myUtil.text.formatRepalce(tmpsMsg, { kpje: myUtil.text.formatNum(body.kpje, '0,0.00') });
        const tmptMsg = intl2.formatMessage({ id: 'message_ckfp_fpsqd_qrkp_content_t' });
        const contMsg = myUtil.text.formatRepalce(tmptMsg, { bgdzs: myUtil.text.formatNum(body.bgdzs, '0,0') });
        DDAlert.open({
          title: titleMsg,
          info: infoMsg,
          infoType: 'question',
          modalType: 'confirm',
          isFormContent: false,
          content: [
            confMsg,
            consMsg,
            contMsg,
          ],
          okCallbackFn: function (thisObj: any) {
            thisObj.setState({ masker: true });
            sqdSccz(params).then((response) => {
              const { code, desc } = response;
              if (code === '200') {
                DDAlert.close();
                message.success(intl2.formatMessage({ id: 'message_ckfp_fpsqd_del_success' }));
                onFinish(queryModel);
              } else {
                message.error(desc);
              }
            })
          },
        });
      } else {
        message.error(desc);
      }
    });
  }

  // 单据号重排
  const djhcp = () => {
    if (data.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_ckfp_fpsqd_djhcp_check' }));
      return;
    }
    setMasker(true);
    sqddjxhcp({}).then((response) => {
      const { code, desc } = response;
      if (code === '200') {
        message.success(intl2.formatMessage({ id: 'message_ckfp_fpsqd_djhcp_success' }));
        onFinish(queryModel);
      } else {
        message.error(desc);
      }
    });
  }

  // Checkbox 选中事件
  const onChange = (list: any) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < data.length);
    setCheckAll(list.length === data.length);
  };

  // 左侧列表点击，获取明细
  const getDetail = (item: any, index: number) => {
    setActiveTab("1");
    const divCards: any = document.querySelectorAll(".fpsqd_item");
    divCards.forEach((card: any) => {
      card.classList.remove('selected');
    });
    const divCardCurrent: any = document.querySelector(".fpsqd_item" + index);
    divCardCurrent?.classList?.add('selected');

    const param: any = { fpsqduuid: item.fpsqduuid };
    sqdmxcx(param);
  }

  // 右侧信息查询
  const sqdmxcx = (param: any) => {
    setMasker(true);
    querySqdmxcx(param).then((response) => {
      setMasker(false);
      const { code, body, desc } = response
      if (code === '200') {
        const { fpsqdxx, hwxxList, bgdxxList } = body;
        setFpxx(fpsqdxx);
        setHwqdLen(hwxxList.length);
        if (hwxxList.length > 0) {
          const tmpHwxxList: any = [];
          hwxxList.forEach((item: any) => {
            item.uuid = myUtil.text.uuid(32);
            tmpHwxxList.push(item);
          });
          if (tmpHwxxList.length < 8) {
            for (let i = tmpHwxxList.length; i < 8; i++) {
              tmpHwxxList.push({ uuid: 'rowkey' + i.toString() });
            }
          }
          setHwqdList([]);
          setHwqdList(tmpHwxxList);
        }
        if (bgdxxList?.length > 0) {
          const tmpBgdxxList: any = [];
          bgdxxList.forEach((item: any) => {
            item.uuid = myUtil.text.uuid(32);
            if (item.children) {
              item.children.forEach((item1: any) => {
                delete item1.bgdhgbh;
              })
            }
            tmpBgdxxList.push(item);
          })
          setBgdxqList([]);
          setBgdxqList(bgdxxList);
        }
      } else {
        ycxxIsNull();
        message.error(desc);
      }
    });
  }

  // 保存
  const save = () => {
    if (JSON.stringify(fpxx) === '{}') {
      message.info(intl2.formatMessage({ id: 'message_ckfp_fpsqd_save_nodata' }));
      return;
    }
    const param: any = invoicemRef.current.handleSave();
    if (hwqdList?.length > 8) {
      const hwdqMx: any = hwqdRef.current.handleSave();
      param.hwxxList = hwdqMx;
    }

    // 解决加载loading时，数据显示修改前数据的问题
    param.hwxxList.forEach((item: any, index: any) => {
      hwqdList.splice(index, 1, item)
    });
    for (const key in fpxx) {
      fpxx[key] = param[key];
    }
    const bzText = param?.bz || '';
    const fpzlDm1 = param?.fpzlDm1;
    if (bzText.indexOf('流水号') < 0 && fpzlDm1 === '5' && tempCode?.fpkjfsDm != '2') {
      DDAlert.open({
        title: '保存',
        infoType: 'warning',
        modalType: 'info',
        info: '发票信息备注栏“流水号”不存在，发票回填时需手动维护。',
        isShowcancelText: false,
        okCallbackFn: function () {
          DDAlert.close();
          setMasker(true);
          saveFpsqdxxbc(param).then((response) => {
            setMasker(false);
            const { code, desc } = response;
            if (code === '200') {
              message.success(intl2.formatMessage({ id: 'message_ckfp_fpsqd_save_success' }));
              onFinish(queryModel);
            } else {
              message.error(desc);
            }
          });
        },
      });
    } else {
      setMasker(true);
      saveFpsqdxxbc(param).then((response) => {
        setMasker(false);
        const { code, desc } = response;
        if (code === '200') {
          message.success(intl2.formatMessage({ id: 'message_ckfp_fpsqd_save_success' }));
          onFinish(queryModel);
        } else {
          message.error(desc);
        }
      });
    }
  }
  // 调整
  const adjust = () => {
    for (let i = 0; i < checkedList.length - 1; i++) {
      if (checkedList[i].fpzlDm1 != checkedList[i + 1].fpzlDm1) {
        message.info('勾选数据中存在发票种类不一致的数据，不支持调整开票。');
        return;
      }
    }
    if (!checkedList || checkedList.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    if (checkedList.length > 10) {
      // 每次调整不能超过10条
      message.info(intl2.formatMessage({ id: 'message_ckfp_fpsqd_kptz_check' }));
      return;
    }
    // var checkeds = checkedList.filter((x:any)=>x.fpzlDm1 === "5");
    // if(checkeds!=null && checkeds.length > 0){
    //   message.info(intl2.formatMessage({ id: 'message_ckfp_fpsqd_szkp_qlfpinfo' }));
    //   return;
    // }

    const arr: any = [];
    checkedList.forEach((item: any) => {
      arr.push(item.fpsqduuid);
    });
    const params: any = {
      fpsqduuids: arr
    }
    setMasker(true);
    xzsqdtzmxcx(params).then((response) => {
      setMasker(false);
      const { code, body, desc } = response;
      if (code === '200') {
        const tmpKeys: any = [];
        const tmptzData: any = [];
        const tmptzMxData: any = [];
        body.forEach((item: any) => {
          const uuid = myUtil.text.uuid(32);
          item.uuid = uuid;
          item.gmfjzfpsqduuid = item.fpsqduuid;
          item.fpzlDm1 = checkedList[0].fpzlDm1;
          tmptzData.push(item);
          tmpKeys.push(uuid);
          item.children.forEach((item1: any) => {
            item1.mbdjbh = item1.djbh;
            item1.zshh = item1.hh;
            item1.gmfjzfpsqduuid = item1.fpsqduuid;
            item1.ghfnsrmc = item.ghfnsrmc;
            tmptzMxData.push(item1);
          });
        });
        setExRowKeys(tmpKeys);
        setTzData(tmptzData);
        setTzMxData(tmptzMxData);
        setTzModalVisible(true);
      } else {
        message.error(desc);
      }
    })
  }
  // 调整页面保存
  // const handleFpsqdTzSave = () => {
  //   setTzModalVisible(false);
  //   // 子表数据
  //   const saveData = refFpsqdtz.current!.handleSave1();
  //   // 查询配置
  //   Promise.all([myUtil.code.getCodeFromServerT1('CODE_DM_ZXSB_FPBZZDXFGF:01'), myUtil.code.getCodeFromServerT1('CODE_DM_ZXSB_FPBZDTSJFGF:01'), myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ:01')]).then(() => {
  //   }).catch(() => {
  //   }).finally(() => {
  //     // 设置 字段项分割符
  //     const fpbzzdxfgfDmData = myUtil.code.getCode('CODE_DM_ZXSB_FPBZZDXFGF:01');
  //     // 设置多条数据分割符
  //     const fpbzdtsjfgfDmData = myUtil.code.getCode('CODE_DM_ZXSB_FPBZDTSJFGF:01');
  //     // 设置税控盘类型
  //     const cspz = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
  //     // 税盘类型
  //     const splx = cspz[0].fpsplxDm;
  //     // 发票类型
  //     const fplx = cspz[0].fpzlDm1;
  //     //确定备注最大字符长度限制
  //     let maxBzLength = 0;
  //     if (splx === '1') {
  //       maxBzLength = 230;
  //     } else {
  //       if (fplx === '3') { // 普票
  //         maxBzLength = 138;
  //       } else {
  //         maxBzLength = 130;
  //       }
  //     }
  //     // 查询业务字段项和基本数据项
  //     setMasker(true);
  //     bzglcx({}).then((response) => {
  //       const { code, body, desc } = response;
  //       setMasker(false);
  //       if (code === '200') {
  //         const sbwz = body[0].fpbzsbwz; //首部文字
  //         const fpbzzdxfgfDm = body[0].fpbzzdxfgfDm; //字段分隔符
  //         const fpbzzdxfgfDmCheck = fpbzzdxfgfDmData.filter((item: any) => item.fpbzzdxfgfDm === fpbzzdxfgfDm)[0];
  //         const fpbzzdxhhbz = body[0].fpbzzdxhhbz; // 字段项换行
  //         const fpbzdtsjfgfDm = body[0].fpbzdtsjfgfDm; // 多条字段分割符
  //         const fpbzdtsjfgfDmCheck = fpbzdtsjfgfDmData.filter((item: any) => item.fpbzdtsjfgfDm === fpbzdtsjfgfDm)[0];
  //         const fpbzgdjqws = body[0].fpbzgdjqws; // 报关单截取规则
  //         // 获取选中的配置数据项
  //         const ywzdx = body.filter((item: any) => item.xzbz2 === 'Y');
  //         const temp: any = [];
  //         ywzdx.forEach((ywzdxTemp: any) => {
  //           const ywData: any = [];
  //           saveData.tzFpxxList.forEach((item: any) => {
  //             item.hwxxList.forEach((dataTemp: any) => {
  //               function getLszd(param: any) {
  //                 if (param === 'CJHBMC') {// 原币币制
  //                   return 'cjhbmc'
  //                 } else if (param === 'CJHBHL') {// 原币汇率
  //                   return 'cjhbhl'
  //                 } else if (param === 'CJZJ') {// 原币金额
  //                   return 'cjzj'
  //                 } else if (param === 'HGCJFSMC') {// 成交方式
  //                   return 'hgcjfsmc'
  //                 } else if (param === 'JGFS_DM') {// 监管方式代码
  //                   return 'jgfsDm'
  //                 } else if (param === 'JGFSMC') {// 监管方式名称
  //                   return 'jgfsmc'
  //                 } else if (param === 'HGGQKAJC') {// 出口口岸
  //                   return 'hggqkajc'
  //                 } else if (param === 'MYLAJ') {// 美元FOB价
  //                   return 'mylaj'
  //                 } else if (param === 'CKHTH') {// 合同协议号
  //                   return 'ckhth'
  //                 } else if (param === 'CKRQ_1') {// 出口日期
  //                   return 'ckrq1'
  //                 } else if (param === 'TYDH') {// 提运单号
  //                   return 'tydh'
  //                 } else if (param === 'BGDHGBH') {// 报关单号
  //                   return 'bgdhgbh'
  //                 } else if (param === 'BAH') {// 备案号
  //                   return 'bah'
  //                 } else {
  //                   return ''
  //                 }
  //               }
  //               const lszd = getLszd(ywzdxTemp.fpbzywzdywm)
  //               if (dataTemp[lszd]) {
  //                 ywData.push(dataTemp[lszd]);
  //               } else {
  //                 ywData.push('');
  //               }
  //             });
  //           });
  //           ywzdxTemp.data = ywData;
  //           temp.push(ywzdxTemp)
  //         });

  //         // 首部文字
  //         let bz = gtJoin(splx, sbwz, fpbzzdxhhbz, ywzdx.length, fpbzzdxfgfDmCheck.fpbzzdxfgffh);

  //         // 将准备好的数据组装成备注
  //         temp.forEach((ywzdxData: any) => {
  //           if ("01" === ywzdxData.fpbzywzdDm) {
  //             let bgh = '';
  //             ywzdxData.data.forEach((bgdData: any, index: any) => {
  //               if (ywzdxData.data.length === index + 1) {
  //                 bgh = bgh + bgdData.substring(bgdData.length - fpbzgdjqws)
  //               } else {
  //                 bgh = bgh + bgdData.substring(bgdData.length - fpbzgdjqws) + fpbzdtsjfgfDmCheck.fpbzdtsjfgffh;
  //               }
  //             });
  //             bz = bz + ((ywzdxData.lbm.trim()) ? (ywzdxData.lbm.trim()) : ywzdxData.fpbzywzdzwm) + ':' + gtJoin(splx, bgh, fpbzzdxhhbz, ywzdx.length, fpbzzdxfgfDmCheck.fpbzzdxfgffh);
  //           } else {
  //             // 其他字段
  //             let qt = '';
  //             ywzdxData.data.forEach((qtDdata: any, index: any) => {
  //               if (ywzdxData.data.length === index + 1) {
  //                 qt = qt + qtDdata
  //               } else {
  //                 qt = qt + qtDdata + fpbzdtsjfgfDmCheck.fpbzdtsjfgffh;
  //               }
  //             });
  //             bz = bz + ((ywzdxData.lbm.trim()) ? (ywzdxData.lbm.trim()) : ywzdxData.fpbzywzdzwm) + ':' + gtJoin(splx, qt, fpbzzdxhhbz, ywzdx.length, fpbzzdxfgfDmCheck.fpbzzdxfgffh);
  //           }
  //         });
  //         const tempBz = bz.replace(/\n/g, "")
  //         if (tempBz.length > maxBzLength) {
  //           bzLengthCcShow(bz);
  //         } else {
  //           saveBz(bz);
  //         }
  //       } else {
  //         message.error(desc);
  //       }
  //     })
  //   });
  // }

  /**
   * 保存备注
   */
  const saveBz = (param: any) => {
    const saveData = refFpsqdtz.current!.handleSave1();
    refFpsqdtz.current?.changeMasker(true);
    xzsqdtzbc(saveData).then((response) => {
      refFpsqdtz.current?.changeMasker(false);
      const { code, desc } = response;
      if (code === '200') {
        setTzModalVisible(false);
        message.success(intl2.formatMessage({ id: 'message_ckfp_fpsqd_kptz_success' }));
        onFinish(queryModel);
      } else {
        message.error(desc);
      }
    })
  }

  /**
   *
   * @param splx 税盘类型
   * @param zd  字段
   * @param zdxhh  字段是否换行
   * @param ywdxLength 要显示的业务字段长度
   * @param zdfgf 字段分割符
   */
  // const gtJoin = (splx: string, zd: any, zdxhh: any, ywdxLength: any, zdfgf: any) => {
  //   let bzTemp = '';
  //   if (splx === '2' || splx === '3') {
  //     if (ywdxLength > 4) {
  //       // 不换行
  //       bzTemp = zd + zdfgf;
  //     } else {
  //       // 字段项换行
  //       if (zdxhh === 'Y') {
  //         // 换行
  //         bzTemp = zd + zdfgf + '\n';
  //       } else {
  //         // 不换行
  //         bzTemp = zd + zdfgf;
  //       }
  //     }
  //   } else {
  //     if (ywdxLength > 6) {
  //       // 不换行
  //       bzTemp = zd + zdfgf;
  //     } else {
  //       // 字段项换行
  //       if (zdxhh === 'Y') {
  //         // 换行
  //         bzTemp = zd + zdfgf + '\n';
  //       } else {
  //         // 不换行
  //         bzTemp = zd + zdfgf;
  //       }
  //     }
  //   }
  //   return bzTemp;
  // }

  // 备注超长提示
  // const bzLengthCcShow = (value: any) => {
  //   DDAlert.open({
  //     title: '设置备注',
  //     closeStatus: true,
  //     isFormContent: false,
  //     modalType: 'form',
  //     okCallbackFn: function () {
  //       const xghbz = bzform.getFieldValue("bzInfo")
  //       saveBz(xghbz);
  //     },
  //     content: <>
  //       <Alert
  //         message="备注内容超长，请修改备注信息。"
  //         showIcon
  //         type="error"
  //         style={{ marginBottom: '10px' }}
  //       />
  //       <Form name="basic" form={bzform} labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} initialValues={{ bzInfo: value }}>
  //         <Form.Item
  //           name="bzInfo"
  //           label={<Tooltip
  //             title={(
  //               <div>
  //                 <div>1.金税盘:备注长度230个字符，回车超过6行将自动变为一行</div>
  //                 <div>2.税控盘:普通发票备注长度138个字符，电子普票130个字符，回车超过4行将自动变为一行</div>
  //               </div>
  //             )}
  //           >备注<QuestionCircleOutlined />
  //           </Tooltip>}
  //         >
  //           <Input.TextArea name="bzInfo"
  //             autoSize={{ minRows: 5, maxRows: 6 }}
  //             showCount
  //             className="bzTextArea"
  //           />
  //         </Form.Item>
  //       </Form>
  //     </>,
  //   });
  // }

  // 合并单据号
  const handleFpsqdTzHb = () => {
    refFpsqdtz.current!.handleHbdjh();
  }

  // 拆分单据号
  const handleFpsqdTzCf = () => {
    refFpsqdtz.current!.handleCfdjh();
  }

  // tab change
  const tabCallback = (key: any) => {
    setActiveTab(key);
    const param: any = invoicemRef?.current?.handleSave();
    delete param.hwxxList;
    setFpxx(param);
    if (key === '1' && hwqdList.length > 8) {
      setHwqdList(hwqdRef?.current?.handleSave());
    }
  }

  // 点击发票货物清单链接
  const clickLinkFun = () => {
    setActiveTab("3");
  }

  // 查询购买方下拉数据
  const queryGhfnsrmcList = async (params: any) => {
    const result = await queryParams(params);
    if (result.code === '200') {
      return result.body;
    } else {
      return [];
    }
  }

  useEffect(() => {
    // 设置最高开票限额
    Promise.all([myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ:01'), queryGhfnsrmcList({ key: 'GFCX_CS_ZXSB_FPKJ_KHGLPZ', searchModel: [{ property: 'qybz', value: 'Y', op: 'dd' }] })]).then((res) => {
      const tmpList: any = [];
      res[1].forEach((item: any) => {
        item.value = item.ghfnsrmc;
        item.label = item.ghfnsrmc;
        tmpList.push(item);
      })
      setGmfList(tmpList);
    }).catch(() => {
    }).finally(() => {
      const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
      let xe;
      loadMoreData({fpzlDm1: temp[0]?.fpzlDm1});
      if (temp[0] && temp[0]?.fpzgkpxeDm === '2') {
        xe = 99999.99;
      } else if (temp[0] && temp[0]?.fpzgkpxeDm === '3') {
        xe = 999999.99;
      } else if (temp[0] && temp[0]?.fpzgkpxeDm === '4') {
        xe = 9999999.99;
      } else if (temp[0] && temp[0]?.fpzgkpxeDm === '5') {
        xe = 99999999.99;
      } else {
        xe = 9999.99;
      }
      setFpzgkpxe(xe);
      setFpmxLen(((temp[0] && temp[0]?.fpmxkjmsDm === '2') && temp[0]?.fpzlDm1 === '3') ? true : false);
      // 判断是否为在线开票
      if (temp[0]?.fpkjfsDm === '2') {
        searchForm.setFieldsValue({ fpzlDm1: temp[0]?.fpzlDm1, bgdhgbh: '', ckhth: '', sjztDm: undefined })
      } else {
        searchForm.setFieldsValue({ fpzlDm1: '', bgdhgbh: '', ckhth: '', sjztDm: undefined })
      }
      setTempCode(temp[0]); // 保存配置项
    });
  }, []);

  const content = (param: any) => {
    const array: any = [];
    param.forEach((element: any) => {
      array.push(<div key={element}>{element}</div>)
    });
    return array;
  };

  const setFullScreen = () => {
    setFullScreenView(!fullScreenView);
    const divRight: any = document.querySelector(".dd_fp_wrap .lay_wrap_right");
    const isFullView = divRight.classList.contains('full_screen_view');
    divRight.classList.toggle('full_screen_view', !isFullView)
  }
  //追加备注
  const zjbzx = () => {
    if (!checkedList || checkedList.length === 0) {
      message.info('当前无可操作的数据。');
      return;
    }
    refZjbz.current!.showModal(checkedList);
  }



  const leftContent = <div className="left_content">
    <div className="left_toolbar">
      <Space size={0}>
        {tempCode?.fpkjfsDm === '1' ?
          <Button type='link' onClick={qrkpsj}>确认开票</Button>
          : <Button type='link' onClick={qrkpsj_zxkp}>审核</Button>
        }
        <Dropdown placement="bottomRight" overlay={(
          <Menu>
            <Menu.Item key="1" onClick={djhcp}>单据号重排</Menu.Item>
            <Access accessible={!access.isNsrsbh} fallback={<></>}>
              <Menu.Item key="2" onClick={adjust}>调整开票</Menu.Item>
            </Access>
            <Menu.Item key="3" onClick={qxkpsqd}>删除</Menu.Item>
            <Menu.Item key="4" onClick={zjbzx}>追加备注项</Menu.Item>
            <Menu.Item key="5" onClick={fpsqddc}>导出</Menu.Item>
            <Menu.Item key="6" onClick={fpsqddr}>导入</Menu.Item>
          </Menu>
        )}>
          <Button type="link">更多<DownOutlined /></Button>
        </Dropdown>
      </Space>
    </div>
    <div className="left_card_header">
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} /><span className="lch_title">发票申请单</span>
      <a className="lch_btn" onClick={toggleCollapsed}>{collapsed ? '展开' : '收起'}</a>
    </div>
    <div
      id="scrollableDiv"
      style={{
        height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '69px', '40px', '40px', '20px']),// 44页头 40margin 69搜索栏 40工具栏 40工具栏 20padding
        overflow: 'auto',
        marginBottom: '20px',
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={gdloadMoreData}
        hasMore={data.length < maxRowCount}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        // endMessage={<Divider plain>It is all, nothing more</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <Checkbox.Group value={checkedList} onChange={onChange}>
          <List
            dataSource={data}
            renderItem={(item: any, index: number) => (
              <List.Item key={item.fpsqduuid} onClick={() => getDetail(item, index)} className={`fpsqd_item fpsqd_item${index} ${index === 0 ? 'selected' : ''}`}>
                <ProCard
                  title={(<>
                    <Checkbox value={item} onClick={(e) => { e.stopPropagation(); }} />
                    {collapsed ?
                      <>
                        <span className="dcl_title_sq">{item.djbh}<span className="dcl_title_sq_jshj">¥{myUtil.text.formatNum(item.jshj, '0,0.00')}</span></span>
                      </> :
                      <><span className="dcl_title">单据号：{item.djbh}
                        {item?.sbyy1 && tempCode?.fpkjfsDm === '2' ? <Tooltip title={item?.sbyy1}><span style={{ marginLeft: '8px' }}>
                          <WarningOutlined style={{ color: '#ef8724', cursor: "pointer" }} />
                        </span></Tooltip> : <></>}
                      </span></>}
                  </>)}
                  size="small"
                  collapsible
                  collapsed={collapsed}
                >
                  <div className="dd_card_list">
                    <div className="dcl_item">价税合计：¥{myUtil.text.formatNum(item.jshj, '0,0.00')}</div>
                    {item.bgdhgbhs.split(',').length > 1 ?
                      <><div className="dcl_item">
                        <Popover placement="right" content={content(item.bgdhgbhs.split(','))} title="报关单">
                          报关单<span className="dcl_item_h">{item.bgdhgbhs.split(',').length}</span>张：<a>{item.bgdhgbhs.split(',')[0]}...</a>
                        </Popover></div></> :
                      <><div className="dcl_item">报关单<span className="dcl_item_h">1</span>张：{item.bgdhgbhs}</div></>}
                    <div className="dcl_item">发票种类：{item.fpzlmc}</div>
                  </div>
                </ProCard>
              </List.Item>
            )}
          />
        </Checkbox.Group>
      </InfiniteScroll>
    </div>
  </div>;

  const rightContent = <>
    <div className="lay_wrap_right_d">
      <Tabs activeKey={activeTab} onChange={tabCallback} tabBarExtraContent={<>
        <Button type='link' onClick={() => { save() }}>保存</Button>
        <Button type='link' onClick={() => { setFullScreen() }}>
          {
            fullScreenView ?
              <FullscreenExitOutlined /> : <FullscreenOutlined />
          }
        </Button>
      </>}>
        <Tabs.TabPane tab={`发票信息 (${hwqdLen})`} key="1">
          <Invoice mklx="FPSQD" onRef={invoicemRef} data={{ fpsqdxx: fpxx, hw: hwqdList }} clickLinkFun={clickLinkFun} readonly={editFlag} gmfxx={gmfList} />
        </Tabs.TabPane>
        {hwqdList?.length > 8 ? <> <Tabs.TabPane tab={`货物清单 (${hwqdLen})`} key="3" forceRender={true}>
          <Hwqd mklx="FPSQD" onRef={hwqdRef} data={hwqdList} />
        </Tabs.TabPane></> : <></>}
        <Tabs.TabPane tab={`报关单详情 (${bgdxqList?.length || 0})`} key="2">
          <Bgdxq data={bgdxqList} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  </>;


  // 关闭弹窗 调用订单提交开票
  const sfyzCloseModel = () => {
    if (refSfyz) {
      refSfyz.current!.closeModal(); // 关闭电子税务局身份验证
    }
    kpSuccess({}, 'tj');
  }

  const kpSuccess = (obj: any, flag: any) => {
    if (flag === 'tj') {
      setMasker(true);
      sdpddtjkp(tjkpParams).then((res2: any) => {
        setMasker(false);
        const { code, body, desc, msg } = res2;
        if (code === '200') {
          const rtnCode = body.rtnCode;
          if (rtnCode === '200') {
            message.success(intl2.formatMessage({ id: 'message_ckfp_fpsqd_qrkp_success' }));
            onFinish(queryModel);
          } else if (rtnCode === '2004') {
            refSfyz.current!.showModal(); // 打开电子税务局身份验证
          } else if (rtnCode === '2005') {
            refKprz.current!.showModal(); // 打开二维码身份验证
          }
        } else if (code === '900') {
          // 业务校验
          const sbyyList = body?.drycxx;
          const ts = body.cgts;
          onFinish(queryModel);
          openYwjyModal(sbyyList, ts, true);
        } else if (code === '0') {
          message.error('系统异常，请联系技术支持。');
        } else {
          message.error(desc)
        }
      })
    } else {
      setMasker(true);
      sdpqrkp(obj).then((res1: any) => {
        setMasker(false);
        if (res1.code === '200') {
          const body = res1.body;
          if (body.rtnCode === '2004') {
            const paramsTj = {
              data: body.data,
              flag: body.flag,
            }
            setTjkpParams(paramsTj)
            refSfyz.current!.showModal();
          } else if (body.rtnCode === '2005') {
            // 二次认证
            refKprz.current!.showModal();
          } else if (body.rtnCode === '200') {
            message.success(intl2.formatMessage({ id: 'message_ckfp_fpsqd_qrkp_success' }));
            onFinish(queryModel);
          }
        } else if (res1.code === '900') {
          // 业务校验
          const sbyyList = res1.body?.drycxx || [];
          onFinish(queryModel);
          openYwjyModal(sbyyList, '', true);
        } else if (res1.code === '0') {
          message.error('系统异常，请联系技术支持。');
        } else {
          message.error(res1.desc);
        }
      })
    }
  }

  // 二次二维码
  const openSfyzModal = () => {
    refKprz.current!.closeModal(); // 关闭二维码身份验证
    refSfyz.current!.showModal(); // 打开电子税务局身份验证
  }

  // 业务校验900
  const openYwjyModal = (data: any, ts: any, isDc: any) => {
    const textAreaValues: any = []
    data.forEach((item: any, index: any) => {
      textAreaValues.push(
        <tr>
          <td width='20%' className='fpsqd_qrkp_textCenter'>{index + 1}</td>
          <td width='35%' className='fpsqd_qrkp_textCenter'>{item.djbh}</td>
          <td width='45%' className='fpsqd_qrkp_textCenter'>
            <Tooltip title={item?.msg ? item?.msg : item?.sbyy}>
              <div className='fpsqd_qrkp_textName'>{item?.msg ? item?.msg : item?.sbyy}</div>
            </Tooltip>
          </td>
        </tr>
      )
    })
    const infoText = ts ? `已成功${ts}条数据，以下单据号无法确认开票，请调整数据后重新操作。` : '以下单据号无法确认开票，请调整数据后重新操作。'
    const btnArry: any = [];
    if (isDc) {
      btnArry.push(<Button key={"dc"} onClick={() => handleDownload('DC_HX_DC_DRWTDC')}>导出</Button>)
    }
    DDAlert.open({
      title: '确认开票',
      infoType: 'warning',
      modalType: 'info',
      info: infoText,
      width: '600px',
      button: isDc,
      content:
        <table className="fpsqd_qrkp_kpsb">
          <tr style={{ backgroundColor: '#FAFAFA' }}>
            <th>序号</th>
            <th>单据号</th>
            <th>失败原因</th>
          </tr>
          {textAreaValues}
        </table>,
      okCallbackFn: function () {
        DDAlert.close();
      },
    });
  }

  // 导出
  const handleDownload = (id: any) => {
    const params = { key: id };
    setMasker(true);
    commonDrwtdc(params).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        const { blob, fileName } = response.body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(response.desc);
      }
    });
  }

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_fp_wrap">
        <ProCard className="dd-filter-wrap" title={
          <Form layout="inline" form={searchForm} onFinish={onFinish}>
            <Form.Item name="bgdhgbh">
              <Input placeholder="18位或后4位报关单号/统一编号" allowClear style={{ width: 240 }} />
            </Form.Item>
            {
              tempCode?.fpkjfsDm === '2' ?
                <> <Form.Item name="sjztDm">
                  <Select placeholder="数据状态" allowClear style={{ width: 140 }}>
                    <Select.Option key='1' value='1'>未审核</Select.Option>
                    <Select.Option key='2' value='2'>审核通过</Select.Option>
                    <Select.Option key='3' value='3'>开票失败</Select.Option>
                  </Select>
                </Form.Item>
                  </> : <></>
            }
            <Form.Item name="ckhth">
              <Input.Search placeholder="出口合同号" allowClear enterButton="查询" onSearch={handleSearch} />
            </Form.Item>
          </Form>
        }>
        </ProCard>
        <div className="dd_fpsqd_wrap" style={{ position: 'relative', padding: '0 0 0 361px' , overflow: 'auto'}}>
          <div className="lay_wrap_left" style={{ position: 'absolute', top: '0', left: '0' }}>
            {leftContent}
          </div>
          <div className="lay_wrap_right">
            {rightContent}
          </div>
        </div>
      </ProCard>
      {/* <DjhcpGrid
        onRef={refDDModalGrid}
        onOk={savedjhcp} /> */}
      <Drawer
        title="发票申请单数据调整"
        visible={tzModalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X3}
        onClose={() => { setTzModalVisible(false) }}
        className="fpsqd_tz_drawer"
        destroyOnHidden={true}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={() => setTzModalVisible(false)} style={{ marginRight: '10px' }}>取消</Button>
            <Button onClick={handleFpsqdTzCf} type="primary" style={{ marginRight: '10px' }}>拆分到新单据号</Button>
            <Button onClick={handleFpsqdTzHb} type="primary" style={{ marginRight: '10px' }}>合并到已有单据号</Button>
            <Button onClick={saveBz} type="primary" style={{ marginRight: '10px' }}>保存</Button>
          </>
        }
        footerStyle={{ textAlign: 'right' }}
      >
        <Fpsqdtz onRef={refFpsqdtz} tzData={tzData} tzMxData={tzMxData} exRowKeys={exRowKeys} fpzgkpxe={fpzgkpxe} fpmxLen={fpmxLen} />
      </Drawer>
      <SfyzModal onRef={refSfyz} handleColseModal={sfyzCloseModel} />
      <KprzModal onRef={refKprz} handleOtherModal={openSfyzModal} handleColseModal={sfyzCloseModel} />
      <Zjbz onRef={refZjbz} handleModal={closeModal} />
      <Modal
        title="数据检查异常疑点列表"
        destroyOnHidden={true}
        visible={modalVisibleExport}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        wrapClassName="standard-modal-1"
        footer={
          <>
           <Button onClick={() => {
              setModalVisibleExport(false);
              setErrListt([]);
            }}>关闭</Button>
            <Button onClick={dccwxx} type="primary" >导出数据</Button>

          </>
        }
        onCancel={() => {
          setModalVisibleExport(false);
          setErrListt([]);
        }}
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={errMasker} delay={100}>
        <DDBaseGrid
          userDataSource={errList}
          components={true}
          columns={errColumns}
          pagination={false}
          scroll={{ x: '0px' }}
        />
        </Spin>
      </Modal >

      
    </Spin>
  );
};

export default Fp;