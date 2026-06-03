/**
 * 异常商品码处理
 */
import React, { useImperativeHandle, useState, useEffect, useRef } from 'react';
import { Modal, Button, Table, message, Spin } from 'antd';
import { useIntl } from 'umi';
import pro from '@/pages/common/proConfig';
import myUtil from '@/pages/common/myUtil';
import DDAlert from '@/components/DDAlert';
import { updateTzCmcode } from '@/services/hts/api';

import CheckCmcodeBgdxq from './check_cmcode_bgdxq';
import CheckCmcodeXzspm from './check_cmcode_xzspm';
import CheckCmcodeTzspm from './check_cmcode_tzspm';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  ywKey?: any;
}
const Ycspmcl: React.FC<DDModalGridProps> = ({ onRef, visible = false, ywKey }) => {
  const intl = useIntl();
  const [mainParam, setMainParam] = useState<any>();
  //全局变量页面开关
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  //列表显示项
  const [gridData, setGridData] = useState<any>([]);
  const [masker, setMasker] = useState<boolean>(false);

  const checkCmcodeBgdxqRef: any = useRef(); // 报关单详情
  const checkCmcodeXzspmRef: any = useRef(); // 选择商品代码
  const checkCmcodeTzspmRef: any = useRef(); // 调整商品代码

  //绑定组件
  useImperativeHandle(onRef, () => {
    return {
      showModal,
      CallbackFmFunc,
    };
  });

  useEffect(() => {
  }, []);

  // 开启页面，并设置参数
  const showModal = (param: any, gridData: any) => {
    setModalVisible(true);
    setMainParam(param) ;
    setGridData(gridData);
  };

  // 商品码回写
  const CallbackFmFunc = (param: any) => {
    const { record, index } = param;
    const newData = [...gridData];
    const tempData = { ...newData[index] };
    // 将商品码、税率回显
    tempData.tzcmcode = record.ckspDm;
    tempData.tzTsl = record.tsl;
    newData.splice(index, 1, tempData);
    setGridData(newData);
  }

  // 配置列表列
  const getColumns = () => {
    // 列表内容格式化: 报关单号
    const renderBgdNo = (text: any, record: any, index: number) => {
      if (text) {
        return (
          <Button type="link" onClick={() => {
            checkCmcodeBgdxqRef.current?.showModal(record.bgdNoEterArray);
          }}>
            {text}
          </Button>
        );
      } else {
        return (<></>);
      }
    }
    // 列表内容格式化: 调整原因
    const renderTzYy = (text: any, record: any, index: number) => {
      if (text === '11') {
        return '商品码异常';
      } else if (text === 'tz') {
        return '商品码库中不存在';
      } else {
        return '';
      }
    }
    // 列表内容格式化: 调整后税率
    const renderTzTsl = (text: any, record: any, index: number) => {
      return text ? myUtil.text.formatNum(text, '0,0.00') : text;
    }
    const col = [
        { title: '异常商品码', dataIndex: 'cmcode', width: 110 },
        { title: '出口年月', dataIndex: 'ckYm', width: 80 },
        { title: '报关单号', dataIndex: 'bgdNo', width: 180, render: renderBgdNo },
        { title: '调整原因', dataIndex: 'tzYy', width: 130, ellipsis: true, render: renderTzYy },
        { title: '调整后商品码', dataIndex: 'tzcmcode', width: 110 },
        { title: '调整后税率', dataIndex: 'tzTsl', width: 130, align: 'right', render: renderTzTsl },
        { title: '操作', align: 'center', width: 100, render: (text: any, record: any, index: number) => (<>
          <Button type='link' onClick={() => {
            if (record.tzYy == '11') {
              checkCmcodeXzspmRef.current?.showModal({onRef, record, index});
            } else if (record.tzYy == 'tz') {
              checkCmcodeTzspmRef.current?.showModal({onRef, record, index});
            }
          }} >操作</Button>
        </>)},
      ];
    return col;
  }

  //子页面关闭事件
  const close = () => {
    setModalVisible(false);
    setGridData([]);
  }

  // 继续功能按钮
  const ycspmtzJx = () => {
    function funcUpdateTzCmcode(checkArr: any, unCheckArr: any) {
      const param = {
        bgdNoEterArray: JSON.stringify(checkArr)
      }
      setMasker(true);
      updateTzCmcode(param).then((res) => {
        setMasker(false);
        const { code, msg, body } = res;
        if (code !== '200') {
          message.error(msg);
        } else {
          message.success(body);
          // if (unCheckArr.length > 0) {
          //   setGridData(unCheckBgdArr);
          // } else {
            close();
            mainParam.otherRef[mainParam.otherRef.length - 1].shjcFunc(mainParam, 'Y');
          // }
        }
      })
    }
		// 未进行异常商品码调整的报关单数组
		const unCheckBgdArr: any = [];
		// 已进行异常商品码调整的报关单数组
		const checkBgdArr: any = [];
    gridData.forEach((item: any) => {
      if (item.tzcmcode) {
        checkBgdArr.push(item);
      } else {
        unCheckBgdArr.push(item);
      }
    });
    if (unCheckBgdArr.length > 0) {
      let info = unCheckBgdArr.length + '条报关单异常商品码未调整，是否继续检查其他报关单？'
      DDAlert.open({
        title: '系统提示',
        infoType: 'warning',
        info: info,
        closeStatus: true,
        okCallbackFn: function () {
          if (checkBgdArr.length > 0) {
            funcUpdateTzCmcode(checkBgdArr, unCheckBgdArr);
          } else {
            close();
            mainParam.otherRef[mainParam.otherRef.length - 1].shjcFunc(mainParam, 'Y');
          }
        }
      })
    } else {
      funcUpdateTzCmcode(gridData, unCheckBgdArr);
    }
  }

  return (
    <>
      <Modal
        title="异常商品码调整"
        destroyOnClose={true}
        visible={modalVisible}
        width={pro.c_modal_width_x4}
        wrapClassName="standard-modal-1"
        onCancel={() => close()}
        footer={(<>
          <Button onClick={() => ycspmtzJx()} type="primary">继续</Button>
          <Button onClick={() => close()} type="default">关闭</Button>
        </>)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <Table
            rowKey='sbId'
            size="small"
            pagination={false}
            columns={getColumns()}
            dataSource={gridData}
            scroll={{x: 'max-content'}}
          />
        </Spin>
      </Modal>
      <CheckCmcodeBgdxq onRef={checkCmcodeBgdxqRef} />
      <CheckCmcodeXzspm onRef={checkCmcodeXzspmRef} />
      <CheckCmcodeTzspm onRef={checkCmcodeTzspmRef} />
    </>
  );
};

export default Ycspmcl;