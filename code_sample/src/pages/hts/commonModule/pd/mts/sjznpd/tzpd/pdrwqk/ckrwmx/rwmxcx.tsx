/**
 * 查看明细
 */
import React, { useImperativeHandle, useState, useRef} from 'react';
import config from './rwmx_config';
import Func from './rwmx_fun';
import { Modal,message} from 'antd';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import pro from '@/pages/common/proConfig';
import ModalScmx from './modal_scmx';


export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  ywKey?: any;
}
const Mtspd: React.FC<DDModalGridProps> = ({ onRef, visible = false, ywKey }) => {
  //全局变量页面开关
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [myConfig, setMyconfig] = useState<any>(config);
  const [pduuid, setPduuid] = useState<any>();
  const [tzpdztDm, setTzpdztDm] = useState<any>();
  const [param2, setParam2] = useState<any>();

  //绑定组件
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const scmxRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(scmxRef);
    return otherRef;
  };

  // 开启页面，并设置参数
  const showModal = (param: any) => {
    setParam2(param);
    // setModalVisible(true);
    const aConfig = { ...config };
    const pduuid = param.record?.pduuid;
    setPduuid(pduuid);
    setTzpdztDm(param.record?.tzpdztDm);
    // 查看明细页面，只有待生成、生成失败 显示“生成明细”按钮
    if(param.record?.tzpdztDm === '04' || param.record?.tzpdztDm === '14'){
      aConfig.costomer_toobar = [
        { name: '生成明细', key: 'scmx', func: 'scmx' },
      ];
    }
    if(pduuid) {
      const gridParams = {
        initSearchModal: [
          {property: "pduuid",value:pduuid,op:"zdy"}
        ],
      }
      aConfig.gridParams = gridParams;
      setMyconfig(aConfig);
      setModalVisible(true);
    } else {
      message.error('查看明细打开失败')
    }
  };

  const closeScmx=()=>{
    setModalVisible(false)
    param2?.unitRef.current?.reload2();

  }

  return (
    <>
      <Modal
        title="查看明细"
        destroyOnClose={true}
        visible={modalVisible}
        width={pro.c_modal_width_x4}
        wrapClassName="standard-modal-1"
        onCancel={() => setModalVisible(false)}
        footer={(<>
        </>)}
      >
        <DDBunit2 config={myConfig} func={Func} />
        <ModalScmx onRef={scmxRef} pduuid={pduuid} tzpdztDm={tzpdztDm} closeScmx = {closeScmx}/>
      </Modal>
    </>
  );
};

export default Mtspd;
