import React from 'react';
import { Affix, theme } from 'antd';
import { useModel } from 'umi';
import CONSTANTS from '../DDAssist/constants';
import './style.less';

const { useToken } = theme;

export interface DDToolbarProps {
  affix?: any;
  children?: any;
  fullscreen?: any
}

const DDToolbar: React.FC<DDToolbarProps> = ({
  affix = {
    offsetTop: CONSTANTS.LAYOUT_HEADER_HEIGHT,
  },
  children,
  fullscreen
}) => {
  // const { fullscreen } = useModel('fullscreen');
  let { token } = useToken();

  const getToolbar = () => {
    const toolbarEle: any = <div className="dd-toolbar" style={{backgroundColor: token?.cusBgLayout || 'transparent'}}>
      {children ? <div className="toolbar-content">{children}</div> : null}
    </div>;
    let toobarWrapEle: any;
    if (affix !== false) {
      const myAffix = fullscreen ? { offsetTop: 0 } : affix;
      toobarWrapEle = <Affix {...myAffix} >
        { toolbarEle }
      </Affix>
    } else {
      toobarWrapEle = toolbarEle;
    }
    return toobarWrapEle;
  }

  return (
    <div className="dd_toolbar_wrap">
      { getToolbar() }
    </div>
  );
};
export default DDToolbar;
