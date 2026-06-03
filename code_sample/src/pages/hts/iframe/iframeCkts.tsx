/**
 * title: 出口退税iframe
 * author: wx
 */
import React, { useState, useEffect } from 'react';
import { history } from 'umi';

const iframeCkts: React.FC<unknown> = () => {

  const [src, setSrc] = useState<any>('');

  useEffect(() => {
    const apiUrl = API_URL_BASE.replace(/\/v1/g, '')
    const clientId = 'dditSaas';
    const jumpUrl = history?.location?.pathname?.match(/%(\S*)/)[0];
    const jcfs = 'menu_wb';
    const dditSaasJcToken = localStorage.getItem('dditSaasJcToken');
    const srcHtml = `${apiUrl}/ddit_saas_redirect_token.html#/clientId=${clientId}/jumpUrl=${jumpUrl}/jcfs=${jcfs}/key=${dditSaasJcToken}`
    setSrc(srcHtml);
  }, []);

  return <>
    <iframe src={src} width="100%" height="100%" frameBorder="no"></iframe>
  </>;
};

export default iframeCkts;