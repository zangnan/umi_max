import React, { useState, useEffect } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import { automaticPageDef } from '@/services/hts/api';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

	useEffect(() => {
    automaticPageDef('saas_tssb').then((response1: any) => {
			if (response1.code === '200') {
				setMyConfig(response1?.body || {});
			}
		});
  }, []);

	return <>
		<DDBunit2 config={myConfig} func={Func} />
	</>;
};

export default Unit2;