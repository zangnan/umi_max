// 智能配单-手动配单
import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/components/DDAssist/util';
import { Spin, Button, message, Drawer, Form, Space, Input, DatePicker, Popconfirm, Radio, Row, Col} from 'antd';
import shsdppStyle from './style.less';
import { initShsdPpsj, queryShglWppBgd, queryShglYppBgd, deleteShglYppBgd, addShglWppBgd, hqFhfs, aotuShglPp, bcShglPpjg, shglsdppGxPpBz, shglDelSdbgdlsb } from '@/pages/hts/services/htsApi';
import CONSTANTS from '@/components/DDAssist/constants';
import { SearchOutlined } from '@ant-design/icons';
import YppBgdGrid from './yppBgdGrid';
import WppBgdGrid from './wppBgdGrid';
import moment from 'moment';
import DDAlert from '@/pages/hts/components/DDAlert';
import { history } from 'umi';
import Gdpp from './modal_gdpp';
import Htpp from './modal_htpp';
import Ppjg from './modal_ppjg';


// import { await } from '@umijs/deps/compiled/signale';


export interface ShsdsjPpProps {
  onRef?: any;
}

const ShsdsjPp: React.FC<ShsdsjPpProps> = ({
  onRef
}) => {

  const [masker, setMasker] = useState<boolean>(false);

  const pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
    size: 'default',
    showLessItems: true,
    hideOnSinglePage: false,
    showSizeChanger: true,
    showQuickJumper: false,
    pageSizeOptions: [10, 20],
    showTotal(total: any, range: any[]) {
      return `共${total}条，当前${range[0]}到${range[1]}条`;
    },
  };

  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [params, setParams] = useState<any>({});
  const [topData, setTopData] = useState<any>({});
  const [topForm] = Form.useForm();
  const [dqPpbzDm, setDqPpbzDm] = useState<any>('');
    // 已匹配
  const [yppBgdForm] = Form.useForm();
  const refYppBgdGrid: any = useRef();
  const [yppBgdMasker, setYppBgdMasker] = useState<any>(false);
  const [yppBgdDataSource, setYppBgdDataSource]= useState<any>([]);
  const [yppBgdPagination, setYppBgdPagination] = useState<any>(pagination);
  const [selectYppBgdRowKeys, setSelectYppBgdRowKeys] = useState<any>([]);                  // 选中的行的key
  const [selectYppBgdRows, setSelectYppBgdRows] = useState<any>([]);                        // 选中的行的值
  // 未匹配
  const [wppBgdForm] = Form.useForm();
  const refWppBgdGrid: any = useRef();
  const [wppBgdMasker, setWppBgdMasker] = useState<any>(false);
  const [wppBgdDataSource, setWppBgdDataSource]= useState<any>([]);
  const [selectWppBgdRowKeys, setSelectWppBgdRowKeys] = useState<any>([]);                  // 选中的行的key
  const [selectWppBgdRows, setSelectWppBgdRows] = useState<any>([]);                        // 选中的行的值
  const [gxWppBgdWshje, setGxWppBgdWshje] = useState<Number>(0);                        // 选中的行的值
  const [gxWppBgdWshrmbje, setGxWppBgdWshrmbje] = useState<Number>(0);                        // 选中的行的值
  const [rwuuid1, setRwuuid1] = useState<any>('');

  const refGdpp: any = useRef();
  const refHtpp: any = useRef();
  const refPpjg: any = useRef();


  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


    // 开启
  const showModal = (param: any, id: any) => {
    setRwuuid1(id);
    setYppBgdPagination(pagination);
    setParams(param);
    setTopData(param?.record);
    setWppBgdDataSource([]);
    setSelectWppBgdRowKeys([]);
    setSelectWppBgdRows([]);
    // param?.refUnit?.current?.setMasker(false);
    setDqPpbzDm(param?.record?.ppbzDm);
    topForm.setFieldsValue({ppbzDm:param?.record?.ppbzDm });
    setDrawerVisible(true);
  };

  useEffect(() => {
    if (drawerVisible && rwuuid1 && topData?.shpzh) {
      confirmYppBgd();
    }
  }, [rwuuid1, topData, dqPpbzDm, drawerVisible]);

  // 未匹配报关单查询
  const confirmWppBgd = () => {
    const formVals = wppBgdForm.getFieldsValue();
    const searchModel: any = [];
    searchModel.push({
      property: 'shpzh',
      value: topData?.shpzh,
      op: 'zdy'
    });
    if (formVals?.bgdhgbh) {
      searchModel.push({
        property: 'bgdhgbh',
        value: formVals?.bgdhgbh,
        op: 'zdy'
      });
    }
    if (formVals?.ckhth) {
      searchModel.push({
        property: 'ckhth',
        value: formVals?.ckhth,
        op: 'zdy'
      });
    }
    if (formVals?.jwshrmc) {
      searchModel.push({
        property: 'jwshrmc',
        value: formVals?.jwshrmc,
        op: 'zdy'
      });
    }
    if (formVals?.ckrq1 && formVals?.ckrq1.length > 0) {
      searchModel.push({
        property: 'ckrq1Q',
        value: moment(formVals.ckrq1[0]).format('yyyy-MM-DD'),
        op: 'zdy'
      });
      searchModel.push({
        property: 'ckrq1Z',
        value: moment(formVals.ckrq1[1]).format('yyyy-MM-DD'),
        op: 'zdy'
      });
    }
    const obj = {
      page: 1,
      pageSize: 100,
      searchModel: searchModel
    }
    setWppBgdMasker(true);
    queryShglWppBgd(obj).then((res: any) => {
      const { code, body, msg } = res;
      setWppBgdMasker(false);
      if (code == '200') {
        if (body?.rowCount > 100) {
          message.info('当前筛选条件下数据超出100条，请重新设置筛选条件');
        } else {
          setSelectWppBgdRowKeys([]);
          setSelectWppBgdRows([]);
          setGxWppBgdWshje(0);
          setGxWppBgdWshrmbje(0);
          setWppBgdDataSource(body?.rows);
        }
      } else {
        message.error(msg);
      }
    });
  }

  // 已匹配报关单查询
  const confirmYppBgd = () => {
    const formVals = yppBgdForm.getFieldsValue();
    const searchModel: any = [];
    searchModel.push({
      property: 'shpzh',
      value: topData?.shpzh,
      op: 'zdy'
    });
    searchModel.push({
      property: 'rwuuid1',
      value: rwuuid1,
      op: 'zdy'
    });
    if (formVals?.bgdhgbh) {
      searchModel.push({
        property: 'bgdhgbh',
        value: formVals?.bgdhgbh,
        op: 'zdy'
      });
    }
    if (formVals?.ckhth) {
      searchModel.push({
        property: 'ckhth',
        value: formVals?.ckhth,
        op: 'zdy'
      });
    }
    if (formVals?.jwshrmc) {
      searchModel.push({
        property: 'jwshrmc',
        value: formVals?.jwshrmc,
        op: 'zdy'
      });
    }
    if (formVals?.ckrq1 && formVals?.ckrq1.length > 0) {
      searchModel.push({
        property: 'ckrq1Q',
        value: moment(formVals.ckrq1[0]).format('yyyy-MM-DD'),
        op: 'zdy'
      });
      searchModel.push({
        property: 'ckrq1Z',
        value: moment(formVals.ckrq1[1]).format('yyyy-MM-DD'),
        op: 'zdy'
      });
    }
    const obj = {
      page: yppBgdPagination.current,
      pageSize: yppBgdPagination.pageSize,
      searchModel: searchModel
    }
    setYppBgdMasker(true);
    queryShglYppBgd(obj).then((res: any) => {
      const { code, body, msg } = res;
      setYppBgdMasker(false);
      if (code == '200') {
        const tmpPagination = { ...yppBgdPagination };
        setYppBgdPagination(Object.assign(tmpPagination, {
          total: body?.rowCount,
          page: body?.page,
          pageSize: tmpPagination.pageSize,
        }));
        setYppBgdDataSource(body?.rows);
        setSelectYppBgdRowKeys([]);
        setSelectYppBgdRows([]);
      } else {
        message.error(msg);
      }
    });
  }

  // 未匹配报关单选中
  const rowWppBgdSelection = {
    selectedRowKeys: selectWppBgdRowKeys,
    fixed: true,
    onSelect: (record: any, selected: any, selectedRows: any, nativeEvent: any) => {
      const tmpRowKeys = [...selectWppBgdRowKeys];
      const tmpRows = [...selectWppBgdRows];
      if (selected) {
        // 可用值替换原始值 确保以前的方法不需要调整
        tmpRowKeys.push(record.bgdhgbh);
        tmpRows.push(record);
      } else {
        const index1 = tmpRowKeys.findIndex((item: any) => record.bgdhgbh === item);
        tmpRowKeys.splice(index1, 1);
        const index2 = tmpRows.findIndex((item: any) => record.bgdhgbh === item.bgdhgbh);
        tmpRows.splice(index2, 1);
      }
      // 更改当前页选中
      setSelectWppBgdRowKeys(tmpRowKeys);
      setSelectWppBgdRows(tmpRows);
      let totalWshje = 0;
      let totalWshrmbje = 0;
      tmpRows.forEach(({ wshje, wshrmbje}) => {
          totalWshje += Number(wshje) || 0;
          totalWshrmbje += Number(wshrmbje) || 0;
      });
      setGxWppBgdWshje(totalWshje);
      setGxWppBgdWshrmbje(totalWshrmbje);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      const tmpRowKeys = [...selectWppBgdRowKeys];
      const tmpRows = [...selectWppBgdRows];
      if (selected) {
        changeRows.forEach((item: any) => {
          // 可用值替换原始值 确保以前的方法不需要调整
          tmpRowKeys.push(item.bgdhgbh);
          tmpRows.push(item);
        })
        // 更改当前页选中
        setSelectWppBgdRowKeys(tmpRowKeys);
        setSelectWppBgdRows(tmpRows);
        let totalWshje = 0;
        let totalWshrmbje = 0;
        tmpRows.forEach((item:any ) => {
            totalWshje += Number(item?.wshje) || 0;
            totalWshrmbje += Number(item?.wshrmbje) || 0;
        });
        setGxWppBgdWshje(totalWshje);
        setGxWppBgdWshrmbje(totalWshrmbje);
      } else {
        const lsRows0: any = [];
        const lsRows1: any = [];
        const lsRows2: any = [];
        changeRows.forEach((item: any) => {
          lsRows0.push(item.bgdhgbh);
        });
        tmpRowKeys.forEach((item: any) => {
          if (!myUtil.array.isContiner(lsRows0, item)) {
            lsRows1.push(item);
          }
        });
        tmpRows.forEach((item: any) => {
          if (!myUtil.array.isContiner(lsRows0, item.bgdhgbh)) {
            lsRows2.push(item);
          }
        });
        // 更改当前页选中
        setSelectWppBgdRowKeys(lsRows1);
        setSelectWppBgdRows(lsRows2);
        let totalWshje = 0;
        let totalWshrmbje = 0;
        lsRows2.forEach((item:any ) => {
            totalWshje += Number(item?.wshje) || 0;
            totalWshrmbje += Number(item?.wshrmbje) || 0;
        });
        setGxWppBgdWshje(totalWshje);
        setGxWppBgdWshrmbje(totalWshrmbje);
      }
    }
  }

  // 已匹配报关单选中
  const rowYppBgdSelection = {
    selectedRowKeys: selectYppBgdRowKeys,
    fixed: true,
    onSelect: (record: any, selected: any, selectedRows: any, nativeEvent: any) => {
      const tmpRowKeys = [...selectYppBgdRowKeys];
      const tmpRows = [...selectYppBgdRows];
      if (selected) {
        tmpRowKeys.push(record.uuid);
        tmpRows.push(record);
      } else {
        const index1 = tmpRowKeys.findIndex((item: any) => record.uuid === item);
        tmpRowKeys.splice(index1, 1);
        const index2 = tmpRows.findIndex((item: any) => record.uuid === item.uuid);
        tmpRows.splice(index2, 1);
      }
      // 更改当前页选中
      setSelectYppBgdRowKeys(tmpRowKeys);
      setSelectYppBgdRows(tmpRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      const tmpRowKeys = [...selectYppBgdRowKeys];
      const tmpRows = [...selectYppBgdRows];
      if (selected) {
        changeRows.forEach((item: any) => {
          // 可用值替换原始值 确保以前的方法不需要调整
          tmpRowKeys.push(item.uuid);
          tmpRows.push(item);
        })
        // 更改当前页选中
        setSelectYppBgdRowKeys(tmpRowKeys);
        setSelectYppBgdRows(tmpRows);
      } else {
        const lsRows0: any = [];
        const lsRows1: any = [];
        const lsRows2: any = [];
        changeRows.forEach((item: any) => {
          lsRows0.push(item.uuid);
        });
        tmpRowKeys.forEach((item: any) => {
          if (!myUtil.array.isContiner(lsRows0, item)) {
            lsRows1.push(item);
          }
        });
        tmpRows.forEach((item: any) => {
          if (!myUtil.array.isContiner(lsRows0, item.uuid)) {
            lsRows2.push(item);
          }
        });
        // 更改当前页选中
        setSelectYppBgdRowKeys(lsRows1);
        setSelectYppBgdRows(lsRows2);
      }
    }
  }

  // 付汇方式文本
  const fhfs = () => {
    if (topData?.shgzDm) {
      if (topData?.shgzDm === '1') {
        return '合同付汇';
      } else if (topData?.shgzDm === '2') {
        return '滚动收汇';
      } else {
        return '关单收汇';
      }
    }
    return '';
  }

  const onChangePpbzDm = (e: any) => {
    const val = e.target.value;
    if (val != dqPpbzDm) {
      if (topData?.sbje > 0) {
        message.warning('收汇水单匹配的报关单已被提取收汇申报，无法切换匹配币制！');
        topForm.setFieldsValue({ ppbzDm: dqPpbzDm });
        return;
      } else {
        if (topData?.yzje1 > 0) {
          DDAlert.open({
            title: '系统提示',
            info: '当前收汇水单已被匹配，切换匹配币制原匹配记录将被清空，是否确认？',
            infoType: 'question',
            modalType: 'confirm',
            closeStatus: false,
            okCallbackFn: function (thisObj: any) {
              thisObj.setState({ masker: true });
              const obj = {shpzh: topData?.shpzh};
              shglsdppGxPpBz(obj).then((res: any) => {
                thisObj.setState({ masker: false });
                const { code, msg} = res;
                if (code === '200') {
                  DDAlert.close();
                  const newTopData = {...topData};
                  newTopData.syje = val === '1'? newTopData.ckshje :newTopData.ckshjermb;
                  newTopData.yzje1 = 0;
                  setTopData(newTopData);
                  confirmYppBgd();
                  setDqPpbzDm(val);
                  topForm.setFieldsValue({ ppbzDm: val });
                } else {
                  message.error(msg);
                }
              });
            },
            cancelCallbackFn: function () {
              topForm.setFieldsValue({ ppbzDm: dqPpbzDm });
            },
          });
        } else {
          const newTopData = {...topData};
          newTopData.syje = val === '1'? newTopData.ckshje :newTopData.ckshjermb;
          newTopData.yzje1 = 0;
          setTopData(newTopData);
          setDqPpbzDm(val);
          topForm.setFieldsValue({ ppbzDm: val });
        }
      }
    }
  }

  // 页面标题
  const proTitle = (
     <>
     <div style={{width: '165%'}}>
      <Row>
        <Col span={6}>
        <span className={shsdppStyle.shsdpp_main_title_ytj}>付汇人：
          <span className={shsdppStyle.shsdpp_main_title_ytj_num}>{topData?.fhr}</span>
        </span>
        </Col>
        <Col span={5}>
        <span className={shsdppStyle.shsdpp_main_title_ytj}>付汇方式：
          <span className={shsdppStyle.shsdpp_main_title_ytj_num}>{fhfs()}</span>
        </span>
        </Col>
        <Col span={4}>
        <span style={{ marginLeft: '20px' }} className={shsdppStyle.shsdpp_main_title_ytj}>收汇日期：
          <span className={shsdppStyle.shsdpp_main_title_ytj_num}>{topData?.ckshrq}</span>
        </span>
        </Col>
        <Col span={4}>
        <span style={{ marginLeft: '20px' }} className={shsdppStyle.shsdpp_main_title_ytj}>收汇币制：
          <span className={shsdppStyle.shsdpp_main_title_ytj_num}>{topData?.shbzDm}</span>
        </span>
        </Col>
        <Col span={5}>
        <span style={{ marginLeft: '20px' }} className={shsdppStyle.shsdpp_main_title_ytj}>收汇金额：
          <span className={shsdppStyle.shsdpp_main_title_je}>{myUtil.text.formatNum(topData?.ckshje, '0,0.00')}</span>
        </span>
        </Col>
      </Row>
      <Row>
        <Col span={6}>
          <span style={{marginTop: '5px' }} className={shsdppStyle.shsdpp_main_title_ytj}>人民币收汇金额：
            <span className={shsdppStyle.shsdpp_main_title_je}>{myUtil.text.formatNum(topData?.ckshjermb, '0,0.00')}</span>
          </span>
        </Col>
        <Col span={5}>
        <span className={shsdppStyle.shsdpp_main_title_ytj} >
          <span>
            <Form  form={topForm} >
              <Form.Item name="ppbzDm" label="匹配币制" rules={[
                () => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error('请选择匹配币制'));
                    }
                    return Promise.resolve();
                  },
                })
            ]}>
              <Radio.Group onChange={onChangePpbzDm}>
                  <Radio value="1">原币</Radio>
                  <Radio value="2">人民币</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </span>
        </span>
        </Col>
        <Col span={4}>
          <span style={{ marginLeft: '20px',marginTop: '5px' }} className={shsdppStyle.shsdpp_main_title_ytj}>已匹配金额：
            <span className={shsdppStyle.shsdpp_main_title_je}>{myUtil.text.formatNum(topData?.yzje1, '0,0.00')}</span>
          </span>
        </Col>
        <Col span={4}>
          <span style={{ marginLeft: '20px',marginTop: '5px'  }} className={shsdppStyle.shsdpp_main_title_ytj}>剩余金额：
            {topData?.syje >= 0 ?
              <span className={shsdppStyle.shsdpp_main_title_je}>{myUtil.text.formatNum(topData?.syje, '0,0.00')}</span>
              :
              <span className={shsdppStyle.shsdpp_main_title_syje}>{myUtil.text.formatNum(topData?.syje, '0,0.00')}</span>
              }
          </span>
        </Col>
      </Row>
      </div>
     </>
  );

  // 返回
  const handlerClose = () => {
    setMasker(true);
    const obj = {
      shpzh: topData?.shpzh,
      rwuuid1: rwuuid1
    };
    shglDelSdbgdlsb(obj).then((res) => {
      setMasker(false);
      setDrawerVisible(false);
    });
  }

  // 删除已匹配报关单
  const handlerScYppBgd = () => {
    const xzRows = [...selectYppBgdRows];
    if (!xzRows || xzRows.length <= 0) {
      message.warn('请选择要删除的已匹配报关单');
      return;
    }
    const uuids: any[] = [];
    let sftqshNum = 0;
    let scYzje1 = 0;
    xzRows.forEach((item: any) => {
      uuids.push(item.uuid);
      scYzje1 = Number(scYzje1) + Number(item.ppyzje);
      if (item?.sftqsh === 'Y') {
        sftqshNum = sftqshNum + 1;
      }
    });
    if (sftqshNum > 0) {
      message.warn('已被提取收汇申报的报关单不支持删除');
      return;
    }
    const ppbzDm = topForm.getFieldValue('ppbzDm');
    const zYzje1 = Number(topData?.yzje1 || 0.00).toFixed(2);
    const ckshje = ppbzDm === '1' ? Number(topData?.ckshje|| 0.00).toFixed(2) : Number(topData?.ckshjermb|| 0.00).toFixed(2);
    const obj = {
      shpzh: topData?.shpzh,
      uuids: uuids,
      rwuuid1: rwuuid1
    }
    setMasker(true);
    deleteShglYppBgd(obj).then((res: any) => {
      setMasker(false);
      if (res?.code === '200') {
        const newTopData = {...topData};
        const newYzje1 = Number(zYzje1) - Number(scYzje1);
        const newSyje = Number(ckshje) - Number(newYzje1);
        newTopData.yzje1 = newYzje1;
        newTopData.syje = newSyje;
        setTopData(newTopData);
        const tmpPagination = { ...yppBgdPagination };
        tmpPagination.current = 1;
        setYppBgdPagination(Object.assign(yppBgdPagination, tmpPagination));
        //confirmYppBgd();
      } else {
        message.error(res?.msg);
      }
    });
  }

  // 添加未匹配报关单到已匹配
  const handlerTjWppBgd = () => {
    const tjRows = [...selectWppBgdRows];
    if (!tjRows || tjRows.length <= 0) {
      message.warn('请选择要添加的未匹配报关单');
      return;
    }
    const ppbzDm = topForm.getFieldValue('ppbzDm');
    let num = 0;
    const shbzDm = topData?.shbzDm;
    const bgdhgbhs: any[] = [];
    let wshjeHj = 0;
    tjRows.forEach((item: any) => {
      bgdhgbhs.push(item.bgdhgbh);
      wshjeHj = Number(wshjeHj) + (ppbzDm === '1' ? Number(item.wshje) : Number(item.wshrmbje));
      if (item?.cjhbzmDm != shbzDm) {
        num = Number(num) + 1;
      }
    });
    // 原币时校验水单币制与勾选报关单币制是否一致
    if (ppbzDm === '1') {
      if (num > 0) {
        message.warn('存在选择的报关单成交币制与收汇水单币制不一致，请重新选择');
        return;
      }
    }
    const yzje1 = Number(topData?.yzje1 || 0.00).toFixed(2);
    const ckshje = ppbzDm === '1' ? Number(topData?.ckshje || 0.00).toFixed(2) : Number(topData?.ckshjermb || 0.00).toFixed(2);
    const obj = {
      shpzh: topData?.shpzh,
      bgdhgbhs: bgdhgbhs,
      ppbzDm : ppbzDm,
      rwuuid1 : rwuuid1
    }
    setMasker(true);
    addShglWppBgd(obj).then((res: any) => {
      setMasker(false);
      const {code, msg} = res;
      if (code === '200') {
        const newTopData = {...topData};
        const newYzje1 = Number(yzje1) + Number(wshjeHj);
        const newSyje = Number(ckshje) - Number(newYzje1);
        newTopData.yzje1 = newYzje1;
        newTopData.syje = newSyje;
        setTopData(newTopData);
        confirmYppBgd();
        confirmWppBgd();
      } else {
        message.error(msg);
      }
    });
  }

  // 自动匹配
  const handlerAutoPp = async () => {
    const fhxxObj = await queryShgz();
    if (fhxxObj?.code != '200') {
      message.error(fhxxObj?.msg);
    }
    const shgzDm = fhxxObj?.shgzDm;
    if (shgzDm != '1' && shgzDm != '2' && shgzDm != '3') {
      DDAlert.open({
        title: '系统信息',
        info: '校验异常',
        infoType: 'error',
        content: [
          '未找到该客户的付汇关系数据，请先维护外商付汇关系管理',
        ],
        okText: '转外商付汇关系管理',
        okCallbackFn: function () {
          history.push('/hts/pzgl/khxxgl/wsglwjj/wsfhgxgl');
        }
      });
    } else {
      const sfbdjwshr = fhxxObj?.sfbdjwshr;
      if (sfbdjwshr === 'N') {
        DDAlert.open({
          title: '系统信息',
          info: '校验异常',
          infoType: 'error',
          content: [
            '未查询到付汇人关联的境外收货人，请先维护外商付汇关系',
          ],
          okText: '转外商付汇关系管理',
          okCallbackFn: function () {
            history.push('/hts/pzgl/khxxgl/wsglwjj/wsfhgxgl');
          }
        });
      } else {
        topForm.validateFields().then(values => {
          // 滚动付汇
          if (shgzDm === '2') {
            refGdpp?.current?.showModal(values);
          } else if (shgzDm==='1' || shgzDm==='3') {
            //
            handlerAutoPpHt(values, shgzDm);
          } else {
            message.error('未获取有效付汇方式');
          }
        });

      }
    }
  }

  const handlerAutoPpHt = (values: any, shgzDm: any) => {
    const obj = {
      shgzDm : shgzDm,
      shpzh: topData?.shpzh,
      shbzDm: topData?.shbzDm,
      fhr: topData?.fhr,
      ppbzDm: values?.ppbzDm,
      rwuuid1: rwuuid1,
    }
    setMasker(true);
    aotuShglPp(obj).then((res: any) => {
      setMasker(false);
      const {code, body, msg} = res;
      if (code === '200') {
        const newTopData = {...topData};
        newTopData.syje = body?.syje;
        newTopData.yzje1 = body?.yzje1;
        setTopData(newTopData);
        confirmYppBgd();
        dtZxWppcx();
        if (body?.errlist.length > 0) {
          const ppjg = {
            bgdzs: body?.bgdzs,
            ckshje: body?.ckshje,
            yzje1: body?.yzje1,
            syje: body?.syje,
          };
          refHtpp?.current?.showModal(body?.errlist, ppjg);
        } else {
          DDAlert.open({
            title: '匹配结果',
            info: ppJgTitle(body?.bgdzs, body?.syje),
            infoType: '',
            okText: '确定',
            okCallbackFn: async function () {
              DDAlert.close();
            }
          });
        }
      } else {
        message.error(msg);
      }
    });
  }

  // 滚动匹配确定
  const handlerAutoPpGd = (obj: any) => {
    refGdpp?.current?.gxMasker(true);
    obj.rwuuid1 = rwuuid1;
    aotuShglPp(obj).then((res: any) => {
      refGdpp?.current?.gxMasker(false);
      const {code, msg, body} = res;
      if (code === '200') {
        refGdpp?.current?.closeTc();
        const newTopData = {...topData};
        newTopData.syje = body?.syje;
        newTopData.yzje1 = body?.yzje1;
        setTopData(newTopData);
        confirmYppBgd();
        dtZxWppcx();
        DDAlert.open({
          title: '匹配结果',
          info: ppJgTitle(body?.bgdzs, body?.syje),
          infoType: '',
          okText: '确定',
          okCallbackFn: async function () {
            DDAlert.close();
          }
        });
      } else {
        message.error(msg);
      }
    });
  }

  // 滚动匹配 提示结果
  const ppJgTitle = (bgdzs: any, syje: any) => {
    return <>
    <span className={shsdppStyle.shsdpp_main_title_ytj}>成功匹配了报关单
      <span className={shsdppStyle.shsdpp_main_title_je}>{myUtil.text.formatNum(bgdzs, '0,0')}</span>
    </span>
    <span className={shsdppStyle.shsdpp_main_title_ytj}>份，收汇水单剩余金额：
      <span className={shsdppStyle.shsdpp_main_title_syje}>{myUtil.text.formatNum(syje, '0,0.00')}</span>
    </span>
    </>
  }

  // 判断是否执行未匹配页面刷新
  const dtZxWppcx = () => {
    if (wppBgdDataSource && wppBgdDataSource.length > 0) {
      confirmWppBgd();
    }
  }

  // 提交
  const handlerSavePpjg = () => {
    const newTopData = {...topData};
    if (newTopData?.syje < 0) {
      message.error('本次匹配金额超出收汇金额，请进行调整');
      return;
    }
    const obj = {
      shpzh : newTopData?.shpzh,
      ppbzDm : topForm.getFieldValue('ppbzDm'),
      shgzDm: newTopData?.shgzDm,
      rwuuid1: rwuuid1
    }
    setMasker(true);
    bcShglPpjg(obj).then((res: any) => {
      setMasker(false);
      const {code, body, msg} = res;
      if (code === '200') {
        // 关闭弹窗
        setDrawerVisible(false);
        // 刷新主列表
        params?.refUnit?.current?.reload();
      } else if (code === '900') {
        refPpjg?.current?.showModal(body);
      } else {
        message.error(msg);
      }
    });
  };

  // 动态查询付汇人付汇方式
  const queryShgz = async () => {
    const obj = {
      fhr: topData?.fhr
    };
    const result = await hqFhfs(obj);
    if (result?.code === '200') {
      return {code : '200', shgzDm: result?.body?.shgzDm, sfbdjwshr: result?.body?.sfbdjwshr};
    } else {
      return {code : result?.code, msg: result?.msg};
    }
  }

  return (
    <>
      <Drawer
        title={'收汇水单匹配'}
        open={drawerVisible}
        width={CONSTANTS.C_MODAL_WIDTH_MAX}
        onClose={() => { handlerClose() }}
        className="dd_data_page_modal"
        destroyOnHidden={true}
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
        <ProCard split="horizontal" className="dd_znpd_wrap">
          <ProCard className="dd_znpd_top_wrap"
            title={proTitle}
            extra={
              <>
              <Button type="link" onClick={handlerAutoPp} >自动匹配</Button>
              <Button type="link" onClick={handlerSavePpjg} >保存</Button>
            </>
          }>
          </ProCard>
          <ProCard split="vertical">
            <ProCard colSpan="50%" split="horizontal">
              <ProCard className="dd-grid-wrap">
                <div className="grid_header_info_wrap" style={{ lineHeight: 3 }}>
                  <Space size={0} align="start">
                    <div className="grid_header_info" style={{ fontSize: 16, marginRight: 20, color: '#32363a' }}>{'已匹配关单'}</div>
                  </Space>
                </div>
                <div className="grid_header_button" style={{ fontSize: 16,  color: '#32363a' }}>
                  <Button type="link" onClick={handlerScYppBgd} >删除</Button>
                </div>
                <div className="grid_header_search_popconfirm">
                  <Popconfirm
                    placement="bottomRight"
                    icon={false}
                    title={
                      <Form className="popconfirm_form" form={yppBgdForm} initialValues={{ ljDate: [], bgdNo: '', hgcmcode: '', bgdggxh: '', htNo: '' }} style={{ marginLeft: -18, marginRight: 5 }} >
                        <Form.Item name="bgdhgbh">
                          <Input placeholder="出口报关单号" />
                        </Form.Item>
                        <Form.Item name="ckhth">
                          <Input placeholder="合同协议号" />
                        </Form.Item>
                        <Form.Item name="jwshrmc">
                          <Input placeholder="境外收货人" />
                        </Form.Item>
                        <Form.Item name="ckrq1" style={{ marginBottom: '16px' }}>
                          <DatePicker.RangePicker placeholder={['出口日期起', '出口日期止']} format={myUtil.date.formatList()} />
                        </Form.Item>
                      </Form>
                    }
                    onConfirm={confirmYppBgd}
                    okText="查询"
                    showCancel={false}
                  >
                    <Button icon={<SearchOutlined />} />
                  </Popconfirm>
                </div>
                <YppBgdGrid
                  leftPagination={yppBgdPagination}
                  setLeftPagination={setYppBgdPagination}
                  actionRef={refYppBgdGrid}
                  dataSource={yppBgdDataSource}
                  loading={yppBgdMasker}
                  setLoading={setYppBgdMasker}
                  rowSelection={{ ...rowYppBgdSelection, selectedRowKeys: selectYppBgdRowKeys }}
                  query={confirmYppBgd}
                  topData={topData}
                  setTopData={setTopData}
                />
              </ProCard>
            </ProCard>
            <ProCard colSpan="50%" split="horizontal">
              <ProCard className="dd-grid-wrap">
              <div className="grid_header_info_wrap" style={{ lineHeight: 3 }}>
                  <Space size={0} align="start">
                    <div className="grid_header_info" style={{ fontSize: 16, marginRight: 20, color: '#32363a' }}>{'未匹配关单'}</div>
                  </Space>
                </div>
                <div className="grid_header_button" style={{ fontSize: 16,  color: '#32363a' }}>
                  <Button type="link" onClick={handlerTjWppBgd} >添加</Button>
                </div>
                <div className="grid_header_search_popconfirm">
                  <Popconfirm
                    placement="bottomRight"
                    icon={false}
                    title={
                      <Form className="popconfirm_form" form={wppBgdForm} initialValues={{ ljDate: [], bgdNo: '', hgcmcode: '', bgdggxh: '', htNo: '' }} style={{ marginLeft: -18, marginRight: 5 }} >
                        <Form.Item name="bgdhgbh">
                          <Input placeholder="出口报关单号" />
                        </Form.Item>
                        <Form.Item name="ckhth">
                          <Input placeholder="合同协议号" />
                        </Form.Item>
                        <Form.Item name="jwshrmc">
                          <Input placeholder="境外收货人" />
                        </Form.Item>
                        <Form.Item name="ckrq1" style={{ marginBottom: '16px' }}>
                          <DatePicker.RangePicker placeholder={['出口日期起', '出口日期止']} format={myUtil.date.formatList()} />
                        </Form.Item>
                      </Form>
                    }
                    onConfirm={confirmWppBgd}
                    okText="查询"
                    showCancel={false}
                  >
                    <Button icon={<SearchOutlined />} />
                  </Popconfirm>
                </div>
                <WppBgdGrid
                  rowKey={'bgdhgbh'}
                  actionRef={refWppBgdGrid}
                  dataSource={wppBgdDataSource}
                  loading={wppBgdMasker}
                  rowSelection={{ ...rowWppBgdSelection, selectedRowKeys: selectWppBgdRowKeys }}
                  wshje = {gxWppBgdWshje}
                  wshrmbje = {gxWppBgdWshrmbje}
                />
              </ProCard>
            </ProCard>
          </ProCard>
        </ProCard>
        </Spin>
      </Drawer>
      <Gdpp onRef={refGdpp} gdPp={handlerAutoPpGd} topData={topData}/>
      <Htpp onRef={refHtpp}  topData={topData} />
      <Ppjg onRef={refPpjg}/>

    </>
  )
}


export default ShsdsjPp;
