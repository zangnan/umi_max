/**
 * title: 按报关单匹配
 */
import React, { useImperativeHandle, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import DDBaseGrid from '@/components/DDBaseGrid';
import cktsUtil from '@/pages/hts/cktsUtil';
import { Button, Modal, Spin, message } from 'antd';
import { queryDzqqBgd, queryDzbqBgd, updateBawcbz, queryBadzMlSjtj } from '@/pages/hts/services/htsApi';
import CONSTANTS from '@/components/DDAssist/constants';
import Zlgl from '../ml/index_zlgl';
import myConfig from './config';

export type ZdppBgd = {
  onRef?: any;
  visible?: any;
}

const ZdppBgd: React.FC<ZdppBgd> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [masker, setMasker] = useState<boolean>(false);
  // 主列表刷新使用
  const [unitRef, setUnitRef] = useState<any>();
  // 报关单匹配规则标志
  const [bgdPpbz, setBgdPpbz] = useState<boolean>(false);
  // 点击数据局
  const [record, setRecord] = useState<any>({});
  // 全部关单详情数据
  const [qbgdData, setQbgdDataData] = useState<any>([]);
  // 单证不齐数据
  const [dzbqData, setDzbqDataData] = useState<any>([]);
  // 打开类型
  const [openType, setOpenType] = useState<string>("");
  // 选中的key
  const [tabKey, setTabKey] = useState<string>("DZQQ_BGD");

  const showModal = (param: any, record: any, openType: string) => {
    // 01:按照报关单 02:所属期批次
    const ppbgz = record.ppgzDm === '01' ? true : false;
    setBgdPpbz(ppbgz);
    setRecord(record);
    setOpenType(openType);
    setUnitRef(param.unitRef);
    if (ppbgz) {
      // 执行右侧全部关单详情、单证不齐关单，匹配条数3个接口
      setMasker(true);
      queryDzqqBgd({ uuid: record.uuid }).then((response) => {
        setMasker(false);
        const { code, body, desc } = response;
        if (code === '200') {
          setQbgdDataData(body);
        } else {
          message.error(desc);
        }
      })
      setMasker(true);
      queryDzbqBgd({ uuid: record.uuid }).then((response) => {
        setMasker(false);
        const { code, body, desc } = response;
        if (code === '200') {
          setDzbqDataData(body);
        } else {
          message.error(desc);
        }
      })
    }
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 标题样式
  const headStyle = { backgroundColor: '#39a0ed', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '10px', marginBottom: '-15px', width: '98%' };
  // 标题
  const title = "所属期：" + record.ssq + "   申报批次：" + (record.sbpc ? record.sbpc : "");

  // 导出
  const exportResult = async () => {
    let url = "";
    let params = {};
    if (bgdPpbz) {
      if (tabKey === "DZQQ_BGD" && qbgdData.length == 0) {
        message.error("暂无数据不支持导出");
        return;
      } else if (tabKey === "DZBQ_BGD" && dzbqData.length == 0) {
        message.error("暂无数据不支持导出");
        return;
      }
      url = '/hx/ty/report/excelExportGet/EXCEL_REPORT_ZXSB_BADZ_' + tabKey + '/';
      params = {
        uuid: record.uuid
      }
    } else {
      url = '/hx/ty/report/excelExportGet/EXCEL_REPORT_ZXSB_BADZ_BAQKML/';
      params = {
        zzbaBz: 'N',
        dzbaBz: 'Y',
        baqkUuid: record.uuid
      }
    }
    setMasker(true);
    await cktsUtil.downloadFileCkts(url, params);
    setMasker(false);
  };

  /**
   * 继续装订成册
   */
  const jxzdcc = () => {
    setMasker(true);
    queryBadzMlSjtj({ baqkUuid: record.uuid }).then((response) => {
      const { body, code, desc } = response;
      setMasker(false);
      if (code === '200') {
        if (body?.qtdzfs === 0 && body?.gxhtZfs === 0 && body?.ysdjZfs === 0 && body?.wtqtdwbgdjZfs === 0) {
          message.error("无可匹配单证，无法装订成册");
        } else {
          updateBawcbz(record).then((response) => {
            setMasker(false);
            const { code, desc } = response;
            if (code === '200') {
              message.success('操作成功');
              close();
              unitRef.current!.reload2();
            } else {
              message.error(desc);
            }
          })
        }
      } else {
        message.error(desc);
      }
    })

  }

  const close = () => {
    setModalVisible(false);
    setTabKey("DZQQ_BGD");
    setRecord({})
    setQbgdDataData([]);
    setDzbqDataData([])
    setOpenType("");
  }

  return (
    <Modal
      title={'ZDPP' === openType ? "自动匹配" : "装订成册备案"}
      centered
      destroyOnHidden
      visible={modalVisible}
      width={bgdPpbz ? CONSTANTS.C_MODAL_WIDTH_MAX : CONSTANTS.C_MODAL_WIDTH_X1}
      onCancel={() => close()}
      footer={(<>
        <Button onClick={() => close()} type="default">关闭</Button>
        <Button onClick={() => exportResult()} type="default">导出</Button>
        <Button onClick={() => jxzdcc()} type="primary">继续装订成册</Button>
      </>)}
    > <Spin tip="Loading..." spinning={masker} delay={100}>
        {
          bgdPpbz ?
            (<ProCard split="vertical" >
              <ProCard headStyle={headStyle} title={title} colSpan="30%" >
                <Zlgl record={record} />
              </ProCard>
              <ProCard colSpan="70%">
                <div>
                  <div style={{ paddingLeft: '15px' }}>{
                    openType === 'ZDPP' ?
                      "匹配完成，本次共匹配关单 " + qbgdData.length + " 份，其中匹配成功关单 " + (qbgdData.length - dzbqData.length) + " 份，单证不齐关单 " + dzbqData.length + " 份，请检查！"
                      :
                      "存在单证不齐关单 " + dzbqData.length + " 份，确定要继续装订成册？"
                  }</div>
                  <ProCard
                    tabs={{
                      type: 'card',
                      activeKey: tabKey,
                      onChange: (activeKey: string) => {
                        setTabKey(activeKey);
                      }
                    }}>
                    <ProCard.TabPane key="DZQQ_BGD" tab={"全部关单详情（" + qbgdData.length + "）"}>
                      <DDBaseGrid
                        userDataSource={qbgdData}
                        columns={myConfig.qbgd_columns}
                        showSerialNumber
                        pagination={false}
                      />
                    </ProCard.TabPane>
                    <ProCard.TabPane key="DZBQ_BGD" tab={"单证不齐关单（" + dzbqData.length + "）"}>
                      <DDBaseGrid
                        userDataSource={dzbqData}
                        columns={myConfig.dzbq_columns}
                        showSerialNumber
                        pagination={false}
                      />
                    </ProCard.TabPane>
                  </ProCard>
                </div>
              </ProCard>
            </ProCard>) :
            (<ProCard headStyle={headStyle} title={title}>
              <Zlgl record={record} />
            </ProCard>)
        }
      </Spin>
    </Modal>
  )
};

export default ZdppBgd;
