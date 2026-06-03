import { Space, Button,message } from 'antd';
import React, { useState, useRef } from 'react';
import { useModel } from 'umi';
import Avatar from './AvatarDropdown';
import cktsUtil from '@/pages/common/cktsUtil';
import styles from './index.less';
import './index.less';
import DDSkinSetting from '@/components/DDThemeSetting';
import { MinusOutlined, BorderOutlined, SwitcherOutlined, CloseOutlined } from '@ant-design/icons';
import CompanyModal from '@/pages/user/Login/companyModal';
import myUtil from '@/pages/common/myUtil';
import { getHsxyUrl } from '@/services/hts/api';


const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [isMaxBtn, setIsMaxBtn] = useState<any>(true);
  const [isDesktop] = useState<any>(false);
  const [isLoading, setLoading] = useState<any>(false);
  const [isHsxyLoading, setIsHsxyLoading] = useState<any>(false);
  const [isScroll, setIsScroll] = useState<any>(false);

  const refCompanyModal: any = useRef();

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const downloadGj = async () => {
    setLoading(true);
    let a=document.createElement('a') ;//创建一个a标签元素
    a.style.display='none'  ;//设置元素不可见
    a.href='https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
    document.body.appendChild(a)  ;//加入
    a.click(); //触发点击,下载
    document.body.removeChild(a) ;//释放 
    setLoading(false);
  }

  const selectCompany = () => {
    refCompanyModal.current?.showModal({});
  }

  // 获取主体内容高度并计算是否存在滚动条
  const element = document.querySelector('.ant-design-pro.ant-pro-basicLayout.screen-xxl.ant-pro-basicLayout-fix-siderbar.ant-pro-basicLayout-mix') as HTMLElement;
  const resizeObserver = new ResizeObserver(function(entries) {
    entries.forEach(function(entry) {
      if (document.documentElement.clientHeight - element.offsetHeight < 0) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    });
  });
  if (element) {
    resizeObserver.observe(element);
  }

  const openHsxy = () => {
    setIsHsxyLoading(true);
    getHsxyUrl({}).then((res: any) => {
      setIsHsxyLoading(false);
      const { code, msg, body } = res;
      if (code === '200') {
        window.open(body?.jumpUrl);
      } else {
        message.error(msg);
      }
    });
  }

  return (
    <div className={`${styles.headerRight} ${isScroll ? 'header_right_modal' : ''}`}>
        <Space className={className} size={0}>
          
          { myUtil.sessionStore.getItem('userInfo')?.xtCs?.wlhsxyBz === 'Y'?
            <Button  className={`${styles.action} header_action_btn`} loading={isHsxyLoading} onClick={() => {openHsxy()}}>慧税学苑</Button>
            : <></>
          }
          <Button  className={`${styles.action} header_action_btn`} loading={isLoading} onClick={() => downloadGj()}>工具</Button>
          { (myUtil.localStore.getItem('qxQysSaas') || []).length > 0 &&
            <Button className={`${styles.action} header_action_btn`} onClick={() => {selectCompany()}}>切换企业</Button>
          }
          <span className={`${styles.action} header_action_icon`}><DDSkinSetting /></span>
          <Avatar />
          {isDesktop && (<>
            <span className={`${styles.action} header_action_icon`} onClick={() => {}}>
              <MinusOutlined />
            </span>
            <span className={`${styles.action} header_action_icon`} onClick={() => {setIsMaxBtn(!isMaxBtn);}}>
              { isMaxBtn ? <span><BorderOutlined /></span> : <span><SwitcherOutlined /></span>}
            </span>
            <span className={`${styles.action} header_action_icon`} onClick={() => {}}>
              <CloseOutlined />
            </span>
          </>)}
        </Space>
        <CompanyModal onRef={refCompanyModal} />
      </div>
  );
};
export default GlobalHeaderRight;
