/**
 * 参照文件模板 - 模拟源 auto_config.tsx 同目录的 index.tsx
 * 含 3 个字段：form_api_save（应重命名 + 剥前缀）、form_api_save_upload（保持原样）、
 *              form_api_delete（应重命名 + 剥前缀）
 * 预期：
 *   - form_api_save  → api_form_edit, 值从 ${API_URL_BASE}/test/save → /test/save
 *   - form_api_save_upload → 完全保持原样
 *   - form_api_delete → api_form_delete, 值从 ${API_URL_BASE}/test/delete → /test/delete
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './form-api-save-delete-rename';

const Index: React.FC<unknown> = () => {
  const myConfig = { ...unitConfig };
  myConfig.api_form_edit = `/ref/save`;
  myConfig.form_api_save_upload = `/ref/saveUpload`;
  myConfig.api_form_delete = `/ref/delete`;

  myConfig.grid_columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  return <>
    <DDBunit2 config={myConfig} />
  </>;
};
export default Index;
