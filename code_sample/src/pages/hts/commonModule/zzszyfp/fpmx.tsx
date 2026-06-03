/**
 * 发票逐项配单-----配单
 */
import React, { useImperativeHandle, useState, } from 'react';
import { Drawer, Button } from 'antd';

import {queryFpSpPage} from '@/services/hts/api';
import DDBaseGrid from '@/components/DDBaseGrid';
import pro from '@/pages/common/proConfig';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
}
const Mtspd: React.FC<DDModalGridProps> = ({ onRef, visible = false }) => {

  const [spVisible, setSpVisible] = useState(visible);
  const [gridData, setGridData] = useState<any>([]);


  //绑定组件
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


  // 开启页面，并设置参数
  const showModal = (params: any, record: any) => {
    setSpVisible(true);
    const gridParams = {
      searchModel: [
        { property: "fphm", value: record.fphm, op: "al" },
        { property: "fpDm", value: record.fpDm, op: "al" },
      ],
    };
    queryFpSpPage(gridParams).then(async (res) => {
      const { body, code } = res;
      if (code === '200') {
        const rows  = body.rows;
        for(let i=0;i<rows.length;i++){
          rows[i].sl1 = rows[i].sl1 * 100;
        }
        setGridData(rows);
      } else{
        setGridData([]);
      }
    })
  };

  // 配置列表列
  const columns = [
    { title: '发票行号', dataIndex: 'hh', width: 80 },
    { title: '商品名称', dataIndex: 'hwhyslwmc', width: 150, ellipsis: true,},
    { title: '规格型号', dataIndex: 'ggxh', width: 150 , ellipsis: true,},
    { title: '计量单位', dataIndex: 'jldwmc', width: 80, ellipsis: true,},
    { title: '数量', dataIndex: 'sl', width: 90 , align: 'right' ,},
    { title: '计税金额', dataIndex: 'je', width: 90 , align: 'right' },
    { title: '剩余金额', dataIndex: 'syje', width: 90 , align: 'right' },
    { title: '税率', dataIndex: 'sl1', align: 'right', width: 80 },

  ];

  return (
    <>
        <Drawer
          title="发票明细"
          visible={spVisible}
          width={pro.c_modal_width_x4}
          onClose={() => {
            setSpVisible(false)
          }}
          className="dd_data_page_modal"
          destroyOnClose={true}
          maskClosable={false}
        >
        <DDBaseGrid
          userDataSource={gridData}
          columns={columns}
          pagination={false}
        />
      </Drawer>
    </>
  );
};

export default Mtspd;