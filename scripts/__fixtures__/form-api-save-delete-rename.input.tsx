/**
 * title: form-api-save-delete-rename 测试 - 验证 form_api_save/delete 重命名 + ${API_URL_BASE} 剥前缀
 */
import CONSTANTS from '@/components/DDAssist/constants';
const myConfig: any = {};

myConfig.module_key = 'FORM_API_RENAME_TEST';
myConfig.layout_type = 'tz';
myConfig.form_api_save = `${API_URL_BASE}/test/save`;
myConfig.form_api_save_upload = `${API_URL_BASE}/test/saveUpload`;
myConfig.form_api_delete = `${API_URL_BASE}/test/delete`;
