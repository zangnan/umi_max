import React, { useContext, useState, useEffect, useRef } from 'react';
import DDBunit2A from '@/components/DDBunit/DDBunit2A';
import unitConfig from './auto_config';
import Func from './f';

const Unit2: React.FC<unknown> = () => {
const myConfig = { ...unitConfig };

return <>
	<DDBunit2A config={myConfig} func={Func} />
</>;
};

export default Unit2;

