/**
 * 批量修改
 */
import { intl } from '@/components/DDAssist/util';
import React, { useImperativeHandle, useState, memo, useRef } from 'react';
import { Modal, Button, message, Form, Input, Select, Space, DatePicker, InputNumber, List, Spin } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import myUtil from '@/components/DDAssist/util';
import businessValidator from '@/pages/hts/common/field/businessValidator';
import moment from 'moment';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import { request } from 'umi';
import Wxspglfm from '@/pages/hts/ckfp/fpkjpz/fm/wxspglfm';
import UnitUtil from '@/components/DDBunit/unit_util';
import DDAlert from '@/pages/hts/components/DDAlert';

export interface DDBatchUpdateProps {
  onRef?: any;
  visible?: any;
}

const DDBatchUpdate: React.FC<DDBatchUpdateProps> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);

  const [updataItem, setUpdataItem] = useState<any>([]);// 修改项

  const [ref, setRef] = useState<any>("");// 主列表

  const [type, setType] = useState<any>([]);// 存储修改项选中的类型，用于配置修改值列显示的内容

  const [selectData, setSelectData] = useState<any>([]);// 下拉选中字段（设置不可选中）

  const [form] = Form.useForm();

  const [masker, setMasker] = useState<boolean>(false);

  // const intl = useIntl(); // 提示信息

  const [updateParam, setUpdateParam] = useState<any>({});// 保存时需要传输的参数

  const [url, setUrl] = useState<string>('/hts/ckfp/gt/gtTsxx');// 保存调用的url

  const [gridParams, setGridParams] = useState<any>();// 主页面的查询条件

  const [ssflbmObj, setSsflbmObj] = useState<any>({});

  const [showYhzc, setShowYhzc] = useState<any>('N');

  const wxspglfmRef: any = useRef();
  // console.info('render DDBatchUpdate ~~~')

  // 开启
  const showModal = (param: any) => {
    setModalVisible(true);
    setUpdataItem(param?.data); // 可以修改的字段
    setUpdateParam(param?.apiParams); // 保存时需要传输的其他参数
    setUrl(param?.url); // 保存时调用的url
    setRef(param?.ref); // 主页面的ref
    setGridParams(param?.gridParams); // 主页面的查询条件
    setType([]);
    setSelectData([]);
    setSsflbmObj({});
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
      CallbackFmFunc
    };
  });

  // 修改项选中时触发的方法
  const selectChange = (event: any, key: any, name: any) => {
    addOption('');
    setShowYhzc('N');
    // 获取修改项选中的对象
    const dataTemp = updataItem.filter((temp: any) => temp.dataIndex === event);
    const newData = [...type];
    const dataIndex = newData.findIndex((temp: any) => temp.key === key);
    if (dataIndex > -1) {
      // 如果当前修改项存在，则替换对应的类型
      const typeData = newData[dataIndex];
      newData.splice(dataIndex, 1, {
        ...typeData,
        ...{ value: dataTemp[0] },
      });
    } else {
      newData.push({ key: key, value: dataTemp[0] });
    }
    setType(newData);
    // 切换修改类型时将值置空
    const names = form.getFieldValue("names");
    names[name].xgw = undefined;
    form.setFieldsValue(names)
  }

  const addOption = (key: any) => {
    // 重新获取选中的数据，设置不可选中
    const names = form.getFieldValue("names");
    const selectOption = names.map((name: any) => name?.xgx);
    setSelectData(selectOption);
    if (key != '') {
      const newData = [...type];
      const dataIndex = newData.findIndex((temp: any) => temp.key === key);
      if (dataIndex > -1) {
        newData.splice(dataIndex, 1);
      }
      setType(newData);
    }
  }

  // 根据左侧的修改值，重新渲染右侧的值值列
  const wrapperElement = (name: any, key: any) => {
    let initContent =
      <Form.Item name={[name, 'xgw']} label={'值'} rules={[{ required: true, message: '请输入修改后的值' }]}>
        <Input />
      </Form.Item>;
    const selectOption = type.filter((temp: any) => temp.key === key);
    let rulesConfig: any = [];
    if(selectOption[0]?.value?.rules){
      rulesConfig = UnitUtil.form.getValidatorData(selectOption[0]?.value?.rules ,type);
    }
    UnitUtil.form.getValidatorData(selectOption[0]?.value?.rules ,type);
    if ("tzhjhfpl" === selectOption[0]?.value?.dataIndex) {
      initContent =
      <div>
        <span style={{ display: 'inline-block', width: '222px', margin: '0px 0 0 14px', fontSize: '12px', position: 'relative', top: '9px'}}>
          根据最新审核结果，批量更新出口明细计划分配率
        </span>
        <Form.Item name={[name, 'xgw']} label={'值123'} initialValue='1' hidden={true} />
      </div>;
    } else if ("tableSelect" === selectOption[0]?.value?.type) {
      // 下拉选择框
      const codeTable = selectOption[0]?.value?.codeTable;
      const code = myUtil.code.getCode(codeTable[0], codeTable[1]);
      if ("cktmsywlxdmjh" === selectOption[0]?.value?.dataIndex) {
        initContent =
          <Form.Item name={[name, 'xgw']} label={'值'} validateFirst={true} rules={[{ required: true, message: '请输入修改后的值' }, businessValidator.cktmsywlxdmjh()]}>
            <Select mode='multiple' optionLabelProp='value' maxTagCount="responsive">
              {code.map((selectItem: any) => (
                <Select.Option key={selectItem.code} value={selectItem.code}>{selectItem.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>;
      }
      else {
        initContent =
          <Form.Item name={[name, 'xgw']} label={'值'} rules={[{ required: true, message: '请输入修改后的值' }]}>
            <Select >
              {code.map((selectItem: any) => (
                <Select.Option key={selectItem.code} value={selectItem.code}>{selectItem.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>;
      }
    }
    else if ("customSelect" === selectOption[0]?.value?.type){
      if(selectOption[0]?.value?.dataIndex === 'syyhzcbz') {
        // 享受优惠政策
        initContent =
          <div>
              <Form.Item name={[name, 'xgw']} label={'值'} validateFirst={true} rules={[{ required: true, message: '请选择修改后的值' }]}>
                <Select onChange={()=>setShowYhzc('Y')}>
                  {selectOption[0]?.value?.data.map((selectItem: any) => (
                    <Select.Option key={selectItem.value} value={selectItem.value}>{selectItem.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {/* {showYhzc === 'Y' ?
                <span style={{ display: 'inline-block', width: '241px', margin: '0px 0px 0px 12px', fontSize: '12px', position: 'absolute', top: '34px',color:'#ff4d4f'}}>
                  请根据实际业务同时调整税率和优惠政策类型
                </span> : <></>
              } */}
          </div>;
      } else {
        initContent =
          <Form.Item name={[name, 'xgw']} label={'值'} validateFirst={true} rules={[{ required: true, message: '请选择修改后的值' }]}>
            <Select onChange={()=>setShowYhzc('Y')}>
              {selectOption[0]?.value?.data.map((selectItem: any) => (
                <Select.Option key={selectItem.value} value={selectItem.value}>{selectItem.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
      }
    }
    else if ("ssflbmModel" === selectOption[0]?.value?.type){
      initContent =
          <Form.Item name={[name, 'xgw']} label={'值'} validateFirst={true} rules={[{ required: true, message: '请选择修改后的值' }] }>
            <Input onFocus={clickItem} />
          </Form.Item>;
        //   <Form.Item name={[name, 'xgw']} label={'值'}>
        //   <Button onClick={clickItem} type="link">{buttonText}</Button>
        //   {/* <Button style = {{ marginRight : '63px'}} onClick={clickItem} type="link">{buttonText}</Button> */}
        //   <Input hidden />
        // </Form.Item>;
    }
    else if ("Input" === selectOption[0]?.value?.type) {
      // 文本框
      // 去掉必录项校验
      if (!selectOption[0]?.value?.unRequired) {
        rulesConfig.push({ required: true, message: '请输入修改后的值' })
      }
      if (selectOption[0]?.value?.dataIndex === 'ssq') {
        rulesConfig.push(businessValidator.ssq());
      } else if (selectOption[0]?.value?.dataIndex === 'sbpc') {
        rulesConfig.push(businessValidator.sbpc());
      } else if (selectOption[0]?.value?.dataIndex === 'sbxh') {
        rulesConfig.push(businessValidator.sbxh());
      }
      initContent =
        <Form.Item name={[name, 'xgw']} label={'值'} validateFirst={true} rules={rulesConfig}>
          <Input maxLength={selectOption[0]?.value?.maxLength} />
        </Form.Item>;
    } else if ("Date" === selectOption[0]?.value?.type) {
      // 日期框
      initContent =
        <Form.Item name={[name, 'xgw']} label={'值'} rules={[{ required: true, message: '请输入修改后的值' }]}>
          <DatePicker format={myUtil.date.formatList()} />
        </Form.Item>;
    } else if ("InputNumber" === selectOption[0]?.value?.type) {
      rulesConfig.push({ required: true, message: '请输入修改后的值' })
      rulesConfig.push(baseValidator.numRange(['0', '+']))
      if(selectOption[0]?.value?.precision){
        // 数字框
        initContent =
        <Form.Item name={[name, 'xgw']} label={'值'} rules={rulesConfig}>
          <InputNumber  precision={selectOption[0]?.value?.precision}/>
        </Form.Item>;
      }else{
        <Form.Item name={[name, 'xgw']} label={'值'} rules={rulesConfig}>
          <InputNumber />
        </Form.Item>;
      }

    }
    return initContent;
  }

  const clickItem = async (event: any) => {
      await setSsflbmObj({});
      wxspglfmRef.current!.showModal({ mainRef: onRef, zslx: 'batchUpdate' });
  }

  const CallbackFmFunc = (params: any) => {
    const { record, fmMainRef } = params;
    message.info(intl.formatMessage({ id: 'message_ckfp_fppz_fm_success' }));
    let obj = {sphfwssflhbbm: record.sphfwssflhbbm, hwhlwmc: record.hwhlwmc, hwhlwjc: record.hwhlwjc};
    setSsflbmObj(obj);
    // 设置input的值
    const names = form.getFieldValue("names");
    names.forEach((value: any) => {
      if (value?.xgx === 'sphfwssflhbbm'){
        value.xgw = record.sphfwssflhbbm;
      }
    });
    form.setFieldsValue(names)

    // 关闭赋码弹窗
    fmMainRef.current.closeModal();
  }

  // 批量修改保存
  const saveModal = async () => {
    const values = await form.validateFields();
    let ssflbmUptFlag: boolean = false;
    let updateItems: any = {};
    values.names.forEach((value: any) => {
      const selectOption = updataItem.filter((temp: any) => temp.dataIndex === value.xgx);
      let xgw = value.xgw;
      if ('Input' === selectOption[0]?.type) {
          xgw = xgw ? xgw : '';
      }
      if (value.xgx === "sphfwssflhbbm") {
          ssflbmUptFlag = true;
      }
      if ('Date' === selectOption[0]?.type) {
        xgw = moment(xgw._d).format('YYYY-MM-DD');
      }
      updateItems = Object.assign(updateItems, { [value.xgx]: xgw,  });
      if (value.xgx === "cktmsywlxdmjh") {
        updateItems = Object.assign(updateItems, { [value.xgx]: xgw.toString()});
        const xgwName = myUtil.code.getCodeValByKey(xgw, 'code_dm_ckts_cktmsywlx:04')
        updateItems = Object.assign(updateItems, { ["cktmsywlxmcjh"]: xgwName });
      } else {
        updateItems = Object.assign(updateItems, { [value.xgx]: xgw });
      }
    });
    if(ssflbmUptFlag){
      Object.assign(updateItems, ssflbmObj);
    }
    let param = Object.assign(updateItems, updateParam);
    let text = param.uuids?.length == 0
        ? '将修改当前筛选条件下的所有数据，是否确认？'
        : '将修改选中的数据，是否确认？';
    // edit by mafuchuang 20250813 TCL二期标版：提示信息变更
    const textSxOrXz = param.uuids?.length === 0
      ? '将修改当前筛选条件下的所有数据'
      : '将修改选中的数据';
    const firstTip = (
      <span key="tip1">
        1.点击【确定】<span style={{ color: '#ff0000', fontWeight: 'bold' }}>{textSxOrXz}</span>，请谨慎操作！
      </span>
    );
    // 免退税
    const isMtsUrl = url.includes("/yw/bszx/mts/hwlw/tsjh/tsjhPlgxSbmxsj") ||
      url.includes("/yw/bszx/mts/hwlw/tssb/mtsPlgxSbmxsj");
    const isMdsUrl = url.includes("/yw/bszx/mdt/hwlw/tssb/mdtPlgxSbmxsj");
    if (isMtsUrl) {
      text = [
        text,
        '温馨提示：',
        firstTip,
        '2.修改【申报年月】、【申报批次】时，相同关联号的出口明细和进货明细将会一并修改。'
      ];
    } else if (isMdsUrl) {
      text = [
        text,
        '温馨提示：',
        firstTip,
        '2.修改【所属期】时，相同关联号的出口明细和进货明细将会一并修改。'
      ];
    } else if (url.includes("/yw/bszx/mdt/hwlw/tssb/mdtPlgxSbmxsj")) {
      text = [
        text,
        '温馨提示：',
        firstTip
      ];
    }
    DDAlert.open({
      title: '系统提示',
      info: text,
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: false,
      okCallbackFn: function (thisObj: any) {
        // edit by yangzq 20240625 致欧需求：修改出口、进货明细时增加提示
        if ((url.indexOf("/yw/bszx/mts/hwlw/tsjh/tsjhPlgxSbmxsj") > 0 || url.indexOf("/yw/bszx/mts/hwlw/tssb/mtsPlgxSbmxsj") > 0) && (updateItems.ssq || updateItems.sbpc)){
          setMasker(true);
          param.adQuery = gridParams.searchModel;
          request(url, { method: 'POST', data: param }).then((response: any) => {
            setMasker(false);
            const { code, desc } = response;
            if (code === '200') {
              message.success(intl.formatMessage({ id: 'message_common_batchedit_success' }));
              closeModel();
              ref.current!.reload();
            } else if (code === '900'){
              DDAlert.open({
                title: '系统提示',
                infoType: 'warning',
                info: '以下关联号已存在，请更换申报年月或申报批次',
                okText: '确定',
                closeStatus: false,
                isFormContent: false,
                width: CONSTANTS.C_MODAL_WIDTH_X2,
                content: <>
                  <List
                    size="small"
                    split={false}
                    locale={{ emptyText: '暂无数据' }}
                    dataSource={desc}
                    renderItem={(item: any) => <List.Item>{item.glh}</List.Item>}
                  />
                </>,
                okCallbackFn: function (thisObj: any) {
                  DDAlert.close();
                },
              });
            } else {
              message.error(desc);
            }
          })
          DDAlert.close();
        }else{
          setMasker(true);
          param.adQuery = gridParams.searchModel;
          request(url, { method: 'POST', data: param }).then((response: any) => {
            setMasker(false);
            const { code, body, desc } = response;
            if (code === '200') {
              // 重置税收分类编码缓存
              setSsflbmObj({});
              message.success(intl.formatMessage({ id: 'message_common_batchedit_success' }));
              closeModel();
              ref.current!.reload();
            } else {
              message.error(desc);
            }
          })
          DDAlert.close();
        }

       // ref.current!.reload();
  }});
  };

  const closeModel = () => {
     // 重置税收分类编码
     setSsflbmObj({});
     setModalVisible(false);
  }

  return (
    <>
      <Modal
        title="批量修改"
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        footer={
          <>
            <Button onClick={() => closeModel()}>取消</Button>
            <Button onClick={saveModal} type="primary">确定</Button>
          </>
        }
        onCancel={() => closeModel()}
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <Form colon={false} preserve={false} form={form} className="dd_form_x2">
            <Form.List name="names" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space key={field.name} align="baseline" style={{ marginLeft: updataItem.length === 1 ? '85px' : '45px' }}>
                      <Form.Item
                        label='修改项'
                        rules={[{ required: true, message: '请选择修改项' }]}
                        name={[field.name, 'xgx']} >
                        <Select onSelect={(value: any) => { selectChange(value, field.key, field.name) }}>
                          {updataItem.map((selectItem: any) => (
                            <Select.Option key={selectItem.dataIndex} disabled={selectData.indexOf(selectItem.dataIndex) != -1} value={selectItem.dataIndex}>{selectItem.label}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      {wrapperElement(field.name, field.key)}
                      {updataItem.length === 1 ? <></> : <>
                        <Button icon={<PlusOutlined />} size="small" onClick={() => add()} disabled={fields.length >= updataItem.length} />
                        <Button icon={<MinusOutlined />} size="small" onClick={() => { remove(field.name); addOption(field.key); }} disabled={fields.length <= 1} />
                      </>}
                    </Space>
                  ))}
                </>
              )}
            </Form.List>
          </Form>
        </Spin>
        <Wxspglfm onRef={wxspglfmRef} />
      </Modal>
    </>
  );
}
export default memo(DDBatchUpdate);
