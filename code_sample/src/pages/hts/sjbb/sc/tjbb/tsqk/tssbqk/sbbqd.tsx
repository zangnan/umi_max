import React, { useImperativeHandle, useState } from 'react';
import DDBaseGrid from '@/components/DDBaseGrid';
import ProCard from '@ant-design/pro-card';
import { Drawer, Button, Spin } from 'antd';
import pro from '@/pages/common/proConfig';
import myUtil from '@/pages/common/myUtil';
import ScSbqdCkhw from './sjbb_sbqd_ckhw01';
import ScSbqdHgck from './sjbb_sbqd_hgck02';
import ScSbqdShsb from './sjbb_sbqd_shsb03';
import ScSbqdBnsh from './sjbb_sbqd_bnsh04';
import ScSbqdCkhwla from './sjbb_sbqd_lajcy05';
import ScSbqdStzcjh from './sjbb_sbqd_stzcjh06';
import ScSbqdGjys from './sjbb_sbqd_gjys07';
import ScSbqdHkgj from './sjbb_sbqd_hkgj08';
import ScSbqdGjky from './sjbb_sbqd_gjky09';
import ScSbqdZgtl from './sjbb_sbqd_zgtl10';
import ScSbqdKjmdt from './sjbb_sbqd_kjmdt11';
import ScSbqdKjsqyy from './sjbb_sbqd_kjsqyy12';
import { queryPager } from '@/services/hts/api';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
}
const sbbqd: React.FC<DDModalGridProps> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [paramRef, setParamRef] = useState<any>();
  const [queryParam, setQueryParam] = useState([]);
  const [drawKey, setDrawKay] = useState<any>('ckhwlw');
  // 蒙版
  const [masker, setMasker] = useState(false);
  // 保存申报表清单 传参（申报年月）
  const [searchData, setSearchData] = useState({ ssq: '' });
  // 开启
  const showModal = (param: any) => {
    setModalVisible(true);
    setParamRef(param);
    const obj = {
      page: 1,
      pageSize: 999,
      key: 'CX_SJFX_SC_TSQK_TSSBQK_XZ_SBBQD',
      searchModel: [{
        property: 'ssq', value: param.record.ssq, op: 'zdy'
      }]
    }
    setSearchData({ ssq: param.record.ssq });
    setMasker(true);
    queryPager(obj).then((res) => {
      const { code, body } = res;
      setMasker(false);
      if (code == '200') {
        setQueryParam(body.rows);
      }
    });
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });
  const handleColumnRedner2 = (sbts: any, param: any, index: any) => {
    if (sbts) {
      return (
        <Button type="link" key={index + param?.bdmc} onClick={() => { renderGjcsTz(param) }}>
          {myUtil.text.formatNum(sbts, '0,0')}
        </Button>
      );
    } else {
      return (
        <span> {myUtil.text.formatNum(sbts, '0,0')} </span>
      );
    }
  }
  // 根据传入参数跳转不同页面
  const renderGjcsTz = (param: any) => {
    const { bdmc } = param;
    const { otherRef } = paramRef;
    const otherRef2 = otherRef && otherRef[1]?.current ? otherRef : paramRef.unitRef.current?.getOtherRefs();
    const gridParams = {
      initSearchModal: [
        { property: 'ssq', value: searchData.ssq, op: 'zdy' },
      ],
    }
    if (bdmc == '出口货物劳务免抵退税申报明细表') {
      setDrawKay('ckhwlw');
      ScSbqdCkhw.gridParams = gridParams;
      otherRef2[1].current?.showModal(param, bdmc, ScSbqdCkhw);
    }
    if (bdmc == '海关出口商品代码、名称、退税率调整对应表') {
      setDrawKay('hgsp');
      ScSbqdHgck.gridParams = gridParams;
      otherRef2[1].current?.showModal(param, bdmc, ScSbqdHgck);
    }
    if (bdmc == '出口货物收汇情况表') {
      setDrawKay('ckhwsh');
      ScSbqdShsb.gridParams = gridParams;
      otherRef2[1].current?.showModal(param, bdmc, ScSbqdShsb);
    }
    if (bdmc == '出口货物不能收汇申报表') {
      setDrawKay('ckhwbn');
      ScSbqdBnsh.gridParams = gridParams;
      otherRef2[1].current?.showModal(param, bdmc, ScSbqdBnsh);
    }
    if (bdmc == '出口货物离岸价差异原因说明表') {
      setDrawKay('ckhwla');
      ScSbqdCkhwla.gridParams = gridParams;
      otherRef2[1].current?.showModal(param, bdmc, ScSbqdCkhwla);
    }
    if (bdmc == '视同自产进货明细清单') {
      setDrawKay('stzc');
      ScSbqdStzcjh.gridParams = gridParams;
      otherRef2[1].current?.showModal(param, bdmc, ScSbqdStzcjh);
    }
    if (bdmc == '国际运输（港澳台运输）免抵退税申报明细表') {
      setDrawKay('gjys');
      ScSbqdGjys.gridParams = gridParams;
      otherRef2[1].current?.showModal(param, bdmc, ScSbqdGjys);
    }
    if (bdmc == '航空国际运输收入清算账单申报明细表') {
      setDrawKay('hkgj');
      ScSbqdHkgj.gridParams = gridParams;
      otherRef2[1].current?.showModal(param, bdmc, ScSbqdHkgj);
    }
    if (bdmc == '国际客运(含香港直通车)运输清算函件明细表') {
      setDrawKay('gjky');
      ScSbqdGjky.gridParams = gridParams;
      otherRef2[1].current?.showModal(param, bdmc, ScSbqdGjky);
    }
    if (bdmc == '中国铁路总公司国际货物运输明细表') {
      setDrawKay('zgtl');
      ScSbqdZgtl.gridParams = gridParams;
      otherRef2[1].current?.showModal(param, bdmc, ScSbqdZgtl);
    }
    if (bdmc == '跨境应税行为免抵退税申报明细表') {
      setDrawKay('kjys');
      ScSbqdKjmdt.gridParams = gridParams;
      otherRef2[1].current?.showModal(param, bdmc, ScSbqdKjmdt);
    }
    if (bdmc == '跨境应税行为收讫营业款明细清单') {
      setDrawKay('kjysxw');
      ScSbqdKjsqyy.gridParams = gridParams;
      otherRef2[1].current?.showModal(param, bdmc, ScSbqdKjsqyy);
    }
  };
  // 配置列表列
  const columns = [
    { title: '表单名称', dataIndex: 'bdmc', width: 450, },
    { title: '申报条数', dataIndex: 'sbts', width: 100, align: 'right', render: handleColumnRedner2 },
  ];


  return (
    <>
      <Drawer
        title="申报表清单"
        visible={modalVisible}
        width={pro.c_modal_width_x2}
        onClose={() => { setModalVisible(false) }}
        className="dd_data_page_modal"
        key='sbbqd'
        destroyOnClose={true}
        maskClosable={false}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <ProCard split="horizontal">
            <ProCard className="dd-filter-wrap">
            </ProCard>
            <ProCard className="dd-grid-wrap">
              <DDBaseGrid
                scroll={{ x: '600px' }}
                userDataSource={queryParam}
                columns={columns}
                showSerialNumber
                pagination={false}
              />
            </ProCard>
          </ProCard>
        </Spin>
      </Drawer>
    </>
  );
};

export default sbbqd;
