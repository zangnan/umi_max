// import numeral from 'numeral';
import moment from 'moment';
import { itemType } from './data.d';

const DDFormUtil: any = {};

// DDFormUtil.assembleSearchModel = (form: any) => {
//   const values = form.getFieldsValue('values')
//   const searchModel: any[] = [];
//   Object.keys(values).forEach(key => {
//     if (key && values[key]) {
//       const itemIns = form.getFieldInstance(key);
//       const dataDdType = itemIns.props['data-dd-type'];
//       let op;
//       let value: any = values[key];
//       if (dataDdType === itemType.Input) {
//         op = 'al'; // alike
//       } else if (dataDdType === itemType.Select) {
//         op = 'al';
//       } else if (dataDdType === itemType.DatePicker) {
//         // op = 'range';
//         // if (values[key] instanceof Array) {
//         //   value = [];
//         //   value.push(moment(values[key][0]).format('YYYY-MM-DD HH:mm:ss'));
//         //   value.push(moment(values[key][1]).format('YYYY-MM-DD HH:mm:ss'));
//         // }
//         // 需要根据后端需求调整
//         op = 'range';
//         if (values[key] instanceof Array) {
//           searchModel.push({
//             type: dataDdType,
//             property: key,
//             value: moment(values[key][0]).format('YYYY-MM-DD HH:mm:ss'),
//             op: 'dydy'
//           });
//           op = 'xydy';
//           value = moment(values[key][1]).format('YYYY-MM-DD HH:mm:ss');
//         }
//       }
//       searchModel.push({
//         type: dataDdType,
//         property: key,
//         value,
//         op
//       });
//     }
//   });
//   return searchModel;
// }


export default DDFormUtil;