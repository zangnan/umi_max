// 疑点管理
import React, { useState, useImperativeHandle } from 'react';
import { Tag, Drawer } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import ydgl_config from './ydglConfig';
import Func from './f';

export type YdglProps = {
  onRef?: any;
  ywKey?: any;
}

const Ydgl: React.FC<YdglProps> = ({
  onRef,
  ywKey,
}) => {

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>(ydgl_config);
  const [isIgnore, setIsIgnore] = useState<boolean>(false);
  const [sjzjuuid, setSjzjuuid] = useState<boolean>(false);
  const [sjsbuuid, setSjsbuuid] = useState<boolean>(false);

  // 列表列
  const getColumns = () => {
    // 列表内容格式化: 疑点级别
    const renderColumnYdjbDm = (text: any) => {
      if (text === 'W') {
        return <Tag color="cyan">警告类</Tag>
      }
      if (text === 'E') {
        return <Tag color="red">错误类</Tag>
      }
      return <Tag color="blue">{text}</Tag>;
    }
    // 列表内容格式化: 是否可挑过
    const renderColumnKtgydbz = (text: any) => {
      if (text === 'N') {
        return <Tag color="red">否</Tag>
      }
      if (text === 'Y') {
        return <Tag color="cyan">是</Tag>
      }
      return <Tag color="blue">{text}</Tag>;
    }
    const cols = [
      { title: '关联号', dataIndex: 'glh', width: 170  },
      { title: '序号', dataIndex: 'sbxh', width: 80 },
      { title: '申报年月', dataIndex: 'sbny', width: 80 },
      { title: '申报批次', dataIndex: 'sbpc', width: 80 },
      { title: '单证编号', dataIndex: 'sbbh1', width: 110 },
      { title: '单证项号', dataIndex: 'xh4', width: 80 },
      { title: '疑点对象', dataIndex: 'shdxmc', width: 190, ellipsis: true },
      { title: '疑点代码', dataIndex: 'ydbh', width: 90 },
      { title: '疑点级别', dataIndex: 'ydjbDm', width: 90, render: renderColumnYdjbDm },
      { title: '是否可挑过', dataIndex: 'ktgydbz', width: 100, render: renderColumnKtgydbz },
      { title: '疑点内容', dataIndex: 'ydnr', ellipsis: true },
    ];
    let tempCols: any = []; // 拟定指定业务需要显示的列
    if (ywKey.indexOf('ZMKJ') > -1) {
      tempCols = ['sbbh1', 'xh4', 'shdxmc', 'ydbh', 'ydjbDm', 'ktgydbz', 'ydnr' ];
    } else if (ywKey.indexOf('ZBYW') > -1) {
      tempCols = ['sbny', 'sbxh', 'shdxmc', 'ydbh', 'ydjbDm', 'ktgydbz', 'ydnr' ];
    } else if (ywKey.indexOf('MTS') > -1) {
      tempCols = ['glh', 'sbxh', 'sbny', 'sbpc', 'shdxmc', 'ydbh', 'ydjbDm', 'ktgydbz', 'ydnr' ];
    } else if (ywKey.indexOf('JLJG_MDTHX') > -1) {
      cols[2]['title'] = '所属期';
      tempCols = ['sbny', 'sbpc', 'sbxh', 'shdxmc', 'ydbh', 'ydjbDm', 'ktgydbz', 'ydnr' ];
    } else if (ywKey.indexOf('MDT') > -1) {
      cols[2]['title'] = '所属期';
      tempCols = ['sbny', 'sbxh', 'shdxmc', 'ydbh', 'ydjbDm', 'ktgydbz', 'ydnr' ];
    } else if (ywKey.indexOf('DBTS') > -1) {
      tempCols = ['sbxh', 'sbny', 'sbpc', 'shdxmc', 'ydbh', 'ydjbDm', 'ktgydbz', 'ydnr' ];
    } else if (ywKey === 'QTYW_HWCHS') {
      cols[2]['title'] = '所属期';
      tempCols = ['sbxh', 'sbny', 'sbpc','shdxmc', 'ydbh', 'ydjbDm', 'ktgydbz', 'ydnr' ];
    }
    const myCols = cols.filter(col => {
      return tempCols.indexOf(col.dataIndex) > -1;
    })
    return myCols;
  };

  // 开启
  const showModal = (param: any) => {
    const c = { ...myConfig };
    const gridParams: any = {
      initSearchModal: [
        {op: 'al', property: 'sjzjuuid', value: param.sjzjuuid },
        // {op: 'al', property: 'sjsbuuid', value: param.sjsbuuid },
        {op: 'al', property: 'ywKey', value: param.ywKey },
        {op: 'al', property: 'ktgydbz', value: param.ktgydbz },
      ],
    }
    c.gridParams = gridParams;
    // 配置列表列
    c.grid_columns = getColumns();
    setMyconfig(c);
    setSjzjuuid(param.sjzjuuid);
    setSjsbuuid(param.sjsbuuid);
    setIsIgnore(param.ktgydbz);
    setModalVisible(true);
  };

  // 添加私有页面或组件
  Func.getOtherRef = () => {
    const otherRef = [];
    const dcParam = {
      isIgnore,
      sjzjuuid,
      sjsbuuid,
      ywKey,
    };
    otherRef.push(dcParam);
    return otherRef;
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title="疑点管理"
      open={modalVisible}
      onClose={() => {setModalVisible(false)}}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      destroyOnHidden={true}
      className="dd_data_page_modal"
    >
      <DDBunit2 config={myConfig} func={Func} />
    </Drawer>
  );
};
export default Ydgl;
