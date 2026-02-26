import React, { useEffect, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import { automaticPageDef } from '@/services/hts/api';
import assembleConfigUtil from '@/components/DDBunit/assemble_config_util';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  const module_key = 'eg_m_front';

  useEffect(() => {
    automaticPageDef(module_key).then((response1: any) => {
			if (response1.code === '200') {
        let tmpConfig = assembleConfigUtil.module.assembleAll({
          moduleInfo: response1.body.moduleInfo,
          appTableDict: response1.body.appTableDict,
        });
				setMyConfig(tmpConfig);
			}
		});
  }, []);

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};

export default Unit2;