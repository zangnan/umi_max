import React, { useState, useEffect } from 'react';
import { Button, Form, Space, Input, message, Checkbox, Tooltip, Spin, Popover, Image } from 'antd';
import ProCard from '@ant-design/pro-card';
import DDAlert from '@/pages/hts/components/DDAlert';
import { history } from 'umi';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { queryKakPassword, saveKakPassword, getOneTimeToken, downloadGet, queryEwmtp, khdHjjc, sjxzjy, xzrw } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import khdgjUtil from '@/pages/hts/ckfp/khdgjUtil';
import cktsUtil from '@/pages/hts/cktsUtil';
import './style.less';
import { useIntl } from 'umi';

export type ActionType = {
  reload: (resetPageIndex?: boolean) => void;
}

const Hgdzxzjy: React.FC<unknown> = () => {
  const [form] = Form.useForm();
  //下载按钮是否显示
  const [masker, setMasker] = useState(false);
  const intl = useIntl();
  const [imgSrc, setImgSrc] = useState<any>('error');
  const [txtil, setTxtil] = useState<any>(<span>系统异常</span>);

  // 单证下载
  const downloadSj = () => {
    form.validateFields().then(values => {
      setMasker(true);
      sjxzjy({ ssqpc: values.ssqpc }).then((resSsq: any) => {
        if (resSsq.code === '200') {
          // 保存口岸卡密码
          saveKakPassword({ kakmm: values.kakmm, uuid: values.uuid }).then(async (res) => {
            const { body, code } = res;
            setMasker(false);
            if (code === '200') {
              setMasker(true);
              const { jcbz, msg } = await khdgjUtil.khdgjJc({ icCardPsw: body.kakmm, yhjq: body.yhjq });
              setMasker(false);
              if (jcbz == 'Y') {
                setMasker(true);
                const promiseArr = [];
                const param = {
                  icCardPsw: values.kakmm,
                  csz1: values.ssqpc,
                  csz2: values.djlxdm?.join(","),
                  sftstxbz: values.sftstx ? 'Y' : 'N',
                  sjgjsjDm: '040000',
                  czfDm: '04',
                }
                promiseArr.push(hgzxrw(param));
                Promise.all(promiseArr).then((res) => {
                  setMasker(false);
                  if (res.length > 0 && !myUtil.array.isContiner(res, 'N')) {
                    DDAlert.open({
                      title: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_title' }),
                      info: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_info' }),
                      infoType: 'success',
                      content: [
                        intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_content' }),
                      ],
                      okText: '转进度查询',
                      okCallbackFn: function () {
                        history.push('/hts/badz/sjxzgl/jdcx');
                      }
                    });
                  } else {
                    message.error({
                      content: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_error' }),
                    });
                  }
                }).catch(() => {
                  message.error({
                    content: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_error' }),
                  });
                }).finally(() => {
                  if (masker) {
                    setMasker(false);
                  }
                });
              } else {
                message.info(msg);
                setMasker(false);
              }
            } else if (code === '900') {
              message.info(res.msg);
            } else {
              message.error(res.msg);
            }
          })
        } else {
          message.error({
            content: resSsq.desc,
          });
          setMasker(false);
        }
      }).finally(() => {
        if (masker) {
          setMasker(false);
        }
      });
    });
  }

  const hgzxrw = async (params: any) => {
    const result = await xzrw(params);
    if (result.code === '200') {
      // 调用客户端工具任务下载接口
      return khdgjUtil.khdgjGdxz(result.body);
    } else {
      return 'N';
    }
  }

  // 驱动下载
  const downloadQd = () => {
    // 直接下载工具
    setMasker(true)
    let a=document.createElement('a') ;//创建一个a标签元素
    a.style.display='none'  ;//设置元素不可见
    a.href='https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
    document.body.appendChild(a)  ;//加入
    a.click(); //触发点击,下载
    document.body.removeChild(a) ;//释放 
    setMasker(false)
  }


  // 文件下载
// 原在线申报系统模块 导出
const downloadFileCkts = async (url: any, params: any) => {
  setMasker(true);
  // 获取一次性token
  await getOneTimeToken({}).then(async (response1) => {
    if (response1.code === '200') {
      return await downloadGet(params, url, response1.body);
    }
    message.error(response1.desc);
    throw new Error(response1.desc);
  }).then((response2) => {
    const aLink = document.createElement('a');
    document.body.appendChild(aLink);
    aLink.style.display='none';
    const objectUrl = window.URL.createObjectURL(response2.data);
    aLink.href = objectUrl;
    const { headers } = response2.response;
    const contentDisposition = headers.get('Content-Disposition');
    let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'downloadFile';
		fileName = decodeURI(fileName);
    aLink.download = fileName;
    aLink.click();
    document.body.removeChild(aLink);
  })
  setMasker(false);
}
  // 口岸密码
  const initKakmm = async (params: any) => {
    const result = await queryKakPassword(params);
    const { code, body } = result;
    if (code === '200') {
      form.setFieldsValue(body);
    }
  }

  // 查询二维码
  const initEwm = async (params: any) => {
    const result = await queryEwmtp(params);
    const { code, body } = result;
    if (code === '200') {
      setImgSrc(body);
      setTxtil(<span>温馨提示：单证下载成功后将通过<br key={'1'} />“慧税云服务”微信公众号向您推送提醒</span>);
    } else if (code === '450') {
      setTxtil(<span>当前用户已绑定成功，无需再次绑定</span>);
    } else if (code === '460') {
      setTxtil(<span>云端未查询到企业注册信息，无法绑定</span>);
    }
  }

  // 表单布局
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  // 表单布局
  const tailLayout = {
    wrapperCol: { offset: 5, span: 19 },
  };

  // 表单初始值
  const getInitialValues = () => {
    return {
      djlxdm: ['01', '02'],
      sftstx: false,
    };
  }

  useEffect(() => {
    const promiseArr: any = [];
    promiseArr.push(initKakmm({}));
    // promiseArr.push(initEwm({}));
    setMasker(true);
    Promise.all(promiseArr).then().catch(() => {
    }).finally(() => {
      setMasker(false);
    });
  }, []);

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_hgdzxzjy" >
        <ProCard style={{ height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', 'footerBtn']), overflowY: 'auto' }}>
          <Form {...layout} form={form} initialValues={getInitialValues()}>
            <Form.Item className="form-item" name="yhjq" style={{ display: 'none' }}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name="uuid" style={{ display: 'none' }}>
              <Input type="hidden" />
            </Form.Item>
            <div className='groupTit'>基础信息</div>
            <Form.Item label="口岸卡密码">
              <Space>
                <Form.Item name="kakmm" noStyle rules={[{ required: true, message: '请录入口岸卡密码！' }]} >
                  <Input.Password placeholder="口岸卡密码" style={{ width: 285 }} maxLength={8} />
                </Form.Item>
                <Tooltip title="电子口岸卡密码">
                  <QuestionCircleOutlined />
                </Tooltip>
                <Button onClick={() => downloadQd()} type='link' style={{ marginLeft: 8 }}>驱动下载</Button>
              </Space>
            </Form.Item>
            <div className='groupTit'>单据下载</div>
            {cktsUtil.sys.enterpriseType() === "SC" ?
              <Form.Item name="ssqpc" rules={[{ required: true, message: '请输入所属期' },
              () => ({
                validator(_, value) {
                  if (value) {
                    const temp1 = (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)); // YYYYMM
                    if (temp1) {
                      return Promise.reject(new Error('请输入正确的所属期格式'));
                    }
                    return Promise.resolve();
                  }
                  return Promise.resolve();
                },
              })
              ]} {...tailLayout}>
                <Input placeholder="请输入6位所属期" style={{ width: 260 }}></Input>
              </Form.Item>
              :
              <Form.Item name="ssqpc" rules={[{ required: true, message: '请输入所属期或所属期批次' },
              () => ({
                validator(_, value) {
                  if (value) {
                    const temp1 = (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)); // YYYYMM
                    const temp2 = (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])\d{3}$/)); // YYYYMM001
                    if (value.length <= 6) {
                      if (temp1) {
                        return Promise.reject(new Error('请输入正确的所属期格式'));
                      } else {
                        return Promise.resolve();
                      }
                    } else {
                      if (temp2) {
                        return Promise.reject(new Error('请输入正确的所属期批次格式'));
                      } else {
                        return Promise.resolve();
                      }
                    }
                  }
                  return Promise.resolve();
                },
              })
              ]} {...tailLayout}>
                <Input placeholder="请输入6位所属期或9位所属期批次" style={{ width: 260 }}></Input>
              </Form.Item>
            }
            <Form.Item name='djlxdm' valuePropName="checked" {...tailLayout}
              rules={[
                () => ({
                  validator(_, value) {
                    if (value && value.length <= 0) {
                      return Promise.reject(new Error('随附单据和无纸化放行通知书至少选中一项！'));
                    }
                    return Promise.resolve();
                  },
                })
              ]}
            >
              <Checkbox.Group defaultValue={['01', '02']} disabled>
                <Checkbox key={'sfdj'} value="01">随附单据</Checkbox>
                <Checkbox key={'wzhfxtzs'} value="02">无纸化放行通知书</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </ProCard>
        <ProCard className="ddlf01_footer">
          <Space>
            <Button type='primary' onClick={() => { downloadSj() }}>单证下载</Button>
          </Space>
        </ProCard>
      </ProCard>
    </Spin>
  );
};

export default Hgdzxzjy;
