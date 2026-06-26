/**
 * 按报关单开具  编辑开票
 */
import React, { useImperativeHandle, useState } from 'react';
import { Button, message, Spin, Modal, Form, Select, Alert } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import ProTable from '@ant-design/pro-table';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import { DrawerForm } from '@ant-design/pro-form';
import myUtil from '@/components/DDAssist/util';
import { useIntl } from 'umi';
import './style.less';
import { scfpsqd, xbgdkhxx } from '@/pages/hts/services/htsApi';

export interface AbgdBjProps {
  onRef?: any;
}

const ModalBj: React.FC<AbgdBjProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectRowKeys, setSelectRowKeys] = useState<any>([]); //选中的行的key
  const [selectRows, setSelectRows] = useState<any>([]); //选中的行的值
  const [tableData, setTableData] = useState<any>([]); // 主页面传递的主数据
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const intl = useIntl();
  const [masker, setMasker] = useState<boolean>(false); // 蒙板
  const [maskerG, setMaskerG] = useState<boolean>(false);
  const [mainRef, setMainRef] = useState<any>({}); //主页面的ref
  const [selectData, setSelectData] = useState<any>([]); //选中数据的khuuids
  const [modalVisibleG, setModalVisibleG] = useState<boolean>(false);
  const [formGmf] = Form.useForm();


  // 开启
  const showModal = (param: any) => {
    setModalVisible(true);
    dealTableData(param?.data);
    setMainRef(param?.ref);
  };

  // 将表格数据特殊处理，因为父节点的字段名称不能与子节点相同
  const dealTableData = (param: any) => {
    const tmp: any = [];
    const rowKeys: any = [];
    const rows: any = [];
    const expandKeys: any = [];
    param.forEach((data: any, index: any) => {
      const children = data.children;
      children.forEach((child: any) => {
        rowKeys.push(child.bgdtybh + child.hwxh);
        rows.push(child);
        child.uuid = child.bgdtybh + child.hwxh;
      });
      
      let tmpBgdhgbh = data.bgdhgbh;
      if (data.bgdhgbh === "" || data.bgdhgbh === null){
        if (data.bgdtybh === "" || data.bgdtybh === null){
          tmpBgdhgbh = "";
        }
        else{
          tmpBgdhgbh = data.bgdtybh;
        }
      }

      tmp.push({
        uuid: index,
        ckbgdhhz: '报关单号：' + (tmpBgdhgbh || ''),
        ybjehz: '成交币制：' + (data.cjhbzmDm || ''),
        hthhz: '出口合同号：' + (data.ckhth || ''),
        ckrqhz: '出口日期：' + (data.ckrq1 || ''),
        children: children,
      });
      expandKeys.push(index);
    });
    setTableData(tmp);
    setSelectRowKeys(rowKeys);
    setSelectRows(rows);
    setExpandedRowKeys(expandKeys);
  };

  // 初始化列表的样子
  const initRowClassName = (record: any) => {
    if (record.ckbgdhhz) {
      return 'abgdkj-row-expand';
    } else {
      return '';
    }
  };

  // 处理项号返回列
  const renderXhRow = (value: any, row: any) => {
    const obj = {
      children: value,
      props: { colSpan: 1 },
    };
    if (row.ckbgdhhz) {
      obj.children = row.ckbgdhhz;
      obj.props.colSpan = 2;
    }
    return obj;
  };

  // 处理其他返回列
  const renderOtherRow = (value: any, row: any) => {
    const obj = {
      children: value,
      props: { colSpan: 1 },
    };
    if (row.ckbgdhhz) {
      obj.props.colSpan = 0;
    }
    if (row.sl === value) {
      obj.children = myUtil.text.formatNum(value, '0,0.00000');
    }
    if (row.sycjzj === value) {
      obj.children = myUtil.text.formatNum(value, '0,0.00');
    }
    return obj;
  };

  // 处理原币币制列
  const renderYbbzRow = (value: any, row: any) => {
    const obj = {
      children: value,
      props: { colSpan: 1 },
    };
    if (row.ybjehz) {
      obj.children = row.ybjehz;;
      obj.props.colSpan = 2;
    }
    if (row.cjzj === value) {
      obj.children = myUtil.text.formatNum(value, '0,0.00');
    }
    return obj;
  };

  // 处理合同号列
  const renderHthRow = (value: any, row: any) => {
    const obj = {
      children: value,
      props: { colSpan: 1 },
    };
    if (row.hthhz) {
      obj.children = row.hthhz;
      obj.props.colSpan = 3;
    }
    return obj;
  };

  // 处理出口日期列
  const renderCkrqRow = (value: any, row: any) => {
    const obj = {
      children: value,
      props: { colSpan: 1 },
    };
    if (row.ckrqhz) {
      obj.children = row.ckrqhz;
      obj.props.colSpan = 2;
    }
    return obj;
  };

  // table显示列
  const columns = [
    { title: '报关单号', dataIndex: 'bgdtybh', key: 'bgdtybh', hideInTable: true },
    { title: '项号', dataIndex: 'hwxh', width: 120, key: 'hwxh', render: renderXhRow },
    { title: '商品代码', dataIndex: 'hgckspDm', width: 120, key: 'ckspDm', render: renderOtherRow },
    { title: '商品名称', dataIndex: 'hgspmc', width: 100, ellipsis: true, key: 'hgspmc', render: renderCkrqRow },
    { title: '规格型号', dataIndex: 'ggxh', width: 110, ellipsis: true, key: 'ggxh', render: renderOtherRow },
    { title: '单位', dataIndex: 'jldwmc', width: 70, key: 'jldwmc', render: renderHthRow },
    { title: '数量', dataIndex: 'sl', width: 100, key: 'sl', align: 'right', colSpan: 1, render: renderOtherRow },
    { title: '成交金额', dataIndex: 'cjzj', width: 115, key: 'cjzj', align: 'right', colSpan: 1, render: renderYbbzRow },
    { title: '剩余成交金额', dataIndex: 'sycjzj', width: 115, key: 'sycjzj', align: 'right', colSpan: 1, render: renderOtherRow },
  ];

  // 获取选中行的key与内容
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectRowKeys(selectedRowKeys);
      setSelectRows(selectedRows);
    },
  };

  // 展开或收起行时触发
  const onExpandedRowsChange = (expandedRows: any) => {
    setExpandedRowKeys(expandedRows);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 校验购买方是否一致
  const checkGmf = () => {
    if (selectRows.length > 0) {
      const temp: any = [];
      selectRows.forEach((row: any) => {
        if (row.khuuid && row.ghfnsrmc) {
          // 不存在时放入数组中
          if (temp.findIndex((item: any) => item.khuuid === row.khuuid) === -1) {
            temp.push({ khuuid: row.khuuid, ghfnsrmc: row.ghfnsrmc })
          }
        }
      });
      setSelectData(temp);
      if (temp.length > 1) {
        setModalVisibleG(true);
      } else {
        fkscBgdOrSp('2');
      }
    } else {
      message.info(intl.formatMessage({ id: 'message_handle_unselected' }));
    }
  }

  // 保存购买方
  const saveModalGmf = () => {
    const khuuid = formGmf.getFieldValue('khuuid');
    if (khuuid) {
      const bgdhgbhs: any = [];
      selectRows.forEach((row: any) => {
        if (row.ckbgdh) {
          // 不存在时放入数组中
          if (!bgdhgbhs.includes(row.bgdhgbh)) {
            bgdhgbhs.push(row.bgdhgbh || row.bgdtybh)
          }
        }
      });
      setMaskerG(true);
      xbgdkhxx({ bgdhgbhs, khuuid: khuuid }).then((response) => {
        setMaskerG(false);
        const { code, desc } = response;
        if (code === '200') {
          // 立即开票
          saveFpsqd(getSelectBgdhgbhs(), '2');
          setModalVisibleG(false);
        } else {
          message.error(desc);
        }
      });
    } else {
      message.info(intl.formatMessage({ id: 'message_ckfp_abgdkj_scfpsqd_checkgmfmc' }));
    }
  }

  // 报关单分开生成或者商品生成
  const fkscBgdOrSp = (param: any) => {
    if (selectRows.length > 0) {
      const bgdhgbhs = getSelectBgdhgbhs();
      // 立即开票
      saveFpsqd(bgdhgbhs, param);
    } else {
      message.info(intl.formatMessage({ id: 'message_handle_unselected' }));
    }
  };

  // 获取选中报关单统一编号（去重）
  const getSelectBgdhgbhs = () => {
    const bgdhgbhs: any = [];
    selectRows.forEach((row: any) => {
      if (row.ckbgdh) {
        // 不存在时放入数组中
        if (!bgdhgbhs.includes(row.ckbgdh)) {
          bgdhgbhs.push(row.ckbgdh)
        }
      }
    });
    return bgdhgbhs;
  }

  // 立即开票
  const saveFpsqd = (bgdhs: any, param: any) => {
    setMasker(true);
    scfpsqd({ bgdlx: '2', bgdhs: bgdhs, scfpsqdfsDm: param }).then((response: any) => {
      setMasker(false);
      const { code, body, desc } = response;
      if (code === '200') {
        mainRef.current!.reload2();
        setModalVisible(false);
        DDAlert.open({
          title: '立即开票',
          info: '立即开票成功',
          content: [
            '发票单据号' + body.fpsqdsl + '张',
            '申请单金额总计' + myUtil.text.formatNum(body.fpsqdzje, '0,0.00') + '元',
          ],
        });
      } else {
        if (body.sjztczbz === 'Y' && code === '300') {
          setModalVisible(false);
          mainRef.current!.reload2();
          message.error(intl.formatMessage({ id: 'message_ckfp_abgdkj_scfpsqd_wszssbm' }));
        } else {
          message.error(desc);
        }
      }
    })
  }

  return (
    <DrawerForm
      title="编辑开票"
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      // className='abgd_bjkp_drawer'
      className={`abgd_bjkp_drawer ${masker ? 'dd_modal_show_masker' : ''}`}
      onVisibleChange={setModalVisible}
      submitter={{
        render: () => {
          return [
            <>
              <Button onClick={() => setModalVisible(false)} style={{ marginRight: '10px' }}>取消</Button>
              <Button type="primary" onClick={() => { checkGmf() }} style={{ marginRight: '10px' }}>多张关单合并生成</Button>
              <Button type="primary" onClick={() => { fkscBgdOrSp("1") }} style={{ marginRight: '10px' }}>每张关单分开生成 </Button>
              <Button type="primary" onClick={() => { fkscBgdOrSp("3") }}>每项商品分开生成</Button>
            </>,
          ];
        },
      }}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <ProTable
          columns={columns}
          rowSelection={{ ...rowSelection, checkStrictly: true, selectedRowKeys: selectRowKeys }}
          dataSource={tableData} //tableData
          pagination={false}
          size={'small'}
          bordered={true}
          expandable={{
            onExpandedRowsChange: onExpandedRowsChange,
            expandedRowKeys: expandedRowKeys,
          }}
          scroll={{ y: `${document.documentElement.clientHeight - 170}px` }}
          search={false}
          options={false}
          tableAlertRender={false}
          tableAlertOptionRender={false}
          rowKey="uuid"
          rowClassName={initRowClassName}
        />
      </Spin>
      <Modal
        title="设置购买方"
        destroyOnHidden={true}
        visible={modalVisibleG}
        layoutType="vertical"
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        className={`${maskerG ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={() => setModalVisibleG(false)}>取消</Button>
            <Button onClick={saveModalGmf} type="primary">确定</Button>
          </>
        }
        onCancel={() => setModalVisibleG(false)}
      >
        <Spin tip="Loading..." spinning={maskerG} delay={100}>
          <Form
            form={formGmf}
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 14 }}
            autoComplete="off"
            className="formClass"
          >
            <Alert
              message="购买方不一致，请选择购买方信息。"
              showIcon
              type="error"
              style={{ marginBottom: '20px' }}
            />
            <Form.Item name="khuuid" label="购买方名称">
              <Select placeholder="购买方名称" allowClear>
                {selectData.map((e: any) => <Select.Option key={e.khuuid} value={e.khuuid}>{e.ghfnsrmc}</Select.Option>)}
              </Select>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </DrawerForm>

  );
};

export default ModalBj;
