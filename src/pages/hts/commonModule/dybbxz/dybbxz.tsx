/**
 * 查询统计: 打印报表下载
 */
import formUtil from '@/components/DDForm/formUtil';
import React, { useImperativeHandle, useState, useRef } from 'react';
import { useRouteData } from 'umi';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Form, message, Spin } from 'antd';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { queryReportData } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import cktsUtil from '@/pages/hts/cktsUtil';
import UnitUtil from '@/components/DDBunit/unit_util';
import ReportGrid from './reportGrid';
import moment from 'moment';

export interface DybbxzProps {
  onRef?: any;
  ywKey?: any;
}

const Dybbxz: React.FC<DybbxzProps> = ({
  onRef,
  ywKey
}) => {
  const refReportGrid: any = useRef();
  const routeMatch = useRouteData();     // 获取当前路由的匹配信息
  // 根据路径获取业务key
  const getMyYwKey = () => {
    // yeKey 是父组件传递
    if (ywKey) {
      return ywKey;
    }
    const [pathname] = [...routeMatch.route.path.split('/')].reverse();
    // yeKey 是根据固定的URL格式获取 /ckts/sbsjcx/
    if (routeMatch.route.path.indexOf('/ckts/sbsjcx/') > -1) {
      return pathname;
    }
    // yeKey 从菜单树获取
    let pathId:any = '';
    const pathArry:any = pathname.match(/_(\S*)/);
    if(pathname.indexOf('_') > -1) {
      pathId = pathArry[1];
    } else {
      pathId = pathname;
    }
    const menuObj = myUtil.menu.getMenuObjByName(pathId);
    let key: any = menuObj?.ywKey;
    return key;
  }
  const [myYwKey] = useState<string>(getMyYwKey());  // 测试用数据 MDT MTS ZGBA_BA ZMKJ_DLCK ZGBA_BABG
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [masker, setMasker] = useState<boolean>(false);
  const [unitKey, setUnitKey] = useState<any>();
  const [lcswsxDm, setLcswsxDm] = useState<any>();
  const [pagetype, setPagetype] = useState<any>();
  const [form] = Form.useForm();

  // 获取页面类型，显示不同表单项
  const getPagetype = (unit_key: any) => {
    let pagetype;
    if (cktsUtil.moduleType(myYwKey, 'SQRQ')) { // 资格备案
      pagetype = 'zgba';
      if (unit_key.indexOf('ZGBA_ZXSB_BA_BMDLCKBA') > -1) { // 以边境小额贸易方式代理外国企业、外国自然人报关出口货物备案表
        pagetype = 'ssq';
      }
    } else if (unit_key.indexOf('ZMKJ_ZXSB_ZM_BBCKTSZM') > -1) { // 关于补办出口退税有关证明的申请
      pagetype = 'sbbh1';
    } else if (unit_key.indexOf('ZMKJ_ZXSB_ZM_CKZMZFQD') > -1) { // 出口退（免）税相关证明作废
      pagetype = 'cktszmlxDm';
    } else if (unit_key.indexOf('TSZL_') == 0 && (myYwKey == 'MTS_CKSH' || myYwKey == 'DBTS_CKSH' || myYwKey == 'DBTS_HGSPTZ' ||
        myYwKey == 'MTS_HGSPTZ' || myYwKey == 'MTS_BNSH' || myYwKey == 'DBTS_BNSH')) {
      pagetype = 'ssq&sbpc';
    } else if (unit_key.indexOf('QTYW_ZXSB_QT_KSPZWGQWBTSHT') > -1 || unit_key.indexOf('QTYW_ZSXB_SB_CKXXCX') > -1|| unit_key.indexOf('JLJG_ZXSB_SB_JLJG_HGSJTZ_F') > -1|| unit_key.indexOf('JLJG_ZXSB_SB_JLJG_MDTHX_F') > -1|| unit_key.indexOf('QTYW_ZXSB_TY_KJDSHWC_HSSB_F') > -1) {
      pagetype = 'ssq&sbpc';
    }else {
      pagetype = '!zgba';
      if (cktsUtil.moduleType(unit_key, 'SBPC')) { // 在判断是否有申报批次
        pagetype = 'ssq&sbpc';
        if (unit_key.indexOf('ZMKJ_') == 0) {
          pagetype = 'ssq&sbpc&zmkj'; // 单证sbpc可为空
        }
      }
    }
    setPagetype(pagetype);
  }

  // 表单项: 生成申报数据
  const getFormItems = () => {
    // 共同方法集合
    const Func = {
      eventOnBlur: {
        sbpc: (param: any) => {
          DditCktsFormCommonFunc.eventOnBlur.sbpc(param);
        },
      },
    }
    const myFormItems = [];
		if (pagetype == 'ssq&sbpc') {
      myFormItems.push({ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}] });
      myFormItems.push({ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }], eventOnBlur: 'sbpc' });
		} else if (pagetype == 'zgba') {
      myFormItems.push({ label: '申请日期', name: 'tbrq1', type: 'DatePicker', format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }] });
		} else if (pagetype == 'sbbh1') {
      myFormItems.push({ label: '编号', name: 'sbbh1', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', length: '10' }] });
		} else if (pagetype == 'cktszmlxDm') {
      myFormItems.push({ label: '证明种类代码', name: 'cktszmlxDm', type: 'Select', rules: [{ type: 'base_required' }], codeTable: 'code_dm_ckts_cktszmlx:01' });
		} else if (pagetype == 'ssq&sbpc&zmkj'){ // 单证sbpc不为空
      myFormItems.push({ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}] });
      myFormItems.push({ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }], eventOnBlur: 'sbpc' });
		} else {
      myFormItems.push({ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}] });
    }
    const formItems: any = formUtil.init({
      items: myFormItems,
      func: Func,
    });
    return formItems;
  }

  // 开启
  const showModal = (param: any) => {
    const { unit_key, unit_lcswsx_dm } = param;
    getPagetype(unit_key); // 获取页面类型，显示不同表单项
    setUnitKey(unit_key);
    setLcswsxDm(unit_lcswsx_dm);
    setModalVisible(true);
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 保存
  const handleSave = () => {
    form.validateFields().then(values => {
      setMasker(true);
      // unitKey eg: MTS_ZXSB_SB_MTS_TSSB_F -> t2、bussEnglish、gridEnglish
      const t2 = unitKey.substr(0, unitKey.length - 2) + '_S'; // eg: MTS_ZXSB_SB_MTS_TSSB_S
      const bussEnglish = unitKey.substr(0, unitKey.length - 2) + '_J'; // eg: MTS_ZXSB_SB_MTS_TSSB_J
      let gridEnglish = unitKey.match(/_(\S*)_/)[1] + '_GCB'; // eg: ZXSB_SB_MTS_TSSB_GCB
      let tep: any = {
        ywKey: myYwKey,
        t2: t2,
        bussEnglish: bussEnglish,
        gridEnglish: gridEnglish,
        cxtjdybz: 'Y',
      };
      if (unitKey === 'JLJG_ZXSB_SB_JLJG_MDTHX_J' || unitKey === 'JLJG_ZXSB_SB_JLJG_HGSJTZ_J') {
        gridEnglish = unitKey.match(/_(\S*)_/)[1] + '_JGB'; // eg: ZXSB_SB_MTS_TSSB_JGB
        tep = {
          ywKey: myYwKey,
          t2: t2,
          bussEnglish: bussEnglish,
          gridEnglish: gridEnglish,
        };
      }
      if (values.tbrq1) {
        values.tbrq1 = moment(values.tbrq1).format('YYYY-MM-DD');
      }
      if (lcswsxDm) {
        values.lcswsxDm = lcswsxDm;
      }
      const params = Object.assign(tep, values);
      queryReportData(params).then((response) => {
        setMasker(false);
        const { code, desc, body } = response;
        if (code === '200') {
          setModalVisible(false);
          refReportGrid.current!.showModal(params, body || []);
        } else {
          setModalVisible(false);
          message.error(desc);
        }
      });
    })
  }

  return (
    <>
      <Modal
        title="打印报表下载"
        centered
        destroyOnHidden
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        okText="确认"
        cancelText="关闭"
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        zIndex={1001}
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <DDBaseForm items={getFormItems()} form={form} initialValues={{}} layoutType='vertical' />
        </Spin>
      </Modal>
      <ReportGrid onRef={refReportGrid} />
    </>
  );
};

export default Dybbxz;