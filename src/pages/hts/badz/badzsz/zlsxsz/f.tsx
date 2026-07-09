import React  from 'react';


const Func: any = {
  refUnit: React.createRef(),
};



// Func.tjpz = (balist: any[]) => {
//   DDAlert.open({
//     modalVisible: false,
//     title: '添加单证',
//     infoType: 'info',
//     modalType: 'form',
//     closeStatus: false,
//     isFormContent: true,
//     content:
//       <>
//         <Form.Item label="备案类型" name='balx' rules={[{ required: true, }]}>
//           <Select onChange={(e) => Func.selectChange(e)}>
//             <>
//               {
//                 balist.map((item: any,keys: any) => (
//                   <Select.Option key={item.code+keys} label={item.name} value={item.code}>{item.name}</Select.Option>
//                 ))
//               }
//             </>
//           </Select>
//         </Form.Item>
//         <Form.Item label="单证类型" name='dzlx' rules={[{ required: true, }]}>
//           <Select disabled={dzlx} />
//         </Form.Item>
//         <Form.Item label="单证名称" name='dzmc' rules={[{ required: true, }]}>
//           <Input />
//         </Form.Item>
//       </>
//     ,
//     okCallbackFn: function () {

//     },
//   });
// }

export default Func;