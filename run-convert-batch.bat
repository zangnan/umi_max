rem ============================================
rem  convert-ddbunit-config
rem ============================================

node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\dditax.ckts.from\MDT___ZXSB_SB_MDT_TSSB_GCB\auto_config.tsx --path /hts/saasMdt/mxcj/1
node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\dditax.ckts.from\MDT_TSZL___ZXSB_SB_HGSPTZ_GCB\auto_config.tsx --path /hts/saasMdt/mxcj/1
node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\dditax.ckts.from\MDT_TSZL___ZXSB_SB_CKSH_GCB\auto_config.tsx --path /hts/saasMdt/mxcj/1
node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\dditax.ckts.from\MDT___ZXSB_SB_MDT_CYSM_GCB\auto_config.tsx --path /hts/saasMdt/mxcj/1
node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\dditax.ckts.from\MDT___ZXSB_SB_MDT_STZC_GCB\auto_config.tsx --path /hts/saasMdt/mxcj/1
node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\dditax.ckts.from\MDT___ZXSB_SB_MDT_TSJH_GCB\auto_config.tsx --path /hts/saasMdt/mxcj/1
node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\dditax.ckts.from\MDT___ZXSB_SB_MDT_GJYS_GCB\auto_config.tsx --path /hts/saasMdt/mxcj/2
node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\dditax.ckts.from\MDT___ZXSB_SB_MDT_HKYS_QS_GCB\auto_config.tsx --path /hts/saasMdt/mxcj/2
node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\dditax.ckts.from\MDT___ZXSB_SB_MDT_KYHJ_GCB\auto_config.tsx --path /hts/saasMdt/mxcj/2
node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\dditax.ckts.from\MDT___ZXSB_SB_MDT_TLHY_GCB\auto_config.tsx --path /hts/saasMdt/mxcj/2
node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\dditax.ckts.from\MDT___ZXSB_SB_MDT_YFSJ_GCB\auto_config.tsx --path /hts/saasMdt/mxcj/3
node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\dditax.ckts.from\MDT___ZXSB_SB_MDT_SYYK_GCB\auto_config.tsx --path /hts/saasMdt/mxcj/3
node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\saasMdt\tuiShuiJiHua\monthDataConfig.tsx  --index monthDataTab --fun func --path /hts/saasMdt/tuiShuiJiHua
node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\saasMdt\tuiShuiJiHua\seasonDataConfig.tsx  --index seasonDataTab --fun func --path /hts/saasMdt/tuiShuiJiHua
node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\saasMdt\tuiShuiJiHua\yearDataConfig.tsx  --index yearDataTab --fun func --path /hts/saasMdt/tuiShuiJiHua

node scripts/copy-from-code-sample.js --src code_sample/src/pages/hts/dditax.ckts.from/mdts/sjsb/sjhz


pause