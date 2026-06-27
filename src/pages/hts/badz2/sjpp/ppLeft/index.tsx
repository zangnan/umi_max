import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './config';
import func from './func'
import { cloneDeep } from 'lodash';
import ZdppBgd from '../../common/zdpp/zdppBgd';
import { Form, message, Radio, Space } from "antd";
import { zdppBadz, badzJcpp } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/commonModule/DDAlert';

export interface leftProps {
  gridLeftClick?: any
}

const Index: React.FC<leftProps> = ({
  gridLeftClick,
}) => {
  const zdppBgdRef: any = useRef();

  let myConfig = cloneDeep(unitConfig);

  func.gridOnRowClick = (param: any) => {
    const { record } = param;
    if (gridLeftClick) {
      gridLeftClick(param, record.ppgzDm === '01' ? 'bgd' : 'sbpc');
    }
  }
  func.afterReload = (param: any) => {
    const { gridRef,unitRef } = param;
    const gridData = gridRef?.current?.getSource();
    if (gridData && gridData.length > 0) {
      gridLeftClick({ ...param, record: gridData[0] }, gridData[0]?.ppgzDm === '01' ? 'bgd' : 'sbpc');
    } else{
      gridLeftClick({ ...param, record: {} }, gridData[0]?.ppgzDm === '01' ? 'bgd' : 'sbpc');
    }
  }

  // 自动匹配
  func.badzZdpp = (param: any) => {
    const { record, unitRef } = param;
    if ("Y" === record.sfzdcc) {
      message.error("选定数据已完成备案，无法匹配");
    } else {
      unitRef.current!.setMasker(true);
      zdppBadz(record).then((response) => {
        unitRef.current!.setMasker(false);
        const { code, desc } = response;
        if (code === '200') {
          zdppBgdRef.current?.showModal(param, record, "ZDPP");
          gridLeftClick(param, record.ppgzDm === '01' ? 'bgd' : 'sbpc');
        } else {
          message.error(desc);
        }
      })
    }
  };

  // 解除匹配
  func.badzJcpp = (param: any) => {
    console.log(param);
    const { record, unitRef } = param;
    console.log(record);
    let jcppParam:any = {};
    let text = '将该单证解除匹配，是否确认？';
    DDAlert.open({
      title: '解除匹配',
      infoType: 'question',
      closeStatus: false,
      isFormContent: true,
      modalType: 'form',
      content: <>
      
          <div style={{marginBottom: '10px',marginLeft:'10px'}}>{text}</div>
          <Form.Item name="jcppfwDm" label="解除匹配数据范围" initialValue="01">
              <Radio.Group >
                <Space direction="vertical">
                  <Radio value="01" style={{padding: '5px 0'}}>
                    <span style={{paddingRight: '12px'}}>仅解除自动匹配的单证</span>
                  </Radio>
                  <Radio value="02">
                    <span style={{paddingRight: '12px'}}>解除所有已匹配的单证</span>
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

      </>,
      okCallbackFn: async function (thisObj: any) {
        let contentFormData = await DDAlert.getValidateFormData();
        console.log(contentFormData);
        // 此时我们组装参数，调用后端接口
        jcppParam.jcppfsDm = '01';
        jcppParam.jcppfwDm = contentFormData.jcppfwDm;
        // 再组装备案情况主键
        jcppParam.baqkUuid = record.uuid;
       // unitRef.current!.reload2(param);
        unitRef.current!.setMasker(true);
        badzJcpp(jcppParam).then((response) => {
            unitRef.current!.setMasker(false);
            const { code, desc } = response;
            if (code === '200') {
              unitRef.current!.reload2(param);
              message.success('解除匹配成功');
            } else {
              message.error(desc);
            }
            DDAlert.close();
          })
      },
    })
  };

  return <>
    <DDBunit2 config={myConfig} func={func} />
    <ZdppBgd onRef={zdppBgdRef} />
  </>;
};

export default Index;
