/**
 * title: useintl-replace 去重测试
 * 场景：文件已含 import { intl } from '@/components/DDAssist/util'
 * 期望：useIntl 移除后不重复注入 intl
 */
import { intl } from '@/components/DDAssist/util';
import { useIntl, history } from 'umi';

const Bar: React.FC = () => {
  const intlLocal = useIntl();
  return <div>{intlLocal.formatMessage({ id: 'bar' })}</div>;
};

export default Bar;
