import Spreadsheet from 'react-spreadsheet';
import { useState } from 'react';
const Index = () => {
  const columnLabels = ['模块key', '主表字段', '字段中文名', '数据字典名', '关联表字段', '数据类型', '键', '默认值', '非空'];
  const data = [
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
    [{ value: '-' }, { value: '-' }, { value: '原销售单据号' }, { value: '-' }, { value: '-' }, { value: 'varchar(50)' }, { value: '/' }, { value: '/' }, { value: '/' }],
  ];
  
  const [dataItem, setDataItem] = useState(data);

  const onChange = (data: any) => {
    console.log('onChange', data);
  }
  return (
    <>
      <Spreadsheet
        data={dataItem}
        columnLabels={columnLabels}
        onChange={onChange}
      />
    </>
  );
};
 
export default Index;