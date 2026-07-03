/**
 * title: useintl-replace 测试
 * 覆盖 4 种场景：
 *   1. 单独 useIntl：import { useIntl } from 'umi'
 *   2. 多元素混合：useIntl 在中间
 *   3. 多元素混合：useIntl 在末尾
 *   4. useIntl 不在 umi import 中：原样保留
 */
import { intl } from '@/components/DDAssist/util';
import { history, useAccess } from 'umi';
import { ccc, ddd, aaa, bbb } from 'umi';
import { queryFoo } from '@/pages/hts/services/htsApi';

const Foo: React.FC = () => {
  const intl = useIntl();
  return <div>{intl.formatMessage({ id: 'foo' })}</div>;
};

export default Foo;
