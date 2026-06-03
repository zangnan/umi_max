import type { SizeType } from 'antd/es/config-provider/SizeContext';

export type DDBaseGridProps = {
  setHeaderFilter?: any;
  headerFilter?: any;
  userDataSource?: any;
  columns: any;
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
  pagination2?:any;
  pageSizeOptions?:any;
  components?: any;
  rowClassName?: any;
  expandable?: any;
  actionRef?: any;
  afterReloadGridData?: any;
  isSticky?: any;
  getAssembleSearchModel?: any;
  afterOnChange?: any
  isInitSearch?: any;
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

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

export type EditableCellProps = {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  editType: string;
  func: any;
  codeTable: any;
  showSearch: boolean;
  reload: any;
  unitRef,
  handleSave: (record: Item) => void;
  onClick: (event: any) => void;
}

export type EditableRowProps = {
  index: number;
}