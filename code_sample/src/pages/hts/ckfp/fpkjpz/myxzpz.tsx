/**
 * 发票开具配置  贸易性质管理
 */
 import React from 'react';
 import DDBunit2 from '@/components/DDBunit/DDBunit2';
 import myxzpzconfig from './myxzpzconfig';
 import func from './myxzpzFunc'
 
 const Index: React.FC<{ data: any }> = ({
   data,
 }) => {
 
   return <>
     <div key={data}>
       <DDBunit2 config={myxzpzconfig} func={func} />
     </div>
   </>;
 };
 
 export default Index;