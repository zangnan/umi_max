
import {InputNumber, Form} from 'antd';
import './style.less';
import baseValidator from '@/pages/common/field/baseValidator';

const EditableCell: any = {
};

EditableCell.editableCell = ({
  editing,
  dataIndex,
  title,
  editType,
  record,
  index,
  children,
  handleRowOnchange,
  ...restProps
}) => {

  const validator = {
    ppyzje: () =>{
      const validator = (_rule: any, values: any) => {
        if (values) {
          const ppwshje = Number(record?.ppwshje);
          if (values > ppwshje) {
            return Promise.reject(<>本次匹配金额不能<br/>大于未收汇金额！</>);
          }
          return Promise.resolve();
        }
        return Promise.resolve();
      }
      return { validator };
    },
  }
  const rules: any = [{ required: true, message: `请输入${title}!` }];
  const precision: number = 2;
  const max: any = 999999999999.99;
  const min: any = -999999999999.99;
  rules.push(baseValidator.numRange(['+']));
  rules.push(validator.ppyzje());
  const inputNode =
    <Form.Item name='ppyzje' style={{ margin: 0 }}
      rules={rules}>
        <InputNumber max={max} min={min} controls={false} precision={precision} disabled={false} onBlur={(value: any) => {
        handleRowOnchange({
          record,
          dataIndex,
          value,
          index,
          restProps
        })
      }} />
    </Form.Item>;
  return (
    <td key={dataIndex} {...restProps}>
      {editing ? inputNode : children}
    </td>
  );
};

export default EditableCell;