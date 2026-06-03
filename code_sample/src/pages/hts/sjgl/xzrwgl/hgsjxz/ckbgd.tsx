import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Checkbox, Col, DatePicker, Form, Input, message, Radio, Row, Space, Spin, Tooltip, Upload} from 'antd';
import {ClockCircleOutlined, InboxOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import {bgdtzsx, importTemplate, queryKakPassword} from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import './style.less';
import moment from 'moment';
import IcList from '@/pages/hts/pzgl/icCard/common/icCardTsList';
import cardStyle from '../sjxz/cardLess2.less';
import tableStyle from "@/pages/hts/commonModule/ckhwbgd/style.less";
import importStyle from "@/pages/hts/commonModule/ckhwbgd/importStyle.less";
import DDAlert from "@/components/DDAlert";

export type ActionType = {
  reload: (resetPageIndex?: boolean) => void;
}

export interface Hgsjxzjy {
  chardIndex?: any,
  form?: any
}

const Hgsjxzjy: React.FC<Hgsjxzjy> = ({chardIndex, form}) => {
  //下载按钮是否显示
  const [masker, setMasker] = useState(false);
  const [bgdsxbz, setBgdsxbz] = useState(true);
  const [rqsxbz, setRqsxbz] = useState(false);
  const refICList: any = useRef(); // 环境检测
  const [lx, setLx] = useState('czrq');
  const [plscbgdBgdzs, setPlscbgdBgdzs] = useState(0);
  const [plscbgdDis, setPlscbgdDis] = useState(true);
  const {Dragger} = Upload;

  useEffect(() => {
    const promiseArr: any = [];
    promiseArr.push(initKakmm({}));
    promiseArr.push(initEwm());
    form.setFieldsValue({gxckfphbz: 'N'});
    form.setFieldsValue({ndsj2: ['YJGCK']});
    setMasker(true);
    Promise.all(promiseArr).then().catch(() => {
    }).finally(() => {
      setMasker(false);
    });
  }, []);


  const initEwm = () => {

    const userInfo = myUtil.sessionStore.getItem('userInfo');
    const qyuuid = userInfo?.qxQys[0].qyuuid;

    const hgkak = myUtil.sessionStore.getItem('hgkak');
    if (hgkak) {
      //比对是否为当前企业
      if (qyuuid == hgkak.qyuuid) {
        //再比对时间,30min内，设置为true
        // var dt1  =  (new Date()).valueOf();
        // var dt2  =  hgkak.date;
        // var num  = (dt1-dt2)/1000;
      } else {
        // 不相等清空标志
        myUtil.sessionStore.clear('hgkak');
      }
    }
  }
  const onchangeGxbz = (param: any) => {
    if (param.target.checked) {
      form.setFieldsValue({gxckfphbz: 'Y'});
    } else {
      form.setFieldsValue({gxckfphbz: 'N'});
    }
  }

  const initKakmm = async (params: any) => {
    const result = await queryKakPassword(params);
    const {code, body} = result;
    if (code === '200') {
      form.setFieldsValue(body);
    }
  }

  //时间选取
  const handleSelectTime = (values: any, formatString: [string, string]) => {
    if (formatString[0] === myUtil.date.getPreviousMonthDates().firstDay && formatString[1] === myUtil.date.getPreviousMonthDates().lastDay) {
      form.setFieldsValue({ndsj: '1'});
    } else if (formatString[0] === myUtil.date.getQZDateYfBeforeCurr(0).firstDay && formatString[1] === myUtil.date.getQZDateYfBeforeCurr(0).nowDay) {
      form.setFieldsValue({ndsj: '2'});
    } else if (formatString[0] === myUtil.date.getFormattedAdjustedDate(-90) && formatString[1] === myUtil.date.getQZDateYfBeforeCurr(0).nowDay) {
      form.setFieldsValue({ndsj: '3'});
    } else {
      form.setFieldsValue({ndsj: ''});
    }
    form.setFieldsValue({hgSxrq: values});
  }

  // 表单项目测试数据
  const itemList2 = [
    {value: '1', name: '上月'},
    {value: '2', name: '本月'},
    {value: '3', name: '近三月'},
  ];

  //radio change事件
  const handlerHgSxrqChange = (e: any) => {
    const value = e.target.value;
    if (value === '1') {
      form.setFieldsValue({hgSxrq: [moment(myUtil.date.getPreviousMonthDates().firstDay, 'YYYY-MM-DD'), moment(myUtil.date.getPreviousMonthDates().lastDay, 'YYYY-MM-DD')]});
    }
    if (value === '2') {
      form.setFieldsValue({hgSxrq: [moment(myUtil.date.getQZDateYfBeforeCurr(0).firstDay, 'YYYY-MM-DD'), moment(myUtil.date.getQZDateYfBeforeCurr(0).nowDay, 'YYYY-MM-DD')]});
    }
    if (value === '3') {
      form.setFieldsValue({hgSxrq: [moment(myUtil.date.getFormattedAdjustedDate(-90), 'YYYY-MM-DD'), moment(myUtil.date.getQZDateYfBeforeCurr(0).nowDay, 'YYYY-MM-DD')]});
    }
  }

  const options = [
    {label: '已结关', value: 'YJGCK'},
    {label: '未结关', value: 'WJGCK'},
  ];


  const saveHjjc = (flag: any) => {
    refICList.current!.closeModal();
  }

  const onChangeRadio = (param: any) => {
    const lx = param?.target?.value;
    if (lx == 'czrq') {
      setRqsxbz(false);
      setBgdsxbz(true);
      setPlscbgdDis(true);
      form.setFieldsValue({bah: '', ndsj: '2', hgSxrq: [moment().startOf('month'), moment()]});
    } else if (lx == 'plscbgdhgbh') {
      setRqsxbz(true);
      setBgdsxbz(true);
      setPlscbgdDis(false);
      form.setFieldsValue({bah: '', ndsj: "9", hgSxrq: [],});
    } else {
      setRqsxbz(true);
      setBgdsxbz(false);
      setPlscbgdDis(true);
      form.setFieldsValue({bah: '', ndsj: "0", hgSxrq: [],});
    }
    setLx(lx);
  }

  // 下载excel模板
  const downloadExcel = (param: string) => {
    importTemplate({sfBhsj: "N", sfScsm: "N", key: param}).then((response) => {
      if (response.code === '200') {
        const {blob, fileName} = response.body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(response.desc);
      }
    })
  }

  const importTzsx = () => {
    const beforeUpload = (file: any) => {
      const isLt2M = file.size;
      if (isLt2M > 10485760) {
        message.info('上传文件不能超过10M。');
        return Upload.LIST_IGNORE;
      }
      if (!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
        message.info('请上传Excel文件。');
        return Upload.LIST_IGNORE;
      }
      return false;
    }
    DDAlert.open({
      title: '批量上传',
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      button: [
        <Button key={'excelmbxz'} onClick={() => downloadExcel('SJGL_HGSJXZ_BADZXZ_PLDRBGD_PRINT_REPORT')}>Excel模板下载</Button>,
      ],
      width: 720,
      content: <>
        <Form.Item labelCol={{span: 24}} wrapperCol={{span: 24}} label="导入Excel文件" name="file" valuePropName="fileList" rules={[{required: true, message: '请选择上传的文件'}]}
                   getValueFromEvent={(e: any) => {
                     if (Array.isArray(e)) {
                       return e;
                     }
                     return e && e.fileList;
                   }}>
          <Dragger
            maxCount={1}
            showUploadList={true}
            beforeUpload={beforeUpload}
            itemRender={(originNode, file, currFileList, actions: { download: any, preview: any, remove: any }) => (
              <table className={importStyle.importTable}>
                <tr>
                  <th>文件名</th>
                  <th>文件大小</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
                <tr>
                  <td width='45%' className={importStyle.textCenter}>
                    <Tooltip title={file.name}>
                      <div className={importStyle.textName}>{file.name}</div>
                    </Tooltip>
                  </td>
                  <td width="20%" className={importStyle.textCenter}>{myUtil.text.formatNum(file.size ? (file.size / 1024) : 0, '0,0')}KB</td>
                  <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined/>&nbsp;待上传</td>
                  <td width="17%" className={importStyle.textCenter}><a onClick={() => actions.remove()}>删除</a></td>
                </tr>
              </table>
            )}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined/>
            </p>
            <p className="ant-upload-text">点击或将文件拖拽到此区域</p>
          </Dragger>

        </Form.Item>
        <div style={{color: "#E51C23"}}>
          <p>导入说明：</p>
          <div style={{marginLeft: '7px'}}>1. 请上传报关单台账Excel，文件中“报关单号”应为18位；</div>
          <div style={{marginLeft: '7px'}}>2. 若多次上传，只保留最后一次上传的结果。</div>
        </div>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          if (values.file[0].originFileObj) {
            thisObj.setState({masker: true});
            const formData = new FormData();
            formData.append('file', values.file[0].originFileObj);
            formData.append('fileName', values.file[0].name);
            formData.append('cdDm', '020201_CKHWBGDXZ');
            formData.append('is18', 'Y');
            formData.append('bjysfcz', 'Y');
            // @ts-ignore
            formData.append('szscts', 5000);
            bgdtzsx(formData).then((response: any) => {
              const {code, msg, body} = response;
              if (code === '200') {
                // 台账数据筛选 赋值
                setPlscbgdBgdzs(body?.cgzs);
                if (body?.sbzs != 0) {
                  // 业务校验
                  const sbyyList = body?.sbmx || [];
                  const textAreaValues: any = []
                  if (sbyyList.length > 0) {
                    sbyyList.forEach((item: any, index: any) => {
                      textAreaValues.push(
                        <tr>
                          <td width='10%' style={{textAlign: 'center'}}>{index + 1}</td>
                          <td width='30%'>{item.bgdhgbh}</td>
                          <td width='60%'>
                            <Tooltip title={item.sbyy}>
                              <div className={tableStyle.errorTableText}>{item.sbyy}</div>
                            </Tooltip>
                          </td>
                        </tr>
                      )
                    })
                    DDAlert.open({
                      title: '批量上传',
                      modalType: 'form',
                      width: 720,
                      closeStatus: false,
                      isFormContent: true,
                      content:
                        <>
                          <div style={{marginTop: '10px'}}>本次导入台账中共{body?.drzs}张报关单，导入成功{body?.cgzs}张，导入失败{body?.sbzs}张。</div>
                          <table className={tableStyle.errorTable}>
                            <tr style={{backgroundColor: '#FAFAFA'}}>
                              <th>序号</th>
                              <th>失败报关单号</th>
                              <th>失败原因</th>
                            </tr>
                            {textAreaValues}
                          </table>
                        </>,
                      okCallbackFn: function () {
                        DDAlert.close();
                      },
                    });
                  }
                } else {
                  message.success(`本次导入台账中共${body?.drzs}张报关单，导入成功${body?.cgzs}张！`);
                  DDAlert.close();
                }
              } else {
                message.error(msg);
              }
            }).catch(() => {
              message.error('导入失败，请重新上传文件。');
            }).finally(() => {
              thisObj.setState({masker: false});
            });
          } else {
            message.info('文件传输失败，请重试！')
          }
        });
      },
    });
  }

  return (
    <Spin tip="客户端工具检查中，请稍候..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_hgsjxzjy">
        <ProCard style={{height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', 'footerBtn', '290px']), overflowY: 'auto'}}>
          <Form
            form={form}
            name="form"
            className={cardStyle.cardForm}
          >
            <Row gutter={[20, 20]}>
              <Col className='gutter-row' span={8}>
                <Card
                  style={{height: 300}}
                  id='a2'
                  className={cardStyle.cardBox2}
                  title=""
                >
                  <Form.Item className={cardStyle.cardFormBox} name='xzld' initialValue={"czrq"}>
                    <Radio.Group style={{marginTop: '5px'}} onChange={onChangeRadio}>
                      <Space direction="vertical">
                        <Radio key="czrq" value="czrq">
                          按最近操作日期下载
                          <Tooltip title="按照单一窗口的最近操作日期下载">
                            <span><QuestionCircleOutlined/></span>
                          </Tooltip>：<br/><br/><br/><br/><br/><br/>
                        </Radio>
                        <Radio key="bgdhgbh" value="bgdhgbh">
                          按报关单号下载：<br/>
                        </Radio>
                        <br/><br/>
                        <Radio key="plscbgdhgbh" value="plscbgdhgbh">
                          按报关单号批量下载：<span>已上传{plscbgdBgdzs}张</span><br/><br/>
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                  <div style={{width: "100%", marginLeft: "190px", marginTop: "-257px"}}>
                    <Form.Item className={cardStyle.cardFormBox} name='hgSxrq' key="4" rules={[
                      () => ({
                        validator(_, value) {
                          if (value.length === 2) {
                            // 检查是否跨年（开始年份不等于结束年份）
                            if (value[0].year() !== value[1].year()) {
                              return Promise.reject(new Error('不允许跨年选择'));
                            }
                            if (value[0].diff(moment('2014-01-01', 'YYYY-MM-DD'), 'days') < 0) {
                              return Promise.reject(new Error('数据下载时间范围开始时间不能小于2014-01-01'));
                            }
                            return Promise.resolve();
                          }
                          return Promise.resolve();
                        },
                      })
                    ]} initialValue={[moment().startOf('month'), moment()]}>
                      <DatePicker.RangePicker style={{width: 260}}
                                              onChange={handleSelectTime}
                                              allowClear={false}
                                              format={myUtil.date.formatList()}
                                              disabled={rqsxbz}
                      />
                    </Form.Item>
                  </div>
                  <div style={{marginLeft: "190px"}}>
                    <Form.Item className={cardStyle.cardFormBox} name='ndsj' initialValue={'2'}>
                      <Radio.Group onChange={handlerHgSxrqChange} disabled={rqsxbz}>
                        {itemList2.map((item) => (
                          <Radio key={item.value} value={item.value}>{item.name}</Radio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item className={cardStyle.cardFormBox} name='ndsj2' initialValue={['YJGCK']}
                               rules={[
                                 () => ({
                                   validator(_, value) {
                                     if (value.length === 0) {
                                       return Promise.reject(new Error('请勾选数据类型。'));
                                     }
                                     return Promise.resolve();
                                   },
                                 })
                               ]}
                    >
                      <Checkbox.Group options={options} disabled={rqsxbz}/>
                    </Form.Item>
                  </div>
                  <div style={{marginLeft: "190px", width: "100%"}}>
                    <Form.Item className={cardStyle.cardFormBox} name="bah"
                       rules={[() => ({
                        validator(_, value) {
                          if (value) {
                            if (value.length >= 9) {
                              const ss = value.substr(8, 1);
                              if (ss != '0' && ss != '1') {
                                return Promise.reject(new Error('报关单号不符合规则，请重新输入。'));
                              }
                            }
                            if (value.length != 18) {
                              return Promise.reject(new Error('报关单号必须为18位。'));
                            }
                            form.setFieldsValue({bah: value.toUpperCase()});
                          } else {
                            if (!bgdsxbz) {
                              return Promise.reject(new Error('报关单号为必填项不能为空。'));
                            }
                          }
                          return Promise.resolve();
                        },
                      })
                    ]}>
                      <Input placeholder="请输入18位报关单号" style={{width: 260}} disabled={bgdsxbz}/>
                    </Form.Item>
                  </div>

                  <div style={{marginLeft: "280px", width: "100%", marginTop: "21px"}}>
                    <Form.Item name="plscbgdBgdzs" rules={[
                      () => ({
                        validator(_, value) {
                          if (plscbgdBgdzs == 0 && lx == 'plscbgdhgbh') {
                            return Promise.reject(new Error('请上传报关单。'));
                          }
                          form.setFieldsValue({plscbgdBgdzs: plscbgdBgdzs});
                          return Promise.resolve();
                        },
                      })
                    ]}>
                      <Button disabled={plscbgdDis} key={'excelmbxz'} onClick={() => importTzsx()}>批量上传</Button>
                    </Form.Item>
                  </div>
                </Card>
              </Col>
              <Col className='gutter-row' span={8}>
                <Card
                  style={{height: 300}}
                  id='a3'
                  className={cardStyle.cardBox2}
                  title={<></>}
                >
                  <Form.Item name='gxckfphbz'>
                    <Checkbox onChange={onchangeGxbz}> 将出口合同号更新为出口发票号 </Checkbox>
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </Form>

        </ProCard>

      </ProCard>
      <IcList onRef={refICList} saveBtn={saveHjjc}/>
    </Spin>
  );
};

export default Hgsjxzjy;
