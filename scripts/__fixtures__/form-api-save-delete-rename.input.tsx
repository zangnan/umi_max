/**
 * title: form-api-save-delete-rename 测试
 *  - r16: form_api_save/delete 重命名 + ${API_URL_BASE} 剥前缀
 *  - r17: form_api_save_upload 保留 key、剥 ${API_URL_BASE} 前缀
 *  - 验证 r16/r17 互不干扰（r16 的 \b 不影响 r17；r17 的 \b 不影响 r16）
 */
import CONSTANTS from '@/components/DDAssist/constants';
const myConfig: any = {};

myConfig.module_key = 'FORM_API_RENAME_TEST';
myConfig.layout_type = 'tz';
myConfig.form_api_save = `${API_URL_BASE}/test/save`;
myConfig.form_api_save_upload = `${API_URL_BASE}/test/saveUpload`;
myConfig.form_api_delete = `${API_URL_BASE}/test/delete`;
