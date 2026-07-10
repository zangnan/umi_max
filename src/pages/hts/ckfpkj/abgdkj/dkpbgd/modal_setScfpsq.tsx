/**
 * 按报关单开具  立即开票
 */
import { intl } from '@/components/DDAssist/util';
import React, { useImperativeHandle, useState, useRef } from 'react';
import { Modal, Button, message, Form, Radio, Tooltip, Select, Alert, Input, Spin } from 'antd';
import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import CONSTANTS from '@/components/DDAssist/constants';
import { scfpsqd, xbgdkhxx, tjkpxx, ljkpjy, checkDlt2 } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import myUtil from '@/components/DDAssist/util';
import { history, useAccess } from 'umi';
import './style.less';
import TabSfyz from '../../../pzgl/sdppzgl/djdlpz/tab_sfyz';
import TabKprz from '../../../pzgl/sdppzgl/djdlpz/tab_kprz';

export interface DDModalGridProps {
  onRef?: any;
  data?: any;
}

const ModalScfp: React.FC<DDModalGridProps> = ({ onRef }) => {
  const [modalVisibleK, setModalVisibleK] = useState<boolean>(false);
  const [modalVisibleG, setModalVisibleG] = useState<boolean>(false);
  const [modalVisibleB, setModalVisibleB] = useState<boolean>(false);
  const [formkpsqd] = Form.useForm();
  const [formGmf] = Form.useForm();
  const [formBz] = Form.useForm();
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [creatbz, setCreatbz] = useState<any>(''); // 生成的备注
  const [fpxxData, seFpxxData] = useState<any>(''); // 生成发票提示信息
  const [scfpsqdfsDm, setScfpsqdfsDm] = useState<string>('1'); // 选择开票方式
  const [mainRef, setMainRef] = useState<any>();
  const [maskerK, setMaskerK] = useState<boolean>(false);
  const [maskerG, setMaskerG] = useState<boolean>(false);
  const [selectGmfData, setSelectGmfData] = useState<any>([]); // 选中数据的购买方信息

  const [mode, setMode] = useState<any>('1'); // 顺络 立即开票tab切换

  const [searchModel, setSearchModel] = useState<any>([]); // 传参

  const access = useAccess(); // 权限

  const refKprz: any = useRef();
  const refSmrz: any = useRef();

  // const intl = useIntl();
  // 开启
  const showModal = (param: any, param1: any, refUnit: any, param2: any) => {
    setModalVisibleK(true);
    const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
    setScfpsqdfsDm(temp[0].scfpsqdfsDm)
    setSearchModel(param2)
    // 表单赋值
    formkpsqd.setFieldsValue({ scfpspd: '1' });
    setSelectedRows(param);
    seFpxxData(param1);
    setMainRef(refUnit);
    setMode('1')
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const saveModalKpsqd = () => {
    // 多张报关单合并时校验购买方
    if ("2" === scfpsqdfsDm) {
      if (selectedRows.length === 1) {
        setMaskerK(true);
        checkSaveFpsqd();
      } else {
        const temp: any = [];
        selectedRows.forEach((row: any) => {
          if (row.khuuid && row.jwshrmc) {
            // 不存在时放入数组中
            if (temp.findIndex((item: any) => item.khuuid === row.khuuid) === -1) {
              temp.push({ khuuid: row.khuuid, jwshrmc: row.jwshrmc })
            }
          }
        });
        if (temp.length > 1) {
          setSelectGmfData(temp);
          setModalVisibleK(false);
          setModalVisibleG(true);
        } else {
          setMaskerK(true);
          checkSaveFpsqd();
        }
      }
    } else {
      setMaskerK(true);
      checkSaveFpsqd();
    }
  };

  // 保存购买方
  const saveModalGmf = () => {
    const khuuid = formGmf.getFieldValue('khuuid');
    if (khuuid) {
      const bgdhgbhs: any = [];
      selectedRows.forEach((row: any) => {
        const bgdhgbhOrTybh = row.bgdhgbh || row.bgdtybh;
        if (bgdhgbhOrTybh) {
          // 不存在时放入数组中
          if (!bgdhgbhs.includes(bgdhgbhOrTybh)) {
            bgdhgbhs.push(bgdhgbhOrTybh)
          }
        }
      });
      setMaskerG(true);
      xbgdkhxx({ bgdhgbhs, khuuid: khuuid }).then((response) => {
        const { code, desc } = response;
        if (code === '200') {
          checkSaveFpsqd();
        } else {
          setMaskerG(false);
          message.error(desc);
        }
      });
    } else {
      message.info(intl.formatMessage({ id: 'message_ckfp_abgdkj_scfpsqd_checkgmfmc' }));
    }
    onCancel();
  }

  //  获取组装的备注长度
  const bzLength = (splx: any, fplx: any) => {
    let length = 0;
    if (splx === 'JSP') {
      length = 230;
    } else {
      if (fplx === 'pp') { // 普票
        length = 138;
      } else {
        length = 130;
      }
    }
    return length;
  }

  // 拼装备注代码
  const gtJoin = (splx: string, zd: any, zdxhh: any, ywdxLength: any, zdfgf: any) => {
    let bzTemp = '';
    if (splx === 'skp') {
      if (ywdxLength > 4) {
        // 不换行
        bzTemp = zd + zdfgf;
      } else {
        // 字段项换行
        if (zdxhh === 'Y') {
          // 换行
          bzTemp = zd + zdfgf + '\n';
        } else {
          // 不换行
          bzTemp = zd + zdfgf;
        }
      }
    } else {
      if (ywdxLength > 6) {
        // 不换行
        bzTemp = zd + zdfgf;
      } else {
        // 字段项换行
        if (zdxhh === 'Y') {
          // 换行
          bzTemp = zd + zdfgf + '\n';
        } else {
          // 不换行
          bzTemp = zd + zdfgf;
        }
      }
    }
    return bzTemp;
  }

  // 立即开票前校验
  const checkSaveFpsqd = () => {
    ljkpjy({}).then(async (response) => {
      const { code, body, desc } = response;
      if (code == '200') {
        if (body.sfJydlt === 'Y') {
          await checkDlt2({}).then(async (res: any) => {
            const { code, body } = res;
            if (code == "200") {
              const dl = body?.dlbz;
              const rz = body?.rzbz;
              if (dl == 'Y' && rz == 'Y') {
                dltyz("200");
              } else if (dl != 'Y') {
                dltyz("2004");
              } else if (dl == "Y" && rz != 'Y') {
                dltyz("2005");
              }
            } else {
              message.error(res?.msg);
            }
          });
        } else if (body.sfJydlt === 'N') {
          saveFpsqd();
        }
      } else {
        message.error(desc);
      }
    });
  }

  // 登录态情况处理
  const dltyz = (code: any) => {
    if (code == '200') {
      saveFpsqd();
    } else if (code == '2004') {
      refKprz.current!.showModal();
      var timer = setInterval(async function () {
        const bool = refKprz.current!.getMoVis();
        if (!bool) {
          clearInterval(timer); // 停止定时器
          // 刷新页面
          await checkDlt2({}).then(async (res: any) => {
            const { code, body, msg } = res;
            if (code == '200') {
              const dl = body?.dlbz == 'Y' ? true : false;
              //已登錄
              if (dl && body?.rzbz == "Y") {
                dltyz("200");
              }
              if (dl && body?.rzbz == "U") {
                dltyz("2005");
              }
              if (dl && body?.rzbz == "N") {
                dltyz("2005");
              }
            } else {
              message.error(msg);
            }
          });
        }
      }, 1000);
    } else if (code == '2005') {
      refSmrz.current!.showModal();
      var timer = setInterval(async function () {
        const bool = refSmrz.current!.getMoVis();
        if (!bool) {
          clearInterval(timer); // 停止定时器
          await checkDlt2({}).then(async (res: any) => {
            const { code, body, msg } = res;
            if (code == '200') {
              const dl = body?.dlbz == 'Y' ? true : false;
              //已登錄
              if (dl && body?.rzbz != "N") {
                dltyz("200");
              }
            } else {
              message.error(msg);
            }
          });
        }
      }, 1000);
    }
  }

  // 立即开票
  const saveFpsqd = async () => {
    let bgdlx = '1';
    if (history?.location?.pathname === '/hts/ckfpkj/abgdkj21') {
      bgdlx = '2';
    }
    // 顺络
    const ckdhs: any = [];
    if (access.isNsrsbh) {
      bgdlx = '2';
      if (mode === '2') {
        selectedRows.forEach((row: any) => {
          ckdhs.push(row.ckdh);
        });
      }
    }
    const bgdhs: any = [];
    // 18位报关单取报关单号/统一编号,21位时取隐藏列 21报关单号
    if(selectedRows && selectedRows.length > 0) {
      selectedRows.forEach((row: any) => { // 18位时有报关单号取报关单号，没有取统一编号
        bgdhs.push(bgdlx === '1' ? (row.bgdhgbh || row.bgdtybh) : row.ckbgdh);
      });
    }
    const obj = {
      bgdlx,
      bgdhs,
      ckdhs, 
      key: searchModel.key,
      cxtj: searchModel.cxtj,
    }
    mainRef?.current?.setMasker(true);
    scfpsqd(obj).then((response) => {
      mainRef?.current?.setMasker(false);
      const { code, body, desc } = response;
      setMaskerK(false);
      setMaskerG(false);
      if (code == '200') {
        setModalVisibleK(false);
        setModalVisibleG(false);
        setModalVisibleB(false);
        DDAlert.open({
          title: '立即开票',
          info: '立即开票成功',
          content: [
            '单据号' + body.fpsqdsl + '张',
            '申请单金额总计' + myUtil.text.formatNum(body.fpsqdzje, '0,0.00') + '元',
          ],
        });
        mainRef.current!.reload();
      } else {
        if (body?.sjztczbz === 'Y' && code === '300') {
          setModalVisibleK(false);
          setModalVisibleG(false);
          setModalVisibleB(false);
          mainRef.current!.reload();
          message.error(intl.formatMessage({ id: 'message_ckfp_abgdkj_scfpsqd_wszssbm' }));
        } else {
          message.error(desc);
        }
      }
    });
    onCancel();
  };

  // 顺络 tab切换
  const handleModeChange = (e: any) => {
    const bgdlx = '2';
    const bgdhs: any = [];
    const ckdhs: any = [];
    if(selectedRows && selectedRows.length > 0) {
      // 18位报关单取报关单号/统一编号,21位时取隐藏列 21报关单号
      selectedRows.forEach((row: any) => {
        bgdhs.push(row.ckbgdh);
      });

      if (e.target.value === '2') {
        selectedRows.forEach((row: any) => {
          ckdhs.push(row.ckdh);
        });
      }
    }

    setMaskerK(true);
    const obj = {
      bgdlx,
      bgdhs,
      ckdhs,
      key: searchModel.key,
      cxtj: searchModel.cxtj,
    }
    tjkpxx(obj).then((response) => {
      const { code, body, desc } = response;
      setMaskerK(false);
      if (code === '200') {
        seFpxxData(body);
        setMode(e.target.value);
      } else {
        message.error(desc);
      }
    });
  };

  const onCancel = () => {
    setModalVisibleB(false);
    setModalVisibleK(false);
    setModalVisibleG(false);
    setSelectedRows([]);
    setCreatbz('');
    seFpxxData('');
    setScfpsqdfsDm('1');
    setMaskerK(false);
    setMaskerG(false);
    setSelectGmfData([]);
    setMode('1');
    setSearchModel([]);
  }

  return (
    <>
      <Modal
        title="立即开票"
        destroyOnHidden={true}
        visible={modalVisibleK}
        layoutType="vertical"
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        footer={
          <>
            <Button onClick={() => setModalVisibleK(false)}>取消</Button>
            <Button onClick={saveModalKpsqd} type="primary">确定</Button>
          </>
        }
        onCancel={() => setModalVisibleK(false)}
        className={`${maskerK ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={maskerK} delay={100}>
          {(access.isNsrsbh ?
          <Radio.Group onChange={handleModeChange} value={mode} style={{ marginBottom: 8 }}>
            <Radio.Button value="1">按报关单生成</Radio.Button>
            <Radio.Button value="2">按出库单生成</Radio.Button>
          </Radio.Group> : <></>)}
          {(mode === '1' ?
          <Form
            form={formkpsqd}
            name="scfpspd"
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 11 }}
            autoComplete="off"
            className="formClass"
          >
            <Form.Item label="开票信息" className="kpxxBox">
              <div className="kpxxContent">
                <p>报关单{fpxxData.kkpbgdzs}张</p>
                <p>货物信息{fpxxData.kkphwts}项</p>
                <p>人民币金额{myUtil.text.formatNum(fpxxData.kkprmbje, '0,0.00')}元</p>
              </div>
              <InfoCircleOutlined className="kpxxIcon" />
            </Form.Item>
            <Form.Item label="因商品不退税不可开票" className="kpxxBox">
              <div className="kpxxContent">
                <p>报关单{fpxxData.bkkpbgdzs}张</p>
                <p>货物信息{fpxxData.bkkphwts}项</p>
                <p>人民币金额{myUtil.text.formatNum(fpxxData.bkkprmbje, '0,0.00')}元</p>
              </div>
              <InfoCircleOutlined className="bkpxxIcon" />
            </Form.Item>
          </Form> : <Form
            form={formkpsqd}
            name="scfpspd"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            autoComplete="off"
            className="formClass"
          >
            <div>注意：</div>
            <div>1. 出库单对应的报关单存在部分已开具时则不再支持按照出库单开具发票；</div>
            <div>2. 按出库单生成时，18位报关单维度下对应的出库单会同时开具发票。</div><br />
            <Form.Item label="开票信息" className="kpxxBox">
              <div className="kpxxContent">
                <p>报关单{fpxxData.kkpbgdzs}张</p>
                <p>商品信息{fpxxData.kkphwts}项</p>
                <p>出库单{fpxxData.kkpckdzs}张</p>
                <p>出库明细{fpxxData.kkpckdhwts}项</p>
                <p>人民币金额{myUtil.text.formatNum(fpxxData.kkprmbje, '0,0.00')}元</p>
              </div>
              <InfoCircleOutlined className="kpxxIcon" />
            </Form.Item>
          </Form>)}
        </Spin>
      </Modal>
      <Modal
        title="设置购买方"
        destroyOnHidden={true}
        visible={modalVisibleG}
        layoutType="vertical"
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        footer={
          <>
            <Button onClick={() => onCancel()}>取消</Button>
            <Button onClick={saveModalGmf} type="primary">确定</Button>
          </>
        }
        onCancel={() => onCancel()}
        className={`${maskerG ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={maskerG} delay={100}>
          <Form
            form={formGmf}
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 14 }}
            autoComplete="off"
          >
            <Alert
              message="购买方不一致，请选择购买方信息。"
              showIcon
              type="error"
              style={{ marginBottom: '20px' }}
            />
            <Form.Item name="khuuid" label="购买方名称">
              <Select placeholder="购买方名称" allowClear>
                {selectGmfData.map((e: any) => <Select.Option key={e.khuuid} value={e.khuuid}>{e.jwshrmc}</Select.Option>)}
              </Select>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
      <Modal
        title="设置备注"
        destroyOnHidden={true}
        visible={modalVisibleB}
        layoutType="vertical"
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        footer={
          <>
            <Button onClick={() => onCancel()}>取消</Button>
            <Button onClick={checkSaveFpsqd} type="primary">确定</Button>
          </>
        }
        onCancel={() => onCancel()}
      >
        <Form
          form={formBz}
          name="basic"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 14 }}
          autoComplete="off"
        >
          <Alert
            message="备注内容超长，请修改备注信息。"
            showIcon
            type="error"
            style={{ marginBottom: '20px' }}
          />
          <Form.Item
            name="bzInfo"
            label={<Tooltip
              title={(
                <div>
                  <div>1.金税盘:备注长度230个字符，回车超过6行将自动变为一行</div>
                  <div>2.税控盘:普通发票备注长度138个字符，电子普票130个字符，回车超过4行将自动变为一行</div>
                </div>
              )}
            >备注<QuestionCircleOutlined />
            </Tooltip>}
            className="bzInfoClass"
          >
            <Input.TextArea
              autoSize={{ minRows: 5, maxRows: 7 }}
              showCount
              className="bzTextArea"
              defaultValue={creatbz}
            />
          </Form.Item>
        </Form>
      </Modal>
      <TabSfyz onRef={refKprz} getdlFlag={() => {}} />
      <TabKprz onRef={refSmrz} getdlFlag={() => {}} />
    </>
  );
};

export default ModalScfp;
