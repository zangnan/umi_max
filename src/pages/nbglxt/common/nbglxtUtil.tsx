import myUtil from '@/components/DDAssist/util';
import { queryList } from '@/services/hts/api';
const nbglxtUtil: any = {};

nbglxtUtil.app = {
  async init() {
    queryList({page: 1, pageSize: 9999, searchModel: []}, 'm_sys_org').then((res: any) => {
      if (res?.code === '200' && res?.body?.rows?.length > 0) {
        let rowsOrg: any = res.body.rows;
        rowsOrg.forEach((item: any) => {
          item.title = item.orgName;
          item.value = item.orgId;
          item.code = item.orgId;
          item.name = item.orgName;
        });
        myUtil.code.saveCodeToLocalTable('code_dm_org', rowsOrg);
        let orgCodeTree: any = myUtil.tree.transformArrToTree(rowsOrg, '', {
          // idName: 'orgId',
          idName: ENV_TYPE === 'node' ? 'org_id' : 'orgId',
          parentIdName: 'pid',
          childrenName: 'children',
        });
        myUtil.treeCode.saveTreeCodeToLocalTable('code_dm_org', orgCodeTree);
      }
    });
  }
};

export default nbglxtUtil;