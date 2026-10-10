import myUtil from '@/components/DDAssist/util';
import { queryList } from '@/services/hts/api';
const nbglxtUtil: any = {};

nbglxtUtil.app = {
  async init() {
    queryList({page: 1, pageSize: 9999, searchModel: []}, 'm_sys_org').then((res: any) => {
      if (res?.code === '200' && res?.body?.rows?.length > 0) {
        let rowsOrg: any = res.body.rows;
        // 兼容 Node(eggjs) 后端的蛇形字段 org_id / org_name / parent_id
        // 与 Java 后端的驼峰 orgId / orgName / pid
        // idField / nameField 用 ternary：与现有 idName 的 ENV_TYPE 区分模式一致，确定性高
        // parentIdField 用 ?? 兜底：不确定 Node 实际是 parent_id 还是仍叫 pid，宁可保留原值不强行覆盖
        const idField = ENV_TYPE === 'node' ? 'org_id' : 'orgId';
        const nameField = ENV_TYPE === 'node' ? 'org_name' : 'orgName';
        rowsOrg.forEach((item: any) => {
          item.title = item[nameField];
          item.value = item[idField];
          item.code = item[idField];
          item.name = item[nameField];
          // pid 不强行 ternary：只在原 pid 缺失时才取 parent_id 兜底，避免把已有 pid 误覆盖为 undefined
          if (item.pid === undefined || item.pid === null) {
            item.pid = item.parent_id;
          }
        });
        myUtil.code.saveCodeToLocalTable('code_dm_org', rowsOrg);
        let orgCodeTree: any = myUtil.tree.transformArrToTree(rowsOrg, '', {
          // idName: 'orgId',
          idName: idField,
          parentIdName: 'pid',
          childrenName: 'children',
        });
        myUtil.treeCode.saveTreeCodeToLocalTable('code_dm_org', orgCodeTree);
      }
    });
  }
};

export default nbglxtUtil;