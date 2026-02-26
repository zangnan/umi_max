declare namespace API {
  type baseDBResponse = {
    code: string;
    /** 操作成功返回信息... */
    body?: DbTableResponse[];
  };

  type baseDeleteRequest = {
    /** UUID */
    uuids: string[];
  };

  type baseEditRequest = {
    /** UUID */
    uuid?: string;
    /** 申报批次 */
    sbpc?: string;
    /** 所属期 */
    ssq?: string;
    /** 编辑类型 */
    formType?: string;
  };

  type baseList2Request = {
    page?: number;
    pageSize?: number;
    config_table_default_order?: string;
  };

  type baseResponse = {
    code: string;
    msg?: string;
    body?: string;
  };

  type baseShowRequest = {
    /** UUID */
    uuid?: string;
  };

  type CodeTable = {
    code?: string;
    name?: string;
  };

  type controllerCommonCommonBaseDeleteParams = {
    /** eg:eg_mts_tsjh 模块Key  */
    moduleKey: string;
  };

  type controllerCommonCommonBaseEditParams = {
    /** eg:eg_mts_tsjh 模块Key  */
    moduleKey: string;
  };

  type controllerCommonCommonBaseListParams = {
    /** eg:eg_mts_tsjh 模块Key  */
    moduleKey: string;
  };

  type controllerCommonCommonBaseShowParams = {
    /** eg:eg_mts_tsjh 表名/后端配置的标识  */
    moduleKey: string;
  };

  type controllerSdpBaseDeleteParams = {
    /** eg:eg_m_tag 模块Key  */
    moduleKey: string;
  };

  type controllerSdpBaseEditParams = {
    /** eg:eg_m_mts_tsjh 模块Key  */
    moduleKey: string;
  };

  type controllerSdpBaseList2cParams = {
    /** eg:eg_m_customer_sql2____sql02 模块Key____SqlKey  */
    moduleKey____sqlKey: string;
  };

  type controllerSdpBaseList2Params = {
    /** eg:eg_m_tag 模块Key  */
    moduleKey: string;
  };

  type controllerSdpBaseShowParams = {
    /** eg:eg_m_mts_tsjh 模块Key  */
    moduleKey: string;
  };

  type controllerSdpPageDefParams = {
    /** eg:eg_m_tag 模块Key  */
    moduleKey: string;
  };

  type createTableRequest = {
    /** 表英文名 */
    table_name_eng?: string;
    /** 表中文名 */
    table_name_chi?: string;
    /** 表列 */
    table_cols?: DbTableStructure[];
  };

  type createTablesRequest = {
    /**  表数据 */
    tables?: DbTable[];
  };

  type createUserRequest = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
    /** 邮箱 */
    email?: string;
    /** 年龄 */
    age?: number;
  };

  type DbTable = {
    /** 表英文名 */
    table_name_eng?: string;
  };

  type DbTableResponse = {
    msgType?: string;
    msg?: string;
    table?: string;
    code?: string;
  };

  type DbTableStructure = {
    f_name?: string;
    f_type?: string;
    f_default_value?: string;
    f_comment?: string;
    f_not_null?: string;
    f_key?: string;
  };

  type dropTableRequest = {
    /** 表英文名 */
    table_name_eng?: string;
  };

  type dropTablesRequest = {
    /**  表数据 */
    tables?: DbTable[];
  };

  type getCodeListRequest = {
    dictCodeId: string;
  };

  type getCodeListResponse = {
    code?: string;
    /** 表列 */
    body?: CodeTable[];
  };

  type getTokenRequest = {
    /** 登录名 */
    username: string;
    /** 密码 */
    password: string;
  };

  type initDbDataRequest = {
    /**  表数据 */
    data?: DbTable[];
  };

  type loginRequest = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
  };

  type pageDefRequest = {};

  type queryUserRequest = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 搜索关键词 */
    keyword?: string;
  };

  type saveRoleMenuRequest = {
    /** 角色id */
    roleId: string;
    /** 菜单id */
    menuIds: string[];
  };

  type setUserRoleRequest = {
    /** 用户id */
    userIds: string;
    /** 角色id */
    roleIds: string[];
  };

  type userResponse = {
    id?: string;
    username?: string;
    email?: string;
    age?: number;
    createTime?: string;
  };
}
