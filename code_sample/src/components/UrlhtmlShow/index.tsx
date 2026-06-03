import React from 'react';
import myUtil from '@/pages/common/myUtil';

export interface UrlhtmlShowProps {
  url: any;
}

const UrlhtmlShow: React.FC<UrlhtmlShowProps> = ({
  children,
  url,
}) => {

  const getUrl = () => {
    if(Array.isArray(url)){
      const isUrl = url.findIndex((item: any) => myUtil.menu.getMenuObjByPath(item));
      if(isUrl > -1){
        return children
      }
    } else {
      if(myUtil.menu.getMenuObjByPath(url)) {
        return children
      }
    }
    return <></>
  }

  return (
    <>
      { getUrl() }
    </>
  );
};
export default UrlhtmlShow;
