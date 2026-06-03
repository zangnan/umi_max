import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Modal, Button, Table, message, Spin } from 'antd';
import pro from '@/pages/common/proConfig';
import { shfkdr2,shfkwjdr,shfkdr2Check } from '@/services/hts/api';
import DDAlert from '@/components/DDAlert';
import { history, useIntl } from 'umi';



export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
}

const ErrorMsgGrid: React.FC<DDModalGridProps> = ({
  onRef,
  visible = false,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);// Modal是否可以显示
  const [data, setData] = useState<any>([]);
  const [msg, setMsg] = useState<any>("");
  const [masker, setMasker] = useState<any>(false);
  const [flag, setFlag] = useState<any>();
  const [formData, setFormData] = useState<any>();
  const [type, setType] = useState<any>();
  const intl = useIntl();



  // 配置项：列表列
  const error_grid_columns = [
    { title: '字段名称', dataIndex: 'zdmc', width: 200, },
    {
      title: '税务反馈信息', dataIndex: 'fkxx', width: 200, render: (text: any, param: any) => {
        let t = <></>;
        if (param?.fkxx == param?.xtxx) {
          t = <>{text}</>;
        } else {
          t = <div style={{ color: "red" }}>{text}</div>;
        }
        return t;
      }
    },
    {
      title: '当前企业信息', dataIndex: 'xtxx', width: 200, render: (text: any, param: any) => {
        let t = <></>;
        if (param?.fkxx == param?.xtxx) {
          t = <>{text}</>;
        } else {
          t = <div style={{ color: "red" }}>{text}</div>;
        }
        return t;
      }
    },
  ];
  // 开启
  const showModal = (body: any, flag: any, formDate: any, type: any) => {
    setModalVisible(true);
    setData(body);
    setFlag(flag);
    setFormData(formDate);
    setType(type);
    if ('901' == flag) {
      setMsg("税务反馈中的社会信用代码与当前企业的社会信用代码不一致，无法读入。");
    } else {
      setMsg("税务反馈中的企业信息与当前企业的企业信息不一致，若继续读入，则会更新当前企业的企业信息，确定继续操作吗?");
    }
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const save = () => {
    if(type == '1'){
      setMasker(true);
      formData.append('isJyBaxx', 'N');
      shfkdr2Check(formData).then((res) => {
        setMasker(false);
        const { code, body, msg } = res;
        if (code === '200') {
          setModalVisible(false);
          // message.success(body);
          setModalVisible(false);
          drcgTz();
        } else {
          message.error(msg);
        }
      });
    }else{
      setMasker(true);
      shfkwjdr(formData).then((res1) => {
        setMasker(false);
        const { code, body, msg } = res1;
        if (code == '200') {
          setModalVisible(false);
          drcgTz();
          // message.success(body);
        } else {
          message.error(msg);
        }
      })
    }
  }

  const drcgTz = () => {
    DDAlert.open({
      title: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_title' }),
      info: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_info' }),
      infoType: 'success',
      content: [
        intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_content_xzrw' }),
      ],
      okText: '转任务管理',
      okCallbackFn: function () {
        history.push('/02/0201');
      }
    });
  }


  return (
    <>
      <Modal
        title='系统消息'
        destroyOnClose={true}
        visible={modalVisible}
        width={pro.c_modal_width_x3}
        wrapClassName='standard-modal-1'
        footer={(<>
          <Button onClick={() => setModalVisible(false)}>关闭</Button>
          <Button type="primary" onClick={() => save()} hidden={flag=='901' ? true:false}>确认</Button>
        </>)}
        onCancel={() => setModalVisible(false)}
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        maskClosable={false}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <>
            <div style={{ fontSize: '15px', marginBlock: '10px' }}>{msg}</div>
            <Table
              dataSource={data}
              columns={error_grid_columns}
              pagination={false}
              size={'small'}
              bordered={true}
            />
          </>
        </Spin>
      </Modal>
    </>
  );
};

export default ErrorMsgGrid;