export enum itemType {
  'Hidden',
  'Input',
  'Password',
  'InputNumber',
  'Select',
  'DatePicker',
  'TimePicker',
  'Radio',
  'Checkbox',
  'AutoComplete',
  'ComplexPicker',
  'Cascader',
  'GroupTitle',
  'GroupTitle2',
  'GroupTitle3',
  'Avatar',
  'Upload',
  'TextArea',
  'TreeSelect',
  'InputTags',
  'Blank',
  'List',
  'Intro',
  'Switch',
};

export type BaseFormProps = {
  items: ItemProps[];
  onSubmit?: any;
  layoutType?: string;  // 可选值：vertical
  layout?: object;
  form?: any;
  initialValues?: object;
  name?: any;
  otherParam?: any;
};

export type ItemProps = {
  name: string;
  type: itemType;
  label?: string;
  tooltip?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  layout?: any;
  validator?: any[];
  min?: number;
  max?: number;
  picker?: any;
  range?: boolean;
  list?: any[];
  mode?: any;
  optionLabelProp?: any;
  hidden?: boolean;
  onChange?: any;
  'data-dd-type'?: any;
  imageUrl?: any;
  showTime?: any;
  format?: any;
  onInput?: any;
  onBlur?: any;
  onFocus?: any;
  showSearch?: any;
  defaultValue?: any;
  allowClear?: boolean;
  enterFocus?: boolean;
  labelInValue?: any;
  maxlength?: number;
  autoSize?: any;
  children?: any;
};

export type ItemsProps = {
  items: ItemProps[];
  layout?: any;
  formType?: string;
  format?: any;
  showTime?: any;
  useform?: any;
  form?: any;
  // ddItemRef?: any;
  otherParam?: any;
  searchAct?: any;
};

export type FilterProps = {
  items: ItemProps[];
  onSubmit?: any;
  onReset?: any;
  validate?: any;
  layout?: any;
  form?: any;
  filterValidate?: any
}