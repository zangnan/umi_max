import React from 'react';
import { Affix, } from 'antd';
import { useModel } from 'umi';
import './style.less';

export interface DDToolbarProps {
  affix?: any;
}

const DDToolbar: React.FC<DDToolbarProps> = ({
  affix = {
    offsetTop: 44
  },
  children
}) => {
  const { fullscreen } = useModel('fullscreen');

  const getToolbar = () => {
    const toolbarEle: any = <div className="dd-toolbar">
      {children ? <div className="toolbar-content">{children}</div> : null}
    </div>;
    let toobarWrapEle: any;
    if (affix !== false) {
      if (fullscreen) {
        affix = {
          offsetTop: 0,
        }
      }
      toobarWrapEle = <Affix {...affix} >
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
