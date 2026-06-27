const businessValidator: any = {};

businessValidator.hcsm = () => {
  const validator = (_rule: any, value: any) => {
    if (value != undefined && value != '') {
      if (value.length > 500) {
        return Promise.reject(new Error("输入长度超出限制！"));//
      }
    }
    return Promise.resolve();
  };
  return { validator };
};

// 拟配单金额必录、格式校验
businessValidator.notNull = () => {
  const validator = (_rule: any, value: any) => {
    if (value === '' || value === undefined) {
      return Promise.reject(new Error('不可为空！'));
    }
    return Promise.resolve();
  };
  return { validator };
};

export default businessValidator;