import type { SizeType } from 'antd/es/config-provider/SizeContext';

export type DDBaseGridProps = {
  config?: any;
  func?: any;
  userDataSource?: any;
  columns?: any;
  searchModel?: any;
  queryParam?: any;
  sort?: any;
  adQuery?: any;
  url?: string;
  rowKey?: any;
  showSerialNumber?: boolean;
  showTotalText?: boolean;
  bordered?: boolean;
  scroll?: any;
  summary?: any;
  size?: SizeType;
  rowSelection?: any;
  pagination?: any;
  components?: any;
  rowClassName?: any;
  expandable?: any;
  actionRef?: any;
  afterReloadGridData?: any;
  isSticky?: any;
  getAssembleSearchModel?: any;
  isInitSearch?: any;
  gridType?: any;
  gridListCardField?: any;
  gridListCardType?: any;
  gridListCardRender?: any;
  gridListCardAction?: any;
}

export type PaginationProps = {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger: boolean,
  showQuickJumper: boolean,
  hideOnSinglePage: boolean,
  pageSizeOptions: any[],
  showTotal: (total: any, range: any[]) => string;
}