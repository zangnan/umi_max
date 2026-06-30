import React, {useRef,} from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './config';
import Func from './f';
import Glcd from './glcd';
import Add from './add';


const Index: React.FC = () => {

    const fdczFunc = {...Func};
    const addRef: any = useRef();
    const glcdRef: any = useRef();

    fdczFunc.getOtherRef = () => {
        const otherRef = [];
        otherRef.push(addRef);
        otherRef.push(glcdRef);
        return otherRef;
    };

    return (
        <>
            <DDBunit2 config={unitConfig} func={fdczFunc}/>
            <Add onRef={addRef}/>
            <Glcd onRef={glcdRef}/>
        </>
    );
}
export default Index;
