// 发票配置管理
import React, { useState, useEffect } from 'react';
import { Tabs, message } from 'antd';
import Jckppz from './jckppz';
import Gdkppz from './gdkppz';
import Xsfpz from './xsfpz';
// import Khgl from './khgl';
import Hlgl from './hlgl';
import Bzgl from './bzgl';
import Dwgl from './dwgl';
import Wxspgl from './wxspgl';
import Qtspgl from './qtspgl';
import Dyjgl from './dyjgl';
// import Myxzpz from './myxzpz';
import myUtil from '@/pages/common/myUtil';
import { useIntl } from 'umi';
import { xsfpzcx } from '@/services/hts/api';
import { history } from 'umi';
import { useAccess, Access } from 'umi';
import qxUtil from '@/pages/common/qxUtil';

const Index: React.FC = () => {
  const intl = useIntl(); // 提示信息

  const [activeKey, setActiveKey] = useState<string>('xsfpz'); // 当前活动tab

  const [jckpData, setJckpData] = useState<any>({}); //基础开配配置
  const [gdkpData, setGdkpData] = useState<any>({}); //关单开票配置
  const [xsfData, setXsfData] = useState<any>({}); // 销售方配置数据
  // const [khglData, setKhglData] = useState<any>({}); // 客户管理数据
  const [hlglData, setHlglData] = useState<any>({}); // 汇率管理
  const [wxspglData, setWxspglData] = useState<any>({}); // 外销商品管理
  const [qtspglData, setQtspglData] = useState<any>({}); // 其他商品管理
  const [bzglData, setBzglData] = useState<any>({}); // 备注管理
  const [dyjglpData, setDyjglpData] = useState<any>({}); // 打印机管理
  // const [myxzpzData, setmyxzpzData] = useState<any>({}); // 贸易性质配置管理
  const [dwglData, setDwglData] = useState<any>({}); // 备注管理

  const [fpkjfsDm, setFpkjfsDm] = useState<any>({}); //开票方式
  const [fpzlDm1, setFpzlDm1] = useState<any>({}); //开票方式
  const [dyjDisable, setDyjDisable] = useState<any>(false); // 是否显示打印机

  const access = useAccess(); // 权限

  const paramQxz = {
    qxCode: 'qd_szgps',
    accessObj: access,
  };

  const paramCkfpdz = {
    qxCode: 'qx_ckfpdz',
    accessObj: access,
  };

  const paramCkfpdz2 = {
    qxCode: 'qx_ckfpdz2',
    accessObj: access,
  };

  useEffect(() => {
    Promise.all([myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ', '01')])
      .then(() => {})
      .catch(() => {
        message.error('获取码表失败');
      })
      .finally(() => {
        const cspz = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ', '01');
        const temp = cspz[0];
        if (temp?.fpzlDm1 === '3' && temp?.fpkjfsDm === '2') {
          setDyjDisable(true);
        } else {
          setDyjDisable(false);
        }
        if (qxUtil.getQxz(paramCkfpdz) || qxUtil.getQxz(paramCkfpdz2)) {
          setActiveKey('xsfpz');
        } else {
          setActiveKey('xsfpz');
        }
      });

    const xh = history?.location?.query?.xh;
    if (xh) {
      if (xh == '1') {
        setActiveKey('xsfpz');
      } else if (xh == '2') {
        setActiveKey('xsfpz');
      } else if (xh == '3') {
        setActiveKey('gdkppz');
      } else if (xh == '4') {
        setActiveKey('dyjgl');
      }
    }
    // 获取销售单配置数据便于进行tabs切换校验
    xsfpzcx({}).then((response) => {
      const { code, body, desc } = response;
      if (code === '200') {
        let temp = { ...body };
        //存入缓存方便进行初始配置校验
        myUtil.sessionStore.setItem('xsfpzStore', temp);
      } else {
        message.error(desc);
      }
    });
  }, []);

  const tabCallback = (key: any) => {
    // 如果点击当前所在页面，不进行以下校验操作
    if (key === activeKey) {
      return;
    }
    // 基础开票配置或者关单开票配置未设置完成不能切换tab页
    Promise.all([myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ', '01')])
      .then(() => {})
      .catch(() => {
        message.error('获取码表失败');
      })
      .finally(() => {
        const cspz = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ', '01');
        const cspzXsfpz = myUtil.sessionStore.getItem('xsfpzStore');
        if (cspz && cspz[0]) {
          const temp = cspz[0];
          setFpzlDm1(temp?.fpzlDm1);
          if (temp?.fpzlDm1 === '3' && temp?.fpkjfsDm === '2') {
            setDyjDisable(true);
          } else {
            setDyjDisable(false);
          }

          // 销售方配置校验
          if (
            cspzXsfpz &&
            cspzXsfpz.dz &&
            cspzXsfpz.dhhm &&
            cspzXsfpz.kpr //&&
            // cspzXsfpz.skr &&
            // cspzXsfpz.fhr1
          ) {
            // 基础开票配置校验
            if (
              temp?.fpzlDm1 == '5' ||
              (temp?.fpsplxDm &&
                temp?.fpzlDm1 &&
                temp?.fpzgkpxeDm &&
                temp?.fpmxkjmsDm &&
                temp?.bbh &&
                temp?.fpkjfsDm)
            ) {
              //关单开票配置校验
              if (
                temp?.fpsldwxqgzDm &&
                temp?.fpjelxxqgzDm &&
                temp?.fpbtsspxqgzDm &&
                temp?.fpggxhxqgzDm &&
                temp?.fpwctzbz &&
                temp?.fphwxxxqgzDm &&
                temp?.fphlxqgzDm &&
                temp?.wckrqfphlxqgzDm &&
                temp?.pxgzDm &&
                temp?.pxfsDm &&
                temp?.scfpsqdfsDm &&
                temp?.fpcfgzDm &&
                temp?.ljkpgzDm
              ) {
                if ('jckppz' === key) {
                  // 基础开票配置
                  setJckpData(new Date());
                } else if ('gdkppz' === key) {
                  // 关单开票配置
                  setGdkpData(new Date());
                } else if ('xsfpz' === key) {
                  // 销售方配置
                  setXsfData(new Date());
                }
                // else if ('khgl' === key) {
                //   // 客户管理
                //   setKhglData(new Date());
                // }
                else if ('hlgl' === key) {
                  // 汇率管理
                  setHlglData(new Date());
                } else if ('wxspgl' === key) {
                  // 外销商品管理
                  setWxspglData(new Date());
                } else if ('qtspgl' === key) {
                  // 其他商品管理
                  setQtspglData(new Date());
                } else if ('bzgl' === key) {
                  // 备注管理
                  setBzglData(new Date());
                } else if ('dyjgl' === key) {
                  setDyjglpData(new Date());
                } else if ('dwgl' === key) {
                  setDwglData(new Date());
                }
                // else if ('myxzpz' === key) {
                //   // 贸易性质配置管理
                //   setmyxzpzData(new Date());
                // }
                setActiveKey(key);
                return;
              } else {
                if (key !== 'gdkppz') {
                  message.info(intl.formatMessage({ id: 'message_ckfp_fppz_tabs_gdkppz_check' }));
                }
                setActiveKey('gdkppz');
                return;
              }
            } else {
              message.info(intl.formatMessage({ id: 'message_ckfp_fppz_tabs_jckppz_check' }));
              setActiveKey('jckppz');
              return;
            }
          } else {
            if (key !== 'xsfpz') {
              message.info(intl.formatMessage({ id: 'message_ckfp_fppz_tabs_xsfpz_check' }));
            }
            setActiveKey('xsfpz');
            return;
          }
        } else {
          message.info(intl.formatMessage({ id: 'message_ckfp_fppz_tabs_check' }));
          setActiveKey('xsfpz');
          return;
        }
      });
  };

  const getDyj = (val: any) => {
    setDyjDisable(val);
  };

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={tabCallback}
        destroyInactiveTabPane
        className="dd_layout_tabs dd_layout_tabs_bzgl"
      >
        <Tabs.TabPane tab="销售方配置" key="xsfpz" className="xsfpz">
          <Xsfpz data={xsfData} />
        </Tabs.TabPane>
        {qxUtil.getQxz(paramCkfpdz) || qxUtil.getQxz(paramCkfpdz2) ? (
          <></>
        ) : (
          <Tabs.TabPane tab="基础开票配置" key="jckppz" className="jckppz">
            <Jckppz data={jckpData} funcRef={getDyj} />
          </Tabs.TabPane>
        )}
        {/* {qxUtil.getQxz(paramCkfpdz) || qxUtil.getQxz(paramCkfpdz2) ? (
          <></>
        ) : (
          <Tabs.TabPane tab="打印机管理" key="dyjgl" className="dyjgl">
            <Dyjgl data={dyjglpData} />
          </Tabs.TabPane>
        )} */}
        <Tabs.TabPane tab="关单开票配置" key="gdkppz" className="gdkppz">
          <Gdkppz data={gdkpData} />
        </Tabs.TabPane>
        {/* <Tabs.TabPane tab="贸易性质配置" key="myxzpz" className="myxzpz">
          <Myxzpz data={myxzpzData} />
        </Tabs.TabPane> */}
        {/* <Tabs.TabPane tab="客户管理" key="khgl" className="khgl">
          <Khgl data={khglData} />
        </Tabs.TabPane> */}
        <Tabs.TabPane tab="汇率管理" key="hlgl" className="hlgl">
          <Hlgl data={hlglData} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="外销商品管理" key="wxspgl" className="wxspgl">
          <Wxspgl data={wxspglData} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="其他商品管理" key="qtspgl" className="qtspgl">
          <Qtspgl data={qtspglData} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="备注管理" key="bzgl" className="bzgl">
          <Bzgl sx={bzglData} />
        </Tabs.TabPane>
        {qxUtil.getQxz(paramQxz) ? (
          <></>
        ) : (
          <Tabs.TabPane tab="单位管理" key="dwgl" className="dwgl">
            <Dwgl data={dwglData} funcRef="dwgl" />
          </Tabs.TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default Index;
