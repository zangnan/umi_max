// 通用crud 列表查询
async function queryPagerStatistics(req: any, res: any) {
  const { body } = req;
  const { page } = body;
  let rows: any[] = [];
  rows = [
    { year: '2021年', quarter: '1季度', ckspmc: '商品1', cjhghbzmDm: 'CNY', ckrq1: 1579072395000, mylaj: 1000, cjzj: 1000, tse: 12900 },
    { year: '2021年', quarter: '1季度', ckspmc: '商品1', cjhghbzmDm: 'USD', ckrq1: 1579072395000, mylaj: 1900, cjzj: 2000, tse: 13900 },
    { year: '2021年', quarter: '1季度', ckspmc: '商品2', cjhghbzmDm: 'CNY', ckrq1: 1579072395000, mylaj: 4500, cjzj: 1100, tse: 14900 },
    { year: '2021年', quarter: '1季度', ckspmc: '商品2', cjhghbzmDm: 'USD', ckrq1: 1579072395000, mylaj: 4000, cjzj: 4000, tse: 15900 },

    { year: '2021年', quarter: '2季度', ckspmc: '商品1', cjhghbzmDm: 'CNY', ckrq1: 1579072395000, mylaj: 1000, cjzj: 11000, tse: 29900 },
    { year: '2021年', quarter: '2季度', ckspmc: '商品1', cjhghbzmDm: 'USD', ckrq1: 1579072395000, mylaj: 1900, cjzj: 12000, tse: 21900 },
    { year: '2021年', quarter: '2季度', ckspmc: '商品2', cjhghbzmDm: 'CNY', ckrq1: 1579072395000, mylaj: 4500, cjzj: 13000, tse: 22900 },
    { year: '2021年', quarter: '2季度', ckspmc: '商品2', cjhghbzmDm: 'USD', ckrq1: 1579072395000, mylaj: 4000, cjzj: 14000, tse: 23900 },

    { year: '2021年', quarter: '3季度', ckspmc: '商品1', cjhghbzmDm: 'CNY', ckrq1: 1579072395000, mylaj: 3300, cjzj: 21000, tse: 41900 },
    { year: '2021年', quarter: '3季度', ckspmc: '商品1', cjhghbzmDm: 'USD', ckrq1: 1579072395000, mylaj: 3400, cjzj: 24000, tse: 42900 },
    { year: '2021年', quarter: '3季度', ckspmc: '商品2', cjhghbzmDm: 'CNY', ckrq1: 1579072395000, mylaj: 5500, cjzj: 26000, tse: 43900 },
    { year: '2021年', quarter: '3季度', ckspmc: '商品2', cjhghbzmDm: 'USD', ckrq1: 1579072395000, mylaj: 6600, cjzj: 28000, tse: 44900 },

    { year: '2021年', quarter: '4季度', ckspmc: '商品1', cjhghbzmDm: 'CNY', ckrq1: 1579072395000, mylaj: 1100, cjzj: 31000, tse: 1990 },
    { year: '2021年', quarter: '4季度', ckspmc: '商品1', cjhghbzmDm: 'USD', ckrq1: 1579072395000, mylaj: 1100, cjzj: 33000, tse: 1390 },
    { year: '2021年', quarter: '4季度', ckspmc: '商品2', cjhghbzmDm: 'CNY', ckrq1: 1579072395000, mylaj: 5500, cjzj: 36000, tse: 1940 },
    { year: '2021年', quarter: '4季度', ckspmc: '商品2', cjhghbzmDm: 'USD', ckrq1: 1579072395000, mylaj: 6600, cjzj: 38000, tse: 1690 },

    { year: '2022年', quarter: '1季度', ckspmc: '商品1', cjhghbzmDm: 'CNY', ckrq1: 1579072395000, mylaj: 21000, cjzj: 51000, tse: 12900 },
    { year: '2022年', quarter: '1季度', ckspmc: '商品1', cjhghbzmDm: 'USD', ckrq1: 1579072395000, mylaj: 21900, cjzj: 52000, tse: 52900 },
    { year: '2022年', quarter: '1季度', ckspmc: '商品2', cjhghbzmDm: 'CNY', ckrq1: 1579072395000, mylaj: 24500, cjzj: 51100, tse: 32900 },
    { year: '2022年', quarter: '1季度', ckspmc: '商品2', cjhghbzmDm: 'USD', ckrq1: 1579072395000, mylaj: 24000, cjzj: 54000, tse: 42900 },

    { year: '2022年', quarter: '2季度', ckspmc: '商品1', cjhghbzmDm: 'CNY', ckrq1: 1579072395000, mylaj: 21000, cjzj: 511000, tse: 2199 },
    { year: '2022年', quarter: '2季度', ckspmc: '商品1', cjhghbzmDm: 'USD', ckrq1: 1579072395000, mylaj: 21900, cjzj: 512000, tse: 5199 },
    { year: '2022年', quarter: '2季度', ckspmc: '商品2', cjhghbzmDm: 'CNY', ckrq1: 1579072395000, mylaj: 24500, cjzj: 513000, tse: 6199 },
    { year: '2022年', quarter: '2季度', ckspmc: '商品2', cjhghbzmDm: 'USD', ckrq1: 1579072395000, mylaj: 24000, cjzj: 514000, tse: 8199 },

    { year: '2022年', quarter: '3季度', ckspmc: '商品1', cjhghbzmDm: 'CNY', ckrq1: 1579072395000, mylaj: 23300, cjzj: 521000, tse: 1199 },
    { year: '2022年', quarter: '3季度', ckspmc: '商品1', cjhghbzmDm: 'USD', ckrq1: 1579072395000, mylaj: 23400, cjzj: 524000, tse: 3199 },
    { year: '2022年', quarter: '3季度', ckspmc: '商品2', cjhghbzmDm: 'CNY', ckrq1: 1579072395000, mylaj: 25500, cjzj: 526000, tse: 5199 },
    { year: '2022年', quarter: '3季度', ckspmc: '商品2', cjhghbzmDm: 'USD', ckrq1: 1579072395000, mylaj: 26600, cjzj: 528000, tse: 6199 },

    { year: '2022年', quarter: '4季度', ckspmc: '商品1', cjhghbzmDm: 'CNY', ckrq1: 1579072395000, mylaj: 21100, cjzj: 531000, tse: 34472 },
    { year: '2022年', quarter: '4季度', ckspmc: '商品1', cjhghbzmDm: 'USD', ckrq1: 1579072395000, mylaj: 21100, cjzj: 533000, tse: 44472 },
    { year: '2022年', quarter: '4季度', ckspmc: '商品2', cjhghbzmDm: 'CNY', ckrq1: 1579072395000, mylaj: 25500, cjzj: 536000, tse: 54472 },
    { year: '2022年', quarter: '4季度', ckspmc: '商品2', cjhghbzmDm: 'USD', ckrq1: 1579072395000, mylaj: 26600, cjzj: 538000, tse: 74472 },
  ]
  let returnData: any = {
    code: '200',
    body: {
      rowCount: 28,
      rows,
      page,
    },
  };
  return res.json(returnData);
}

export default {
  'POST /dict/automatic/queryPagerStatistics': queryPagerStatistics,
};
