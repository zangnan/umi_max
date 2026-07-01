import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Spin } from 'antd';
import Func from './f';
import myUtil from '@/components/DDAssist/util';
import DDBaseGrid from '@/components/DDBaseGrid';
import ProCard from '@ant-design/pro-card';
import Button from 'antd/es/button';
import sjbb_sbqd_ckmx01 from './sjbb_sbqd_ckmx01';
import sjbb_sbqd_jhmx02 from './sjbb_sbqd_jhmx02';
import sjbb_sbqd_hgsp03 from './sjbb_sbqd_hgsp03';
import sjbb_sbqd_shsb04 from './sjbb_sbqd_shsb04';
import sjbb_sbqd_shsb_no05 from './sjbb_sbqd_shsb_no05';
import sjbb_sbqd_wmqy06 from './sjbb_sbqd_wmqy06';
import sjbb_sbqd_kjys07 from './sjbb_sbqd_kjys07';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import { queryPager } from '@/pages/hts/services/htsApi';

export interface BdjgProps {
  onRef?: any;
}

const DrawerList: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalVisibleWm, setModalVisibleWm] = useState<boolean>(false);
  const [queryParam, setQueryParam] = useState([]);
  // 第二页面
  const [myConfig, setMyconfig] = useState<any>(sjbb_sbqd_ckmx01);
  // 第二页面标题
  const [myTitle, setMyTitle] = useState<any>('');
  // 蒙版
  const [masker, setMasker] = useState(false);
  // 保存申报表清单 传参（申报年月 申报批次）
  const [searchData, setSearchData] = useState({ ssq: '', sbpc: '' });

  // 开启
  const showModal = (param: any, flag: any) => {
    // 点击	申报表清单（条），下钻页面
    setModalVisible(true);
    const obj = {
      page: 1,
      pageSize: 999,
      key: 'CX_SJFX_WM_TSQK_TSSBQK_XZ_SBBQD',
      searchModel: [
        { property: "ssq", value: param.record.ssq, op: "zdy" },
        { property: "sbpc", value: param.record.sbpc, op: "zdy" },
      ]
    }
    setSearchData({ ssq: param.record.ssq, sbpc: param.record.sbpc });
    setMasker(true);
    queryPager(obj).then((res) => {
      const { code, body } = res;
      setMasker(false);
      if (code == '200') {
        setQueryParam(body.rows);
      }
    });
  };

  // 打开第二页面
  const openWmqy = (record: any) => {
    setModalVisibleWm(true)
    let c = { gridParams: {} };
    const gridParams = {
      initSearchModal: [
        { property: 'ssq', value: searchData.ssq, op: 'zdy' },
        { property: 'sbpc', value: searchData.sbpc, op: 'zdy' },
      ],
    }
    if (record.bdmc == '外贸企业出口退税出口明细申报表') {
      c = { ...sjbb_sbqd_ckmx01 };
    } else if (record.bdmc == '外贸企业出口退税进货明细申报表') {
      c = { ...sjbb_sbqd_jhmx02 };
    } else if (record.bdmc == '海关出口商品代码、名称、退税率调整对应表') {
      c = { ...sjbb_sbqd_hgsp03 }
    } else if (record.bdmc == '出口货物收汇情况表') {
      c = { ...sjbb_sbqd_shsb04 }
    } else if (record.bdmc == '出口货物不能收汇申报表') {
      c = { ...sjbb_sbqd_shsb_no05 }
    } else if (record.bdmc == '外贸企业调整申报') {
      c = { ...sjbb_sbqd_wmqy06 }
    } else if (record.bdmc == '跨境应税行为免退税申报明细表') {
      c = { ...sjbb_sbqd_kjys07 }
    }
    c.gridParams = gridParams;
    setMyconfig(c);
    setMyTitle(record.bdmc)
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 配置列表列
  const columns = [
    { title: '表单名称', dataIndex: 'bdmc', ellipsis: true },
    {
      title: '申报条数', dataIndex: 'sbts', width: 120, align: 'right', render: (_text: any, record: any) => (
        _text ? <Button type='link' onClick={() => openWmqy(record)}>{myUtil.text.formatNum(_text, '0,0')}</Button> : < span > {myUtil.text.formatNum(_text, '0,0')}</span >
      )
    },
  ];

  return (
    <>
      <Drawer
        title="申报表清单"
        open={modalVisible}
        onClose={() => { setModalVisible(false) }}
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        destroyOnHidden={true}
        className="dd_data_page_modal"
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <ProCard>
            <DDBaseGrid
              columns={columns}
              userDataSource={queryParam}
              showSerialNumber
              pagination={false}
              rowKey='bdmc'
              scroll={{ x: '0px' }}
            />
          </ProCard>
        </Spin>
      </Drawer>
      <Drawer
        title={myTitle}
        visible={modalVisibleWm}
        onClose={() => { setModalVisibleWm(false) }}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        destroyOnHidden={true}
        className="dd_data_page_modal"
        key='sbqd'
        mask={{ closable: false }}
      >
        <DDBunit2 config={myConfig} func={Func} key='wmqysbb' />
      </Drawer>
    </>
  );
};

export default DrawerList;
