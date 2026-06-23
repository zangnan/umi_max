
// import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import cktsUtil from '@/pages/hts/cktsUtil';

export default (initialState: any) => {
  const { currentUser } = initialState || {};
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  const canSeeAdmin = !!(
    initialState && initialState.name !== 'dontHaveAccess'
  );
  const hasResourceAuthority = (resourceCode: any) => {
    return myUtil.authority.hasAuthorityResource({ resourceCode, currentUser });
  };
  return {
    canSeeAdmin,
    hasResourceAuthority,
    ...cktsUtil.getAccess()
  };
};
