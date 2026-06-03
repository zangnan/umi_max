import abgdkjFunc from '@/pages/hts/ckfp/abgdkj/f';

const eventOnChange: any = {};

// 行编辑购买方名称选中对应方法
eventOnChange.selectChangeGmfmc = (params: any) => {
return abgdkjFunc.selectChangeGmfmc(params);
}

export default eventOnChange;